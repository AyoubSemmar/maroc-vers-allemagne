'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import Icon, { type IconName } from '@/components/ui/Icon'
import './pwa.css'

// Bottom tab bar for installed-app mode. It's `display:none` in a normal
// browser (see pwa.css) and only shows once <html class="pwa-standalone"> is
// set. Hidden on the full-bleed classroom and whenever the course is embedded
// in an iframe (the live-class panel), which have their own chrome.

// The live-course "My course" tab was removed with the live classes. The app
// bottom-nav now covers the free course: Home (levels) and Results.
const TABS: { href: string; icon: IconName; key: 'navHome' | 'navResults' }[] = [
  { href: '/learn-german', icon: 'home', key: 'navHome' },
  { href: '/learn-german/results', icon: 'bar-chart', key: 'navResults' },
]

export default function AppBottomNav() {
  const t = useTranslations('pwa')
  const pathname = usePathname() // locale-stripped, e.g. "/learn-german/results"
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let embedded = false
    try { embedded = window.self !== window.top } catch { embedded = true }
    setHidden(embedded)
  }, [])

  if (hidden) return null
  if (pathname?.startsWith('/learn-german/classroom')) return null

  const isActive = (href: string) =>
    href === '/learn-german' ? pathname === '/learn-german' : pathname?.startsWith(href)

  return (
    <nav className="gg-appnav" aria-label="App">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className="gg-appnav-item"
          data-active={isActive(tab.href) ? 'true' : 'false'}
        >
          <Icon name={tab.icon} size={22} />
          <span>{t(tab.key)}</span>
        </Link>
      ))}
    </nav>
  )
}
