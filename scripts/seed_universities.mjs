// scripts/seed_universities.mjs
//
// Seeds the `universities` table from the open-source "university-domains-list"
// (https://github.com/Hipo/university-domains-list) — a curated, community-
// maintained JSON list of universities worldwide. Filters to Germany and
// upserts into Supabase.
//
// Run:
//   node scripts/seed_universities.mjs            # incremental upsert
//   node scripts/seed_universities.mjs --reset    # wipe + reseed
//
// Requires .env.local with:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

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

// "Karlsruher" → "Karlsruhe", "Münchner" → "München", etc.
const CITY_NORMALIZE = {
  'Karlsruher': 'Karlsruhe',
  'Hamburger': 'Hamburg',
  'Berliner': 'Berlin',
  'Münchner': 'München',
  'Münchener': 'München',
  'Frankfurter': 'Frankfurt am Main',
  'Stuttgarter': 'Stuttgart',
  'Dresdner': 'Dresden',
  'Leipziger': 'Leipzig',
  'Kölner': 'Köln',
  'Bonner': 'Bonn',
  'Heidelberger': 'Heidelberg',
  'Mainzer': 'Mainz',
  'Tübinger': 'Tübingen',
  'Würzburger': 'Würzburg',
  'Nürnberger': 'Nürnberg',
  'Erlanger': 'Erlangen',
  'Bremer': 'Bremen',
  'Hannoveraner': 'Hannover',
  'Bochumer': 'Bochum',
  'Duisburger': 'Duisburg',
  'Essener': 'Essen',
  'Aachener': 'Aachen',
  'Augsburger': 'Augsburg',
  'Bayreuther': 'Bayreuth',
  'Bielefelder': 'Bielefeld',
  'Braunschweiger': 'Braunschweig',
  'Chemnitzer': 'Chemnitz',
  'Dortmunder': 'Dortmund',
  'Düsseldorfer': 'Düsseldorf',
  'Freiburger': 'Freiburg im Breisgau',
  'Gießener': 'Gießen',
  'Göttinger': 'Göttingen',
  'Greifswalder': 'Greifswald',
  'Hallenser': 'Halle',
  'Jenaer': 'Jena',
  'Kasseler': 'Kassel',
  'Kieler': 'Kiel',
  'Konstanzer': 'Konstanz',
  'Magdeburger': 'Magdeburg',
  'Marburger': 'Marburg',
  'Münsteraner': 'Münster',
  'Oldenburger': 'Oldenburg',
  'Osnabrücker': 'Osnabrück',
  'Paderborner': 'Paderborn',
  'Passauer': 'Passau',
  'Potsdamer': 'Potsdam',
  'Regensburger': 'Regensburg',
  'Rostocker': 'Rostock',
  'Saarbrücker': 'Saarbrücken',
  'Saarländer': 'Saarbrücken',
  'Siegener': 'Siegen',
  'Trierer': 'Trier',
  'Ulmer': 'Ulm',
  'Wiesbadener': 'Wiesbaden',
  'Weimarer': 'Weimar',
  'Wuppertaler': 'Wuppertal',
}

// Hard-coded city overrides for famous unis whose name doesn't carry the city.
const CITY_OVERRIDE = {
  'charite-universitatsmedizin-berlin': 'Berlin',
  'charite': 'Berlin',
  'hertie-school-of-governance': 'Berlin',
  'esmt-european-school-of-management-and-technology': 'Berlin',
  'bauhaus-universitat-weimar': 'Weimar',
  'jacobs-university-bremen': 'Bremen',
  'constructor-university': 'Bremen',
  'rwth-aachen-university': 'Aachen',
  'kit-karlsruher-institut-fur-technologie': 'Karlsruhe',
}

function extractCity(name) {
  if (!name) return null
  // 1. "Universität Heidelberg" / "Universität zu Köln" / "Universität in München"
  let m = name.match(/Universität\s+(?:zu\s+|in\s+|der\s+|des\s+)?([A-ZÄÖÜ][a-zäöüß-]+(?:\s+(?:am|an|im|auf|der|des)\s+(?:[A-Z][a-zäöüß-]+|der\s+[A-Z][a-zäöüß-]+))?)/)
  if (m) return m[1]
  // 2. "Hochschule X" or "Hochschule für Y in Z"
  m = name.match(/Hochschule\s+(?:für\s+[\w\s]+?\s+)?(?:in\s+)?([A-ZÄÖÜ][a-zäöüß-]+)/)
  if (m && !/^für$|^für$/.test(m[1])) return m[1]
  // 3. Acronyms: "TU München", "RWTH Aachen", "FH Köln", "TH Köln"
  m = name.match(/^(?:TU|TH|FH|RWTH|HAW|HfM|HfBK|UdK)\s+([A-ZÄÖÜ][a-zäöüß-]+)/)
  if (m) return m[1]
  // 4. "X-er Institut" / "Karlsruher Institut für Technologie"
  m = name.match(/([A-ZÄÖÜ][a-zäöüß]+er)\s+(?:Institut|Akademie|Hochschule)/)
  if (m && CITY_NORMALIZE[m[1]]) return CITY_NORMALIZE[m[1]]
  // 5. Universitätsmedizin / Universitätsklinik X
  m = name.match(/Universitäts(?:medizin|klinikum)\s+([A-ZÄÖÜ][a-zäöüß-]+)/)
  if (m) return m[1]
  return null
}

// Google favicon service — works for any domain, returns 128px PNG.
function googleFavicon(domain) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
}

function classifyType(name) {
  const s = name.toLowerCase()
  if (/fachhochschule|hochschule für angewandte|university of applied/.test(s)) return 'applied_sciences'
  if (/technische universität|technische hochschule|^tu |^th /.test(s)) return 'technical'
  if (/kunsthochschule|hochschule für (?:bildende )?kunst|academy of fine arts|akademie der bildenden/.test(s)) return 'art'
  if (/musikhochschule|hochschule für musik|conservatory|musikakademie/.test(s)) return 'music'
  if (/medizinische hochschule|medical school/.test(s)) return 'medical'
  if (/pädagogische hochschule|university of education/.test(s)) return 'pedagogical'
  if (/theologische hochschule|hochschule für theolog|theological/.test(s)) return 'theological'
  if (/duale hochschule|cooperative state/.test(s)) return 'dual'
  return 'university'
}

const KNOWN_PRIVATE_DOMAIN = new Set([
  'iu.de', 'iubh.de', 'iu-internationale-hochschule.de',
  'fh-fresenius.de', 'hs-fresenius.de',
  'jacobs-university.de', 'constructor.university',
  'uni-wh.de', 'witten-herdecke.de',
  'law-school.de',
  'frankfurt-school.de',
  'esmt.berlin', 'esmt.org',
  'hertie-school.org',
  'whu.edu',
  'ku.de',                        // KU Eichstätt-Ingolstadt (private but Catholic state-equivalent — close call)
  'sfu.ac.at', 'sfu-berlin.de',  // Sigmund Freud
  'ebs.edu',
  'cbs.de',
  'fom.de',
  'ism.de',
  'munich-business-school.de',
  'macromedia.de',
  'srh.de',
  'steinbeis-hochschule.de',
])

// ── source list ─────────────────────────────────────────────────
const SOURCE_URL = 'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json'

async function fetchSourceList() {
  console.log('▸ Fetching curated university list (Hipo / university-domains-list)...')
  const res = await fetch(SOURCE_URL)
  if (!res.ok) throw new Error(`Source list fetch failed: ${res.status}`)
  const all = await res.json()
  const de = all.filter(u => u.alpha_two_code === 'DE' || u.country === 'Germany')
  console.log(`  ✓ ${de.length} German entries in source`)
  return de
}

// ── optional Wikidata enrichment by domain ─────────────────────
// Single small SPARQL query that joins the names we have to Wikidata
// via the website domain (much narrower than scanning all higher-ed).
async function enrichFromWikidata(domains) {
  if (domains.length === 0) return new Map()
  console.log(`▸ Enriching ${domains.length} entries from Wikidata (by domain)...`)

  // Wikidata can match P856 to a literal URL prefix.
  // We chunk to keep the query small.
  const enrichment = new Map()
  const CHUNK = 60
  for (let i = 0; i < domains.length; i += CHUNK) {
    const chunk = domains.slice(i, i + CHUNK)
    const filters = chunk.map(d => `CONTAINS(LCASE(STR(?website)), "${d.toLowerCase()}")`).join(' || ')
    const sparql = `
SELECT ?uni ?website ?nameDe ?nameEn ?nameAr ?nameFr ?cityLabel ?stateLabel ?founded ?students ?logo
WHERE {
  ?uni wdt:P856 ?website .
  FILTER( ${filters} )
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
    ?state rdfs:label ?stateLabel FILTER(LANG(?stateLabel) = "de").
  }
  OPTIONAL { ?uni wdt:P571 ?founded . }
  OPTIONAL { ?uni wdt:P2196 ?students . }
  OPTIONAL { ?uni wdt:P154 ?logo . }
}
LIMIT 500
`
    try {
      const res = await fetch('https://query.wikidata.org/sparql', {
        method: 'POST',
        headers: {
          'Accept': 'application/sparql-results+json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'GoGermany/1.0 (https://gogermany.ma; contact@gogermany.ma)',
        },
        body: 'query=' + encodeURIComponent(sparql),
      })
      if (!res.ok) {
        console.log(`  ⚠ Wikidata enrichment chunk ${i/CHUNK} failed (${res.status}), continuing without`)
        continue
      }
      const json = await res.json()
      for (const r of json.results.bindings) {
        const host = (() => {
          try { return new URL(r.website.value).hostname.replace(/^www\./, '').toLowerCase() }
          catch { return null }
        })()
        if (!host) continue
        // Match by suffix so 'tum.de' matches 'www.tum.de'
        const matched = chunk.find(d => host === d || host.endsWith('.' + d))
        if (!matched) continue
        const existing = enrichment.get(matched) ?? {}
        enrichment.set(matched, {
          name_de: existing.name_de || r.nameDe?.value,
          name_en: existing.name_en || r.nameEn?.value,
          name_ar: existing.name_ar || r.nameAr?.value,
          name_fr: existing.name_fr || r.nameFr?.value,
          city: existing.city || r.cityLabel?.value,
          state: existing.state || r.stateLabel?.value,
          founded: existing.founded || (r.founded?.value?.match(/(-?\d+)-/)?.[1]),
          student_count: existing.student_count || (r.students?.value ? parseInt(r.students.value, 10) : null),
          logo_url: existing.logo_url || r.logo?.value,
          wikidata_id: r.uni.value.split('/').pop(),
        })
      }
    } catch (e) {
      console.log(`  ⚠ enrichment chunk ${i/CHUNK} threw: ${e.message}`)
    }
    process.stdout.write(`\r  enriched ${Math.min(i + CHUNK, domains.length)}/${domains.length}`)
  }
  console.log(`\n  ✓ Got Wikidata data for ${enrichment.size} entries`)
  return enrichment
}

// ── main ────────────────────────────────────────────────────────
async function main() {
  if (process.argv.includes('--reset')) {
    console.log('▸ Resetting universities table (--reset)...')
    const { error } = await supabase.from('universities').delete().neq('id', '___never___')
    if (error) { console.error('Reset failed:', error); process.exit(1) }
    console.log('  ✓ Cleared.')
  }

  const source = await fetchSourceList()

  // Build candidate records keyed by primary domain.
  const candidates = new Map() // domain -> rec
  for (const u of source) {
    const domain = (u.domains?.[0] || '').toLowerCase()
    const website = u.web_pages?.[0] || (domain ? `https://${domain}` : null)
    if (!domain || !website) continue
    if (candidates.has(domain)) continue

    const id = slugify(u.name)
    if (!id) continue

    candidates.set(domain, {
      id,
      wikidata_id: null,
      name_de: u.name,
      name_en: u.name,
      name_ar: null,
      name_fr: null,
      city: null,
      state: null,
      country_code: 'DE',
      type: classifyType(u.name),
      is_public: !KNOWN_PRIVATE_DOMAIN.has(domain),
      founded: null,
      student_count: null,
      website,
      logo_url: null,
      lat: null, lng: null,
    })
  }
  console.log(`▸ ${candidates.size} unique German institutions from source`)

  // Enrich with Wikidata where possible.
  const enrichment = await enrichFromWikidata([...candidates.keys()])
  let enriched = 0
  for (const [domain, rec] of candidates) {
    const e = enrichment.get(domain)
    if (!e) continue
    rec.wikidata_id = e.wikidata_id ?? rec.wikidata_id
    rec.name_de = e.name_de || rec.name_de
    rec.name_en = e.name_en || rec.name_en
    rec.name_ar = e.name_ar || rec.name_ar
    rec.name_fr = e.name_fr || rec.name_fr
    rec.city = e.city ?? rec.city
    rec.state = e.state ?? rec.state
    rec.founded = e.founded ? parseInt(e.founded, 10) : rec.founded
    rec.student_count = e.student_count ?? rec.student_count
    rec.logo_url = e.logo_url ?? rec.logo_url
    enriched++
  }

  // De-dupe by id (slug collisions across re-namings).
  const bySlug = new Map()
  for (const rec of candidates.values()) {
    if (!bySlug.has(rec.id)) bySlug.set(rec.id, rec)
  }
  const records = [...bySlug.values()]

  // Fallbacks: extract city from name if Wikidata didn't provide one,
  // and always populate logo_url with the Google favicon as a guaranteed
  // image (Wikidata logo wins when present).
  let cityFromName = 0
  let cityFromOverride = 0
  let logoFromGoogle = 0
  for (const rec of records) {
    if (!rec.city) {
      if (CITY_OVERRIDE[rec.id]) {
        rec.city = CITY_OVERRIDE[rec.id]
        cityFromOverride++
      } else {
        const c = extractCity(rec.name_de)
        if (c) {
          rec.city = c
          cityFromName++
        }
      }
    }
    if (!rec.logo_url) {
      try {
        const host = new URL(rec.website).hostname.replace(/^www\./, '')
        rec.logo_url = googleFavicon(host)
        logoFromGoogle++
      } catch {}
    }
  }
  console.log(`▸ Backfilled ${cityFromName} cities from name, ${cityFromOverride} from override`)
  console.log(`▸ Backfilled ${logoFromGoogle} logos via Google favicon service`)
  console.log(`▸ ${records.length} final records (${enriched} enriched from Wikidata)`)
  console.log(`  – public: ${records.filter(r => r.is_public).length}`)
  console.log(`  – private: ${records.filter(r => !r.is_public).length}`)

  // Upsert in chunks.
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
