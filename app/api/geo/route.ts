import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/entitlements'
import { CLASSES_GEO_GATED, CLASSES_ALLOWED_COUNTRIES } from '@/lib/classes-flags'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Tells the client whether to show the geo-gated live classes. Allowed when the
// visitor is in a served country (CLASSES_ALLOWED_COUNTRIES: MA/FR/DE, via
// Vercel x-vercel-ip-country) OR is a signed-in admin (so the owner can
// see/manage it from anywhere). Dev → allowed.
export async function GET(req: NextRequest) {
  const country =
    process.env.NODE_ENV !== 'production'
      ? 'MA'
      : req.headers.get('x-vercel-ip-country') || null

  let admin = false
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (user) admin = await isAdmin(user.id)
  } catch {}

  // When the geo gate is off, the classes CTA shows everywhere (testing);
  // otherwise it's limited to the served countries, with admins bypassing from
  // any country.
  const allow =
    !CLASSES_GEO_GATED ||
    (country != null && (CLASSES_ALLOWED_COUNTRIES as readonly string[]).includes(country)) ||
    admin
  return NextResponse.json({ country, allow }, { headers: { 'Cache-Control': 'no-store' } })
}
