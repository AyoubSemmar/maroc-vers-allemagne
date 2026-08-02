// Merge subagent-translated uk/sq/id into each article's translations JSONB and
// add them to _meta.locales — idempotent, never clobbering existing locales.
// Reads scripts/out/article-backfill/out/*.json (arrays of {id, uk, sq, id}).
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

const OUT = 'scripts/out/article-backfill/out'
const LOCS = ['uk', 'sq', 'id']
const valid = (o) => o && typeof o.title === 'string' && o.title && typeof o.content === 'string' && o.content

// Collect translations by id (last write wins if duplicated across files).
const byId = new Map()
for (const f of fs.readdirSync(OUT).filter(f => /\.json$/.test(f)).sort()) {
  let arr; try { arr = JSON.parse(fs.readFileSync(`${OUT}/${f}`, 'utf8')) } catch (e) { console.log(`skip ${f}: ${e.message}`); continue }
  for (const row of arr) {
    if (!row?.id) continue
    if (!LOCS.every(l => valid(row[l]))) { console.log(`  ! ${f} ${row.id}: missing/invalid locale, skipped`); continue }
    byId.set(row.id, row)
  }
}
console.log(`${byId.size} articles ready to merge`)
if (DRY) { console.log('--dry: not writing'); process.exit(0) }

let ok = 0, fail = 0
for (const [id, row] of byId) {
  const { data: cur, error: e0 } = await sb.from('articles').select('translations').eq('id', id).single()
  if (e0) { fail++; if (fail <= 3) console.log('read ERR', id, e0.message.slice(0, 50)); continue }
  const t = { ...(cur.translations || {}) }
  for (const l of LOCS) t[l] = { title: row[l].title, summary: row[l].summary || '', content: row[l].content, faqs: Array.isArray(row[l].faqs) ? row[l].faqs : [] }
  const meta = { ...(t._meta || {}) }
  const locs = new Set(meta.locales || [])
  for (const l of LOCS) locs.add(l)
  meta.locales = [...locs]
  t._meta = meta
  const { error } = await sb.from('articles').update({ translations: t }).eq('id', id)
  if (error) { fail++; if (fail <= 3) console.log('write ERR', id, error.message.slice(0, 50)) } else ok++
}
console.log(`pushed: ${ok} ok, ${fail} fail`)
