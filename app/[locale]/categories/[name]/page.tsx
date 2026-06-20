import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { localizeRows } from '@/lib/i18n-content'
import { articleListFields, applyLocaleAvailability, rehydrateTranslationsList } from '@/lib/article-list-select'

export const revalidate = 600

export default async function CategoryPage({ params }: { params: Promise<{ name: string; locale: AppLocale }> }) {
  const { name, locale } = await params
  const t = await getTranslations({ locale, namespace: 'articles' })
  const categoryName = decodeURIComponent(name)

  // Lightweight select with per-locale title/summary — see
  // lib/article-list-select.ts for the egress story.
  const { data: rawArticles } = await applyLocaleAvailability(
    supabase
      .from('articles')
      .select(articleListFields(locale))
      .eq('category', categoryName)
      .order('date', { ascending: false }),
    locale,
  )
  const articles = localizeRows(rehydrateTranslationsList(rawArticles as any, locale), locale) as any[]

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
