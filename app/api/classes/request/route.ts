import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

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

    // Best-effort owner notification — never blocks the visitor's response.
    try {
      let groupLabel = 'Niveau non précisé'
      if (groupId) {
        const { data: g } = await sbAdmin.from('class_groups').select('label').eq('id', groupId).maybeSingle()
        if (g?.label) groupLabel = g.label
      }
      const waDigits = whatsapp.replace(/\D/g, '')
      const notifyTo = process.env.CLASSES_NOTIFY_EMAIL || 'ayoubsemmar@gmail.com'
      await sendEmail({
        to: notifyTo,
        subject: `📩 Nouvelle réservation — ${fullName} (${groupLabel})`,
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.6">
          <h2 style="color:#16a34a;margin:0 0 12px">Nouvelle demande de réservation</h2>
          <table style="border-collapse:collapse;font-size:15px">
            <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Nom</td><td style="padding:4px 0"><strong>${fullName}</strong></td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#6b7280">WhatsApp</td><td style="padding:4px 0"><a href="https://wa.me/${waDigits}">${whatsapp}</a></td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Email</td><td style="padding:4px 0"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Groupe</td><td style="padding:4px 0">${groupLabel}</td></tr>
          </table>
          <p style="margin:18px 0 0">
            <a href="https://www.gogermany.ma/fr/console-x7k9/classes" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;font-weight:700;border-radius:8px;padding:10px 18px">Ouvrir la console →</a>
          </p>
          <p style="color:#6b7280;font-size:13px;margin-top:16px">Confirme la demande dans la console pour créer le compte de l'élève et lui donner accès.</p>
        </div>`,
      })
    } catch (e) { console.error('[classes/request] notify email:', e) }

    return NextResponse.json({ status: 'ok' })
  } catch (e: any) {
    console.error('[classes/request] error:', e)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
