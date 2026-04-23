import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { createClient as createServerSupabase } from '@/lib/supabase-server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

const DAILY_LIMIT = 10

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10)
}

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

async function getUsage(userId: string): Promise<number> {
  const admin = adminClient()
  const { data } = await admin
    .from('photo_enhance_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('day', todayUTC())
    .maybeSingle()
  return data?.count ?? 0
}

async function bumpUsage(userId: string): Promise<number> {
  const admin = adminClient()
  const day = todayUTC()
  const current = await getUsage(userId)
  const next = current + 1
  await admin.from('photo_enhance_usage').upsert(
    { user_id: userId, day, count: next, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,day' }
  )
  return next
}

// flux-kontext-max is an image *editor*: it takes the input photo and applies
// targeted edits while leaving the rest (face, identity, body) intact.
type Hijab = 'none' | 'keep' | 'remove'
type Profession = 'office' | 'health' | 'lkw' | 'handwerk' | 'gastronomie'

function professionScene(profession: Profession): { clothing: string; background: string } {
  switch (profession) {
    case 'office':
      return {
        clothing:
          `smart business attire: a well-fitted dark business suit (charcoal grey, navy, or black) over a crisp white or light-blue collared shirt; a tie if it suits the person, or a professional blouse/blazer. Clean, tailored, corporate.`,
        background:
          `a softly blurred (bokeh) modern office interior — warm natural window light, hints of a clean workspace or glass partitions — OR a neutral light-grey studio backdrop. Photorealistic depth of field.`,
      }
    case 'health':
      return {
        clothing:
          `a clean white medical/nursing uniform — either a white medical coat over a light-blue scrub top, or white nurse scrubs with a subtle stethoscope resting on the shoulders. No ID cards with readable text.`,
        background:
          `a softly blurred modern hospital or clinic corridor with bright clean white-and-light-blue interior, warm white LED lighting. Photorealistic shallow depth of field.`,
      }
    case 'lkw':
      return {
        clothing:
          `clean casual but tidy clothing: a solid-color polo shirt, henley, or button-down shirt in navy, grey, or dark green; no suit. Realistic, practical, not formal.`,
        background:
          `the person is seated inside the driver's cabin of a modern European truck (LKW) — hands resting on or near the steering wheel, dashboard and side window visible, realistic daylight coming through the windshield, subtle cabin interior details. Photorealistic perspective of a truck driver at work.`,
      }
    case 'handwerk':
      return {
        clothing:
          `realistic German "Handwerker" workwear: a dark navy-blue or dark grey work jacket (or bib overalls / Latzhose) over a plain t-shirt, rugged and authentic — the typical outfit of an electrician, mechanic, or tradesperson. Small reinforced details, visible stitching.`,
        background:
          `a softly blurred realistic workshop / Werkstatt interior — hints of tools on a pegboard, a workbench, warm industrial lighting, slightly out of focus. Photorealistic depth of field.`,
      }
    case 'gastronomie':
      return {
        clothing:
          `clean, realistic restaurant / hospitality attire: either a crisp white chef's jacket with a subtle neckerchief (for a cook/chef look), OR a neat black waiter uniform — black button-up shirt or black vest over a white shirt with a small apron tied at the waist. Tidy, professional, freshly pressed.`,
        background:
          `a softly blurred warm restaurant or hotel interior — hints of wooden tables, ambient golden lighting, a bar counter or kitchen pass in the far background, cozy and upscale. Photorealistic shallow depth of field.`,
      }
  }
}

function buildPrompt(hijab: Hijab, profession: Profession): string {
  const { clothing, background } = professionScene(profession)

  // When hijab=keep, lead the ENTIRE prompt with the hijab rule and repeat it,
  // and explicitly decouple hijab from the clothing edit (otherwise the model
  // treats hijab as part of the outfit and regenerates it).
  if (hijab === 'keep') {
    return [
      `ABSOLUTE RULE — THE HIJAB IN THIS PHOTO IS PROTECTED. Treat the hijab/headscarf in the input image as a FIXED PHYSICAL OBJECT that must be copied pixel-by-pixel into the output without any changes. Preserve the exact silhouette, the exact outline, the exact boundary where fabric meets face, the exact position of every fold, the exact drape over the shoulders and chest, the exact way it wraps around the head, the exact coverage of the forehead, ears, neck, and chin. If the hijab is tucked under the chin in the input, keep it tucked. If it drapes loose over the shoulders in the input, keep it loose over the shoulders. If the forehead shows a specific amount of fabric, match that amount. DO NOT change how the hijab is worn. DO NOT re-tie it. DO NOT re-fold it. DO NOT change its shape.`,
      ``,
      `The ONLY permitted change to the hijab is its fabric color — you may shift it to a solid neutral professional tone (beige, soft grey, navy, or black). Nothing else about the hijab may be modified. NEVER show any hair.`,
      ``,
      `The hijab is COMPLETELY SEPARATE from "clothing" — when you replace the clothing below the neckline, you must not touch the hijab, even where it drapes over the shoulders or chest. The fabric over the shoulders is hijab fabric, not clothing.`,
      ``,
      `EDIT INSTRUCTIONS for the rest of the photo:`,
      `• Face: keep IDENTICAL — same face shape, jawline, cheekbones, eyes (shape, color, size), eyebrows, nose, mouth, lips, chin, skin tone, freckles, moles, age, ethnicity, expression style. The person must be 100% recognizable.`,
      `• Skin: preserve natural skin texture (pores, subtle imperfections). No airbrushing, no plastic smoothness.`,
      `• Clothing below the hijab drape: replace with ${clothing}`,
      `• Background: ${background}`,
      `• Lighting: soft, even, flattering professional lighting, natural color balance.`,
      ``,
      `FINAL CHECK BEFORE OUTPUT: compare the output hijab to the input hijab — they must look like the same piece of fabric worn the exact same way. If they differ in drape, fold, shape, tightness, or coverage, the output is WRONG and you must fix it. Produce a photorealistic, real-photograph-looking CV portrait (not AI-generated, not plasticky, not over-smoothed — DSLR quality).`,
    ].join(' ')
  }

  const headInstruction =
    hijab === 'remove'
      ? `Remove the hijab/headscarf. Show the person with neat, professional natural hair that matches the person's apparent hair type and color.`
      : `Preserve the EXACT same hairstyle, hair length, hair color, hair texture, and hairline as in the input photo — do not restyle the hair.`

  return [
    `Edit this photo into a photorealistic, natural-looking professional portrait. The result must look like a real photograph taken with a good DSLR camera, NOT AI-generated, NOT plasticky, NOT over-smoothed.`,
    ``,
    `STRICT PRESERVATION RULES — do not violate:`,
    `1. The person's face must remain IDENTICAL: same face shape, jawline, cheekbones, eyes (shape, color, size), eyebrows, nose, mouth, lips, chin, ears, skin tone, freckles, moles, and any distinguishing features. The person must be 100% recognizable as the same individual — same age, same ethnicity, same gender, same expression style.`,
    `2. ${headInstruction}`,
    `3. Keep realistic natural skin texture — pores, subtle imperfections, real human skin. No airbrushing, no blur, no plastic smoothness.`,
    ``,
    `EDITS TO APPLY:`,
    `4. Clothing: replace the current clothing with ${clothing}`,
    `5. Background/scene: ${background}`,
    `6. Lighting: soft, even, flattering professional lighting appropriate to the scene. Natural color balance.`,
    ``,
    `Output: a photorealistic high-resolution portrait, sharp focus on the face, shallow but realistic depth of field, LinkedIn/CV quality, looks like a real photograph.`,
  ].join(' ')
}

export async function GET() {
  // Return the user's remaining daily quota (for UI display)
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }
  const used = await getUsage(user.id)
  return NextResponse.json({
    limit: DAILY_LIMIT,
    used,
    remaining: Math.max(0, DAILY_LIMIT - used),
  })
}

export async function POST(req: NextRequest) {
  try {
    const apiToken = process.env.REPLICATE_API_TOKEN
    if (!apiToken) {
      return NextResponse.json(
        { error: 'REPLICATE_API_TOKEN not configured.' },
        { status: 500 }
      )
    }

    // Require authenticated user
    const sb = await createServerSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated. Please sign in.' },
        { status: 401 }
      )
    }

    // Enforce per-user daily rate limit (server-side, tamper-proof)
    const used = await getUsage(user.id)
    if (used >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: `Daily limit reached (${DAILY_LIMIT}/day). Try again tomorrow.`,
          limit: DAILY_LIMIT,
          used,
          remaining: 0,
        },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const image = typeof body.image === 'string' ? body.image : ''
    const hijabRaw = typeof body.hijab === 'string' ? body.hijab : 'none'
    const hijab: Hijab =
      hijabRaw === 'keep' || hijabRaw === 'remove' ? hijabRaw : 'none'
    const profRaw = typeof body.profession === 'string' ? body.profession : 'office'
    const profession: Profession =
      profRaw === 'health' || profRaw === 'lkw' || profRaw === 'handwerk' || profRaw === 'gastronomie'
        ? profRaw
        : 'office'

    if (!image || !image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image. Send a base64 data URL.' },
        { status: 400 }
      )
    }

    // Rough base64 size check (≤ 8 MB after base64 ≈ 6 MB raw)
    if (image.length > 11_000_000) {
      return NextResponse.json(
        { error: 'Image too large. Max 6 MB.' },
        { status: 413 }
      )
    }

    const replicate = new Replicate({ auth: apiToken })

    // PhotoMaker is a community model → fetch latest version, then create
    // a prediction and poll until it succeeds.
    // flux-kontext-max is an *official* Replicate model → use by model name
    // (no version hash needed).
    const finalPrompt = buildPrompt(hijab, profession)
    console.log('[enhance-photo] profession:', profession, '| hijab:', hijab)
    console.log('[enhance-photo] prompt:', finalPrompt)

    let prediction = await replicate.predictions.create({
      model: 'google/nano-banana',
      input: {
        image_input: [image],
        prompt: finalPrompt,
        output_format: 'jpg',
      },
    })

    // Poll until terminal state (succeeded, failed, canceled)
    const terminal = new Set(['succeeded', 'failed', 'canceled'])
    const startedAt = Date.now()
    while (!terminal.has(prediction.status)) {
      if (Date.now() - startedAt > 240_000) {
        return NextResponse.json({ error: 'Timeout waiting for Replicate.' }, { status: 504 })
      }
      await new Promise(r => setTimeout(r, 2000))
      prediction = await replicate.predictions.get(prediction.id)
    }

    if (prediction.status !== 'succeeded') {
      console.error('Replicate prediction failed:', prediction.status, prediction.error, prediction.logs)
      return NextResponse.json(
        { error: `Prediction ${prediction.status}: ${prediction.error || 'unknown'}` },
        { status: 502 }
      )
    }

    const output = prediction.output

    // The Replicate SDK returns a ReadableStream-like File for image models.
    // Convert to base64 data URL so the browser can display it directly.
    let dataUrl: string | null = null

    if (typeof output === 'string') {
      // Older API: URL string
      dataUrl = await fetchImageAsDataUrl(output)
    } else if (Array.isArray(output) && output[0]) {
      dataUrl = await fetchImageAsDataUrl(
        typeof output[0] === 'string' ? output[0] : (output[0] as any).url?.()
      )
    } else if (output && typeof (output as any).url === 'function') {
      const url = (output as any).url()
      dataUrl = await fetchImageAsDataUrl(typeof url === 'string' ? url : url.href)
    } else if (output && typeof (output as any).getReader === 'function') {
      // ReadableStream of bytes
      const buf = await streamToBuffer(output as any)
      dataUrl = `data:image/jpeg;base64,${buf.toString('base64')}`
    }

    if (!dataUrl) {
      return NextResponse.json(
        { error: 'Unexpected Replicate output format.' },
        { status: 502 }
      )
    }

    // Success → count this against the user's quota (only paid generations are billed)
    const newCount = await bumpUsage(user.id)
    return NextResponse.json({
      image: dataUrl,
      limit: DAILY_LIMIT,
      used: newCount,
      remaining: Math.max(0, DAILY_LIMIT - newCount),
    })
  } catch (e: any) {
    console.error('enhance-photo error:', e?.message, e?.response?.data || e)
    const detail = e?.response?.data?.detail || e?.detail || ''
    return NextResponse.json(
      { error: (e?.message || 'Internal error') + (detail ? ` — ${detail}` : '') },
      { status: 500 }
    )
  }
}

async function fetchImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Replicate fetch ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const mime = res.headers.get('content-type') || 'image/jpeg'
  return `data:${mime};base64,${buf.toString('base64')}`
}

async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  return Buffer.concat(chunks.map(c => Buffer.from(c)))
}
