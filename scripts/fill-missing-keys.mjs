/**
 * Fill any leaf keys present in messages/en.json but missing from a locale
 * file. Translates only the gaps (one batch per locale). Idempotent.
 *
 * Usage: node scripts/fill-missing-keys.mjs            (all non-en locales)
 *        node scripts/fill-missing-keys.mjs hi ur nl
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

const LANG_FULL = {
  ar: 'Arabic (ar)', fr: 'French (fr-FR)', de: 'German (de-DE)', es: 'Spanish (es-ES)',
  tr: 'Turkish (tr-TR)', fa: 'Persian/Farsi (fa-IR)', pt: 'Portuguese (pt-BR)', ru: 'Russian (ru-RU)',
  hi: 'Hindi (India, hi-IN)', ur: 'Urdu (Pakistan, ur-PK)', nl: 'Dutch (Netherlands, nl-NL)',
}

const args = process.argv.slice(2)
const LOCALES = args.length ? args : Object.keys(LANG_FULL)

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'))

function leafPaths(o, pre = '') {
  let r = []
  for (const [k, v] of Object.entries(o)) {
    const p = pre ? `${pre}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) r = r.concat(leafPaths(v, p))
    else r.push(p)
  }
  return r
}
function getPath(o, p) { return p.split('.').reduce((a, k) => a?.[k], o) }
function setPath(o, p, val) {
  const parts = p.split('.')
  let cur = o
  for (let i = 0; i < parts.length - 1; i++) { if (!cur[parts[i]]) cur[parts[i]] = {}; cur = cur[parts[i]] }
  cur[parts[parts.length - 1]] = val
}

function parseJsonLoose(s) {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const a = cleaned.indexOf('{'), b = cleaned.lastIndexOf('}')
  if (a < 0 || b < 0) throw new Error('No JSON object found')
  return JSON.parse(cleaned.slice(a, b + 1))
}

async function translateMap(map, langFull) {
  const prompt = `Translate the VALUES of this JSON object from English to ${langFull} for GoGermany (a site helping people move to Germany).
Rules: return ONLY valid JSON with the SAME keys; keep placeholders like {country}, {n}, {name} unchanged; keep German terms (Ausbildung, Studium, Anmeldung, etc.) and brand names unchanged; natural phrasing.

${JSON.stringify(map, null, 2)}`
  const resp = await client.messages.create({
    model: 'claude-haiku-4-5', max_tokens: 16000, temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  return parseJsonLoose(text)
}

const enPaths = leafPaths(en)

async function main() {
  for (const code of LOCALES) {
    if (code === 'en') continue
    const fp = `messages/${code}.json`
    if (!fs.existsSync(fp)) { console.log(`${code}: no file, skipping`); continue }
    const j = JSON.parse(fs.readFileSync(fp, 'utf8'))
    const missing = enPaths.filter(p => getPath(j, p) === undefined)
    if (missing.length === 0) { console.log(`${code}: complete`); continue }

    // Use a flat numeric-keyed map to avoid dotted-key echo issues
    const map = {}
    missing.forEach((p, i) => { map['k' + i] = getPath(en, p) })
    process.stdout.write(`${code}: ${missing.length} missing... `)
    try {
      const out = await translateMap(map, LANG_FULL[code])
      missing.forEach((p, i) => { if (out['k' + i] !== undefined) setPath(j, p, out['k' + i]) })
      fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8')
      console.log('✓')
    } catch (e) {
      console.log(`✗ ${e.message}`)
    }
  }
  console.log('\nDone.')
}

main().catch(e => { console.error(e); process.exit(1) })
