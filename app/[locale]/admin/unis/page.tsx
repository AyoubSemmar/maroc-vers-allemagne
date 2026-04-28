// Universities directory snapshot.
import { createClient } from '@supabase/supabase-js'
import type { AppLocale } from '@/i18n/routing'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export default async function AdminUnisPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  await params

  const [{ count: total }, { count: pub }, { count: priv }] = await Promise.all([
    supabase.from('universities').select('*', { count: 'exact', head: true }),
    supabase.from('universities').select('*', { count: 'exact', head: true }).eq('is_public', true),
    supabase.from('universities').select('*', { count: 'exact', head: true }).eq('is_public', false),
  ])

  // State distribution
  const { data: rows } = await supabase
    .from('universities').select('state').limit(2000)
  const byState: Record<string, number> = {}
  for (const r of rows || []) {
    const s = r.state || '—'
    byState[s] = (byState[s] || 0) + 1
  }
  const sorted = Object.entries(byState).sort((a, b) => b[1] - a[1]).slice(0, 16)

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Universities</h1>
          <p className="adm-page-sub">German university directory. Logos pre-cached in <code>/public/uni-logos/</code>. Edit data via Supabase or the import scripts.</p>
        </div>
      </header>

      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--brand">
          <div className="adm-kpi-label">Total universities</div>
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

      <section className="adm-card">
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
