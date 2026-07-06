import AdSlot from './AdSlot'
import { ADS_CONFIGURED } from './config'

// Show the rail only when there's an ad unit to put in it (see ./config), or
// we're in development so placements are visible while building. This just
// avoids an empty 300px column when no ad units are configured.
const SHOW_RAIL = ADS_CONFIGURED || process.env.NODE_ENV !== 'production'

/**
 * Page wrapper that adds a sticky ad rail on the side (desktop) and a single
 * in-content unit on mobile, where there's no room for a sidebar. Drop it
 * around a page's main content — it keeps the content in a `min-w-0` column so
 * existing layouts don't overflow, and the rail is purely additive.
 *
 * RTL-safe: the grid column order follows the document `dir`, so the rail sits
 * on the correct side for ar/fa/ur automatically.
 */
export default function AdRail({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  if (!SHOW_RAIL) {
    // Ads off (production, not yet approved): no rail, content centred as usual.
    return <div className={`mx-auto max-w-5xl px-4 ${className}`}>{children}</div>
  }

  return (
    <div
      className={`mx-auto max-w-6xl px-4 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8 ${className}`}
    >
      <div className="min-w-0">
        {children}
        {/* Mobile / narrow screens: one in-content unit (the rail is hidden). */}
        <AdSlot format="in-article" className="mt-8 lg:hidden" />
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <AdSlot format="vertical" />
        </div>
      </aside>
    </div>
  )
}
