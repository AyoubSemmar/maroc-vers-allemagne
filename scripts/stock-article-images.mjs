/**
 * Set article hero images from Pexels stock search (the clean stock look).
 * For each article, Claude (Haiku) picks a concise visual search query, then
 * the Pexels API returns a real landscape photo; we store its hosted URL.
 *
 * Needs a free Pexels API key in .env.local as PEXELS_API_KEY
 * (or ARTICLE_GEN_PEXELS_KEY). Get one at https://www.pexels.com/api/
 *
 * Run: node scripts/stock-article-images.mjs --range=142-151
 *      node scripts/stock-article-images.mjs 142 143 ...
 *      node scripts/stock-article-images.mjs --missing      (only null image_url)
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}
const PEXELS_KEY = process.env.ARTICLE_GEN_PEXELS_KEY || process.env.PEXELS_API_KEY
if (!PEXELS_KEY) { console.error('Missing PEXELS_API_KEY in .env.local — get a free key at https://www.pexels.com/api/'); process.exit(1) }

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const anthropic = new Anthropic({ apiKey: process.env.ARTICLE_GEN_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY })

const args = process.argv.slice(2)
let ids = args.filter(a => /^\d+$/.test(a)).map(Number)
const range = args.find(a => a.startsWith('--range='))?.split('=')[1]
if (range) { const [a, b] = range.split('-').map(Number); for (let i = a; i <= b; i++) ids.push(i) }
const onlyMissing = args.includes('--missing')

// Track which Pexels photos we've already used so heroes don't repeat.
const usedPath = 'scripts/out/used-pexels.json'
const used = new Set(fs.existsSync(usedPath) ? JSON.parse(fs.readFileSync(usedPath, 'utf8')) : [])
const saveUsed = () => fs.writeFileSync(usedPath, JSON.stringify([...used], null, 2))

async function queryFor(title) {
  const resp = await anthropic.messages.create({
    model: 'claude-haiku-4-5', max_tokens: 30, temperature: 0.4,
    messages: [{ role: 'user', content: `Give a 2–4 word stock-photo search query (a concrete visual subject — people, place, or object) that would make a good hero image for an article titled "${title}". Prefer professional/lifestyle/office/city scenes. Return ONLY the query, no quotes.` }],
  })
  return resp.content.map(c => c.type === 'text' ? c.text : '').join('').trim().replace(/^["']|["']$/g, '').split('\n')[0]
}

async function pexelsSearch(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=15`
  const r = await fetch(url, { headers: { Authorization: PEXELS_KEY } })
  if (!r.ok) throw new Error(`pexels ${r.status}`)
  const j = await r.json()
  const photos = j.photos || []
  // Prefer a photo we haven't used; fall back to the first.
  const pick = photos.find(p => !used.has(p.id)) || photos[0]
  if (!pick) return null
  used.add(pick.id)
  return pick.src?.landscape || pick.src?.large2x || pick.src?.large || pick.src?.original
}

async function main() {
  let rows
  if (onlyMissing) {
    rows = (await supabase.from('articles').select('id,title,translations').is('image_url', null)).data
  } else {
    rows = (await supabase.from('articles').select('id,title,translations').in('id', ids)).data
  }
  console.log(`Setting stock images for ${rows.length} articles`)
  let done = 0, failed = 0
  for (const r of rows.sort((a, b) => a.id - b.id)) {
    const title = r.translations?.en?.title || r.title
    process.stdout.write(`  id ${r.id}: `)
    try {
      const q = await queryFor(title)
      let url = await pexelsSearch(q)
      if (!url) { url = await pexelsSearch('germany city professional') }
      if (!url) throw new Error('no photo')
      await supabase.from('articles').update({ image_url: url }).eq('id', r.id)
      saveUsed()
      done++; console.log(`✓  "${q}"`)
    } catch (e) { failed++; console.log(`✗ ${e.message}`) }
    await new Promise(r => setTimeout(r, 250))
  }
  console.log(`\nDone: ${done} set, ${failed} failed`)
}

main().catch(e => { console.error(e); process.exit(1) })
