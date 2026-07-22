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

// Starter password every confirmed student gets. They're forced to change it
// on first login (must_change_password flag below), so it never stays shared.
const STARTER_PASSWORD = 'gogermanystudent'

async function findUserByEmail(email: string): Promise<{ id: string } | null> {
  // The admin API has no get-by-email; scan (small user base). Paginate a bit
  // in case it grows.
  for (let page = 1; page <= 5; page++) {
    const { data } = await sbAdmin.auth.admin.listUsers({ page, perPage: 1000 })
    const found = data?.users?.find(u => (u.email ?? '').toLowerCase() === email)
    if (found) return { id: found.id }
    if (!data || data.users.length < 1000) break
  }
  return null
}

/**
 * Resolve a reservation request. Reject just marks it. Confirm provisions the
 * student end-to-end: creates their account (email + shared starter password,
 * forced change on first login), a reserved seat, and one month of access —
 * so a single click makes them a fully enrolled, log-in-ready student.
 * Gated by profiles.is_admin.
 * Body: { requestId: string, action: 'confirm' | 'reject' }
 */
export async function POST(req: NextRequest) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const requestId = typeof body?.requestId === 'string' ? body.requestId : ''
    const action = body?.action === 'reject' ? 'reject' : body?.action === 'confirm' ? 'confirm' : ''
    if (!requestId || !action) return NextResponse.json({ error: 'Missing requestId/action' }, { status: 400 })

    const { data: reqRow } = await sbAdmin
      .from('class_reservation_requests')
      .select('id, full_name, whatsapp, email, group_id, status')
      .eq('id', requestId)
      .maybeSingle()
    if (!reqRow) return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    if (reqRow.status !== 'pending') return NextResponse.json({ error: 'Already resolved' }, { status: 409 })

    if (action === 'reject') {
      await sbAdmin.from('class_reservation_requests')
        .update({ status: 'rejected', resolved_at: new Date().toISOString() })
        .eq('id', requestId)
      return NextResponse.json({ ok: true, action: 'reject' })
    }

    const email = (reqRow.email as string).toLowerCase().trim()
    const fullName = (reqRow.full_name as string) ?? ''

    // 1) Account — create with the starter password, or reuse an existing one
    //    (never overwrite the password of an account that already exists).
    let userId: string
    let existingAccount = false
    const { data: created, error: createErr } = await sbAdmin.auth.admin.createUser({
      email,
      password: STARTER_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: fullName, must_change_password: true },
    })
    if (createErr || !created?.user) {
      const existing = await findUserByEmail(email)
      if (!existing) {
        console.error('[resolve-request] createUser failed:', createErr?.message)
        return NextResponse.json({ error: 'Could not create the account.' }, { status: 500 })
      }
      userId = existing.id
      existingAccount = true
    } else {
      userId = created.user.id
    }

    // 2) Profile (best-effort — the account + seat below are what matter).
    try {
      await sbAdmin.from('profiles')
        .upsert({ user_id: userId, email, full_name: fullName, whatsapp: reqRow.whatsapp }, { onConflict: 'user_id' })
    } catch (e) { console.error('[resolve-request] profile upsert:', e) }

    // 3) Seat + one month of access. Reuse a still-held reserved booking if any
    //    (the one-reserved-seat-per-user index would otherwise reject a second).
    const accessUntil = nextAccessUntil(null)
    const { data: existingBooking } = await sbAdmin
      .from('class_bookings').select('id').eq('user_id', userId).eq('status', 'reserved').maybeSingle()
    if (existingBooking) {
      await sbAdmin.from('class_bookings')
        .update({ group_id: reqRow.group_id, access_until: accessUntil })
        .eq('id', existingBooking.id)
    } else {
      const { error: bookErr } = await sbAdmin.from('class_bookings')
        .insert({ group_id: reqRow.group_id, user_id: userId, status: 'reserved', access_until: accessUntil })
      if (bookErr) {
        console.error('[resolve-request] booking insert:', bookErr.message)
        return NextResponse.json({ error: 'Account made but seat failed — check the group.' }, { status: 500 })
      }
    }

    // 4) Close the request.
    await sbAdmin.from('class_reservation_requests')
      .update({ status: 'confirmed', resolved_at: new Date().toISOString(), confirmed_user_id: userId })
      .eq('id', requestId)

    return NextResponse.json({
      ok: true,
      action: 'confirm',
      email,
      existingAccount,
      // Only surface the starter password for freshly created accounts.
      password: existingAccount ? null : STARTER_PASSWORD,
      accessUntil,
    })
  } catch (e: any) {
    console.error('[resolve-request] error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
