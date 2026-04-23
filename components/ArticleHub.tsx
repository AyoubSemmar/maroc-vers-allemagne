import React from 'react'

interface ArticleHubProps {
  eyebrow?: string
  title: string
  subtitle?: string
  intro?: string
  children: React.ReactNode
}

export default function ArticleHub({ eyebrow, title, subtitle, intro, children }: ArticleHubProps) {
  return (
    <div dir="rtl" className="rihla-hub">
      <header className="rihla-hub-head">
        <div className="wrap">
          {eyebrow && <span className="rihla-hub-eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {subtitle && <p className="rihla-hub-sub">{subtitle}</p>}
          {intro && <p className="rihla-hub-intro">{intro}</p>}
        </div>
      </header>

      <div className="wrap rihla-hub-grid">{children}</div>
    </div>
  )
}

interface ArticleItemProps {
  num: number
  title: string
  summary?: string
  tag?: string
  children: React.ReactNode
}

export function ArticleItem({ num, title, summary, tag, children }: ArticleItemProps) {
  const id = `article-${num}`
  return (
    <article id={id} className="rihla-article-card">
      <div className="rihla-article-top">
        <span className="rihla-article-num">{num.toString().padStart(2, '0')}</span>
        {tag && <span className="rihla-article-tag">{tag}</span>}
      </div>
      <h2 className="rihla-article-title">
        <a href={`#${id}`}>{title}</a>
      </h2>
      {summary && <p className="rihla-article-lead">{summary}</p>}
      <div className="rihla-article-body">{children}</div>
    </article>
  )
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="rihla-article-list">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  )
}

export function Tip({ children, label = 'نصيحة' }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="rihla-article-tip">
      <span className="rihla-article-tip-label">{label}</span>
      <span>{children}</span>
    </div>
  )
}
