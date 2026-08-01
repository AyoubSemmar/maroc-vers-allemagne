/**
 * Insert the 20 subagent-written articles into Supabase.
 * Text comes from scripts/out/gen20/articles/<slug>/<locale>.json (written by
 * Claude Code subagents — NO Anthropic API used). Hero image is a real Pexels
 * stock photo searched by the topic's category/title (also no Anthropic API).
 * Idempotent: skips a slug already present in the DB (translations._meta.slug).
 *
 * Run: node scripts/gen20-insert.mjs            (with images)
 *      node scripts/gen20-insert.mjs --no-image (skip images)
 */
import fs from 'fs'; import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { makePexelsImage } from './pexels-image.mjs'

for (const l of fs.readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = l.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const NO_IMAGE = process.argv.includes('--no-image')
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const OUT = process.env.GEN_DIR || 'scripts/out/gen20'
const topics = JSON.parse(fs.readFileSync(`${OUT}/topics.json`, 'utf8'))
const STATE = `${OUT}/state.json`
const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {}
const saveState = () => fs.writeFileSync(STATE, JSON.stringify(state, null, 2))

function readArticle(slug, loc) {
  const p = `${OUT}/articles/${slug}/${loc}.json`
  if (!fs.existsSync(p)) return null
  try {
    const a = JSON.parse(fs.readFileSync(p, 'utf8'))
    if (!a.title || !a.content) return null
    a.faqs = Array.isArray(a.faqs) ? a.faqs.map(f => ({ q: String(f.q ?? f.question ?? '').trim(), a: String(f.a ?? f.answer ?? '').trim() })).filter(f => f.q && f.a) : []
    a.summary = String(a.summary || '').trim()
    return a
  } catch { return null }
}

// Hero image: a real Pexels stock photo searched by the topic's category/title,
// uploaded into our article-images bucket. `i` varies the pick across siblings.
async function makeImage(topic, i) {
  return makePexelsImage(topic, sb, i)
}

// existing slugs (idempotency)
const existing = new Set()
for (let from = 0; ; from += 1000) {
  const { data } = await sb.from('articles').select('slug:translations->_meta->>slug').range(from, from + 999)
  if (!data?.length) break; data.forEach(r => r.slug && existing.add(r.slug)); if (data.length < 1000) break
}

let created = 0, skipped = 0, incomplete = 0, failed = 0
for (let i = 0; i < topics.length; i++) {
  const topic = topics[i]
  const slug = topic.slug
  if (existing.has(slug) || state[slug]?.id) { skipped++; console.log(`  = skip ${slug} (exists)`); continue }

  // gather locale articles
  const byLoc = {}
  const missing = []
  for (const loc of topic.locales) { const a = readArticle(slug, loc); if (a) byLoc[loc] = a; else missing.push(loc) }
  if (missing.length) { incomplete++; console.log(`  ! incomplete ${slug}: missing ${missing.join(',')}`); continue }

  const hasAr = topic.locales.includes('ar')
  const baseLang = hasAr ? 'ar' : 'en'
  const base = byLoc[baseLang]
  const translations = {}
  for (const loc of topic.locales) { if (loc === baseLang) continue; const a = byLoc[loc]; translations[loc] = { title: a.title, summary: a.summary, content: a.content, faqs: a.faqs } }
  translations._meta = { audience: topic.audience, locales: topic.locales, slug }

  let image_url = null
  if (!NO_IMAGE) { try { image_url = await makeImage(topic, i) } catch (e) { console.log(`    img ✗ ${slug}: ${e.message}`) } }

  const row = {
    title: base.title, summary: base.summary, content: base.content, faqs: base.faqs,
    category: topic.category, date: new Date().toISOString().slice(0, 10), image_url, translations,
  }
  const { data, error } = await sb.from('articles').insert(row).select('id').single()
  if (error) { failed++; console.log(`  ✗ insert ${slug}: ${error.message}`); continue }
  state[slug] = { id: data.id }; saveState()
  created++
  console.log(`  ✓ ${slug} → id ${data.id} (${topic.locales.length} loc${image_url ? ', img' : ', NO img'})`)
}
console.log(`\nCreated: ${created} | skipped: ${skipped} | incomplete: ${incomplete} | failed: ${failed}`)
