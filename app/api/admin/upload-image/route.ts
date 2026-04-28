import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Server-side admin image upload endpoint.
//
// Replaces the previous client-side direct-to-Supabase upload that ran
// with the public anon key — which meant anyone holding the anon key
// (i.e. anyone who loaded the homepage) could write to the
// `article-images` bucket if its storage policy allowed anonymous
// inserts. This route requires the admin_auth cookie set by
// app/[locale]/admin/actions.js → login() and validates file shape +
// size before doing the upload server-side.
//
// Returns: { url: string } on success, { error } otherwise.
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
])
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB — generous for article hero images.

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid multipart payload' }, { status: 400 })
  }

  const file = form.get('file')
  if (!file || typeof file === 'string' || file.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `File too large (max ${MAX_BYTES / 1024 / 1024} MB)` }, { status: 413 })
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 415 })
  }

  const safeName = file.name
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
  const filename = `${Date.now()}-${safeName}`

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const arrayBuffer = await file.arrayBuffer()
  const { data, error } = await supabase.storage
    .from('article-images')
    .upload(filename, new Uint8Array(arrayBuffer), { contentType: file.type })

  if (error) {
    console.error('[admin/upload-image]', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: urlData } = supabase.storage
    .from('article-images')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: urlData.publicUrl })
}
