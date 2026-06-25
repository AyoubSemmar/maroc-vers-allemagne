'use client'

import { useState } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { logout } from '@/app/[locale]/console-x7k9/actions.js'
import './admin.css'

type Section = {
  href: string
  label: string
  icon: React.ReactNode
}

const I = {
  overview: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3"/><path d="M2 21a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15 21a5 5 0 0 1 7 0"/></svg>,
  content: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>,
  jobs: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>,
  unis: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 1 8l11 6 9-4.9V16"/><path d="M5 11v6a7 7 0 0 0 14 0v-6"/></svg>,
  ai: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="4"/></svg>,
  classes: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m23 7-7 5 7 5z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  signOut: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  revenue: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  comments: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
}

const SECTIONS: Section[] = [
  { href: '/console-x7k9', label: 'Overview', icon: I.overview },
  { href: '/console-x7k9/revenue', label: 'Revenue', icon: I.revenue },
  { href: '/console-x7k9/users', label: 'Users', icon: I.users },
  { href: '/console-x7k9/classes', label: 'Live Classes', icon: I.classes },
  { href: '/console-x7k9/content', label: 'Articles & Listings', icon: I.content },
  { href: '/console-x7k9/comments', label: 'Comments', icon: I.comments },
  { href: '/console-x7k9/jobs', label: 'Ausbildung Jobs', icon: I.jobs },
  { href: '/console-x7k9/unis', label: 'Universities', icon: I.unis },
  { href: '/console-x7k9/ai-ops', label: 'AI Ops & Costs', icon: I.ai },
  { href: '/console-x7k9/settings', label: 'Settings', icon: I.settings },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/console-x7k9') return pathname === '/console-x7k9'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className={`adm-shell ${mobileOpen ? 'is-mobile-open' : ''}`}>
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <div className="adm-brand-mark"><span>G</span></div>
          <div>
            <strong>GoGermany</strong>
            <small>Admin Console</small>
          </div>
        </div>

        <nav className="adm-nav">
          <div className="adm-nav-label">Control center</div>
          <ul>
            {SECTIONS.map(s => (
              <li key={s.href}>
                <Link
                  href={s.href as any}
                  className={`adm-nav-item ${isActive(s.href) ? 'is-active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="adm-nav-icon">{s.icon}</span>
                  <span>{s.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="adm-foot">
          <Link href="/" className="adm-foot-link">↗ View site</Link>
          <form action={logout}>
            <button type="submit" className="adm-foot-link adm-foot-logout">
              {I.signOut} Sign out
            </button>
          </form>
        </div>
      </aside>

      {mobileOpen && <button type="button" className="adm-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close" />}

      <div className="adm-main">
        <header className="adm-topbar">
          <button
            type="button"
            className="adm-menu-btn"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
          <div className="adm-topbar-title">Admin</div>
          <div className="adm-topbar-status">
            <span className="adm-status-dot" /> Live
          </div>
        </header>
        <div className="adm-content">{children}</div>
      </div>
    </div>
  )
}
