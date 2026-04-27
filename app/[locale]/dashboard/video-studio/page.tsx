'use client'

import { useTranslations } from 'next-intl'

export default function VideoStudioPage() {
  const t = useTranslations('dashboard.videoStudioPage')

  return (
    <div className="dashpage">
      <div className="afm-soon">
        <span className="afm-soon-pill">
          <span className="afm-soon-dot" />
          {t('comingSoonPill')}
        </span>

        <div className="afm-soon-icon" aria-hidden>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="14" height="12" rx="2" />
            <path d="M22 8l-6 4 6 4z" />
          </svg>
        </div>

        <h1 className="afm-soon-title">{t('title')}</h1>
        <p className="afm-soon-sub">{t('subtitle')}</p>

        <div className="afm-soon-features">
          <div className="afm-feature">
            <span className="afm-feature-icon" aria-hidden>🎥</span>
            <h3>{t('feat1Title')}</h3>
            <p>{t('feat1Body')}</p>
          </div>
          <div className="afm-feature">
            <span className="afm-feature-icon" aria-hidden>📚</span>
            <h3>{t('feat2Title')}</h3>
            <p>{t('feat2Body')}</p>
          </div>
          <div className="afm-feature">
            <span className="afm-feature-icon" aria-hidden>🗓</span>
            <h3>{t('feat3Title')}</h3>
            <p>{t('feat3Body')}</p>
          </div>
        </div>

        <p className="afm-soon-foot">{t('etaHint')}</p>
      </div>
    </div>
  )
}
