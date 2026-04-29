import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import StaticPage, { Section, SectionText } from '@/components/StaticPage'
import type { AppLocale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: AppLocale }> }

// Per-locale meta — kept inline (rather than i18n keys) because launch-
// blocking SEO copy is short and rarely changes; a single edit here
// covers all 4 locales without touching 4 message files.
const META: Record<AppLocale, { title: string; desc: string }> = {
  ar: {
    title: 'حول GoGermany — رحلتك من المغرب إلى ألمانيا',
    desc: 'تعرّف على فريق GoGermany ومهمتنا: مساعدة المغاربة على الانتقال إلى ألمانيا للدراسة، التكوين المهني (Ausbildung) والعمل.',
  },
  fr: {
    title: 'À propos de GoGermany — votre passage Maroc → Allemagne',
    desc: "Découvrez l'équipe et la mission de GoGermany : aider les Marocains à s'installer en Allemagne pour les études, l'Ausbildung et le travail.",
  },
  en: {
    title: 'About GoGermany — your bridge from Morocco to Germany',
    desc: 'Meet the GoGermany team and mission: helping Moroccans move to Germany for studies, Ausbildung apprenticeships, and work.',
  },
  de: {
    title: 'Über GoGermany — Marokko → Deutschland',
    desc: 'Lerne das Team und die Mission von GoGermany kennen: Marokkaner beim Umzug nach Deutschland für Studium, Ausbildung und Arbeit unterstützen.',
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

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.about' })
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
        <div id="mission">
          <SectionText>{t('s4_b')}</SectionText>
        </div>
      </Section>
      <Section heading={t('s5_h')}>
        <SectionText>{t('s5_b')}</SectionText>
      </Section>
    </StaticPage>
  )
}
