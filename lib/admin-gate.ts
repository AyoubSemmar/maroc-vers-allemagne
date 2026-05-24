/**
 * Strong admin gate — call from every admin API route and server action.
 *
 * The previous gate was a literal cookie comparison: `admin_auth === 'true'`.
 * That was forgeable: anyone who learned the obscure /console-x7k9 URL
 * and the cookie name could set `document.cookie = 'admin_auth=true'`
 * on their own browser and walk into every admin endpoint.
 *
 * The new gate uses an HMAC-SHA256 signed token as the cookie value. The
 * signing secret (ADMIN_TOKEN_SECRET, falling back to ADMIN_PASSWORD)
 * never leaves the server, so an attacker who guesses the cookie name
 * still can't produce a valid value without the secret.
 *
 * Existing sessions with `admin_auth=true` are invalidated by this
 * change — the admin must log in once via /console-x7k9 to get a fresh
 * signed cookie. That's a deliberate one-time forced re-login.
 */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE_NAME = 'admin_auth'

function getSecret(): string | null {
  // Accept any non-empty secret. An 8-char minimum was too strict and
  // silently broke login for any deployment with a shorter admin
  // password (the HMAC returned null → cookie never set → infinite
  // redirect to /console-x7k9). HMAC strength comes from the key
  // itself; a short password is the operator's choice, and at least
  // the cookie value can't be forged without it.
  const s = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD
  return s && s.length > 0 ? s : null
}

/** Compute the canonical signed token. The plaintext payload is fixed
 *  ('admin') because the cookie does not need to carry per-user data —
 *  it only proves the holder knew the secret at login time. */
export function adminSignedToken(): string | null {
  const secret = getSecret()
  if (!secret) return null
  return crypto.createHmac('sha256', secret).update('admin').digest('hex')
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))
  } catch {
    return false
  }
}

export type AdminGateResult =
  | { ok: true }
  | { ok: false; response: NextResponse }

export async function requireAdmin(): Promise<AdminGateResult> {
  const expected = adminSignedToken()
  if (!expected) {
    // No secret configured at all — refuse rather than silently allowing
    // anyone in. The deploy is misconfigured.
    return {
      ok: false,
      response: NextResponse.json({ error: 'Server misconfigured.' }, { status: 500 }),
    }
  }
  const cookieStore = await cookies()
  const got = cookieStore.get(COOKIE_NAME)?.value
  if (!got || !safeEqualHex(got, expected)) {
    // 404, not 403 — we don't want to confirm the existence of admin
    // endpoints to anyone who isn't already an admin.
    return {
      ok: false,
      response: NextResponse.json({ error: 'Not found' }, { status: 404 }),
    }
  }
  return { ok: true }
}

/** Variant for server actions that redirect on failure (vs returning a
 *  response). Throws via Next's redirect() so the action aborts cleanly. */
export async function requireAdminOrRedirect(loginPath: string): Promise<void> {
  const expected = adminSignedToken()
  const cookieStore = await cookies()
  const got = cookieStore.get(COOKIE_NAME)?.value
  if (!expected || !got || !safeEqualHex(got, expected)) {
    const { redirect } = await import('next/navigation')
    redirect(loginPath)
  }
}
