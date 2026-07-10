/**
 * Expand + optimize scripts/out/article-plan.json to EXACTLY 3000 topics.
 *
 * Optimizations to the existing plan:
 *  - drop the 13 dead `netherlands`-audience topics (NL-specific content)
 *  - add `zh` to the `china`-audience locale sets (planned pre-zh-pivot)
 *  - re-order by commercial intent (visa/banking/ausbildung first)
 *  - dedupe (slug + Jaccard title similarity, incl. vs published articles)
 *
 * Expansion families (all authored in this file — no API calls):
 *  - country matrix: fill the proven 20-template set for existing countries,
 *    add 24 new countries, add 8 new templates for all 51 countries
 *  - 35 cities × 6 guides, 16 Bundesländer × 3, ~40 professions, 40 unis,
 *    exam/language series, ~150 curated global one-offs
 *
 * Run: node scripts/expand-plan-3000.mjs
 */
import fs from 'fs'

const PLAN_PATH = 'scripts/out/article-plan.json'
const plan = JSON.parse(fs.readFileSync(PLAN_PATH, 'utf8'))
const existingTitles = JSON.parse(fs.readFileSync('scripts/out/existing-titles.json', 'utf8'))

const GLOBAL_LOCALES = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh']

const kebab = (s) => s.toLowerCase()
  .replace(/&/g, 'and').replace(/[€$]/g, '').replace(/ß/g, 'ss')
  .replace(/[äàâá]/g, 'a').replace(/[öôó]/g, 'o').replace(/[üûú]/g, 'u').replace(/[éèê]/g, 'e')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)

// ── 1. Clean the existing plan ──────────────────────────────────────
let kept = plan.filter(p => p.audience !== 'netherlands')
let backfilled = 0
for (const p of kept) {
  if (p.audience === 'china' && !p.locales.includes('zh')) p.locales = ['zh', ...p.locales]
  // Some v1 entries lack keyword/brief — the runner then prompts with
  // "Primary keyword: undefined". Backfill from the title.
  if (!p.keyword) { p.keyword = p.title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(); backfilled++ }
  if (!p.brief) { p.brief = `${p.title} — practical, specific guidance with real numbers for people moving to Germany.`; backfilled++ }
}
console.log(`existing: ${plan.length} → kept ${kept.length} (dropped netherlands, backfilled ${backfilled} missing fields)`)

// ── 2. Country matrix ───────────────────────────────────────────────
// name (mid-sentence), demonym plural, embassy city, locales
const COUNTRIES = {
  // existing granular audiences
  nigeria:      { name: 'Nigeria', dem: 'Nigerians', embassy: 'Abuja & Lagos', locales: ['en', 'de'] },
  philippines:  { name: 'the Philippines', dem: 'Filipinos', embassy: 'Manila', locales: ['en', 'de'] },
  brazil:       { name: 'Brazil', dem: 'Brazilians', embassy: 'Brasília & São Paulo', locales: ['pt', 'en', 'de'] },
  egypt:        { name: 'Egypt', dem: 'Egyptians', embassy: 'Cairo', locales: ['ar', 'en', 'de'] },
  morocco:      { name: 'Morocco', dem: 'Moroccans', embassy: 'Rabat', locales: ['fr', 'ar', 'en', 'de'] },
  india:        { name: 'India', dem: 'Indians', embassy: 'New Delhi & Mumbai', locales: ['hi', 'en', 'de'] },
  pakistan:     { name: 'Pakistan', dem: 'Pakistanis', embassy: 'Islamabad & Karachi', locales: ['ur', 'en', 'de'] },
  turkey:       { name: 'Turkey', dem: 'Turks', embassy: 'Ankara & Istanbul', locales: ['tr', 'en', 'de'] },
  bangladesh:   { name: 'Bangladesh', dem: 'Bangladeshis', embassy: 'Dhaka', locales: ['en', 'de'] },
  nepal:        { name: 'Nepal', dem: 'Nepalis', embassy: 'Kathmandu', locales: ['en', 'de'] },
  indonesia:    { name: 'Indonesia', dem: 'Indonesians', embassy: 'Jakarta', locales: ['en', 'de'] },
  vietnam:      { name: 'Vietnam', dem: 'Vietnamese', embassy: 'Hanoi & Ho Chi Minh City', locales: ['en', 'de'] },
  china:        { name: 'China', dem: 'Chinese', embassy: 'Beijing & Shanghai', locales: ['zh', 'en', 'de'] },
  iran:         { name: 'Iran', dem: 'Iranians', embassy: 'Tehran', locales: ['fa', 'en', 'de'] },
  ukraine:      { name: 'Ukraine', dem: 'Ukrainians', embassy: 'Kyiv', locales: ['en', 'de'] },
  russia:       { name: 'Russia', dem: 'Russians', embassy: 'Moscow', locales: ['ru', 'en', 'de'] },
  mexico:       { name: 'Mexico', dem: 'Mexicans', embassy: 'Mexico City', locales: ['es', 'en', 'de'] },
  kenya:        { name: 'Kenya', dem: 'Kenyans', embassy: 'Nairobi', locales: ['en', 'de'] },
  'south-africa': { name: 'South Africa', dem: 'South Africans', embassy: 'Pretoria', locales: ['en', 'de'] },
  usa:          { name: 'the USA', dem: 'Americans', embassy: 'Washington & New York', locales: ['en', 'de'] },
  uk:           { name: 'the UK', dem: 'Brits', embassy: 'London', locales: ['en', 'de'] },
  canada:       { name: 'Canada', dem: 'Canadians', embassy: 'Ottawa & Toronto', locales: ['en', 'de'] },
  spain:        { name: 'Spain', dem: 'Spaniards', embassy: 'Madrid', locales: ['es', 'en', 'de'] },
  france:       { name: 'France', dem: 'French citizens', embassy: 'Paris', locales: ['fr', 'en', 'de'] },
  italy:        { name: 'Italy', dem: 'Italians', embassy: 'Rome & Milan', locales: ['en', 'de'] },
  poland:       { name: 'Poland', dem: 'Poles', embassy: 'Warsaw', locales: ['en', 'de'] },
  romania:      { name: 'Romania', dem: 'Romanians', embassy: 'Bucharest', locales: ['en', 'de'] },
  argentina:    { name: 'Argentina', dem: 'Argentinians', embassy: 'Buenos Aires', locales: ['es', 'en', 'de'] },
  ireland:      { name: 'Ireland', dem: 'Irish citizens', embassy: 'Dublin', locales: ['en', 'de'] },
  australia:    { name: 'Australia', dem: 'Australians', embassy: 'Canberra & Sydney', locales: ['en', 'de'] },
  // new audiences
  tunisia:      { name: 'Tunisia', dem: 'Tunisians', embassy: 'Tunis', locales: ['fr', 'ar', 'en', 'de'] },
  algeria:      { name: 'Algeria', dem: 'Algerians', embassy: 'Algiers', locales: ['fr', 'ar', 'en', 'de'] },
  senegal:      { name: 'Senegal', dem: 'Senegalese', embassy: 'Dakar', locales: ['fr', 'en', 'de'] },
  'ivory-coast': { name: "Côte d'Ivoire", dem: 'Ivorians', embassy: 'Abidjan', locales: ['fr', 'en', 'de'] },
  cameroon:     { name: 'Cameroon', dem: 'Cameroonians', embassy: 'Yaoundé', locales: ['fr', 'en', 'de'] },
  ghana:        { name: 'Ghana', dem: 'Ghanaians', embassy: 'Accra', locales: ['en', 'de'] },
  ethiopia:     { name: 'Ethiopia', dem: 'Ethiopians', embassy: 'Addis Ababa', locales: ['en', 'de'] },
  jordan:       { name: 'Jordan', dem: 'Jordanians', embassy: 'Amman', locales: ['ar', 'en', 'de'] },
  lebanon:      { name: 'Lebanon', dem: 'Lebanese', embassy: 'Beirut', locales: ['ar', 'en', 'de'] },
  'saudi-arabia': { name: 'Saudi Arabia', dem: 'Saudis', embassy: 'Riyadh', locales: ['ar', 'en', 'de'] },
  uae:          { name: 'the UAE', dem: 'UAE residents', embassy: 'Abu Dhabi & Dubai', locales: ['ar', 'en', 'de'] },
  colombia:     { name: 'Colombia', dem: 'Colombians', embassy: 'Bogotá', locales: ['es', 'en', 'de'] },
  peru:         { name: 'Peru', dem: 'Peruvians', embassy: 'Lima', locales: ['es', 'en', 'de'] },
  chile:        { name: 'Chile', dem: 'Chileans', embassy: 'Santiago', locales: ['es', 'en', 'de'] },
  thailand:     { name: 'Thailand', dem: 'Thais', embassy: 'Bangkok', locales: ['en', 'de'] },
  'south-korea': { name: 'South Korea', dem: 'Koreans', embassy: 'Seoul', locales: ['en', 'de'] },
  japan:        { name: 'Japan', dem: 'Japanese', embassy: 'Tokyo', locales: ['en', 'de'] },
  taiwan:       { name: 'Taiwan', dem: 'Taiwanese', embassy: 'Taipei (German Institute)', locales: ['zh', 'en', 'de'] },
  'sri-lanka':  { name: 'Sri Lanka', dem: 'Sri Lankans', embassy: 'Colombo', locales: ['en', 'de'] },
  uzbekistan:   { name: 'Uzbekistan', dem: 'Uzbeks', embassy: 'Tashkent', locales: ['ru', 'en', 'de'] },
  kazakhstan:   { name: 'Kazakhstan', dem: 'Kazakhs', embassy: 'Astana', locales: ['ru', 'en', 'de'] },
  georgia:      { name: 'Georgia', dem: 'Georgians', embassy: 'Tbilisi', locales: ['ru', 'en', 'de'] },
  serbia:       { name: 'Serbia', dem: 'Serbians', embassy: 'Belgrade', locales: ['en', 'de'] },
  albania:      { name: 'Albania', dem: 'Albanians', embassy: 'Tirana', locales: ['en', 'de'] },
}

// The proven 20-template set (mirrors nigeria/morocco/…) + 8 new templates.
// `skip` = regex that detects the country already has this template.
const T = (title, category, keyword, brief, skip) => ({ title, category, keyword, brief, skip })
const COUNTRY_TEMPLATES = [
  T((c) => `Moving from ${c.name} to Germany: Complete 2026 Guide`, 'daily-life',
    (c) => `move from ${c.name} to Germany`,
    (c) => `End-to-end relocation roadmap for ${c.dem}: visa route, documents, costs, timeline and first steps after landing.`, /^Moving from/i),
  T((c) => `Germany Visa for ${c.dem}: Types and How to Apply`, 'visa',
    (c) => `Germany visa for ${c.dem}`,
    (c) => `Which German visa fits which purpose for applicants from ${c.name} — work, study, Ausbildung, family — with fees and processing times.`, /Visa for .+: Types|Germany Visa for/i),
  T((c) => `Jobs in Germany for ${c.dem}: Where to Start`, 'jobs',
    (c) => `jobs in Germany for ${c.dem}`,
    (c) => `In-demand sectors, job boards that work from ${c.name}, CV expectations and realistic salary ranges.`, /^Jobs in Germany for/i),
  T((c) => `Cost of Living in Germany for ${c.dem}: Real Budget`, 'money',
    (c) => `cost of living Germany vs ${c.name}`,
    (c) => `Monthly budget in € with rent, food, transport and insurance — compared with typical costs back in ${c.name}.`, /^Cost of Living in Germany for/i),
  T((c) => `${c.dem} in Germany: Community, Cities and Networks`, 'culture',
    (c) => `${c.dem} community in Germany`,
    (c) => `Where the ${c.dem[0].toLowerCase() + c.dem.slice(1)} community is strongest, associations, events and how to plug in fast.`, /Community, Cities and Networks|in Germany: Community/i),
  T((c) => `Sending Money from Germany to ${c.name}: Best Options`, 'banking',
    (c) => `send money Germany to ${c.name}`,
    (c) => `Cheapest reliable transfer routes to ${c.name} — fees, exchange-rate margins and delivery speed compared.`, /Sending Money|Send Money/i),
  T((c) => `Get Your ${c.name} Degree Recognised in Germany`, 'universities',
    (c) => `${c.name} degree recognition Germany`,
    (c) => `Anabin/ZAB recognition for degrees from ${c.name}: statement of comparability, costs, timelines and what to do if partially recognised.`, /Degree Recogni|Anabin/i),
  T((c) => `German Embassy in ${c.embassy.split(' & ')[0]}: Visa Appointment Guide`, 'bureaucracy',
    (c) => `German embassy ${c.name} appointment`,
    (c) => `Booking the visa appointment in ${c.embassy}: portals, wait times, document checklists and interview tips.`, /German Embassy/i),
  T((c) => `Convert Your ${c.name} Driving Licence in Germany`, 'driving-transport',
    (c) => `${c.name} driving licence Germany`,
    (c) => `Whether licences from ${c.name} can be exchanged or require tests, the 6-month rule, costs and Fahrschule tips.`, /Driving Licence/i),
  T((c) => `Studying at a German University: Guide for ${c.dem}`, 'studium',
    (c) => `study in Germany from ${c.name}`,
    (c) => `Admission from ${c.name}: uni-assist, APS where relevant, language requirements, deadlines and funding.`, /Studying at a German University/i),
  T((c) => `Bringing Your Family from ${c.name} to Germany`, 'family',
    (c) => `family reunion visa ${c.name}`,
    (c) => `Family-reunification requirements for spouses and children from ${c.name}: income thresholds, housing, A1 German and timelines.`, /Bringing Your Family/i),
  T((c) => `${c.name} Food and Groceries in Germany: Where to Shop`, 'daily-life',
    (c) => `${c.name} groceries in Germany`,
    (c) => `Finding ingredients from ${c.name}: specialty shops, online stores and German supermarket substitutes.`, /Food and Groceries/i),
  T((c) => `Best German Cities for ${c.dem}`, 'daily-life',
    (c) => `best German cities for ${c.dem}`,
    (c) => `Ranking German cities for ${c.dem} by jobs, community, cost and connections home.`, /^Best German Cities for/i),
  T((c) => `Taxes for ${c.dem} Living in Germany`, 'taxes',
    (c) => `taxes in Germany for ${c.dem}`,
    (c) => `Tax classes, double-taxation treaty with ${c.name}, filing with ELSTER and typical refunds.`, /^Taxes for/i),
  T((c) => `Marriage in Germany with ${c.name} Documents`, 'family',
    (c) => `marriage in Germany ${c.name} documents`,
    (c) => `Standesamt requirements when one partner has documents from ${c.name}: apostille/legalisation, Ehefähigkeitszeugnis and timelines.`, /^Marriage in Germany/i),
  T((c) => `Nurses from ${c.name}: Recognition and Jobs in Germany`, 'healthcare',
    (c) => `nurse recognition Germany ${c.name}`,
    (c) => `Anerkennung path for nurses trained in ${c.name}: language level, Kenntnisprüfung vs Anpassungslehrgang, salaries.`, /Nursing: Recognition|Nurses from/i),
  T((c) => `${c.dem} in Tech: IT Visa and Jobs in Germany`, 'work',
    (c) => `IT jobs Germany ${c.dem}`,
    (c) => `The tech route from ${c.name}: Blue Card thresholds, English-speaking employers and interview loops.`, /in Tech: IT Visa/i),
  T((c) => `Healthcare in Germany: A Guide for ${c.dem}`, 'healthcare',
    (c) => `healthcare in Germany for ${c.dem}`,
    (c) => `How GKV/PKV works for newcomers from ${c.name}, registering with a Hausarzt and emergency care.`, /^Healthcare in Germany: A Guide/i),
  T((c) => `Dual Citizenship: ${c.name} and Germany Rules`, 'bureaucracy',
    (c) => `dual citizenship Germany ${c.name}`,
    (c) => `What Germany's 2024 dual-citizenship law means for ${c.dem}: eligibility, ${c.name}-side rules and application steps.`, /^Dual Citizenship/i),
  T((c) => `First Month in Germany: A Checklist for ${c.dem}`, 'daily-life',
    (c) => `first month in Germany checklist`,
    (c) => `Week-by-week arrival checklist tailored to ${c.dem}: Anmeldung, bank, insurance, SIM, transport and typical pitfalls.`, /^First Month in Germany/i),
  // ── 8 new templates ──
  T((c) => `Ausbildung in Germany for ${c.dem}: How to Apply from ${c.name}`, 'ausbildung',
    (c) => `Ausbildung for ${c.dem}`,
    (c) => `Landing a paid apprenticeship from ${c.name}: German level, finding employers who sponsor, visa steps and monthly pay.`, /Ausbildung/i),
  T((c) => `Chancenkarte from ${c.name}: Points, Process and Costs`, 'visa',
    (c) => `Chancenkarte ${c.name}`,
    (c) => `Germany's opportunity card for jobseekers from ${c.name}: the points system, proof of funds and the 12-month job hunt.`, /Chancenkarte|Opportunity Card/i),
  T((c) => `Student Visa from ${c.name}: Sperrkonto and Documents`, 'visa',
    (c) => `student visa Germany ${c.name}`,
    (c) => `The student-visa file from ${c.name}: blocked account amount, admission letters, interview questions and timelines.`, /Student Visa/i),
  T((c) => `EU Blue Card for ${c.dem}: Salary Thresholds and Steps`, 'work',
    (c) => `EU Blue Card ${c.dem}`,
    (c) => `Blue Card route for professionals from ${c.name}: 2026 salary thresholds, shortage occupations and permanent-residency fast track.`, /Blue Card/i),
  T((c) => `Learn German in ${c.name}: Goethe, Courses and Costs`, 'language',
    (c) => `learn German in ${c.name}`,
    (c) => `Reaching A1–B2 before leaving ${c.name}: Goethe-Institut options, cheaper local alternatives and exam booking.`, /Learn German in|Language Courses/i),
  T((c) => `Pension Refunds for ${c.dem} Leaving Germany`, 'money',
    (c) => `German pension refund ${c.dem}`,
    (c) => `When ${c.dem} can claim back German pension contributions, the 24-month rule, forms and processing times.`, /Pension/i),
  T((c) => `German Schools for ${c.dem[0] === 'A' || c.dem[0] === 'I' || c.dem[0] === 'U' || c.dem[0] === 'E' ? c.dem : c.dem} Kids: Enrolment Guide`, 'family',
    (c) => `German school enrolment foreign kids`,
    (c) => `Enrolling children arriving from ${c.name}: Willkommensklassen, school types, language support and required documents.`, /Schools for|School Enrol/i),
  T((c) => `${c.name} Consulates in Germany: Passport and Document Services`, 'bureaucracy',
    (c) => `${c.name} consulate Germany`,
    (c) => `Where ${c.dem} renew passports and legalise documents inside Germany: consulate locations, booking and fees.`, /Consulate|Passport Renewal/i),
]

const byAudience = {}
for (const p of kept) (byAudience[p.audience] = byAudience[p.audience] || []).push(p)

const newTopics = []
const pushTopic = (audience, country, title, category, keyword, brief, locales, fam = null) => {
  newTopics.push({ slug: `${audience === 'global' ? 'g' : audience}-${kebab(title)}`, title, keyword, category, brief, audience, country, locales, _fam: fam })
}

for (const [aud, c] of Object.entries(COUNTRIES)) {
  const have = (byAudience[aud] || []).map(p => p.title)
  COUNTRY_TEMPLATES.forEach((t, ti) => {
    if (have.some(title => t.skip.test(title))) return
    pushTopic(aud, aud, t.title(c), t.category, t.keyword(c), t.brief(c), c.locales, `ct${ti}`)
  })
}
console.log('country matrix new topics:', newTopics.length)

// ── 3. City guides (global audience) ────────────────────────────────
const CITIES = [
  ['Berlin', 'the startup-and-arts capital with the largest international community'],
  ['Munich', 'Germany’s highest salaries and highest rents, home of BMW and Siemens'],
  ['Hamburg', 'the port city with strong media, logistics and aviation employers'],
  ['Frankfurt', 'the finance hub with Europe’s largest airport'],
  ['Cologne', 'a friendly media-and-insurance city on the Rhine'],
  ['Stuttgart', 'the automotive engineering heartland (Mercedes, Porsche, Bosch)'],
  ['Düsseldorf', 'fashion, consulting and Japan’s biggest community in Germany'],
  ['Leipzig', 'the fast-growing, affordable creative hotspot of the east'],
  ['Dresden', 'the semiconductor "Silicon Saxony" with baroque charm'],
  ['Nuremberg', 'a stable industrial region with reasonable rents'],
  ['Hannover', 'the trade-fair city with a strong insurance sector'],
  ['Bremen', 'aerospace and logistics on the North Sea'],
  ['Dortmund', 'the Ruhr tech-and-logistics revival city'],
  ['Essen', 'the Ruhr’s corporate headquarters city (RWE, Aldi)'],
  ['Bonn', 'the UN-and-telecom city (Deutsche Telekom, DHL)'],
  ['Mannheim', 'an industrial-and-university twin city with Heidelberg next door'],
  ['Karlsruhe', 'the IT-and-law city with KIT university'],
  ['Wiesbaden', 'the elegant capital of Hessen near Frankfurt'],
  ['Münster', 'Germany’s bicycle-and-student city'],
  ['Augsburg', 'Bavaria’s affordable alternative to Munich'],
  ['Aachen', 'the engineering university city on three borders'],
  ['Kiel', 'shipbuilding and wind energy on the Baltic'],
  ['Freiburg', 'the sunny green university city of the southwest'],
  ['Heidelberg', 'the famous research-and-romance university town'],
  ['Regensburg', 'a booming Bavarian tech city with a medieval core'],
  ['Mainz', 'the biotech city of BioNTech and public broadcasting'],
  ['Erfurt', 'Thuringia’s affordable, central capital'],
  ['Rostock', 'the Baltic port with maritime industries'],
  ['Kassel', 'central Germany’s logistics-and-culture hub'],
  ['Saarbrücken', 'the French-border city with IT research'],
  ['Potsdam', 'film, science and palaces next to Berlin'],
  ['Braunschweig', 'Europe’s most research-dense region (VW nearby)'],
  ['Ulm', 'high-tech on the Danube between Stuttgart and Munich'],
  ['Wolfsburg', 'the Volkswagen company town with top salaries'],
  ['Ingolstadt', 'Audi’s prosperous Bavarian base'],
  ['Bielefeld', 'the down-to-earth Ostwestfalen hidden champion (Dr. Oetker, Schüco)'],
  ['Darmstadt', 'the science city (ESA, Merck) in the Frankfurt orbit'],
  ['Lübeck', 'the Hanseatic marzipan-and-medtech city on the Baltic'],
  ['Magdeburg', 'Saxony-Anhalt’s capital betting big on chip plants'],
  ['Chemnitz', 'Saxony’s affordable industrial city, Capital of Culture 2025'],
]
const CITY_THEMES = [
  [(c) => `Cost of Living in ${c} (2026): Rent, Food and Transport`, 'money', (c) => `cost of living ${c}`,
    (c, hook) => `Real 2026 monthly budgets for ${c} — ${hook}: rent by neighborhood, groceries, transport passes and how to save.`],
  [(c) => `Living in ${c} as a Foreigner: The Complete City Guide`, 'daily-life', (c) => `living in ${c} expat`,
    (c, hook) => `What newcomers should know about ${c}, ${hook}: vibe, districts, transport, bureaucracy and community.`],
  [(c) => `Best Neighborhoods in ${c} for Students and Expats`, 'housing', (c) => `best neighborhoods ${c}`,
    (c, hook) => `District-by-district guide to renting in ${c}: prices, safety, commute times and where international residents cluster.`],
  [(c) => `Anmeldung in ${c}: Bürgeramt Appointments and Documents`, 'bureaucracy', (c) => `Anmeldung ${c}`,
    (c, hook) => `Registering your address in ${c}: which Bürgeramt, how to snipe appointments, the Wohnungsgeberbestätigung and same-week tricks.`],
  [(c) => `Jobs in ${c}: Key Industries and Top Employers`, 'jobs', (c) => `jobs in ${c}`,
    (c, hook) => `The ${c} job market — ${hook}: biggest employers, English-friendly roles and realistic salaries.`],
  [(c) => `Studying in ${c}: Universities, Housing and Student Life`, 'studium', (c) => `study in ${c}`,
    (c, hook) => `Universities in and around ${c}, dorm and WG options, semester costs and student jobs.`],
]
for (const [city, hook] of CITIES) {
  CITY_THEMES.forEach(([title, cat, kw, brief], ti) => {
    pushTopic('global', null, title(city), cat, kw(city), brief(city, hook), GLOBAL_LOCALES, `city${ti}`)
  })
}
console.log('after cities:', newTopics.length)

// ── 4. Professions ──────────────────────────────────────────────────
// [name, hasAusbildung, regulated]
const PROFESSIONS = [
  ['Nurse', false, true], ['Doctor', false, true], ['Dentist', false, true], ['Pharmacist', false, true],
  ['Physiotherapist', true, true], ['Midwife', true, true], ['Paramedic (Notfallsanitäter)', true, true],
  ['Elderly Caregiver (Altenpfleger)', true, true], ['Medical Assistant (MFA)', true, false],
  ['Dental Assistant (ZFA)', true, false], ['Optician', true, true], ['Veterinarian', false, true],
  ['Mechanical Engineer', false, false], ['Electrical Engineer', false, false], ['Civil Engineer', false, true],
  ['Architect', false, true], ['Software Developer', false, false], ['Data Scientist', false, false],
  ['IT Systems Specialist (Fachinformatiker)', true, false], ['Teacher', false, true],
  ['Kindergarten Educator (Erzieher)', true, true], ['Social Worker', false, true], ['Accountant', false, false],
  ['Electrician', true, true], ['Plumber (Anlagenmechaniker SHK)', true, true], ['Carpenter', true, false],
  ['Welder', true, false], ['Industrial Mechanic', true, false], ['Mechatronics Technician', true, false],
  ['Car Mechanic (Kfz-Mechatroniker)', true, false], ['Truck Driver', true, false], ['Bus Driver', true, false],
  ['Train Driver', true, false], ['Chef', true, false], ['Baker', true, false], ['Butcher', true, false],
  ['Hotel Specialist (Hotelfachmann)', true, false], ['Warehouse Logistics Specialist', true, false],
  ['Hairdresser', true, false], ['Painter and Varnisher', true, false],
]
for (const [prof, hasAusb, regulated] of PROFESSIONS) {
  const short = prof.replace(/\s*\(.*\)/, '')
  pushTopic('global', null, `Working as a ${short} in Germany: Salary, Visa and Demand`, 'jobs',
    `${short.toLowerCase()} jobs Germany`,
    `The ${short.toLowerCase()} career path in Germany: 2026 salaries by region, visa routes, demand outlook and how to apply from abroad.`, GLOBAL_LOCALES, 'prof1')
  if (hasAusb) pushTopic('global', null, `${prof} Ausbildung: Requirements, Pay and How to Apply`, 'ausbildung',
    `${short.toLowerCase()} Ausbildung`,
    `The ${short.toLowerCase()} apprenticeship: entry requirements, German level, monthly Ausbildung pay by year and application season.`, GLOBAL_LOCALES, 'prof2')
  if (regulated) pushTopic('global', null, `${short} Qualification Recognition (Anerkennung) in Germany`, 'bureaucracy',
    `${short.toLowerCase()} Anerkennung Germany`,
    `Getting a foreign ${short.toLowerCase()} qualification recognised: competent authority, documents, deficit measures and timelines.`, GLOBAL_LOCALES, 'prof3')
}
console.log('after professions:', newTopics.length)

// ── 5. Bundesländer ─────────────────────────────────────────────────
const STATES = ['Bavaria', 'Baden-Württemberg', 'North Rhine-Westphalia', 'Hessen', 'Lower Saxony',
  'Rhineland-Palatinate', 'Saxony', 'Berlin (State)', 'Hamburg (State)', 'Bremen (State)', 'Schleswig-Holstein',
  'Brandenburg', 'Saxony-Anhalt', 'Thuringia', 'Mecklenburg-Vorpommern', 'Saarland']
for (const st of STATES) {
  const s = st.replace(/\s*\(State\)/, '')
  pushTopic('global', null, `Living in ${st.includes('(State)') ? s + ' — the City-State' : s}: Costs, Jobs and Lifestyle`, 'daily-life',
    `living in ${s}`,
    `What makes ${s} different: cost of living, major employers, public holidays, school system quirks and where newcomers settle.`, GLOBAL_LOCALES, 'st1')
  pushTopic('global', null, `Working in ${s}: Industries, Salaries and Job Hubs`, 'jobs',
    `jobs in ${s}`,
    `${s}'s economy for job seekers: dominant industries, biggest employers, salary levels vs national average.`, GLOBAL_LOCALES, 'st2')
  pushTopic('global', null, `Studying in ${s}: Universities and Semester Fees`, 'studium',
    `universities in ${s}`,
    `${s}'s universities, semester contributions, tuition rules for non-EU students and student-city ranking.`, GLOBAL_LOCALES, 'st3')
}
console.log('after states:', newTopics.length)

// ── 6. University profiles ──────────────────────────────────────────
const UNIS = ['TU Munich (TUM)', 'LMU Munich', 'Heidelberg University', 'Humboldt University Berlin', 'FU Berlin',
  'TU Berlin', 'RWTH Aachen', 'KIT Karlsruhe', 'University of Freiburg', 'University of Tübingen',
  'University of Göttingen', 'University of Hamburg', 'University of Cologne', 'Goethe University Frankfurt',
  'TU Dresden', 'University of Stuttgart', 'TU Darmstadt', 'University of Bonn', 'University of Münster',
  'Leibniz University Hannover', 'University of Leipzig', 'University of Mannheim', 'University of Würzburg',
  'University of Erlangen-Nuremberg (FAU)', 'University of Jena', 'University of Kiel', 'University of Mainz',
  'University of Duisburg-Essen', 'Ruhr University Bochum', 'TU Dortmund', 'University of Bremen',
  'University of Regensburg', 'University of Ulm', 'University of Potsdam', 'Jacobs/Constructor University Bremen',
  'Frankfurt School of Finance', 'WHU Otto Beisheim', 'ESMT Berlin', 'TU Hamburg (TUHH)', 'HTW Berlin']
for (const uni of UNIS) {
  pushTopic('global', null, `Studying at ${uni}: Admission, Costs and Student Life`, 'universities',
    `${uni} admission international`,
    `${uni} for international applicants: programs and English-taught options, admission requirements, deadlines, costs and campus life.`, GLOBAL_LOCALES, 'uni')
}
console.log('after universities:', newTopics.length)

// ── 7. Exams & language series ──────────────────────────────────────
const EXAM_TOPICS = [
  ['Goethe-Zertifikat A1: Format, Fees and Pass Strategy', 'language', 'Goethe A1 exam'],
  ['Goethe-Zertifikat A2: Format, Fees and Pass Strategy', 'language', 'Goethe A2 exam'],
  ['Goethe-Zertifikat B1: Format, Fees and Pass Strategy', 'language', 'Goethe B1 exam'],
  ['Goethe-Zertifikat B2: Format, Fees and Pass Strategy', 'language', 'Goethe B2 exam'],
  ['Goethe-Zertifikat C1: Format, Fees and Pass Strategy', 'language', 'Goethe C1 exam'],
  ['telc Deutsch B1: The Citizenship-Ready Exam Explained', 'language', 'telc B1'],
  ['telc Deutsch B2-C1 Medizin: The Exam for Health Professionals', 'language', 'telc medizin'],
  ['TestDaF: Scores, Format and University Requirements', 'language', 'TestDaF'],
  ['DSH Exam: The University-Run Alternative to TestDaF', 'language', 'DSH exam'],
  ['ÖSD vs Goethe: Which German Certificate Should You Take?', 'language', 'OSD vs Goethe'],
  ['German A1 in 8 Weeks: A Realistic Self-Study Plan', 'language', 'learn German A1 fast'],
  ['B1 to B2 German: Breaking the Intermediate Plateau', 'language', 'B1 to B2 German'],
  ['German for the Workplace: Phrases That Matter in Your First Job', 'language', 'business German basics'],
  ['Integration Course (Integrationskurs): Hours, Costs and Exemptions', 'integration', 'Integrationskurs'],
  ['Berufssprachkurse: Free Job-Related German Courses (DeuFöV)', 'integration', 'Berufssprachkurs'],
  ['Einbürgerungstest: The German Citizenship Test Explained', 'integration', 'Einbuergerungstest'],
  ['Leben in Deutschland Test: 33 Questions, All the Tricks', 'integration', 'Leben in Deutschland test'],
  ['VHS German Courses: The Cheapest Legit Way to Learn', 'language', 'VHS German course'],
  ['German Learning Apps Compared: What Actually Gets You to B1', 'language', 'German learning apps'],
  ['Tandem Partners and Sprachcafés: Free Speaking Practice', 'language', 'German tandem partner'],
]
for (const [title, cat, kw] of EXAM_TOPICS) {
  pushTopic('global', null, title, cat, kw, `${title.split(':')[0]} — format, registration, costs and a concrete preparation plan.`, GLOBAL_LOCALES)
}
console.log('after exams:', newTopics.length)

// ── 8. Curated global one-offs ──────────────────────────────────────
const ONE_OFFS = [
  // citizenship & residence
  ['German Citizenship 2026: The New 5-Year and 3-Year Rules', 'bureaucracy', 'German citizenship requirements'],
  ['Niederlassungserlaubnis: Permanent Residency Requirements by Visa Type', 'bureaucracy', 'Niederlassungserlaubnis requirements'],
  ['Fictional Certificate (Fiktionsbescheinigung): Your Rights While Waiting', 'bureaucracy', 'Fiktionsbescheinigung'],
  ['Lost Your Job on a Work Visa? Your 6-Month Window Explained', 'visa', 'lost job work visa Germany'],
  ['Visa Rejection Germany: Remonstrance Letter That Works', 'visa', 'Germany visa rejection remonstrance'],
  ['Germany Freelance Visa (Freiberufler): Who Qualifies and How', 'visa', 'freelance visa Germany'],
  ['Self-Employment Visa (§21): Business Plan Requirements', 'visa', 'self employment visa Germany'],
  ['Au Pair in Germany: Visa, Pocket Money and Host Family Rules', 'visa', 'au pair Germany'],
  ['Working Holiday Visa Germany: Eligible Countries and Setup', 'visa', 'working holiday visa Germany'],
  ['Germany Digital Nomad Options: What Exists and What Doesn’t', 'visa', 'digital nomad Germany'],
  ['Asylum vs Skilled Migration: Understanding Germany’s Two Systems', 'visa', 'Germany migration paths'],
  ['Schengen 90/180 Rule: The Calculator Logic Explained', 'visa', '90 180 rule Schengen'],
  ['Overstaying in Germany: Consequences and How to Fix It', 'visa', 'overstay Schengen Germany'],
  // money & banking
  ['Schufa Explained: Build a German Credit Score from Zero', 'banking', 'Schufa score build'],
  ['Girokonto Comparison 2026: Free Accounts That Stay Free', 'banking', 'best Girokonto Germany'],
  ['N26 vs DKB vs Commerzbank: Best Bank for Newcomers', 'banking', 'best bank Germany expats'],
  ['Depot and ETF Investing in Germany: Beginner’s Setup', 'money', 'ETF investing Germany'],
  ['Riester, Rürup, bAV: German Retirement Products Decoded', 'money', 'German retirement products'],
  ['Kindergeld 2026: Amounts, Eligibility and Application', 'family', 'Kindergeld application'],
  ['Elterngeld: Parental Allowance Calculation and Strategies', 'family', 'Elterngeld calculation'],
  ['Bürgergeld: Who Can Claim Germany’s Basic Income Support', 'money', 'Buergergeld eligibility'],
  ['Wohngeld: Housing Benefit Many Expats Don’t Know They Can Get', 'money', 'Wohngeld eligibility'],
  ['BAföG for International Students: The Overlooked Cases', 'money', 'BAfoeG international students'],
  ['Minijob Rules 2026: The 556 € Limit and Your Rights', 'work', 'Minijob rules'],
  ['Midijob: The Reduced-Contribution Zone Explained', 'work', 'Midijob explained'],
  ['Werkstudent Rules: 20 Hours, Taxes and Insurance', 'work', 'Werkstudent rules'],
  ['Tax Class Change After Marriage: 4/4 vs 3/5 Math', 'taxes', 'tax class change marriage'],
  ['Tax Return in Germany: DIY with ELSTER vs Apps vs Steuerberater', 'taxes', 'German tax return options'],
  ['Church Tax (Kirchensteuer): How to Leave and What It Costs', 'taxes', 'Kirchensteuer leave'],
  ['Freelancer Taxes in Germany: VAT, Prepayments and Deadlines', 'taxes', 'freelancer taxes Germany'],
  ['Gewerbe vs Freiberuf: Which One Is Your Side Hustle?', 'work', 'Gewerbe vs Freiberuf'],
  ['Kleinunternehmerregelung: The Small-Business VAT Exemption', 'taxes', 'Kleinunternehmerregelung'],
  // housing
  ['Mietvertrag Red Flags: 10 Clauses to Check Before Signing', 'housing', 'Mietvertrag check'],
  ['Kaution Rules: Getting Your Full Deposit Back', 'housing', 'Kaution deposit back'],
  ['Nebenkostenabrechnung: How to Audit Your Utility Bill', 'housing', 'Nebenkostenabrechnung check'],
  ['Mietpreisbremse: Is Your Rent Illegal? How to Check and Claim', 'housing', 'Mietpreisbremse claim'],
  ['WG Casting: How to Win a Room in a Shared Flat', 'housing', 'WG room application'],
  ['Anschlussmiete: Switching Apartments Without a Schufa History', 'housing', 'rent without Schufa'],
  ['Buying an Apartment in Germany as a Foreigner', 'housing', 'buy apartment Germany foreigner'],
  ['Rent-to-Income Rules: What Landlords Actually Require', 'housing', 'landlord income requirements'],
  ['Untermiete: Legal Subletting Without Losing Your Lease', 'housing', 'sublet legally Germany'],
  ['Moving Within Germany: Ummeldung and Provider Checklist', 'daily-life', 'Ummeldung moving checklist'],
  // insurance
  ['Haftpflichtversicherung: The 5 €/Month Insurance You Actually Need', 'daily-life', 'Haftpflicht liability insurance'],
  ['Hausratversicherung: When Home-Contents Insurance Is Worth It', 'daily-life', 'Hausrat insurance worth it'],
  ['Berufsunfähigkeitsversicherung: Income Protection Basics', 'money', 'BU insurance Germany'],
  ['Legal Insurance (Rechtsschutz): When It Saves You Thousands', 'daily-life', 'Rechtsschutz worth it'],
  ['GKV vs PKV: The Health-Insurance Decision That’s Hard to Undo', 'healthcare', 'GKV vs PKV decision'],
  ['Zusatzversicherung: Dental and Hospital Top-Up Insurance', 'healthcare', 'dental top up insurance'],
  ['Travel Health Insurance for the Visa: Incoming Policies Compared', 'healthcare', 'incoming insurance Germany'],
  // health
  ['Finding an English-Speaking Doctor: Doctolib and Beyond', 'healthcare', 'English speaking doctor Germany'],
  ['Therapy in Germany: Getting a Kassensitz Appointment', 'healthcare', 'therapy appointment Germany'],
  ['Krankschreibung: Sick-Leave Rules and the Yellow Slip', 'healthcare', 'sick leave Germany rules'],
  ['Emergency Numbers and Bereitschaftsdienst: 112 vs 116117', 'healthcare', 'emergency doctor Germany'],
  ['Pregnancy and Birth in Germany: Costs, Hebamme and Papers', 'family', 'giving birth in Germany'],
  ['Vaccinations and the Impfpass: Getting Records Transferred', 'healthcare', 'Impfpass records'],
  // work & career
  ['Probezeit Survival: Your Rights in the First 6 Months', 'work', 'Probezeit rights'],
  ['Kündigung Received? Deadlines and Kündigungsschutzklage', 'work', 'Kuendigung what to do'],
  ['Betriebsrat: What a Works Council Does for You', 'work', 'Betriebsrat explained'],
  ['Urlaubsanspruch: Vacation-Day Math and Carry-Over Rules', 'work', 'vacation days Germany rules'],
  ['Elternzeit for Fathers: Taking Parental Leave Without Career Damage', 'family', 'Elternzeit fathers'],
  ['Homeoffice Rights and Hybrid-Work Norms in Germany', 'work', 'homeoffice rules Germany'],
  ['Salary Negotiation in Germany: Scripts and Taboos', 'career-growth', 'salary negotiation Germany'],
  ['Job Interview in Germany: The Questions and the Dress Code', 'career-growth', 'German job interview'],
  ['German CV (Lebenslauf) 2026: Photo, Format and ATS', 'career-growth', 'German CV format'],
  ['Anschreiben: Does Germany Still Want Cover Letters?', 'career-growth', 'Anschreiben cover letter'],
  ['LinkedIn vs XING in 2026: Where German Recruiters Look', 'career-growth', 'XING vs LinkedIn'],
  ['Zwischenzeugnis: When and How to Ask for One', 'career-growth', 'Zwischenzeugnis ask'],
  ['Weiterbildung: Funded Upskilling with Bildungsgutschein', 'career-growth', 'Bildungsgutschein'],
  ['Meisterbrief: The Master Craftsman Path and Meister-BAföG', 'ausbildung', 'Meisterbrief'],
  ['IHK Exams: How Chamber-of-Commerce Certification Works', 'ausbildung', 'IHK exam'],
  ['Umschulung: Retraining into a New Career, Funded', 'ausbildung', 'Umschulung funded'],
  // daily life
  ['Pfand System: Bottle Deposits and the Machines', 'daily-life', 'Pfand system'],
  ['Waste Sorting in Germany: Gelbe Tonne, Bio and Fines', 'daily-life', 'waste sorting Germany'],
  ['Rundfunkbeitrag: The 18.36 € Broadcast Fee and Exemptions', 'daily-life', 'Rundfunkbeitrag exemptions'],
  ['Sunday Rules: What’s Actually Closed and the Exceptions', 'culture', 'Sunday closed Germany'],
  ['Ruhezeit: Quiet Hours and Neighbor Etiquette', 'culture', 'Ruhezeit quiet hours'],
  ['German Bureaucratic Letters: Templates to Reply Correctly', 'bureaucracy', 'reply German official letter'],
  ['Vollmacht: Power of Attorney for Everyday Situations', 'bureaucracy', 'Vollmacht template'],
  ['Beglaubigte Kopie: Where to Get Certified Copies', 'bureaucracy', 'certified copy Germany'],
  ['Apostille and Legalisation: Which Documents Need Which', 'bureaucracy', 'apostille vs legalisation'],
  ['Name Change After Marriage: The German Paper Trail', 'family', 'name change marriage Germany'],
  ['Getting Married at the Standesamt: Documents and Timeline', 'family', 'Standesamt marriage documents'],
  ['Bringing Your Pet to Germany: EU Passport, Rabies and TRACES', 'daily-life', 'bring pet to Germany'],
  ['Dog Ownership in Germany: Hundesteuer, Insurance and Training', 'daily-life', 'dog rules Germany'],
  ['Driving in Germany: Autobahn Rules Foreigners Get Wrong', 'driving-transport', 'Autobahn rules'],
  ['Deutschlandticket: 58 € Unlimited Regional Transport Explained', 'driving-transport', 'Deutschlandticket'],
  ['Buying a Used Car: TÜV, Zulassung and Insurance Steps', 'driving-transport', 'buy used car Germany'],
  ['Car Insurance Classes (SF-Klassen): Starting Without History', 'driving-transport', 'car insurance Germany newcomer'],
  ['Bike Rules and Theft: Locks, Codierung and Insurance', 'driving-transport', 'bike theft Germany'],
  ['Winter in Germany: Clothing, Heating Costs and Vitamin D', 'daily-life', 'first German winter'],
  ['German Supermarkets Ranked: Aldi to Alnatura', 'daily-life', 'German supermarkets compared'],
  ['Tipping in Germany: Restaurants, Taxis and Hairdressers', 'culture', 'tipping Germany'],
  ['Public Holidays by Bundesland: Plan Your Long Weekends', 'culture', 'public holidays Germany'],
  ['Sperrmüll: Getting Rid of Furniture the Legal Way', 'daily-life', 'Sperrmuell rules'],
  ['Strom and Gas: Choosing Providers and Avoiding Grundversorgung', 'daily-life', 'electricity provider Germany'],
  ['Internet at Home: DSL vs Cable vs Fiber Contracts', 'simcards', 'internet contract Germany'],
  ['Prepaid vs Contract SIM: What Newcomers Should Pick', 'simcards', 'prepaid SIM Germany'],
  ['Handyvertrag Traps: Auto-Renewal and How to Cancel', 'simcards', 'cancel phone contract Germany'],
  ['Kündigungsfristen: Cancelling Any German Contract on Time', 'daily-life', 'cancel contract Germany'],
  // studies
  ['Uni-Assist Explained: VPD, Fees and Deadlines', 'universities', 'uni-assist VPD'],
  ['Studienkolleg: The Foundation Year for Non-Recognised Diplomas', 'universities', 'Studienkolleg'],
  ['TestAS: When the Aptitude Test Helps Your Application', 'universities', 'TestAS'],
  ['DAAD Scholarships: Realistic Chances and Application Craft', 'universities', 'DAAD scholarship'],
  ['Deutschlandstipendium: The 300 € Merit Grant', 'universities', 'Deutschlandstipendium'],
  ['Numerus Clausus: How Grade-Based Admission Really Works', 'universities', 'Numerus Clausus'],
  ['Changing Majors or Universities: Visa and BAföG Implications', 'studium', 'change major Germany visa'],
  ['Semester Ticket, Mensa and Student Discounts: Maximize Them', 'studium', 'student discounts Germany'],
  ['Writing a Thesis at a German Company: Praxisthesis Guide', 'studium', 'company thesis Germany'],
  ['PhD in Germany: Positions, Pay and the Professor Hunt', 'universities', 'PhD Germany paid'],
  ['Post-Study 18-Month Job-Seeker Residence: Use It Right', 'visa', '18 month job seeker visa'],
  // integration & culture
  ['Making German Friends: Vereine, Sports Clubs and Stammtisch', 'integration', 'make German friends'],
  ['Culture Shock Germany: Directness, Silence and Punctuality', 'culture', 'German culture shock'],
  ['Du vs Sie: Navigating Formality Without Offending', 'culture', 'du vs sie'],
  ['German Small Talk: What Works and What Falls Flat', 'culture', 'German small talk'],
  ['Racism and Discrimination: Your Rights and Where to Report', 'integration', 'discrimination report Germany'],
  ['Muslim Life in Germany: Mosques, Halal and Prayer at Work', 'integration', 'Muslim life Germany'],
  ['Christmas Markets to Karneval: The German Festival Year', 'culture', 'German festivals'],
  ['German Humor Exists: TV Shows and Comedians to Learn From', 'culture', 'German comedy shows'],
  ['Volunteering (Ehrenamt): Integrate Faster by Giving Back', 'integration', 'volunteer Germany'],
  ['Loneliness Abroad: Mental-Health Resources for Expats', 'integration', 'expat loneliness resources'],
]
for (const [title, cat, kw] of ONE_OFFS) {
  pushTopic('global', null, title, cat, kw, `${title.split(':')[0]} — concrete rules, real numbers and step-by-step guidance for people moving to or settling in Germany.`, GLOBAL_LOCALES)
}
console.log('after one-offs:', newTopics.length)

// ── 9. Merge, dedupe, prioritize, trim to exactly 3000 ─────────────
const norm = (t) => new Set(t.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2))
const jaccard = (a, b) => {
  let inter = 0
  for (const w of a) if (b.has(w)) inter++
  return inter / (a.size + b.size - inter)
}

const all = [...kept, ...newTopics]
const seenSlugs = new Set()
const published = existingTitles.map(t => norm(typeof t === 'string' ? t : t.title || ''))
const deduped = []
const dropped = []
for (const p of all) {
  if (seenSlugs.has(p.slug)) { dropped.push(['slug', p.title]); continue }
  const n = norm(p.title)
  // vs published articles (only for NEW topics — kept plan entries stay)
  const isNew = newTopics.includes(p)
  if (isNew && published.some(q => jaccard(n, q) >= 0.7)) { dropped.push(['published', p.title]); continue }
  // Template siblings (same family) intentionally share phrasing — only
  // dedupe across DIFFERENT families (or one-offs vs anything).
  if (isNew && deduped.some(q => q._n && (!p._fam || !q._fam || p._fam !== q._fam ? jaccard(n, q._n) >= 0.82 : false) && !(p._fam && q._fam && p._fam === q._fam))) { dropped.push(['similar', p.title]); continue }
  seenSlugs.add(p.slug)
  deduped.push(Object.assign(p, { _n: n }))
}
console.log(`merged ${all.length} → deduped ${deduped.length} (dropped ${dropped.length})`)

// Priority: high-intent categories + keyword boosts first (order within
// global/country groups is what the daily runner's interleave consumes).
const CAT_W = { visa: 100, banking: 95, ausbildung: 92, work: 90, jobs: 88, healthcare: 85, universities: 82, studium: 80, money: 78, bureaucracy: 75, taxes: 70, housing: 68, family: 66, language: 62, 'career-growth': 60, 'driving-transport': 55, integration: 52, simcards: 50, 'daily-life': 45, culture: 40 }
const score = (p) => {
  let s = CAT_W[p.category] ?? 50
  const t = (p.title + ' ' + p.keyword).toLowerCase()
  for (const [re, w] of [[/sperrkonto|blocked account/, 30], [/chancenkarte|blue card/, 25], [/visa/, 15], [/insurance/, 15], [/ausbildung/, 15], [/salary|cost/, 8], [/recognition|anerkennung/, 10]]) {
    if (re.test(t)) s += w
  }
  return s
}
deduped.sort((a, b) => score(b) - score(a))

// Trim lowest-priority to exactly 3000 (never trim already-kept plan entries).
let final = deduped
if (final.length > 3000) {
  const keepSet = new Set(kept)
  const removable = final.filter(p => !keepSet.has(p))
  const toRemove = new Set(removable.slice().sort((a, b) => score(a) - score(b)).slice(0, final.length - 3000))
  final = final.filter(p => !toRemove.has(p))
}
for (const p of final) { delete p._n; delete p._fam }
console.log('final count:', final.length)

// Validate
const CATS = new Set(Object.keys(CAT_W))
const LOCS = new Set(GLOBAL_LOCALES)
const errs = []
const slugs = new Set()
for (const p of final) {
  if (slugs.has(p.slug)) errs.push('dup slug ' + p.slug); slugs.add(p.slug)
  if (!CATS.has(p.category)) errs.push('bad cat ' + p.category + ' @ ' + p.slug)
  for (const l of p.locales) if (!LOCS.has(l)) errs.push('bad locale ' + l + ' @ ' + p.slug)
  if (!p.title || !p.brief || !p.keyword) errs.push('missing field @ ' + p.slug)
}
if (errs.length) { console.error('VALIDATION ERRORS:', errs.slice(0, 10)); process.exit(1) }

fs.copyFileSync(PLAN_PATH, 'scripts/out/article-plan.v2.backup.json')
fs.writeFileSync(PLAN_PATH, JSON.stringify(final, null, 1))
const aud = {}
for (const p of final) aud[p.audience === 'global' ? 'global' : 'country'] = (aud[p.audience === 'global' ? 'global' : 'country'] || 0) + 1
console.log('written. global/country split:', JSON.stringify(aud))
