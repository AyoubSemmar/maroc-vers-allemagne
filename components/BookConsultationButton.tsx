'use client'

import { useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { trackBookConsultation } from '@/lib/analytics'

// ── Five Calendly events, each with its own duration + price ──────
// Maps to the events the user created in their upgraded Calendly:
//   /quick-check     15 min · €8   (eligibility / planning / docs)
//   /cv-interview    30 min · €16  (CV review or interview prep)
//   /path-planning   45 min · €25  (visa / Studium / Ausbildung deep dive)
//   /apply-for-me    60 min · €40  (flagship — full application package)
//   /german-tutoring 60 min · €30  (language lessons + exam prep)
// Payment is collected manually by bank transfer after booking; the
// confirmation email (configured in Calendly) carries the IBAN + the
// per-tier reference code so we can match wires to bookings.
const TIERS = {
  quick:  { url: 'https://calendly.com/contact-gogermany/quick-check',     priceEur:  8, durationMin: 15 },
  cv:     { url: 'https://calendly.com/contact-gogermany/cv-interview',    priceEur: 16, durationMin: 30 },
  path:   { url: 'https://calendly.com/contact-gogermany/path-planning',   priceEur: 25, durationMin: 45 },
  apply:  { url: 'https://calendly.com/contact-gogermany/apply-for-me',    priceEur: 40, durationMin: 60 },
  german: { url: 'https://calendly.com/contact-gogermany/german-tutoring', priceEur: 30, durationMin: 60 },
} as const
type TierKey = keyof typeof TIERS

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void }
  }
}

/**
 * Where the user is booking from. Surfaces inside Calendly's booking
 * record (utm_campaign + utm_content) and is also injected as the first
 * line of the prefill "additional notes" so the host immediately sees
 * the request type when accepting.
 */
export type ConsultTopic =
  | 'general'
  | 'apply-for-me'
  | 'interview-prep'
  | 'migration-timeline'
  | 'document-checklist'
  | 'eligibility'
  | 'cv-anschreiben'
  | 'studium'
  | 'ausbildung'
  | 'visa'
  | 'german-tutoring'
  | 'german-exam-prep'

// Each of the 12 site topics maps to one of the 5 Calendly events.
const TOPIC_TIER: Record<ConsultTopic, TierKey> = {
  'general':            'path',
  'apply-for-me':       'apply',
  'interview-prep':     'cv',
  'migration-timeline': 'quick',
  'document-checklist': 'quick',
  'eligibility':        'quick',
  'cv-anschreiben':     'cv',
  'studium':            'path',
  'ausbildung':         'path',
  'visa':               'path',
  'german-tutoring':    'german',
  'german-exam-prep':   'german',
}

type LocaleKey = 'en' | 'fr' | 'ar' | 'de'

/**
 * Localised label for the prefill answer in Calendly. Keep each label short —
 * it appears in the booking form's first text field exactly as written.
 */
const TOPIC_LABEL: Record<LocaleKey, Record<ConsultTopic, string>> = {
  en: {
    'general':            'General consultation',
    'apply-for-me':       'Apply For Me',
    'interview-prep':     'Interview Prep',
    'migration-timeline': 'Migration Timeline',
    'document-checklist': 'Document Checklist',
    'eligibility':        'Eligibility Check',
    'cv-anschreiben':     'CV / Anschreiben',
    'studium':            'Studium (University)',
    'ausbildung':         'Ausbildung',
    'visa':               'Visa',
    'german-tutoring':    'German Tutoring (A1–B2)',
    'german-exam-prep':   'Goethe / telc Exam Prep',
  },
  fr: {
    'general':            'Consultation générale',
    'apply-for-me':       'Postulez pour moi',
    'interview-prep':     'Préparation entretien',
    'migration-timeline': 'Timeline de migration',
    'document-checklist': 'Checklist documents',
    'eligibility':        'Test d’éligibilité',
    'cv-anschreiben':     'CV / Lettre de motivation',
    'studium':            'Studium (université)',
    'ausbildung':         'Ausbildung',
    'visa':               'Visa',
    'german-tutoring':    'Cours d’allemand (A1–B2)',
    'german-exam-prep':   'Préparation Goethe / telc',
  },
  ar: {
    'general':            'استشارة عامة',
    'apply-for-me':       'قدّم نيابة عني',
    'interview-prep':     'تحضير المقابلة',
    'migration-timeline': 'الجدول الزمني للهجرة',
    'document-checklist': 'لائحة الوثائق',
    'eligibility':        'فحص الأهلية',
    'cv-anschreiben':     'السيرة الذاتية / رسالة التحفيز',
    'studium':            'الدراسة الجامعية',
    'ausbildung':         'التكوين المهني (Ausbildung)',
    'visa':               'التأشيرة',
    'german-tutoring':    'دروس الألمانية (A1–B2)',
    'german-exam-prep':   'تحضير امتحان Goethe / telc',
  },
  de: {
    'general':            'Allgemeine Beratung',
    'apply-for-me':       'Für mich bewerben',
    'interview-prep':     'Interview-Vorbereitung',
    'migration-timeline': 'Migrations-Timeline',
    'document-checklist': 'Dokumenten-Checkliste',
    'eligibility':        'Eignungsprüfung',
    'cv-anschreiben':     'Lebenslauf / Anschreiben',
    'studium':            'Studium (Universität)',
    'ausbildung':         'Ausbildung',
    'visa':               'Visum',
    'german-tutoring':    'Deutsch-Nachhilfe (A1–B2)',
    'german-exam-prep':   'Goethe / telc Prüfungsvorbereitung',
  },
}

type Props = {
  /** "primary" = filled brand button, "ghost" = outlined. */
  variant?: 'primary' | 'ghost' | 'on-cta'
  className?: string
  /** Identifies which CTA / page the user came from. Surfaces in Calendly. */
  topic?: ConsultTopic
}

/**
 * Opens Calendly's popup widget on click. Loads the Calendly script
 * lazily on first render so it doesn't block initial paint elsewhere.
 *
 * The button shows the price + duration of the tier the topic maps to
 * (€8/15min, €16/30min, €25/45min, €30/60min, or €40/60min). Labels
 * come from the bookConsult i18n namespace with {price}/{duration}
 * placeholders so each locale renders its own number+unit format.
 */
export default function BookConsultationButton({
  variant = 'primary',
  className = '',
  topic = 'general',
}: Props) {
  const t = useTranslations('bookConsult')
  const rawLocale = useLocale()
  const locale: LocaleKey = (['en', 'fr', 'ar', 'de'] as const).includes(rawLocale as LocaleKey)
    ? (rawLocale as LocaleKey)
    : 'en'
  const label = TOPIC_LABEL[locale][topic]
  const tier = TIERS[TOPIC_TIER[topic] ?? 'path']

  // Compose Calendly URL with UTM params + a prefill answer for the first
  // intake question, so the host immediately sees which service the user
  // is booking for. The label is in the user's site language.
  const url = (() => {
    try {
      const u = new URL(tier.url)
      u.searchParams.set('utm_source', 'gogermany.ma')
      u.searchParams.set('utm_campaign', topic)         // stable, language-agnostic
      u.searchParams.set('utm_content', TOPIC_LABEL.en[topic]) // English for analytics
      u.searchParams.set('a1', label)                   // localised prefill
      return u.toString()
    } catch {
      return tier.url
    }
  })()

  useEffect(() => {
    // Inject Calendly's stylesheet + script once per page.
    if (typeof document === 'undefined') return
    if (!document.getElementById('calendly-css')) {
      const link = document.createElement('link')
      link.id = 'calendly-css'
      link.rel = 'stylesheet'
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      document.head.appendChild(link)
    }
    if (!document.getElementById('calendly-js')) {
      const s = document.createElement('script')
      s.id = 'calendly-js'
      s.src = 'https://assets.calendly.com/assets/external/widget.js'
      s.async = true
      document.body.appendChild(s)
    }
  }, [])

  function open(e: React.MouseEvent) {
    e.preventDefault()
    if (typeof window === 'undefined') return
    // Fire the GA4 conversion event BEFORE opening the popup. We track
    // the click intent — actual booking completion is in Calendly's own
    // analytics. value:priceEur lets GA4 compute revenue if you ever
    // mark this as a purchase-style conversion.
    trackBookConsultation({
      topic,
      tier: TOPIC_TIER[topic] ?? 'path',
      priceEur: tier.priceEur,
      durationMin: tier.durationMin,
      locale,
    })
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url })
    } else {
      // Fallback if the script hasn't loaded yet (cold first-click): open in new tab.
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const cls = `bcb bcb--${variant} ${className}`.trim()
  return (
    <button type="button" onClick={open} className={cls}>
      <span className="bcb-label">{t('cta')}</span>
      <span className="bcb-price">{t('price', { price: tier.priceEur, duration: tier.durationMin })}</span>
    </button>
  )
}
