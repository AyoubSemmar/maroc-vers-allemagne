import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import LevelsGrid from '@/components/learn-german/LevelsGrid'
import ExamPrepCTA from '@/components/learn-german/ExamPrepCTA'
import './learn-german.css'

const META: Record<AppLocale, { title: string; desc: string }> = {
  ar: {
    title: 'تعلّم الألمانية مجاناً — A1 إلى C1 | GoGermany',
    desc: 'دروس ألمانية تفاعلية مجانية من المستوى A1 إلى C1، مصمّمة للمتعلّمين الدوليين المتجهين إلى ألمانيا. تمارين القراءة والكتابة بالذكاء الاصطناعي.',
  },
  fr: {
    title: "Apprendre l'allemand gratuitement — A1 à C1 | GoGermany",
    desc: "Cours d'allemand interactifs et gratuits du niveau A1 au C1, conçus pour les apprenants internationaux qui partent en Allemagne. Exercices de lecture et écriture par IA.",
  },
  en: {
    title: 'Learn German free — A1 to C1 | GoGermany',
    desc: 'Free interactive German lessons from A1 to C1, built for international learners heading to Germany. AI-powered reading and writing exercises.',
  },
  de: {
    title: 'Deutsch lernen kostenlos — A1 bis C1 | GoGermany',
    desc: 'Kostenlose interaktive Deutschkurse von A1 bis C1, für internationale Lernende mit Ziel Deutschland. KI-gestützte Lese- und Schreibübungen.',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.fr
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc },
    twitter: { title: m.title, description: m.desc },
  }
}

export default async function LearnGermanPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'learnGerman' })

  return (
    <div className="lg-root" dir={dirFor(locale)}>
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
