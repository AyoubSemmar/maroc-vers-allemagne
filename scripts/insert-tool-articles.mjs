/**
 * Insert hand-written multi-locale articles (the 2026-07 tool companions).
 * Content is authored in-session (scripts/out/tool-articles/*.json, all 12
 * locales included) — NO Anthropic calls. Replicate generates the hero image
 * (explicitly allowed), same FLUX setup as the daily pipeline.
 *
 * Idempotent via translations._meta.slug in the DB, exactly like the daily
 * runner — reusing a planned topic's slug here means the daily generator
 * will skip that topic forever.
 *
 * Run: node scripts/insert-tool-articles.mjs [--no-image]
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

const envPath = path.resolve('.env.local')
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}

const NO_IMAGE = process.argv.includes('--no-image')
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
const replicate = new Replicate({ auth: process.env.ARTICLE_GEN_REPLICATE_TOKEN || process.env.REPLICATE_API_TOKEN })

const IMAGE_MODEL = 'black-forest-labs/flux-1.1-pro'
const IMAGE_STYLE = 'professional editorial photography, photorealistic, cinematic soft natural lighting, shallow depth of field, muted warm color palette, candid documentary feel, no text, no words, no logos, no charts, no watermarks'

async function makeImage(scene) {
  let pred = await replicate.predictions.create({
    model: IMAGE_MODEL,
    input: { prompt: `${scene} ${IMAGE_STYLE}`, aspect_ratio: '16:9', output_format: 'jpg', output_quality: 95, safety_tolerance: 2, prompt_upsampling: true },
  })
  const terminal = new Set(['succeeded', 'failed', 'canceled'])
  const start = Date.now()
  while (!terminal.has(pred.status)) {
    if (Date.now() - start > 90_000) throw new Error('image timeout')
    await new Promise(r => setTimeout(r, 1500))
    pred = await replicate.predictions.get(pred.id)
  }
  if (pred.status !== 'succeeded') throw new Error(`replicate ${pred.status}`)
  const out = pred.output
  const first = Array.isArray(out) ? out[0] : out
  const url = typeof first === 'string' ? first : (typeof first?.url === 'function' ? first.url() : null)
  if (!url) throw new Error('no image url')
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
  const filename = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { data: up, error } = await supabase.storage.from('article-images').upload(filename, buf, { contentType: 'image/jpeg' })
  if (error) throw new Error(`upload: ${error.message}`)
  return supabase.storage.from('article-images').getPublicUrl(up.path).data.publicUrl
}

async function existingSlugs() {
  const slugs = new Set()
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('articles').select('slug:translations->_meta->>slug').range(from, from + 999)
    if (error) throw new Error(error.message)
    if (!data?.length) break
    data.forEach(r => r.slug && slugs.add(r.slug))
    if (data.length < 1000) break
  }
  return slugs
}

const dir = 'scripts/out/tool-articles'
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
const done = await existingSlugs()

for (const file of files) {
  const a = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
  if (done.has(a.slug)) { console.log(`↷ skip (exists): ${a.slug}`); continue }

  const missing = a.locales.filter(l => !a.translations[l]?.title || !a.translations[l]?.content)
  if (missing.length) { console.log(`✗ ${a.slug}: missing locales ${missing.join(',')}`); continue }

  const base = a.translations.ar
  const translations = {}
  for (const l of a.locales) if (l !== 'ar') translations[l] = a.translations[l]
  translations._meta = { audience: a.audience, locales: a.locales, slug: a.slug }

  let image_url = null
  if (!NO_IMAGE) {
    try { image_url = await makeImage(a.imagePrompt) } catch (e) { console.log(`  img ✗ ${a.slug}: ${e.message}`) }
  }

  const { data, error } = await supabase.from('articles').insert({
    title: base.title, summary: base.summary, content: base.content, faqs: base.faqs,
    category: a.category, date: new Date().toISOString().slice(0, 10),
    image_url, translations,
  }).select('id').single()
  if (error) { console.log(`✗ insert ${a.slug}: ${error.message}`); continue }
  console.log(`✓ ${a.slug} → id ${data.id} (${a.locales.length} locales${image_url ? ', img' : ''})`)
}
