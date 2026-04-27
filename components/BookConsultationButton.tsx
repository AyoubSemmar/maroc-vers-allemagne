'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/gogermany/consultation'

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void }
  }
}

type Props = {
  /** "primary" = filled brand button, "ghost" = outlined. */
  variant?: 'primary' | 'ghost' | 'on-cta'
  className?: string
}

/**
 * Opens Calendly's popup widget on click. Loads the Calendly script
 * lazily on first render so it doesn't block initial paint elsewhere.
 *
 * Price (€16) and "Book consultation" labels come from the bookConsult
 * i18n namespace.
 */
export default function BookConsultationButton({ variant = 'primary', className = '' }: Props) {
  const t = useTranslations('bookConsult')

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
      window.Calendly.initPopupWidget({ url: CALENDLY_URL })
    } else {
      // Fallback if the script hasn't loaded yet (cold first-click): open in new tab.
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')
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
