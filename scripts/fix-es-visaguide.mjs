/**
 * Fix: translate just es.visaGuide, splitting into 3 sub-keys.
 */
import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

// Load .env.local if it exists
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
let es = JSON.parse(fs.readFileSync(path.join(ROOT, 'messages/es.json'), 'utf8'))

function parseJsonLoose(s) {
  const cleaned = s.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function translateOne(key, value) {
  const prompt = `Translate this UI strings JSON section from English to Spanish (Spain, es-ES) for GoGermany (website helping people move to Germany).

OUTPUT RULES (CRITICAL):
- Your response must be ONLY valid JSON — start with { and end with }
- No markdown fences, no preamble, no explanation
- Translate ALL string values to natural Spanish
- Keep ALL keys unchanged
- Keep placeholders {name}, {count} etc unchanged
- Keep HTML tags unchanged
- Keep German terms: Ausbildung, Anmeldung, Lebenslauf, Anschreiben, Sperrkonto, Krankenkasse, BAföG, ZAB, IHK, Goethe, Telc, ÖSD, Studium, BAMF, DAAD, Vorab, Steuer-ID, Minijob, Deutschlandticket, WG, HWK, Finanzamt
- Keep brand names: GoGermany, TLScontact, VFS Global, Fintiba, Expatrio, ImmoScout24, WG-Gesucht

Section to translate (key: "${key}"):
${JSON.stringify(value, null, 2)}`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 8000,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  return parseJsonLoose(text)
}

async function main() {
  if (!es.visaGuide) es.visaGuide = {}
  for (const subKey of Object.keys(en.visaGuide)) {
    process.stdout.write(`  visaGuide.${subKey}... `)
    try {
      const translated = await translateOne(`visaGuide.${subKey}`, en.visaGuide[subKey])
      es.visaGuide[subKey] = translated
      fs.writeFileSync(path.join(ROOT, 'messages/es.json'), JSON.stringify(es, null, 2), 'utf8')
      console.log('✓')
      await new Promise(r => setTimeout(r, 1200))
    } catch (e) {
      console.log(`✗ ${e.message}`)
    }
  }
  console.log('\nDone.')
}

main().catch(e => { console.error(e); process.exit(1) })
