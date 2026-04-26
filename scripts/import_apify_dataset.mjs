// scripts/import_apify_dataset.mjs
//
// Imports an Apify scraper export (JSON array of {title,company,city,
// anstellungsart,email,apply_url}) into the `ausbildung_jobs` table.
//
// Run:
//   node scripts/import_apify_dataset.mjs path/to/dataset.json
//   node scripts/import_apify_dataset.mjs path/to/dataset.json --category logistics
//   node scripts/import_apify_dataset.mjs path/to/dataset.json --dry        # don't write to DB
//
// Auto-categorizes via the existing categorizer when --category is omitted.
// Generates a stable external_id from a hash so re-imports don't duplicate.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
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
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

// ── inline copy of the categorizer (so we can run as plain Node) ──
const CATEGORY_KEYWORDS = {
  hospitality: ['Hotelfachmann', 'Hotelfachfrau', 'Koch', 'Köchin'],
  handwerk: ['Elektroniker', 'Anlagenmechaniker', 'Mechatroniker'],
  it: ['Fachinformatiker'],
  healthcare: [
    'Pflegefachmann', 'Pflegefachfrau',
    'Medizinische Fachangestellte', 'Medizinischer Fachangestellter',
    'Zahnmedizinische Fachangestellte', 'Zahnmedizinischer Fachangestellter',
  ],
  logistics: [
    'LKW-Fahrer', 'LKW Fahrer',
    'Berufskraftfahrer', 'Kraftfahrer',
    'Lagerlogistik',
  ],
}

function categorize(title) {
  const t = (title || '').toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (t.includes(kw.toLowerCase())) return cat
    }
  }
  return null
}

function externalIdFor(rec) {
  const seed = `${rec.title}|${rec.company}|${rec.city}|${rec.email ?? ''}|${rec.apply_url ?? ''}`
  return 'apify-' + createHash('sha1').update(seed).digest('hex').slice(0, 16)
}

async function main() {
  const args = process.argv.slice(2)
  const path = args.find(a => !a.startsWith('--'))
  if (!path) {
    console.error('Usage: node scripts/import_apify_dataset.mjs <path-to-dataset.json> [--category logistics] [--dry]')
    process.exit(1)
  }
  const dry = args.includes('--dry')
  const catIdx = args.indexOf('--category')
  const forcedCategory = catIdx >= 0 ? args[catIdx + 1] : null

  const raw = JSON.parse(readFileSync(path, 'utf8'))
  console.log(`▸ Loaded ${raw.length} rows from ${path}`)

  const now = new Date().toISOString()
  const records = []
  let skipped = 0
  for (const r of raw) {
    if (!r.title || !r.company) { skipped++; continue }
    const category = forcedCategory || categorize(r.title)
    if (!category) { skipped++; continue }

    records.push({
      external_id: externalIdFor(r),
      title: r.title,
      company: r.company,
      location: r.city || '—',
      description: null,                 // Apify export doesn't include description
      category,
      external_url: null,
      apply_url: r.apply_url || null,
      contact_email: r.email || null,
      anstellungsart: r.anstellungsart || null,
      published_at: now,
      created_at: now,
    })
  }

  // De-dupe within this batch:
  //   1. exact external_id collisions
  //   2. same contact_email (one job posting per email)
  //   3. same apply_url (one job posting per application URL)
  const byId = new Map()
  for (const rec of records) byId.set(rec.external_id, rec)
  const seenEmails = new Set()
  const seenUrls = new Set()
  const dedupedInBatch = []
  let dropDupEmail = 0, dropDupUrl = 0
  for (const rec of byId.values()) {
    const emailKey = (rec.contact_email || '').toLowerCase().trim()
    const urlKey = (rec.apply_url || '').toLowerCase().trim()
    if (emailKey && seenEmails.has(emailKey)) { dropDupEmail++; continue }
    if (urlKey && seenUrls.has(urlKey)) { dropDupUrl++; continue }
    if (emailKey) seenEmails.add(emailKey)
    if (urlKey) seenUrls.add(urlKey)
    dedupedInBatch.push(rec)
  }
  console.log(`▸ Dedupe within batch: dropped ${dropDupEmail} same-email, ${dropDupUrl} same-url`)

  // De-dupe against existing rows already in the DB.
  const emailsToCheck = [...seenEmails]
  const urlsToCheck = [...seenUrls]
  const existingEmails = new Set()
  const existingUrls = new Set()
  if (emailsToCheck.length > 0) {
    const { data } = await supabase
      .from('ausbildung_jobs')
      .select('contact_email')
      .in('contact_email', emailsToCheck)
    for (const r of data ?? []) if (r.contact_email) existingEmails.add(r.contact_email.toLowerCase().trim())
  }
  if (urlsToCheck.length > 0) {
    const { data } = await supabase
      .from('ausbildung_jobs')
      .select('apply_url')
      .in('apply_url', urlsToCheck)
    for (const r of data ?? []) if (r.apply_url) existingUrls.add(r.apply_url.toLowerCase().trim())
  }
  const final = []
  let dropDbEmail = 0, dropDbUrl = 0
  for (const rec of dedupedInBatch) {
    const emailKey = (rec.contact_email || '').toLowerCase().trim()
    const urlKey = (rec.apply_url || '').toLowerCase().trim()
    if (emailKey && existingEmails.has(emailKey)) { dropDbEmail++; continue }
    if (urlKey && existingUrls.has(urlKey)) { dropDbUrl++; continue }
    final.push(rec)
  }
  console.log(`▸ Dedupe vs DB: dropped ${dropDbEmail} email-already-exists, ${dropDbUrl} url-already-exists`)

  console.log(`▸ Built ${final.length} records (skipped ${skipped})`)
  const cats = {}
  for (const rec of final) cats[rec.category] = (cats[rec.category] ?? 0) + 1
  for (const [cat, n] of Object.entries(cats)) console.log(`  – ${cat}: ${n}`)
  console.log(`  – with email: ${final.filter(r => r.contact_email).length}`)
  console.log(`  – with apply_url: ${final.filter(r => r.apply_url).length}`)

  if (dry) {
    console.log('\n--dry — not writing to DB. Sample row:')
    console.log(JSON.stringify(final[0], null, 2))
    return
  }

  let inserted = 0
  for (let i = 0; i < final.length; i += 100) {
    const chunk = final.slice(i, i + 100)
    const { error } = await supabase
      .from('ausbildung_jobs')
      .upsert(chunk, { onConflict: 'external_id' })
    if (error) { console.error('Supabase error:', error); process.exit(1) }
    inserted += chunk.length
    process.stdout.write(`\r▸ Upserted ${inserted}/${final.length}`)
  }
  console.log('\n✓ Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
