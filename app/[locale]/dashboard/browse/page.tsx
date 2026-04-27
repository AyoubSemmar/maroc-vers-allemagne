// Renders the Ausbildung-jobs browse experience inside the dashboard shell.
// Re-uses the same client component + data fetch as /ausbildung-jobs.
import { createClient } from '@supabase/supabase-js'
import AusbildungJobsClient from '../../ausbildung-jobs/AusbildungJobsClient'
import type { Job } from '@/components/jobs/JobCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function fetchJobs(): Promise<{ jobs: Job[]; lastUpdated: string | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return { jobs: [], lastUpdated: null }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // PostgREST caps each request at max_rows=1000, so .limit(N) is silently
  // clipped. Page in 1000-row chunks until the table is exhausted.
  const CHUNK = 1000
  const MAX_PAGES = 10

  async function fetchPage(useEnriched: boolean, from: number, to: number) {
    const cols = useEnriched
      ? 'id,external_id,title,company,location,description,category,external_url,apply_url,contact_email,phone,anstellungsart,published_at,created_at,enrichment_json'
      : 'id,external_id,title,company,location,description,category,external_url,apply_url,contact_email,phone,anstellungsart,published_at,created_at'
    let q = supabase
      .from('ausbildung_jobs')
      .select(cols)
      .or('contact_email.not.is.null,apply_url.not.is.null')
    if (useEnriched) q = q.order('enriched_at', { ascending: false, nullsFirst: false })
    q = q.order('published_at', { ascending: false, nullsFirst: false })
    return q.range(from, to)
  }

  let useEnriched = true
  const all: any[] = []
  for (let page = 0; page < MAX_PAGES; page++) {
    const from = page * CHUNK
    const to = from + CHUNK - 1
    const res = await fetchPage(useEnriched, from, to)
    if (res.error) {
      if (useEnriched && page === 0) { useEnriched = false; page = -1; continue }
      break
    }
    const rows = res.data ?? []
    all.push(...rows)
    if (rows.length < CHUNK) break
  }

  const jobs = all as Job[]
  const lastUpdated = jobs[0]?.created_at || null
  return { jobs, lastUpdated }
}

export default async function DashboardBrowsePage() {
  const { jobs, lastUpdated } = await fetchJobs()
  return <AusbildungJobsClient jobs={jobs} lastUpdated={lastUpdated} />
}
