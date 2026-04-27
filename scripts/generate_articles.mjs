// scripts/generate_articles.mjs
//
// End-to-end article generation pipeline. Submits a Sonnet batch to
// generate ~136 SEO-optimized articles in English (rewriting the 71
// existing + creating 65 new), then submits a Haiku batch to translate
// each article into ar/fr/de, then writes everything to the articles
// table. Saves state to scripts/out/articles_state.json after each
// phase so it's resumable (re-run with --resume to pick up where it
// left off).
//
// Run:
//   node scripts/generate_articles.mjs                    # full flow
//   node scripts/generate_articles.mjs --resume           # resume from saved state
//   node scripts/generate_articles.mjs --apply-only       # just write existing results to DB
//   node scripts/generate_articles.mjs --dry              # don't write to DB, save to disk only

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ARTICLE_TOPICS } from './article_topics.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(__dirname, '..')
const OUT_DIR = resolve(__dirname, 'out')
const STATE_PATH = resolve(OUT_DIR, 'articles_state.json')

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

try {
  const env = readFileSync(resolve(REPO, '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
} catch {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
if (!SUPABASE_URL || !SERVICE_KEY || !ANTHROPIC_KEY) {
  console.error('Missing env (.env.local).')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

const ANTHROPIC_HEADERS = {
  'content-type': 'application/json',
  'x-api-key': ANTHROPIC_KEY,
  'anthropic-version': '2023-06-01',
}

// ── State persistence ────────────────────────────────────────────
function loadState() {
  if (!existsSync(STATE_PATH)) return {}
  try { return JSON.parse(readFileSync(STATE_PATH, 'utf8')) } catch { return {} }
}
function saveState(s) { writeFileSync(STATE_PATH, JSON.stringify(s, null, 2)) }

// ── Prompts ──────────────────────────────────────────────────────
const SYSTEM_PROMPT_GEN = `You are an expert SEO content writer for an Ausbildung-and-immigration platform serving Moroccans moving to Germany.

For each request, you produce ONE complete article in ENGLISH that follows this exact spec:

Length: 1200–1800 words.
Structure:
- A concise H1 title that includes the main keyword naturally.
- An engaging 3-sentence introduction that hooks the reader (a real moment they recognize, a surprising stat, or a clear promise).
- 4–7 H2 sections that cover the topic comprehensively.
- H3 subsections inside H2s where the topic warrants depth.
- Bullet lists for steps, costs, document checklists.
- Practical examples with real numbers (€ amounts), actual website names, real city examples.
- A "Common pitfalls" or "What people get wrong" section near the end.
- A conclusion with a soft CTA: "Book a free consultation to learn German and move to Germany successfully" — link to "/anschreiben-generator" or "/cv-builder" or another internal page when relevant.

SEO:
- Use the main keyword in the title, intro, and one H2.
- Use semantic / related keywords naturally throughout.
- Avoid keyword stuffing. Avoid generic filler ("In today's world…"). Be specific.

Tone: clear, simple, human. Speaks to someone planning their move, not a generalist reader. No corporate buzzwords. Use 2nd person ("you").

Audience perspective: someone in Morocco or recently arrived in Germany for an Ausbildung. They want concrete steps, real costs, and what could go wrong.

Output format: STRICT JSON, no prose around it, no markdown fences. Schema:
{
  "title": "string — the H1 title",
  "summary": "string — 1-2 sentence editorial summary used as meta description and on the listing page; <= 155 chars",
  "content": "string — the full article body in markdown, starting with the introduction (NO H1 — title is in 'title' field), using ## for H2 and ### for H3",
  "faqs": [
    { "question": "string", "answer": "string" }
  ]
}

Provide 4–5 FAQ items, each with a concrete answer.`

function userPromptGen(topic, existingContent, existingTitle) {
  const head = `Slug: ${topic.slug}
Category: ${topic.category}
Main keyword: ${topic.keyword}
Brief: ${topic.brief}
`
  if (existingContent) {
    return `${head}
There is an existing short article on this topic in Arabic (currently ~${(existingContent || '').length} chars, far below our spec). Title: "${existingTitle}".

Your job is to write a fresh, complete, English article from scratch that matches the topic — DO NOT translate the Arabic. Use the brief above as the angle. Apply the full SEO spec.`
  }
  return `${head}
Write a fresh, complete English article on this topic following the full SEO spec.`
}

const SYSTEM_PROMPT_TRANS = `You translate SEO articles between languages while preserving structure, factual accuracy, and tone.

You will receive a JSON object with English fields: { title, summary, content, faqs }.

Return a JSON object with three top-level keys "ar", "fr", "de", each containing the same shape: { title, summary, content, faqs }.

Rules:
- Preserve every markdown construct exactly: ## headings, ### subheadings, blank lines, bullet lists, tables, internal links like [text](/cv-builder).
- Translate naturally for the target audience (Modern Standard Arabic; clear French; clear German). Do NOT translate proper nouns like "Ausbildung", "Probezeit", "ELSTER", or company names.
- Match the persuasive tone of the source.
- For Arabic, use proper RTL punctuation; numbers stay in Western Arabic numerals (0-9).
- Output ONLY the JSON object. No prose, no markdown fences.`

function userPromptTrans(enArticle) {
  return `Translate this English article into ar, fr, de. Return JSON: { "ar": {...}, "fr": {...}, "de": {...} }.

English source:
${JSON.stringify(enArticle, null, 2)}`
}

// ── Anthropic batch helpers ─────────────────────────────────────
async function submitBatch(requests) {
  const res = await fetch('https://api.anthropic.com/v1/messages/batches', {
    method: 'POST', headers: ANTHROPIC_HEADERS,
    body: JSON.stringify({ requests }),
  })
  if (!res.ok) throw new Error(`submit ${res.status}: ${(await res.text()).slice(0, 600)}`)
  return res.json()
}
async function getBatch(id) {
  const res = await fetch(`https://api.anthropic.com/v1/messages/batches/${id}`, { headers: ANTHROPIC_HEADERS })
  if (!res.ok) throw new Error(`get ${res.status}: ${(await res.text()).slice(0, 600)}`)
  return res.json()
}
async function fetchResults(url) {
  const res = await fetch(url, { headers: ANTHROPIC_HEADERS })
  if (!res.ok) throw new Error(`results ${res.status}`)
  const text = await res.text()
  return text.split('\n').filter(Boolean).map(l => JSON.parse(l))
}
async function pollUntilDone(id, label) {
  while (true) {
    const b = await getBatch(id)
    const c = b.request_counts || {}
    process.stdout.write(`\r▸ [${label}] status=${b.processing_status} processing=${c.processing ?? 0} succeeded=${c.succeeded ?? 0} errored=${c.errored ?? 0}     `)
    if (b.processing_status === 'ended') { console.log(); return b }
    await new Promise(r => setTimeout(r, 60_000))
  }
}
function parseJSONFromMessage(message) {
  const text = message?.content?.[0]?.text ?? ''
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  return JSON.parse(cleaned)
}

// ── Phase 1: build & submit generation batch ────────────────────
async function loadExistingArticles() {
  const all = []
  for (let from = 0; from < 5000; from += 1000) {
    const { data, error } = await supabase.from('articles').select('id, title, content, category').range(from, from + 999)
    if (error) throw error
    if (!data?.length) break
    all.push(...data)
    if (data.length < 1000) break
  }
  return all
}

function buildGenerationRequests(existingArticles) {
  const requests = []
  // Bucket 1: rewrites of existing articles. custom_id = "rw-<articleId>"
  for (const art of existingArticles) {
    // Try to match the existing article to a topic keyword/slug if we can,
    // else build an ad-hoc topic from the title.
    const topic = {
      slug: `rw-${art.id}`,
      category: mapExistingCategory(art.category),
      keyword: art.title, // best-effort; the model will refine
      brief: `Rewrite this existing article to our SEO spec. Original Arabic title: "${art.title}". Stay on the same topic.`,
    }
    requests.push({
      custom_id: `rw-${art.id}`,
      params: {
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: SYSTEM_PROMPT_GEN,
        messages: [{ role: 'user', content: userPromptGen(topic, art.content, art.title) }],
      },
    })
  }
  // Bucket 2: new articles from the topic list. custom_id = "new-<slug>"
  for (const topic of ARTICLE_TOPICS) {
    requests.push({
      custom_id: `new-${topic.slug}`,
      params: {
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: SYSTEM_PROMPT_GEN,
        messages: [{ role: 'user', content: userPromptGen(topic) }],
      },
    })
  }
  return requests
}

// Map the existing Arabic-string categories to our new English slugs.
function mapExistingCategory(cat) {
  const map = {
    'العمل': 'work',
    'شرائح الاتصال': 'simcards',
    'الجامعات': 'universities',
    'البنوك': 'banking',
    'Ausbildung': 'ausbildung',
  }
  return map[cat] || cat
}

// ── Phase 2: build & submit translation batch ───────────────────
function buildTranslationRequests(generated) {
  const requests = []
  for (const [customId, article] of Object.entries(generated)) {
    requests.push({
      custom_id: customId,
      params: {
        model: 'claude-haiku-4-5',
        max_tokens: 8000,
        system: SYSTEM_PROMPT_TRANS,
        messages: [{ role: 'user', content: userPromptTrans(article) }],
      },
    })
  }
  return requests
}

// ── Phase 3: write to DB ────────────────────────────────────────
async function applyToDB(state) {
  const today = new Date().toISOString().slice(0, 10)
  let inserted = 0, updated = 0, skipped = 0

  // Build a topic map by slug for new articles.
  const topicBySlug = new Map(ARTICLE_TOPICS.map(t => [t.slug, t]))

  for (const [customId, en] of Object.entries(state.generated || {})) {
    const trans = state.translations?.[customId]
    if (!trans?.ar || !trans?.fr || !trans?.de) {
      console.log(`  ⚠ ${customId}: missing translations, skipping`)
      skipped++; continue
    }

    // Canonical row uses Arabic for the surface fields; en/fr/de live in translations.
    const row = {
      title: trans.ar.title,
      summary: trans.ar.summary,
      content: trans.ar.content,
      faqs: trans.ar.faqs,
      translations: {
        en: { title: en.title, summary: en.summary, content: en.content, faqs: en.faqs },
        fr: { title: trans.fr.title, summary: trans.fr.summary, content: trans.fr.content, faqs: trans.fr.faqs },
        de: { title: trans.de.title, summary: trans.de.summary, content: trans.de.content, faqs: trans.de.faqs },
      },
    }

    if (customId.startsWith('rw-')) {
      const id = parseInt(customId.slice(3), 10)
      const cat = await currentCategoryAfterRemap(id)
      row.category = cat
      const { error } = await supabase.from('articles').update(row).eq('id', id)
      if (error) { console.log(`  ✗ ${customId}: ${error.message}`); skipped++; continue }
      updated++
    } else if (customId.startsWith('new-')) {
      const slug = customId.slice(4)
      const topic = topicBySlug.get(slug)
      row.category = topic?.category || 'other'
      row.date = today
      // No image_url for now — can be added later via the existing image scripts.
      const { error } = await supabase.from('articles').insert(row)
      if (error) { console.log(`  ✗ ${customId}: ${error.message}`); skipped++; continue }
      inserted++
    }
    if ((inserted + updated) % 10 === 0) {
      process.stdout.write(`\r▸ db: inserted=${inserted} updated=${updated} skipped=${skipped}   `)
    }
  }
  console.log(`\n✓ DB done: inserted=${inserted} updated=${updated} skipped=${skipped}`)
}

const REMAP_CACHE = new Map()
async function currentCategoryAfterRemap(id) {
  if (REMAP_CACHE.has(id)) return REMAP_CACHE.get(id)
  const { data } = await supabase.from('articles').select('category').eq('id', id).single()
  const slug = mapExistingCategory(data?.category || '')
  REMAP_CACHE.set(id, slug)
  return slug
}

// ── Main flow ───────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)
  const resume = args.includes('--resume')
  const applyOnly = args.includes('--apply-only')
  const dry = args.includes('--dry')

  let state = resume || applyOnly ? loadState() : {}

  // Phase 1: generation
  if (!applyOnly && !state.generated) {
    if (!state.genBatchId) {
      console.log('▸ Loading existing articles for rewrite list...')
      const existing = await loadExistingArticles()
      console.log(`  ✓ ${existing.length} existing articles will be rewritten`)
      console.log(`  ✓ ${ARTICLE_TOPICS.length} new article briefs queued`)
      const requests = buildGenerationRequests(existing)
      console.log(`▸ Submitting Sonnet generation batch (${requests.length} requests)...`)
      const batch = await submitBatch(requests)
      state.genBatchId = batch.id
      saveState(state)
      console.log(`  ✓ batch ${batch.id}`)
    }
    console.log('▸ Polling generation batch...')
    const finalBatch = await pollUntilDone(state.genBatchId, 'gen')
    if (!finalBatch.results_url) throw new Error('gen batch ended without results_url')
    console.log('▸ Downloading generation results...')
    const results = await fetchResults(finalBatch.results_url)
    const generated = {}
    let okGen = 0, errGen = 0
    for (const r of results) {
      if (r.result?.type !== 'succeeded') { errGen++; continue }
      try {
        const article = parseJSONFromMessage(r.result.message)
        if (!article.title || !article.content) throw new Error('missing fields')
        generated[r.custom_id] = article
        okGen++
      } catch (e) {
        errGen++
        console.log(`\n  ✗ ${r.custom_id}: ${e.message}`)
      }
    }
    state.generated = generated
    saveState(state)
    console.log(`✓ generation ok=${okGen} errored=${errGen}`)
  }

  // Phase 2: translation
  if (!applyOnly && !state.translations) {
    if (!state.transBatchId) {
      const requests = buildTranslationRequests(state.generated)
      console.log(`▸ Submitting Haiku translation batch (${requests.length} requests)...`)
      const batch = await submitBatch(requests)
      state.transBatchId = batch.id
      saveState(state)
      console.log(`  ✓ batch ${batch.id}`)
    }
    console.log('▸ Polling translation batch...')
    const finalBatch = await pollUntilDone(state.transBatchId, 'trans')
    if (!finalBatch.results_url) throw new Error('trans batch ended without results_url')
    console.log('▸ Downloading translation results...')
    const results = await fetchResults(finalBatch.results_url)
    const translations = {}
    let okT = 0, errT = 0
    for (const r of results) {
      if (r.result?.type !== 'succeeded') { errT++; continue }
      try {
        const obj = parseJSONFromMessage(r.result.message)
        if (!obj.ar || !obj.fr || !obj.de) throw new Error('missing locale')
        translations[r.custom_id] = obj
        okT++
      } catch (e) {
        errT++
        console.log(`\n  ✗ ${r.custom_id}: ${e.message}`)
      }
    }
    state.translations = translations
    saveState(state)
    console.log(`✓ translation ok=${okT} errored=${errT}`)
  }

  // Phase 3: DB
  if (dry) { console.log('--dry: skipping DB write. State saved at', STATE_PATH); return }
  console.log('▸ Writing to DB...')
  await applyToDB(state)
}

main().catch(err => { console.error(err); process.exit(1) })
