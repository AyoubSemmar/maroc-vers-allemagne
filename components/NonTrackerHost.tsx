'use client'

import { useEffect, useState } from 'react'

// Hosts that serve ONLY the internal StudyBuddy tracker — mirror proxy.ts.
const STUDYBUDDY_HOSTS = new Set<string>(['studybuddy-sprinttracker.vercel.app'])

function isTrackerHost(): boolean {
  try {
    return STUDYBUDDY_HOSTS.has(window.location.hostname.toLowerCase())
  } catch {
    return false
  }
}

/**
 * Renders its children on the real marketing site but NOT on the internal
 * StudyBuddy tracker host. This replaces the old server-side Host-header check
 * in the [locale] layout — reading headers() there forced the ENTIRE site into
 * dynamic rendering (0% CDN cache → slow + costly). Detecting the tracker host
 * client-side via `window.location.hostname` keeps the layout static/cacheable.
 *
 * `deferred`:
 *  - false (default): render children immediately (server + first paint), and
 *    only hide after mount if we turn out to be on the tracker host. Use for
 *    visible chrome (nav/footer) — no flash on the real site; a brief
 *    flash-then-hide on the internal tracker is acceptable.
 *  - true: render nothing until mount confirms we're NOT on the tracker host.
 *    Use for analytics/tracking so they never fire on the tracker at all (they
 *    init on mount anyway, so a one-tick delay on the real site is harmless).
 */
export default function NonTrackerHost({
  children,
  deferred = false,
}: {
  children: React.ReactNode
  deferred?: boolean
}) {
  const [hidden, setHidden] = useState(deferred)
  useEffect(() => {
    setHidden(isTrackerHost())
  }, [])
  return hidden ? null : <>{children}</>
}
