/**
 * Merge ONE locale's translated devoir scaffolding into the assignments table's
 * content_i18n / answer_key_i18n JSONB, WITHOUT clobbering the locales already
 * there. Mirrors the shape the existing 11 locales use:
 *   content_i18n[loc]    = { instructions, questions?: [{q}] }
 *   answer_key_i18n[loc] = { explanations: [...] }
 * (questions only when the source row's questions array is non-null — grammar
 * rows carry German fill-in-the-blank questions that stay German, not here.)
 *
 * Reads: scripts/out/devoir-i18n/source.json  (id → skill/questions shape)
 *        scripts/out/devoir-i18n/<loc>-batch-*.json  (the translations)
 *
 * Run: node scripts/push-devoir-locale.mjs uk
 *      node scripts/push-devoir-locale.mjs uk --dry   (validate only, no write)
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

const loc = process.argv[2]
const DRY = process.argv.includes('--dry')
if (!loc) { console.error('usage: node scripts/push-devoir-locale.mjs <loc> [--dry]'); process.exit(1) }

for (const l of fs.readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = l.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}

const D = 'scripts/out/devoir-i18n'
const src = JSON.parse(fs.readFileSync(`${D}/source.json`, 'utf8'))
const byId = new Map(src.map(r => [r.id, r]))

// Load all <loc>-batch-*.json into one id → translated-row map.
const tr = new Map()
for (const f of fs.readdirSync(D).filter(f => new RegExp(`^${loc}-batch-\\d+\\.json$`).test(f)).sort()) {
  for (const row of JSON.parse(fs.readFileSync(`${D}/${f}`, 'utf8'))) tr.set(row.id, row)
}
console.log(`loaded ${tr.size}/${src.length} translated rows for '${loc}'`)

// Validate: every source row present, array lengths match.
const problems = []
for (const s of src) {
  const t = tr.get(s.id)
  if (!t) { problems.push(`${s.id}: missing`); continue }
  if ((s.explanations?.length || 0) !== (t.explanations?.length || 0)) problems.push(`${s.id}: explanations ${s.explanations?.length}→${t.explanations?.length}`)
  if (s.questions != null && (s.questions.length !== (t.questions?.length || 0))) problems.push(`${s.id}: questions ${s.questions.length}→${t.questions?.length}`)
}
if (problems.length) {
  console.log(`VALIDATION FAILED (${problems.length}):`)
  problems.slice(0, 15).forEach(p => console.log('  ' + p))
  process.exit(1)
}
console.log('validation OK — all rows present, array lengths match')
if (DRY) { console.log('--dry: not writing'); process.exit(0) }

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const mig = await sb.from('assignments').select('content_i18n').limit(1)
if (mig.error) { console.log('content_i18n column missing — run the migration first.'); process.exit(1) }

let ok = 0, fail = 0
for (const s of src) {
  const t = tr.get(s.id)
  // Read current JSONB so we merge, never overwrite other locales.
  const { data: cur, error: e0 } = await sb.from('assignments').select('content_i18n, answer_key_i18n').eq('id', s.id).single()
  if (e0) { fail++; if (fail <= 3) console.log('read ERR', s.id, e0.message.slice(0, 60)); continue }
  const content_i18n = { ...(cur.content_i18n || {}) }
  const answer_key_i18n = { ...(cur.answer_key_i18n || {}) }
  const c = { instructions: t.instructions ?? s.instructions }
  if (s.questions != null && Array.isArray(t.questions)) c.questions = t.questions.map(q => ({ q }))
  content_i18n[loc] = c
  answer_key_i18n[loc] = { explanations: t.explanations || [] }
  const { error } = await sb.from('assignments').update({ content_i18n, answer_key_i18n }).eq('id', s.id)
  if (error) { fail++; if (fail <= 3) console.log('write ERR', s.id, error.message.slice(0, 60)) } else ok++
}
console.log(`pushed '${loc}': ${ok} ok, ${fail} fail`)
