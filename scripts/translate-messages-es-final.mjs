/**
 * Final pass: translate remaining untranslated sections one at a time.
 * For `static` (80K chars), splits into sub-keys.
 */

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

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

function save() {
  fs.writeFileSync(path.join(ROOT, 'messages/es.json'), JSON.stringify(es, null, 2), 'utf8')
}

// Get keys still in English
function stillEnglish() {
  return Object.keys(en).filter(k => JSON.stringify(es[k]) === JSON.stringify(en[k]))
}

async function main() {
  const remaining = stillEnglish()
  console.log(`Keys to translate: ${remaining.join(', ')}\n`)

  for (const key of remaining) {
    // Special case: 'static' is too large — split by sub-key
    if (key === 'static') {
      console.log('Processing "static" sub-by-sub...')
      if (!es.static) es.static = {}
      for (const subKey of Object.keys(en.static)) {
        if (JSON.stringify(es.static[subKey]) === JSON.stringify(en.static[subKey])) {
          process.stdout.write(`  static.${subKey}... `)
          try {
            const translated = await translateOne(`static.${subKey}`, en.static[subKey])
            es.static[subKey] = translated
            save()
            console.log('✓')
            await new Promise(r => setTimeout(r, 1200))
          } catch (e) {
            console.log(`✗ ${e.message}`)
          }
        } else {
          console.log(`  static.${subKey}: already done, skip`)
        }
      }
      continue
    }

    process.stdout.write(`${key}... `)
    try {
      const translated = await translateOne(key, en[key])
      es[key] = translated
      save()
      console.log('✓')
      await new Promise(r => setTimeout(r, 1200))
    } catch (e) {
      console.log(`✗ ${e.message}`)
    }
  }

  const left = stillEnglish()
  if (left.length === 0) {
    console.log('\n✅ All keys translated.')
  } else {
    console.log(`\nStill untranslated: ${left.join(', ')}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
