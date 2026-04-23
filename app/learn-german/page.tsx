import LevelsGrid from '@/components/learn-german/LevelsGrid'

export default function LearnGermanPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-14 text-center">
          <div className="text-5xl mb-4">🇩🇪</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">تعلم اللغة الألمانية</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            من الصفر إلى الاحتراف — دروس مبنية خصيصاً للمغاربة، من A1 إلى C1.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">اختر مستواك</h2>
        <LevelsGrid />
      </div>
    </div>
  )
}
