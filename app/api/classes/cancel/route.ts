import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Cancel the current student's reserved seat (frees it for someone else). */
export async function POST() {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ status: 'auth' }, { status: 401 })

    const { error } = await sb.rpc('cancel_my_class')
    if (error) {
      console.error('[classes/cancel] rpc error:', error)
      return NextResponse.json({ status: 'error' }, { status: 500 })
    }
    return NextResponse.json({ status: 'ok' })
  } catch (e: any) {
    console.error('[classes/cancel] error:', e)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
