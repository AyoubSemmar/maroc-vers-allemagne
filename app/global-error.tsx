'use client'

// Last-resort boundary. Catches errors that bubble past the locale
// error.tsx — typically from the root layout or i18n provider itself.
// Must render its own <html> + <body> because the root layout failed.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '64px 20px',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          background: '#fdf8f3',
          color: '#1a1a1a',
        }}
      >
        <div style={{ maxWidth: 520, textAlign: 'center' }}>
          <div
            aria-hidden
            style={{
              width: 72, height: 72,
              margin: '0 auto 18px',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #F08A2E, #F4C842)',
              display: 'grid', placeItems: 'center',
              color: '#fff', fontSize: 30, fontWeight: 900,
              boxShadow: '0 12px 28px -10px rgba(232,124,55,0.4)',
            }}
          >
            G
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 10px' }}>
            GoGermany — fatal error
          </h1>
          <p style={{ margin: '0 0 22px', color: '#555', fontSize: 15.5, lineHeight: 1.6 }}>
            The site couldn&apos;t load. This is rare — try reloading the page or going back home.
          </p>
          {error?.digest && (
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#999', marginBottom: 22 }}>
              ref: {error.digest}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                padding: '12px 22px',
                background: '#E27940', color: '#fff', border: 0,
                borderRadius: 999, fontSize: 14, fontWeight: 800, cursor: 'pointer',
              }}
            >
              ↻ Try again
            </button>
            <a
              href="/"
              style={{
                padding: '12px 22px',
                background: '#fff',
                color: '#1a1a1a',
                border: '1.5px solid #e5e0d8',
                borderRadius: 999,
                fontSize: 14, fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              ← Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
