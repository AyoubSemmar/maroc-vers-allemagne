'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const STORAGE_KEY = 'cookie-consent' // 'all' | 'essential'

/** Push a Google Consent Mode v2 update. gtag may not exist yet on very
 *  first paint — fall back to the dataLayer queue it reads from. */
function updateConsent(granted: boolean) {
  const value = granted ? 'granted' : 'denied'
  const consent = {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  }
  const w = window as any
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', consent)
  } else {
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push(['consent', 'update', consent])
  }
}

/**
 * Minimal GDPR/ePrivacy consent banner wired to Google Consent Mode v2.
 * The layout sets consent defaults to "denied" BEFORE gtag loads; this
 * banner records the visitor's choice and updates consent. Choice is
 * remembered in localStorage, so the banner shows only once per browser.
 */
export default function CookieConsent() {
  const t = useTranslations('cookies')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let stored: string | null = null
    try { stored = localStorage.getItem(STORAGE_KEY) } catch {}
    if (stored === 'all') updateConsent(true)
    else if (stored === 'essential') updateConsent(false)
    else setVisible(true)

    // The footer's "Cookie preferences" link re-opens the banner so users
    // can change their mind at any time (GDPR requirement).
    const reopen = () => setVisible(true)
    window.addEventListener('gg-cookie-settings', reopen)
    return () => window.removeEventListener('gg-cookie-settings', reopen)
  }, [])

  function choose(all: boolean) {
    try { localStorage.setItem(STORAGE_KEY, all ? 'all' : 'essential') } catch {}
    updateConsent(all)
    // Let consent-gated trackers that don't use Google Consent Mode (e.g. the
    // Meta Pixel) react to the choice without a page reload.
    try { window.dispatchEvent(new CustomEvent('gg-consent-updated', { detail: all })) } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookies"
      className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:end-4 sm:max-w-sm z-[70] rounded-2xl shadow-xl p-4"
      style={{ background: 'var(--bg-elev, #fff)', border: '1px solid var(--line, #e5e0d8)' }}
    >
      <p className="text-sm leading-relaxed" style={{ color: 'var(--ink, #1f2937)' }}>
        🍪 {t('text')}{' '}
        <Link href="/privacy-policy" className="underline font-semibold whitespace-nowrap">
          {t('more')}
        </Link>
      </p>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => choose(true)}
          className="flex-1 rounded-xl px-3 py-2 text-sm font-bold text-white bg-green-700 hover:bg-green-800 transition-colors"
        >
          {t('accept')}
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:opacity-80"
          style={{ border: '1px solid var(--line, #e5e0d8)', color: 'var(--ink-soft, #4b5563)' }}
        >
          {t('essential')}
        </button>
      </div>
    </div>
  )
}
