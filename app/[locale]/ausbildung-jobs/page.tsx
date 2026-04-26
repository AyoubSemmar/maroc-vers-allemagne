import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@supabase/supabase-js'
import AusbildungJobsClient from './AusbildungJobsClient'
import { Job } from '@/components/jobs/JobCard'
import type { AppLocale } from '@/i18n/routing'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ausbJobs' })
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  }
}

async function fetchJobs(): Promise<{ jobs: Job[]; lastUpdated: string | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return { jobs: [], lastUpdated: null }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Try the enriched query first; fall back to the original columns if
  // the migration hasn't been run yet (so the page never goes blank).
  async function fetchEnriched() {
    return supabase
      .from('ausbildung_jobs')
      .select('id,external_id,title,company,location,description,category,external_url,apply_url,contact_email,anstellungsart,published_at,created_at,enrichment_json')
      .or('contact_email.not.is.null,apply_url.not.is.null')
      .order('enriched_at', { ascending: false, nullsFirst: false })
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(400)
  }
  async function fetchPlain() {
    return supabase
      .from('ausbildung_jobs')
      .select('id,external_id,title,company,location,description,category,external_url,apply_url,contact_email,anstellungsart,published_at,created_at')
      .or('contact_email.not.is.null,apply_url.not.is.null')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(400)
  }
  const enrichedRes = await fetchEnriched()
  let data: any[] | null = enrichedRes.data as any[] | null
  if (enrichedRes.error) {
    // 42703 = column does not exist (migration not run yet) — fall back
    const fallback = await fetchPlain()
    data = fallback.data as any[] | null
  }

  const jobs = (data || []) as Job[]
  const lastUpdated = jobs[0]?.created_at || null
  return { jobs, lastUpdated }
}

export default async function AusbildungJobsPage() {
  const { jobs, lastUpdated } = await fetchJobs()
  return <AusbildungJobsClient jobs={jobs} lastUpdated={lastUpdated} />
}
