/**
 * Admin-only: given a proposed title, find existing articles that look
 * similar, so the admin can decide whether a new article is worth writing.
 * Scores on word-overlap (Jaccard) of the title against every existing
 * article's title (Arabic source + English translation), language-agnostic
 * enough to catch near-duplicates across locales.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-gate'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STOP = new Set(['the', 'a', 'an', 'to', 'in', 'for', 'of', 'and', 'or', 'your', 'how', 'what', 'is', 'you', 'germany', 'german', 'de', 'la', 'le', 'les', 'en', 'un', 'une', 'في', 'من', 'إلى', 'على', 'ألمانيا'])

function tokens(s: string): Set<string> {
  return new Set(
    (s || '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  )
}
function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  return inter / (a.size + b.size - inter)
}

export async function POST(req: NextRequest) {
  try {
    const gate = await requireAdmin()
    if (!gate.ok) return gate.response

    const { title } = (await req.json().catch(() => ({}))) as { title?: string }
    if (!title || title.trim().length < 4) {
      return NextResponse.json({ error: 'Enter a title (≥4 chars).' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    )
    const { data } = await supabase
      .from('articles')
      .select('id, title, category, t_en:translations->en->>title')
      .limit(3000)

    const qt = tokens(title)
    const matches = (data ?? [])
      .map((a: any) => {
        const score = Math.max(jaccard(qt, tokens(a.title)), jaccard(qt, tokens(a.t_en || '')))
        return { id: a.id, title: a.t_en || a.title, category: a.category, score }
      })
      .filter((m) => m.score >= 0.18)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)

    return NextResponse.json({ matches })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Search failed.' }, { status: 500 })
  }
}
