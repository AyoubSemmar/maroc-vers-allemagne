export type LevelId = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export type Gender = 'der' | 'die' | 'das' | 'pl'

export type VocabType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'preposition' | 'conjunction' | 'pronoun' | 'number'

export type VocabItem = {
  german: string
  arabic: string
  example?: string
  exampleArabic?: string
  gender?: Gender
  plural?: string
  type?: VocabType
}

export type GrammarTableRow = {
  cells: string[]
  highlight?: boolean  // bold/colored row
}

export type GrammarTable = {
  title?: string
  headers: string[]
  rows: GrammarTableRow[]
  note?: string
  theme?: 'cases' | 'conjugation' | 'default'
}

export type GrammarRule = {
  rule: string
  example: string
  translation: string
}

export type Question = {
  id: string
  type: 'multiple-choice' | 'fill-blank' | 'drag-drop' | 'matching' | 'speaking'
  question: string
  // multiple-choice
  options?: string[]
  // drag-drop: scrambled words to reorder
  words?: string[]
  // matching: pairs to connect
  pairs?: { left: string; right: string }[]
  // correct answer (string; for drag-drop, the correctly ordered sentence)
  answer: string
  hint?: string
  // for listening exercises: text to speak before user answers
  audioPrompt?: string
}

export type Exercise = {
  title?: string
  questions: Question[]
}

export type Lesson = {
  id: string
  title: string
  order: number
  grammar: {
    title: string
    content: string          // main explanation in Arabic
    tables?: GrammarTable[]  // color-coded paradigm tables
    rules?: GrammarRule[]    // concise rule cards
    examples: string[]       // example sentences
    tip?: string             // golden tip box
  }
  vocabulary: VocabItem[]
  exercise: Exercise
}

export type Level = {
  id: LevelId
  title: string
  description: string
  color: string    // tailwind bg color class
  emoji: string    // legacy — kept for compat, no longer rendered
  iconName?: 'sprout' | 'book' | 'rocket' | 'target' | 'trophy'
  lessons: Lesson[]
}
