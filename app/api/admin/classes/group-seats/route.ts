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
 * Set a group's capacity and/or seed_reserved (admin-set offline reservations
 * shown as occupied seats). Gated by profiles.is_admin.
 * Body: { groupId: string, capacity?: number, seedReserved?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const groupId = typeof body?.groupId === 'string' ? body.groupId : ''
    if (!groupId) return NextResponse.json({ error: 'Missing groupId' }, { status: 400 })

    const patch: { capacity?: number; seed_reserved?: number } = {}
    if (body?.capacity != null) {
      const c = Math.trunc(Number(body.capacity))
      if (!Number.isFinite(c) || c < 1 || c > 1000) {
        return NextResponse.json({ error: 'Bad capacity' }, { status: 400 })
      }
      patch.capacity = c
    }
    if (body?.seedReserved != null) {
      const s = Math.trunc(Number(body.seedReserved))
      if (!Number.isFinite(s) || s < 0 || s > 1000) {
        return NextResponse.json({ error: 'Bad seedReserved' }, { status: 400 })
      }
      patch.seed_reserved = s
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    // Guard: seed alone must not exceed capacity (would show a group full of
    // phantom seats). Read the current/target capacity to clamp.
    if (patch.seed_reserved != null) {
      let cap = patch.capacity
      if (cap == null) {
        const { data: g } = await sbAdmin
          .from('class_groups').select('capacity').eq('id', groupId).maybeSingle()
        cap = g?.capacity ?? undefined
      }
      if (cap != null && patch.seed_reserved > cap) {
        return NextResponse.json({ error: 'Reserved cannot exceed capacity' }, { status: 400 })
      }
    }

    const { error } = await sbAdmin.from('class_groups').update(patch).eq('id', groupId)
    if (error) {
      // Most likely pre-migration: the seed_reserved column doesn't exist.
      console.error('[admin/classes/group-seats] update error:', error.message)
      return NextResponse.json(
        { error: 'Update failed — run db/migrations/2026-07-22_class-seed-reserved.sql?' },
        { status: 500 },
      )
    }
    return NextResponse.json({ ok: true, ...patch })
  } catch (e: any) {
    console.error('[admin/classes/group-seats] error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
