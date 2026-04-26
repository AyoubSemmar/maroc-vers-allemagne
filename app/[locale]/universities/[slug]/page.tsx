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
            {row.website && (
              <a href={row.website} target="_blank" rel="noopener noreferrer" className="uni-detail-site">
                🌐 {row.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            )}
          </div>
        </div>

        <section className="uni-detail-section">
          <h2>{td('programsTitle')}</h2>
          <div className="uni-detail-soon">
            <span aria-hidden style={{ fontSize: 28 }}>📚</span>
            <p>{td('programsSoon')}</p>
            {row.website && (
              <a href={row.website} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                {td('visitOfficialSite')} →
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function pick<T extends Record<string, any>>(row: T, base: string, locale: AppLocale): string {
  return row[`${base}_${locale}`] || row[`${base}_en`] || row[`${base}_de`] || ''
}
