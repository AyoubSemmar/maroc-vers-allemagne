'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { Link, useRouter } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import OpportunitiesPicker from './OpportunitiesPicker'
import { useCourseAccess } from '@/lib/useCourseAccess'

type Theme = 'light' | 'dark'

type SbUser = {
  email?: string | null
  user_metadata?: {
    avatar_url?: string
    picture?: string
    full_name?: string
    name?: string
  }
}

function initialFromEmail(email?: string | null) {
  if (!email) return '?'
  const first = email.trim().charAt(0)
  return first ? first.toUpperCase() : '?'
}

export default function RihlaNav() {
  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')
  const { hasAccess: hasCourseAccess } = useCourseAccess()
  const [user, setUser] = useState<SbUser | null>(null)
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)
  const [learnOpen, setLearnOpen] = useState(false)
  const [learnPos, setLearnPos] = useState<{ top: number; left: number } | null>(null)
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false)
  const [toolsMenuPos, setToolsMenuPos] = useState<{ top: number; left: number } | null>(null)
  const tTools = useTranslations('landing.tools')
  const [oppPickerOpen, setOppPickerOpen] = useState(false)
  const learnRef = useRef<HTMLDivElement | null>(null)
  const learnTriggerRef = useRef<HTMLButtonElement | null>(null)
  const toolsMenuRef = useRef<HTMLDivElement | null>(null)
  const toolsMenuTriggerRef = useRef<HTMLButtonElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function loadProfileAvatar(userId: string) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', userId)
        .single()
      if (!cancelled) setProfileAvatar(prof?.avatar_url ?? null)
    }

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return
      const u = data.user as SbUser | null
      setUser(u)
      if (data.user?.id) loadProfileAvatar(data.user.id)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = (session?.user as SbUser) ?? null
      setUser(u)
      if (session?.user?.id) loadProfileAvatar(session.user.id)
      else setProfileAvatar(null)
    })
    const initial = (document.documentElement.dataset.theme as Theme) || 'light'
    setTheme(initial)
    setMounted(true)
    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [])

  // Close the Learn / Tools dropdowns on outside click / Esc.
  useEffect(() => {
    if (!learnOpen && !toolsMenuOpen) return
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node
      // Triggers live in their refs; menus are portaled to body, so a click
      // inside any .tools-dd-menu-portal is treated as "inside".
      const inLearn = !!(learnRef.current && learnRef.current.contains(target))
      const inTools = !!(toolsMenuRef.current && toolsMenuRef.current.contains(target))
      const portal = (target instanceof Element ? target.closest('.tools-dd-menu-portal') : null)
      if (!inLearn && !portal) setLearnOpen(false)
      if (!inTools && !portal) setToolsMenuOpen(false)
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') { setLearnOpen(false); setToolsMenuOpen(false) }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [learnOpen, toolsMenuOpen])

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch {}
  }

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  const avatarSrc = profileAvatar || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  const emailLabel = user?.email ?? ''

  return (
    <nav className="rihla-nav">
      <div className="wrap rihla-nav-inner">
        {/* Brand — same in every language */}
        <Link href="/" className="rihla-logo" aria-label={tNav('homeAria')}>
          <div className="rihla-logo-mark" aria-hidden>
            {/* Classy "G" monogram with arrow tail — symbolises the journey to Germany */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 8.5A8 8 0 1 0 19.6 15" />
              <path d="M13 12.5h6.5V18" />
            </svg>
          </div>
          <span>GoGermany</span>
        </Link>

        <div className="rihla-nav-links">
          <Link href="/">{tNav('home')}</Link>
          <button
            type="button"
            className="rihla-nav-linkbtn"
            onClick={() => setOppPickerOpen(true)}
          >
            {tNav('opportunities')}
          </button>

          {/* Learn dropdown */}
          <div ref={learnRef} className={`tools-dd ${learnOpen ? 'is-open' : ''}`}>
            <button
              ref={learnTriggerRef}
              type="button"
              className={`tools-dd-trigger ${learnOpen ? 'is-open' : ''}`}
              aria-haspopup="menu"
              aria-expanded={learnOpen}
              onClick={() => {
                setLearnOpen(v => {
                  const next = !v
                  if (next && learnTriggerRef.current) {
                    const r = learnTriggerRef.current.getBoundingClientRect()
                    setLearnPos({ top: r.bottom + 8, left: r.left })
                  }
                  return next
                })
              }}
            >
              {tNav('learn')}
              <svg className="tools-dd-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {learnOpen && mounted && createPortal(
              <div
                className="tools-dd-menu tools-dd-menu-portal"
                role="menu"
                style={learnPos ? { top: learnPos.top, left: learnPos.left } : undefined}
              >
                <Link href="/learn-german" role="menuitem" className="tools-dd-item" onClick={() => setLearnOpen(false)}>
                  {tNav('learnGerman')}
                </Link>
                <Link href="/articles" role="menuitem" className="tools-dd-item" onClick={() => setLearnOpen(false)}>
                  {tNav('articles')}
                </Link>
                <Link href="/#faq" role="menuitem" className="tools-dd-item" onClick={() => setLearnOpen(false)}>
                  {tNav('faq')}
                </Link>
              </div>,
              document.body,
            )}
          </div>

          {/* Tools dropdown — its own top-level menu (moved out of Learn). */}
          <div ref={toolsMenuRef} className={`tools-dd ${toolsMenuOpen ? 'is-open' : ''}`}>
            <button
              ref={toolsMenuTriggerRef}
              type="button"
              className={`tools-dd-trigger ${toolsMenuOpen ? 'is-open' : ''}`}
              aria-haspopup="menu"
              aria-expanded={toolsMenuOpen}
              onClick={() => {
                setToolsMenuOpen(v => {
                  const next = !v
                  if (next && toolsMenuTriggerRef.current) {
                    const r = toolsMenuTriggerRef.current.getBoundingClientRect()
                    setToolsMenuPos({ top: r.bottom + 8, left: r.left })
                  }
                  return next
                })
              }}
            >
              {tNav('tools')}
              <svg className="tools-dd-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {toolsMenuOpen && mounted && createPortal(
              <div
                className="tools-dd-menu tools-dd-menu-portal"
                role="menu"
                style={toolsMenuPos ? { top: toolsMenuPos.top, left: toolsMenuPos.left } : undefined}
              >
                <Link href="/tools" role="menuitem" className="tools-dd-item" style={{ fontWeight: 700 }} onClick={() => setToolsMenuOpen(false)}>
                  🧰 {tTools('allTools.name')} →
                </Link>
                <Link href="/cv-builder" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('cv.name')}
                </Link>
                <Link href="/anschreiben-generator" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('anschreiben.name')}
                </Link>
                <Link href="/interview-prep" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tNav('interviewPrep')}
                </Link>
                <Link href="/tools/eligibility-checker" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('eligibilityChecker.name')}
                </Link>
                <Link href="/tools/migration-timeline" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('migrationTimeline.name')}
                </Link>
                <Link href="/tools/document-checklist" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('documentChecklist.name')}
                </Link>
                <Link href="/tools/living-cost-calculator" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('livingCost.name')}
                </Link>
                <Link href="/tools/chancenkarte-calculator" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('chancenkarte.name')}
                </Link>
                <Link href="/tools/sperrkonto-calculator" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('sperrkonto.name')}
                </Link>
                <Link href="/tools/brutto-netto-rechner" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('bruttoNetto.name')}
                </Link>
                <Link href="/tools/anerkennung-wizard" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('anerkennung.name')}
                </Link>
                <Link href="/tools/city-comparator" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('cityComparator.name')}
                </Link>
                <Link href="/tools/german-grade-calculator" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('gradeConverter.name')}
                </Link>
                <Link href="/tools/ausbildung-salary" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('ausbSalary.name')}
                </Link>
                <Link href="/tools/driving-license-germany" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('license.name')}
                </Link>
                <Link href="/tools/health-insurance-germany" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('healthInsurance.name')}
                </Link>
                <Link href="/tools/tax-refund-calculator" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('taxRefund.name')}
                </Link>
                <Link href="/tools/furnished-housing" role="menuitem" className="tools-dd-item" onClick={() => setToolsMenuOpen(false)}>
                  {tTools('furnishedHousing.name')}
                </Link>
              </div>,
              document.body,
            )}
          </div>

          {/* Dashboard is now visible to guests too — the dashboard renders
              a guest banner asking them to sign in. */}
          {mounted && (
            <Link href="/dashboard">{tNav('dashboard')}</Link>
          )}

          {/* Paid live-class students get a direct link to their course.
              On mobile the nav links become a horizontal scroll strip; the
              `rihla-mycourse-link` class pins this one to the front so it's
              visible without scrolling the strip sideways (see globals.css). */}
          {mounted && hasCourseAccess && (
            <Link href="/learn-german/my-course" className="rihla-mycourse-link" style={{ fontWeight: 600, color: '#16a34a' }}>📋 {tNav('myCourse')}</Link>
          )}
        </div>

        <div className="rihla-nav-cta">
          <LanguageSwitcher />

          <button
            type="button"
            onClick={toggleTheme}
            className="rihla-icon-btn"
            aria-label={theme === 'dark' ? tNav('enableLight') : tNav('enableDark')}
            title={theme === 'dark' ? tNav('lightMode') : tNav('darkMode')}
          >
            {mounted && theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {mounted && user ? (
            <>
              {/* Avatar circle — same on desktop and mobile */}
              <Link href="/profile" className="rihla-avatar" aria-label={tNav('myAccount')} title={emailLabel}>
                {avatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarSrc} alt="" />
                ) : (
                  <span>{initialFromEmail(user.email)}</span>
                )}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rihla-icon-btn"
                aria-label={tNav('logout')}
                title={tNav('logout')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm rihla-desktop-only">{tNav('login')}</Link>
              <Link href="/signup" className="btn btn-brand btn-sm">{tNav('signup')}</Link>
            </>
          )}
        </div>
      </div>
      <OpportunitiesPicker open={oppPickerOpen} onClose={() => setOppPickerOpen(false)} />
    </nav>
  )
}
