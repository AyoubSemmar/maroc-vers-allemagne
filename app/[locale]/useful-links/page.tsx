import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import StaticPage, { Section, SectionText, SectionList } from '@/components/StaticPage'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: Partial<Record<AppLocale, { title: string; desc: string }>> = {
  ar: {
    title: 'روابط مفيدة — مواقع رسمية للهجرة إلى ألمانيا',
    desc: 'قائمة بالمواقع الرسمية الألمانية الأساسية للهجرة إلى ألمانيا: الجامعات، الـ Ausbildung، التأشيرة، السكن، البنوك، تعلّم اللغة.',
  },
  fr: {
    title: 'Liens utiles — sites officiels Allemagne',
    desc: "Liste des sites officiels allemands essentiels pour s'installer en Allemagne : universités, Ausbildung, visa, logement, banques, apprentissage de l'allemand.",
  },
  en: {
    title: 'Useful links — official German sites',
    desc: 'Curated list of essential official German sites for moving to Germany: universities, Ausbildung, visa, housing, banks, language learning.',
  },
  de: {
    title: 'Nützliche Links — offizielle deutsche Seiten',
    desc: 'Kuratierte Liste wichtiger offizieller deutscher Seiten für den Umzug nach Deutschland: Universitäten, Ausbildung, Visum, Wohnen, Banken, Deutschlernen.',
  },
  es: {
    title: 'Enlaces útiles — sitios oficiales de Alemania',
    desc: 'Lista curada de sitios oficiales alemanes esenciales para mudarse a Alemania: universidades, Ausbildung, visado, vivienda, bancos y aprendizaje del idioma.',
  },
  tr: {
    title: "Faydalı bağlantılar — Almanya'nın resmi siteleri",
    desc: "Almanya'ya taşınmak için temel resmi Alman sitelerin seçkisi: üniversiteler, Ausbildung, vize, konut, bankalar ve dil öğrenimi.",
  },
  fa: {
    title: 'لینک‌های مفید — سایت‌های رسمی آلمان',
    desc: 'فهرست منتخب سایت‌های رسمی ضروری آلمان برای مهاجرت: دانشگاه‌ها، Ausbildung، ویزا، مسکن، بانک‌ها و یادگیری زبان.',
  },
  pt: {
    title: 'Links úteis — sites oficiais da Alemanha',
    desc: 'Lista curada de sites oficiais alemães essenciais para se mudar para a Alemanha: universidades, Ausbildung, visto, habitação, bancos e aprendizagem do idioma.',
  },
  ru: {
    title: 'Полезные ссылки — официальные сайты Германии',
    desc: 'Подборка ключевых официальных немецких сайтов для переезда в Германию: университеты, Ausbildung, виза, жильё, банки и изучение языка.',
  },
  hi: {
    title: 'उपयोगी लिंक — आधिकारिक जर्मन साइटें',
    desc: 'जर्मनी जाने के लिए आवश्यक आधिकारिक जर्मन साइटों की सूची: विश्वविद्यालय, Ausbildung, वीजा, आवास, बैंक, भाषा सीखना।',
  },
  ur: {
    title: 'مفید لنکس — سرکاری جرمن ویب سائٹس',
    desc: 'جرمنی جانے کے لیے ضروری سرکاری جرمن ویب سائٹس کی فہرست: یونیورسٹیاں، Ausbildung، ویزا، رہائش، بینک، زبان سیکھنا۔',
  },
  zh: {
    title: '实用链接 — 德国官方网站汇总',
    desc: '精选移居德国必备的官方网站：大学、Ausbildung 职业培训、签证、住房、银行开户和语言学习资源。',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.fr!
  return buildLocaleMetadata({ locale, path: '/useful-links', title: m.title, description: m.desc })
}

export default async function UsefulLinksPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.usefulLinks' })
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
