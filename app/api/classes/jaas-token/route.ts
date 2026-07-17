import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { isJaasConfigured, jaasAppId, jaasRoomName } from '@/lib/jaas'
import { signJaasToken } from '@/lib/jaasToken'
import { parseClassWindow, callWindowState } from '@/lib/classSchedule'

export const runtime = 'nodejs'

// Service-role client: reads the group's room_slug/schedule regardless of RLS.
const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

// Issues a short-lived JaaS JWT for the caller to join their group's room.
// Gating mirrors the classroom page: authenticated + a reserved seat in the
// group (or a teacher/admin), and the live call window must be open.
export async function POST(req: NextRequest) {
  try {
    if (!isJaasConfigured()) {
      return NextResponse.json({ error: 'Video not configured', code: 'not_configured' }, { status: 503 })
    }

    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const groupId = String(body.groupId || '')
    if (!groupId) return NextResponse.json({ error: 'Missing group.' }, { status: 400 })

    const [{ data: booking }, { data: profile }] = await Promise.all([
      sb.from('class_bookings').select('id')
        .eq('user_id', user.id).eq('group_id', groupId).eq('status', 'reserved').maybeSingle(),
      sb.from('profiles').select('is_admin').eq('user_id', user.id).maybeSingle(),
    ])
    const isTeacher = profile?.is_admin === true
    if (!booking && !isTeacher) {
      return NextResponse.json({ error: 'No access to this class.', code: 'no_access' }, { status: 403 })
    }

    const { data: g } = await sbAdmin
      .from('class_groups')
      .select('room_slug, schedule')
      .eq('id', groupId)
      .maybeSingle()
    if (!g?.room_slug) return NextResponse.json({ error: 'Class not found.' }, { status: 404 })

    // Enforce the join window for students; teachers can open the room anytime
    // (to start early / test), matching the dashboard's teacher affordances.
    if (!isTeacher) {
      const win = parseClassWindow(g.schedule as string, groupId)
      const { open, opensAtLabel, closesAtLabel } = callWindowState(win)
      if (!open) {
        return NextResponse.json(
          { error: 'The class is not open right now.', code: 'window_closed', opensAtLabel, closesAtLabel },
          { status: 403 },
        )
      }
    }

    const appId = jaasAppId()!
    const displayName =
      (user.user_metadata?.full_name as string) ||
      user.email?.split('@')[0] ||
      'Student'

    const jwt = await signJaasToken(g.room_slug as string, {
      id: user.id,
      name: displayName,
      email: user.email ?? undefined,
      moderator: isTeacher,
    })

    return NextResponse.json({
      appId,
      roomName: jaasRoomName(appId, g.room_slug as string),
      jwt,
      displayName,
      moderator: isTeacher,
    })
  } catch (err: any) {
    console.error('[jaas-token]', err?.message || err)
    return NextResponse.json({ error: 'Could not start the video call.' }, { status: 500 })
  }
}
