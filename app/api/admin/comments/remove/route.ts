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

/** Delete a comment (and its replies) as moderation. Gated by is_admin. */
export async function POST(req: NextRequest) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    let id = ''
    try { const b = await req.json(); if (typeof b?.id === 'string') id = b.id } catch {}
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // Remove replies first, then the comment itself.
    await sbAdmin.from('article_comments').delete().eq('parent_id', id)
    const { error } = await sbAdmin.from('article_comments').delete().eq('id', id)
    if (error) return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
