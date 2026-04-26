import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: AppLocale; slug: string }> }

const TYPE_LABEL_KEYS: Record<string, string> = {
  university: 'typeUniversity',
  applied_sciences: 'typeAppliedSciences',
  technical: 'typeTechnical',
  art: 'typeArt',
  music: 'typeMusic',
  medical: 'typeMedical',
  pedagogical: 'typePedagogical',
  theological: 'typeTheological',
  dual: 'typeDual',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const { data } = await supabase
    .from('universities')
    .select('name_de, name_en, name_ar, name_fr, city')
    .eq('id', slug)
    .single()
  if (!data) return {}
  const name = pick(data, 'name', locale)
  const t = await getTranslations({ locale, namespace: 'universities.detail' })
  return {
    title: `${name} — GoGermany`,
    description: t('metaDesc', { name, city: data.city ?? '' }),
  }
}

export default async function UniversityDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'universities' })
  const td = await getTranslations({ locale, namespace: 'universities.detail' })

  const { data: row } = await supabase
    .from('universities')
    .select('*')
    .eq('id', slug)
    .single()

  if (!row) notFound()

  const name = pick(row, 'name', locale)

  return (
    <div className="rihla uni-detail" dir={dirFor(locale)}>
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Link href="/universities" className="uni-back">← {td('backToList')}</Link>

        <div className="uni-detail-head">
          <div className="uni-detail-logo" aria-hidden>
            {row.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.logo_url} alt="" />
            ) : (
              <span>{name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1 className="uni-detail-title">{name}</h1>
            <div className="uni-detail-meta">
              {row.city && <span>📍 {row.city}{row.state ? `, ${row.state}` : ''}</span>}
              {row.type && <span className="uni-detail-type">{t(TYPE_LABEL_KEYS[row.type] ?? 'typeUniversity')}</span>}
              {row.founded && <span>{td('founded')}: {row.founded}</span>}
              {row.student_count && <span>{td('students')}: {row.student_count.toLocaleString(locale)}</span>}
            </div>
          </div>
        </div>

        {/* Big primary CTA — official website */}
        {row.website && (
          <a
            href={row.website}
            target="_blank"
            rel="noopener noreferrer"
            className="uni-website-cta"
          >
            <div className="uni-website-cta-text">
              <span className="uni-website-cta-label">{td('officialWebsite')}</span>
              <span className="uni-website-cta-url">
                {row.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </span>
            </div>
            <span className="uni-website-cta-arrow" aria-hidden>↗</span>
          </a>
        )}

        {/* Bachelor / Master — deep-link to Hochschulkompass (the official
            German government catalog) prefilled with this university's name.
            Free-text query handles all 558 unis without needing per-uni IDs. */}
        <section className="uni-detail-section">
          <h2>{td('programsTitle')}</h2>
          <div className="uni-level-grid">
            <a
              href={hochschulkompassSearchUrl(name, 'bachelor', locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="uni-level-card uni-level-card--bachelor uni-level-card--link"
            >
              <div className="uni-level-icon" aria-hidden>🎓</div>
              <div className="uni-level-body">
                <h3>{td('bachelorTitle')}</h3>
                <p>{td('bachelorDescLive')}</p>
                <span className="uni-level-cta">{td('searchOnHochschulkompass')} ↗</span>
              </div>
            </a>
            <a
              href={hochschulkompassSearchUrl(name, 'master', locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="uni-level-card uni-level-card--master uni-level-card--link"
            >
              <div className="uni-level-icon" aria-hidden>📚</div>
              <div className="uni-level-body">
                <h3>{td('masterTitle')}</h3>
                <p>{td('masterDescLive')}</p>
                <span className="uni-level-cta">{td('searchOnHochschulkompass')} ↗</span>
              </div>
            </a>
          </div>
          <p className="uni-level-note">{td('hochschulkompassNote')}</p>
        </section>
      </div>
    </div>
  )
}

function pick<T extends Record<string, any>>(row: T, base: string, locale: AppLocale): string {
  return row[`${base}_${locale}`] || row[`${base}_en`] || row[`${base}_de`] || ''
}

// Hochschulkompass free-text search prefilled with university name + level.
// Locale picks /en/ or /de/ entry point for the search results page.
function hochschulkompassSearchUrl(uniName: string, level: 'bachelor' | 'master', locale: AppLocale): string {
  const langPath = locale === 'de' ? '' : 'en/'
  const query = `${uniName} ${level}`
  // The site's search field is `tx_szhrksearch_pi1[suche]`. Prefilling
  // it just runs a query when the user lands.
  const params = new URLSearchParams()
  params.set('tx_szhrksearch_pi1[search]', '1')
  params.set('tx_szhrksearch_pi1[suche]', query)
  return `https://www.hochschulkompass.de/${langPath}study/study-programs/study-program-finder.html?${params}`
}
