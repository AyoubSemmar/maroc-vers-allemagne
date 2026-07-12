import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import Tool3Seo from '@/components/seo/Tool3Seo'
import LicenseChecker from './LicenseChecker'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Foreign Driving Licence in Germany — Conversion Checker | GoGermany', d: 'Is your driving licence valid in Germany? Check by country: simple exchange, theory test or full exams — with steps, costs and the 6-month rule explained.' },
  fr: { t: 'Permis de conduire étranger en Allemagne — vérificateur | GoGermany', d: 'Votre permis est-il valable en Allemagne ? Vérifiez par pays : échange simple, examen théorique ou complet — avec étapes, coûts et la règle des 6 mois.' },
  ar: { t: 'رخصة السياقة الأجنبية في ألمانيا — فاحص التبديل | GoGermany', d: 'هل رخصتك صالحة في ألمانيا؟ تحقق حسب البلد: تبديل بسيط أو امتحان نظري أو امتحانات كاملة — مع الخطوات والتكاليف وقاعدة الأشهر الستة.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/driving-license-germany',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

const SEO = {
  heading: {
    en: 'Using and converting a foreign driving licence in Germany',
    fr: 'Utiliser et échanger un permis étranger en Allemagne',
    ar: 'استعمال وتبديل رخصة سياقة أجنبية في ألمانيا',
  } as L3,
  paragraphs: [
    {
      en: 'Germany sorts foreign licences into three tiers. EU/EEA licences stay valid forever. Licences from the “Anlage 11” list (UK, Japan, South Korea, Switzerland, the Balkans and more) convert by simple exchange at the Führerscheinstelle for roughly €40–80. Everyone else — including Morocco, Algeria, Tunisia, Egypt, Turkey, India and Pakistan — may drive for six months after registering residence, then needs the German theory and practical exams to keep driving.',
      fr: 'L’Allemagne classe les permis étrangers en trois catégories. Les permis UE/EEE restent valables sans limite. Les permis de la liste « Anlage 11 » (Royaume-Uni, Japon, Corée du Sud, Suisse, Balkans…) s’échangent simplement à la Führerscheinstelle pour environ 40–80 €. Tous les autres — dont le Maroc, l’Algérie, la Tunisie, l’Égypte, la Turquie, l’Inde et le Pakistan — peuvent conduire six mois après l’Anmeldung, puis doivent passer les examens allemands théorique et pratique.',
      ar: 'تصنّف ألمانيا الرخص الأجنبية في ثلاث فئات. رخص الاتحاد الأوروبي تبقى صالحة دون حدود. ورخص قائمة «Anlage 11» (بريطانيا واليابان وكوريا الجنوبية وسويسرا والبلقان وغيرها) تُبدَّل ببساطة لدى مكتب الرخص مقابل نحو 40–80 €. أما البقية — ومنهم المغرب والجزائر وتونس ومصر وتركيا والهند وباكستان — فيقودون ستة أشهر بعد تسجيل الإقامة، ثم يلزمهم اجتياز الامتحانين الألمانيين النظري والتطبيقي.',
    } as L3,
    {
      en: 'The exams are cheaper than most people fear if you already drive: the law sets no minimum number of driving lessons for conversions, so experienced drivers typically pay €600–1,500 instead of the €2,000–3,500 a new learner spends. The theory test is available in English, Arabic, French, Turkish and other languages. Plan the timing well: start at a Fahrschule during your first months so you never lose the right to drive — especially if your job (delivery, care, trades, driving) depends on it.',
      fr: 'Les examens coûtent moins cher qu’on ne le craint si vous conduisez déjà : la loi n’impose aucun nombre minimum de leçons pour un échange, donc un conducteur expérimenté paie typiquement 600–1 500 € au lieu des 2 000–3 500 € d’un débutant. L’examen théorique existe en anglais, arabe, français, turc et d’autres langues. Anticipez : inscrivez-vous à une Fahrschule dès les premiers mois pour ne jamais perdre le droit de conduire — surtout si votre travail en dépend.',
      ar: 'الامتحانات أرخص مما يُخشى إن كنت تقود فعلاً: فالقانون لا يفرض حداً أدنى من دروس السياقة عند التبديل، لذا يدفع ذوو الخبرة عادة 600–1500 € بدل 2000–3500 € للمبتدئ. والامتحان النظري متوفر بالعربية والإنجليزية والفرنسية والتركية ولغات أخرى. خطط جيداً للتوقيت: سجّل في مدرسة السياقة خلال أشهرك الأولى حتى لا تفقد حق القيادة — خاصة إن كان عملك يعتمد عليها.',
    } as L3,
  ],
}

export default async function DrivingLicensePage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <LicenseChecker locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
      <RelatedTools locale={locale} current="license" />
    </>
  )
}
