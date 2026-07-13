/**
 * Page-level metadata builder. The root locale layout only declares
 * site-level defaults (metadataBase, siteName, OG type/locale, Twitter
 * card). Every public page should call this helper from its own
 * generateMetadata so we get:
 *
 *   • a unique <title>, meta description
 *   • a unique og:title + og:description (the layout's "GoGermany"
 *     defaults were leaking into every share preview before this)
 *   • a canonical URL on the right per-locale path
 *   • hreflang alternates pointing at the correct path in each locale
 *
 * Pass `path` as an empty string for the locale root (`/fr`), or
 * something like `/tools/eligibility-checker` for nested routes —
 * NEVER include the locale segment, the helper adds it.
 */
import type { Metadata } from 'next'
import { routing, type AppLocale } from '@/i18n/routing'

// www is the canonical host — gogermany.ma 307-redirects to it, so a
// canonical/hreflang pointing at the bare domain is a canonical-to-a-
// redirect, which Google discards ("duplicate without user-selected
// canonical" in GSC).
const SITE = 'https://www.gogermany.ma'

export type LocaleMetaInput = {
  locale: AppLocale
  /** Path under the locale root, e.g. '/tools/eligibility-checker'. Empty string = locale homepage. */
  path: string
  /** Page <title> + og:title. */
  title: string
  /** Meta description + og:description. */
  description: string
  /** Optional override for og:image. Defaults to the site-wide OG image (app/opengraph-image.tsx). */
  ogImage?: string
  /**
   * Locales this page should actually be INDEXED in. When set, a locale
   * outside the list still renders (UX) but is marked noindex,follow with its
   * canonical pointing at the primary indexable locale, and hreflang lists
   * only the indexable locales. Same pattern as article pages: indexing all
   * 12 locale variants of programmatic/near-identical pages fills GSC with
   * "duplicate without user-selected canonical" and burns crawl budget.
   * Omit for genuinely-translated pages (default: all locales indexable).
   */
  indexLocales?: AppLocale[]
}

export function buildLocaleMetadata({
  locale,
  path,
  title,
  description,
  ogImage,
  indexLocales,
}: LocaleMetaInput): Metadata {
  const cleanPath = path.startsWith('/') || path === '' ? path : `/${path}`
  const indexable = indexLocales?.length
    ? routing.locales.filter((l) => indexLocales.includes(l))
    : [...routing.locales]
  const isIndexable = indexable.includes(locale)
  // Non-indexable locales canonicalise to the primary indexable one
  // (fr first — main audience — then en, then whatever is available).
  const primary = isIndexable
    ? locale
    : indexable.includes('fr' as AppLocale) ? ('fr' as AppLocale)
    : indexable.includes('en' as AppLocale) ? ('en' as AppLocale)
    : indexable[0] ?? locale
  const canonical = `${SITE}/${primary}${cleanPath}`
  // Page-level default for x-default hreflang: fr (main audience), else en,
  // else the first indexable locale. Same target for every locale variant of
  // the page so Google has a single "no language match" fallback.
  const defaultLoc = indexable.includes('fr' as AppLocale) ? ('fr' as AppLocale)
    : indexable.includes('en' as AppLocale) ? ('en' as AppLocale)
    : indexable[0] ?? locale
  const languages: Record<string, string> = Object.fromEntries(
    indexable.map((l) => [l, `${SITE}/${l}${cleanPath}`]),
  )
  languages['x-default'] = `${SITE}/${defaultLoc}${cleanPath}`

  return {
    title,
    description,
    ...(isIndexable ? {} : { robots: { index: false, follow: true } }),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'GoGermany',
      type: 'website',
      locale,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}
