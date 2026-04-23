import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/**
 * Soft-delete the current user's account.
 *
 * - Marks public.profiles.deleted_at = now() + reason.
 * - Bans the auth.users row for 100 years so they can no longer sign in.
 * - Leaves every user_documents row untouched (FK is ON DELETE NO ACTION)
 *   so uploaded files and generated CVs stay attached to the frozen user_id.
 */
export async function POST(req: NextRequest) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    let reason = ''
    try {
      const body = await req.json()
      if (typeof body?.reason === 'string') reason = body.reason.slice(0, 500)
    } catch {}

    const admin = adminClient()

    // 1. Mark profile as deleted (admin client bypasses the "deleted_at is null" RLS update policy).
    const { error: profileErr } = await admin
      .from('profiles')
      .update({ deleted_at: new Date().toISOString(), deletion_reason: reason || null })
      .eq('user_id', user.id)
    if (profileErr) {
      console.error('[account/delete] profile update failed:', profileErr)
      return NextResponse.json({ error: 'Failed to mark profile as deleted.' }, { status: 500 })
    }

    // 2. Ban the auth user for ~100 years — they can't log back in, but the row
    //    stays intact so every FK from user_documents remains valid forever.
    const { error: banErr } = await admin.auth.admin.updateUserById(user.id, {
      ban_duration: '876000h',
    })
    if (banErr) {
      console.error('[account/delete] ban failed:', banErr)
      return NextResponse.json({ error: 'Failed to disable account.' }, { status: 500 })
    }

    // 3. Sign out the current session.
    await sb.auth.signOut()

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[account/delete] error:', e)
    return NextResponse.json(
      { error: e?.message || 'Internal error' },
      { status: 500 }
    )
  }
}
