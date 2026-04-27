// scripts/translate_ausbildung_batch.mjs
//
// Translates every ausbildung_jobs.description into ar/fr/en using
// Anthropic's Message Batches API — 50% cheaper than synchronous calls
// and (most importantly) not subject to per-minute rate limits.
//
// All-in-one flow: submits the batch, polls every 60s until it ends,
// downloads results, writes translations into enrichment_json.
// Idempotent — only picks up rows that don't already have translations.
//
// Run:
//   node scripts/translate_ausbildung_batch.mjs            # submit + poll + apply
//   node scripts/translate_ausbildung_batch.mjs --resume <batch_id>
//                                                          # poll an existing batch
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

try {
  const env = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
} catch {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
if (!SUPABASE_URL || !SERVICE_KEY || !ANTHROPIC_KEY) {
  console.error('Missing env (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / ANTHROPIC_API_KEY).')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

const SYSTEM_PROMPT = `You translate German Ausbildung (vocational training) job descriptions into Arabic, French, and English.

Rules:
- Preserve the original markdown structure (### headings, blank lines, bullet lists).
- Translate the headings too (e.g. "### Über diese Ausbildung" → "### About this training").
- Keep proper nouns and German job titles (e.g. "Ausbildung", "Erzieher", company names) in their original form when natural.
- Match the tone of an applicant-facing job posting — clear, direct, neutral.
- For Arabic, use Modern Standard Arabic (فصحى).
- Return ONLY a JSON object, no prose, no markdown fences. The object must have exactly three string fields: ar, fr, en. Each value is the full translated description as a single string.`

const ANTHROPIC_HEADERS = {
  'content-type': 'application/json',
  'x-api-key': ANTHROPIC_KEY,
  'anthropic-version': '2023-06-01',
}

function userMessageFor(description) {
  return `Translate this German job description into ar, fr, and en.\n\nReturn JSON: { "ar": "...", "fr": "...", "en": "..." }\n\nGerman description:\n${description}`
}

async function fetchAllUntranslated() {
  const all = []
  for (let from = 0; from < 10000; from += 1000) {
    const { data, error } = await supabase
      .from('ausbildung_jobs')
      .select('id, description, enrichment_json')
      .not('description', 'is', null)
      .range(from, from + 999)
    if (error) throw error
    if (!data || data.length === 0) break
    all.push(...data)
    if (data.length < 1000) break
  }
  return all.filter(r =>
    (r.description || '').trim().length >= 30 &&
    !(r.enrichment_json?.translations?.ar &&
      r.enrichment_json?.translations?.fr &&
      r.enrichment_json?.translations?.en)
  )
}

async function submitBatch(rows) {
  const requests = rows.map(r => ({
    custom_id: r.id,
    params: {
      model: 'claude-haiku-4-5',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessageFor(r.description) }],
    },
  }))
  const res = await fetch('https://api.anthropic.com/v1/messages/batches', {
    method: 'POST',
    headers: ANTHROPIC_HEADERS,
    body: JSON.stringify({ requests }),
  })
  if (!res.ok) throw new Error(`submit ${res.status}: ${(await res.text()).slice(0, 600)}`)
  return res.json()
}

async function getBatch(id) {
  const res = await fetch(`https://api.anthropic.com/v1/messages/batches/${id}`, {
    headers: ANTHROPIC_HEADERS,
  })
  if (!res.ok) throw new Error(`get ${res.status}: ${(await res.text()).slice(0, 600)}`)
  return res.json()
}

async function fetchResults(resultsUrl) {
  const res = await fetch(resultsUrl, { headers: ANTHROPIC_HEADERS })
  if (!res.ok) throw new Error(`results ${res.status}: ${(await res.text()).slice(0, 600)}`)
  const text = await res.text()
  return text.split('\n').filter(Boolean).map(line => JSON.parse(line))
}

function parseTranslation(message) {
  const text = message?.content?.[0]?.text ?? ''
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  const obj = JSON.parse(cleaned)
  if (!obj.ar || !obj.fr || !obj.en) throw new Error('missing locale')
  return obj
}

async function applyResults(results) {
  const ids = results.map(r => r.custom_id)
  const existingMap = new Map()
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200)
    const { data } = await supabase
      .from('ausbildung_jobs')
      .select('id, enrichment_json')
      .in('id', chunk)
    for (const r of data ?? []) existingMap.set(r.id, r.enrichment_json || {})
  }

  let ok = 0, errored = 0
  for (const r of results) {
    if (r.result?.type !== 'succeeded') { errored++; continue }
    let translations
    try {
      translations = parseTranslation(r.result.message)
    } catch {
      errored++; continue
    }
    const merged = { ...(existingMap.get(r.custom_id) || {}), translations }
    const { error } = await supabase
      .from('ausbildung_jobs')
      .update({ enrichment_json: merged })
      .eq('id', r.custom_id)
    if (error) errored++
    else ok++
    if (ok % 50 === 0) process.stdout.write(`\r▸ applied ${ok}/${results.length}`)
  }
  console.log(`\n✓ applied ok=${ok} errored=${errored}`)
}

async function pollUntilDone(batchId) {
  while (true) {
    const b = await getBatch(batchId)
    const counts = b.request_counts || {}
    process.stdout.write(
      `\r▸ status=${b.processing_status} processing=${counts.processing ?? 0} succeeded=${counts.succeeded ?? 0} errored=${counts.errored ?? 0} canceled=${counts.canceled ?? 0} expired=${counts.expired ?? 0}      `
    )
    if (b.processing_status === 'ended') {
      console.log()
      return b
    }
    await new Promise(r => setTimeout(r, 60_000))
  }
}

async function main() {
  const args = process.argv.slice(2)
  const resumeIdx = args.indexOf('--resume')
  const resumeId = resumeIdx >= 0 ? args[resumeIdx + 1] : null

  let batch
  if (resumeId) {
    console.log('▸ Resuming batch', resumeId)
    batch = await getBatch(resumeId)
  } else {
    console.log('▸ Loading untranslated rows...')
    const rows = await fetchAllUntranslated()
    console.log(`  ✓ ${rows.length} rows need translation`)
    if (rows.length === 0) return
    console.log('▸ Submitting batch to Anthropic...')
    batch = await submitBatch(rows)
    console.log(`  ✓ batch ${batch.id} created (${rows.length} requests)`)
    console.log(`    save this id in case you want to --resume: ${batch.id}`)
  }

  if (batch.processing_status !== 'ended') {
    console.log('▸ Polling every 60s until batch ends (Anthropic typically finishes within an hour)...')
    batch = await pollUntilDone(batch.id)
  }

  if (!batch.results_url) {
    console.error('Batch ended without a results_url:', batch)
    process.exit(1)
  }
  console.log('▸ Downloading results...')
  const results = await fetchResults(batch.results_url)
  console.log(`  ✓ ${results.length} result lines`)
  console.log('▸ Applying to DB...')
  await applyResults(results)
}

main().catch(err => { console.error(err); process.exit(1) })
