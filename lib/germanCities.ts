// German cities used in housing listings.
//
// The DB stores the Arabic name (e.g. 'برلين') because the dropdown
// originally used Arabic-only labels. This module provides per-locale
// display names so cards / detail pages / dropdowns render the city
// in the user's language without changing the underlying stored value.
//
// Use cityLabel(stored, locale) anywhere a listing.city is rendered.

import type { AppLocale } from '@/i18n/routing'

type CityLabels = Record<AppLocale, string>

// Source list (Arabic) — the values that get persisted to listings.city.
// Keep in lockstep with the dropdowns in /listings/new and /listings/[id]/edit.
export const CITIES_AR = [
  'برلين', 'ميونخ', 'هامبورغ', 'فرانكفورت', 'كولونيا', 'شتوتغارت', 'دوسلدورف',
  'لايبزيغ', 'دورتموند', 'إيسن', 'بريمن', 'درسدن', 'هانوفر', 'نورنبرغ', 'دويسبورغ',
  'بوخوم', 'فوبرتال', 'بيليفيلد', 'بون', 'مونستر', 'مانهايم', 'كارلسروه',
  'أوغسبورغ', 'فيسبادن', 'غلزنكيرشن', 'آخن', 'براونشفايغ', 'كيل', 'كيمنيتس',
  'ماغدبورغ', 'فرايبورغ', 'روستوك', 'هاله', 'إيرفورت', 'ماينز', 'لوبيك',
  'زاربروكن', 'هايدلبرغ', 'بوتسدام', 'أخرى',
] as const

// Per-locale display name. German uses the native city name (Köln, München)
// since that's what readers will see on signs / forms. French uses the
// historic French exonym where one is in active use (Cologne, Brême,
// Mayence) and the German name otherwise. English uses the most common
// international form.
const CITY_LABELS: Record<string, CityLabels> = {
  'برلين':       { ar: 'برلين',       fr: 'Berlin',       en: 'Berlin',       de: 'Berlin' },
  'ميونخ':       { ar: 'ميونخ',       fr: 'Munich',       en: 'Munich',       de: 'München' },
  'هامبورغ':     { ar: 'هامبورغ',     fr: 'Hambourg',     en: 'Hamburg',      de: 'Hamburg' },
  'فرانكفورت':   { ar: 'فرانكفورت',   fr: 'Francfort',    en: 'Frankfurt',    de: 'Frankfurt' },
  'كولونيا':     { ar: 'كولونيا',     fr: 'Cologne',      en: 'Cologne',      de: 'Köln' },
  'شتوتغارت':    { ar: 'شتوتغارت',    fr: 'Stuttgart',    en: 'Stuttgart',    de: 'Stuttgart' },
  'دوسلدورف':    { ar: 'دوسلدورف',    fr: 'Düsseldorf',   en: 'Düsseldorf',   de: 'Düsseldorf' },
  'لايبزيغ':     { ar: 'لايبزيغ',     fr: 'Leipzig',      en: 'Leipzig',      de: 'Leipzig' },
  'دورتموند':    { ar: 'دورتموند',    fr: 'Dortmund',     en: 'Dortmund',     de: 'Dortmund' },
  'إيسن':        { ar: 'إيسن',        fr: 'Essen',        en: 'Essen',        de: 'Essen' },
  'بريمن':       { ar: 'بريمن',       fr: 'Brême',        en: 'Bremen',       de: 'Bremen' },
  'درسدن':       { ar: 'درسدن',       fr: 'Dresde',       en: 'Dresden',      de: 'Dresden' },
  'هانوفر':      { ar: 'هانوفر',      fr: 'Hanovre',      en: 'Hanover',      de: 'Hannover' },
  'نورنبرغ':     { ar: 'نورنبرغ',     fr: 'Nuremberg',    en: 'Nuremberg',    de: 'Nürnberg' },
  'دويسبورغ':    { ar: 'دويسبورغ',    fr: 'Duisbourg',    en: 'Duisburg',     de: 'Duisburg' },
  'بوخوم':       { ar: 'بوخوم',       fr: 'Bochum',       en: 'Bochum',       de: 'Bochum' },
  'فوبرتال':     { ar: 'فوبرتال',     fr: 'Wuppertal',    en: 'Wuppertal',    de: 'Wuppertal' },
  'بيليفيلد':    { ar: 'بيليفيلد',    fr: 'Bielefeld',    en: 'Bielefeld',    de: 'Bielefeld' },
  'بون':         { ar: 'بون',         fr: 'Bonn',         en: 'Bonn',         de: 'Bonn' },
  'مونستر':      { ar: 'مونستر',      fr: 'Münster',      en: 'Münster',      de: 'Münster' },
  'مانهايم':     { ar: 'مانهايم',     fr: 'Mannheim',     en: 'Mannheim',     de: 'Mannheim' },
  'كارلسروه':    { ar: 'كارلسروه',    fr: 'Karlsruhe',    en: 'Karlsruhe',    de: 'Karlsruhe' },
  'أوغسبورغ':    { ar: 'أوغسبورغ',    fr: 'Augsbourg',    en: 'Augsburg',     de: 'Augsburg' },
  'فيسبادن':     { ar: 'فيسبادن',     fr: 'Wiesbaden',    en: 'Wiesbaden',    de: 'Wiesbaden' },
  'غلزنكيرشن':   { ar: 'غلزنكيرشن',   fr: 'Gelsenkirchen',en: 'Gelsenkirchen',de: 'Gelsenkirchen' },
  'آخن':         { ar: 'آخن',         fr: 'Aix-la-Chapelle', en: 'Aachen',    de: 'Aachen' },
  'براونشفايغ':  { ar: 'براونشفايغ',  fr: 'Brunswick',    en: 'Brunswick',    de: 'Braunschweig' },
  'كيل':         { ar: 'كيل',         fr: 'Kiel',         en: 'Kiel',         de: 'Kiel' },
  'كيمنيتس':     { ar: 'كيمنيتس',     fr: 'Chemnitz',     en: 'Chemnitz',     de: 'Chemnitz' },
  'ماغدبورغ':    { ar: 'ماغدبورغ',    fr: 'Magdebourg',   en: 'Magdeburg',    de: 'Magdeburg' },
  'فرايبورغ':    { ar: 'فرايبورغ',    fr: 'Fribourg',     en: 'Freiburg',     de: 'Freiburg' },
  'روستوك':      { ar: 'روستوك',      fr: 'Rostock',      en: 'Rostock',      de: 'Rostock' },
  'هاله':        { ar: 'هاله',        fr: 'Halle',        en: 'Halle',        de: 'Halle' },
  'إيرفورت':     { ar: 'إيرفورت',     fr: 'Erfurt',       en: 'Erfurt',       de: 'Erfurt' },
  'ماينز':       { ar: 'ماينز',       fr: 'Mayence',      en: 'Mainz',        de: 'Mainz' },
  'لوبيك':       { ar: 'لوبيك',       fr: 'Lübeck',       en: 'Lübeck',       de: 'Lübeck' },
  'زاربروكن':    { ar: 'زاربروكن',    fr: 'Sarrebruck',   en: 'Saarbrücken',  de: 'Saarbrücken' },
  'هايدلبرغ':    { ar: 'هايدلبرغ',    fr: 'Heidelberg',   en: 'Heidelberg',   de: 'Heidelberg' },
  'بوتسدام':     { ar: 'بوتسدام',     fr: 'Potsdam',      en: 'Potsdam',      de: 'Potsdam' },
  'أخرى':        { ar: 'أخرى',        fr: 'Autre',        en: 'Other',        de: 'Andere' },
}

export function cityLabel(arName: string | null | undefined, locale: AppLocale): string {
  if (!arName) return ''
  const entry = CITY_LABELS[arName]
  if (!entry) return arName  // unknown city — fall back to whatever's stored
  return entry[locale] ?? arName
}
