/**
 * Translate German lessons from English overlay → Turkish (tr-TR).
 * Reads lib/german-data/translations/<level>.en.json as source.
 * Writes lib/german-data/translations/<level>.tr.json.
 */
import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const LANG = 'tr'
const LANG_FULL = 'Turkish (Turkey, tr-TR)'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
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
  const prompt = `You are translating a German-language teaching lesson from English into ${LANG_FULL}. Translation must be natural and pedagogically accurate.

Strict rules:
  • German vocabulary and example sentences stay UNCHANGED — they are the language being taught.
  • Keep "german" and "example" fields in vocabulary unchanged.
  • Translate "arabic" fields in vocabulary to ${LANG_FULL} (the field is named "arabic" but holds the gloss in the target language).
  • Translate "exampleArabic" fields to ${LANG_FULL}.
  • In grammar tables: translate non-German cells; keep German cells unchanged.
  • In rules: translate "rule" and "translation"; keep "example" (German) unchanged.
  • In examples (format "German sentence — English sentence"): keep the German half; replace the English half with ${LANG_FULL}.
  • In exercises: translate question text and hints; keep answers in German.

Source English lesson:
\`\`\`json
${JSON.stringify(lesson, null, 2)}
\`\`\`

Return ONLY a JSON object — a Partial<Lesson> overlay with key "${LANG}". NO commentary:
{
  "${LANG}": {
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
  return parsed[LANG]
}

async function main() {
  for (const level of LEVELS) {
    const enOverlayPath = path.resolve(`lib/german-data/translations/${level}.en.json`)
    const outPath = path.resolve(`lib/german-data/translations/${level}.${LANG}.json`)

    if (!fs.existsSync(enOverlayPath)) {
      console.log(`Skipping ${level} — no en overlay found`)
      continue
    }

    const enOverlay = JSON.parse(fs.readFileSync(enOverlayPath, 'utf8'))
    const lessonIds = Object.keys(enOverlay.lessons || {})
    if (lessonIds.length === 0) { console.log(`${level}: no lessons, skipping`); continue }

    console.log(`\n${level.toUpperCase()}: ${lessonIds.length} lessons`)

    let overlay = { title: '', description: '', lessons: {} }
    if (fs.existsSync(outPath)) {
      try { overlay = JSON.parse(fs.readFileSync(outPath, 'utf8')) } catch {}
    }

    // Translate level metadata
    if (enOverlay.title && !overlay.title) {
      const metaResp = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 200,
        temperature: 0.2,
        messages: [{ role: 'user', content: `Translate from English to ${LANG_FULL}. Return ONLY JSON: {"title":"...","description":"..."}\ntitle: "${enOverlay.title}"\ndescription: "${enOverlay.description || ''}"` }],
      })
      const metaText = metaResp.content.map(c => c.type === 'text' ? c.text : '').join('')
      try { const meta = parseJsonLoose(metaText); overlay.title = meta.title; overlay.description = meta.description } catch {}
    }

    for (const lessonId of lessonIds) {
      if (overlay.lessons?.[lessonId]?.title) {
        process.stdout.write(`  ${lessonId}: already done\n`)
        continue
      }
      process.stdout.write(`  ${lessonId}... `)
      try {
        const translated = await translateLesson({ id: lessonId, ...enOverlay.lessons[lessonId] })
        if (!overlay.lessons) overlay.lessons = {}
        overlay.lessons[lessonId] = translated
        fs.writeFileSync(outPath, JSON.stringify(overlay, null, 2), 'utf8')
        console.log('✓')
        await new Promise(r => setTimeout(r, 1500))
      } catch (e) {
        console.log(`✗ ${e.message}`)
      }
    }

    fs.writeFileSync(outPath, JSON.stringify(overlay, null, 2), 'utf8')
    console.log(`Wrote ${level}.${LANG}.json`)
  }
  console.log('\nAll levels done.')
}

main().catch(e => { console.error(e); process.exit(1) })
