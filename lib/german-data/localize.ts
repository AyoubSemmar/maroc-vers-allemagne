import type { Level, Lesson } from './types'
import type { AppLocale } from '@/i18n/routing'

import a1_fr from './translations/a1.fr.json'
import a1_en from './translations/a1.en.json'
import a1_de from './translations/a1.de.json'
import a2_fr from './translations/a2.fr.json'
import a2_en from './translations/a2.en.json'
import a2_de from './translations/a2.de.json'
import b1_fr from './translations/b1.fr.json'
import b1_en from './translations/b1.en.json'
import b1_de from './translations/b1.de.json'
import b2_fr from './translations/b2.fr.json'
import b2_en from './translations/b2.en.json'
import b2_de from './translations/b2.de.json'
import c1_fr from './translations/c1.fr.json'
import c1_en from './translations/c1.en.json'
import c1_de from './translations/c1.de.json'

/**
 * Overlay shape: per level, per locale, an object of form
 *   { title?: string, description?: string, lessons?: { [lessonId]: Partial<Lesson> } }
 * Only the fields present in the overlay override the Arabic source.
 */
type LessonOverlay = Partial<Lesson>
type LevelOverlay = {
  title?: string
  description?: string
  lessons?: Record<string, LessonOverlay>
}

const OVERLAYS: Record<string, Partial<Record<AppLocale, LevelOverlay>>> = {
  a1: { fr: a1_fr as LevelOverlay, en: a1_en as LevelOverlay, de: a1_de as LevelOverlay },
  a2: { fr: a2_fr as LevelOverlay, en: a2_en as LevelOverlay, de: a2_de as LevelOverlay },
  b1: { fr: b1_fr as LevelOverlay, en: b1_en as LevelOverlay, de: b1_de as LevelOverlay },
  b2: { fr: b2_fr as LevelOverlay, en: b2_en as LevelOverlay, de: b2_de as LevelOverlay },
  c1: { fr: c1_fr as LevelOverlay, en: c1_en as LevelOverlay, de: c1_de as LevelOverlay },
}

function getOverlay(levelId: string, locale: AppLocale): LevelOverlay | undefined {
  return OVERLAYS[levelId.toLowerCase()]?.[locale]
}

export function localizeLesson(lesson: Lesson, levelId: string, locale: AppLocale): Lesson {
  if (locale === 'ar') return lesson
  const ov = getOverlay(levelId, locale)?.lessons?.[lesson.id]
  if (!ov) return lesson
  return {
    ...lesson,
    ...ov,
    grammar: { ...lesson.grammar, ...(ov.grammar ?? {}) },
    vocabulary: ov.vocabulary ?? lesson.vocabulary,
    exercise: ov.exercise ?? lesson.exercise,
  }
}

export function localizeLevel(level: Level, locale: AppLocale): Level {
  if (locale === 'ar') return level
  const ov = getOverlay(level.id, locale)
  if (!ov) return level
  return {
    ...level,
    title: ov.title ?? level.title,
    description: ov.description ?? level.description,
    lessons: level.lessons.map((l) => localizeLesson(l, level.id, locale)),
  }
}
