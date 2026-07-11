'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ArticleContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
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
