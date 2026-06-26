import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/entitlements'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Tells the client whether to show the Morocco-only live classes. Allowed when
// the visitor is in Morocco (Vercel x-vercel-ip-country) OR is a signed-in
// admin (so the owner can see/manage it from anywhere). Dev → allowed.
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

  const allow = country === 'MA' || admin
  return NextResponse.json({ country, allow }, { headers: { 'Cache-Control': 'no-store' } })
}
