import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { dirFor, type AppLocale } from '@/i18n/routing'

export type HubItem = {
  num: number
  title: string
  summary?: string
  tag?: string
  paragraph?: string
  paragraphs?: string[]
  bullets?: string[]
  tip?: string
}

export type HubData = {
  eyebrow?: string
  title: string
  subtitle?: string
  intro?: string
  items: HubItem[]
}

// Render a string with light **bold** markdown into JSX.
function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    const m = /^\*\*([^*]+)\*\*$/.exec(p)
    if (m) return <strong key={i}>{m[1]}</strong>
    return <span key={i}>{p}</span>
  })
}

export default async function ContentHub({
  data,
  locale,
  tipLabelKey = 'common.tipLabel',
}: {
  data: HubData
  locale: AppLocale
  tipLabelKey?: string
}) {
  // Resolve tip label via translations — fallback gracefully.
  let tipLabel = 'Tip'
  try {
    const ns = tipLabelKey.split('.')[0]
    const key = tipLabelKey.slice(ns.length + 1)
    const t = await getTranslations({ locale, namespace: ns })
    tipLabel = t(key as any)
  } catch {}

  return (
    <div dir={dirFor(locale)} className="rihla-hub">
      <header className="rihla-hub-head">
        <div className="wrap">
          {data.eyebrow && <span className="rihla-hub-eyebrow">{data.eyebrow}</span>}
          <h1>{data.title}</h1>
          {data.subtitle && <p className="rihla-hub-sub">{data.subtitle}</p>}
          {data.intro && <p className="rihla-hub-intro">{data.intro}</p>}
        </div>
      </header>

      <div className="wrap rihla-hub-grid">
        {data.items.map((item) => {
          const id = `article-${item.num}`
          const paragraphs = item.paragraphs ?? (item.paragraph ? [item.paragraph] : [])
          return (
            <article key={item.num} id={id} className="rihla-article-card">
              <div className="rihla-article-top">
                <span className="rihla-article-num">{item.num.toString().padStart(2, '0')}</span>
                {item.tag && <span className="rihla-article-tag">{item.tag}</span>}
              </div>
              <h2 className="rihla-article-title">
                <a href={`#${id}`}>{item.title}</a>
              </h2>
              {item.summary && <p className="rihla-article-lead">{item.summary}</p>}
              <div className="rihla-article-body">
                {paragraphs.map((p, i) => (
                  <p key={`p-${i}`}>{renderInline(p)}</p>
                ))}
                {item.bullets && item.bullets.length > 0 && (
                  <ul className="rihla-article-list">
                    {item.bullets.map((b, i) => (
                      <li key={`b-${i}`}>{renderInline(b)}</li>
                    ))}
                  </ul>
                )}
                {item.tip && (
                  <div className="rihla-article-tip">
                    <span className="rihla-article-tip-label">{tipLabel}</span>
                    <span>{renderInline(item.tip)}</span>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
