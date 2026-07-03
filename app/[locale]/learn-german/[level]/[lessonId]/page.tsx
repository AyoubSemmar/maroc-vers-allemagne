import { getLevel, getLesson } from '@/lib/german-data'
import { localizeLesson, localizeLevel } from '@/lib/german-data/localize'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import AdRail from '@/components/ads/AdRail'
import LessonClient from './LessonClient'

// Every lesson × locale used to render with the site-default <title> and
// no canonical/hreflang at all. With ~100 lessons × 12 locales sharing
// large identical German blocks (vocab, tables, examples), Google
// clustered them as duplicates with no user-selected canonical.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string; lessonId: string; locale: AppLocale }>
}): Promise<Metadata> {
  const { level: levelParam, lessonId, locale } = await params
  const rawLevel = getLevel(levelParam)
  const rawLesson = getLesson(levelParam, lessonId)
  if (!rawLevel || !rawLesson) return {}

  const lesson = localizeLesson(rawLesson, rawLevel.id, locale)
  const description = (lesson.grammar?.content || lesson.grammar?.title || lesson.title)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 158)

  return buildLocaleMetadata({
    locale,
    path: `/learn-german/${rawLevel.id.toLowerCase()}/${lessonId}`,
    title: `${lesson.title} · ${rawLevel.id} — GoGermany`,
    description,
  })
}

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
