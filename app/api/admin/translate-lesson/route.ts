/**
 * Admin-only: translate a Learn-German lesson (already in Arabic) to
 * French, English and German. Output matches the LessonOverlay shape
 * used by lib/german-data/localize.ts so the JSON can be pasted into
 *   lib/german-data/translations/<level>.<locale>.json
 *
 * Sister endpoint to /api/admin/generate-lesson. We keep them split so
 * each Claude call comfortably fits in 60s.
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAdmin } from '@/lib/admin-gate'

export const runtime = 'nodejs'
export const maxDuration = 60

function parseJsonLoose(s: string): any {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found in model output')
  return JSON.parse(cleaned.slice(first, last + 1))
}

function buildPrompt(lesson: any) {
  return `You are translating a German-language teaching lesson written in Arabic into French, English, and German. Translations must be natural for native speakers and stay accurate to the pedagogical intent.

Strict rules:
  • German vocabulary and example sentences in the German overlay column "german" / "example" stay UNCHANGED — they are the language being taught.
  • In the "german" overlay (de.json), translate the Arabic explanations and Arabic-side cells into German, but leave the German example sentences as-is.
  • In each table, headers and cells: translate Arabic cells; KEEP German cells (Pronomen names, conjugated forms, articles) as-is.
  • In rules: translate "rule" and "translation" — keep "example" (German) unchanged.
  • In examples (the "Ich kann ... — أستطيع ..." entries): keep the German half; replace the Arabic half with the target-locale translation. Use " — " separator.
  • In vocabulary: keep "german" and "example" unchanged; translate "arabic" → label "arabic" still (it is just the meaning column, regardless of locale) — in fr.json it holds the French gloss, en.json the English gloss, de.json the German gloss. Same for "exampleArabic".
  • Question text in exercises: translate. Question answers stay in German. Hints translate.

Source Arabic lesson:
\`\`\`json
${JSON.stringify(lesson, null, 2)}
\`\`\`

Return ONLY a JSON object with three keys: fr, en, de — each one a Partial<Lesson> overlay matching the input shape. NO commentary, no \`\`\` fences in the output.

Shape:
{
  "fr": {
    "title": "...",
    "grammar": {
      "title": "...",
      "content": "...",
      "tables": [...],
      "rules": [...],
      "examples": [...],
      "tip": "..."
    },
    "vocabulary": [...],
    "exercise": { "questions": [...] }
  },
  "en": { ... same shape ... },
  "de": { ... same shape ... }
}`
}

export async function POST(req: NextRequest) {
  const tStart = Date.now()
  try {
    const gate = await requireAdmin()
    if (!gate.ok) return gate.response
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY missing.' }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const lesson = body?.lesson
    if (!lesson || !lesson.id || !lesson.grammar || !lesson.exercise) {
      return NextResponse.json({ error: 'lesson payload missing or malformed' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })
    const resp = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 8000,
      temperature: 0.3,
      messages: [{ role: 'user', content: buildPrompt(lesson) }],
    })

    const text = resp.content.map(c => (c.type === 'text' ? c.text : '')).join('')
    let parsed: any
    try { parsed = parseJsonLoose(text) }
    catch (e: any) {
      console.error('[translate-lesson] parse failed:', e?.message, text.slice(0, 400))
      return NextResponse.json({ error: 'Translator returned malformed JSON.' }, { status: 502 })
    }

    for (const lang of ['fr', 'en', 'de'] as const) {
      if (!parsed[lang] || !parsed[lang].title) {
        return NextResponse.json({ error: `translator omitted "${lang}"` }, { status: 502 })
      }
    }

    return NextResponse.json({ translations: parsed, elapsedMs: Date.now() - tStart })
  } catch (e: any) {
    console.error('[translate-lesson] uncaught:', e)
    return NextResponse.json({ error: e?.message || 'Translation failed.' }, { status: 500 })
  }
}
