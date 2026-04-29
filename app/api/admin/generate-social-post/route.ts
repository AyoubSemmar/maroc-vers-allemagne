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
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'

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

type HookFields = {
  tagFr: string         // top pill text, e.g. "📍 GoGermany.ma · Lancement"
  headlineFr: string    // main FR headline (use *word* to highlight in gold)
  headlineAr: string    // Arabic translation
  statNum: string       // big stat number, e.g. "400K+"
  statLabelFr: string
  statLabelAr: string
}
type FactFields = {
  tagFr: string         // e.g. "💡 Fun fact · معلومة"
  numText: string       // big number, can include unit, e.g. "~250€"
  numSubFr: string
  summaryFr: string
  summaryAr: string
}
type ExplainerFields = {
  tagFr: string         // e.g. "📚 L'Ausbildung · التكوين المهني"
  qFr: string           // short question
  qAr: string
  bigFr: string         // 1-line big answer; *word* highlighted in gold
  bigAr: string
  stats: { num: string; labelFr: string; labelAr: string }[] // 2-4 items
}
type BudgetFields = {
  tagFr: string         // e.g. "💸 Budget · ميزانية"
  headlineFr: string    // *word* highlighted
  headlineAr: string
  items: { icon: string; labelFr: string; value: string }[]   // 3-6 rows
  totalLabel: string    // e.g. "Total · المجموع"
  totalNum: string      // e.g. "~ 900 €"
  footAr: string        // tiny RTL caption
}

// 5-slide carousel: cover slide + 4 step/tip slides.
type CarouselSlide = {
  stepLabelFr: string  // e.g. "ÉTAPE 1" or "À RETENIR" — appears as small eyebrow
  titleFr: string      // big FR headline for this slide; supports *highlight*
  titleAr: string      // Arabic translation
  bodyFr: string       // 1-2 sentences
  bodyAr: string       // Arabic equivalent
}
type CarouselFields = {
  seriesTagFr: string       // e.g. "🇩🇪 GUIDE · مرشد"
  seriesTitleFr: string     // cover headline (appears on slide 1, supports *highlight*)
  seriesTitleAr: string     // Arabic cover headline
  seriesIntroFr: string     // 1-line intro on slide 1
  seriesIntroAr: string
  slides: CarouselSlide[]   // exactly 4 slides for steps 2-5; cover is slide 1
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

async function requireAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
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

ARABIC PUNCTUATION — STRICT RULES (otherwise glyphs face the wrong direction):
- Question mark in Arabic: ؟ (U+061F)  — NEVER use the Latin "?"
- Comma in Arabic: ، (U+060C)  — NEVER use the Latin ","
- Semicolon in Arabic: ؛ (U+061B) — NEVER use the Latin ";"
- Quote marks in Arabic: « » (or "..." curly) — never straight ASCII quotes
- Parentheses around Arabic phrases stay as ( ) but the content inside must use Arabic punctuation
- Numbers and Latin proper nouns inside Arabic text are fine — keep digits as Western 0-9
`

  // Length / structure guidance per template.
  const templateInstructions: Record<TemplateType, string> = {
    hook: `
Template: HOOK (yellow rounded border).
Used for big launch-style declarations or attention-grabbing facts.
Schema:
{
  "tagFr": "📍 ... · ...  (≤32 chars)",
  "headlineFr": "Big French statement, ≤80 chars, with *highlight* (1-3 words)",
  "headlineAr": "Arabic translation, ≤60 chars",
  "statNum": "Punchy number like 400K+ / €120K / 47%",
  "statLabelFr": "Two-line label, ≤90 chars",
  "statLabelAr": "Arabic equivalent"
}`,
    fact: `
Template: FACT (full diagonal orange wedge).
Used for ONE memorable number with a short bilingual takeaway.
Schema:
{
  "tagFr": "💡 Fun fact · معلومة",
  "numText": "Big number, e.g. \\"~250€\\" or \\"3 ans\\" or \\"400 000\\"",
  "numSubFr": "1-2 sentences explaining the number, ≤180 chars",
  "summaryFr": "1 punchy sentence, ≤90 chars",
  "summaryAr": "Arabic equivalent, ≤90 chars"
}`,
    explainer: `
Template: EXPLAINER (half diagonal corner).
Used for Q&A — explains a concept (Ausbildung, Anmeldung, BAföG) in 1 question + 1 punchy answer + 2-4 stat tiles.
Schema:
{
  "tagFr": "📚 ... · ... (≤40 chars)",
  "qFr": "Short question, ≤45 chars",
  "qAr": "Arabic translation, ≤40 chars",
  "bigFr": "Punchy answer with *highlight*, ≤55 chars",
  "bigAr": "Arabic translation, ≤50 chars",
  "stats": [
    {"num": "value", "labelFr": "≤24 chars", "labelAr": "≤22 chars"},
    {"num": "value", "labelFr": "≤24 chars", "labelAr": "≤22 chars"},
    {"num": "value", "labelFr": "≤24 chars", "labelAr": "≤22 chars"}
  ]
}
Provide 3 stats unless the topic clearly warrants 2 or 4.`,
    budget: `
Template: BUDGET (browser-window frame with line items).
Used for cost breakdowns: "Vivre avec X €/mois", "Frais d'Ausbildung", "Budget premier mois".
Schema:
{
  "tagFr": "💸 ... · ... ",
  "headlineFr": "Title with *highlighted* total, ≤55 chars",
  "headlineAr": "Arabic translation, ≤45 chars",
  "items": [
    {"icon": "1 emoji", "labelFr": "≤32 chars", "value": "e.g. \\"300–450 €\\""},
    ... 4-5 items total ...
  ],
  "totalLabel": "Total · المجموع",
  "totalNum": "e.g. \\"~ 900 €\\"",
  "footAr": "Tiny RTL caption, ≤60 chars"
}`,
    carousel: `
Template: CAROUSEL (5 slides — Instagram swipe set).
Slide 1 is the cover (series title + intro). Slides 2-5 are steps or
tips that build on each other. Use this for guides like "5 étapes pour
ouvrir un compte", "5 erreurs à éviter en Ausbildung", "5 villes
abordables", "Comment trouver un logement en 5 étapes".
Schema:
{
  "seriesTagFr": "🇩🇪 ... · ... (≤30 chars)",
  "seriesTitleFr": "Cover headline with ONE *highlight*, ≤55 chars",
  "seriesTitleAr": "Arabic translation, ≤50 chars",
  "seriesIntroFr": "1-line intro on cover, ≤90 chars",
  "seriesIntroAr": "Arabic translation, ≤80 chars",
  "slides": [
    {
      "stepLabelFr": "ÉTAPE 1 · المرحلة 1 (or À RETENIR / ASTUCE)",
      "titleFr": "Step headline with optional *highlight*, ≤50 chars",
      "titleAr": "Arabic translation, ≤45 chars",
      "bodyFr": "1-2 sentences expanding the step, ≤180 chars",
      "bodyAr": "Arabic equivalent, ≤160 chars"
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
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
    }

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
      ['tagFr', 'headlineFr', 'headlineAr', 'statNum', 'statLabelFr', 'statLabelAr'].forEach(need)
    } else if (templateType === 'fact') {
      ['tagFr', 'numText', 'numSubFr', 'summaryFr', 'summaryAr'].forEach(need)
    } else if (templateType === 'explainer') {
      ['tagFr', 'qFr', 'qAr', 'bigFr', 'bigAr', 'stats'].forEach(need)
      if (Array.isArray(fields.stats) && fields.stats.length < 2) missing.push('stats(≥2)')
    } else if (templateType === 'budget') {
      ['tagFr', 'headlineFr', 'headlineAr', 'items', 'totalLabel', 'totalNum', 'footAr'].forEach(need)
      if (Array.isArray(fields.items) && fields.items.length < 3) missing.push('items(≥3)')
    } else if (templateType === 'carousel') {
      ['seriesTagFr', 'seriesTitleFr', 'seriesTitleAr', 'seriesIntroFr', 'seriesIntroAr', 'slides'].forEach(need)
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
