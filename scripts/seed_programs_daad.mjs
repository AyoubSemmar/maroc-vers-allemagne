// scripts/seed_programs_daad.mjs (now Bundesagentur Studiensuche)
//
// Seeds the `university_programs` table from the Bundesagentur für Arbeit
// Studiensuche API — the federal government's catalog of every accredited
// German study program. Same auth pattern (X-API-Key) as the Jobsuche API
// already wired into app/api/fetch-jobs/route.ts.
//
// Endpoint: https://rest.arbeitsagentur.de/infosysbub/studiensuche/pc/v1/studienangebot
//
// Run:
//   node scripts/seed_programs_daad.mjs --probe       # dump first record
//   node scripts/seed_programs_daad.mjs --limit 200   # small test run
//   node scripts/seed_programs_daad.mjs               # full crawl
//   node scripts/seed_programs_daad.mjs --reset       # wipe + reseed

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

function classifyLevel(deg) {
  const s = (deg || '').toLowerCase()
  if (/bachelor|b\.\s*a\.|b\.\s*sc\.|b\.\s*eng/.test(s)) return 'bachelor'
  if (/master|m\.\s*a\.|m\.\s*sc\.|m\.\s*eng|m\.\s*ed/.test(s)) return 'master'
  if (/promotion|doktor|phd|ph\.\s*d/.test(s)) return 'phd'
  if (/diplom/.test(s)) return 'diplom'
  if (/staatsex/.test(s)) return 'staatsexamen'
  return 'other'
}

function classifyCategory(title) {
  const s = (title || '').toLowerCase()
  if (/informat|comput|software|data scien|künstliche intel|cyber|machine learn/.test(s)) return 'cs'
  if (/ingenieur|engineer|maschinenbau|elektrotechnik|mechatronik|automotive|bauingen|verfahren|energie/.test(s)) return 'engineering'
  if (/medizin|medic|pharma|pflege|nursing|gesundheit|zahnmedizin|veterinär|tiermedizin/.test(s)) return 'medicine'
  if (/wirtschaft|management|business|economic|finance|marketing|mba|controlling|bwl|vwl/.test(s)) return 'business'
  if (/biolog|chemi|physik|mathema|geowissen|astro|materialwiss|nano|geographie/.test(s)) return 'science'
  if (/sozial|soziolog|politik|psycholog|anthropolog|geschichte|history|history|kommunikation/.test(s)) return 'social'
  if (/kunst|design|musik|architekt|film|theater|mode|gestaltung/.test(s)) return 'arts'
  if (/recht|jura|law|legal/.test(s)) return 'law'
  if (/lehramt|pädagog|education|erziehung|bildung/.test(s)) return 'education'
  if (/agrar|forst|landwirt|ernährung|food|tierwissen/.test(s)) return 'agriculture'
  return 'other'
}

function parseLanguage(val) {
  const s = (val || '').toLowerCase()
  const en = /englisch|english/.test(s)
  const de = /deutsch|german/.test(s)
  if (en && de) return 'mixed'
  if (en) return 'en'
  if (de) return 'de'
  return 'other'
}

function parseDuration(val) {
  if (!val) return null
  const m = String(val).match(/(\d+)/)
  return m ? parseInt(m[1], 10) : null
}

// ── BA Studiensuche endpoint ────────────────────────────────────
const BA_URL = 'https://rest.arbeitsagentur.de/infosysbub/studiensuche/pc/v1/studienangebot'
const PER_PAGE = 100
const HEADERS = {
  'X-API-Key': 'studiensuche',
  'Accept': 'application/json',
}

async function fetchPage(page) {
  const url = new URL(BA_URL)
  url.searchParams.set('size', String(PER_PAGE))
  url.searchParams.set('page', String(page))
  const res = await fetch(url.toString(), { headers: HEADERS })
  if (!res.ok) throw new Error(`BA Studiensuche ${res.status} on page ${page}: ${(await res.text()).slice(0, 300)}`)
  return res.json()
}

// ── University matcher ──────────────────────────────────────────
async function loadUniIndex() {
  const { data, error } = await supabase
    .from('universities')
    .select('id, name_de, name_en')
  if (error) throw error
  const norm = (s) => s ? s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '') : ''
  const index = new Map()
  for (const u of data) {
    if (u.name_de) index.set(norm(u.name_de), u.id)
    if (u.name_en) index.set(norm(u.name_en), u.id)
  }
  return { index, norm, all: data }
}

function matchUni({ index, norm, all }, name) {
  if (!name) return null
  const n = norm(name)
  if (index.has(n)) return index.get(n)
  // Substring match
  let best = null, bestLen = 0
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
    console.log('▸ Probing BA Studiensuche endpoint...')
    const json = await fetchPage(0)
    console.log('Top-level keys:', Object.keys(json))
    const arr = json.studienangebote || json.embedded || json._embedded?.studienangebote || []
    console.log(`Records on page 0: ${arr.length}`)
    if (json.maxErgebnisse !== undefined) console.log(`Total available: ${json.maxErgebnisse}`)
    if (arr[0]) {
      console.log('First record keys:', Object.keys(arr[0]))
      console.log('First record:')
      console.log(JSON.stringify(arr[0], null, 2).slice(0, 3000))
    }
    return
  }

  if (reset) {
    console.log('▸ Resetting university_programs table (--reset)...')
    const { error } = await supabase.from('university_programs').delete().neq('id', '___never___')
    if (error) { console.error('Reset failed:', error); process.exit(1) }
    console.log('  ✓ Cleared.')
  }

  console.log('▸ Loading university index...')
  const uni = await loadUniIndex()
  console.log(`  ✓ ${uni.all.length} universities indexed`)

  console.log('▸ Walking BA Studiensuche...')
  const records = []
  const unmatched = new Map()
  let page = 0
  let total = '?'
  while (records.length < limit) {
    const json = await fetchPage(page)
    const arr = json.studienangebote || json.embedded || json._embedded?.studienangebote || []
    if (arr.length === 0) break
    if (page === 0) total = json.maxErgebnisse ?? '?'

    for (const d of arr) {
      const title = d.studienbezeichnung || d.studienfeld || d.titel
      const uniName = d.hochschule?.bezeichnung || d.hochschuleBezeichnung || d.hochschule
      const degree = d.abschluss || d.abschlussart
      const language = d.unterrichtssprache || d.sprache
      const duration = d.regelstudienzeit || d.dauer
      const url = d.url || (d.id ? `https://web.arbeitsagentur.de/studiensuche/studium/${d.id}` : null)

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
        hochschulkompass_id: d.id ? String(d.id) : null,
        title_de: title,
        title_en: null,
        title_ar: null,
        title_fr: null,
        level: classifyLevel(degree),
        category: classifyCategory(title),
        language: parseLanguage(language),
        duration_semesters: parseDuration(duration),
        ects: null,
        faculty: null,
        program_url: typeof d.webseite === 'string' ? d.webseite : null,
        hochschulkompass_url: url,
        application_deadline_winter: null,
        application_deadline_summer: null,
        has_tuition: null,
        semester_fee_eur: null,
      })

      if (records.length >= limit) break
    }
    process.stdout.write(`\r  page ${page}: ${records.length} programs (of ${total})`)
    page++
    await new Promise(r => setTimeout(r, 400))
  }
  console.log()

  console.log(`▸ ${records.length} programs ready`)
  if (unmatched.size) {
    console.log(`  ⚠ Could not match ${unmatched.size} university names. Top 10:`)
    for (const [name, n] of [...unmatched.entries()].sort((a,b) => b[1]-a[1]).slice(0, 10)) {
      console.log(`    – "${name}" (${n} programs)`)
    }
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
