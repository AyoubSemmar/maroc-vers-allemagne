import AdRail from '@/components/ads/AdRail'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

// Wraps every /tools/* page in the shared ad rail (desktop sidebar +
// in-content unit on mobile) plus a visible Home / Tools breadcrumb bar.
// The full 3-level BreadcrumbList JSON-LD is emitted per-tool by RelatedTools;
// this adds the on-page trail (the leaf is the tool's own <h1> right below).
export default async function ToolsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return (
    <>
      <nav aria-label="Breadcrumb" className="max-w-3xl mx-auto px-4 pt-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm" style={{ color: 'var(--ink-soft)' }}>
          <li><Link href="/" className="hover:underline">{t('home')}</Link></li>
          <li aria-hidden style={{ opacity: 0.5 }}>/</li>
          <li>
            <Link href="/tools" className="hover:underline font-semibold" style={{ color: 'var(--ink)' }}>
              {t('tools')}
            </Link>
          </li>
        </ol>
      </nav>
      <AdRail className="py-6">{children}</AdRail>
    </>
  )
}
