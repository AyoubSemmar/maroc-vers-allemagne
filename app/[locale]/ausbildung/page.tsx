import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { localizeRows } from '@/lib/i18n-content'
import { articleListFieldsWithReadTime, applyLocaleAvailability, rehydrateTranslationsList } from '@/lib/article-list-select'
import PathHub, { type PathTool, type PathPillar } from '@/components/path-hub/PathHub'
import Icon from '@/components/ui/Icon'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

export const revalidate = 600

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.pathHub.ausbildung' })
  return buildLocaleMetadata({
    locale,
    path: '/ausbildung',
    title: t('title'),
    description: t('sub'),
  })
}

const AUSBILDUNG_CATEGORIES = ['Ausbildung', 'العمل']

const PILLARS: [PathPillar, PathPillar, PathPillar] = [
  { key: 'learnGerman', icon: <Icon name="book"   size={28} />, href: '/learn-german' },
  { key: 'find',        icon: <Icon name="search" size={28} />, href: '/ausbildung-jobs' },
  { key: 'visa',        icon: <Icon name="visa"   size={28} />, href: '/visa/ausbildung' },
]

const TOOLS: PathTool[] = [
  // AI tools first, then the Ausbildung journey (earn → apply → arrive → settle).
  { key: 'cv',                 icon: <Icon name="document"     size={26} />, href: '/cv-builder',                    nameKey: 'cv.name',                 descKey: 'cv.desc' },
  { key: 'anschreiben',        icon: <Icon name="pen"          size={26} />, href: '/anschreiben-generator',         nameKey: 'anschreiben.name',        descKey: 'anschreiben.desc' },
  { key: 'interviewPrep',      icon: <Icon name="mic"          size={26} />, href: '/interview-prep',                nameKey: 'interviewPrep.name',      descKey: 'interviewPrep.desc' },
  { key: 'eligibilityChecker', icon: <Icon name="check-square" size={26} />, href: '/tools/eligibility-checker',     nameKey: 'eligibilityChecker.name', descKey: 'eligibilityChecker.desc' },
  { key: 'ausbSalary',         icon: <Icon name="briefcase"    size={26} />, href: '/tools/ausbildung-salary',       nameKey: 'ausbSalary.name',         descKey: 'ausbSalary.desc' },
  { key: 'documentChecklist',  icon: <Icon name="list"         size={26} />, href: '/tools/document-checklist',      nameKey: 'documentChecklist.name',  descKey: 'documentChecklist.desc' },
  { key: 'migrationTimeline',  icon: <Icon name="map"          size={26} />, href: '/tools/migration-timeline',      nameKey: 'migrationTimeline.name',  descKey: 'migrationTimeline.desc' },
  { key: 'sperrkonto',         icon: <Icon name="lock"         size={26} />, href: '/tools/sperrkonto-calculator',   nameKey: 'sperrkonto.name',         descKey: 'sperrkonto.desc' },
  { key: 'livingCost',         icon: <Icon name="euro"         size={26} />, href: '/tools/living-cost-calculator',  nameKey: 'livingCost.name',         descKey: 'livingCost.desc' },
  { key: 'bruttoNetto',        icon: <Icon name="euro"         size={26} />, href: '/tools/brutto-netto-rechner',    nameKey: 'bruttoNetto.name',        descKey: 'bruttoNetto.desc' },
  { key: 'taxRefund',          icon: <Icon name="euro"         size={26} />, href: '/tools/tax-refund-calculator',   nameKey: 'taxRefund.name',          descKey: 'taxRefund.desc' },
  { key: 'healthInsurance',    icon: <Icon name="heart"        size={26} />, href: '/tools/health-insurance-germany', nameKey: 'healthInsurance.name',   descKey: 'healthInsurance.desc' },
  { key: 'furnishedHousing',   icon: <Icon name="home"         size={26} />, href: '/tools/furnished-housing',       nameKey: 'furnishedHousing.name',   descKey: 'furnishedHousing.desc' },
  { key: 'license',            icon: <Icon name="shield"       size={26} />, href: '/tools/driving-license-germany', nameKey: 'license.name',            descKey: 'license.desc' },
  { key: 'cityComparator',     icon: <Icon name="compass"      size={26} />, href: '/tools/city-comparator',         nameKey: 'cityComparator.name',     descKey: 'cityComparator.desc' },
  { key: 'anerkennung',        icon: <Icon name="star"         size={26} />, href: '/tools/anerkennung-wizard',      nameKey: 'anerkennung.name',        descKey: 'anerkennung.desc' },
  { key: 'chancenkarte',       icon: <Icon name="sparkles"     size={26} />, href: '/tools/chancenkarte-calculator', nameKey: 'chancenkarte.name',       descKey: 'chancenkarte.desc' },
  { key: 'gradeConverter',     icon: <Icon name="graduation"   size={26} />, href: '/tools/german-grade-calculator', nameKey: 'gradeConverter.name',     descKey: 'gradeConverter.desc' },
]

export default async function AusbildungPage({ params }: Props) {
  const { locale } = await params

  const { data: rawArticles } = await applyLocaleAvailability(
    supabase
      .from('articles')
      .select(articleListFieldsWithReadTime(locale))
      .in('category', AUSBILDUNG_CATEGORIES)
      .order('date', { ascending: false })
      .limit(12),
    locale,
  )

  const articles = localizeRows(rehydrateTranslationsList(rawArticles as any, locale), locale) as any[]

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
