'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { Link, useRouter } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'

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
        <Link href="/" className="rihla-logo" aria-label={tNav('homeAria')}>
          <div className="rihla-logo-mark">MA→DE</div>
          <span>{tCommon('brandSubtitle')}</span>
        </Link>

        <div className="rihla-nav-links">
          <Link href="/#tools">{tNav('tools')}</Link>
          <Link href="/learn-german">{tNav('learnGerman')}</Link>
          <Link href="/articles">{tNav('articles')}</Link>
          <Link href="/cv-builder">{tNav('cvBuilder')}</Link>
          <Link href="/anschreiben-generator">{tNav('anschreiben')}</Link>
          <Link href="/ausbildung-jobs">{tNav('ausbildungJobs')}</Link>
          <Link href="/#faq">{tNav('faq')}</Link>
        </div>

        <div className="rihla-nav-cta">
          <Link href="/search" className="rihla-icon-btn" aria-label={tCommon('search')} title={tCommon('search')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Link>

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
              {/* Desktop: email pill */}
              <Link href="/profile" className="btn btn-ghost btn-sm rihla-desktop-only" title={emailLabel}>
                <span className="rihla-nav-email">{emailLabel}</span>
              </Link>
              {/* Mobile: avatar circle */}
              <Link href="/profile" className="rihla-avatar rihla-mobile-only" aria-label={tNav('myAccount')} title={emailLabel}>
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
    </nav>
  )
}
