/**
 * One-off script: add Spanish translations to all existing articles in Supabase.
 *
 * For each article that has Arabic content but no `es` translation,
 * calls Claude to translate title/summary/content/faqs to Spanish,
 * then UPDATES the `translations` JSONB column in place.
 *
 * Run:  node scripts/translate-articles-es.mjs
 * Needs: ANTHROPIC_API_KEY and NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *        Copy them from .env.local first:
 *          node -e "require('dotenv').config({path:'.env.local'})" scripts/translate-articles-es.mjs
 *        OR: set them inline:
 *          ANTHROPIC_API_KEY=... NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/translate-articles-es.mjs
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

// Load .env.local if it exists
const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] ??= m[2].trim().replace(/^["']|["']$/g, '')
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
  const prompt = `You are a senior editor for GoGermany. Translate the following Arabic article into Spanish (Spain, es-ES). Translation must be natural for native speakers — not literal. Keep German proper nouns: Ausbildung, Anmeldung, BAföG, Krankenkasse, ZAB, IHK, Deutschlandticket, Steuer-ID. Preserve markdown formatting (## headings, lists, **bold**) exactly.

ARABIC SOURCE:
Title: ${title}
Summary: ${summary}
Content:
${content}
FAQs:
${(faqs || []).map((f, i) => `${i + 1}. Q: ${f.q}\n   A: ${f.a}`).join('\n')}

Return ONLY a JSON object:
{
  "title": "Spanish title",
  "summary": "Spanish summary (≤160 chars)",
  "content": "Spanish markdown body",
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
  // Fetch all articles
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, summary, content, faqs, translations')
    .order('date', { ascending: false })

  if (error) throw new Error(`Supabase fetch failed: ${error.message}`)
  console.log(`Found ${articles.length} articles`)

  let done = 0, skipped = 0, failed = 0

  for (const article of articles) {
    // Skip if already has Spanish translation
    if (article.translations?.es?.title) {
      skipped++
      continue
    }

    process.stdout.write(`[${done + skipped + failed + 1}/${articles.length}] ${article.title?.slice(0, 50)}... `)

    try {
      const es = await translateArticle(
        article.title,
        article.summary,
        article.content,
        article.faqs,
      )

      // Merge into existing translations object
      const updatedTranslations = {
        ...(article.translations || {}),
        es,
      }

      const { error: updateError } = await supabase
        .from('articles')
        .update({ translations: updatedTranslations })
        .eq('id', article.id)

      if (updateError) throw new Error(updateError.message)

      done++
      console.log('✓')
      // Rate limit: 1 call per second
      await new Promise(r => setTimeout(r, 1200))
    } catch (e) {
      failed++
      console.log(`✗ ${e.message}`)
    }
  }

  console.log(`\nDone: ${done} translated, ${skipped} skipped (already had es), ${failed} failed`)
}

main().catch(e => { console.error(e); process.exit(1) })
