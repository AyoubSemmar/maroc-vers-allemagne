'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import PasswordInput from '@/components/PasswordInput'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setErrorMsg('كلمتا المرور غير متطابقتين.')
      setStatus('error')
      return
    }
    if (password.length < 6) {
      setErrorMsg('كلمة المرور يجب أن تكون 6 أحرف على الأقل.')
      setStatus('error')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setErrorMsg('حدث خطأ أثناء تحديث كلمة المرور. حاول مجدداً.')
      setStatus('error')
    } else {
      setStatus('success')
      setTimeout(() => router.push('/login'), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-2">إعادة تعيين كلمة المرور</h1>
        <p className="text-sm text-gray-500 mb-6">اختر كلمة مرور جديدة لحسابك.</p>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
            تم تحديث كلمة المرور بنجاح! سيتم توجيهك لصفحة تسجيل الدخول...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {errorMsg}
              </div>
            )}
            <PasswordInput
              placeholder="كلمة المرور الجديدة"
              value={password}
              onChange={setPassword}
            />
            <PasswordInput
              placeholder="تأكيد كلمة المرور"
              value={confirm}
              onChange={setConfirm}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
