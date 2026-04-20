import { supabase } from '@/lib/supabase'
import ArticleContent from '@/components/ArticleContent'

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <p className="text-gray-500">المقال غير موجود</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-green-700">🇲🇦 → 🇩🇪 المغرب إلى ألمانيا</a>
          <span className="text-sm text-gray-500">دليلك للانتقال إلى ألمانيا</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <a href="/" className="text-sm text-green-700 hover:underline mb-6 block">
          → العودة إلى الرئيسية
        </a>

        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-72 object-cover rounded-xl mb-6"
          />
        )}

        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
          {article.category}
        </span>

        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
          {article.title}
        </h1>

        <p className="text-xs text-gray-400 mb-6">{article.date}</p>

        <p className="text-lg text-gray-600 mb-8 border-r-4 border-green-500 pr-4">
          {article.summary}
        </p>

        <ArticleContent content={article.content} />
      </div>
    </div>
  )
}
