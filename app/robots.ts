import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

// Auth pages and the dashboard are noindex — they're for signed-in
// users and shouldn't compete with public pages in search results.
// We list each locale variant explicitly so Google's path matcher can
// catch /fr/login as well as /en/login.
const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password']
const PRIVATE_PATHS = ['/dashboard', '/profile', '/admin']

const disallow: string[] = ['/api/', '/auth/']
for (const loc of routing.locales) {
  for (const p of AUTH_PATHS)    disallow.push(`/${loc}${p}`)
  for (const p of PRIVATE_PATHS) disallow.push(`/${loc}${p}`)
}
// Bare /admin (no locale prefix on this segment) — defence in depth.
disallow.push('/admin/')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: 'https://gogermany.ma/sitemap.xml',
    host: 'https://gogermany.ma',
  }
}
