import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isMorocco } from '@/lib/geo'
import { isAdmin } from '@/lib/entitlements'
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
  if (!admin && !(await isMorocco())) redirect(`/${locale}/learn-german`)

  const t = classesStrings(locale)

  const { data: groups } = await supabase
    .from('class_groups')
    .select('id,label,schedule,level,price_mad,capacity,booked_count')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Which group (if any) the signed-in student already holds a seat in.
  let myGroupId: string | null = null
  let myWhatsapp = ''
  if (user) {
    const [{ data: booking }, { data: profile }] = await Promise.all([
      sb.from('class_bookings').select('group_id')
        .eq('user_id', user.id).eq('status', 'reserved').maybeSingle(),
      sb.from('profiles').select('whatsapp').eq('user_id', user.id).maybeSingle(),
    ])
    myGroupId = booking?.group_id ?? null
    myWhatsapp = profile?.whatsapp ?? ''
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
            isAuthed={!!user}
            myWhatsapp={myWhatsapp}
          />
        </div>
      </div>
    </div>
  )
}
