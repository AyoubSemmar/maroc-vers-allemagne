import type { Level } from './types'
import { A1 } from './a1'
import { A2 } from './a2'
import { B1 } from './b1'
import { B2 } from './b2'
import { C1 } from './c1'

export const levels = [A1, A2, B1, B2, C1]

export function getLevel(id: string): Level | undefined {
  return levels.find((l) => l.id.toLowerCase() === id.toLowerCase())
}

export function getLesson(levelId: string, lessonId: string) {
  const level = getLevel(levelId)
  return level?.lessons.find((l) => l.id === lessonId)
}
