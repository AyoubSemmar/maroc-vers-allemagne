/**
 * Admin-only: generate a full Learn-German lesson in Arabic + 3 translations.
 *
 * Output matches the Lesson schema in lib/german-data/types.ts so the
 * resulting JSON can be pasted straight into:
 *   - lib/german-data/<level>.ts            (Arabic source)
 *   - lib/german-data/translations/<level>.<locale>.json   (FR/EN/DE overlays)
 *
 * Two-call pipeline (mirrors generate-article):
 *   1. Generate the Arabic source lesson (grammar, vocabulary, exercise)
 *   2. (caller) Translate to FR/EN/DE via /api/admin/translate-lesson
 *
 * Each call sits comfortably inside Vercel's 60s deadline.
 */
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 60

const VALID_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1'] as const
type Level = (typeof VALID_LEVELS)[number]

async function requireAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

function parseJsonLoose(s: string): any {
  const cleaned = s.replace(/```json\s*|\s*```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('No JSON object found in model output')
  return JSON.parse(cleaned.slice(first, last + 1))
}

function buildPrompt(level: Level, lessonId: string, order: number, topic: string, grammarFocus: string) {
  return `You are a senior German-language curriculum author for gogermany.ma — the platform that helps Moroccans pass Goethe ${level.toUpperCase()}. Write ONE complete lesson in ARABIC ONLY (Modern Standard Arabic, Darija-friendly). Translations are handled in a separate step — DO NOT translate.

Lesson context:
  • Level: ${level.toUpperCase()}
  • Lesson id: "${lessonId}"
  • Lesson order (1-12): ${order}
  • Topic: ${topic}
  • Grammar focus: ${grammarFocus}

Quality bar — STRICT:
  • Grammar block must include 1-3 PARADIGM TABLES with proper headers/rows. Tables show real conjugations, declensions, or article forms.
  • Add 2-4 RULE CARDS (rule + example + Arabic translation).
  • Add 6-10 EXAMPLES — full German sentences each followed by " — " and Arabic translation.
  • Vocabulary list: 30-40 items. Mix the core grammar verbs (must-haves for the topic) with thematic expansion vocabulary — synonyms, opposites, common collocations a Moroccan learner will hit at this level. Each item gets german/arabic/example/exampleArabic/type. For nouns include gender (der/die/das) and the plural form when irregular.
  • Exercise: EXACTLY 20 questions covering all 5 types. Distribution: 6× fill-blank (2 of which include audioPrompt for listening), 6× multiple-choice, 3× matching, 3× drag-drop, 2× speaking. Mix harder questions toward the end (q15-q20) so learners build up.
  • Tone: warm, practical, confidence-building. Avoid academic German labels — use Moroccan-friendly explanations.
  • German vocabulary uses Latin script as-is; Arabic body uses ؟ ، ؛ « » (never ASCII punctuation in Arabic).

Lesson schema (return EXACTLY this shape, valid JSON, no commentary):
{
  "id": "${lessonId}",
  "title": "ARABIC TITLE — German Title (e.g., 'الأفعال الناقصة — Modalverben')",
  "order": ${order},
  "grammar": {
    "title": "ARABIC TITLE for the grammar block",
    "content": "Arabic markdown explanation. Use **bold** for German words. 4-8 short paragraphs.",
    "tables": [
      {
        "title": "ARABIC TABLE TITLE",
        "headers": ["Pronomen", "...", "المعنى"],
        "rows": [
          { "cells": ["ich", "...", "أنا..."] },
          ...
        ],
        "theme": "conjugation",
        "note": "Arabic note explaining when this paradigm matters."
      }
    ],
    "rules": [
      { "rule": "Arabic rule statement", "example": "German example sentence.", "translation": "Arabic translation." }
    ],
    "examples": [
      "Ich kann Deutsch sprechen. — أستطيع التحدث بالألمانية.",
      ... 6-10 entries ...
    ],
    "tip": "One golden tip in Arabic — practical, memorable."
  },
  "vocabulary": [
    {
      "german": "können",
      "arabic": "يستطيع",
      "example": "Ich kann gut schwimmen.",
      "exampleArabic": "أستطيع السباحة جيداً.",
      "type": "verb"
    }
  ],
  "exercise": {
    "questions": [
      { "type": "fill-blank", "id": "${lessonId}-q1", "question": "Arabic instructions then the gap sentence.", "answer": "auf", "hint": "Arabic hint." },
      { "type": "multiple-choice", "id": "${lessonId}-q2", "question": "Arabic question.", "options": ["...","...","...","..."], "answer": "..." },
      { "type": "matching", "id": "${lessonId}-q3", "question": "Arabic instructions.", "pairs": [{"left":"...","right":"..."}], "answer": "matched" },
      { "type": "drag-drop", "id": "${lessonId}-q4", "question": "Arabic instructions.", "words": ["...","...","..."], "answer": "Full ordered sentence." },
      { "type": "speaking", "id": "${lessonId}-q5", "question": "Arabic prompt to say in German.", "answer": "German sentence the user should say." },
      ... up to q10 ...
    ]
  }
}`
}

export async function POST(req: NextRequest) {
  const tStart = Date.now()
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
    }
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY missing.' }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const level = String(body?.level || '').toLowerCase()
    if (!VALID_LEVELS.includes(level as any)) {
      return NextResponse.json({ error: `level must be one of ${VALID_LEVELS.join(', ')}` }, { status: 400 })
    }
    const lessonId = String(body?.lessonId || '').trim()
    if (!/^[a-c][12]-[0-9]{2}$/.test(lessonId)) {
      return NextResponse.json({ error: 'lessonId must look like "a1-13", "b2-04", etc.' }, { status: 400 })
    }
    const order = Number(body?.order)
    if (!Number.isInteger(order) || order < 1 || order > 30) {
      return NextResponse.json({ error: 'order must be an integer 1-30' }, { status: 400 })
    }
    const topic = String(body?.topic || '').trim()
    const grammarFocus = String(body?.grammarFocus || '').trim()
    if (!topic || !grammarFocus) {
      return NextResponse.json({ error: 'topic and grammarFocus are required' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })
    // 9000 max_tokens to fit 30-40 vocab + 20 exercises comfortably.
    const resp = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 9000,
      temperature: 0.5,
      messages: [{ role: 'user', content: buildPrompt(level as Level, lessonId, order, topic, grammarFocus) }],
    })

    const text = resp.content.map(c => (c.type === 'text' ? c.text : '')).join('')
    let lesson: any
    try {
      lesson = parseJsonLoose(text)
    } catch (e: any) {
      console.error('[generate-lesson] JSON parse failed:', e?.message, text.slice(0, 400))
      return NextResponse.json({ error: 'AI returned malformed output. Try again.' }, { status: 502 })
    }

    // Shape guard — fail loud rather than ship a half-broken lesson.
    const need = ['id', 'title', 'order', 'grammar', 'vocabulary', 'exercise']
    for (const k of need) if (!lesson[k]) {
      return NextResponse.json({ error: `AI omitted "${k}"` }, { status: 502 })
    }
    if (!Array.isArray(lesson.grammar?.examples) || lesson.grammar.examples.length < 4) {
      return NextResponse.json({ error: 'grammar.examples must have ≥4 entries' }, { status: 502 })
    }
    if (!Array.isArray(lesson.vocabulary) || lesson.vocabulary.length < 25) {
      return NextResponse.json(
        { error: `vocabulary must have ≥25 entries (got ${lesson.vocabulary?.length ?? 0}). Regenerate.` },
        { status: 502 },
      )
    }
    if (!Array.isArray(lesson.exercise?.questions) || lesson.exercise.questions.length < 18) {
      return NextResponse.json(
        { error: `exercise.questions must have ≥18 entries (got ${lesson.exercise?.questions?.length ?? 0}). Regenerate.` },
        { status: 502 },
      )
    }

    return NextResponse.json({ lesson, level, elapsedMs: Date.now() - tStart })
  } catch (e: any) {
    console.error('[generate-lesson] uncaught:', e)
    return NextResponse.json({ error: e?.message || 'Generation failed.' }, { status: 500 })
  }
}
