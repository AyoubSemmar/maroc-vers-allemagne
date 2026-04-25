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
  const { data: rawArticles } = await supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false })

  const articles = localizeRows((rawArticles ?? []) as any, locale) as any[]
  const featured = articles.filter((a) => a.featured)
  const list = featured.length > 0 ? featured.slice(0, 3) : articles.slice(0, 3)

  return <RihlaLanding articles={list} />
}
