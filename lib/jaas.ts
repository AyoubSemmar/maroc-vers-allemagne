// JaaS (Jitsi as a Service, by 8x8) — embeddable, un-capped Jitsi.
//
// Unlike the public meet.jit.si (which limits IFRAMED calls to 5 minutes),
// JaaS is built to be embedded: authenticated with a per-user JWT signed by
// our private RSA key, calls run full-length inside our own classroom page.
//
// Config comes from three env vars (set in Vercel, NOT committed):
//   JAAS_APP_ID       vpaas-magic-cookie-xxxxxxxxxxxxxxxx   (also the tenant)
//   JAAS_KID          <AppID>/<keyId>  e.g. vpaas-magic-cookie-xxx/abc123
//   JAAS_PRIVATE_KEY  the RSA private key PEM for that API key
//
// The AppID is NOT secret (it appears in the client script URL and room name);
// only JAAS_PRIVATE_KEY must stay server-side.

export const JAAS_DOMAIN = '8x8.vc'

export function jaasAppId(): string | null {
  return process.env.JAAS_APP_ID?.trim() || null
}

/** True once the three JaaS env vars are present — otherwise the classroom
 *  shows a "video not configured yet" state instead of a broken iframe. */
export function isJaasConfigured(): boolean {
  return !!(process.env.JAAS_APP_ID && process.env.JAAS_KID && process.env.JAAS_PRIVATE_KEY)
}

/** Full JaaS room path: the room slug is namespaced under the tenant/AppID. */
export function jaasRoomName(appId: string, roomSlug: string): string {
  return `${appId}/${roomSlug}`
}

/** external_api.js is served per-tenant on the JaaS CDN. */
export function jaasScriptUrl(appId: string): string {
  return `https://${JAAS_DOMAIN}/${appId}/external_api.js`
}
