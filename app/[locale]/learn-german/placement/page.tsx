import type { Metadata } from 'next'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { classesStrings } from '@/components/classes/strings'
import PlacementQuiz from './PlacementQuiz'

// Interactive quiz, ar/fr/en/de UI (components/classes/strings.ts), linked
// from the (Morocco-gated) classes page — noindex keeps it out of the
// thin-page pile in GSC.
export async function generateMetadata({
  params,
}: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = classesStrings(locale).placement
  return {
    title: `${t.metaTitle} — GoGermany`,
    description: t.metaDescription,
    robots: { index: false, follow: true },
  }
}

export default async function PlacementPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = classesStrings(locale).placement
  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/learn-german/classes" className="text-sm text-green-700 hover:underline mb-4 block">
          {t.backLink}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{t.heading}</h1>
        <p className="mt-2 text-gray-600">
          {t.subheading}
        </p>
        <div className="mt-8">
          <PlacementQuiz locale={locale} />
        </div>
      </div>
    </div>
  )
}
