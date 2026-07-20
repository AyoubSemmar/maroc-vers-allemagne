import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { isAccessActive } from '@/lib/courseAccess'
import { isJaasConfigured } from '@/lib/jaas'
import ClassroomClient from './ClassroomClient'

// Live classroom — never cache; always re-check access + window.
export const dynamic = 'force-dynamic'

export const metadata = { robots: { index: false, follow: false } }

export default async function ClassroomPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params

  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect(`/${locale}/login?next=/learn-german/classroom`)

  const [{ data: booking }, { data: profile }] = await Promise.all([
    sb.from('class_bookings').select('group_id, access_until')
      .eq('user_id', user.id).eq('status', 'reserved').maybeSingle(),
    sb.from('profiles').select('is_admin').eq('user_id', user.id).maybeSingle(),
  ])
  const isTeacher = profile?.is_admin === true
  if (!booking && !isTeacher) redirect(`/${locale}/learn-german/classes`)

  // Access must be active (paid) — expired students go back to the renewal flow.
  const accessUntil = (booking?.access_until as string | null) ?? null
  if (booking && !isAccessActive(accessUntil) && !isTeacher) {
    redirect(`/${locale}/learn-german/my-course`)
  }

  let level = 'a1'
  let groupId: string | null = booking?.group_id ?? null
  let groupLabel: string | null = null
  if (booking?.group_id) {
    const { data: g } = await supabase
      .from('class_groups').select('*').eq('id', booking.group_id).maybeSingle()
    if (g) {
      level = (g.level as string) || 'a1'
      groupLabel = (g.label as string) ?? null
    }
  }

  return (
    <div dir={dirFor(locale)}>
      <ClassroomClient
        locale={locale}
        level={level}
        groupId={groupId}
        groupLabel={groupLabel}
        videoConfigured={isJaasConfigured()}
      />
    </div>
  )
}
