// Renders the live Ausbildung board inside the dashboard shell.
// Same Arbeitsagentur-backed search as /ausbildung-jobs (shared 30-min
// cache), minus the marketing hero.
import { getTranslations } from 'next-intl/server'
import AusbildungBoard from '../../ausbildung-jobs/AusbildungBoard'
import type { AppLocale } from '@/i18n/routing'
import { dirFor } from '@/i18n/routing'
import { buildAaQuery, searchAusbildung, type AaResult } from '@/lib/ausbildungSearch'

const EMPTY: AaResult = { total: 0, jobs: [] }

export default async function DashboardBrowsePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ausbJobs.board' })
  const initial = await searchAusbildung(buildAaQuery({})).catch(() => EMPTY)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" dir={dirFor(locale)}>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('title')}</h1>
      <p className="text-sm text-gray-500 mb-6">{t('badgeOfficial')}</p>
      <AusbildungBoard locale={locale} initial={initial} />
    </div>
  )
}
