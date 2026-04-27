'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import OpportunitiesPicker from '@/components/OpportunitiesPicker'

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
  locked?: boolean
  badge?: string
  /** If set, the item renders as a button and runs this instead of navigating. */
  onClick?: () => void
}

// ── Icons (inline SVG, 18px) ──────────────────────────────────
const I = {
  browse: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
    </svg>
  ),
  bookmark: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  sparkles: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
    </svg>
  ),
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  lang: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h11" /><path d="M9 3v2" /><path d="M12 20l5-11 5 11" /><path d="M14 17h6" /><path d="M4 5c0 7 4 11 9 13" />
    </svg>
  ),
  mic: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" />
    </svg>
  ),
  video: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="14" height="12" rx="2" /><path d="M22 8l-6 4 6 4z" />
    </svg>
  ),
  people: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" /><path d="M2 21a7 7 0 0 1 14 0" /><circle cx="17" cy="9" r="2.5" /><path d="M15 21a5 5 0 0 1 7 0" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" /><path d="m8 12 3 3 5-6" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  ),
  doc: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" />
    </svg>
  ),
  edit: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h4L20 8l-4-4L4 16z" />
    </svg>
  ),
  euro: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 7a7 7 0 1 0 0 10" />
      <path d="M3 11h10" />
      <path d="M3 14h10" />
    </svg>
  ),
  lock: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </svg>
  ),
  whatsapp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 14.3c-.3-.2-1.7-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.2-.2.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5.2 4.5 1.8.7 2.5.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3zM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  ),
  help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" /><circle cx="12" cy="17" r=".5" />
    </svg>
  ),
  services: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 6 6 1-4.5 4.5 1 6L12 17l-5.5 2.5 1-6L3 9l6-1z" />
    </svg>
  ),
  collapse: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" />
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
}

export default function DashSidebar({
  completionPct,
  userInitial: _userInitial,
  isMobileOpen,
  collapsed,
  onClose,
  onHelpOpen,
}: {
  completionPct: number
  userInitial: string
  isMobileOpen?: boolean
  collapsed?: boolean
  onClose?: () => void
  onHelpOpen?: () => void
}) {
  const t = useTranslations('dashboard.sidebar')
  const tCommon = useTranslations('common')
  const pathname = usePathname()
  const [oppPickerOpen, setOppPickerOpen] = useState(false)

  // Strip the locale prefix when comparing: pathname from next-intl's
  // usePathname is locale-normalized (e.g. "/dashboard/profile").
  const current = pathname ?? ''

  function isActive(href: string) {
    if (href === '/dashboard') return current === '/dashboard'
    return current === href || current.startsWith(href + '/')
  }

  const marketplace: NavItem[] = [
    { href: '/dashboard/browse',        label: t('browse'),       icon: I.browse,   onClick: () => setOppPickerOpen(true) },
    { href: '/dashboard/saved',         label: t('saved'),        icon: I.bookmark },
    { href: '/dashboard/apply-for-me',  label: t('applyForMe'),   icon: I.sparkles, badge: t('newBadge') },
  ]
  const preparation: NavItem[] = [
    { href: '/dashboard',                 label: t('dashboard'),       icon: I.grid },
    { href: '/dashboard/learn-german',    label: t('germanLearning'),  icon: I.lang },
    { href: '/dashboard/interview-prep',  label: t('interviewPrep'),   icon: I.mic,    badge: t('newBadge') },
    { href: '/dashboard/video-studio',    label: t('videoStudio'),     icon: I.video,  locked: true },
  ]
  const tools: NavItem[] = [
    { href: '/dashboard/eligibility',          label: t('eligibility'),       icon: I.check },
    { href: '/dashboard/timeline',             label: t('timeline'),          icon: I.calendar },
    { href: '/dashboard/document-checklist',   label: t('documentChecklist'), icon: I.doc },
    { href: '/dashboard/living-cost-calculator', label: t('livingCost'),      icon: I.euro },
    { href: '/dashboard/cv-builder',           label: t('cvBuilder'),         icon: I.doc },
    { href: '/dashboard/cover-letter',         label: t('coverLetter'),       icon: I.edit },
  ]

  return (
    <aside className={`dashshell-sidebar ${collapsed ? 'is-collapsed' : ''} ${isMobileOpen ? 'is-open' : ''}`} aria-label="Dashboard navigation">
      {/* Logo row */}
      <div className="dashshell-sidebar-head">
        <Link href="/" className="dashshell-logo" aria-label={tCommon('appName')}>
          <div className="dashshell-logo-mark" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 8.5A8 8 0 1 0 19.6 15" />
              <path d="M13 12.5h6.5V18" />
            </svg>
          </div>
          <span className="dashshell-logo-text">GoGermany</span>
        </Link>
        <button
          type="button"
          className="dashshell-collapse"
          onClick={() => onClose?.()}
          aria-label="Collapse sidebar"
        >
          {I.collapse}
        </button>
      </div>

      {/* My profile tile */}
      <Link
        href="/dashboard/profile"
        className={`dashshell-profile-tile ${isActive('/dashboard/profile') ? 'is-active' : ''} ${completionPct >= 100 ? 'is-complete' : ''}`}
      >
        <div className="dashshell-profile-ring" style={{ ['--pct' as any]: completionPct }}>
          <div className="dashshell-profile-ring-inner">
            <span>{completionPct}%</span>
          </div>
        </div>
        <div className="dashshell-profile-tile-text">
          <span className="dashshell-profile-tile-label">
            {I.user}
            {t('myProfile')}
          </span>
          <span className="dashshell-profile-tile-sub">
            {completionPct >= 100 ? t('complete') : t('tapToComplete')}
          </span>
        </div>
      </Link>

      {/* Scroll area */}
      <div className="dashshell-sidebar-scroll">
        <Section label={t('sectionMarketplace')} items={marketplace} isActive={isActive} />
        <Section label={t('sectionPreparation')} items={preparation} isActive={isActive} />
        <Section label={t('sectionTools')} items={tools} isActive={isActive} />
      </div>

      {/* Footer actions */}
      <div className="dashshell-sidebar-foot">
        <a
          href="https://wa.me/4912345678901"
          target="_blank"
          rel="noopener noreferrer"
          className="dashshell-nav-item dashshell-wa"
        >
          <span className="dashshell-nav-icon">{I.whatsapp}</span>
          <span className="dashshell-nav-label">{t('whatsappSupport')}</span>
        </a>
        <Link
          href="/dashboard/services"
          className={`dashshell-nav-item ${isActive('/dashboard/services') ? 'is-active' : ''}`}
        >
          <span className="dashshell-nav-icon">{I.services}</span>
          <span className="dashshell-nav-label">{t('services')}</span>
        </Link>
        <button
          type="button"
          onClick={onHelpOpen}
          className="dashshell-nav-item"
        >
          <span className="dashshell-nav-icon">{I.help}</span>
          <span className="dashshell-nav-label">{t('help')}</span>
        </button>
      </div>
      <OpportunitiesPicker open={oppPickerOpen} onClose={() => setOppPickerOpen(false)} inDashboard />
    </aside>
  )
}

function Section({
  label,
  items,
  isActive,
}: {
  label: string
  items: NavItem[]
  isActive: (href: string) => boolean
}) {
  return (
    <div className="dashshell-section">
      <div className="dashshell-section-label">{label}</div>
      <ul className="dashshell-nav-list">
        {items.map(item => (
          <li key={item.href}>
            {item.locked ? (
              <span className="dashshell-nav-item is-locked" aria-disabled="true">
                <span className="dashshell-nav-icon">{item.icon}</span>
                <span className="dashshell-nav-label">{item.label}</span>
                <span className="dashshell-lock" aria-hidden>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 1 1 8 0v4" />
                  </svg>
                </span>
              </span>
            ) : item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className={`dashshell-nav-item ${isActive(item.href) ? 'is-active' : ''}`}
              >
                <span className="dashshell-nav-icon">{item.icon}</span>
                <span className="dashshell-nav-label">{item.label}</span>
                {item.badge && <span className="dashshell-new-badge">{item.badge}</span>}
              </button>
            ) : (
              <Link
                href={item.href as any}
                className={`dashshell-nav-item ${isActive(item.href) ? 'is-active' : ''}`}
              >
                <span className="dashshell-nav-icon">{item.icon}</span>
                <span className="dashshell-nav-label">{item.label}</span>
                {item.badge && <span className="dashshell-new-badge">{item.badge}</span>}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
