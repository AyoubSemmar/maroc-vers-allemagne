// Articles + community Listings management. Renders inside AdminShell
// (the admin layout handles auth gating).
import { getTranslations } from 'next-intl/server'
import { createClient } from '@supabase/supabase-js'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { addArticle, addListing, deleteArticle, deleteListing } from '../actions.js'
import ImageUploader from '@/components/ImageUploader'
import FAQEditor from '@/components/FAQEditor'
import AdminAiArticleGenerator from '@/components/AdminAiArticleGenerator'
import AdminSocialPostGenerator from '@/components/AdminSocialPostGenerator'
import AdminLessonGenerator from '@/components/AdminLessonGenerator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

const categories = [
  'البنوك', 'شرائح الاتصال', 'السكن',
  'الجامعات', 'العمل', 'Ausbildung', 'التأشيرة والأوراق',
]

export default async function AdminContentPage({
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

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, city, type, price, created_at, image_url')
    .order('created_at', { ascending: false })

  const catLabel = (c: string) => { try { return tCat(c as any) } catch { return c } }

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Articles &amp; community listings</h1>
          <p className="adm-page-sub">Publish blog content and moderate apartment listings posted by the community.</p>
        </div>
      </header>

      {err && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          color: '#7f1d1d',
          borderRadius: 12,
          padding: '12px 16px',
          marginTop: 16,
          fontSize: 14,
          fontFamily: 'monospace',
        }}>
          <strong>⚠ Publish failed</strong>
          <div style={{ marginTop: 6 }}>{err}</div>
        </div>
      )}

      {ok && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #86efac',
          color: '#14532d',
          borderRadius: 12,
          padding: '12px 16px',
          marginTop: 16,
          fontSize: 14,
        }}>
          <strong>✓ {ok === 'listing' ? 'Listing published' : 'Saved'}</strong>
          <div style={{ marginTop: 6 }}>Scroll down to see it in the list.</div>
        </div>
      )}

      <AdminAiArticleGenerator />
      <AdminSocialPostGenerator />
      <AdminLessonGenerator />

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

      {/* Add listing form */}
      <section className="adm-card" style={{ marginTop: 18 }}>
        <div className="adm-card-head">
          <h3 className="adm-card-title">Post a new apartment listing</h3>
          <span style={{ fontSize: 12, color: 'var(--adm-ink-mute)' }}>WhatsApp number can be anyone&rsquo;s — your own or a third party&rsquo;s</span>
        </div>
        <form action={addListing} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input name="title" className="adm-input" placeholder="Title (e.g. ‘Furnished room near TU Munich’)" required />
          <textarea name="description" className="adm-textarea" placeholder="Description — neighbourhood, bills, deposit, who it suits…" rows={5} required />

          <div className="adm-row">
            <div>
              <label className="adm-label">City</label>
              <input name="city" className="adm-input" placeholder="München / Berlin / …" required />
            </div>
            <div>
              <label className="adm-label">Type</label>
              <select name="type" className="adm-select" defaultValue="شقة">
                <option value="شقة">Apartment / شقة</option>
                <option value="غرفة">Room / غرفة</option>
              </select>
            </div>
            <div>
              <label className="adm-label">Price (€/mo)</label>
              <input name="price" type="number" min="0" className="adm-input" placeholder="Optional" />
            </div>
          </div>

          <div>
            <label className="adm-label">WhatsApp number (with country code — e.g. +212600000000 or +491701234567)</label>
            <input
              name="whatsapp"
              className="adm-input"
              placeholder="+212 6XX XX XX XX  or  +49 1XX XXXXXXX"
              required
              dir="ltr"
            />
            <p style={{ fontSize: 11, color: 'var(--adm-ink-mute)', marginTop: 4 }}>
              This is the number users will see and contact for this specific listing. It can be different from your own.
            </p>
          </div>

          <div>
            <label className="adm-label">Anmeldung allowed at this address?</label>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, marginTop: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="with_anmeldung" value="true" /> ✅ With Anmeldung
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="with_anmeldung" value="false" /> ❌ Without Anmeldung
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="with_anmeldung" value="" defaultChecked /> ❔ Not specified
              </label>
            </div>
            <p style={{ fontSize: 11, color: 'var(--adm-ink-mute)', marginTop: 4 }}>
              Anmeldung = the city-hall residence registration tenants need
              for visa, bank, and tax purposes. Many sublets don&rsquo;t allow
              it — confirm with the lister before posting.
            </p>
          </div>

          <div>
            <label className="adm-label">Tenant gender preference</label>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, marginTop: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="gender_target" value="any" defaultChecked /> 🧑‍🤝‍🧑 Any (mixed)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="gender_target" value="male" /> 👨 Men only
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="gender_target" value="female" /> 👩 Women only
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="gender_target" value="" /> ❔ Not specified
              </label>
            </div>
            <p style={{ fontSize: 11, color: 'var(--adm-ink-mute)', marginTop: 4 }}>
              Frauen-WGs and Männer-WGs are common in Germany — surface this
              up-front so tenants don&rsquo;t waste time on a place that can&rsquo;t
              accept them.
            </p>
          </div>

          <div>
            <label className="adm-label">Images (you can select multiple — first one becomes the cover)</label>
            <input name="images" type="file" accept="image/*" multiple className="adm-input" />
          </div>

          <button type="submit" className="adm-btn">📋 Publish listing</button>
        </form>
      </section>

      {/* Listings — full width below */}
      <section className="adm-card" style={{ marginTop: 18 }}>
        <div className="adm-card-head">
          <h3 className="adm-card-title">{t('listingsHeading', { n: listings?.length || 0 }) ?? `Apartment listings (${listings?.length || 0})`}</h3>
        </div>
        <div className="adm-row-list">
          {listings?.length === 0 && <p style={{ color: 'var(--adm-ink-mute)', fontSize: 13 }}>{t('listingsEmpty') ?? 'No listings yet.'}</p>}
          {listings?.map((l) => (
            <div key={l.id} className="adm-row-item">
              <div className="adm-row-item-left">
                {l.image_url ? <img src={l.image_url} alt="" /> : <div className="adm-thumb">🏠</div>}
                <div className="adm-row-item-text">
                  <strong>{l.title}</strong>
                  <small>
                    {l.type} · {l.city}
                    {l.price ? ` · ${l.price} €` : ''}
                  </small>
                </div>
              </div>
              <div className="adm-row-item-actions">
                <Link href={`/listings/${l.id}` as any} className="adm-link">{t('view') ?? 'View'}</Link>
                <form action={deleteListing}>
                  <input type="hidden" name="id" value={l.id} />
                  <button type="submit" className="adm-link adm-link--danger" style={{ background: 'none', border: 0, cursor: 'pointer' }}>
                    {t('del') ?? 'Delete'}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
