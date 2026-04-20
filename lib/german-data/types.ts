export type LevelId = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export type VocabItem = {
  german: string
  arabic: string
  example?: string
}

export type Question = {
  id: string
  question: string
  type: 'multiple-choice' | 'fill-blank'
  options?: string[]   // multiple-choice only
  answer: string
  hint?: string
}

export type Exercise = {
  questions: Question[]
}

export type Lesson = {
  id: string
  title: string
  order: number
  grammar: {
    title: string
    content: string
    examples: string[]
  }
  vocabulary: VocabItem[]
  exercise: Exercise
}

export type Level = {
  id: LevelId
  title: string
  description: string
  color: string        // tailwind bg color
  emoji: string
  lessons: Lesson[]
}
