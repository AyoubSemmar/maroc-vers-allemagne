import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { buildCallUrl } from '@/lib/jitsi'
import { parseClassWindow, type ClassWindow } from '@/lib/classSchedule'
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
    sb.from('class_bookings').select('group_id')
      .eq('user_id', user.id).eq('status', 'reserved').maybeSingle(),
    sb.from('profiles').select('is_admin').eq('user_id', user.id).maybeSingle(),
  ])
  const isTeacher = profile?.is_admin === true
  if (!booking && !isTeacher) redirect(`/${locale}/learn-german/classes`)

  const displayName =
    (user.user_metadata?.full_name as string) ||
    user.email?.split('@')[0] ||
    'Student'

  let level = 'a1'
  let groupId: string | null = null
  let groupLabel: string | null = null
  let callUrl: string | null = null
  let classWindow: ClassWindow | null = null
  if (booking?.group_id) {
    groupId = booking.group_id
    const { data: g } = await supabase
      .from('class_groups')
      .select('label,level,room_slug,schedule')
      .eq('id', booking.group_id)
      .maybeSingle()
    if (g) {
      level = (g.level as string) || 'a1'
      groupLabel = g.label as string
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
      />
    </div>
  )
}
