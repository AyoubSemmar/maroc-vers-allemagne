'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function DashTopbar({
  avatarSrc,
  userInitial,
  onMobileMenu,
}: {
  avatarSrc: string | null
  userInitial: string
  onMobileMenu?: () => void
}) {
  const t = useTranslations('dashboard.topbar')
  const locale = useLocale()

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

        <a
          href={`/${locale}/#faq`}
          className="dashshell-icon-btn"
          aria-label={t('help')}
          title={t('help')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" /><circle cx="12" cy="17" r=".5" />
          </svg>
        </a>

        <a
          href="https://wa.me/4912345678901"
          target="_blank"
          rel="noopener noreferrer"
          className="dashshell-icon-btn dashshell-icon-wa"
          aria-label={t('whatsapp')} title={t('whatsapp')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 14.3c-.3-.2-1.7-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.2-.2.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5.2 4.5 1.8.7 2.5.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3zM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2z" />
          </svg>
        </a>

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
