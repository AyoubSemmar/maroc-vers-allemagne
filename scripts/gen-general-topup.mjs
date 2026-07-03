/**
 * Top up the GENERAL (global) new topics to a target count with genuinely
 * fresh, long-tail angles. Shows the model the existing global titles in each
 * cluster's category so it avoids re-covering them; dedupes exact + by token
 * similarity. Appends to scripts/out/article-plan.json.
 *
 * Run: node scripts/gen-general-topup.mjs [--target=700]
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const anthropic = new Anthropic({ apiKey: process.env.ARTICLE_GEN_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const ALL = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh']
const TARGET = parseInt(process.argv.find(a => a.startsWith('--target='))?.split('=')[1] || '700', 10)
const STOP = new Set('the a an to in of for and or your you how what is are with from on at as guide germany german de complete step by 2025 2026 explained real'.split(' '))
const words = t => new Set((t || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP.has(w)))
const jac = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1) }
const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
const slugify = s => `g-${norm(s).replace(/\s+/g, '-')}`.slice(0, 80)

const CLUSTERS = [
  ['banking', 'money, banking, taxes & insurance in Germany — including specific bank/insurer product reviews and head-to-head comparisons, investing, freelance finance, niche fees and edge cases'],
  ['daily-life', 'high-traffic problem/emotional questions and everyday-life specifics expats Google about Germany (frustrations, delays, rejections, loneliness, winter, mental health, regrets, small daily annoyances and hacks)'],
  ['housing', 'renting & housing specifics in Germany beyond the basics (niche tenant situations, contract clauses, disputes, energy, smart-home, moving logistics, neighbour issues)'],
  ['jobs', 'working in Germany: niche career situations, workplace rights, contracts, switching jobs, promotions, freelancing, side jobs, industry-specific advice'],
  ['healthcare', 'German healthcare specifics and less-common situations (specialists, dental, mental health, chronic conditions, pregnancy, kids, insurance edge cases)'],
  ['bureaucracy', 'German bureaucracy & official procedures — the long tail of specific forms, offices, appointments, appeals and edge cases newcomers hit'],
  ['language', 'learning German & passing exams — specific levels, exam tactics, study methods, common grammar pain points, course types'],
  ['culture', 'German culture, social life, food, traditions, etiquette, dating, friendship and regional differences'],
  ['driving-transport', 'transport, driving and cars in Germany — tickets, trains, licences, buying/owning/insuring a car, cycling, regional travel'],
  ['daily-life', 'shopping & consumer life in Germany — specific stores, product categories, deals, comparisons, second-hand, online shopping'],
]

function parseJsonLoose(s) { const c = s.replace(/```json\s*|\s*```/g, '').trim(); const a = c.indexOf('['), b = c.lastIndexOf(']'); if (a < 0 || b < 0) throw new Error('no array'); return JSON.parse(c.slice(a, b + 1)) }

async function main() {
  const plan = JSON.parse(fs.readFileSync('scripts/out/article-plan.json', 'utf8'))
  const curGeneralNew = plan.filter(p => p.cluster && p.audience === 'global')
  let need = TARGET - curGeneralNew.length
  console.log(`Current new general: ${curGeneralNew.length}, target ${TARGET}, need ${need}`)
  if (need <= 0) { console.log('Already at target.'); return }

  // canonical global title set (plan globals + published globals) for dedup + avoid-list
  const globalTitles = plan.filter(p => p.audience === 'global').map(p => p.title)
  const { data: pub } = await supabase.from('articles').select('title, translations')
  ;(pub || []).forEach(r => { if ((r.translations?._meta?.audience || 'global') === 'global') globalTitles.push(r.translations?.en?.title || r.title) })
  const keptWS = globalTitles.map(words)
  const exact = new Set(globalTitles.map(norm))
  const titlesByCat = {}
  for (const p of plan) if (p.audience === 'global') (titlesByCat[p.category] = titlesByCat[p.category] || []).push(p.title)

  const added = []
  let round = 0
  while (need > 0 && round < 14) {
    const [cat, desc] = CLUSTERS[round % CLUSTERS.length]
    const avoid = (titlesByCat[cat] || []).slice(-120)
    const ask = Math.min(40, need + 10)
    process.stdout.write(`  round ${round + 1} [${cat}] need ${need}... `)
    try {
      const prompt = `Propose ${ask} FRESH, specific, long-tail SEO article topics for GoGermany about: ${desc}.
These must NOT overlap with already-covered titles below — pick different, more specific angles, sub-topics, comparisons, and edge cases.
ALREADY COVERED (do not repeat or lightly reword):
${avoid.join('\n')}

Each: {"title","keyword"}. Specific, concrete, distinct. Return ONLY a JSON array.`
      const stream = await anthropic.messages.stream({ model: 'claude-opus-4-8', max_tokens: 16000, thinking: { type: 'adaptive' }, output_config: { effort: 'high' }, messages: [{ role: 'user', content: prompt }] })
      const msg = await stream.finalMessage()
      const list = parseJsonLoose(msg.content.map(c => c.type === 'text' ? c.text : '').join(''))
      let got = 0
      for (const t of list) {
        if (need <= 0) break
        if (!t?.title) continue
        const k = norm(t.title); if (exact.has(k)) continue
        const ws = words(t.title)
        let dup = false; for (const w of keptWS) { if (jac(ws, w) >= 0.6) { dup = true; break } }
        if (dup) continue
        exact.add(k); keptWS.push(ws); (titlesByCat[cat] = titlesByCat[cat] || []).push(t.title)
        added.push({ slug: slugify(t.title), title: t.title.trim(), keyword: (t.keyword || t.title).trim(), category: cat, audience: 'global', country: null, locales: ALL, cluster: 'ai-general' })
        got++; need--
      }
      console.log(`+${got} (remaining ${need})`)
    } catch (e) { console.log(`✗ ${e.message}`) }
    round++
  }

  const merged = [...plan, ...added]
  fs.writeFileSync('scripts/out/article-plan.json', JSON.stringify(merged, null, 2))
  console.log(`\nAdded ${added.length}. Plan: ${plan.length} → ${merged.length}`)
}
main().catch(e => { console.error(e); process.exit(1) })
