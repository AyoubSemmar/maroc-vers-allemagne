import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { READING_SPECS, type ReadingLevel } from '@/lib/readingExerciseData'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { bumpDailyUsage } from '@/lib/entitlements'

export const runtime = 'nodejs'
export const maxDuration = 30

type Body = {
  level: ReadingLevel
  uiLocale: 'en' | 'fr' | 'ar' | 'de'
  /** Optional date seed (YYYY-MM-DD) so the same day yields the same topic
   *  when paired with the same userId. Falls back to today if missing. */
  dateKey?: string
}

type Question = {
  q: string
  options: string[]   // 4 options in German
  correct: number     // 0-3
  explanation: string
}

type Generated = {
  title: string
  topic: string
  text: string
  questions: Question[]
}

function pickRandom<T>(arr: T[], seed: string): T {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return arr[Math.abs(h) % arr.length]
}

function buildPrompt(level: ReadingLevel, locale: string, topic: string): string {
  const spec = READING_SPECS[level]
  const localeName = { en: 'English', fr: 'French', ar: 'Arabic', de: 'German' }[locale as 'en' | 'fr' | 'ar' | 'de'] || 'English'

  return `You are a German language teacher creating a daily reading-comprehension exercise for ${level} learners (Moroccan audience).

LEVEL RULES:
${spec.rubric}
Target text length: ${spec.minWords}–${spec.maxWords} words.

TOPIC TO WRITE ABOUT: ${topic}

TASK:
1. Write an original German text on the topic above. Length: ${spec.minWords}–${spec.maxWords} words. Vocabulary and grammar STRICTLY at ${level} — never above. Use natural, modern German. Make it engaging, with a small narrative arc or clear argument.
2. Give the text a short German title.
3. Write a one-line "topic" label in ${localeName} that describes the theme.
4. Compose ${spec.questionCount} multiple-choice comprehension questions in ${localeName}. Each question:
   - Tests understanding of facts, inferences, or vocabulary IN the text (not outside knowledge).
   - Has exactly 4 plausible options in German (the answers themselves stay in German so the learner reads German).
   - Has exactly one correct option.
   - Has a brief explanation in ${localeName} (max 25 words) of WHY the correct answer is correct, citing where in the text.
5. Distribute correct answer indices roughly evenly (don't always make 0 the answer).

Return ONLY a JSON object with this exact shape (no markdown fences, no commentary):
{
  "title": "<German title>",
  "topic": "<one-line theme label in ${localeName}>",
  "text": "<the German reading text, ${spec.minWords}–${spec.maxWords} words>",
  "questions": [
    {
      "q": "<question in ${localeName}>",
      "options": ["<option A in German>", "<option B in German>", "<option C in German>", "<option D in German>"],
      "correct": <0|1|2|3>,
      "explanation": "<brief explanation in ${localeName}>"
    }
  ]
}`
}

function parseJsonLoose(s: string): any {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found in model output')
  return JSON.parse(cleaned.slice(first, last + 1))
}

function countWords(s: string): number {
  return (s.trim().match(/\S+/g) ?? []).length
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 })
    }

    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const body = (await req.json()) as Body
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
    }
    if (!body.level || !READING_SPECS[body.level]) {
      return NextResponse.json({ error: 'Invalid level.' }, { status: 400 })
    }
    const uiLocale = (['en', 'fr', 'ar', 'de'] as const).includes(body.uiLocale)
      ? body.uiLocale
      : 'en'

    const spec = READING_SPECS[body.level]
    // Seed = userId|level|date — gives a deterministic but per-user, per-day pick.
    const dateKey = body.dateKey || new Date().toISOString().slice(0, 10)
    const seed = `${user.id}|${body.level}|${dateKey}`
    const topic = pickRandom(spec.topics, seed)

    const client = new Anthropic({ apiKey })
    const resp = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2200,
      // Slightly higher temperature so the same topic doesn't always produce
      // the same text across users.
      temperature: 0.7,
      messages: [{ role: 'user', content: buildPrompt(body.level, uiLocale, topic) }],
    })

    const content = resp.content
      .map(c => (c.type === 'text' ? c.text : ''))
      .join('')

    let parsed: Generated
    try {
      parsed = parseJsonLoose(content) as Generated
    } catch {
      return NextResponse.json(
        { error: 'AI returned malformed output. Please try again.' },
        { status: 502 },
      )
    }

    // Sanity / shape validation
    if (!parsed.text || typeof parsed.text !== 'string') {
      return NextResponse.json({ error: 'AI omitted the text.' }, { status: 502 })
    }
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return NextResponse.json({ error: 'AI omitted the questions.' }, { status: 502 })
    }
    parsed.questions = parsed.questions
      .filter(q =>
        q && typeof q.q === 'string' &&
        Array.isArray(q.options) && q.options.length === 4 &&
        Number.isInteger(q.correct) && q.correct >= 0 && q.correct <= 3,
      )
      .slice(0, spec.questionCount)
    if (parsed.questions.length === 0) {
      return NextResponse.json({ error: 'AI returned invalid questions.' }, { status: 502 })
    }

    const wc = countWords(parsed.text)
    // Analytics — best-effort, don't fail the request if it errors.
    try { await bumpDailyUsage(user.id, 'reading_exercise_usage') } catch {}

    return NextResponse.json({ ...parsed, wordCount: wc })
  } catch (err: any) {
    console.error('[reading-exercise]', err?.message || err)
    return NextResponse.json(
      { error: 'Reading service is temporarily unavailable.' },
      { status: 500 },
    )
  }
}
