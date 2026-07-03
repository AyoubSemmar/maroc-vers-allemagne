/**
 * Enforce the article locale policy (see memory article-locale-policy):
 *   - audience 'morocco' → keep only ar(base) + fr, en, de
 *   - audience 'global'  → all locales
 * For each article: deletes translations outside its target set, and
 * translates any missing target locale. Reads audience from
 * translations._meta.audience (default 'global' if unclassified).
 *
 * Run: node scripts/enforce-article-locales.mjs [--dry]
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const DRY = process.argv.includes('--dry')

const LANG_FULL = {
  fr: 'French (France, fr-FR)', en: 'English (en-GB)', de: 'German (Germany, de-DE)',
  es: 'Spanish (Spain, es-ES)', tr: 'Turkish (Turkey, tr-TR)', fa: 'Persian/Farsi (Iran, fa-IR)',
  pt: 'Portuguese (Brazil, pt-BR)', ru: 'Russian (Russia, ru-RU)', hi: 'Hindi (India, hi-IN)',
  ur: 'Urdu (Pakistan, ur-PK)', zh: 'Simplified Chinese (China, zh-CN)',
}
const ALL_NON_AR = Object.keys(LANG_FULL)
const MOROCCO_SET = ['fr', 'en', 'de']

function targetsFor(audience) {
  return audience === 'morocco' ? MOROCCO_SET : ALL_NON_AR
}

function parseJsonLoose(s) {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const a = cleaned.indexOf('{'), b = cleaned.lastIndexOf('}')
  if (a < 0 || b < 0) throw new Error('No JSON object found')
  return JSON.parse(cleaned.slice(a, b + 1))
}

async function translateArticle(langFull, lang, title, summary, content, faqs) {
  const prompt = `You are a senior editor for GoGermany. Translate the following Arabic article into ${langFull}. Translation must be natural for native speakers — not literal. Keep German proper nouns: Ausbildung, Anmeldung, BAföG, Krankenkasse, ZAB, IHK, Deutschlandticket, Steuer-ID. Preserve markdown formatting (## headings, lists, **bold**) exactly.

ARABIC SOURCE:
Title: ${title}
Summary: ${summary}
Content:
${content}
FAQs:
${(faqs || []).map((f, i) => `${i + 1}. Q: ${f.q}\n   A: ${f.a}`).join('\n')}

Return ONLY a JSON object:
{ "title": "...", "summary": "... (≤160 chars)", "content": "... markdown body", "faqs": [{"q":"...","a":"..."}] }`
  const resp = await client.messages.create({
    model: 'claude-haiku-4-5', max_tokens: 16000, temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  return parseJsonLoose(text)
}

async function pool(items, concurrency, worker) {
  let idx = 0
  const runNext = async () => { while (idx < items.length) { const i = idx++; await worker(items[i]) } }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runNext))
}

async function main() {
  const { data: articles, error } = await supabase
    .from('articles').select('id, title, summary, content, faqs, translations').order('date', { ascending: false })
  if (error) throw new Error(error.message)

  let removed = 0, translated = 0, failed = 0, mor = 0, glob = 0
  await pool(articles, 6, async (a) => {
    const tr = { ...(a.translations || {}) }
    const audience = tr._meta?.audience || 'global'
    audience === 'morocco' ? mor++ : glob++
    const targets = targetsFor(audience)
    let changed = false

    // 1. Remove translations outside the target set (keep _meta + base ar)
    for (const key of Object.keys(tr)) {
      if (key === '_meta') continue
      if (!targets.includes(key)) { delete tr[key]; removed++; changed = true }
    }

    // 2. Translate missing target locales
    for (const lang of targets) {
      if (tr[lang]?.title) continue
      if (DRY) { translated++; continue }
      try {
        tr[lang] = await translateArticle(LANG_FULL[lang], lang, a.title, a.summary, a.content, a.faqs)
        translated++; changed = true
        process.stdout.write(`\r  removed ${removed}  translated ${translated}  failed ${failed}     `)
      } catch (e) { failed++ }
    }

    if (changed && !DRY) {
      const { error: e } = await supabase.from('articles').update({ translations: tr }).eq('id', a.id)
      if (e) console.log(`\n  ✗ save ${a.id}: ${e.message}`)
    }
  })

  console.log(`\n\nArticles: ${articles.length} (morocco ${mor} / global ${glob})`)
  console.log(`Removed off-policy translations: ${removed}`)
  console.log(`Translated missing locales: ${translated}${DRY ? ' (dry-run, not saved)' : ''}`)
  console.log(`Failed: ${failed}`)
}

main().catch(e => { console.error(e); process.exit(1) })
