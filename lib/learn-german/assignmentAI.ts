import { LEVEL_SPECS, type WritingLevel } from '@/lib/writingExerciseData'

export type Skill = 'grammar' | 'lesen' | 'schreiben' | 'hoeren'

export const SKILLS: Skill[] = ['grammar', 'lesen', 'schreiben', 'hoeren']

export const SKILL_LABELS: Record<Skill, string> = {
  grammar: 'Grammatik',
  lesen: 'Lesen',
  schreiben: 'Schreiben',
  hoeren: 'Hören',
}

/** Number of MCQ questions per generated exercise, by skill. */
export const QUESTION_COUNT: Record<Exclude<Skill, 'schreiben'>, number> = {
  grammar: 8,
  lesen: 5,
  hoeren: 5,
}

const LOCALE_NAMES: Record<string, string> = {
  ar: 'Arabic', de: 'German', en: 'English', es: 'Spanish', fa: 'Persian (Farsi)',
  fr: 'French', hi: 'Hindi', pt: 'Portuguese', ru: 'Russian', tr: 'Turkish',
  ur: 'Urdu', zh: 'Simplified Chinese', uk: 'Ukrainian', sq: 'Albanian', id: 'Indonesian',
}
/** English name of a locale for prompting the model (defaults to French). */
export function localeName(loc: string): string {
  return LOCALE_NAMES[loc] || 'French'
}

export function normalizeLevel(raw: string): WritingLevel {
  const up = (raw || 'A1').toUpperCase()
  return (['A1', 'A2', 'B1', 'B2', 'C1'].includes(up) ? up : 'A1') as WritingLevel
}

const FEEDBACK_LOCALES = ['ar', 'de', 'en', 'es', 'fa', 'fr', 'hi', 'pt', 'ru', 'tr', 'ur', 'zh', 'uk', 'sq', 'id'] as const
export type FeedbackLocale = (typeof FEEDBACK_LOCALES)[number]
export function feedbackLocale(raw?: string): FeedbackLocale {
  return (FEEDBACK_LOCALES as readonly string[]).includes(raw ?? '') ? (raw as FeedbackLocale) : 'fr'
}

/** Tolerant JSON extraction from a model reply (strips ``` fences). */
export function parseJsonLoose(s: string): any {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found in model output')
  return JSON.parse(cleaned.slice(first, last + 1))
}

// ── Generation prompts ──────────────────────────────────────────────
// All MCQ skills return the SAME shape so one renderer + one grader work:
//   { title, instructions, text?, questions:[{q,options[4]}], correct[], explanations[] }
// `text` is present for lesen (reading passage) and hoeren (the script the
// browser reads aloud — the student must NOT see it), absent for grammar.

function mcqShape(localeName: string, withText: boolean): string {
  return `Return ONLY a JSON object (no markdown fences, no commentary):
{
  "title": "<short German title>",
  "instructions": "<one-line instruction in ${localeName}>",${withText ? `\n  "text": "<the German passage>",` : ''}
  "questions": [
    { "q": "<question in ${localeName}>", "options": ["<A in German>", "<B in German>", "<C in German>", "<D in German>"] }
  ],
  "correct": [<0-3 per question, same order>],
  "explanations": ["<why the correct answer is right, in ${localeName}, max 22 words>"]
}
The arrays "questions", "correct" and "explanations" MUST be the same length and aligned by index. Spread the correct indices (don't always pick 0).`
}

export function buildGrammarPrompt(level: WritingLevel, locale: string, topic?: string): string {
  const spec = LEVEL_SPECS[level]
  const localeName = LOCALE_NAMES[locale] || 'French'
  const n = QUESTION_COUNT.grammar
  return `You are a German teacher writing a ${n}-question grammar exercise for ${level} learners.

LEVEL RULES:
${spec.rubric}

${topic ? `GRAMMAR FOCUS: ${topic}\n` : ''}TASK: Write ${n} multiple-choice grammar questions STRICTLY at ${level}. Each question is a short German sentence with ONE gap marked "_____", and 4 German options to fill it (one correct). Test cases, articles, verb conjugation, word order, prepositions, connectors — appropriate to the level${topic ? ' and the grammar focus above' : ''}. The question stem "q" shows the sentence with the gap. Keep vocabulary at or below ${level}.

${mcqShape(localeName, false)}`
}

export function buildLesenPrompt(level: WritingLevel, locale: string, topic?: string): string {
  const spec = LEVEL_SPECS[level]
  const localeName = LOCALE_NAMES[locale] || 'French'
  const n = QUESTION_COUNT.lesen
  return `You are a German teacher writing a reading-comprehension exercise for ${level} learners.

LEVEL RULES:
${spec.rubric}
Target text length: ${spec.minWords}–${spec.maxWords} words.

TOPIC: ${topic || 'choose an everyday, level-appropriate topic'}

TASK: Write an original German text STRICTLY at ${level} (${spec.minWords}–${spec.maxWords} words), then ${n} multiple-choice comprehension questions testing understanding of THAT text (facts, inference, vocabulary in context). Options stay in German.

${mcqShape(localeName, true)}`
}

export function buildHoerenPrompt(level: WritingLevel, locale: string, topic?: string): string {
  const spec = LEVEL_SPECS[level]
  const localeName = LOCALE_NAMES[locale] || 'French'
  const n = QUESTION_COUNT.hoeren
  return `You are a German teacher writing a LISTENING exercise for ${level} learners. The "text" will be read aloud by a speech synthesiser; the student listens and never sees it.

LEVEL RULES:
${spec.rubric}
Target script length: ${Math.round(spec.minWords * 0.8)}–${Math.round(spec.maxWords * 0.9)} words.

TOPIC: ${topic || 'an everyday spoken situation (announcement, voicemail, short dialogue, daily life)'}

TASK: Write a natural SPOKEN German script STRICTLY at ${level} — sentences that sound good read aloud. Then ${n} multiple-choice questions on what was heard. Keep numbers, times and names clear since they are heard, not seen.

${mcqShape(localeName, true)}`
}

export function buildGenerationPrompt(skill: Skill, level: WritingLevel, locale: string, topic?: string): string {
  if (skill === 'grammar') return buildGrammarPrompt(level, locale, topic)
  if (skill === 'lesen') return buildLesenPrompt(level, locale, topic)
  if (skill === 'hoeren') return buildHoerenPrompt(level, locale, topic)
  throw new Error('schreiben needs no generation')
}

/** Validate + normalise a generated MCQ exercise. Throws on bad shape. */
export function validateMcq(parsed: any): {
  title: string
  instructions: string
  text?: string
  questions: { q: string; options: string[] }[]
  correct: number[]
  explanations: string[]
} {
  const questions = Array.isArray(parsed.questions) ? parsed.questions : []
  const correct = Array.isArray(parsed.correct) ? parsed.correct.map((n: any) => Number(n)) : []
  const explanations = Array.isArray(parsed.explanations) ? parsed.explanations.map(String) : []

  const clean = questions
    .map((q: any, i: number) => ({
      q: String(q?.q ?? ''),
      options: Array.isArray(q?.options) ? q.options.slice(0, 4).map(String) : [],
      _correct: correct[i],
      _exp: explanations[i] ?? '',
    }))
    .filter((q: any) =>
      q.q && q.options.length === 4 &&
      Number.isInteger(q._correct) && q._correct >= 0 && q._correct <= 3,
    )

  if (clean.length === 0) throw new Error('No valid questions in model output')

  return {
    title: String(parsed.title ?? 'Übung'),
    instructions: String(parsed.instructions ?? ''),
    text: parsed.text ? String(parsed.text) : undefined,
    questions: clean.map((q: any) => ({ q: q.q, options: q.options })),
    correct: clean.map((q: any) => q._correct),
    explanations: clean.map((q: any) => q._exp),
  }
}

export { LEVEL_SPECS }
