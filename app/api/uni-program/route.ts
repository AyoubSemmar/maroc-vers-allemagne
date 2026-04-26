import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
// Cache results at the edge for 24h — the same uni+level combination
// rarely changes its program-page URL.
export const revalidate = 86400

/**
 * /api/uni-program?uni=<name>&level=bachelor|master
 *
 * Server-side searches "<uni> <level> studiengang" on DuckDuckGo's HTML
 * endpoint, parses the first organic result, and 302-redirects the user
 * straight to that URL. No intermediate search page is visible.
 *
 * Falls back to the uni's homepage if scraping fails.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const uni = url.searchParams.get('uni')?.trim()
  const level = url.searchParams.get('level')?.trim() as 'bachelor' | 'master' | null
  const fallback = url.searchParams.get('fallback')?.trim() ?? null

  if (!uni || (level !== 'bachelor' && level !== 'master')) {
    return NextResponse.json({ error: 'Missing or invalid uni/level' }, { status: 400 })
  }

  // Restrict to the uni's own domain (so we don't land on Wikipedia/etc.)
  // and bias toward listing pages with multiple program-related keywords.
  let domain = ''
  try {
    if (fallback) domain = new URL(fallback).hostname.replace(/^www\./, '')
  } catch {}

  const keywords = level === 'bachelor'
    ? 'bachelor studiengänge studienangebot'
    : 'master studiengänge studienangebot'
  const query = domain
    ? `site:${domain} ${keywords}`
    : `${uni} ${keywords}`

  const target = await firstSubPageResult(query, domain, fallback)

  const dest = target ?? fallback
  if (!dest) {
    return NextResponse.json({ error: 'Could not resolve a program page' }, { status: 502 })
  }

  return NextResponse.redirect(dest, {
    status: 302,
    headers: {
      // 24h CDN cache so subsequent clicks are instant.
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}

// Walks all result links from DDG / Bing, filters to the uni's domain
// (when known), and skips the bare homepage so we land on a real
// sub-page that talks about programs.
function isAcceptable(url: string, domain: string, fallback: string | null): boolean {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    // Must be on the uni's domain (when we know it).
    if (domain && host !== domain && !host.endsWith('.' + domain)) return false
    // Reject the bare homepage — `https://uni.de/` or `https://uni.de`
    const path = u.pathname.replace(/\/$/, '')
    if (path === '' || path === '/') return false
    // Reject obvious non-program paths
    if (/\/(impressum|datenschutz|kontakt|news|presse|aktuelles)/i.test(u.pathname)) return false
    // Reject pages that are literally the fallback URL
    if (fallback) {
      try {
        const f = new URL(fallback)
        if (u.href.replace(/\/$/, '') === f.href.replace(/\/$/, '')) return false
      } catch {}
    }
    return true
  } catch { return false }
}

function unwrapDdg(href: string): string | null {
  try {
    let raw = href
    if (raw.startsWith('//')) raw = 'https:' + raw
    if (raw.startsWith('/l/') || raw.includes('duckduckgo.com/l/')) {
      const u = new URL(raw, 'https://duckduckgo.com')
      const wrapped = u.searchParams.get('uddg')
      if (wrapped) raw = decodeURIComponent(wrapped)
    }
    return /^https?:\/\//i.test(raw) ? raw : null
  } catch { return null }
}

async function firstSubPageResult(query: string, domain: string, fallback: string | null): Promise<string | null> {
  // 1) DuckDuckGo HTML
  try {
    const ddg = await fetch(
      'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query),
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        },
      },
    )
    if (ddg.ok) {
      const html = await ddg.text()
      const matches = [...html.matchAll(/<a[^>]+class="result__a"[^>]+href="([^"]+)"/gi)]
      for (const m of matches) {
        const url = unwrapDdg(m[1])
        if (url && isAcceptable(url, domain, fallback)) return url
      }
    }
  } catch {}

  // 2) Bing fallback
  try {
    const bing = await fetch(
      'https://www.bing.com/search?q=' + encodeURIComponent(query),
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        },
      },
    )
    if (bing.ok) {
      const html = await bing.text()
      const matches = [...html.matchAll(/<li class="b_algo"[^>]*>[\s\S]*?<a[^>]+href="(https?:\/\/[^"]+)"/gi)]
      for (const m of matches) {
        if (isAcceptable(m[1], domain, fallback)) return m[1]
      }
    }
  } catch {}

  return null
}
