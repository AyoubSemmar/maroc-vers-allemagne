/**
 * Pre-generate graded "devoirs" for A1, A2, B1 — one per lesson (Lektion).
 * Each devoir = 3 published assignments sharing the lesson:
 *   • Lesen     — a hard, level-appropriate German text + 5 MCQ (telc/Goethe
 *                 Leseverstehen style), derived from the lesson's theme.
 *   • Hören     — a natural spoken script (read aloud by the browser's TTS)
 *                 + 5 MCQ (Hörverstehen style).
 *   • Schreiben — a real telc-style writing task with Leitpunkte, AI-graded.
 *
 * Lesson grouping (lessonOrder/lessonId/lessonTitle) is embedded in content,
 * so no schema change is needed. Idempotent: skips a (lesson, skill) that
 * already exists. Model: Sonnet 4.6 for exam-faithful German.
 *
 * Run: npx tsx scripts/generate-devoirs.ts            (A1+A2+B1)
 *      npx tsx scripts/generate-devoirs.ts --level=A1
 *      npx tsx scripts/generate-devoirs.ts --redo     (delete + regenerate)
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { levels } from '../lib/german-data/index.ts'
import type { Level, Lesson } from '../lib/german-data/types.ts'

// ── env ──
const envPath = path.resolve('.env.local')
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
})
const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const MODEL = process.env.DEVOIR_MODEL || 'claude-sonnet-4-6'

const args = process.argv.slice(2)
const ONLY_LEVEL = args.find(a => a.startsWith('--level='))?.split('=')[1]?.toUpperCase()
const REDO = args.includes('--redo')
const LIMIT = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '0', 10) // 0 = all

const TARGET_LEVELS = ['A1', 'A2', 'B1']

// Per-level lengths (words). Lesen text / Hören script / Schreiben range.
const SPEC: Record<string, { lesenMin: number; lesenMax: number; hoerenMin: number; hoerenMax: number; schreibMin: number; schreibMax: number; rubric: string }> = {
  A1: { lesenMin: 70, lesenMax: 110, hoerenMin: 60, hoerenMax: 90, schreibMin: 30, schreibMax: 50,
        rubric: 'A1: present tense, simple connectors (und/aber/weil/denn), everyday vocabulary. No Konjunktiv/Passiv/Genitiv.' },
  A2: { lesenMin: 120, lesenMax: 180, hoerenMin: 90, hoerenMax: 140, schreibMin: 50, schreibMax: 80,
        rubric: 'A2: Perfekt/Präteritum of common verbs, modal verbs, dass/wenn/weil, everyday + travel/work/health vocabulary.' },
  B1: { lesenMin: 200, lesenMax: 280, hoerenMin: 140, hoerenMax: 200, schreibMin: 100, schreibMax: 150,
        rubric: 'B1: full past tenses, Konjunktiv II for polite requests/wishes, simple Passiv, obwohl/deshalb/trotzdem; can argue and narrate.' },
}

function germanTitle(lesson: Lesson): string {
  const parts = lesson.title.split(/[—–-]/)
  return (parts.length > 1 ? parts[parts.length - 1] : lesson.title).trim()
}

// Telc texts often contain quotation marks; if the model emits them as raw "
// inside a JSON string value it breaks parsing. Instruct the model to avoid
// straight quotes + raw newlines in text fields.
const JSON_SAFE = 'JSON SAFETY: return strictly valid JSON. Inside any German "text"/string value, never use the straight double-quote character (use „ … " or none) and write each string on a single line (no raw line breaks).'

function parseJsonLoose(s: string): any {
  const c = s.replace(/```json\s*|\s*```/g, '').trim()
  return JSON.parse(c.slice(c.indexOf('{'), c.lastIndexOf('}') + 1))
}

async function ask(prompt: string, maxTokens = 2600): Promise<any> {
  const resp = await ai.messages.create({
    model: MODEL, max_tokens: maxTokens, temperature: 0.6,
    messages: [{ role: 'user', content: prompt }],
  })
  const raw = resp.content.map(c => (c.type === 'text' ? c.text : '')).join('')
  return parseJsonLoose(raw)
}

// MCQ via tool-use: the SDK returns the tool input already parsed, so a
// stray quote/newline in the German text can never break JSON parsing.
const MCQ_TOOL = {
  name: 'submit_exercise',
  description: 'Return the generated reading/listening exercise.',
  input_schema: {
    type: 'object' as const,
    properties: {
      title: { type: 'string' },
      text: { type: 'string' },
      questions: {
        type: 'array',
        items: { type: 'object', properties: { q: { type: 'string' }, options: { type: 'array', items: { type: 'string' } } }, required: ['q', 'options'] },
      },
      correct: { type: 'array', items: { type: 'integer' } },
      explanations: { type: 'array', items: { type: 'string' } },
    },
    required: ['title', 'text', 'questions', 'correct', 'explanations'],
  },
}

async function askMcq(prompt: string): Promise<any> {
  const resp = await ai.messages.create({
    model: MODEL, max_tokens: 4096, temperature: 0.6,
    tools: [MCQ_TOOL as any],
    tool_choice: { type: 'tool', name: 'submit_exercise' },
    messages: [{ role: 'user', content: prompt }],
  })
  const block = resp.content.find(c => c.type === 'tool_use') as any
  if (!block) throw new Error('no tool_use block')
  return block.input
}

function validateMcq(p: any): { questions: { q: string; options: string[] }[]; correct: number[]; explanations: string[] } {
  const qs = Array.isArray(p.questions) ? p.questions : []
  const correct = Array.isArray(p.correct) ? p.correct.map(Number) : []
  const exps = Array.isArray(p.explanations) ? p.explanations.map(String) : []
  const clean = qs.map((q: any, i: number) => ({
    q: String(q?.q ?? ''), options: Array.isArray(q?.options) ? q.options.slice(0, 4).map(String) : [],
    _c: correct[i], _e: exps[i] ?? '',
  })).filter((q: any) => q.q && q.options.length >= 2 && q.options.length <= 4 && Number.isInteger(q._c) && q._c >= 0 && q._c < q.options.length)
  if (clean.length < 3) throw new Error('too few valid questions')
  return { questions: clean.map((q: any) => ({ q: q.q, options: q.options })), correct: clean.map((q: any) => q._c), explanations: clean.map((q: any) => q._e) }
}

function lesenPrompt(level: string, theme: string, grammar: string, vocab: string[]): string {
  const s = SPEC[level]
  return `You are a Prüfer writing a telc/Goethe-Zertifikat ${level} LESEVERSTEHEN task. Make it realistic and at the HARDER end of ${level} — like a real exam, not a game.

LESSON THEME: "${theme}"   GRAMMAR FOCUS: ${grammar}
USE SOME OF THIS LESSON VOCABULARY NATURALLY: ${vocab.join(', ')}
LEVEL RULES: ${s.rubric}

TASK:
1. Write ONE authentic German text (${s.lesenMin}–${s.lesenMax} words) in a real-world genre — an email, a forum post, a notice, a short article or a blog entry — on the lesson theme. Natural, modern German strictly at ${level}.
2. Write 5 multiple-choice comprehension questions IN FRENCH that test real understanding (main idea, details, inference, vocabulary in context — not trivia). Each has exactly 4 options IN GERMAN, exactly one correct. Distribute correct indices.
3. Each explanation IN FRENCH (max 22 words), citing where in the text.

${JSON_SAFE}
Return ONLY JSON: {"title":"<short German title>","text":"<the German text>","questions":[{"q":"<question in French>","options":["<de>","<de>","<de>","<de>"]}],"correct":[<0-3>],"explanations":["<French>"]}`
}

function hoerenPrompt(level: string, theme: string, vocab: string[]): string {
  const s = SPEC[level]
  return `You are a Prüfer writing a telc/Goethe-Zertifikat ${level} HÖRVERSTEHEN task. The "text" is a SPOKEN script read aloud by a speech synthesiser — the learner only hears it, never sees it.

LESSON THEME: "${theme}"   USE SOME OF: ${vocab.join(', ')}
LEVEL RULES: ${s.rubric}

TASK:
1. Write a natural SPOKEN German script (${s.hoerenMin}–${s.hoerenMax} words) in a realistic listening genre — a phone message, a public announcement, a short dialogue, or a radio spot — on the theme. It must sound good read aloud; keep names, numbers and times clear since they are heard.
2. Write 5 multiple-choice questions IN FRENCH about what was heard. Each has 4 options IN GERMAN, one correct. Distribute correct indices.
3. Each explanation IN FRENCH (max 22 words).

${JSON_SAFE}
Return ONLY JSON: {"title":"<short German title>","text":"<spoken German script>","questions":[{"q":"<French>","options":["<de>","<de>","<de>","<de>"]}],"correct":[<0-3>],"explanations":["<French>"]}`
}

function schreibenPrompt(level: string, theme: string, grammar: string): string {
  const s = SPEC[level]
  return `You are a Prüfer writing a telc/Goethe-Zertifikat ${level} SCHREIBEN task on the theme "${theme}" (grammar focus: ${grammar}).

Create ONE realistic writing task like a real exam: a short situation in German, then 3–4 Leitpunkte (bullet points the learner must address). Genre appropriate to ${level} (A1/A2: a short message or email to a friend/colleague; B1: a semi-formal email, complaint, opinion). Target length ${s.schreibMin}–${s.schreibMax} words.

Return ONLY JSON: {"title":"<short German title>","instructions":"<the full task IN GERMAN: 1-2 sentence situation, then the Leitpunkte as a bulleted list with •>"}`
}

async function existingSet(levelId: string): Promise<Set<string>> {
  const { data } = await sb.from('assignments').select('id, skill, content').eq('level_id', levelId)
  const set = new Set<string>()
  for (const a of data ?? []) {
    const lid = (a as any).content?.lessonId
    if (lid) set.add(`${lid}|${a.skill}`)
  }
  return set
}

// Generate one skill, returning an insert row or null if it already exists.
async function genSkill(levelId: string, lesson: Lesson, skill: 'lesen' | 'hoeren' | 'schreiben', existing: Set<string>) {
  if (!REDO && existing.has(`${lesson.id}|${skill}`)) return null
  const theme = germanTitle(lesson)
  const grammar = lesson.grammar?.title || ''
  const vocab = (lesson.vocabulary || []).map(v => v.german).slice(0, 18)
  const base = { lessonOrder: lesson.order, lessonId: lesson.id, lessonTitle: theme }
  const s = SPEC[levelId]
  const label = skill === 'lesen' ? 'Lesen' : skill === 'hoeren' ? 'Hören' : 'Schreiben'

  if (skill === 'schreiben') {
    const p = await ask(schreibenPrompt(levelId, theme, grammar), 1200)
    return {
      skill, level_id: levelId, group_id: null,
      title: `Devoir ${lesson.order} — ${label} · ${theme}`,
      instructions: String(p.instructions || ''),
      content: { ...base, minWords: s.schreibMin, maxWords: s.schreibMax },
      answer_key: null, max_points: 100, is_published: true,
    }
  }
  const prompt = skill === 'lesen' ? lesenPrompt(levelId, theme, grammar, vocab) : hoerenPrompt(levelId, theme, vocab)
  const p = await askMcq(prompt) // tool-use → guaranteed-valid structured JSON
  const mcq = validateMcq(p)
  return {
    skill, level_id: levelId, group_id: null,
    title: `Devoir ${lesson.order} — ${label} · ${theme}`,
    instructions: skill === 'lesen' ? 'Lisez le texte, puis répondez.' : 'Écoutez l’audio, puis répondez.',
    content: { ...base, text: String(p.text || ''), questions: mcq.questions },
    answer_key: { correct: mcq.correct, explanations: mcq.explanations },
    max_points: 100, is_published: true,
  }
}

async function run() {
  const wanted = (ONLY_LEVEL ? [ONLY_LEVEL] : TARGET_LEVELS)
  for (const levelId of wanted) {
    const level = levels.find((l: Level) => l.id === levelId)
    if (!level) { console.log(`! level ${levelId} not found`); continue }
    console.log(`\n=== ${levelId} — ${level.lessons.length} lessons ===`)
    const existing = await existingSet(levelId)

    let sorted = [...level.lessons].sort((a, b) => a.order - b.order)
    if (LIMIT > 0) sorted = sorted.slice(0, LIMIT)
    for (const lesson of sorted) {
      const theme = germanTitle(lesson)
      process.stdout.write(`  Devoir ${lesson.order} (${theme}): `)
      for (const skill of ['lesen', 'hoeren', 'schreiben'] as const) {
        try {
          const row = await genSkill(levelId, lesson, skill, existing)
          if (!row) { process.stdout.write(`${skill}=skip `); continue }
          const { error } = await sb.from('assignments').insert(row)
          if (error) { process.stdout.write(`${skill}=ERR(${error.message.slice(0, 30)}) `); }
          else process.stdout.write(`${skill}=ok `)
        } catch (e: any) {
          process.stdout.write(`${skill}=FAIL(${(e?.message || '').slice(0, 30)}) `)
        }
      }
      process.stdout.write('\n')
    }
  }
  console.log('\nDone.')
}

run().catch(e => { console.error(e); process.exit(1) })
