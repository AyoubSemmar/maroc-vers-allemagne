import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import DisclaimerContent from './DisclaimerContent'

// Server wrapper: the 'static' namespace (~86 KB) is stripped from the global
// client bundle (lib/i18n-heavy); re-provide it here for the legal pages only.
export default function DisclaimerPage() {
  return (
    <ProvideNamespaces only={['static']}>
      <DisclaimerContent />
    </ProvideNamespaces>
  )
}
