import type { Level, LevelId } from './types'
import { A1 } from './a1'

// Placeholder for levels not yet built
function comingSoon(id: LevelId, title: string, description: string, color: string, emoji: string): Level {
  return { id, title, description, color, emoji, lessons: [] }
}

export const levels: Level[] = [
  A1,
  comingSoon('A2', 'المستوى الثاني', 'التعبير عن الماضي، التسوق، والاتجاهات.', 'bg-blue-500', '📘'),
  comingSoon('B1', 'المستوى الثالث', 'التعبير عن الرأي، العمل، والسفر.', 'bg-purple-500', '🚀'),
  comingSoon('B2', 'المستوى الرابع', 'الألمانية المتقدمة للعمل والجامعة.', 'bg-orange-500', '🎯'),
  comingSoon('C1', 'المستوى الخامس', 'إتقان اللغة الألمانية — مستوى احترافي.', 'bg-red-500', '🏆'),
]

export function getLevel(id: string): Level | undefined {
  return levels.find((l) => l.id.toLowerCase() === id.toLowerCase())
}

export function getLesson(levelId: string, lessonId: string) {
  const level = getLevel(levelId)
  return level?.lessons.find((l) => l.id === lessonId)
}
