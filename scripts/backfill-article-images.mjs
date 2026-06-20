/**
 * Backfill hero images for articles that have image_url = null.
 * Generates via Replicate FLUX (sequential + 429 retry, so it tolerates the
 * low-credit throttle), uploads to the article-images bucket, updates the row.
 *
 * Run: node scripts/backfill-article-images.mjs            (all null-image articles)
 *      node scripts/backfill-article-images.mjs 143 147 150
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const replicate = new Replicate({ auth: process.env.ARTICLE_GEN_REPLICATE_TOKEN || process.env.REPLICATE_API_TOKEN })

const idArgs = process.argv.slice(2).map(Number).filter(Boolean)

async function createWithRetry(input, tries = 8) {
  for (let i = 0; i < tries; i++) {
    try { return await replicate.predictions.create({ model: 'black-forest-labs/flux-schnell', input }) }
    catch (e) {
      const is429 = e?.response?.status === 429 || /429|throttled/i.test(e?.message || '')
      if (!is429 || i === tries - 1) throw e
      const wait = (e?.response?.headers?.get?.('retry-after') ? parseInt(e.response.headers.get('retry-after'), 10) : 0) || 10
      console.log(`    throttled, waiting ${wait + 1}s…`)
      await new Promise(r => setTimeout(r, (wait + 1) * 1000))
    }
  }
}

async function makeImage(keyword) {
  const prompt = `${keyword}, Germany, editorial photograph, soft natural light, shallow depth of field, no text, no logos, high detail`
  let pred = await createWithRetry({ prompt, aspect_ratio: '16:9', output_format: 'jpg', output_quality: 90, num_outputs: 1 })
  const terminal = new Set(['succeeded', 'failed', 'canceled'])
  const start = Date.now()
  while (!terminal.has(pred.status)) {
    if (Date.now() - start > 120000) throw new Error('timeout')
    await new Promise(r => setTimeout(r, 1500))
    pred = await replicate.predictions.get(pred.id)
  }
  if (pred.status !== 'succeeded') throw new Error(`replicate ${pred.status}`)
  const out = pred.output
  const first = Array.isArray(out) ? out[0] : out
  const url = typeof first === 'string' ? first : (typeof first?.url === 'function' ? first.url() : null)
  if (!url) throw new Error('no url')
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
  const filename = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { data: up, error } = await supabase.storage.from('article-images').upload(filename, buf, { contentType: 'image/jpeg' })
  if (error) throw new Error(`upload: ${error.message}`)
  return supabase.storage.from('article-images').getPublicUrl(up.path).data.publicUrl
}

async function main() {
  let q = supabase.from('articles').select('id, title, translations').is('image_url', null)
  if (idArgs.length) q = supabase.from('articles').select('id, title, translations').in('id', idArgs)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  const targets = idArgs.length ? data : data.filter(r => true)
  console.log(`Backfilling ${targets.length} images (sequential + retry)`)
  let done = 0, failed = 0
  for (const r of targets) {
    const kw = r.translations?.en?.title || r.title
    process.stdout.write(`  id ${r.id}: ${(kw || '').slice(0, 45)}… `)
    try {
      const url = await makeImage(kw)
      await supabase.from('articles').update({ image_url: url }).eq('id', r.id)
      done++; console.log('✓')
    } catch (e) { failed++; console.log(`✗ ${e.message}`) }
  }
  console.log(`\nDone: ${done} filled, ${failed} failed`)
}

main().catch(e => { console.error(e); process.exit(1) })
