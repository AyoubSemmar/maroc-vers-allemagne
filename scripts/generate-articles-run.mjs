/**
 * Generate full articles from scripts/out/article-plan.json:
 *   1. Opus 4.8 writes the English source (SEO spec, tag format).
 *   2. Haiku translates into the topic's policy locales.
 *   3. Replicate FLUX hero image → article-images Supabase bucket.
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
import Replicate from 'replicate'

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
  const replicateKey = process.env.ARTICLE_GEN_REPLICATE_TOKEN || process.env.REPLICATE_API_TOKEN
  const missing = []
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY')
  if (!anthropicKey) missing.push('ARTICLE_GEN_ANTHROPIC_KEY (or ANTHROPIC_API_KEY)')
  if (!replicateKey && !NO_IMAGE) missing.push('REPLICATE_API_TOKEN (or ARTICLE_GEN_REPLICATE_TOKEN)')
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
const replicate = new Replicate({ auth: process.env.ARTICLE_GEN_REPLICATE_TOKEN || process.env.REPLICATE_API_TOKEN })

const LANG_NAME = {
  ar: 'Arabic', fr: 'French', de: 'German', es: 'Spanish', tr: 'Turkish',
  fa: 'Persian/Farsi', pt: 'Portuguese', ru: 'Russian', hi: 'Hindi', ur: 'Urdu', nl: 'Dutch',
}
const DENSE = new Set(['ar', 'fa', 'hi', 'ur'])

const plan = JSON.parse(fs.readFileSync('scripts/out/article-plan.json', 'utf8'))
const STATE_PATH = 'scripts/out/generated-articles.json'
const state = fs.existsSync(STATE_PATH) ? JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')) : {}
const saveState = () => fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2))

// ── tag (de)serialization ──────────────────────────────────────────
const FAQ_DELIM = '\n---FAQ---\n'
function serialize(a) {
  const faqs = (a.faqs || []).map(f => `Q: ${f.question}\nA: ${f.answer}`).join(FAQ_DELIM)
  return `<title>${a.title}</title>\n<summary>${a.summary}</summary>\n<content>\n${a.content}\n</content>\n<faqs>\n${faqs}\n</faqs>`
}
function tagval(t, n) { const m = new RegExp(`<${n}>([\\s\\S]*?)<\\/${n}>`).exec(t); return m ? m[1].trim() : null }
function parseArticle(text) {
  const title = tagval(text, 'title'); const content = tagval(text, 'content')
  if (!title || !content) throw new Error('missing title/content')
  const faqs = (tagval(text, 'faqs') || '').split(FAQ_DELIM).map(s => s.trim()).filter(Boolean).map(b => {
    const m = b.match(/^Q:\s*([\s\S]*?)\nA:\s*([\s\S]*)$/); return m ? { question: m[1].trim(), answer: m[2].trim() } : null
  }).filter(Boolean)
  return { title, summary: tagval(text, 'summary') || '', content, faqs }
}

const SYS_GEN = `You are an expert SEO content writer for GoGermany, a platform helping people move to Germany.
Produce ONE complete article in ENGLISH:
Length 1200–1800 words. An engaging 3-sentence intro; 4–7 ## H2 sections; ### H3 where useful; bullet lists for steps/costs/documents; real € amounts, real website/office names, real city examples; a "Common mistakes" section near the end; a conclusion with a soft CTA. Use the main keyword in the title, intro, and one H2. Natural semantic keywords, no stuffing. Clear human 2nd-person tone. Keep German terms (Ausbildung, Anmeldung, Sperrkonto, etc.) untranslated.
OUTPUT: exactly the four tags, nothing before/after, no JSON, no markdown fences:
<title>...</title>
<summary>≤155 char meta description</summary>
<content>
markdown body
</content>
<faqs>
Q: ...
A: ...
---FAQ---
Q: ...
A: ...
</faqs>
Provide 5 FAQ items with concrete answers, separated by ---FAQ--- on its own line.`

const sysTrans = (lang) => `You translate an SEO article from English into ${lang}. Input is in <title>/<summary>/<content>/<faqs> tags. Return the SAME tags with every value translated into ${lang}. Preserve all markdown (## ### bullets links). Do NOT translate proper nouns (Ausbildung, Sperrkonto, ELSTER, company/office names). Match the persuasive tone.${lang === 'Arabic' ? ' Use Modern Standard Arabic, Western numerals 0-9.' : ''} Output ONLY the four tags.`

// Titles of already-published articles in the same category, so a new article
// covers a DISTINCT angle (anti-duplication) and can cross-link to them.
async function fetchSiblings(category, limit = 30) {
  const { data } = await supabase
    .from('articles').select('id, t:translations->en->>title, base:title')
    .eq('category', category).limit(limit)
  return (data || []).map(r => ({ id: r.id, title: r.t || r.base })).filter(s => s.title)
}

async function genEnglish(topic, siblings = []) {
  let user = `Title to write: "${topic.title}"\nPrimary keyword: ${topic.keyword}\nCategory: ${topic.category}\nAngle: ${topic.brief}`
  if (siblings.length) {
    user += `\n\nAlready-published articles in this category. Your article MUST cover a clearly different angle and must NOT repeat their content. Where it genuinely helps the reader, cross-link to a relevant one using markdown [their title](/articles/ID):\n` +
      siblings.map(s => `- (ID ${s.id}) ${s.title}`).join('\n')
  }
  user += `\n\nWrite the full English article to the SEO spec.`
  const stream = await anthropic.messages.stream({
    model: 'claude-opus-4-8', max_tokens: 16000,
    thinking: { type: 'adaptive' }, output_config: { effort: 'high' },
    system: SYS_GEN, messages: [{ role: 'user', content: user }],
  })
  const msg = await stream.finalMessage()
  return parseArticle(msg.content.map(c => c.type === 'text' ? c.text : '').join(''))
}

async function translate(enArticle, locale) {
  const serialized = serialize(enArticle)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const resp = await anthropic.messages.create({
        model: 'claude-haiku-4-5', max_tokens: DENSE.has(locale) ? 16000 : 8000, temperature: 0.3,
        system: sysTrans(LANG_NAME[locale]), messages: [{ role: 'user', content: serialized }],
      })
      return parseArticle(resp.content.map(c => c.type === 'text' ? c.text : '').join(''))
    } catch (e) { if (attempt === 2) throw e }
  }
}

const IMAGE_MODEL = process.env.IMAGE_MODEL || 'black-forest-labs/flux-1.1-pro'
const IMAGE_STYLE = 'professional editorial photography, photorealistic, cinematic soft natural lighting, shallow depth of field, muted warm color palette, candid documentary feel, no text, no words, no logos, no charts, no watermarks'
// People descriptor per audience so heroes match (or, for global, vary).
const PEOPLE = {
  global: 'people of varied ethnicities and genders', india: 'Indian people', pakistan: 'Pakistani people',
  'north-africa': 'North African (Moroccan/Algerian) people', turkey: 'Turkish people',
  'iran-afghanistan': 'Iranian or Afghan people', 'spain-latam': 'Latin American or Spanish people',
  'portugal-brazil': 'Brazilian or Portuguese people', 'east-europe': 'Eastern European people',
  netherlands: 'Dutch or European people',
}

async function scenePromptFor(topic) {
  const who = PEOPLE[topic.audience] || PEOPLE.global
  const resp = await anthropic.messages.create({
    model: 'claude-haiku-4-5', max_tokens: 220, temperature: 0.9,
    messages: [{ role: 'user', content: `Invent ONE concrete, realistic photographic hero-image scene for an article about moving to Germany. Category: "${topic.category}". Title: "${topic.title}".

Rules:
- Choose a SETTING and ACTION that specifically fit THIS topic and category — make it visually distinct from a generic "person with documents" shot. Use the real-world place where this topic actually happens.
- Vary the composition naturally: sometimes a single person mid-action, sometimes two interacting, sometimes a location or objects with no people. Avoid posed groups and laptop-at-a-table clichés unless truly the best fit.
- When people appear, make them ${who}, candid and natural.
- No text, UI, charts, maps, icons, or symbolic objects.
- 1–2 sentences, vivid and specific.

Return ONLY the scene description.` }],
  })
  return resp.content.map(c => c.type === 'text' ? c.text : '').join('').trim().replace(/^["']|["']$/g, '')
}

async function createPredictionWithRetry(input, tries = 8) {
  for (let i = 0; i < tries; i++) {
    try {
      return await replicate.predictions.create({ model: IMAGE_MODEL, input })
    } catch (e) {
      const is429 = e?.response?.status === 429 || /429|throttled/i.test(e?.message || '')
      if (!is429 || i === tries - 1) throw e
      const wait = (e?.response?.headers?.get?.('retry-after') ? parseInt(e.response.headers.get('retry-after'), 10) : 0) || 8
      await new Promise(r => setTimeout(r, (wait + 1) * 1000))
    }
  }
}

async function makeImage(topic) {
  const scene = await scenePromptFor(topic)
  const prompt = `${scene} ${IMAGE_STYLE}`
  let pred = await createPredictionWithRetry({ prompt, aspect_ratio: '16:9', output_format: 'jpg', output_quality: 95, safety_tolerance: 2, prompt_upsampling: true })
  const terminal = new Set(['succeeded', 'failed', 'canceled'])
  const start = Date.now()
  while (!terminal.has(pred.status)) {
    if (Date.now() - start > 90_000) throw new Error('image timeout')
    await new Promise(r => setTimeout(r, 1500))
    pred = await replicate.predictions.get(pred.id)
  }
  if (pred.status !== 'succeeded') throw new Error(`replicate ${pred.status}`)
  const out = pred.output
  const first = Array.isArray(out) ? out[0] : out
  const url = typeof first === 'string' ? first : (typeof first?.url === 'function' ? first.url() : null)
  if (!url) throw new Error('no image url')
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
  const filename = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { data: up, error } = await supabase.storage.from('article-images').upload(filename, buf, { contentType: 'image/jpeg' })
  if (error) throw new Error(`upload: ${error.message}`)
  return supabase.storage.from('article-images').getPublicUrl(up.path).data.publicUrl
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
  const { done, failed } = await pool(slice, CONCURRENCY, processTopic)
  console.log(`\nDone: ${done} created, ${failed} failed.`)
}

main().catch(e => { console.error(e); process.exit(1) })
