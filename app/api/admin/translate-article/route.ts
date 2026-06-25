/**
 * Admin-only: translate an Arabic article into a set of target locales,
 * driven by the article's audience/locale policy (lib/article-audience).
 * Each locale is its own parallel Haiku call so the total fits one Vercel
 * function budget even for many languages.
 *
 * Input:  { title, summary, content, faqs, locales: string[] }  (Arabic source)
 * Output: { translations: { <locale>: { title, summary, content, faqs } }, failed: string[] }
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAdmin } from '@/lib/admin-gate'
import { LANG_NAME } from '@/lib/article-audience'

export const runtime = 'nodejs'
export const maxDuration = 60

function parseJsonLoose(s: string): any {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found in model output')
  return JSON.parse(cleaned.slice(first, last + 1))
}

function buildPrompt(lang: string, title: string, summary: string, content: string, faqs: { q: string; a: string }[]) {
  return `You translate an SEO article from Arabic into ${lang}. Make it natural for native speakers, not literal. Keep German terms untranslated across all locales (Ausbildung, Anmeldung, BAföG, Krankenkasse, ZAB, IHK, Sperrkonto, Deutschlandticket, Steuer-ID). Preserve markdown (## headings, lists, **bold**) exactly. Keep the SAME number of FAQs.

ARABIC SOURCE:
Title: ${title}
Summary: ${summary}
Content:
${content}
FAQs:
${faqs.map((f, i) => `${i + 1}. Q: ${f.q}\n   A: ${f.a}`).join('\n')}

Return ONLY a JSON object: {"title":"...","summary":"...","content":"...(markdown)","faqs":[{"q":"...","a":"..."}]}`
}

export async function POST(req: NextRequest) {
  const tStart = Date.now()
  try {
    const gate = await requireAdmin()
    if (!gate.ok) return gate.response
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY missing.' }, { status: 500 })

    const body = await req.json().catch(() => ({}))
    const { title, summary, content, faqs } = body || {}
    if (!title || !summary || !content || !Array.isArray(faqs)) {
      return NextResponse.json({ error: 'Missing fields. Need: title, summary, content, faqs[].' }, { status: 400 })
    }
    // Target locales = the policy set minus the Arabic source.
    const requested: string[] = Array.isArray(body.locales) && body.locales.length
      ? body.locales
      : ['fr', 'en', 'de']
    const targets = requested.filter((l) => l !== 'ar' && LANG_NAME[l])

    const client = new Anthropic({ apiKey })
    const results = await Promise.all(
      targets.map(async (loc) => {
        try {
          const resp = await client.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: loc === 'fa' || loc === 'hi' || loc === 'ur' ? 6000 : 5000,
            temperature: 0.4,
            messages: [{ role: 'user', content: buildPrompt(LANG_NAME[loc], title, summary, content, faqs) }],
          })
          const text = resp.content.map((c) => (c.type === 'text' ? c.text : '')).join('')
          const t = parseJsonLoose(text)
          if (!t?.title || !t?.content) throw new Error('omitted fields')
          return [loc, { title: t.title, summary: t.summary || '', content: t.content, faqs: Array.isArray(t.faqs) ? t.faqs : [] }] as const
        } catch {
          return [loc, null] as const
        }
      }),
    )

    const translations: Record<string, any> = {}
    const failed: string[] = []
    for (const [loc, val] of results) {
      if (val) translations[loc] = val
      else failed.push(loc)
    }

    return NextResponse.json({ translations, failed, elapsedMs: Date.now() - tStart })
  } catch (e: any) {
    console.error('[translate-article] uncaught:', e)
    return NextResponse.json({ error: e?.message || 'Translate failed.' }, { status: 500 })
  }
}
