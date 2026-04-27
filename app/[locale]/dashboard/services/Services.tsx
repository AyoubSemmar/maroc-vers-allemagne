'use client'

import { useTranslations } from 'next-intl'
import { dirFor, type AppLocale } from '@/i18n/routing'
import BookConsultationButton, {
  type ConsultTopic,
} from '@/components/BookConsultationButton'
import './services.css'

type ServiceDef = {
  topic: ConsultTopic
  /** Emoji shown in the card header. */
  icon: string
  /** Number of bullet points pulled from i18n (services.<topic>.bulletN). */
  bulletCount: number
  /** Optional accent class for visual variation. */
  accent: 'brand' | 'sky' | 'mint' | 'gold' | 'berry' | 'violet'
  /** Optional ribbon (e.g. "Most booked"). i18n key under services.<topic>.ribbon */
  ribbon?: boolean
}

const SERVICES: ServiceDef[] = [
  { topic: 'apply-for-me',       icon: '✨', bulletCount: 3, accent: 'brand',  ribbon: true },
  { topic: 'interview-prep',     icon: '🎙️', bulletCount: 3, accent: 'berry' },
  { topic: 'cv-anschreiben',     icon: '📝', bulletCount: 3, accent: 'sky' },
  { topic: 'eligibility',        icon: '✅', bulletCount: 3, accent: 'mint' },
  { topic: 'migration-timeline', icon: '🗺️', bulletCount: 3, accent: 'gold' },
  { topic: 'document-checklist', icon: '📋', bulletCount: 3, accent: 'violet' },
  { topic: 'studium',            icon: '🎓', bulletCount: 3, accent: 'sky' },
  { topic: 'ausbildung',         icon: '🛠️', bulletCount: 3, accent: 'mint' },
  { topic: 'visa',               icon: '🛂', bulletCount: 3, accent: 'berry' },
  { topic: 'german-tutoring',    icon: '🇩🇪', bulletCount: 3, accent: 'gold' },
  { topic: 'general',            icon: '💬', bulletCount: 3, accent: 'brand' },
]

export default function Services({ locale }: { locale: AppLocale }) {
  const t = useTranslations('dashboardServices')
  const dir = dirFor(locale)

  return (
    <div className="svc-root" dir={dir}>
      <header className="svc-hero">
        <div className="wrap">
          <span className="svc-eyebrow">
            <span className="svc-eyebrow-dot" />
            {t('eyebrow')}
          </span>
          <h1 className="svc-title">{t('title')}</h1>
          <p className="svc-subtitle">{t('subtitle')}</p>
          <div className="svc-hero-badges">
            <span className="svc-hero-badge">💶 {t('badgePrice')}</span>
            <span className="svc-hero-badge">🎯 {t('badgeFormat')}</span>
            <span className="svc-hero-badge">🇲🇦↔🇩🇪 {t('badgeLanguages')}</span>
          </div>
        </div>
      </header>

      <div className="svc-body wrap">
        <div className="svc-grid">
          {SERVICES.map(s => (
            <ServiceCard key={s.topic} def={s} t={t} />
          ))}
        </div>

        <section id="svc-faq" className="svc-faq">
          <h2 className="svc-faq-title">{t('faqTitle')}</h2>
          <div className="svc-faq-list">
            <FaqItem q={t('faq1Q')} a={t('faq1A')} />
            <FaqItem q={t('faq2Q')} a={t('faq2A')} />
            <FaqItem q={t('faq3Q')} a={t('faq3A')} />
            <FaqItem q={t('faq4Q')} a={t('faq4A')} />
          </div>
        </section>
      </div>
    </div>
  )
}

function ServiceCard({
  def,
  t,
}: {
  def: ServiceDef
  t: ReturnType<typeof useTranslations>
}) {
  const k = (suffix: string) => `services.${def.topic}.${suffix}` as any
  const bullets = Array.from({ length: def.bulletCount }, (_, i) =>
    t(k(`bullet${i + 1}`))
  )

  return (
    <article className={`svc-card svc-card--${def.accent}`}>
      {def.ribbon && <span className="svc-ribbon">{t(k('ribbon'))}</span>}
      <div className="svc-card-icon" aria-hidden>
        {def.icon}
      </div>
      <h3 className="svc-card-title">{t(k('name'))}</h3>
      <p className="svc-card-blurb">{t(k('blurb'))}</p>
      <ul className="svc-card-list">
        {bullets.map((b, i) => (
          <li key={i}>
            <span className="svc-card-check" aria-hidden>
              ✓
            </span>
            {b}
          </li>
        ))}
      </ul>
      <div className="svc-card-cta">
        <BookConsultationButton variant="primary" topic={def.topic} />
      </div>
    </article>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="svc-faq-item">
      <summary>{q}</summary>
      <p>{a}</p>
    </details>
  )
}
