import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { checkAndConsume, refund, getStatus } from '@/lib/entitlements'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET — UI calls this on mount to show "X/Y CV improvements remaining today".
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

// New simplified flow: the user pastes their CV in any language and/or uploads
// a PDF/image of it. We extract everything and produce a clean, professional
// German Lebenslauf as structured data the builder preview renders + exports.
type Body = {
  rawText?: string
  file?: { dataUrl: string; name?: string }
}

const MAX_FILE_BYTES = 8_000_000       // single upload cap (~6MB raw)
const MAX_TEXT_CHARS = 20_000          // pasted-text cap

function parseDataUrl(dataUrl: string): { mediaType: string; base64: string } | null {
  const m = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl)
  if (!m) return null
  return { mediaType: m[1], base64: m[2] }
}

const SYSTEM = `You are an expert German Lebenslauf (CV) writer. The user gives you their existing CV — pasted text and/or an uploaded PDF/image — usually in Arabic, French, English, or a mix, often informal or with typos.

Your job: read EVERYTHING (text + any attached document) and produce a clean, professional German Lebenslauf as JSON.

Rules:
1) Translate and rewrite everything into correct, professional German as used in a real German Lebenslauf. Use standard German CV vocabulary (e.g. Softwareentwickler, Kundenbetreuung, Teamfähigkeit).
2) Correct typos and grammar. Keep it concise and formal — no marketing superlatives (avoid "außergewöhnlich", "herausragend").
3) Keep proper nouns (person names, cities, company names, institutions) unchanged, unless a common German form exists ("المغرب" → "Marokko", country names → German).
4) For job/degree titles use the idiomatic German equivalent.
5) Skills: translate each item as a short noun phrase. Keep technical skills the user actually has — do NOT invent new technical skills. If the user lists fewer than 4 soft skills, add 2–4 standard role-appropriate German soft skills (Teamfähigkeit, Kommunikationsstärke, Eigeninitiative, Zuverlässigkeit, Lernbereitschaft, Zeitmanagement). Max 6 soft skills.
6) careerGoal (Berufsziel): write a polished 1–2 sentence first-person German career goal based on the target role + experience + skills. If the user provided one, translate/polish it.
7) Descriptions for experience AND education: return as bullet points separated by \\n (newline). Each bullet is one short line (5–15 words). NO leading •, -, *, or numbers — plain text per line. If a description is empty or vague, expand it into 2–4 realistic bullets for that exact role/field. Never invent metrics, percentages, prizes, or specific achievements not present.
8) Dates: use "YYYY-MM" format. If only a year is known, use "YYYY-01". Empty string if unknown or ongoing.
9) Never invent certifications, diplomas, prizes, companies, dates, or languages not present in the input. Facts clearly visible in an attached document ARE allowed (extract them).
10) Language levels: A1–C2 or "Native".

Return ONLY a JSON object with EXACTLY this shape (no markdown, no commentary):
{
  "personalInfo": {
    "firstName": "", "lastName": "", "jobTitle": "", "careerGoal": "",
    "dateOfBirth": "", "placeOfBirth": "", "nationality": "",
    "address": "", "postalCode": "", "city": "", "phone": "", "email": ""
  },
  "education": [{ "institution": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": "", "description": "" }],
  "experience": [{ "jobTitle": "", "company": "", "location": "", "startDate": "", "endDate": "", "description": "" }],
  "skills": { "technical": [], "soft": [] },
  "languages": [{ "language": "", "level": "" }]
}
Use empty strings / empty arrays for anything genuinely absent. Do not wrap in code fences.`

export async function POST(req: NextRequest) {
  let userIdForRefund: string | null = null
  let sourceForRefund: 'premium' | 'credit' | 'free_daily' | 'free_lifetime' | 'unlock' | 'always_free' | null = null
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured on the server.' }, { status: 500 })
    }

    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const body = (await req.json()) as Body
    const rawText = (body?.rawText || '').trim().slice(0, MAX_TEXT_CHARS)
    const file = body?.file?.dataUrl ? body.file : null
    if (!rawText && !file) {
      return NextResponse.json({ error: 'Provide CV text or a file.' }, { status: 400 })
    }

    // Entitlement gate — consume only after we know there's real input.
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

    type ContentBlock =
      | { type: 'text'; text: string }
      | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }
      | { type: 'document'; source: { type: 'base64'; media_type: 'application/pdf'; data: string } }

    const contentBlocks: ContentBlock[] = []

    if (file) {
      const parsed = parseDataUrl(file.dataUrl)
      if (parsed) {
        const approxBytes = Math.floor(parsed.base64.length * 0.75)
        if (approxBytes > MAX_FILE_BYTES) {
          await refund(user.id, 'cv', ent.source)
          return NextResponse.json({ error: 'File too large (max ~6MB).' }, { status: 413 })
        }
        contentBlocks.push({ type: 'text', text: `--- Uploaded CV document: "${file.name || 'cv'}" ---` })
        if (parsed.mediaType === 'application/pdf') {
          contentBlocks.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: parsed.base64 } })
        } else if (parsed.mediaType.startsWith('image/')) {
          contentBlocks.push({ type: 'image', source: { type: 'base64', media_type: parsed.mediaType, data: parsed.base64 } })
        }
      }
    }

    contentBlocks.push({
      type: 'text',
      text: rawText
        ? `Here is the user's CV (any language). Read it plus any attached document above, then produce the German Lebenslauf JSON:\n\n${rawText}`
        : `Read the attached CV document above and produce the German Lebenslauf JSON.`,
    })

    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 8000,
      thinking: { type: 'disabled' },
      system: SYSTEM,
      messages: [{ role: 'user', content: contentBlocks as unknown as Anthropic.MessageParam['content'] }],
    })

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim()

    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()

    let parsed: any
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.error('cv-ai: invalid JSON from model:', text.slice(0, 500))
      if (userIdForRefund && sourceForRefund) await refund(userIdForRefund, 'cv', sourceForRefund)
      return NextResponse.json({ error: 'AI returned invalid data. Try again.' }, { status: 502 })
    }

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
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
