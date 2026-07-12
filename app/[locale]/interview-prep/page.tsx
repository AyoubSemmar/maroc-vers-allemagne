import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import ToolSeoSection from '@/components/seo/ToolSeoSection'
import { CATEGORY_ICON, CATEGORY_ORDER, FREE_LIMIT, QUESTIONS } from '@/lib/interviewPrepData'

type Props = { params: Promise<{ locale: AppLocale }> }

// Public, indexable landing for the Interview Prep tool. The tool itself
// lives under /dashboard (noindex + robots-blocked), so this page is what
// Google sees: the 15 German questions with their localized translations
// as crawlable text, plus the seoSection FAQ — then it funnels visitors
// into the dashboard tool.

const CTA: Record<AppLocale, { start: string; free: string }> = {
  en: { start: 'Practise with model answers', free: `${FREE_LIMIT} questions free — no account needed` },
  fr: { start: 'S’entraîner avec les réponses-types', free: `${FREE_LIMIT} questions gratuites — sans compte` },
  ar: { start: 'تدرّب مع الأجوبة النموذجية', free: `${FREE_LIMIT} أسئلة مجانية — دون حساب` },
  de: { start: 'Mit Musterantworten üben', free: `${FREE_LIMIT} Fragen gratis — ohne Konto` },
  es: { start: 'Practica con respuestas modelo', free: `${FREE_LIMIT} preguntas gratis — sin cuenta` },
  tr: { start: 'Örnek cevaplarla pratik yap', free: `${FREE_LIMIT} soru ücretsiz — hesap gerekmez` },
  fa: { start: 'با پاسخ‌های نمونه تمرین کنید', free: `${FREE_LIMIT} سؤال رایگان — بدون حساب` },
  pt: { start: 'Pratique com respostas-modelo', free: `${FREE_LIMIT} perguntas grátis — sem conta` },
  ru: { start: 'Тренируйтесь с образцовыми ответами', free: `${FREE_LIMIT} вопроса бесплатно — без аккаунта` },
  hi: { start: 'मॉडल जवाबों के साथ अभ्यास करें', free: `${FREE_LIMIT} सवाल मुफ्त — बिना खाते के` },
  ur: { start: 'نمونہ جوابات کے ساتھ مشق کریں', free: `${FREE_LIMIT} سوالات مفت — بغیر اکاؤنٹ` },
  zh: { start: '用范例回答开始练习', free: `${FREE_LIMIT} 个问题免费——无需账户` },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'interviewPrep' })
  return buildLocaleMetadata({
    locale,
    path: '/interview-prep',
    title: `${t('title')} | GoGermany`,
    description: t('subtitle'),
  })
}

export default async function InterviewPrepLanding({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'interviewPrep' })
  const cta = CTA[locale] ?? CTA.en

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    questions: QUESTIONS.filter((q) => q.category === cat),
  })).filter((g) => g.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <header className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-4 py-14">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden />
            {t('eyebrow')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3">{t('title')}</h1>
          <p className="mt-3 text-slate-300 leading-relaxed max-w-2xl">{t('subtitle')}</p>
          <div className="flex flex-wrap gap-2 mt-5 text-xs">
            <span className="bg-white/10 rounded-full px-3 py-1.5">🎯 {t('badgeQuestions', { n: QUESTIONS.length })}</span>
            <span className="bg-white/10 rounded-full px-3 py-1.5">🇩🇪 {t('badgeAnswers')}</span>
            <span className="bg-white/10 rounded-full px-3 py-1.5">📊 {t('badgeGerman')}</span>
            <span className="bg-white/10 rounded-full px-3 py-1.5">🔓 {t('badgeFreePreview', { n: FREE_LIMIT })}</span>
          </div>
          <div className="mt-7">
            <Link
              href="/dashboard/interview-prep"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl px-6 py-3 transition-colors"
            >
              {cta.start} →
            </Link>
            <p className="text-xs text-slate-400 mt-2">{cta.free}</p>
          </div>
        </div>
      </header>

      {/* The 15 questions, German + localized translation, grouped by
          category. Crawlable text targeting the exact queries candidates
          google ("Warum möchten Sie nach Deutschland kommen Antwort"). */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        {byCategory.map(({ cat, questions }) => (
          <section key={cat} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span aria-hidden>{CATEGORY_ICON[cat]}</span>
              {t(`category.${cat}`)}
            </h2>
            <ul className="mt-3 space-y-2">
              {questions.map((q) => (
                <li key={q.id}>
                  <Link
                    href="/dashboard/interview-prep"
                    className="block bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-emerald-400 hover:shadow-sm transition-all"
                  >
                    <span className="block font-semibold text-gray-900" lang="de">
                      „{q.questionDe}“
                    </span>
                    <span className="block text-sm text-gray-500 mt-0.5">
                      {t(`questions.${q.id}.translation`)}
                    </span>
                    {q.isFree && (
                      <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 mt-1.5">
                        {cta.free.split('—')[0].trim()} ✓
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="text-center mt-10 mb-2">
          <Link
            href="/dashboard/interview-prep"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-8 py-3.5 transition-colors"
          >
            {cta.start} →
          </Link>
          <p className="text-xs text-gray-500 mt-2">{cta.free}</p>
        </div>
      </main>

      <ToolSeoSection locale={locale} namespace="interviewPrep" />
    </div>
  )
}
