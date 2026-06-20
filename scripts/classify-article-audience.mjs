/**
 * Classify each article as 'morocco' (Morocco/North-Africa-specific) or
 * 'global' (general advice for anyone moving to Germany). Stores the result
 * in translations._meta.audience and prints a summary.
 *
 * Policy (see memory article-locale-policy):
 *   morocco → ar, fr, en, de        global → all locales
 *
 * Run: node scripts/classify-article-audience.mjs
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const FORCE = process.argv.includes('--force')

async function classify(title, summary) {
  const prompt = `You classify articles for a website that helps people immigrate to Germany. The source articles are written in Arabic for a Moroccan audience, but the site is going global.

Decide if THIS article is:
- "morocco": specifically about Morocco/Moroccans — e.g. it centers on Moroccan documents, the Morocco→Germany visa route, Moroccan bureaucracy, recognition of Moroccan diplomas, content only useful to Moroccans/North Africans, or is explicitly addressed to Moroccans in a way that wouldn't transfer to other nationalities.
- "global": general advice that applies to anyone moving to Germany regardless of nationality (life in Germany, German bureaucracy that's the same for everyone, language learning, general job/study/Ausbildung topics, healthcare, banking, housing). Incidental mentions of Morocco do NOT make it morocco-specific.

Title: ${title}
Summary: ${summary}

Answer with ONLY one word: morocco OR global`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 10,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }],
  })
  const t = resp.content.map(c => c.type === 'text' ? c.text : '').join('').toLowerCase()
  return t.includes('morocco') ? 'morocco' : 'global'
}

async function pool(items, concurrency, worker) {
  let idx = 0
  const runNext = async () => { while (idx < items.length) { const i = idx++; await worker(items[i]) } }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runNext))
}

async function main() {
  const { data: articles, error } = await supabase
    .from('articles').select('id, title, summary, translations').order('date', { ascending: false })
  if (error) throw new Error(error.message)

  let morocco = 0, global = 0, skipped = 0, done = 0
  const report = []

  await pool(articles, 6, async (a) => {
    const existing = a.translations?._meta?.audience
    if (existing && !FORCE) { skipped++; existing === 'morocco' ? morocco++ : global++; report.push({ id: a.id, audience: existing, title: a.title }); return }
    try {
      const audience = await classify(a.title || '', a.summary || '')
      const translations = { ...(a.translations || {}), _meta: { ...(a.translations?._meta || {}), audience } }
      const { error: e } = await supabase.from('articles').update({ translations }).eq('id', a.id)
      if (e) throw new Error(e.message)
      audience === 'morocco' ? morocco++ : global++
      done++
      report.push({ id: a.id, audience, title: a.title })
      process.stdout.write(`\r  classified ${done}  (morocco ${morocco} / global ${global})   `)
    } catch (err) {
      console.log(`\n  ✗ ${a.id}: ${err.message}`)
    }
  })

  fs.mkdirSync('scripts/out', { recursive: true })
  fs.writeFileSync('scripts/out/article-audience.json', JSON.stringify(report, null, 2), 'utf8')
  console.log(`\n\nTotal: ${articles.length} | morocco: ${morocco} | global: ${global} | skipped(existing): ${skipped}`)
  console.log('Report written to scripts/out/article-audience.json')
}

main().catch(e => { console.error(e); process.exit(1) })
