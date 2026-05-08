/**
 * Admin-only: translate an Arabic article + FAQs into French, English,
 * and German. Lives separate from /api/admin/generate-article so each
 * Claude call gets its own 60-second Vercel budget — generating the
 * source article AND its three translations in one call routinely
 * exceeded that limit and surfaced as 'The text generator timed out'.
 *
 * Input:  { title, summary, content, faqs }   (all Arabic)
 * Output: { translations: { fr|en|de: { title, summary, content, faqs } } }
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

function buildPrompt(title: string, summary: string, content: string, faqs: { q: string; a: string }[]) {
  return `You are a senior bilingual editor for gogermany.ma. Translate the following Arabic article into French, English, and German. Translations must be natural for native speakers — not literal. Keep proper nouns in German across all locales: Ausbildung, Anmeldung, BAföG, Krankenkasse, ZAB, IHK, Deutschlandticket, Steuer-ID. Preserve markdown formatting (## headings, lists, **bold**) exactly as in the source.

ARABIC SOURCE (re-emit nothing — only the 3 translations are needed back):

Title: ${title}

Summary: ${summary}

Content:
${content}

FAQs:
${faqs.map((f, i) => `${i + 1}. Q: ${f.q}\n   A: ${f.a}`).join('\n')}

Return ONLY a JSON object, no commentary:
{
  "fr": {
    "title": "...",
    "summary": "...",
    "content": "... (markdown preserved)",
    "faqs": [{"q":"...","a":"..."}, ...]
  },
  "en": { "title":"", "summary":"", "content":"", "faqs":[{"q":"","a":""}] },
  "de": { "title":"", "summary":"", "content":"", "faqs":[{"q":"","a":""}] }
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
    const { title, summary, content, faqs } = body || {}
    if (!title || !summary || !content || !Array.isArray(faqs)) {
      return NextResponse.json(
        { error: 'Missing fields. Need: title, summary, content, faqs[].' },
        { status: 400 },
      )
    }

    // Haiku-4.5 for translation too — fast enough to fit 3 languages of a
    // ~700-word article inside the function deadline, and translation
    // quality is plenty for admin-reviewed content. The temperature is
    // low (0.4) so wording stays close to the source.
    const client = new Anthropic({ apiKey })
    const resp = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 6000,
      temperature: 0.4,
      messages: [{ role: 'user', content: buildPrompt(title, summary, content, faqs) }],
    })

    const text = resp.content.map(c => (c.type === 'text' ? c.text : '')).join('')
    let parsed: any
    try {
      parsed = parseJsonLoose(text)
    } catch (e: any) {
      console.error('[translate-article] JSON parse failed:', e?.message, text.slice(0, 400))
      return NextResponse.json(
        { error: 'Translator returned malformed output. Try again.' },
        { status: 502 },
      )
    }

    for (const lang of ['fr', 'en', 'de'] as const) {
      const t = parsed[lang]
      if (!t || !t.title || !t.content) {
        return NextResponse.json({ error: `Translator omitted ${lang}.` }, { status: 502 })
      }
    }

    return NextResponse.json({
      translations: { fr: parsed.fr, en: parsed.en, de: parsed.de },
      elapsedMs: Date.now() - tStart,
    })
  } catch (e: any) {
    console.error('[translate-article] uncaught:', e)
    return NextResponse.json({ error: e?.message || 'Translate failed.' }, { status: 500 })
  }
}
