'use client'

import { useEffect } from 'react'
import { Link } from '@/i18n/navigation'

// `error.tsx` is a client component — it catches runtime errors from
// any nested route segment and gives the user a way out instead of the
// default Next.js error overlay.
//
// We intentionally don't try to localize this page from the i18n
// system because the error itself might be a next-intl failure. Plain
// English fallback + a back-to-home link is good enough.

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the error to whatever logging is in place.
    console.error('[error.tsx]', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'grid',
        placeItems: 'center',
        padding: '64px 20px',
        background: 'var(--bg)',
        color: 'var(--ink)',
      }}
    >
      <div style={{ maxWidth: 560, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
        <div
          aria-hidden
          style={{
            width: 88, height: 88,
            borderRadius: 22,
            background: 'color-mix(in srgb, oklch(0.55 0.20 25) 14%, var(--bg-warm))',
            display: 'grid', placeItems: 'center',
            fontSize: 38,
            border: '1.5px solid color-mix(in srgb, oklch(0.55 0.20 25) 35%, var(--line))',
          }}
        >
          ⚠️
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: 'var(--ink)' }}>
          Something went wrong
        </h1>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: 480 }}>
          We hit an unexpected error. You can try again, or head back to the homepage.
          {error?.digest && (
            <>
              <br />
              <small style={{ color: 'var(--ink-mute)', fontFamily: 'monospace', fontSize: 11 }}>ref: {error.digest}</small>
            </>
          )}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <button
            type="button"
            onClick={reset}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px',
              background: 'var(--brand)',
              color: '#fff',
              border: 0,
              borderRadius: 999,
              fontSize: 14, fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ↻ Try again
          </button>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px',
              background: 'var(--bg-elev)',
              color: 'var(--ink)',
              border: '1.5px solid var(--line)',
              borderRadius: 999,
              fontSize: 14, fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
