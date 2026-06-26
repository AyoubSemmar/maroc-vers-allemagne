import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import PrivacyPolicyContent from './PrivacyPolicyContent'

export default function PrivacyPolicyPage() {
  return (
    <ProvideNamespaces only={['static']}>
      <PrivacyPolicyContent />
    </ProvideNamespaces>
  )
}
