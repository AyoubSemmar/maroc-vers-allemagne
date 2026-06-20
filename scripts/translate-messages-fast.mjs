/**
 * Fast, concurrent UI-messages translator.
 * Translates messages/en.json into one or more target locales, processing
 * top-level keys with a concurrency pool. Large keys (static, visaGuide)
 * are split into sub-keys. Saves after every successful section.
 *
 * Usage:
 *   node scripts/translate-messages-fast.mjs hi ur nl
 *   node scripts/translate-messages-fast.mjs nl --concurrency=4
 *
 * Idempotent: skips any section already present and different from English.
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

const LANG_FULL = {
  fr: 'French (France, fr-FR)',
  de: 'German (Germany, de-DE)',
  es: 'Spanish (Spain, es-ES)',
  tr: 'Turkish (Turkey, tr-TR)',
  fa: 'Persian/Farsi (Iran, fa-IR)',
  pt: 'Portuguese (Brazil, pt-BR)',
  ru: 'Russian (Russia, ru-RU)',
  hi: 'Hindi (India, hi-IN)',
  ur: 'Urdu (Pakistan, ur-PK)',
  nl: 'Dutch (Netherlands, nl-NL)',
}

const args = process.argv.slice(2)
const concArg = args.find(a => a.startsWith('--concurrency='))
const CONCURRENCY = concArg ? parseInt(concArg.split('=')[1], 10) : 4
const LANGS = args.filter(a => !a.startsWith('--'))
if (LANGS.length === 0) { console.error('Usage: node scripts/translate-messages-fast.mjs <lang...>'); process.exit(1) }
for (const l of LANGS) if (!LANG_FULL[l]) { console.error(`Unknown locale: ${l}`); process.exit(1) }

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const ROOT = path.resolve('.')
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'messages/en.json'), 'utf8'))

// Keys too large to translate in one call — split into sub-keys
const SPLIT_KEYS = new Set(['static', 'visaGuide', 'documentChecklist', 'eligibilityChecker', 'writingExercise'])

function parseJsonLoose(s) {
  const cleaned = s.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function translateOne(langFull, key, value) {
  const prompt = `Translate this UI strings JSON section from English to ${langFull} for GoGermany (website helping people move to Germany).

OUTPUT RULES (CRITICAL):
- Your response must be ONLY valid JSON — start with { and end with }
- No markdown fences, no preamble, no explanation
- Translate ALL string values to natural ${langFull}
- Keep ALL keys unchanged
- Keep placeholders {name}, {count} etc unchanged
- Keep HTML tags unchanged
- Keep German terms: Ausbildung, Anmeldung, Lebenslauf, Anschreiben, Sperrkonto, Krankenkasse, BAföG, ZAB, IHK, Goethe, Telc, ÖSD, Studium, BAMF, DAAD, Vorab, Steuer-ID, Minijob, Deutschlandticket, WG, HWK, Finanzamt
- Keep brand names: GoGermany, TLScontact, VFS Global, Fintiba, Expatrio, ImmoScout24, WG-Gesucht

The value to translate is wrapped under "value" — return the SAME shape:
{ "value": <translated, same JSON type as input> }

Section to translate (key: "${key}"):
${JSON.stringify({ value }, null, 2)}`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 16000,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  const parsed = parseJsonLoose(text)
  // Uniform unwrap — works for both string and object values, avoiding the
  // model echoing the dotted key name back as a wrapper.
  return ('value' in parsed) ? parsed.value : parsed
}

async function pool(items, concurrency, worker) {
  let idx = 0
  const runNext = async () => {
    while (idx < items.length) {
      const i = idx++
      await worker(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runNext))
}

function isDone(enVal, outVal) {
  return outVal !== undefined && JSON.stringify(outVal) !== JSON.stringify(enVal)
}

async function translateLang(lang) {
  const langFull = LANG_FULL[lang]
  const outFile = `messages/${lang}.json`
  const outPath = path.join(ROOT, outFile)
  let out = {}
  if (fs.existsSync(outPath)) { try { out = JSON.parse(fs.readFileSync(outPath, 'utf8')) } catch {} }

  console.log(`\n══ ${lang} (${langFull}) ══`)

  // Build the worklist: { key } for simple keys, { key, subKey } for split keys
  const jobs = []
  for (const key of Object.keys(en)) {
    if (SPLIT_KEYS.has(key)) {
      if (!out[key]) out[key] = {}
      for (const subKey of Object.keys(en[key])) {
        if (!isDone(en[key][subKey], out[key][subKey])) jobs.push({ key, subKey })
      }
    } else if (!isDone(en[key], out[key])) {
      jobs.push({ key })
    }
  }
  console.log(`${jobs.length} sections to translate · concurrency ${CONCURRENCY}`)

  let done = 0, failed = 0
  const save = () => fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')

  await pool(jobs, CONCURRENCY, async (job) => {
    const label = job.subKey ? `${job.key}.${job.subKey}` : job.key
    const src = job.subKey ? en[job.key][job.subKey] : en[job.key]
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const result = await translateOne(langFull, label, src)
        if (job.subKey) out[job.key][job.subKey] = result
        else out[job.key] = result
        save()
        done++
        process.stdout.write(`\r  ✓ ${done}  ✗ ${failed}   `)
        return
      } catch (e) {
        if (attempt === 2) { failed++; console.log(`\n  ✗ ${label}: ${e.message}`) }
      }
    }
  })

  console.log(`\n  Done: ${done} translated, ${failed} failed`)
}

async function main() {
  for (const lang of LANGS) await translateLang(lang)
  console.log('\n✅ All message locales complete.')
}

main().catch(e => { console.error(e); process.exit(1) })
