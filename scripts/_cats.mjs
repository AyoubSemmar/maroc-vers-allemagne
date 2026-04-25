import fs from 'node:fs'
const env = fs.readFileSync('.env.local','utf8')
for (const line of env.split(/\r?\n/)) {
  const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g,'')
}
const { createClient } = await import('@supabase/supabase-js')
const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const { data, error } = await c.from('articles').select('category').limit(500)
if (error) { console.error(error); process.exit(1) }
const counts = {}
for (const r of (data||[])) counts[r.category||'(null)'] = (counts[r.category||'(null)']||0) + 1
console.log(JSON.stringify(counts, null, 2))
