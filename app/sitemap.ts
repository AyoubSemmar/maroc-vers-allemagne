import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { supabase } from '@/lib/supabase'
import { COUNTRIES, COUNTRY_ORDER, type CountryKey } from '@/lib/documentChecklistData'

const VISA_SLUGS = ['ausbildung', 'studium', 'tourist', 'family-reunification'] as const

// Checklist pages are indexed only in the locales their long-tail queries come
// in, and only for combos where a visa is actually required — the rest are
// noindex (see the [country]/[visa-type] page). Keep the sitemap in lockstep:
// listing noindexed URLs makes Google distrust the file. This cut ~5k
// near-duplicate URLs that were drowning the site's crawl budget.
const CHECKLIST_LOCALES = routing.locales.filter((l) => ['en', 'fr', 'ar'].includes(l))
function checklistIndexable(country: CountryKey, visaSlug: (typeof VISA_SLUGS)[number]): boolean {
  if (country === 'other') return false
  const rule = COUNTRIES[country]
  if (!rule) return false
  return visaSlug === 'tourist' ? rule.touristVisaRequired : rule.nationalDVisaRequired
}

// www is the canonical host — the bare domain 307-redirects to it, and a
// sitemap full of redirecting URLs makes Google distrust the whole file.
const SITE = 'https://www.gogermany.ma'

// Static routes that exist in every locale. Auth pages intentionally
// excluded — they're noindex (see app/[locale]/login + signup metadata).
const STATIC_PATHS = [
  '',
  '/about',
  '/contact',
  '/articles',
  '/ausbildung',
  '/ausbildung-jobs',
  '/studium',
  '/universities',
  '/learn-german',
  '/interview-prep',
  '/learn-german/a1',
  '/learn-german/a2',
  '/learn-german/b1',
  '/learn-german/b2',
  '/learn-german/c1',
  '/jobs',
  '/housing',
  '/banking',
  '/simcards',
  '/visa',
  '/visa/ausbildung',
  '/visa/studium',
  '/tools/eligibility-checker',
  '/tools/document-checklist',
  '/tools/migration-timeline',
  '/tools/living-cost-calculator',
  '/cv-builder',
  '/anschreiben-generator',
  '/useful-links',
  // '/documents' redirects to /profile and '/categories' has no index
  // page (only /categories/[name]) — listing them fed Google a redirect
  // and a 404 straight from the sitemap.
]

// The 2026-07 tools carry en/fr/ar UI strings and are indexed only in those
// locales (indexLocales on their pages) — the sitemap mirrors that exactly.
const TOOLS3_PATHS = [
  '/tools/chancenkarte-calculator',
  '/tools/sperrkonto-calculator',
  '/tools/brutto-netto-rechner',
  '/tools/anerkennung-wizard',
  '/tools/city-comparator',
  '/tools/german-grade-calculator',
]
const TOOLS3_LOCALES = routing.locales.filter((l) => ['en', 'fr', 'ar'].includes(l))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages don't have a natural lastModified, so use the deploy
  // time. We pin it to midnight UTC of *yesterday* so it doesn't drift
  // by milliseconds on every request and so Google doesn't see the
  // sitemap claim "updated today" on every fetch — that signal makes
  // Google deprioritise the URLs.
  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  yesterday.setUTCHours(0, 0, 0, 0)

  // Build per-locale entries for static paths with hreflang alternates.
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((path) =>
    routing.locales.map((loc) => ({
      url: `${SITE}/${loc}${path}`,
      lastModified: yesterday,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE}/${l}${path}`]),
        ),
      },
    })),
  )

  // Articles from Supabase, one entry per locale — same hreflang
  // grouping as static paths so Google understands these are
  // translations of each other rather than separate pages. Without
  // this, GSC's "Discovered – currently not indexed" pile fills up
  // with locale duplicates that Google rations crawl budget on.
  // Each article is emitted only for the locales it's actually available in
  // (translations._meta.locales — see memory article-locale-policy). Emitting
  // a locale URL or hreflang alternate for a language the article wasn't
  // written for would point Google at fallback/duplicate content.
  const ALL_LOCALES = [...routing.locales]
  let articleEntries: MetadataRoute.Sitemap = []
  try {
    const { data: articles } = await supabase
      .from('articles')
      .select('id, date, locales:translations->_meta->locales')
      .order('date', { ascending: false })
      .limit(2000)
    if (articles) {
      articleEntries = articles.flatMap((a: any) => {
        const metaLocs: string[] = Array.isArray(a.locales) ? a.locales : ALL_LOCALES
        const locs = routing.locales.filter((l) => metaLocs.includes(l))
        return locs.map((loc) => ({
          url: `${SITE}/${loc}/articles/${a.id}`,
          lastModified: a.date ? new Date(a.date) : yesterday,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(locs.map((l) => [l, `${SITE}/${l}/articles/${a.id}`])),
          },
        }))
      })
    }
  } catch {
    // If Supabase is unreachable at build time, just emit the static entries.
  }

  // Checklist entries: only indexable combos (visa actually required, not the
  // 'other' fallback) and only the indexed locales — mirrors the page-level
  // noindex rules exactly.
  const checklistEntries: MetadataRoute.Sitemap = COUNTRY_ORDER.flatMap((country) =>
    VISA_SLUGS.filter((visaSlug) => checklistIndexable(country, visaSlug)).flatMap((visaSlug) =>
      CHECKLIST_LOCALES.map((loc) => ({
        url: `${SITE}/${loc}/tools/document-checklist/${country}/${visaSlug}`,
        lastModified: yesterday,
        changeFrequency: 'monthly' as const,
        priority: 0.65,
        alternates: {
          languages: Object.fromEntries(
            CHECKLIST_LOCALES.map((l) => [
              l,
              `${SITE}/${l}/tools/document-checklist/${country}/${visaSlug}`,
            ]),
          ),
        },
      })),
    ),
  )

  const tools3Entries: MetadataRoute.Sitemap = TOOLS3_PATHS.flatMap((path) =>
    TOOLS3_LOCALES.map((loc) => ({
      url: `${SITE}/${loc}${path}`,
      lastModified: yesterday,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          TOOLS3_LOCALES.map((l) => [l, `${SITE}/${l}${path}`]),
        ),
      },
    })),
  )

  return [...staticEntries, ...tools3Entries, ...checklistEntries, ...articleEntries]
}
