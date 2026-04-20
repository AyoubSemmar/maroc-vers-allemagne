import { getLevel, getLesson } from '@/lib/german-data'
import { notFound } from 'next/navigation'
import LessonClient from './LessonClient'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ level: string; lessonId: string }>
}) {
  const { level: levelParam, lessonId } = await params
  const level = getLevel(levelParam)
  const lesson = getLesson(levelParam, lessonId)

  if (!level || !lesson) notFound()

  const currentIndex = level.lessons.findIndex((l) => l.id === lessonId)
  const nextLesson = level.lessons[currentIndex + 1] ?? null

  return (
    <LessonClient
      lesson={lesson}
      level={level}
      nextLesson={nextLesson}
    />
  )
}
