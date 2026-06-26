import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { pickNamespaces } from '@/lib/i18n-heavy'

/**
 * Re-provides a heavy, page-specific message namespace to the client on a
 * single route. The global layout strips these from the client bundle (see
 * lib/i18n-heavy); this nested provider adds the named ones back for its
 * subtree. next-intl merges nested provider messages with the parent's, so
 * other namespaces (nav, common, …) keep working inside.
 *
 * Server component — render it around a page's client subtree.
 */
export default async function ProvideNamespaces({
  only,
  children,
}: {
  only: string[]
  children: React.ReactNode
}) {
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={pickNamespaces(messages, only)}>
      {children}
    </NextIntlClientProvider>
  )
}
