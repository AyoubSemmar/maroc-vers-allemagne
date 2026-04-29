import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { checkAndConsume, refund, getStatus } from '@/lib/entitlements'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET — UI calls this on mount to show "X/Y CV improvements remaining
// today". Same compact shape as /api/enhance-photo so the cv-builder
// UI can mirror the PhotoEnhancer's quota display logic.
export async function GET() {
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const status = await getStatus(user.id, 'cv')
  const isPremium = status.tier === 'premium'
  const dailyLimit     = isPremium ? 0 : ((status as any).dailyLimit ?? 0)
  const dailyRemaining = isPremium ? 0 : ((status as any).dailyRemaining ?? 0)
  const credits        = (status as any).credits ?? 0
  return NextResponse.json({
    tier: status.tier,
    credits,
    used: status.used,
    dailyLimit,
    dailyRemaining,
    limit:     isPremium ? status.limit     : dailyLimit + credits,
    remaining: isPremium ? status.remaining : dailyRemaining + credits,
  })
}

// Shape expected from client — mirrors CVData but we only send the textual parts
type Payload = {
  personalInfo: {
    firstName: string
    lastName: string
    jobTitle: string
    careerGoal: string
    nationality: string
    placeOfBirth: string
    address: string
    city: string
  }
  education: Array<{
    institution: string
    degree: string
    fieldOfStudy: string
    description: string
    startDate?: string
    endDate?: string
  }>
  experience: Array<{
    jobTitle: string
    company: string
    location: string
    description: string
    startDate?: string
    endDate?: string
  }>
  skills: { technical: string[]; soft: string[] }
  languages: Array<{ language: string; level: string }>
  documents?: {
    certificates?: DocInput[]
    diploma?: DocInput[]
    languageCertificates?: DocInput[]
    optionalCoverLetter?: DocInput[]
  }
}

type DocInput = {
  name: string
  type: string
  dataUrl: string
}

// Cap per-file size sent to Claude to stay within API limits (approx 3 MB base64 -> ~2.2MB raw).
const MAX_DOC_BYTES = 3_000_000
const DOC_CATEGORIES: Array<{
  key: 'certificates' | 'diploma' | 'languageCertificates' | 'optionalCoverLetter'
  label: string
}> = [
  { key: 'certificates',         label: 'General Certificate (Zeugnis)' },
  { key: 'diploma',              label: 'Diploma / Academic Certificate' },
  { key: 'languageCertificates', label: 'Language Certificate (Sprachzertifikat)' },
  { key: 'optionalCoverLetter',  label: 'Cover Letter / Motivation (Anschreiben)' },
]

function parseDataUrl(dataUrl: string): { mediaType: string; base64: string } | null {
  const m = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl)
  if (!m) return null
  return { mediaType: m[1], base64: m[2] }
}

const SYSTEM = `You are an expert German Lebenslauf (CV) translator, editor, and light optimizer.
The user provides CV data in Arabic, French, English, German, or a mix — often with typos or informal phrasing.

Your job:
1) Detect the source language per field.
2) Correct typos and grammar.
3) Translate EVERYTHING to proper, professional German as used in a German Lebenslauf.
4) Keep it concise and formal. Use standard German CV vocabulary (Softwareentwickler, Kundenbetreuung, Teamfähigkeit, etc.).
5) For job/degree titles, use the idiomatic German equivalent.
6) For skills, translate each item individually (short noun phrases).
7) Generate a 2-sentence "careerGoal" (Berufsziel) based on the user's target jobTitle + experience + skills + education. Write it in first-person German, professional tone. If the user already provided a careerGoal, polish/translate it instead.
8) Keep proper nouns (names, cities, company names, institution names) unchanged unless a widely-used German form exists (e.g. "Casablanca" stays, "المغرب" becomes "Marokko").

REFERENCE DOCUMENTS (if provided):
The user may attach scanned certificates, diplomas, language certificates, and cover letters as images or PDFs before the JSON payload. These are the SOURCE OF TRUTH for verifiable facts. READ EVERY DOCUMENT CAREFULLY — extract dates, names, titles, levels, employers, job roles, and responsibilities. When enriching the CV:

- Cross-check institution names, degree titles, field of study, and dates against what appears in the diploma/certificate documents. If the user's typed value contradicts a clearly legible document, prefer the document's wording (translated to German).
- Use language certificates to confirm or correct the language level (A1–C2). If the user didn't list a language that a certificate clearly proves, ADD it as a new entry in "languages".
- If a work certificate (Arbeitsbescheinigung) documents a job that is NOT in the experience array, ADD a new experience entry reconstructed from the certificate: extract jobTitle, company, location, startDate (YYYY-MM), endDate (YYYY-MM or empty if still employed), and description (2–4 bullet points of the duties listed on the certificate). Return it as an additional element in the "experience" array.
- If a diploma or academic certificate documents studies that are NOT in the education array, ADD a new education entry: extract institution, degree, fieldOfStudy, startDate, endDate, and description.
- Merge strategy for existing entries: if a user-provided entry clearly refers to the same job/school as a document (same company/institution), ENRICH that existing entry rather than creating a duplicate. Only ADD a new entry when no existing entry matches.
- If a cover letter is attached, use its tone/themes only as inspiration for the careerGoal (Berufsziel) — never copy sentences verbatim.
- Dates from documents: if only a year is visible, use "YYYY-01". If the document shows a range like "2019–2022", fill both startDate and endDate.
- Never fabricate details that are not visible in any document and not in the JSON payload. If a document is unreadable, ignore it.
- Rule #13 above ("never invent certifications, diplomas, prizes, specific companies, specific dates") does NOT apply to details that are clearly visible in the attached documents — those are treated as verified facts, not inventions.

LIGHT OPTIMIZATION (important — improve the CV, but stay grounded):
9) For each experience entry's description: if it is empty, very short, or vague, expand it into 2–4 realistic bullet points in German that a person in that exact role would plausibly do. Use a neutral, factual tone (e.g. "Entwicklung und Wartung von Webanwendungen", "Zusammenarbeit mit interdisziplinären Teams"). Never claim specific metrics, percentages, prize wins, or achievements that weren't provided.
10) For each education entry's description: if missing or weak, add 1–2 short lines about the typical focus of that field (courses, key subjects). No fabricated grades or honors.

BULLET FORMAT (critical):
- The "description" field for BOTH experience and education MUST be returned as bullet points separated by \\n (newline).
- Each bullet is one short line (5–15 words ideal).
- DO NOT prefix bullets with •, -, *, or numbers — the UI renders list markers automatically. Just plain text per line.
- DO NOT write long paragraphs. If the user provided one, split it into bullet lines.
- Example of a correct "description" value:
  "Entwicklung und Wartung von REST-APIs mit Node.js\\nZusammenarbeit mit Produkt- und Design-Teams\\nCode-Reviews und Mentoring junger Entwickler"
11) Soft skills (skills.soft): If the user has fewer than 4 soft skills, add 2–4 standard, role-appropriate soft skills in German (e.g. Teamfähigkeit, Kommunikationsstärke, Eigeninitiative, Problemlösungskompetenz, Lernbereitschaft, Zuverlässigkeit, Zeitmanagement). Don't exceed 6 total. Don't remove ones the user provided.
12) Technical skills (skills.technical): Keep exactly what the user listed, just translated/standardized. Do NOT invent new technical skills — those must come from the user.
13) Never invent: certifications, diplomas, prizes, specific companies, specific dates, specific metrics, languages not listed.
14) Output should feel like a polished, realistic junior-to-mid professional CV — not a marketing brochure. Avoid superlatives like "außergewöhnlich", "herausragend", "einzigartig".

Return ONLY a JSON object matching the input shape. Arrays ("education", "experience", "languages", "skills.technical", "skills.soft") MAY contain MORE elements than the input when reference documents justify it — append new entries at the end. Do not wrap in markdown code fences. Do not add any commentary.`

export async function POST(req: NextRequest) {
  let userIdForRefund: string | null = null
  let sourceForRefund: 'premium' | 'credit' | 'free_daily' | 'free_lifetime' | 'unlock' | 'always_free' | null = null
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured on the server.' },
        { status: 500 }
      )
    }

    // Require authenticated user
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    // Entitlement gate
    const ent = await checkAndConsume(user.id, 'cv')
    if (!ent.allowed) {
      const message =
        ent.reason === 'premium_daily_limit' ? 'وصلت الحد اليومي للباقة المميزة لتحسين السيرة الذاتية.' :
        ent.reason === 'no_credits'          ? 'لا تملك رصيد تحسين CV. اشترِ رصيداً للمتابعة.' :
                                               'غير مسموح.'
      return NextResponse.json({ error: message, reason: ent.reason }, { status: 402 })
    }
    userIdForRefund = user.id
    sourceForRefund = ent.source

    const payload = (await req.json()) as Payload
    if (!payload || typeof payload !== 'object') {
      await refund(user.id, 'cv', ent.source)
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })

    // Strip documents off the payload before serializing it into the JSON block,
    // they go as separate image/document content blocks.
    const { documents, ...textPayload } = payload

    type ContentBlock =
      | { type: 'text'; text: string }
      | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }
      | { type: 'document'; source: { type: 'base64'; media_type: 'application/pdf'; data: string } }

    const contentBlocks: ContentBlock[] = []

    if (documents) {
      for (const cat of DOC_CATEGORIES) {
        const list = documents[cat.key] || []
        for (const doc of list) {
          if (!doc?.dataUrl) continue
          const parsed = parseDataUrl(doc.dataUrl)
          if (!parsed) continue
          // Rough size check: base64 length * 0.75 ≈ raw bytes
          const approxBytes = Math.floor(parsed.base64.length * 0.75)
          if (approxBytes > MAX_DOC_BYTES) continue

          contentBlocks.push({
            type: 'text',
            text: `--- Reference document: "${doc.name}" (category: ${cat.label}) ---`,
          })

          if (parsed.mediaType === 'application/pdf') {
            contentBlocks.push({
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: parsed.base64 },
            })
          } else if (parsed.mediaType.startsWith('image/')) {
            contentBlocks.push({
              type: 'image',
              source: { type: 'base64', media_type: parsed.mediaType, data: parsed.base64 },
            })
          }
        }
      }
    }

    contentBlocks.push({
      type: 'text',
      text: `Translate, correct, and enrich the following CV data into professional German. Read every reference document above thoroughly and extract ALL verifiable facts — especially any job, study, or language level documented but MISSING from the JSON below. Add those as new entries (appended to the end of the respective array). For each experience you add from a work certificate, reconstruct a realistic 2–4 bullet description from the duties listed on the certificate. Return JSON only, matching the input shape (arrays may be longer).\n\n${JSON.stringify(textPayload, null, 2)}`,
    })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 6000,
      system: SYSTEM,
      messages: [{ role: 'user', content: contentBlocks as unknown as Anthropic.MessageParam['content'] }],
    })

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim()

    // Try to strip code fences if the model wrapped the JSON anyway
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    let parsed: Payload
    try {
      parsed = JSON.parse(cleaned)
    } catch (e) {
      console.error('Failed to parse AI response:', text)
      if (userIdForRefund && sourceForRefund) await refund(userIdForRefund, 'cv', sourceForRefund)
      return NextResponse.json(
        { error: 'AI returned invalid JSON. Try again.' },
        { status: 502 }
      )
    }

    // Include the post-consume quota snapshot so the UI can refresh the
    // "X/Y remaining today" badge without a separate GET round-trip.
    const status = await getStatus(user.id, 'cv')
    const isPremium = status.tier === 'premium'
    const dailyLimit     = isPremium ? 0 : ((status as any).dailyLimit ?? 0)
    const dailyRemaining = isPremium ? 0 : ((status as any).dailyRemaining ?? 0)
    const credits        = (status as any).credits ?? 0
    return NextResponse.json({
      data: parsed,
      source: sourceForRefund,
      tier: status.tier,
      credits,
      used: status.used,
      dailyLimit,
      dailyRemaining,
      limit:     isPremium ? status.limit     : dailyLimit + credits,
      remaining: isPremium ? status.remaining : dailyRemaining + credits,
    })
  } catch (e: any) {
    console.error('cv-ai error:', e)
    if (userIdForRefund && sourceForRefund) await refund(userIdForRefund, 'cv', sourceForRefund)
    return NextResponse.json(
      { error: e?.message || 'Internal error' },
      { status: 500 }
    )
  }
}
