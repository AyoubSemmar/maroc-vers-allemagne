import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import RelatedTools from '@/components/seo/RelatedTools'
import DocumentChecklist from '../../DocumentChecklist'
import {
  COUNTRIES,
  COUNTRY_ORDER,
  CATEGORY_ORDER,
  CATEGORY_ICON,
  calculate,
  type CountryKey,
  type PathKey,
  type CategoryKey,
} from '@/lib/documentChecklistData'
import './country-visa.css'

const VISA_TYPE_MAP: Record<string, PathKey> = {
  ausbildung: 'ausbildung',
  studium: 'studium',
  tourist: 'tourist',
  'family-reunification': 'family_reunification',
}

type Props = {
  params: Promise<{ locale: AppLocale; country: string; 'visa-type': string }>
}

export async function generateStaticParams() {
  const params: Array<{ country: string; 'visa-type': string }> = []
  for (const country of COUNTRY_ORDER) {
    for (const visaType of Object.keys(VISA_TYPE_MAP)) {
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

  if (!(countrySlug in COUNTRIES) || !(visaSlug in VISA_TYPE_MAP)) notFound()

  const countryKey = countrySlug as CountryKey
  const pathKey = VISA_TYPE_MAP[visaSlug]
  const country = COUNTRIES[countryKey]
  const t = await getTranslations({ locale, namespace: 'documentChecklist' })

  const countryName = country.name[locale] ?? country.name.en
  const pathName = t(`path.${pathKey}`)
  const year = new Date().getFullYear()

  // Calculate with sensible defaults — gives Google real content to index
  const result = calculate({
    country: countryKey,
    path: pathKey,
    education: 'bac',
    family: 'single',
    vorab: false,
    apsDone: false,
    hasGermanCert: false,
    bringFamily: false,
  })

  const authLabel = result.authMethod === 'apostille' ? t('apostille') : t('legalization')
  const fmt = new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : locale === 'fa' ? 'fa-IR' : 'fr-FR', { maximumFractionDigits: 0 })

  return (
    <div className="cvp-root">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <header className="cvp-hero">
        <div className="wrap">
          <div className="cvp-breadcrumb">
            <a href={`/${locale}/tools/document-checklist`}>{t('title')}</a>
            <span aria-hidden> › </span>
            <span>{countryName}</span>
            <span aria-hidden> › </span>
            <span>{pathName}</span>
          </div>
          <h1 className="cvp-h1">
            {t('seoPageH1', { country: countryName, path: pathName, year })}
          </h1>

          {result.noVisaRequired ? (
            <p className="cvp-intro">
              {country.touristVisaRequired === false && pathKey === 'tourist'
                ? t('seoPageIntroTouristFree', { country: countryName })
                : t('seoPageIntroNoVisa', { country: countryName })}
            </p>
          ) : (
            <>
              <p className="cvp-intro">
                {t('seoPageIntroVisa', { country: countryName, path: pathName })}
              </p>
              <div className="cvp-stats">
                <span className="cvp-stat"><strong>{result.totalDocs}</strong> {t('documents')}</span>
                <span className="cvp-stat-sep" aria-hidden>·</span>
                <span className="cvp-stat">{authLabel}</span>
                <span className="cvp-stat-sep" aria-hidden>·</span>
                <span className="cvp-stat">
                  €{fmt.format(result.totalCostEur[0])}–{fmt.format(result.totalCostEur[1])}
                </span>
                <span className="cvp-stat-sep" aria-hidden>·</span>
                <span className="cvp-stat">
                  {result.realisticTimelineWeeks[0]}–{result.realisticTimelineWeeks[1]} {t('weeks')}
                </span>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="wrap cvp-body">
        {/* ── STATIC DOCUMENT LIST (SEO-rich server-rendered HTML) ─── */}
        {!result.noVisaRequired && result.totalDocs > 0 && (
          <section className="cvp-doclist" aria-label={t('seoPageDocSection')}>
            <h2 className="cvp-section-title">{t('seoPageDocSection')}</h2>
            {CATEGORY_ORDER.map((cat: CategoryKey) => {
              const docs = result.byCategory[cat]
              if (!docs?.length) return null
              return (
                <div key={cat} className="cvp-cat">
                  <h3 className="cvp-cat-title">
                    <span aria-hidden>{CATEGORY_ICON[cat]}</span> {t(`category.${cat}`)}
                  </h3>
                  <ul className="cvp-cat-ul">
                    {docs.map(doc => (
                      <li key={doc.id} className="cvp-doc-item">
                        <span className="cvp-doc-name">{t(`docs.${doc.id}.name` as any)}</span>
                        <span className="cvp-doc-meta">
                          {doc.needsAuth && <span className="cvp-badge">{authLabel}</span>}
                          {doc.needsSwornTranslation && <span className="cvp-badge">{t('swornTranslation')}</span>}
                          {doc.mandatory && <span className="cvp-badge cvp-badge--req">{t('mandatory')}</span>}
                        </span>
                        <p className="cvp-doc-where">{t(`docs.${doc.id}.where` as any)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </section>
        )}

        {/* ── INTERACTIVE TOOL ──────────────────────────────────────── */}
        <section className="cvp-interactive">
          <h2 className="cvp-section-title">{t('seoPageInteractiveTitle')}</h2>
          <p className="cvp-interactive-sub">{t('seoPageInteractiveSub')}</p>
          <DocumentChecklist
            locale={locale}
            initialCountry={countryKey}
            initialPath={pathKey}
          />
        </section>

        <RelatedTools locale={locale} current="documentChecklist" />
      </div>
    </div>
  )
}
