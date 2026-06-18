/**
 * Translates seoContent, seoFaqs, seoArticleTitle, seoFaqTitle,
 * authMethodDetail, and apsDetail into all 8 non-English locales.
 * Uses 3 batches per locale to stay within Haiku output token limits.
 * Run: node scripts/translate-seo-content.mjs
 */
import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LOCALES = [
  { code: 'ar', full: 'Arabic (ar)', dir: 'rtl' },
  { code: 'fr', full: 'French (fr-FR)', dir: 'ltr' },
  { code: 'de', full: 'German (de-DE)', dir: 'ltr' },
  { code: 'es', full: 'Spanish (es-ES)', dir: 'ltr' },
  { code: 'tr', full: 'Turkish (tr-TR)', dir: 'ltr' },
  { code: 'fa', full: 'Persian/Farsi (fa-IR)', dir: 'rtl' },
  { code: 'pt', full: 'Portuguese (pt-BR)', dir: 'ltr' },
  { code: 'ru', full: 'Russian (ru-RU)', dir: 'ltr' },
]

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8')).documentChecklist

// Split into 3 smaller batches to avoid output token limits
const BATCHES = [
  // Batch 1: metadata keys + all seoContent paragraphs
  {
    label: 'metadata+content',
    source: {
      seoArticleTitle: en.seoArticleTitle,
      seoFaqTitle: en.seoFaqTitle,
      authMethodDetail: en.authMethodDetail,
      apsDetail: en.apsDetail,
      seoContent: en.seoContent,
    },
    apply: (dc, translated) => {
      dc.seoArticleTitle = translated.seoArticleTitle
      dc.seoFaqTitle = translated.seoFaqTitle
      dc.authMethodDetail = translated.authMethodDetail
      dc.apsDetail = translated.apsDetail
      dc.seoContent = translated.seoContent
    },
  },
  // Batch 2: seoFaqs for ausbildung + studium
  {
    label: 'faqs-ausbildung-studium',
    source: {
      seoFaqs: {
        ausbildung: en.seoFaqs.ausbildung,
        studium: en.seoFaqs.studium,
      },
    },
    apply: (dc, translated) => {
      if (!dc.seoFaqs) dc.seoFaqs = {}
      dc.seoFaqs.ausbildung = translated.seoFaqs.ausbildung
      dc.seoFaqs.studium = translated.seoFaqs.studium
    },
  },
  // Batch 3: seoFaqs for tourist + family_reunification
  {
    label: 'faqs-tourist-family',
    source: {
      seoFaqs: {
        tourist: en.seoFaqs.tourist,
        family_reunification: en.seoFaqs.family_reunification,
      },
    },
    apply: (dc, translated) => {
      if (!dc.seoFaqs) dc.seoFaqs = {}
      dc.seoFaqs.tourist = translated.seoFaqs.tourist
      dc.seoFaqs.family_reunification = translated.seoFaqs.family_reunification
    },
  },
]

const SYSTEM_RULES = `Keep ALL template placeholders unchanged: {country}, {authMethod}, {authMethodDetail}, {authFeeMin}, {authFeeMax}, {authDaysMin}, {authDaysMax}, {totalDocs}, {totalCostMin}, {totalCostMax}, {timelineMin}, {timelineMax}, {visaFee}, {path}, {apsDetail}.
Keep German proper nouns unchanged: Ausbildung, Studium, Sperrkonto, Verpflichtungserklärung, Vorab-Zustimmung, Aufenthaltstitel, Ausländerbehörde, Ehegattennachzug, AufenthG, §16b, §17a, §§27–36, Einwohnermeldeamt, Anmeldung, Bundesagentur für Arbeit, Grundsicherung, Ausbildungsvertrag, Studienkolleg, Hochschulabschluss, Baccalauréat, IHK, HWK, ZAB, APS, BAMF, DAAD, Bundesland, Steuerbescheid.
Keep institution names unchanged: Goethe-Institut, Goethe-Zertifikat, telc, ÖSD, TestDaF, IELTS, TOEFL, VFS Global, TLScontact, Fintiba, Expatrio, Coracle, uni-assist.
Keep legal references unchanged: Schengen C, Schengen, anabin.kmk.org, Hague Convention.
Keep JSON keys unchanged. Keep numbers unchanged. Write natural fluent prose, not literal translation.`

async function translateBatch(source, langFull) {
  const src = JSON.stringify(source, null, 2)
  const prompt = `You are translating UI content for GoGermany, a website helping people immigrate to Germany.

Translate ALL string values in the following JSON into ${langFull}.

${SYSTEM_RULES}

Source JSON:
${src}

Return ONLY the translated JSON object (same structure, same keys), no commentary, no markdown fences.`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 8000,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  const cleaned = text.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON found in response')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function main() {
  const args = process.argv.slice(2)
  const onlyLocales = args.length ? args : null

  for (const { code, full } of LOCALES) {
    if (onlyLocales && !onlyLocales.includes(code)) continue

    const filePath = `messages/${code}.json`
    const j = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const dc = j.documentChecklist
    if (!dc) { console.log(`Skipping ${code} — no documentChecklist section`); continue }

    // Skip if already fully translated
    if (
      dc.seoContent?.ausbildung?.p1 &&
      dc.seoContent.ausbildung.p1 !== en.seoContent.ausbildung.p1 &&
      dc.seoFaqs?.family_reunification?.length > 0 &&
      dc.seoFaqs.family_reunification[0].q !== en.seoFaqs.family_reunification[0].q
    ) {
      console.log(`${code}: already translated, skipping`)
      continue
    }

    console.log(`\n── ${code} (${full}) ──`)
    let failed = false

    for (const batch of BATCHES) {
      process.stdout.write(`  ${batch.label}... `)
      try {
        const translated = await translateBatch(batch.source, full)
        batch.apply(dc, translated)
        console.log('✓')
      } catch (e) {
        console.log(`✗ ${e.message}`)
        failed = true
        break
      }
      await new Promise(r => setTimeout(r, 800))
    }

    if (!failed) {
      fs.writeFileSync(filePath, JSON.stringify(j, null, 2), 'utf8')
      console.log(`  → saved ${filePath}`)
    }
  }
  console.log('\nDone.')
}

main().catch(e => { console.error(e); process.exit(1) })
