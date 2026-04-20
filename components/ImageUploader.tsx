'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMarkdown('')

    const filename = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('article-images')
      .upload(filename, file, { contentType: file.type })

    if (error) {
      alert('فشل الرفع، حاول مجدداً')
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('article-images')
      .getPublicUrl(data.path)

    setMarkdown(`![](${urlData.publicUrl})`)
    setUploading(false)
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
      <h3 className="font-semibold text-gray-800 mb-4">رفع صورة داخل المقال</h3>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-white"
      />

      {uploading && (
        <p className="text-sm text-gray-500 mt-3">جاري الرفع...</p>
      )}

      {markdown && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm text-gray-600">انسخ هذا الكود والصقه في محتوى المقال:</p>
          <div className="flex gap-2 items-center">
            <code className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 text-left ltr">
              {markdown}
            </code>
            <button
              onClick={copyToClipboard}
              className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800 whitespace-nowrap"
            >
              {copied ? 'تم النسخ ✓' : 'نسخ'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
