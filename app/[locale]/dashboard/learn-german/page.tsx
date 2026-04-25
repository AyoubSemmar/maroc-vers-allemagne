// Renders the German-learning level picker inside the dashboard shell.
import { getTranslations } from 'next-intl/server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import LevelsGrid from '@/components/learn-german/LevelsGrid'

export default async function DashboardLearnGermanPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'learnGerman' })

  return (
    <div dir={dirFor(locale)}>
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🇩🇪</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('pageTitle')}</h1>
        <p className="text-gray-500 max-w-xl mx-auto">{t('pageSubtitle')}</p>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">{t('chooseLevel')}</h2>
      <LevelsGrid />
    </div>
  )
}
