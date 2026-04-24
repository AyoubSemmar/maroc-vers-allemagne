import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { login, logout, addArticle, deleteArticle, deleteListing } from './actions'
import ImageUploader from '@/components/ImageUploader'
import FAQEditor from '@/components/FAQEditor'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const categories = [
  "البنوك", "شرائح الاتصال", "السكن",
  "الجامعات", "العمل", "Ausbildung", "التأشيرة والأوراق"
]

export default async function AdminPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'admin' })
  const tCat = await getTranslations({ locale, namespace: 'articles.cat' })

  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true'

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={dirFor(locale)}>
        <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-6">{t('dashboard')}</h1>
          <form action={login} className="flex flex-col gap-4">
            <input
              type="password"
              name="password"
              placeholder={t('password')}
              className="border border-gray-300 rounded-lg px-4 py-2 text-right"
              required
            />
            <button type="submit" className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800">
              {t('login')}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false })

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, city, type, price, created_at, image_url')
    .order('created_at', { ascending: false })

  function catLabel(cat: string): string {
    try { return tCat(cat as any) } catch { return cat }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-green-700">{t('dashboard')}</span>
          <div className="flex gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:underline">{t('site')}</Link>
            <form action={logout}>
              <button type="submit" className="text-sm text-red-500 hover:underline">{t('logout')}</button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-12">

        {/* Add Article Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('addArticleHeading')}</h2>
          <form action={addArticle} className="flex flex-col gap-4" encType="multipart/form-data">
            <input name="title" placeholder={t('titlePh')} required className="border border-gray-300 rounded-lg px-4 py-2 text-right" />
            <input name="summary" placeholder={t('summaryPh')} required className="border border-gray-300 rounded-lg px-4 py-2 text-right" />
            <textarea name="content" placeholder={t('contentPh')} required rows={6} className="border border-gray-300 rounded-lg px-4 py-2 text-right" />
            <select name="category" required className="border border-gray-300 rounded-lg px-4 py-2 text-right">
              <option value="">{t('selectCategory')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{catLabel(cat)}</option>
              ))}
            </select>
            <input name="date" type="date" required className="border border-gray-300 rounded-lg px-4 py-2" />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">{t('imageLabel')}</label>
              <input name="image" type="file" accept="image/*" className="border border-gray-300 rounded-lg px-4 py-2" />
            </div>
            <FAQEditor />
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" value="true" className="w-4 h-4 accent-yellow-400" />
              <span className="text-sm text-gray-700">{t('featured')}</span>
            </label>
            <button type="submit" className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800">
              {t('publishArticle')}
            </button>
          </form>
          <div className="mt-6">
            <ImageUploader />
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('articlesHeading', { n: articles?.length || 0 })}</h2>
          <div className="flex flex-col gap-3">
            {articles && articles.map((article) => (
              <div key={article.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  {article.image_url && (
                    <img src={article.image_url} alt="" className="w-12 h-12 object-cover rounded-lg" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{article.title}</p>
                    <p className="text-xs text-gray-400">{catLabel(article.category)} · {article.date}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href={`/admin/edit/${article.id}`} className="text-sm text-green-700 hover:underline">{t('edit')}</Link>
                  <form action={deleteArticle}>
                    <input type="hidden" name="id" value={article.id} />
                    <button type="submit" className="text-sm text-red-500 hover:underline">{t('del')}</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {t('listingsHeading', { n: listings?.length || 0 })}
          </h2>
          <div className="flex flex-col gap-3">
            {listings && listings.length === 0 && (
              <p className="text-sm text-gray-400">{t('listingsEmpty')}</p>
            )}
            {listings && listings.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  {listing.image_url ? (
                    <img src={listing.image_url} alt="" className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🏠</div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{listing.title}</p>
                    <p className="text-xs text-gray-400">
                      {listing.type} · {listing.city}
                      {listing.price ? ` · ${listing.price} €` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <Link href={`/listings/${listing.id}`} className="text-sm text-green-700 hover:underline">{t('view')}</Link>
                  <form action={deleteListing}>
                    <input type="hidden" name="id" value={listing.id} />
                    <button type="submit" className="text-sm text-red-500 hover:underline">{t('del')}</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
