'use client'

import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { useProgress } from '@/lib/useProgress'
import type { Level } from '@/lib/german-data/types'

export default function LessonsList({ level }: { level: Level }) {
  const t = useTranslations('learnGerman.level')
  const tData = useTranslations('learnGerman.data')
  const router = useRouter()
  const { isLessonUnlocked, isLessonCompleted, completedCount, loaded, isAuthed } = useProgress(level.id)

  const lessonTitle = (id: string, fallback: string) => {
    try { return tData(`lessons.${id}` as any) } catch { return fallback }
  }

  const total = level.lessons.length
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0
  const resumeLesson = level.lessons.find((l) => !isLessonCompleted(l.id))

  if (!loaded) return null

  function handleLockedClick(e: React.MouseEvent) {
    e.preventDefault()
    const here = window.location.pathname
    router.push(`/login?next=${encodeURIComponent(here)}`)
  }

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
            ▶ {t('resumeHere', { title: lessonTitle(resumeLesson.id, resumeLesson.title) })}
          </Link>
        )}
      </div>

      {/* Auth nudge — only for unauthed users */}
      {!isAuthed && (
        <div className="lg-auth-nudge">
          <span aria-hidden>🔓</span>
          <div>
            <h3>{t('authNudgeTitle') ?? 'Sign in to unlock the full level'}</h3>
            <p>{t('authNudgeBody') ?? 'Lesson 1 is free. To save your progress and continue beyond it, create a free account.'}</p>
          </div>
          <Link href={`/login?next=${typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname) : ''}`} className="lg-auth-nudge-btn">
            {t('authNudgeCta') ?? 'Sign in'}
          </Link>
        </div>
      )}

      {/* Lessons */}
      <ul className="lg-lessons-list">
        {level.lessons.map((lesson) => {
          const unlocked = isLessonUnlocked(lesson.id, lesson.order)
          const completed = isLessonCompleted(lesson.id)
          const isCurrent = resumeLesson?.id === lesson.id && completedCount > 0

          const href = unlocked ? `/learn-german/${level.id.toLowerCase()}/${lesson.id}` : '#'

          return (
            <li key={lesson.id}>
              <Link
                href={href}
                onClick={!unlocked ? handleLockedClick : undefined}
                className={`lg-lesson-row${unlocked ? '' : ' is-locked'}${isCurrent ? ' is-current' : ''}${completed ? ' is-completed' : ''}`}
              >
                <div className="lg-lesson-num">
                  {completed ? '✓' : lesson.order}
                </div>
                <div className="lg-lesson-body">
                  <h4 className="lg-lesson-title">{lessonTitle(lesson.id, lesson.title)}</h4>
                  <div className="lg-lesson-meta">
                    <span>📖 {t('lessonMeta.grammar')}</span>
                    <span>💬 {t('lessonMeta.vocab', { n: lesson.vocabulary.length })}</span>
                    <span>✏️ {t('lessonMeta.exercise', { n: lesson.exercise.questions.length })}</span>
                  </div>
                </div>
                <span className="lg-lesson-arrow">
                  {completed ? '✓' : unlocked ? '→' : '🔒'}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
