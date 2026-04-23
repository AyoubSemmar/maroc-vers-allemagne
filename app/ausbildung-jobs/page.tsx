import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import AusbildungJobsClient from './AusbildungJobsClient'
import { Job } from '@/components/jobs/JobCard'

export const metadata: Metadata = {
  title: 'Ausbildung Jobs — فرص التدريب المهني | دليلك نحو ألمانيا',
  description: 'عروض Ausbildung في ألمانيا محدّثة يومياً من Bundesagentur für Arbeit، مصنّفة حسب القطاع.',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function fetchJobs(): Promise<{ jobs: Job[]; lastUpdated: string | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return { jobs: [], lastUpdated: null }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data } = await supabase
    .from('ausbildung_jobs')
    .select('id,external_id,title,company,location,description,category,external_url,apply_url,contact_email,anstellungsart,published_at,created_at')
    .or('contact_email.not.is.null,apply_url.not.is.null')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(400)

  const jobs = (data || []) as Job[]
  const lastUpdated = jobs[0]?.created_at || null
  return { jobs, lastUpdated }
}

export default async function AusbildungJobsPage() {
  const { jobs, lastUpdated } = await fetchJobs()
  return <AusbildungJobsClient jobs={jobs} lastUpdated={lastUpdated} />
}
