'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { createClient } from '@/lib/supabase-browser'
import { useShell } from './DashShell'

export default function DashTopbar({
  avatarSrc,
  userInitial,
  onMobileMenu,
  onHelpOpen,
}: {
  avatarSrc: string | null
  userInitial: string
  onMobileMenu?: () => void
  onHelpOpen?: () => void
}) {
  const t = useTranslations('dashboard.topbar')
  const { user } = useShell()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    // Bounce to home so the user lands on a non-protected page after the
    // sign-out — also forces the layout tree to re-evaluate auth state.
    router.push('/')
    router.refresh()
  }

  // Theme toggle (matches ThemeToggle.tsx pattern)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [themeMounted, setThemeMounted] = useState(false)
  useEffect(() => {
    const initial = (document.documentElement.dataset.theme as 'light' | 'dark') || 'light'
    setTheme(initial)
    setThemeMounted(true)
  }, [])
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch {}
  }

  return (
    <header className="dashshell-topbar">
      {/* Mobile menu toggle */}
      <button
        type="button"
        className="dashshell-topbar-menu"
        aria-label="Open navigation"
        onClick={onMobileMenu}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      <div className="dashshell-topbar-spacer" />

      <div className="dashshell-topbar-actions">
        <LanguageSwitcher />

        <button
          type="button"
          onClick={onHelpOpen}
          className="dashshell-icon-btn"
          aria-label={t('help')}
          title={t('help')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" /><circle cx="12" cy="17" r=".5" />
          </svg>
        </button>

        <button
          type="button"
          className="dashshell-icon-btn"
          aria-label={theme === 'dark' ? t('themeLight') : t('themeDark')}
          title={theme === 'dark' ? t('themeLight') : t('themeDark')}
          onClick={toggleTheme}
        >
          {themeMounted && theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="dashshell-icon-btn"
            aria-label={t('logout')}
            title={t('logout')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        )}

        <Link href="/dashboard/profile" className="dashshell-topbar-avatar" aria-label={t('account')}>
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarSrc} alt="" />
          ) : (
            <span>{userInitial}</span>
          )}
          <span className="dashshell-avatar-dot" />
        </Link>
      </div>
    </header>
  )
}
