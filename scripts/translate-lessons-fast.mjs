/**
 * Fast, concurrent Learn-German lessons translator.
 * Reads lib/german-data/translations/<level>.en.json overlays as source and
 * writes lib/german-data/translations/<level>.<lang>.json for each target,
 * translating lessons with a concurrency pool.
 *
 * Usage:
 *   node scripts/translate-lessons-fast.mjs hi ur nl
 *   node scripts/translate-lessons-fast.mjs nl --concurrency=6
 *
 * Idempotent: skips any lesson already present in the output overlay.
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
  fr: 'French (France, fr-FR)', de: 'German (Germany, de-DE)', es: 'Spanish (Spain, es-ES)',
  tr: 'Turkish (Turkey, tr-TR)', fa: 'Persian/Farsi (Iran, fa-IR)', pt: 'Portuguese (Brazil, pt-BR)',
  ru: 'Russian (Russia, ru-RU)', hi: 'Hindi (India, hi-IN)', ur: 'Urdu (Pakistan, ur-PK)',
  zh: 'Simplified Chinese (China, zh-CN)',
}
const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1']

const args = process.argv.slice(2)
const concArg = args.find(a => a.startsWith('--concurrency='))
const CONCURRENCY = concArg ? parseInt(concArg.split('=')[1], 10) : 6
const LANGS = args.filter(a => !a.startsWith('--'))
if (LANGS.length === 0) { console.error('Usage: node scripts/translate-lessons-fast.mjs <lang...>'); process.exit(1) }
for (const l of LANGS) if (!LANG_FULL[l]) { console.error(`Unknown locale: ${l}`); process.exit(1) }

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function parseJsonLoose(s) {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function translateLesson(lang, langFull, lesson) {
  const prompt = `You are translating a German-language teaching lesson from English into ${langFull}. Translation must be natural and pedagogically accurate.

Strict rules:
  • German vocabulary and example sentences stay UNCHANGED — they are the language being taught.
  • Keep "german" and "example" fields in vocabulary unchanged.
  • Translate "arabic" fields in vocabulary to ${langFull} (the field is named "arabic" but holds the gloss in the target language).
  • Translate "exampleArabic" fields to ${langFull}.
  • In grammar tables: translate non-German cells; keep German cells unchanged.
  • In rules: translate "rule" and "translation"; keep "example" (German) unchanged.
  • In examples (format "German sentence — English sentence"): keep the German half; replace the English half with ${langFull}.
  • In exercises: translate question text and hints; keep answers in German.

Source English lesson:
\`\`\`json
${JSON.stringify(lesson, null, 2)}
\`\`\`

Return ONLY a JSON object — a Partial<Lesson> overlay with key "${lang}". NO commentary:
{
  "${lang}": {
    "title": "...",
    "grammar": { "title": "...", "content": "...", "tables": [...], "rules": [...], "examples": [...], "tip": "..." },
    "vocabulary": [...],
    "exercise": { "questions": [...] }
  }
}`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 9000,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  return parseJsonLoose(text)[lang]
}

async function pool(items, concurrency, worker) {
  let idx = 0
  const runNext = async () => {
    while (idx < items.length) { const i = idx++; await worker(items[i]) }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runNext))
}

async function translateLevelMeta(langFull, enOverlay) {
  const resp = await client.messages.create({
    model: 'claude-haiku-4-5', max_tokens: 200, temperature: 0.2,
    messages: [{ role: 'user', content: `Translate from English to ${langFull}. Return ONLY JSON: {"title":"...","description":"..."}\ntitle: "${enOverlay.title}"\ndescription: "${enOverlay.description || ''}"` }],
  })
  const t = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  return parseJsonLoose(t)
}

async function translateLang(lang) {
  const langFull = LANG_FULL[lang]
  console.log(`\n══ ${lang} (${langFull}) ══`)
  let grandDone = 0, grandFail = 0

  for (const level of LEVELS) {
    const enPath = path.resolve(`lib/german-data/translations/${level}.en.json`)
    const outPath = path.resolve(`lib/german-data/translations/${level}.${lang}.json`)
    if (!fs.existsSync(enPath)) { console.log(`  ${level}: no en overlay, skipping`); continue }

    const enOverlay = JSON.parse(fs.readFileSync(enPath, 'utf8'))
    const lessonIds = Object.keys(enOverlay.lessons || {})
    if (lessonIds.length === 0) continue

    let overlay = { title: '', description: '', lessons: {} }
    if (fs.existsSync(outPath)) { try { overlay = JSON.parse(fs.readFileSync(outPath, 'utf8')) } catch {} }
    if (!overlay.lessons) overlay.lessons = {}

    if (enOverlay.title && !overlay.title) {
      try { const meta = await translateLevelMeta(langFull, enOverlay); overlay.title = meta.title; overlay.description = meta.description } catch {}
    }

    const todo = lessonIds.filter(id => !overlay.lessons?.[id]?.title)
    process.stdout.write(`  ${level.toUpperCase()}: ${todo.length}/${lessonIds.length} to translate `)

    let done = 0, failed = 0
    const save = () => fs.writeFileSync(outPath, JSON.stringify(overlay, null, 2), 'utf8')

    await pool(todo, CONCURRENCY, async (lessonId) => {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const translated = await translateLesson(lang, langFull, { id: lessonId, ...enOverlay.lessons[lessonId] })
          overlay.lessons[lessonId] = translated
          save()
          done++; grandDone++
          process.stdout.write(`\r  ${level.toUpperCase()}: ✓ ${done}  ✗ ${failed}        `)
          return
        } catch (e) {
          if (attempt === 2) { failed++; grandFail++ }
        }
      }
    })
    save()
    console.log(`\r  ${level.toUpperCase()}: ✓ ${done}  ✗ ${failed}  → wrote ${level}.${lang}.json`)
  }
  console.log(`  ${lang} total: ${grandDone} translated, ${grandFail} failed`)
}

async function main() {
  for (const lang of LANGS) await translateLang(lang)
  console.log('\n✅ All lesson locales complete.')
}

main().catch(e => { console.error(e); process.exit(1) })
