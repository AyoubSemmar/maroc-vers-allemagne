'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  { label: 'أتعلم اللغة الألمانية حالياً',          icon: '📚', href: '/learn-german' },
  { label: 'أبحث عن أوزبيلدونغ',                   icon: '🔧', href: '/ausbildung' },
  { label: 'أبحث عن جامعة للدراسة',                 icon: '🎓', href: '/universities' },
  { label: 'أبحث عن عمل',                           icon: '💼', href: '/jobs' },
  { label: 'أريد معرفة الأوراق والتأشيرات المطلوبة', icon: '📄', href: '/visa' },
  { label: 'أبحث عن سكن أو غرفة',                   icon: '🏠', href: '/listings' },
  { label: 'أريد فتح حساب بنكي',                    icon: '🏦', href: '/banking' },
  { label: 'أريد شريحة هاتف ألمانية',               icon: '📱', href: '/categories/شرائح الاتصال' },
]

export default function JourneyModal() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const router = useRouter()

  function handleGo() {
    if (selected === null) return
    setOpen(false)
    router.push(steps[selected].href)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => { setOpen(true); setSelected(null) }}
        className="border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 text-base transition-colors"
      >
        تصفح الأدوات
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          {/* Modal */}
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" dir="rtl">

            {/* Header */}
            <div className="bg-green-800 px-6 py-5">
              <h2 className="text-xl font-black text-white">أين أنت في رحلتك؟</h2>
              <p className="text-green-200 text-sm mt-1">اختر خطوتك الحالية وسنأخذك مباشرة للأداة المناسبة.</p>
            </div>

            {/* Steps list */}
            <div className="px-4 py-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
              {steps.map((step, i) => {
                const isSelected = selected === i
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`flex items-center gap-4 w-full text-right px-4 py-3.5 rounded-2xl border-2 transition-all duration-150
                      ${isSelected
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white'
                      }`}
                  >
                    {/* Checkbox */}
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
                      ${isSelected ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}
                    >
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    <span className="text-xl">{step.icon}</span>

                    <span className={`text-sm font-semibold flex-1 ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>
                      {step.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-4 pb-5 pt-2 flex gap-3">
              <button
                onClick={handleGo}
                disabled={selected === null}
                className="flex-1 bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base"
              >
                انطلق ←
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
