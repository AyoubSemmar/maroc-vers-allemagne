/**
 * Insert 5 test Pflege-Ausbildung listings from the public Arbeitsagentur
 * Jobsuche API into ausbildung_jobs.
 *
 * Tagged with source='arbeitsagentur_api_test' so they can be removed with
 * one DELETE: see scripts/remove-arbeitsagentur-test.ts.
 *
 * Usage:
 *   npx tsx scripts/seed-arbeitsagentur-test.ts
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const TEST_SOURCE = 'arbeitsagentur_api_test'
const FETCH_COUNT = 5
const API_URL =
  'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs' +
  '?angebotsart=4&was=Pflegefachmann&size=20'

// ── Load env ──
for (const fname of ['.env.local', '.env.development.local', '.env']) {
  const envPath = path.join(process.cwd(), fname)
  if (!fs.existsSync(envPath)) continue
  let text = fs.readFileSync(envPath, 'utf8')
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let val = line.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

type ArbItem = {
  beruf?: string
  titel?: string
  refnr: string
  arbeitsort?: { plz?: string; ort?: string; region?: string; land?: string }
  arbeitgeber?: string
  aktuelleVeroeffentlichungsdatum?: string
  eintrittsdatum?: string
}

async function main() {
  console.log(`🔎 Fetching from Arbeitsagentur API …`)
  const res = await fetch(API_URL, { headers: { 'X-API-Key': 'jobboerse-jobsuche' } })
  if (!res.ok) {
    console.error(`❌ API returned ${res.status}`)
    process.exit(1)
  }
  const data = (await res.json()) as { stellenangebote?: ArbItem[]; maxErgebnisse?: number }
  const all = data.stellenangebote ?? []
  console.log(`✓ API returned ${all.length} of ${data.maxErgebnisse ?? '?'} total listings`)

  // Pick the first 5 with a real employer name and city
  const picked = all
    .filter((j) => j.arbeitgeber && j.arbeitsort?.ort && j.refnr)
    .slice(0, FETCH_COUNT)

  if (picked.length === 0) {
    console.error('❌ No usable listings returned.')
    process.exit(1)
  }

  const rows = picked.map((j) => {
    const ort = j.arbeitsort?.ort ?? '—'
    const plz = j.arbeitsort?.plz ?? ''
    const region = j.arbeitsort?.region ?? ''
    const location = [plz, ort, region].filter(Boolean).join(' · ')
    return {
      external_id: `arb-${j.refnr}`,
      title: j.titel || j.beruf || 'Pflege Ausbildung',
      company: j.arbeitgeber!,
      location,
      description: '',
      category: 'healthcare',
      source: TEST_SOURCE,
      external_url: `https://www.arbeitsagentur.de/jobsuche/jobdetail/${j.refnr}`,
      apply_url: `https://www.arbeitsagentur.de/jobsuche/jobdetail/${j.refnr}`,
      contact_email: null,
      anstellungsart: 'Ausbildung',
      published_at: j.aktuelleVeroeffentlichungsdatum ?? null,
    }
  })

  console.log(`📋 Will insert ${rows.length} rows tagged source='${TEST_SOURCE}':`)
  for (const r of rows) {
    console.log(`   • ${r.title} — ${r.company} (${r.location})`)
  }

  const supabase = createClient(SUPABASE_URL!, SERVICE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { error, count } = await supabase
    .from('ausbildung_jobs')
    .upsert(rows, { onConflict: 'external_id', count: 'exact', ignoreDuplicates: false })

  if (error) {
    console.error('❌ Upsert failed:', error)
    process.exit(1)
  }
  console.log(`✅ Upserted ${count ?? rows.length} rows.`)
  console.log(`\n↩  To remove: npx tsx scripts/remove-arbeitsagentur-test.ts`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
