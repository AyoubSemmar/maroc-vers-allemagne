import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import {
  isAdmin,
  findUserByEmail,
  setPremium,
  addCredits,
  grantUnlock,
  revokeUnlock,
  resetMotivationFreeTry,
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
