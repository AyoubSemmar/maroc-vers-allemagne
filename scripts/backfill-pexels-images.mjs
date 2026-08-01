/**
 * Backfill existing articles' hero images: replace the old AI-generated (FLUX)
 * heroes with real Pexels stock photos, guaranteeing NO repeats across the whole
 * table.
 *
 * - Skips articles that already have a Pexels hero (image_url contains
 *   `pexels-<id>-`) — so this is idempotent and re-runnable.
 * - Targets articles whose image_url is an old AI image (`/ai-...`) or is empty.
 *   Pass --all to re-image every article regardless.
 * - Seeds the used-photo set from every existing `pexels-` image so a partial
 *   prior run is respected and never reused.
 * - Sequential (no concurrency) so the global no-repeat set is race-free, with a
 *   small delay to stay well under Pexels' 200 req/hour limit.
 *
 * Run: node scripts/backfill-pexels-images.mjs            (only AI/empty heroes)
 *      node scripts/backfill-pexels-images.mjs --all      (every non-Pexels)
 *      node scripts/backfill-pexels-images.mjs --dedup    (re-image duplicate Pexels heroes)
 *      node scripts/backfill-pexels-images.mjs --limit=50 (cap this run)
 *
 * --dedup: when two+ articles share the same Pexels photo (e.g. from an early
 * run whose used-set was lost), keep the first and re-image the rest with unique
 * photos, so no hero repeats anywhere.
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { makePexelsImage, pexelsIdFromUrl, pexelsConfigured } from './pexels-image.mjs'

for (const l of fs.readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = l.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}

if (!pexelsConfigured()) {
  console.error('PEXELS_API_KEY (or ARTICLE_GEN_PEXELS_KEY) is not set in .env.local — aborting.')
  process.exit(1)
}

const args = process.argv.slice(2)
const ALL = args.includes('--all')
const DEDUP = args.includes('--dedup')
const LIMIT = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '0', 10) || Infinity

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Load every article with the fields we need.
const rows = []
for (let from = 0; ; from += 1000) {
  const { data, error } = await sb
    .from('articles')
    .select('id, title, category, image_url, audience:translations->_meta->>audience, slug:translations->_meta->>slug')
    .order('id', { ascending: true })
    .range(from, from + 999)
  if (error) { console.error('load error:', error.message); process.exit(1) }
  if (!data?.length) break
  rows.push(...data)
  if (data.length < 1000) break
}

// Seed the no-repeat set from every Pexels hero already in the DB.
const usedIds = new Set()
for (const r of rows) { const id = pexelsIdFromUrl(r.image_url); if (id) usedIds.add(id) }

// Already on Pexels — either our uploaded bucket file (pexels-<id>-) or an early
// article's hosted Pexels URL (images.pexels.com/photos/<id>/).
const isPexels = (u) => /pexels-\d+-/.test(u || '') || /images\.pexels\.com\/photos\//.test(u || '')
const isAi = (u) => /\/ai-/.test(u || '') || /ai-\d+-/.test(u || '')

let targets
if (DEDUP) {
  // Keep the first article for each photo id; re-image every later one that
  // reuses an id already claimed by an earlier article.
  const seenId = new Set()
  targets = []
  for (const r of rows) {
    const id = pexelsIdFromUrl(r.image_url)
    if (!id) continue
    if (seenId.has(id)) targets.push(r)
    else seenId.add(id)
  }
} else {
  targets = rows.filter(r => {
    if (isPexels(r.image_url)) return false          // already done
    if (ALL) return true
    return isAi(r.image_url) || !r.image_url          // AI or missing
  })
}

console.log(`${rows.length} articles total · ${usedIds.size} unique Pexels photos in use · ${targets.length} to ${DEDUP ? 're-image (dedup)' : 'backfill'}${ALL ? ' (--all)' : ''}`)

let done = 0, failed = 0
for (const r of targets) {
  if (done >= LIMIT) break
  const topic = { slug: r.slug || String(r.id), title: r.title, category: r.category, audience: r.audience || 'global' }
  try {
    const url = await makePexelsImage(topic, sb, { usedIds })
    const { error } = await sb.from('articles').update({ image_url: url }).eq('id', r.id)
    if (error) throw new Error(error.message)
    done++
    console.log(`  ✓ ${r.id} ${topic.slug} → ${url.split('/').pop()}`)
  } catch (e) {
    failed++
    console.log(`  ✗ ${r.id} ${topic.slug}: ${e.message}`)
  }
  await new Promise(res => setTimeout(res, 400)) // stay under Pexels rate limits
}

console.log(`\nBackfilled ${done} · failed ${failed} · unique Pexels photos now in use: ${usedIds.size}`)
