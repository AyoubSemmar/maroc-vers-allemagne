// Translate a learn-german level's lesson data (Arabic source) into
// fr / en / de overlays stored at lib/german-data/translations/<level>.<locale>.json.
//
// Usage:
//   node scripts/translate_german_level.mjs --level a1
//   node scripts/translate_german_level.mjs --level a1 --locales en
//   node scripts/translate_german_level.mjs --level a1 --force
//   node scripts/translate_german_level.mjs --level a1 --lessons a1-01,a1-02

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import Anthropic from '@anthropic-ai/sdk'

const require = createRequire(import.meta.url)

// Load .env.local (no dotenv dep)
try {
  const envFile = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  for (const line of envFile.split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (!m) continue
    if (process.env[m[1]]) continue
    let v = m[2]
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    process.env[m[1]] = v
  }
} catch {}

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
if (!ANTHROPIC_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1) }

const args = process.argv.slice(2)
function arg(name, fallback) { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : fallback }
const LEVEL   = (arg('level', 'a1') || 'a1').toLowerCase()
const FORCE   = args.includes('--force')
const LOCALES = (arg('locales', 'fr,en,de') || 'fr,en,de').split(',').map(s => s.trim()).filter(Boolean)
const ONLY    = (arg('lessons', '') || '').split(',').map(s => s.trim()).filter(Boolean)

const LOCALE_NAME = { fr: 'French', en: 'English', de: 'German' }

// Dynamic import of the level module via tsx-less trick: read the TS source
// and pull lesson data out by running it in a sandboxed eval isn't practical —
// instead, call `tsx` via Node's register? Simplest: use tsx runtime.
// Fallback: require the compiled JS if present, else tsx-register.
//
// We'll use `tsx` programmatically. If not installed, instruct user to
// `npm i -D tsx` or run the script with `npx tsx`.
//
// Easier: use `node --import=tsx` when invoking. Since we can't control
// the launcher from inside the script, we ship a tiny .ts loader: we
// eval the TS file by reading it as text and extracting the exported array
// via a regex-y strategy. But that's fragile.
//
// Best: use dynamic import with a .mjs sibling. We'll generate a tiny
// CJS shim that requires ts-node... too heavy. Use tsx via child_process
// to print JSON.

import { spawnSync } from 'node:child_process'

function loadLevelData(levelId) {
  const projectRoot = fileURLToPath(new URL('..', import.meta.url))
  const res = spawnSync('npx', ['tsx', 'scripts/_extract_level.ts', levelId], {
    encoding: 'utf8', shell: true, cwd: projectRoot, maxBuffer: 50 * 1024 * 1024,
  })
  if (res.status !== 0) {
    console.error('tsx extraction failed:', res.stderr || res.stdout)
    process.exit(1)
  }
  return JSON.parse(res.stdout)
}

const level = loadLevelData(LEVEL)
if (!level) { console.error(`Level ${LEVEL} not found`); process.exit(1) }

console.log(`Loaded ${level.id}: ${level.lessons.length} lessons. Locales: ${LOCALES.join(', ')}. Force: ${FORCE}${ONLY.length ? `. Only: ${ONLY.join(',')}` : ''}`)

const client = new Anthropic({ apiKey: ANTHROPIC_KEY })

const SYSTEM = `You are translating a German-language learning lesson designed for Arabic-speaking Moroccans. The source data is in Arabic with German target examples. Your job is to translate the Arabic portions into the target language while LEAVING ALL GERMAN TEXT EXACTLY UNCHANGED.

STRICT RULES:
1. Any field that is clearly a German word, phrase, sentence, conjugation, or grammar term (Nominativ, Akkusativ, Pronomen, ich, du, er, sie, es, wir, ihr, Sie, Maskulin, Feminin, Neutrum, Plural, etc.) MUST be copied verbatim.
2. German examples (e.g. "Ich bin Ahmed.", "Wie heißt du?") MUST stay in German, unchanged.
3. The "german", "example", "plural", "audioPrompt" vocab fields are German → copy unchanged.
4. The "arabic", "exampleArabic" vocab fields → translate to target language.
5. Grammar "content", "title", "tip", "note" → translate (but keep embedded German words/examples in German, including **bold** markdown markers).
6. Table headers: German grammar headers (Pronomen, Nominativ, ich, du, Maskulin...) stay German. Non-German headers (e.g. "المعنى" → "Meaning", "السؤال" → "Question", "الترجمة" → "Translation", "مثال" stays "Beispiel" if German, else translate) translate to target language.
7. Table cells: each cell is independent. If the cell is a German word/phrase (e.g. "bin", "bist", "Ich heiße Ahmed."), keep it German. If it is an Arabic translation/explanation ("أنا أكون"), translate it.
8. Grammar rules: "rule" and "translation" fields → translate. "example" (German) stays.
9. Grammar examples array: each string is typically "German — Arabic" separated by an em-dash. Keep the German half unchanged, translate the Arabic half. Preserve the em-dash separator.
10. Exercise questions: "question" and "hint" → translate. "options" → each option is independent; keep German answers in German. "answer" → keep as-is (it is the expected answer string, usually German or a short token). "audioPrompt" → keep German.
11. Matching pairs: "left" side typically German (keep); "right" side typically Arabic (translate).
12. Preserve IDs ("a1-01", "a1-01-q1", etc.) EXACTLY. Preserve all "type" enum values, "order" numbers, "gender" ('der'|'die'|'das'|'pl'), "theme", "highlight" booleans EXACTLY.
13. Preserve markdown: **bold**, line breaks, arrow → marks, emojis.
14. Output valid JSON only. Every " inside a string MUST be escaped as \\". Every newline inside a string MUST be \\n.

Target language: {{LANG}}. Natural, idiomatic tone for a young adult learner.`

async function translateLesson(lesson, locale) {
  const system = SYSTEM.replace('{{LANG}}', LOCALE_NAME[locale])
  const userPrompt = `Translate the following lesson JSON according to the rules. Return the same shape, as pure JSON.\n\n${JSON.stringify(lesson, null, 2)}`

  async function ask(extra = '') {
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 16000,
      system,
      messages: [{ role: 'user', content: [{ type: 'text', text: userPrompt + extra }] }],
    })
    const text = resp.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim()
    const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
    const first = stripped.indexOf('{')
    const last  = stripped.lastIndexOf('}')
    return first >= 0 && last > first ? stripped.slice(first, last + 1) : stripped
  }

  try {
    return JSON.parse(await ask())
  } catch (e1) {
    const repaired = await ask('\n\nYour previous output had invalid JSON. Fix all escaping: every " inside strings must be \\" and every newline must be \\n. Return pure valid JSON only.')
    return JSON.parse(repaired)
  }
}

// Translate level meta (title + description) once per locale
async function translateMeta(levelMeta, locale) {
  const system = `Translate the following JSON fields from Arabic into ${LOCALE_NAME[locale]}. Keep the shape and keys. Return pure JSON.`
  const resp = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system,
    messages: [{ role: 'user', content: [{ type: 'text', text: JSON.stringify(levelMeta) }] }],
  })
  const text = resp.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim()
  const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
  const first = stripped.indexOf('{')
  const last  = stripped.lastIndexOf('}')
  return JSON.parse(first >= 0 ? stripped.slice(first, last + 1) : stripped)
}

async function run() {
  const dir = fileURLToPath(new URL('../lib/german-data/translations/', import.meta.url))
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  for (const locale of LOCALES) {
    const outPath = `${dir}${LEVEL}.${locale}.json`
    const existing = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8') || '{}') : {}
    const overlay = { ...existing }
    overlay.lessons = overlay.lessons ?? {}

    // Meta (title + description)
    if (FORCE || !overlay.title || !overlay.description) {
      console.log(`[${locale}] meta...`)
      try {
        const meta = await translateMeta({ title: level.title, description: level.description }, locale)
        overlay.title = meta.title ?? overlay.title
        overlay.description = meta.description ?? overlay.description
      } catch (e) {
        console.error(`[${locale}] meta FAILED:`, e.message)
      }
    }

    // Lessons
    for (const lesson of level.lessons) {
      if (ONLY.length && !ONLY.includes(lesson.id)) continue
      const have = overlay.lessons[lesson.id]
      const hasTitle = have && typeof have.title === 'string' && have.title.trim().length > 0
      if (hasTitle && !FORCE) {
        console.log(`[${locale}] ${lesson.id}: skip (present)`)
        continue
      }
      try {
        console.log(`[${locale}] ${lesson.id}: translating...`)
        const translated = await translateLesson(lesson, locale)
        overlay.lessons[lesson.id] = translated
        writeFileSync(outPath, JSON.stringify(overlay, null, 2))
        console.log(`[${locale}] ${lesson.id}: saved`)
      } catch (e) {
        console.error(`[${locale}] ${lesson.id}: FAILED`, e.message)
      }
    }

    writeFileSync(outPath, JSON.stringify(overlay, null, 2))
  }

  console.log('Done.')
}

run().catch(e => { console.error(e); process.exit(1) })
