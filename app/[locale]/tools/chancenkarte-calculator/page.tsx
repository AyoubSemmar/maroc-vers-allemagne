import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import ChancenkarteCalculator from './ChancenkarteCalculator'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Chancenkarte Points Calculator 2026 — Check Your Score | GoGermany', d: 'Free Opportunity Card calculator: check in 1 minute if you reach the 6 points for Germany’s Chancenkarte — qualification, language, age, experience.' },
  fr: { t: 'Calculateur de points Chancenkarte 2026 — Testez votre score | GoGermany', d: 'Calculateur gratuit de la carte d’opportunité : vérifiez en 1 minute si vous atteignez les 6 points de la Chancenkarte allemande.' },
  ar: { t: 'حاسبة نقاط بطاقة الفرص الألمانية 2026 | GoGermany', d: 'حاسبة مجانية لبطاقة الفرص: تحقق في دقيقة واحدة هل تصل إلى 6 نقاط — الشهادة، اللغة، العمر، الخبرة.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/chancenkarte-calculator',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

export default async function ChancenkartePage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <ChancenkarteCalculator locale={locale} />
      <RelatedTools locale={locale} current="chancenkarte" />
    </>
  )
}
