import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import StaticPage, { Section, SectionText } from '@/components/StaticPage'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: Record<AppLocale, { title: string; desc: string }> = {
  ar: {
    title: 'تواصل مع GoGermany — استشارات وأسئلة',
    desc: 'تواصل مع فريق GoGermany. احجز استشارة فردية، اطرح أسئلتك حول الانتقال إلى ألمانيا، أو راسلنا على البريد الإلكتروني.',
  },
  fr: {
    title: 'Contacter GoGermany — questions et consultations',
    desc: "Contactez l'équipe GoGermany. Réservez une consultation 1-à-1, posez vos questions sur l'installation en Allemagne, ou écrivez-nous par email.",
  },
  en: {
    title: 'Contact GoGermany — questions and consultations',
    desc: 'Reach the GoGermany team. Book a 1-on-1 consultation, ask questions about moving to Germany, or send us an email.',
  },
  de: {
    title: 'GoGermany kontaktieren — Fragen und Beratungen',
    desc: 'Kontaktiere das GoGermany-Team. Buche eine 1-zu-1-Beratung, stelle Fragen zum Umzug nach Deutschland, oder schreib uns per E-Mail.',
  },
  es: {
    title: 'Contacta GoGermany — preguntas y consultas',
    desc: 'Contacta al equipo de GoGermany. Reserva una consulta individual, pregunta sobre cómo mudarte a Alemania, o escríbenos por email.',
  },
  tr: {
    title: "GoGermany'ye Ulaşın — sorular ve danışmanlık",
    desc: "GoGermany ekibiyle iletişime geçin. Bire bir danışmanlık rezervasyonu yapın, Almanya'ya taşınma hakkında sorular sorun veya e-posta gönderin.",
  },
  fa: {
    title: 'تماس با GoGermany — سوالات و مشاوره',
    desc: 'با تیم GoGermany در تماس باشید. یک مشاوره فردی رزرو کنید، سوالات خود درباره مهاجرت به آلمان را بپرسید یا ایمیل بزنید.',
  },
  pt: {
    title: 'Contacte GoGermany — perguntas e consultas',
    desc: 'Entre em contacto com a equipa GoGermany. Reserve uma consulta individual, tire dúvidas sobre como se mudar para a Alemanha, ou envie um email.',
  },
  ru: {
    title: 'Связаться с GoGermany — вопросы и консультации',
    desc: 'Свяжитесь с командой GoGermany. Забронируйте индивидуальную консультацию, задайте вопросы о переезде в Германию или напишите нам на email.',
  },
  hi: {
    title: 'GoGermany से संपर्क करें — प्रश्न और परामर्श',
    desc: 'GoGermany टीम से संपर्क करें। 1-on-1 परामर्श बुक करें, जर्मनी जाने के बारे में सवाल पूछें, या हमें ईमेल करें।',
  },
  ur: {
    title: 'GoGermany سے رابطہ کریں — سوالات اور مشاورت',
    desc: 'GoGermany ٹیم سے رابطہ کریں۔ 1-on-1 مشاورت بک کریں، جرمنی جانے کے بارے میں سوالات پوچھیں، یا ہمیں ای میل کریں۔',
  },
  nl: {
    title: 'Contact GoGermany — vragen en consultaties',
    desc: 'Neem contact op met het GoGermany-team. Boek een 1-op-1 consult, stel vragen over verhuizen naar Duitsland of stuur ons een e-mail.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.fr
  return buildLocaleMetadata({ locale, path: '/contact', title: m.title, description: m.desc })
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
