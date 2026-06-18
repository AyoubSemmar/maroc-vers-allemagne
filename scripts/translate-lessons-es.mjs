/**
 * One-off script: translate existing German lessons to Spanish.
 *
 * Reads each level's source lessons via the Next.js API (translate-lesson
 * endpoint running locally) and writes the result to
 *   lib/german-data/translations/<level>.es.json
 *
 * Prerequisite: the dev server must be running on localhost:3000
 *   npm run dev
 * Then in a second terminal:
 *   node scripts/translate-lessons-es.mjs
 *
 * Alternatively, set USE_DIRECT=1 and it calls Claude directly
 * (needs ANTHROPIC_API_KEY set).
 */

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

// Load .env.local
const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] ??= m[2].trim().replace(/^["']|["']$/g, '')
  }
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1']

function parseJsonLoose(s) {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function translateLesson(lesson) {
  const prompt = `You are translating a German-language teaching lesson written in Arabic into Spanish (es-ES). Translation must be natural for native Spanish speakers and accurate to the pedagogical intent.

Strict rules:
  • German vocabulary and example sentences stay UNCHANGED — they are the language being taught.
  • Keep "german" and "example" fields in vocabulary unchanged.
  • Translate "arabic" fields in vocabulary to Spanish (the field is named "arabic" but holds the gloss in the target language).
  • Translate "exampleArabic" fields to Spanish.
  • In grammar tables: translate Arabic cells; keep German cells unchanged.
  • In rules: translate "rule" and "translation"; keep "example" (German) unchanged.
  • In examples (format "German sentence — Arabic sentence"): keep the German half; replace the Arabic half with Spanish.
  • In exercises: translate question text and hints; keep answers in German.
  • Use ¿ and ¡ for Spanish questions/exclamations.

Source Arabic lesson:
\`\`\`json
${JSON.stringify(lesson, null, 2)}
\`\`\`

Return ONLY a JSON object — a Partial<Lesson> overlay with key "es". NO commentary:
{
  "es": {
    "title": "...",
    "grammar": {
      "title": "...",
      "content": "...",
      "tables": [...],
      "rules": [...],
      "examples": [...],
      "tip": "..."
    },
    "vocabulary": [...],
    "exercise": { "questions": [...] }
  }
}`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 9000,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  const parsed = parseJsonLoose(text)
  return parsed.es
}

async function main() {
  for (const level of LEVELS) {
    const srcPath = path.resolve(`lib/german-data/${level}.ts`)
    if (!fs.existsSync(srcPath)) {
      console.log(`Skipping ${level} — source file not found`)
      continue
    }

    // Read the TypeScript source and extract the lessons array via JSON import
    // We use a small eval trick: strip TS types and import the JS value.
    // Simpler: call the running dev server's translate-lesson endpoint.
    // But since we want to avoid that dependency, read the existing en.json
    // overlay which has the lesson IDs, then fetch the full lesson via the
    // lessons index which is already compiled.

    const enOverlayPath = path.resolve(`lib/german-data/translations/${level}.en.json`)
    const esOverlayPath = path.resolve(`lib/german-data/translations/${level}.es.json`)

    if (!fs.existsSync(enOverlayPath)) {
      console.log(`Skipping ${level} — no en overlay found`)
      continue
    }

    const enOverlay = JSON.parse(fs.readFileSync(enOverlayPath, 'utf8'))
    const lessonIds = Object.keys(enOverlay.lessons || {})

    if (lessonIds.length === 0) {
      console.log(`${level}: no lessons in en overlay, skipping`)
      continue
    }

    console.log(`\n${level.toUpperCase()}: ${lessonIds.length} lessons`)

    // Load existing es overlay if any
    let esOverlay = { title: '', description: '', lessons: {} }
    if (fs.existsSync(esOverlayPath)) {
      try { esOverlay = JSON.parse(fs.readFileSync(esOverlayPath, 'utf8')) } catch {}
    }

    // Translate level title and description from en overlay
    if (enOverlay.title && !esOverlay.title) {
      // Simple translation for the level metadata
      const metaResp = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 200,
        temperature: 0.2,
        messages: [{
          role: 'user',
          content: `Translate these two strings from English to Spanish (es-ES). Return ONLY JSON: {"title":"...","description":"..."}
title: "${enOverlay.title}"
description: "${enOverlay.description || ''}"`
        }],
      })
      const metaText = metaResp.content.map(c => c.type === 'text' ? c.text : '').join('')
      try {
        const meta = parseJsonLoose(metaText)
        esOverlay.title = meta.title
        esOverlay.description = meta.description
      } catch {}
    }

    // We need the Arabic source for each lesson. Since we can't import .ts
    // directly, we'll translate FROM the en overlay (which has full lesson data).
    for (const lessonId of lessonIds) {
      if (esOverlay.lessons?.[lessonId]?.title) {
        process.stdout.write(`  ${lessonId}: already translated, skipping\n`)
        continue
      }

      process.stdout.write(`  ${lessonId}... `)
      const enLesson = enOverlay.lessons[lessonId]

      try {
        const esLesson = await translateLesson({ id: lessonId, ...enLesson })
        if (!esOverlay.lessons) esOverlay.lessons = {}
        esOverlay.lessons[lessonId] = esLesson
        console.log('✓')
        await new Promise(r => setTimeout(r, 1500))
      } catch (e) {
        console.log(`✗ ${e.message}`)
      }
    }

    fs.writeFileSync(esOverlayPath, JSON.stringify(esOverlay, null, 2), 'utf8')
    console.log(`Wrote ${esOverlayPath}`)
  }

  console.log('\nAll levels done.')
}

main().catch(e => { console.error(e); process.exit(1) })
