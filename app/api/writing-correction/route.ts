import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { LEVEL_SPECS, type WritingLevel } from '@/lib/writingExerciseData'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { bumpDailyUsage } from '@/lib/entitlements'

export const runtime = 'nodejs'
export const maxDuration = 30

type Body = {
  level: WritingLevel
  themeInstruction: string  // German instruction the student saw
  text: string              // student's submission
  uiLocale: 'en' | 'fr' | 'ar' | 'de'
}

type Mistake = {
  original: string
  correction: string
  explanation: string
  type?: 'grammar' | 'spelling' | 'syntax' | 'word_choice' | 'punctuation' | 'other'
}

type Result = {
  wordCount: number
  wordCountOk: boolean
  score: number
  corrected: string
  mistakes: Mistake[]
  tip: string
}

function countWords(s: string): number {
  return (s.trim().match(/\S+/g) ?? []).length
}

function buildPrompt(b: Body): string {
  const spec = LEVEL_SPECS[b.level]
  const localeName = { en: 'English', fr: 'French', ar: 'Arabic', de: 'German' }[b.uiLocale]

  return `You are a German language teacher correcting a ${spec.level} learner's daily writing exercise.

LEVEL RULES:
${spec.rubric}
Target word count: ${spec.minWords}–${spec.maxWords} words.

THE STUDENT'S TASK (in German, exactly as they saw it):
${b.themeInstruction}

THE STUDENT'S SUBMISSION:
"""
${b.text}
"""

YOUR JOB:
1. Identify real mistakes only — grammar, spelling, syntax, word choice, gender, case, punctuation. Do NOT invent or nitpick stylistic choices that are merely different from your preference.
2. For each mistake, give the EXACT substring from the student's input as "original" so the UI can highlight it. Substrings must match character-for-character (preserve case, punctuation, German umlauts, ß).
3. Cap mistakes at the 8 most important.
4. Write the "explanation" for each mistake in ${localeName}, max 18 words. Be concrete: name the rule (e.g. "Akkusativ after 'für'", "Wortstellung im Nebensatz").
5. Produce a "corrected" version: the student's text rewritten in correct German, using vocabulary AT or just slightly above their level — never C2 vocabulary in an A1 correction. Keep their voice and meaning.
6. Give a single actionable "tip" in ${localeName}, max 25 words, focused on the biggest pattern of mistake (or biggest strength if the text is already strong).
7. Score: 0–100 reflecting overall correctness AND task fulfilment (did they hit the topic, the word count, the level?).

Return ONLY a JSON object with this exact shape (no markdown fences, no commentary):
{
  "wordCount": <int>,
  "wordCountOk": <bool — true if within ${spec.minWords}–${spec.maxWords}>,
  "score": <int 0–100>,
  "corrected": "<rewritten German text>",
  "mistakes": [
    { "original": "<exact substring from input>", "correction": "<the fix>", "explanation": "<rule, in ${localeName}>", "type": "grammar|spelling|syntax|word_choice|punctuation|other" }
  ],
  "tip": "<one short sentence in ${localeName}>"
}`
}

function parseJsonLoose(s: string): any {
  // Strip ```json fences if present, then locate the first/last brace.
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found in model output')
  return JSON.parse(cleaned.slice(first, last + 1))
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 })
    }

    // Require auth — the daily writing tool is for signed-in learners.
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const body = (await req.json()) as Body
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
    }
    if (!body.level || !LEVEL_SPECS[body.level]) {
      return NextResponse.json({ error: 'Invalid level.' }, { status: 400 })
    }
    const text = (body.text ?? '').toString().trim()
    if (!text || text.length < 10) {
      return NextResponse.json({ error: 'Text too short.' }, { status: 400 })
    }
    // Cap at a reasonable max so a malicious caller can't burn tokens.
    if (text.length > 4000) {
      return NextResponse.json({ error: 'Text too long.' }, { status: 400 })
    }
    const themeInstruction = (body.themeInstruction ?? '').toString().trim()
    if (!themeInstruction) {
      return NextResponse.json({ error: 'Missing theme.' }, { status: 400 })
    }
    const uiLocale = (['en', 'fr', 'ar', 'de'] as const).includes(body.uiLocale)
      ? body.uiLocale
      : 'en'

    const client = new Anthropic({ apiKey })
    const prompt = buildPrompt({ ...body, text, themeInstruction, uiLocale })

    const resp = await client.messages.create({
      // Haiku is fast + cheap and more than capable at GER A1–C1 correction.
      model: 'claude-haiku-4-5',
      max_tokens: 2000,
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = resp.content
      .map(c => (c.type === 'text' ? c.text : ''))
      .join('')

    let parsed: Result
    try {
      parsed = parseJsonLoose(content) as Result
    } catch {
      return NextResponse.json(
        { error: 'AI returned malformed output. Please try again.' },
        { status: 502 },
      )
    }

    // Sanity-fix the wordCount if the model got it wrong.
    const realWc = countWords(text)
    const spec = LEVEL_SPECS[body.level]
    parsed.wordCount = realWc
    parsed.wordCountOk = realWc >= spec.minWords && realWc <= spec.maxWords
    parsed.mistakes = Array.isArray(parsed.mistakes) ? parsed.mistakes.slice(0, 8) : []
    parsed.score = Math.max(0, Math.min(100, Number(parsed.score) || 0))

    // Analytics — best-effort, don't fail the request if it errors.
    try { await bumpDailyUsage(user.id, 'writing_exercise_usage') } catch {}

    return NextResponse.json(parsed)
  } catch (err: any) {
    console.error('[writing-correction]', err?.message || err)
    return NextResponse.json(
      { error: 'Correction service is temporarily unavailable.' },
      { status: 500 },
    )
  }
}
