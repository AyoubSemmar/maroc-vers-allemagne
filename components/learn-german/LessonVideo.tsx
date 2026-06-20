'use client'

import { useState } from 'react'

type Props = {
  videoId?: string
  playlistId?: string
  /** Heading, e.g. "Watch & listen" */
  title: string
  /** Sub line, e.g. "Authentic German from Easy German — A1 playlist" */
  subtitle: string
  /** "Easy German" */
  channelName: string
  /** channel URL */
  channelUrl: string
  /** Accessible label for the play button, e.g. "Play video" */
  playLabel: string
  dir: 'ltr' | 'rtl'
}

/**
 * Click-to-load YouTube facade. We render a lightweight thumbnail + play
 * button first and only mount the heavy <iframe> after the user clicks.
 * This keeps the lesson page fast (no third-party iframe on initial load)
 * and uses youtube-nocookie.com so nothing is set until the user opts in.
 */
export default function LessonVideo({
  videoId,
  playlistId,
  title,
  subtitle,
  channelName,
  channelUrl,
  playLabel,
  dir,
}: Props) {
  const [active, setActive] = useState(false)

  if (!videoId && !playlistId) return null

  const embedSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1${playlistId ? `&list=${playlistId}` : ''}`
    : `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&autoplay=1&rel=0&modestbranding=1`

  // A real thumbnail only exists for a specific video; for a playlist-only
  // embed we show a branded gradient card instead.
  const thumb = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null

  return (
    <div className="flex flex-col gap-4" dir={dir}>
      <div>
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-sm">🎬</span>
          {title}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-sm" style={{ aspectRatio: '16 / 9' }}>
        {active ? (
          <iframe
            src={embedSrc}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={playLabel}
            className="group absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumb}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-orange-500" aria-hidden />
            )}
            <span className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" aria-hidden />
            <span className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-red-600 shadow-lg group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ltr:ml-1 rtl:mr-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-gray-400 hover:text-red-600 transition-colors inline-flex items-center gap-1 self-start"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-600">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
        </svg>
        {channelName}
      </a>
    </div>
  )
}
