/**
 * Safe-redirect validator. Use anywhere we honour a user-controlled
 * `next` (or `redirect`) param so we never redirect to an external
 * domain — that's a classic phishing vector ("Login to Google here"
 * → redirected to attacker.com after login).
 *
 * Returns the input only if it's a same-origin path. Anything else
 * (full URLs, protocol-relative `//evil.com`, JavaScript URIs) gets
 * the fallback.
 */
export function safeRedirect(next: string | null | undefined, fallback: string): string {
  if (!next || typeof next !== 'string') return fallback
  // Must be a path starting with a single slash. Reject `//evil.com`
  // and `/\evil.com` (a backslash-prefixed bypass some routers accept).
  if (!next.startsWith('/')) return fallback
  if (next.startsWith('//') || next.startsWith('/\\')) return fallback
  // Reject things like `/javascript:alert(1)` or `/data:...`. These
  // would be parsed as paths but some browsers normalise them.
  if (/^\/(?:javascript|data|vbscript):/i.test(next)) return fallback
  return next
}
