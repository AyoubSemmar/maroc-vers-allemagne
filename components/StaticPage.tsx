import React from 'react'
import { useLocale } from 'next-intl'
import { dirFor, type AppLocale } from '@/i18n/routing'

interface StaticPageProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

/**
 * Wrapper for editorial-style static pages (about, contact, housing,
 * useful-links). Matches the rest of the site's brand: warm hero
 * background, Fraunces display title, navy/orange theme via CSS
 * variables — both light and dark mode supported.
 *
 * Replaces the previous Tailwind-hardcoded green/white design that
 * looked like a different site than the rest of GoGermany.
 */
export default function StaticPage({ title, subtitle, children }: StaticPageProps) {
  const locale = useLocale() as AppLocale
  return (
    <div dir={dirFor(locale)} className="rihla rihla-static">
      <header className="rihla-static-hero">
        <div className="wrap">
          <h1 className="rihla-static-title">{title}</h1>
          {subtitle && <p className="rihla-static-sub">{subtitle}</p>}
        </div>
      </header>
      <div className="rihla-static-body">
        <div className="wrap">{children}</div>
      </div>
    </div>
  )
}

export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="rihla-static-section">
      <h2 className="rihla-static-h2">{heading}</h2>
      {children}
    </section>
  )
}

export function SectionText({ children }: { children: React.ReactNode }) {
  return <p className="rihla-static-text">{children}</p>
}

export function SectionList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="rihla-static-list">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}
