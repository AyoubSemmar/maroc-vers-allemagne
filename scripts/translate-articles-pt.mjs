/**
 * One-off script: add Turkish translations to all existing articles in Supabase.
 * Run: node scripts/translate-articles-tr.mjs
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const LANG = 'pt'
const LANG_FULL = 'Portuguese (Brazil, pt-BR)'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function parseJsonLoose(s) {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function translateArticle(title, summary, content, faqs) {
  const prompt = `You are a senior editor for GoGermany. Translate the following Arabic article into ${LANG_FULL}. Translation must be natural for native speakers â€” not literal. Keep German proper nouns: Ausbildung, Anmeldung, BAfÃ¶G, Krankenkasse, ZAB, IHK, Deutschlandticket, Steuer-ID. Preserve markdown formatting (## headings, lists, **bold**) exactly.

ARABIC SOURCE:
Title: ${title}
Summary: ${summary}
Content:
${content}
FAQs:
${(faqs || []).map((f, i) => `${i + 1}. Q: ${f.q}\n   A: ${f.a}`).join('\n')}

Return ONLY a JSON object:
{
  "title": "${LANG} title",
  "summary": "${LANG} summary (â‰¤160 chars)",
  "content": "${LANG} markdown body",
  "faqs": [{"q":"...","a":"..."}, ...]
}`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 5000,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  return parseJsonLoose(text)
}

async function main() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, summary, content, faqs, translations')
    .order('date', { ascending: false })

  if (error) throw new Error(`Supabase fetch failed: ${error.message}`)
  console.log(`Found ${articles.length} articles`)

  let done = 0, skipped = 0, failed = 0

  for (const article of articles) {
    if (article.translations?.[LANG]?.title) {
      skipped++
      continue
    }

    process.stdout.write(`[${done + skipped + failed + 1}/${articles.length}] ${article.title?.slice(0, 50)}... `)

    try {
      const translated = await translateArticle(
        article.title, article.summary, article.content, article.faqs,
      )

      const { error: updateError } = await supabase
        .from('articles')
        .update({ translations: { ...(article.translations || {}), [LANG]: translated } })
        .eq('id', article.id)

      if (updateError) throw new Error(updateError.message)

      done++
      console.log('âœ“')
      await new Promise(r => setTimeout(r, 1200))
    } catch (e) {
      failed++
      console.log(`âœ— ${e.message}`)
    }
  }

  console.log(`\nDone: ${done} translated, ${skipped} skipped (already had ${LANG}), ${failed} failed`)
}

main().catch(e => { console.error(e); process.exit(1) })


