import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// Returns the visitor's country (Vercel sets x-vercel-ip-country at the edge).
// In dev there's no edge header, so we report MA to make local testing possible.
export function GET(req: NextRequest) {
  const country =
    process.env.NODE_ENV !== 'production'
      ? 'MA'
      : req.headers.get('x-vercel-ip-country') || null
  return NextResponse.json({ country }, { headers: { 'Cache-Control': 'no-store' } })
}
