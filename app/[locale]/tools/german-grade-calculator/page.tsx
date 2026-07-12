import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import GradeCalculator from './GradeCalculator'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'German Grade Calculator — Convert Your Grades (Bavarian Formula) | GoGermany', d: 'Convert grades from Morocco, India, USA, UK, Turkey and more into the German 1.0–4.0 scale with the Modified Bavarian Formula that uni-assist uses.' },
  fr: { t: 'Convertisseur de notes allemandes — Formule bavaroise | GoGermany', d: 'Convertissez vos notes (Maroc 0–20, GPA, pourcentage…) vers l’échelle allemande 1,0–4,0 avec la formule bavaroise modifiée utilisée par uni-assist.' },
  ar: { t: 'حاسبة المعدل الألماني — حوّل معدلك (المعادلة البافارية) | GoGermany', d: 'حوّل معدلك من المغرب (0–20) أو أي نظام عالمي إلى السلم الألماني 1.0–4.0 بالمعادلة البافارية المعدلة التي تعتمدها uni-assist.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/german-grade-calculator',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

export default async function GradeCalculatorPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <GradeCalculator locale={locale} />
      <RelatedTools locale={locale} current="gradeConverter" />
    </>
  )
}
