'use client'

/**
 * Outbound WhatsApp link with a GA4 conversion event on click.
 *
 * Server components can't attach onClick handlers, so any place we want
 * to fire `whatsapp_click` from a server-rendered page (listing detail,
 * contact page, etc.) wraps the link in this client component.
 *
 * `source` says where on the site the click came from — listing page,
 * contact form, etc. Surfaces in GA4 as the event's `source` parameter
 * so we can tell which surfaces drive WhatsApp outreach.
 */
import { trackWhatsappClick } from '@/lib/analytics'

export default function WhatsappLink({
  href,
  source,
  className,
  children,
}: {
  href: string
  source: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackWhatsappClick(source)}
    >
      {children}
    </a>
  )
}
