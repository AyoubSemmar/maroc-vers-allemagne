// Merge consolidated uk/sq/id translations into each article's translations
// JSONB + _meta.locales — idempotent, never clobbering existing locales.
// Reads scripts/out/article-backfill/merged.json = [{ id, t: { uk, sq, id } }, ...]
// (locales nested under `t` so the 'id' locale can't collide with article id).
//
// Run: node scripts/push-article-locales.mjs [--dry]
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

const DRY = process.argv.includes('--dry')
for (const l of fs.readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = l.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const LOCS = ['uk', 'sq', 'id']
const nonEmpty = (o) => o && typeof o.title === 'string' && o.title && typeof o.content === 'string' && o.content
const merged = JSON.parse(fs.readFileSync('scripts/out/article-backfill/merged.json', 'utf8'))
const rows = merged.filter(r => r.id != null && r.t && LOCS.every(l => nonEmpty(r.t[l])))
console.log(`${rows.length} complete articles to merge (of ${merged.length} in merged.json)`)
if (DRY) { console.log('--dry: not writing'); process.exit(0) }

let ok = 0, fail = 0
for (const r of rows) {
  const { data: cur, error: e0 } = await sb.from('articles').select('translations').eq('id', r.id).single()
  if (e0) { fail++; if (fail <= 3) console.log('read ERR', r.id, e0.message.slice(0, 50)); continue }
  const t = { ...(cur.translations || {}) }
  for (const l of LOCS) t[l] = { title: r.t[l].title, summary: r.t[l].summary || '', content: r.t[l].content, faqs: Array.isArray(r.t[l].faqs) ? r.t[l].faqs : [] }
  const meta = { ...(t._meta || {}) }
  const locs = new Set(meta.locales || [])
  for (const l of LOCS) locs.add(l)
  meta.locales = [...locs]
  t._meta = meta
  const { error } = await sb.from('articles').update({ translations: t }).eq('id', r.id)
  if (error) { fail++; if (fail <= 3) console.log('write ERR', r.id, error.message.slice(0, 50)) } else ok++
}
console.log(`pushed: ${ok} ok, ${fail} fail`)
