import { getTranslations } from 'next-intl/server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import LevelsGrid from '@/components/learn-german/LevelsGrid'

export default async function LearnGermanPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'learnGerman' })

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-14 text-center">
          <div className="text-5xl mb-4">🇩🇪</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('pageTitle')}</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            {t('pageSubtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('chooseLevel')}</h2>
        <LevelsGrid />
      </div>
    </div>
  )
}
