import type { MetadataRoute } from 'next'
import { cookies } from 'next/headers'
import { routing, dirFor, type AppLocale } from '@/i18n/routing'

// The installable "Learn German" app. This manifest is intentionally DYNAMIC:
// it reads the visitor's NEXT_LOCALE cookie (set by next-intl) at install time
// so the installed app opens in the user's own language — start_url points at
// their localized /learn-german. Reading cookies() opts this route out of
// caching, which is what we want (the manifest is tiny). The middleware never
// touches /manifest.webmanifest (its matcher excludes paths with a dot), so no
// locale prefix is forced onto this request.

// Minimal per-locale app copy. Anything not listed falls back to English.
// (Home-screen real estate is tiny, so short_name stays one word everywhere.)
const NAMES: Partial<Record<AppLocale, { name: string; short: string; desc: string }>> = {
  ar: { name: 'تعلّم الألمانية — GoGermany', short: 'الألمانية', desc: 'دروس ألمانية تفاعلية من A1 إلى C1 مع تمارين وتصحيح بالذكاء الاصطناعي.' },
  fr: { name: "Apprendre l'allemand — GoGermany", short: 'Allemand', desc: "Cours d'allemand interactifs de A1 à C1 avec exercices corrigés par IA." },
  en: { name: 'Learn German — GoGermany', short: 'German', desc: 'Interactive German lessons from A1 to C1 with AI-graded exercises.' },
  de: { name: 'Deutsch lernen — GoGermany', short: 'Deutsch', desc: 'Interaktive Deutschkurse von A1 bis C1 mit KI-korrigierten Übungen.' },
  es: { name: 'Aprender alemán — GoGermany', short: 'Alemán', desc: 'Lecciones interactivas de alemán de A1 a C1 con ejercicios corregidos por IA.' },
  tr: { name: 'Almanca öğren — GoGermany', short: 'Almanca', desc: "A1'den C1'e yapay zeka destekli Almanca dersleri ve alıştırmalar." },
  fa: { name: 'آموزش آلمانی — GoGermany', short: 'آلمانی', desc: 'دروس تعاملی آلمانی از A1 تا C1 با تمرین‌های تصحیح‌شده با هوش مصنوعی.' },
  pt: { name: 'Aprender alemão — GoGermany', short: 'Alemão', desc: 'Aulas interativas de alemão de A1 a C1 com exercícios corrigidos por IA.' },
  ru: { name: 'Учить немецкий — GoGermany', short: 'Немецкий', desc: 'Интерактивные уроки немецкого от A1 до C1 с проверкой заданий ИИ.' },
  hi: { name: 'जर्मन सीखें — GoGermany', short: 'जर्मन', desc: 'A1 से C1 तक इंटरैक्टिव जर्मन पाठ, AI-जाँचित अभ्यास के साथ।' },
  ur: { name: 'جرمن سیکھیں — GoGermany', short: 'جرمن', desc: 'A1 سے C1 تک انٹرایکٹو جرمن اسباق، AI سے جانچے گئے مشقوں کے ساتھ۔' },
  zh: { name: '学德语 — GoGermany', short: '德语', desc: '从 A1 到 C1 的互动德语课程，配 AI 批改练习。' },
  uk: { name: 'Вивчати німецьку — GoGermany', short: 'Німецька', desc: 'Інтерактивні уроки німецької від A1 до C1 з перевіркою завдань ШІ.' },
  sq: { name: 'Mëso gjermanisht — GoGermany', short: 'Gjermanisht', desc: 'Mësime interaktive gjermanishteje nga A1 në C1 me ushtrime të korrigjuara me AI.' },
  id: { name: 'Belajar bahasa Jerman — GoGermany', short: 'Jerman', desc: 'Pelajaran bahasa Jerman interaktif dari A1 hingga C1 dengan latihan terkoreksi AI.' },
}

// Localized labels for the home-screen long-press shortcuts.
const SHORTCUTS: Partial<Record<AppLocale, { course: string; results: string }>> = {
  ar: { course: 'دورتي', results: 'نتائجي' },
  fr: { course: 'Mon cours', results: 'Mes résultats' },
  en: { course: 'My course', results: 'My results' },
  de: { course: 'Mein Kurs', results: 'Meine Ergebnisse' },
  es: { course: 'Mi curso', results: 'Mis resultados' },
  tr: { course: 'Kursum', results: 'Sonuçlarım' },
  fa: { course: 'دورهٔ من', results: 'نتایج من' },
  pt: { course: 'Meu curso', results: 'Meus resultados' },
  ru: { course: 'Мой курс', results: 'Мои результаты' },
  hi: { course: 'मेरा कोर्स', results: 'मेरे परिणाम' },
  ur: { course: 'میرا کورس', results: 'میرے نتائج' },
  zh: { course: '我的课程', results: '我的成绩' },
  uk: { course: 'Мій курс', results: 'Мої результати' },
  sq: { course: 'Kursi im', results: 'Rezultatet e mia' },
  id: { course: 'Kursus saya', results: 'Hasil saya' },
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const store = await cookies()
  const cookieLocale = store.get('NEXT_LOCALE')?.value
  const locale: AppLocale = (routing.locales as readonly string[]).includes(cookieLocale ?? '')
    ? (cookieLocale as AppLocale)
    : routing.defaultLocale
  const copy = NAMES[locale] ?? NAMES.en!
  const sc = SHORTCUTS[locale] ?? SHORTCUTS.en!
  const base = `/${locale}/learn-german`

  return {
    // Stable identity so switching the device language doesn't fork the app.
    id: '/learn-german?app=1',
    name: copy.name,
    short_name: copy.short,
    description: copy.desc,
    lang: locale,
    dir: dirFor(locale),
    start_url: `${base}?utm_source=pwa`,
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#E85F2C',
    categories: ['education'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    // "My course" (live-classes dashboard) shortcut was removed with the live
    // classes. Keep the Results shortcut for the free course.
    shortcuts: [
      { name: sc.results, url: `${base}/results?utm_source=pwa_shortcut`, icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
    ],
  }
}
