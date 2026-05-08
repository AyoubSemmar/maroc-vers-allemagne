/**
 * Admin-only: generate a 1080×1080 social media post in the GoGermany
 * brand style (navy + orange/gold + German tricolor). Mirrors the four
 * template types in /public/social-launch-templates.html so anything
 * generated here visually matches the launch posts.
 *
 * Returns JSON shaped per template — the <AdminSocialPostGenerator>
 * client component handles rendering and PNG export.
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAdmin } from '@/lib/admin-gate'

export const runtime = 'nodejs'
export const maxDuration = 60

// 4 single-slide templates (matching the launch HTML exactly) plus a
// 5-slide carousel template (cover + 4 steps).
const TEMPLATE_TYPES = ['hook', 'fact', 'explainer', 'budget', 'carousel'] as const
type TemplateType = (typeof TEMPLATE_TYPES)[number]

// Topic ideas the AI can lean on. Lifted from the site's actual content
// pillars so generated posts stay on-brand.
const TOPIC_IDEAS = [
  'Anmeldung — what it is and why it matters',
  'How to open a German bank account as a Moroccan',
  'Cheapest German SIM card / data plan options for newcomers',
  'WG vs studio — finding a first apartment in Germany',
  'Public university admission for Moroccan high-schoolers',
  'What jobs are most in-demand in Germany 2026',
  'Ausbildung — duration, salary, contract type',
  'Visa types: studium vs Ausbildung vs Fachkraft',
  'Getting your Moroccan diploma recognized (ZAB)',
  'Cost of living in Berlin vs Munich vs smaller cities',
  'Tax basics — Steuer-ID, Lohnsteuer, what gets deducted',
  'German health insurance — gesetzlich vs privat',
  'Krankenkasse: TK, AOK, Barmer — which to pick',
  'Deutsch level required for each visa path',
  'Best free B1/B2 resources to study from Morocco',
  'How long visa appointments at Goethe / VFS take in 2026',
  'Common Ausbildung scams to avoid',
  'How much you really earn after taxes on €2,500/mo',
  'Halal food in Germany — where to find it',
  'Ramadan in Germany — fasting hours and tips',
  'Studentenwerk dorms vs private housing',
  'GEZ — the TV/radio fee everyone has to pay',
  'Recycling rules (Pfand, gelbe Tonne) for newcomers',
  'Public transport — Deutschlandticket vs city tickets',
] as const

type Field<T> = T

// All "Fr" fields must be Latin script ONLY (French + Latin punctuation +
// emojis). All "Ar" fields must be Arabic script ONLY (use ؟ ، ؛ « », not
// ASCII punctuation). NEVER mix scripts in the same string — when the
// browser tries to bidi-resolve a mixed run it reorders punctuation,
// digits, and currency symbols unpredictably. The component renders the
// FR + AR halves in separate <bdi> containers, joined visually by a "·".
type HookFields = {
  tagFr: string         // Latin-only, e.g. "📍 Lancement"
  tagAr: string         // Arabic-only, e.g. "إطلاق"
  headlineFr: string    // FR headline (*word* highlighted in gold)
  headlineAr: string
  statNum: string       // pure number+unit, e.g. "400K+" or "~250€"
  statLabelFr: string   // Latin-only label
  statLabelAr: string   // Arabic-only label
}
type FactFields = {
  tagFr: string         // Latin-only, e.g. "💡 Fun fact"
  tagAr: string         // Arabic-only, e.g. "معلومة"
  numText: string       // big number / unit, single token
  numSubFr: string      // Latin-only sub-line
  summaryFr: string
  summaryAr: string
}
type ExplainerFields = {
  tagFr: string         // Latin-only, e.g. "📚 L'Ausbildung"
  tagAr: string         // Arabic-only, e.g. "التكوين المهني"
  qFr: string
  qAr: string
  bigFr: string
  bigAr: string
  stats: { num: string; labelFr: string; labelAr: string }[]
}
type BudgetFields = {
  tagFr: string         // Latin-only, e.g. "💸 Budget"
  tagAr: string         // Arabic-only, e.g. "ميزانية"
  headlineFr: string
  headlineAr: string
  items: { icon: string; labelFr: string; value: string }[]
  totalLabelFr: string  // Latin-only, e.g. "Total"
  totalLabelAr: string  // Arabic-only, e.g. "المجموع"
  totalNum: string
  footAr: string        // Arabic-only caption
}

// 5-slide carousel.
type CarouselSlide = {
  stepLabelFr: string  // Latin-only, e.g. "ÉTAPE 1" or "À RETENIR"
  stepLabelAr: string  // Arabic-only, e.g. "المرحلة 1" or "فكرة"
  titleFr: string
  titleAr: string
  bodyFr: string
  bodyAr: string
}
type CarouselFields = {
  seriesTagFr: string       // Latin-only, e.g. "🇩🇪 GUIDE"
  seriesTagAr: string       // Arabic-only, e.g. "مرشد"
  seriesTitleFr: string
  seriesTitleAr: string
  seriesIntroFr: string
  seriesIntroAr: string
  slides: CarouselSlide[]
}

type GeneratedDraft =
  | { templateType: 'hook'; fields: HookFields; topic: string }
  | { templateType: 'fact'; fields: FactFields; topic: string }
  | { templateType: 'explainer'; fields: ExplainerFields; topic: string }
  | { templateType: 'budget'; fields: BudgetFields; topic: string }
  | { templateType: 'carousel'; fields: CarouselFields; topic: string }

function parseJsonLoose(s: string): any {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found in model output')
  return JSON.parse(cleaned.slice(first, last + 1))
}

function buildPrompt(topic: string, templateType: TemplateType): string {
  const sharedRules = `
You are a social-media writer for gogermany.ma — a site that helps Moroccans move to Germany.
Brand voice: warm, concrete, no fluff. Bilingual: every post pairs French with an Arabic line.
Tone: friendly, factual, slightly hopeful. Never clickbait.

Guardrails:
- Numbers must be REALISTIC for Germany in 2026. Round to memorable figures.
- French goes first (it's the visual hierarchy), Arabic translates the same idea — not literal.
- Keep proper nouns in German: Ausbildung, Anmeldung, BAföG, Krankenkasse, Deutschlandticket, Steuer-ID.
- No hashtags. No emojis inside main copy (only in tag pills where the schema says so).
- Use the * char to mark ONE 1-3 word phrase per French headline that should be highlighted in gold. Example: "Vivre en Allemagne avec *1 000 € / mois*"

⚠ STRICT BILINGUAL RULE — DO NOT MIX SCRIPTS IN ONE FIELD ⚠
Every "Fr" field must contain ONLY Latin script (French letters + emojis + Western digits + Latin punctuation).
Every "Ar" field must contain ONLY Arabic script (Arabic letters + Arabic punctuation + Western digits if needed).
Mixing French and Arabic in the same field breaks bidi rendering — separators ("·"), digits and currency symbols end up in the wrong place visually. The page renders the FR + AR halves in two separate boxes, so you do NOT need to put a "·" between them — that's purely visual chrome.

Examples of CORRECT splits:
  tagFr: "📚 L'Ausbildung"        tagAr: "التكوين المهني"
  tagFr: "💡 Fun fact"             tagAr: "معلومة"
  totalLabelFr: "Total"            totalLabelAr: "المجموع"
  stepLabelFr: "ÉTAPE 1"           stepLabelAr: "المرحلة 1"

ARABIC PUNCTUATION — STRICT RULES (otherwise glyphs face the wrong direction):
- Question mark in Arabic: ؟ (U+061F)  — NEVER use the Latin "?"
- Comma in Arabic: ، (U+060C)         — NEVER use the Latin ","
- Semicolon in Arabic: ؛ (U+061B)     — NEVER use the Latin ";"
- Quote marks in Arabic: « »            — never straight ASCII quotes
- Period at end of Arabic sentence: just a Latin "." is OK, but NEVER a "؟" instead of "."
- Numbers stay as Western digits 0-9 (the bidi engine handles them correctly inside an isolated RTL run)

NUMBER & CURRENCY FORMATTING IN ARABIC — to avoid visual flips:
- Prefer "8 يورو شهرياً" over "8 €/شهر" (writing the unit as a word avoids € flipping sides)
- Prefer "من 300 إلى 450 يورو" over "300–450 €" (the en-dash + currency in mixed runs flips)
- For ranges in Arabic, write "من X إلى Y" instead of "X–Y"
- Western digits 0-9 are OK; do NOT use Arabic-Indic digits ٠-٩ (the rest of the site uses Western)
`

  // Length / structure guidance per template.
  const templateInstructions: Record<TemplateType, string> = {
    hook: `
Template: HOOK (yellow rounded border).
Used for big launch-style declarations or attention-grabbing facts.
Schema (each "Fr" is Latin-only, each "Ar" is Arabic-only — DO NOT mix):
{
  "tagFr": "📍 Lancement (Latin, ≤22 chars)",
  "tagAr": "إطلاق (Arabic, ≤16 chars)",
  "headlineFr": "Big French statement, ≤80 chars, with *highlight* (1-3 words)",
  "headlineAr": "Pure Arabic, ≤60 chars",
  "statNum": "Single token: 400K+ / 47% / 250€ / 3 ans",
  "statLabelFr": "French two-line label, ≤90 chars",
  "statLabelAr": "Pure Arabic equivalent, ≤80 chars"
}`,
    fact: `
Template: FACT (full diagonal orange wedge).
Used for ONE memorable number with a short bilingual takeaway.
Schema (each "Fr" is Latin-only, each "Ar" is Arabic-only):
{
  "tagFr": "💡 Fun fact (Latin only, ≤16 chars)",
  "tagAr": "معلومة (Arabic only, ≤12 chars)",
  "numText": "Big single token: \\"~250€\\" or \\"3 ans\\" or \\"400 000\\"",
  "numSubFr": "1-2 French sentences explaining the number, ≤180 chars",
  "summaryFr": "1 punchy French sentence, ≤90 chars",
  "summaryAr": "Pure Arabic equivalent, ≤90 chars"
}`,
    explainer: `
Template: EXPLAINER (half diagonal corner).
Used for Q&A — explains a concept (Ausbildung, Anmeldung, BAföG) in 1 question + 1 punchy answer + 2-4 stat tiles.
Schema (each "Fr" is Latin-only, each "Ar" is Arabic-only):
{
  "tagFr": "📚 L'Ausbildung (Latin only, ≤22 chars)",
  "tagAr": "التكوين المهني (Arabic only, ≤18 chars)",
  "qFr": "Short French question, ≤45 chars",
  "qAr": "Pure Arabic question, ≤40 chars",
  "bigFr": "Punchy French answer with *highlight*, ≤55 chars",
  "bigAr": "Pure Arabic answer, ≤50 chars",
  "stats": [
    {"num": "value", "labelFr": "Latin ≤24 chars", "labelAr": "Arabic ≤22 chars"},
    ... 3 entries unless topic warrants 2 or 4 ...
  ]
}`,
    budget: `
Template: BUDGET (browser-window frame with line items).
Used for cost breakdowns. Numbers in Arabic should follow the formatting
rules above ("من 300 إلى 450 يورو" rather than "300–450 €").
Schema (each "Fr" is Latin-only, each "Ar" is Arabic-only):
{
  "tagFr": "💸 Budget (Latin only)",
  "tagAr": "ميزانية (Arabic only)",
  "headlineFr": "French title with *highlight*, ≤55 chars",
  "headlineAr": "Pure Arabic translation, ≤45 chars",
  "items": [
    {"icon": "1 emoji", "labelFr": "Latin ≤32 chars", "value": "300–450 € (Latin only — this column is always LTR-isolated)"},
    ... 4-5 items total ...
  ],
  "totalLabelFr": "Total (Latin only)",
  "totalLabelAr": "المجموع (Arabic only)",
  "totalNum": "Single token, e.g. \\"~ 900 €\\"",
  "footAr": "Pure Arabic caption, ≤60 chars"
}`,
    carousel: `
Template: CAROUSEL (5 slides — Instagram swipe set).
Slide 1 is the cover (series title + intro). Slides 2-5 are steps that
build on each other.
Schema (each "Fr" is Latin-only, each "Ar" is Arabic-only):
{
  "seriesTagFr": "🇩🇪 GUIDE (Latin only, ≤14 chars)",
  "seriesTagAr": "مرشد (Arabic only, ≤10 chars)",
  "seriesTitleFr": "French cover headline with ONE *highlight*, ≤55 chars",
  "seriesTitleAr": "Pure Arabic translation, ≤50 chars",
  "seriesIntroFr": "1-line French intro, ≤90 chars",
  "seriesIntroAr": "Pure Arabic intro, ≤80 chars",
  "slides": [
    {
      "stepLabelFr": "ÉTAPE 1 (Latin only — or À RETENIR / ASTUCE)",
      "stepLabelAr": "المرحلة 1 (Arabic only — or فكرة / تذكير)",
      "titleFr": "French step headline with optional *highlight*, ≤50 chars",
      "titleAr": "Pure Arabic translation, ≤45 chars",
      "bodyFr": "1-2 French sentences, ≤180 chars",
      "bodyAr": "Pure Arabic equivalent, ≤160 chars"
    }
    ... exactly 4 entries ...
  ]
}`,
  }

  return `${sharedRules}

Topic to cover: ${topic}

${templateInstructions[templateType]}

Return ONLY the JSON object — no commentary, no \`\`\` fences.`
}

export async function POST(req: NextRequest) {
  try {
    const gate = await requireAdmin()
    if (!gate.ok) return gate.response

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY missing.' }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const requestedType = typeof body?.templateType === 'string' ? body.templateType : ''
    // Random picks from single-slide templates only — carousels are
    // explicit (5x the cost & content, admin should opt in).
    const RANDOM_POOL: readonly TemplateType[] = ['hook', 'fact', 'explainer', 'budget']
    const templateType: TemplateType = (TEMPLATE_TYPES as readonly string[]).includes(requestedType)
      ? (requestedType as TemplateType)
      : RANDOM_POOL[Math.floor(Math.random() * RANDOM_POOL.length)]

    const customTopic = typeof body?.topic === 'string' && body.topic.trim().length > 3
      ? body.topic.trim()
      : ''
    const topic = customTopic || TOPIC_IDEAS[Math.floor(Math.random() * TOPIC_IDEAS.length)]

    const client = new Anthropic({ apiKey })
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-5',
      // Carousels need ~5x the tokens (cover + 4 step slides, FR + AR each).
      max_tokens: templateType === 'carousel' ? 4000 : 1500,
      temperature: 0.85,
      messages: [{ role: 'user', content: buildPrompt(topic, templateType) }],
    })

    const text = resp.content.map(c => (c.type === 'text' ? c.text : '')).join('')
    let fields: any
    try {
      fields = parseJsonLoose(text)
    } catch (e: any) {
      console.error('[generate-social-post] JSON parse failed:', e?.message, text.slice(0, 400))
      return NextResponse.json({ error: 'AI returned malformed output. Try again.' }, { status: 502 })
    }

    // Light shape validation per template — better to surface "missing
    // field X" than to render a half-empty post.
    const missing: string[] = []
    const need = (k: string) => { if (!fields[k]) missing.push(k) }
    if (templateType === 'hook') {
      ['tagFr', 'tagAr', 'headlineFr', 'headlineAr', 'statNum', 'statLabelFr', 'statLabelAr'].forEach(need)
    } else if (templateType === 'fact') {
      ['tagFr', 'tagAr', 'numText', 'numSubFr', 'summaryFr', 'summaryAr'].forEach(need)
    } else if (templateType === 'explainer') {
      ['tagFr', 'tagAr', 'qFr', 'qAr', 'bigFr', 'bigAr', 'stats'].forEach(need)
      if (Array.isArray(fields.stats) && fields.stats.length < 2) missing.push('stats(≥2)')
    } else if (templateType === 'budget') {
      ['tagFr', 'tagAr', 'headlineFr', 'headlineAr', 'items', 'totalLabelFr', 'totalLabelAr', 'totalNum', 'footAr'].forEach(need)
      if (Array.isArray(fields.items) && fields.items.length < 3) missing.push('items(≥3)')
    } else if (templateType === 'carousel') {
      ['seriesTagFr', 'seriesTagAr', 'seriesTitleFr', 'seriesTitleAr', 'seriesIntroFr', 'seriesIntroAr', 'slides'].forEach(need)
      if (Array.isArray(fields.slides) && fields.slides.length < 4) missing.push('slides(=4)')
    }
    if (missing.length) {
      return NextResponse.json(
        { error: `AI omitted fields: ${missing.join(', ')}. Try again.` },
        { status: 502 },
      )
    }

    const draft: GeneratedDraft = { templateType, fields, topic } as GeneratedDraft
    return NextResponse.json({ draft })
  } catch (e: any) {
    console.error('[generate-social-post] uncaught:', e)
    return NextResponse.json(
      { error: e?.message || 'Generation failed.' },
      { status: 500 },
    )
  }
}
