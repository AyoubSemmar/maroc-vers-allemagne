import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { headers } from 'next/headers'

// `not-found.tsx` inside [locale] handles both:
//   - hard 404s (typo URLs that don't match any route)
//   - calls to notFound() from any server component
// Wrapped in the locale shell so it inherits translations + RTL.

export default async function LocaleNotFound() {
  // headers() is async in Next 16 — used to detect locale from the URL
  // since notFound doesn't receive params.
  const h = await headers()
  const path = h.get('x-pathname') || h.get('referer') || ''
  const seg = path.split('/').filter(Boolean)[0]
  const locale: AppLocale =
    seg === 'fr' || seg === 'en' || seg === 'de' || seg === 'ar' ? seg : 'ar'

  let t: (k: string) => string
  try {
    const tr = await getTranslations({ locale, namespace: 'notFound' })
    t = (k) => { try { return tr(k as any) } catch { return '' } }
  } catch {
    t = () => ''
  }

  const title       = t('title')       || (locale === 'fr' ? 'Page introuvable' : locale === 'ar' ? 'الصفحة غير موجودة' : locale === 'de' ? 'Seite nicht gefunden' : 'Page not found')
  const subtitle    = t('subtitle')    || (locale === 'fr' ? "Cette page n'existe pas ou a été déplacée." : locale === 'ar' ? 'هذه الصفحة غير موجودة أو تم نقلها.' : locale === 'de' ? 'Diese Seite existiert nicht oder wurde verschoben.' : "This page doesn't exist or has been moved.")
  const homeCta     = t('home')        || (locale === 'fr' ? "Retour à l'accueil" : locale === 'ar' ? 'العودة إلى الرئيسية' : locale === 'de' ? 'Zur Startseite' : 'Back to home')
  const browseCta   = t('browse')      || (locale === 'fr' ? 'Parcourir le site' : locale === 'ar' ? 'تصفح الموقع' : locale === 'de' ? 'Site durchstöbern' : 'Browse the site')

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
