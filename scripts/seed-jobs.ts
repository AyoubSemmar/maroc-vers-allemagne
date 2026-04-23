/**
 * Seed Ausbildung jobs from an Apify JSON export.
 *
 * Usage:
 *   npx tsx scripts/seed-jobs.ts <path-to-json>
 *
 * Example:
 *   npx tsx scripts/seed-jobs.ts "C:/Users/ayoub/Downloads/dataset_arbeitsagentur-pflege-scraper_2026-04-23_06-40-44-140.json"
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { categorizeJob } from '../lib/categorizeJobs'

// ── Load env from .env.local, .env.development.local, .env ──
for (const fname of ['.env.local', '.env.development.local', '.env']) {
  const envPath = path.join(process.cwd(), fname)
  if (!fs.existsSync(envPath)) continue
  let text = fs.readFileSync(envPath, 'utf8')
  // strip UTF-8 BOM
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1)
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let val = line.slice(eq + 1).trim()
    // strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
  console.log(`📁 loaded ${fname}`)
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing env vars.')
  console.error('   NEXT_PUBLIC_SUPABASE_URL      =', SUPABASE_URL ? '✓ set' : '✗ missing')
  console.error('   SUPABASE_SERVICE_ROLE_KEY     =', SERVICE_KEY ? '✓ set' : '✗ missing')
  console.error('\nAdd them to .env.local in the project root, e.g.:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co')
  console.error('   SUPABASE_SERVICE_ROLE_KEY=eyJ...')
  process.exit(1)
}

type ApifyJob = {
  title: string
  company: string
  city: string
  anstellungsart: string | null
  email: string | null
  apply_url: string | null
}

async function main() {
  const jsonFile = process.argv[2]
  if (!jsonFile) {
    console.error('Usage: npx tsx scripts/seed-jobs.ts <path-to-json>')
    process.exit(1)
  }

  const abs = path.isAbsolute(jsonFile) ? jsonFile : path.join(process.cwd(), jsonFile)
  if (!fs.existsSync(abs)) {
    console.error(`❌ File not found: ${abs}`)
    process.exit(1)
  }

  const raw = fs.readFileSync(abs, 'utf8')
  const items = JSON.parse(raw) as ApifyJob[]
  console.log(`📄 Loaded ${items.length} records from ${path.basename(abs)}`)

  const supabase = createClient(SUPABASE_URL!, SERVICE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const seen = new Set<string>()
  const rows: any[] = []
  let skipped = 0

  for (const j of items) {
    const title = (j.title || '').trim()
    const company = (j.company || '').trim()
    const city = (j.city || '').trim()
    if (!title) { skipped++; continue }

    // Stable hash-based external_id (no native ID in Apify export)
    const hashInput = `${title}|${company}|${city}`
    const externalId = 'apify-' + crypto.createHash('sha1').update(hashInput).digest('hex').slice(0, 16)
    if (seen.has(externalId)) { skipped++; continue }
    seen.add(externalId)

    // Fallback to 'healthcare' — all Pflege scrapes map there
    const category = categorizeJob(title) || 'healthcare'

    rows.push({
      external_id: externalId,
      title,
      company: company || '—',
      location: city || '—',
      description: '',
      category,
      source: 'apify',
      external_url: j.apply_url || null,
      apply_url: j.apply_url || null,
      contact_email: j.email || null,
      anstellungsart: j.anstellungsart || null,
      published_at: null,
    })
  }

  console.log(`🔹 ${rows.length} unique rows prepared (${skipped} skipped)`)

  if (rows.length === 0) {
    console.log('Nothing to insert.')
    return
  }

  // Upsert in chunks of 100
  let inserted = 0
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100)
    const { error, count } = await supabase
      .from('ausbildung_jobs')
      .upsert(chunk, { onConflict: 'external_id', count: 'exact', ignoreDuplicates: false })
    if (error) {
      console.error('❌ Upsert error:', error)
      process.exit(1)
    }
    inserted += count ?? chunk.length
  }

  console.log(`✅ Upserted ${inserted} jobs into ausbildung_jobs`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
