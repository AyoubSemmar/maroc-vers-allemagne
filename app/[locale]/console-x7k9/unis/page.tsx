// Universities — admin CRUD on top of the seeded directory.
import { createClient } from '@supabase/supabase-js'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { addUniversity, deleteUniversity } from '../actions.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

const UNI_TYPES = [
  'universität',
  'applied_sciences',
  'art',
  'music',
  'dual',
  'technical',
  'medical',
  'theological',
  'pedagogical',
  'other',
] as const

const BUNDESLAENDER = [
  'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
  'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
  'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
  'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen',
] as const

export default async function AdminUnisPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  await params

  const [{ count: total }, { count: pub }, { count: priv }, { data: stateRows }, { data: recent }] = await Promise.all([
    supabase.from('universities').select('*', { count: 'exact', head: true }),
    supabase.from('universities').select('*', { count: 'exact', head: true }).eq('is_public', true),
    supabase.from('universities').select('*', { count: 'exact', head: true }).eq('is_public', false),
    supabase.from('universities').select('state').limit(2000),
    supabase
      .from('universities')
      .select('id, name_de, name_en, city, state, type, is_public, logo_url, updated_at')
      .order('updated_at', { ascending: false })
      .limit(100),
  ])

  const byState: Record<string, number> = {}
  for (const r of stateRows || []) {
    const s = r.state || '—'
    byState[s] = (byState[s] || 0) + 1
  }
  const sorted = Object.entries(byState).sort((a, b) => b[1] - a[1]).slice(0, 16)

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Universities</h1>
          <p className="adm-page-sub">German university directory. Add new entries below; logos cache to <code>/public/uni-logos/</code> over time.</p>
        </div>
      </header>

      {/* ── Stats ───────────────────────────────────────────── */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--brand">
          <div className="adm-kpi-label">Total</div>
          <div className="adm-kpi-value">{(total || 0).toLocaleString()}</div>
          <div className="adm-kpi-sub">Across all 16 Bundesländer</div>
        </div>
        <div className="adm-kpi adm-kpi--green">
          <div className="adm-kpi-label">Public</div>
          <div className="adm-kpi-value">{(pub || 0).toLocaleString()}</div>
          <div className="adm-kpi-sub">Tuition-free for international students</div>
        </div>
        <div className="adm-kpi adm-kpi--gold">
          <div className="adm-kpi-label">Private</div>
          <div className="adm-kpi-value">{(priv || 0).toLocaleString()}</div>
          <div className="adm-kpi-sub">Tuition fees apply</div>
        </div>
      </div>

      {/* ── New university form ─────────────────────────────── */}
      <section className="adm-card" style={{ marginTop: 18 }}>
        <div className="adm-card-head"><h3 className="adm-card-title">Add a new university</h3></div>
        <form action={addUniversity} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="adm-row">
            <input name="name_de" className="adm-input" placeholder="Name (German) — required" required />
            <input name="name_en" className="adm-input" placeholder="Name (English)" />
          </div>
          <div className="adm-row">
            <input name="name_ar" className="adm-input" placeholder="الاسم بالعربية" dir="rtl" />
            <input name="name_fr" className="adm-input" placeholder="Nom (Français)" />
          </div>

          <div className="adm-row">
            <input name="city" className="adm-input" placeholder="City" />
            <select name="state" className="adm-select" defaultValue="">
              <option value="">Bundesland…</option>
              {BUNDESLAENDER.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="type" className="adm-select" defaultValue="universität">
              {UNI_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="adm-row">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <input type="checkbox" name="is_public" value="true" defaultChecked />
              <span>Public (tuition-free)</span>
            </label>
            <input name="founded"       className="adm-input" type="number" placeholder="Founded (year)" min="1000" max="2100" />
            <input name="student_count" className="adm-input" type="number" placeholder="Students" min="0" />
          </div>

          <input name="website" className="adm-input" placeholder="Website (https://…)" dir="ltr" />

          <div className="adm-row">
            <input name="lat" className="adm-input" type="number" step="any" placeholder="Latitude (e.g. 52.52)" />
            <input name="lng" className="adm-input" type="number" step="any" placeholder="Longitude (e.g. 13.40)" />
          </div>

          <details style={{ borderTop: '1px solid var(--adm-line)', paddingTop: 12 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Descriptions (per locale, optional)</summary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              <textarea name="description_de" className="adm-textarea" rows={3} placeholder="Beschreibung (DE)" />
              <textarea name="description_en" className="adm-textarea" rows={3} placeholder="Description (EN)" />
              <textarea name="description_ar" className="adm-textarea" rows={3} placeholder="الوصف (AR)" dir="rtl" />
              <textarea name="description_fr" className="adm-textarea" rows={3} placeholder="Description (FR)" />
            </div>
          </details>

          <div>
            <label className="adm-label">Logo (PNG / SVG / JPG)</label>
            <input name="logo" type="file" accept="image/*" className="adm-input" />
          </div>

          <button type="submit" className="adm-btn">Add university</button>
        </form>
      </section>

      {/* ── Recent list ─────────────────────────────────────── */}
      <section className="adm-card" style={{ marginTop: 18 }}>
        <div className="adm-card-head">
          <h3 className="adm-card-title">Recent ({(recent || []).length} of {(total || 0).toLocaleString()})</h3>
          <span style={{ fontSize: 12, color: 'var(--adm-ink-mute)' }}>Most recently updated 100</span>
        </div>
        <div className="adm-row-list">
          {(recent || []).length === 0 && (
            <p style={{ color: 'var(--adm-ink-mute)', fontSize: 13 }}>No universities yet.</p>
          )}
          {(recent || []).map((u) => (
            <div key={u.id} className="adm-row-item">
              <div className="adm-row-item-left">
                {u.logo_url
                  ? <img src={u.logo_url} alt="" />
                  : <div className="adm-thumb">🎓</div>}
                <div className="adm-row-item-text">
                  <strong>{u.name_de}</strong>
                  <small>
                    {u.city ? `${u.city} · ` : ''}{u.state || '—'} · {u.type || 'other'}
                    {u.is_public === false ? ' · Private' : ' · Public'}
                  </small>
                </div>
              </div>
              <div className="adm-row-item-actions">
                <Link href={`/console-x7k9/unis/edit/${u.id}` as any} className="adm-link">Edit</Link>
                <form action={deleteUniversity}>
                  <input type="hidden" name="id" value={u.id} />
                  <button type="submit" className="adm-link adm-link--danger" style={{ background: 'none', border: 0, cursor: 'pointer' }}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Distribution ────────────────────────────────────── */}
      <section className="adm-card" style={{ marginTop: 18 }}>
        <div className="adm-card-head"><h3 className="adm-card-title">Top 16 by state</h3></div>
        <table className="adm-table">
          <thead><tr><th>Bundesland</th><th style={{ textAlign: 'right' }}>Count</th></tr></thead>
          <tbody>
            {sorted.length === 0 && <tr><td colSpan={2} style={{ color: 'var(--adm-ink-mute)' }}>No data yet.</td></tr>}
            {sorted.map(([s, n]) => (
              <tr key={s}>
                <td>{s}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
