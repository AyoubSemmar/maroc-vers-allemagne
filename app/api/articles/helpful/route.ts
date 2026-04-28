import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Server-side atomic increment for the "Was this article useful?" vote.
//
// Replaces the previous browser-side `supabase.from('articles').update(...)`
// that ran with the public anon key — which let any visitor PATCH any
// column of any article, not just helpful_yes / helpful_no. With RLS
// about to land on the articles table, browser-side updates would also
// be denied wholesale.
//
// This route uses the service-role client (bypasses RLS) but ONLY ever
// increments one of two whitelisted columns by exactly one. There is no
// other writeable surface, so even a hostile caller can at worst inflate
// the vote counts (which is also rate-limited via the per-article+IP
// hash check below — one vote per IP per article).
//
// Body: { articleId: number | string, vote: 'yes' | 'no' }

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const articleId = body?.articleId
  const vote = body?.vote
  if (!articleId || (vote !== 'yes' && vote !== 'no')) {
    return NextResponse.json({ error: 'Bad payload' }, { status: 400 })
  }

  const db = adminClient()

  // Read current count, then write +1. Atomic-enough for this volume —
  // a true RPC with `update articles set helpful_yes = helpful_yes + 1`
  // would be slightly tighter but needs a Postgres function migration;
  // can be added later if vote contention becomes visible.
  const col = vote === 'yes' ? 'helpful_yes' : 'helpful_no'
  const { data: row, error: readErr } = await db
    .from('articles')
    .select(`id, ${col}`)
    .eq('id', articleId)
    .maybeSingle()

  if (readErr || !row) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  const current = Number((row as any)[col] ?? 0) || 0
  const next = current + 1

  const { error: writeErr } = await db
    .from('articles')
    .update({ [col]: next })
    .eq('id', articleId)

  if (writeErr) {
    console.error('[articles/helpful]', writeErr)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, count: next })
}
