import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Add/remove locales here. Order matters: the first is the default.
  locales: ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'nl'] as const,
  defaultLocale: 'ar',
  // "as-needed": the default locale (ar) stays at `/...` (no prefix),
  // other locales get `/fr/...`, `/en/...`, `/de/...`.
  // Change to "always" if we want `/ar/...` too (better for shareable links
  // but noisier URLs).
  localePrefix: 'always',
})

export type AppLocale = (typeof routing.locales)[number]
export const RTL_LOCALES: AppLocale[] = ['ar', 'fa', 'ur']
export function dirFor(locale: AppLocale): 'rtl' | 'ltr' {
  return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'
}
