// scripts/translate_ausbildung.mjs
//
// Translates each ausbildung_jobs.description (German markdown) into
// ar / fr / en using Claude Haiku, and stores them under
// `enrichment_json.translations.{ar,fr,en}`.
//
// Run:
//   node scripts/translate_ausbildung.mjs                # all rows missing translations
//   node scripts/translate_ausbildung.mjs --category education
//   node scripts/translate_ausbildung.mjs --limit 10
//   node scripts/translate_ausbildung.mjs --force        # re-translate already-translated rows
//
// Idempotent: by default skips rows that already have all three translations.
// Preserves any other fields in enrichment_json (e.g. set by enrich_jobs.mjs).
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// and ANTHROPIC_API_KEY.

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
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.')
  process.exit(1)
}
if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY in .env.local.')
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

async function translateOne(description) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Translate this German job description into ar, fr, and en.\n\nReturn JSON: { "ar": "...", "fr": "...", "en": "..." }\n\nGerman description:\n${description}`,
      }],
    }),
  })
  if (!res.ok) {
    throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const json = await res.json()
  const text = json.content?.[0]?.text ?? ''
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  const obj = JSON.parse(cleaned)
  if (!obj.ar || !obj.fr || !obj.en) throw new Error('Missing locale in response')
  return obj
}

function hasAllTranslations(enrichment) {
  const t = enrichment?.translations
  return !!(t && typeof t.ar === 'string' && typeof t.fr === 'string' && typeof t.en === 'string')
}

async function main() {
  const args = process.argv.slice(2)
  const catIdx = args.indexOf('--category')
  const category = catIdx >= 0 ? args[catIdx + 1] : null
  const limitIdx = args.indexOf('--limit')
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 5000
  const force = args.includes('--force')

  console.log('▸ Loading jobs needing translation...')
  let q = supabase
    .from('ausbildung_jobs')
    .select('id, title, category, description, enrichment_json')
    .not('description', 'is', null)
    .limit(limit)
  if (category) q = q.eq('category', category)

  const { data: rows, error } = await q
  if (error) { console.error(error); process.exit(1) }

  // Some legacy apify rows have description = "" (empty string), not NULL.
  // Skip anything without real content.
  const withDesc = rows.filter(r => (r.description || '').trim().length > 30)
  const todo = force ? withDesc : withDesc.filter(r => !hasAllTranslations(r.enrichment_json))
  console.log(`  ✓ ${rows.length} candidate rows; ${todo.length} need translation${force ? ' (--force)' : ''}`)
  if (todo.length === 0) return

  let ok = 0, failed = 0
  for (const job of todo) {
    try {
      const translations = await translateOne(job.description)
      const merged = { ...(job.enrichment_json || {}), translations }
      const { error: upErr } = await supabase
        .from('ausbildung_jobs')
        .update({ enrichment_json: merged })
        .eq('id', job.id)
      if (upErr) throw upErr
      ok++
      process.stdout.write(`\r▸ translated ${ok}/${todo.length}`)
    } catch (e) {
      failed++
      console.log(`\n  ✗ ${job.id} (${(job.title || '').slice(0, 40)}): ${e.message}`)
    }
    await new Promise(r => setTimeout(r, 250))
  }
  console.log(`\n✓ Done. ok=${ok} failed=${failed}`)
}

main().catch(err => { console.error(err); process.exit(1) })
