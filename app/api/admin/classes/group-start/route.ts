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
 * Set (or clear) a cohort's start_date — the anchor for weekly pacing on the
 * student dashboard. Gated by profiles.is_admin.
 * Body: { groupId: string, startDate: 'YYYY-MM-DD' | null }
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

    let startDate: string | null = null
    if (body?.startDate != null && body.startDate !== '') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(body.startDate))) {
        return NextResponse.json({ error: 'Bad date' }, { status: 400 })
      }
      startDate = String(body.startDate)
    }

    const { error } = await sbAdmin
      .from('class_groups')
      .update({ start_date: startDate })
      .eq('id', groupId)
    if (error) {
      // Most likely cause pre-migration: the start_date column doesn't exist.
      console.error('[admin/classes/group-start] update error:', error.message)
      return NextResponse.json(
        { error: 'Update failed — run db/migrations/2026-07-06_class_pacing.sql?' },
        { status: 500 },
      )
    }
    return NextResponse.json({ ok: true, startDate })
  } catch (e: any) {
    console.error('[admin/classes/group-start] error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
