// German cities used in housing listings.
//
// The DB stores the Arabic name (e.g. 'برلين') because the dropdown
// originally used Arabic-only labels. This module provides per-locale
// display names so cards / detail pages / dropdowns render the city
// in the user's language without changing the underlying stored value.
//
// Use cityLabel(stored, locale) anywhere a listing.city is rendered.

import type { AppLocale } from '@/i18n/routing'

type CityLabels = Partial<Record<AppLocale, string>> & { ar: string; en: string }

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
  'برلين':       { ar: 'برلين',       fr: 'Berlin',          en: 'Berlin',         de: 'Berlin',        es: 'Berlín',      tr: 'Berlin',      fa: 'برلین',        pt: 'Berlim',       ru: 'Берлин' },
  'ميونخ':       { ar: 'ميونخ',       fr: 'Munich',          en: 'Munich',         de: 'München',       es: 'Múnich',      tr: 'Münih',       fa: 'مونیخ',        pt: 'Munique',      ru: 'Мюнхен' },
  'هامبورغ':     { ar: 'هامبورغ',     fr: 'Hambourg',        en: 'Hamburg',        de: 'Hamburg',       es: 'Hamburgo',    tr: 'Hamburg',     fa: 'هامبورگ',      pt: 'Hamburgo',     ru: 'Гамбург' },
  'فرانكفورت':   { ar: 'فرانكفورت',   fr: 'Francfort',       en: 'Frankfurt',      de: 'Frankfurt',     es: 'Fráncfort',   tr: 'Frankfurt',   fa: 'فرانکفورت',    pt: 'Frankfurt',    ru: 'Франкфурт' },
  'كولونيا':     { ar: 'كولونيا',     fr: 'Cologne',         en: 'Cologne',        de: 'Köln',          es: 'Colonia',     tr: 'Köln',        fa: 'کلن',          pt: 'Colônia',      ru: 'Кёльн' },
  'شتوتغارت':    { ar: 'شتوتغارت',    fr: 'Stuttgart',       en: 'Stuttgart',      de: 'Stuttgart',     es: 'Stuttgart',   tr: 'Stuttgart',   fa: 'اشتوتگارت',    pt: 'Stuttgart',    ru: 'Штутгарт' },
  'دوسلدورف':    { ar: 'دوسلدورف',    fr: 'Düsseldorf',      en: 'Düsseldorf',     de: 'Düsseldorf',    es: 'Düsseldorf',  tr: 'Düsseldorf',  fa: 'دوسلدورف',     pt: 'Düsseldorf',   ru: 'Дюссельдорф' },
  'لايبزيغ':     { ar: 'لايبزيغ',     fr: 'Leipzig',         en: 'Leipzig',        de: 'Leipzig',       es: 'Leipzig',     tr: 'Leipzig',     fa: 'لایپزیگ',      pt: 'Leipzig',      ru: 'Лейпциг' },
  'دورتموند':    { ar: 'دورتموند',    fr: 'Dortmund',        en: 'Dortmund',       de: 'Dortmund',      es: 'Dortmund',    tr: 'Dortmund',    fa: 'دورتموند',     pt: 'Dortmund',     ru: 'Дортмунд' },
  'إيسن':        { ar: 'إيسن',        fr: 'Essen',           en: 'Essen',          de: 'Essen',         es: 'Essen',       tr: 'Essen',       fa: 'اسن',          pt: 'Essen',        ru: 'Эссен' },
  'بريمن':       { ar: 'بريمن',       fr: 'Brême',           en: 'Bremen',         de: 'Bremen',        es: 'Bremen',      tr: 'Bremen',      fa: 'برمن',         pt: 'Bremen',       ru: 'Бремен' },
  'درسدن':       { ar: 'درسدن',       fr: 'Dresde',          en: 'Dresden',        de: 'Dresden',       es: 'Dresde',      tr: 'Dresden',     fa: 'درسدن',        pt: 'Dresden',      ru: 'Дрезден' },
  'هانوفر':      { ar: 'هانوفر',      fr: 'Hanovre',         en: 'Hanover',        de: 'Hannover',      es: 'Hanóver',     tr: 'Hannover',    fa: 'هانوفر',       pt: 'Hanôver',      ru: 'Ганновер' },
  'نورنبرغ':     { ar: 'نورنبرغ',     fr: 'Nuremberg',       en: 'Nuremberg',      de: 'Nürnberg',      es: 'Núremberg',   tr: 'Nürnberg',    fa: 'نورنبرگ',      pt: 'Nuremberga',   ru: 'Нюрнберг' },
  'دويسبورغ':    { ar: 'دويسبورغ',    fr: 'Duisbourg',       en: 'Duisburg',       de: 'Duisburg',      es: 'Duisburg',    tr: 'Duisburg',    fa: 'دویسبورگ',     pt: 'Duisburg',     ru: 'Дуйсбург' },
  'بوخوم':       { ar: 'بوخوم',       fr: 'Bochum',          en: 'Bochum',         de: 'Bochum',        es: 'Bochum',      tr: 'Bochum',      fa: 'بوخوم',        pt: 'Bochum',       ru: 'Бохум' },
  'فوبرتال':     { ar: 'فوبرتال',     fr: 'Wuppertal',       en: 'Wuppertal',      de: 'Wuppertal',     es: 'Wuppertal',   tr: 'Wuppertal',   fa: 'وپرتال',       pt: 'Wuppertal',    ru: 'Вупперталь' },
  'بيليفيلد':    { ar: 'بيليفيلد',    fr: 'Bielefeld',       en: 'Bielefeld',      de: 'Bielefeld',     es: 'Bielefeld',   tr: 'Bielefeld',   fa: 'بیله‌فلد',     pt: 'Bielefeld',    ru: 'Билефельд' },
  'بون':         { ar: 'بون',         fr: 'Bonn',            en: 'Bonn',           de: 'Bonn',          es: 'Bonn',        tr: 'Bonn',        fa: 'بن',           pt: 'Bona',         ru: 'Бонн' },
  'مونستر':      { ar: 'مونستر',      fr: 'Münster',         en: 'Münster',        de: 'Münster',       es: 'Münster',     tr: 'Münster',     fa: 'مونستر',       pt: 'Münster',      ru: 'Мюнстер' },
  'مانهايم':     { ar: 'مانهايم',     fr: 'Mannheim',        en: 'Mannheim',       de: 'Mannheim',      es: 'Mannheim',    tr: 'Mannheim',    fa: 'مانهایم',      pt: 'Mannheim',     ru: 'Мангейм' },
  'كارلسروه':    { ar: 'كارلسروه',    fr: 'Karlsruhe',       en: 'Karlsruhe',      de: 'Karlsruhe',     es: 'Karlsruhe',   tr: 'Karlsruhe',   fa: 'کارلسروه',     pt: 'Karlsruhe',    ru: 'Карлсруэ' },
  'أوغسبورغ':    { ar: 'أوغسبورغ',    fr: 'Augsbourg',       en: 'Augsburg',       de: 'Augsburg',      es: 'Augsburgo',   tr: 'Augsburg',    fa: 'آوگسبورگ',     pt: 'Augsburg',     ru: 'Аугсбург' },
  'فيسبادن':     { ar: 'فيسبادن',     fr: 'Wiesbaden',       en: 'Wiesbaden',      de: 'Wiesbaden',     es: 'Wiesbaden',   tr: 'Wiesbaden',   fa: 'ویسبادن',      pt: 'Wiesbaden',    ru: 'Висбаден' },
  'غلزنكيرشن':   { ar: 'غلزنكيرشن',   fr: 'Gelsenkirchen',   en: 'Gelsenkirchen',  de: 'Gelsenkirchen', es: 'Gelsenkirchen', tr: 'Gelsenkirchen', fa: 'گلزنکیرشن',  pt: 'Gelsenkirchen', ru: 'Гельзенкирхен' },
  'آخن':         { ar: 'آخن',         fr: 'Aix-la-Chapelle', en: 'Aachen',         de: 'Aachen',        es: 'Aquisgrán',   tr: 'Aachen',      fa: 'آخن',          pt: 'Aquisgrana',   ru: 'Ахен' },
  'براونشفايغ':  { ar: 'براونشفايغ',  fr: 'Brunswick',       en: 'Brunswick',      de: 'Braunschweig',  es: 'Brunswick',   tr: 'Braunschweig', fa: 'براون‌شوایگ', pt: 'Brunswick',    ru: 'Брауншвейг' },
  'كيل':         { ar: 'كيل',         fr: 'Kiel',            en: 'Kiel',           de: 'Kiel',          es: 'Kiel',        tr: 'Kiel',        fa: 'کیل',          pt: 'Kiel',         ru: 'Киль' },
  'كيمنيتس':     { ar: 'كيمنيتس',     fr: 'Chemnitz',        en: 'Chemnitz',       de: 'Chemnitz',      es: 'Chemnitz',    tr: 'Chemnitz',    fa: 'کمنیتس',       pt: 'Chemnitz',     ru: 'Хемниц' },
  'ماغدبورغ':    { ar: 'ماغدبورغ',    fr: 'Magdebourg',      en: 'Magdeburg',      de: 'Magdeburg',     es: 'Magdeburgo',  tr: 'Magdeburg',   fa: 'ماگدبورگ',     pt: 'Magdeburgo',   ru: 'Магдебург' },
  'فرايبورغ':    { ar: 'فرايبورغ',    fr: 'Fribourg',        en: 'Freiburg',       de: 'Freiburg',      es: 'Friburgo',    tr: 'Freiburg',    fa: 'فرایبورگ',     pt: 'Friburgo',     ru: 'Фрайбург' },
  'روستوك':      { ar: 'روستوك',      fr: 'Rostock',         en: 'Rostock',        de: 'Rostock',       es: 'Rostock',     tr: 'Rostock',     fa: 'روستوک',       pt: 'Rostock',      ru: 'Росток' },
  'هاله':        { ar: 'هاله',        fr: 'Halle',           en: 'Halle',          de: 'Halle',         es: 'Halle',       tr: 'Halle',       fa: 'هاله',         pt: 'Halle',        ru: 'Галле' },
  'إيرفورت':     { ar: 'إيرفورت',     fr: 'Erfurt',          en: 'Erfurt',         de: 'Erfurt',        es: 'Érfurt',      tr: 'Erfurt',      fa: 'ارفورت',       pt: 'Erfurt',       ru: 'Эрфурт' },
  'ماينز':       { ar: 'ماينز',       fr: 'Mayence',         en: 'Mainz',          de: 'Mainz',         es: 'Maguncia',    tr: 'Mainz',       fa: 'ماینتس',       pt: 'Mogúncia',     ru: 'Майнц' },
  'لوبيك':       { ar: 'لوبيك',       fr: 'Lübeck',          en: 'Lübeck',         de: 'Lübeck',        es: 'Lübeck',      tr: 'Lübeck',      fa: 'لوبک',         pt: 'Lübeck',       ru: 'Любек' },
  'زاربروكن':    { ar: 'زاربروكن',    fr: 'Sarrebruck',      en: 'Saarbrücken',    de: 'Saarbrücken',   es: 'Sarrebruck',  tr: 'Saarbrücken', fa: 'زاربروکن',     pt: 'Saarbrücken',  ru: 'Саарбрюккен' },
  'هايدلبرغ':    { ar: 'هايدلبرغ',    fr: 'Heidelberg',      en: 'Heidelberg',     de: 'Heidelberg',    es: 'Heidelberg',  tr: 'Heidelberg',  fa: 'هایدلبرگ',     pt: 'Heidelberg',   ru: 'Гейдельберг' },
  'بوتسدام':     { ar: 'بوتسدام',     fr: 'Potsdam',         en: 'Potsdam',        de: 'Potsdam',       es: 'Potsdam',     tr: 'Potsdam',     fa: 'پوتسدام',      pt: 'Potsdam',      ru: 'Потсдам' },
  'أخرى':        { ar: 'أخرى',        fr: 'Autre',           en: 'Other',          de: 'Andere',        es: 'Otra',        tr: 'Diğer',       fa: 'سایر',         pt: 'Outra',        ru: 'Другой' },
}

export function cityLabel(arName: string | null | undefined, locale: AppLocale): string {
  if (!arName) return ''
  const entry = CITY_LABELS[arName]
  if (!entry) return arName  // unknown city — fall back to whatever's stored
  return entry[locale] ?? arName
}
