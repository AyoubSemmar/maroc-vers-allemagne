// scripts/generate_articles.mjs
//
// End-to-end article generation pipeline. Submits a Sonnet batch to
// generate ~136 SEO-optimized articles in English (rewriting the 71
// existing + creating 65 new), then submits a Haiku batch to translate
// each article into ar/fr/de (one request PER LANGUAGE to avoid the
// max_tokens ceiling), then writes everything to the articles table.
//
// State is saved to scripts/out/articles_state.json after each phase
// so the pipeline is resumable. The script auto-skips work already
// recorded in state — re-running picks up from the last broken phase.
//
// Run:
//   node scripts/generate_articles.mjs                    # full or resumed flow
//   node scripts/generate_articles.mjs --apply-only       # just write existing results to DB
//   node scripts/generate_articles.mjs --reset            # wipe state and start over
//   node scripts/generate_articles.mjs --dry              # don't write to DB, save to disk only

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs'
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

// ── State ────────────────────────────────────────────────────────
function loadState() { try { return JSON.parse(readFileSync(STATE_PATH, 'utf8')) } catch { return {} } }
function saveState(s) { writeFileSync(STATE_PATH, JSON.stringify(s, null, 2)) }

// ── Tag-based serialization ─────────────────────────────────────
// Articles are emitted as <title>…</title><summary>…</summary>
// <content>…</content><faqs>…</faqs> so prose with quotes never
// breaks the parse the way it does inside ad-hoc JSON.
const FAQ_DELIM = '\n---FAQ---\n'
function serializeArticle(a) {
  const faqsTxt = (a.faqs || []).map(f => `Q: ${f.question}\nA: ${f.answer}`).join(FAQ_DELIM)
  return `<title>${a.title}</title>
<summary>${a.summary}</summary>
<content>
${a.content}
</content>
<faqs>
${faqsTxt}
</faqs>`
}
function tag(text, name) {
  const m = new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`).exec(text)
  return m ? m[1].trim() : null
}
function parseArticle(text) {
  const title = tag(text, 'title')
  const summary = tag(text, 'summary')
  const content = tag(text, 'content')
  const faqsBlock = tag(text, 'faqs') || ''
  if (!title || !content) throw new Error('missing title/content')
  const faqs = faqsBlock
    .split(FAQ_DELIM)
    .map(s => s.trim())
    .filter(Boolean)
    .map(block => {
      const qm = block.match(/^Q:\s*([\s\S]*?)\nA:\s*([\s\S]*)$/)
      return qm ? { question: qm[1].trim(), answer: qm[2].trim() } : null
    })
    .filter(Boolean)
  return { title, summary: summary || '', content, faqs }
}

// ── Prompts ──────────────────────────────────────────────────────
const SYSTEM_PROMPT_GEN = `You are an expert SEO content writer for an Ausbildung-and-immigration platform serving Moroccans moving to Germany.

For each request, you produce ONE complete article in ENGLISH that follows this exact spec:

Length: 1200–1800 words.
Structure:
- A concise title that includes the main keyword naturally (no H1 in the body — title is provided separately).
- An engaging 3-sentence introduction that hooks the reader.
- 4–7 H2 sections (## ...) covering the topic comprehensively.
- H3 subsections (### ...) where the topic warrants depth.
- Bullet lists for steps, costs, document checklists.
- Practical examples with real numbers (€ amounts), actual website names, real city examples.
- A "Common pitfalls" or "What people get wrong" section near the end.
- A conclusion with a soft CTA: "Book a free consultation to learn German and move to Germany successfully" — link to /anschreiben-generator or /cv-builder when relevant.

SEO:
- Use the main keyword in the title, intro, and one H2.
- Use semantic / related keywords naturally throughout.
- Avoid keyword stuffing. Avoid generic filler. Be specific.

Tone: clear, simple, human. Speaks to someone planning their move. No corporate buzzwords. Use 2nd person ("you").

OUTPUT FORMAT — IMPORTANT:
Output exactly the four tags below, in order, with nothing before or after. Do NOT use JSON. Do NOT escape quotes in the content. Do NOT wrap in markdown fences.

<title>The article title goes here</title>
<summary>1–2 sentence editorial summary, ≤ 155 chars, used as meta description.</summary>
<content>
The full article body in markdown. Start with the introduction. Use ## for H2 and ### for H3. Bullets, links, examples allowed.
</content>
<faqs>
Q: First question?
A: First answer.
---FAQ---
Q: Second question?
A: Second answer.
---FAQ---
Q: Third question?
A: Third answer.
---FAQ---
Q: Fourth question?
A: Fourth answer.
</faqs>

Provide 4–5 FAQ items, each with a concrete answer. Use the exact ---FAQ--- separator (3 dashes on each side, on its own line).`

function userPromptGen(topic, existingContent, existingTitle) {
  const head = `Slug: ${topic.slug}
Category: ${topic.category}
Main keyword: ${topic.keyword}
Brief: ${topic.brief}
`
  if (existingContent) {
    return `${head}
There is an existing short article on this topic in Arabic (currently ~${(existingContent || '').length} chars, far below our spec). Title: "${existingTitle}".

Write a fresh, complete English article from scratch — do NOT translate the Arabic. Use the brief above as the angle. Apply the full SEO spec.`
  }
  return `${head}
Write a fresh, complete English article on this topic following the full SEO spec.`
}

const SYSTEM_PROMPT_TRANS_LANG = (langName) => `You translate an SEO article from English into ${langName}.

You receive an article in this exact tag format:

<title>...</title>
<summary>...</summary>
<content>
...markdown body...
</content>
<faqs>
Q: ...
A: ...
---FAQ---
Q: ...
A: ...
</faqs>

Return the SAME format with the SAME tags, but every value translated into ${langName}.

Rules:
- Preserve every markdown construct exactly: ## headings, ### subheadings, blank lines, bullet lists, tables, internal links like [text](/cv-builder).
- Translate naturally. Do NOT translate proper nouns like "Ausbildung", "Probezeit", "ELSTER", or company names.
- Match the persuasive tone of the source.
- ${langName === 'Arabic' ? 'Use Modern Standard Arabic (فصحى). Numbers stay in Western Arabic numerals (0-9). Use proper RTL punctuation.' : ''}
- Output ONLY the four tags. No commentary, no markdown fences around them.`

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
function textOf(message) {
  return (message?.content?.[0]?.text ?? '').trim()
}

// ── Phase 1: gen ────────────────────────────────────────────────
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

function buildGenerationRequests(existingArticles, alreadyDone) {
  const requests = []
  for (const art of existingArticles) {
    const cid = `rw-${art.id}`
    if (alreadyDone.has(cid)) continue
    const topic = {
      slug: cid,
      category: mapExistingCategory(art.category),
      keyword: art.title,
      brief: `Rewrite this existing article to our SEO spec. Original Arabic title: "${art.title}". Stay on the same topic.`,
    }
    requests.push({
      custom_id: cid,
      params: {
        model: 'claude-sonnet-4-6',
        max_tokens: 5000,
        system: SYSTEM_PROMPT_GEN,
        messages: [{ role: 'user', content: userPromptGen(topic, art.content, art.title) }],
      },
    })
  }
  for (const topic of ARTICLE_TOPICS) {
    const cid = `new-${topic.slug}`
    if (alreadyDone.has(cid)) continue
    requests.push({
      custom_id: cid,
      params: {
        model: 'claude-sonnet-4-6',
        max_tokens: 5000,
        system: SYSTEM_PROMPT_GEN,
        messages: [{ role: 'user', content: userPromptGen(topic) }],
      },
    })
  }
  return requests
}

// ── Phase 2: translate (per-language) ───────────────────────────
// Arabic tokenizes ~2× denser than English/French/German, so it needs a
// much larger max_tokens budget to fit the full article + FAQs.
const LANGS = [
  { code: 'ar', name: 'Arabic', maxTokens: 8000 },
  { code: 'fr', name: 'French', maxTokens: 4500 },
  { code: 'de', name: 'German', maxTokens: 4500 },
]

function buildTranslationRequests(generated, alreadyDone) {
  const requests = []
  for (const [customId, article] of Object.entries(generated)) {
    const serialized = serializeArticle(article)
    for (const lang of LANGS) {
      const reqId = `${customId}__${lang.code}`
      if (alreadyDone.has(reqId)) continue
      requests.push({
        custom_id: reqId,
        params: {
          model: 'claude-haiku-4-5',
          max_tokens: lang.maxTokens,
          system: SYSTEM_PROMPT_TRANS_LANG(lang.name),
          messages: [{ role: 'user', content: serialized }],
        },
      })
    }
  }
  return requests
}

// ── Phase 3: write to DB ────────────────────────────────────────
async function applyToDB(state) {
  const today = new Date().toISOString().slice(0, 10)
  let inserted = 0, updated = 0, skipped = 0
  const topicBySlug = new Map(ARTICLE_TOPICS.map(t => [t.slug, t]))

  for (const [customId, en] of Object.entries(state.generated || {})) {
    const ar = state.translations?.[`${customId}__ar`]
    const fr = state.translations?.[`${customId}__fr`]
    const de = state.translations?.[`${customId}__de`]
    if (!ar || !fr || !de) {
      console.log(`  ⚠ ${customId}: missing translations (ar=${!!ar} fr=${!!fr} de=${!!de}), skipping`)
      skipped++; continue
    }

    const row = {
      title: ar.title,
      summary: ar.summary,
      content: ar.content,
      faqs: ar.faqs,
      translations: {
        en: { title: en.title, summary: en.summary, content: en.content, faqs: en.faqs },
        fr: { title: fr.title, summary: fr.summary, content: fr.content, faqs: fr.faqs },
        de: { title: de.title, summary: de.summary, content: de.content, faqs: de.faqs },
      },
    }

    if (customId.startsWith('rw-')) {
      const id = parseInt(customId.slice(3), 10)
      row.category = await currentCategoryAfterRemap(id)
      const { error } = await supabase.from('articles').update(row).eq('id', id)
      if (error) { console.log(`  ✗ ${customId}: ${error.message}`); skipped++; continue }
      updated++
    } else if (customId.startsWith('new-')) {
      const slug = customId.slice(4)
      const topic = topicBySlug.get(slug)
      row.category = topic?.category || 'other'
      row.date = today
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
  const reset = args.includes('--reset')
  const applyOnly = args.includes('--apply-only')
  const dry = args.includes('--dry')

  if (reset && existsSync(STATE_PATH)) unlinkSync(STATE_PATH)
  let state = loadState()
  state.generated ??= {}
  state.translations ??= {}

  // ── PHASE 1: GENERATION ──────────────────────────────────────
  if (!applyOnly) {
    // Build target list to know what's missing
    const existing = await loadExistingArticles()
    const targetIds = new Set([
      ...existing.map(a => `rw-${a.id}`),
      ...ARTICLE_TOPICS.map(t => `new-${t.slug}`),
    ])
    const haveIds = new Set(Object.keys(state.generated))
    const missingIds = [...targetIds].filter(id => !haveIds.has(id))

    if (missingIds.length > 0) {
      console.log(`▸ Need to generate ${missingIds.length} of ${targetIds.size} articles`)
      let genBatchId = state.pendingGenBatchId
      if (!genBatchId) {
        const requests = buildGenerationRequests(existing, haveIds)
        console.log(`▸ Submitting Sonnet generation batch (${requests.length} requests)...`)
        const batch = await submitBatch(requests)
        genBatchId = batch.id
        state.pendingGenBatchId = genBatchId
        saveState(state)
        console.log(`  ✓ batch ${genBatchId}`)
      } else {
        console.log(`▸ Resuming pending generation batch ${genBatchId}`)
      }
      const finalBatch = await pollUntilDone(genBatchId, 'gen')
      if (!finalBatch.results_url) throw new Error('gen batch ended without results_url')
      console.log('▸ Downloading generation results...')
      const results = await fetchResults(finalBatch.results_url)
      let okGen = 0, errGen = 0
      for (const r of results) {
        if (r.result?.type !== 'succeeded') { errGen++; continue }
        try {
          const article = parseArticle(textOf(r.result.message))
          state.generated[r.custom_id] = article
          okGen++
        } catch (e) {
          errGen++
          console.log(`  ✗ ${r.custom_id}: ${e.message}`)
        }
      }
      delete state.pendingGenBatchId
      saveState(state)
      console.log(`✓ generation ok=${okGen} errored=${errGen} (cumulative generated=${Object.keys(state.generated).length})`)
    } else {
      console.log(`✓ all ${targetIds.size} articles already generated`)
    }
  }

  // ── PHASE 2: TRANSLATION ─────────────────────────────────────
  if (!applyOnly) {
    const needTrans = []
    for (const cid of Object.keys(state.generated)) {
      for (const lang of LANGS) {
        const tid = `${cid}__${lang.code}`
        if (!state.translations[tid]) needTrans.push(tid)
      }
    }
    if (needTrans.length > 0) {
      console.log(`▸ Need to translate ${needTrans.length} (article, lang) pairs`)
      let transBatchId = state.pendingTransBatchId
      if (!transBatchId) {
        const requests = buildTranslationRequests(state.generated, new Set(Object.keys(state.translations)))
        console.log(`▸ Submitting Haiku translation batch (${requests.length} requests)...`)
        const batch = await submitBatch(requests)
        transBatchId = batch.id
        state.pendingTransBatchId = transBatchId
        saveState(state)
        console.log(`  ✓ batch ${transBatchId}`)
      } else {
        console.log(`▸ Resuming pending translation batch ${transBatchId}`)
      }
      const finalBatch = await pollUntilDone(transBatchId, 'trans')
      if (!finalBatch.results_url) throw new Error('trans batch ended without results_url')
      console.log('▸ Downloading translation results...')
      const results = await fetchResults(finalBatch.results_url)
      let okT = 0, errT = 0
      for (const r of results) {
        if (r.result?.type !== 'succeeded') { errT++; continue }
        try {
          const article = parseArticle(textOf(r.result.message))
          state.translations[r.custom_id] = article
          okT++
        } catch (e) {
          errT++
          console.log(`  ✗ ${r.custom_id}: ${e.message}`)
        }
      }
      delete state.pendingTransBatchId
      saveState(state)
      console.log(`✓ translation ok=${okT} errored=${errT} (cumulative ${Object.keys(state.translations).length} of ${Object.keys(state.generated).length * 3})`)
    } else {
      console.log(`✓ all translations already done`)
    }
  }

  // ── PHASE 3: DB WRITE ────────────────────────────────────────
  if (dry) { console.log('--dry: skipping DB write. State at', STATE_PATH); return }
  console.log('▸ Writing to DB...')
  await applyToDB(state)
}

main().catch(err => { console.error(err); process.exit(1) })
