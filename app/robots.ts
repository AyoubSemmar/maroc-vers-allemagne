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

// Low-value crawlers we block outright: they hammer the site (each hit is an
// uncached function invocation = real cost) but send ~no relevant traffic for a
// Morocco→Germany audience. Amazonbot (Alexa/Amazon), PetalBot (Huawei search),
// and a few aggressive SEO scrapers. Search bots we KEEP: Googlebot, Bingbot,
// and OAI-SearchBot/ChatGPT-User (feeds the ChatGPT citations the site gets).
// NB: deliberately NOT blocking AhrefsBot/SemrushBot — the owner uses those SEO
// tools to audit this very site, and blocking them would break their own crawls.
const BLOCKED_BOTS = ['Amazonbot', 'PetalBot', 'DataForSeoBot', 'Bytespider', 'ImagesiftBot', 'Barkrowler', 'MJ12bot']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      // These bots respect robots.txt (Amazonbot/PetalBot are verified) — block
      // the whole site for them to cut wasted crawl cost.
      { userAgent: BLOCKED_BOTS, disallow: '/' },
    ],
    sitemap: 'https://www.gogermany.ma/sitemap.xml',
    host: 'https://www.gogermany.ma',
  }
}
