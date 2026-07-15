// Validates and inserts the in-session-written B2/C1 devoirs (Lesen/Hören/
// Schreiben per lesson) into `assignments`, mirroring the row shape of
// scripts/generate-devoirs.ts. Idempotent: skips (lessonId, skill) pairs that
// already exist. Usage: node --env-file=.env.local scripts/insert-devoirs-b2c1.mjs <file.json> [...]
import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const SCHREIB = { B2: { min: 150, max: 200 }, C1: { min: 200, max: 250 } }
const LESEN_WORDS = { B2: [230, 430], C1: [290, 540] } // tolerant sanity window
const HOEREN_WORDS = { B2: [160, 320], C1: [200, 400] }

const words = (s) => (s.trim().match(/\S+/g) ?? []).length
const hasArabic = (s) => /[؀-ۿ]/.test(s)

function validateMcq(lesson, skill, block, errs) {
  const p = `${lesson.lessonId}/${skill}`
  if (!block || typeof block.text !== 'string' || !block.text.trim()) { errs.push(`${p}: missing text`); return }
  const qs = block.questions ?? []
  if (qs.length !== 5) errs.push(`${p}: ${qs.length} questions (want 5)`)
  qs.forEach((q, i) => {
    if (!q?.q?.trim()) errs.push(`${p}: q${i} empty`)
    if (!Array.isArray(q?.options) || q.options.length !== 4) errs.push(`${p}: q${i} options != 4`)
  })
  const correct = block.correct ?? []
  if (correct.length !== qs.length) errs.push(`${p}: correct length mismatch`)
  correct.forEach((c, i) => { if (!Number.isInteger(c) || c < 0 || c > 3) errs.push(`${p}: correct[${i}]=${c}`) })
  const exps = block.explanations ?? []
  if (exps.length !== qs.length) errs.push(`${p}: explanations length mismatch`)
  if (new Set(correct).size < 2 && qs.length > 2) errs.push(`${p}: all correct answers identical`)
  if (hasArabic(block.text)) errs.push(`${p}: Arabic in German text`)
  const [lo, hi] = (skill === 'lesen' ? LESEN_WORDS : HOEREN_WORDS)[lesson.level]
  const w = words(block.text)
  if (w < lo || w > hi) console.warn(`  ⚠ ${p}: text ${w} words (window ${lo}-${hi})`)
}

async function main() {
  const files = process.argv.slice(2)
  if (!files.length) { console.error('pass JSON files'); process.exit(1) }

  const lessons = files.flatMap(f => JSON.parse(fs.readFileSync(f, 'utf8')))
  console.log(`Loaded ${lessons.length} lessons from ${files.length} files`)

  // Validate everything before touching the DB.
  const errs = []
  for (const l of lessons) {
    if (!['B2', 'C1'].includes(l.level)) errs.push(`${l.lessonId}: bad level ${l.level}`)
    if (!l.lessonId || !Number.isInteger(l.lessonOrder)) errs.push(`${l.lessonId}: bad id/order`)
    if (!l.theme?.trim() || hasArabic(l.theme)) errs.push(`${l.lessonId}: bad theme "${l.theme}"`)
    validateMcq(l, 'lesen', l.lesen, errs)
    validateMcq(l, 'hoeren', l.hoeren, errs)
    if (!l.schreiben?.instructions?.trim()) errs.push(`${l.lessonId}/schreiben: missing instructions`)
    else if (hasArabic(l.schreiben.instructions)) errs.push(`${l.lessonId}/schreiben: Arabic in task`)
  }
  if (errs.length) {
    console.error(`\n${errs.length} validation errors:`)
    for (const e of errs) console.error('  ✗', e)
    process.exit(1)
  }
  console.log('Validation OK.')

  // Existing (lessonId|skill) pairs → idempotent skip.
  const { data: existing } = await sb.from('assignments').select('skill, content').in('level_id', ['B2', 'C1'])
  const have = new Set((existing ?? []).map(a => `${a.content?.lessonId}|${a.skill}`).filter(x => !x.startsWith('undefined')))

  let ok = 0, skip = 0, fail = 0
  for (const l of lessons) {
    const base = { lessonOrder: l.lessonOrder, lessonId: l.lessonId, lessonTitle: l.theme }
    const rows = [
      {
        skill: 'lesen', title: `Devoir ${l.lessonOrder} — Lesen · ${l.theme}`,
        instructions: 'Lisez le texte, puis répondez.',
        content: { ...base, text: l.lesen.text, questions: l.lesen.questions },
        answer_key: { correct: l.lesen.correct, explanations: l.lesen.explanations },
      },
      {
        skill: 'hoeren', title: `Devoir ${l.lessonOrder} — Hören · ${l.theme}`,
        instructions: 'Écoutez l’audio, puis répondez.',
        content: { ...base, text: l.hoeren.text, questions: l.hoeren.questions },
        answer_key: { correct: l.hoeren.correct, explanations: l.hoeren.explanations },
      },
      {
        skill: 'schreiben', title: `Devoir ${l.lessonOrder} — Schreiben · ${l.theme}`,
        instructions: l.schreiben.instructions,
        content: { ...base, minWords: SCHREIB[l.level].min, maxWords: SCHREIB[l.level].max },
        answer_key: null,
      },
    ]
    process.stdout.write(`${l.level} Devoir ${l.lessonOrder} (${l.theme}): `)
    for (const r of rows) {
      if (have.has(`${l.lessonId}|${r.skill}`)) { skip++; process.stdout.write(`${r.skill}=skip `); continue }
      const { error } = await sb.from('assignments').insert({
        ...r, level_id: l.level, group_id: null, max_points: 100, is_published: true,
      })
      if (error) { fail++; process.stdout.write(`${r.skill}=ERR(${error.message.slice(0, 40)}) `) }
      else { ok++; process.stdout.write(`${r.skill}=ok `) }
    }
    process.stdout.write('\n')
  }
  console.log(`\nInserted ${ok}, skipped ${skip}, failed ${fail}.`)
  if (fail) process.exit(1)
}

main().catch(e => { console.error(e); process.exit(1) })
