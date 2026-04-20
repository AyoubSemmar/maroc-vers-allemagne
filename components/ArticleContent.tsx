'use client'

import ReactMarkdown from 'react-markdown'

export default function ArticleContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
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
