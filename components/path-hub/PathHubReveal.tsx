'use client'

import { useEffect } from 'react'

/**
 * Enables the `.reveal -> .in` fade-in pattern on the Path Hub pages.
 * Without this, anything with `.reveal` stays at opacity 0 because the
 * IntersectionObserver on the homepage does not exist here.
 */
export default function PathHubReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.path-hub .reveal')
    if (els.length === 0) return

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in')
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => io.observe(el))

    return () => io.disconnect()
  }, [])

  return null
}
