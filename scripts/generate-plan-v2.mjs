/**
 * Expand the content plan by 1200 topics (700 general + 500 country-specific),
 * organized as SEO topic clusters. Hybrid:
 *   - TEMPLATED (deterministic, dedup-safe): city guides, profession jobs &
 *     salaries, and per-country core topics.
 *   - AI-GENERATED (Opus 4.8): the creative general clusters.
 * Dedupes against already-published + already-planned titles, then appends to
 * scripts/out/article-plan.json (backup first).
 *
 * Run: node scripts/generate-plan-v2.mjs
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const anthropic = new Anthropic({ apiKey: process.env.ARTICLE_GEN_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const ALL = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'nl']
const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
const slugify = (s, pfx) => `${pfx}-${norm(s).replace(/\s+/g, '-')}`.slice(0, 80)

// ── dedup set: existing published + planned ──────────────────────────
const seen = new Set()
const plan = JSON.parse(fs.readFileSync('scripts/out/article-plan.json', 'utf8'))
plan.forEach(p => seen.add(norm(p.title)))

const out = []
function add(o) {
  const k = norm(o.title)
  if (seen.has(k)) return false
  seen.add(k); out.push(o); return true
}

// ── TEMPLATES ────────────────────────────────────────────────────────
const CITIES = ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dresden', 'Nuremberg']
const CITY_ANGLES = c => [
  [`Living in ${c}: An Expat's Complete Guide`, 'daily-life'],
  [`Cost of Living in ${c}: Real Monthly Budget`, 'money'],
  [`Best Neighborhoods in ${c} for Newcomers`, 'housing'],
  [`Finding a Job in ${c}: Sectors & Tips`, 'jobs'],
  [`Finding an Apartment in ${c}: Where to Look`, 'housing'],
  [`Getting Around ${c}: Public Transport Guide`, 'driving-transport'],
  [`${c} for Families: Schools, Kitas & Parks`, 'family'],
  [`${c} for Students: Housing, Costs & Life`, 'studium'],
  [`Is ${c} Good for Expats? Pros & Cons`, 'daily-life'],
]
const PROFESSIONS = ['Software Engineer', 'Data Scientist', 'DevOps Engineer', 'Cybersecurity Specialist', 'AI Engineer', 'Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Registered Nurse', 'Doctor', 'Dentist', 'Pharmacist', 'Physiotherapist', 'Caregiver', 'Electrician', 'Plumber', 'Welder', 'CNC Machinist', 'Truck Driver', 'Warehouse Worker', 'Construction Worker', 'Carpenter', 'Chef', 'Hotel Receptionist', 'Accountant', 'Financial Analyst', 'Marketing Manager', 'Sales Manager', 'UX Designer', 'Graphic Designer', 'Product Manager', 'Project Manager', 'Teacher', 'Lab Technician', 'Architect', 'HR Manager', 'Logistics Manager', 'Mechatronics Technician', 'Automotive Engineer', 'Biotechnologist', 'Radiographer', 'Midwife', 'IT Support Specialist', 'Civil Servant', 'Bus Driver']
const SALARY_PROFS = PROFESSIONS.slice(0, 35)

// 30 countries: { name, nat (adjective/noun), locales, count }
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
const countryId = name => norm(name).replace(/^the /, '').replace(/\s+/g, '-')
const C_ANGLES = (C, N) => [
  [`Moving from ${C} to Germany: Complete 2026 Guide`, 'visa'],
  [`Germany Visa for ${N}: Types and How to Apply`, 'visa'],
  [`Jobs in Germany for ${N}: Where to Start`, 'jobs'],
  [`Cost of Living in Germany for ${N}`, 'money'],
  [`${N} in Germany: Community, Cities and Networks`, 'culture'],
  [`Sending Money to ${C} from Germany: Best Options`, 'money'],
  [`Get Your ${C} Degree Recognised in Germany`, 'universities'],
  [`German Embassy in ${C}: Visa Appointment Process`, 'visa'],
  [`Convert Your ${C} Driving Licence in Germany`, 'driving-transport'],
  [`${N} Students in Germany: Universities and Visas`, 'studium'],
  [`Bringing Your Family from ${C} to Germany`, 'family'],
  [`${C} Food and Groceries in Germany: Where to Shop`, 'daily-life'],
  [`Best German Cities for ${N}`, 'daily-life'],
  [`Taxes for ${N} Living in Germany`, 'taxes'],
  [`Marriage in Germany with ${C} Documents`, 'bureaucracy'],
  [`${N} Nurses in Germany: Recognition and Jobs`, 'work'],
  [`${N} IT Professionals in Germany: Visa and Jobs`, 'work'],
  [`Healthcare in Germany for ${N}: What to Know`, 'healthcare'],
  [`Dual Citizenship: ${C} and Germany Rules`, 'visa'],
  [`First Month in Germany: A Guide for ${N}`, 'daily-life'],
].slice(0, N)

// ── AI creative clusters (general) ───────────────────────────────────
const AI_CLUSTERS = [
  ['Moving to Germany & relocation decisions (incl. "Germany vs <country>" comparisons, pros/cons, is it worth it, retiring, moving alone/with family/as a couple, relocation costs)', 'visa', 60],
  ['First steps after arriving & German bureaucracy (registration, tax ID, social security, official letters, document checklists, government portals)', 'bureaucracy', 55],
  ['Renting & housing logistics in Germany, NOT city-specific (finding flats, contracts, deposits, scams, furnishing, utilities, recycling, tenant rights)', 'housing', 45],
  ['Job search & careers advice in Germany, NOT profession-specific (CV, cover letter, interviews, job boards, work culture, remote work, English-only jobs, networking)', 'jobs', 30],
  ['Money, banking & insurance in Germany incl. specific PRODUCT REVIEWS and comparisons (N26, ING, C24, Wise, Revolut; TK, AOK, Barmer; liability/legal/household insurance; savings; taxes; freelancing)', 'banking', 65],
  ['SIM cards, mobile, internet & useful apps in Germany (provider comparisons like Telekom vs Vodafone vs O2, eSIM, prepaid, best apps for banking/transport/food/language)', 'simcards', 40],
  ['Shopping & everyday consumer life in Germany (supermarket comparisons like Aldi vs Lidl, electronics, clothing, furniture, outlets, second-hand, deals)', 'daily-life', 45],
  ['Transport & driving in Germany (Deutschlandticket, Deutsche Bahn, buying/owning a car, TÜV, cycling, car-sharing, licence rules)', 'driving-transport', 30],
  ['Food, culture, social life & integration in Germany (making friends, dating, traditions, festivals, etiquette, German food, language-exchange social life)', 'culture', 35],
  ['Healthcare in Germany in depth (finding specialists, dentists, mental health, pregnancy, prescriptions, sick leave, emergencies, English-speaking care)', 'healthcare', 30],
  ['Family & education in Germany in depth (childcare, schools, Kindergeld, parental leave, raising kids, universities for parents, special needs)', 'family', 30],
  ['High-traffic problem & emotional questions expats Google (why can\'t I find an apartment, why is Germany so bureaucratic, visa/permit delays, getting rejected, surviving winter, loneliness, burnout, mental health, expat regrets, why people leave Germany, is Germany worth it)', 'daily-life', 65],
]

function parseJsonLoose(s) { const c = s.replace(/```json\s*|\s*```/g, '').trim(); const a = c.indexOf('['), b = c.lastIndexOf(']'); if (a < 0 || b < 0) throw new Error('no array'); return JSON.parse(c.slice(a, b + 1)) }

async function aiTopics(desc, n) {
  const prompt = `You are an SEO strategist for GoGermany (helping people move to Germany). Propose ${n} article topics for this cluster:
${desc}

Each: "title" (compelling, SEO, ~50-60 chars, keyword-forward), "keyword" (primary search phrase). Cover varied search intents (how-to, cost, comparison, best-of, requirements, mistakes, reviews). Be specific (real € amounts, German terms, real brands/cities). Avoid duplicating these existing titles:
${[...seen].slice(0, 60).join(' | ')}

Return ONLY a JSON array of ${n} objects [{"title","keyword"}], no prose.`
  const stream = await anthropic.messages.stream({ model: 'claude-opus-4-8', max_tokens: 16000, thinking: { type: 'adaptive' }, output_config: { effort: 'high' }, messages: [{ role: 'user', content: prompt }] })
  const msg = await stream.finalMessage()
  return parseJsonLoose(msg.content.map(c => c.type === 'text' ? c.text : '').join(''))
}

async function main() {
  // Dedup also against already-published articles.
  const { data: pub } = await supabase.from('articles').select('title, translations')
  ;(pub || []).forEach(r => seen.add(norm(r.translations?.en?.title || r.title)))
  console.log(`Dedup baseline: ${seen.size} existing titles (planned + published)`)

  // 1. Templated general: city guides
  for (const c of CITIES) for (const [title, cat] of CITY_ANGLES(c)) add({ slug: slugify(title, 'g'), title, keyword: norm(title), category: cat, audience: 'global', country: null, locales: ALL, cluster: 'city-guides' })
  // 2. Templated general: profession jobs + salaries
  for (const p of PROFESSIONS) add({ slug: slugify(`${p} Jobs in Germany`, 'g'), title: `${p} Jobs in Germany: Demand, Visa and How to Apply`, keyword: `${p} jobs Germany`.toLowerCase(), category: 'jobs', audience: 'global', country: null, locales: ALL, cluster: 'jobs-profession' })
  for (const p of SALARY_PROFS) add({ slug: slugify(`${p} Salary in Germany`, 'g'), title: `${p} Salary in Germany: 2026 Pay by Experience`, keyword: `${p} salary Germany`.toLowerCase(), category: 'jobs', audience: 'global', country: null, locales: ALL, cluster: 'salary-profession' })

  // 3. Templated country-specific
  for (const [name, nat, locales, count] of COUNTRIES) {
    const id = countryId(name)
    for (const [title, cat] of C_ANGLES(name, count)) add({ slug: slugify(title, id), title, keyword: norm(title), category: cat, audience: id, country: id, locales, cluster: 'country' })
  }

  console.log(`Templated so far: ${out.length} (cities ${CITIES.length * 9}, profs ${PROFESSIONS.length + SALARY_PROFS.length}, country target ~500)`)

  // 4. AI creative general clusters (chunked)
  for (const [desc, cat, count] of AI_CLUSTERS) {
    let made = 0
    for (let need = count; need > 0;) {
      const batch = Math.min(need, 35)
      process.stdout.write(`  AI [${cat}] +${batch}... `)
      try {
        const list = await aiTopics(desc, batch + 8) // overshoot to absorb dedup losses
        let added = 0
        for (const t of list) { if (made >= count) break; if (t?.title && add({ slug: slugify(t.title, 'g'), title: t.title.trim(), keyword: (t.keyword || t.title).trim(), category: cat, audience: 'global', country: null, locales: ALL, cluster: 'ai-general' })) { added++; made++ } }
        console.log(`+${added} (cluster ${made}/${count})`)
        need = count - made
        if (added === 0) break
      } catch (e) { console.log(`✗ ${e.message}`); break }
    }
  }

  const general = out.filter(o => o.audience === 'global').length
  const country = out.length - general
  console.log(`\nNEW topics: ${out.length}  (general ${general} / country ${country})`)

  fs.writeFileSync('scripts/out/article-plan.v1.backup.json', JSON.stringify(plan, null, 2))
  const merged = [...plan, ...out]
  fs.writeFileSync('scripts/out/article-plan.json', JSON.stringify(merged, null, 2))
  console.log(`Plan: ${plan.length} → ${merged.length} topics (backup at article-plan.v1.backup.json)`)
}

main().catch(e => { console.error(e); process.exit(1) })
