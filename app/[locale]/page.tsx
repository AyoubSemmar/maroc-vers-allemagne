import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import RihlaLanding from '@/components/landing/RihlaLanding'
import { localizeRows } from '@/lib/i18n-content'
import { ARTICLE_LIST_FIELDS_WITH_READ_TIME, rehydrateTranslationsList } from '@/lib/article-list-select'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

export const revalidate = 600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}): Promise<Metadata> {
  const { locale } = await params
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tLanding = await getTranslations({ locale, namespace: 'landing.hero' })
  // Title: "GoGermany — <hero subline>" so the homepage stops sharing
  // the same generic <title> across all locales.
  const title = `${tCommon('appName')} — ${tLanding('eyebrow')}`
  return buildLocaleMetadata({
    locale,
    path: '',
    title,
    description: tLanding('sub'),
  })
}

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
