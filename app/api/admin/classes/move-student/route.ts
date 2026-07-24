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

async function recount(groupId: string) {
  const { count } = await sbAdmin
    .from('class_bookings')
    .select('id', { count: 'exact', head: true })
    .eq('group_id', groupId)
    .eq('status', 'reserved')
  await sbAdmin.from('class_groups').update({ booked_count: count ?? 0 }).eq('id', groupId)
}

/**
 * Move a student's reserved seat to another group — including a different level.
 * The student keeps their booking row (and its access_until), so paid access
 * carries over; only the group changes. The booked_count trigger doesn't fire
 * on a group change, so we recompute both groups' counts from the bookings
 * table afterwards. Gated by profiles.is_admin.
 * Body: { bookingId, targetGroupId }
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
    const targetGroupId = typeof body?.targetGroupId === 'string' ? body.targetGroupId : ''
    if (!bookingId || !targetGroupId) {
      return NextResponse.json({ error: 'Missing bookingId/targetGroupId' }, { status: 400 })
    }

    const { data: booking } = await sbAdmin
      .from('class_bookings').select('id, group_id, status').eq('id', bookingId).maybeSingle()
    if (!booking || booking.status !== 'reserved') {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    const fromGroup = booking.group_id as string
    if (fromGroup === targetGroupId) return NextResponse.json({ ok: true, unchanged: true })

    const { data: target } = await sbAdmin
      .from('class_groups').select('id').eq('id', targetGroupId).maybeSingle()
    if (!target) return NextResponse.json({ error: 'Target group not found' }, { status: 404 })

    const { error } = await sbAdmin
      .from('class_bookings').update({ group_id: targetGroupId }).eq('id', bookingId)
    if (error) {
      console.error('[admin/classes/move-student] update error:', error.message)
      return NextResponse.json({ error: 'Move failed' }, { status: 500 })
    }

    // Keep both groups' seat counts truthful.
    await recount(fromGroup)
    await recount(targetGroupId)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[admin/classes/move-student] error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
