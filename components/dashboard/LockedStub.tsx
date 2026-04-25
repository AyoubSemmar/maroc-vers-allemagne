'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function LockedStub({
  feature,
  body,
  showBrowseCta,
}: {
  feature: string
  body?: string
  showBrowseCta?: boolean
}) {
  const t = useTranslations('dashboard.stubs')

  return (
    <div className="dashpage">
      <div className="dashstub">
        <div className="dashstub-icon" aria-hidden>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 1 1 8 0v4" />
          </svg>
        </div>
        <h1>{t('lockedTitle', { feature })}</h1>
        <p>{body ?? t('lockedBody')}</p>
        {showBrowseCta && (
          <Link href="/ausbildung-jobs" className="btn btn-primary">
            {t('browseCta')}
          </Link>
        )}
      </div>
    </div>
  )
}
