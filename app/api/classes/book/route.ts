import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Reserve a seat in an A1 class group. All capacity/double-booking logic lives
 * in the book_class() Postgres function (atomic, row-locked) — see
 * db/migrations/2026-06-22_live_classes.sql. We just pass the caller's session.
 *
 * Returns { status: 'ok' | 'auth' | 'already' | 'full' | 'notfound' }.
 */
export async function POST(req: NextRequest) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ status: 'auth' }, { status: 401 })

    let groupId = ''
    try {
      const body = await req.json()
      if (typeof body?.groupId === 'string') groupId = body.groupId
    } catch {}
    if (!groupId) return NextResponse.json({ status: 'notfound' }, { status: 400 })

    const { data, error } = await sb.rpc('book_class', { p_group_id: groupId })
    if (error) {
      console.error('[classes/book] rpc error:', error)
      return NextResponse.json({ status: 'error' }, { status: 500 })
    }
    return NextResponse.json({ status: data })
  } catch (e: any) {
    console.error('[classes/book] error:', e)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
