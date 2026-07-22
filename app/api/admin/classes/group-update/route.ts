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
 * Edit a group's public fields: label, schedule, level, price. Gated by
 * profiles.is_admin. Any subset of fields may be sent.
 * Body: { groupId, label?, schedule?, level?, priceMad? }
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

    const patch: { label?: string; schedule?: string; level?: string; price_mad?: number } = {}
    if (body?.label != null) {
      const v = String(body.label).trim().slice(0, 120)
      if (v.length < 1) return NextResponse.json({ error: 'Label empty' }, { status: 400 })
      patch.label = v
    }
    if (body?.schedule != null) {
      patch.schedule = String(body.schedule).trim().slice(0, 160)
    }
    if (body?.level != null) {
      const v = String(body.level).trim().toLowerCase()
      if (!LEVELS.includes(v)) return NextResponse.json({ error: 'Bad level' }, { status: 400 })
      patch.level = v
    }
    if (body?.priceMad != null) {
      const p = Math.trunc(Number(body.priceMad))
      if (!Number.isFinite(p) || p < 0 || p > 100000) {
        return NextResponse.json({ error: 'Bad price' }, { status: 400 })
      }
      patch.price_mad = p
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const { error } = await sbAdmin.from('class_groups').update(patch).eq('id', groupId)
    if (error) {
      console.error('[admin/classes/group-update] error:', error.message)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, ...patch })
  } catch (e: any) {
    console.error('[admin/classes/group-update] error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
