// Ausbildung jobs — quick stats + Supabase shortcuts.
import { createClient } from '@supabase/supabase-js'
import type { AppLocale } from '@/i18n/routing'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export default async function AdminJobsPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  await params

  const { count: total } = await supabase
    .from('ausbildung_jobs').select('*', { count: 'exact', head: true })

  // Manual category aggregation — small enough to do client-side.
  const { data: rows } = await supabase
    .from('ausbildung_jobs')
    .select('category')
    .limit(2000)

  const counts: Record<string, number> = {}
  for (const r of rows || []) counts[r.category] = (counts[r.category] || 0) + 1
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Ausbildung jobs</h1>
          <p className="adm-page-sub">Snapshot of the goausbildung-imported job pool. Add new categories via SQL migration; import new batches via <code>scripts/import_goausbildung.mjs</code>.</p>
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

      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--brand">
          <div className="adm-kpi-label">Total offers</div>
          <div className="adm-kpi-value">{(total || 0).toLocaleString()}</div>
          <div className="adm-kpi-sub">Including unenriched + enriched</div>
        </div>
        <div className="adm-kpi adm-kpi--blue">
          <div className="adm-kpi-label">Categories</div>
          <div className="adm-kpi-value">{Object.keys(counts).length}</div>
          <div className="adm-kpi-sub">Healthcare, IT, Handwerk, …</div>
        </div>
      </div>

      <section className="adm-card">
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
