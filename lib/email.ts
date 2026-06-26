// Minimal transactional email via Resend's REST API (no SDK dependency).
// Gated on RESEND_API_KEY — when unset, sends are skipped silently so nothing
// breaks before email is configured. Set RESEND_API_KEY and CLASSES_EMAIL_FROM
// (e.g. "GoGermany <cours@gogermany.ma>", from a Resend-verified domain) in
// Vercel to enable it.
export async function sendEmail({
  to,
  subject,
  html,
}: { to: string; subject: string; html: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key || !to) return false
  const from = process.env.CLASSES_EMAIL_FROM || 'GoGermany <onboarding@resend.dev>'
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html }),
    })
    if (!r.ok) console.error('[email] resend failed:', r.status, await r.text().catch(() => ''))
    return r.ok
  } catch (e) {
    console.error('[email] error:', e)
    return false
  }
}
