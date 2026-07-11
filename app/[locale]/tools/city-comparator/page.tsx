import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import CityComparator from './CityComparator'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'German City Comparator — Cost of Living Side by Side | GoGermany', d: 'Berlin vs Munich vs Leipzig: compare rent, food, transport and total monthly costs of 15 German cities side by side.' },
  fr: { t: 'Comparateur de villes allemandes — Coût de la vie côte à côte | GoGermany', d: 'Berlin vs Munich vs Leipzig : comparez loyer, nourriture, transport et coût mensuel total de 15 villes allemandes.' },
  ar: { t: 'مقارنة المدن الألمانية — تكلفة المعيشة جنباً إلى جنب | GoGermany', d: 'برلين أم ميونخ أم لايبزيغ؟ قارن الكراء والطعام والنقل والتكلفة الشهرية في 15 مدينة ألمانية.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/city-comparator',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

export default async function CityComparatorPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <CityComparator locale={locale} />
      <RelatedTools locale={locale} current="cityComparator" />
    </>
  )
}
