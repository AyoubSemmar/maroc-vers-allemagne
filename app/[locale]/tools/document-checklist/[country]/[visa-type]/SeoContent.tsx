import type { CountryRule, CalcResult, PathKey } from '@/lib/documentChecklistData'

type Props = {
  country: CountryRule
  countryKey: string
  countryName: string
  path: PathKey
  result: CalcResult
  /** next-intl t() bound to documentChecklist namespace */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, values?: Record<string, string | number>) => string
}

export default function SeoContent({ country, countryName, path, result, t }: Props) {
  const authMethod = result.authMethod === 'apostille' ? t('apostille') : t('legalization')
  const authMethodDetail = t(
    result.authMethod === 'apostille'
      ? 'authMethodDetail.apostille'
      : 'authMethodDetail.legalization',
    { country: countryName },
  )
  const apsDetail = t(
    country.apsRequired ? 'apsDetail.required' : 'apsDetail.notRequired',
    { country: countryName },
  )

  const vars = {
    country: countryName,
    authMethod,
    authMethodDetail,
    authFeeMin: country.authFeeEur[0],
    authFeeMax: country.authFeeEur[1],
    authDaysMin: country.authDays[0],
    authDaysMax: country.authDays[1],
    totalDocs: result.totalDocs,
    totalCostMin: result.totalCostEur[0],
    totalCostMax: result.totalCostEur[1],
    timelineMin: result.realisticTimelineWeeks[0],
    timelineMax: result.realisticTimelineWeeks[1],
    visaFee: path === 'tourist' ? (country.touristVisaFeeEur || 90) : 75,
    apsDetail,
  }

  // For no-visa pages, render the short note instead of the long article
  if (result.noVisaRequired) {
    const isEu = !country.touristVisaRequired && !country.nationalDVisaRequired
    const textKey = isEu ? 'seoContent.noVisaEu' : 'seoContent.touristFree'
    return (
      <section className="cvp-seo-section" aria-label={t('seoArticleTitle', { country: countryName, path: t(`path.${path}`) })}>
        <p className="cvp-seo-p">{t(textKey, vars)}</p>
      </section>
    )
  }

  const paragraphKeys: string[] = (() => {
    if (path === 'ausbildung') return ['seoContent.ausbildung.p1', 'seoContent.ausbildung.p2', 'seoContent.ausbildung.p3', 'seoContent.ausbildung.p4']
    if (path === 'studium')    return ['seoContent.studium.p1', 'seoContent.studium.p2', 'seoContent.studium.p3', 'seoContent.studium.p4']
    if (path === 'tourist')    return ['seoContent.tourist.p1', 'seoContent.tourist.p2', 'seoContent.tourist.p3', 'seoContent.tourist.p4']
    return ['seoContent.family_reunification.p1', 'seoContent.family_reunification.p2', 'seoContent.family_reunification.p3', 'seoContent.family_reunification.p4']
  })()

  const faqKey = path === 'family_reunification' ? 'seoFaqs.family_reunification' : `seoFaqs.${path}`
  const faqCount = { ausbildung: 6, studium: 6, tourist: 6, family_reunification: 6 }[path] ?? 6

  return (
    <>
      {/* Long-form SEO article */}
      <section className="cvp-seo-section">
        <h2 className="cvp-seo-h2">
          {t('seoArticleTitle', { country: countryName, path: t(`path.${path}`) })}
        </h2>
        <div className="cvp-seo-body">
          {paragraphKeys.map((key) => (
            <p key={key} className="cvp-seo-p">{t(key as any, vars)}</p>
          ))}
        </div>
      </section>

      {/* FAQ section with schema.org FAQPage markup */}
      <section
        className="cvp-faq-section"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <h2 className="cvp-seo-h2">{t('seoFaqTitle')}</h2>
        <div className="cvp-faq-list">
          {Array.from({ length: faqCount }, (_, i) => {
            const q = t(`${faqKey}.${i}.q` as any, vars)
            const a = t(`${faqKey}.${i}.a` as any, vars)
            return (
              <div
                key={i}
                className="cvp-faq-item"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <h3 className="cvp-faq-q" itemProp="name">{q}</h3>
                <div
                  className="cvp-faq-a"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <p itemProp="text">{a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
