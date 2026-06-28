import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isMorocco } from '@/lib/geo'
import { isAdmin } from '@/lib/entitlements'
import { CLASSES_LAUNCHED } from '@/lib/classes-flags'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { classesStrings } from '@/components/classes/strings'
import ClassesClient, { type ClassGroup } from './ClassesClient'

// Booking counts are live — never cache this page.
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = classesStrings(locale)
  return buildLocaleMetadata({
    locale,
    path: '/learn-german/classes',
    title: `${t.title} — GoGermany`,
    description: t.subtitle,
  })
}

export default async function ClassesPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()

  // Live classes are Morocco-only — non-MA visitors are sent back to the Learn
  // German hub. Signed-in admins (the owner/teacher) bypass the gate so they
  // can see and manage it from anywhere.
  const admin = user ? await isAdmin(user.id) : false
  // Pre-launch: the whole course is hidden from the public — only admins reach
  // it. After launch, it's Morocco-only (non-MA visitors go back to the hub).
  if (!admin) {
    if (!CLASSES_LAUNCHED) redirect(`/${locale}/learn-german`)
    if (!(await isMorocco())) redirect(`/${locale}/learn-german`)
  }

  const t = classesStrings(locale)

  const { data: groups } = await supabase
    .from('class_groups')
    .select('id,label,schedule,level,price_mad,capacity,booked_count')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Which group (if any) the signed-in student already holds a seat in, and
  // whether the admin has granted them access (paid) yet.
  let myGroupId: string | null = null
  let myAccessGranted = false
  if (user) {
    const { data: booking } = await sb
      .from('class_bookings').select('group_id, access_granted')
      .eq('user_id', user.id).eq('status', 'reserved').maybeSingle()
    myGroupId = booking?.group_id ?? null
    myAccessGranted = booking?.access_granted === true
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="mt-2 text-gray-600">{t.subtitle}</p>
        <p className="mt-1 text-sm text-gray-400">{t.payNote}</p>

        <div className="mt-8">
          <ClassesClient
            locale={locale}
            groups={(groups ?? []) as ClassGroup[]}
            myGroupId={myGroupId}
            myAccessGranted={myAccessGranted}
            isAuthed={!!user}
          />
        </div>
      </div>
    </div>
  )
}
