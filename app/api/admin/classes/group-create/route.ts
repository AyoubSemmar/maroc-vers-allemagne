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

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1']

/**
 * Create a new class group. The id and JaaS room_slug are generated; sort_order
 * lands the group at the end of the list. Gated by profiles.is_admin.
 * Body: { label, schedule, level, priceMad, capacity }
 */
export async function POST(req: NextRequest) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const label = String(body?.label ?? '').trim().slice(0, 120)
    const schedule = String(body?.schedule ?? '').trim().slice(0, 160)
    const level = String(body?.level ?? '').trim().toLowerCase()
    const priceMad = Math.trunc(Number(body?.priceMad))
    const capacity = Math.trunc(Number(body?.capacity))

    if (label.length < 1) return NextResponse.json({ error: 'Label required' }, { status: 400 })
    if (!LEVELS.includes(level)) return NextResponse.json({ error: 'Bad level' }, { status: 400 })
    if (!Number.isFinite(priceMad) || priceMad < 0 || priceMad > 100000) {
      return NextResponse.json({ error: 'Bad price' }, { status: 400 })
    }
    const cap = Number.isFinite(capacity) && capacity >= 1 ? capacity : 15

    const rand = () => globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 8)
    const id = `${level}-${rand()}`
    const roomSlug = `GoGermany${level.toUpperCase()}-${rand()}`

    // Append after the current last group.
    const { data: last } = await sbAdmin
      .from('class_groups').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle()
    const sortOrder = (last?.sort_order ?? 0) + 1

    const { error } = await sbAdmin.from('class_groups').insert({
      id,
      label,
      schedule,
      level,
      price_mad: priceMad,
      capacity: cap,
      room_slug: roomSlug,
      sort_order: sortOrder,
      is_active: true,
    })
    if (error) {
      console.error('[admin/classes/group-create] error:', error.message)
      return NextResponse.json({ error: 'Create failed' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, id })
  } catch (e: any) {
    console.error('[admin/classes/group-create] error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
