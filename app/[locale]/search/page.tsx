import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import { dirFor, routing, type AppLocale } from '@/i18n/routing'
import { localizeRows } from '@/lib/i18n-content'
import { articleListFields, applyLocaleAvailability, rehydrateTranslationsList } from '@/lib/article-list-select'
import { catLabelFrom } from '@/lib/article-cat'
import TrackSearch from '@/components/analytics/TrackSearch'
import type { Metadata } from 'next'

// Search result pages are infinite query-string permutations of content
// that already lives at canonical URLs — never index them.
export const metadata: Metadata = {
  title: 'Search — GoGermany',
  robots: { index: false, follow: true },
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale: rawLocale } = await params
  const locale = ((routing.locales as readonly string[]).includes(rawLocale)
    ? rawLocale
    : routing.defaultLocale) as AppLocale
  const { q: rawQ } = await searchParams
  // Sanitize the query before it goes into the .or() filter expression.
  // PostgREST treats `,` `(` `)` as syntax separators, and `%` `_` are
  // SQL LIKE wildcards. A user typing `foo,deleted_at=is.null` could
  // otherwise break out of the filter and reach unintended rows.
  // Allowlist: unicode letters / digits / spaces / dashes — covers
  // Arabic, French, German, Latin without giving up search utility.
  const q = (rawQ ?? '')
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\s\-]/gu, '')
    .trim()
    .slice(0, 80)
  const t = await getTranslations({ locale, namespace: 'search' })
  const tc = await getTranslations({ locale, namespace: 'articles' })
  const catLabel = (cat: string) => catLabelFrom(tc as any, cat)

  let articles: any[] = []
  let listings: any[] = []

  if (q) {
    // Only the card list fields — full bodies aren't rendered here.
    // Availability filter keeps Morocco-only articles out of global locales.
    const { data: articleResults } = await applyLocaleAvailability(
      supabase
        .from('articles')
        .select(articleListFields(locale))
        .or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
        .order('date', { ascending: false })
        .limit(50),
      locale,
    )

    const { data: listingResults } = await supabase
      .from('listings')
      .select('id, title, description, type, city, image_url')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .order('created_at', { ascending: false })
      .limit(50)

    articles = localizeRows(rehydrateTranslationsList(articleResults as any, locale), locale) as any[]
    listings = listingResults || []
  }

  const total = articles.length + listings.length

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      {q && <TrackSearch term={q} />}
      <div className="max-w-5xl mx-auto px-4 py-10">

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('resultsFor')} <span className="text-green-700">&quot;{q}&quot;</span>
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {total === 0 ? t('noResults') : t('count', { n: total })}
        </p>

        {articles.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              {t('articles', { n: articles.length })}
            </h2>
            <div className="flex flex-col gap-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex items-center gap-4 p-4"
                >
                  <div className="flex-1">
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      {catLabel(article.category)}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2">{article.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{article.summary}</p>
                  </div>
                  {article.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={article.image_url} alt={article.title} loading="lazy" decoding="async" width={96} height={64} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {listings.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              {t('listings', { n: listings.length })}
            </h2>
            <div className="flex flex-col gap-4">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex items-center gap-4 p-4"
                >
                  <div className="flex-1">
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                      {listing.type} — {listing.city}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2">{listing.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{listing.description}</p>
                  </div>
                  {listing.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={listing.image_url} alt={listing.title} loading="lazy" decoding="async" width={96} height={64} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {q && total === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg">{t('emptyTitle', { q })}</p>
            <p className="text-sm mt-2">{t('emptySub')}</p>
          </div>
        )}

      </div>
    </div>
  )
}
