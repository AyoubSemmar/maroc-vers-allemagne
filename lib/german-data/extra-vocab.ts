import type { VocabItem, Gender, VocabType } from './types'
import type { AppLocale } from '@/i18n/routing'
import raw from './extra-vocab.json'

// Goethe vocab top-up appended to existing lessons (see scripts/goethe-vocab.ts).
// Each word carries its meaning + example translation in all 12 locales, so the
// appended words localize like the rest of the lesson.
type ExtraWord = {
  german: string
  gender?: string
  plural?: string
  type?: string
  example: string
  meanings: Record<string, string>
  exampleTr: Record<string, string>
}
const DATA = raw as Record<string, ExtraWord[]>

/** Localized top-up vocab for a lesson (empty if none). */
export function extraVocabFor(lessonId: string, locale: AppLocale): VocabItem[] {
  const words = DATA[lessonId]
  if (!words || words.length === 0) return []
  return words.map(w => ({
    german: w.german,
    arabic: w.meanings?.[locale] ?? w.meanings?.ar ?? '',
    example: w.example,
    exampleArabic: w.exampleTr?.[locale] ?? w.exampleTr?.ar ?? '',
    ...(w.gender ? { gender: w.gender as Gender } : {}),
    ...(w.plural ? { plural: w.plural } : {}),
    ...(w.type ? { type: w.type as VocabType } : {}),
  }))
}
