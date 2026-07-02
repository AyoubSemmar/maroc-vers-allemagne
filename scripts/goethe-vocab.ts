/**
 * Goethe vocabulary top-up: for every lesson (A1–C1), generate Goethe-level
 * words for the lesson's theme that AREN'T already in its vocab, with the
 * meaning + example translation in all 12 locales. Writes
 * lib/german-data/extra-vocab.json ({ [lessonId]: ExtraWord[] }).
 *
 * Append-only by design — existing vocab is never changed. Idempotent-ish:
 * re-running regenerates the whole file; pass --level=A1 to limit.
 *
 * Run: npx tsx scripts/goethe-vocab.ts            (all levels)
 *      npx tsx scripts/goethe-vocab.ts --level=A1
 */
import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import { levels } from '../lib/german-data/index'

for (const line of fs.readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const MODEL = process.env.GOETHE_VOCAB_MODEL || 'claude-haiku-4-5'

const args = process.argv.slice(2)
const ONLY = args.find(a => a.startsWith('--level='))?.split('=')[1]?.toUpperCase()
const PER = 8 // words to add per lesson

const LOCALES = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'nl']
const LOCALE_NAMES: Record<string, string> = {
  ar: 'Arabic', fr: 'French', en: 'English', de: 'German (a short synonym/definition)', es: 'Spanish',
  tr: 'Turkish', fa: 'Persian', pt: 'Portuguese', ru: 'Russian', hi: 'Hindi', ur: 'Urdu', nl: 'Dutch',
}

const localeProps = (desc: string) => Object.fromEntries(LOCALES.map(l => [l, { type: 'string', description: `${desc} in ${LOCALE_NAMES[l]}` }]))

const TOOL = {
  name: 'submit_vocab',
  description: 'Return the additional vocabulary words.',
  input_schema: {
    type: 'object' as const,
    properties: {
      words: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            german: { type: 'string', description: 'bare German word, no article' },
            gender: { type: 'string', enum: ['der', 'die', 'das', 'pl', ''] },
            plural: { type: 'string' },
            type: { type: 'string', enum: ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'preposition', 'conjunction', 'pronoun', 'number'] },
            example: { type: 'string', description: 'one short German example sentence at the lesson level' },
            meanings: { type: 'object', properties: localeProps('the word meaning'), required: LOCALES },
            exampleTr: { type: 'object', properties: localeProps('the example sentence translated'), required: LOCALES },
          },
          required: ['german', 'gender', 'type', 'example', 'meanings', 'exampleTr'],
        },
      },
    },
    required: ['words'],
  },
}

async function genForLesson(levelId: string, theme: string, grammar: string, existing: string[]): Promise<any[]> {
  const prompt = `You are building the vocabulary list for a Goethe-Zertifikat ${levelId} German lesson.
THEME: ${theme}
GRAMMAR FOCUS: ${grammar}

Add ${PER} useful Goethe-${levelId} vocabulary words for this theme that are NOT already in the lesson. Already present (do not repeat, and avoid close variants): ${existing.join(', ') || '(none)'}

Rules:
- Words must be at or below ${levelId} and clearly relevant to the theme.
- german = the bare word without any article (article goes in "gender"; for non-nouns gender = "").
- For nouns give the plural; give one short ${levelId} example sentence in German.
- Provide the meaning and the example translation in ALL 12 locales (ar, fr, en, de, es, tr, fa, pt, ru, hi, ur, nl). German ("de") meaning = a short German synonym or definition.`
  const resp = await ai.messages.create({
    model: MODEL, max_tokens: 8000, temperature: 0.4,
    tools: [TOOL as any], tool_choice: { type: 'tool', name: 'submit_vocab' },
    messages: [{ role: 'user', content: prompt }],
  })
  const block = resp.content.find(c => c.type === 'tool_use') as any
  if (!block) throw new Error('no tool_use')
  const words = Array.isArray(block.input?.words) ? block.input.words : []
  const seen = new Set(existing.map(g => g.toLowerCase()))
  return words.filter((w: any) => {
    if (!w?.german || !w?.meanings?.ar) return false
    const key = String(w.german).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function pool<T>(items: T[], n: number, fn: (t: T) => Promise<void>) {
  const q = [...items]
  await Promise.all(Array.from({ length: n }, async () => { while (q.length) await fn(q.shift()!) }))
}

async function main() {
  const dest = path.resolve('lib/german-data/extra-vocab.json')
  const out: Record<string, any[]> = fs.existsSync(dest) ? JSON.parse(fs.readFileSync(dest, 'utf8')) : {}

  const tasks: { levelId: string; id: string; theme: string; grammar: string; existing: string[] }[] = []
  for (const level of levels) {
    if (ONLY && level.id !== ONLY) continue
    for (const lesson of level.lessons) {
      const theme = (lesson.title.split(/[—–-]/).pop() || lesson.title).trim()
      tasks.push({ levelId: level.id, id: lesson.id, theme, grammar: lesson.grammar.title, existing: lesson.vocabulary.map(v => v.german) })
    }
  }

  let ok = 0, fail = 0
  await pool(tasks, 4, async (t) => {
    for (let a = 1; a <= 3; a++) {
      try {
        const words = await genForLesson(t.levelId, t.theme, t.grammar, t.existing)
        if (words.length < 3) throw new Error(`only ${words.length}`)
        out[t.id] = words
        ok++
        console.log(`  ${t.levelId} ${t.id} (${t.theme}): +${words.length} words`)
        return
      } catch (e: any) { if (a === 3) { fail++; console.log(`  ${t.levelId} ${t.id}: FAIL ${e.message}`) } }
    }
  })

  fs.writeFileSync(dest, JSON.stringify(out, null, 2))
  const total = Object.values(out).reduce((s, w) => s + w.length, 0)
  console.log(`\nWrote ${dest}: ${Object.keys(out).length} lessons, ${total} words (${ok} ok, ${fail} failed)`)
}
main().catch(e => { console.error(e); process.exit(1) })
