'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type AppLocale } from '@/i18n/routing'
import { LOCALE_OPTIONS } from './LanguageSwitcher'

/**
 * First-visit language chooser. Shows a full-screen modal the first time
 * a visitor lands on the site and asks them to pick a language. The
 * choice is stored in localStorage + the NEXT_LOCALE cookie so the server
 * middleware keeps respecting it on subsequent visits.
 *
 * To re-show the picker manually the user can click the language switcher
 * button in the nav — this component stays out of their way after the
 * first choice.
 */
export default function LanguagePicker() {
  const locale = useLocale() as AppLocale
  const t = useTranslations('language')
  const pathname = usePathname()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const chosen = localStorage.getItem('langChosen')
      if (!chosen) setVisible(true)
    } catch {
      // localStorage might be blocked (private mode, etc.) — fall open so
      // the user still gets to pick a language.
      setVisible(true)
    }
  }, [])

  function pickLocale(next: AppLocale) {
    try {
      localStorage.setItem('locale', next)
      localStorage.setItem('langChosen', '1')
      document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch {}
    setVisible(false)
    if (next !== locale) {
      router.replace(pathname, { locale: next })
      router.refresh()
    }
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-picker-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--rihla-surface, #fff)',
          color: 'var(--rihla-fg, #111)',
          borderRadius: 16,
          padding: '28px 24px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 12 }}>🌍</div>
        <h2
          id="lang-picker-title"
          style={{ margin: 0, fontSize: 22, fontWeight: 700 }}
        >
          {t('pickerTitle')}
        </h2>
        <p style={{ margin: '8px 0 20px', opacity: 0.7, fontSize: 14 }}>
          {t('pickerSubtitle')}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 10,
          }}
        >
          {(routing.locales as readonly AppLocale[]).map((loc) => {
            const opt = LOCALE_OPTIONS.find((o) => o.code === loc)!
            return (
              <button
                key={loc}
                onClick={() => pickLocale(loc)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '14px 12px',
                  background: 'var(--rihla-surface-2, #f7f7f7)',
                  color: 'inherit',
                  border: '1px solid var(--rihla-border, rgba(0,0,0,0.12))',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    'var(--rihla-brand, #0a7a7a)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    'var(--rihla-border, rgba(0,0,0,0.12))'
                }}
              >
                <span style={{ fontSize: 22, lineHeight: 1 }}>{opt.flag}</span>
                <span>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
