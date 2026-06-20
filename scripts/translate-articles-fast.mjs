/**
 * Fast, concurrent article translator.
 * Translates all articles into one or more target locales using a
 * concurrency pool (default 6) instead of a sequential one-at-a-time loop.
 *
 * Usage:
 *   node scripts/translate-articles-fast.mjs tr fa pt hi ur nl
 *   node scripts/translate-articles-fast.mjs hi --concurrency=8
 *
 * Idempotent: skips any article that already has translations.<lang>.title.
 * Retries each article once on a JSON parse / truncation failure.
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

const LANG_FULL = {
  fr: 'French (France, fr-FR)',
  de: 'German (Germany, de-DE)',
  es: 'Spanish (Spain, es-ES)',
  tr: 'Turkish (Turkey, tr-TR)',
  fa: 'Persian/Farsi (Iran, fa-IR)',
  pt: 'Portuguese (Brazil, pt-BR)',
  ru: 'Russian (Russia, ru-RU)',
  hi: 'Hindi (India, hi-IN)',
  ur: 'Urdu (Pakistan, ur-PK)',
  nl: 'Dutch (Netherlands, nl-NL)',
}

const args = process.argv.slice(2)
const concArg = args.find(a => a.startsWith('--concurrency='))
const CONCURRENCY = concArg ? parseInt(concArg.split('=')[1], 10) : 6
const LANGS = args.filter(a => !a.startsWith('--'))
if (LANGS.length === 0) {
  console.error('Usage: node scripts/translate-articles-fast.mjs <lang...> [--concurrency=N]')
  process.exit(1)
}
for (const l of LANGS) {
  if (!LANG_FULL[l]) { console.error(`Unknown locale: ${l}`); process.exit(1) }
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

async function translateArticle(lang, title, summary, content, faqs) {
  const langFull = LANG_FULL[lang]
  const prompt = `You are a senior editor for GoGermany. Translate the following Arabic article into ${langFull}. Translation must be natural for native speakers — not literal. Keep German proper nouns: Ausbildung, Anmeldung, BAföG, Krankenkasse, ZAB, IHK, Deutschlandticket, Steuer-ID. Preserve markdown formatting (## headings, lists, **bold**) exactly.

ARABIC SOURCE:
Title: ${title}
Summary: ${summary}
Content:
${content}
FAQs:
${(faqs || []).map((f, i) => `${i + 1}. Q: ${f.q}\n   A: ${f.a}`).join('\n')}

Return ONLY a JSON object:
{
  "title": "${lang} title",
  "summary": "${lang} summary (≤160 chars)",
  "content": "${lang} markdown body",
  "faqs": [{"q":"...","a":"..."}, ...]
}`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 8000,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  return parseJsonLoose(text)
}

/** Run an async worker over items with a fixed concurrency pool. */
async function pool(items, concurrency, worker) {
  let idx = 0
  const runNext = async () => {
    while (idx < items.length) {
      const i = idx++
      await worker(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runNext))
}

async function translateLang(lang) {
  const langFull = LANG_FULL[lang]
  console.log(`\n══ ${lang} (${langFull}) ══`)

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, summary, content, faqs, translations')
    .order('date', { ascending: false })
  if (error) throw new Error(`Supabase fetch failed: ${error.message}`)

  const todo = articles.filter(a => !a.translations?.[lang]?.title)
  console.log(`${articles.length} total · ${articles.length - todo.length} already done · ${todo.length} to translate · concurrency ${CONCURRENCY}`)

  let done = 0, failed = 0
  const failures = []

  await pool(todo, CONCURRENCY, async (article) => {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const translated = await translateArticle(lang, article.title, article.summary, article.content, article.faqs)
        const { error: upErr } = await supabase
          .from('articles')
          .update({ translations: { ...(article.translations || {}), [lang]: translated } })
          .eq('id', article.id)
        if (upErr) throw new Error(upErr.message)
        done++
        process.stdout.write(`\r  ✓ ${done}  ✗ ${failed}   `)
        return
      } catch (e) {
        if (attempt === 2) {
          failed++
          failures.push({ id: article.id, title: article.title?.slice(0, 50), err: e.message })
          process.stdout.write(`\r  ✓ ${done}  ✗ ${failed}   `)
        }
      }
    }
  })

  console.log(`\n  Done: ${done} translated, ${failed} failed`)
  if (failures.length) {
    console.log('  Failed articles:')
    for (const f of failures) console.log(`    - ${f.id}: ${f.title}… (${f.err})`)
  }
}

async function main() {
  for (const lang of LANGS) {
    await translateLang(lang)
  }
  console.log('\n✅ All locales complete.')
}

main().catch(e => { console.error(e); process.exit(1) })
