// scripts/import_goausbildung.mjs
//
// Imports a goausbildung.com scraper export (JSON array of
// {title, company, city, description, email, phone, website, job_url})
// into the `ausbildung_jobs` table.
//
// Run:
//   node scripts/import_goausbildung.mjs <path>.json --category education
//   node scripts/import_goausbildung.mjs <path>.json --category media --dry
//
// `--category` is REQUIRED: the auto-categorizer in lib/jobCategories.ts
// doesn't reliably handle the broad "media" / "education" sectors, so the
// caller specifies the bucket per-file.
//
// Requires the 0003 migration (adds the `phone` column) to be applied first.

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

const VALID_CATEGORIES = new Set([
  'hospitality', 'handwerk', 'it', 'healthcare', 'logistics', 'education', 'media',
  'public_service', 'retail', 'automotive', 'engineering', 'finance',
])

// goausbildung.com uses `hello@goausbildung.com` as a relay when the employer
// hasn't published a direct contact email — treat it as "no email" for dedup
// and contact-display purposes.
const EMAIL_RELAY = 'hello@goausbildung.com'

function externalIdFor(rec) {
  const seed = `${rec.title}|${rec.company}|${rec.city}|${rec.email ?? ''}|${rec.website ?? ''}|${rec.job_url ?? ''}`
  return 'goa-' + createHash('sha1').update(seed).digest('hex').slice(0, 16)
}

async function main() {
  const args = process.argv.slice(2)
  const path = args.find(a => !a.startsWith('--'))
  if (!path) {
    console.error('Usage: node scripts/import_goausbildung.mjs <path>.json --category {education|media|...} [--dry]')
    process.exit(1)
  }
  const dry = args.includes('--dry')
  const catIdx = args.indexOf('--category')
  const category = catIdx >= 0 ? args[catIdx + 1] : null
  if (!category || !VALID_CATEGORIES.has(category)) {
    console.error(`--category is required and must be one of: ${[...VALID_CATEGORIES].join(', ')}`)
    process.exit(1)
  }

  const raw = JSON.parse(readFileSync(path, 'utf8'))
  console.log(`▸ Loaded ${raw.length} rows from ${path}`)

  const now = new Date().toISOString()
  const records = []
  let skipped = 0
  for (const r of raw) {
    if (!r.title || !r.company) { skipped++; continue }
    const realEmail = r.email && r.email.toLowerCase() !== EMAIL_RELAY ? r.email : null
    records.push({
      external_id: externalIdFor(r),
      title: r.title,
      company: r.company,
      location: r.city || '—',
      description: r.description || null,
      category,
      source: 'goausbildung',
      external_url: r.job_url || null,        // provenance: the goausbildung.com listing
      apply_url: r.website || null,           // employer's apply page (where users go)
      contact_email: realEmail,
      phone: r.phone || null,
      anstellungsart: null,                   // not in this export
      published_at: now,
      created_at: now,
    })
  }

  // De-dupe within batch:
  //   1. exact external_id collisions
  //   2. same contact_email
  //   3. same apply_url
  //   4. same external_url (same goausbildung listing)
  const byId = new Map()
  for (const rec of records) byId.set(rec.external_id, rec)
  if (records.length !== byId.size) {
    console.log(`▸ Dedupe by external_id (same posting): ${records.length} → ${byId.size}`)
  }
  const seenEmails = new Set()
  const seenApply = new Set()
  const seenExt = new Set()
  const dedupedInBatch = []
  let dropDupEmail = 0, dropDupApply = 0, dropDupExt = 0
  for (const rec of byId.values()) {
    const emailKey = (rec.contact_email || '').toLowerCase().trim()
    const applyKey = (rec.apply_url || '').toLowerCase().trim()
    const extKey = (rec.external_url || '').toLowerCase().trim()
    if (emailKey && seenEmails.has(emailKey)) { dropDupEmail++; continue }
    if (applyKey && seenApply.has(applyKey)) { dropDupApply++; continue }
    if (extKey && seenExt.has(extKey)) { dropDupExt++; continue }
    if (emailKey) seenEmails.add(emailKey)
    if (applyKey) seenApply.add(applyKey)
    if (extKey) seenExt.add(extKey)
    dedupedInBatch.push(rec)
  }
  console.log(`▸ Dedupe within batch: dropped ${dropDupEmail} same-email, ${dropDupApply} same-apply, ${dropDupExt} same-listing`)

  // De-dupe vs DB
  const emailsToCheck = [...seenEmails]
  const applyToCheck = [...seenApply]
  const extToCheck = [...seenExt]
  const existingEmails = new Set()
  const existingApply = new Set()
  const existingExt = new Set()
  if (emailsToCheck.length > 0) {
    const { data } = await supabase
      .from('ausbildung_jobs').select('contact_email').in('contact_email', emailsToCheck)
    for (const r of data ?? []) if (r.contact_email) existingEmails.add(r.contact_email.toLowerCase().trim())
  }
  if (applyToCheck.length > 0) {
    const { data } = await supabase
      .from('ausbildung_jobs').select('apply_url').in('apply_url', applyToCheck)
    for (const r of data ?? []) if (r.apply_url) existingApply.add(r.apply_url.toLowerCase().trim())
  }
  if (extToCheck.length > 0) {
    const { data } = await supabase
      .from('ausbildung_jobs').select('external_url').in('external_url', extToCheck)
    for (const r of data ?? []) if (r.external_url) existingExt.add(r.external_url.toLowerCase().trim())
  }
  const final = []
  let dropDbEmail = 0, dropDbApply = 0, dropDbExt = 0
  for (const rec of dedupedInBatch) {
    const emailKey = (rec.contact_email || '').toLowerCase().trim()
    const applyKey = (rec.apply_url || '').toLowerCase().trim()
    const extKey = (rec.external_url || '').toLowerCase().trim()
    if (emailKey && existingEmails.has(emailKey)) { dropDbEmail++; continue }
    if (applyKey && existingApply.has(applyKey)) { dropDbApply++; continue }
    if (extKey && existingExt.has(extKey)) { dropDbExt++; continue }
    final.push(rec)
  }
  console.log(`▸ Dedupe vs DB: dropped ${dropDbEmail} email-exists, ${dropDbApply} apply-exists, ${dropDbExt} listing-exists`)

  console.log(`▸ Built ${final.length} records (skipped ${skipped})`)
  console.log(`  – category: ${category}`)
  console.log(`  – with email     : ${final.filter(r => r.contact_email).length}`)
  console.log(`  – with phone     : ${final.filter(r => r.phone).length}`)
  console.log(`  – with apply_url : ${final.filter(r => r.apply_url).length}`)
  console.log(`  – with description: ${final.filter(r => r.description).length}`)

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
