// Renders the German-learning level picker inside the dashboard shell.
// Re-uses the same theme and components as the public /learn-german page.
import { getTranslations } from 'next-intl/server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import LevelsGrid from '@/components/learn-german/LevelsGrid'
import '../../learn-german/learn-german.css'

export default async function DashboardLearnGermanPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'learnGerman' })

  return (
    <div className="lg-root" dir={dirFor(locale)}>
      <header className="lg-hero">
        <div className="wrap">
          <span className="lg-eyebrow"><span className="lg-eyebrow-dot" />{t('pageEyebrow')}</span>
          <h1 className="lg-title">{t('pageTitle')}</h1>
          <p className="lg-subtitle">{t('pageSubtitle')}</p>
          <div className="lg-hero-badges">
            <span className="lg-hero-badge">📖 {t('badgeGrammar')}</span>
            <span className="lg-hero-badge">💬 {t('badgeVocab')}</span>
            <span className="lg-hero-badge">✏️ {t('badgeExercises')}</span>
            <span className="lg-hero-badge">🎯 {t('badgeFree')}</span>
          </div>
        </div>
      </header>

      <div className="lg-body wrap">
        <h2 className="lg-section-title">{t('chooseLevel')}</h2>
        <LevelsGrid />
      </div>
    </div>
  )
}
