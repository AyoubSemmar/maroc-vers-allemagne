// Admin: live-class bookings per group. Lets staff confirm offline payments by
// matching emails and remove students who didn't pay (frees their seat).
// Reads everything with the service role (bypasses RLS); the remove action is
// separately gated by profiles.is_admin in /api/admin/classes/remove.
import { createClient } from '@supabase/supabase-js'
import type { AppLocale } from '@/i18n/routing'
import { isAccessActive } from '@/lib/courseAccess'
import AdminClassesClient, { type AdminGroup } from './AdminClassesClient'

export const dynamic = 'force-dynamic'

const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

export default async function AdminClassesPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params

  const [{ data: groups }, { data: bookings }, usersRes, { data: profiles }] = await Promise.all([
    sbAdmin.from('class_groups').select('id,label,schedule,capacity,booked_count').order('sort_order'),
    sbAdmin.from('class_bookings').select('id,group_id,user_id,created_at,access_until').eq('status', 'reserved').order('created_at'),
    sbAdmin.auth.admin.listUsers({ perPage: 1000 }),
    sbAdmin.from('profiles').select('user_id,whatsapp'),
  ])

  const emailById = new Map<string, string>()
  for (const u of usersRes.data?.users ?? []) emailById.set(u.id, u.email ?? '—')
  const waById = new Map<string, string>()
  for (const p of profiles ?? []) if (p.whatsapp) waById.set(p.user_id, p.whatsapp)

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
        whatsapp: waById.get(b.user_id) ?? '',
        bookedAt: (b.created_at as string)?.slice(0, 10) ?? '',
        accessUntil: ((b as any).access_until as string | null) ?? null,
        accessActive: isAccessActive((b as any).access_until as string | null),
      })),
  }))

  const reserved = model.reduce((s, g) => s + g.booked_count, 0)
  const seats = model.reduce((s, g) => s + g.capacity, 0)
  // Real monthly revenue counts only students with active (paid, unexpired)
  // access — not every reserved-but-unpaid seat.
  const activeCount = model.reduce((s, g) => s + g.students.filter((st) => st.accessActive).length, 0)
  const revenue = activeCount * 300
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
          <div className="adm-kpi-label">Monthly revenue (paid)</div>
          <div className="adm-kpi-value">{revenue.toLocaleString()} DH</div>
          <div className="adm-kpi-sub">{activeCount} paid · {reserved} reserved</div>
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

      <AdminClassesClient groups={model} locale={locale} />
    </>
  )
}
