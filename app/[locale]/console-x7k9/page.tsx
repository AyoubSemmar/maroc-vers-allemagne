// Admin command center — business KPIs, growth, revenue, engagement, content
// velocity and AI cost. Auth is handled by the console layout. Uses the service
// role so RLS-protected data (profiles, bookings, documents) is fully visible.
import { createClient } from '@supabase/supabase-js'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

// Head-count helper that never throws (missing table → 0).
async function count(table: string, filter?: { col: string; gte: string }): Promise<number> {
  try {
    let q = sb.from(table).select('*', { count: 'exact', head: true })
    if (filter) q = q.gte(filter.col, filter.gte) as any
    const { count, error } = await q
    return error ? 0 : (count ?? 0)
  } catch { return 0 }
}
async function rows<T = any>(q: any): Promise<T[]> {
  try { const { data } = await q; return (data ?? []) as T[] } catch { return [] }
}

function iso(daysAgo: number): string {
  const d = new Date(); d.setUTCDate(d.getUTCDate() - daysAgo); return d.toISOString()
}
function dayList(n: number): string[] {
  return [...Array(n)].map((_, i) => {
    const d = new Date(); d.setUTCDate(d.getUTCDate() - (n - 1 - i)); return d.toISOString().slice(0, 10)
  })
}
const today = new Date().toISOString().slice(0, 10)
const CLASS_PRICE = 200 // MAD/month

function Bars({ data, color = 'var(--adm-brand)', height = 48 }: { data: { k: string; v: number }[]; color?: string; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.v))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height }}>
      {data.map((d) => (
        <div key={d.k} title={`${d.k}: ${d.v}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ height: `${(d.v / max) * 100}%`, minHeight: d.v > 0 ? 2 : 0, background: color, borderRadius: 2, opacity: 0.85 }} />
        </div>
      ))}
    </div>
  )
}

export default async function AdminOverviewPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  await params

  const [
    profiles, articles, groups, documents,
    listingsTotal, jobsTotal, unisTotal, savesTotal, commentsTotal, newsletterTotal,
    listingsLast7d,
    cvToday, anschreibenToday, photoToday, readingToday, writingToday,
    credits, recentListings, recentUsers, recentBookings, usersRes,
  ] = await Promise.all([
    rows(sb.from('profiles').select('created_at,is_premium,premium_until,deleted_at')),
    rows(sb.from('articles').select('date,created_at,helpful_yes,helpful_no,featured')),
    rows(sb.from('class_groups').select('id,label,capacity,booked_count,price_mad').order('sort_order')),
    rows(sb.from('user_documents').select('doc_type')),
    count('listings'), count('ausbildung_jobs'), count('universities'),
    count('user_saves'), count('article_comments'), count('newsletter_subscribers'),
    count('listings', { col: 'created_at', gte: iso(7) }),
    count('cv_enhance_usage', { col: 'day', gte: today }),
    count('motivation_usage', { col: 'day', gte: today }),
    count('photo_enhance_usage', { col: 'day', gte: today }),
    count('reading_exercise_usage', { col: 'day', gte: today }),
    count('writing_exercise_usage', { col: 'day', gte: today }),
    rows(sb.from('user_credits').select('photo_credits,cv_enhance_credits,motivation_credits')),
    rows(sb.from('listings').select('id,title,city,price,created_at').order('created_at', { ascending: false }).limit(5)),
    rows(sb.from('profiles').select('user_id,email,full_name,status,is_premium,created_at').order('created_at', { ascending: false }).limit(6)),
    rows(sb.from('class_bookings').select('group_id,user_id,status,created_at').eq('status', 'reserved').order('created_at', { ascending: false }).limit(6)),
    sb.auth.admin.listUsers({ perPage: 1000 }).then((r) => r.data?.users ?? []).catch(() => []),
  ])

  // ── Users & growth ──
  const now = Date.now()
  const usersTotal = profiles.filter((p: any) => !p.deleted_at).length
  const sinceDays = (iso: string) => (now - new Date(iso).getTime()) / 86400000
  const newToday = profiles.filter((p: any) => (p.created_at || '').slice(0, 10) === today).length
  const new7d = profiles.filter((p: any) => p.created_at && sinceDays(p.created_at) <= 7).length
  const new30d = profiles.filter((p: any) => p.created_at && sinceDays(p.created_at) <= 30).length
  const premiumActive = profiles.filter((p: any) => p.is_premium && (!p.premium_until || new Date(p.premium_until).getTime() > now)).length
  const conversion = usersTotal ? ((premiumActive / usersTotal) * 100).toFixed(1) : '0'

  const active7d = (usersRes as any[]).filter((u) => u.last_sign_in_at && sinceDays(u.last_sign_in_at) <= 7).length
  const active30d = (usersRes as any[]).filter((u) => u.last_sign_in_at && sinceDays(u.last_sign_in_at) <= 30).length

  // signup histogram (30d)
  const d30 = dayList(30)
  const signupMap: Record<string, number> = Object.fromEntries(d30.map((d) => [d, 0]))
  profiles.forEach((p: any) => { const k = (p.created_at || '').slice(0, 10); if (k in signupMap) signupMap[k]++ })
  const signupBars = d30.map((k) => ({ k, v: signupMap[k] }))

  // ── Content velocity ──
  const articlesTotal = articles.length
  const featured = articles.filter((a: any) => a.featured).length
  const d7 = dayList(7)
  const pubMap: Record<string, number> = Object.fromEntries(d7.map((d) => [d, 0]))
  articles.forEach((a: any) => { const k = (a.date || a.created_at || '').slice(0, 10); if (k in pubMap) pubMap[k]++ })
  const pubBars = d7.map((k) => ({ k, v: pubMap[k] }))
  const helpfulYes = articles.reduce((s: number, a: any) => s + (a.helpful_yes || 0), 0)
  const helpfulNo = articles.reduce((s: number, a: any) => s + (a.helpful_no || 0), 0)

  // ── Revenue / monetization ──
  const reserved = (groups as any[]).reduce((s, g) => s + (g.booked_count || 0), 0)
  const classRevenue = (groups as any[]).reduce((s, g) => s + (g.booked_count || 0) * (g.price_mad || CLASS_PRICE), 0)
  const totalSeats = (groups as any[]).reduce((s, g) => s + (g.capacity || 0), 0)
  const creditsOutstanding = (credits as any[]).reduce((s, c) => s + (c.photo_credits || 0) + (c.cv_enhance_credits || 0) + (c.motivation_credits || 0), 0)

  // ── Engagement ──
  // doc_type values are German (lebenslauf = CV); everything else is a letter/cert.
  const cvDocs = (documents as any[]).filter((d) => d.doc_type === 'lebenslauf').length
  const letterDocs = (documents as any[]).length - cvDocs

  // ── AI cost today ──
  const aiCost = cvToday * 0.08 + anschreibenToday * 0.05 + photoToday * 0.04 + (readingToday + writingToday) * 0.002

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Overview</h1>
          <p className="adm-page-sub">Live command center — users, revenue, content and AI cost. Updates on reload.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/console-x7k9/classes" className="adm-btn adm-btn--ghost">Classes →</Link>
          <Link href="/console-x7k9/users" className="adm-btn">Manage users →</Link>
        </div>
      </header>

      {/* Business KPIs */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--brand">
          <div className="adm-kpi-label">Total users</div>
          <div className="adm-kpi-value">{usersTotal.toLocaleString()}</div>
          <div className="adm-kpi-sub">+{newToday} today · +{new7d} / 7d · +{new30d} / 30d</div>
        </div>
        <div className="adm-kpi adm-kpi--violet">
          <div className="adm-kpi-label">Active users</div>
          <div className="adm-kpi-value">{active7d}</div>
          <div className="adm-kpi-sub">signed in last 7d · {active30d} last 30d</div>
        </div>
        <div className="adm-kpi adm-kpi--gold">
          <div className="adm-kpi-label">Premium</div>
          <div className="adm-kpi-value">{premiumActive}</div>
          <div className="adm-kpi-sub">{conversion}% conversion</div>
        </div>
        <div className="adm-kpi adm-kpi--green">
          <div className="adm-kpi-label">Class revenue (reserved)</div>
          <div className="adm-kpi-value">{classRevenue.toLocaleString()} DH</div>
          <div className="adm-kpi-sub">{reserved}/{totalSeats} seats · {CLASS_PRICE} DH/mo</div>
        </div>
        <div className="adm-kpi adm-kpi--red">
          <div className="adm-kpi-label">AI cost today</div>
          <div className="adm-kpi-value">≈ ${aiCost.toFixed(2)}</div>
          <div className="adm-kpi-sub">{cvToday + anschreibenToday + photoToday + readingToday + writingToday} calls</div>
        </div>
      </div>

      {/* Growth + content velocity charts */}
      <div className="adm-grid-2" style={{ marginTop: 8 }}>
        <section className="adm-card">
          <div className="adm-card-head"><h3 className="adm-card-title">Signups · last 30 days</h3><span className="adm-card-link">{new30d} total</span></div>
          <Bars data={signupBars} color="var(--adm-brand)" height={56} />
        </section>
        <section className="adm-card">
          <div className="adm-card-head"><h3 className="adm-card-title">Articles published · last 7 days</h3><Link href="/console-x7k9/content" className="adm-card-link">Manage →</Link></div>
          <Bars data={pubBars} color="#4f7cff" height={56} />
        </section>
      </div>

      {/* Secondary KPIs: content + engagement */}
      <div className="adm-kpi-grid" style={{ marginTop: 8 }}>
        <div className="adm-kpi adm-kpi--blue">
          <div className="adm-kpi-label">Articles</div>
          <div className="adm-kpi-value">{articlesTotal.toLocaleString()}</div>
          <div className="adm-kpi-sub">{featured} featured</div>
        </div>
        <div className="adm-kpi">
          <div className="adm-kpi-label">Helpful votes</div>
          <div className="adm-kpi-value">{helpfulYes}<span style={{ fontSize: 14, color: 'var(--adm-ink-mute)' }}> / {helpfulNo} 👎</span></div>
          <div className="adm-kpi-sub">Reader feedback on articles</div>
        </div>
        <div className="adm-kpi">
          <div className="adm-kpi-label">CVs / letters built</div>
          <div className="adm-kpi-value">{cvDocs} / {letterDocs}</div>
          <div className="adm-kpi-sub">Saved user documents</div>
        </div>
        <div className="adm-kpi">
          <div className="adm-kpi-label">Saves · comments</div>
          <div className="adm-kpi-value">{savesTotal} · {commentsTotal}</div>
          <div className="adm-kpi-sub">{newsletterTotal} newsletter signups</div>
        </div>
        <div className="adm-kpi">
          <div className="adm-kpi-label">Jobs · Universities</div>
          <div className="adm-kpi-value">{jobsTotal.toLocaleString()} · {unisTotal.toLocaleString()}</div>
          <div className="adm-kpi-sub">{listingsTotal} listings (+{listingsLast7d}/7d)</div>
        </div>
        <div className="adm-kpi">
          <div className="adm-kpi-label">Credits outstanding</div>
          <div className="adm-kpi-value">{creditsOutstanding}</div>
          <div className="adm-kpi-sub">Unspent purchased credits</div>
        </div>
      </div>

      {/* Class fill bars */}
      <section className="adm-card" style={{ marginTop: 8 }}>
        <div className="adm-card-head"><h3 className="adm-card-title">Live class groups</h3><Link href="/console-x7k9/classes" className="adm-card-link">Manage bookings →</Link></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(groups as any[]).length === 0 && <p style={{ color: 'var(--adm-ink-mute)', fontSize: 13 }}>No groups. Run the live-classes migration.</p>}
          {(groups as any[]).map((g) => {
            const pct = g.capacity ? Math.round((g.booked_count / g.capacity) * 100) : 0
            const full = g.booked_count >= g.capacity
            return (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 150, fontSize: 13, fontWeight: 600 }}>{g.label}</div>
                <div style={{ flex: 1, height: 10, background: '#eef0f4', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: full ? '#d9534f' : 'var(--adm-brand)' }} />
                </div>
                <div style={{ width: 64, textAlign: 'right', fontSize: 13, fontWeight: 700, color: full ? '#d9534f' : 'inherit' }}>{g.booked_count}/{g.capacity}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Recent activity */}
      <div className="adm-grid-2" style={{ marginTop: 8 }}>
        <section className="adm-card">
          <div className="adm-card-head"><h3 className="adm-card-title">Latest signups</h3><Link href="/console-x7k9/users" className="adm-card-link">Users →</Link></div>
          <div className="adm-row-list">
            {recentUsers.length === 0 && <p style={{ color: 'var(--adm-ink-mute)', fontSize: 13 }}>No users yet.</p>}
            {(recentUsers as any[]).map((p) => (
              <div key={p.user_id} className="adm-row-item">
                <div className="adm-row-item-left">
                  <div className="adm-thumb">{p.is_premium ? '⭐' : '👤'}</div>
                  <div className="adm-row-item-text">
                    <strong>{p.full_name || p.email || p.user_id.slice(0, 12)}</strong>
                    <small>{p.email || '—'} · {new Date(p.created_at).toLocaleDateString()}</small>
                  </div>
                </div>
                <span className="adm-pill">{p.is_premium ? 'premium' : (p.status || 'active')}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card-head"><h3 className="adm-card-title">Latest class bookings</h3><Link href="/console-x7k9/classes" className="adm-card-link">Classes →</Link></div>
          <div className="adm-row-list">
            {recentBookings.length === 0 && <p style={{ color: 'var(--adm-ink-mute)', fontSize: 13 }}>No active bookings yet.</p>}
            {(recentBookings as any[]).map((b, i) => {
              const g = (groups as any[]).find((x) => x.id === b.group_id)
              return (
                <div key={i} className="adm-row-item">
                  <div className="adm-row-item-left">
                    <div className="adm-thumb">🎓</div>
                    <div className="adm-row-item-text">
                      <strong>{g?.label || b.group_id}</strong>
                      <small>{(usersRes as any[]).find((u) => u.id === b.user_id)?.email || b.user_id.slice(0, 12)} · {new Date(b.created_at).toLocaleDateString()}</small>
                    </div>
                  </div>
                  <span className="adm-pill">reserved</span>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* AI usage today */}
      <header className="adm-page-head" style={{ marginTop: 8 }}>
        <div>
          <h2 className="adm-page-title" style={{ fontSize: 18 }}>AI usage today (UTC)</h2>
          <p className="adm-page-sub">Live from the entitlements usage tables.</p>
        </div>
        <Link href="/console-x7k9/ai-ops" className="adm-btn adm-btn--ghost">AI Ops & Costs →</Link>
      </header>
      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--red"><div className="adm-kpi-label">CV-AI</div><div className="adm-kpi-value">{cvToday}</div><div className="adm-kpi-sub">$0.08 each</div></div>
        <div className="adm-kpi adm-kpi--red"><div className="adm-kpi-label">Anschreiben</div><div className="adm-kpi-value">{anschreibenToday}</div><div className="adm-kpi-sub">$0.05 each</div></div>
        <div className="adm-kpi adm-kpi--blue"><div className="adm-kpi-label">Photo</div><div className="adm-kpi-value">{photoToday}</div><div className="adm-kpi-sub">$0.04 each</div></div>
        <div className="adm-kpi adm-kpi--green"><div className="adm-kpi-label">Lesen</div><div className="adm-kpi-value">{readingToday}</div><div className="adm-kpi-sub">$0.002 each</div></div>
        <div className="adm-kpi adm-kpi--green"><div className="adm-kpi-label">Schreiben</div><div className="adm-kpi-value">{writingToday}</div><div className="adm-kpi-sub">$0.002 each</div></div>
      </div>
    </>
  )
}
