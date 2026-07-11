import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import AnerkennungWizard from './AnerkennungWizard'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Anerkennung Wizard — Degree Recognition in Germany | GoGermany', d: 'Which authority recognises your qualification in Germany? Free wizard: nurse, engineer, IT, teacher, trades — procedure, costs, timelines.' },
  fr: { t: 'Assistant Anerkennung — Reconnaissance de diplôme en Allemagne | GoGermany', d: 'Quelle autorité reconnaît votre diplôme en Allemagne ? Assistant gratuit : infirmier, ingénieur, IT, enseignant — procédure, coûts, délais.' },
  ar: { t: 'مساعد الاعتراف بالشهادات في ألمانيا | GoGermany', d: 'أي جهة تعترف بشهادتك في ألمانيا؟ مساعد مجاني: تمريض، هندسة، معلوميات، تعليم — الإجراء والتكاليف والمدة.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/anerkennung-wizard',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

export default async function AnerkennungPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <AnerkennungWizard locale={locale} />
      <RelatedTools locale={locale} current="anerkennung" />
    </>
  )
}
