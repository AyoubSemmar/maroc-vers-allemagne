/**
 * Generate full articles from scripts/out/article-plan.json:
 *   1. Sonnet 4.6 writes the English source (SEO spec, tag format).
 *      Override the draft model with DRAFT_MODEL (e.g. claude-opus-4-8).
 *   2. Haiku translates into the topic's policy locales.
 *   3. Pexels stock-photo hero → article-images Supabase bucket.
 *   4. Insert into Supabase with translations._meta.{audience,locales}.
 *
 * Base columns hold Arabic when 'ar' is a target locale, otherwise the
 * English source (so the localizer always has a sensible fallback).
 *
 * Idempotent via scripts/out/generated-articles.json (slug → article id).
 *
 * Run: node scripts/generate-articles-run.mjs --limit=10 [--offset=0]
 *      node scripts/generate-articles-run.mjs --limit=10 --no-image
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { makePexelsImage, pexelsIdFromUrl } from './pexels-image.mjs'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

const args = process.argv.slice(2)
const LIMIT = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '10', 10)
const OFFSET = parseInt(args.find(a => a.startsWith('--offset='))?.split('=')[1] || '0', 10)
const NO_IMAGE = args.includes('--no-image')
const CONCURRENCY = parseInt(args.find(a => a.startsWith('--concurrency='))?.split('=')[1] || '3', 10)

// Preflight: fail with a clear message if a required key is missing/misnamed,
// instead of a cryptic SDK error 12s into the CI run.
{
  const anthropicKey = process.env.ARTICLE_GEN_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY
  const pexelsKey = process.env.PEXELS_API_KEY || process.env.ARTICLE_GEN_PEXELS_KEY
  const missing = []
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY')
  if (!anthropicKey) missing.push('ARTICLE_GEN_ANTHROPIC_KEY (or ANTHROPIC_API_KEY)')
  if (!pexelsKey && !NO_IMAGE) missing.push('PEXELS_API_KEY (or ARTICLE_GEN_PEXELS_KEY)')
  if (missing.length) {
    console.error('Missing required environment variable(s): ' + missing.join(', '))
    console.error('Set these as GitHub repo secrets (Settings → Secrets and variables → Actions).')
    process.exit(1)
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)
// Prefer a dedicated key so article-generation spend is isolated/capped
// separately from the rest of the app. Falls back to the main key.
const anthropic = new Anthropic({ apiKey: process.env.ARTICLE_GEN_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY })

// Model that writes the English source article. Sonnet 4.6 is the sweet spot
// for templated SEO writing — ~40% cheaper than Opus with near-identical
// quality on this task. Override with DRAFT_MODEL to A/B against Opus
// (e.g. DRAFT_MODEL=claude-opus-4-8). Keep on a model that supports
// adaptive thinking + effort (Opus 4.x / Sonnet 4.6); Haiku rejects `effort`.
const DRAFT_MODEL = process.env.DRAFT_MODEL || 'claude-sonnet-4-6'
// Effort for the draft. 'medium' is the sweet spot for this templated SEO task:
// A/B showed Sonnet at 'high' OVER-thinks it (8k+ thinking tokens, slower, and
// sometimes burns the 16k budget before emitting JSON → truncated output). At
// 'medium' it's reliable, ~half the cost, and quality-equivalent to Opus 'high'.
const DRAFT_EFFORT = process.env.DRAFT_EFFORT || 'medium'

const LANG_NAME = {
  ar: 'Arabic', fr: 'French', de: 'German', es: 'Spanish', tr: 'Turkish',
  fa: 'Persian/Farsi', pt: 'Portuguese', ru: 'Russian', hi: 'Hindi', ur: 'Urdu', zh: 'Simplified Chinese',
  uk: 'Ukrainian', sq: 'Albanian', id: 'Indonesian',
}
const DENSE = new Set(['ar', 'fa', 'hi', 'ur'])

const plan = JSON.parse(fs.readFileSync('scripts/out/article-plan.json', 'utf8'))
const STATE_PATH = 'scripts/out/generated-articles.json'
const state = fs.existsSync(STATE_PATH) ? JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')) : {}
const saveState = () => fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2))

// ── JSON (de)serialization ──────────────────────────────────────────
function parseJsonLoose(s) {
  const c = s.replace(/```json\s*|\s*```/g, '').trim()
  const a = c.indexOf('{'), b = c.lastIndexOf('}')
  if (a < 0 || b < 0) throw new Error('no JSON object')
  return JSON.parse(c.slice(a, b + 1))
}
// Normalize FAQs to the {q,a} shape the site renders (FAQAccordion + schema).
function normFaqs(faqs) {
  return Array.isArray(faqs)
    ? faqs.map(f => ({ q: String(f.q ?? f.question ?? '').trim(), a: String(f.a ?? f.answer ?? '').trim() })).filter(f => f.q && f.a)
    : []
}
function asArticle(obj) {
  if (!obj?.title || !obj?.content) throw new Error('missing title/content')
  return { title: String(obj.title).trim(), summary: String(obj.summary || '').trim(), content: String(obj.content).trim(), faqs: normFaqs(obj.faqs) }
}

const SYS_GEN = `You are an expert SEO content writer for GoGermany, a platform helping people move to Germany.
Produce ONE complete article in ENGLISH:
Length 1200–1800 words. An engaging 3-sentence intro; 4–7 ## H2 sections; ### H3 where useful; bullet lists for steps/costs/documents; real € amounts, real website/office names, real city examples; a "Common mistakes" section near the end; a conclusion with a soft CTA. Use the main keyword in the title, intro, and one H2. Natural semantic keywords, no stuffing. Clear human 2nd-person tone. Keep German terms (Ausbildung, Anmeldung, Sperrkonto, etc.) untranslated.

GoGermany has FREE interactive tools. Weave 1–3 of the genuinely relevant ones into the body as inline markdown links whose link text is the tool's name (e.g. "compute your exact amount with the free [Sperrkonto Calculator](/tools/sperrkonto-calculator)"). Never dump the whole list; only link tools that truly help THIS article's reader:
[CV Builder](/cv-builder) German-format CV · [Cover Letter Generator](/anschreiben-generator) Anschreiben/motivation letter · [Interview Prep](/interview-prep) real German interview questions by field · [Eligibility Checker](/tools/eligibility-checker) which visa path fits · [Document Checklist](/tools/document-checklist) per country+visa · [Migration Timeline](/tools/migration-timeline) month-by-month plan · [Living Cost Calculator](/tools/living-cost-calculator) city budgets · [Chancenkarte Calculator](/tools/chancenkarte-calculator) opportunity-card points · [Sperrkonto Calculator](/tools/sperrkonto-calculator) blocked-account amount · [Brutto-Netto Calculator](/tools/brutto-netto-rechner) net salary · [Anerkennung Wizard](/tools/anerkennung-wizard) qualification recognition · [City Comparator](/tools/city-comparator) compare cities · [German Grade Calculator](/tools/german-grade-calculator) convert your GPA · [Ausbildung Salary Explorer](/tools/ausbildung-salary) apprentice pay by trade · [Driving Licence Checker](/tools/driving-license-germany) can you drive/exchange · [Health Insurance Chooser](/tools/health-insurance-germany) public vs private · [Tax Refund Calculator](/tools/tax-refund-calculator) Steuererklärung estimate · [Furnished Housing Finder](/tools/furnished-housing) book a furnished home from abroad, no Schufa.

Return ONLY a valid JSON object (no markdown fences, no text before/after):
{"title":"...","summary":"meta description ≤155 chars","content":"full markdown body with ## H2 and ### H3","faqs":[{"q":"question","a":"answer"}]}
The "faqs" array MUST contain EXACTLY 5 concrete, useful question/answer pairs that real readers ask about this topic.`

const sysTrans = (lang) => `You translate an SEO article from English into ${lang}. Input is a JSON object {title,summary,content,faqs:[{q,a}]}. Return the SAME JSON shape with every value translated into ${lang} — including ALL 5 faqs (keep the same number of faqs). Preserve markdown (## ### bullet lists links). Do NOT translate proper nouns (Ausbildung, Sperrkonto, ELSTER, company/office names). Match the persuasive tone.${lang === 'Arabic' ? ' Use Modern Standard Arabic, Western numerals 0-9.' : ''} Return ONLY the JSON object, no fences.`

// Titles of already-published articles in the same category, so a new article
// covers a DISTINCT angle (anti-duplication) and can cross-link to them.
async function fetchSiblings(category, limit = 30) {
  const { data } = await supabase
    .from('articles').select('id, t:translations->en->>title, base:title')
    .eq('category', category).limit(limit)
  return (data || []).map(r => ({ id: r.id, title: r.t || r.base })).filter(s => s.title)
}

async function genEnglish(topic, siblings = []) {
  let base = `Title to write: "${topic.title}"\nPrimary keyword: ${topic.keyword}\nCategory: ${topic.category}\nAngle: ${topic.brief}`
  if (siblings.length) {
    base += `\n\nAlready-published articles in this category. Your article MUST cover a clearly different angle and must NOT repeat their content. Where it genuinely helps the reader, cross-link to a relevant one using markdown [their title](/articles/ID):\n` +
      siblings.map(s => `- (ID ${s.id}) ${s.title}`).join('\n')
  }
  for (let attempt = 1; attempt <= 2; attempt++) {
    const user = base + `\n\nWrite the full English article to the SEO spec as the JSON object.` +
      (attempt === 2 ? `\n\nIMPORTANT: the previous attempt lacked 5 FAQs. The "faqs" array MUST have exactly 5 {q,a} pairs.` : '')
    const stream = await anthropic.messages.stream({
      model: DRAFT_MODEL, max_tokens: 16000,
      thinking: { type: 'adaptive' }, output_config: { effort: DRAFT_EFFORT },
      system: SYS_GEN, messages: [{ role: 'user', content: user }],
    })
    const msg = await stream.finalMessage()
    const art = asArticle(parseJsonLoose(msg.content.map(c => c.type === 'text' ? c.text : '').join('')))
    if (art.faqs.length >= 4) return art
    if (attempt === 2) return art // accept whatever we got on final try
  }
}

async function translate(enArticle, locale) {
  const payload = JSON.stringify({ title: enArticle.title, summary: enArticle.summary, content: enArticle.content, faqs: enArticle.faqs })
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const resp = await anthropic.messages.create({
        model: 'claude-haiku-4-5', max_tokens: DENSE.has(locale) ? 16000 : 8000, temperature: 0.3,
        system: sysTrans(LANG_NAME[locale]), messages: [{ role: 'user', content: payload }],
      })
      const art = asArticle(parseJsonLoose(resp.content.map(c => c.type === 'text' ? c.text : '').join('')))
      if (art.faqs.length >= Math.min(4, enArticle.faqs.length) || attempt === 2) return art
    } catch (e) { if (attempt === 2) throw e }
  }
}

// Pexels photo ids already used across the whole articles table — seeded once at
// startup so a new run never reuses a hero another article already has.
const usedImageIds = new Set()
async function seedUsedImageIds() {
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('articles').select('image_url').range(from, from + 999)
    if (error) break
    if (!data?.length) break
    for (const r of data) { const id = pexelsIdFromUrl(r.image_url); if (id) usedImageIds.add(id) }
    if (data.length < 1000) break
  }
}

// Hero image: a real Pexels stock photo (searched by category/title), uploaded
// into our article-images bucket. Replaces the earlier AI-generated heroes.
// The shared usedImageIds set guarantees no two articles get the same photo.
async function makeImage(topic) {
  return makePexelsImage(topic, supabase, { usedIds: usedImageIds })
}

function readTime(content) { return Math.max(3, Math.round((content || '').split(/\s+/).length / 200)) }

async function processTopic(topic) {
  if (state[topic.slug]?.id) return { slug: topic.slug, skipped: true }

  const siblings = await fetchSiblings(topic.category)
  const en = await genEnglish(topic, siblings)
  const locales = topic.locales
  const hasAr = locales.includes('ar')
  const baseLang = hasAr ? 'ar' : 'en'

  // Translate every needed locale concurrently (base + non-base, minus the
  // English source which we already have).
  const needed = locales.filter(l => l !== 'en')
  const results = await Promise.all(
    needed.map(async (loc) => [loc, await translate(en, loc)]),
  )
  const byLocale = Object.fromEntries(results)

  const translations = {}
  // English is the source; store it directly when it's not the base column.
  if (baseLang !== 'en') translations.en = { title: en.title, summary: en.summary, content: en.content, faqs: en.faqs }
  for (const loc of needed) {
    if (loc === baseLang) continue
    const t = byLocale[loc]
    translations[loc] = { title: t.title, summary: t.summary, content: t.content, faqs: t.faqs }
  }

  // Base columns: Arabic when present, else the English source.
  const base = baseLang === 'ar' ? byLocale.ar : en

  let image_url = null
  if (!NO_IMAGE) { try { image_url = await makeImage(topic) } catch (e) { console.log(`  img ✗ ${topic.slug}: ${e.message}`) } }

  translations._meta = { audience: topic.audience, locales, slug: topic.slug }

  const row = {
    title: base.title, summary: base.summary, content: base.content, faqs: base.faqs,
    category: topic.category, date: new Date().toISOString().slice(0, 10),
    image_url, translations,
  }
  const { data, error } = await supabase.from('articles').insert(row).select('id').single()
  if (error) throw new Error(`insert: ${error.message}`)
  state[topic.slug] = { id: data.id, title: en.title }
  saveState()
  return { slug: topic.slug, id: data.id, locales: locales.length, image: !!image_url }
}

async function pool(items, n, worker) {
  let i = 0, done = 0, failed = 0
  const run = async () => {
    while (i < items.length) {
      const item = items[i++]
      try { const r = await worker(item); if (!r.skipped) { done++; console.log(`  ✓ ${r.slug} → id ${r.id} (${r.locales} locales${r.image ? ', img' : ''})`) } }
      catch (e) { failed++; console.log(`  ✗ ${item.slug}: ${e.message}`) }
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, run))
  return { done, failed }
}

const DAILY = (() => {
  const a = args.find(x => x.startsWith('--daily'))
  if (!a) return null
  const v = a.split('=')[1]
  return v ? parseInt(v, 10) : 3
})()

/** Proportionally interleave global and country-specific topics so both
 *  audiences publish steadily from day one (mix, not global-first). */
function interleavedPlan() {
  const globals = plan.filter(p => p.audience === 'global')
  const countries = plan.filter(p => p.audience !== 'global')
  const seq = []
  let gi = 0, ci = 0
  while (gi < globals.length || ci < countries.length) {
    const gf = globals.length ? gi / globals.length : 1
    const cf = countries.length ? ci / countries.length : 1
    if (ci >= countries.length || (gi < globals.length && gf <= cf)) seq.push(globals[gi++])
    else seq.push(countries[ci++])
  }
  return seq
}

async function existingSlugs() {
  const slugs = new Set()
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('articles').select('slug:translations->_meta->>slug').range(from, from + 999)
    if (error) throw new Error(error.message)
    if (!data?.length) break
    data.forEach(r => r.slug && slugs.add(r.slug))
    if (data.length < 1000) break
  }
  return slugs
}

async function main() {
  let slice
  if (DAILY != null) {
    const done = await existingSlugs()
    slice = interleavedPlan().filter(t => !done.has(t.slug)).slice(0, DAILY)
    console.log(`Daily run: ${done.size} already generated, picking next ${slice.length} (limit ${DAILY})`)
  } else {
    slice = plan.slice(OFFSET, OFFSET + LIMIT)
    console.log(`Processing ${slice.length} topics (offset ${OFFSET}, limit ${LIMIT}, concurrency ${CONCURRENCY})${NO_IMAGE ? ' [no image]' : ''}`)
  }
  if (slice.length === 0) { console.log('Nothing to do — all planned topics already generated.'); return }
  if (!NO_IMAGE) { await seedUsedImageIds(); console.log(`Seeded ${usedImageIds.size} used Pexels photo ids (no-repeat guard).`) }
  const { done, failed } = await pool(slice, CONCURRENCY, processTopic)
  console.log(`\nDone: ${done} created, ${failed} failed.`)
}

main().catch(e => { console.error(e); process.exit(1) })
