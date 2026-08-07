/* GoGermany "Learn German" service worker.
 *
 * Goals (kept deliberately conservative so it can't break the live site):
 *  - App shell + opened lessons work offline.
 *  - HTML navigations are network-first (fresh content wins; cache is the
 *    fallback), so students never get stuck on a stale lesson.
 *  - Next.js build assets (/_next/static/*) are content-hashed & immutable →
 *    cache-first for instant repeat loads.
 *  - Images are stale-while-revalidate.
 *  - Anything cross-origin (analytics, ads, fonts, Supabase) is left to the
 *    network untouched — we never cache or intercept it.
 *  - Only GET is ever handled; POST/PUT (exercise submissions) always hit the
 *    network.
 *
 * Bump SW_VERSION to force old caches out on the next visit.
 */
const SW_VERSION = 'v1'
const SHELL_CACHE = `gg-shell-${SW_VERSION}`
const ASSET_CACHE = `gg-assets-${SW_VERSION}`
const PAGE_CACHE = `gg-pages-${SW_VERSION}`
const OFFLINE_URL = '/offline.html'

const PRECACHE = [OFFLINE_URL, '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  const keep = new Set([SHELL_CACHE, ASSET_CACHE, PAGE_CACHE])
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// Let the page trigger an immediate activation after an update.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})

function isImage(req) {
  return req.destination === 'image'
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  // Only handle our own origin. Everything else (ads, analytics, Supabase,
  // Google Fonts, Pexels images) goes straight to the network.
  if (url.origin !== self.location.origin) return

  // Never cache API routes or auth — always network.
  if (url.pathname.startsWith('/api/')) return

  // 1) HTML navigations → network-first, fall back to cached page, then offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(PAGE_CACHE).then((c) => c.put(req, copy)).catch(() => {})
          return res
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match(OFFLINE_URL))
        )
    )
    return
  }

  // 2) Immutable build assets → cache-first.
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.match(req).then((hit) =>
        hit ||
        fetch(req).then((res) => {
          const copy = res.clone()
          caches.open(ASSET_CACHE).then((c) => c.put(req, copy)).catch(() => {})
          return res
        })
      )
    )
    return
  }

  // 3) Images → stale-while-revalidate.
  if (isImage(req)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) =>
        cache.match(req).then((hit) => {
          const network = fetch(req)
            .then((res) => { cache.put(req, res.clone()).catch(() => {}); return res })
            .catch(() => hit)
          return hit || network
        })
      )
    )
    return
  }

  // Everything else same-origin (e.g. RSC data fetches) → network, cache fallback.
  event.respondWith(fetch(req).catch(() => caches.match(req)))
})
