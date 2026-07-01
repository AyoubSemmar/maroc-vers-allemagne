import type { Level, Lesson } from './types'
import { A1 } from './a1'
import { A2 } from './a2'
import { B1 } from './b1'
import { B2 } from './b2'
import { C1 } from './c1'
import extraLessons from './extra-lessons.json'

// Goethe gap-fill lessons added after review. Each is placed right after an
// existing lesson (insertAfter = that lesson's original order), then the whole
// level is renumbered 1..N. Lesson IDs are stable, so student progress
// (keyed by ID) is unaffected. Base text is Arabic; per-locale overlays live
// in ./translations and are applied by localize.ts.
type Extra = { level: string; insertAfter: number; lesson: Lesson }

function withExtras(level: Level): Level {
  const extras = (extraLessons as Extra[]).filter(e => e.level === level.id)
  if (extras.length === 0) return level
  const keyed = [
    ...level.lessons.map(l => ({ l, key: l.order })),
    ...extras.map(e => ({ l: e.lesson as Lesson, key: e.insertAfter + 0.5 })),
  ].sort((a, b) => a.key - b.key)
  const lessons = keyed.map(({ l }, i) => ({ ...l, order: i + 1 }))
  return { ...level, lessons }
}

export const levels = [A1, A2, B1, B2, C1].map(withExtras)

export function getLevel(id: string): Level | undefined {
  return levels.find((l) => l.id.toLowerCase() === id.toLowerCase())
}

export function getLesson(levelId: string, lessonId: string) {
  const level = getLevel(levelId)
  return level?.lessons.find((l) => l.id === lessonId)
}
