// scripts/seed_universities.mjs
//
// Phase 1: seed the `universities` table from Wikidata.
//
// Run with:
//   node scripts/seed_universities.mjs
//
// Requires env vars in .env.local (or shell):
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   ← needed to bypass RLS for inserts
//
// Pulls every higher-education institution in Germany from the public
// Wikidata SPARQL endpoint, normalizes the rows, and upserts into
// Supabase by wikidata_id. Safe to re-run — only changes diffs apply.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Tiny .env.local loader (no extra dep). Skips quietly if absent.
try {
  const env = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
} catch {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  console.error('Add SUPABASE_SERVICE_ROLE_KEY to .env.local (find it in Supabase → Project Settings → API).')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

// ── Wikidata SPARQL ────────────────────────────────────────────
//
// Restricted to a curated set of *specific* higher-ed classes (university,
// Fachhochschule, Kunsthochschule, Musikhochschule, Technische Universität,
// Pädagogische Hochschule), excluding dissolved entities and requiring
// either a website or a known student count to weed out tiny seminaries
// and individual research institutes that pollute the broader Q38723 tree.
const HE_CLASSES = [
  'wd:Q3918',        // university
  'wd:Q875538',      // public university
  'wd:Q1244442',     // school district / Fachhochschule (HAW)
  'wd:Q1059546',     // university of applied sciences
  'wd:Q1469925',     // Pädagogische Hochschule
  'wd:Q1146291',     // Kunsthochschule
  'wd:Q955824',      // Musikhochschule (school of music)
  'wd:Q1321960',     // Technische Hochschule
  'wd:Q1322441',     // Technische Universität
  'wd:Q1814884',     // Berufsakademie
  'wd:Q4358176',     // Hochschule (German higher-ed institution generic)
].join(' ')

const SPARQL = `
SELECT DISTINCT ?uni
       (SAMPLE(?nameDe) AS ?name_de)
       (SAMPLE(?nameEn) AS ?name_en)
       (SAMPLE(?nameAr) AS ?name_ar)
       (SAMPLE(?nameFr) AS ?name_fr)
       (SAMPLE(?cityLabel) AS ?city)
       (SAMPLE(?stateLabel) AS ?state)
       (SAMPLE(?founded) AS ?founded)
       (SAMPLE(?students) AS ?students)
       (SAMPLE(?website) AS ?website)
       (SAMPLE(?logo) AS ?logo)
       (SAMPLE(?coords) AS ?coords)
       (SAMPLE(?typeLabel) AS ?type_label)
WHERE {
  VALUES ?heClass { ${HE_CLASSES} }
  ?uni wdt:P31 ?heClass .
  ?uni wdt:P17 wd:Q183 .

  # Exclude dissolved / historical institutions
  FILTER NOT EXISTS { ?uni wdt:P576 ?dissolved . }

  # Require at least a website OR a student count — drops phantom entries
  ?uni wdt:P856|wdt:P2196 ?_anchor .

  OPTIONAL { ?uni rdfs:label ?nameDe FILTER(LANG(?nameDe) = "de"). }
  OPTIONAL { ?uni rdfs:label ?nameEn FILTER(LANG(?nameEn) = "en"). }
  OPTIONAL { ?uni rdfs:label ?nameAr FILTER(LANG(?nameAr) = "ar"). }
  OPTIONAL { ?uni rdfs:label ?nameFr FILTER(LANG(?nameFr) = "fr"). }

  OPTIONAL {
    ?uni wdt:P276 ?city .
    ?city rdfs:label ?cityLabel FILTER(LANG(?cityLabel) = "de").
  }
  OPTIONAL {
    ?uni wdt:P131 ?state .
    ?state wdt:P31 wd:Q1221156 .
    ?state rdfs:label ?stateLabel FILTER(LANG(?stateLabel) = "de").
  }
  OPTIONAL { ?uni wdt:P571 ?founded . }
  OPTIONAL { ?uni wdt:P2196 ?students . }
  OPTIONAL { ?uni wdt:P856 ?website . }
  OPTIONAL { ?uni wdt:P154 ?logo . }
  OPTIONAL { ?uni wdt:P625 ?coords . }
  OPTIONAL {
    ?uni wdt:P31 ?t .
    ?t rdfs:label ?typeLabel FILTER(LANG(?typeLabel) = "en").
  }
}
GROUP BY ?uni
ORDER BY ?name_de
`

async function fetchWikidata() {
  const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(SPARQL)
  console.log('▸ Querying Wikidata SPARQL endpoint...')
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/sparql-results+json',
      'User-Agent': 'GoGermany/1.0 (https://gogermany.ma; contact@gogermany.ma)',
    },
  })
  if (!res.ok) throw new Error(`Wikidata returned ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.results.bindings
}

// ── Helpers ─────────────────────────────────────────────────────

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function classifyType(typeLabel) {
  if (!typeLabel) return 'university'
  const s = typeLabel.toLowerCase()
  if (s.includes('applied sciences') || s.includes('fachhochschule')) return 'applied_sciences'
  if (s.includes('art') || s.includes('kunst')) return 'art'
  if (s.includes('music') || s.includes('musik')) return 'music'
  if (s.includes('technical') || s.includes('technische')) return 'technical'
  if (s.includes('medical') || s.includes('medizin')) return 'medical'
  if (s.includes('theological') || s.includes('theologische')) return 'theological'
  if (s.includes('pedagogical') || s.includes('pädagogische')) return 'pedagogical'
  if (s.includes('dual')) return 'dual'
  return 'university'
}

function parseCoords(wkt) {
  // Wikidata returns "Point(LON LAT)"
  if (!wkt) return { lat: null, lng: null }
  const m = wkt.match(/Point\(([-\d.]+)\s+([-\d.]+)\)/)
  if (!m) return { lat: null, lng: null }
  return { lng: parseFloat(m[1]), lat: parseFloat(m[2]) }
}

function parseYear(iso) {
  if (!iso) return null
  const m = iso.match(/(-?\d+)-/)
  return m ? parseInt(m[1], 10) : null
}

// Known German private universities — flagged so we can exclude them
// from the public-only filter on the frontend.
const KNOWN_PRIVATE = new Set([
  'iu-internationale-hochschule',
  'hochschule-fresenius',
  'jacobs-university',
  'constructor-university',
  'witten-herdecke-universitaet',
  'private-universitaet-witten-herdecke',
  'bucerius-law-school',
  'frankfurt-school-of-finance-management',
  'esmt-berlin',
  'hertie-school',
  'wfi-ingolstadt',
  'whu-otto-beisheim-school-of-management',
  'zeppelin-universitaet',
  'sigmund-freud-privatuniversitat',
  'ebs-universitaet-fur-wirtschaft-und-recht',
  'hochschule-fur-philosophie-munchen',
  'cbs-international-business-school',
  'fom-hochschule',
  'ism-international-school-of-management',
  'munich-business-school',
  'macromedia-hochschule',
  'srh-hochschule',
  'steinbeis-hochschule',
])

// ── Quality filter ──────────────────────────────────────────────
// Wikidata's higher-ed classes pull a lot of noise (private vocational
// schools, branch campuses, generic "Schule X" stubs). Require:
// non-trivial name + a real city. Keyword filtering was tried but
// dropped legit cases like "RWTH Aachen" / "Charité" whose primary
// German label has no "Universität" word.

const STUB_PREFIXES = /^(Schule|Privatschule|Berufsschule|Realschule|Gymnasium|Grundschule|Volksschule|Kindergarten|Kita|Internat)\b/i

function isLegitInstitution(rec) {
  if (!rec.name_de || rec.name_de.length < 6) return false
  if (!rec.city) return false
  if (STUB_PREFIXES.test(rec.name_de)) return false
  // Must have at least website OR student_count > 500 to weed out phantom
  // entries — very small specialized institutions still pass if they have
  // a website even without student count.
  if (!rec.website && (!rec.student_count || rec.student_count < 500)) return false
  return true
}

function websiteHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase()
  } catch { return null }
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  // Pass --reset to wipe the table before re-seeding (use after tightening
  // the SPARQL filter so stale rows from a broader earlier query are dropped).
  if (process.argv.includes('--reset')) {
    console.log('▸ Resetting universities table (--reset)...')
    const { error } = await supabase.from('universities').delete().neq('id', '___never___')
    if (error) { console.error('Reset failed:', error); process.exit(1) }
    console.log('  ✓ Cleared.')
  }

  const rows = await fetchWikidata()
  console.log(`▸ Got ${rows.length} institutions from Wikidata`)

  const records = []
  const seenSlug = new Set()
  const seenHost = new Map() // host -> existing record (keep the one with more data)
  let droppedNoData = 0
  let droppedNotLegit = 0

  for (const r of rows) {
    const wikidataId = r.uni.value.split('/').pop()
    const nameDe = r.name_de?.value || r.name_en?.value
    if (!nameDe) { droppedNoData++; continue }

    const { lat, lng } = parseCoords(r.coords?.value)
    const candidate = {
      id: slugify(nameDe),
      wikidata_id: wikidataId,
      name_de: nameDe,
      name_en: r.name_en?.value ?? null,
      name_ar: r.name_ar?.value ?? null,
      name_fr: r.name_fr?.value ?? null,
      city: r.city?.value ?? null,
      state: r.state?.value ?? null,
      country_code: 'DE',
      type: classifyType(r.type_label?.value),
      is_public: true,
      founded: parseYear(r.founded?.value),
      student_count: r.students?.value ? parseInt(r.students.value, 10) : null,
      website: r.website?.value ?? null,
      logo_url: r.logo?.value ?? null,
      lat, lng,
    }
    candidate.is_public = !KNOWN_PRIVATE.has(candidate.id)

    if (!isLegitInstitution(candidate)) { droppedNotLegit++; continue }

    // Dedupe by slug
    if (seenSlug.has(candidate.id)) continue

    // Dedupe by website host — same domain almost certainly same uni.
    // Keep whichever has more populated fields.
    const host = websiteHost(candidate.website)
    if (host && seenHost.has(host)) {
      const existing = seenHost.get(host)
      const score = (rec) => Object.values(rec).filter(v => v != null && v !== '').length
      if (score(candidate) <= score(existing)) continue
      // candidate is better; replace
      const idx = records.indexOf(existing)
      if (idx >= 0) records.splice(idx, 1)
      seenSlug.delete(existing.id)
    }

    seenSlug.add(candidate.id)
    if (host) seenHost.set(host, candidate)
    records.push(candidate)
  }

  console.log(`▸ Kept ${records.length} institutions after quality filter`)
  console.log(`  – dropped (no name): ${droppedNoData}`)
  console.log(`  – dropped (not real higher-ed): ${droppedNotLegit}`)
  console.log(`  – public: ${records.filter(r => r.is_public).length}`)
  console.log(`  – private: ${records.filter(r => !r.is_public).length}`)

  // Upsert in chunks of 100 to keep payload sizes reasonable.
  const chunkSize = 100
  let inserted = 0
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize)
    const { error } = await supabase
      .from('universities')
      .upsert(chunk, { onConflict: 'id' })
    if (error) {
      console.error('Supabase error:', error)
      process.exit(1)
    }
    inserted += chunk.length
    process.stdout.write(`\r▸ Upserted ${inserted}/${records.length}`)
  }
  console.log('\n✓ Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
