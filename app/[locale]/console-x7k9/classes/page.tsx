// Admin: live-class bookings per group. Lets staff confirm offline payments by
// matching emails and remove students who didn't pay (frees their seat).
// Reads everything with the service role (bypasses RLS); the remove action is
// separately gated by profiles.is_admin in /api/admin/classes/remove.
import { createClient } from '@supabase/supabase-js'
import type { AppLocale } from '@/i18n/routing'
import AdminClassesClient, { type AdminGroup } from './AdminClassesClient'

export const dynamic = 'force-dynamic'

const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

export default async function AdminClassesPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  await params

  const [{ data: groups }, { data: bookings }, usersRes] = await Promise.all([
    sbAdmin.from('class_groups').select('id,label,schedule,capacity,booked_count').order('sort_order'),
    sbAdmin.from('class_bookings').select('id,group_id,user_id,created_at').eq('status', 'reserved').order('created_at'),
    sbAdmin.auth.admin.listUsers({ perPage: 1000 }),
  ])

  const emailById = new Map<string, string>()
  for (const u of usersRes.data?.users ?? []) emailById.set(u.id, u.email ?? '—')

  const model: AdminGroup[] = (groups ?? []).map((g) => ({
    id: g.id,
    label: g.label,
    schedule: g.schedule,
    capacity: g.capacity,
    booked_count: g.booked_count,
    students: (bookings ?? [])
      .filter((b) => b.group_id === g.id)
      .map((b) => ({
        bookingId: b.id,
        email: emailById.get(b.user_id) ?? b.user_id,
        bookedAt: (b.created_at as string)?.slice(0, 10) ?? '',
      })),
  }))

  const reserved = model.reduce((s, g) => s + g.booked_count, 0)
  const seats = model.reduce((s, g) => s + g.capacity, 0)
  const revenue = (groups ?? []).reduce((s: number, g: any) => s + (g.booked_count || 0) * (g.price_mad || 300), 0)
  const fullGroups = model.filter((g) => g.booked_count >= g.capacity).length

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Live classes</h1>
          <p className="adm-page-sub">A1/A2/B1 group bookings. Match emails against offline payments (300 MAD/month); remove anyone who didn&rsquo;t pay to free their seat. Removal requires a Supabase admin session.</p>
        </div>
      </header>

      <div className="adm-kpi-grid" style={{ marginBottom: 16 }}>
        <div className="adm-kpi adm-kpi--green">
          <div className="adm-kpi-label">Monthly revenue (reserved)</div>
          <div className="adm-kpi-value">{revenue.toLocaleString()} DH</div>
          <div className="adm-kpi-sub">{reserved} seats × 300 DH</div>
        </div>
        <div className="adm-kpi adm-kpi--brand">
          <div className="adm-kpi-label">Seats filled</div>
          <div className="adm-kpi-value">{reserved}/{seats}</div>
          <div className="adm-kpi-sub">{seats ? Math.round((reserved / seats) * 100) : 0}% across all groups</div>
        </div>
        <div className="adm-kpi adm-kpi--gold">
          <div className="adm-kpi-label">Full groups</div>
          <div className="adm-kpi-value">{fullGroups}/{model.length}</div>
          <div className="adm-kpi-sub">Cohorts ready to start</div>
        </div>
      </div>

      <AdminClassesClient groups={model} />
    </>
  )
}
