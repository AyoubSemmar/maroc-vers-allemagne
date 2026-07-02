// Transform the reviewed draft (scripts/out/goethe/new-lessons.json) into the
// shipped lib/german-data/extra-lessons.json in the exact Lesson shape, so
// index.ts can merge the new lessons into each level at the right position.
// Run: node scripts/goethe-swap.mjs
import fs from 'fs'
import path from 'path'

const draft = JSON.parse(fs.readFileSync(path.resolve('scripts/out/goethe/new-lessons.json'), 'utf8'))

const out = draft.map(({ level, id, insertAfter, de, lesson: L }) => {
  const tables = (L.tables || []).map(t => ({
    title: t.title || undefined,
    headers: t.headers || [],
    rows: (t.rows || []).map(r => ({ cells: r })),
    ...(t.note ? { note: t.note } : {}),
    theme: 'default',
  }))
  const questions = (L.exercise || []).map((q, i) => {
    const base = { type: q.type, id: `${id}-q${i + 1}`, question: q.question, answer: q.answer }
    if (q.options) base.options = q.options
    if (q.words) base.words = q.words
    if (q.pairs) base.pairs = q.pairs
    if (q.hint) base.hint = q.hint
    if (q.audioPrompt) base.audioPrompt = q.audioPrompt
    return base
  })
  return {
    level,
    insertAfter,
    lesson: {
      id,
      title: `${L.titleAr} — ${de}`,
      order: 0, // real order assigned by index.ts merge
      grammar: {
        title: L.grammarTitle,
        content: L.grammarContent,
        tables,
        rules: L.rules || [],
        examples: L.examples || [],
        tip: L.tip,
      },
      vocabulary: (L.vocabulary || []).map(v => ({
        german: v.german, arabic: v.arabic,
        ...(v.gender ? { gender: v.gender } : {}),
        ...(v.plural ? { plural: v.plural } : {}),
        example: v.example, exampleArabic: v.exampleArabic, type: v.type,
      })),
      exercise: { questions },
    },
  }
})

const dest = path.resolve('lib/german-data/extra-lessons.json')
// Merge, don't overwrite: keep already-shipped lessons, add/replace by id.
const existing = fs.existsSync(dest) ? JSON.parse(fs.readFileSync(dest, 'utf8')) : []
const byId = new Map(existing.map(e => [e.lesson.id, e]))
for (const e of out) byId.set(e.lesson.id, e)
const merged = [...byId.values()]
fs.writeFileSync(dest, JSON.stringify(merged, null, 2))
console.log(`Wrote ${dest}: ${merged.length} lessons total (+${out.length} this run)`)
for (const e of out) console.log(`  ${e.level} ${e.lesson.id} after ${e.insertAfter}: ${e.lesson.vocabulary.length} vocab, ${e.lesson.exercise.questions.length} ex`)
