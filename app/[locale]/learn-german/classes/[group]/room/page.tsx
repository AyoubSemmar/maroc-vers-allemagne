import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import ClassroomClient from './ClassroomClient'

// Live room — never cache, always re-check access.
export const dynamic = 'force-dynamic'

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
    .select('id,label,room_slug,level')
    .eq('id', group)
    .maybeSingle()
  if (!g) redirect(`/${locale}/learn-german/classes`)

  const displayName =
    (user.user_metadata?.full_name as string) ||
    user.email?.split('@')[0] ||
    'Student'

  return (
    <div className="min-h-screen bg-gray-900" dir={dirFor(locale)}>
      <ClassroomClient
        locale={locale}
        roomSlug={g.room_slug}
        groupLabel={g.label}
        level={(g.level as string) || 'a1'}
        displayName={displayName}
        isTeacher={isTeacher}
      />
    </div>
  )
}
