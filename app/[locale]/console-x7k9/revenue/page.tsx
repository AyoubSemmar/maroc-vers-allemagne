// Admin: revenue hub. Class bookings + premium are live from the DB; AdSense
// earnings and GA traffic show "connect" cards until their credentials are set
// (they need external API access only the owner can grant).
import { createClient } from '@supabase/supabase-js'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

const ADSENSE_CONNECTED = !!process.env.ADSENSE_OAUTH_REFRESH_TOKEN

export default async function AdminRevenuePage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  await params

  const [{ data: groups }, { data: premiumRows }] = await Promise.all([
    sbAdmin.from('class_groups').select('id,label,capacity,booked_count,price_mad').order('sort_order'),
    sbAdmin.from('profiles').select('premium_until').eq('is_premium', true),
  ])

  const classMonthly = (groups ?? []).reduce((s: number, g: any) => s + (g.booked_count || 0) * (g.price_mad || 300), 0)
  const reserved = (groups ?? []).reduce((s: number, g: any) => s + (g.booked_count || 0), 0)
  const premiumActive = (premiumRows ?? []).filter((p: any) => !p.premium_until || new Date(p.premium_until).getTime() > Date.now()).length

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Revenue</h1>
          <p className="adm-page-sub">Money across every channel. Class bookings and premium update live; ad &amp; traffic numbers appear once their integrations are connected below.</p>
        </div>
      </header>

      {/* Live money */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--green">
          <div className="adm-kpi-label">Class bookings · monthly</div>
          <div className="adm-kpi-value">{classMonthly.toLocaleString()} DH</div>
          <div className="adm-kpi-sub">{reserved} reserved seats</div>
        </div>
        <div className="adm-kpi adm-kpi--gold">
          <div className="adm-kpi-label">Premium subscribers</div>
          <div className="adm-kpi-value">{premiumActive}</div>
          <div className="adm-kpi-sub">Active premium accounts</div>
        </div>
        <div className="adm-kpi adm-kpi--blue">
          <div className="adm-kpi-label">AdSense (this month)</div>
          <div className="adm-kpi-value">{ADSENSE_CONNECTED ? '—' : 'Not connected'}</div>
          <div className="adm-kpi-sub">{ADSENSE_CONNECTED ? 'Live earnings' : 'See setup below'}</div>
        </div>
        <Link href="/console-x7k9/analytics" className="adm-kpi adm-kpi--violet" style={{ textDecoration: 'none' }}>
          <div className="adm-kpi-label">Traffic</div>
          <div className="adm-kpi-value" style={{ fontSize: 20 }}>Analytics →</div>
          <div className="adm-kpi-sub">First-party pageviews & searches</div>
        </Link>
      </div>

      {/* Per-group class revenue */}
      <section className="adm-card" style={{ marginTop: 8 }}>
        <div className="adm-card-head"><h3 className="adm-card-title">Class revenue by group</h3><Link href="/console-x7k9/classes" className="adm-card-link">Manage →</Link></div>
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <tbody>
            {(groups ?? []).map((g: any) => (
              <tr key={g.id} style={{ borderTop: '1px solid #eef0f4' }}>
                <td style={{ padding: '8px 4px' }}>{g.label}</td>
                <td style={{ padding: '8px 4px', color: '#9aa0b0', width: 90 }}>{g.booked_count}/{g.capacity}</td>
                <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 700, width: 120 }}>{((g.booked_count || 0) * (g.price_mad || 300)).toLocaleString()} DH</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Connect cards */}
      {!ADSENSE_CONNECTED && (
        <section className="adm-card" style={{ marginTop: 18 }}>
          <div className="adm-card-head"><h3 className="adm-card-title">📈 Connect AdSense earnings</h3></div>
          <p style={{ fontSize: 13, color: '#5a6072', lineHeight: 1.6 }}>
            Pull live ad earnings into this page via the AdSense Management API. Needs OAuth access to your AdSense account.
            Once the account is approved: create an OAuth client in Google Cloud, authorize the AdSense scope, and set
            <code> ADSENSE_OAUTH_REFRESH_TOKEN</code>, <code>ADSENSE_OAUTH_CLIENT_ID</code>, <code>ADSENSE_OAUTH_CLIENT_SECRET</code>,
            and <code>ADSENSE_ACCOUNT_ID</code> in Vercel. Tell me when you have them and I&rsquo;ll wire the live numbers.
          </p>
        </section>
      )}
    </>
  )
}
