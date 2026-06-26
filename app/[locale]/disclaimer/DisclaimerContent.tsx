'use client'

import { useTranslations } from 'next-intl'
import StaticPage, { Section, SectionText } from '@/components/StaticPage'

export default function DisclaimerContent() {
  const t = useTranslations('static.disclaimer')
  return (
    <StaticPage title={t('title')} subtitle={t('subtitle')}>
      <Section heading={t('s1_h')}>
        <SectionText>{t('s1_b')}</SectionText>
      </Section>
      <Section heading={t('s2_h')}>
        <SectionText>{t('s2_b')}</SectionText>
      </Section>
      <Section heading={t('s3_h')}>
        <SectionText>{t('s3_b')}</SectionText>
      </Section>
      <Section heading={t('s4_h')}>
        <SectionText>{t('s4_b')}</SectionText>
      </Section>
    </StaticPage>
  )
}
