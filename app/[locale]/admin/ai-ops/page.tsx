// AI Ops & Costs — daily/weekly usage breakdown across all AI endpoints,
// with current daily limits and dollar estimates.
import { createClient } from '@supabase/supabase-js'
import type { AppLocale } from '@/i18n/routing'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

const COST_PER_CALL = {
  cv: 0.08,
  motivation: 0.05,
  photo: 0.04,
}

const DAILY_LIMIT = {
  cv: 1,
  motivation: 1,
  photo: 2,
}

const TABLES: Record<string, string> = {
  cv: 'cv_enhance_usage',
  motivation: 'motivation_usage',
  photo: 'photo_enhance_usage',
}

const LABEL: Record<string, string> = {
  cv: 'CV-AI improvement',
  motivation: 'Anschreiben generation',
  photo: 'Photo enhancement',
}

async function sumDay(table: string, day: string): Promise<{ users: number; calls: number }> {
  const { data } = await supabase
    .from(table)
    .select('count')
    .eq('day', day)
  if (!data) return { users: 0, calls: 0 }
  return {
    users: data.length,
    calls: data.reduce((s: number, r: any) => s + (r.count || 0), 0),
  }
}

async function sumLastNDays(table: string, n: number): Promise<{ users: number; calls: number }> {
  const start = new Date(); start.setUTCDate(start.getUTCDate() - n + 1)
  const { data } = await supabase
    .from(table)
    .select('user_id, count')
    .gte('day', start.toISOString().slice(0, 10))
  if (!data) return { users: 0, calls: 0 }
  const uniqueUsers = new Set(data.map((r: any) => r.user_id)).size
  const calls = data.reduce((s: number, r: any) => s + (r.count || 0), 0)
  return { users: uniqueUsers, calls }
}

function todayUtc(): string { return new Date().toISOString().slice(0, 10) }

export default async function AdminAiOpsPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  await params

  const features = ['cv', 'motivation', 'photo'] as const

  const today = await Promise.all(features.map(f => sumDay(TABLES[f], todayUtc())))
  const week  = await Promise.all(features.map(f => sumLastNDays(TABLES[f], 7)))
  const month = await Promise.all(features.map(f => sumLastNDays(TABLES[f], 30)))

  const todayTotal = today.reduce((s, r, i) => s + r.calls * (COST_PER_CALL as any)[features[i]], 0)
  const weekTotal  = week .reduce((s, r, i) => s + r.calls * (COST_PER_CALL as any)[features[i]], 0)
  const monthTotal = month.reduce((s, r, i) => s + r.calls * (COST_PER_CALL as any)[features[i]], 0)

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">AI Ops &amp; Costs</h1>
          <p className="adm-page-sub">Per-feature usage from the entitlements ledger, with cost estimates at v1.1 per-call rates. Daily caps enforced server-side; over-cap users fall through to paid credits.</p>
        </div>
        <a href="/cost-report.html" target="_blank" className="adm-btn adm-btn--ghost">📄 Open full cost report</a>
      </header>

      {/* Cost summary */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--brand">
          <div className="adm-kpi-label">Estimated cost today</div>
          <div className="adm-kpi-value">${todayTotal.toFixed(2)}</div>
          <div className="adm-kpi-sub">Live — UTC day in progress</div>
        </div>
        <div className="adm-kpi adm-kpi--gold">
          <div className="adm-kpi-label">Last 7 days</div>
          <div className="adm-kpi-value">${weekTotal.toFixed(2)}</div>
          <div className="adm-kpi-sub">Rolling 7-day window</div>
        </div>
        <div className="adm-kpi adm-kpi--violet">
          <div className="adm-kpi-label">Last 30 days</div>
          <div className="adm-kpi-value">${monthTotal.toFixed(2)}</div>
          <div className="adm-kpi-sub">Approximate monthly run-rate</div>
        </div>
        <div className="adm-kpi adm-kpi--green">
          <div className="adm-kpi-label">Bookings to break even</div>
          <div className="adm-kpi-value">{Math.ceil(monthTotal / 17)}</div>
          <div className="adm-kpi-sub">€16 ≈ $17 each</div>
        </div>
      </div>

      {/* Per-feature table */}
      <section className="adm-card">
        <div className="adm-card-head">
          <h3 className="adm-card-title">Per-feature usage</h3>
          <span style={{ fontSize: 12, color: 'var(--adm-ink-mute)' }}>v1.1 limits applied</span>
        </div>
        <table className="adm-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Daily cap (free)</th>
              <th>Today calls</th>
              <th>Today users</th>
              <th>7d calls</th>
              <th>30d calls</th>
              <th>$/call</th>
              <th>30d cost</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => {
              const cost = (COST_PER_CALL as any)[f]
              return (
                <tr key={f}>
                  <td><strong>{LABEL[f]}</strong></td>
                  <td>{(DAILY_LIMIT as any)[f]} / day</td>
                  <td>{today[i].calls}</td>
                  <td>{today[i].users}</td>
                  <td>{week[i].calls}</td>
                  <td>{month[i].calls}</td>
                  <td>{cost > 0 ? `$${cost.toFixed(3)}` : '—'}</td>
                  <td>{cost > 0 ? `$${(month[i].calls * cost).toFixed(2)}` : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <div className="adm-banner adm-banner--info" style={{ marginTop: 18 }}>
        💡 Reading + writing daily exercises (Haiku) cost ~$0.002/call and aren't tracked in this ledger. They&rsquo;re effectively free at any realistic scale — the local-storage daily lock is enough abuse protection.
      </div>
    </>
  )
}
