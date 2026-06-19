/**
 * Translate messages/en.json â†’ messages/tr.json (Turkish).
 * Processes one key at a time; splits 'static' and 'visaGuide' into sub-keys.
 * Saves after every successful section so partial progress is preserved.
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

const LANG = 'hi'
const LANG_FULL = 'Hindi (India, hi-IN)'
const OUT_FILE = `messages/${LANG}.json`

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const ROOT = path.resolve('.')
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'messages/en.json'), 'utf8'))

let out = {}
if (fs.existsSync(path.join(ROOT, OUT_FILE))) {
  out = JSON.parse(fs.readFileSync(path.join(ROOT, OUT_FILE), 'utf8'))
}

function parseJsonLoose(s) {
  const cleaned = s.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function translateOne(key, value) {
  const prompt = `Translate this UI strings JSON section from English to ${LANG_FULL} for GoGermany (website helping people move to Germany).

OUTPUT RULES (CRITICAL):
- Your response must be ONLY valid JSON â€” start with { and end with }
- No markdown fences, no preamble, no explanation
- Translate ALL string values to natural ${LANG_FULL}
- Keep ALL keys unchanged
- Keep placeholders {name}, {count} etc unchanged
- Keep HTML tags unchanged
- Keep German terms: Ausbildung, Anmeldung, Lebenslauf, Anschreiben, Sperrkonto, Krankenkasse, BAfÃ¶G, ZAB, IHK, Goethe, Telc, Ã–SD, Studium, BAMF, DAAD, Vorab, Steuer-ID, Minijob, Deutschlandticket, WG, HWK, Finanzamt
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

function save() {
  fs.writeFileSync(path.join(ROOT, OUT_FILE), JSON.stringify(out, null, 2), 'utf8')
}

function isDone(enVal, outVal) {
  return outVal !== undefined && JSON.stringify(outVal) !== JSON.stringify(enVal)
}

// Keys that are too large to translate in one call â€” split into sub-keys
const SPLIT_KEYS = new Set(['static', 'visaGuide'])

async function main() {
  for (const key of Object.keys(en)) {
    if (SPLIT_KEYS.has(key)) {
      if (!out[key]) out[key] = {}
      for (const subKey of Object.keys(en[key])) {
        if (isDone(en[key][subKey], out[key][subKey])) {
          console.log(`  ${key}.${subKey}: already done`)
          continue
        }
        process.stdout.write(`  ${key}.${subKey}... `)
        try {
          out[key][subKey] = await translateOne(`${key}.${subKey}`, en[key][subKey])
          save()
          console.log('âœ“')
          await new Promise(r => setTimeout(r, 1200))
        } catch (e) {
          console.log(`âœ— ${e.message}`)
        }
      }
      continue
    }

    if (isDone(en[key], out[key])) {
      console.log(`${key}: already done`)
      continue
    }
    process.stdout.write(`${key}... `)
    try {
      out[key] = await translateOne(key, en[key])
      save()
      console.log('âœ“')
      await new Promise(r => setTimeout(r, 1200))
    } catch (e) {
      console.log(`âœ— ${e.message}`)
    }
  }

  console.log('\nâœ… Done.')
}

main().catch(e => { console.error(e); process.exit(1) })



