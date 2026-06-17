import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import StaticPage, { Section, SectionText } from '@/components/StaticPage'
import type { AppLocale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: Record<AppLocale, { title: string; desc: string }> = {
  ar: {
    title: 'تواصل مع GoGermany',
    desc: 'تواصل مع فريق GoGermany. اطرح أسئلتك حول الانتقال إلى ألمانيا، أو راسلنا على البريد الإلكتروني.',
  },
  fr: {
    title: 'Contacter GoGermany',
    desc: "Contactez l'équipe GoGermany. Posez vos questions sur l'installation en Allemagne, ou écrivez-nous par email.",
  },
  en: {
    title: 'Contact GoGermany',
    desc: 'Reach the GoGermany team. Ask questions about moving to Germany, or send us an email.',
  },
  de: {
    title: 'GoGermany kontaktieren',
    desc: 'Kontaktiere das GoGermany-Team. Stelle Fragen zum Umzug nach Deutschland, oder schreib uns per E-Mail.',
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

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.contact' })
  return (
    <StaticPage title={t('title')} subtitle={t('subtitle')}>
      <Section heading={t('s1_h')}>
        <SectionText>{t('s1_b')}</SectionText>
      </Section>
      <Section heading={t('s2_h')}>
        <SectionText>{t('s2_b')}</SectionText>
      </Section>
      <Section heading={t('s3_h')}>
        <SectionText>{t('s3_b')}</SectionText>
      </Section>
      <Section heading={t('s4_h')}>
        <SectionText>{t('s4_b')}</SectionText>
      </Section>
      <Section heading={t('s5_h')}>
        <SectionText>{t('s5_b')}</SectionText>
      </Section>
    </StaticPage>
  )
}
