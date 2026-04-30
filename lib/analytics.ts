/**
 * Thin wrapper around the Google Analytics 4 `gtag` global.
 *
 * Why a wrapper:
 *   - Calling `gtag` directly only works after @next/third-parties has
 *     injected the script (production only, post-hydration). The wrapper
 *     no-ops everywhere else (SSR, dev, ad-blockers) instead of crashing.
 *   - One place to change if we ever swap providers (Plausible, PostHog…).
 *   - Keeps every conversion-event name in one file so we don't end up
 *     with `book` / `book_consultation` / `consultation_clicked` typos
 *     scattered across the codebase.
 *
 * Naming convention: snake_case, ≤40 chars, descriptive verb_noun pairs.
 * GA4 ingests these as-is and we mark them as Conversions in the GA4
 * Admin → Events screen (toggle the star icon next to the event name).
 */

type GtagFn = (
  command: 'event',
  eventName: string,
  params?: Record<string, unknown>,
) => void

declare global {
  interface Window {
    gtag?: GtagFn
    dataLayer?: unknown[]
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {})
    }
  } catch {
    /* ad-blockers / privacy extensions throw — silently ignore */
  }
}

// ── Conversion events ───────────────────────────────────────────
// These are the four user actions that matter as conversions.
// Mark each one as a "Key Event" in GA4 Admin → Events the first
// time it shows up in the Events report (usually within 24h).

export function trackSignup(method: 'email' | 'google' = 'email') {
  trackEvent('sign_up', { method })
}

export function trackLogin(method: 'email' | 'google' = 'email') {
  trackEvent('login', { method })
}

export function trackBookConsultation(params: {
  topic: string         // e.g. 'visa', 'apply-for-me'
  tier: string          // e.g. 'path', 'apply'
  priceEur: number
  durationMin: number
  locale: string
}) {
  trackEvent('book_consultation', {
    topic: params.topic,
    tier: params.tier,
    value: params.priceEur,
    currency: 'EUR',
    duration_min: params.durationMin,
    locale: params.locale,
  })
}

export function trackWhatsappClick(source: string) {
  // `source` says where on the site the click came from — sidebar,
  // listing, contact page, etc. Lets us tell which surfaces drive
  // outreach without a separate event per location.
  trackEvent('whatsapp_click', { source })
}
