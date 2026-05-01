'use client'

/**
 * Daily conjugation drill — picks 10 verbs at random for the chosen
 * level, asks for one of the 6 person forms, gives instant feedback,
 * tracks streak in localStorage. Pure client-side, no API, no DB.
 *
 * Why this exists: conjugation accuracy is the single biggest gap
 * between A1 students and B1 fluency. A 5-minute daily drill builds
 * recall faster than re-reading lessons. Inspired by Duolingo's verb
 * exercises but stripped to essentials so it loads instantly.
 */

import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  verbsForLevel, PERSON_LABELS_FR, PERSON_LABELS_AR,
  type Verb, type VerbLevel,
} from '@/lib/german-data/verb-pool'
import { dirFor, type AppLocale } from '@/i18n/routing'

type Person = keyof Verb['forms']
const PERSONS: Person[] = ['ich', 'du', 'er', 'wir', 'ihr', 'sie']

type DrillItem = {
  verb: Verb
  person: Person
  expected: string
}

function pickDrill(pool: Verb[], n = 10): DrillItem[] {
  const items: DrillItem[] = []
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  for (let i = 0; i < Math.min(n, shuffled.length); i++) {
    const verb = shuffled[i]
    const person = PERSONS[Math.floor(Math.random() * PERSONS.length)]
    items.push({ verb, person, expected: verb.forms[person] })
  }
  return items
}

// localStorage key for the running streak count.
const STREAK_KEY = 'gg-conjugation-streak'
const STREAK_DATE_KEY = 'gg-conjugation-streak-date'

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function readStreak(): number {
  if (typeof window === 'undefined') return 0
  const last = window.localStorage.getItem(STREAK_DATE_KEY) || ''
  const today = todayKey()
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  // If the last drill was today or yesterday, the streak is alive;
  // otherwise it resets to 0 next time the user finishes a drill.
  if (last === today || last === yesterday) {
    return Number(window.localStorage.getItem(STREAK_KEY) || 0)
  }
  return 0
}

function bumpStreak() {
  if (typeof window === 'undefined') return
  const today = todayKey()
  const last = window.localStorage.getItem(STREAK_DATE_KEY) || ''
  if (last === today) return // already counted for today
  const cur = readStreak()
  window.localStorage.setItem(STREAK_KEY, String(cur + 1))
  window.localStorage.setItem(STREAK_DATE_KEY, today)
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/ß/g, 'ss')
}

const LEVELS: VerbLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

export default function ConjugationDrill() {
  const t = useTranslations('learnGerman.drill')
  const rawLocale = useLocale()
  const locale = rawLocale as AppLocale
  const dir = dirFor(locale)
  const personLabels = locale === 'ar' ? PERSON_LABELS_AR : PERSON_LABELS_FR

  const [level, setLevel] = useState<VerbLevel>('A1')
  const [items, setItems] = useState<DrillItem[]>([])
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<null | 'correct' | 'wrong'>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [streak, setStreak] = useState(0)

  const pool = useMemo(() => verbsForLevel(level), [level])

  useEffect(() => {
    setStreak(readStreak())
  }, [])

  function startDrill() {
    setItems(pickDrill(pool, 10))
    setIdx(0)
    setInput('')
    setFeedback(null)
    setScore(0)
    setDone(false)
  }

  function check() {
    if (!items[idx] || feedback !== null) return
    const correct = normalize(input) === normalize(items[idx].expected)
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) setScore(s => s + 1)
  }

  function next() {
    if (idx + 1 >= items.length) {
      setDone(true)
      bumpStreak()
      setStreak(readStreak() + (window.localStorage.getItem(STREAK_DATE_KEY) === todayKey() ? 0 : 1))
      return
    }
    setIdx(i => i + 1)
    setInput('')
    setFeedback(null)
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (feedback === null) check()
      else next()
    }
  }

  // ── Empty state: pick a level and start ───────────────────────
  if (items.length === 0) {
    return (
      <div dir={dir} className="cd-root">
        <header className="cd-head">
          <h1 className="cd-title">{t('title')}</h1>
          <p className="cd-sub">{t('intro')}</p>
          {streak > 0 && (
            <p className="cd-streak">
              🔥 {t('streak', { n: streak })}
            </p>
          )}
        </header>
        <div className="cd-card">
          <label className="cd-label">{t('pickLevel')}</label>
          <div className="cd-level-grid">
            {LEVELS.map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={'cd-level-btn' + (l === level ? ' is-active' : '')}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="cd-pool-info">{t('poolSize', { n: pool.length })}</p>
          <button type="button" onClick={startDrill} className="cd-cta">
            {t('startCta')}
          </button>
        </div>
      </div>
    )
  }

  // ── Done state: summary ───────────────────────────────────────
  if (done) {
    const pct = Math.round((score / items.length) * 100)
    const grade =
      pct >= 90 ? t('grade.excellent') :
      pct >= 70 ? t('grade.good') :
      pct >= 50 ? t('grade.ok') :
                  t('grade.practice')
    return (
      <div dir={dir} className="cd-root">
        <div className="cd-card cd-card--done">
          <div className="cd-score">{score} / {items.length}</div>
          <div className="cd-grade">{grade}</div>
          <p className="cd-streak-big">🔥 {t('streak', { n: streak })}</p>
          <button type="button" onClick={startDrill} className="cd-cta">
            {t('againCta')}
          </button>
        </div>
      </div>
    )
  }

  // ── Active drill ──────────────────────────────────────────────
  const cur = items[idx]
  const showCorrection = feedback === 'wrong'
  return (
    <div dir={dir} className="cd-root">
      <div className="cd-progress">
        <span>{idx + 1} / {items.length}</span>
        <span>🔥 {streak}</span>
      </div>
      <div className="cd-card">
        <div className="cd-prompt-row">
          <span className="cd-infinitive">
            {cur.verb.separable
              ? cur.verb.infinitive.replace(/^([a-zäöü]{2,4})/, '$1·')
              : cur.verb.infinitive}
          </span>
          <span className="cd-meaning">
            ({locale === 'ar' ? cur.verb.meaningAr : cur.verb.meaningFr})
          </span>
        </div>
        <div className="cd-person">{personLabels[cur.person]}</div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          autoFocus
          dir="ltr"
          className={'cd-input' + (feedback === 'correct' ? ' is-correct' : feedback === 'wrong' ? ' is-wrong' : '')}
          placeholder={t('inputPh')}
          disabled={feedback !== null}
        />
        {showCorrection && (
          <div className="cd-correction">
            <strong>{t('correctAnswer')}:</strong> {cur.expected}
          </div>
        )}
        <div className="cd-actions">
          {feedback === null ? (
            <button type="button" onClick={check} disabled={!input.trim()} className="cd-cta">
              {t('check')}
            </button>
          ) : (
            <button type="button" onClick={next} className="cd-cta">
              {idx + 1 >= items.length ? t('finishCta') : t('nextCta')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
