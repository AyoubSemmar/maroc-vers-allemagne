/**
 * A/B the English-draft model: generate the same topics on two models and
 * compare quality + cost. Does NOT insert into Supabase, generate images, or
 * touch generated-articles.json — pure dry run.
 *
 * Run: node scripts/ab-draft.mjs [--count=2] [--models=claude-sonnet-4-6,claude-opus-4-8]
 * Full drafts are written to scripts/out/ab/<model>__<slug>.json for eyeballing.
 */
import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

const args = process.argv.slice(2)
const COUNT = parseInt(args.find(a => a.startsWith('--count='))?.split('=')[1] || '2', 10)
const MODELS = (args.find(a => a.startsWith('--models='))?.split('=')[1] || 'claude-sonnet-4-6,claude-opus-4-8').split(',')
const EFFORT = args.find(a => a.startsWith('--effort='))?.split('=')[1] || 'high'

// $/M tokens (input, output). Thinking bills as output.
const PRICE = {
  'claude-opus-4-8': [5, 25],
  'claude-sonnet-4-6': [3, 15],
  'claude-haiku-4-5': [1, 5],
}

const anthropic = new Anthropic({ apiKey: process.env.ARTICLE_GEN_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY })

// ── copied verbatim from generate-articles-run.mjs (keep in sync) ──
const SYS_GEN = `You are an expert SEO content writer for GoGermany, a platform helping people move to Germany.
Produce ONE complete article in ENGLISH:
Length 1200–1800 words. An engaging 3-sentence intro; 4–7 ## H2 sections; ### H3 where useful; bullet lists for steps/costs/documents; real € amounts, real website/office names, real city examples; a "Common mistakes" section near the end; a conclusion with a soft CTA. Use the main keyword in the title, intro, and one H2. Natural semantic keywords, no stuffing. Clear human 2nd-person tone. Keep German terms (Ausbildung, Anmeldung, Sperrkonto, etc.) untranslated.
Return ONLY a valid JSON object (no markdown fences, no text before/after):
{"title":"...","summary":"meta description ≤155 chars","content":"full markdown body with ## H2 and ### H3","faqs":[{"q":"question","a":"answer"}]}
The "faqs" array MUST contain EXACTLY 5 concrete, useful question/answer pairs that real readers ask about this topic.`

function parseJsonLoose(s) {
  const c = s.replace(/```json\s*|\s*```/g, '').trim()
  const a = c.indexOf('{'), b = c.lastIndexOf('}')
  if (a < 0 || b < 0) throw new Error('no JSON object')
  return JSON.parse(c.slice(a, b + 1))
}
function normFaqs(faqs) {
  return Array.isArray(faqs)
    ? faqs.map(f => ({ q: String(f.q ?? f.question ?? '').trim(), a: String(f.a ?? f.answer ?? '').trim() })).filter(f => f.q && f.a)
    : []
}

async function genEnglish(model, topic) {
  const user = `Title to write: "${topic.title}"\nPrimary keyword: ${topic.keyword}\nCategory: ${topic.category}\nAngle: ${topic.brief}\n\nWrite the full English article to the SEO spec as the JSON object.`
  const t0 = Date.now()
  const stream = await anthropic.messages.stream({
    model, max_tokens: 16000,
    thinking: { type: 'adaptive' }, output_config: { effort: EFFORT },
    system: SYS_GEN, messages: [{ role: 'user', content: user }],
  })
  const msg = await stream.finalMessage()
  const ms = Date.now() - t0
  const text = msg.content.map(c => c.type === 'text' ? c.text : '').join('')
  if (process.env.AB_DEBUG) {
    fs.mkdirSync('scripts/out/ab', { recursive: true })
    fs.writeFileSync(`scripts/out/ab/_raw_${model}__${topic.slug}.txt`, `stop_reason=${msg.stop_reason}\nblocks=${msg.content.map(c => c.type).join(',')}\ntext_len=${text.length}\n\n${text}`)
  }
  const obj = parseJsonLoose(text)
  obj.faqs = normFaqs(obj.faqs)
  return { obj, usage: msg.usage, ms }
}

const plan = JSON.parse(fs.readFileSync('scripts/out/article-plan.json', 'utf8'))
const topics = plan.slice(0, COUNT)
const outDir = 'scripts/out/ab'
fs.mkdirSync(outDir, { recursive: true })

const totals = {}
console.log(`A/B over ${topics.length} topic(s): ${MODELS.join(' vs ')}  (effort=${EFFORT})\n`)

for (const topic of topics) {
  console.log(`\n══ ${topic.slug}`)
  console.log(`   "${topic.title}"`)
  for (const model of MODELS) {
    try {
      const { obj, usage, ms } = await genEnglish(model, topic)
      const words = (obj.content || '').split(/\s+/).filter(Boolean).length
      const h2 = (obj.content.match(/^##\s/gm) || []).length
      const inTok = usage.input_tokens
      const outTok = usage.output_tokens // includes thinking
      const [pi, po] = PRICE[model] || [0, 0]
      const cost = (inTok * pi + outTok * po) / 1e6
      totals[model] = totals[model] || { cost: 0, out: 0, n: 0 }
      totals[model].cost += cost; totals[model].out += outTok; totals[model].n++
      console.log(`   ${model.padEnd(20)} ${words}w  ${h2}×H2  ${obj.faqs.length} FAQs  | in ${inTok} out ${outTok} tok  $${cost.toFixed(3)}  ${(ms / 1000).toFixed(0)}s`)
      fs.writeFileSync(path.join(outDir, `${model}__${topic.slug}.json`), JSON.stringify(obj, null, 2))
    } catch (e) {
      console.log(`   ${model.padEnd(20)} ✗ ${e.message}`)
    }
  }
}

console.log(`\n── totals (${topics.length} drafts each) ──`)
for (const [m, t] of Object.entries(totals)) {
  console.log(`   ${m.padEnd(20)} $${t.cost.toFixed(3)}  (avg ${Math.round(t.out / t.n)} out tok/draft)`)
}
const ms2 = Object.keys(totals)
if (ms2.length === 2 && totals[ms2[0]] && totals[ms2[1]]) {
  const [a, b] = ms2
  const pct = ((1 - totals[a].cost / totals[b].cost) * 100)
  console.log(`\n   ${a} is ${pct.toFixed(0)}% ${pct >= 0 ? 'cheaper' : 'pricier'} than ${b} on this sample.`)
}
console.log(`\nFull drafts written to ${outDir}/ — open them to compare quality.`)
