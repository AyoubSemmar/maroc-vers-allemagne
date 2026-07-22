// Admin: live-class bookings per group. Lets staff confirm offline payments by
// matching emails and remove students who didn't pay (frees their seat).
// Reads everything with the service role (bypasses RLS); the remove action is
// separately gated by profiles.is_admin in /api/admin/classes/remove.
import { createClient } from '@supabase/supabase-js'
import type { AppLocale } from '@/i18n/routing'
import { isAccessActive, accessDaysLeft, formatAccessDate } from '@/lib/courseAccess'
import { getLevel } from '@/lib/german-data'
import AdminClassesClient, { type AdminGroup } from './AdminClassesClient'

export const dynamic = 'force-dynamic'

const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

export default async function AdminClassesPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params

  const [{ data: groups }, { data: bookings }, usersRes, { data: profiles }, reqRes] = await Promise.all([
    // select('*') keeps this fail-soft while the start_date (pacing) migration
    // may not have been run yet.
    sbAdmin.from('class_groups').select('*').order('sort_order'),
    sbAdmin.from('class_bookings').select('id,group_id,user_id,created_at,access_until').eq('status', 'reserved').order('created_at'),
    sbAdmin.auth.admin.listUsers({ perPage: 1000 }),
    sbAdmin.from('profiles').select('user_id,whatsapp'),
    // Pending reservation requests. Wrapped so a missing table (pre-migration)
    // doesn't blank the whole page.
    sbAdmin.from('class_reservation_requests')
      .select('id,full_name,whatsapp,email,group_id,created_at')
      .eq('status', 'pending').order('created_at', { ascending: true }),
  ])

  const emailById = new Map<string, string>()
  for (const u of usersRes.data?.users ?? []) emailById.set(u.id, u.email ?? '—')
  const waById = new Map<string, string>()
  for (const p of profiles ?? []) if (p.whatsapp) waById.set(p.user_id, p.whatsapp)

  const groupLabelById = new Map((groups ?? []).map((g) => [g.id, g.label]))
  const requests = (reqRes.data ?? []).map((r) => ({
    id: r.id as string,
    fullName: r.full_name as string,
    whatsapp: r.whatsapp as string,
    email: r.email as string,
    groupId: (r.group_id as string | null) ?? null,
    groupLabel: r.group_id ? (groupLabelById.get(r.group_id) ?? r.group_id) : '—',
    requestedAt: (r.created_at as string)?.slice(0, 10) ?? '',
  }))

  // Attendance over the last 30 days (call-join clicks). Best-effort: before
  // the class_attendance migration exists this select just errors and every
  // count stays 0 — the console must not break on a missing table.
  const attByUser = new Map<string, number>()
  try {
    const since = new Date()
    since.setDate(since.getDate() - 30)
    const { data: att } = await sbAdmin
      .from('class_attendance')
      .select('user_id')
      .gte('day', since.toISOString().slice(0, 10))
    for (const a of att ?? []) attByUser.set(a.user_id, (attByUser.get(a.user_id) ?? 0) + 1)
  } catch {}

  const model: AdminGroup[] = (groups ?? []).map((g) => ({
    id: g.id,
    label: g.label,
    schedule: g.schedule,
    level: (g.level || 'a1') as string,
    price_mad: g.price_mad as number,
    capacity: g.capacity,
    booked_count: g.booked_count,
    seed_reserved: ((g as any).seed_reserved as number | null) ?? 0,
    lessons_done: ((g as any).lessons_done as number | null) ?? 0,
    lessons_total: getLevel((g.level as string) || 'a1')?.lessons.length ?? 0,
    students: (bookings ?? [])
      .filter((b) => b.group_id === g.id)
      .map((b) => ({
        bookingId: b.id,
        email: emailById.get(b.user_id) ?? b.user_id,
        whatsapp: waById.get(b.user_id) ?? '',
        bookedAt: (b.created_at as string)?.slice(0, 10) ?? '',
        accessUntil: ((b as any).access_until as string | null) ?? null,
        accessActive: isAccessActive((b as any).access_until as string | null),
        attendance30: attByUser.get(b.user_id) ?? 0,
      })),
  }))

  // Renewal chase list: paying students whose access lapses within 7 days (or
  // already lapsed). One-click prefilled WhatsApp per student — churn dies in
  // this window, so this list IS the renewal workflow.
  const renewals = model
    .flatMap((g) =>
      g.students
        .filter((s) => s.accessUntil)
        .map((s) => ({ ...s, group: g.label, days: accessDaysLeft(s.accessUntil)! })),
    )
    .filter((s) => s.days <= 7)
    .sort((a, b) => a.days - b.days)

  const renewWa = (num: string, group: string) => {
    const digits = (num || '').replace(/\D/g, '')
    const msg = encodeURIComponent(
      `Bonjour ! Votre accès au cours d'allemand GoGermany (${group}) arrive à échéance. Pour continuer sans interruption, merci de renouveler votre abonnement (450 DH/mois). 🙏`,
    )
    return `https://wa.me/${digits}?text=${msg}`
  }

  const reserved = model.reduce((s, g) => s + g.booked_count, 0)
  const seats = model.reduce((s, g) => s + g.capacity, 0)
  // Real monthly revenue counts only students with active (paid, unexpired)
  // access — not every reserved-but-unpaid seat.
  const activeCount = model.reduce((s, g) => s + g.students.filter((st) => st.accessActive).length, 0)
  const revenue = activeCount * 450
  const fullGroups = model.filter((g) => g.booked_count >= g.capacity).length

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Live classes</h1>
          <p className="adm-page-sub">A1/A2/B1 group bookings. Match emails against offline payments (450 MAD/month); remove anyone who didn&rsquo;t pay to free their seat. Removal requires a Supabase admin session.</p>
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

      {renewals.length > 0 && (
        <div className="adm-card" style={{ padding: 16, marginBottom: 16, borderInlineStart: '4px solid #f59e0b' }}>
          <strong style={{ display: 'block', marginBottom: 8 }}>
            ⏰ Renouvellements — {renewals.length} à relancer
          </strong>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <tbody>
              {renewals.map((s) => (
                <tr key={s.bookingId} style={{ borderTop: '1px solid #eef0f4' }}>
                  <td style={{ padding: '6px 4px' }}>{s.email}</td>
                  <td style={{ padding: '6px 4px', color: '#7d8398' }}>{s.group}</td>
                  <td style={{ padding: '6px 4px', fontWeight: 700, color: s.days < 0 ? '#b91c1c' : '#b45309' }}>
                    {s.days < 0
                      ? `expiré le ${formatAccessDate(s.accessUntil!)}`
                      : s.days === 0 ? 'expire aujourd’hui' : `${s.days} j restants`}
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'end' }}>
                    {s.whatsapp ? (
                      <a
                        href={renewWa(s.whatsapp, s.group)}
                        target="_blank" rel="noreferrer"
                        style={{ fontSize: 12, fontWeight: 700, background: '#16a34a', color: 'white', borderRadius: 6, padding: '4px 10px', textDecoration: 'none' }}
                      >
                        💬 Relancer
                      </a>
                    ) : (
                      <span style={{ color: '#c0c4ce', fontSize: 12 }}>no WhatsApp</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminClassesClient groups={model} requests={requests} locale={locale} />
    </>
  )
}
