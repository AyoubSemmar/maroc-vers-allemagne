'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type AppLocale } from '@/i18n/routing'

type LocaleOption = {
  code: AppLocale
  label: string     // Native name shown in the button
  flag: string      // Emoji flag
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
]

export default function LanguageSwitcher() {
  const locale = useLocale() as AppLocale
  const t = useTranslations('language')
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', onDocClick)
      document.addEventListener('keydown', onEsc)
    }
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  function pickLocale(next: AppLocale) {
    setOpen(false)
    if (next === locale) return
    try {
      localStorage.setItem('locale', next)
      localStorage.setItem('langChosen', '1')
      document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch {}
    router.replace(pathname, { locale: next })
    router.refresh()
  }

  const current =
    LOCALE_OPTIONS.find((o) => o.code === locale) ?? LOCALE_OPTIONS[0]

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rihla-icon-btn"
        aria-label={t('change')}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t('change')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20" />
        </svg>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {current.code}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            insetInlineEnd: 0,
            minWidth: 180,
            background: 'var(--rihla-surface, #fff)',
            color: 'var(--rihla-fg, #111)',
            border: '1px solid var(--rihla-border, rgba(0,0,0,.1))',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,.12)',
            padding: 6,
            zIndex: 60,
          }}
        >
          {(routing.locales as readonly AppLocale[]).map((loc) => {
            const opt = LOCALE_OPTIONS.find((o) => o.code === loc)!
            const active = loc === locale
            return (
              <button
                key={loc}
                role="menuitem"
                onClick={() => pickLocale(loc)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '8px 10px',
                  background: active
                    ? 'var(--rihla-brand-soft, rgba(0,120,120,.08))'
                    : 'transparent',
                  color: 'inherit',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  textAlign: 'start',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{opt.flag}</span>
                <span>{opt.label}</span>
                {active && (
                  <span style={{ marginInlineStart: 'auto', fontSize: 12, opacity: 0.7 }}>
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
