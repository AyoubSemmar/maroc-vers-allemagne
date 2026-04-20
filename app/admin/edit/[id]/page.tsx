import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { updateArticle } from '../../actions'
import ImageUploader from '@/components/ImageUploader'
import FAQEditor from '@/components/FAQEditor'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const categories = [
  "البنوك", "شرائح الاتصال", "السكن",
  "الجامعات", "العمل", "Ausbildung", "التأشيرة والأوراق"
]

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true'
  if (!isAuthenticated) redirect('/admin')

  const { id } = await params
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) redirect('/admin')

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-green-700">تعديل المقال</span>
          <a href="/admin" className="text-sm text-gray-500 hover:underline">العودة للوحة التحكم</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form action={updateArticle} className="flex flex-col gap-4" encType="multipart/form-data">
            <input type="hidden" name="id" value={article.id} />

            <input
              name="title"
              defaultValue={article.title}
              placeholder="العنوان"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 text-right"
            />
            <input
              name="summary"
              defaultValue={article.summary}
              placeholder="الملخص"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 text-right"
            />
            <textarea
              name="content"
              defaultValue={article.content}
              placeholder="المحتوى الكامل"
              required
              rows={8}
              className="border border-gray-300 rounded-lg px-4 py-2 text-right"
            />
            <select
              name="category"
              required
              defaultValue={article.category}
              className="border border-gray-300 rounded-lg px-4 py-2 text-right"
            >
              <option value="">اختر الفئة</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              name="date"
              type="date"
              defaultValue={article.date}
              required
              className="border border-gray-300 rounded-lg px-4 py-2"
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">صورة المقال (اتركها فارغة للإبقاء على الصورة الحالية)</label>
              {article.image_url && (
                <img src={article.image_url} alt="current" className="w-full h-48 object-cover rounded-lg mb-2" />
              )}
              <input
                name="image"
                type="file"
                accept="image/*"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <FAQEditor initial={article.faqs || []} />
            <button
              type="submit"
              className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800"
            >
              حفظ التعديلات
            </button>
          </form>
          <div className="mt-6">
            <ImageUploader />
          </div>
        </div>
      </div>
    </div>
  )
}
