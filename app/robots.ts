import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

// Auth pages and the dashboard are noindex — they're for signed-in
// users and shouldn't compete with public pages in search results.
// We list each locale variant explicitly so Google's path matcher can
// catch /fr/login as well as /en/login.
const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password']
// /console-x7k9 is the renamed admin path — kept out of robots.txt
// for the same reason as /admin: nothing on it is meant to be indexed
// or discovered through search.
const PRIVATE_PATHS = ['/dashboard', '/profile', '/console-x7k9', '/studybuddy']

const disallow: string[] = ['/api/', '/auth/']
for (const loc of routing.locales) {
  for (const p of AUTH_PATHS)    disallow.push(`/${loc}${p}`)
  for (const p of PRIVATE_PATHS) disallow.push(`/${loc}${p}`)
}
// Bare /console-x7k9 (no locale prefix) — defence in depth.
disallow.push('/console-x7k9/')

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
