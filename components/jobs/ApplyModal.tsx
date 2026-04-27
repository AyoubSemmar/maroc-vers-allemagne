'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import ReactMarkdown from 'react-markdown'
import { Job } from './JobCard'

type Props = {
  job: Job
  onClose: () => void
}

export default function ApplyModal({ job, onClose }: Props) {
  const t = useTranslations('ausbJobs.modal')
  const locale = useLocale()
  const [toast, setToast] = useState('')

  const translated = (locale === 'ar' || locale === 'fr' || locale === 'en')
    ? job.enrichment_json?.translations?.[locale]
    : null
  const description = translated || job.description

  // ── Lock body scroll while open ─────────────────────────
  useEffect(() => {
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = orig }
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  async function copyEmail() {
    if (!job.contact_email) return
    try {
      await navigator.clipboard.writeText(job.contact_email)
      showToast(t('copied'))
    } catch {
      showToast(t('copyFail'))
    }
  }

  const hasEmail = !!job.contact_email
  const hasUrl = !!job.apply_url
  const hasPhone = !!job.phone
  const hasAny = hasEmail || hasUrl || hasPhone

  return (
    <div
      className="aj-modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="aj-modal">
        {/* Header */}
        <div className="aj-modal-header">
          <div className="aj-modal-title-block">
            <h2 className="aj-modal-title">{job.title}</h2>
            <p className="aj-modal-subtitle">
              🏢 {job.company}
              {job.location && job.location !== '—' ? ` · 📍 ${job.location}` : ''}
              {job.anstellungsart ? ` · ⏱ ${job.anstellungsart}` : ''}
            </p>
          </div>
          <button type="button" className="aj-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="aj-modal-body">
          <div className="aj-section">
            <h3 className="aj-section-title">{t('howTo')}</h3>

            {!hasAny && (
              <div className="aj-attach-empty">{t('noContact')}</div>
            )}

            {hasEmail && (
              <div className="aj-contact-block">
                <div className="aj-contact-label">{t('emailLabel')}</div>
                <div className="aj-contact-row">
                  <a href={`mailto:${job.contact_email}`} className="aj-contact-value" dir="ltr">
                    {job.contact_email}
                  </a>
                  <button type="button" className="aj-btn-ghost aj-btn-sm" onClick={copyEmail}>
                    {t('copy')}
                  </button>
                </div>
              </div>
            )}

            {hasPhone && (
              <div className="aj-contact-block">
                <div className="aj-contact-label">{t('phoneLabel')}</div>
                <a href={`tel:${(job.phone || '').replace(/\s+/g, '')}`} className="aj-contact-value" dir="ltr">
                  📞 {job.phone}
                </a>
              </div>
            )}

            {hasUrl && (
              <div className="aj-contact-block">
                <div className="aj-contact-label">{t('urlLabel')}</div>
                <a
                  href={job.apply_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aj-offer-link"
                >
                  <span className="aj-offer-link-icon">🔗</span>
                  <span className="aj-offer-link-text">
                    <span className="aj-offer-link-title">{t('openApply')}</span>
                    <span className="aj-offer-link-sub">{job.apply_url}</span>
                  </span>
                </a>
              </div>
            )}
          </div>

          {description && (
            <div className="aj-section">
              <h3 className="aj-section-title">{t('descriptionLabel')}</h3>
              <div className="aj-description-md">
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            </div>
          )}

          <p className="aj-email-hint" style={{ marginTop: 12 }}>
            {t('tipPrefix')} <a href="/cv-builder" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>{t('tipLink')}</a> {t('tipSuffix')}
          </p>
        </div>

        {toast && <div className="aj-toast">{toast}</div>}
      </div>
    </div>
  )
}
