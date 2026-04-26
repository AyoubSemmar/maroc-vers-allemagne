// scripts/seed_programs_daad.mjs
//
// Seeds the `university_programs` table from the DAAD International
// Programmes catalog (https://www2.daad.de/deutschland/studienangebote/
// international-programmes/en/). DAAD exposes a public Solr search
// endpoint behind their search UI — we walk it page by page, extract
// the structured fields, and upsert into Supabase.
//
// Run:
//   node scripts/seed_programs_daad.mjs              # incremental
//   node scripts/seed_programs_daad.mjs --reset      # wipe + reseed
//   node scripts/seed_programs_daad.mjs --probe      # fetch ONE page, dump first record (debugging)
//   node scripts/seed_programs_daad.mjs --limit 50   # only first N programs (testing)

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
    .slice(0, 100)
}

// Map DAAD's degree string to our level enum.
function classifyLevel(deg) {
  const s = (deg || '').toLowerCase()
  if (/bachelor/.test(s)) return 'bachelor'
  if (/master/.test(s)) return 'master'
  if (/phd|doktor|promotion/.test(s)) return 'phd'
  if (/diplom/.test(s)) return 'diplom'
  if (/staatsex/.test(s)) return 'staatsexamen'
  return 'other'
}

// Heuristic category from program title (until we have proper subject IDs).
function classifyCategory(title) {
  const s = (title || '').toLowerCase()
  if (/comput|informatik|software|data scien|artificial intel|cyber|machine learning/.test(s)) return 'cs'
  if (/engineer|maschinen|elektro|mechatron|automotive|construction|bau|energy/.test(s)) return 'engineering'
  if (/medic|medizin|pharma|nursing|health|dental|veterinär/.test(s)) return 'medicine'
  if (/business|management|economic|wirtschaft|finance|marketing|mba|accounting/.test(s)) return 'business'
  if (/biolog|chem|physik|physic|mathematik|mathematics|geosci|astro|materials|nano/.test(s)) return 'science'
  if (/social|sociolog|politic|psycholog|anthropolog|public policy|relations|history|geschichte/.test(s)) return 'social'
  if (/art|design|musik|music|kunst|architect|film|theater|fashion/.test(s)) return 'arts'
  if (/law|recht|jura|legal/.test(s)) return 'law'
  if (/educat|teaching|pädagog|lehramt/.test(s)) return 'education'
  if (/agricult|forestry|landwirt|food|agro/.test(s)) return 'agriculture'
  return 'other'
}

function parseLanguage(val) {
  const s = (val || '').toLowerCase()
  if (s.includes('english') && s.includes('german')) return 'mixed'
  if (s.includes('english')) return 'en'
  if (s.includes('german') || s.includes('deutsch')) return 'de'
  return 'other'
}

// ── DAAD Solr endpoint ──────────────────────────────────────────
//
// The international-programmes search uses a public Solr-backed JSON
// API. We pass a wildcard query and walk through paginated results.
//
// If DAAD changes their endpoint URL, run --probe first to see the
// raw response and adjust the parsing.
const DAAD_BASE = 'https://www2.daad.de/deutschland/studienangebote/international-programmes/api/solr/v1/search'
const PER_PAGE = 100

async function fetchDaadPage(page) {
  const params = new URLSearchParams({
    q: '*:*',
    page: String(page),
    rows: String(PER_PAGE),
    sort: 'name asc',
    // Include all available fields
    fl: '*',
  })
  const url = `${DAAD_BASE}?${params}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'GoGermany/1.0 (mailto:contact@gogermany.ma)',
      'Accept': 'application/json',
    },
  })
  if (!res.ok) throw new Error(`DAAD ${res.status} on page ${page}: ${(await res.text()).slice(0, 300)}`)
  return res.json()
}

// ── Match program to existing university ────────────────────────

// Build a name → uni-id index from the existing universities table.
async function loadUniIndex() {
  const { data, error } = await supabase
    .from('universities')
    .select('id, name_de, name_en')
  if (error) throw error
  const index = new Map()
  function norm(s) {
    return s ? s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '') : ''
  }
  for (const u of data) {
    if (u.name_de) index.set(norm(u.name_de), u.id)
    if (u.name_en) index.set(norm(u.name_en), u.id)
  }
  return { index, norm, all: data }
}

// Try exact normalized match, then prefix/contains heuristic.
function matchUni({ index, norm, all }, name) {
  if (!name) return null
  const n = norm(name)
  if (index.has(n)) return index.get(n)
  // Strip common suffixes/prefixes
  const variants = [
    n.replace(/^universityof/, 'university'),
    n.replace(/university$/, ''),
    n.replace(/^technicaluniversityof/, 'technische universitat'),
  ]
  for (const v of variants) if (index.has(v)) return index.get(v)
  // Last-resort: longest substring match on name_de
  let best = null
  let bestLen = 0
  for (const u of all) {
    const target = norm(u.name_de || u.name_en || '')
    if (!target) continue
    if (target.includes(n) || n.includes(target)) {
      const overlap = Math.min(target.length, n.length)
      if (overlap > bestLen && overlap > 8) { best = u.id; bestLen = overlap }
    }
  }
  return best
}

// ── main ────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)
  const probe = args.includes('--probe')
  const reset = args.includes('--reset')
  const limitIdx = args.indexOf('--limit')
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity

  if (probe) {
    console.log('▸ Probing DAAD endpoint...')
    const json = await fetchDaadPage(1)
    console.log('Top-level keys:', Object.keys(json))
    const docs = json.results || json.docs || json.response?.docs || json.items || []
    console.log(`First page returned ${docs.length} programs`)
    if (docs[0]) {
      console.log('First program keys:', Object.keys(docs[0]))
      console.log('Sample record:')
      console.log(JSON.stringify(docs[0], null, 2).slice(0, 2000))
    }
    if (json.numFound) console.log(`Total programs available: ${json.numFound}`)
    return
  }

  if (reset) {
    console.log('▸ Resetting university_programs table (--reset)...')
    const { error } = await supabase.from('university_programs').delete().neq('id', '___never___')
    if (error) { console.error('Reset failed:', error); process.exit(1) }
    console.log('  ✓ Cleared.')
  }

  console.log('▸ Loading existing university index...')
  const uni = await loadUniIndex()
  console.log(`  ✓ ${uni.all.length} universities indexed`)

  console.log('▸ Walking DAAD International Programmes...')
  const records = []
  const unmatched = new Map() // uni-name -> count
  let page = 1
  let total = 0
  while (records.length < limit) {
    const json = await fetchDaadPage(page)
    const docs = json.results || json.docs || json.response?.docs || json.items || []
    if (docs.length === 0) break
    if (page === 1) total = json.numFound ?? json.total ?? json.meta?.count ?? '?'

    for (const d of docs) {
      // The exact field names depend on DAAD's Solr schema. Cover several
      // likely shapes (the --probe output will tell us which apply).
      const title = d.name || d.title || d.programme_name || d.label
      const uniName = d.university || d.hochschule || d.institution
      const degree = d.degree || d.degree_type || d.abschluss
      const language = d.language || d.languages || d.unterrichtssprache
      const url = d.url || d.profile_url || (d.id ? `https://www2.daad.de/deutschland/studienangebote/international-programmes/en/detail/${d.id}` : null)
      const programUrl = d.programme_url || d.uni_url || d.homepage
      const duration = d.duration || d.standard_duration_text
      const ects = d.ects ? parseInt(d.ects, 10) : null
      const winterDeadline = d.application_deadline_winter || d.deadline_winter
      const summerDeadline = d.application_deadline_summer || d.deadline_summer
      const tuition = d.tuition_fees || d.tuition_fee
      const requirements = d.admission_requirements || d.requirements || d.admission

      if (!title || !uniName) continue
      const uniId = matchUni(uni, uniName)
      if (!uniId) {
        unmatched.set(uniName, (unmatched.get(uniName) ?? 0) + 1)
        continue
      }
      const id = `${uniId}--${slugify(title)}`
      if (records.find(r => r.id === id)) continue

      records.push({
        id,
        university_id: uniId,
        hochschulkompass_id: null,
        title_de: title,            // DAAD often returns English; we'll let Phase 3 translate
        title_en: title,
        title_ar: null,
        title_fr: null,
        level: classifyLevel(degree),
        category: classifyCategory(title),
        language: parseLanguage(language),
        duration_semesters: duration ? (() => {
          const m = (typeof duration === 'string' ? duration : '').match(/(\d+)/)
          return m ? parseInt(m[1], 10) : null
        })() : null,
        ects,
        faculty: d.faculty || null,
        requirements_de: typeof requirements === 'string' ? requirements : null,
        requirements_en: typeof requirements === 'string' ? requirements : null,
        program_url: programUrl || null,
        hochschulkompass_url: typeof url === 'string' ? url : null,
        application_deadline_winter: typeof winterDeadline === 'string' ? winterDeadline : null,
        application_deadline_summer: typeof summerDeadline === 'string' ? summerDeadline : null,
        has_tuition: tuition ? !/^(free|none|kein|0)/i.test(String(tuition)) : null,
        semester_fee_eur: null,
      })

      if (records.length >= limit) break
    }
    process.stdout.write(`\r  page ${page}: ${records.length} programs collected (of ${total})`)
    page++
    await new Promise(r => setTimeout(r, 800)) // be polite
  }
  console.log()

  console.log(`▸ ${records.length} programs ready to upsert`)
  if (unmatched.size) {
    console.log(`  ⚠ Could not match ${unmatched.size} university names. Top 10:`)
    const sorted = [...unmatched.entries()].sort((a, b) => b[1] - a[1])
    for (const [name, n] of sorted.slice(0, 10)) console.log(`    – "${name}" (${n} programs)`)
  }

  let inserted = 0
  for (let i = 0; i < records.length; i += 100) {
    const chunk = records.slice(i, i + 100)
    const { error } = await supabase
      .from('university_programs')
      .upsert(chunk, { onConflict: 'id' })
    if (error) { console.error('Supabase error:', error); process.exit(1) }
    inserted += chunk.length
    process.stdout.write(`\r▸ Upserted ${inserted}/${records.length}`)
  }
  console.log('\n✓ Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
