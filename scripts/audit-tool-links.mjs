// Audit: for each tool path, count DB articles whose content (any locale)
// contains a link to it. Read-only.
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const envPath = path.resolve('.env.local')
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const TOOLS = [
  '/cv-builder', '/anschreiben-generator', '/interview-prep',
  '/tools/eligibility-checker', '/tools/document-checklist', '/tools/migration-timeline',
  '/tools/living-cost-calculator', '/tools/chancenkarte-calculator', '/tools/sperrkonto-calculator',
  '/tools/brutto-netto-rechner', '/tools/anerkennung-wizard', '/tools/city-comparator',
  '/tools/german-grade-calculator', '/tools/ausbildung-salary', '/tools/driving-license-germany',
  '/tools/health-insurance-germany', '/tools/tax-refund-calculator', '/tools/furnished-housing',
]

const counts = Object.fromEntries(TOOLS.map(t => [t, []]))
let total = 0
for (let from = 0; ; from += 200) {
  const { data, error } = await supabase.from('articles')
    .select('id, title, content, translations')
    .range(from, from + 199)
  if (error) throw new Error(error.message)
  if (!data?.length) break
  total += data.length
  for (const a of data) {
    let blob = a.content || ''
    if (a.translations) for (const [k, v] of Object.entries(a.translations)) {
      if (k !== '_meta' && v?.content) blob += '\n' + v.content
    }
    for (const t of TOOLS) if (blob.includes(t)) counts[t].push(a.id)
  }
  if (data.length < 200) break
}
console.log('total articles scanned:', total)
for (const t of TOOLS) {
  const ids = counts[t]
  console.log(`${ids.length === 0 ? 'MISSING' : String(ids.length).padStart(7)}  ${t}  ${ids.slice(0,5).join(',')}`)
}
