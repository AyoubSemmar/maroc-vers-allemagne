/**
 * Fix: re-translate fa.eligibilityChecker and fa.writingExercise by splitting into sub-keys.
 */
import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const _envPath = path.resolve('.env.local')
if (fs.existsSync(_envPath)) {
  for (const line of fs.readFileSync(_envPath, 'utf8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const ROOT = path.resolve('.')
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'messages/en.json'), 'utf8'))
let fa = JSON.parse(fs.readFileSync(path.join(ROOT, 'messages/fa.json'), 'utf8'))

function parseJsonLoose(s) {
  const cleaned = s.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function translateOne(key, value) {
  const isObj = typeof value === 'object' && value !== null
  const prompt = `Translate this UI strings JSON section from English to Persian/Farsi (Iran, fa-IR) for GoGermany (website helping people move to Germany). Write in formal Persian (Farsi), right-to-left.

OUTPUT RULES (CRITICAL):
- Your response must be ONLY valid JSON — start with { and end with }
- No markdown fences, no preamble, no explanation
- Translate ALL string values to natural Persian/Farsi
- Keep ALL keys unchanged
- Keep placeholders {name}, {count} etc unchanged
- Keep HTML tags unchanged
- Keep German terms: Ausbildung, Anmeldung, Lebenslauf, Anschreiben, Sperrkonto, Krankenkasse, BAföG, ZAB, IHK, Goethe, Telc, ÖSD, Studium, BAMF, DAAD, Vorab, Steuer-ID, Minijob, Deutschlandticket, WG, HWK, Finanzamt
- Keep brand names: GoGermany, TLScontact, VFS Global, Fintiba, Expatrio, ImmoScout24, WG-Gesucht

Section to translate (key: "${key}"):
${JSON.stringify(isObj ? value : { value }, null, 2)}`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 8000,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  return parseJsonLoose(text)
}

function save() {
  fs.writeFileSync(path.join(ROOT, 'messages/fa.json'), JSON.stringify(fa, null, 2), 'utf8')
}

async function fixSection(sectionKey) {
  if (!fa[sectionKey]) fa[sectionKey] = {}
  const subKeys = Object.keys(en[sectionKey])
  console.log(`\nFixing ${sectionKey} (${subKeys.length} sub-keys)...`)

  for (const subKey of subKeys) {
    const enVal = en[sectionKey][subKey]
    const faVal = fa[sectionKey][subKey]
    if (faVal !== undefined && JSON.stringify(faVal) !== JSON.stringify(enVal)) {
      console.log(`  ${sectionKey}.${subKey}: already done`)
      continue
    }
    process.stdout.write(`  ${sectionKey}.${subKey}... `)
    try {
      const translated = await translateOne(`${sectionKey}.${subKey}`, enVal)
      fa[sectionKey][subKey] = typeof enVal === 'object' ? translated : translated.value ?? translated
      save()
      console.log('✓')
      await new Promise(r => setTimeout(r, 1000))
    } catch (e) {
      console.log(`✗ ${e.message}`)
    }
  }
}

async function main() {
  await fixSection('eligibilityChecker')
  await fixSection('writingExercise')
  console.log('\nDone.')
}

main().catch(e => { console.error(e); process.exit(1) })
