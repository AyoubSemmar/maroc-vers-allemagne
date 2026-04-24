'use client'

import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from '@/i18n/navigation'

export default function DeleteListingButton({ id }: { id: number }) {
  const t = useTranslations('listings.del')
  const supabase = createClient()
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(t('confirm'))) return
    await supabase.from('listings').delete().eq('id', id)
    router.push('/listings')
  }

  return (
    <button onClick={handleDelete} className="text-sm text-red-500 hover:underline">
      {t('button')}
    </button>
  )
}
