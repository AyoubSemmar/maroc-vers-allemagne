import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { supabase } from '@/lib/supabase'

const SITE = 'https://gogermany.ma'

// Static routes that exist in every locale.
const STATIC_PATHS = [
  '',
  '/articles',
  '/ausbildung-jobs',
  '/universities',
  '/learn-german',
  '/jobs',
  '/visa',
  '/banking',
  '/simcards',
  '/cv-builder',
  '/anschreiben-generator',
  '/login',
  '/signup',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Build per-locale entries for static paths with hreflang alternates.
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((path) =>
    routing.locales.map((loc) => ({
      url: `${SITE}/${loc}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE}/${l}${path}`]),
        ),
      },
    })),
  )

  // Articles from Supabase, one entry per locale.
  let articleEntries: MetadataRoute.Sitemap = []
  try {
    const { data: articles } = await supabase
      .from('articles')
      .select('id, date')
      .order('date', { ascending: false })
      .limit(500)
    if (articles) {
      articleEntries = articles.flatMap((a: any) =>
        routing.locales.map((loc) => ({
          url: `${SITE}/${loc}/articles/${a.id}`,
          lastModified: a.date ? new Date(a.date) : now,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        })),
      )
    }
  } catch {
    // If Supabase is unreachable at build time, just emit the static entries.
  }

  return [...staticEntries, ...articleEntries]
}
