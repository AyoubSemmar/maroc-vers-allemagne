import DashShell from '@/components/dashboard/DashShell'

// DashShell lives in the shared layout so that navigating between dashboard
// pages only swaps the content area — no sidebar/topbar re-mount, no re-fetch.
// Each child page is a plain node and consumes the shell state via useShell().
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashShell>{children}</DashShell>
}
