import { supabase } from '@/lib/supabase'
import ArticlesClient from './ArticlesClient'

export const metadata = {
  title: 'المقالات — مغرب نحو ألمانيا',
  description: 'مقالات شاملة عن الهجرة، العمل، الدراسة والحياة في ألمانيا للمغاربة.',
}

export default async function ArticlesPage() {
  // Featured articles first, then by date descending
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, summary, category, date, image_url, featured')
    .order('featured', { ascending: false })
    .order('date',     { ascending: false })

  return (
    <div dir="rtl">
      {/* Page header */}
      <header className="rihla-articles-header">
        <div className="wrap">
          <p className="rihla-articles-eyebrow">📚 محتوى موثوق</p>
          <h1>المقالات</h1>
          <p className="rihla-articles-subtitle">
            دليل المغاربة إلى ألمانيا — مقالات عملية في البنوك، العمل، الجامعات، الأوزبيلدونغ والمزيد.
          </p>
          <div className="rihla-articles-stats">
            <span>📝 {articles?.length ?? 0} مقال</span>
            <span>⭐ {articles?.filter(a => a.featured).length ?? 0} مميزة</span>
          </div>
        </div>
      </header>

      <ArticlesClient articles={articles ?? []} />
    </div>
  )
}
