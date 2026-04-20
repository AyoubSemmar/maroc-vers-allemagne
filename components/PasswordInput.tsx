'use client'

import { useState } from 'react'

export default function PasswordInput({ placeholder, value, onChange }: {
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        className="border border-gray-300 rounded-lg px-4 py-2 text-right text-gray-900 w-full pl-10"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  )
}
