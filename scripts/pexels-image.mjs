// Real stock-photo hero images from Pexels (https://www.pexels.com/api/).
// Replaces the previous AI (Replicate FLUX) hero generation: we search Pexels
// for a relevant landscape photo, download it, upload it into the Supabase
// `article-images` bucket (so hero URLs stay on our own domain), and return the
// public URL. Pexels' license allows free use without attribution.
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

// Ordered list of search queries to try until one returns photos.
function queriesFor(topic) {
  const out = []
  const cat = (topic.category || '').toLowerCase()
  if (CATEGORY_QUERY[cat]) out.push(CATEGORY_QUERY[cat])
  const t = titleQuery(topic.title)
  if (t) out.push(t)
  out.push('germany city') // generic, always returns results
  return [...new Set(out)]
}

// Stable hash so each article deterministically picks a different photo from the
// result page (avoids the same hero repeating across many articles).
function hashInt(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

async function searchPexels(query) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape`,
    { headers: { Authorization: PEXELS_KEY } },
  )
  if (!res.ok) throw new Error(`pexels ${res.status}`)
  const data = await res.json()
  return Array.isArray(data.photos) ? data.photos : []
}

/**
 * Find a relevant Pexels photo for `topic`, upload it to the `article-images`
 * bucket via the given Supabase client, and return the public URL.
 *   topic: { slug, title, category, audience }
 *   sb: a Supabase client with storage access (service role)
 *   variantIndex: optional offset so sibling articles vary their pick
 */
export async function makePexelsImage(topic, sb, variantIndex = 0) {
  if (!PEXELS_KEY) throw new Error('PEXELS_API_KEY not set')

  let photos = []
  for (const q of queriesFor(topic)) {
    try {
      photos = await searchPexels(q)
      if (photos.length) break
    } catch { /* try next query */ }
  }
  if (!photos.length) throw new Error('no pexels results')

  const idx = (hashInt(topic.slug || topic.title || 'x') + variantIndex) % photos.length
  const photo = photos[idx]
  const src =
    photo?.src?.large2x || photo?.src?.landscape || photo?.src?.large || photo?.src?.original
  if (!src) throw new Error('no pexels src')

  const buf = Buffer.from(await (await fetch(src)).arrayBuffer())
  const filename = `pexels-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { data: up, error } = await sb.storage
    .from('article-images')
    .upload(filename, buf, { contentType: 'image/jpeg' })
  if (error) throw new Error(`upload: ${error.message}`)
  return sb.storage.from('article-images').getPublicUrl(up.path).data.publicUrl
}
