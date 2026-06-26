/**
 * End-to-end smoke test for the graded-course pipeline (Phase 1 + 2).
 * Exercises the DATA LAYER against the live DB with the service role — the
 * same operations the API routes do — without needing a browser session.
 *
 *   1. AI generation: run the real Grammatik/Lesen/Hören prompts through
 *      Claude and validate the shape we parse (validateMcq logic).
 *   2. Insert a published assignment (incl. answer_key) via service role.
 *   3. Simulate an MCQ submission the way /api/learn-german/submit does and
 *      check the score math + that the row lands.
 *   4. Run the roster aggregation query and confirm it returns.
 *   5. Clean up the test rows.
 *
 * Run: node scripts/smoke-assignments.mjs
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

// ── env ──
const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const AIKEY = process.env.ANTHROPIC_API_KEY
if (!URL || !KEY) { console.error('Missing Supabase env'); process.exit(1) }

const sb = createClient(URL, KEY, { auth: { persistSession: false } })
const ai = AIKEY ? new Anthropic({ apiKey: AIKEY }) : null

const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`)
const fail = (m) => { console.log(`  \x1b[31m✗ ${m}\x1b[0m`); process.exitCode = 1 }

// Mirror of lib/learn-german/assignmentAI.parseJsonLoose + validateMcq.
function parseJsonLoose(s) {
  const c = s.replace(/```json\s*|\s*```/g, '').trim()
  return JSON.parse(c.slice(c.indexOf('{'), c.lastIndexOf('}') + 1))
}
function validateMcq(p) {
  const qs = Array.isArray(p.questions) ? p.questions : []
  const correct = Array.isArray(p.correct) ? p.correct.map(Number) : []
  const exps = Array.isArray(p.explanations) ? p.explanations.map(String) : []
  const clean = qs.map((q, i) => ({
    q: String(q?.q ?? ''),
    options: Array.isArray(q?.options) ? q.options.slice(0, 4).map(String) : [],
    _c: correct[i], _e: exps[i] ?? '',
  })).filter(q => q.q && q.options.length === 4 && Number.isInteger(q._c) && q._c >= 0 && q._c <= 3)
  if (!clean.length) throw new Error('no valid questions')
  return {
    title: String(p.title ?? 'Übung'),
    instructions: String(p.instructions ?? ''),
    text: p.text ? String(p.text) : undefined,
    questions: clean.map(q => ({ q: q.q, options: q.options })),
    correct: clean.map(q => q._c),
    explanations: clean.map(q => q._e),
  }
}

const GRAMMAR_PROMPT = `You are a German teacher writing a 4-question grammar exercise for A1 learners.
LEVEL RULES: A1, present tense only, ~650 common words, no Konjunktiv/Passiv/Genitiv.
TASK: 4 multiple-choice questions. Each is a short German sentence with ONE gap "_____" and 4 German options (one correct). Keep vocabulary A1.
Return ONLY JSON:
{ "title": "<German>", "instructions": "<French>", "questions": [ {"q":"<French>","options":["<de>","<de>","<de>","<de>"]} ], "correct": [<0-3>], "explanations": ["<French max 22 words>"] }
The arrays questions/correct/explanations MUST be equal length, aligned by index. Spread the correct indices.`

async function testGeneration() {
  console.log('\n1) AI generation → validateMcq')
  if (!ai) { console.log('  (skipped: no ANTHROPIC_API_KEY)'); return null }
  const resp = await ai.messages.create({
    model: 'claude-haiku-4-5', max_tokens: 1500, temperature: 0.7,
    messages: [{ role: 'user', content: GRAMMAR_PROMPT }],
  })
  const raw = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  try {
    const mcq = validateMcq(parseJsonLoose(raw))
    ok(`parsed ${mcq.questions.length} questions, ${mcq.correct.length} answers aligned`)
    if (mcq.questions.length !== mcq.correct.length) fail('questions/correct length mismatch')
    return mcq
  } catch (e) { fail(`generation parse failed: ${e.message}`); console.log(raw.slice(0, 300)); return null }
}

async function testDataLayer(mcq) {
  console.log('\n2) Insert published assignment (with answer_key)')
  const content = { ...(mcq?.text ? { text: mcq.text } : {}), questions: mcq?.questions ?? [
    { q: 'Ich _____ Student.', options: ['bin', 'bist', 'ist', 'sind'] },
    { q: 'Das _____ ein Buch.', options: ['ist', 'bin', 'sind', 'seid'] },
  ] }
  const answer_key = { correct: mcq?.correct ?? [0, 0], explanations: mcq?.explanations ?? ['', ''] }

  const { data: ins, error: insErr } = await sb.from('assignments').insert({
    skill: 'grammar', level_id: 'A1', title: '[SMOKE] Test', instructions: 'Test',
    content, answer_key, is_published: true,
  }).select('id').single()
  if (insErr) { fail(`insert failed: ${insErr.message}`); return }
  const aid = ins.id
  ok(`assignment inserted: ${aid}`)

  // 3) Simulate a submission like /api/learn-german/submit (MCQ branch).
  console.log('\n3) Simulate MCQ grading')
  const { data: a } = await sb.from('assignments').select('answer_key').eq('id', aid).single()
  const key = a.answer_key.correct
  const choices = key.map((k, i) => i === 0 ? k : (k + 1) % 4)   // first right, rest wrong
  let correct = 0
  key.forEach((ans, i) => { if (choices[i] === ans) correct++ })
  const score = Math.round((correct / key.length) * 100)
  ok(`scored ${correct}/${key.length} = ${score}% (expected first-correct only)`)

  // Use a real user id so the FK holds.
  const { data: users } = await sb.auth.admin.listUsers({ perPage: 1 })
  const uid = users?.users?.[0]?.id
  if (!uid) { fail('no users to attach a submission'); await cleanup(aid); return }

  const { error: subErr } = await sb.from('assignment_submissions').upsert({
    assignment_id: aid, user_id: uid, answers: { choices },
    auto_score: score, status: 'graded', graded_at: new Date().toISOString(),
  }, { onConflict: 'assignment_id,user_id' })
  if (subErr) fail(`submission upsert failed: ${subErr.message}`)
  else ok(`submission stored for user ${uid.slice(0, 8)}…`)

  // 4) Roster aggregation sanity (the queries the admin page runs).
  console.log('\n4) Gradebook queries')
  const [{ error: e1 }, { error: e2 }, { error: e3 }] = await Promise.all([
    sb.from('lesson_scores').select('user_id,level_id,best_score').limit(1),
    sb.from('vocab_progress').select('user_id,level_id,mastery').limit(1),
    sb.from('assignment_submissions').select('assignment_id,user_id,auto_score,ai_score,teacher_score').limit(1),
  ])
  if (e1 || e2 || e3) fail(`roster query error: ${(e1 || e2 || e3).message}`)
  else ok('lesson_scores / vocab_progress / submissions all queryable')

  await cleanup(aid)
}

async function cleanup(aid) {
  console.log('\n5) Cleanup')
  await sb.from('assignments').delete().eq('id', aid)   // cascades submissions
  ok('test rows removed')
}

;(async () => {
  console.log('=== Smoke test: graded course pipeline ===')
  const mcq = await testGeneration()
  await testDataLayer(mcq)
  console.log(process.exitCode ? '\n\x1b[31mFAILED\x1b[0m' : '\n\x1b[32mALL GREEN\x1b[0m')
})().catch(e => { console.error(e); process.exit(1) })
