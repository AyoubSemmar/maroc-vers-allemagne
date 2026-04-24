// Backfill: translate every row in `articles` from Arabic (source) into
// fr / en / de, and store the result in the `translations` JSONB column.
//
// Usage:
//   1) Run the migration first: scripts/sql/articles_i18n.sql
//   2) Ensure env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
//   3) node scripts/translate_articles.mjs              # translates missing locales for every row
//      node scripts/translate_articles.mjs --force      # re-translate even if already present
//      node scripts/translate_articles.mjs --id 42      # only one article
//      node scripts/translate_articles.mjs --locales en,de
//
// The script is idempotent: by default it skips (row, locale) pairs that
// already have a non-empty `title` in translations[locale].

import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

// Minimal .env.local loader (no dotenv dep required)
try {
  const envFile = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  for (const line of envFile.split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (!m) continue
    if (process.env[m[1]]) continue
    let v = m[2]
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    process.env[m[1]] = v
  }
} catch {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.')
  process.exit(1)
}
if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY in env.')
  process.exit(1)
}

const args = process.argv.slice(2)
const FORCE   = args.includes('--force')
const ONLY_ID = (() => { const i = args.indexOf('--id'); return i >= 0 ? Number(args[i+1]) : null })()
const LOCALES = (() => {
  const i = args.indexOf('--locales')
  if (i < 0) return ['fr', 'en', 'de']
  return String(args[i+1]).split(',').map(s => s.trim()).filter(Boolean)
})()

const LOCALE_NAME = { fr: 'French', en: 'English', de: 'German' }

const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })
const client = new Anthropic({ apiKey: ANTHROPIC_KEY })

const SYSTEM = `You are a professional translator. You translate Moroccan-context guidance articles (about moving from Morocco to Germany: banking, visas, universities, work, Ausbildung, SIM cards, housing, etc.) from Arabic into the target language.

Rules:
- Preserve HTML markup, markdown, line breaks, and placeholders exactly.
- Preserve proper nouns, institution names, URLs, email addresses, prices with currencies, and numbers.
- Keep German official/administrative terms in German when the source does (e.g. Ausbildung, Anmeldung, Bürgeramt, Sperrkonto).
- Natural, idiomatic tone aimed at a young adult Moroccan reader — not overly formal.
- Output JSON ONLY, matching the schema provided. No commentary.`

async function translateOne(row, locale) {
  const payload = {
    title:   row.title ?? '',
    summary: row.summary ?? '',
    content: row.content ?? '',
    faqs: Array.isArray(row.faqs) ? row.faqs : [],
  }

  const prompt = `Translate the following article from Arabic into ${LOCALE_NAME[locale]}.
Return JSON with this exact shape:
{
  "title": string,
  "summary": string,
  "content": string,
  "faqs": [{ "question": string, "answer": string }, ...]
}

The "faqs" array must have the same length and order as the input. If an input FAQ has extra keys, mirror them but translate their string values.

Source (Arabic):
${JSON.stringify(payload, null, 2)}`

  async function ask(extraInstruction = '') {
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 8000,
      system: SYSTEM,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt + extraInstruction }] }],
    })
    const text = resp.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim()
    // Extract outermost {...} in case of stray prose or fences
    const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
    const first = stripped.indexOf('{')
    const last  = stripped.lastIndexOf('}')
    return first >= 0 && last > first ? stripped.slice(first, last + 1) : stripped
  }

  let parsed
  try {
    parsed = JSON.parse(await ask())
  } catch {
    // Retry once with stricter escaping instruction
    const repaired = await ask('\n\nCRITICAL: your previous response had invalid JSON. Every " inside a string value MUST be escaped as \\". Every newline inside a string value MUST be \\n. Return pure valid JSON only.')
    parsed = JSON.parse(repaired)
  }

  // Preserve extra faq keys from source if model dropped any
  if (Array.isArray(payload.faqs) && Array.isArray(parsed.faqs)) {
    parsed.faqs = parsed.faqs.map((f, i) => ({ ...(payload.faqs[i] || {}), ...f }))
  }
  return parsed
}

async function main() {
  let query = sb.from('articles').select('id, title, summary, content, faqs, translations')
  if (ONLY_ID) query = query.eq('id', ONLY_ID)
  const { data: rows, error } = await query
  if (error) throw error

  console.log(`Found ${rows.length} article(s). Locales: ${LOCALES.join(', ')}. Force: ${FORCE}`)

  for (const row of rows) {
    const current = (row.translations && typeof row.translations === 'object') ? row.translations : {}
    const updated = { ...current }
    let changed = false

    for (const loc of LOCALES) {
      const existing = current[loc]
      const hasTitle = existing && typeof existing.title === 'string' && existing.title.trim().length > 0
      if (hasTitle && !FORCE) {
        console.log(`  [${row.id}] ${loc}: skip (already present)`)
        continue
      }
      try {
        console.log(`  [${row.id}] ${loc}: translating...`)
        const tr = await translateOne(row, loc)
        updated[loc] = tr
        changed = true
      } catch (e) {
        console.error(`  [${row.id}] ${loc}: FAILED`, e.message)
      }
    }

    if (changed) {
      const { error: upErr } = await sb
        .from('articles')
        .update({ translations: updated })
        .eq('id', row.id)
      if (upErr) console.error(`  [${row.id}] update failed:`, upErr.message)
      else console.log(`  [${row.id}] saved`)
    }
  }

  console.log('Done.')
}

main().catch(e => { console.error(e); process.exit(1) })
