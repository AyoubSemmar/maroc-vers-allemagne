'use client'

import { useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { trackBookConsultation } from '@/lib/analytics'
import { CONSULTATIONS_ENABLED } from '@/lib/featureFlags'

// ── One consultation for everything ───────────────────────────────
// A SINGLE product: a 60-minute consultation, regardless of what the
// person wants to discuss. Every "Book a consultation" button across
// the site lands on the same Calendly event and shows the same price.
//
// The site is global, so we display EUR (€20 ≈ the original 200 MAD
// price point). priceMad is retained only as a reference for manual
// bank-transfer collection. The `topic` the user came from is still
// passed to Calendly (UTM + prefill) so the host knows what to prepare.
const CONSULTATION = {
  url: 'https://calendly.com/contact-gogermany/consultation',
  priceEur: 20,
  priceMad: 200,
  durationMin: 60,
} as const

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
 * The button always shows the single consultation price + duration
 * (200 MAD · 60 min). Labels come from the bookConsult i18n namespace
 * with {price}/{duration} placeholders so each locale renders its own
 * number+unit format.
 */
export default function BookConsultationButton({
  variant = 'primary',
  className = '',
  topic = 'general',
}: Props) {
  if (!CONSULTATIONS_ENABLED) return null
  const t = useTranslations('bookConsult')
  const rawLocale = useLocale()
  const locale: LocaleKey = (['en', 'fr', 'ar', 'de'] as const).includes(rawLocale as LocaleKey)
    ? (rawLocale as LocaleKey)
    : 'en'
  const label = TOPIC_LABEL[locale][topic]

  // Single Calendly event for every consultation. We still pass the
  // topic as a UTM + prefill answer so the host knows what to prepare,
  // but it doesn't change the event, price, or duration.
  const url = (() => {
    try {
      const u = new URL(CONSULTATION.url)
      u.searchParams.set('utm_source', 'gogermany.ma')
      u.searchParams.set('utm_campaign', topic)         // stable, language-agnostic
      u.searchParams.set('utm_content', TOPIC_LABEL.en[topic]) // English for analytics
      u.searchParams.set('a1', label)                   // localised prefill
      return u.toString()
    } catch {
      return CONSULTATION.url
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
      tier: 'consultation',
      priceEur: CONSULTATION.priceEur,
      durationMin: CONSULTATION.durationMin,
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
      <span className="bcb-price">{t('price', { price: CONSULTATION.priceEur, duration: CONSULTATION.durationMin })}</span>
    </button>
  )
}
