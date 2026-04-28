import { getTranslations } from 'next-intl/server'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { updateArticle } from '../../actions'
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

export default async function EditArticlePage({ params }: { params: Promise<{ id: string; locale: AppLocale }> }) {
  const { id, locale } = await params
  const t = await getTranslations({ locale, namespace: 'admin' })
  const tCat = await getTranslations({ locale, namespace: 'articles.cat' })

  // Auth handled by app/[locale]/admin/layout.tsx — no need to re-check here.
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) redirect(`/${locale}/admin`)

  function catLabel(cat: string): string {
    try { return tCat(cat as any) } catch { return cat }
  }

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">{t('editArticleTitle') ?? 'Edit article'}</h1>
        </div>
        <Link href="/admin/content" className="adm-btn adm-btn--ghost">← {t('backToDashboard') ?? 'Back to articles'}</Link>
      </header>

      <div style={{ maxWidth: 720 }}>
        <div className="adm-card">
          <form action={updateArticle} className="flex flex-col gap-4" encType="multipart/form-data">
            <input type="hidden" name="id" value={article.id} />

            <input
              name="title"
              defaultValue={article.title}
              placeholder={t('titlePh')}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 text-right"
            />
            <input
              name="summary"
              defaultValue={article.summary}
              placeholder={t('summaryPh')}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 text-right"
            />
            <textarea
              name="content"
              defaultValue={article.content}
              placeholder={t('contentPh')}
              required
              rows={8}
              className="border border-gray-300 rounded-lg px-4 py-2 text-right"
            />
            <select
              name="category"
              required
              defaultValue={article.category}
              className="border border-gray-300 rounded-lg px-4 py-2 text-right"
            >
              <option value="">{t('selectCategory')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{catLabel(cat)}</option>
              ))}
            </select>
            <input
              name="date"
              type="date"
              defaultValue={article.date}
              required
              className="border border-gray-300 rounded-lg px-4 py-2"
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">{t('imageEditLabel')}</label>
              {article.image_url && (
                <img src={article.image_url} alt="current" className="w-full h-48 object-cover rounded-lg mb-2" />
              )}
              <input
                name="image"
                type="file"
                accept="image/*"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <FAQEditor initial={article.faqs || []} />
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                value="true"
                defaultChecked={article.featured === true}
                className="w-4 h-4 accent-yellow-400"
              />
              <span className="text-sm text-gray-700">{t('featured')}</span>
            </label>
            <button
              type="submit"
              className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800"
            >
              {t('save')}
            </button>
          </form>
          <div className="mt-6">
            <ImageUploader />
          </div>
        </div>
      </div>
    </>
  )
}
