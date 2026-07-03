/**
 * Translate a single large lesson that exceeded the batch token limit.
 * Run: node scripts/fix-one-lesson.mjs <level> <locale> <lessonId>
 *   e.g. node scripts/fix-one-lesson.mjs c1 ur c1-16
 */
import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const ai = new Anthropic({ apiKey: process.env.ARTICLE_GEN_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY })

const LANG = { fr: 'French', de: 'German', es: 'Spanish', tr: 'Turkish', fa: 'Persian/Farsi', pt: 'Portuguese', ru: 'Russian', hi: 'Hindi', ur: 'Urdu', zh: 'Simplified Chinese' }
const [level, locale, lessonId] = process.argv.slice(2)
const langName = LANG[locale]

const enPath = `lib/german-data/translations/${level}.en.json`
const outPath = `lib/german-data/translations/${level}.${locale}.json`
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))
const lesson = { id: lessonId, ...en.lessons[lessonId] }

const prompt = `Translate this German-language teaching lesson from English into ${langName}.
Rules:
- German vocabulary and example sentences stay UNCHANGED (they are the language being taught).
- Keep "german" and "example" fields unchanged.
- Translate "arabic" fields (they hold the gloss in the target language) and "exampleArabic" to ${langName}.
- In grammar tables translate non-German cells; keep German cells. In rules translate "rule"/"translation", keep "example". In examples keep the German half, translate the rest. In exercises translate question text and hints; keep answers in German.
Source lesson:
\`\`\`json
${JSON.stringify(lesson, null, 2)}
\`\`\`
Return ONLY a JSON object: {"${locale}": { "title":"...", "grammar":{...}, "vocabulary":[...], "exercise":{...} }}`

const stream = await ai.messages.stream({ model: 'claude-haiku-4-5', max_tokens: 20000, temperature: 0.3, messages: [{ role: 'user', content: prompt }] })
const msg = await stream.finalMessage()
const text = msg.content.map(c => c.type === 'text' ? c.text : '').join('')
const cleaned = text.replace(/```json\s*|\s*```/g, '').trim()
const obj = JSON.parse(cleaned.slice(cleaned.indexOf('{'), cleaned.lastIndexOf('}') + 1))
const overlay = JSON.parse(fs.readFileSync(outPath, 'utf8'))
overlay.lessons[lessonId] = obj[locale]
fs.writeFileSync(outPath, JSON.stringify(overlay, null, 2), 'utf8')
console.log(`${lessonId} ${locale} saved — title="${(obj[locale].title || '').slice(0, 40)}" vocab=${obj[locale].vocabulary?.length || 0}`)
