import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import SperrkontoCalculator from './SperrkontoCalculator'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Sperrkonto Calculator 2026 — Blocked Account Amount for Germany | GoGermany', d: 'How much money do you need for your German visa? 2026 blocked-account calculator: 992 €/month for students, plus visa, insurance and one-time costs.' },
  fr: { t: 'Calculateur Sperrkonto 2026 — Montant du compte bloqué Allemagne | GoGermany', d: 'De combien avez-vous besoin pour votre visa allemand ? Calculateur 2026 du compte bloqué : 992 €/mois pour étudiants + frais uniques.' },
  ar: { t: 'حاسبة الحساب المجمّد 2026 — المبلغ المطلوب لتأشيرة ألمانيا | GoGermany', d: 'كم تحتاج من المال لتأشيرة ألمانيا؟ حاسبة الحساب المجمّد 2026: 992 € شهرياً للطلبة + التكاليف لمرة واحدة.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/sperrkonto-calculator',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

export default async function SperrkontoPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <SperrkontoCalculator locale={locale} />
      <RelatedTools locale={locale} current="sperrkonto" />
    </>
  )
}
