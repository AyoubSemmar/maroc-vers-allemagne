import { NextRequest, NextResponse } from 'next/server'
import { buildAaQuery, searchAusbildung } from '@/lib/ausbildungSearch'

// Proxy for the client-side Ausbildung board. Keeps the Arbeitsagentur
// call server-side (shared 30-min cache via unstable_cache, no CORS) and
// whitelists params so users can't turn us into an open proxy.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const qs = buildAaQuery({
    was: sp.get('was'),
    wo: sp.get('wo'),
    umkreis: sp.get('umkreis'),
    days: sp.get('days'),
    page: sp.get('page'),
  })
  try {
    const result = await searchAusbildung(qs)
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    })
  } catch {
    return NextResponse.json({ total: 0, jobs: [], error: true }, { status: 502 })
  }
}
