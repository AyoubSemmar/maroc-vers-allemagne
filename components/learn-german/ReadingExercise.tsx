'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase-browser'
import {
  READING_SPECS,
  nextResetUtcMs,
  todayKey,
  type ReadingLevel,
} from '@/lib/readingExerciseData'
import './reading-exercise.css'

type Question = {
  q: string
  options: string[]
  correct: number
  explanation: string
}

type Exercise = {
  title: string
  topic: string
  text: string
  questions: Question[]
  wordCount?: number
}

type UILocale = 'en' | 'fr' | 'ar' | 'de'

/**
 * Daily reading-comprehension exercise. Mounts in LessonsList alongside the
 * writing exercise. Generates a fresh German text + questions per user
 * per UTC day via /api/reading-exercise (Claude Haiku). Cached in
 * localStorage for the day so refreshing doesn't burn tokens.
 */
export default function ReadingExercise({ level }: { level: ReadingLevel }) {
  const t = useTranslations('readingExercise')
  const locale = useLocale() as UILocale

  const spec = READING_SPECS[level]
  const lockKey = `reading_done_${level}`
  const cacheKey = (date: string) => `reading_text_${level}_${date}`

  const [authed, setAuthed] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [doneTodayAt, setDoneTodayAt] = useState<number | null>(null)
  const [tick, setTick] = useState(0)

  // Auth check.
  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      setAuthed(!!user)
    })
  }, [])

  // Read the daily lock + cached exercise on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(lockKey)
    if (raw) {
      const ts = Number(raw)
      if (Number.isFinite(ts) && ts > Date.now()) setDoneTodayAt(ts)
    }
    // If we have a cached exercise for today, restore it (so a user refreshing
    // mid-attempt doesn't re-roll).
    const cached = localStorage.getItem(cacheKey(todayKey()))
    if (cached) {
      try { setExercise(JSON.parse(cached)) } catch {}
    }
  }, [lockKey])

  // Tick every minute to refresh the "next attempt in N hours" countdown.
  useEffect(() => {
    if (!doneTodayAt) return
    const id = setInterval(() => setTick(x => x + 1), 60 * 1000)
    return () => clearInterval(id)
  }, [doneTodayAt])

  async function startExercise() {
    if (!authed) return
    setError(null)
    setLoading(true)
    try {
      const date = todayKey()
      // Try cache first.
      const cached = localStorage.getItem(cacheKey(date))
      if (cached) {
        try {
          setExercise(JSON.parse(cached))
          setLoading(false)
          return
        } catch {}
      }
      const res = await fetch('/api/reading-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, uiLocale: locale, dateKey: date }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || t('errorGeneric'))
        return
      }
      setExercise(data as Exercise)
      try { localStorage.setItem(cacheKey(date), JSON.stringify(data)) } catch {}
    } catch (e: any) {
      setError(t('errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  function pickAnswer(qIdx: number, optIdx: number) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }))
  }

  const score = useMemo(() => {
    if (!exercise) return { correct: 0, total: 0, pct: 0 }
    const total = exercise.questions.length
    let correct = 0
    for (let i = 0; i < total; i++) {
      if (answers[i] === exercise.questions[i].correct) correct++
    }
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0
    return { correct, total, pct }
  }, [exercise, answers])

  function submit() {
    if (!exercise) return
    if (Object.keys(answers).length < exercise.questions.length) return
    setSubmitted(true)
    // Lock until next UTC midnight.
    const reset = nextResetUtcMs()
    try { localStorage.setItem(lockKey, String(reset)) } catch {}
    setDoneTodayAt(reset)
  }

  function resetForTomorrow() {
    setExercise(null)
    setAnswers({})
    setSubmitted(false)
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <section className={`re-card re-level-${level.toLowerCase()}`}>
      <header className="re-head">
        <span className="re-eyebrow">
          <span className="re-eyebrow-dot" />
          {t('eyebrow')}
        </span>
        <h3 className="re-title">{t('title')}</h3>
        <p className="re-sub">{t('subtitle', { level, n: spec.questionCount, min: spec.minWords, max: spec.maxWords })}</p>
      </header>

      {/* Auth gate */}
      {authed === false && (
        <div className="re-locked">
          <span className="re-locked-icon" aria-hidden>🔒</span>
          <h4>{t('signInTitle')}</h4>
          <p>{t('signInBody')}</p>
          <Link
            href={`/login?next=${typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname) : ''}`}
            className="re-locked-cta"
          >
            {t('signInCta')} →
          </Link>
        </div>
      )}

      {/* Done state — only shown if no exercise was generated this session */}
      {authed && doneTodayAt && !exercise && (
        <div className="re-done" key={tick}>
          <span className="re-done-icon" aria-hidden>✅</span>
          <h4>{t('doneTitle')}</h4>
          <p>{t('doneBody', { hours: hoursUntil(doneTodayAt) })}</p>
        </div>
      )}

      {/* Idle — start button */}
      {authed && !exercise && !doneTodayAt && (
        <div className="re-start">
          <p className="re-start-text">{t('startBody')}</p>
          <button type="button" className="re-start-btn" onClick={startExercise} disabled={loading}>
            {loading ? `⏳ ${t('generating')}` : `📖 ${t('startCta')}`}
          </button>
          {error && <p className="re-error">⚠️ {error}</p>}
        </div>
      )}

      {/* Exercise — text + questions */}
      {authed && exercise && (
        <div className="re-exercise">
          <div className="re-text-block">
            <div className="re-text-meta">
              <span className="re-pill re-pill--brand">📚 {t('topicBadge')}</span>
              <span className="re-pill">{exercise.topic}</span>
              {exercise.wordCount && (
                <span className="re-pill">{exercise.wordCount} {t('wordsShort')}</span>
              )}
            </div>
            <h4 className="re-text-title" lang="de" dir="ltr">{exercise.title}</h4>
            <p className="re-text-body" lang="de" dir="ltr">{exercise.text}</p>
          </div>

          <div className="re-questions">
            <h4 className="re-questions-title">❓ {t('questionsTitle')}</h4>
            {exercise.questions.map((q, qi) => {
              const userPick = answers[qi]
              const isCorrect = submitted && userPick === q.correct
              return (
                <div key={qi} className={`re-question ${submitted ? (isCorrect ? 'is-correct' : 'is-wrong') : ''}`}>
                  <p className="re-q-text">
                    <span className="re-q-num">{qi + 1}.</span> {q.q}
                  </p>
                  <ul className="re-options">
                    {q.options.map((opt, oi) => {
                      const picked = userPick === oi
                      const isThisCorrect = submitted && q.correct === oi
                      const isThisWrongPick = submitted && picked && oi !== q.correct
                      return (
                        <li key={oi}>
                          <button
                            type="button"
                            className={`re-option ${picked ? 'is-picked' : ''} ${isThisCorrect ? 'is-correct' : ''} ${isThisWrongPick ? 'is-wrong' : ''}`}
                            onClick={() => pickAnswer(qi, oi)}
                            disabled={submitted}
                            lang="de"
                            dir="ltr"
                          >
                            <span className="re-option-letter">{String.fromCharCode(65 + oi)}</span>
                            <span className="re-option-text">{opt}</span>
                            {submitted && isThisCorrect && <span className="re-option-icon" aria-hidden>✓</span>}
                            {submitted && isThisWrongPick && <span className="re-option-icon" aria-hidden>✕</span>}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                  {submitted && (
                    <p className={`re-explanation ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                      {isCorrect ? '✅' : '❌'} {q.explanation}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {!submitted ? (
            <div className="re-foot">
              <span className="re-progress">
                {Object.keys(answers).length} / {exercise.questions.length} {t('answered')}
              </span>
              <button
                type="button"
                className="re-submit"
                onClick={submit}
                disabled={Object.keys(answers).length < exercise.questions.length}
              >
                {t('submit')}
              </button>
            </div>
          ) : (
            <div className="re-result">
              <div className={`re-score re-score--${score.pct >= 80 ? 'excellent' : score.pct >= 60 ? 'good' : score.pct >= 40 ? 'ok' : 'practice'}`}>
                <span className="re-score-num">{score.correct}</span>
                <span className="re-score-of">/ {score.total}</span>
              </div>
              <div className="re-result-text">
                <strong>{t(`grade.${score.pct >= 80 ? 'excellent' : score.pct >= 60 ? 'good' : score.pct >= 40 ? 'ok' : 'practice'}`)}</strong>
                <span>{score.pct}% — {t('correct', { n: score.correct })}</span>
              </div>
              <button type="button" className="re-again" onClick={resetForTomorrow}>
                {t('comeBackTomorrow')}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function hoursUntil(ts: number): number {
  const ms = ts - Date.now()
  return Math.max(1, Math.ceil(ms / (60 * 60 * 1000)))
}
