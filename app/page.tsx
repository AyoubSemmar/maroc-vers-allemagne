import { supabase } from '@/lib/supabase'

const categories = [
  { name: "البنوك", icon: "🏦", description: "افتح حساباً بنكياً في ألمانيا" },
  { name: "شرائح الاتصال", icon: "📱", description: "ابقَ متصلاً من أول يوم" },
  { name: "السكن", icon: "🏠", description: "ابحث عن غرفة أو شقة" },
  { name: "الجامعات", icon: "🎓", description: "ادرس في ألمانيا" },
  { name: "العمل", icon: "💼", description: "ابحث عن عمل كمغربي" },
  { name: "Ausbildung", icon: "🔧", description: "برامج التدريب المهني" },
  { name: "التأشيرة والأوراق", icon: "📄", description: "التأشيرات والتصاريح والوثائق" },
];

export default async function Home() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-green-700">🇲🇦 → 🇩🇪 المغرب إلى ألمانيا</span>
          <span className="text-sm text-gray-500">دليلك للانتقال إلى ألمانيا</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            انتقل إلى ألمانيا بثقة
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            أدلة عملية مكتوبة للمغاربة — البنوك، السكن، التأشيرات، العمل، والمزيد.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">تصفح حسب الفئة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href={`/categories/${encodeURIComponent(cat.name)}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow block"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-gray-900">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Latest Articles */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">آخر المقالات</h2>
        <div className="flex flex-col gap-4">
          {articles && articles.map((article) => (
            <a
              key={article.id}
              href={`/articles/${article.id}`}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex items-center gap-4 p-4 overflow-hidden"
            >
              <div className="flex-1">
                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  {article.category}
                </span>
                <h3 className="font-semibold text-gray-900 mt-3 text-lg">{article.title}</h3>
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
  );
}
