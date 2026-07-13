// Renders the Document Checklist Generator inside the dashboard shell.
import type { AppLocale } from '@/i18n/routing'
import ToolSeoSection from "@/components/seo/ToolSeoSection"
import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import DocumentChecklist from '../../tools/document-checklist/DocumentChecklist'

type Props = { params: Promise<{ locale: AppLocale }> }

// documentChecklist is trimmed from the default client bundle — provide it
// explicitly or useTranslations() renders raw keys.
export default async function DashboardDocumentChecklistPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <ProvideNamespaces only={['documentChecklist']}>
        <DocumentChecklist locale={locale} />
      </ProvideNamespaces>
      <ToolSeoSection locale={locale} namespace="documentChecklist" />
    </>
  )
}
