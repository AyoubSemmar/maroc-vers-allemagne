// Admin: community apartment listings — post a new one and moderate existing.
import { getTranslations } from 'next-intl/server'
import { createClient } from '@supabase/supabase-js'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { addListing, deleteListing } from '../actions.js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export default async function AdminListingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ err?: string; ok?: string }>
}) {
  const { locale } = await params
  const { err, ok } = await searchParams
  const t = await getTranslations({ locale, namespace: 'admin' })

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, city, type, price, created_at, image_url')
    .order('created_at', { ascending: false })

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Listings</h1>
          <p className="adm-page-sub">Post and moderate community apartment listings.</p>
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
          <strong>✓ Listing published</strong>
          <div style={{ marginTop: 6 }}>Scroll down to see it in the list.</div>
        </div>
      )}

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
            <input name="whatsapp" className="adm-input" placeholder="+212 6XX XX XX XX  or  +49 1XX XXXXXXX" required dir="ltr" />
            <p style={{ fontSize: 11, color: 'var(--adm-ink-mute)', marginTop: 4 }}>
              This is the number users will see and contact for this specific listing. It can be different from your own.
            </p>
          </div>

          <div>
            <label className="adm-label">Anmeldung allowed at this address?</label>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, marginTop: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><input type="radio" name="with_anmeldung" value="true" /> ✅ With Anmeldung</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><input type="radio" name="with_anmeldung" value="false" /> ❌ Without Anmeldung</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><input type="radio" name="with_anmeldung" value="" defaultChecked /> ❔ Not specified</label>
            </div>
          </div>

          <div>
            <label className="adm-label">Tenant gender preference</label>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, marginTop: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><input type="radio" name="gender_target" value="any" defaultChecked /> 🧑‍🤝‍🧑 Any (mixed)</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><input type="radio" name="gender_target" value="male" /> 👨 Men only</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><input type="radio" name="gender_target" value="female" /> 👩 Women only</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><input type="radio" name="gender_target" value="" /> ❔ Not specified</label>
            </div>
          </div>

          <div>
            <label className="adm-label">Images (you can select multiple — first one becomes the cover)</label>
            <input name="images" type="file" accept="image/*" multiple className="adm-input" />
          </div>

          <button type="submit" className="adm-btn">📋 Publish listing</button>
        </form>
      </section>

      {/* Listings list */}
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
                  <small>{l.type} · {l.city}{l.price ? ` · ${l.price} €` : ''}</small>
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
