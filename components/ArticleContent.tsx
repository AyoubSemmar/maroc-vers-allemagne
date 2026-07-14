'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

export default function ArticleContent({ content }: { content: string }) {
  const locale = useLocale()

  // Internal links in article markdown are written locale-less
  // ("/tools/sperrkonto-calculator") — prefix the reader's locale so the
  // click stays in their language instead of bouncing through a redirect.
  function localizeHref(href?: string): string | undefined {
    if (!href || !href.startsWith('/')) return href
    const first = href.split('/')[1]
    if ((routing.locales as readonly string[]).includes(first)) return href
    return `/${locale}${href}`
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Links must LOOK clickable — Tailwind preflight strips default
        // anchor styling, so without this a tool link reads as plain text.
        a: ({ href, children }) => {
          const url = localizeHref(href)
          const internal = !!url && url.startsWith('/')
          return (
            <a
              href={url}
              {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              className="text-green-700 font-semibold underline decoration-green-400 decoration-2 underline-offset-2 hover:text-green-800 hover:decoration-green-600 transition-colors"
            >
              {children}
            </a>
          )
        },
        // GFM tables — scroll inside their own container on narrow screens so
        // the page body never scrolls horizontally on mobile.
        table: ({ children }) => (
          <div className="overflow-x-auto my-6 rounded-xl border border-gray-200">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-gray-700 text-white px-4 py-2.5 font-semibold text-start whitespace-nowrap">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2.5 border-b border-gray-100 text-gray-700">{children}</td>
        ),
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt || ''}
            className="w-full rounded-xl my-6 object-cover max-h-96"
          />
        ),
        p: ({ children }) => (
          <p className="text-gray-700 leading-8 mb-4">{children}</p>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">{children}</ul>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900">{children}</strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
