'use client'

/**
 * Footer link that re-opens the cookie consent banner (CookieConsent
 * listens for the event). Lives in its own tiny client component so the
 * footer itself can stay a server component.
 */
export default function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('gg-cookie-settings'))}
      className="hover:text-[var(--brand)] transition-colors"
      style={{ font: 'inherit', color: 'inherit', textAlign: 'inherit', padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}
    >
      {label}
    </button>
  )
}
