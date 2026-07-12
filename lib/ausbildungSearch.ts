import { unstable_cache } from 'next/cache'

// Live Ausbildung search against the Bundesagentur für Arbeit's public
// Jobsuche API — the same source the big German job boards aggregate.
// ~177k live Ausbildung offers (angebotsart=4), hundreds added per day.
// The API key below is the public one the arbeitsagentur.de frontend
// itself sends; it is not a secret.

export type AaJob = {
  refnr: string
  title: string
  beruf: string
  company: string
  city: string
  plz: string
  region: string
  published: string | null
  start: string | null
}

export type AaResult = { total: number; jobs: AaJob[] }

const ENDPOINT = 'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs'

async function fetchAa(qs: string): Promise<AaResult> {
  const res = await fetch(`${ENDPOINT}?${qs}`, {
    headers: { 'X-API-Key': 'jobboerse-jobsuche' },
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`arbeitsagentur ${res.status}`)
  const data = await res.json()
  const jobs: AaJob[] = ((data.stellenangebote ?? []) as any[])
    .map((j) => ({
      refnr: String(j.refnr ?? ''),
      title: String(j.titel || j.beruf || 'Ausbildung'),
      beruf: String(j.beruf ?? ''),
      company: String(j.arbeitgeber ?? ''),
      city: String(j.arbeitsort?.ort ?? ''),
      plz: String(j.arbeitsort?.plz ?? ''),
      region: String(j.arbeitsort?.region ?? ''),
      published: j.aktuelleVeroeffentlichungsdatum ?? null,
      start: j.eintrittsdatum ?? null,
    }))
    .filter((j) => j.refnr)
  return { total: Number(data.maxErgebnisse) || 0, jobs }
}

// One cache entry per normalized query string, shared across all visitors.
// 30 min staleness is invisible on a feed where ~800 offers arrive per day.
export const searchAusbildung = unstable_cache(fetchAa, ['aa-ausbildung-v1'], {
  revalidate: 1800,
})

/** Whitelist + normalize user-supplied search params into an AA query. */
export function buildAaQuery(opts: {
  was?: string | null
  wo?: string | null
  umkreis?: string | null
  days?: string | null
  page?: string | null
  size?: string | null
}): string {
  const p = new URLSearchParams({ angebotsart: '4' })
  p.set('size', opts.size && /^\d{1,2}$/.test(opts.size) ? opts.size : '25')
  if (opts.was) p.set('was', opts.was.slice(0, 100))
  if (opts.wo) {
    p.set('wo', opts.wo.slice(0, 100))
    if (opts.umkreis && /^\d{1,3}$/.test(opts.umkreis)) p.set('umkreis', opts.umkreis)
  }
  if (opts.days && /^\d{1,3}$/.test(opts.days)) p.set('veroeffentlichtseit', opts.days)
  if (opts.page && /^\d{1,3}$/.test(opts.page)) p.set('page', opts.page)
  p.sort() // stable key → better cache hit rate
  return p.toString()
}

/** Official detail/application page for an offer. */
export function aaDetailUrl(refnr: string): string {
  return `https://www.arbeitsagentur.de/jobsuche/jobdetail/${encodeURIComponent(refnr)}`
}
