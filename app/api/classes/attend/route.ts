import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

/**
 * Log today's class attendance for the signed-in student — fired (and
 * forgotten) when they click "Rejoindre l'appel vidéo". One row per student
 * per day (unique constraint; re-clicks are no-ops). Entirely best-effort:
 * every failure returns ok so joining the call is never blocked, including
 * before the class_attendance migration has been run.
 */
export async function POST() {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ ok: false })

    const { data: booking } = await sb
      .from('class_bookings').select('group_id')
      .eq('user_id', user.id).eq('status', 'reserved').maybeSingle()
    if (!booking?.group_id) return NextResponse.json({ ok: false })

    // upsert-ignore: second click of the day hits the (user_id, day) unique
    // constraint and is silently dropped.
    const { error } = await sbAdmin
      .from('class_attendance')
      .upsert(
        { group_id: booking.group_id, user_id: user.id },
        { onConflict: 'user_id,day', ignoreDuplicates: true },
      )
    if (error) console.error('[classes/attend] insert error:', error.message)
    return NextResponse.json({ ok: !error })
  } catch (e) {
    console.error('[classes/attend] error:', e)
    return NextResponse.json({ ok: false })
  }
}
