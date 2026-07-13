import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import Tool3Seo from '@/components/seo/Tool3Seo'
import FurnishedHousing from './FurnishedHousing'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Furnished Apartments in Germany — Rent Before You Arrive | GoGermany', d: 'Find furnished, move-in-ready apartments and rooms in Berlin, Munich, Frankfurt and 17 more German cities. Book from abroad with no Schufa — compare HousingAnywhere, Wunderflats, Spotahome and Nestpick in one place.' },
  fr: { t: 'Appartements meublés en Allemagne — Louez avant d’arriver | GoGermany', d: 'Trouvez des appartements et chambres meublés, prêts à emménager, à Berlin, Munich, Francfort et 17 autres villes. Réservez depuis l’étranger sans Schufa — comparez HousingAnywhere, Wunderflats, Spotahome et Nestpick au même endroit.' },
  ar: { t: 'شقق مفروشة في ألمانيا — استأجر قبل وصولك | GoGermany', d: 'اعثر على شقق وغرف مفروشة جاهزة للسكن في برلين وميونخ وفرانكفورت و17 مدينة أخرى. احجز من الخارج دون Schufa — قارن بين HousingAnywhere وWunderflats وSpotahome وNestpick في مكان واحد.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/furnished-housing',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

export const SEO = {
  heading: {
    en: 'How to find your first home in Germany from abroad',
    fr: 'Comment trouver votre premier logement en Allemagne depuis l’étranger',
    ar: 'كيف تجد أول سكن لك في ألمانيا وأنت في الخارج',
  } as L3,
  paragraphs: [
    {
      en: 'The hardest part of moving to Germany is not the visa — it is the first apartment. Regular unfurnished flats demand an in-person viewing, a German bank account, a Schufa credit record and a stack of documents you cannot have before you arrive. Furnished, mid-term rentals solve exactly this: they are booked entirely online, need no Schufa, and are ready to move into on day one. That is why nearly every newcomer starts with a furnished place for the first 1–12 months, then switches to a long-term unfurnished Wohnung once they are on the ground with income and a bank account.',
      fr: 'Le plus dur en s’installant en Allemagne n’est pas le visa — c’est le premier appartement. Les logements non meublés exigent une visite sur place, un compte bancaire allemand, une Schufa et une pile de documents impossibles à réunir avant d’arriver. Les locations meublées à moyen terme résolvent précisément cela : réservées entièrement en ligne, sans Schufa, prêtes à emménager dès le premier jour. C’est pourquoi presque tous les nouveaux arrivants commencent par un meublé pendant 1 à 12 mois, avant de passer à un logement non meublé à long terme une fois sur place.',
      ar: 'أصعب ما في الانتقال إلى ألمانيا ليس التأشيرة — بل أول شقة. فالشقق غير المفروشة تتطلّب معاينة شخصية وحساباً بنكياً ألمانياً وسجلّ Schufa وكومة وثائق يستحيل توفيرها قبل وصولك. أمّا الإيجارات المفروشة متوسطة المدى فتحلّ ذلك تماماً: تُحجز بالكامل عبر الإنترنت، دون Schufa، وجاهزة للسكن من اليوم الأول. لذلك يبدأ كل قادم جديد تقريباً بسكن مفروش لأول 1–12 شهراً، ثم ينتقل إلى شقة غير مفروشة طويلة الأمد بعد أن يستقرّ ولديه دخل وحساب بنكي.',
    } as L3,
    {
      en: 'This page brings the four platforms newcomers trust most — HousingAnywhere, Wunderflats, Spotahome and Nestpick — into one screen. Choose your city and each button opens that platform’s live, furnished results for it, refreshed daily. HousingAnywhere and Nestpick have the widest choice of rooms and studios; Wunderflats specialises in whole apartments where Anmeldung is often possible; Spotahome video-checks every home so you can rent unseen with confidence. Compare a few, shortlist two or three, and book the one that fits your move-in date and budget — always paying inside the platform’s protected checkout, never by direct transfer to a stranger.',
      fr: 'Cette page réunit les quatre plateformes les plus fiables — HousingAnywhere, Wunderflats, Spotahome et Nestpick — sur un seul écran. Choisissez votre ville et chaque bouton ouvre ses résultats meublés en direct, actualisés chaque jour. HousingAnywhere et Nestpick offrent le plus grand choix de chambres et studios ; Wunderflats se spécialise dans les appartements entiers où l’Anmeldung est souvent possible ; Spotahome vérifie chaque logement en vidéo pour louer à distance en confiance. Comparez-en quelques-unes, présélectionnez-en deux ou trois, et réservez celle qui correspond à votre date d’emménagement et à votre budget — toujours via le paiement sécurisé de la plateforme, jamais par virement direct à un inconnu.',
      ar: 'تجمع هذه الصفحة المنصّات الأربع الأكثر ثقة لدى القادمين الجدد — HousingAnywhere وWunderflats وSpotahome وNestpick — في شاشة واحدة. اختر مدينتك، وكل زرّ يفتح نتائجها المفروشة المباشرة لها، محدّثة يومياً. توفّر HousingAnywhere وNestpick أوسع اختيار للغرف والاستوديوهات؛ وتتخصّص Wunderflats في الشقق الكاملة حيث يكون تسجيل العنوان ممكناً غالباً؛ وتتحقّق Spotahome من كل سكن بالفيديو لتستأجر دون معاينة وبثقة. قارن بين بعضها، واختر اثنتين أو ثلاثاً، ثم احجز ما يناسب تاريخ انتقالك وميزانيتك — وادفع دائماً داخل نظام الدفع المحمي للمنصّة، لا بتحويل مباشر إلى شخص مجهول.',
    } as L3,
  ],
}

const FAQ: L3<{ q: string; a: string }[]> = {
  en: [
    { q: 'Can I rent an apartment in Germany before I arrive?', a: 'Yes. Furnished, mid-term rentals on platforms like HousingAnywhere, Wunderflats, Spotahome and Nestpick are booked fully online and are designed to be rented from abroad, before you have a German address or bank account.' },
    { q: 'Do I need a Schufa to rent furnished housing?', a: 'No. Furnished mid-term rentals do not require a Schufa credit record, which is why they are the standard first step for newcomers who cannot yet build one.' },
    { q: 'Can I register my Anmeldung at a furnished rental?', a: 'Often yes — Wunderflats in particular lists many apartments where the landlord provides the Wohnungsgeberbestätigung you need for your Anmeldung. Always confirm this with the landlord before booking.' },
    { q: 'Is GoGermany affiliated with these platforms?', a: 'No. GoGermany is independent. We link to the platforms’ public search results so you can compare them in one place; you book and pay directly on their protected checkout.' },
  ],
  fr: [
    { q: 'Puis-je louer un appartement en Allemagne avant d’arriver ?', a: 'Oui. Les locations meublées à moyen terme sur HousingAnywhere, Wunderflats, Spotahome et Nestpick se réservent entièrement en ligne et sont conçues pour être louées depuis l’étranger, avant d’avoir une adresse ou un compte bancaire allemand.' },
    { q: 'Faut-il une Schufa pour louer un logement meublé ?', a: 'Non. Les locations meublées à moyen terme n’exigent pas de Schufa, ce qui en fait la première étape idéale pour les nouveaux arrivants.' },
    { q: 'Puis-je faire mon Anmeldung dans une location meublée ?', a: 'Souvent oui — Wunderflats notamment propose de nombreux appartements où le propriétaire fournit la Wohnungsgeberbestätigung nécessaire à l’Anmeldung. Confirmez-le toujours avant de réserver.' },
    { q: 'GoGermany est-il affilié à ces plateformes ?', a: 'Non. GoGermany est indépendant. Nous renvoyons vers leurs résultats publics pour comparer ; vous réservez et payez directement sur leur paiement sécurisé.' },
  ],
  ar: [
    { q: 'هل يمكنني استئجار شقة في ألمانيا قبل وصولي؟', a: 'نعم. الإيجارات المفروشة متوسطة المدى على منصّات مثل HousingAnywhere وWunderflats وSpotahome وNestpick تُحجز بالكامل عبر الإنترنت ومصمّمة للاستئجار من الخارج، قبل أن يكون لديك عنوان أو حساب بنكي ألماني.' },
    { q: 'هل أحتاج إلى Schufa لاستئجار سكن مفروش؟', a: 'لا. الإيجارات المفروشة متوسطة المدى لا تتطلّب سجلّ Schufa، ولهذا فهي الخطوة الأولى المعتادة للقادمين الجدد.' },
    { q: 'هل يمكنني تسجيل عنواني (Anmeldung) في سكن مفروش؟', a: 'غالباً نعم — وWunderflats خاصةً تعرض شققاً كثيرة يقدّم فيها المالك شهادة المؤجّر (Wohnungsgeberbestätigung) اللازمة لتسجيل العنوان. تأكّد دائماً من ذلك مع المالك قبل الحجز.' },
    { q: 'هل GoGermany تابع لهذه المنصّات؟', a: 'لا. GoGermany مستقلّ. نوفّر روابط لنتائج بحثها العامة للمقارنة؛ وتحجز وتدفع مباشرة عبر نظام الدفع المحمي لديها.' },
  ],
}

export default async function FurnishedHousingPage({ params }: Props) {
  const { locale } = await params
  const faq = pick3(locale, FAQ)
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <FurnishedHousing locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
      <RelatedTools locale={locale} current="furnishedHousing" />
    </>
  )
}
