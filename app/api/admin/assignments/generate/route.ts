import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/entitlements'
import {
  buildGenerationPrompt,
  validateMcq,
  parseJsonLoose,
  normalizeLevel,
  feedbackLocale,
  type Skill,
} from '@/lib/learn-german/assignmentAI'

export const runtime = 'nodejs'
export const maxDuration = 45

/**
 * Admin-only. Generates an AI exercise for an assignment. Returns the
 * student-facing `content` and the private `answer_key` separately so the
 * caller can store them in the two columns. Schreiben needs no generation.
 *
 * Body: { skill, level, topic?, locale? }
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 })

  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!(await isAdmin(user.id))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const skill = String(body.skill || '') as Skill
  const level = normalizeLevel(String(body.level || 'A1'))
  const locale = feedbackLocale(body.locale)
  const topic = body.topic ? String(body.topic).slice(0, 200) : undefined

  if (skill === 'schreiben') {
    return NextResponse.json({ error: 'Schreiben has no generated content.' }, { status: 400 })
  }
  if (!['grammar', 'lesen', 'hoeren'].includes(skill)) {
    return NextResponse.json({ error: 'Invalid skill.' }, { status: 400 })
  }

  try {
    const client = new Anthropic({ apiKey })
    const resp = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2600,
      temperature: 0.7,
      messages: [{ role: 'user', content: buildGenerationPrompt(skill, level, locale, topic) }],
    })
    const raw = resp.content.map(c => (c.type === 'text' ? c.text : '')).join('')

    let mcq
    try {
      mcq = validateMcq(parseJsonLoose(raw))
    } catch {
      return NextResponse.json(
        { error: 'AI returned malformed output. Please try again.' },
        { status: 502 },
      )
    }

    // Split student-facing content from the private grading key.
    const content = {
      ...(mcq.text ? { text: mcq.text } : {}),
      questions: mcq.questions,
    }
    const answer_key = { correct: mcq.correct, explanations: mcq.explanations }

    return NextResponse.json({
      title: mcq.title,
      instructions: mcq.instructions,
      content,
      answer_key,
    })
  } catch (err: any) {
    console.error('[assignments/generate]', err?.message || err)
    return NextResponse.json({ error: 'Generation failed.' }, { status: 500 })
  }
}
