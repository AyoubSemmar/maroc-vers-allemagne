'use client'

import { useEffect } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

// Fire-and-forget first-party pageview tracking. usePathname() from
// @/i18n/navigation is already locale-stripped, so paths aggregate across
// languages; the locale is sent separately. No cookies, no IDs, no IP.
const SKIP = /^\/(console-x7k9|dashboard|studybuddy|auth)/

export default function AnalyticsBeacon() {
  const pathname = usePathname()
  const locale = useLocale()

  useEffect(() => {
    if (!pathname || SKIP.test(pathname)) return
    let ref: string | null = null
    try {
      ref = document.referrer ? new URL(document.referrer).hostname : null
      if (ref && ref === location.hostname) ref = null // internal navigation
    } catch {}
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pageview', path: pathname, locale, ref }),
        keepalive: true,
      }).catch(() => {})
    } catch {}
  }, [pathname, locale])

  return null
}
