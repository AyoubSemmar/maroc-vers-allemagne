/**
 * Translate the new Goethe lessons (Arabic base in lib/german-data/extra-lessons.json)
 * into the 11 non-Arabic locale overlays (lib/german-data/translations/<level>.<loc>.json).
 *
 * Structure comes back via tool-use (always valid JSON); then we RE-INJECT the
 * load-bearing German fields from the source (answers, options, words, pairs,
 * audioPrompt, vocab.german/example, rule.example, gender/plural/type) so a
 * translation can never corrupt the German content or the answer keys.
 *
 * Run: node scripts/goethe-translate.mjs           (all 11 locales)
 *      node scripts/goethe-translate.mjs fr en      (subset)
 */
import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

for (const line of fs.readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = process.env.GOETHE_TR_MODEL || 'claude-sonnet-4-6'

const LOCALES = { fr: 'French', en: 'English', de: 'German', es: 'Spanish', tr: 'Turkish', fa: 'Persian (Farsi)', pt: 'Portuguese', ru: 'Russian', hi: 'Hindi', ur: 'Urdu', nl: 'Dutch' }
const want = process.argv.slice(2).filter(a => LOCALES[a])
const targets = want.length ? want : Object.keys(LOCALES)

const extra = JSON.parse(fs.readFileSync(path.resolve('lib/german-data/extra-lessons.json'), 'utf8'))

// Source overlay object (no order — localize keeps the merged order).
const overlaySource = e => {
  const L = e.lesson
  return { id: L.id, title: L.title, grammar: L.grammar, vocabulary: L.vocabulary, exercise: L.exercise }
}

const TOOL = {
  name: 'submit_translation',
  description: 'Return the lesson with all Arabic text translated, German kept verbatim.',
  input_schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      grammar: {
        type: 'object',
        properties: {
          title: { type: 'string' }, content: { type: 'string' },
          tables: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, headers: { type: 'array', items: { type: 'string' } }, rows: { type: 'array', items: { type: 'object', properties: { cells: { type: 'array', items: { type: 'string' } } }, required: ['cells'] } }, note: { type: 'string' } }, required: ['headers', 'rows'] } },
          rules: { type: 'array', items: { type: 'object', properties: { rule: { type: 'string' }, example: { type: 'string' }, translation: { type: 'string' } }, required: ['rule', 'example', 'translation'] } },
          examples: { type: 'array', items: { type: 'string' } },
          tip: { type: 'string' },
        },
        required: ['title', 'content', 'tables', 'rules', 'examples', 'tip'],
      },
      vocabulary: { type: 'array', items: { type: 'object', properties: { german: { type: 'string' }, arabic: { type: 'string' }, example: { type: 'string' }, exampleArabic: { type: 'string' } }, required: ['german', 'arabic', 'example', 'exampleArabic'] } },
      exercise: { type: 'object', properties: { questions: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, question: { type: 'string' }, hint: { type: 'string' } }, required: ['id', 'question'] } } }, required: ['questions'] },
    },
    required: ['title', 'grammar', 'vocabulary', 'exercise'],
  },
}

async function translate(src, locName) {
  const prompt = `Translate this German-course lesson from Arabic into ${locName}.
RULES:
- Translate ALL Arabic/instructional text (title's Arabic part, grammar explanation, table Arabic labels/cells, rule text + its translation, examples' translation part, tip, each question, each hint, each vocab meaning "arabic" and "exampleArabic") into natural ${locName}.
- KEEP every German word/sentence EXACTLY as-is (do not translate German). German grammar terms (Nominativ, Akkusativ, Genitiv, Partizip…) stay in German.
- "examples" are formatted "German sentence — translation": keep the German, translate the part after —.
- Preserve the exact array lengths and the question "id" values.

LESSON JSON:
${JSON.stringify(src)}`
  const resp = await ai.messages.create({
    model: MODEL, max_tokens: 8000, temperature: 0.3,
    tools: [TOOL], tool_choice: { type: 'tool', name: 'submit_translation' },
    messages: [{ role: 'user', content: prompt }],
  })
  const b = resp.content.find(c => c.type === 'tool_use')
  if (!b) throw new Error('no tool_use')
  return b.input
}

// Merge translation over source, RE-INJECTING all load-bearing German fields.
function reinject(src, tr) {
  const g = src.grammar, tg = tr.grammar || {}
  return {
    id: src.id,
    title: tr.title || src.title,
    grammar: {
      title: tg.title || g.title,
      content: tg.content || g.content,
      tables: (g.tables || []).map((t, i) => ({
        ...(t.title !== undefined ? { title: (tg.tables?.[i]?.title) ?? t.title } : {}),
        headers: tg.tables?.[i]?.headers?.length === t.headers.length ? tg.tables[i].headers : t.headers,
        rows: t.rows.map((r, ri) => ({ cells: (tg.tables?.[i]?.rows?.[ri]?.cells?.length === r.cells.length) ? tg.tables[i].rows[ri].cells : r.cells })),
        ...(t.note !== undefined ? { note: tg.tables?.[i]?.note ?? t.note } : {}),
        ...(t.theme ? { theme: t.theme } : {}),
      })),
      rules: (g.rules || []).map((r, i) => ({ rule: tg.rules?.[i]?.rule || r.rule, example: r.example, translation: tg.rules?.[i]?.translation || r.translation })),
      examples: (g.examples || []).map((e, i) => tg.examples?.[i] || e),
      tip: tg.tip || g.tip,
    },
    vocabulary: src.vocabulary.map((v, i) => ({ ...v, arabic: tr.vocabulary?.[i]?.arabic || v.arabic, exampleArabic: tr.vocabulary?.[i]?.exampleArabic || v.exampleArabic })),
    exercise: { questions: src.exercise.questions.map((q, i) => ({ ...q, question: tr.exercise?.questions?.[i]?.question || q.question, ...(q.hint !== undefined ? { hint: tr.exercise?.questions?.[i]?.hint || q.hint } : {}) })) },
  }
}

async function pool(items, n, fn) {
  const q = [...items]; const workers = Array.from({ length: n }, async () => { while (q.length) { const it = q.shift(); await fn(it) } })
  await Promise.all(workers)
}

async function main() {
  for (const loc of targets) {
    const files = {}
    for (const lv of ['a1', 'a2', 'b1']) {
      const p = path.resolve(`lib/german-data/translations/${lv}.${loc}.json`)
      files[lv] = { p, data: JSON.parse(fs.readFileSync(p, 'utf8')) }
      files[lv].data.lessons = files[lv].data.lessons || {}
    }
    let ok = 0, fail = 0
    await pool(extra, 4, async (e) => {
      const lv = e.level.toLowerCase()
      const src = overlaySource(e)
      for (let a = 1; a <= 3; a++) {
        try {
          const tr = await translate(src, LOCALES[loc])
          files[lv].data.lessons[e.lesson.id] = reinject(src, tr)
          ok++; return
        } catch (err) { if (a === 3) { fail++; console.log(`  ${loc} ${e.lesson.id} FAIL: ${err.message}`) } }
      }
    })
    for (const lv of ['a1', 'a2', 'b1']) fs.writeFileSync(files[lv].p, JSON.stringify(files[lv].data, null, 2))
    console.log(`${loc}: +${ok} lessons${fail ? `, ${fail} failed` : ''}`)
  }
}
main().catch(e => { console.error(e); process.exit(1) })
