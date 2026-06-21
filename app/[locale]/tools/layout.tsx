import AdRail from '@/components/ads/AdRail'

// Wraps every /tools/* page in the shared ad rail (desktop sidebar +
// in-content unit on mobile) without touching each tool page individually.
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <AdRail className="py-6">{children}</AdRail>
}
