import { getLevel, getLesson } from '@/lib/german-data'
import { localizeLesson, localizeLevel } from '@/lib/german-data/localize'
import { notFound } from 'next/navigation'
import type { AppLocale } from '@/i18n/routing'
import AdRail from '@/components/ads/AdRail'
import LessonClient from './LessonClient'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ level: string; lessonId: string; locale: AppLocale }>
}) {
  const { level: levelParam, lessonId, locale } = await params
  const rawLevel = getLevel(levelParam)
  const rawLesson = getLesson(levelParam, lessonId)

  if (!rawLevel || !rawLesson) notFound()

  const level  = localizeLevel(rawLevel, locale)
  const lesson = localizeLesson(rawLesson, rawLevel.id, locale)

  const currentIndex = level.lessons.findIndex((l) => l.id === lessonId)
  const rawNext = level.lessons[currentIndex + 1] ?? null
  const nextLesson = rawNext ?? null

  // Shared bg so the ad rail blends with the lesson's own bg-gray-50 column.
  return (
    <div className="bg-gray-50">
      <AdRail>
        <LessonClient
          lesson={lesson}
          level={level}
          nextLesson={nextLesson}
        />
      </AdRail>
    </div>
  )
}
