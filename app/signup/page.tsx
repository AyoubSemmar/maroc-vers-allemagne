'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import PasswordInput from '@/components/PasswordInput'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })
    if (error) {
      setMessage('error:حدث خطأ: ' + error.message)
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      setMessage('error:هذا البريد الإلكتروني مرتبط بحساب موجود بالفعل. يمكنك تسجيل الدخول.')
    } else {
      setMessage('success:تم إرسال رابط التحقق إلى بريدك الإلكتروني. تحقق من صندوق الوارد!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm">
        <a href="/" className="text-green-700 text-sm hover:underline block mb-6">→ العودة للرئيسية</a>
        <h1 className="text-xl font-bold text-gray-900 mb-6">إنشاء حساب جديد</h1>

        {message ? (
          <div className={`rounded-lg p-4 text-sm ${message.startsWith('error:') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-800'}`}>
            {message.replace(/^(error|success):/, '')}
            {message.startsWith('error:') && (
              <a href="/login" className="block mt-2 font-medium underline">تسجيل الدخول</a>
            )}
          </div>
        ) : (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              type="email"
              dir="ltr"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 text-right text-gray-900"
            />
            <PasswordInput
              placeholder="كلمة المرور (6 أحرف على الأقل)"
              value={password}
              onChange={setPassword}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </button>
            <p className="text-sm text-center text-gray-500">
              لديك حساب؟{' '}
              <a href="/login" className="text-green-700 hover:underline">تسجيل الدخول</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
