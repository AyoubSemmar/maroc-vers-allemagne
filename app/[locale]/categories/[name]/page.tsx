import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'

export default async function CategoryPage({ params }: { params: Promise<{ name: string; locale: AppLocale }> }) {
  const { name, locale } = await params
  const t = await getTranslations({ locale, namespace: 'articles' })
  const categoryName = decodeURIComponent(name)

  // Only the card list fields — avoids shipping body markdown +
  // translations content for every article in the category.
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, summary, image_url, date')
    .eq('category', categoryName)
    .order('date', { ascending: false })

  let catLabel: string = categoryName
  try { catLabel = t(`cat.${categoryName}` as any) } catch {}

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-green-700 hover:underline mb-6 block">
          {t('backToHome')}
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">{catLabel}</h1>

        {articles && articles.length === 0 && (
          <p className="text-gray-500">{t('emptyCategory')}</p>
        )}

        <div className="flex flex-col gap-4">
          {articles && articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex items-center gap-4 p-4 overflow-hidden"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{article.summary}</p>
                <p className="text-xs text-gray-400 mt-3">{article.date}</p>
              </div>
              {article.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.image_url} alt={article.title} loading="lazy" decoding="async" width={144} height={96} className="w-36 h-24 object-cover rounded-lg flex-shrink-0" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
