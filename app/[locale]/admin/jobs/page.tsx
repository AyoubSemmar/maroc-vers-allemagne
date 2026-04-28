// Ausbildung jobs — admin CRUD on top of the scraped pool. Stats kept at
// the top; below them a "New offer" form and a paginated recent-listings
// table with edit/delete.
import { createClient } from '@supabase/supabase-js'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { addJob, deleteJob } from '../actions.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// 12 buckets from lib/jobCategories — kept inline so this server component
// stays free of client-only imports.
const CATEGORIES = [
  ['hospitality',    'Hospitality & Restauration'],
  ['handwerk',       'Construction & Handwerk'],
  ['it',             'IT'],
  ['healthcare',     'Healthcare'],
  ['logistics',      'Logistics & Transport'],
  ['education',      'Education'],
  ['media',          'Media'],
  ['public_service', 'Public service'],
  ['retail',         'Retail'],
  ['automotive',     'Automotive'],
  ['engineering',    'Engineering'],
  ['finance',        'Finance & Banking'],
] as const

const ANSTELLUNGSARTEN = [
  'Ausbildung',
  'Praktikum',
  'Vollzeit',
  'Teilzeit',
  'Werkstudent',
  'Trainee',
] as const

export default async function AdminJobsPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  await params

  const [{ count: total }, { data: catRows }, { data: recent }] = await Promise.all([
    supabase.from('ausbildung_jobs').select('*', { count: 'exact', head: true }),
    supabase.from('ausbildung_jobs').select('category').limit(2000),
    supabase
      .from('ausbildung_jobs')
      .select('id, title, company, location, category, external_id, published_at, created_at')
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  const counts: Record<string, number> = {}
  for (const r of catRows || []) counts[r.category] = (counts[r.category] || 0) + 1
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Ausbildung jobs</h1>
          <p className="adm-page-sub">Manage manually-added offers alongside the scraped pool. Bulk import &amp; daily cleanup still live in <code>scripts/</code>.</p>
        </div>
        <a
          href={`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('.supabase.co', '.supabase.com')}/project/_/editor`}
          target="_blank"
          rel="noopener noreferrer"
          className="adm-btn adm-btn--ghost"
        >
          Open Supabase →
        </a>
      </header>

      {/* ── Stats ───────────────────────────────────────────── */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--brand">
          <div className="adm-kpi-label">Total offers</div>
          <div className="adm-kpi-value">{(total || 0).toLocaleString()}</div>
          <div className="adm-kpi-sub">Scraped + manual entries</div>
        </div>
        <div className="adm-kpi adm-kpi--blue">
          <div className="adm-kpi-label">Categories in use</div>
          <div className="adm-kpi-value">{Object.keys(counts).length}</div>
          <div className="adm-kpi-sub">Out of {CATEGORIES.length} configured</div>
        </div>
      </div>

      {/* ── New offer form ──────────────────────────────────── */}
      <section className="adm-card" style={{ marginTop: 18 }}>
        <div className="adm-card-head"><h3 className="adm-card-title">Add a new offer</h3></div>
        <form action={addJob} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="adm-row">
            <input name="title"   className="adm-input" placeholder="Title (e.g. ‘Ausbildung zum Fachinformatiker’)" required />
            <input name="company" className="adm-input" placeholder="Company" required />
          </div>
          <div className="adm-row">
            <input name="location" className="adm-input" placeholder="Location (city / region)" />
            <select name="category" className="adm-select" required defaultValue="">
              <option value="" disabled>Category…</option>
              {CATEGORIES.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
            </select>
            <select name="anstellungsart" className="adm-select" defaultValue="Ausbildung">
              {ANSTELLUNGSARTEN.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <textarea name="description" className="adm-textarea" rows={5} placeholder="Description (markdown supported — what the role is, who it suits…)" />
          <div className="adm-row">
            <input name="apply_url"     className="adm-input" placeholder="Application URL" dir="ltr" />
            <input name="contact_email" className="adm-input" placeholder="Contact email"    dir="ltr" type="email" />
            <input name="phone"         className="adm-input" placeholder="Phone (e.g. +49 …)" dir="ltr" />
          </div>
          <small style={{ color: 'var(--adm-ink-mute)', fontSize: 12 }}>
            At least ONE of: application URL, contact email, or phone is required — otherwise users have no way to apply.
          </small>
          <div className="adm-row">
            <input name="external_url"  className="adm-input" placeholder="External URL (optional — original posting)" dir="ltr" />
            <input name="published_at"  className="adm-input" type="date" />
          </div>
          <button type="submit" className="adm-btn">Publish offer</button>
        </form>
      </section>

      {/* ── Recent offers list ──────────────────────────────── */}
      <section className="adm-card" style={{ marginTop: 18 }}>
        <div className="adm-card-head">
          <h3 className="adm-card-title">Recent offers ({(recent || []).length} of {(total || 0).toLocaleString()})</h3>
          <span style={{ fontSize: 12, color: 'var(--adm-ink-mute)' }}>Newest 100 — search via the Supabase editor for older entries</span>
        </div>
        <div className="adm-row-list">
          {(recent || []).length === 0 && (
            <p style={{ color: 'var(--adm-ink-mute)', fontSize: 13 }}>No offers yet.</p>
          )}
          {(recent || []).map((j) => {
            const isManual = typeof j.external_id === 'string' && j.external_id.startsWith('manual-')
            return (
              <div key={j.id} className="adm-row-item">
                <div className="adm-row-item-left">
                  <div className="adm-thumb">{isManual ? '✏️' : '🤖'}</div>
                  <div className="adm-row-item-text">
                    <strong>{j.title}</strong>
                    <small>
                      {j.company}
                      {j.location ? ` · ${j.location}` : ''}
                      {' · '}{j.category}
                    </small>
                  </div>
                </div>
                <div className="adm-row-item-actions">
                  <Link href={`/admin/jobs/edit/${j.id}` as any} className="adm-link">Edit</Link>
                  <form action={deleteJob}>
                    <input type="hidden" name="id" value={j.id} />
                    <button type="submit" className="adm-link adm-link--danger" style={{ background: 'none', border: 0, cursor: 'pointer' }}>
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Distribution ────────────────────────────────────── */}
      <section className="adm-card" style={{ marginTop: 18 }}>
        <div className="adm-card-head"><h3 className="adm-card-title">Distribution by category</h3></div>
        <table className="adm-table">
          <thead><tr><th>Category</th><th style={{ textAlign: 'right' }}>Offers</th></tr></thead>
          <tbody>
            {sorted.length === 0 && <tr><td colSpan={2} style={{ color: 'var(--adm-ink-mute)' }}>No data yet.</td></tr>}
            {sorted.map(([cat, n]) => (
              <tr key={cat}>
                <td>{cat}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="adm-banner adm-banner--info" style={{ marginTop: 18 }}>
        💡 Bulk operations (import, translate, dedupe, daily cleanup) run from the local terminal in <code>scripts/</code>. See the project README for commands.
      </div>
    </>
  )
}
