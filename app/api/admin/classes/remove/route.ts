import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/entitlements'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

/**
 * Remove a student's booking (e.g. they never paid). Deleting the row fires
 * the booked_count trigger, freeing the seat. Gated by the calling user's
 * profiles.is_admin, mirroring /api/admin/grant.
 */
export async function POST(req: NextRequest) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let bookingId = ''
    try {
      const body = await req.json()
      if (typeof body?.bookingId === 'string') bookingId = body.bookingId
    } catch {}
    if (!bookingId) return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })

    const { error } = await sbAdmin.from('class_bookings').delete().eq('id', bookingId)
    if (error) {
      console.error('[admin/classes/remove] delete error:', error)
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[admin/classes/remove] error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
