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
  'برلين':       { ar: 'برلين',       fr: 'Berlin',          en: 'Berlin',         de: 'Berlin',        es: 'Berlín' },
  'ميونخ':       { ar: 'ميونخ',       fr: 'Munich',          en: 'Munich',         de: 'München',       es: 'Múnich' },
  'هامبورغ':     { ar: 'هامبورغ',     fr: 'Hambourg',        en: 'Hamburg',        de: 'Hamburg',       es: 'Hamburgo' },
  'فرانكفورت':   { ar: 'فرانكفورت',   fr: 'Francfort',       en: 'Frankfurt',      de: 'Frankfurt',     es: 'Fráncfort' },
  'كولونيا':     { ar: 'كولونيا',     fr: 'Cologne',         en: 'Cologne',        de: 'Köln',          es: 'Colonia' },
  'شتوتغارت':    { ar: 'شتوتغارت',    fr: 'Stuttgart',       en: 'Stuttgart',      de: 'Stuttgart',     es: 'Stuttgart' },
  'دوسلدورف':    { ar: 'دوسلدورف',    fr: 'Düsseldorf',      en: 'Düsseldorf',     de: 'Düsseldorf',    es: 'Düsseldorf' },
  'لايبزيغ':     { ar: 'لايبزيغ',     fr: 'Leipzig',         en: 'Leipzig',        de: 'Leipzig',       es: 'Leipzig' },
  'دورتموند':    { ar: 'دورتموند',    fr: 'Dortmund',        en: 'Dortmund',       de: 'Dortmund',      es: 'Dortmund' },
  'إيسن':        { ar: 'إيسن',        fr: 'Essen',           en: 'Essen',          de: 'Essen',         es: 'Essen' },
  'بريمن':       { ar: 'بريمن',       fr: 'Brême',           en: 'Bremen',         de: 'Bremen',        es: 'Bremen' },
  'درسدن':       { ar: 'درسدن',       fr: 'Dresde',          en: 'Dresden',        de: 'Dresden',       es: 'Dresde' },
  'هانوفر':      { ar: 'هانوفر',      fr: 'Hanovre',         en: 'Hanover',        de: 'Hannover',      es: 'Hanóver' },
  'نورنبرغ':     { ar: 'نورنبرغ',     fr: 'Nuremberg',       en: 'Nuremberg',      de: 'Nürnberg',      es: 'Núremberg' },
  'دويسبورغ':    { ar: 'دويسبورغ',    fr: 'Duisbourg',       en: 'Duisburg',       de: 'Duisburg',      es: 'Duisburg' },
  'بوخوم':       { ar: 'بوخوم',       fr: 'Bochum',          en: 'Bochum',         de: 'Bochum',        es: 'Bochum' },
  'فوبرتال':     { ar: 'فوبرتال',     fr: 'Wuppertal',       en: 'Wuppertal',      de: 'Wuppertal',     es: 'Wuppertal' },
  'بيليفيلد':    { ar: 'بيليفيلد',    fr: 'Bielefeld',       en: 'Bielefeld',      de: 'Bielefeld',     es: 'Bielefeld' },
  'بون':         { ar: 'بون',         fr: 'Bonn',            en: 'Bonn',           de: 'Bonn',          es: 'Bonn' },
  'مونستر':      { ar: 'مونستر',      fr: 'Münster',         en: 'Münster',        de: 'Münster',       es: 'Münster' },
  'مانهايم':     { ar: 'مانهايم',     fr: 'Mannheim',        en: 'Mannheim',       de: 'Mannheim',      es: 'Mannheim' },
  'كارلسروه':    { ar: 'كارلسروه',    fr: 'Karlsruhe',       en: 'Karlsruhe',      de: 'Karlsruhe',     es: 'Karlsruhe' },
  'أوغسبورغ':    { ar: 'أوغسبورغ',    fr: 'Augsbourg',       en: 'Augsburg',       de: 'Augsburg',      es: 'Augsburgo' },
  'فيسبادن':     { ar: 'فيسبادن',     fr: 'Wiesbaden',       en: 'Wiesbaden',      de: 'Wiesbaden',     es: 'Wiesbaden' },
  'غلزنكيرشن':   { ar: 'غلزنكيرشن',   fr: 'Gelsenkirchen',   en: 'Gelsenkirchen',  de: 'Gelsenkirchen', es: 'Gelsenkirchen' },
  'آخن':         { ar: 'آخن',         fr: 'Aix-la-Chapelle', en: 'Aachen',         de: 'Aachen',        es: 'Aquisgrán' },
  'براونشفايغ':  { ar: 'براونشفايغ',  fr: 'Brunswick',       en: 'Brunswick',      de: 'Braunschweig',  es: 'Brunswick' },
  'كيل':         { ar: 'كيل',         fr: 'Kiel',            en: 'Kiel',           de: 'Kiel',          es: 'Kiel' },
  'كيمنيتس':     { ar: 'كيمنيتس',     fr: 'Chemnitz',        en: 'Chemnitz',       de: 'Chemnitz',      es: 'Chemnitz' },
  'ماغدبورغ':    { ar: 'ماغدبورغ',    fr: 'Magdebourg',      en: 'Magdeburg',      de: 'Magdeburg',     es: 'Magdeburgo' },
  'فرايبورغ':    { ar: 'فرايبورغ',    fr: 'Fribourg',        en: 'Freiburg',       de: 'Freiburg',      es: 'Friburgo' },
  'روستوك':      { ar: 'روستوك',      fr: 'Rostock',         en: 'Rostock',        de: 'Rostock',       es: 'Rostock' },
  'هاله':        { ar: 'هاله',        fr: 'Halle',           en: 'Halle',          de: 'Halle',         es: 'Halle' },
  'إيرفورت':     { ar: 'إيرفورت',     fr: 'Erfurt',          en: 'Erfurt',         de: 'Erfurt',        es: 'Érfurt' },
  'ماينز':       { ar: 'ماينز',       fr: 'Mayence',         en: 'Mainz',          de: 'Mainz',         es: 'Maguncia' },
  'لوبيك':       { ar: 'لوبيك',       fr: 'Lübeck',          en: 'Lübeck',         de: 'Lübeck',        es: 'Lübeck' },
  'زاربروكن':    { ar: 'زاربروكن',    fr: 'Sarrebruck',      en: 'Saarbrücken',    de: 'Saarbrücken',   es: 'Sarrebruck' },
  'هايدلبرغ':    { ar: 'هايدلبرغ',    fr: 'Heidelberg',      en: 'Heidelberg',     de: 'Heidelberg',    es: 'Heidelberg' },
  'بوتسدام':     { ar: 'بوتسدام',     fr: 'Potsdam',         en: 'Potsdam',        de: 'Potsdam',       es: 'Potsdam' },
  'أخرى':        { ar: 'أخرى',        fr: 'Autre',           en: 'Other',          de: 'Andere',        es: 'Otra' },
}

export function cityLabel(arName: string | null | undefined, locale: AppLocale): string {
  if (!arName) return ''
  const entry = CITY_LABELS[arName]
  if (!entry) return arName  // unknown city — fall back to whatever's stored
  return entry[locale] ?? arName
}
