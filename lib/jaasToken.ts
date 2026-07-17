// Server-only: sign a JaaS JWT for one user joining one room.
//
// Follows the JaaS token spec (https://developer.8x8.com/jaas):
//   header  { alg: RS256, kid: <AppID>/<keyId>, typ: JWT }
//   payload { aud: 'jitsi', iss: 'chat', sub: <AppID>, room, exp, nbf,
//             context: { user: { id, name, moderator }, features } }
//
// The private key never leaves the server. Tokens are short-lived (2h) and
// scoped to a single room.
import 'server-only'
import { importPKCS8, SignJWT } from 'jose'

export type JaasUser = {
  id: string
  name: string
  email?: string
  moderator: boolean
}

function normalizePem(raw: string): string {
  // Vercel env vars keep real newlines, but a value pasted with literal "\n"
  // (or wrapped without newlines) still needs to become a valid PEM.
  let pem = raw.trim()
  if (pem.includes('\\n')) pem = pem.replace(/\\n/g, '\n')
  return pem
}

export async function signJaasToken(roomSlug: string, user: JaasUser): Promise<string> {
  const appId = process.env.JAAS_APP_ID!.trim()
  const kid = process.env.JAAS_KID!.trim()
  const key = await importPKCS8(normalizePem(process.env.JAAS_PRIVATE_KEY!), 'RS256')

  const now = Math.floor(Date.now() / 1000)
  return new SignJWT({
    aud: 'jitsi',
    iss: 'chat',
    sub: appId,
    room: roomSlug,
    context: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        moderator: user.moderator ? 'true' : 'false',
      },
      features: {
        // Students never need these; teachers get recording + livestream off
        // by default too (can be flipped on later without a token change here).
        livestreaming: 'false',
        recording: 'false',
        transcription: 'false',
        'outbound-call': 'false',
      },
    },
  })
    .setProtectedHeader({ alg: 'RS256', kid, typ: 'JWT' })
    .setIssuedAt(now)
    .setNotBefore(now - 10)
    .setExpirationTime(now + 2 * 60 * 60)
    .sign(key)
}
