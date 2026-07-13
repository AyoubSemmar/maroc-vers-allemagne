// Furnished / mid-term rental platforms for newcomers to Germany.
//
// Unlike the Ausbildung feed (Bundesagentur's free public API), no German
// rental portal exposes an open, licence-free API we can legally aggregate.
// The international furnished-rental platforms below DO allow deep links into
// their city search results, refresh their inventory daily, and — crucially —
// let you book a first home from abroad before you have an Anmeldung / Schufa.
// So this "board" is a meta-search launcher: pick a city, jump straight into
// each platform's live, filtered results.
//
// City-slug convention (verified 2026-07): all four platforms use the English
// city name — lowercase in the path, capitalised for HousingAnywhere — even
// for exonyms (Cologne, Munich, Nuremberg). Keep `slug` ASCII + lowercase.

export type HousingCity = {
  /** English name, ASCII — used by HousingAnywhere (capitalised) and as label. */
  en: string
  /** Native German name — shown as a subtitle so users recognise signs/forms. */
  de: string
  /** Lowercase ASCII slug used in every platform path. */
  slug: string
}

// Ordered by furnished-rental inventory / newcomer demand.
export const HOUSING_CITIES: HousingCity[] = [
  { en: 'Berlin',      de: 'Berlin',      slug: 'berlin' },
  { en: 'Munich',      de: 'München',     slug: 'munich' },
  { en: 'Frankfurt',   de: 'Frankfurt',   slug: 'frankfurt' },
  { en: 'Hamburg',     de: 'Hamburg',     slug: 'hamburg' },
  { en: 'Cologne',     de: 'Köln',        slug: 'cologne' },
  { en: 'Stuttgart',   de: 'Stuttgart',   slug: 'stuttgart' },
  { en: 'Dusseldorf',  de: 'Düsseldorf',  slug: 'dusseldorf' },
  { en: 'Leipzig',     de: 'Leipzig',     slug: 'leipzig' },
  { en: 'Dresden',     de: 'Dresden',     slug: 'dresden' },
  { en: 'Nuremberg',   de: 'Nürnberg',    slug: 'nuremberg' },
  { en: 'Hanover',     de: 'Hannover',    slug: 'hanover' },
  { en: 'Bremen',      de: 'Bremen',      slug: 'bremen' },
  { en: 'Dortmund',    de: 'Dortmund',    slug: 'dortmund' },
  { en: 'Essen',       de: 'Essen',       slug: 'essen' },
  { en: 'Bonn',        de: 'Bonn',        slug: 'bonn' },
  { en: 'Mannheim',    de: 'Mannheim',    slug: 'mannheim' },
  { en: 'Heidelberg',  de: 'Heidelberg',  slug: 'heidelberg' },
  { en: 'Aachen',      de: 'Aachen',      slug: 'aachen' },
  { en: 'Karlsruhe',   de: 'Karlsruhe',   slug: 'karlsruhe' },
  { en: 'Freiburg',    de: 'Freiburg',    slug: 'freiburg' },
]

export type HousingPlatformKey =
  | 'housinganywhere'
  | 'wunderflats'
  | 'spotahome'
  | 'nestpick'

export type HousingPlatform = {
  key: HousingPlatformKey
  name: string
  /** Brand accent for the card's letter mark. */
  accent: string
  /** Builds the live search URL for a city (before affiliate wrapping). */
  build: (c: HousingCity) => string
}

export const HOUSING_PLATFORMS: HousingPlatform[] = [
  {
    key: 'housinganywhere',
    name: 'HousingAnywhere',
    accent: '#00a9a5',
    build: (c) => `https://housinganywhere.com/s/${c.en}--Germany`,
  },
  {
    key: 'wunderflats',
    name: 'Wunderflats',
    accent: '#ff5a5f',
    build: (c) => `https://wunderflats.com/en/furnished-apartments/${c.slug}`,
  },
  {
    key: 'spotahome',
    name: 'Spotahome',
    accent: '#ff7a59',
    build: (c) => `https://www.spotahome.com/s/${c.slug}--germany`,
  },
  {
    key: 'nestpick',
    name: 'Nestpick',
    accent: '#2f6fed',
    build: (c) => `https://www.nestpick.com/${c.slug}/`,
  },
]

// Optional per-platform affiliate hook, swapped in via env once partner
// accounts are approved — no code change needed. Two supported shapes:
//   • Wrapper template containing "{url}"  → the target URL is URL-encoded
//     into it (typical for networks like Impact/Partnerize/prf.hn).
//   • Plain query fragment (e.g. "wgu=abc123") → appended to the target URL.
const AFF: Record<HousingPlatformKey, string | undefined> = {
  housinganywhere: process.env.NEXT_PUBLIC_AFF_HOUSINGANYWHERE,
  wunderflats: process.env.NEXT_PUBLIC_AFF_WUNDERFLATS,
  spotahome: process.env.NEXT_PUBLIC_AFF_SPOTAHOME,
  nestpick: process.env.NEXT_PUBLIC_AFF_NESTPICK,
}

/** Final outbound URL for a platform + city, with affiliate wrapping applied. */
export function housingUrl(platform: HousingPlatform, city: HousingCity): string {
  const base = platform.build(city)
  const aff = AFF[platform.key]
  if (!aff) return base
  if (aff.includes('{url}')) return aff.replace('{url}', encodeURIComponent(base))
  return base + (base.includes('?') ? '&' : '?') + aff
}
