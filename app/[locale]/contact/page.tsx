import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import StaticPage, { Section, SectionText } from '@/components/StaticPage'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: Partial<Record<AppLocale, { title: string; desc: string }>> = {
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
  zh: {
    title: '联系 GoGermany — 咨询与问题解答',
    desc: '联系 GoGermany 团队：预约一对一咨询、提出有关移居德国的问题，或给我们发送电子邮件。',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.fr!
  return buildLocaleMetadata({ locale, path: '/contact', title: m.title, description: m.desc })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.contact' })
  const sections = (t.raw('sections') as { h: string; b: string }[]) ?? []
  return (
    <StaticPage title={t('title')} subtitle={t('subtitle')}>
      {/* Direct contact methods — real, clickable channels up top. */}
      <div className="contact-methods">
        <a href="mailto:contact@gogermany.ma" className="contact-method">
          <span className="contact-method-icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 6 10-6" />
            </svg>
          </span>
          <span className="contact-method-label">E-mail</span>
          <span className="contact-method-value">contact@gogermany.ma</span>
        </a>
        <a href="https://wa.me/491771903108" target="_blank" rel="noopener noreferrer" className="contact-method">
          <span className="contact-method-icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 14.3c-.3-.2-1.7-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.2-.2.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5.2 4.5 1.8.7 2.5.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3zM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
            </svg>
          </span>
          <span className="contact-method-label">WhatsApp</span>
          <span className="contact-method-value">+49 177 190 31 08</span>
        </a>
        <a href="https://www.instagram.com/gogermany.ma" target="_blank" rel="noopener noreferrer" className="contact-method">
          <span className="contact-method-icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="contact-method-label">Instagram</span>
          <span className="contact-method-value">@gogermany.ma</span>
        </a>
      </div>

      {sections.map((s, i) => (
        <Section key={i} heading={s.h}>
          <SectionText>{s.b}</SectionText>
        </Section>
      ))}
    </StaticPage>
  )
}
