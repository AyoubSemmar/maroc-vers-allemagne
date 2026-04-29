/**
 * Admin-only: generate a hero image for an article draft via Replicate
 * (flux-schnell), upload it to the article-images Supabase bucket, and
 * return its public URL.
 *
 * Lives separate from /api/admin/generate-article so the Claude call and
 * the Replicate call don't share a Vercel function deadline. The client
 * calls this right after the article draft arrives — see
 * AdminAiArticleGenerator. If the image fails for any reason the admin
 * can still approve & publish the draft (image_url stays empty and they
 * upload one manually).
 */
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Replicate from 'replicate'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

async function requireAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

export async function POST(req: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
    }

    const apiToken = process.env.REPLICATE_API_TOKEN
    if (!apiToken) {
      return NextResponse.json({ error: 'REPLICATE_API_TOKEN missing.' }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const promptIn = typeof body?.prompt === 'string' ? body.prompt.trim() : ''
    if (!promptIn) {
      return NextResponse.json({ error: 'Missing prompt.' }, { status: 400 })
    }

    const fullPrompt = `${promptIn}, editorial photograph, soft natural light, shallow depth of field, no text, no logos, high detail`
    const replicate = new Replicate({ auth: apiToken })

    // Use predictions.create + manual polling so we can bail before the
    // function's own 60s deadline and still surface a clean error.
    let prediction = await replicate.predictions.create({
      model: 'black-forest-labs/flux-schnell',
      input: {
        prompt: fullPrompt,
        aspect_ratio: '16:9',
        output_format: 'jpg',
        output_quality: 85,
        num_outputs: 1,
      },
    })

    const terminal = new Set(['succeeded', 'failed', 'canceled'])
    const startedAt = Date.now()
    const deadlineMs = 45_000 // leave 15s for fetch + upload + response
    while (!terminal.has(prediction.status)) {
      if (Date.now() - startedAt > deadlineMs) {
        return NextResponse.json(
          { error: 'Image generation exceeded its time budget. Try again.' },
          { status: 504 },
        )
      }
      await new Promise(r => setTimeout(r, 1500))
      try {
        prediction = await replicate.predictions.get(prediction.id)
      } catch (e: any) {
        return NextResponse.json(
          { error: `Replicate poll failed: ${e?.message || 'unknown'}` },
          { status: 502 },
        )
      }
    }
    if (prediction.status !== 'succeeded') {
      return NextResponse.json(
        { error: `Replicate ${prediction.status}: ${prediction.error || 'no detail'}` },
        { status: 502 },
      )
    }

    const out: any = prediction.output
    const first = Array.isArray(out) ? out[0] : out
    if (!first) {
      return NextResponse.json({ error: 'Replicate returned no output.' }, { status: 502 })
    }

    let buffer: Buffer
    if (typeof first === 'string') {
      const r = await fetch(first)
      buffer = Buffer.from(await r.arrayBuffer())
    } else if (first instanceof ReadableStream) {
      const r = new Response(first)
      buffer = Buffer.from(await r.arrayBuffer())
    } else if (typeof first?.url === 'function') {
      const r = await fetch(first.url())
      buffer = Buffer.from(await r.arrayBuffer())
    } else {
      return NextResponse.json({ error: 'Unknown Replicate output shape.' }, { status: 502 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    )

    const filename = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
    const { data: up, error: upErr } = await supabase.storage
      .from('article-images')
      .upload(filename, buffer, { contentType: 'image/jpeg' })
    if (upErr) {
      return NextResponse.json(
        { error: `Storage upload failed: ${upErr.message}` },
        { status: 500 },
      )
    }
    const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(up.path)
    return NextResponse.json({ image_url: urlData.publicUrl, prompt_used: fullPrompt })
  } catch (e: any) {
    console.error('[generate-article-image] uncaught:', e)
    return NextResponse.json({ error: e?.message || 'Image generation failed.' }, { status: 500 })
  }
}
