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

        {/* Bachelor / Master cards. For uni-assist member unis (5 hardcoded
            for now), deep-links to uni-assist's course finder filtered to
            that uni + level — shows real programs accepting international
            applicants, with deadlines and fees. For other unis, links to
            the homepage. */}
        <section className="uni-detail-section">
          <h2>{td('programsTitle')}</h2>
          {isUniAssistMember(slug) && (
            <div className="uni-assist-badge">
              <span aria-hidden>✓</span> {td('viaUniAssist')}
            </div>
          )}
          <div className="uni-level-grid">
            <a
              href={programLinkUrl(slug, name, 'bachelor', row.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="uni-level-card uni-level-card--bachelor uni-level-card--link"
            >
              <div className="uni-level-icon" aria-hidden>🎓</div>
              <div className="uni-level-body">
                <h3>{td('bachelorTitle')}</h3>
                <p>{isUniAssistMember(slug) ? td('bachelorDescUniAssist') : td('bachelorDescOnSite')}</p>
                <span className="uni-level-cta">
                  {isUniAssistMember(slug) ? td('seeOnUniAssist') : td('seeOnUniSite')} ↗
                </span>
              </div>
            </a>
            <a
              href={programLinkUrl(slug, name, 'master', row.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="uni-level-card uni-level-card--master uni-level-card--link"
            >
              <div className="uni-level-icon" aria-hidden>📚</div>
              <div className="uni-level-body">
                <h3>{td('masterTitle')}</h3>
                <p>{isUniAssistMember(slug) ? td('masterDescUniAssist') : td('masterDescOnSite')}</p>
                <span className="uni-level-cta">
                  {isUniAssistMember(slug) ? td('seeOnUniAssist') : td('seeOnUniSite')} ↗
                </span>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

function pick<T extends Record<string, any>>(row: T, base: string, locale: AppLocale): string {
  return row[`${base}_${locale}`] || row[`${base}_en`] || row[`${base}_de`] || ''
}

// THIN-SLICE TEST: deep-link to uni-assist's course finder for 5 known
// member unis. Other unis fall back to the homepage. If clicking on the
// 5 below lands on a useful filtered list, we expand to all ~170
// uni-assist member unis. If not, we adjust the URL pattern.
//
// uni-assist filters its course finder by "Hochschulname" (string match).
const UNI_ASSIST_MEMBERS: Record<string, string> = {
  'technische-universitat-munchen':         'Technische Universität München',
  'rwth-aachen-university':                  'RWTH Aachen',
  'ruprecht-karls-universitat-heidelberg':   'Universität Heidelberg',
  'ludwig-maximilians-universitat-munchen':  'Ludwig-Maximilians-Universität München',
  'freie-universitat-berlin':                'Freie Universität Berlin',
}

function programLinkUrl(uniSlug: string, fallbackName: string, level: 'bachelor' | 'master', websiteUrl: string | null): string {
  // Use uni-assist for known member unis
  const uniAssistName = UNI_ASSIST_MEMBERS[uniSlug]
  if (uniAssistName) {
    const params = new URLSearchParams()
    params.set('tx_uacoursefinder_pi1[searchword]', uniAssistName)
    params.set('tx_uacoursefinder_pi1[degree]', level === 'bachelor' ? '1' : '2')
    return `https://www.uni-assist.de/en/tools/course-finder/?${params}`
  }
  // Fallback for non-member unis: just the homepage
  return websiteUrl ?? '#'
}

function isUniAssistMember(uniSlug: string): boolean {
  return uniSlug in UNI_ASSIST_MEMBERS
}
