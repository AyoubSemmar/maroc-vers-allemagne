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
 * Delete a class group. This cascades to its bookings and attendance (FKs are
 * ON DELETE CASCADE), so a group with reserved students is refused unless
 * `force: true` is sent — the admin UI double-confirms with the head count.
 * Gated by profiles.is_admin.
 * Body: { groupId, force?: boolean }
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
    const force = body?.force === true
    if (!groupId) return NextResponse.json({ error: 'Missing groupId' }, { status: 400 })

    // Count real reserved seats — deleting the group would delete them too.
    const { count } = await sbAdmin
      .from('class_bookings')
      .select('id', { count: 'exact', head: true })
      .eq('group_id', groupId)
      .eq('status', 'reserved')
    const students = count ?? 0
    if (students > 0 && !force) {
      return NextResponse.json({ error: 'has_students', students }, { status: 409 })
    }

    const { error } = await sbAdmin.from('class_groups').delete().eq('id', groupId)
    if (error) {
      console.error('[admin/classes/group-delete] error:', error.message)
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, deletedStudents: students })
  } catch (e: any) {
    console.error('[admin/classes/group-delete] error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
