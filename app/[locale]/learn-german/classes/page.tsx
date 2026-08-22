import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'
import { isClassesCountry } from '@/lib/geo'
import { isAdmin } from '@/lib/entitlements'
import { CLASSES_LAUNCHED, CLASSES_GEO_GATED, CLASSES_ENABLED } from '@/lib/classes-flags'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { classesStrings } from '@/components/classes/strings'
import { isAccessActive } from '@/lib/courseAccess'
import Icon, { type IconName } from '@/components/ui/Icon'
import ClassesClient, { type ClassGroup } from './ClassesClient'

// Booking counts are live — never cache this page.
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = classesStrings(locale)
  const meta = buildLocaleMetadata({
    locale,
    path: '/learn-german/classes',
    title: `${t.title} — GoGermany`,
    description: t.subtitle,
  })
  // Live classes are unlisted — keep the route but tell Google to drop it.
  if (!CLASSES_ENABLED) meta.robots = { index: false, follow: true }
  return meta
}

export default async function ClassesPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()

  // Live classes are geo-gated to the served countries (MA/FR/DE) — visitors
  // elsewhere are sent back to the Learn German hub. Signed-in admins (the
  // owner/teacher) bypass the gate so they can see and manage it from anywhere.
  const admin = user ? await isAdmin(user.id) : false
  // Live classes removed/unlisted: only admins (to manage/preview) reach the
  // booking page — everyone else is sent back to the free course. Pre-launch and
  // geo gates still apply on top for when it's re-enabled.
  if (!admin) {
    if (!CLASSES_ENABLED) redirect(`/${locale}/learn-german`)
    if (!CLASSES_LAUNCHED) redirect(`/${locale}/learn-german`)
    if (CLASSES_GEO_GATED && !(await isClassesCountry())) redirect(`/${locale}/learn-german`)
  }

  const t = classesStrings(locale)

  // seed_reserved may not exist yet (pre-migration) — fall back to the base
  // columns so the page never breaks, defaulting the seed to 0 below.
  const baseCols = 'id,label,schedule,level,price_mad,capacity,booked_count'
  let groupsRaw: any[] | null =
    (await supabase.from('class_groups').select(`${baseCols},seed_reserved`)
      .eq('is_active', true).order('sort_order', { ascending: true })).data
  if (groupsRaw == null) {
    groupsRaw = (await supabase.from('class_groups').select(baseCols)
      .eq('is_active', true).order('sort_order', { ascending: true })).data
  }
  // Map explicitly (never spread raw rows to the client — room_slug etc. must
  // stay server-side) and default the seed to 0.
  const groups: ClassGroup[] = (groupsRaw ?? []).map((g: any) => ({
    id: g.id,
    label: g.label,
    schedule: g.schedule,
    level: g.level,
    price_mad: g.price_mad,
    capacity: g.capacity,
    booked_count: g.booked_count,
    seed_reserved: g.seed_reserved ?? 0,
  }))

  // Which group (if any) the signed-in student already holds a seat in, and
  // whether the admin has granted them access (paid) yet.
  let myGroupId: string | null = null
  let myAccessGranted = false
  let myAccessUntil: string | null = null
  if (user) {
    const { data: booking } = await sb
      .from('class_bookings').select('group_id, access_until')
      .eq('user_id', user.id).eq('status', 'reserved').maybeSingle()
    myGroupId = booking?.group_id ?? null
    myAccessUntil = (booking?.access_until as string | null) ?? null
    myAccessGranted = isAccessActive(myAccessUntil)
  }

  // Sales content — ar/fr/en/de (components/classes/strings.ts), matching
  // the Morocco-gated audience this page actually reaches.
  const FEATURES = t.features as { icon: IconName; title: string; desc: string }[]
  const STEPS = t.steps.map((s, i) => ({ n: String(i + 1), ...s }))
  const FAQ = t.faq

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="mt-2 text-gray-600">{t.subtitle}</p>
        <p className="mt-1 text-sm text-gray-400">{t.payNote}</p>

        {/* What's included */}
        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3">
              <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 text-green-700"><Icon name={f.icon} size={20} /></span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Placement quiz CTA */}
        <Link
          href="/learn-german/placement"
          className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-green-300 bg-green-50 hover:bg-green-100 transition-colors px-4 py-3"
        >
          <span className="text-sm text-green-900 font-medium">{t.placementCta}</span>
          <span className="text-sm font-bold text-green-700 shrink-0">{t.placementCtaBtn}</span>
        </Link>

        {/* How it works */}
        <div className="grid sm:grid-cols-3 gap-3 mt-8">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-white rounded-xl border border-gray-200 p-4">
              <span className="inline-flex w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold items-center justify-center">{s.n}</span>
              <p className="font-semibold text-gray-900 text-sm mt-2">{s.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-gray-900 mt-10 mb-4">{t.chooseGroupHeading}</h2>
        <ClassesClient
          locale={locale}
          groups={groups}
          myGroupId={myGroupId}
          myAccessGranted={myAccessGranted}
          myAccessUntil={myAccessUntil}
          isAuthed={!!user}
        />

        {/* FAQ */}
        <h2 className="text-lg font-bold text-gray-900 mt-12 mb-4">{t.faqHeading}</h2>
        <div className="flex flex-col gap-2">
          {FAQ.map((f) => (
            <details key={f.q} className="bg-white rounded-xl border border-gray-200 px-4 py-3 group">
              <summary className="text-sm font-semibold text-gray-800 cursor-pointer list-none flex items-center justify-between gap-2">
                {f.q}
                <span className="text-gray-300 group-open:rotate-45 transition-transform text-lg shrink-0">+</span>
              </summary>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
