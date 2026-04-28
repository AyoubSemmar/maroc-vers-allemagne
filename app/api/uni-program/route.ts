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
/** Allowlist of TLDs we consider acceptable redirect targets. German
 *  university domains end in .de almost universally; .at + .ch covers
 *  the few Austrian/Swiss institutions our DB references; .org is for
 *  occasional umbrella bodies (DAAD, Studienkollegs). Any other TLD —
 *  including .com — is rejected to prevent the endpoint being abused
 *  as an open-redirect for phishing under your TLS cert. */
const ALLOWED_TLDS = ['.de', '.at', '.ch', '.org', '.eu']

function isSafeRedirectUrl(raw: string): boolean {
  try {
    const u = new URL(raw)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false
    const host = u.hostname.toLowerCase()
    return ALLOWED_TLDS.some(tld => host.endsWith(tld))
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const uni = url.searchParams.get('uni')?.trim()
  const level = url.searchParams.get('level')?.trim() as 'bachelor' | 'master' | null
  const fallbackRaw = url.searchParams.get('fallback')?.trim() ?? null
  const debug = url.searchParams.get('debug') === '1'

  // Validate fallback URL before doing anything with it. Rejects open-redirect
  // attempts (?fallback=https://evil.com).
  const fallback = fallbackRaw && isSafeRedirectUrl(fallbackRaw) ? fallbackRaw : null

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

  const debugInfo: any = { uni, level, domain, query }
  const target = await firstSubPageResult(query, domain, fallback, debugInfo)

  const dest = target ?? fallback
  if (debug) {
    return NextResponse.json({
      ...debugInfo,
      target,
      fallbackUsed: !target,
      finalDestination: dest,
    }, { status: 200, headers: { 'Cache-Control': 'no-store' } })
  }
  if (!dest) {
    return NextResponse.json({ error: 'Could not resolve a program page' }, { status: 502 })
  }
  // Final defence-in-depth: even if the scraper found a target, validate
  // it before redirecting. Stops a compromised/poisoned DuckDuckGo result
  // from sending users off-domain.
  if (!isSafeRedirectUrl(dest)) {
    return NextResponse.json({ error: 'Resolved URL is not in the allowed domain set' }, { status: 502 })
  }

  return NextResponse.redirect(dest, {
    status: 302,
    headers: {
      // Short cache during testing; bump back to 86400 once stable.
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
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

async function firstSubPageResult(
  query: string,
  domain: string,
  fallback: string | null,
  debug: any,
): Promise<string | null> {
  debug.attempts = []

  // 1) DuckDuckGo HTML
  try {
    const res = await fetch(
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
    const ddg: any = { source: 'ddg', status: res.status }
    if (res.ok) {
      const html = await res.text()
      const matches = [...html.matchAll(/<a[^>]+class="result__a"[^>]+href="([^"]+)"/gi)]
      ddg.rawCount = matches.length
      ddg.candidates = []
      for (const m of matches.slice(0, 10)) {
        const url = unwrapDdg(m[1])
        if (!url) continue
        const accepted = isAcceptable(url, domain, fallback)
        ddg.candidates.push({ url, accepted })
        if (accepted) {
          debug.attempts.push(ddg)
          return url
        }
      }
    }
    debug.attempts.push(ddg)
  } catch (e: any) {
    debug.attempts.push({ source: 'ddg', error: e.message })
  }

  // 2) Bing fallback
  try {
    const res = await fetch(
      'https://www.bing.com/search?q=' + encodeURIComponent(query),
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        },
      },
    )
    const bing: any = { source: 'bing', status: res.status }
    if (res.ok) {
      const html = await res.text()
      const matches = [...html.matchAll(/<li class="b_algo"[^>]*>[\s\S]*?<a[^>]+href="(https?:\/\/[^"]+)"/gi)]
      bing.rawCount = matches.length
      bing.candidates = []
      for (const m of matches.slice(0, 10)) {
        const accepted = isAcceptable(m[1], domain, fallback)
        bing.candidates.push({ url: m[1], accepted })
        if (accepted) {
          debug.attempts.push(bing)
          return m[1]
        }
      }
    }
    debug.attempts.push(bing)
  } catch (e: any) {
    debug.attempts.push({ source: 'bing', error: e.message })
  }

  return null
}
