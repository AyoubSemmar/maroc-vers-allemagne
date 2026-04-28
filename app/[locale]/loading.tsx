// Locale-level loading boundary. Shown for any route under /[locale]/**
// while a server component is fetching. Default Next.js shows a blank
// page during slow Supabase queries — this gives instant feedback.

export default function LocaleLoading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        padding: '64px 20px',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div
          aria-hidden
          style={{
            width: 56, height: 56,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #F08A2E, #F4C842)',
            display: 'grid', placeItems: 'center',
            color: '#fff', fontSize: 24, fontWeight: 900,
            boxShadow: '0 12px 28px -10px rgba(232,124,55,0.45)',
            animation: 'gg-pulse 1.4s ease-in-out infinite',
          }}
        >
          G
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: 'var(--ink-mute, #888)',
            textTransform: 'uppercase',
          }}
        >
          Loading…
        </span>
        <style>{`
          @keyframes gg-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50%      { transform: scale(0.92); opacity: 0.75; }
          }
        `}</style>
      </div>
    </div>
  )
}
