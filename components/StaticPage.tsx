import React from 'react'
import { useLocale } from 'next-intl'
import { dirFor, type AppLocale } from '@/i18n/routing'

interface StaticPageProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function StaticPage({ title, subtitle, children }: StaticPageProps) {
  const locale = useLocale() as AppLocale
  return (
    <div dir={dirFor(locale)}>
      <div className="bg-green-50 border-b border-green-100 py-14 text-center">
        <h1 className="text-3xl font-bold text-green-900">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-gray-500 text-base">{subtitle}</p>
        )}
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 bg-white">
        {children}
      </div>
    </div>
  )
}

export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-3 mt-8">{heading}</h2>
      {children}
    </>
  )
}

export function SectionText({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600 leading-relaxed">{children}</p>
}

export function SectionList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc list-inside space-y-1 text-gray-600">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}
