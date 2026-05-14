'use client'

import { usePathname } from 'next/navigation'

// The dashboard provides its own shell (sidebar + topbar) and hides the
// global site chrome (announcement banner, RihlaNav, RihlaFooter).
// /studybuddy is an internal team-only page with its own design; it
// shouldn't carry the public site chrome either.
// `usePathname` from next/navigation includes the locale prefix.
const IS_DASHBOARD  = /^\/[^/]+\/dashboard(\/|$)/
const IS_STUDYBUDDY = /^\/[^/]+\/studybuddy(\/|$)/

export default function HideOnDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (!pathname) return <>{children}</>
  if (IS_DASHBOARD.test(pathname) || IS_STUDYBUDDY.test(pathname)) return null
  return <>{children}</>
}
