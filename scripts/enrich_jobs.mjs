// scripts/enrich_jobs.mjs
//
// Calls Claude on each Ausbildung job's description and saves the
// structured extraction (salary, requirements, what-you-will-learn,
// benefits, multilingual summary) into the `enrichment_json` column.
//
// Run:
//   node scripts/enrich_jobs.mjs --category healthcare       # only one category
//   node scripts/enrich_jobs.mjs --limit 15                  # only first N
//   node scripts/enrich_jobs.mjs --force                     # re-enrich already-done rows
//   node scripts/enrich_jobs.mjs                             # all unenriched
//
// Requires .env.local with:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   ANTHROPIC_API_KEY      ← get at https://console.anthropic.com (free $5 trial)

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── env ─────────────────────────────────────────────────────────
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
  console.error('Get one (free $5 trial) at https://console.anthropic.com/settings/keys')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

// ── prompt ──────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You extract structured data from German Ausbildung (vocational training) job descriptions.
Always return valid JSON matching the schema. No prose, no markdown fences.
If a field can't be inferred from the description, use null (or empty array for list fields).
Salaries: extract the monthly EUR amounts as numbers. Many Ausbildungen have year-1, year-2, year-3 tiers — capture them when given.
Bullets should be concise and concrete (max 12 words each), in the source language (German).
Multilingual summary should be one sentence per language describing the role from the applicant's perspective.`

const SCHEMA_HINT = `Return JSON of this shape:
{
  "summary": {
    "de": "string",
    "fr": "string",
    "en": "string",
    "ar": "string"
  },
  "salary": {
    "min_monthly_eur": number | null,
    "max_monthly_eur": number | null,
    "year_1_eur": number | null,
    "year_2_eur": number | null,
    "year_3_eur": number | null
  } | null,
  "duration_months": number | null,
  "what_youll_learn": string[],
  "requirements": string[],
  "benefits": string[],
  "language_required": "A2" | "B1" | "B2" | "C1" | null,
  "abi_required": boolean,
  "is_internationally_open": boolean,
  "tags": string[]
}`

async function enrichOne(job) {
  const userMsg = `${SCHEMA_HINT}

Job title: ${job.title}
Company: ${job.company}
Location: ${job.location ?? ''}
Category: ${job.category ?? ''}

Description:
${job.description ?? ''}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMsg }],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Anthropic ${res.status}: ${body.slice(0, 400)}`)
  }
  const json = await res.json()
  const text = json.content?.[0]?.text ?? ''
  // Strip markdown fences if the model wrapped them despite the system prompt
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch (e) {
    throw new Error(`Could not parse Claude response as JSON: ${cleaned.slice(0, 300)}`)
  }
}

// ── main ────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)
  const catIdx = args.indexOf('--category')
  const category = catIdx >= 0 ? args[catIdx + 1] : null
  const limitIdx = args.indexOf('--limit')
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 1000
  const force = args.includes('--force')

  console.log('▸ Loading jobs to enrich...')
  let q = supabase
    .from('ausbildung_jobs')
    .select('id, title, company, location, category, description')
    .not('description', 'is', null)
    .limit(limit)
  if (category) q = q.eq('category', category)
  if (!force) q = q.is('enrichment_json', null)

  const { data: jobs, error } = await q
  if (error) { console.error(error); process.exit(1) }
  console.log(`  ✓ ${jobs.length} jobs to enrich`)
  if (jobs.length === 0) return

  let ok = 0, failed = 0
  for (const job of jobs) {
    try {
      const enrichment = await enrichOne(job)
      const { error: upErr } = await supabase
        .from('ausbildung_jobs')
        .update({ enrichment_json: enrichment, enriched_at: new Date().toISOString() })
        .eq('id', job.id)
      if (upErr) throw upErr
      ok++
      process.stdout.write(`\r▸ enriched ${ok}/${jobs.length}`)
    } catch (e) {
      failed++
      console.log(`\n  ✗ ${job.id} (${job.title.slice(0, 40)}): ${e.message}`)
    }
    // Small delay between calls to be polite to Anthropic's rate limits
    await new Promise(r => setTimeout(r, 300))
  }
  console.log(`\n✓ Done. ok=${ok} failed=${failed}`)
}

main().catch(err => { console.error(err); process.exit(1) })
