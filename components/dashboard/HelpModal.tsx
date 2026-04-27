'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import './help-modal.css'

/**
 * Inline Help/FAQ modal shown over the dashboard. Both the topbar
 * Help icon and the sidebar Help link open it. Content is pulled
 * from the `dashboardServices` namespace (the same FAQ items used on
 * the /dashboard/services page) so we keep a single source of truth.
 */
export default function HelpModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  // Pull from the site-wide FAQ (landing.faq) so the dashboard Help and
  // the public homepage stay in sync — single source of truth.
  const t = useTranslations('landing.faq')
  const tSvc = useTranslations('dashboardServices')

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="hlp-overlay" role="dialog" aria-modal="true" aria-labelledby="hlp-title">
      <button
        type="button"
        className="hlp-backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="hlp-panel">
        <header className="hlp-head">
          <div className="hlp-head-text">
            <span className="hlp-eyebrow">
              <span className="hlp-eyebrow-dot" />
              {t('kicker')}
            </span>
            <h2 id="hlp-title" className="hlp-title">{t('title')}</h2>
          </div>
          <button
            type="button"
            className="hlp-close"
            aria-label="Close"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="hlp-body">
          <FaqItem q={t('q1')} a={t('a1')} defaultOpen />
          <FaqItem q={t('q2')} a={t('a2')} />
          <FaqItem q={t('q3')} a={t('a3')} />
          <FaqItem q={t('q4')} a={t('a4')} />
          <FaqItem q={t('q5')} a={t('a5')} />
        </div>

        <footer className="hlp-foot">
          <Link
            href="/dashboard/services"
            className="hlp-cta"
            onClick={onClose}
          >
            {tSvc('title')} →
          </Link>
        </footer>
      </div>
    </div>
  )
}

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  return (
    <details className="hlp-item" open={defaultOpen}>
      <summary>{q}</summary>
      <p>{a}</p>
    </details>
  )
}
