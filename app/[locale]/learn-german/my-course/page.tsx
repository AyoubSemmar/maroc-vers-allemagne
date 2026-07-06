import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { buildCallUrl } from '@/lib/jitsi'
import { parseClassWindow, type ClassWindow } from '@/lib/classSchedule'
import { isAccessActive, formatAccessDate } from '@/lib/courseAccess'
import MyCourseClient from './MyCourseClient'

// Personal course dashboard — always reflect the latest grades.
export const dynamic = 'force-dynamic'

export default async function MyCoursePage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params

  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // Level + cohort come from the student's reserved seat. Admins (teacher)
  // with no booking default to A1 so they can preview the experience.
  const [{ data: booking }, { data: profile }] = await Promise.all([
    sb.from('class_bookings').select('group_id, access_until')
      .eq('user_id', user.id).eq('status', 'reserved').maybeSingle(),
    sb.from('profiles').select('is_admin').eq('user_id', user.id).maybeSingle(),
  ])
  const isTeacher = profile?.is_admin === true
  if (!booking && !isTeacher) redirect(`/${locale}/learn-german/classes`)

  const accessUntil = (booking?.access_until as string | null) ?? null

  // No active access → the course is locked. Distinguish a lapsed subscription
  // (renew) from a never-paid reservation (first payment). Admins bypass.
  if (booking && !isAccessActive(accessUntil) && !isTeacher) {
    const expired = !!accessUntil
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir={dirFor(locale)}>
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-3">{expired ? '🔒' : '⏳'}</div>
          <h1 className="text-xl font-bold text-gray-900">
            {expired ? 'Accès expiré' : 'Place réservée'}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {expired
              ? `Votre accès a expiré le ${formatAccessDate(accessUntil!)}. Renouvelez votre abonnement (450 DH/mois) par WhatsApp pour reprendre le cours.`
              : 'Vous recevrez les instructions de paiement (450 DH/mois) par WhatsApp. Dès la confirmation du paiement, votre cours sera débloqué ici.'}
          </p>
          <Link
            href="/learn-german/classes"
            className="inline-block mt-5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5"
          >
            {expired ? '↻ Renouveler mon accès' : '← Retour aux cours'}
          </Link>
        </div>
      </div>
    )
  }

  const displayName =
    (user.user_metadata?.full_name as string) ||
    user.email?.split('@')[0] ||
    'Student'

  let level = 'a1'
  let groupId: string | null = null
  let groupLabel: string | null = null
  let callUrl: string | null = null
  let classWindow: ClassWindow | null = null
  let groupStartDate: string | null = null
  if (booking?.group_id) {
    groupId = booking.group_id
    // select('*') keeps this fail-soft: start_date (pacing migration) may not
    // exist yet, and an explicit column list would error the whole select.
    const { data: g } = await supabase
      .from('class_groups')
      .select('*')
      .eq('id', booking.group_id)
      .maybeSingle()
    if (g) {
      level = (g.level as string) || 'a1'
      groupLabel = g.label as string
      groupStartDate = ((g as any).start_date as string | null) ?? null
      if (g.room_slug) {
        callUrl = buildCallUrl(g.room_slug, displayName, isTeacher)
        classWindow = parseClassWindow(g.schedule as string, booking.group_id)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <MyCourseClient
        locale={locale}
        levelId={level}
        groupId={groupId}
        groupLabel={groupLabel}
        displayName={displayName}
        isTeacher={isTeacher}
        callUrl={callUrl}
        classWindow={classWindow}
        accessUntil={accessUntil}
        groupStartDate={groupStartDate}
      />
    </div>
  )
}
