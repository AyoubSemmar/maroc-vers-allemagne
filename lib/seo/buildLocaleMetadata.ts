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

const SITE = 'https://gogermany.ma'

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
}

export function buildLocaleMetadata({
  locale,
  path,
  title,
  description,
  ogImage,
}: LocaleMetaInput): Metadata {
  const cleanPath = path.startsWith('/') || path === '' ? path : `/${path}`
  const canonical = `${SITE}/${locale}${cleanPath}`
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE}/${l}${cleanPath}`]),
  )

  return {
    title,
    description,
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
