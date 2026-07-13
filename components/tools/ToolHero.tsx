// Shared hero for every interactive tool — one consistent header style and
// palette across all tools, on the public pages and in the dashboard. Uses
// the site's warm cream theme (var(--bg-warm) band, terracotta accent), the
// same look as the original tool pages. Theme-aware (cream light / navy dark).
// Strings are passed already-localized so it works with both the next-intl
// tools (t(...)) and the L3/pick3 tools.

export type ToolBadge = { icon: string; label: string }

export default function ToolHero({
  eyebrow,
  title,
  subtitle,
  badges,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  badges?: ToolBadge[]
}) {
  return (
    <header style={{ background: 'var(--bg-warm)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <span
          className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em]"
          style={{ color: 'var(--brand)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand)' }} aria-hidden />
          {eyebrow}
        </span>
        <h1 className="text-3xl font-bold mt-2" style={{ color: 'var(--ink)' }}>{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{subtitle}</p>
        )}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {badges.map((b, i) => (
              <span
                key={i}
                className="rounded-full px-3 py-1.5 text-xs font-bold"
                style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              >
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
