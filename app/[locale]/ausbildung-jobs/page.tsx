import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@supabase/supabase-js'
import AusbildungJobsClient from './AusbildungJobsClient'
import { Job } from '@/components/jobs/JobCard'
import type { AppLocale } from '@/i18n/routing'

// ISR: serve a cached HTML for 5 min, then re-generate in the background.
// Listings are nightly-fed by the scraper, so 5-min staleness is fine and
// this turns the heavy ~10k-row Supabase fetch into a once-per-300s job
// instead of once-per-click. Mobile TTFB drops from seconds to <100ms.
export const revalidate = 300

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

  // PostgREST has a default max_rows of 1000 per request, so a single
  // `.limit(N)` is silently clipped to 1000. We page in 1000-row chunks
  // until the table is exhausted.
  const CHUNK = 1000
  const MAX_PAGES = 10 // safety cap (≤ 10k rows fetched)

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
      // 42703 = column does not exist (migration not run) — fall back to plain
      // shape on the first page only and restart from page 0.
      if (useEnriched && page === 0) {
        useEnriched = false
        page = -1
        continue
      }
      break
    }
    const rows = res.data ?? []
    all.push(...rows)
    if (rows.length < CHUNK) break
  }
  const data = all

  // Slim each row before it goes over the wire to the client:
  //  • description trimmed to a 280-char preview (the card only renders a
  //    160-char excerpt, and the full markdown body is loaded from the
  //    detail/modal anyway). Description is the heaviest text column —
  //    without this trim each row averages a few KB of unused markdown.
  //  • enrichment_json reduced to the two fields actually read on the
  //    card + apply modal (translations.title preview + duration_months).
  //    The full blob contains large arrays (what_youll_learn,
  //    requirements, benefits, summary, salary, tags…) that are not
  //    rendered on the listing.
  // For the same reason, translations are also previewed at 280 chars.
  const PREVIEW = 280
  const trimText = (s: unknown) =>
    typeof s === 'string' && s.length > PREVIEW ? s.slice(0, PREVIEW) : (s ?? null)
  const jobs = (data || []).map((r: any) => {
    const e = r.enrichment_json
    const trans = e?.translations
      ? {
          ar: trimText(e.translations.ar),
          fr: trimText(e.translations.fr),
          en: trimText(e.translations.en),
        }
      : null
    return {
      ...r,
      description: trimText(r.description),
      enrichment_json: e
        ? { translations: trans, duration_months: e.duration_months ?? null }
        : null,
    } as Job
  })
  const lastUpdated = jobs[0]?.created_at || null
  return { jobs, lastUpdated }
}

export default async function AusbildungJobsPage() {
  const { jobs, lastUpdated } = await fetchJobs()
  return <AusbildungJobsClient jobs={jobs} lastUpdated={lastUpdated} />
}
