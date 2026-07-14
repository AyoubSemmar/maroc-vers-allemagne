import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import StaticPage, { Section, SectionText, SectionList } from '@/components/StaticPage'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: Record<AppLocale, { title: string; desc: string }> = {
  ar: {
    title: 'السكن في ألمانيا — دليل البحث عن شقة',
    desc: 'كيف تجد سكناً في ألمانيا: مواقع البحث، الأوراق المطلوبة، WG vs استوديو، الإيجارات الشهرية الواقعية لكل مدينة، والأخطاء الشائعة.',
  },
  fr: {
    title: 'Logement en Allemagne — guide pratique',
    desc: "Comment trouver un logement en Allemagne : sites de recherche, documents nécessaires, WG vs studio, loyers mensuels réalistes par ville, et pièges fréquents.",
  },
  en: {
    title: 'Housing in Germany — practical guide',
    desc: 'How to find housing in Germany: search sites, required documents, WG vs studio, realistic monthly rents per city, and common pitfalls.',
  },
  de: {
    title: 'Wohnen in Deutschland — praktischer Guide',
    desc: 'Wie findest du eine Wohnung in Deutschland: Suchportale, benötigte Unterlagen, WG vs Studio, realistische Mieten pro Stadt, häufige Fallen.',
  },
  es: {
    title: 'Vivienda en Alemania — guía práctica',
    desc: 'Cómo encontrar alojamiento en Alemania: portales de búsqueda, documentos necesarios, WG vs estudio, alquileres reales por ciudad y errores frecuentes.',
  },
  tr: {
    title: "Almanya'da Konut — pratik rehber",
    desc: "Almanya'da konut nasıl bulunur: arama siteleri, gerekli belgeler, WG vs stüdyo, şehre göre gerçekçi kira bedelleri ve sık yapılan hatalar.",
  },
  fa: {
    title: 'مسکن در آلمان — راهنمای عملی',
    desc: 'چگونه در آلمان مسکن پیدا کنید: سایت‌های جستجو، مدارک لازم، WG در مقابل استودیو، اجاره‌های واقعی شهر به شهر و اشتباهات رایج.',
  },
  pt: {
    title: 'Habitação na Alemanha — guia prático',
    desc: 'Como encontrar alojamento na Alemanha: portais de pesquisa, documentos necessários, WG vs estúdio, rendas reais por cidade e erros frequentes.',
  },
  ru: {
    title: 'Жильё в Германии — практическое руководство',
    desc: 'Как найти жильё в Германии: сайты поиска, необходимые документы, WG против студии, реальные арендные ставки по городам и типичные ошибки.',
  },
  hi: {
    title: 'जर्मनी में आवास — व्यावहारिक मार्गदर्शिका',
    desc: 'जर्मनी में आवास खोजने का तरीका: खोज साइटें, आवश्यक दस्तावेज, WG बनाम स्टूडियो, शहर अनुसार किराए और सामान्य गलतियां।',
  },
  ur: {
    title: 'جرمنی میں رہائش — عملی رہنما',
    desc: 'جرمنی میں رہائش تلاش کرنے کا طریقہ: تلاش سائٹس، ضروری دستاویزات، WG بمقابلہ اسٹوڈیو، شہر کے لحاظ سے کرایے اور عام غلطیاں۔',
  },
  zh: {
    title: '在德国租房 — 实用指南',
    desc: '如何在德国找到住房：找房网站、所需材料、合租（WG）与单间公寓的对比、各城市真实房租水平以及常见陷阱。',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.fr
  return buildLocaleMetadata({ locale, path: '/housing', title: m.title, description: m.desc })
}

export default async function HousingPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.housing' })
  const tTools = await getTranslations({ locale, namespace: 'landing.tools' })
  return (
    <StaticPage title={t('title')} subtitle={t('subtitle')}>
      {/* The interactive furnished-housing finder is the actionable answer
          to this page's question — surface it before the reading. */}
      <Link href="/tools/furnished-housing" className="contact-method" style={{ marginBottom: 34 }}>
        <span className="contact-method-icon" aria-hidden style={{ fontSize: 22 }}>🏠</span>
        <span className="contact-method-label">{tTools('furnishedHousing.name')}</span>
        <span className="contact-method-value">{tTools('furnishedHousing.desc')} →</span>
      </Link>
      <Section heading={t('s1_h')}>
        <SectionList items={[t('s1_i1'), t('s1_i2'), t('s1_i3')]} />
      </Section>
      <Section heading={t('s2_h')}>
        <SectionText>{t('s2_b')}</SectionText>
      </Section>
      <Section heading={t('s3_h')}>
        <SectionList items={[t('s3_i1'), t('s3_i2'), t('s3_i3'), t('s3_i4')]} />
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
