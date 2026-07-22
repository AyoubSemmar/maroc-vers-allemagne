import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Service role: the form is public (no account yet), so the insert can't go
// through RLS as an anon user — it's written here with input validation.
const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Record a seat-reservation request from the public form (name + WhatsApp +
 * email + which group). No account is created here — the admin reviews the
 * request and confirms it, which is what provisions the login.
 * Body: { fullName, whatsapp, email, groupId }
 * Returns: { status: 'ok' | 'invalid' | 'error' }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const fullName = String(body?.fullName ?? '').trim().slice(0, 120)
    const whatsapp = String(body?.whatsapp ?? '').trim().slice(0, 40)
    const email = String(body?.email ?? '').trim().toLowerCase().slice(0, 160)
    const groupId = String(body?.groupId ?? '').trim() || null

    if (fullName.length < 2 || whatsapp.replace(/\D/g, '').length < 6 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ status: 'invalid' }, { status: 400 })
    }

    // Skip an obvious duplicate: same email already has a pending request.
    const { data: dup } = await sbAdmin
      .from('class_reservation_requests')
      .select('id')
      .eq('email', email)
      .eq('status', 'pending')
      .maybeSingle()
    if (dup) return NextResponse.json({ status: 'ok', duplicate: true })

    const { error } = await sbAdmin.from('class_reservation_requests').insert({
      full_name: fullName,
      whatsapp,
      email,
      group_id: groupId,
    })
    if (error) {
      console.error('[classes/request] insert error:', error.message)
      return NextResponse.json({ status: 'error' }, { status: 500 })
    }
    return NextResponse.json({ status: 'ok' })
  } catch (e: any) {
    console.error('[classes/request] error:', e)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
