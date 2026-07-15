import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { LEVEL_SPECS, normalizeLevel, feedbackLocale, parseJsonLoose } from '@/lib/learn-german/assignmentAI'

export const runtime = 'nodejs'
export const maxDuration = 45

// Service-role client: reads the private answer_key and writes the graded
// submission (RLS blocks students from writing the table directly).
const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

function countWords(s: string): number {
  return (s.trim().match(/\S+/g) ?? []).length
}

function buildSchreibenPrompt(level: string, localeName: string, uiLocale: string, task: string, text: string): string {
  const spec = LEVEL_SPECS[normalizeLevel(level)]
  return `OUTPUT LANGUAGE FOR FEEDBACK: ${localeName} (${uiLocale}). Every "explanation" and the "tip" MUST be in ${localeName}, never German. The "corrected" field MUST be in German. Do not mix languages within a field.

You are a German teacher grading a ${spec.level} learner's writing assignment.

LEVEL RULES:
${spec.rubric}
Target word count: ${spec.minWords}–${spec.maxWords} words.

THE TASK (as the student saw it):
${task}

THE STUDENT'S SUBMISSION:
"""
${text}
"""

YOUR JOB:
1. Identify real mistakes only (grammar, spelling, syntax, word choice, gender, case, punctuation). Do not nitpick style.
2. For each mistake, give the EXACT substring from the input as "original" (character-for-character, preserve umlauts/ß). Cap at 8.
3. Write each "explanation" in ${localeName}, max 18 words.
4. "corrected": the student's text rewritten in correct German at their level. Keep their meaning.
5. "tip": one actionable sentence in ${localeName}, max 25 words.
6. "score": 0–100 reflecting correctness AND task fulfilment (topic + word count + level).

Return ONLY JSON (no fences):
{
  "score": <int 0-100>,
  "corrected": "<German>",
  "mistakes": [ { "original": "<substring>", "correction": "<fix>", "explanation": "<in ${localeName}>", "type": "grammar|spelling|syntax|word_choice|punctuation|other" } ],
  "tip": "<in ${localeName}>"
}`
}

export async function POST(req: NextRequest) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()

    const body = await req.json().catch(() => ({}))
    const assignmentId = String(body.assignmentId || '')
    if (!assignmentId) return NextResponse.json({ error: 'Missing assignment.' }, { status: 400 })

    const { data: a } = await sbAdmin
      .from('assignments')
      .select('id, skill, level_id, instructions, content, answer_key, is_published')
      .eq('id', assignmentId)
      .maybeSingle()
    if (!a || !a.is_published) return NextResponse.json({ error: 'Assignment not found.' }, { status: 404 })

    // MCQ skills are graded for everyone (an answer-key comparison costs
    // nothing) — the result just isn't persisted without an account.
    // Schreiben spends an AI call per correction, so it stays behind auth.
    if (!user && a.skill === 'schreiben') {
      return NextResponse.json({ error: 'Not authenticated', code: 'auth_required' }, { status: 401 })
    }

    let auto_score: number | null = null
    let ai_score: number | null = null
    let ai_feedback: any = null
    let answers: any = null
    let reveal: any = {}

    if (a.skill === 'schreiben') {
      // ── AI-graded writing ──
      const text = String(body.text ?? '').trim()
      if (text.length < 10) return NextResponse.json({ error: 'Text too short.' }, { status: 400 })
      if (text.length > 4000) return NextResponse.json({ error: 'Text too long.' }, { status: 400 })

      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 })

      const uiLocale = feedbackLocale(body.locale)
      const localeName = { en: 'English', fr: 'French', ar: 'Arabic', de: 'German' }[uiLocale]
      const client = new Anthropic({ apiKey })
      const resp = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 2000,
        temperature: 0.2,
        messages: [{ role: 'user', content: buildSchreibenPrompt(a.level_id, localeName, uiLocale, a.instructions || '', text) }],
      })
      const rawText = resp.content.map(c => (c.type === 'text' ? c.text : '')).join('')
      let parsed: any
      try { parsed = parseJsonLoose(rawText) } catch {
        return NextResponse.json({ error: 'AI returned malformed output. Please try again.' }, { status: 502 })
      }
      ai_score = Math.max(0, Math.min(100, Number(parsed.score) || 0))
      ai_feedback = {
        corrected: String(parsed.corrected ?? ''),
        mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes.slice(0, 8) : [],
        tip: String(parsed.tip ?? ''),
        wordCount: countWords(text),
      }
      answers = { text }
      reveal = { ai_feedback }
    } else {
      // ── Auto-graded MCQ (grammar / lesen / hoeren) ──
      const choices: number[] = Array.isArray(body.choices) ? body.choices.map((n: any) => Number(n)) : []
      const key: number[] = Array.isArray(a.answer_key?.correct) ? a.answer_key.correct : []
      const explanations: string[] = Array.isArray(a.answer_key?.explanations) ? a.answer_key.explanations : []
      const total = key.length
      if (total === 0) return NextResponse.json({ error: 'Assignment has no answer key.' }, { status: 500 })

      let correct = 0
      const perQuestion = key.map((ans, i) => {
        const ok = choices[i] === ans
        if (ok) correct++
        return { correct: ans, picked: choices[i] ?? null, ok, explanation: explanations[i] ?? '' }
      })
      auto_score = Math.round((correct / total) * 100)
      answers = { choices }
      reveal = { perQuestion, correctCount: correct, total }
    }

    const finalScore = a.skill === 'schreiben' ? ai_score : auto_score

    // Anonymous MCQ attempt: grade and reveal, but there is no account to
    // attach the result to — the client shows a "create an account to save
    // your results" nudge off this flag.
    if (!user) {
      return NextResponse.json({ score: finalScore, saved: false, ...reveal })
    }

    const { error: upErr } = await sbAdmin.from('assignment_submissions').upsert({
      assignment_id: assignmentId,
      user_id: user.id,
      answers,
      auto_score,
      ai_score,
      ai_feedback,
      status: 'graded',
      submitted_at: new Date().toISOString(),
      graded_at: new Date().toISOString(),
    }, { onConflict: 'assignment_id,user_id' })
    if (upErr) {
      console.error('[learn-german/submit] upsert', upErr.message)
      return NextResponse.json({ error: 'Could not save your submission.' }, { status: 500 })
    }

    return NextResponse.json({ score: finalScore, saved: true, ...reveal })
  } catch (err: any) {
    console.error('[learn-german/submit]', err?.message || err)
    return NextResponse.json({ error: 'Grading service is temporarily unavailable.' }, { status: 500 })
  }
}
