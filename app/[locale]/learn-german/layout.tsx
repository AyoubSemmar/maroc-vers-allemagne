import type { Metadata, Viewport } from 'next'
import PwaController from '@/components/pwa/PwaController'
import AppBottomNav from '@/components/pwa/AppBottomNav'

// App-mode metadata, scoped to the course (not the whole marketing site):
//  - apple-mobile-web-app-* so iOS launches /learn-german full-screen
//  - the apple-touch icon
//  - theme-color for the mobile browser/app title bar
// The manifest <link> itself is injected site-wide by app/manifest.ts.
export const viewport: Viewport = {
  themeColor: '#E85F2C',
}

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    title: 'Deutsch',
    statusBarStyle: 'default',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
}

export default function LearnGermanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* SW registration + install prompt + standalone detection. */}
      <PwaController />
      {/* App tab bar — only visible once installed (display:none otherwise). */}
      <AppBottomNav />
    </>
  )
}
