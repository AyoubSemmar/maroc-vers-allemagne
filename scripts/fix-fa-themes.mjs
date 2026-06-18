/**
 * Fix: translate fa.writingExercise.themes one by one (50 keys, 18K chars total).
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

function save() {
  fs.writeFileSync(path.join(ROOT, 'messages/fa.json'), JSON.stringify(fa, null, 2), 'utf8')
}

async function translateBatch(batch) {
  const prompt = `Translate these German writing exercise theme descriptions from English to Persian/Farsi (Iran, fa-IR). Each theme has a title and prompt field.

OUTPUT RULES (CRITICAL):
- Your response must be ONLY valid JSON — start with { and end with }
- No markdown fences, no preamble, no explanation
- Translate ALL string values to natural formal Persian (Farsi)
- Keep ALL keys unchanged
- Keep German level prefixes (A1, A2, B1, B2, C1) as-is
- Keep German terms: Ausbildung, Anmeldung, etc.

Themes to translate:
${JSON.stringify(batch, null, 2)}`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 4000,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  return parseJsonLoose(text)
}

async function main() {
  if (!fa.writingExercise) fa.writingExercise = {}
  if (!fa.writingExercise.themes) fa.writingExercise.themes = {}

  const allThemeKeys = Object.keys(en.writingExercise.themes)
  const pending = allThemeKeys.filter(k => {
    const faVal = fa.writingExercise.themes[k]
    const enVal = en.writingExercise.themes[k]
    return faVal === undefined || JSON.stringify(faVal) === JSON.stringify(enVal)
  })

  console.log(`Pending themes: ${pending.length}/${allThemeKeys.length}`)

  const BATCH = 5
  for (let i = 0; i < pending.length; i += BATCH) {
    const slice = pending.slice(i, i + BATCH)
    const batchObj = Object.fromEntries(slice.map(k => [k, en.writingExercise.themes[k]]))
    process.stdout.write(`  batch ${Math.floor(i/BATCH)+1}/${Math.ceil(pending.length/BATCH)} (${slice.join(', ')})... `)
    try {
      const translated = await translateBatch(batchObj)
      Object.assign(fa.writingExercise.themes, translated)
      save()
      console.log('✓')
      await new Promise(r => setTimeout(r, 1200))
    } catch (e) {
      console.log(`✗ ${e.message}`)
      // fallback: try one by one
      for (const k of slice) {
        process.stdout.write(`    ${k}... `)
        try {
          const single = await translateBatch({ [k]: en.writingExercise.themes[k] })
          fa.writingExercise.themes[k] = single[k] ?? single
          save()
          console.log('✓')
          await new Promise(r => setTimeout(r, 1000))
        } catch (e2) {
          console.log(`✗ ${e2.message}`)
        }
      }
    }
  }
  console.log('\nDone.')
}

main().catch(e => { console.error(e); process.exit(1) })
