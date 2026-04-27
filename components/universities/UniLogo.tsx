'use client'

import { useState } from 'react'

type Props = {
  src: string | null
  fallback: string
  fallbackClassName?: string
}

// Wikimedia Commons logos sometimes 404 or return SVGs that fail to render.
// Track the load failure on the client and swap to a letter placeholder.
export default function UniLogo({ src, fallback, fallbackClassName }: Props) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <span className={fallbackClassName}>{fallback}</span>
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}
