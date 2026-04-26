// scripts/seed_universities.mjs
//
// Seeds the `universities` table from OpenAlex
// (https://docs.openalex.org/api-entities/institutions). OpenAlex is a free,
// well-maintained scholarly knowledge graph with structured data on every
// recognized educational institution worldwide. Each row already has:
//   - multilingual display_name (de/en/fr/ar)
//   - geo.city, geo.region, geo.latitude, geo.longitude
//   - homepage_url, image_thumbnail_url
//   - type (education / healthcare / government / ...)
//   - ROR ID (research organization registry)
//
// Run:
//   node scripts/seed_universities.mjs           # incremental upsert
//   node scripts/seed_universities.mjs --reset   # wipe + reseed

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
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

// ── helpers ─────────────────────────────────────────────────────
function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function classifyType(name) {
  const s = (name || '').toLowerCase()
  if (/fachhochschule|hochschule für angewandte|university of applied/.test(s)) return 'applied_sciences'
  if (/technische universität|technische hochschule|^tu\b|^th\b/.test(s)) return 'technical'
  if (/kunsthochschule|hochschule für (?:bildende )?kunst|academy of fine arts|akademie der bildenden|kunstakademie/.test(s)) return 'art'
  if (/musikhochschule|hochschule für musik|conservatory|musikakademie/.test(s)) return 'music'
  if (/medizinische hochschule|medical school|charité/.test(s)) return 'medical'
  if (/pädagogische hochschule|university of education/.test(s)) return 'pedagogical'
  if (/theologische hochschule|hochschule für theolog|theological/.test(s)) return 'theological'
  if (/duale hochschule|cooperative state/.test(s)) return 'dual'
  return 'university'
}

const KNOWN_PRIVATE_DOMAIN = new Set([
  'iu.de', 'iubh.de',
  'fh-fresenius.de', 'hs-fresenius.de',
  'jacobs-university.de', 'constructor.university',
  'uni-wh.de',
  'law-school.de',
  'frankfurt-school.de',
  'esmt.berlin', 'esmt.org',
  'hertie-school.org',
  'whu.edu',
  'sfu-berlin.de',
  'ebs.edu',
  'cbs.de',
  'fom.de',
  'ism.de',
  'munich-business-school.de',
  'macromedia.de',
  'srh.de',
  'steinbeis-hochschule.de',
])

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase() }
  catch { return null }
}

// ── OpenAlex fetch ──────────────────────────────────────────────
const OPENALEX_BASE = 'https://api.openalex.org/institutions'
// type:education = universities + colleges (not hospitals/govt/companies)
const FILTER = 'country_code:de,type:education'
const PER_PAGE = 200

async function fetchOpenAlex() {
  console.log('▸ Fetching German educational institutions from OpenAlex...')
  const all = []
  let cursor = '*'
  let page = 0
  while (cursor) {
    page++
    const url = `${OPENALEX_BASE}?filter=${FILTER}&per_page=${PER_PAGE}&cursor=${encodeURIComponent(cursor)}`
    const res = await fetch(url, {
      headers: {
        // Polite-pool: passing a contact email gets us the higher rate-limit tier
        'User-Agent': 'GoGermany/1.0 (mailto:contact@gogermany.ma)',
      },
    })
    if (!res.ok) {
      throw new Error(`OpenAlex returned ${res.status}: ${await res.text()}`)
    }
    const json = await res.json()
    all.push(...json.results)
    process.stdout.write(`\r  page ${page}: ${all.length}/${json.meta.count} loaded`)
    cursor = json.meta.next_cursor
    if (!cursor || json.results.length === 0) break
  }
  console.log()
  return all
}

// ── main ────────────────────────────────────────────────────────
async function main() {
  if (process.argv.includes('--reset')) {
    console.log('▸ Resetting universities table (--reset)...')
    const { error } = await supabase.from('universities').delete().neq('id', '___never___')
    if (error) { console.error('Reset failed:', error); process.exit(1) }
    console.log('  ✓ Cleared.')
  }

  const raw = await fetchOpenAlex()
  console.log(`▸ ${raw.length} institutions returned by OpenAlex`)

  const records = []
  const seenSlug = new Set()
  const seenHost = new Set()
  let skippedNoHome = 0
  let skippedNoName = 0

  for (const inst of raw) {
    const homepage = inst.homepage_url
    if (!homepage) { skippedNoHome++; continue }

    const nameDe =
      inst.international?.display_name?.de ||
      inst.display_name
    const nameEn =
      inst.international?.display_name?.en ||
      inst.display_name
    if (!nameDe || nameDe.length < 4) { skippedNoName++; continue }

    const id = slugify(nameDe)
    if (!id || seenSlug.has(id)) continue

    const host = hostOf(homepage)
    if (host && seenHost.has(host)) continue

    const geo = inst.geo || {}
    const wikidataUrl = inst.ids?.wikidata
    const wikidataId = wikidataUrl ? wikidataUrl.split('/').pop() : null

    records.push({
      id,
      wikidata_id: wikidataId,
      name_de: nameDe,
      name_en: nameEn !== nameDe ? nameEn : null,
      name_ar: inst.international?.display_name?.ar || null,
      name_fr: inst.international?.display_name?.fr || null,
      city: geo.city ?? null,
      state: geo.region ?? null,
      country_code: 'DE',
      type: classifyType(nameDe),
      is_public: !(host && KNOWN_PRIVATE_DOMAIN.has(host)),
      founded: null,                                     // OpenAlex doesn't have this
      student_count: null,                               // nor this directly
      website: homepage,
      logo_url:
        inst.image_thumbnail_url ||
        inst.image_url ||
        (host ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128` : null),
      lat: geo.latitude ?? null,
      lng: geo.longitude ?? null,
    })
    seenSlug.add(id)
    if (host) seenHost.add(host)
  }

  console.log(`▸ ${records.length} clean records ready`)
  console.log(`  – with city: ${records.filter(r => r.city).length}`)
  console.log(`  – with logo: ${records.filter(r => r.logo_url).length}`)
  console.log(`  – with state/region: ${records.filter(r => r.state).length}`)
  console.log(`  – public: ${records.filter(r => r.is_public).length}`)
  console.log(`  – private: ${records.filter(r => !r.is_public).length}`)
  console.log(`  – skipped (no homepage): ${skippedNoHome}`)
  console.log(`  – skipped (no name): ${skippedNoName}`)

  // Upsert in chunks of 100.
  let inserted = 0
  for (let i = 0; i < records.length; i += 100) {
    const chunk = records.slice(i, i + 100)
    const { error } = await supabase
      .from('universities')
      .upsert(chunk, { onConflict: 'id' })
    if (error) { console.error('Supabase error:', error); process.exit(1) }
    inserted += chunk.length
    process.stdout.write(`\r▸ Upserted ${inserted}/${records.length}`)
  }
  console.log('\n✓ Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
