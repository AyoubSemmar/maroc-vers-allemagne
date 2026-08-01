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
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ group?: string }>
}) {
  const { locale } = await params
  const { group: groupParam } = await searchParams

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

  // Which group's room to open. Students always get their own booked group.
  // A teacher/admin may target any group via ?group=<id> (so the owner can drop
  // into any class's live call without being enrolled as a student); otherwise
  // they fall back to their own booking if they happen to have one.
  const groupId: string | null = isTeacher
    ? (groupParam || booking?.group_id || null)
    : (booking?.group_id ?? null)

  let level = 'a1'
  let groupLabel: string | null = null
  if (groupId) {
    const { data: g } = await supabase
      .from('class_groups').select('*').eq('id', groupId).maybeSingle()
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
