'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { createClient } from '@/lib/supabase-browser'
import BookConsultationButton from '@/components/BookConsultationButton'
import {
  CATEGORY_ICON,
  CATEGORY_ORDER,
  FREE_LIMIT,
  QUESTIONS,
  type CategoryKey,
  type Question,
} from '@/lib/interviewPrepData'
import './interview-prep.css'

type Filter = 'all' | CategoryKey

export default function InterviewPrep({ locale }: { locale: AppLocale }) {
  const t = useTranslations('interviewPrep')
  const dir = dirFor(locale)

  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')

  // Auth check on mount
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthed(!!user)
      setUserEmail(user?.email || '')
    })
  }, [])

  // Block clipboard / context menu / select
  useEffect(() => {
    const onCopy = (e: ClipboardEvent) => {
      const target = e.target as Element | null
      if (target && target.closest('.ip-answer-protected')) {
        e.preventDefault()
        try { e.clipboardData?.setData('text/plain', '') } catch {}
      }
    }
    const onContextMenu = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (target && target.closest('.ip-answer-protected')) {
        e.preventDefault()
      }
    }
    document.addEventListener('copy', onCopy)
    document.addEventListener('contextmenu', onContextMenu)
    return () => {
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('contextmenu', onContextMenu)
    }
  }, [])

  const visibleQuestions = useMemo(() => {
    return filter === 'all' ? QUESTIONS : QUESTIONS.filter(q => q.category === filter)
  }, [filter])

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: QUESTIONS.length }
    for (const q of QUESTIONS) m[q.category] = (m[q.category] ?? 0) + 1
    return m
  }, [])

  return (
    <div className="ip-root" dir={dir}>
      <header className="ip-hero">
        <div className="wrap">
          <span className="ip-eyebrow"><span className="ip-eyebrow-dot" />{t('eyebrow')}</span>
          <h1 className="ip-title">{t('title')}</h1>
          <p className="ip-subtitle">{t('subtitle')}</p>
          <div className="ip-hero-badges">
            <span className="ip-hero-badge">📋 {t('badgeQuestions', { n: QUESTIONS.length })}</span>
            <span className="ip-hero-badge">🎯 {t('badgeAnswers')}</span>
            <span className="ip-hero-badge">🇩🇪 {t('badgeGerman')}</span>
            <span className="ip-hero-badge">🆓 {t('badgeFreePreview', { n: FREE_LIMIT })}</span>
          </div>
        </div>
      </header>

      <div className="ip-body wrap">
        {/* Category filter */}
        <div className="ip-filter">
          <button
            type="button"
            className={`ip-pill${filter === 'all' ? ' is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('allFilter')} ({counts.all})
          </button>
          {CATEGORY_ORDER.map(cat => (
            <button
              key={cat}
              type="button"
              className={`ip-pill${filter === cat ? ' is-active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {CATEGORY_ICON[cat]} {t(`category.${cat}`)} ({counts[cat] ?? 0})
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="ip-list">
          {visibleQuestions.map((q, idx) => {
            const globalIndex = QUESTIONS.findIndex(qq => qq.id === q.id)
            const isFree = q.isFree || globalIndex < FREE_LIMIT
            const isOpen = openId === q.id
            const isLocked = !isFree && authed === false
            return (
              <QuestionCard
                key={q.id}
                index={globalIndex + 1}
                q={q}
                t={t}
                userEmail={userEmail}
                isOpen={isOpen}
                isLocked={isLocked}
                onToggle={() => setOpenId(isOpen ? null : q.id)}
              />
            )
          })}
        </div>

        {/* Final CTA */}
        <section className="ip-cta">
          <h2 className="ip-cta-title">{t('ctaTitle')}</h2>
          <p className="ip-cta-sub">{t('ctaSub')}</p>
          <BookConsultationButton variant="on-cta" topic="interview-prep" />
        </section>
      </div>
    </div>
  )
}

function QuestionCard({
  index, q, t, userEmail, isOpen, isLocked, onToggle,
}: {
  index: number
  q: Question
  t: ReturnType<typeof useTranslations>
  userEmail: string
  isOpen: boolean
  isLocked: boolean
  onToggle: () => void
}) {
  const [showWhy, setShowWhy] = useState(false)
  const watermark = userEmail ? `${userEmail} · gogermany.ma` : 'gogermany.ma · do not redistribute'

  return (
    <article className={`ip-card ip-card--diff-${q.difficulty}`}>
      <header className="ip-card-head">
        <span className="ip-card-num">{String(index).padStart(2, '0')}</span>
        <div className="ip-card-meta">
          <span className="ip-card-cat">{CATEGORY_ICON[q.category]} {t(`category.${q.category}`)}</span>
          <span className="ip-card-diff" title={t(`difficulty.${q.difficulty}`)}>
            {q.difficulty === 1 && '⭐'}
            {q.difficulty === 2 && '⭐⭐'}
            {q.difficulty === 3 && '⭐⭐⭐'}
          </span>
        </div>
      </header>

      <h3 className="ip-question-de" lang="de" dir="ltr">{q.questionDe}</h3>
      <p className="ip-question-trans">{t(`questions.${q.id}.translation` as any)}</p>

      <button type="button" className="ip-why-toggle" onClick={() => setShowWhy(v => !v)}>
        💡 {showWhy ? t('hideWhy') : t('showWhy')}
      </button>
      {showWhy && (
        <div className="ip-why-box">
          <p>{t(`questions.${q.id}.why` as any)}</p>
        </div>
      )}

      {/* Answer area */}
      {isLocked ? (
        <LockedAnswer t={t} />
      ) : (
        <div className={`ip-answer-wrapper ${isOpen ? 'is-open' : ''}`}>
          {!isOpen ? (
            <button type="button" className="ip-reveal-btn" onClick={onToggle}>
              <span className="ip-reveal-icon" aria-hidden>👁</span>
              {t('revealAnswer')}
            </button>
          ) : (
            <div className="ip-answer-protected" data-watermark={watermark}>
              <div className="ip-answer-section">
                <h4 className="ip-answer-label">🇩🇪 {t('sampleAnswerLabel')}</h4>
                <p className="ip-answer-text" lang="de" dir="ltr">{q.sampleAnswerDe}</p>
              </div>

              <div className="ip-answer-section">
                <h4 className="ip-answer-label ip-do">✅ {t('doSayLabel')}</h4>
                <p className="ip-answer-text">{t(`questions.${q.id}.doSay` as any)}</p>
              </div>

              <div className="ip-answer-section">
                <h4 className="ip-answer-label ip-dont">⚠️ {t('dontSayLabel')}</h4>
                <p className="ip-answer-text">{t(`questions.${q.id}.dontSay` as any)}</p>
              </div>

              <button type="button" className="ip-collapse-btn" onClick={onToggle}>
                ✕ {t('hideAnswer')}
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

function LockedAnswer({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="ip-locked">
      <div className="ip-locked-icon" aria-hidden>🔒</div>
      <h4 className="ip-locked-title">{t('lockedTitle')}</h4>
      <p className="ip-locked-body">{t('lockedBody')}</p>
      <Link
        href={`/login?next=${typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname) : ''}`}
        className="ip-locked-cta"
      >
        {t('lockedCta')} →
      </Link>
    </div>
  )
}
