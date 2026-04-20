'use client'

import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function DeleteListingButton({ id }: { id: number }) {
  const supabase = createClient()
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return
    await supabase.from('listings').delete().eq('id', id)
    router.push('/listings')
  }

  return (
    <button onClick={handleDelete} className="text-sm text-red-500 hover:underline">
      حذف الإعلان
    </button>
  )
}
