/**
 * Backfill 5 {q,a} FAQs (in every locale the article supports) for articles
 * that are missing them or have them in the wrong shape. Generates English
 * FAQs from the article body, then translates into each locale.
 *
 * Run: node scripts/backfill-faqs.mjs            (ids 142-154)
 *      node scripts/backfill-faqs.mjs 142 143
 *      node scripts/backfill-faqs.mjs --all       (any article with <4 base faqs)
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
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const ai = new Anthropic({ apiKey: process.env.ARTICLE_GEN_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY })

const LANG = { ar: 'Arabic', fr: 'French', de: 'German', es: 'Spanish', tr: 'Turkish', fa: 'Persian/Farsi', pt: 'Portuguese', ru: 'Russian', hi: 'Hindi', ur: 'Urdu', nl: 'Dutch' }
const args = process.argv.slice(2)
const ALLMODE = args.includes('--all')
let ids = args.filter(a => /^\d+$/.test(a)).map(Number)
if (!ids.length && !ALLMODE) for (let i = 142; i <= 154; i++) ids.push(i)

function parse(s) { const c = s.replace(/```json\s*|\s*```/g, '').trim(); const a = c.indexOf('{'), b = c.lastIndexOf('}'); if (a < 0) { const x = c.indexOf('['), y = c.lastIndexOf(']'); return JSON.parse(c.slice(x, y + 1)) } return JSON.parse(c.slice(a, b + 1)) }
const norm = f => Array.isArray(f) ? f.map(x => ({ q: String(x.q ?? x.question ?? '').trim(), a: String(x.a ?? x.answer ?? '').trim() })).filter(x => x.q && x.a) : []

async function genFaqs(title, content) {
  const r = await ai.messages.create({ model: 'claude-haiku-4-5', max_tokens: 2000, temperature: 0.4, messages: [{ role: 'user', content: `Write exactly 5 useful FAQ question/answer pairs that real readers would ask about this article. Concrete, specific answers (2-4 sentences).\n\nTitle: ${title}\n\nArticle:\n${(content || '').slice(0, 6000)}\n\nReturn ONLY JSON: [{"q":"...","a":"..."}]` }] })
  return norm(parse(r.content.map(c => c.type === 'text' ? c.text : '').join('')))
}
async function transFaqs(faqs, locale) {
  const r = await ai.messages.create({ model: 'claude-haiku-4-5', max_tokens: DENSE(locale) ? 4000 : 2500, temperature: 0.3, messages: [{ role: 'user', content: `Translate these FAQ pairs into ${LANG[locale]}. Keep German proper nouns. Return ONLY the same JSON array shape [{"q","a"}]:\n${JSON.stringify(faqs)}` }] })
  return norm(parse(r.content.map(c => c.type === 'text' ? c.text : '').join('')))
}
const DENSE = l => ['ar', 'fa', 'hi', 'ur'].includes(l)

async function main() {
  let rows
  if (ALLMODE) rows = (await sb.from('articles').select('id,title,content,faqs,translations')).data.filter(r => norm(r.faqs).length < 4)
  else rows = (await sb.from('articles').select('id,title,content,faqs,translations').in('id', ids)).data
  console.log(`Backfilling FAQs for ${rows.length} articles`)
  let done = 0, fail = 0
  for (const r of rows.sort((a, b) => a.id - b.id)) {
    process.stdout.write(`  id ${r.id}: `)
    try {
      const tr = r.translations || {}
      const locales = tr._meta?.locales || ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'nl']
      const baseLang = locales.includes('ar') ? 'ar' : 'en'
      const enTitle = tr.en?.title || r.title
      const enContent = tr.en?.content || (baseLang === 'en' ? r.content : tr.de?.content || r.content)
      const enFaqs = await genFaqs(enTitle, enContent)
      if (enFaqs.length < 3) throw new Error('gen produced <3')
      let baseFaqs = r.faqs
      for (const loc of locales) {
        const f = loc === 'en' ? enFaqs : await transFaqs(enFaqs, loc)
        if (loc === baseLang) baseFaqs = f
        else { tr[loc] = { ...(tr[loc] || {}), faqs: f } }
      }
      await sb.from('articles').update({ faqs: baseFaqs, translations: tr }).eq('id', r.id)
      done++; console.log(`✓ (${enFaqs.length} faqs × ${locales.length} locales)`)
    } catch (e) { fail++; console.log(`✗ ${e.message}`) }
  }
  console.log(`\nDone: ${done} fixed, ${fail} failed`)
}
main().catch(e => { console.error(e); process.exit(1) })
