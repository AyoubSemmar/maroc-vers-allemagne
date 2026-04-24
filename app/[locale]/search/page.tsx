import { supabase } from '@/lib/supabase'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: rawQ } = await searchParams
  const q = rawQ?.trim() || ''

  let articles: any[] = []
  let listings: any[] = []

  if (q) {
    const { data: articleResults } = await supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
      .order('date', { ascending: false })

    const { data: listingResults } = await supabase
      .from('listings')
      .select('*')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .order('created_at', { ascending: false })

    articles = articleResults || []
    listings = listingResults || []
  }

  const total = articles.length + listings.length

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-10">

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          نتائج البحث عن: <span className="text-green-700">"{q}"</span>
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {total === 0 ? 'لا توجد نتائج' : `${total} نتيجة`}
        </p>

        {/* Articles */}
        {articles.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">📰 المقالات ({articles.length})</h2>
            <div className="flex flex-col gap-4">
              {articles.map((article) => (
                <a
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex items-center gap-4 p-4"
                >
                  <div className="flex-1">
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2">{article.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{article.summary}</p>
                  </div>
                  {article.image_url && (
                    <img src={article.image_url} alt={article.title} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Listings */}
        {listings.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">🏠 الإعلانات ({listings.length})</h2>
            <div className="flex flex-col gap-4">
              {listings.map((listing) => (
                <a
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
                    <img src={listing.image_url} alt={listing.title} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* No results */}
        {q && total === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg">لم نجد أي نتائج لـ "{q}"</p>
            <p className="text-sm mt-2">جرب كلمات مختلفة</p>
          </div>
        )}

      </div>
    </div>
  )
}
