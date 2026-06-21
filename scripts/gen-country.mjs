/**
 * Regenerate the country-specific cluster correctly (fixes the nat/count bug).
 * Strips existing cluster==='country' rows, keeps everything else, and appends
 * fresh templated country topics deduped against kept + published titles.
 *
 * Run: node scripts/gen-country.mjs
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
const slugify = (s, pfx) => `${pfx}-${norm(s).replace(/\s+/g, '-')}`.slice(0, 80)
const countryId = name => norm(name).replace(/^the /, '').replace(/\s+/g, '-')

const COUNTRIES = [
  ['India', 'Indians', ['hi', 'en', 'de'], 20], ['Pakistan', 'Pakistanis', ['ur', 'en', 'de'], 20],
  ['Nigeria', 'Nigerians', ['en', 'de'], 20], ['the Philippines', 'Filipinos', ['en', 'de'], 20],
  ['Turkey', 'Turks', ['tr', 'en', 'de'], 20], ['Brazil', 'Brazilians', ['pt', 'en', 'de'], 20],
  ['Egypt', 'Egyptians', ['ar', 'en', 'de'], 20], ['Morocco', 'Moroccans', ['fr', 'ar', 'en', 'de'], 20],
  ['Bangladesh', 'Bangladeshis', ['en', 'de'], 16], ['Nepal', 'Nepalis', ['en', 'de'], 16],
  ['Indonesia', 'Indonesians', ['en', 'de'], 16], ['Vietnam', 'Vietnamese', ['en', 'de'], 16],
  ['China', 'Chinese', ['en', 'de'], 16], ['Iran', 'Iranians', ['fa', 'en', 'de'], 16],
  ['Ukraine', 'Ukrainians', ['en', 'de'], 16], ['Russia', 'Russians', ['ru', 'en', 'de'], 16],
  ['Mexico', 'Mexicans', ['es', 'en', 'de'], 16], ['Kenya', 'Kenyans', ['en', 'de'], 16],
  ['South Africa', 'South Africans', ['en', 'de'], 15], ['the USA', 'Americans', ['en', 'de'], 15],
  ['the UK', 'Britons', ['en', 'de'], 15], ['Canada', 'Canadians', ['en', 'de'], 15],
  ['Spain', 'Spaniards', ['es', 'en', 'de'], 15], ['France', 'French citizens', ['fr', 'en', 'de'], 15],
  ['Italy', 'Italians', ['en', 'de'], 15], ['Poland', 'Poles', ['en', 'de'], 15],
  ['Romania', 'Romanians', ['en', 'de'], 15], ['Argentina', 'Argentines', ['es', 'en', 'de'], 15],
  ['Ireland', 'Irish citizens', ['en', 'de'], 15], ['Australia', 'Australians', ['en', 'de'], 15],
]

// 24 distinct angles so each country can reach its target after dedup.
const ANGLES = (C, N) => [
  [`Moving from ${C} to Germany: Complete 2026 Guide`, 'visa'],
  [`Germany Visa for ${N}: Types and How to Apply`, 'visa'],
  [`Jobs in Germany for ${N}: Where to Start`, 'jobs'],
  [`Cost of Living in Germany for ${N}: Real Budget`, 'money'],
  [`${N} in Germany: Community, Cities and Networks`, 'culture'],
  [`Sending Money to ${C} from Germany: Best Options`, 'money'],
  [`Get Your ${C} Degree Recognised in Germany`, 'universities'],
  [`German Embassy in ${C}: Visa Appointment Process`, 'visa'],
  [`Convert Your ${C} Driving Licence in Germany`, 'driving-transport'],
  [`${N}: Studying at a German University`, 'studium'],
  [`Bringing Your Family from ${C} to Germany`, 'family'],
  [`${C} Food and Groceries in Germany: Where to Shop`, 'daily-life'],
  [`Best German Cities for ${N}`, 'daily-life'],
  [`Taxes for ${N} Living in Germany`, 'taxes'],
  [`Marriage in Germany with ${C} Documents`, 'bureaucracy'],
  [`${N} in Nursing: Recognition and Jobs in Germany`, 'work'],
  [`${N} in Tech: IT Visa and Jobs in Germany`, 'work'],
  [`Healthcare in Germany: A Guide for ${N}`, 'healthcare'],
  [`Dual Citizenship: ${C} and Germany Rules`, 'visa'],
  [`First Month in Germany: A Checklist for ${N}`, 'daily-life'],
  [`Opening a German Bank Account: Tips for ${N}`, 'banking'],
  [`${N} and German Pensions: What Happens to Yours`, 'money'],
  [`Apostille and Document Legalisation in ${C} for Germany`, 'bureaucracy'],
  [`Why ${N} Choose Germany: Routes, Pros and Cons`, 'visa'],
]

async function main() {
  const plan = JSON.parse(fs.readFileSync('scripts/out/article-plan.json', 'utf8'))
  const kept = plan.filter(p => p.cluster !== 'country')
  console.log(`Stripped ${plan.length - kept.length} old country rows; kept ${kept.length}`)

  const seen = new Set(kept.map(p => norm(p.title)))
  const { data: pub } = await supabase.from('articles').select('title, translations')
  ;(pub || []).forEach(r => seen.add(norm(r.translations?.en?.title || r.title)))

  const newCountry = []
  for (const [name, nat, locales, count] of COUNTRIES) {
    const id = countryId(name)
    let added = 0
    for (const [title, cat] of ANGLES(name, nat)) {
      if (added >= count) break
      const k = norm(title)
      if (seen.has(k)) continue
      seen.add(k)
      newCountry.push({ slug: slugify(title, id), title, keyword: norm(title), category: cat, audience: id, country: id, locales, cluster: 'country' })
      added++
    }
  }

  const byC = {}
  newCountry.forEach(p => byC[p.country] = (byC[p.country] || 0) + 1)
  console.log('New country topics: ' + newCountry.length)
  console.log(Object.entries(byC).map(([c, n]) => `${c}:${n}`).join('  '))

  const merged = [...kept, ...newCountry]
  fs.writeFileSync('scripts/out/article-plan.json', JSON.stringify(merged, null, 2))
  console.log(`\nPlan: ${plan.length} → ${merged.length} topics`)
}

main().catch(e => { console.error(e); process.exit(1) })
