/**
 * One-off script: translate messages/en.json → messages/es.json
 *
 * Splits the JSON into chunks of ~100 keys at a time to stay within
 * token limits, then merges the results.
 *
 * Run:  node scripts/translate-messages-es.mjs
 * Needs: ANTHROPIC_API_KEY in env (copy from .env.local)
 */

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const ROOT = path.resolve('.')
const enPath = path.join(ROOT, 'messages', 'en.json')
const esPath = path.join(ROOT, 'messages', 'es.json')

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))

// Split top-level keys into batches
const TOP_KEYS = Object.keys(en)
const BATCH_SIZE = 8  // top-level sections per call

function chunkArray(arr, size) {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
  return chunks
}

function parseJsonLoose(s) {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function translateChunk(chunk) {
  const obj = {}
  for (const k of chunk) obj[k] = en[k]

  const prompt = `You are translating a UI strings JSON file from English to Spanish (Spain, es-ES) for a website called GoGermany that helps people move to Germany.

Rules:
- Translate ALL string values to natural, fluent Spanish.
- Keep ALL keys exactly as-is (do not translate keys).
- Keep placeholders like {name}, {count}, {locale} unchanged.
- Keep HTML tags like <br/>, <strong> unchanged.
- Keep proper nouns in German: Ausbildung, Anmeldung, Lebenslauf, Anschreiben, Sperrkonto, Krankenkasse, BAföG, ZAB, IHK, Goethe, Telc, ÖSD, Studium, BAMF, DAAD, Vorab, Ausländerbehörde, Bundesagentur für Arbeit, Finanzamt, Steuer-ID, Minijob, Deutschlandticket, WG, IHK, HWK.
- Do NOT translate brand names: GoGermany, Supabase, Vercel, Claude, TLScontact, VFS Global, Fintiba, Expatrio, Coracle, ImmoScout24, WG-Gesucht.
- Numbers and URLs stay unchanged.
- Return ONLY valid JSON with the same structure as input, no commentary.

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
  const batches = chunkArray(TOP_KEYS, BATCH_SIZE)
  const result = {}

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`Batch ${i + 1}/${batches.length}: [${batch.join(', ')}]`)
    try {
      const translated = await translateChunk(batch)
      Object.assign(result, translated)
      // Small delay to avoid rate limits
      if (i < batches.length - 1) await new Promise(r => setTimeout(r, 1000))
    } catch (e) {
      console.error(`Batch ${i + 1} failed:`, e.message)
      // On failure, copy English as fallback so we don't lose keys
      for (const k of batch) result[k] = en[k]
    }
  }

  fs.writeFileSync(esPath, JSON.stringify(result, null, 2), 'utf8')
  console.log(`\nWrote ${esPath}`)
  console.log(`Keys translated: ${Object.keys(result).length}/${TOP_KEYS.length}`)
}

main().catch(e => { console.error(e); process.exit(1) })
