'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'

// `not-found.tsx` inside [locale] handles both:
//   - hard 404s (typo URLs that don't match any route)
//   - calls to notFound() from any server component
// Wrapped in the locale shell so it inherits translations + RTL.
//
// IMPORTANT: this is a CLIENT component on purpose. A server not-found that
// reads headers()/params opts the ENTIRE [locale] subtree into dynamic
// rendering (not-found is part of every route's prerendered shell), which
// killed CDN caching site-wide. useLocale() reads the locale from the
// NextIntlClientProvider in the layout — no request API, so the shell stays
// static and every route can be CDN-cached.

export default function LocaleNotFound() {
  const locale = useLocale() as AppLocale
  const t = useTranslations('notFound')
  // The notFound namespace may be empty in some locales — fall back to inline
  // copy (the 4 launch locales) or English for the rest.
  const tr = (k: string, fb: string) => (t.has(k) ? t(k) : fb)

  const title    = tr('title',    locale === 'fr' ? 'Page introuvable' : locale === 'ar' ? 'الصفحة غير موجودة' : locale === 'de' ? 'Seite nicht gefunden' : 'Page not found')
  const subtitle = tr('subtitle', locale === 'fr' ? "Cette page n'existe pas ou a été déplacée." : locale === 'ar' ? 'هذه الصفحة غير موجودة أو تم نقلها.' : locale === 'de' ? 'Diese Seite existiert nicht oder wurde verschoben.' : "This page doesn't exist or has been moved.")
  const homeCta  = tr('home',     locale === 'fr' ? "Retour à l'accueil" : locale === 'ar' ? 'العودة إلى الرئيسية' : locale === 'de' ? 'Zur Startseite' : 'Back to home')
  const browseCta= tr('browse',   locale === 'fr' ? 'Parcourir le site' : locale === 'ar' ? 'تصفح الموقع' : locale === 'de' ? 'Site durchstöbern' : 'Browse the site')

  return (
    <div
      dir={dirFor(locale)}
      style={{
        minHeight: '70vh',
        display: 'grid',
        placeItems: 'center',
        padding: '64px 20px',
        background: 'var(--bg)',
        color: 'var(--ink)',
      }}
    >
      <div style={{ maxWidth: 560, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
        <div
          aria-hidden
          style={{
            width: 88, height: 88,
            borderRadius: 22,
            background: 'linear-gradient(135deg, color-mix(in oklch, var(--brand) 18%, var(--bg-warm)) 0%, var(--bg-warm) 100%)',
            display: 'grid', placeItems: 'center',
            fontSize: 48,
            fontWeight: 900,
            color: 'var(--brand)',
            border: '1.5px solid color-mix(in oklch, var(--brand) 30%, var(--line))',
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: 'var(--ink)' }}>
          {title}
        </h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: 460 }}>
          {subtitle}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px',
              background: 'var(--brand)',
              color: '#fff',
              borderRadius: 999,
              fontSize: 14, fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            ← {homeCta}
          </Link>
          <Link
            href="/articles"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px',
              background: 'var(--bg-elev)',
              color: 'var(--ink)',
              border: '1.5px solid var(--line)',
              borderRadius: 999,
              fontSize: 14, fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {browseCta}
          </Link>
        </div>
      </div>
    </div>
  )
}
