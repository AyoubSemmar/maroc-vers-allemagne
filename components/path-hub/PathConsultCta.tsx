'use client'

import { useTranslations } from 'next-intl'
import BookConsultationButton from '@/components/BookConsultationButton'

/**
 * Path-specific consultation block on /ausbildung and /studium.
 *
 * Replaces the legacy ConsultationForm (which silently dropped
 * submissions because the backing Supabase table doesn't exist).
 * Offers two tiers:
 *   • path-planning (45 min · 250 MAD) → BookConsultationButton with
 *     topic = 'ausbildung' | 'studium'
 *   • apply-for-me (60 min · 400 MAD) → flagship full-application
 *     service.
 */
export default function PathConsultCta({ path }: { path: 'ausbildung' | 'studium' }) {
  const t = useTranslations('pathConsultCta')
  return (
    <div className="path-consult-cta reveal">
      <div className="path-consult-card">
        <span className="path-consult-tag">{t('planTag')}</span>
        <h3>{t('planTitle')}</h3>
        <p>{t('planSub')}</p>
        <BookConsultationButton variant="primary" topic={path} />
      </div>
      <div className="path-consult-card path-consult-card--featured">
        <span className="path-consult-tag path-consult-tag--featured">{t('applyTag')}</span>
        <h3>{t('applyTitle')}</h3>
        <p>{t('applySub')}</p>
        <BookConsultationButton variant="primary" topic="apply-for-me" />
      </div>
    </div>
  )
}
