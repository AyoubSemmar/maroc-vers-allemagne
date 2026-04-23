import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildSearchQueries } from '@/lib/jobCategories'
import { categorizeJob } from '@/lib/categorizeJobs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes — we do many requests

// Bundesagentur für Arbeit public Jobsuche API.
// The public client ID "jobboerse-jobsuche" is used by their own web search page.
const ARBEITSAGENTUR_URL =
  'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs'

const API_HEADERS = {
  'X-API-Key': 'jobboerse-jobsuche',
  Accept: 'application/json',
}

type AAJob = {
  hashId?: string
  refnr?: string
  titel?: string
  beruf?: string
  arbeitgeber?: string
  arbeitsort?: {
    plz?: string
    ort?: string
    region?: string
    land?: string
  }
  aktuelleVeroeffentlichungsdatum?: string
  eintrittsdatum?: string
  externeUrl?: string
}

function isAuthorized(req: NextRequest): boolean {
  // Vercel Cron sends Authorization: Bearer ${CRON_SECRET}
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) return true // no secret configured → allow (dev)
  return auth === `Bearer ${secret}`
}

async function searchJobs(query: string): Promise<AAJob[]> {
  const url = new URL(ARBEITSAGENTUR_URL)
  url.searchParams.set('was', query)
  url.searchParams.set('angebotsart', '4') // 4 = Ausbildung
  url.searchParams.set('size', '50')
  url.searchParams.set('page', '1')

  const res = await fetch(url.toString(), { headers: API_HEADERS })
  if (!res.ok) {
    console.error(`Arbeitsagentur API error for "${query}":`, res.status)
    return []
  }
  const data = await res.json()
  return (data?.stellenangebote ?? []) as AAJob[]
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: 'Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).' },
      { status: 500 }
    )
  }
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const queries = buildSearchQueries()
  const stats = {
    queries: queries.length,
    fetched: 0,
    inserted: 0,
    skipped: 0,
    deleted: 0,
    errors: 0 as number,
  }

  // De-duplicate by refnr/hashId across queries
  const seen = new Set<string>()
  const rows: any[] = []

  for (const q of queries) {
    try {
      const jobs = await searchJobs(q)
      stats.fetched += jobs.length
      for (const j of jobs) {
        const externalId = j.refnr || j.hashId
        if (!externalId) continue
        if (seen.has(externalId)) continue
        seen.add(externalId)

        const title = j.titel || j.beruf || ''
        if (!title) continue

        const category = categorizeJob(title)
        if (!category) { stats.skipped += 1; continue }

        const ort = j.arbeitsort?.ort || ''
        const plz = j.arbeitsort?.plz || ''
        const location = [plz, ort].filter(Boolean).join(' ')

        rows.push({
          external_id: externalId,
          title,
          company: j.arbeitgeber || '—',
          location: location || '—',
          description: j.beruf || j.titel || '',
          category,
          source: 'arbeitsagentur',
          external_url: j.externeUrl || (j.hashId
            ? `https://www.arbeitsagentur.de/jobsuche/jobdetail/${j.hashId}`
            : null),
          published_at: j.aktuelleVeroeffentlichungsdatum || null,
        })
      }
    } catch (e) {
      stats.errors += 1
      console.error(`Fetch error for "${q}":`, e)
    }
  }

  // Upsert in batches of 100
  if (rows.length > 0) {
    const chunks: any[][] = []
    for (let i = 0; i < rows.length; i += 100) chunks.push(rows.slice(i, i + 100))
    for (const chunk of chunks) {
      const { error, count } = await supabase
        .from('ausbildung_jobs')
        .upsert(chunk, { onConflict: 'external_id', count: 'exact', ignoreDuplicates: false })
      if (error) {
        stats.errors += 1
        console.error('Upsert error:', error)
      } else if (count != null) {
        stats.inserted += count
      }
    }
  }

  // Delete jobs older than 30 days
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { error: delError, count: delCount } = await supabase
    .from('ausbildung_jobs')
    .delete({ count: 'exact' })
    .lt('created_at', cutoff)
  if (delError) {
    stats.errors += 1
    console.error('Delete error:', delError)
  } else if (delCount != null) {
    stats.deleted = delCount
  }

  return NextResponse.json({ ok: true, stats })
}
