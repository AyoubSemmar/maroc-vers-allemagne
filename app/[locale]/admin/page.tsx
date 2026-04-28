// Admin overview — KPIs, recent activity, quick links. Auth is handled
// by app/[locale]/admin/layout.tsx; this file just renders content.
import { createClient } from '@supabase/supabase-js'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

async function count(table: string, filter?: { col: string; gte: string }): Promise<number> {
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  if (filter) q = q.gte(filter.col, filter.gte) as any
  const { count, error } = await q
  if (error) return 0
  return count ?? 0
}

function todayUtc(): string { return new Date().toISOString().slice(0, 10) }
function isoNDaysAgo(n: number): string {
  const d = new Date(); d.setUTCDate(d.getUTCDate() - n)
  return d.toISOString()
}

export default async function AdminOverviewPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  await params

  // Counts in parallel — small queries against the main tables.
  const [
    articlesTotal, listingsTotal, jobsTotal, unisTotal,
    profilesTotal, savedTotal,
    cvCallsToday, anschreibenCallsToday, photoCallsToday,
    readingCallsToday, writingCallsToday,
    profilesLast7d, listingsLast7d,
  ] = await Promise.all([
    count('articles'),
    count('listings'),
    count('ausbildung_jobs'),
    count('universities'),
    count('profiles'),
    count('user_saves'),
    count('cv_enhance_usage', { col: 'day', gte: todayUtc() }),
    count('motivation_usage', { col: 'day', gte: todayUtc() }),
    count('photo_enhance_usage', { col: 'day', gte: todayUtc() }),
    count('reading_exercise_usage', { col: 'day', gte: todayUtc() }),
    count('writing_exercise_usage', { col: 'day', gte: todayUtc() }),
    count('profiles', { col: 'created_at', gte: isoNDaysAgo(7) }),
    count('listings', { col: 'created_at', gte: isoNDaysAgo(7) }),
  ])

  // Estimated daily AI cost (matches cost-report.html v1.1)
  const estCostToday =
    cvCallsToday * 0.08 +
    anschreibenCallsToday * 0.05 +
    photoCallsToday * 0.04 +
    (readingCallsToday + writingCallsToday) * 0.002

  // Recent items
  const { data: recentListings } = await supabase
    .from('listings')
    .select('id, title, city, price, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentProfiles } = await supabase
    .from('profiles')
    .select('user_id, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Overview</h1>
          <p className="adm-page-sub">Real-time pulse of the platform — content, traffic, AI usage and costs. All numbers update on page reload.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/users" className="adm-btn adm-btn--ghost">Manage users →</Link>
          <Link href="/admin/ai-ops" className="adm-btn">AI Ops →</Link>
        </div>
      </header>

      {/* KPI tiles */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--brand">
          <div className="adm-kpi-label">Total users</div>
          <div className="adm-kpi-value">{profilesTotal.toLocaleString()}</div>
          <div className="adm-kpi-sub">+{profilesLast7d} in the last 7 days</div>
        </div>
        <div className="adm-kpi adm-kpi--green">
          <div className="adm-kpi-label">Saved opportunities</div>
          <div className="adm-kpi-value">{savedTotal.toLocaleString()}</div>
          <div className="adm-kpi-sub">University + Ausbildung bookmarks</div>
        </div>
        <div className="adm-kpi adm-kpi--blue">
          <div className="adm-kpi-label">Articles</div>
          <div className="adm-kpi-value">{articlesTotal.toLocaleString()}</div>
          <div className="adm-kpi-sub">Across all categories</div>
        </div>
        <div className="adm-kpi adm-kpi--gold">
          <div className="adm-kpi-label">Apartment listings</div>
          <div className="adm-kpi-value">{listingsTotal.toLocaleString()}</div>
          <div className="adm-kpi-sub">+{listingsLast7d} in the last 7 days</div>
        </div>
        <div className="adm-kpi adm-kpi--violet">
          <div className="adm-kpi-label">Ausbildung offers</div>
          <div className="adm-kpi-value">{jobsTotal.toLocaleString()}</div>
          <div className="adm-kpi-sub">Indexed jobs from goausbildung</div>
        </div>
        <div className="adm-kpi">
          <div className="adm-kpi-label">Universities</div>
          <div className="adm-kpi-value">{unisTotal.toLocaleString()}</div>
          <div className="adm-kpi-sub">Public + private institutions</div>
        </div>
      </div>

      {/* AI usage today */}
      <header className="adm-page-head" style={{ marginTop: 8 }}>
        <div>
          <h2 className="adm-page-title" style={{ fontSize: 18 }}>AI usage today (UTC)</h2>
          <p className="adm-page-sub">Live count from the entitlements usage tables. Estimated cost based on v1.1 per-call rates.</p>
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--adm-brand)' }}>
          ≈ ${estCostToday.toFixed(2)}
        </div>
      </header>
      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--red">
          <div className="adm-kpi-label">CV-AI calls</div>
          <div className="adm-kpi-value">{cvCallsToday}</div>
          <div className="adm-kpi-sub">Sonnet · $0.08 each</div>
        </div>
        <div className="adm-kpi adm-kpi--red">
          <div className="adm-kpi-label">Anschreiben calls</div>
          <div className="adm-kpi-value">{anschreibenCallsToday}</div>
          <div className="adm-kpi-sub">Sonnet · $0.05 each</div>
        </div>
        <div className="adm-kpi adm-kpi--blue">
          <div className="adm-kpi-label">Photo enhancements</div>
          <div className="adm-kpi-value">{photoCallsToday}</div>
          <div className="adm-kpi-sub">Replicate · $0.04 each</div>
        </div>
        <div className="adm-kpi adm-kpi--green">
          <div className="adm-kpi-label">Lesen exercises</div>
          <div className="adm-kpi-value">{readingCallsToday}</div>
          <div className="adm-kpi-sub">Haiku · $0.002 each</div>
        </div>
        <div className="adm-kpi adm-kpi--green">
          <div className="adm-kpi-label">Schreiben exercises</div>
          <div className="adm-kpi-value">{writingCallsToday}</div>
          <div className="adm-kpi-sub">Haiku · $0.002 each</div>
        </div>
      </div>

      {/* Two columns: recent listings + recent users */}
      <div className="adm-grid-2" style={{ marginTop: 8 }}>
        <section className="adm-card">
          <div className="adm-card-head">
            <h3 className="adm-card-title">Latest apartment listings</h3>
            <Link href="/admin/content" className="adm-card-link">Manage all →</Link>
          </div>
          <div className="adm-row-list">
            {recentListings?.length === 0 && <p style={{ color: 'var(--adm-ink-mute)', fontSize: 13 }}>No recent listings.</p>}
            {recentListings?.map((l: any) => (
              <div key={l.id} className="adm-row-item">
                <div className="adm-row-item-left">
                  <div className="adm-thumb">🏠</div>
                  <div className="adm-row-item-text">
                    <strong>{l.title}</strong>
                    <small>{l.city}{l.price ? ` · ${l.price} €` : ''} · {new Date(l.created_at).toLocaleDateString()}</small>
                  </div>
                </div>
                <Link href={`/listings/${l.id}` as any} className="adm-link">View →</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h3 className="adm-card-title">Latest user signups</h3>
            <Link href="/admin/users" className="adm-card-link">Manage users →</Link>
          </div>
          <div className="adm-row-list">
            {recentProfiles?.length === 0 && <p style={{ color: 'var(--adm-ink-mute)', fontSize: 13 }}>No recent users.</p>}
            {recentProfiles?.map((p: any) => (
              <div key={p.user_id} className="adm-row-item">
                <div className="adm-row-item-left">
                  <div className="adm-thumb">👤</div>
                  <div className="adm-row-item-text">
                    <strong style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.user_id.slice(0, 12)}…</strong>
                    <small>{p.status || '—'} · joined {new Date(p.created_at).toLocaleDateString()}</small>
                  </div>
                </div>
                <span className="adm-pill">{p.status || 'active'}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick links */}
      <section className="adm-card" style={{ marginTop: 18 }}>
        <div className="adm-card-head"><h3 className="adm-card-title">Quick actions</h3></div>
        <div className="adm-row" style={{ alignItems: 'stretch' }}>
          <Link href="/admin/users" className="adm-btn adm-btn--ghost">👥 Grant credits / Premium</Link>
          <Link href="/admin/content" className="adm-btn adm-btn--ghost">📰 Publish article</Link>
          <Link href="/admin/ai-ops" className="adm-btn adm-btn--ghost">⚡ AI cost report</Link>
          <Link href="/admin/settings" className="adm-btn adm-btn--ghost">⚙ Settings</Link>
          <a href="/cost-report.html" target="_blank" className="adm-btn adm-btn--ghost">📄 Cost PDF</a>
        </div>
      </section>
    </>
  )
}
