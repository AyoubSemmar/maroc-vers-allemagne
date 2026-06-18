/**
 * Retry script: translate the keys that failed in the first run.
 * Uses smaller batches (3 keys) to avoid token-limit JSON parse failures.
 *
 * Run:  node scripts/translate-messages-es-retry.mjs
 */

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const ROOT = path.resolve('.')
const enPath = path.join(ROOT, 'messages', 'en.json')
const esPath = path.join(ROOT, 'messages', 'es.json')

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'))

// Only retry keys that are still identical to English
const RETRY_KEYS = Object.keys(en).filter(k => JSON.stringify(es[k]) === JSON.stringify(en[k]))
console.log(`Retrying ${RETRY_KEYS.length} keys: ${RETRY_KEYS.join(', ')}\n`)

const BATCH_SIZE = 3

function chunkArray(arr, size) {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
  return chunks
}

function parseJsonLoose(s) {
  // Strip markdown fences
  const cleaned = s.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function translateChunk(keys) {
  const obj = {}
  for (const k of keys) obj[k] = en[k]

  const prompt = `You are translating a UI strings JSON file from English to Spanish (Spain, es-ES) for GoGermany — a website helping people move to Germany.

CRITICAL OUTPUT RULES:
- Return ONLY a valid JSON object. No markdown fences, no commentary, no extra text.
- Your entire response must start with { and end with }
- ALL string values must be translated to natural Spanish.
- Keep ALL keys exactly as-is.
- Keep placeholders like {name}, {count}, {locale} unchanged.
- Keep HTML tags like <br/>, <strong> unchanged.
- Keep German proper nouns: Ausbildung, Anmeldung, Lebenslauf, Anschreiben, Sperrkonto, Krankenkasse, BAföG, ZAB, IHK, Goethe, Telc, ÖSD, Studium, BAMF, DAAD, Vorab, Finanzamt, Steuer-ID, Minijob, Deutschlandticket, WG, HWK.
- Keep brand names: GoGermany, Supabase, Vercel, Claude, TLScontact, VFS Global, Fintiba, Expatrio, ImmoScout24, WG-Gesucht.

JSON to translate:
${JSON.stringify(obj, null, 2)}`

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
  const batches = chunkArray(RETRY_KEYS, BATCH_SIZE)

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    process.stdout.write(`Batch ${i + 1}/${batches.length} [${batch.join(', ')}]... `)
    try {
      const translated = await translateChunk(batch)
      // Merge into current es.json
      Object.assign(es, translated)
      // Save after each successful batch
      fs.writeFileSync(esPath, JSON.stringify(es, null, 2), 'utf8')
      console.log('✓')
    } catch (e) {
      console.log(`✗ ${e.message}`)
    }
    if (i < batches.length - 1) await new Promise(r => setTimeout(r, 1200))
  }

  // Final check
  const stillEn = Object.keys(en).filter(k => JSON.stringify(es[k]) === JSON.stringify(en[k]))
  if (stillEn.length === 0) {
    console.log('\nAll keys translated successfully.')
  } else {
    console.log(`\nStill untranslated: ${stillEn.join(', ')}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
