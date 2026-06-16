import { ImageResponse } from 'next/og'

// Open Graph image used as the default share preview for the entire site
// (WhatsApp, Facebook, LinkedIn, Slack, Twitter all read this when no
// per-page OG override exists). Rendered on demand via Vercel edge,
// cached aggressively.
//
// File-based convention: putting opengraph-image.tsx in /app makes Next.js
// auto-wire the OG meta tags on every route that doesn't override.
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

export const runtime = 'edge'
export const alt = 'GoGermany — Your guide to moving to Germany'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0E1A36',
          color: '#fff',
          fontFamily: 'sans-serif',
          padding: '64px 80px',
          position: 'relative',
        }}
      >
        {/* Brand glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at center, rgba(232,124,55,0.45), rgba(244,200,66,0.18) 50%, transparent 75%)',
          }}
        />

        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 22,
              background: 'linear-gradient(135deg, #F08A2E 0%, #F4C842 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 60,
              fontWeight: 900,
              color: '#fff',
              boxShadow: '0 18px 36px -12px rgba(232,124,55,0.6)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            G
            {/* German tricolor band at the bottom of the logo tile */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 12,
                display: 'flex',
              }}
            >
              <div style={{ flex: 1, background: '#000' }} />
              <div style={{ flex: 1, background: '#DD0000' }} />
              <div style={{ flex: 1, background: '#FFCE00' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em' }}>GoGermany</span>
            <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>
              gogermany.ma
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: 'flex' }} />

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#F4C842',
            }}
          >
            🌍 → 🇩🇪 · Your move to Germany
          </span>
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              color: '#fff',
              maxWidth: 940,
              display: 'flex',
            }}
          >
            Your guide to studying, training and working in Germany.
          </span>
          <span
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.45,
              maxWidth: 880,
              marginTop: 6,
            }}
          >
            For people moving from anywhere · Free articles, tools, German lessons + paid 1-on-1 consultations
          </span>
        </div>

        {/* Bottom German tricolor accent */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 8,
            display: 'flex',
          }}
        >
          <div style={{ flex: 1, background: '#000' }} />
          <div style={{ flex: 1, background: '#DD0000' }} />
          <div style={{ flex: 1, background: '#FFCE00' }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
