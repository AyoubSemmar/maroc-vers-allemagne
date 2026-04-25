'use client'
import { useTranslations } from 'next-intl'
import LockedStub from '@/components/dashboard/LockedStub'

export default function CulturePage() {
  const t = useTranslations('dashboard.sidebar')
  return <LockedStub feature={t('culture')} />
}
