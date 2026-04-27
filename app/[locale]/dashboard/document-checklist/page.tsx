// Renders the Document Checklist Generator inside the dashboard shell.
import type { AppLocale } from '@/i18n/routing'
import DocumentChecklist from '../../tools/document-checklist/DocumentChecklist'

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardDocumentChecklistPage({ params }: Props) {
  const { locale } = await params
  return <DocumentChecklist locale={locale} />
}
