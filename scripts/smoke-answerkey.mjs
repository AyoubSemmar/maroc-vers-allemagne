// One-off: prove the answer_key column is hidden from the public anon role
// (the role a logged-in student uses), while published content stays readable.
import fs from 'fs'; import path from 'path'
import { createClient } from '@supabase/supabase-js'
for (const line of fs.readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const svc = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const anon = createClient(URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } })

const { data: ins } = await svc.from('assignments').insert({
  skill: 'grammar', level_id: 'A1', title: '[SMOKE2]', content: { questions: [] },
  answer_key: { correct: [1] }, is_published: true,
}).select('id').single()
const aid = ins.id

const r1 = await anon.from('assignments').select('id,title,content').eq('id', aid).maybeSingle()
console.log(r1.error ? `  anon read content: ERROR ${r1.error.message}` : '  \x1b[32m✓\x1b[0m anon CAN read published content')

const r2 = await anon.from('assignments').select('id,answer_key').eq('id', aid).maybeSingle()
console.log(r2.error
  ? `  \x1b[32m✓\x1b[0m anon BLOCKED from answer_key: ${r2.error.message}`
  : `  \x1b[31m✗ LEAK: anon read answer_key = ${JSON.stringify(r2.data?.answer_key)}\x1b[0m`)

await svc.from('assignments').delete().eq('id', aid)
console.log('  cleaned')
