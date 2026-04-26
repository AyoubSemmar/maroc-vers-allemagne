import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import type { AppLocale } from '@/i18n/routing'
import UniversitiesClient, { type UniversityRow } from '@/components/universities/UniversitiesClient'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'universities' })
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  }
}

export default async function UniversitiesPage({ params }: Props) {
  const { locale } = await params

  // Pull every public German uni. Phase 1 lists ~220 rows so a single
  // query is fine; we'll switch to pagination once Phase 2 inflates the
  // joined program counts.
  const { data: rows, error } = await supabase
    .from('universities')
    .select('id, name_de, name_en, name_ar, name_fr, city, state, type, founded, student_count, website, logo_url, lat, lng, is_public')
    .eq('is_public', true)
    .order('name_de', { ascending: true })

  if (error) {
    console.error('[universities] fetch failed:', error)
  }

  const universities: UniversityRow[] = (rows ?? []).map((r) => ({
    id: r.id,
    name: pickLocale(r, 'name', locale),
    city: r.city,
    state: r.state,
    type: r.type,
    founded: r.founded,
    studentCount: r.student_count,
    website: r.website,
    logoUrl: r.logo_url,
  }))

  return <UniversitiesClient universities={universities} locale={locale} />
}

function pickLocale<T extends Record<string, any>>(row: T, base: string, locale: AppLocale): string {
  return row[`${base}_${locale}`] || row[`${base}_en`] || row[`${base}_de`] || ''
}
