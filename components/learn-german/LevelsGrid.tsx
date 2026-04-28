'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { levels } from '@/lib/german-data'
import { createClient } from '@/lib/supabase-browser'

type ProgressMap = Record<string, number>

function readAllProgress(): ProgressMap {
  const map: ProgressMap = {}
  for (const level of levels) {
    try {
      const raw = localStorage.getItem(`german_progress_${level.id}`)
      const p = raw ? JSON.parse(raw) : null
      map[level.id] = p?.completedLessons?.length ?? 0
    } catch {
      map[level.id] = 0
    }
  }
  return map
}

const LEVEL_BG: Record<string, string> = {
  A1: 'lg-level--a1',
  A2: 'lg-level--a2',
  B1: 'lg-level--b1',
  B2: 'lg-level--b2',
  C1: 'lg-level--c1',
}

export default function LevelsGrid() {
  const t = useTranslations('learnGerman.levels')
  const tData = useTranslations('learnGerman.data')
  const [progressMap, setProgressMap] = useState<ProgressMap>({})
  const [loaded, setLoaded] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    setProgressMap(readAllProgress())
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthed(!!user)
      setLoaded(true)
    })
  }, [])

  if (!loaded) return null

  return (
    <div className="lg-levels-grid">
      {levels.map((level) => {
        const isAvailable = level.lessons.length > 0
        const completedCount = progressMap[level.id] ?? 0
        const total = level.lessons.length
        const pct = isAvailable ? Math.round((completedCount / total) * 100) : 0
        const allDone = isAvailable && completedCount >= total

        const href = isAvailable ? `/learn-german/${level.id.toLowerCase()}` : '#'
        const localizedTitle = (() => { try { return tData(`levels.${level.id}.title` as any) } catch { return level.title } })()
        const localizedDesc  = (() => { try { return tData(`levels.${level.id}.description` as any) } catch { return level.description } })()

        return (
          <Link
            key={level.id}
            href={href}
            className={`lg-level-card${!isAvailable ? ' is-coming-soon' : ''}${allDone ? ' is-done' : ''}`}
            aria-disabled={!isAvailable}
          >
            {!isAvailable && (
              <span className="lg-level-pill lg-level-pill--coming">{t('comingSoon')}</span>
            )}
            {allDone && (
              <span className="lg-level-pill lg-level-pill--done">✓ {t('completed') ?? 'Completed'}</span>
            )}

            <div className={`lg-level-badge ${LEVEL_BG[level.id] ?? ''}`}>
              <span className="lg-level-badge-id">{level.id}</span>
              <span className="lg-level-badge-emoji" aria-hidden>{level.emoji}</span>
            </div>

            <h3 className="lg-level-title">{localizedTitle}</h3>
            <p className="lg-level-desc">{localizedDesc}</p>

            {isAvailable && (
              <>
                <div className="lg-level-progress">
                  <div className="lg-level-progress-bar"><div className="lg-level-progress-fill" style={{ width: `${pct}%` }} /></div>
                  <span className="lg-level-progress-label">
                    {t('progressCount', { done: completedCount, total })}
                  </span>
                </div>

                <div className="lg-level-foot">
                  <span className="lg-level-meta">{t('lessonsCount', { n: total })}</span>
                  <span className="lg-level-cta">
                    {pct > 0 ? t('resume') : t('start')} →
                  </span>
                </div>
              </>
            )}
          </Link>
        )
      })}

      {!isAuthed && (
        <div className="lg-levels-tip">
          <span className="lg-levels-tip-icon" aria-hidden>💡</span>
          <p>{t('tipNotAuthed') ?? 'All German lessons are free. Sign in to save your progress across devices and continue from where you left off.'}</p>
        </div>
      )}
    </div>
  )
}
