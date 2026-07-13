// Shared hero for every interactive tool — one consistent header style and
// palette (site-brand emerald) across all tools, on the public pages and in
// the dashboard. Strings are passed already-localized so it works with both
// the next-intl tools (t(...)) and the L3/pick3 tools.

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
    <header className="bg-[#f0fdf4] border-b border-green-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-green-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" aria-hidden />
          {eyebrow}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{title}</h1>
        {subtitle && <p className="mt-2 text-gray-600 max-w-2xl leading-relaxed">{subtitle}</p>}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {badges.map((b, i) => (
              <span key={i} className="bg-green-100 text-green-800 rounded-full px-3 py-1.5 text-xs font-bold">
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
