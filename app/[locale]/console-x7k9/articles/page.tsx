// Admin: article management — AI generator (title-driven, dedup-checked) +
// manual add form + article list. Listings live on their own page now.
import { getTranslations } from 'next-intl/server'
import { createClient } from '@supabase/supabase-js'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { addArticle, deleteArticle } from '../actions.js'
import ImageUploader from '@/components/ImageUploader'
import FAQEditor from '@/components/FAQEditor'
import AdminAiArticleGenerator from '@/components/AdminAiArticleGenerator'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

const categories = [
  'البنوك', 'شرائح الاتصال', 'السكن',
  'الجامعات', 'العمل', 'Ausbildung', 'التأشيرة والأوراق',
]

export default async function AdminArticlesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ err?: string; ok?: string }>
}) {
  const { locale } = await params
  const { err, ok } = await searchParams
  const t = await getTranslations({ locale, namespace: 'admin' })
  const tCat = await getTranslations({ locale, namespace: 'articles.cat' })

  const { data: articles } = await supabase
    .from('articles').select('*').order('date', { ascending: false })

  const catLabel = (c: string) => { try { return tCat(c as any) } catch { return c } }

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Articles</h1>
          <p className="adm-page-sub">Generate SEO articles with the AI generator, or add one manually. Publish, edit and delete blog content.</p>
        </div>
      </header>

      {err && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#7f1d1d', borderRadius: 12, padding: '12px 16px', marginTop: 16, fontSize: 14, fontFamily: 'monospace' }}>
          <strong>⚠ Publish failed</strong>
          <div style={{ marginTop: 6 }}>{err}</div>
        </div>
      )}
      {ok && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#14532d', borderRadius: 12, padding: '12px 16px', marginTop: 16, fontSize: 14 }}>
          <strong>✓ Saved</strong>
          <div style={{ marginTop: 6 }}>Scroll down to see it in the list.</div>
        </div>
      )}

      <AdminAiArticleGenerator />

      <div className="adm-grid-2">
        {/* Add article form */}
        <section className="adm-card">
          <div className="adm-card-head">
            <h3 className="adm-card-title">{t('addArticleHeading') ?? 'New article'}</h3>
          </div>
          <form action={addArticle} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input name="title"   className="adm-input"    placeholder={t('titlePh')   ?? 'Title'}    required />
            <input name="summary" className="adm-input"    placeholder={t('summaryPh') ?? 'Summary'}  required />
            <textarea name="content" className="adm-textarea" placeholder={t('contentPh') ?? 'Content'} rows={6} required />
            <div className="adm-row">
              <select name="category" className="adm-select" required>
                <option value="">{t('selectCategory') ?? 'Category…'}</option>
                {categories.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
              </select>
              <input name="date" type="date" className="adm-input" required />
            </div>
            <div>
              <label className="adm-label">{t('imageLabel') ?? 'Cover image'}</label>
              <input name="image" type="file" accept="image/*" className="adm-input" />
            </div>
            <FAQEditor />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--adm-ink-soft)' }}>
              <input type="checkbox" name="featured" value="true" />
              <span>{t('featured') ?? 'Featured'}</span>
            </label>
            <button type="submit" className="adm-btn">{t('publishArticle') ?? 'Publish'}</button>
          </form>
          <div style={{ marginTop: 16 }}>
            <ImageUploader />
          </div>
        </section>

        {/* Articles list */}
        <section className="adm-card">
          <div className="adm-card-head">
            <h3 className="adm-card-title">{t('articlesHeading', { n: articles?.length || 0 }) ?? `Articles (${articles?.length || 0})`}</h3>
          </div>
          <div className="adm-row-list">
            {articles?.length === 0 && <p style={{ color: 'var(--adm-ink-mute)', fontSize: 13 }}>No articles yet.</p>}
            {articles?.map((a) => (
              <div key={a.id} className="adm-row-item">
                <div className="adm-row-item-left">
                  {a.image_url ? <img src={a.image_url} alt={a.title || 'Article thumbnail'} /> : <div className="adm-thumb">📰</div>}
                  <div className="adm-row-item-text">
                    <strong>{a.title}</strong>
                    <small>{catLabel(a.category)} · {a.date}</small>
                  </div>
                </div>
                <div className="adm-row-item-actions">
                  <Link href={`/console-x7k9/edit/${a.id}` as any} className="adm-link">{t('edit') ?? 'Edit'}</Link>
                  <form action={deleteArticle}>
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="adm-link adm-link--danger" style={{ background: 'none', border: 0, cursor: 'pointer' }}>
                      {t('del') ?? 'Delete'}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
