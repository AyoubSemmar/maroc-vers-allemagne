'use client'

import { useTranslations } from 'next-intl'
import StaticPage, { Section, SectionText, SectionList } from '@/components/StaticPage'

export default function UsefulLinksPage() {
  const t = useTranslations('static.usefulLinks')
  return (
    <StaticPage title={t('title')} subtitle={t('subtitle')}>
      <Section heading={t('s1_h')}>
        <SectionList items={[t('s1_i1'), t('s1_i2'), t('s1_i3'), t('s1_i4')]} />
      </Section>
      <Section heading={t('s2_h')}>
        <SectionList items={[t('s2_i1'), t('s2_i2'), t('s2_i3')]} />
      </Section>
      <Section heading={t('s3_h')}>
        <SectionList items={[t('s3_i1'), t('s3_i2'), t('s3_i3')]} />
      </Section>
      <Section heading={t('s4_h')}>
        <SectionList items={[t('s4_i1'), t('s4_i2'), t('s4_i3'), t('s4_i4')]} />
      </Section>
      <Section heading={t('s5_h')}>
        <SectionList items={[t('s5_i1'), t('s5_i2'), t('s5_i3')]} />
      </Section>
      <Section heading={t('s6_h')}>
        <SectionText>{t('s6_b')}</SectionText>
      </Section>
    </StaticPage>
  )
}
