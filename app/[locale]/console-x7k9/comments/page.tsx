// Admin: comment moderation. Lists recent article comments with the article
// title + author, links to the live thread, and lets staff delete abuse.
import { createClient } from '@supabase/supabase-js'
import type { AppLocale } from '@/i18n/routing'
import AdminCommentsClient, { type AdminComment } from './AdminCommentsClient'

export const dynamic = 'force-dynamic'

const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

export default async function AdminCommentsPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params

  const { data: comments } = await sbAdmin
    .from('article_comments')
    .select('id,article_id,parent_id,body,author_name,like_count,dislike_count,created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  // Resolve article titles in one query.
  const articleIds = [...new Set((comments ?? []).map((c) => c.article_id))]
  const { data: articles } = articleIds.length
    ? await sbAdmin.from('articles').select('id,title').in('id', articleIds)
    : { data: [] as any[] }
  const titleById = new Map((articles ?? []).map((a: any) => [a.id, a.title]))

  const model: AdminComment[] = (comments ?? []).map((c) => ({
    id: c.id,
    articleId: c.article_id,
    articleTitle: titleById.get(c.article_id) || `#${c.article_id}`,
    body: c.body,
    author: c.author_name || '—',
    isReply: !!c.parent_id,
    score: (c.like_count || 0) - (c.dislike_count || 0),
    createdAt: (c.created_at as string)?.slice(0, 10) ?? '',
  }))

  const total = model.length
  const replies = model.filter((c) => c.isReply).length

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Comments</h1>
          <p className="adm-page-sub">Latest {total} comments across all articles ({replies} replies). Click an article to open the live thread; delete removes a comment and its replies. Deletion requires a Supabase admin session.</p>
        </div>
      </header>
      <AdminCommentsClient comments={model} locale={locale} />
    </>
  )
}
