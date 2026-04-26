'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { Link, useRouter } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import OpportunitiesPicker from './OpportunitiesPicker'

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
  const [user, setUser] = useState<SbUser | null>(null)
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)
  const [learnOpen, setLearnOpen] = useState(false)
  const [learnPos, setLearnPos] = useState<{ top: number; left: number } | null>(null)
  const [oppPickerOpen, setOppPickerOpen] = useState(false)
  const learnRef = useRef<HTMLDivElement | null>(null)
  const learnTriggerRef = useRef<HTMLButtonElement | null>(null)
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

  // Close Learn dropdown on outside click / Esc.
  useEffect(() => {
    if (!learnOpen) return
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node
      // Trigger lives in learnRef; menu is portaled to body, so also
      // ignore clicks that land inside any .tools-dd-menu-portal.
      if (learnRef.current && learnRef.current.contains(target)) return
      const portal = (target instanceof Element ? target.closest('.tools-dd-menu-portal') : null)
      if (portal) return
      setLearnOpen(false)
    }
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') setLearnOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [learnOpen])

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
                <Link href="/#tools" role="menuitem" className="tools-dd-item" onClick={() => setLearnOpen(false)}>
                  {tNav('tools')}
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

          {mounted && user && (
            <Link href="/dashboard">{tNav('dashboard')}</Link>
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
              <button onClick={logout} className="btn btn-brand btn-sm" type="button">{tNav('logout')}</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">{tNav('login')}</Link>
              <Link href="/signup" className="btn btn-brand btn-sm rihla-desktop-only">{tNav('signup')}</Link>
            </>
          )}
        </div>
      </div>
      <OpportunitiesPicker open={oppPickerOpen} onClose={() => setOppPickerOpen(false)} />
    </nav>
  )
}
