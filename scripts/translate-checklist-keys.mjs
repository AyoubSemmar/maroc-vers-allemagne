/**
 * One-off: translate new documentChecklist keys into all non-English locales.
 * Run: node scripts/translate-checklist-keys.mjs
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

// Keys to translate — extracted from en.json documentChecklist
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8')).documentChecklist

const KEYS_TO_TRANSLATE = {
  // SEO content paragraphs
  'seoContent.ausbildung.p1': en.seoContent.ausbildung.p1,
  'seoContent.ausbildung.p2': en.seoContent.ausbildung.p2,
  'seoContent.ausbildung.p3': en.seoContent.ausbildung.p3,
  'seoContent.ausbildung.p4': en.seoContent.ausbildung.p4,
  'seoContent.studium.p1': en.seoContent.studium.p1,
  'seoContent.studium.p2': en.seoContent.studium.p2,
  'seoContent.studium.p3': en.seoContent.studium.p3,
  'seoContent.studium.p4': en.seoContent.studium.p4,
  'seoContent.tourist.p1': en.seoContent.tourist.p1,
  'seoContent.tourist.p2': en.seoContent.tourist.p2,
  'seoContent.tourist.p3': en.seoContent.tourist.p3,
  'seoContent.tourist.p4': en.seoContent.tourist.p4,
  'seoContent.family_reunification.p1': en.seoContent.family_reunification.p1,
  'seoContent.family_reunification.p2': en.seoContent.family_reunification.p2,
  'seoContent.family_reunification.p3': en.seoContent.family_reunification.p3,
  'seoContent.family_reunification.p4': en.seoContent.family_reunification.p4,
  'seoContent.noVisaEu': en.seoContent.noVisaEu,
  'seoContent.touristFree': en.seoContent.touristFree,
  // FAQ questions/answers
  'seoFaqs.ausbildung.0.q': en.seoFaqs.ausbildung[0].q,
  'seoFaqs.ausbildung.0.a': en.seoFaqs.ausbildung[0].a,
  'seoFaqs.ausbildung.1.q': en.seoFaqs.ausbildung[1].q,
  'seoFaqs.ausbildung.1.a': en.seoFaqs.ausbildung[1].a,
  'seoFaqs.ausbildung.2.q': en.seoFaqs.ausbildung[2].q,
  'seoFaqs.ausbildung.2.a': en.seoFaqs.ausbildung[2].a,
  'seoFaqs.ausbildung.3.q': en.seoFaqs.ausbildung[3].q,
  'seoFaqs.ausbildung.3.a': en.seoFaqs.ausbildung[3].a,
  'seoFaqs.ausbildung.4.q': en.seoFaqs.ausbildung[4].q,
  'seoFaqs.ausbildung.4.a': en.seoFaqs.ausbildung[4].a,
  'seoFaqs.ausbildung.5.q': en.seoFaqs.ausbildung[5].q,
  'seoFaqs.ausbildung.5.a': en.seoFaqs.ausbildung[5].a,
  'seoFaqs.studium.0.q': en.seoFaqs.studium[0].q,
  'seoFaqs.studium.0.a': en.seoFaqs.studium[0].a,
  'seoFaqs.studium.1.q': en.seoFaqs.studium[1].q,
  'seoFaqs.studium.1.a': en.seoFaqs.studium[1].a,
  'seoFaqs.studium.2.q': en.seoFaqs.studium[2].q,
  'seoFaqs.studium.2.a': en.seoFaqs.studium[2].a,
  'seoFaqs.studium.3.q': en.seoFaqs.studium[3].q,
  'seoFaqs.studium.3.a': en.seoFaqs.studium[3].a,
  'seoFaqs.studium.4.q': en.seoFaqs.studium[4].q,
  'seoFaqs.studium.4.a': en.seoFaqs.studium[4].a,
  'seoFaqs.studium.5.q': en.seoFaqs.studium[5].q,
  'seoFaqs.studium.5.a': en.seoFaqs.studium[5].a,
  'seoFaqs.tourist.0.q': en.seoFaqs.tourist[0].q,
  'seoFaqs.tourist.0.a': en.seoFaqs.tourist[0].a,
  'seoFaqs.tourist.1.q': en.seoFaqs.tourist[1].q,
  'seoFaqs.tourist.1.a': en.seoFaqs.tourist[1].a,
  'seoFaqs.tourist.2.q': en.seoFaqs.tourist[2].q,
  'seoFaqs.tourist.2.a': en.seoFaqs.tourist[2].a,
  'seoFaqs.tourist.3.q': en.seoFaqs.tourist[3].q,
  'seoFaqs.tourist.3.a': en.seoFaqs.tourist[3].a,
  'seoFaqs.tourist.4.q': en.seoFaqs.tourist[4].q,
  'seoFaqs.tourist.4.a': en.seoFaqs.tourist[4].a,
  'seoFaqs.tourist.5.q': en.seoFaqs.tourist[5].q,
  'seoFaqs.tourist.5.a': en.seoFaqs.tourist[5].a,
  'seoFaqs.family_reunification.0.q': en.seoFaqs.family_reunification[0].q,
  'seoFaqs.family_reunification.0.a': en.seoFaqs.family_reunification[0].a,
  'seoFaqs.family_reunification.1.q': en.seoFaqs.family_reunification[1].q,
  'seoFaqs.family_reunification.1.a': en.seoFaqs.family_reunification[1].a,
  'seoFaqs.family_reunification.2.q': en.seoFaqs.family_reunification[2].q,
  'seoFaqs.family_reunification.2.a': en.seoFaqs.family_reunification[2].a,
  'seoFaqs.family_reunification.3.q': en.seoFaqs.family_reunification[3].q,
  'seoFaqs.family_reunification.3.a': en.seoFaqs.family_reunification[3].a,
  'seoFaqs.family_reunification.4.q': en.seoFaqs.family_reunification[4].q,
  'seoFaqs.family_reunification.4.a': en.seoFaqs.family_reunification[4].a,
  'seoFaqs.family_reunification.5.q': en.seoFaqs.family_reunification[5].q,
  'seoFaqs.family_reunification.5.a': en.seoFaqs.family_reunification[5].a,
  // Auth method detail + APS detail + section labels
  'seoArticleTitle': en.seoArticleTitle,
  'seoFaqTitle': en.seoFaqTitle,
  'authMethodDetail.apostille': en.authMethodDetail.apostille,
  'authMethodDetail.legalization': en.authMethodDetail.legalization,
  'apsDetail.required': en.apsDetail.required,
  'apsDetail.notRequired': en.apsDetail.notRequired,
  // Previously existing keys
  'path.tourist': en.path.tourist,
  'path.family_reunification': en.path.family_reunification,
  'noVisaRequired': en.noVisaRequired,
  'noVisaDesc': en.noVisaDesc,
  'category.sponsor': en.category.sponsor,
  'countryNote.eu': en.countryNote.eu,
  'countryNote.touristFree': en.countryNote.touristFree,
  'seoCountryPageTitle': en.seoCountryPageTitle,
  'seoCountryPageDesc': en.seoCountryPageDesc,
  'docs.german_a1_cert.name': en.docs.german_a1_cert.name,
  'docs.german_a1_cert.where': en.docs.german_a1_cert.where,
  'docs.german_a1_cert.notes': en.docs.german_a1_cert.notes,
  'docs.sponsor_permit_copy.name': en.docs.sponsor_permit_copy.name,
  'docs.sponsor_permit_copy.where': en.docs.sponsor_permit_copy.where,
  'docs.sponsor_permit_copy.notes': en.docs.sponsor_permit_copy.notes,
  'docs.sponsor_income_proof.name': en.docs.sponsor_income_proof.name,
  'docs.sponsor_income_proof.where': en.docs.sponsor_income_proof.where,
  'docs.sponsor_income_proof.notes': en.docs.sponsor_income_proof.notes,
  'docs.sponsor_housing_proof.name': en.docs.sponsor_housing_proof.name,
  'docs.sponsor_housing_proof.where': en.docs.sponsor_housing_proof.where,
  'docs.sponsor_housing_proof.notes': en.docs.sponsor_housing_proof.notes,
  'docs.schengen_visa_form.name': en.docs.schengen_visa_form.name,
  'docs.schengen_visa_form.where': en.docs.schengen_visa_form.where,
  'docs.schengen_visa_form.notes': en.docs.schengen_visa_form.notes,
  'docs.travel_insurance_tourist.name': en.docs.travel_insurance_tourist.name,
  'docs.travel_insurance_tourist.where': en.docs.travel_insurance_tourist.where,
  'docs.travel_insurance_tourist.notes': en.docs.travel_insurance_tourist.notes,
  'docs.flight_reservation.name': en.docs.flight_reservation.name,
  'docs.flight_reservation.where': en.docs.flight_reservation.where,
  'docs.flight_reservation.notes': en.docs.flight_reservation.notes,
  'docs.accommodation_tourist.name': en.docs.accommodation_tourist.name,
  'docs.accommodation_tourist.where': en.docs.accommodation_tourist.where,
  'docs.accommodation_tourist.notes': en.docs.accommodation_tourist.notes,
  'docs.financial_means_proof.name': en.docs.financial_means_proof.name,
  'docs.financial_means_proof.where': en.docs.financial_means_proof.where,
  'docs.financial_means_proof.notes': en.docs.financial_means_proof.notes,
  'docs.employment_ties_proof.name': en.docs.employment_ties_proof.name,
  'docs.employment_ties_proof.where': en.docs.employment_ties_proof.where,
  'docs.employment_ties_proof.notes': en.docs.employment_ties_proof.notes,
  'docs.schengen_visa_fee.name': en.docs.schengen_visa_fee.name,
  'docs.schengen_visa_fee.where': en.docs.schengen_visa_fee.where,
  'docs.schengen_visa_fee.notes': en.docs.schengen_visa_fee.notes,
  'docs.schengen_appointment.name': en.docs.schengen_appointment.name,
  'docs.schengen_appointment.where': en.docs.schengen_appointment.where,
  'docs.schengen_appointment.notes': en.docs.schengen_appointment.notes,
}

function setNestedKey(obj, keyPath, value) {
  const parts = keyPath.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
}

function getNestedKey(obj, keyPath) {
  return keyPath.split('.').reduce((o, k) => o?.[k], obj)
}

async function translateBatch(keys, langFull) {
  const entries = Object.entries(keys)
  const src = entries.map(([k, v]) => `"${k}": ${JSON.stringify(v)}`).join('\n')

  const prompt = `You are translating UI strings for GoGermany, a website helping people immigrate to Germany.
Translate ALL of the following English strings into ${langFull}.

Rules:
- Keep German proper nouns unchanged: Ausbildung, Studium, Sperrkonto, Verpflichtungserklärung, Wohnungsgeberbestätigung, Wohnflächennachweis, Aufenthaltstitel, Ausländerbehörde, Ehegattennachzug, AufenthG, Schengen, Goethe, telc, ÖSD, VFS, TLScontact, IHK, HWK, ZAB, APS, BAMF, DAAD.
- Keep template placeholders unchanged: {country}, {path}, {n}.
- Keep URLs and numbers unchanged.
- Translation must sound natural for native speakers — not literal.

Return ONLY a JSON object with the same keys:
${src}

Return ONLY valid JSON, no commentary.`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 4000,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = resp.content.map(c => c.type === 'text' ? c.text : '').join('')
  const cleaned = text.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON found')
  return JSON.parse(cleaned.slice(first, last + 1))
}

async function main() {
  for (const { code, full } of LOCALES) {
    const filePath = `messages/${code}.json`
    const j = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const dc = j.documentChecklist
    if (!dc) { console.log(`Skipping ${code} — no documentChecklist section`); continue }

    // Find which keys are still in English (matching EN value)
    const keysNeeded = {}
    for (const [k, enVal] of Object.entries(KEYS_TO_TRANSLATE)) {
      const current = getNestedKey(dc, k)
      if (!current || current === enVal) keysNeeded[k] = enVal
    }

    if (Object.keys(keysNeeded).length === 0) {
      console.log(`${code}: all keys already translated`)
      continue
    }

    process.stdout.write(`${code} (${Object.keys(keysNeeded).length} keys)... `)
    try {
      const translated = await translateBatch(keysNeeded, full)
      for (const [k, v] of Object.entries(translated)) {
        setNestedKey(dc, k, v)
      }
      fs.writeFileSync(filePath, JSON.stringify(j, null, 2), 'utf8')
      console.log('✓')
    } catch (e) {
      console.log(`✗ ${e.message}`)
    }
    await new Promise(r => setTimeout(r, 1000))
  }
  console.log('\nDone.')
}

main().catch(e => { console.error(e); process.exit(1) })
