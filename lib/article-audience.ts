// Audience → locale policy for articles (see memory: article-locale-policy).
//   global         → all 12 locales
//   north-africa   → ar, fr, en, de  (Morocco/Algeria)
//   other country  → that country's language + en + de
// Base columns hold Arabic when 'ar' is in the locale set, otherwise English.

export const AUDIENCES = [
  { id: 'global', label: '🌍 Global (all 12 languages)' },
  { id: 'north-africa', label: '🇲🇦 North Africa — ar · fr · de · en' },
  { id: 'turkey', label: '🇹🇷 Turkey — tr · de · en' },
  { id: 'iran-afghanistan', label: '🇮🇷 Iran / Afghanistan — fa · de · en' },
  { id: 'spain-latam', label: '🇪🇸 Spain / LatAm — es · de · en' },
  { id: 'portugal-brazil', label: '🇧🇷 Portugal / Brazil — pt · de · en' },
  { id: 'east-europe', label: '🇷🇺 East Europe — ru · de · en' },
  { id: 'india', label: '🇮🇳 India — hi · de · en' },
  { id: 'pakistan', label: '🇵🇰 Pakistan — ur · de · en' },
  { id: 'china', label: '🇨🇳 China — zh · de · en' },
] as const

export type Audience = (typeof AUDIENCES)[number]['id']

const POLICY: Record<Audience, string[]> = {
  global: ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh'],
  'north-africa': ['ar', 'fr', 'en', 'de'],
  turkey: ['tr', 'en', 'de'],
  'iran-afghanistan': ['fa', 'en', 'de'],
  'spain-latam': ['es', 'en', 'de'],
  'portugal-brazil': ['pt', 'en', 'de'],
  'east-europe': ['ru', 'en', 'de'],
  india: ['hi', 'en', 'de'],
  pakistan: ['ur', 'en', 'de'],
  china: ['zh', 'en', 'de'],
}

export function localesFor(audience: string): string[] {
  // 'netherlands' was retired when the nl locale was replaced by zh; any
  // legacy rows with that audience resolve to the china policy's shape
  // minus the language they no longer have — treat them as en+de only.
  if (audience === 'netherlands') return ['en', 'de']
  return POLICY[audience as Audience] ?? POLICY.global
}

export const LANG_NAME: Record<string, string> = {
  ar: 'Arabic', fr: 'French', en: 'English', de: 'German', es: 'Spanish',
  tr: 'Turkish', fa: 'Persian/Farsi', pt: 'Portuguese', ru: 'Russian',
  hi: 'Hindi', ur: 'Urdu', zh: 'Simplified Chinese',
}

export const LANG_LABEL: Record<string, string> = {
  ar: '🇸🇦 العربية', fr: '🇫🇷 Français', en: '🇬🇧 English', de: '🇩🇪 Deutsch',
  es: '🇪🇸 Español', tr: '🇹🇷 Türkçe', fa: '🇮🇷 فارسی', pt: '🇧🇷 Português',
  ru: '🇷🇺 Русский', hi: '🇮🇳 हिन्दी', ur: '🇵🇰 اردو', zh: '🇨🇳 简体中文',
}
