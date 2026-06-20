/**
 * Regenerate hero images with a higher-quality model + art-directed prompts.
 * For each article, Claude (Haiku) turns the title into a concrete photographic
 * SCENE (people/objects/setting — not the abstract keyword), then Replicate
 * flux-1.1-pro renders it in a consistent editorial style.
 *
 * Run: node scripts/regen-article-images.mjs 142 143 ...   (specific ids)
 *      node scripts/regen-article-images.mjs --range=142-151
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import Replicate from 'replicate'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const anthropic = new Anthropic({ apiKey: process.env.ARTICLE_GEN_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY })
const replicate = new Replicate({ auth: process.env.ARTICLE_GEN_REPLICATE_TOKEN || process.env.REPLICATE_API_TOKEN })

const MODEL = process.env.IMAGE_MODEL || 'black-forest-labs/flux-1.1-pro'
const STYLE = 'professional editorial photography, photorealistic, cinematic soft natural lighting, shallow depth of field, muted warm color palette, candid documentary feel, no text, no words, no logos, no charts, no watermarks'

const args = process.argv.slice(2)
let ids = args.filter(a => /^\d+$/.test(a)).map(Number)
const range = args.find(a => a.startsWith('--range='))?.split('=')[1]
if (range) { const [a, b] = range.split('-').map(Number); for (let i = a; i <= b; i++) ids.push(i) }

async function scenePrompt(title) {
  const resp = await anthropic.messages.create({
    model: 'claude-haiku-4-5', max_tokens: 220, temperature: 0.9,
    messages: [{ role: 'user', content: `Invent ONE concrete, realistic photographic hero-image scene for an article about moving to Germany titled "${title}".

Rules:
- Pick the SETTING that genuinely fits this specific topic — e.g. a doctor's office, a rented apartment, a language classroom, a Bürgeramt waiting room, a university campus, a city street, an airport, a kitchen table with paperwork, a job site. Avoid defaulting to a generic office boardroom.
- Vary the composition: sometimes a single person, sometimes two, occasionally a place/objects with no people. Do NOT always use "a diverse group of professionals".
- When people appear, make them natural and candid (varied ethnicities and genders) — not posed stock clichés.
- No text, UI, charts, maps, icons, or symbolic objects.
- 1–2 sentences, vivid and specific.

Return ONLY the scene description.` }],
  })
  return resp.content.map(c => c.type === 'text' ? c.text : '').join('').trim().replace(/^["']|["']$/g, '')
}

async function createWithRetry(input, tries = 8) {
  for (let i = 0; i < tries; i++) {
    try { return await replicate.predictions.create({ model: MODEL, input }) }
    catch (e) {
      const is429 = e?.response?.status === 429 || /429|throttled/i.test(e?.message || '')
      if (!is429 || i === tries - 1) throw e
      const wait = (e?.response?.headers?.get?.('retry-after') ? parseInt(e.response.headers.get('retry-after'), 10) : 0) || 10
      await new Promise(r => setTimeout(r, (wait + 1) * 1000))
    }
  }
}

async function render(prompt) {
  let pred = await createWithRetry({ prompt, aspect_ratio: '16:9', output_format: 'jpg', output_quality: 95, safety_tolerance: 2, prompt_upsampling: true })
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
  const { data, error } = await supabase.from('articles').select('id, title, translations').in('id', ids)
  if (error) throw new Error(error.message)
  console.log(`Regenerating ${data.length} images with ${MODEL}`)
  let done = 0, failed = 0
  for (const r of data.sort((a, b) => a.id - b.id)) {
    const title = r.translations?.en?.title || r.title
    process.stdout.write(`  id ${r.id}: `)
    try {
      const scene = await scenePrompt(title)
      const url = await render(`${scene} ${STYLE}`)
      await supabase.from('articles').update({ image_url: url }).eq('id', r.id)
      done++; console.log(`✓  (${scene.slice(0, 70)}…)`)
    } catch (e) { failed++; console.log(`✗ ${e.message}`) }
  }
  console.log(`\nDone: ${done} regenerated, ${failed} failed`)
}

main().catch(e => { console.error(e); process.exit(1) })
