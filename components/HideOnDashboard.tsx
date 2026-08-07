'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// The dashboard provides its own shell (sidebar + topbar) and hides the
// global site chrome (announcement banner, RihlaNav, RihlaFooter).
// /studybuddy is an internal team-only page with its own design; it
// shouldn't carry the public site chrome either. /console-x7k9 (admin) has
// its own AdminShell, so the public nav/footer must not wrap it.
// /learn-german/classroom is a full-bleed h-[100dvh] split view with its own
// slim header — the site navbar on top of it pushed the video call's controls
// below the fold and duplicated the nav already carried by the lesson iframe.
// `usePathname` from next/navigation includes the locale prefix.
const IS_DASHBOARD  = /^\/[^/]+\/dashboard(\/|$)/
const IS_STUDYBUDDY = /^\/[^/]+\/studybuddy(\/|$)/
const IS_CONSOLE    = /^\/[^/]+\/console-x7k9(\/|$)/
const IS_CLASSROOM  = /^\/[^/]+\/learn-german\/classroom(\/|$)/
const IS_LEARN_GERMAN = /^\/[^/]+\/learn-german(\/|$)/

export default function HideOnDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // The classroom shows lesson pages (my-course / level / results) inside an
  // iframe. Those are normal pages, so without this they'd render the full
  // site chrome — announcement banner + navbar + footer — inside the narrow
  // classroom panel, eating vertical space and overlapping the content. Any
  // page embedded in an iframe drops its chrome. Checked after mount so the
  // first (server-matching) render still includes chrome — no hydration split.
  const [embedded, setEmbedded] = useState(false)
  // When the course is launched as an installed PWA (standalone), it has its
  // own app chrome (bottom tab bar) — the marketing banner/navbar/footer would
  // make it feel like a website, not an app. Detected after mount so SSR still
  // emits chrome for normal visits (no hydration split).
  const [appMode, setAppMode] = useState(false)
  useEffect(() => {
    try { setEmbedded(window.self !== window.top) } catch { setEmbedded(true) }
    try {
      const nav = window.navigator as unknown as { standalone?: boolean }
      setAppMode(window.matchMedia?.('(display-mode: standalone)').matches || nav.standalone === true)
    } catch { /* ignore */ }
  }, [])

  if (!pathname) return <>{children}</>
  if (embedded) return null
  if (appMode && IS_LEARN_GERMAN.test(pathname)) return null
  if (IS_DASHBOARD.test(pathname) || IS_STUDYBUDDY.test(pathname) || IS_CONSOLE.test(pathname) || IS_CLASSROOM.test(pathname)) return null
  return <>{children}</>
}
