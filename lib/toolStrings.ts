// Lightweight i18n for the 2026-07 tool additions (Chancenkarte, Sperrkonto,
// Brutto-Netto, Anerkennung, city comparator). Unlike the original tools these
// don't add namespaces to all 12 message files: they carry full strings for
// the audience's query languages (en/fr/ar) and fall back to English
// elsewhere — matching their SEO policy (indexLocales: en/fr/ar).
export type L3<T = string> = { en: T; fr: T; ar: T }

export function pick3<T>(locale: string, v: L3<T>): T {
  return (v as Record<string, T>)[locale] ?? v.en
}

export const TOOL_INDEX_LOCALES = ['en', 'fr', 'ar'] as const

/** Sperrkonto / blocked-account providers. Swap the URLs for referral links
 *  via env once affiliate accounts are approved — no code change needed. */
export const SPERRKONTO_PROVIDERS = [
  {
    name: 'Fintiba',
    url: process.env.NEXT_PUBLIC_AFF_FINTIBA_URL || 'https://fintiba.com/',
    blurb: {
      en: 'Fully digital, opens in ~10 minutes, officially recognised by German embassies. Insurance bundles available.',
      fr: '100 % en ligne, ouverture en ~10 minutes, reconnu par les ambassades allemandes. Packs assurance disponibles.',
      ar: 'رقمي بالكامل، يُفتح في نحو 10 دقائق، معترف به رسمياً لدى السفارات الألمانية. تتوفر باقات تأمين.',
    } as L3,
  },
  {
    name: 'Expatrio',
    url: process.env.NEXT_PUBLIC_AFF_EXPATRIO_URL || 'https://www.expatrio.com/',
    blurb: {
      en: 'Popular value bundle: blocked account + health insurance + free current account in one package.',
      fr: 'Pack économique populaire : compte bloqué + assurance santé + compte courant gratuit en un seul pack.',
      ar: 'باقة شائعة وموفّرة: حساب مجمّد + تأمين صحي + حساب جارٍ مجاني في باقة واحدة.',
    } as L3,
  },
] as const
