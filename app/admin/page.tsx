import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { login, logout, addArticle, deleteArticle } from './actions'
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

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true'

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-6">لوحة التحكم</h1>
          <form action={login} className="flex flex-col gap-4">
            <input
              type="password"
              name="password"
              placeholder="كلمة المرور"
              className="border border-gray-300 rounded-lg px-4 py-2 text-right"
              required
            />
            <button type="submit" className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800">
              دخول
            </button>
          </form>
        </div>
      </div>
    )
  }

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-green-700">لوحة التحكم</span>
          <div className="flex gap-4">
            <a href="/" className="text-sm text-gray-500 hover:underline">الموقع</a>
            <form action={logout}>
              <button type="submit" className="text-sm text-red-500 hover:underline">خروج</button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-12">

        {/* Add Article Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">إضافة مقال جديد</h2>
          <form action={addArticle} className="flex flex-col gap-4" encType="multipart/form-data">
            <input name="title" placeholder="العنوان" required className="border border-gray-300 rounded-lg px-4 py-2 text-right" />
            <input name="summary" placeholder="الملخص" required className="border border-gray-300 rounded-lg px-4 py-2 text-right" />
            <textarea name="content" placeholder="المحتوى الكامل" required rows={6} className="border border-gray-300 rounded-lg px-4 py-2 text-right" />
            <select name="category" required className="border border-gray-300 rounded-lg px-4 py-2 text-right">
              <option value="">اختر الفئة</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input name="date" type="date" required className="border border-gray-300 rounded-lg px-4 py-2" />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">صورة المقال (اختياري)</label>
              <input name="image" type="file" accept="image/*" className="border border-gray-300 rounded-lg px-4 py-2" />
            </div>
            <FAQEditor />
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" value="true" className="w-4 h-4 accent-yellow-400" />
              <span className="text-sm text-gray-700">⭐ مقال مميز (يظهر في أعلى الصفحة الرئيسية)</span>
            </label>
            <button type="submit" className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800">
              نشر المقال
            </button>
          </form>
          <div className="mt-6">
            <ImageUploader />
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">المقالات ({articles?.length || 0})</h2>
          <div className="flex flex-col gap-3">
            {articles && articles.map((article) => (
              <div key={article.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  {article.image_url && (
                    <img src={article.image_url} alt="" className="w-12 h-12 object-cover rounded-lg" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{article.title}</p>
                    <p className="text-xs text-gray-400">{article.category} · {article.date}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <a href={`/admin/edit/${article.id}`} className="text-sm text-green-700 hover:underline">تعديل</a>
                  <form action={deleteArticle}>
                    <input type="hidden" name="id" value={article.id} />
                    <button type="submit" className="text-sm text-red-500 hover:underline">حذف</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
