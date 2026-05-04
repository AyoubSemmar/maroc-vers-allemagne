'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import JsonLd from '@/components/seo/JsonLd'

type FAQ = { q: string; a: string }

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const t = useTranslations('articles.faq')
  const [open, setOpen] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) return null

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      {/* FAQPage schema for the per-article FAQ. Pairs with the
          one on the landing page so Google can surface FAQ rich
          results for both the homepage and individual articles. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      <h2 className="text-xl font-bold text-gray-900 mb-6">{t('title')}</h2>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-right bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">{faq.q}</span>
              <span className="text-green-700 text-lg mr-3">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <div className="px-5 py-4 bg-gray-50 text-gray-600 text-sm leading-relaxed border-t border-gray-200">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
