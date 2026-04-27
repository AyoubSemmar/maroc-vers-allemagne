'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/contact-gogermany/30min'

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

const TOPIC_LABEL: Record<ConsultTopic, string> = {
  'general':              'General consultation',
  'apply-for-me':         'Apply For Me service',
  'interview-prep':       'Interview prep / mock Vorstellungsgespräch',
  'migration-timeline':   'Migration timeline review',
  'document-checklist':   'Document checklist help',
  'eligibility':          'Eligibility check',
  'cv-anschreiben':       'CV / Anschreiben review',
  'studium':              'Studium (university) guidance',
  'ausbildung':           'Ausbildung guidance',
  'visa':                 'Visa appointment help',
  'german-tutoring':      'German tutoring (A1–B2)',
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
 * Price (€16) and "Book consultation" labels come from the bookConsult
 * i18n namespace.
 */
export default function BookConsultationButton({
  variant = 'primary',
  className = '',
  topic = 'general',
}: Props) {
  const t = useTranslations('bookConsult')

  // Compose Calendly URL with UTM params + a prefill "additional notes" line
  // so the host always sees which request the user is booking for, even when
  // multiple CTAs share the same event type.
  const url = (() => {
    try {
      const u = new URL(CALENDLY_URL)
      u.searchParams.set('utm_source', 'gogermany.ma')
      u.searchParams.set('utm_campaign', topic)
      u.searchParams.set('utm_content', TOPIC_LABEL[topic])
      // Pre-seed the "Notes" / first additional answer field with the topic.
      // Calendly accepts a1..aN to prefill custom questions in declared order.
      u.searchParams.set('a1', `Booking from: ${TOPIC_LABEL[topic]}`)
      return u.toString()
    } catch {
      return CALENDLY_URL
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
      <span className="bcb-price">{t('price')}</span>
    </button>
  )
}
