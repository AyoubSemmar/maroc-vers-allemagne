'use client'

import { useTranslations } from 'next-intl'
import BookConsultationButton from '@/components/BookConsultationButton'

/**
 * Path-specific consultation block on /ausbildung and /studium.
 *
 * Replaces the legacy ConsultationForm (which silently dropped
 * submissions because the backing Supabase table doesn't exist).
 * Single card now — we offer one consultation (60 min · 200 MAD)
 * regardless of need; the `path` is passed to Calendly so the host
 * knows whether it's an Ausbildung or Studium question.
 */
export default function PathConsultCta({ path }: { path: 'ausbildung' | 'studium' }) {
  const t = useTranslations('pathConsultCta')
  return (
    <div className="path-consult-cta reveal">
      <div className="path-consult-card path-consult-card--featured">
        <span className="path-consult-tag path-consult-tag--featured">{t('planTag')}</span>
        <h3>{t('planTitle')}</h3>
        <p>{t('planSub')}</p>
        <BookConsultationButton variant="primary" topic={path} />
      </div>
    </div>
  )
}
