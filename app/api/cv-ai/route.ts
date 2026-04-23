import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
  }>
  experience: Array<{
    jobTitle: string
    company: string
    location: string
    description: string
  }>
  skills: { technical: string[]; soft: string[] }
  languages: Array<{ language: string; level: string }>
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

Return ONLY a JSON object matching the exact input shape (same keys, but skills.soft and description arrays may be longer after enrichment). Do not wrap in markdown code fences. Do not add any commentary.`

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured on the server.' },
        { status: 500 }
      )
    }

    const payload = (await req.json()) as Payload
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })

    const userMessage = `Translate and correct the following CV data to professional German. Return JSON only.\n\n${JSON.stringify(payload, null, 2)}`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 6000,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMessage }],
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
      return NextResponse.json(
        { error: 'AI returned invalid JSON. Try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ data: parsed })
  } catch (e: any) {
    console.error('cv-ai error:', e)
    return NextResponse.json(
      { error: e?.message || 'Internal error' },
      { status: 500 }
    )
  }
}
