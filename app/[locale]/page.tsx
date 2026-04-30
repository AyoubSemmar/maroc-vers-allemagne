import { supabase } from '@/lib/supabase'
import RihlaLanding from '@/components/landing/RihlaLanding'
import { localizeRows } from '@/lib/i18n-content'
import { ARTICLE_LIST_FIELDS_WITH_READ_TIME, rehydrateTranslationsList } from '@/lib/article-list-select'
import type { AppLocale } from '@/i18n/routing'

export const revalidate = 600

export default async function Home({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  // Lightweight select: title/summary per locale via JSONB selectors
  // (not the full translations blob). See lib/article-list-select.ts.
  const { data: rawArticles } = await supabase
    .from('articles')
    .select(ARTICLE_LIST_FIELDS_WITH_READ_TIME)
    .order('date', { ascending: false })
    .limit(20)

  const localized = localizeRows(rehydrateTranslationsList(rawArticles as any), locale) as any[]
  const featured = localized.filter((a) => a.featured)
  const picked = featured.length > 0 ? featured.slice(0, 3) : localized.slice(0, 3)
  // Drop `translations` after localization — title is already overridden,
  // and the JSONB blob (content/summary per locale) is no longer needed.
  const list = picked.map(({ translations, ...rest }) => rest)

  return <RihlaLanding articles={list} />
}
