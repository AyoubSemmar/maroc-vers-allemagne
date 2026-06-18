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
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-gate'

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
  'البنوك':              'banking in Germany for international newcomers',
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
  translations: Partial<Record<'fr' | 'en' | 'de' | 'es' | 'tr' | 'fa' | 'pt' | 'ru', {
    title: string
    summary: string
    content: string
    faqs: { q: string; a: string }[]
  }>>
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

function buildPrompt(category: string, categoryEn: string, existingTitles: string[]) {
  const dupesBlock = existingTitles.length
    ? `\n\nExisting article titles in this category (DO NOT duplicate, pick a different angle):\n${existingTitles.map(t => '- ' + t).slice(0, 40).join('\n')}`
    : ''

  return `You are a senior bilingual editor for gogermany.ma — a site that helps people from any country move to Germany. Write ONE original, useful, SEO-friendly article in ARABIC ONLY. Translations are handled by a separate step — DO NOT translate.

Category: ${category} (${categoryEn})

⚠ CRITICAL: The article's TOPIC must clearly belong to this category. If the category is "السكن" (housing), do NOT write about taxes or jobs — even tangentially. Stay tightly on-topic so admins filtering by category get relevant results. The category in the output is fixed by the system; your job is to make sure the CONTENT matches it.

Audience: international readers (Arabic-first for this draft), often young, planning Ausbildung, university, work, or family migration to Germany from anywhere in the world. They care about practical steps, real costs, paperwork, deadlines, and avoiding scams. Keep guidance country-agnostic — note when something (e.g. apostille vs consular legalization, or APS) depends on the reader's country rather than assuming one.

Quality bar:
- Specific, actionable, NOT generic. Mention concrete agencies, websites, costs in EUR, document names, typical timelines.
- 500–750 words for the Arabic content (markdown allowed: headings ##, lists, **bold**). Tight beats long.
- 4 FAQs at the end, each genuinely useful.
- Friendly, plain language. No fluff intros.
- Title is concrete and click-worthy (no clickbait), under 80 chars.
- Summary is one sentence, under 160 chars (used as meta description).

ARABIC PUNCTUATION — STRICT RULES (otherwise glyphs render the wrong direction on the live site):
- Use ؟ (U+061F) for question marks, NEVER the Latin ?
- Use ، (U+060C) for commas, NEVER the Latin ,
- Use ؛ (U+061B) for semicolons, NEVER the Latin ;
- Use « » or curly "..." quotes, never straight ASCII quotes
- Latin proper nouns and Western digits 0-9 are fine inside Arabic text

Image prompt: a single English sentence describing a tasteful, photographic hero image (no text overlays, no people's faces close-up, no logos). Should evoke the topic — e.g. for housing: "modern Berlin apartment building exterior with autumn light"; for visa: "neat stack of European passports and travel documents on a wooden desk".${dupesBlock}

Return ONLY a JSON object, no commentary:
{
  "title": "Arabic title",
  "summary": "Arabic one-sentence summary, ≤160 chars",
  "content": "Arabic markdown body, 500-750 words",
  "faqs": [{"q":"...","a":"..."}, ...],
  "image_prompt": "English photographic prompt"
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

    // ── Generate Arabic article ──────────────────────────────────
    // Haiku is roughly 3-4x faster than Sonnet for the same output —
    // critical for keeping this call under Vercel's 60s deadline. The
    // admin reviews every draft before it publishes, so the small
    // quality dip is fine. Sonnet fits in benchmarks but kept timing
    // out in production once tokens started being generated slowly.
    const client = new Anthropic({ apiKey })
    const resp = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 3500,
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

    // Shape validation — Arabic source only at this stage.
    const need = ['title', 'summary', 'content', 'faqs', 'image_prompt']
    for (const k of need) {
      if (!parsed[k]) {
        return NextResponse.json({ error: `AI omitted field: ${k}` }, { status: 502 })
      }
    }

    // Title-collision guard: if the title already exists in DB, flag it
    // so the admin can choose to reject and regenerate.
    const titleClash = existingTitles.some(t =>
      t && t.trim().toLowerCase() === String(parsed.title).trim().toLowerCase(),
    )

    // Translations + image fill in via separate endpoints called by the
    // client after this one returns. Each step has its own 60s budget.
    const draft: Draft = {
      category,
      date: new Date().toISOString().slice(0, 10),
      title: String(parsed.title),
      summary: String(parsed.summary),
      content: String(parsed.content),
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
      translations: {
        fr: { title: '', summary: '', content: '', faqs: [] },
        en: { title: '', summary: '', content: '', faqs: [] },
        de: { title: '', summary: '', content: '', faqs: [] },
        es: { title: '', summary: '', content: '', faqs: [] },
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
