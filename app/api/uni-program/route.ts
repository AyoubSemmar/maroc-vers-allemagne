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

  const query = `${uni} ${level} studiengang`
  const target = await firstSearchResult(query)

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

async function firstSearchResult(query: string): Promise<string | null> {
  // 1) DuckDuckGo HTML endpoint — scrapable, no API key
  try {
    const ddg = await fetch(
      'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query),
      {
        headers: {
          // DDG bot-checks bare clients; pretend to be a real browser.
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9,de;q=0.8',
        },
      },
    )
    if (ddg.ok) {
      const html = await ddg.text()
      // <a class="result__a" href="https://www.tum.de/studium/...">
      const m = html.match(/<a[^>]+class="result__a"[^>]+href="([^"]+)"/i)
      if (m) {
        let raw = m[1]
        // DDG may wrap results in /l/?uddg=<encoded-url>
        if (raw.startsWith('/l/') || raw.includes('duckduckgo.com/l/')) {
          const u = new URL(raw, 'https://duckduckgo.com')
          const wrapped = u.searchParams.get('uddg')
          if (wrapped) raw = decodeURIComponent(wrapped)
        }
        if (/^https?:\/\//i.test(raw)) return raw
      }
    }
  } catch {
    // fall through
  }

  // 2) Bing fallback — also scrapable
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
      // <li class="b_algo"><h2><a href="https://...">
      const m = html.match(/<li class="b_algo"[^>]*>[\s\S]*?<h2>\s*<a[^>]+href="([^"]+)"/i)
      if (m && /^https?:\/\//i.test(m[1])) return m[1]
    }
  } catch {
    // fall through
  }

  return null
}
