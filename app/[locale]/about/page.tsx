import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import StaticPage, { Section, SectionText } from '@/components/StaticPage'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

type Props = { params: Promise<{ locale: AppLocale }> }

// Per-locale meta — kept inline (rather than i18n keys) because launch-
// blocking SEO copy is short and rarely changes; a single edit here
// covers all 4 locales without touching 4 message files.
const META: Record<AppLocale, { title: string; desc: string }> = {
  ar: {
    title: 'حول GoGermany — طريقك إلى ألمانيا',
    desc: 'تعرّف على فريق GoGermany ومهمتنا: مساعدة الناس من كل العالم على الانتقال إلى ألمانيا للدراسة، التكوين المهني (Ausbildung) والعمل.',
  },
  fr: {
    title: 'À propos de GoGermany — votre passage vers l’Allemagne',
    desc: "Découvrez l'équipe et la mission de GoGermany : aider les internationaux à s'installer en Allemagne pour les études, l'Ausbildung et le travail.",
  },
  en: {
    title: 'About GoGermany — your bridge to Germany',
    desc: 'Meet the GoGermany team and mission: helping people from anywhere move to Germany for studies, Ausbildung apprenticeships, and work.',
  },
  de: {
    title: 'Über GoGermany — Dein Weg nach Deutschland',
    desc: 'Lerne das Team und die Mission von GoGermany kennen: Menschen beim Umzug nach Deutschland für Studium, Ausbildung und Arbeit unterstützen.',
  },
  es: {
    title: 'Sobre GoGermany — tu puente hacia Alemania',
    desc: 'Conoce al equipo y la misión de GoGermany: ayudar a personas de cualquier país a mudarse a Alemania para estudiar, hacer Ausbildung o trabajar.',
  },
  tr: {
    title: "GoGermany Hakkında — Almanya'ya köprünüz",
    desc: "GoGermany ekibini ve misyonunu tanıyın: dünyanın her yerinden insanların Almanya'ya taşınmasına yardımcı olmak — eğitim, Ausbildung ve iş için.",
  },
  fa: {
    title: 'درباره GoGermany — پل شما به آلمان',
    desc: 'با تیم و ماموریت GoGermany آشنا شوید: کمک به افراد از سراسر جهان برای مهاجرت به آلمان جهت تحصیل، Ausbildung و کار.',
  },
  pt: {
    title: 'Sobre GoGermany — sua ponte para a Alemanha',
    desc: 'Conheça a equipa e a missão da GoGermany: ajudar pessoas de qualquer país a se mudarem para a Alemanha para estudar, fazer Ausbildung ou trabalhar.',
  },
  ru: {
    title: 'О GoGermany — ваш мост в Германию',
    desc: 'Познакомьтесь с командой и миссией GoGermany: помощь людям со всего мира в переезде в Германию для учёбы, Ausbildung и работы.',
  },
  hi: {
    title: 'GoGermany के बारे में — जर्मनी का आपका पुल',
    desc: 'GoGermany की टीम और मिशन से मिलें: दुनिया भर के लोगों को जर्मनी में पढ़ाई, Ausbildung और काम के लिए जाने में मदद।',
  },
  ur: {
    title: 'GoGermany کے بارے میں — جرمنی کا آپ کا پُل',
    desc: 'GoGermany کی ٹیم اور مشن سے ملیں: دنیا بھر کے لوگوں کو جرمنی میں تعلیم، Ausbildung اور کام کے لیے جانے میں مدد۔',
  },
  nl: {
    title: 'Over GoGermany — uw brug naar Duitsland',
    desc: 'Maak kennis met het GoGermany-team en onze missie: mensen van over de hele wereld helpen naar Duitsland te verhuizen voor studie, Ausbildung en werk.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.fr
  return buildLocaleMetadata({ locale, path: '/about', title: m.title, description: m.desc })
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
