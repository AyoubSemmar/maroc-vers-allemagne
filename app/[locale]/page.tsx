import { supabase } from '@/lib/supabase'
import RihlaLanding from '@/components/landing/RihlaLanding'
import { localizeRows } from '@/lib/i18n-content'
import type { AppLocale } from '@/i18n/routing'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  // Only the 3 cards on the landing page render — pull just the columns
  // they need (+ `translations` so localizeRow can swap `title`). Avoids
  // shipping the heavy `content`/`summary`/`body_md` markdown for every
  // one of the 136 articles × 4 locales on every page request.
  const { data: rawArticles } = await supabase
    .from('articles')
    .select('id, title, category, image_url, date, read_time, featured, translations')
    .order('date', { ascending: false })
    .limit(20)

  const localized = localizeRows((rawArticles ?? []) as any, locale) as any[]
  const featured = localized.filter((a) => a.featured)
  const picked = featured.length > 0 ? featured.slice(0, 3) : localized.slice(0, 3)
  // Drop `translations` after localization — title is already overridden,
  // and the JSONB blob (content/summary per locale) is no longer needed.
  const list = picked.map(({ translations, ...rest }) => rest)

  return <RihlaLanding articles={list} />
}
