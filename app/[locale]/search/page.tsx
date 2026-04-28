import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import { dirFor, routing, type AppLocale } from '@/i18n/routing'

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
  const q = rawQ?.trim() || ''
  const t = await getTranslations({ locale, namespace: 'search' })
  const tc = await getTranslations({ locale, namespace: 'articles' })
  const catLabel = (cat: string) => {
    if (!cat) return ''
    try {
      const v = tc(`cat.${cat}` as any)
      return v && v !== `cat.${cat}` ? v : cat
    } catch { return cat }
  }

  let articles: any[] = []
  let listings: any[] = []

  if (q) {
    // Only the card list fields — full bodies aren't rendered here.
    const { data: articleResults } = await supabase
      .from('articles')
      .select('id, title, summary, category, image_url')
      .or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
      .order('date', { ascending: false })
      .limit(50)

    const { data: listingResults } = await supabase
      .from('listings')
      .select('id, title, description, type, city, image_url')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .order('created_at', { ascending: false })
      .limit(50)

    articles = articleResults || []
    listings = listingResults || []
  }

  const total = articles.length + listings.length

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
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
