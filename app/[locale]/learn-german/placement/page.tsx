import type { Metadata } from 'next'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import PlacementQuiz from './PlacementQuiz'

// Interactive quiz with French-only UI, linked from the (Morocco-gated)
// classes page — noindex keeps it out of the thin-page pile in GSC.
export const metadata: Metadata = {
  title: 'Test de niveau allemand — GoGermany',
  description:
    'Testez votre niveau d’allemand en 5 minutes (A1–B1) et trouvez le bon groupe pour les cours en direct GoGermany.',
  robots: { index: false, follow: true },
}

export default async function PlacementPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/learn-german/classes" className="text-sm text-green-700 hover:underline mb-4 block">
          ← Cours en direct
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Test de niveau</h1>
        <p className="mt-2 text-gray-600">
          12 questions, ~5 minutes. À la fin, on vous recommande le groupe (A1, A2 ou B1) adapté à votre niveau.
        </p>
        <div className="mt-8">
          <PlacementQuiz />
        </div>
      </div>
    </div>
  )
}
