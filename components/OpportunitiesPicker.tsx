'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

/**
 * Modal popup that asks the user which kind of opportunity they want to
 * browse — Ausbildung offers or Universities — and routes accordingly.
 *
 * Used in two places:
 *  • The public top nav "Opportunities" entry (RihlaNav)
 *  • The dashboard sidebar "Browse Opportunities" entry (DashSidebar)
 */
export default function OpportunitiesPicker({
  open,
  onClose,
  inDashboard = false,
}: {
  open: boolean
  onClose: () => void
  /** When true, route to dashboard-shell pages instead of the public ones. */
  inDashboard?: boolean
}) {
  const ausbildungHref = inDashboard ? '/dashboard/browse' : '/ausbildung-jobs'
  const universitiesHref = inDashboard ? '/dashboard/universities' : '/universities'
  const t = useTranslations('opportunitiesPicker')
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Close on Esc + lock body scroll while open.
  useEffect(() => {
    if (!open) return
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onEsc)
    }
  }, [open, onClose])

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="opp-picker-bg"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={t('title')}
    >
      <div className="opp-picker-card">
        <div className="opp-picker-grid">
          <Link href={ausbildungHref as any} className="opp-picker-option opp-picker-option--ausb" onClick={onClose}>
            <span className="opp-picker-icon" aria-hidden>🔧</span>
            <span className="opp-picker-option-title">{t('ausbildung')}</span>
          </Link>
          <Link href={universitiesHref as any} className="opp-picker-option opp-picker-option--uni" onClick={onClose}>
            <span className="opp-picker-icon" aria-hidden>🎓</span>
            <span className="opp-picker-option-title">{t('universities')}</span>
          </Link>
        </div>

        <button type="button" className="opp-picker-close" onClick={onClose} aria-label={t('close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  )
}
