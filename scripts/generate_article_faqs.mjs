// scripts/generate_article_faqs.mjs
//
// Generates 4 FAQs per article in all 4 locales (ar, fr, en, de) and
// writes them to:
//   articles.faqs                       ← Arabic source (top-level)
//   articles.translations.fr.faqs       ← French
//   articles.translations.en.faqs       ← English
//   articles.translations.de.faqs       ← German
//
// FAQ shape in DB matches what FAQAccordion renders: [{q: string, a: string}].
//
// One Anthropic Sonnet call per article — model reads the Arabic source
// and emits all four locales at once for consistency. ~$3 in API costs
// for ~136 articles.
//
// Resume-safe: skips articles that already have a non-empty `faqs` array.
// Re-run after a crash and it picks up where it stopped.
//
// Run:
//   node scripts/generate_article_faqs.mjs               # only articles missing FAQs
//   node scripts/generate_article_faqs.mjs --force       # re-generate ALL (overwrites)
//   node scripts/generate_article_faqs.mjs --limit 10    # only do first 10 (testing)
//   node scripts/generate_article_faqs.mjs --dry         # don't write to DB

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(__dirname, '..')

// Load .env.local
try {
  const env = readFileSync(resolve(REPO, '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
} catch {}

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
if (!SUPABASE_URL || !SERVICE_KEY || !ANTHROPIC_KEY) {
  console.error('Missing env vars in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY')
  process.exit(1)
}

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const DRY   = args.includes('--dry')
const LIMIT_IDX = args.indexOf('--limit')
const LIMIT = LIMIT_IDX >= 0 ? Number(args[LIMIT_IDX + 1]) : null

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

// ── Anthropic ─────────────────────────────────────────────────────
const MODEL = 'claude-sonnet-4-6' // launch-quality FAQ copy

async function callClaude(systemPrompt, userPrompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3000,
      temperature: 0.4,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Anthropic ${res.status}: ${text.slice(0, 300)}`)
  }
  const json = await res.json()
  return json.content?.[0]?.text ?? ''
}

// Extract { ... } JSON object from model output even if it's wrapped
// in markdown / prose. Errors loudly if no object found.
function parseJsonLoose(text) {
  // Strip ```json ... ``` fences
  let cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*$/gm, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error(`No JSON in model output: ${text.slice(0, 200)}`)
  return JSON.parse(cleaned.slice(first, last + 1))
}

// ── FAQ generation prompt ─────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert content writer for a Moroccan-to-Germany migration platform (gogermany.ma). Your job is to read an article and generate genuinely useful FAQs that real Moroccan readers would search for and ask.

Rules for the questions:
- Each question must be something a real reader would actually type into Google. Practical, specific, action-oriented.
- Avoid generic "What is X?" filler. Prefer "How do I…", "How much does…", "Is it possible to…", "When should I…".
- Tied closely to the article's content — the reader should be able to find the answer there or in a clear extension of it.
- Each answer is 2–4 short sentences. Concrete, no fluff. If a number / deadline / form name appears in the source, include it.

Rules for translations:
- Generate the same 4 questions in all 4 languages: Arabic (ar), French (fr), English (en), German (de).
- Translations must be natural in each language — not literal. A French reader and an Arabic reader should each feel the FAQ was written for them.
- Keep brand/proper names consistent (Bundesagentur für Arbeit, Ausbildung, Anschreiben, etc. — German technical terms stay in German across all locales).
- Arabic must use Modern Standard Arabic, not Moroccan Darija.

Output STRICT JSON, no markdown fences, no commentary. Shape:
{
  "ar": [{"q": "…", "a": "…"}, {"q": "…", "a": "…"}, {"q": "…", "a": "…"}, {"q": "…", "a": "…"}],
  "fr": [{"q": "…", "a": "…"}, {"q": "…", "a": "…"}, {"q": "…", "a": "…"}, {"q": "…", "a": "…"}],
  "en": [{"q": "…", "a": "…"}, {"q": "…", "a": "…"}, {"q": "…", "a": "…"}, {"q": "…", "a": "…"}],
  "de": [{"q": "…", "a": "…"}, {"q": "…", "a": "…"}, {"q": "…", "a": "…"}, {"q": "…", "a": "…"}]
}

Exactly 4 FAQs per language. Same set of questions across all 4 languages, translated. q field is the question, a field is the answer.`

function buildUserPrompt(article) {
  return `Generate 4 FAQs for this article. The source is in Arabic (the platform's primary language).

Title: ${article.title}
Category: ${article.category || 'general'}

Content:
${article.content || article.summary || '(no body)'}`
}

function isValidFaqList(arr) {
  return Array.isArray(arr)
    && arr.length === 4
    && arr.every(f => f && typeof f.q === 'string' && typeof f.a === 'string'
                   && f.q.trim().length > 0 && f.a.trim().length > 0)
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log(`Mode: ${FORCE ? 'FORCE (overwrite all)' : 'incremental (skip articles with FAQs)'}${DRY ? ' · DRY RUN' : ''}${LIMIT ? ` · limit=${LIMIT}` : ''}`)

  let q = supabase
    .from('articles')
    .select('id, title, content, summary, category, faqs, translations')
    .order('id', { ascending: true })
  if (LIMIT) q = q.limit(LIMIT)
  const { data: rows, error } = await q
  if (error) {
    console.error('Failed to fetch articles:', error.message)
    process.exit(1)
  }
  if (!rows?.length) {
    console.log('No articles found.')
    return
  }

  const todo = FORCE ? rows : rows.filter(a => !Array.isArray(a.faqs) || a.faqs.length === 0)
  const skipped = rows.length - todo.length
  console.log(`Articles: ${rows.length} total, ${todo.length} need FAQs${skipped ? `, ${skipped} skipped (already have)` : ''}`)
  if (todo.length === 0) {
    console.log('Nothing to do.')
    return
  }

  let ok = 0, failed = 0
  for (let i = 0; i < todo.length; i++) {
    const a = todo[i]
    const tag = `[${i + 1}/${todo.length}]`
    process.stdout.write(`${tag} #${a.id} ${(a.title || '').slice(0, 60)}… `)

    try {
      const raw = await callClaude(SYSTEM_PROMPT, buildUserPrompt(a))
      const parsed = parseJsonLoose(raw)

      // Validate every locale
      for (const loc of ['ar', 'fr', 'en', 'de']) {
        if (!isValidFaqList(parsed[loc])) {
          throw new Error(`Invalid ${loc} FAQ list (need 4 items with q + a)`)
        }
      }

      // Merge into existing translations object so we don't clobber
      // the title/summary/content already there.
      const existing = a.translations && typeof a.translations === 'object' ? a.translations : {}
      const updatedTranslations = {
        ...existing,
        fr: { ...(existing.fr || {}), faqs: parsed.fr },
        en: { ...(existing.en || {}), faqs: parsed.en },
        de: { ...(existing.de || {}), faqs: parsed.de },
      }

      if (DRY) {
        console.log(`✓ (dry — ${parsed.ar[0].q.slice(0, 50)}…)`)
      } else {
        const { error: writeErr } = await supabase
          .from('articles')
          .update({ faqs: parsed.ar, translations: updatedTranslations })
          .eq('id', a.id)
        if (writeErr) throw new Error(`DB write failed: ${writeErr.message}`)
        console.log('✓')
      }
      ok++
    } catch (e) {
      failed++
      console.log(`✗ ${e.message}`)
    }

    // Light rate limit: 800ms between requests so we stay polite to the API.
    if (i < todo.length - 1) await new Promise(r => setTimeout(r, 800))
  }

  console.log(`\nDone. ${ok} succeeded, ${failed} failed.`)
}

main().catch(e => { console.error(e); process.exit(1) })
