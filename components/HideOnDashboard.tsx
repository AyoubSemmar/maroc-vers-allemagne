'use client'

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

export default function HideOnDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (!pathname) return <>{children}</>
  if (IS_DASHBOARD.test(pathname) || IS_STUDYBUDDY.test(pathname) || IS_CONSOLE.test(pathname) || IS_CLASSROOM.test(pathname)) return null
  return <>{children}</>
}
