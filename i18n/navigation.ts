import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Locale-aware <Link>, useRouter, usePathname, etc. Use these INSTEAD of
// the ones from 'next/link' / 'next/navigation' in any file that needs to
// navigate inside the localized part of the app.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
