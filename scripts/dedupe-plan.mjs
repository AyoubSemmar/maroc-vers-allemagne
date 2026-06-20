/**
 * De-duplicate scripts/out/article-plan.json: drop topics that are TRUE
 * duplicates of each other or of an already-published article, while KEEPING
 * country/language-specific variants (those are intentional, different audiences).
 *
 * Uses Opus 4.8 to judge. Writes a backup (article-plan.backup.json) and the
 * pruned plan. Run: node scripts/dedupe-plan.mjs [--apply]
 *   (without --apply it only reports; with --apply it rewrites the plan)
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
const APPLY = process.argv.includes('--apply')
const anthropic = new Anthropic({ apiKey: process.env.ARTICLE_GEN_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const plan = JSON.parse(fs.readFileSync('scripts/out/article-plan.json', 'utf8'))

function parseJsonLoose(s) {
  const c = s.replace(/```json\s*|\s*```/g, '').trim()
  const a = c.indexOf('['); const b = c.lastIndexOf(']')
  if (a < 0 || b < 0) throw new Error('no JSON array')
  return JSON.parse(c.slice(a, b + 1))
}

async function main() {
  // Already-published titles (so we drop plan topics that re-do them).
  const { data: pub } = await supabase.from('articles').select('title, translations')
  const published = (pub || []).map(r => r.translations?.en?.title || r.title).filter(Boolean)

  const planList = plan.map((p, i) => `${i} | ${p.audience} | ${p.category} | ${p.title}`).join('\n')
  const pubList = published.map(t => `- ${t}`).join('\n')

  const prompt = `You are auditing a content plan for duplicate articles. Below are PLANNED topics (index | audience | category | title) and ALREADY-PUBLISHED titles.

Return the indexes of PLANNED topics to DROP because they are TRUE duplicates — they would cover essentially the same content as another planned topic OR an already-published one.

CRITICAL rules:
- Country/language-specific variants are NOT duplicates. Keep them. e.g. "Convert Indian Licence" vs "Convert Pakistani Licence", "Send money to Iran" vs "to Russia", "Russian-speaking doctors" vs "Spanish-speaking doctors", "Chancenkarte for Indians" vs "for Brazilians" — all DIFFERENT audiences, KEEP ALL.
- Only drop genuine same-topic, same-audience overlaps (e.g. two general "Sperrkonto/blocked account" guides; a planned global topic that re-does an already-published global one).
- When two planned topics duplicate, keep the clearer/more specific one and drop the other.
- Prefer dropping a PLANNED topic that duplicates an ALREADY-PUBLISHED one (don't redo published work).

PLANNED TOPICS:
${planList}

ALREADY-PUBLISHED TITLES:
${pubList}

Return ONLY a JSON array of objects for topics to DROP: [{"index": N, "reason": "duplicate of #M / of published 'X'"}]. If none, return [].`

  const stream = await anthropic.messages.stream({
    model: 'claude-opus-4-8', max_tokens: 8000,
    thinking: { type: 'adaptive' }, output_config: { effort: 'high' },
    messages: [{ role: 'user', content: prompt }],
  })
  const msg = await stream.finalMessage()
  const drops = parseJsonLoose(msg.content.map(c => c.type === 'text' ? c.text : '').join(''))

  console.log(`Dropping ${drops.length} duplicate topics:\n`)
  const dropIdx = new Set()
  for (const d of drops) {
    if (typeof d.index !== 'number' || !plan[d.index]) continue
    dropIdx.add(d.index)
    console.log(`  [${plan[d.index].audience}] ${plan[d.index].title}`)
    console.log(`      ↳ ${d.reason}`)
  }

  if (APPLY) {
    fs.writeFileSync('scripts/out/article-plan.backup.json', JSON.stringify(plan, null, 2))
    const pruned = plan.filter((_, i) => !dropIdx.has(i))
    fs.writeFileSync('scripts/out/article-plan.json', JSON.stringify(pruned, null, 2))
    console.log(`\nApplied: ${plan.length} → ${pruned.length} topics (backup at article-plan.backup.json)`)
  } else {
    console.log(`\nDry run. Re-run with --apply to prune ${dropIdx.size} of ${plan.length} topics.`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
