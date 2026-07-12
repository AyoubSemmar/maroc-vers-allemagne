import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import AusbildungBoard from './AusbildungBoard'
import type { AppLocale } from '@/i18n/routing'
import { dirFor } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import ToolSeoSection from '@/components/seo/ToolSeoSection'
import { buildAaQuery, searchAusbildung, type AaResult } from '@/lib/ausbildungSearch'

// Live Ausbildung board — a search front-end over the Bundesagentur für
// Arbeit's public Jobsuche API (~177k live Ausbildung offers, hundreds
// added daily). Replaces the old Supabase table that was imported once
// and went stale. First page + counts are fetched server-side (30-min
// shared cache) so crawlers and first paint get real offers.

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ausbJobs' })
  return buildLocaleMetadata({
    locale,
    path: '/ausbildung-jobs',
    title: t('metaTitle'),
    description: t('metaDesc'),
  })
}

const EMPTY: AaResult = { total: 0, jobs: [] }

export default async function AusbildungJobsPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ausbJobs.board' })

  const [initial, todayRes] = await Promise.all([
    searchAusbildung(buildAaQuery({})).catch(() => EMPTY),
    searchAusbildung(buildAaQuery({ days: '0', size: '1' })).catch(() => EMPTY),
  ])

  const nf = new Intl.NumberFormat(locale)

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <header className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden />
            {t('eyebrow')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3">{t('title')}</h1>
          <p className="mt-3 text-slate-300 leading-relaxed max-w-2xl">
            {t('subtitle', { total: nf.format(initial.total), today: nf.format(todayRes.total) })}
          </p>
          <div className="flex flex-wrap gap-2 mt-5 text-xs">
            <span className="bg-white/10 rounded-full px-3 py-1.5">🇩🇪 {t('badgeOfficial')}</span>
            <span className="bg-emerald-500/20 text-emerald-200 rounded-full px-3 py-1.5 font-bold">
              ⚡ {t('badgeToday', { n: nf.format(todayRes.total) })}
            </span>
            <span className="bg-white/10 rounded-full px-3 py-1.5">🆓 {t('badgeFree')}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <AusbildungBoard locale={locale} initial={initial} />
      </main>

      {/* Long-form crawlable copy + FAQ rich result — targets "Ausbildung
          in Germany for foreigners", salary and visa queries. */}
      <ToolSeoSection locale={locale} namespace="ausbJobs" />
    </div>
  )
}
