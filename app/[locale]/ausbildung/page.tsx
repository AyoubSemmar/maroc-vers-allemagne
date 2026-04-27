import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { localizeRows } from '@/lib/i18n-content'
import PathHub, { type PathTool, type PathPillar } from '@/components/path-hub/PathHub'
import type { AppLocale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.pathHub.ausbildung' })
  return { title: t('title'), description: t('sub') }
}

const AUSBILDUNG_CATEGORIES = ['Ausbildung', 'العمل']

const PILLARS: [PathPillar, PathPillar, PathPillar] = [
  { key: 'learnGerman', icon: '📚', href: '/learn-german' },
  { key: 'find', icon: '🔍', href: '/ausbildung-jobs' },
  { key: 'visa', icon: '🛂', href: '/visa/ausbildung' },
]

const TOOLS: PathTool[] = [
  { key: 'cv', icon: '📄', href: '/cv-builder', nameKey: 'cv.name', descKey: 'cv.desc' },
  {
    key: 'anschreiben',
    icon: '✍️',
    href: '/anschreiben-generator',
    nameKey: 'anschreiben.name',
    descKey: 'anschreiben.desc',
  },
]

export default async function AusbildungPage({ params }: Props) {
  const { locale } = await params

  const { data: rawArticles } = await supabase
    .from('articles')
    .select('id, title, category, date, image_url, read_time, translations')
    .in('category', AUSBILDUNG_CATEGORIES)
    .order('date', { ascending: false })
    .limit(12)

  const articles = localizeRows((rawArticles ?? []) as any, locale) as any[]

  return (
    <PathHub
      config={{
        path: 'ausbildung',
        pillars: PILLARS,
        tools: TOOLS,
        articles: articles.map((a) => ({
          id: a.id,
          title: a.title,
          category: a.category,
          image_url: a.image_url,
          date: a.date,
          read_time: a.read_time,
        })),
        locale,
      }}
    />
  )
}
