'use client'

import { useTranslations } from 'next-intl'
import BookConsultationButton from '@/components/BookConsultationButton'
import './exam-prep-cta.css'

/**
 * Promo card for booking a paid 1-on-1 consultation about Goethe/telc
 * exam preparation. Sits below the Levels Grid on the Learn German hub
 * and at the top of every level page.
 */
export default function ExamPrepCTA({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('examPrepCta')

  return (
    <section className={`epc-card ${compact ? 'epc-card--compact' : ''}`}>
      <div className="epc-text">
        <span className="epc-eyebrow">
          <span className="epc-eyebrow-dot" />
          {t('eyebrow')}
        </span>
        <h2 className="epc-title">{t('title')}</h2>
        <p className="epc-sub">{t('subtitle')}</p>
        {!compact && (
          <ul className="epc-list">
            <li>✅ {t('bullet1')}</li>
            <li>✅ {t('bullet2')}</li>
            <li>✅ {t('bullet3')}</li>
            <li>✅ {t('bullet4')}</li>
          </ul>
        )}
        <div className="epc-exams">
          <span className="epc-pill">🎓 Goethe-Zertifikat A1</span>
          <span className="epc-pill">🎓 Goethe-Zertifikat A2</span>
          <span className="epc-pill">🎓 Goethe-Zertifikat B1</span>
          <span className="epc-pill">🎓 Goethe-Zertifikat B2</span>
          <span className="epc-pill">📜 telc Deutsch B1 / B2</span>
          <span className="epc-pill">🇲🇦 Casablanca / Rabat</span>
        </div>
      </div>
      <div className="epc-cta">
        <BookConsultationButton variant="primary" topic="german-exam-prep" />
        <span className="epc-cta-note">⏱ 30 min · 💶 €16</span>
      </div>
    </section>
  )
}
