// Edit a single universities row.
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { updateUniversity } from '../../../actions.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

const UNI_TYPES = [
  'universität', 'applied_sciences', 'art', 'music', 'dual',
  'technical', 'medical', 'theological', 'pedagogical', 'other',
] as const

const BUNDESLAENDER = [
  'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
  'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
  'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
  'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen',
] as const

export default async function EditUniversityPage({ params }: { params: Promise<{ id: string; locale: AppLocale }> }) {
  const { id, locale } = await params
  const { data: u } = await supabase
    .from('universities')
    .select('*')
    .eq('id', id)
    .single()

  if (!u) redirect(`/${locale}/console-x7k9/unis`)

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Edit university</h1>
          <p className="adm-page-sub">{u.name_de} <span style={{ color: 'var(--adm-ink-mute)' }}>· {u.id}</span></p>
        </div>
        <Link href="/console-x7k9/unis" className="adm-btn adm-btn--ghost">← Back to universities</Link>
      </header>

      <div style={{ maxWidth: 820 }}>
        <div className="adm-card">
          <form action={updateUniversity} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="hidden" name="id" value={u.id} />

            <div className="adm-row">
              <input name="name_de" className="adm-input" defaultValue={u.name_de || ''} placeholder="Name (German)" required />
              <input name="name_en" className="adm-input" defaultValue={u.name_en || ''} placeholder="Name (English)" />
            </div>
            <div className="adm-row">
              <input name="name_ar" className="adm-input" defaultValue={u.name_ar || ''} placeholder="الاسم بالعربية" dir="rtl" />
              <input name="name_fr" className="adm-input" defaultValue={u.name_fr || ''} placeholder="Nom (Français)" />
            </div>

            <div className="adm-row">
              <input name="city" className="adm-input" defaultValue={u.city || ''} placeholder="City" />
              <select name="state" className="adm-select" defaultValue={u.state || ''}>
                <option value="">Bundesland…</option>
                {BUNDESLAENDER.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select name="type" className="adm-select" defaultValue={u.type || 'universität'}>
                {UNI_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="adm-row">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" name="is_public" value="true" defaultChecked={u.is_public !== false} />
                <span>Public (tuition-free)</span>
              </label>
              <input name="founded"       className="adm-input" type="number" defaultValue={u.founded ?? ''}       placeholder="Founded" min="1000" max="2100" />
              <input name="student_count" className="adm-input" type="number" defaultValue={u.student_count ?? ''} placeholder="Students" min="0" />
            </div>

            <input name="website" className="adm-input" defaultValue={u.website || ''} placeholder="Website" dir="ltr" />

            <div className="adm-row">
              <input name="lat" className="adm-input" type="number" step="any" defaultValue={u.lat ?? ''} placeholder="Latitude" />
              <input name="lng" className="adm-input" type="number" step="any" defaultValue={u.lng ?? ''} placeholder="Longitude" />
            </div>

            <details style={{ borderTop: '1px solid var(--adm-line)', paddingTop: 12 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Descriptions</summary>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                <textarea name="description_de" className="adm-textarea" rows={3} defaultValue={u.description_de || ''} placeholder="Beschreibung (DE)" />
                <textarea name="description_en" className="adm-textarea" rows={3} defaultValue={u.description_en || ''} placeholder="Description (EN)" />
                <textarea name="description_ar" className="adm-textarea" rows={3} defaultValue={u.description_ar || ''} placeholder="الوصف (AR)" dir="rtl" />
                <textarea name="description_fr" className="adm-textarea" rows={3} defaultValue={u.description_fr || ''} placeholder="Description (FR)" />
              </div>
            </details>

            <div>
              <label className="adm-label">Logo</label>
              {u.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={u.logo_url} alt="current logo" style={{ width: 120, height: 120, objectFit: 'contain', background: 'var(--adm-bg-soft)', borderRadius: 8, padding: 8, marginBottom: 8, display: 'block' }} />
              )}
              <input name="logo" type="file" accept="image/*" className="adm-input" />
              <small style={{ fontSize: 12, color: 'var(--adm-ink-mute)' }}>Leave empty to keep the current logo.</small>
            </div>

            <button type="submit" className="adm-btn">Save changes</button>
          </form>
        </div>
      </div>
    </>
  )
}
