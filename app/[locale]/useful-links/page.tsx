import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import StaticPage, { Section, SectionText, SectionList } from '@/components/StaticPage'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: Record<AppLocale, { title: string; desc: string }> = {
  ar: {
    title: 'روابط مفيدة — مواقع رسمية للهجرة إلى ألمانيا',
    desc: 'قائمة بالمواقع الرسمية الألمانية الأساسية للهجرة من المغرب: الجامعات، الـ Ausbildung، التأشيرة، السكن، البنوك، تعلّم اللغة.',
  },
  fr: {
    title: 'Liens utiles — sites officiels Allemagne',
    desc: "Liste des sites officiels allemands essentiels pour migrer depuis le Maroc : universités, Ausbildung, visa, logement, banques, apprentissage de l'allemand.",
  },
  en: {
    title: 'Useful links — official German sites',
    desc: 'Curated list of essential official German sites for migrating from Morocco: universities, Ausbildung, visa, housing, banks, language learning.',
  },
  de: {
    title: 'Nützliche Links — offizielle deutsche Seiten',
    desc: 'Kuratierte Liste wichtiger offizieller deutscher Seiten für Migration aus Marokko: Universitäten, Ausbildung, Visum, Wohnen, Banken, Deutschlernen.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.fr
  return buildLocaleMetadata({ locale, path: '/useful-links', title: m.title, description: m.desc })
}

export default async function UsefulLinksPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.usefulLinks' })
  return (
    <StaticPage title={t('title')} subtitle={t('subtitle')}>
      <Section heading={t('s1_h')}>
        <SectionList items={[t('s1_i1'), t('s1_i2'), t('s1_i3'), t('s1_i4')]} />
      </Section>
      <Section heading={t('s2_h')}>
        <SectionList items={[t('s2_i1'), t('s2_i2'), t('s2_i3')]} />
      </Section>
      <Section heading={t('s3_h')}>
        <SectionList items={[t('s3_i1'), t('s3_i2'), t('s3_i3')]} />
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
