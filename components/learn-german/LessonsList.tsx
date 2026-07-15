'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Icon from '@/components/ui/Icon'
import { useProgress } from '@/lib/useProgress'
import type { Level } from '@/lib/german-data/types'
import WritingExercise from './WritingExercise'
import ReadingExercise from './ReadingExercise'
import LevelVideos from './LevelVideos'
import type { WritingLevel } from '@/lib/writingExerciseData'
import type { ReadingLevel } from '@/lib/readingExerciseData'

export default function LessonsList({ level }: { level: Level }) {
  const t = useTranslations('learnGerman.level')
  const tData = useTranslations('learnGerman.data')
  const { isLessonCompleted, completedCount, loaded, isAuthed } = useProgress(level.id)

  const lessonTitle = (id: string, fallback: string) => {
    try { return tData(`lessons.${id}` as any) } catch { return fallback }
  }

  const total = level.lessons.length
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0
  const resumeLesson = level.lessons.find((l) => !isLessonCompleted(l.id))

  if (!loaded) return null

  return (
    <div className="lg-lessons">
      {/* Top progress + Resume */}
      <div className="lg-lessons-progress">
        <div className="lg-lessons-progress-row">
          <span className="lg-lessons-progress-label">{t('progress')}</span>
          <span className="lg-lessons-progress-num">{t('progressCount', { done: completedCount, total })}</span>
        </div>
        <div className="lg-lessons-progress-bar">
          <div className="lg-lessons-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {resumeLesson && completedCount > 0 && (
          <Link
            href={`/learn-german/${level.id.toLowerCase()}/${resumeLesson.id}`}
            className="lg-resume-cta"
          >
            <Icon name="play" size={13} /> {t('resumeHere', { title: lessonTitle(resumeLesson.id, resumeLesson.title) })}
          </Link>
        )}

        {isAuthed && (
          <Link href="/learn-german/results" className="lg-results-link">
            <Icon name="bar-chart" size={15} /> {t('resultsCta')}
          </Link>
        )}
      </div>

      {/* Auth nudge — only for unauthed users */}
      {!isAuthed && (
        <div className="lg-auth-nudge">
          <span aria-hidden><Icon name="lock" size={26} /></span>
          <div>
            <h3>{t('authNudgeTitle') ?? 'Sign in to save your progress'}</h3>
            <p>{t('authNudgeBody') ?? 'All German lessons are 100% free. Create a free account so we can save where you left off and sync across your devices.'}</p>
          </div>
          <Link href={`/login?next=${typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname) : ''}`} className="lg-auth-nudge-btn">
            {t('authNudgeCta') ?? 'Sign in'}
          </Link>
        </div>
      )}

      {/* Lessons — every lesson is open, in any order. */}
      <ul className="lg-lessons-list" data-level={level.id}>
        {level.lessons.map((lesson) => {
          const completed = isLessonCompleted(lesson.id)
          const isCurrent = resumeLesson?.id === lesson.id && completedCount > 0

          return (
            <li key={lesson.id}>
              <Link
                href={`/learn-german/${level.id.toLowerCase()}/${lesson.id}`}
                className={`lg-lesson-row${isCurrent ? ' is-current' : ''}${completed ? ' is-completed' : ''}`}
              >
                <div className="lg-lesson-num">
                  {completed ? '✓' : lesson.order}
                </div>
                <div className="lg-lesson-body">
                  <h4 className="lg-lesson-title">{lessonTitle(lesson.id, lesson.title)}</h4>
                  <div className="lg-lesson-meta">
                    <span>{t('lessonMeta.grammar')}</span>
                    <span>{t('lessonMeta.vocab', { n: lesson.vocabulary.length })}</span>
                    <span>{t('lessonMeta.exercise', { n: lesson.exercise.questions.length })}</span>
                  </div>
                </div>
                <span className="lg-lesson-arrow">
                  {completed ? '✓' : '→'}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Daily reading exercise — fresh AI-generated text + MCQs every UTC day. */}
      <ReadingExercise level={level.id as ReadingLevel} />

      {/* Daily writing exercise — one chance per UTC day per level. */}
      <WritingExercise level={level.id as WritingLevel} />

      {/* Level video playlist — one curated YouTube playlist per level. */}
      <LevelVideos level={level.id} />
    </div>
  )
}
