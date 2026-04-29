/**
 * Admin-only: persist an AI-generated draft article to the DB.
 *
 * Called from <AdminAiArticleGenerator> when the admin clicks "Approve".
 * Mirrors the shape used by the existing addArticle server action so
 * any code that reads articles continues to work unchanged:
 *   • Arabic text in title/summary/content/faqs columns
 *   • fr/en/de packed into the `translations` JSONB
 */
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

async function requireAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

export async function POST(req: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    if (!body || !body.draft) {
      return NextResponse.json({ error: 'Missing draft.' }, { status: 400 })
    }
    const d = body.draft

    if (!d.title || !d.summary || !d.content || !d.category || !d.date) {
      return NextResponse.json({ error: 'Draft is missing required fields.' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    )

    const row = {
      title:        d.title,
      summary:      d.summary,
      content:      d.content,
      category:     d.category,
      date:         d.date,
      image_url:    d.image_url || null,
      faqs:         Array.isArray(d.faqs) ? d.faqs : [],
      featured:     false,
      translations: d.translations || null,
    }

    const { data, error } = await supabase
      .from('articles')
      .insert([row])
      .select('id')
      .single()

    if (error) {
      console.error('[save-article] insert failed:', error)
      return NextResponse.json(
        { error: `${error.message}${error.details ? ' — ' + error.details : ''}` },
        { status: 500 },
      )
    }

    revalidatePath('/console-x7k9/content')
    revalidatePath('/articles')
    revalidatePath(`/articles/${data.id}`)

    return NextResponse.json({ id: data.id })
  } catch (e: any) {
    console.error('[save-article] uncaught:', e)
    return NextResponse.json({ error: e?.message || 'Save failed.' }, { status: 500 })
  }
}
