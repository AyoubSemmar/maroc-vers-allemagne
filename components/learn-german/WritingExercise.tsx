'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase-browser'
import {
  LEVEL_SPECS,
  pickTodaysTheme,
  nextResetUtcMs,
  type WritingLevel,
} from '@/lib/writingExerciseData'
import './writing-exercise.css'

type Mistake = {
  original: string
  correction: string
  explanation: string
  type?: string
}

type Result = {
  wordCount: number
  wordCountOk: boolean
  score: number
  corrected: string
  mistakes: Mistake[]
  tip: string
}

type UILocale = 'en' | 'fr' | 'ar' | 'de'

/**
 * Daily writing exercise. Mounts at the bottom of every level's lessons
 * list. Picks one theme per UTC day (deterministic per user), submits to
 * /api/writing-correction, shows highlighted mistakes and a corrected
 * version. Stores "done today" in localStorage to lock the form until
 * the next UTC midnight.
 */
export default function WritingExercise({ level }: { level: WritingLevel }) {
  const t = useTranslations('writingExercise')
  const locale = useLocale() as UILocale

  const spec = LEVEL_SPECS[level]
  const lockKey = `writing_done_${level}`

  const [authed, setAuthed] = useState<boolean | null>(null)
  const [userKey, setUserKey] = useState<string>('anon')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [doneTodayAt, setDoneTodayAt] = useState<number | null>(null)
  const [tick, setTick] = useState(0)

  // Auth + user key (used as theme seed so different users get different
  // daily themes even at the same level).
  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      setAuthed(!!user)
      setUserKey(user?.id ?? 'anon')
    })
  }, [])

  // Read the daily lock from localStorage on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(lockKey)
    if (!raw) return
    const ts = Number(raw)
    if (Number.isFinite(ts) && ts > Date.now()) setDoneTodayAt(ts)
  }, [lockKey])

  // Tick every minute so the "next attempt in N hours" countdown updates.
  useEffect(() => {
    if (!doneTodayAt) return
    const id = setInterval(() => setTick(x => x + 1), 60 * 1000)
    return () => clearInterval(id)
  }, [doneTodayAt])

  const theme = useMemo(() => pickTodaysTheme(level, userKey), [level, userKey])

  const themeTitle       = safeT(t, `themes.${theme.id}.title`,       fallbackTitle(theme.id))
  const themeInstructionDe = safeT(t, `themes.${theme.id}.instruction_de`, fallbackInstructionDe(theme.id))
  const themeInstructionUi = safeT(t, `themes.${theme.id}.instruction`,    themeInstructionDe)
  const themeHint        = safeT(t, `themes.${theme.id}.hint`, '')

  const wordCount = countWords(text)
  const ready = wordCount >= spec.minWords && wordCount <= spec.maxWords + 30 // allow ~30-word buffer; server enforces strict bounds

  async function submit() {
    if (!authed) return
    setError(null)
    setSubmitting(true)
    setResult(null)
    try {
      const res = await fetch('/api/writing-correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          themeInstruction: themeInstructionDe,
          text,
          uiLocale: locale,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || t('errorGeneric'))
        return
      }
      setResult(data as Result)
      // Lock until next UTC midnight.
      const reset = nextResetUtcMs()
      try { localStorage.setItem(lockKey, String(reset)) } catch {}
      setDoneTodayAt(reset)
    } catch (e: any) {
      setError(t('errorGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  function tryAgainTomorrow() {
    setResult(null)
    setText('')
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <section className={`we-card we-level-${level.toLowerCase()}`}>
      <header className="we-head">
        <span className="we-eyebrow">
          <span className="we-eyebrow-dot" />
          {t('eyebrow')}
        </span>
        <h3 className="we-title">{t('title')}</h3>
        <p className="we-sub">{t('subtitle', { level, min: spec.minWords, max: spec.maxWords })}</p>
      </header>

      {/* Auth gate */}
      {authed === false && (
        <div className="we-locked">
          <span className="we-locked-icon" aria-hidden>🔒</span>
          <h4>{t('signInTitle')}</h4>
          <p>{t('signInBody')}</p>
          <Link
            href={`/login?next=${typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname) : ''}`}
            className="we-locked-cta"
          >
            {t('signInCta')} →
          </Link>
        </div>
      )}

      {/* Daily-done state */}
      {authed && doneTodayAt && !result && (
        <div className="we-done" key={tick}>
          <span className="we-done-icon" aria-hidden>✅</span>
          <h4>{t('doneTitle')}</h4>
          <p>{t('doneBody', { hours: hoursUntil(doneTodayAt) })}</p>
        </div>
      )}

      {/* Active form / result */}
      {authed && (!doneTodayAt || result) && (
        <>
          <div className="we-prompt">
            <div className="we-prompt-meta">
              <span className="we-pill we-pill--brand">📝 {t('themeBadge')}</span>
              <span className="we-pill">{themeTitle}</span>
              <span className="we-pill">{spec.minWords}–{spec.maxWords} {t('wordsShort')}</span>
            </div>
            <p className="we-prompt-de" lang="de" dir="ltr">{themeInstructionDe}</p>
            {locale !== 'de' && (
              <p className="we-prompt-ui">{themeInstructionUi}</p>
            )}
            {themeHint && <p className="we-prompt-hint">💡 {themeHint}</p>}
          </div>

          {!result && (
            <>
              <textarea
                className="we-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('placeholder')}
                lang="de"
                dir="ltr"
                rows={9}
                disabled={submitting}
              />
              <div className="we-foot">
                <span className={`we-wc ${ready ? 'is-ok' : ''}`}>
                  {wordCount} / {spec.minWords}–{spec.maxWords} {t('wordsShort')}
                </span>
                <button
                  type="button"
                  className="we-submit"
                  onClick={submit}
                  disabled={!ready || submitting}
                >
                  {submitting ? t('submitting') : t('submit')}
                </button>
              </div>
              {error && <p className="we-error">⚠️ {error}</p>}
            </>
          )}

          {result && (
            <ResultView
              result={result}
              originalText={text}
              t={t}
              spec={spec}
              onAgain={tryAgainTomorrow}
            />
          )}
        </>
      )}
    </section>
  )
}

function ResultView({
  result, originalText, t, spec, onAgain,
}: {
  result: Result
  originalText: string
  t: ReturnType<typeof useTranslations>
  spec: typeof LEVEL_SPECS[WritingLevel]
  onAgain: () => void
}) {
  const grade =
    result.score >= 90 ? 'excellent' :
    result.score >= 75 ? 'good' :
    result.score >= 60 ? 'ok' : 'practice'

  return (
    <div className="we-result">
      <div className="we-score-row">
        <div className={`we-score we-score--${grade}`}>
          <span className="we-score-num">{result.score}</span>
          <span className="we-score-max">/100</span>
        </div>
        <div className="we-score-text">
          <strong>{t(`grade.${grade}`)}</strong>
          <span className={`we-wc-badge ${result.wordCountOk ? 'is-ok' : 'is-warn'}`}>
            {result.wordCount} {t('wordsShort')} · {result.wordCountOk ? t('inRange') : t('outOfRange', { min: spec.minWords, max: spec.maxWords })}
          </span>
        </div>
      </div>

      {result.mistakes.length > 0 && (
        <div className="we-section">
          <h4 className="we-section-title">🔍 {t('mistakesTitle', { n: result.mistakes.length })}</h4>
          <p className="we-section-sub">{t('mistakesSub')}</p>

          {/* Highlighted original */}
          <div className="we-highlight-box" lang="de" dir="ltr">
            <HighlightedText text={originalText} mistakes={result.mistakes} />
          </div>

          {/* Mistake list */}
          <ul className="we-mistake-list">
            {result.mistakes.map((m, i) => (
              <li key={i} className="we-mistake">
                <div className="we-mistake-row">
                  <span className="we-mistake-bad" lang="de" dir="ltr">{m.original}</span>
                  <span className="we-mistake-arrow" aria-hidden>→</span>
                  <span className="we-mistake-good" lang="de" dir="ltr">{m.correction}</span>
                </div>
                <p className="we-mistake-why">{m.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="we-section">
        <h4 className="we-section-title">✨ {t('correctedTitle')}</h4>
        <p className="we-section-sub">{t('correctedSub')}</p>
        <div className="we-corrected" lang="de" dir="ltr">
          {result.corrected}
        </div>
      </div>

      <div className="we-tip">
        <span className="we-tip-icon" aria-hidden>💡</span>
        <p>{result.tip}</p>
      </div>

      <button type="button" className="we-again" onClick={onAgain}>
        {t('comeBackTomorrow')}
      </button>
    </div>
  )
}

/** Render the original text with each mistake span underlined in red. */
function HighlightedText({
  text, mistakes,
}: {
  text: string
  mistakes: Mistake[]
}) {
  // Build non-overlapping spans by greedy left-to-right matching.
  const spans: Array<{ start: number; end: number; mistake: Mistake }> = []
  const used = new Set<number>()
  for (const m of mistakes) {
    if (!m.original) continue
    let from = 0
    while (from < text.length) {
      const idx = text.indexOf(m.original, from)
      if (idx < 0) break
      // Skip if this range overlaps an already-marked range.
      let overlaps = false
      for (let i = idx; i < idx + m.original.length; i++) {
        if (used.has(i)) { overlaps = true; break }
      }
      if (!overlaps) {
        spans.push({ start: idx, end: idx + m.original.length, mistake: m })
        for (let i = idx; i < idx + m.original.length; i++) used.add(i)
        break
      }
      from = idx + 1
    }
  }
  spans.sort((a, b) => a.start - b.start)

  const out: React.ReactNode[] = []
  let cursor = 0
  for (const s of spans) {
    if (s.start > cursor) out.push(text.slice(cursor, s.start))
    out.push(
      <mark key={s.start} className="we-hl" title={s.mistake.explanation}>
        {text.slice(s.start, s.end)}
      </mark>,
    )
    cursor = s.end
  }
  if (cursor < text.length) out.push(text.slice(cursor))
  return <>{out}</>
}

function countWords(s: string): number {
  return (s.trim().match(/\S+/g) ?? []).length
}

function hoursUntil(ts: number): number {
  const ms = ts - Date.now()
  return Math.max(1, Math.ceil(ms / (60 * 60 * 1000)))
}

function safeT(t: ReturnType<typeof useTranslations>, key: string, fallback: string): string {
  try {
    const v = t(key as any)
    return typeof v === 'string' && v && !v.startsWith('writingExercise.') ? v : fallback
  } catch {
    return fallback
  }
}

// Hard-coded German fallbacks so the tool still works if i18n is missing.
function fallbackTitle(id: string): string { return id.replace(/^[a-c][12]_/, '').replace(/_/g, ' ') }
function fallbackInstructionDe(_id: string): string {
  return 'Bitte schreibe einen kurzen Text zum vorgegebenen Thema.'
}
