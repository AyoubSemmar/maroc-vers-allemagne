'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'

type Props = {
  /** Which path this consultation belongs to ("ausbildung" | "studium"). */
  path: 'ausbildung' | 'studium'
}

export default function ConsultationForm({ path }: Props) {
  const t = useTranslations('landing.pathHub.shared')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setStatus('loading')
    const supabase = createClient()
    // Interface only — table may or may not exist; swallow errors gracefully
    const { error } = await supabase.from('consultations').insert([
      {
        path,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        message: message.trim() || null,
      },
    ])
    if (error && error.code !== '42P01') {
      // 42P01 = table does not exist -> still show success in "interface-only" mode
      setStatus('error')
      return
    }
    setStatus('success')
    setName('')
    setEmail('')
    setPhone('')
    setMessage('')
  }

  return (
    <div className="consult-card reveal">
      <div className="consult-head">
        <h3>{t('consultTitle')}</h3>
        <p>{t('consultSub')}</p>
      </div>
      {status === 'success' ? (
        <div className="consult-success">✓ {t('consultSuccess')}</div>
      ) : (
        <form className="consult-form" onSubmit={submit}>
          <div className="consult-row">
            <label>
              <span>{t('consultName')}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              <span>{t('consultEmail')}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
            </label>
          </div>
          <label>
            <span>{t('consultPhone')}</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
            />
          </label>
          <label>
            <span>{t('consultMsg')}</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </label>
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? t('consultSending') : t('consultSubmit')}
          </button>
          {status === 'error' && (
            <small className="consult-err">{t('consultError')}</small>
          )}
        </form>
      )}
    </div>
  )
}
