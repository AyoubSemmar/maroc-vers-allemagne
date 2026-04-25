'use client'

import { usePathname } from 'next/navigation'

// The dashboard provides its own shell (sidebar + topbar) and hides the
// global site chrome (announcement banner, RihlaNav, RihlaFooter).
// `usePathname` from next/navigation includes the locale prefix, so we
// match /<locale>/dashboard (exactly or followed by a sub-path).
const IS_DASHBOARD = /^\/[^/]+\/dashboard(\/|$)/

export default function HideOnDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname && IS_DASHBOARD.test(pathname)) return null
  return <>{children}</>
}
