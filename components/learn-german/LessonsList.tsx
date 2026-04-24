'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useProgress } from '@/lib/useProgress'
import type { Level } from '@/lib/german-data/types'

export default function LessonsList({ level }: { level: Level }) {
  const t = useTranslations('learnGerman.level')
  const tData = useTranslations('learnGerman.data')
  const lessonTitle = (id: string, fallback: string) => {
    try { return tData(`lessons.${id}` as any) } catch { return fallback }
  }
  const { isLessonUnlocked, isLessonCompleted, completedCount, loaded } = useProgress(level.id)

  const pct = level.lessons.length > 0
    ? Math.round((completedCount / level.lessons.length) * 100)
    : 0

  const resumeLesson = level.lessons.find((l) => !isLessonCompleted(l.id))

  if (!loaded) return null

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{t('progress')}</span>
          <span>{t('progressCount', { done: completedCount, total: level.lessons.length })}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        {resumeLesson && completedCount > 0 && (
          <Link
            href={`/learn-german/${level.id.toLowerCase()}/${resumeLesson.id}`}
            className="mt-4 inline-flex items-center gap-2 bg-green-700 text-white text-sm px-5 py-2 rounded-full hover:bg-green-800"
          >
            {t('resumeHere', { title: lessonTitle(resumeLesson.id, resumeLesson.title) })}
          </Link>
        )}
      </div>

      {/* Lessons */}
      <div className="flex flex-col gap-3">
        {level.lessons.map((lesson) => {
          const unlocked = isLessonUnlocked(lesson.id, lesson.order)
          const completed = isLessonCompleted(lesson.id)
          const isCurrent = resumeLesson?.id === lesson.id && completedCount > 0

          const href = unlocked ? `/learn-german/${level.id.toLowerCase()}/${lesson.id}` : '#'

          return (
            <Link
              key={lesson.id}
              href={href}
              className={`bg-white rounded-xl border p-5 flex items-center gap-4 transition-all
                ${unlocked
                  ? 'border-gray-200 hover:shadow-md cursor-pointer'
                  : 'border-gray-100 opacity-50 cursor-not-allowed'
                }
                ${isCurrent ? 'border-green-300 ring-1 ring-green-300' : ''}
              `}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                ${completed ? 'bg-green-500 text-white' : unlocked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                {completed ? '✓' : lesson.order}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{lessonTitle(lesson.id, lesson.title)}</h3>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-gray-400">{t('lessonMeta.grammar')}</span>
                  <span className="text-xs text-gray-400">{t('lessonMeta.vocab', { n: lesson.vocabulary.length })}</span>
                  <span className="text-xs text-gray-400">{t('lessonMeta.exercise', { n: lesson.exercise.questions.length })}</span>
                </div>
              </div>

              <span className="text-gray-400 text-sm">
                {completed ? '✅' : unlocked ? '←' : '🔒'}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
