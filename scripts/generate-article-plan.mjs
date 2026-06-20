/**
 * Generate the SEO content plan for the new article batch.
 * Opus 4.8 proposes themed global topics + per-country topics, each with an
 * SEO title, primary keyword, category, and a one-line brief. The script
 * assigns audience + target locales per the locale policy, dedupes against
 * existing articles, and writes scripts/out/article-plan.json.
 *
 * Run: node scripts/generate-article-plan.mjs [--global=N] [--per-country=N]
 */
import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const args = process.argv.slice(2)
const GLOBAL_PER_THEME = parseInt(args.find(a => a.startsWith('--global='))?.split('=')[1] || '18', 10)
const PER_COUNTRY = parseInt(args.find(a => a.startsWith('--per-country='))?.split('=')[1] || '13', 10)

const ALL_LOCALES = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'nl']

// Country group → target locales (always include en + de). See memory
// article-locale-policy.
const COUNTRY_GROUPS = [
  { id: 'india',            label: 'Indians',                          locales: ['hi', 'en', 'de'] },
  { id: 'pakistan',         label: 'Pakistanis',                       locales: ['ur', 'en', 'de'] },
  { id: 'north-africa',     label: 'North Africans (Morocco/Algeria/Tunisia)', locales: ['fr', 'ar', 'en', 'de'] },
  { id: 'turkey',           label: 'Turks',                            locales: ['tr', 'en', 'de'] },
  { id: 'iran-afghanistan', label: 'Iranians and Afghans (Farsi/Dari speakers)', locales: ['fa', 'en', 'de'] },
  { id: 'spain-latam',      label: 'Spanish speakers (Spain & Latin America)', locales: ['es', 'en', 'de'] },
  { id: 'portugal-brazil',  label: 'Portuguese speakers (Portugal & Brazil)', locales: ['pt', 'en', 'de'] },
  { id: 'east-europe',      label: 'Russian-speaking Eastern Europeans', locales: ['ru', 'en', 'de'] },
  { id: 'netherlands',      label: 'Dutch speakers (Netherlands/Belgium)', locales: ['nl', 'en', 'de'] },
]

const GLOBAL_THEMES = [
  'Germany visa & legal residence pathways (Blue Card, job-seeker, Chancenkarte, family reunification)',
  'finding work & the German job market (applications, Lebenslauf, interviews, recognition of qualifications)',
  'Ausbildung — German vocational training (how it works, pay, finding a place, specific trades)',
  'studying at German universities (admission, Studienkolleg, APS, tuition, student life)',
  'housing & relocation logistics (finding a flat, Anmeldung, deposits, WG, moving)',
  'money in Germany — banking, taxes, insurance, Sperrkonto, cost of living',
  'healthcare & everyday services in Germany (Krankenkasse, doctors, pharmacies, emergencies)',
  'learning German & integration (language levels, exams, Integrationskurs, making friends)',
  'family life in Germany (childcare, Kindergeld, schools, spouse visas, having a baby)',
  'German bureaucracy & official procedures (Bürgeramt, Steuer-ID, residence permits, appointments)',
]

const CATEGORIES = ['visa', 'work', 'jobs', 'ausbildung', 'studium', 'universities', 'housing', 'banking', 'money', 'taxes', 'healthcare', 'language', 'daily-life', 'family', 'culture', 'bureaucracy', 'driving-transport', 'career-growth', 'integration']

const existingTitles = JSON.parse(fs.readFileSync('scripts/out/existing-titles.json', 'utf8'))
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
const seen = new Set(existingTitles.map(norm))

function parseJsonLoose(s) {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const a = cleaned.indexOf('['); const b = cleaned.lastIndexOf(']')
  if (a < 0 || b < 0) throw new Error('No JSON array found')
  return JSON.parse(cleaned.slice(a, b + 1))
}

async function askForTopics(promptBody, n) {
  const prompt = `You are an SEO strategist for GoGermany, a site helping people move to Germany. Propose ${n} high-quality article topics.

${promptBody}

Requirements for each topic:
- "title": a compelling, SEO-optimized English title (~50–60 chars) with the primary keyword near the front. Specific and clickable, not generic.
- "keyword": the primary search keyword/phrase the article targets.
- "category": one of: ${CATEGORIES.join(', ')}.
- "brief": one sentence describing the angle/what the article must cover.

Avoid duplicating these existing titles (same topic, different words still counts as a duplicate):
${existingTitles.slice(0, 140).map(t => `- ${t}`).join('\n')}

Cover a broad range of real search intents — practical how-tos, cost breakdowns, comparisons, step-by-step guides, mistakes to avoid. Use real specifics (€ amounts, city names, official bodies).

Return ONLY a JSON array of ${n} objects: [{"title","keyword","category","brief"}]. No commentary, no markdown fences.`

  const stream = await client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high' },
    messages: [{ role: 'user', content: prompt }],
  })
  const msg = await stream.finalMessage()
  const text = msg.content.map(c => c.type === 'text' ? c.text : '').join('')
  return parseJsonLoose(text)
}

function slugify(title) {
  return norm(title).replace(/\s+/g, '-').slice(0, 70)
}

function addTopics(rawList, { audience, locales, country }, out) {
  let added = 0
  for (const t of rawList || []) {
    if (!t?.title || !t?.keyword) continue
    const key = norm(t.title)
    if (seen.has(key)) continue
    seen.add(key)
    out.push({
      slug: `${audience === 'global' ? 'g' : country}-${slugify(t.title)}`.slice(0, 80),
      title: t.title.trim(),
      keyword: t.keyword.trim(),
      category: CATEGORIES.includes(t.category) ? t.category : 'daily-life',
      brief: (t.brief || '').trim(),
      audience,
      country: country || null,
      locales,
    })
    added++
  }
  return added
}

async function main() {
  const plan = []

  console.log(`\n══ GLOBAL TOPICS (${GLOBAL_THEMES.length} themes × ${GLOBAL_PER_THEME}) ══`)
  for (const theme of GLOBAL_THEMES) {
    process.stdout.write(`  ${theme.slice(0, 50)}... `)
    try {
      const list = await askForTopics(`Theme: ${theme}\nThese are GLOBAL topics — useful to anyone moving to Germany regardless of nationality. Do not make them country-specific.`, GLOBAL_PER_THEME)
      const n = addTopics(list, { audience: 'global', locales: ALL_LOCALES }, plan)
      console.log(`+${n}`)
    } catch (e) { console.log(`✗ ${e.message}`) }
  }

  console.log(`\n══ COUNTRY-SPECIFIC TOPICS (${COUNTRY_GROUPS.length} groups × ${PER_COUNTRY}) ══`)
  for (const g of COUNTRY_GROUPS) {
    process.stdout.write(`  ${g.label}... `)
    try {
      const list = await askForTopics(`Audience: ${g.label} moving to Germany.\nThese must be SPECIFIC to this group — their home-country bureaucracy, document recognition, the ${g.id} → Germany route, embassies/visa process from their country, diaspora/community, remittances, things that only apply to them. Not generic life-in-Germany advice.`, PER_COUNTRY)
      const n = addTopics(list, { audience: g.id, locales: g.locales, country: g.id }, plan)
      console.log(`+${n}`)
    } catch (e) { console.log(`✗ ${e.message}`) }
  }

  fs.writeFileSync('scripts/out/article-plan.json', JSON.stringify(plan, null, 2), 'utf8')

  // Summary
  const globalN = plan.filter(p => p.audience === 'global').length
  const countryN = plan.length - globalN
  // total translation calls = sum over topics of (locales without en, since en is the generated source)
  let translationCalls = 0
  for (const p of plan) translationCalls += p.locales.filter(l => l !== 'en').length
  console.log(`\n────────────────────────────────`)
  console.log(`Total topics: ${plan.length}  (global ${globalN} / country-specific ${countryN})`)
  console.log('By country:')
  for (const g of COUNTRY_GROUPS) console.log(`  ${g.id}: ${plan.filter(p => p.country === g.id).length}  → [${g.locales.join(',')}]`)
  console.log(`\nGeneration calls (Opus 4.8): ${plan.length}`)
  console.log(`Translation calls (Haiku): ${translationCalls}`)
  console.log(`Hero images (FLUX): ${plan.length}`)
  console.log(`\nPlan written to scripts/out/article-plan.json`)
}

main().catch(e => { console.error(e); process.exit(1) })
