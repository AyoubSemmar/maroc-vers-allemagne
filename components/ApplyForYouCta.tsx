'use client'

import { useTranslations } from 'next-intl'
import BookConsultationButton from '@/components/BookConsultationButton'

/**
 * Promo banner for the "Apply For Me" consultation, shown on the
 * Ausbildung listings and Universities pages. The booking button
 * pre-selects the apply-for-me topic which routes to the 60-min /
 * 400 MAD Calendly tier.
 */
export default function ApplyForYouCta() {
  const t = useTranslations('applyForYouCta')
  return (
    <aside className="afy-cta">
      <div className="afy-cta-text">
        <span className="afy-cta-badge">{t('badge')}</span>
        <h2 className="afy-cta-title">{t('title')}</h2>
        <p className="afy-cta-sub">{t('subtitle')}</p>
      </div>
      <div className="afy-cta-action">
        <BookConsultationButton variant="primary" topic="apply-for-me" />
      </div>
    </aside>
  )
}
