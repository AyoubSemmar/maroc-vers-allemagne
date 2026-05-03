import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { localizeRows } from '@/lib/i18n-content'
import { ARTICLE_LIST_FIELDS_WITH_READ_TIME, rehydrateTranslationsList } from '@/lib/article-list-select'
import PathHub, { type PathTool, type PathPillar } from '@/components/path-hub/PathHub'
import Icon from '@/components/ui/Icon'
import type { AppLocale } from '@/i18n/routing'

export const revalidate = 600

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.pathHub.ausbildung' })
  return { title: t('title'), description: t('sub') }
}

const AUSBILDUNG_CATEGORIES = ['Ausbildung', 'العمل']

const PILLARS: [PathPillar, PathPillar, PathPillar] = [
  { key: 'learnGerman', icon: <Icon name="book"   size={28} />, href: '/learn-german' },
  { key: 'find',        icon: <Icon name="search" size={28} />, href: '/ausbildung-jobs' },
  { key: 'visa',        icon: <Icon name="visa"   size={28} />, href: '/visa/ausbildung' },
]

const TOOLS: PathTool[] = [
  { key: 'cv',                 icon: <Icon name="document"     size={26} />, href: '/cv-builder',                  nameKey: 'cv.name',                 descKey: 'cv.desc' },
  { key: 'anschreiben',        icon: <Icon name="pen"          size={26} />, href: '/anschreiben-generator',       nameKey: 'anschreiben.name',        descKey: 'anschreiben.desc' },
  { key: 'eligibilityChecker', icon: <Icon name="check-square" size={26} />, href: '/tools/eligibility-checker',   nameKey: 'eligibilityChecker.name', descKey: 'eligibilityChecker.desc' },
  { key: 'documentChecklist',  icon: <Icon name="list"         size={26} />, href: '/tools/document-checklist',    nameKey: 'documentChecklist.name',  descKey: 'documentChecklist.desc' },
  { key: 'migrationTimeline',  icon: <Icon name="map"          size={26} />, href: '/tools/migration-timeline',    nameKey: 'migrationTimeline.name',  descKey: 'migrationTimeline.desc' },
  { key: 'livingCost',         icon: <Icon name="euro"         size={26} />, href: '/tools/living-cost-calculator', nameKey: 'livingCost.name',        descKey: 'livingCost.desc' },
]

export default async function AusbildungPage({ params }: Props) {
  const { locale } = await params

  const { data: rawArticles } = await supabase
    .from('articles')
    .select(ARTICLE_LIST_FIELDS_WITH_READ_TIME)
    .in('category', AUSBILDUNG_CATEGORIES)
    .order('date', { ascending: false })
    .limit(12)

  const articles = localizeRows(rehydrateTranslationsList(rawArticles as any), locale) as any[]

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
