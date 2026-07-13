import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { checkAndConsume, refund, getStatus } from '@/lib/entitlements'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const status = await getStatus(user.id, 'motivation')
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

// Simplified flow: the user pastes their existing motivation letter in any
// language and/or uploads it (PDF/image). We return a corrected, professional
// German Anschreiben — same content and intent, just fixed and translated.
type Body = {
  letterText?: string
  file?: { dataUrl: string; name?: string }
}

const MAX_FILE_BYTES = 8_000_000
const MAX_TEXT_CHARS = 8_000

function parseDataUrl(dataUrl: string): { mediaType: string; base64: string } | null {
  const m = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl)
  if (!m) return null
  return { mediaType: m[1], base64: m[2] }
}

const SYSTEM = `You are a professional German career assistant. The user gives you their EXISTING motivation letter (Bewerbungsanschreiben) — pasted text and/or an uploaded PDF/image — usually written in Arabic, French, English, or rough German.

Your job: return a corrected, professional German version of THEIR letter. This is a correction + translation task, not invention.

Rules:
1) Output MUST be in natural, professional German at B2–C1 level.
2) Preserve the applicant's own content, facts, and intent — do NOT invent new experiences, employers, dates, or qualifications. Fix grammar, spelling, tone, structure, and word choice; translate anything not already in German.
3) Follow the standard German Anschreiben structure: opening (Anrede + intro), motivation, relevant experience/skills, personal strengths/goals, closing.
4) Formal but human — no robotic filler, no exaggeration. German-appropriate modesty: reliability, motivation, willingness to learn.
5) Keep it roughly 180–260 words. Tighten rambling input; gently expand only if the input is extremely thin, without fabricating facts.
6) Do not mention AI. Do not explain your reasoning. Output ONLY the letter.

Output format — follow EXACTLY:
>>DATE>>[today's date in German, e.g. "13. Juli 2026" — no city]

Sehr geehrte Damen und Herren,

...letter body...

Mit freundlichen Grüßen
[Applicant's full name — use the name from the letter if present; otherwise leave the line as "Mit freundlichen Grüßen" only]

Rules for the format:
- The first line is the date, prefixed with the marker ">>DATE>>" so the UI can right-align it. Use the exact date given to you. No city before it.
- If a specific company/recipient is clearly named in the input, you may use "Sehr geehrte Frau [Name]," / "Sehr geehrter Herr [Name]," instead of "Sehr geehrte Damen und Herren,". Otherwise use "Sehr geehrte Damen und Herren,".`

export async function POST(req: NextRequest) {
  let userIdForRefund: string | null = null
  let sourceForRefund: 'premium' | 'credit' | 'free_daily' | 'free_lifetime' | 'unlock' | 'always_free' | null = null
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured.' }, { status: 500 })
    }

    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const body = (await req.json()) as Body
    const letterText = (body?.letterText || '').trim().slice(0, MAX_TEXT_CHARS)
    const file = body?.file?.dataUrl ? body.file : null
    if (!letterText && !file) {
      return NextResponse.json({ error: 'Provide your letter text or a file.' }, { status: 400 })
    }

    const ent = await checkAndConsume(user.id, 'motivation')
    if (!ent.allowed) {
      const message =
        ent.reason === 'premium_daily_limit' ? 'وصلت الحد اليومي للباقة المميزة لرسائل التحفيز.' :
        ent.reason === 'no_credits'          ? 'لا تملك رصيد رسائل تحفيز. اشترِ رصيداً للمتابعة.' :
                                               'غير مسموح.'
      return NextResponse.json({ error: message, reason: ent.reason }, { status: 402 })
    }
    userIdForRefund = user.id
    sourceForRefund = ent.source

    const germanDate = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

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
          await refund(user.id, 'motivation', ent.source)
          return NextResponse.json({ error: 'File too large (max ~6MB).' }, { status: 413 })
        }
        contentBlocks.push({ type: 'text', text: `--- Uploaded motivation letter: "${file.name || 'letter'}" ---` })
        if (parsed.mediaType === 'application/pdf') {
          contentBlocks.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: parsed.base64 } })
        } else if (parsed.mediaType.startsWith('image/')) {
          contentBlocks.push({ type: 'image', source: { type: 'base64', media_type: parsed.mediaType, data: parsed.base64 } })
        }
      }
    }

    contentBlocks.push({
      type: 'text',
      text: `today_date (use exactly, no city): ${germanDate}\n\n${
        letterText
          ? `Here is the user's existing motivation letter (any language). Correct and translate it into a professional German Anschreiben following the required format:\n\n${letterText}`
          : `Read the attached motivation letter above and return a corrected, professional German Anschreiben following the required format.`
      }`,
    })

    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 2500,
      thinking: { type: 'disabled' },
      system: SYSTEM,
      messages: [{ role: 'user', content: contentBlocks as unknown as Anthropic.MessageParam['content'] }],
    })

    const letter = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim()

    if (!letter) {
      if (userIdForRefund && sourceForRefund) await refund(userIdForRefund, 'motivation', sourceForRefund)
      return NextResponse.json({ error: 'AI returned nothing. Try again.' }, { status: 502 })
    }

    return NextResponse.json({ letter, date: germanDate, source: sourceForRefund })
  } catch (e: any) {
    console.error('generate-anschreiben error:', e)
    if (userIdForRefund && sourceForRefund) await refund(userIdForRefund, 'motivation', sourceForRefund)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
