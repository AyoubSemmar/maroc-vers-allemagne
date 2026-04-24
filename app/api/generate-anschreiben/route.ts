import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { checkAndConsume, refund } from '@/lib/entitlements'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT = `You are a professional German career assistant specialized in writing high-quality "Bewerbungsanschreiben" (motivation letters) for Ausbildung positions in Germany.

Your task is to generate a formal, natural, and convincing German motivation letter based on user input.

# 🎯 INPUT DATA
You will receive:
- full_name: (string)
- ausbildung_position: (string)
- user_background_text: (string, may be in Arabic, French, or English)
- extracted_cv_data: (structured or unstructured text extracted from the user's CV)

# 🧠 INSTRUCTIONS

## 1. Language handling
- The final output MUST be in German (B2–C1 level).
- If the user_background_text is in Arabic, French, or English: first understand and internally translate it, then use it naturally in the letter.

## 2. Structure (VERY IMPORTANT)
Follow the standard German motivation letter structure:
1. Opening (Anrede + introduction)
2. Motivation for the Ausbildung
3. Relevant experience / skills
4. Personal strengths and goals
5. Closing paragraph

## 3. Writing style
- Formal but human (NOT robotic)
- Clear and structured
- Avoid generic phrases
- Be specific and personalized
- Use natural German expressions

## 4. Personalization rules
- Use the applicant's name naturally
- Adapt the content to the ausbildung_position
- Extract relevant skills and experiences from user_background_text and extracted_cv_data
- If experience is limited: emphasize motivation, discipline, learning ability

## 5. Cultural adaptation (Germany-specific)
- Keep tone professional and modest
- Avoid exaggeration
- Be realistic and precise
- Focus on: reliability, motivation, willingness to learn

## 6. Output format
Return ONLY the final motivation letter in German.
Format — follow this EXACTLY:

[Date only — no city — right-aligned, on its own line, format: "22. April 2026"]

Sehr geehrte Damen und Herren,

...letter content...

Mit freundlichen Grüßen
[Full Name]

IMPORTANT formatting rules:
- The date goes on the FIRST line, right-aligned. Output it preceded by the marker ">>DATE>>" so it can be rendered right-aligned. Example: ">>DATE>>22. April 2026"
- Do NOT include a city before the date.
- Use the exact date provided to you — do not invent a date.

## 7. Length
- 180–250 words
- Not too long, not too short

## 8. Quality check before output
Ensure: no grammar mistakes, smooth flow, no repetition, feels like written by a human.

# 🚫 DO NOT
- Do not mention AI
- Do not explain your reasoning
- Do not output in any language other than German
- Do not invent unrealistic experiences

# ✅ GOAL
Generate a convincing German "Anschreiben" that increases the user's chances of getting an Ausbildung.`

export async function POST(req: NextRequest) {
  let userIdForRefund: string | null = null
  let sourceForRefund: 'premium' | 'credit' | 'free_daily' | 'unlock' | 'always_free' | null = null
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured.' }, { status: 500 })
    }

    // Require authenticated user
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    // Entitlement gate
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

    const formData = await req.formData()
    const fullName = (formData.get('full_name') as string || '').trim()
    const rawPosition = (formData.get('ausbildung_position') as string || '').trim()
    const gender = (formData.get('gender') as string || 'male') === 'female' ? 'female' : 'male'
    const userBackground = (formData.get('user_background_text') as string || '').trim()
    const cvFile = formData.get('cv_file') as File | null

    if (!fullName || !rawPosition || !userBackground) {
      if (userIdForRefund && sourceForRefund) await refund(userIdForRefund, 'motivation', sourceForRefund)
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    // Format today's date in German
    const today = new Date()
    const germanDate = today.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

    // Build full formal position — AI will use this exact string
    // We pass gender context so the AI uses the correct grammatical form
    const ausbildungPosition = rawPosition

    // Extract CV text if provided
    let extractedCvData = 'No CV provided.'
    if (cvFile && cvFile.size > 0) {
      try {
        const buffer = Buffer.from(await cvFile.arrayBuffer())
        const pdfMod = await import('pdf-parse')
        const pdfParse = (pdfMod as any).default ?? pdfMod
        const pdfData = await pdfParse(buffer)
        extractedCvData = pdfData?.text?.trim() || 'Could not extract CV text.'
      } catch (e) {
        console.error('PDF parse error:', e)
        extractedCvData = 'CV was uploaded but could not be parsed — using background description only.'
      }
    }

    const userMessage = `Generate a German Anschreiben for the following applicant:

full_name: ${fullName}
gender: ${gender === 'female' ? 'female (use feminine job title form, e.g. Pflegefachfrau, Kauffrau, Mechatronikerin)' : 'male (use masculine job title form, e.g. Pflegefachmann, Kaufmann, Mechatroniker)'}
ausbildung_position (raw input, expand to full formal German title based on gender): ${ausbildungPosition}
today_date (use this exactly, no city): ${germanDate}
user_background_text: ${userBackground}
extracted_cv_data: ${extractedCvData.slice(0, 3000)}`

    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const letter = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim()

    // Extract the expanded position from the first line of the letter if AI included it,
    // otherwise just return raw. The client shows it in the header.
    return NextResponse.json({ letter, date: germanDate, source: sourceForRefund })
  } catch (e: any) {
    console.error('generate-anschreiben error:', e)
    if (userIdForRefund && sourceForRefund) await refund(userIdForRefund, 'motivation', sourceForRefund)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
