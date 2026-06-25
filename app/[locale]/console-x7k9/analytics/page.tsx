// Admin: first-party website analytics from Supabase (pageviews + searches
// recorded by /api/track). No GA, no cookies. Vercel's own analytics remains
// available as the secondary visual dashboard (linked below).
import { createClient } from '@supabase/supabase-js'
import type { AppLocale } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

async function rpc<T = any>(fn: string, args: Record<string, any>): Promise<T[]> {
  try { const { data } = await sb.rpc(fn, args); return (data ?? []) as T[] } catch { return [] }
}
async function count(filter: (q: any) => any): Promise<number> {
  try {
    const { count } = await filter(sb.from('analytics_events').select('*', { count: 'exact', head: true }))
    return count ?? 0
  } catch { return 0 }
}
function iso(d: number) { const x = new Date(); x.setUTCDate(x.getUTCDate() - d); return x.toISOString() }

function Bars({ data }: { data: { k: string; v: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.v))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 56 }}>
      {data.map((d) => (
        <div key={d.k} title={`${d.k}: ${d.v}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ height: `${(d.v / max) * 100}%`, minHeight: d.v > 0 ? 2 : 0, background: 'var(--adm-brand)', borderRadius: 2, opacity: 0.85 }} />
        </div>
      ))}
    </div>
  )
}

function Table({ rows, col1, col2 }: { rows: { a: string; b: number }[]; col1: string; col2: string }) {
  if (rows.length === 0) return <p style={{ color: 'var(--adm-ink-mute)', fontSize: 13 }}>No data yet.</p>
  const max = Math.max(1, ...rows.map((r) => r.b))
  return (
    <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderTop: i ? '1px solid #eef0f4' : 'none' }}>
            <td style={{ padding: '7px 6px', maxWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.a}>{r.a}</td>
            <td style={{ padding: '7px 6px', width: 120 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: '#eef0f4', borderRadius: 999 }}><div style={{ width: `${(r.b / max) * 100}%`, height: '100%', background: 'var(--adm-brand)', borderRadius: 999 }} /></div>
                <span style={{ fontWeight: 700, width: 40, textAlign: 'right' }}>{r.b.toLocaleString()}</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default async function AdminAnalyticsPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  await params

  const [
    viewsToday, views7d, views30d, searches30d,
    topPages, topTerms, daily, topLocales, topRefs,
  ] = await Promise.all([
    count((q) => q.eq('type', 'pageview').gte('created_at', new Date().toISOString().slice(0, 10))),
    count((q) => q.eq('type', 'pageview').gte('created_at', iso(7))),
    count((q) => q.eq('type', 'pageview').gte('created_at', iso(30))),
    count((q) => q.eq('type', 'search').gte('created_at', iso(30))),
    rpc('analytics_top_pages', { p_days: 30, p_limit: 15 }),
    rpc('analytics_top_terms', { p_days: 30, p_limit: 20 }),
    rpc('analytics_daily', { p_days: 30 }),
    rpc('analytics_top_dim', { p_dim: 'locale', p_days: 30, p_limit: 12 }),
    rpc('analytics_top_dim', { p_dim: 'ref', p_days: 30, p_limit: 10 }),
  ])

  // Build a 30-day daily series (fill gaps with 0).
  const days = [...Array(30)].map((_, i) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - (29 - i)); return d.toISOString().slice(0, 10) })
  const dailyMap = new Map<string, number>(daily.map((r: any) => [String(r.day).slice(0, 10), Number(r.views)]))
  const dailyBars = days.map((k) => ({ k, v: dailyMap.get(k) ?? 0 }))

  const noData = views30d === 0 && searches30d === 0

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Website analytics</h1>
          <p className="adm-page-sub">First-party traffic from your own database — no cookies, no Google. Pageviews and searches are recorded as visitors browse.</p>
        </div>
        <a href="https://vercel.com/analytics" target="_blank" rel="noreferrer" className="adm-btn adm-btn--ghost">Vercel Analytics ↗</a>
      </header>

      {noData && (
        <div className="adm-banner adm-banner--warn">
          ⚠ No analytics yet. If this stays empty after some traffic, run <code>db/migrations/2026-06-25_analytics.sql</code> in the Supabase SQL editor to create the events table.
        </div>
      )}

      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--brand"><div className="adm-kpi-label">Pageviews today</div><div className="adm-kpi-value">{viewsToday.toLocaleString()}</div><div className="adm-kpi-sub">UTC</div></div>
        <div className="adm-kpi adm-kpi--blue"><div className="adm-kpi-label">Pageviews · 7d</div><div className="adm-kpi-value">{views7d.toLocaleString()}</div></div>
        <div className="adm-kpi adm-kpi--violet"><div className="adm-kpi-label">Pageviews · 30d</div><div className="adm-kpi-value">{views30d.toLocaleString()}</div></div>
        <div className="adm-kpi adm-kpi--green"><div className="adm-kpi-label">Searches · 30d</div><div className="adm-kpi-value">{searches30d.toLocaleString()}</div></div>
      </div>

      <section className="adm-card" style={{ marginTop: 8 }}>
        <div className="adm-card-head"><h3 className="adm-card-title">Pageviews · last 30 days</h3><span className="adm-card-link">{views30d.toLocaleString()} total</span></div>
        <Bars data={dailyBars} />
      </section>

      <div className="adm-grid-2" style={{ marginTop: 8 }}>
        <section className="adm-card">
          <div className="adm-card-head"><h3 className="adm-card-title">🔥 Most-visited pages (30d)</h3></div>
          <Table rows={topPages.map((p: any) => ({ a: p.path, b: Number(p.views) }))} col1="Page" col2="Views" />
        </section>
        <section className="adm-card">
          <div className="adm-card-head"><h3 className="adm-card-title">🔎 Top searches (30d)</h3></div>
          <Table rows={topTerms.map((t: any) => ({ a: t.term, b: Number(t.searches) }))} col1="Term" col2="Searches" />
        </section>
      </div>

      <div className="adm-grid-2" style={{ marginTop: 8 }}>
        <section className="adm-card">
          <div className="adm-card-head"><h3 className="adm-card-title">🌐 Top languages (30d)</h3></div>
          <Table rows={topLocales.map((r: any) => ({ a: r.label, b: Number(r.views) }))} col1="Locale" col2="Views" />
        </section>
        <section className="adm-card">
          <div className="adm-card-head"><h3 className="adm-card-title">↩ Top referrers (30d)</h3></div>
          <Table rows={topRefs.map((r: any) => ({ a: r.label, b: Number(r.views) }))} col1="Referrer" col2="Views" />
        </section>
      </div>
    </>
  )
}
