import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import BruttoNetto from './BruttoNetto'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Brutto Netto Calculator Germany 2026 — Net Salary Estimator | GoGermany', d: 'What is left of your German gross salary? Free brutto→netto calculator with tax classes, church tax and all social contributions.' },
  fr: { t: 'Calculateur Brut Net Allemagne 2026 — Salaire net estimé | GoGermany', d: 'Que reste-t-il de votre salaire brut allemand ? Calculateur brut→net gratuit : classes d’impôt, impôt d’église et cotisations sociales.' },
  ar: { t: 'حاسبة الراتب الصافي في ألمانيا 2026 | GoGermany', d: 'كم يتبقى من راتبك الإجمالي في ألمانيا؟ حاسبة مجانية: فئات الضريبة، ضريبة الكنيسة وجميع الاشتراكات الاجتماعية.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/brutto-netto-rechner',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

export default async function BruttoNettoPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <BruttoNetto locale={locale} />
      <RelatedTools locale={locale} current="bruttoNetto" />
    </>
  )
}
