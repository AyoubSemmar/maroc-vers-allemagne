'use client'

import { useTranslations } from 'next-intl'
import BookConsultationButton from '@/components/BookConsultationButton'
import { CONSULTATIONS_ENABLED } from '@/lib/featureFlags'

export default function ApplyForMePage() {
  const t = useTranslations('dashboard.applyForMe')

  return (
    <div className="dashpage">
      <div className="afm-soon">
        <div className="afm-soon-icon" aria-hidden>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
            <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
          </svg>
        </div>

        <h1 className="afm-soon-title">{t('title')}</h1>
        <p className="afm-soon-sub">{t('subtitle')}</p>

        <div className="afm-soon-features">
          <div className="afm-feature">
            <span className="afm-feature-icon" aria-hidden>📥</span>
            <h3>{t('feat1Title')}</h3>
            <p>{t('feat1Body')}</p>
          </div>
          <div className="afm-feature">
            <span className="afm-feature-icon" aria-hidden>✍️</span>
            <h3>{t('feat2Title')}</h3>
            <p>{t('feat2Body')}</p>
          </div>
          <div className="afm-feature">
            <span className="afm-feature-icon" aria-hidden>📨</span>
            <h3>{t('feat3Title')}</h3>
            <p>{t('feat3Body')}</p>
          </div>
        </div>

        {CONSULTATIONS_ENABLED && (
          <div className="afm-buy-card">
            <h2 className="afm-buy-title">{t('buyTitle')}</h2>
            <p className="afm-buy-sub">{t('buySub')}</p>
            <div className="afm-buy-cta-row">
              <BookConsultationButton variant="on-cta" topic="apply-for-me" />
            </div>
          </div>
        )}

        <p className="afm-soon-foot">{t('etaHint')}</p>
      </div>
    </div>
  )
}
