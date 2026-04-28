import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import {
  isAdmin,
  findUserByEmail,
  listAllUsers,
  setPremium,
  addCredits,
  grantUnlock,
  revokeUnlock,
  resetMotivationFreeTry,
  setBan,
  deleteUser,
} from '@/lib/entitlements'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Admin-only grants. Every request is gated by profiles.is_admin of the
 * CALLING user (read from their session cookie). Service-role writes happen
 * inside the entitlements helpers.
 *
 * POST body: { action: string, email: string, ...payload }
 * Actions:
 *   - lookup                           → returns user snapshot
 *   - setPremium      { isPremium, until? }
 *   - addCredits      { feature: 'photo'|'cv'|'motivation', amount }
 *   - grantUnlock     { kind: 'template'|'german_level', key }
 *   - revokeUnlock    { kind, key }
 */
export async function POST(req: NextRequest) {
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const action = String(body.action || '')

  // listUsers needs no email — it returns the global directory.
  if (action === 'listUsers') {
    const limit = Math.min(Math.max(Number(body.limit) || 200, 1), 1000)
    const users = await listAllUsers(limit)
    return NextResponse.json({ users })
  }

  // getUsage — today's usage across all daily-capped features for ONE user.
  // Pulls counts from the per-feature usage tables.
  if (action === 'getUsage') {
    const targetEmail = String(body.email || '').trim()
    if (!targetEmail) return NextResponse.json({ error: 'email required' }, { status: 400 })
    const t = await findUserByEmail(targetEmail)
    if (!t) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const today = new Date().toISOString().slice(0, 10)
    const tables = [
      ['photo', 'photo_enhance_usage'],
      ['cv', 'cv_enhance_usage'],
      ['motivation', 'motivation_usage'],
      ['reading', 'reading_exercise_usage'],
      ['writing', 'writing_exercise_usage'],
    ] as const

    const { createClient } = await import('@supabase/supabase-js')
    const sbAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const usage: Record<string, number> = {}
    for (const [key, table] of tables) {
      const { data } = await sbAdmin
        .from(table)
        .select('count')
        .eq('user_id', t.id)
        .eq('day', today)
        .maybeSingle()
      usage[key] = (data as any)?.count ?? 0
    }
    return NextResponse.json({ usage })
  }

  const email  = String(body.email || '').trim()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const target = await findUserByEmail(email)
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  try {
    switch (action) {
      case 'lookup':
        return NextResponse.json({ user: target })

      case 'setPremium': {
        const isPrem = !!body.isPremium
        const until = body.until ? String(body.until) : null
        await setPremium(target.id, isPrem, until)
        break
      }

      case 'addCredits': {
        const feature = body.feature
        const amount = Number(body.amount)
        if (!['photo', 'cv', 'motivation'].includes(feature)) {
          return NextResponse.json({ error: 'Invalid feature' }, { status: 400 })
        }
        if (!Number.isFinite(amount) || amount === 0) {
          return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
        }
        await addCredits(target.id, feature, amount)
        break
      }

      case 'grantUnlock': {
        const kind = body.kind === 'template' ? 'template' : 'german_level'
        const key = String(body.key || '').trim()
        if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })
        await grantUnlock(target.id, kind, key)
        break
      }

      case 'resetMotivationFreeTry': {
        await resetMotivationFreeTry(target.id)
        break
      }

      case 'revokeUnlock': {
        const kind = body.kind === 'template' ? 'template' : 'german_level'
        const key = String(body.key || '').trim()
        if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })
        await revokeUnlock(target.id, kind, key)
        break
      }

      case 'ban': {
        // duration: 'forever' | hours number | 0 to unban
        const dur = body.duration
        const hours = dur === 'forever'
          ? Number.POSITIVE_INFINITY
          : Number(dur ?? 0)
        await setBan(target.id, hours)
        break
      }

      case 'deleteUser': {
        await deleteUser(target.id)
        return NextResponse.json({ deleted: true })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    // Re-fetch and return latest snapshot
    const updated = await findUserByEmail(email)
    return NextResponse.json({ user: updated })
  } catch (e: any) {
    console.error('[admin/grant] error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
