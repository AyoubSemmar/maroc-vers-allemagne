'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Link, useRouter } from '@/i18n/navigation'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/"><Logo /></Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex items-center w-full sm:max-w-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مقال أو إعلان..."
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-r-full px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded-l-full text-sm hover:bg-green-800"
          >
            🔍
          </button>
        </form>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-800 hover:bg-green-100"
              >
                <span>👤</span>
                <span className="max-w-32 truncate">{user.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                خروج
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400">دخول</Link>
              <Link href="/signup" className="bg-green-700 text-white text-sm px-4 py-2 rounded-full hover:bg-green-800">
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
