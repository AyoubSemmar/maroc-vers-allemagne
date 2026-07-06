import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/entitlements'
import { nextAccessUntil } from '@/lib/courseAccess'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

/**
 * Grant / renew / revoke a booked student's course access after payment.
 *
 * Access is a DATE (class_bookings.access_until): active while today <= that
 * date. "grant" (a.k.a. renew) extends it by one month — stacking onto any
 * still-valid time so an early renewal doesn't lose days. "revoke" clears it.
 * Gated by the caller's profiles.is_admin.
 *
 * Body: { bookingId: string, action?: 'grant' | 'revoke', granted?: boolean }
 *   - `action` is preferred; `granted` is accepted for backward compat
 *     (true → grant, false → revoke).
 */
export async function POST(req: NextRequest) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const bookingId = typeof body?.bookingId === 'string' ? body.bookingId : ''
    if (!bookingId) return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })

    const action =
      body?.action === 'revoke' || body?.granted === false ? 'revoke'
      : body?.action === 'grant' || body?.granted === true ? 'grant'
      : ''
    if (!action) return NextResponse.json({ error: 'Missing action' }, { status: 400 })

    // Renew stacks onto the current expiry (if still valid); revoke clears it.
    let access_until: string | null = null
    if (action === 'grant') {
      const { data: row } = await sbAdmin
        .from('class_bookings').select('access_until').eq('id', bookingId).maybeSingle()
      access_until = nextAccessUntil(row?.access_until as string | null)
    }

    const { error } = await sbAdmin
      .from('class_bookings')
      .update({ access_until })
      .eq('id', bookingId)
    if (error) {
      console.error('[admin/classes/grant] update error:', error)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, access_until })
  } catch (e: any) {
    console.error('[admin/classes/grant] error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
