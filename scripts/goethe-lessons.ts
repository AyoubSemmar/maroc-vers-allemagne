/**
 * Generate the missing Goethe grammar lessons as a DRAFT, in the exact shape of
 * the existing lib/german-data lessons (Arabic-taught: grammar text, tables,
 * rule cards, examples, tip, vocab, mixed exercises).
 *
 * Output: scripts/out/goethe/new-lessons.json (draft only — swapped in after review).
 * Run: npx tsx scripts/goethe-lessons.ts
 */
import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

for (const line of fs.readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const MODEL = process.env.GOETHE_MODEL || 'claude-sonnet-4-6'

// The new lessons to add. insertAfter = order of the existing lesson to place it after.
// This batch fills the remaining Goethe grammar gaps at B2 and C1.
const NEW_LESSONS = [
  { level: 'B2', id: 'b2-18', insertAfter: 16, de: 'Vergleichssätze: als ob / als wenn', focus: 'الجمل المقارنة غير الواقعية — als ob / als wenn + Konjunktiv II للتعبير عن شبه أو انطباع غير حقيقي (Er tut, als ob er krank wäre)' },
  { level: 'B2', id: 'b2-19', insertAfter: 7,  de: 'Präpositionen mit Genitiv', focus: 'حروف الجر التي تأخذ حالة الملكية Genitiv — trotz, während, wegen, aufgrund, (an)statt, innerhalb, außerhalb' },
  { level: 'B2', id: 'b2-20', insertAfter: 8,  de: 'Zweiteilige Konnektoren', focus: 'أدوات الربط الثنائية — sowohl…als auch, weder…noch, entweder…oder, nicht nur…sondern auch, zwar…aber' },
  { level: 'C1', id: 'c1-17', insertAfter: 4,  de: 'Konzessive Strukturen der gehobenen Sprache', focus: 'التراكيب التنازلية في اللغة الراقية — ungeachtet (+Genitiv), so … auch, wenngleich, obschon, obgleich, dessen ungeachtet' },
  { level: 'C1', id: 'c1-18', insertAfter: 5,  de: 'Gehobene Präpositionen mit Genitiv', focus: 'حروف الجر الرسمية الراقية مع Genitiv — angesichts, mangels, hinsichtlich, bezüglich, gemäß, laut, zufolge, seitens' },
]

const LESSON_TOOL = {
  name: 'submit_lesson',
  description: 'Return a complete German grammar lesson in the course format.',
  input_schema: {
    type: 'object' as const,
    properties: {
      titleAr: { type: 'string', description: 'Arabic lesson title (short)' },
      grammarTitle: { type: 'string', description: 'Grammar section title, Arabic + German term' },
      grammarContent: { type: 'string', description: 'Arabic explanation. Use ** for bold, \\n for line breaks. Keep German terms in Latin script.' },
      tables: {
        type: 'array', description: '1-2 paradigm tables',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            headers: { type: 'array', items: { type: 'string' } },
            rows: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
            note: { type: 'string' },
          },
          required: ['headers', 'rows'],
        },
      },
      rules: {
        type: 'array', description: '3-4 rule cards',
        items: { type: 'object', properties: { rule: { type: 'string', description: 'rule in Arabic' }, example: { type: 'string', description: 'German example' }, translation: { type: 'string', description: 'Arabic translation' } }, required: ['rule', 'example', 'translation'] },
      },
      examples: { type: 'array', description: "6-8 sentences, each 'German — Arabic'", items: { type: 'string' } },
      tip: { type: 'string', description: 'golden tip in Arabic, start with 💡' },
      vocabulary: {
        type: 'array', description: '12-15 items tied to the topic',
        items: { type: 'object', properties: { german: { type: 'string', description: 'bare word, no article' }, arabic: { type: 'string' }, gender: { type: 'string', enum: ['der', 'die', 'das', 'pl', ''] }, plural: { type: 'string' }, example: { type: 'string' }, exampleArabic: { type: 'string' }, type: { type: 'string', enum: ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'preposition', 'conjunction', 'pronoun', 'number'] } }, required: ['german', 'arabic', 'gender', 'plural', 'example', 'exampleArabic', 'type'] },
      },
      exercise: {
        type: 'array', description: '8 mixed exercises',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['multiple-choice', 'fill-blank', 'drag-drop', 'matching', 'speaking'] },
            question: { type: 'string', description: 'instruction in Arabic' },
            options: { type: 'array', items: { type: 'string' }, description: 'multiple-choice only' },
            words: { type: 'array', items: { type: 'string' }, description: 'drag-drop only (scrambled)' },
            pairs: { type: 'array', items: { type: 'object', properties: { left: { type: 'string' }, right: { type: 'string' } }, required: ['left', 'right'] }, description: 'matching only' },
            answer: { type: 'string', description: 'correct answer; for drag-drop the correctly ordered sentence; for matching use "matched"' },
            hint: { type: 'string' },
            audioPrompt: { type: 'string', description: 'text to speak for listening items' },
          },
          required: ['type', 'question', 'answer'],
        },
      },
    },
    required: ['titleAr', 'grammarTitle', 'grammarContent', 'tables', 'rules', 'examples', 'tip', 'vocabulary', 'exercise'],
  },
}

async function genLesson(l: typeof NEW_LESSONS[number]): Promise<any> {
  const prompt = `You are writing a German ${l.level} grammar lesson for Arabic-speaking Moroccan learners, in the exact style of a Goethe-Zertifikat-aligned course.

TOPIC (German): ${l.de}
GRAMMAR FOCUS (Arabic): ${l.focus}

Requirements:
- All INSTRUCTIONAL text (explanation, rules, questions, tip, translations) in Modern Standard Arabic, simple and clear for a Moroccan learner. All GERMAN content (examples, options, words) in correct German.
- Strictly ${l.level} level — grammar and vocabulary must not exceed ${l.level}.
- grammarContent: a clear Arabic explanation with **bold** for key terms; keep German grammar terms in Latin script (Nominativ, Genitiv, etc.).
- tables: 1-2 color-coded paradigm tables (headers + rows) that show the pattern.
- rules: 3-4 concise rule cards.
- examples: 6-8 example sentences, each formatted "German sentence — الترجمة العربية".
- tip: one golden tip in Arabic starting with 💡.
- vocabulary: 12-15 words tied to this grammar topic (for nouns set gender + plural, german = bare word without article).
- exercise: exactly 8 items, a MIX of multiple-choice, fill-blank, drag-drop, matching, speaking. For drag-drop, "words" is the scrambled tokens and "answer" is the correct sentence. For matching use pairs and answer "matched". Include at least one listening item (fill-blank with audioPrompt).`

  const resp = await ai.messages.create({
    model: MODEL, max_tokens: 8000, temperature: 0.5,
    tools: [LESSON_TOOL as any], tool_choice: { type: 'tool', name: 'submit_lesson' },
    messages: [{ role: 'user', content: prompt }],
  })
  const block = resp.content.find(c => c.type === 'tool_use') as any
  if (!block) throw new Error('no tool_use')
  return block.input
}

async function main() {
  const outDir = path.resolve('scripts/out/goethe')
  fs.mkdirSync(outDir, { recursive: true })
  const out: any[] = []
  for (const l of NEW_LESSONS) {
    let ok = false
    for (let a = 1; a <= 3 && !ok; a++) {
      try {
        const r = await genLesson(l)
        if (!Array.isArray(r.exercise) || r.exercise.length < 5) throw new Error('too few exercises')
        if (!Array.isArray(r.vocabulary) || r.vocabulary.length < 8) throw new Error('too few vocab')
        out.push({ ...l, lesson: r })
        console.log(`  ${l.level} ${l.id} ${l.de}: tables=${r.tables?.length} rules=${r.rules?.length} vocab=${r.vocabulary.length} ex=${r.exercise.length}`)
        ok = true
      } catch (e: any) { if (a === 3) console.log(`  ${l.level} ${l.id}: FAIL(${e.message})`) }
    }
  }
  const file = path.join(outDir, 'new-lessons.json')
  fs.writeFileSync(file, JSON.stringify(out, null, 2))
  console.log(`\nDraft written: ${file}  (${out.length}/${NEW_LESSONS.length} lessons)`)
}

main().catch(e => { console.error(e); process.exit(1) })
