import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import ToolSeoSection from '@/components/seo/ToolSeoSection'
import RelatedTools from '@/components/seo/RelatedTools'
import DocumentChecklist from '../../DocumentChecklist'
import {
  COUNTRIES,
  COUNTRY_ORDER,
  type CountryKey,
  type PathKey,
} from '@/lib/documentChecklistData'

// Map URL slug → PathKey
const VISA_TYPE_MAP: Record<string, PathKey> = {
  ausbildung: 'ausbildung',
  studium: 'studium',
  tourist: 'tourist',
  'family-reunification': 'family_reunification',
}

const PATH_TO_SLUG: Record<PathKey, string> = {
  ausbildung: 'ausbildung',
  studium: 'studium',
  tourist: 'tourist',
  family_reunification: 'family-reunification',
}

type Props = {
  params: Promise<{ locale: AppLocale; country: string; 'visa-type': string }>
}

export async function generateStaticParams() {
  const params: Array<{ country: string; 'visa-type': string }> = []
  const visaSlugs = Object.keys(VISA_TYPE_MAP)
  for (const country of COUNTRY_ORDER) {
    for (const visaType of visaSlugs) {
      params.push({ country, 'visa-type': visaType })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country: countrySlug, 'visa-type': visaSlug } = await params
  const country = COUNTRIES[countrySlug as CountryKey]
  const pathKey = VISA_TYPE_MAP[visaSlug]
  if (!country || !pathKey) return {}

  const t = await getTranslations({ locale, namespace: 'documentChecklist' })
  const countryName = country.name[locale] ?? country.name.en
  const pathName = t(`path.${pathKey}`)

  return buildLocaleMetadata({
    locale,
    path: `/tools/document-checklist/${countrySlug}/${visaSlug}`,
    title: t('seoCountryPageTitle', { country: countryName, path: pathName }),
    description: t('seoCountryPageDesc', { country: countryName, path: pathName }),
  })
}

export default async function CountryVisaPage({ params }: Props) {
  const { locale, country: countrySlug, 'visa-type': visaSlug } = await params

  if (!(countrySlug in COUNTRIES) || !(visaSlug in VISA_TYPE_MAP)) {
    notFound()
  }

  return (
    <>
      <DocumentChecklist
        locale={locale}
        initialCountry={countrySlug as CountryKey}
        initialPath={VISA_TYPE_MAP[visaSlug]}
      />
      <ToolSeoSection locale={locale} namespace="documentChecklist" />
      <RelatedTools locale={locale} current="documentChecklist" />
    </>
  )
}
