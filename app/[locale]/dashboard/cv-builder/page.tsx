// Renders the CV builder inside the dashboard shell.
// cvBuilder is trimmed from the default client bundle — provide it explicitly
// (as the public tool page does) or useTranslations() renders raw keys.
import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import CVBuilderClient from '../../cv-builder/CVBuilderClient'
import '../../cv-builder/cv-builder.css'

export default function DashboardCVBuilderPage() {
  return (
    <ProvideNamespaces only={['cvBuilder']}>
      <CVBuilderClient />
    </ProvideNamespaces>
  )
}
