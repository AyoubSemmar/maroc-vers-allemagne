import { headers } from 'next/headers'

// True when the visitor is in Morocco (Vercel's x-vercel-ip-country header).
// The live German classes are a Morocco-only, offline-paid offer, so they're
// gated to MA. Dev has no edge header → treated as MA so local testing works.
export async function isMorocco(): Promise<boolean> {
  if (process.env.NODE_ENV !== 'production') return true
  try {
    return (await headers()).get('x-vercel-ip-country') === 'MA'
  } catch {
    return false
  }
}
