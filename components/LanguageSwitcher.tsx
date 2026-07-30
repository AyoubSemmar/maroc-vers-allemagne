'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { routing, type AppLocale } from '@/i18n/routing'

type LocaleOption = {
  code: AppLocale
  label: string
  /** ISO 3166-1 alpha-2 country code for flagcdn.com */
  countryCode: string
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: 'ar', label: 'العربية',  countryCode: 'sa' },
  { code: 'fr', label: 'Français', countryCode: 'fr' },
  { code: 'en', label: 'English',  countryCode: 'gb' },
  { code: 'de', label: 'Deutsch',  countryCode: 'de' },
  { code: 'es', label: 'Español',  countryCode: 'es' },
  { code: 'tr', label: 'Türkçe',   countryCode: 'tr' },
  { code: 'fa', label: 'فارسی',    countryCode: 'ir' },
  { code: 'pt', label: 'Português',countryCode: 'br' },
  { code: 'ru', label: 'Русский',  countryCode: 'ru' },
  { code: 'hi', label: 'हिन्दी',     countryCode: 'in' },
  { code: 'ur', label: 'اردو',      countryCode: 'pk' },
  { code: 'zh', label: '简体中文',  countryCode: 'cn' },
  { code: 'uk', label: 'Українська', countryCode: 'ua' },
  { code: 'sq', label: 'Shqip',    countryCode: 'al' },
  { code: 'id', label: 'Bahasa Indonesia', countryCode: 'id' },
]

function flagSrc(countryCode: string) {
  return `https://flagcdn.com/w40/${countryCode}.png`
}

export default function LanguageSwitcher() {
  const locale = useLocale() as AppLocale
  const t = useTranslations('language')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [menuStyle, setMenuStyle] = useState<Record<string, string | number> | undefined>(undefined)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // The menu is portaled to <body> to escape the nav's backdrop-filter
  // containing block (otherwise position:fixed is relative to the nav, not
  // the viewport, and the mobile sheet renders off-screen). Positioning is
  // set inline so it always wins: a full-width bottom sheet on mobile, or an
  // anchor under the trigger on desktop.
  function openMenu() {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600
    if (isMobile) {
      setMenuStyle({ position: 'fixed', left: 0, right: 0, bottom: 0, top: 'auto', width: '100%', transform: 'none' })
    } else {
      const r = btnRef.current?.getBoundingClientRect()
      setMenuStyle({ position: 'fixed', top: Math.round((r?.bottom ?? 56) + 8), right: Math.round(window.innerWidth - (r?.right ?? window.innerWidth - 12)) })
    }
    setOpen(true)
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (wrapRef.current?.contains(target)) return
      if (target.closest?.('.lang-menu')) return
      setOpen(false)
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
      document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch {}
    const cleanPath = pathname === '/' ? '' : pathname
    window.location.href = `/${next}${cleanPath}${window.location.search}${window.location.hash}`
  }

  const current =
    LOCALE_OPTIONS.find((o) => o.code === locale) ?? LOCALE_OPTIONS[0]

  const menu = open && mounted ? createPortal(
    <>
      {/* Backdrop — mobile only via CSS, closes the bottom sheet */}
      <div className="lang-backdrop" onClick={() => setOpen(false)} aria-hidden />

      {/* Desktop anchor via inline coords; mobile CSS overrides to a bottom sheet */}
      <div role="menu" className="lang-menu" style={menuStyle}>
        {(routing.locales as readonly AppLocale[]).map((loc) => {
          const opt = LOCALE_OPTIONS.find((o) => o.code === loc)!
          const active = loc === locale
          return (
            <button
              key={loc}
              role="menuitem"
              onClick={() => pickLocale(loc)}
              aria-label={opt.label}
              title={opt.label}
              className={`lang-menu-item ${active ? 'is-active' : ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={flagSrc(opt.countryCode)} alt={opt.label} className="lang-flag-img" aria-hidden />
              <span className="lang-label">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </>,
    document.body,
  ) : null

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
        className="rihla-icon-btn"
        aria-label={t('change')}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t('change')}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={flagSrc(current.countryCode)}
          alt={current.label}
          width={24}
          height={18}
          style={{ display: 'block', borderRadius: 3, objectFit: 'cover' }}
        />
      </button>
      {menu}
    </div>
  )
}
