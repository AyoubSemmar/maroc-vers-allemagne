import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { levels } from '@/lib/german-data'
import type { AppLocale } from '@/i18n/routing'
import ResultsClient, { type LevelSummary } from './ResultsClient'

type Props = { params: Promise<{ locale: AppLocale }> }

// Personal dashboard — nothing here is indexable content.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'learnGerman.results' })
  return { title: t('metaTitle'), robots: { index: false, follow: true } }
}

export default async function ResultsPage({ params }: Props) {
  await params
  // Light per-level summary (id, size, lessonId → order) so the client can
  // label scores without shipping the multi-MB lesson data files.
  const summaries: LevelSummary[] = levels.map(l => ({
    id: l.id,
    emoji: l.emoji,
    color: l.color,
    total: l.lessons.length,
    orders: Object.fromEntries(l.lessons.map(ls => [ls.id, ls.order])),
  }))
  return <ResultsClient levels={summaries} />
}
