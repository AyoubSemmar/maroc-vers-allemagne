// Fire a Meta Pixel standard event. Safe to call anywhere: it no-ops unless
// the pixel has actually loaded, which only happens in production after the
// visitor accepted cookies (see components/analytics/MetaPixel.tsx). So these
// calls stay consent-respecting and never throw in dev / on the server.
export function trackMeta(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  const fbq = (window as { fbq?: (...a: unknown[]) => void }).fbq
  if (typeof fbq === 'function') fbq('track', event, params)
}
