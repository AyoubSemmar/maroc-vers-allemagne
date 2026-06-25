import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// First-party analytics ingest. Public (it's a tracking beacon) but writes go
// through the service role so the table stays RLS-locked; we validate + cap
// everything and store no IP, cookie, or user id.
const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

const clean = (v: unknown, max: number) =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null

export async function POST(req: NextRequest) {
  try {
    const b = await req.json().catch(() => ({}))
    const type = b?.type === 'search' ? 'search' : b?.type === 'pageview' ? 'pageview' : null
    if (!type) return new NextResponse(null, { status: 204 })

    const row = {
      type,
      path: type === 'pageview' ? clean(b.path, 300) : null,
      term: type === 'search' ? clean(b.term, 120) : null,
      locale: clean(b.locale, 8),
      ref: clean(b.ref, 120),
    }
    // Don't await the round-trip beyond the insert; ignore errors silently so a
    // tracking failure never affects the user.
    await sbAdmin.from('analytics_events').insert(row)
    return new NextResponse(null, { status: 204 })
  } catch {
    return new NextResponse(null, { status: 204 })
  }
}
