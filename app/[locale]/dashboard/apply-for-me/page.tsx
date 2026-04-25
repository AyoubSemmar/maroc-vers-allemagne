'use client'

import { useTranslations } from 'next-intl'

export default function ApplyForMePage() {
  const t = useTranslations('dashboard.stubs')

  return (
    <div className="dashpage">
      <div className="dashstub">
        <div className="dashstub-icon" aria-hidden>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
            <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
          </svg>
        </div>
        <h1>{t('applyTitle')}</h1>
        <p>{t('applyBody')}</p>
      </div>
    </div>
  )
}
