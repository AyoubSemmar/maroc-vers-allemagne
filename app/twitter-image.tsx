// Twitter card image — same JSX as the OG image. Next.js requires
// route segment config (runtime, size, etc.) to be declared literally
// in each file, not re-exported, so we duplicate the constants but
// reuse the rendering function.
import OgImage from './opengraph-image'

export const runtime = 'edge'
export const alt = 'GoGermany — Your guide to moving to Germany'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return OgImage()
}
