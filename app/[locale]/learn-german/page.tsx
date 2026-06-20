import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import LevelsGrid from '@/components/learn-german/LevelsGrid'
import ExamPrepCTA from '@/components/learn-german/ExamPrepCTA'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import JsonLd from '@/components/seo/JsonLd'
import './learn-german.css'

const META: Record<AppLocale, { title: string; desc: string }> = {
  ar: {
    title: 'تعلّم الألمانية مجاناً — A1 إلى C1 | GoGermany',
    desc: 'دروس ألمانية تفاعلية مجانية من المستوى A1 إلى C1، مصمّمة للمتعلمين الدوليين المتجهين إلى ألمانيا. تمارين القراءة والكتابة بالذكاء الاصطناعي.',
  },
  fr: {
    title: "Apprendre l'allemand gratuitement — A1 à C1 | GoGermany",
    desc: "Cours d'allemand interactifs et gratuits du niveau A1 au C1, conçus pour les internationaux qui partent en Allemagne. Exercices de lecture et écriture par IA.",
  },
  en: {
    title: 'Learn German free — A1 to C1 | GoGermany',
    desc: 'Free interactive German lessons from A1 to C1, built for people heading to Germany. AI-powered reading and writing exercises.',
  },
  de: {
    title: 'Deutsch lernen kostenlos — A1 bis C1 | GoGermany',
    desc: 'Kostenlose interaktive Deutschkurse von A1 bis C1, für internationale Lernende mit Ziel Deutschland. KI-gestützte Lese- und Schreibübungen.',
  },
  es: {
    title: 'Aprende alemán gratis — A1 a C1 | GoGermany',
    desc: 'Lecciones interactivas de alemán gratuitas de A1 a C1, diseñadas para personas que van a Alemania. Ejercicios de lectura y escritura con IA.',
  },
  tr: {
    title: "Almanca öğren ücretsiz — A1'den C1'e | GoGermany",
    desc: "Almanya'ya giden uluslararası öğrenciler için A1'den C1'e ücretsiz interaktif Almanca dersleri. Yapay zeka destekli okuma ve yazma alıştırmaları.",
  },
  fa: {
    title: 'آلمانی یاد بگیر رایگان — A1 تا C1 | GoGermany',
    desc: 'دروس تعاملی رایگان زبان آلمانی از A1 تا C1، طراحی‌شده برای افراد در حال مهاجرت به آلمان. تمرینات خواندن و نوشتن با هوش مصنوعی.',
  },
  pt: {
    title: 'Aprenda alemão grátis — A1 a C1 | GoGermany',
    desc: 'Aulas interativas gratuitas de alemão de A1 a C1, criadas para quem vai para a Alemanha. Exercícios de leitura e escrita com IA.',
  },
  ru: {
    title: 'Учи немецкий бесплатно — A1 до C1 | GoGermany',
    desc: 'Бесплатные интерактивные уроки немецкого от A1 до C1 для тех, кто едет в Германию. Упражнения на чтение и письмо с ИИ.',
  },
  hi: {
    title: 'जर्मन मुफ्त सीखें — A1 से C1 | GoGermany',
    desc: 'A1 से C1 तक मुफ्त इंटरएक्टिव जर्मन पाठ, जर्मनी जाने वालों के लिए। AI-संचालित पठन और लेखन अभ्यास।',
  },
  ur: {
    title: 'جرمن مفت سیکھیں — A1 سے C1 | GoGermany',
    desc: 'A1 سے C1 تک مفت انٹرایکٹو جرمن اسباق، جرمنی جانے والوں کے لیے۔ AI سے چلنے والی پڑھنے اور لکھنے کی مشقیں۔',
  },
  nl: {
    title: 'Gratis Duits leren — A1 tot C1 | GoGermany',
    desc: 'Gratis interactieve Duits lessen van A1 tot C1, speciaal voor mensen die naar Duitsland gaan. AI-aangedreven lees- en schrijfoefeningen.',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.fr
  return buildLocaleMetadata({ locale, path: '/learn-german', title: m.title, description: m.desc })
}

export default async function LearnGermanPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'learnGerman' })
  const m = META[locale] ?? META.fr

  return (
    <div className="lg-root" dir={dirFor(locale)}>
      {/* Course schema for the free A1→C1 German curriculum. Makes the
          page eligible for Google's free-courses rich result and ties
          the brand to the course offering. courseInstance entries
          mirror the 5 CEFR levels as separate self-paced offerings. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: m.title.split('|')[0].trim(),
          description: m.desc,
          inLanguage: locale,
          url: `https://gogermany.ma/${locale}/learn-german`,
          provider: {
            '@type': 'Organization',
            name: 'GoGermany',
            sameAs: 'https://gogermany.ma',
          },
          isAccessibleForFree: true,
          educationalLevel: ['A1', 'A2', 'B1', 'B2', 'C1'],
          teaches: 'German language (Deutsch)',
          courseMode: 'online',
          hasCourseInstance: ['A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => ({
            '@type': 'CourseInstance',
            name: `Deutsch ${lvl}`,
            courseMode: 'online',
            inLanguage: locale,
            url: `https://gogermany.ma/${locale}/learn-german/${lvl.toLowerCase()}`,
          })),
          offers: {
            '@type': 'Offer',
            category: 'free',
            price: 0,
            priceCurrency: 'EUR',
          },
        }}
      />
      <header className="lg-hero">
        <div className="wrap">
          <span className="lg-eyebrow"><span className="lg-eyebrow-dot" />{t('pageEyebrow') ?? '🇩🇪 Learn German'}</span>
          <h1 className="lg-title">{t('pageTitle')}</h1>
          <p className="lg-subtitle">{t('pageSubtitle')}</p>
          <div className="lg-hero-badges">
            <span className="lg-hero-badge">📖 {t('badgeGrammar') ?? 'Grammar'}</span>
            <span className="lg-hero-badge">💬 {t('badgeVocab') ?? 'Vocabulary'}</span>
            <span className="lg-hero-badge">✏️ {t('badgeExercises') ?? 'Exercises'}</span>
            <span className="lg-hero-badge">🎯 {t('badgeFree') ?? '100% free'}</span>
          </div>
        </div>
      </header>

      <div className="lg-body wrap">
        <h2 className="lg-section-title">{t('chooseLevel')}</h2>
        <LevelsGrid />

        {/* Daily conjugation drill — 5 min/day, level-aware, builds streak */}
        <Link href="/learn-german/drill" className="lg-drill-card">
          <div className="lg-drill-card-icon">⚡</div>
          <div className="lg-drill-card-text">
            <strong>{t('drill.title')}</strong>
            <span>{t('drill.intro')}</span>
          </div>
          <span className="lg-drill-card-cta">{t('drill.startCta')} →</span>
        </Link>

        <ExamPrepCTA />
      </div>
    </div>
  )
}
