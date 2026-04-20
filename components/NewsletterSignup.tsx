'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: email.trim().toLowerCase() }])

    if (!error) {
      setStatus('success')
      setEmail('')
    } else if (error.code === '23505') {
      setStatus('duplicate')
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="bg-green-700 py-16" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          ابقَ على اطلاع دائم
        </h2>
        <p className="text-green-100 mb-8 text-sm">
          اشترك في نشرتنا البريدية واحصل على أحدث الأدلة والنصائح للانتقال إلى ألمانيا مباشرة في بريدك.
        </p>

        {status === 'success' ? (
          <div className="bg-white/20 rounded-2xl px-6 py-4 text-white font-medium">
            ✅ تم تسجيلك بنجاح! سنراسلك قريباً.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              required
              className="flex-1 max-w-sm px-5 py-3 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full text-sm hover:bg-green-50 transition-colors disabled:opacity-60"
            >
              {status === 'loading' ? '...' : 'اشترك الآن'}
            </button>
          </form>
        )}

        {status === 'duplicate' && (
          <p className="text-yellow-200 text-sm mt-3">هذا البريد مسجل مسبقاً 😊</p>
        )}
        {status === 'error' && (
          <p className="text-red-200 text-sm mt-3">حدث خطأ، حاول مرة أخرى.</p>
        )}

        <p className="text-green-200 text-xs mt-6">لن نشارك بريدك مع أي جهة. يمكنك إلغاء الاشتراك في أي وقت.</p>
      </div>
    </div>
  )
}
