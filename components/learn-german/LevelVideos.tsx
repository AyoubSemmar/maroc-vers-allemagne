'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import './level-videos.css'

// One curated YouTube playlist per CEFR level, shown on the level page
// next to the daily reading/writing challenges. videoId is the playlist's
// first video — it gives us a real thumbnail for the click-to-load facade.
const LEVEL_PLAYLISTS: Record<string, { videoId: string; playlistId: string }> = {
  A1: { videoId: 'huwi-cjPPXU', playlistId: 'PLk1fjOl39-50kWobutO8NVFzbw9PHtbbg' },
  A2: { videoId: 'qDrgJz9V2Yk', playlistId: 'PLk1fjOl39-5201BUdhtOM_x23poNvLouT' },
  B1: { videoId: '-CHCh4nXwmk', playlistId: 'PLk1fjOl39-53yooogv6RaJAK29mx7nz1d' },
  B2: { videoId: '-TflT1ZrTIg', playlistId: 'PLk1fjOl39-51lvdiuQYsLW-0aGIdNNknA' },
  C1: { videoId: 'sTbqHypqM2M', playlistId: 'PLk1fjOl39-53pjPz2VLCeu5vjOUMKZ22O' },
}

/**
 * Level video playlist card. Renders a lightweight thumbnail + play button
 * first and only mounts the YouTube <iframe> after the user clicks — no
 * third-party requests on initial load, and youtube-nocookie.com so nothing
 * is set until the user opts in.
 */
export default function LevelVideos({ level }: { level: string }) {
  const t = useTranslations('learnGerman.level')
  const [active, setActive] = useState(false)

  const v = LEVEL_PLAYLISTS[level]
  if (!v) return null

  const embedSrc = `https://www.youtube-nocookie.com/embed/${v.videoId}?autoplay=1&rel=0&modestbranding=1&list=${v.playlistId}`
  const playlistUrl = `https://www.youtube.com/playlist?list=${v.playlistId}`
  const thumb = `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`

  return (
    <section className={`lv-card lv-level-${level.toLowerCase()}`}>
      <div className="lv-head">
        <span className="lv-eyebrow"><span className="lv-eyebrow-dot" />🎬 {t('videos.eyebrow')}</span>
        <h3 className="lv-title">{t('videos.title', { level })}</h3>
        <p className="lv-sub">{t('videos.sub')}</p>
      </div>

      <div className="lv-player">
        {active ? (
          <iframe
            src={embedSrc}
            title={t('videos.title', { level })}
            className="lv-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={t('videos.play')}
            className="lv-facade"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt="" aria-hidden className="lv-thumb" loading="lazy" />
            <span className="lv-shade" aria-hidden />
            <span className="lv-play" aria-hidden>
              <svg viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
        )}
      </div>

      <a href={playlistUrl} target="_blank" rel="noopener noreferrer" className="lv-yt-link">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
        </svg>
        {t('videos.openPlaylist')} ↗
      </a>
    </section>
  )
}
