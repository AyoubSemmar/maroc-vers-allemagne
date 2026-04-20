'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

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
    <nav className="bg-white border-b border-gray-200" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <a href="/" className="text-xl font-bold text-green-700 shrink-0">🇲🇦 → 🇩🇪 المغرب إلى ألمانيا</a>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex items-center w-full sm:max-w-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مقال أو إعلان..."
            className="w-full border border-gray-300 rounded-r-full px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded-l-full text-sm hover:bg-green-800"
          >
            🔍
          </button>
        </form>

        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <a
                href="/profile"
                className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-800 hover:bg-green-100"
              >
                <span>👤</span>
                <span className="max-w-32 truncate">{user.email}</span>
              </a>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                خروج
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a href="/login" className="text-sm text-gray-600 hover:text-green-700">دخول</a>
              <a href="/signup" className="bg-green-700 text-white text-sm px-4 py-2 rounded-full hover:bg-green-800">
                إنشاء حساب
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
