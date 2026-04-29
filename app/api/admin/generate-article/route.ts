/**
 * Admin-only: generate a fresh article draft in all 4 languages.
 *
 * Flow:
 *  1. Cookie-gate (admin_auth=true).
 *  2. Pick a random category from the canonical list.
 *  3. Pull existing article titles in that category to avoid duplicates.
 *  4. Ask Claude Sonnet to produce ONE article + translations + image
 *     prompt as strict JSON.
 *  5. Generate a hero image with Replicate (flux-schnell, fast + cheap).
 *  6. Upload the image to the existing article-images Supabase bucket.
 *  7. Return the draft to the admin UI — DOES NOT save to the DB. The
 *     admin reviews, then approves via /api/admin/save-article.
 */
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
// 60s is the Pro-tier sweet spot for a Sonnet call that returns a 4-
// language article. Image generation now lives in a sibling endpoint
// (/api/admin/generate-article-image) so this route only needs to fit
// the Claude call + DB read; that's reliably <40s.
export const maxDuration = 60

// Canonical category list — same one used in the admin form.
const CATEGORIES = [
  'البنوك',
  'شرائح الاتصال',
  'السكن',
  'الجامعات',
  'العمل',
  'Ausbildung',
  'التأشيرة والأوراق',
] as const

// English label for each category — used in the image prompt and to
// give the model an unambiguous handle when picking the topic.
const CATEGORY_EN: Record<string, string> = {
  'البنوك':              'banking in Germany for Moroccans',
  'شرائح الاتصال':       'mobile sim cards and internet in Germany',
  'السكن':               'finding housing and apartments in Germany',
  'الجامعات':            'German universities and student admission',
  'العمل':               'jobs and work life in Germany',
  'Ausbildung':          'German Ausbildung vocational training',
  'التأشيرة والأوراق':   'German visa, residence permit, and paperwork',
}

type Draft = {
  category: string
  date: string
  // Arabic = source columns
  title: string
  summary: string
  content: string
  faqs: { q: string; a: string }[]
  // Other languages packed into the translations JSONB
  translations: Record<'fr' | 'en' | 'de', {
    title: string
    summary: string
    content: string
    faqs: { q: string; a: string }[]
  }>
  image_url: string
  image_prompt_used: string
}

function parseJsonLoose(s: string): any {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found in model output')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function requireAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

function buildPrompt(category: string, categoryEn: string, existingTitles: string[]) {
  const dupesBlock = existingTitles.length
    ? `\n\nExisting article titles in this category (DO NOT duplicate, pick a different angle):\n${existingTitles.map(t => '- ' + t).slice(0, 40).join('\n')}`
    : ''

  return `You are a senior bilingual editor for gogermany.ma — a site that helps Moroccans move to Germany. Write ONE original, useful, SEO-friendly article.

Category: ${category} (${categoryEn})

Audience: Moroccan readers (Darija/Arabic-first), often young, planning Ausbildung, university, work, or family migration to Germany. They care about practical steps, real costs, paperwork, deadlines, and avoiding scams.

Quality bar:
- Specific, actionable, NOT generic. Mention concrete agencies, websites, costs in EUR, document names, typical timelines.
- 700–1100 words for the Arabic content (markdown allowed: headings ##, lists, **bold**).
- 4–6 FAQs at the end, each genuinely useful.
- Friendly, plain language. No fluff intros.
- Title is concrete and click-worthy (no clickbait), under 80 chars.
- Summary is one sentence, under 160 chars (used as meta description).

Then translate the entire article + FAQs into French, English, and German with the same quality and length. Translations must be natural for native speakers, not literal. Keep proper nouns (Ausbildung, Anmeldung, BAföG, ZAB, IHK) in German across all locales.

Image prompt: a single English sentence describing a tasteful, photographic hero image (no text overlays, no people's faces close-up, no logos). Should evoke the topic — e.g. for housing: "modern Berlin apartment building exterior with autumn light"; for visa: "neat stack of European passports and travel documents on a wooden desk".${dupesBlock}

Return ONLY a JSON object, no commentary:
{
  "title": "Arabic title",
  "summary": "Arabic one-sentence summary, ≤160 chars",
  "content": "Arabic markdown body, 700-1100 words",
  "faqs": [{"q":"...","a":"..."}, ...],
  "translations": {
    "fr": {"title":"","summary":"","content":"","faqs":[{"q":"","a":""}]},
    "en": {"title":"","summary":"","content":"","faqs":[{"q":"","a":""}]},
    "de": {"title":"","summary":"","content":"","faqs":[{"q":"","a":""}]}
  },
  "image_prompt": "English photographic prompt"
}`
}

export async function POST(req: NextRequest) {
  const tStart = Date.now()
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY missing.' }, { status: 500 })
    }

    // Optional client override; otherwise random.
    const body = await req.json().catch(() => ({}))
    const requested = typeof body?.category === 'string' ? body.category : ''
    const category = CATEGORIES.includes(requested as any)
      ? requested
      : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
    const categoryEn = CATEGORY_EN[category]

    // Pull existing titles in this category so the model can avoid repeating.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    )
    const { data: existing } = await supabase
      .from('articles')
      .select('title')
      .eq('category', category)
      .order('date', { ascending: false })
      .limit(40)
    const existingTitles: string[] = (existing ?? []).map((r: any) => r.title).filter(Boolean)

    // ── Generate text ─────────────────────────────────────────────
    // 6000 max_tokens covers a 1000-word AR article plus 3 translations
    // and FAQs without slowing the call down to where we lose the budget
    // for the image step.
    const client = new Anthropic({ apiKey })
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 6000,
      temperature: 0.8,
      messages: [{ role: 'user', content: buildPrompt(category, categoryEn, existingTitles) }],
    })

    const text = resp.content.map(c => (c.type === 'text' ? c.text : '')).join('')
    let parsed: any
    try {
      parsed = parseJsonLoose(text)
    } catch (e: any) {
      console.error('[generate-article] JSON parse failed:', e?.message, text.slice(0, 500))
      return NextResponse.json(
        { error: 'AI returned malformed output. Try again.' },
        { status: 502 },
      )
    }

    // Shape validation
    const need = ['title', 'summary', 'content', 'faqs', 'translations', 'image_prompt']
    for (const k of need) {
      if (!parsed[k]) {
        return NextResponse.json({ error: `AI omitted field: ${k}` }, { status: 502 })
      }
    }
    for (const lang of ['fr', 'en', 'de'] as const) {
      const t = parsed.translations[lang]
      if (!t || !t.title || !t.content) {
        return NextResponse.json({ error: `AI omitted ${lang} translation.` }, { status: 502 })
      }
    }

    // Title-collision guard: if the title already exists in DB, retry
    // would be ideal — but for v1 we just flag it. The admin can reject.
    const titleClash = existingTitles.some(t =>
      t && t.trim().toLowerCase() === String(parsed.title).trim().toLowerCase(),
    )

    // Image is generated by a *separate* endpoint, called by the client
    // right after this one returns. Keeping it out of this request is
    // what lets us fit comfortably inside Vercel's 60s deadline.
    const draft: Draft = {
      category,
      date: new Date().toISOString().slice(0, 10),
      title: String(parsed.title),
      summary: String(parsed.summary),
      content: String(parsed.content),
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
      translations: {
        fr: parsed.translations.fr,
        en: parsed.translations.en,
        de: parsed.translations.de,
      },
      image_url: '',
      image_prompt_used: String(parsed.image_prompt || `${categoryEn}, Germany`),
    }

    return NextResponse.json({ draft, titleClash, elapsedMs: Date.now() - tStart })
  } catch (e: any) {
    console.error('[generate-article] uncaught:', e)
    return NextResponse.json(
      { error: e?.message || 'Generation failed.' },
      { status: 500 },
    )
  }
}
