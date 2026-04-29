import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import StaticPage, { Section, SectionText, SectionList } from '@/components/StaticPage'
import type { AppLocale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: Record<AppLocale, { title: string; desc: string }> = {
  ar: {
    title: 'السكن في ألمانيا — دليل البحث عن شقة',
    desc: 'كيف تجد سكناً في ألمانيا: مواقع البحث، الأوراق المطلوبة، WG vs استوديو، الإيجارات الشهرية الواقعية لكل مدينة، والأخطاء الشائعة.',
  },
  fr: {
    title: 'Logement en Allemagne — guide pratique',
    desc: "Comment trouver un logement en Allemagne : sites de recherche, documents nécessaires, WG vs studio, loyers mensuels réalistes par ville, et pièges fréquents.",
  },
  en: {
    title: 'Housing in Germany — practical guide',
    desc: 'How to find housing in Germany: search sites, required documents, WG vs studio, realistic monthly rents per city, and common pitfalls.',
  },
  de: {
    title: 'Wohnen in Deutschland — praktischer Guide',
    desc: 'Wie findest du eine Wohnung in Deutschland: Suchportale, benötigte Unterlagen, WG vs Studio, realistische Mieten pro Stadt, häufige Fallen.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.fr
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc },
    twitter: { title: m.title, description: m.desc },
  }
}

export default async function HousingPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.housing' })
  return (
    <StaticPage title={t('title')} subtitle={t('subtitle')}>
      <Section heading={t('s1_h')}>
        <SectionList items={[t('s1_i1'), t('s1_i2'), t('s1_i3')]} />
      </Section>
      <Section heading={t('s2_h')}>
        <SectionText>{t('s2_b')}</SectionText>
      </Section>
      <Section heading={t('s3_h')}>
        <SectionList items={[t('s3_i1'), t('s3_i2'), t('s3_i3'), t('s3_i4')]} />
      </Section>
      <Section heading={t('s4_h')}>
        <SectionList items={[t('s4_i1'), t('s4_i2'), t('s4_i3'), t('s4_i4')]} />
      </Section>
      <Section heading={t('s5_h')}>
        <SectionList items={[t('s5_i1'), t('s5_i2'), t('s5_i3')]} />
      </Section>
      <Section heading={t('s6_h')}>
        <SectionText>{t('s6_b')}</SectionText>
      </Section>
    </StaticPage>
  )
}
