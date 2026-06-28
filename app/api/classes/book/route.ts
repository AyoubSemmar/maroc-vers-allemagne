import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/entitlements'
import { CLASSES_LAUNCHED } from '@/lib/classes-flags'
import { sendEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

const BUSINESS_WA = (process.env.NEXT_PUBLIC_CLASSES_WHATSAPP || '').replace(/\D/g, '')

/**
 * Reserve a seat. Capacity/double-booking logic lives in the book_class()
 * Postgres function (atomic, row-locked). We also persist the student's
 * WhatsApp (so the teacher can send payment instructions) and email a booking
 * confirmation with the payment note.
 *
 * Returns { status: 'ok' | 'auth' | 'already' | 'full' | 'notfound' | 'error' }.
 */
export async function POST(req: NextRequest) {
  try {
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ status: 'auth' }, { status: 401 })

    // Pre-launch the course is hidden — only admins can book (for testing).
    if (!CLASSES_LAUNCHED && !(await isAdmin(user.id))) {
      return NextResponse.json({ status: 'error' }, { status: 403 })
    }

    let groupId = ''
    let whatsapp = ''
    try {
      const body = await req.json()
      if (typeof body?.groupId === 'string') groupId = body.groupId
      if (typeof body?.whatsapp === 'string') whatsapp = body.whatsapp.trim().slice(0, 30)
    } catch {}
    if (!groupId) return NextResponse.json({ status: 'notfound' }, { status: 400 })

    // Save the student's WhatsApp on their profile so the teacher can reach
    // them for payment (best-effort; never blocks booking).
    if (whatsapp) {
      try { await sbAdmin.from('profiles').update({ whatsapp }).eq('user_id', user.id) } catch {}
    }

    const { data, error } = await sb.rpc('book_class', { p_group_id: groupId })
    if (error) {
      console.error('[classes/book] rpc error:', error)
      return NextResponse.json({ status: 'error' }, { status: 500 })
    }

    // On a fresh reservation, email the confirmation + payment note.
    if (data === 'ok' && user.email) {
      try {
        const { data: g } = await sbAdmin
          .from('class_groups').select('label,schedule').eq('id', groupId).maybeSingle()
        const waLine = BUSINESS_WA
          ? `Pour le paiement (300 DH/mois), écrivez-nous sur WhatsApp : <a href="https://wa.me/${BUSINESS_WA}">wa.me/${BUSINESS_WA}</a>. Nous vous contacterons également avec les instructions.`
          : `Nous vous contacterons sur WhatsApp avec les instructions de paiement (300 DH/mois).`
        await sendEmail({
          to: user.email,
          subject: 'Réservation confirmée — Cours d’allemand GoGermany',
          html: `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.6">
            <h2 style="color:#16a34a">Votre place est réservée ✅</h2>
            <p>Groupe : <strong>${g?.label ?? groupId}</strong><br>Horaire : ${g?.schedule ?? ''}</p>
            <p>${waLine}</p>
            <p style="color:#6b7280;font-size:13px">Les places non confirmées (non payées) sont libérées. À bientôt en classe&nbsp;!<br>— GoGermany</p>
          </div>`,
        })
      } catch (e) { console.error('[classes/book] email error:', e) }
    }

    return NextResponse.json({ status: data })
  } catch (e: any) {
    console.error('[classes/book] error:', e)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
