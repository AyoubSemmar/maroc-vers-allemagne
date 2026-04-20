import { supabase } from '@/lib/supabase'

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const categoryName = decodeURIComponent(name)

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('category', categoryName)
    .order('date', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <a href="/" className="text-sm text-green-700 hover:underline mb-6 block">
          → العودة إلى الرئيسية
        </a>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">{categoryName}</h1>

        {articles && articles.length === 0 && (
          <p className="text-gray-500">لا توجد مقالات في هذه الفئة بعد.</p>
        )}

        <div className="flex flex-col gap-4">
          {articles && articles.map((article) => (
            <a
              key={article.id}
              href={`/articles/${article.id}`}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex items-center gap-4 p-4 overflow-hidden"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{article.summary}</p>
                <p className="text-xs text-gray-400 mt-3">{article.date}</p>
              </div>
              {article.image_url && (
                <img src={article.image_url} alt={article.title} className="w-36 h-24 object-cover rounded-lg flex-shrink-0" />
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
