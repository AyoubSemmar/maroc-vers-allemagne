// Real stock-photo hero images from Pexels (https://www.pexels.com/api/).
// Replaces the previous AI (Replicate FLUX) hero generation: we search Pexels
// for a relevant landscape photo, download it, upload it into the Supabase
// `article-images` bucket (so hero URLs stay on our own domain), and return the
// public URL. Pexels' license allows free use without attribution.
//
// NON-REPETITION: the chosen Pexels photo id is encoded into the uploaded
// filename (pexels-<photoId>-<rand>.jpg). Callers seed a `usedIds` Set from the
// ids already present in the DB (see pexelsIdFromUrl) and pass it in; the helper
// then pages through results and skips any photo already used, so no two
// articles ever share the same hero.
//
// Requires PEXELS_API_KEY (or ARTICLE_GEN_PEXELS_KEY). Get a free key at
// https://www.pexels.com/api/ (generous free tier: 200 req/hour, 20k/month).

const PEXELS_KEY = process.env.PEXELS_API_KEY || process.env.ARTICLE_GEN_PEXELS_KEY

export function pexelsConfigured() {
  return !!PEXELS_KEY
}

// A curated, real-world stock-photo query per article category — a scene that
// reads well as a hero. Falls back to keywords pulled from the title.
const CATEGORY_QUERY = {
  visa: 'passport application desk',
  visas: 'passport application desk',
  immigration: 'airport arrivals travellers',
  healthcare: 'health insurance documents',
  health: 'health insurance documents',
  insurance: 'insurance paperwork desk',
  jobs: 'office team meeting',
  work: 'professional office work',
  career: 'office team meeting',
  housing: 'apartment keys new home',
  study: 'university campus students',
  studium: 'university campus students',
  education: 'university lecture hall',
  ausbildung: 'vocational training workshop',
  language: 'language learning notebook',
  finance: 'bank counter finance',
  money: 'bank counter finance',
  banking: 'bank counter finance',
  culture: 'germany city street',
  'daily-life': 'germany city street life',
  family: 'family together at home',
  transport: 'german train station platform',
  food: 'german food market',
  city: 'germany city skyline',
  business: 'business meeting handshake',
  legal: 'signing legal documents',
}

// Extra query variety per audience so heroes for country-specific articles feel
// distinct even when they share a category (also widens the photo pool, helping
// non-repetition across a large backfill).
const AUDIENCE_HINT = {
  global: 'people diverse city',
  india: 'indian professional',
  pakistan: 'south asian professional',
  'north-africa': 'young professional office',
  turkey: 'young professional city',
  'iran-afghanistan': 'young professional',
  'spain-latam': 'latino professional',
  'portugal-brazil': 'brazilian professional',
  'east-europe': 'european professional',
  china: 'asian professional',
}

// Common English stopwords + domain filler so title-derived queries keep only
// the meaningful nouns.
const STOP = new Set([
  'the', 'and', 'for', 'with', 'from', 'your', 'you', 'how', 'what', 'when', 'where', 'why',
  'guide', 'complete', 'ultimate', 'best', 'tips', 'step', 'steps', 'everything', 'know',
  'about', 'into', 'that', 'this', 'their', 'germany', 'german', 'moving', 'move', 'get',
  'getting', 'a', 'an', 'of', 'in', 'to', 'as', 'is', 'are', 'or', 'on', 'at', 'by',
])

function titleQuery(title) {
  return (title || '')
    .replace(/[^a-zA-Z ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w.toLowerCase()))
    .slice(0, 3)
    .join(' ')
    .trim()
}

// Ordered list of search queries to try (each is paged through) until we find an
// unused photo. Ordered most-specific → most-generic.
function queriesFor(topic) {
  const out = []
  const cat = (topic.category || '').toLowerCase()
  const t = titleQuery(topic.title)
  if (t) out.push(t)
  if (CATEGORY_QUERY[cat]) out.push(CATEGORY_QUERY[cat])
  const hint = AUDIENCE_HINT[topic.audience]
  if (hint) out.push(hint)
  out.push('germany city', 'germany people', 'europe office') // generic fallbacks
  return [...new Set(out)]
}

// Stable hash so each article deterministically starts from a different offset
// within the result page (spreads picks out even before de-dup kicks in).
function hashInt(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

// Pull the Pexels photo id we encode into uploaded filenames back out of an
// image URL, so callers can seed the used-set from existing article images.
export function pexelsIdFromUrl(url) {
  const m = /pexels-(\d+)-/.exec(url || '')
  return m ? m[1] : null
}

async function searchPexels(query, page = 1, perPage = 80) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orientation=landscape`,
    { headers: { Authorization: PEXELS_KEY } },
  )
  if (!res.ok) throw new Error(`pexels ${res.status}`)
  const data = await res.json()
  return Array.isArray(data.photos) ? data.photos : []
}

/**
 * Find a relevant, NOT-yet-used Pexels photo for `topic`, upload it to the
 * `article-images` bucket via the given Supabase client, and return the public
 * URL.
 *   topic: { slug, title, category, audience }
 *   sb: a Supabase client with storage access (service role)
 *   opts.usedIds: Set<string> of Pexels photo ids already used (mutated: the
 *                 chosen id is added). Pass the same Set across a run + seed it
 *                 from the DB to guarantee no repeats.
 *   opts.variantIndex: optional offset so sibling articles vary their pick.
 */
export async function makePexelsImage(topic, sb, opts = {}) {
  if (!PEXELS_KEY) throw new Error('PEXELS_API_KEY not set')
  const usedIds = opts.usedIds instanceof Set ? opts.usedIds : new Set()
  const variantIndex = opts.variantIndex || 0
  const seed = hashInt(topic.slug || topic.title || 'x') + variantIndex

  // Scan queries × pages for the first photo whose id isn't already used.
  let chosen = null
  let firstSeen = null // deterministic fallback if the whole space is exhausted
  for (const q of queriesFor(topic)) {
    for (let page = 1; page <= 4 && !chosen; page++) {
      let photos = []
      try { photos = await searchPexels(q, page) } catch { break }
      if (!photos.length) break
      const start = seed % photos.length
      for (let k = 0; k < photos.length; k++) {
        const p = photos[(start + k) % photos.length]
        if (!p?.id) continue
        if (!firstSeen) firstSeen = p
        if (!usedIds.has(String(p.id))) { chosen = p; break }
      }
    }
    if (chosen) break
  }
  chosen = chosen || firstSeen
  if (!chosen) throw new Error('no pexels results')

  usedIds.add(String(chosen.id))
  const src =
    chosen.src?.large2x || chosen.src?.landscape || chosen.src?.large || chosen.src?.original
  if (!src) throw new Error('no pexels src')

  const buf = Buffer.from(await (await fetch(src)).arrayBuffer())
  const filename = `pexels-${chosen.id}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { data: up, error } = await sb.storage
    .from('article-images')
    .upload(filename, buf, { contentType: 'image/jpeg' })
  if (error) throw new Error(`upload: ${error.message}`)
  return sb.storage.from('article-images').getPublicUrl(up.path).data.publicUrl
}
