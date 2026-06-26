import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import TermsOfUseContent from './TermsOfUseContent'

export default function TermsOfUsePage() {
  return (
    <ProvideNamespaces only={['static']}>
      <TermsOfUseContent />
    </ProvideNamespaces>
  )
}
