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
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-gate'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const gate = await requireAdmin()
    if (!gate.ok) return gate.response

    const body = await req.json().catch(() => null)
    if (!body || !body.draft) {
      return NextResponse.json({ error: 'Missing draft.' }, { status: 400 })
    }
    const d = body.draft

    if (!d.title || !d.summary || !d.content || !d.category || !d.date) {
      return NextResponse.json({ error: 'Draft is missing required fields.' }, { status: 400 })
    }

    // Reject categories outside the canonical list. Otherwise an off-list
    // value (AI hallucination, manual edit, copy-paste accident) would
    // leak into the DB and create a phantom filter pill on /articles.
    const VALID_CATEGORIES = [
      'البنوك', 'شرائح الاتصال', 'السكن',
      'الجامعات', 'العمل', 'Ausbildung', 'التأشيرة والأوراق',
    ]
    if (!VALID_CATEGORIES.includes(d.category)) {
      return NextResponse.json(
        { error: `Category "${d.category}" is not in the canonical list. Edit the category in the preview pane and try again.` },
        { status: 400 },
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    )

    // Strip translation slots that are still empty (translation step
    // failed / was skipped). The localizer (lib/i18n-content.ts) uses
    // `??` so empty strings would override the Arabic source — better
    // to omit the slot entirely and let the fallback handle it.
    const cleanTranslations: Record<string, any> = {}
    if (d.translations && typeof d.translations === 'object') {
      for (const lang of ['fr', 'en', 'de', 'es'] as const) {
        const t = d.translations[lang]
        if (t && t.title && t.content) {
          cleanTranslations[lang] = t
        }
      }
    }

    const row = {
      title:        d.title,
      summary:      d.summary,
      content:      d.content,
      category:     d.category,
      date:         d.date,
      image_url:    d.image_url || null,
      faqs:         Array.isArray(d.faqs) ? d.faqs : [],
      featured:     false,
      translations: Object.keys(cleanTranslations).length ? cleanTranslations : null,
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

    // Revalidate every locale-prefixed route. revalidatePath('/articles')
    // alone DOES NOT match /[locale]/articles in Next.js — the dynamic
    // segment needs the page-pattern form, but that requires Next 15+
    // syntax that isn't perfectly stable across versions, so we fall
    // back to listing every locale explicitly. Belt and braces: also
    // call the bare paths in case future Next versions match them.
    revalidatePath('/console-x7k9/content')
    revalidatePath('/articles')
    revalidatePath(`/articles/${data.id}`)
    for (const l of ['ar', 'fr', 'en', 'de', 'es']) {
      revalidatePath(`/${l}/articles`)
      revalidatePath(`/${l}/articles/${data.id}`)
    }

    // Echo back the row's identifying fields so the admin can verify
    // straight from the network response that the insert really
    // happened (eg. compare against the Supabase Table Editor).
    return NextResponse.json({
      id: data.id,
      title: row.title,
      category: row.category,
      date: row.date,
      direct_url_ar: `/ar/articles/${data.id}`,
    })
  } catch (e: any) {
    console.error('[save-article] uncaught:', e)
    return NextResponse.json({ error: e?.message || 'Save failed.' }, { status: 500 })
  }
}
