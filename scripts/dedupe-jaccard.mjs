/**
 * Remove near-duplicate NEW plan topics (token-similarity, same audience).
 * Keeps the canonical set (original plan rows without a `cluster` field +
 * published articles) and drops any NEW (clustered) topic that is >=THRESH
 * similar to something already kept in the same audience.
 *
 * Run: node scripts/dedupe-jaccard.mjs [--thresh=0.6]
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const THRESH = parseFloat(process.argv.find(a => a.startsWith('--thresh='))?.split('=')[1] || '0.6')

const STOP = new Set('the a an to in of for and or your you how what is are with from on at as guide germany german de complete step by 2025 2026 explained real your a'.split(' '))
const words = t => new Set((t || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP.has(w)))
const jac = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1) }

async function main() {
  const plan = JSON.parse(fs.readFileSync('scripts/out/article-plan.json', 'utf8'))
  const existing = plan.filter(p => !p.cluster)   // canonical original plan
  const fresh = plan.filter(p => p.cluster)        // the 1200 new

  // kept word-sets per audience, seeded with canonical plan + published
  const kept = new Map()
  const seed = (aud, t) => { const l = kept.get(aud) || []; l.push(words(t)); kept.set(aud, l) }
  existing.forEach(p => seed(p.audience, p.title))
  const { data: pub } = await supabase.from('articles').select('title, translations')
  ;(pub || []).forEach(r => seed(r.translations?._meta?.audience || 'global', r.translations?.en?.title || r.title))

  const keepFresh = []
  let dropped = 0
  for (const p of fresh) {
    const ws = words(p.title)
    const list = kept.get(p.audience) || []
    let max = 0
    for (const k of list) { const s = jac(ws, k); if (s > max) max = s; if (max >= THRESH) break }
    if (max >= THRESH) { dropped++; continue }
    keepFresh.push(p); list.push(ws); kept.set(p.audience, list)
  }

  const g = keepFresh.filter(p => p.audience === 'global').length
  const c = keepFresh.length - g
  console.log(`Threshold ${THRESH}. New kept: ${keepFresh.length} (general ${g} / country ${c}); dropped ${dropped} near-dups`)
  const merged = [...existing, ...keepFresh]
  fs.writeFileSync('scripts/out/article-plan.json', JSON.stringify(merged, null, 2))
  console.log(`Plan: ${plan.length} → ${merged.length}`)
}
main().catch(e => { console.error(e); process.exit(1) })
