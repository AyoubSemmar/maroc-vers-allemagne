import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'
import { isMorocco } from '@/lib/geo'
import { isAdmin } from '@/lib/entitlements'
import { CLASSES_LAUNCHED } from '@/lib/classes-flags'
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
  let myAccessUntil: string | null = null
  if (user) {
    const { data: booking } = await sb
      .from('class_bookings').select('group_id, access_until')
      .eq('user_id', user.id).eq('status', 'reserved').maybeSingle()
    myGroupId = booking?.group_id ?? null
    myAccessUntil = (booking?.access_until as string | null) ?? null
    myAccessGranted = isAccessActive(myAccessUntil)
  }

  // Sales content is French-first — the course is Morocco-gated and every
  // in-course surface (dashboard, devoirs, console) is already French.
  const FEATURES: { icon: IconName; title: string; desc: string }[] = [
    { icon: 'play', title: 'Cours en direct chaque semaine', desc: 'Classique : 3 séances de 1h30 (lun/mer/ven) — ou Intensif : 2 séances de 3h (mar/jeu ou sam/dim). Petit groupe (10 max), avec un prof.' },
    { icon: 'bar-chart', title: 'Tableau de bord noté', desc: 'Note en continu, progression par leçon et vocabulaire maîtrisé — vous savez toujours où vous en êtes.' },
    { icon: 'pen', title: 'Devoirs corrigés', desc: 'Lesen, Hören, Schreiben et grammaire — corrigés automatiquement, avec retour détaillé sur vos rédactions.' },
    { icon: 'flag', title: 'Objectif Allemagne', desc: 'Un programme pensé pour l’Ausbildung, les études et le visa — par la plateforme n°1 du parcours Maroc → Allemagne.' },
  ]
  const STEPS = [
    { n: '1', title: 'Réservez votre place', desc: 'Choisissez le niveau et l’horaire qui vous conviennent ci-dessous.' },
    { n: '2', title: 'Confirmez par WhatsApp', desc: 'Vous recevez les instructions de paiement (450 DH/mois, sans engagement).' },
    { n: '3', title: 'Commencez à apprendre', desc: 'Accès immédiat au cours, au tableau de bord et aux séances en direct de votre groupe.' },
  ]
  const FAQ = [
    { q: 'Je ne connais pas mon niveau — comment choisir ?', a: 'Faites notre test de niveau gratuit (12 questions, 5 minutes) : il vous recommande directement le bon groupe A1, A2 ou B1.' },
    { q: 'Comment se passe le paiement ?', a: 'Après la réservation, vous recevez les instructions par WhatsApp. L’abonnement est mensuel (450 DH), sans engagement — vous arrêtez quand vous voulez.' },
    { q: 'Et si je rate un cours ?', a: 'Le programme, le vocabulaire et les devoirs de chaque leçon restent disponibles 24h/24 sur votre tableau de bord — vous rattrapez à votre rythme.' },
    { q: 'De quoi ai-je besoin ?', a: 'Un téléphone ou un ordinateur avec un navigateur et un micro. L’appel vidéo s’ouvre en un clic, sans installation.' },
    { q: 'Les cours préparent-ils au Goethe-Zertifikat ?', a: 'Oui — le programme suit les niveaux CECR (A1→B1) et la plateforme inclut la préparation aux épreuves Lesen, Hören et Schreiben.' },
  ]

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
          <span className="text-sm text-green-900 font-medium">Pas sûr de votre niveau ? Faites le test gratuit (5 min)</span>
          <span className="text-sm font-bold text-green-700 shrink-0">Tester →</span>
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

        <h2 className="text-lg font-bold text-gray-900 mt-10 mb-4">Choisissez votre groupe</h2>
        <ClassesClient
          locale={locale}
          groups={(groups ?? []) as ClassGroup[]}
          myGroupId={myGroupId}
          myAccessGranted={myAccessGranted}
          myAccessUntil={myAccessUntil}
          isAuthed={!!user}
        />

        {/* FAQ */}
        <h2 className="text-lg font-bold text-gray-900 mt-12 mb-4">Questions fréquentes</h2>
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
