import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { isAccessActive } from '@/lib/courseAccess'
import CertificateClient from './CertificateClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Certificat — GoGermany',
  robots: { index: false, follow: false },
}

/** Same gate as the course dashboard: signed-in student with active access
 *  (admins bypass to preview). The completion check itself is client-side —
 *  it reads the same progress store the dashboard grades from. */
export default async function CertificatePage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params

  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const [{ data: booking }, { data: profile }] = await Promise.all([
    sb.from('class_bookings').select('group_id, access_until')
      .eq('user_id', user.id).eq('status', 'reserved').maybeSingle(),
    sb.from('profiles').select('is_admin').eq('user_id', user.id).maybeSingle(),
  ])
  const isTeacher = profile?.is_admin === true
  if (!booking && !isTeacher) redirect(`/${locale}/learn-german/classes`)
  if (booking && !isAccessActive((booking.access_until as string | null) ?? null) && !isTeacher) {
    redirect(`/${locale}/learn-german/my-course`)
  }

  let level = 'a1'
  let groupLabel: string | null = null
  if (booking?.group_id) {
    const { data: g } = await supabase
      .from('class_groups').select('*').eq('id', booking.group_id).maybeSingle()
    if (g) {
      level = (g.level as string) || 'a1'
      groupLabel = (g.label as string) ?? null
    }
  }

  const displayName =
    (user.user_metadata?.full_name as string) ||
    user.email?.split('@')[0] ||
    'Étudiant(e)'

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <CertificateClient levelId={level} displayName={displayName} groupLabel={groupLabel} />
    </div>
  )
}
