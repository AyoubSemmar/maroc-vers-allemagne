import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import type { AppLocale } from '@/i18n/routing'
import { buildCallUrl } from '@/lib/jitsi'

// Live room — never cache, always re-check access.
export const dynamic = 'force-dynamic'

// This route no longer renders its own chrome. Students reach the call from
// their "Mon cours" dashboard; this page just gates access and redirects
// straight into the meet.jit.si call (used by the admin "Join room" button
// for teachers, and any legacy links).
export default async function ClassroomPage({
  params,
}: { params: Promise<{ locale: AppLocale; group: string }> }) {
  const { locale, group } = await params

  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // Access = a reserved seat in THIS group, or a teacher/admin account.
  const [{ data: booking }, { data: profile }] = await Promise.all([
    sb.from('class_bookings').select('id')
      .eq('user_id', user.id).eq('group_id', group).eq('status', 'reserved').maybeSingle(),
    sb.from('profiles').select('is_admin').eq('user_id', user.id).maybeSingle(),
  ])
  const isTeacher = profile?.is_admin === true
  if (!booking && !isTeacher) redirect(`/${locale}/learn-german/classes`)

  const { data: g } = await supabase
    .from('class_groups')
    .select('room_slug')
    .eq('id', group)
    .maybeSingle()
  if (!g) redirect(`/${locale}/learn-german/classes`)

  const displayName =
    (user.user_metadata?.full_name as string) ||
    user.email?.split('@')[0] ||
    'Student'

  redirect(buildCallUrl(g.room_slug, displayName, isTeacher))
}
