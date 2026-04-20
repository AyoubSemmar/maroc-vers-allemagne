'use client'

import { useState } from 'react'

type FAQ = { q: string; a: string }

export default function FAQEditor({ initial = [] }: { initial?: FAQ[] }) {
  const [faqs, setFaqs] = useState<FAQ[]>(initial)

  function add() {
    setFaqs([...faqs, { q: '', a: '' }])
  }

  function remove(i: number) {
    setFaqs(faqs.filter((_, idx) => idx !== i))
  }

  function update(i: number, field: 'q' | 'a', value: string) {
    const updated = [...faqs]
    updated[i][field] = value
    setFaqs(updated)
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">الأسئلة الشائعة (اختياري)</label>

      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 bg-gray-50">
          <input
            type="text"
            placeholder="السؤال"
            value={faq.q}
            onChange={(e) => update(i, 'q', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-right w-full text-gray-900"
          />
          <textarea
            placeholder="الجواب"
            value={faq.a}
            onChange={(e) => update(i, 'a', e.target.value)}
            rows={2}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-right w-full text-gray-900"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-xs text-red-500 hover:underline self-end"
          >
            حذف هذا السؤال
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="border border-dashed border-green-400 text-green-700 rounded-lg px-4 py-2 text-sm hover:bg-green-50"
      >
        + إضافة سؤال
      </button>

      {/* Hidden input that sends the JSON to the server action */}
      <input type="hidden" name="faqs" value={JSON.stringify(faqs)} />
    </div>
  )
}
