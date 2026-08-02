// Export global articles that still lack uk/sq/id into per-batch source files
// for subagent translation. Source text = the English translation (fallback to
// Arabic base). Batches of 4 → scripts/out/article-backfill/src/batch-NN.json.
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

for (const l of fs.readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = l.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const OUT = 'scripts/out/article-backfill'
fs.mkdirSync(`${OUT}/src`, { recursive: true })
fs.mkdirSync(`${OUT}/out`, { recursive: true })

const rows = []
for (let from = 0; ; from += 1000) {
  const { data, error } = await sb.from('articles').select('id, translations, category').range(from, from + 999)
  if (error) { console.error(error.message); process.exit(1) }
  if (!data?.length) break
  rows.push(...data)
  if (data.length < 1000) break
}

// Global articles missing any of uk/sq/id.
const targets = []
for (const r of rows) {
  const t = r.translations || {}
  const meta = t._meta || {}
  const isGlobal = meta.audience === 'global' || (meta.locales || []).includes('zh')
  if (!isGlobal) continue
  if (t.uk && t.sq && t.id) continue // already done
  const base = t.en || t.ar || {}
  if (!base.title || !base.content) continue
  targets.push({
    id: r.id,
    slug: meta.slug || String(r.id),
    title: base.title,
    summary: base.summary || '',
    content: base.content,
    faqs: Array.isArray(base.faqs) ? base.faqs : [],
  })
}

console.log(`global articles needing uk/sq/id: ${targets.length}`)
const SIZE = 4
let n = 0
for (let i = 0; i < targets.length; i += SIZE) {
  const slice = targets.slice(i, i + SIZE)
  fs.writeFileSync(`${OUT}/src/batch-${String(n).padStart(2, '0')}.json`, JSON.stringify(slice, null, 2))
  n++
}
console.log(`wrote ${n} source batches (${SIZE}/batch) to ${OUT}/src`)
