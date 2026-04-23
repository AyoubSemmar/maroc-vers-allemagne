'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

// Routes where the shared Navbar should NOT render (those routes provide their own).
const HIDDEN_ROUTES = ['/']

export default function NavbarGate() {
  const pathname = usePathname()
  if (HIDDEN_ROUTES.includes(pathname)) return null
  return <Navbar />
}
