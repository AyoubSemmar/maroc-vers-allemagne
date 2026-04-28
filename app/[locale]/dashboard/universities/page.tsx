// Renders the universities browse experience inside the dashboard shell.
// Re-uses the same client component + data fetch as /universities.
import { supabase } from '@/lib/supabase'
import type { AppLocale } from '@/i18n/routing'
import UniversitiesClient, { type UniversityRow } from '@/components/universities/UniversitiesClient'

type Props = { params: Promise<{ locale: AppLocale }> }

// ISR: universities are slow-moving reference data (state/founding/website
// rarely change). 1-hour cache is plenty fresh and avoids re-querying the
// full ~400-row list on every dashboard click.
export const revalidate = 3600

export default async function DashboardUniversitiesPage({ params }: Props) {
  const { locale } = await params

  const { data: rows } = await supabase
    .from('universities')
    .select('id, name_de, name_en, name_ar, name_fr, city, state, type, founded, student_count, website, logo_url, lat, lng, is_public')
    .eq('is_public', true)
    .order('name_de', { ascending: true })

  const universities: UniversityRow[] = (rows ?? []).map((r: any) => ({
    id: r.id,
    name: r[`name_${locale}`] || r.name_en || r.name_de || '',
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
