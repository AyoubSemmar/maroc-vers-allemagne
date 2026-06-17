'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import BookConsultationButton, { type ConsultTopic } from '@/components/BookConsultationButton'
import { VISA_DATA, totalCost, eurOf, type VisaFlow } from '@/lib/visaData'
import './visa-guide.css'

export default function VisaGuide({
  flow,
  locale,
}: {
  flow: VisaFlow
  locale: AppLocale
}) {
  const t = useTranslations(`visaGuide.${flow}`)
  const tShared = useTranslations('visaGuide.shared')
  const dir = dirFor(locale)
  const data = VISA_DATA[flow]
  const { totalEur } = totalCost(flow, false)
  const topic: ConsultTopic = 'visa'

  return (
    <div className={`vg-root vg-flow--${flow}`} dir={dir}>
      {/* Hero */}
      <header className="vg-hero">
        <div className="wrap">
          <span className="vg-eyebrow">
            <span className="vg-eyebrow-dot" />
            {t('eyebrow')}
          </span>
          <h1 className="vg-title">{t('title')}</h1>
          <p className="vg-subtitle">{t('subtitle')}</p>
          <div className="vg-hero-badges">
            <span className="vg-hero-badge">📜 {data.legalBasis}</span>
            <span className="vg-hero-badge">📍 {tShared('badgeWhere')}</span>
            <span className="vg-hero-badge">⏱ {tShared('badgeProcessing')}</span>
            <span className="vg-hero-badge">💶 {tShared('badgeFee')}</span>
          </div>
        </div>
      </header>

      <div className="vg-body wrap">
        {/* Steps */}
        <section className="vg-section">
          <h2 className="vg-section-title">📍 {tShared('stepsTitle')}</h2>
          <p className="vg-section-sub">{tShared('stepsSub')}</p>
          <ol className="vg-steps">
            {data.steps.map(step => (
              <li key={step.id} className="vg-step">
                <span className="vg-step-num">{String(step.n).padStart(2, '0')}</span>
                <div className="vg-step-body">
                  <h3 className="vg-step-title">{t(`steps.${step.id}.title` as any)}</h3>
                  <p className="vg-step-desc">{t(`steps.${step.id}.desc` as any)}</p>
                  {step.hasDuration && (
                    <span className="vg-step-duration">⏱ {t(`steps.${step.id}.duration` as any)}</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Mid-page consultation CTA */}
        <section className="vg-mid-cta">
          <div className="vg-mid-cta-text">
            <h3>{tShared('midCtaTitle')}</h3>
            <p>{tShared('midCtaSub')}</p>
          </div>
          <div className="vg-mid-cta-btn">
            <BookConsultationButton variant="primary" topic={topic} />
          </div>
        </section>

        {/* Documents */}
        <section className="vg-section">
          <h2 className="vg-section-title">📋 {tShared('docsTitle')}</h2>
          <p className="vg-section-sub">{tShared('docsSub')}</p>
          <div className="vg-doc-legend">
            <span className="vg-doc-pill vg-doc-pill--critical">{tShared('legendCritical')}</span>
            <span className="vg-doc-pill vg-doc-pill--important">{tShared('legendImportant')}</span>
            <span className="vg-doc-pill vg-doc-pill--recommended">{tShared('legendRecommended')}</span>
            <span className="vg-doc-pill vg-doc-pill--apostille">📜 {tShared('legendApostille')}</span>
            <span className="vg-doc-pill vg-doc-pill--translation">🌐 {tShared('legendTranslation')}</span>
          </div>
          <ul className="vg-docs">
            {data.docs.map(doc => (
              <li key={doc.id} className={`vg-doc vg-doc--${doc.importance}`}>
                <div className="vg-doc-head">
                  <h4 className="vg-doc-title">{t(`docs.${doc.id}.title` as any)}</h4>
                  <div className="vg-doc-flags">
                    <span className={`vg-doc-status vg-doc-status--${doc.importance}`}>
                      {tShared(`importance.${doc.importance}`)}
                    </span>
                    {doc.apostille && <span className="vg-doc-flag">📜 {tShared('flagApostille')}</span>}
                    {doc.swornTranslation && <span className="vg-doc-flag">🌐 {tShared('flagTranslation')}</span>}
                  </div>
                </div>
                <p className="vg-doc-desc">{t(`docs.${doc.id}.desc` as any)}</p>
                <p className="vg-doc-tip">💡 {t(`docs.${doc.id}.tip` as any)}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Costs */}
        <section className="vg-section">
          <h2 className="vg-section-title">💶 {tShared('costsTitle')}</h2>
          <p className="vg-section-sub">{tShared('costsSub')}</p>
          <div className="vg-costs-card">
            <ul className="vg-costs">
              {data.costs.map(cost => (
                <li key={cost.id} className={`vg-cost ${cost.required ? '' : 'vg-cost--optional'}`}>
                  <span className="vg-cost-label">
                    {t(`costs.${cost.id}.label` as any)}
                    {!cost.required && <small> · {tShared('optional')}</small>}
                  </span>
                  <span className="vg-cost-amount">
                    <strong>{cost.amountEur ? `${cost.amountEur} €` : `≈ ${eurOf(cost)} €`}</strong>
                  </span>
                </li>
              ))}
            </ul>
            <div className="vg-cost-total">
              <span>{tShared('totalLabel')}</span>
              <span className="vg-cost-total-num">
                <strong>≈ {totalEur.toLocaleString()} €</strong>
              </span>
            </div>
            <p className="vg-cost-note">⚠️ {tShared('costsNote')}</p>
          </div>
        </section>

        {/* Common rejections */}
        <section className="vg-section">
          <h2 className="vg-section-title">⚠️ {tShared('rejectionsTitle')}</h2>
          <p className="vg-section-sub">{tShared('rejectionsSub')}</p>
          <ul className="vg-rejections">
            {data.rejections.map(r => (
              <li key={r.id} className={`vg-rejection vg-rejection--${r.severity}`}>
                <span className="vg-rejection-severity">
                  {r.severity === 'high' ? '🔴' : '🟡'} {tShared(`severity.${r.severity}`)}
                </span>
                <h4 className="vg-rejection-title">{t(`rejections.${r.id}.title` as any)}</h4>
                <p className="vg-rejection-desc">{t(`rejections.${r.id}.desc` as any)}</p>
                <p className="vg-rejection-fix">✅ {t(`rejections.${r.id}.fix` as any)}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Tools links */}
        <section className="vg-tools">
          <h3 className="vg-tools-title">🛠 {tShared('toolsTitle')}</h3>
          <p className="vg-tools-sub">{tShared('toolsSub')}</p>
          <div className="vg-tools-grid">
            <Link href="/tools/document-checklist" className="vg-tool-card">
              <span className="vg-tool-icon">📋</span>
              <strong>{tShared('toolDocs')}</strong>
              <small>{tShared('toolDocsDesc')}</small>
            </Link>
            <Link href="/tools/migration-timeline" className="vg-tool-card">
              <span className="vg-tool-icon">🗺</span>
              <strong>{tShared('toolTimeline')}</strong>
              <small>{tShared('toolTimelineDesc')}</small>
            </Link>
            <Link href="/tools/eligibility-checker" className="vg-tool-card">
              <span className="vg-tool-icon">✅</span>
              <strong>{tShared('toolEligibility')}</strong>
              <small>{tShared('toolEligibilityDesc')}</small>
            </Link>
            <Link href="/tools/living-cost-calculator" className="vg-tool-card">
              <span className="vg-tool-icon">💸</span>
              <strong>{tShared('toolCost')}</strong>
              <small>{tShared('toolCostDesc')}</small>
            </Link>
          </div>
        </section>

        {/* Final consultation CTA */}
        <section className="vg-final-cta">
          <div className="vg-final-cta-eyebrow">{tShared('finalCtaEyebrow')}</div>
          <h2 className="vg-final-cta-title">{t('finalCtaTitle')}</h2>
          <p className="vg-final-cta-sub">{t('finalCtaSub')}</p>
          <ul className="vg-final-cta-list">
            <li>✅ {tShared('finalCta1')}</li>
            <li>✅ {tShared('finalCta2')}</li>
            <li>✅ {tShared('finalCta3')}</li>
            <li>✅ {tShared('finalCta4')}</li>
          </ul>
          <BookConsultationButton variant="on-cta" topic={topic} />
        </section>
      </div>
    </div>
  )
}
