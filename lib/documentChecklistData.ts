// Document Checklist Generator — pure data + filter logic.
//
// Country-aware: requirements for German visas differ by applicant's country
// in three decision-critical ways:
//   1. APS certificate — only required for some countries (China, India, Vietnam,
//      Mongolia, Pakistan) for Studium visas.
//   2. Document authentication — Hague-apostille ONLY where Germany accepts it.
//      "Joined the Hague Convention" is not sufficient — Germany has objected
//      to several accessions (Morocco, India, Philippines, etc.), so those
//      countries still need full consular legalization.
//   3. Visa type — EU/EEA/CH nationals need no visa; many nationalities are
//      Schengen-visa-free for tourist trips but still need a national D-visa
//      for Ausbildung / Studium / Family Reunification (> 90 days).
//
// Germany-side constants (country-independent, 2026):
//   - Sperrkonto: €992/month × 12 = €11,904 (BAMF)
//   - National D-visa fee: €75 (BMI Schedule)
//   - Schengen C-visa fee: €90 (raised June 2024 from €80)
//   - APS fees: India ~€225, China ~€340, Vietnam ~€140, Mongolia ~€150, Pakistan ~€100

export type PathKey = 'ausbildung' | 'studium' | 'tourist' | 'family_reunification'
export type EducationKey = 'bac' | 'bac_plus_2' | 'bac_plus_3' | 'bac_plus_5'
export type FamilyKey = 'single' | 'married' | 'married_kids'
export type CategoryKey =
  | 'identity'
  | 'academic'
  | 'language'
  | 'application'
  | 'employer'
  | 'university'
  | 'financial'
  | 'health'
  | 'housing'
  | 'visa_procedure'
  | 'sponsor'

// ── Country dimension ───────────────────────────────────────────────────────
export type CountryKey =
  // EU + Schengen + EEA (no visa for any path)
  | 'at' | 'be' | 'bg' | 'hr' | 'cy' | 'cz' | 'dk' | 'ee' | 'es' | 'fi' | 'fr'
  | 'gr' | 'hu' | 'ie' | 'is' | 'it' | 'lv' | 'li' | 'lt' | 'lu' | 'mt'
  | 'nl' | 'no' | 'pl' | 'pt' | 'ro' | 'sk' | 'si' | 'se' | 'ch'
  // Schengen-visa-free (tourist free, but D-visa needed for long stays)
  | 'al' | 'ad' | 'ar' | 'au' | 'ba' | 'br' | 'ca' | 'cl' | 'co'
  | 'ge' | 'jp' | 'md' | 'me' | 'mk' | 'mx' | 'my' | 'nz' | 'py'
  | 'pe' | 'rs' | 'ua' | 'us' | 'uy' | 'xk'
  // Tourist visa + D-visa required (Africa, Asia, Americas, non-visa-free Europe)
  | 'af' | 'am' | 'az' | 'bd' | 'bo' | 'bw' | 'by' | 'cd' | 'ci' | 'cm'
  | 'cn' | 'dz' | 'ec' | 'eg' | 'et' | 'gh' | 'id' | 'in' | 'iq' | 'ir'
  | 'jo' | 'ke' | 'kg' | 'kz' | 'ly' | 'ma' | 'mg' | 'mn' | 'mw' | 'ne'
  | 'ng' | 'np' | 'pk' | 'ph' | 'rw' | 'sa' | 'sd' | 'sn' | 'lk' | 'td'
  | 'th' | 'tn' | 'tr' | 'tz' | 'ug' | 'uz' | 'vn' | 'za' | 'zw'
  // Fallback
  | 'other'

/** Document-authentication method Germany accepts FROM this country. */
export type AuthMethod = 'apostille' | 'legalization'

export type CountryRule = {
  name: { ar: string; fr: string; en: string; de: string; es: string; tr: string; fa: string; pt: string; ru: string }
  flag: string
  /** apostille (Hague + Germany accepts) OR full consular legalization. */
  auth: AuthMethod
  /** Per-document authentication fee, EUR [min,max]. */
  authFeeEur: [number, number]
  /** Extra days the authentication step adds. */
  authDays: [number, number]
  /** Sworn translation, EUR per A4 page [min,max]. */
  translationPerPageEur: [number, number]
  /** Does this country require APS for Studium? */
  apsRequired: boolean
  apsFeeEur: [number, number]
  noteKey?: string
  /** Citizens need a Schengen C visa for tourist trips to the Schengen area. */
  touristVisaRequired: boolean
  /** Citizens need a national D-visa for Ausbildung / Studium / Family Reunification. */
  nationalDVisaRequired: boolean
  /** Schengen C-visa application fee in EUR. 0 if no visa required. */
  touristVisaFeeEur: number
}

// ── Country helpers ─────────────────────────────────────────────────────────
type N = { ar: string; fr: string; en: string; de: string; es: string; tr: string; fa: string; pt: string; ru: string }

/** EU / EEA / CH nationals — no visa needed for any purpose in Germany */
const freeAll = (n: N, flag: string, noteKey?: string): CountryRule => ({
  name: n, flag, auth: 'apostille', authFeeEur: [5, 20], authDays: [3, 14],
  translationPerPageEur: [20, 50], apsRequired: false, apsFeeEur: [0, 0],
  touristVisaRequired: false, nationalDVisaRequired: false, touristVisaFeeEur: 0, noteKey,
})

/** Schengen-visa-free but needs D-visa for long stays — apostille auth */
const freeT_ap = (n: N, flag: string, authFeeEur: [number, number] = [5, 25], authDays: [number, number] = [3, 14], noteKey?: string): CountryRule => ({
  name: n, flag, auth: 'apostille', authFeeEur, authDays,
  translationPerPageEur: [20, 60], apsRequired: false, apsFeeEur: [0, 0],
  touristVisaRequired: false, nationalDVisaRequired: true, touristVisaFeeEur: 0, noteKey,
})

/** Schengen-visa-free but needs D-visa — legalization auth */
const freeT_leg = (n: N, flag: string, authFeeEur: [number, number] = [30, 80], authDays: [number, number] = [21, 56], noteKey?: string): CountryRule => ({
  name: n, flag, auth: 'legalization', authFeeEur, authDays,
  translationPerPageEur: [20, 60], apsRequired: false, apsFeeEur: [0, 0],
  touristVisaRequired: false, nationalDVisaRequired: true, touristVisaFeeEur: 0, noteKey,
})

/** Tourist + D-visa required — apostille auth */
const visa_ap = (n: N, flag: string, authFeeEur: [number, number], authDays: [number, number],
  apsRequired = false, apsFeeEur: [number, number] = [0, 0], touristVisaFeeEur = 90, noteKey?: string): CountryRule => ({
  name: n, flag, auth: 'apostille', authFeeEur, authDays,
  translationPerPageEur: [20, 60], apsRequired, apsFeeEur,
  touristVisaRequired: true, nationalDVisaRequired: true, touristVisaFeeEur, noteKey,
})

/** Tourist + D-visa required — legalization auth */
const visa_leg = (n: N, flag: string, authFeeEur: [number, number], authDays: [number, number],
  apsRequired = false, apsFeeEur: [number, number] = [0, 0], touristVisaFeeEur = 90, noteKey?: string): CountryRule => ({
  name: n, flag, auth: 'legalization', authFeeEur, authDays,
  translationPerPageEur: [20, 60], apsRequired, apsFeeEur,
  touristVisaRequired: true, nationalDVisaRequired: true, touristVisaFeeEur, noteKey,
})

// ── Country data ──────────────────────────────────────────────────────────
// Best-verified as of Q2 2026. Auth method reflects whether Germany accepts
// apostille (not merely Hague membership — Germany has lodged objections to
// Morocco, India, Pakistan, Philippines, Kosovo, Uzbekistan, Senegal, Rwanda).
export const COUNTRIES: Record<CountryKey, CountryRule> = {

  // ── EU + Schengen + EEA ──────────────────────────────────────────────────
  at: freeAll({ ar: 'النمسا', fr: 'Autriche', en: 'Austria', de: 'Österreich', es: 'Austria', tr: 'Avusturya', fa: 'اتریش', pt: 'Áustria', ru: 'Австрия' }, '🇦🇹'),
  be: freeAll({ ar: 'بلجيكا', fr: 'Belgique', en: 'Belgium', de: 'Belgien', es: 'Bélgica', tr: 'Belçika', fa: 'بلژیک', pt: 'Bélgica', ru: 'Бельгия' }, '🇧🇪'),
  bg: freeAll({ ar: 'بلغاريا', fr: 'Bulgarie', en: 'Bulgaria', de: 'Bulgarien', es: 'Bulgaria', tr: 'Bulgaristan', fa: 'بلغارستان', pt: 'Bulgária', ru: 'Болгария' }, '🇧🇬'),
  hr: freeAll({ ar: 'كرواتيا', fr: 'Croatie', en: 'Croatia', de: 'Kroatien', es: 'Croacia', tr: 'Hırvatistan', fa: 'کرواسی', pt: 'Croácia', ru: 'Хорватия' }, '🇭🇷'),
  cy: freeAll({ ar: 'قبرص', fr: 'Chypre', en: 'Cyprus', de: 'Zypern', es: 'Chipre', tr: 'Kıbrıs', fa: 'قبرس', pt: 'Chipre', ru: 'Кипр' }, '🇨🇾'),
  cz: freeAll({ ar: 'التشيك', fr: 'Tchéquie', en: 'Czechia', de: 'Tschechien', es: 'Chequia', tr: 'Çekya', fa: 'چک', pt: 'Chéquia', ru: 'Чехия' }, '🇨🇿'),
  dk: freeAll({ ar: 'الدنمارك', fr: 'Danemark', en: 'Denmark', de: 'Dänemark', es: 'Dinamarca', tr: 'Danimarka', fa: 'دانمارک', pt: 'Dinamarca', ru: 'Дания' }, '🇩🇰'),
  ee: freeAll({ ar: 'إستونيا', fr: 'Estonie', en: 'Estonia', de: 'Estland', es: 'Estonia', tr: 'Estonya', fa: 'استونی', pt: 'Estónia', ru: 'Эстония' }, '🇪🇪'),
  es: freeAll({ ar: 'إسبانيا', fr: 'Espagne', en: 'Spain', de: 'Spanien', es: 'España', tr: 'İspanya', fa: 'اسپانیا', pt: 'Espanha', ru: 'Испания' }, '🇪🇸'),
  fi: freeAll({ ar: 'فنلندا', fr: 'Finlande', en: 'Finland', de: 'Finnland', es: 'Finlandia', tr: 'Finlandiya', fa: 'فنلاند', pt: 'Finlândia', ru: 'Финляндия' }, '🇫🇮'),
  fr: freeAll({ ar: 'فرنسا', fr: 'France', en: 'France', de: 'Frankreich', es: 'Francia', tr: 'Fransa', fa: 'فرانسه', pt: 'França', ru: 'Франция' }, '🇫🇷'),
  gr: freeAll({ ar: 'اليونان', fr: 'Grèce', en: 'Greece', de: 'Griechenland', es: 'Grecia', tr: 'Yunanistan', fa: 'یونان', pt: 'Grécia', ru: 'Греция' }, '🇬🇷'),
  hu: freeAll({ ar: 'المجر', fr: 'Hongrie', en: 'Hungary', de: 'Ungarn', es: 'Hungría', tr: 'Macaristan', fa: 'مجارستان', pt: 'Hungria', ru: 'Венгрия' }, '🇭🇺'),
  ie: freeAll({ ar: 'أيرلندا', fr: 'Irlande', en: 'Ireland', de: 'Irland', es: 'Irlanda', tr: 'İrlanda', fa: 'ایرلند', pt: 'Irlanda', ru: 'Ирландия' }, '🇮🇪'),
  is: freeAll({ ar: 'أيسلندا', fr: 'Islande', en: 'Iceland', de: 'Island', es: 'Islandia', tr: 'İzlanda', fa: 'ایسلند', pt: 'Islândia', ru: 'Исландия' }, '🇮🇸'),
  it: freeAll({ ar: 'إيطاليا', fr: 'Italie', en: 'Italy', de: 'Italien', es: 'Italia', tr: 'İtalya', fa: 'ایتالیا', pt: 'Itália', ru: 'Италия' }, '🇮🇹'),
  lv: freeAll({ ar: 'لاتفيا', fr: 'Lettonie', en: 'Latvia', de: 'Lettland', es: 'Letonia', tr: 'Letonya', fa: 'لتونی', pt: 'Letónia', ru: 'Латвия' }, '🇱🇻'),
  li: freeAll({ ar: 'ليختنشتاين', fr: 'Liechtenstein', en: 'Liechtenstein', de: 'Liechtenstein', es: 'Liechtenstein', tr: 'Lihtenştayn', fa: 'لیختن‌اشتاین', pt: 'Liechtenstein', ru: 'Лихтенштейн' }, '🇱🇮'),
  lt: freeAll({ ar: 'ليتوانيا', fr: 'Lituanie', en: 'Lithuania', de: 'Litauen', es: 'Lituania', tr: 'Litvanya', fa: 'لیتوانی', pt: 'Lituânia', ru: 'Литва' }, '🇱🇹'),
  lu: freeAll({ ar: 'لوكسمبورغ', fr: 'Luxembourg', en: 'Luxembourg', de: 'Luxemburg', es: 'Luxemburgo', tr: 'Lüksemburg', fa: 'لوکزامبورگ', pt: 'Luxemburgo', ru: 'Люксембург' }, '🇱🇺'),
  mt: freeAll({ ar: 'مالطا', fr: 'Malte', en: 'Malta', de: 'Malta', es: 'Malta', tr: 'Malta', fa: 'مالت', pt: 'Malta', ru: 'Мальта' }, '🇲🇹'),
  nl: freeAll({ ar: 'هولندا', fr: 'Pays-Bas', en: 'Netherlands', de: 'Niederlande', es: 'Países Bajos', tr: 'Hollanda', fa: 'هلند', pt: 'Países Baixos', ru: 'Нидерланды' }, '🇳🇱'),
  no: freeAll({ ar: 'النرويج', fr: 'Norvège', en: 'Norway', de: 'Norwegen', es: 'Noruega', tr: 'Norveç', fa: 'نروژ', pt: 'Noruega', ru: 'Норвегия' }, '🇳🇴'),
  pl: freeAll({ ar: 'بولندا', fr: 'Pologne', en: 'Poland', de: 'Polen', es: 'Polonia', tr: 'Polonya', fa: 'لهستان', pt: 'Polónia', ru: 'Польша' }, '🇵🇱'),
  pt: freeAll({ ar: 'البرتغال', fr: 'Portugal', en: 'Portugal', de: 'Portugal', es: 'Portugal', tr: 'Portekiz', fa: 'پرتغال', pt: 'Portugal', ru: 'Португалия' }, '🇵🇹'),
  ro: freeAll({ ar: 'رومانيا', fr: 'Roumanie', en: 'Romania', de: 'Rumänien', es: 'Rumania', tr: 'Romanya', fa: 'رومانی', pt: 'Roménia', ru: 'Румыния' }, '🇷🇴'),
  sk: freeAll({ ar: 'سلوفاكيا', fr: 'Slovaquie', en: 'Slovakia', de: 'Slowakei', es: 'Eslovaquia', tr: 'Slovakya', fa: 'اسلواکی', pt: 'Eslováquia', ru: 'Словакия' }, '🇸🇰'),
  si: freeAll({ ar: 'سلوفينيا', fr: 'Slovénie', en: 'Slovenia', de: 'Slowenien', es: 'Eslovenia', tr: 'Slovenya', fa: 'اسلوونی', pt: 'Eslovénia', ru: 'Словения' }, '🇸🇮'),
  se: freeAll({ ar: 'السويد', fr: 'Suède', en: 'Sweden', de: 'Schweden', es: 'Suecia', tr: 'İsveç', fa: 'سوئد', pt: 'Suécia', ru: 'Швеция' }, '🇸🇪'),
  ch: freeAll({ ar: 'سويسرا', fr: 'Suisse', en: 'Switzerland', de: 'Schweiz', es: 'Suiza', tr: 'İsviçre', fa: 'سوئیس', pt: 'Suíça', ru: 'Швейцария' }, '🇨🇭'),

  // ── Schengen-visa-free (D-visa still needed for long stays) ───────────────
  al: freeT_ap({ ar: 'ألبانيا', fr: 'Albanie', en: 'Albania', de: 'Albanien', es: 'Albania', tr: 'Arnavutluk', fa: 'آلبانی', pt: 'Albânia', ru: 'Албания' }, '🇦🇱'),
  ad: freeT_ap({ ar: 'أندورا', fr: 'Andorre', en: 'Andorra', de: 'Andorra', es: 'Andorra', tr: 'Andorra', fa: 'آندورا', pt: 'Andorra', ru: 'Андорра' }, '🇦🇩'),
  ar: freeT_ap({ ar: 'الأرجنتين', fr: 'Argentine', en: 'Argentina', de: 'Argentinien', es: 'Argentina', tr: 'Arjantin', fa: 'آرژانتین', pt: 'Argentina', ru: 'Аргентина' }, '🇦🇷', [10, 30], [3, 14]),
  au: freeT_ap({ ar: 'أستراليا', fr: 'Australie', en: 'Australia', de: 'Australien', es: 'Australia', tr: 'Avustralya', fa: 'استرالیا', pt: 'Austrália', ru: 'Австралия' }, '🇦🇺', [10, 30], [3, 14]),
  ba: freeT_ap({ ar: 'البوسنة', fr: 'Bosnie', en: 'Bosnia', de: 'Bosnien', es: 'Bosnia', tr: 'Bosna Hersek', fa: 'بوسنی', pt: 'Bósnia', ru: 'Босния' }, '🇧🇦'),
  br: freeT_ap({ ar: 'البرازيل', fr: 'Brésil', en: 'Brazil', de: 'Brasilien', es: 'Brasil', tr: 'Brezilya', fa: 'برزیل', pt: 'Brasil', ru: 'Бразилия' }, '🇧🇷', [10, 30], [3, 14]),
  ca: freeT_ap({ ar: 'كندا', fr: 'Canada', en: 'Canada', de: 'Kanada', es: 'Canadá', tr: 'Kanada', fa: 'کانادا', pt: 'Canadá', ru: 'Канада' }, '🇨🇦', [10, 30], [3, 14]),
  cl: freeT_ap({ ar: 'تشيلي', fr: 'Chili', en: 'Chile', de: 'Chile', es: 'Chile', tr: 'Şili', fa: 'شیلی', pt: 'Chile', ru: 'Чили' }, '🇨🇱', [10, 30], [3, 14]),
  co: freeT_ap({ ar: 'كولومبيا', fr: 'Colombie', en: 'Colombia', de: 'Kolumbien', es: 'Colombia', tr: 'Kolombiya', fa: 'کلمبیا', pt: 'Colômbia', ru: 'Колумбия' }, '🇨🇴', [10, 30], [3, 14]),
  ge: freeT_ap({ ar: 'جورجيا', fr: 'Géorgie', en: 'Georgia', de: 'Georgien', es: 'Georgia', tr: 'Gürcistan', fa: 'گرجستان', pt: 'Geórgia', ru: 'Грузия' }, '🇬🇪', [5, 20], [3, 14]),
  jp: freeT_ap({ ar: 'اليابان', fr: 'Japon', en: 'Japan', de: 'Japan', es: 'Japón', tr: 'Japonya', fa: 'ژاپن', pt: 'Japão', ru: 'Япония' }, '🇯🇵', [5, 15], [3, 10]),
  md: freeT_ap({ ar: 'مولدوفا', fr: 'Moldavie', en: 'Moldova', de: 'Moldau', es: 'Moldavia', tr: 'Moldova', fa: 'مولداوی', pt: 'Moldávia', ru: 'Молдова' }, '🇲🇩'),
  me: freeT_ap({ ar: 'الجبل الأسود', fr: 'Monténégro', en: 'Montenegro', de: 'Montenegro', es: 'Montenegro', tr: 'Karadağ', fa: 'مونته‌نگرو', pt: 'Montenegro', ru: 'Черногория' }, '🇲🇪'),
  mk: freeT_ap({ ar: 'مقدونيا الشمالية', fr: 'Macédoine du Nord', en: 'North Macedonia', de: 'Nordmazedonien', es: 'Macedonia del Norte', tr: 'Kuzey Makedonya', fa: 'مقدونیه شمالی', pt: 'Macedônia do Norte', ru: 'Северная Македония' }, '🇲🇰'),
  mx: freeT_ap({ ar: 'المكسيك', fr: 'Mexique', en: 'Mexico', de: 'Mexiko', es: 'México', tr: 'Meksika', fa: 'مکزیک', pt: 'México', ru: 'Мексика' }, '🇲🇽', [10, 30], [3, 14]),
  my: freeT_leg({ ar: 'ماليزيا', fr: 'Malaisie', en: 'Malaysia', de: 'Malaysia', es: 'Malasia', tr: 'Malezya', fa: 'مالزی', pt: 'Malásia', ru: 'Малайзия' }, '🇲🇾', [20, 60], [14, 42]),
  nz: freeT_ap({ ar: 'نيوزيلندا', fr: 'Nouvelle-Zélande', en: 'New Zealand', de: 'Neuseeland', es: 'Nueva Zelanda', tr: 'Yeni Zelanda', fa: 'نیوزیلند', pt: 'Nova Zelândia', ru: 'Новая Зеландия' }, '🇳🇿', [10, 30], [3, 14]),
  py: freeT_ap({ ar: 'باراغواي', fr: 'Paraguay', en: 'Paraguay', de: 'Paraguay', es: 'Paraguay', tr: 'Paraguay', fa: 'پاراگوئه', pt: 'Paraguai', ru: 'Парагвай' }, '🇵🇾', [10, 30], [3, 14]),
  pe: freeT_ap({ ar: 'بيرو', fr: 'Pérou', en: 'Peru', de: 'Peru', es: 'Perú', tr: 'Peru', fa: 'پرو', pt: 'Peru', ru: 'Перу' }, '🇵🇪', [10, 30], [3, 14]),
  rs: freeT_ap({ ar: 'صربيا', fr: 'Serbie', en: 'Serbia', de: 'Serbien', es: 'Serbia', tr: 'Sırbistan', fa: 'صربستان', pt: 'Sérvia', ru: 'Сербия' }, '🇷🇸'),
  ua: freeT_ap({ ar: 'أوكرانيا', fr: 'Ukraine', en: 'Ukraine', de: 'Ukraine', es: 'Ucrania', tr: 'Ukrayna', fa: 'اوکراین', pt: 'Ucrânia', ru: 'Украина' }, '🇺🇦'),
  us: freeT_ap({ ar: 'الولايات المتحدة', fr: 'États-Unis', en: 'USA', de: 'USA', es: 'Estados Unidos', tr: 'ABD', fa: 'ایالات متحده', pt: 'Estados Unidos', ru: 'США' }, '🇺🇸', [10, 30], [3, 14]),
  uy: freeT_ap({ ar: 'أوروغواي', fr: 'Uruguay', en: 'Uruguay', de: 'Uruguay', es: 'Uruguay', tr: 'Uruguay', fa: 'اروگوئه', pt: 'Uruguai', ru: 'Уругвай' }, '🇺🇾', [10, 30], [3, 14]),
  xk: freeT_leg({ ar: 'كوسوفو', fr: 'Kosovo', en: 'Kosovo', de: 'Kosovo', es: 'Kosovo', tr: 'Kosova', fa: 'کوزوو', pt: 'Kosovo', ru: 'Косово' }, '🇽🇰', [30, 80], [21, 56], 'ma'),

  // ── Tourist + D-visa required ──────────────────────────────────────────────
  // Europe
  by: visa_ap(
    { ar: 'بيلاروسيا', fr: 'Biélorussie', en: 'Belarus', de: 'Belarus', es: 'Bielorrusia', tr: 'Belarus', fa: 'بلاروس', pt: 'Bielorrússia', ru: 'Беларусь' }, '🇧🇾',
    [10, 30], [30, 270], false, [0, 0], 35, 'legalizationSlow',
  ),

  // Africa
  ma: visa_leg(
    { ar: 'المغرب', fr: 'Maroc', en: 'Morocco', de: 'Marokko', es: 'Marruecos', tr: 'Fas', fa: 'مراکش', pt: 'Marrocos', ru: 'Марокко' }, '🇲🇦',
    [30, 80], [7, 42], false, [0, 0], 90, 'ma',
  ),
  dz: visa_leg(
    { ar: 'الجزائر', fr: 'Algérie', en: 'Algeria', de: 'Algerien', es: 'Argelia', tr: 'Cezayir', fa: 'الجزایر', pt: 'Argélia', ru: 'Алжир' }, '🇩🇿',
    [30, 80], [21, 42], false, [0, 0], 90,
  ),
  tn: visa_leg(
    { ar: 'تونس', fr: 'Tunisie', en: 'Tunisia', de: 'Tunesien', es: 'Túnez', tr: 'Tunus', fa: 'تونس', pt: 'Tunísia', ru: 'Тунис' }, '🇹🇳',
    [30, 80], [21, 42], false, [0, 0], 90,
  ),
  eg: visa_leg(
    { ar: 'مصر', fr: 'Égypte', en: 'Egypt', de: 'Ägypten', es: 'Egipto', tr: 'Mısır', fa: 'مصر', pt: 'Egito', ru: 'Египет' }, '🇪🇬',
    [40, 100], [28, 56], false, [0, 0], 90,
  ),
  ng: visa_leg(
    { ar: 'نيجيريا', fr: 'Nigéria', en: 'Nigeria', de: 'Nigeria', es: 'Nigeria', tr: 'Nijerya', fa: 'نیجریه', pt: 'Nigéria', ru: 'Нигерия' }, '🇳🇬',
    [50, 130], [28, 84], false, [0, 0], 90, 'legalizationSlow',
  ),
  et: visa_leg(
    { ar: 'إثيوبيا', fr: 'Éthiopie', en: 'Ethiopia', de: 'Äthiopien', es: 'Etiopía', tr: 'Etiyopya', fa: 'اتیوپی', pt: 'Etiópia', ru: 'Эфиопия' }, '🇪🇹',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  gh: visa_leg(
    { ar: 'غانا', fr: 'Ghana', en: 'Ghana', de: 'Ghana', es: 'Ghana', tr: 'Gana', fa: 'غنا', pt: 'Gana', ru: 'Гана' }, '🇬🇭',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  sn: visa_leg(
    { ar: 'السنغال', fr: 'Sénégal', en: 'Senegal', de: 'Senegal', es: 'Senegal', tr: 'Senegal', fa: 'سنگال', pt: 'Senegal', ru: 'Сенегал' }, '🇸🇳',
    [30, 80], [42, 84], false, [0, 0], 90, 'legalizationSlow',
  ),
  cm: visa_leg(
    { ar: 'الكاميرون', fr: 'Cameroun', en: 'Cameroon', de: 'Kamerun', es: 'Camerún', tr: 'Kamerun', fa: 'کامرون', pt: 'Camarões', ru: 'Камерун' }, '🇨🇲',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  ci: visa_leg(
    { ar: 'ساحل العاج', fr: "Côte d'Ivoire", en: 'Ivory Coast', de: 'Elfenbeinküste', es: 'Costa de Marfil', tr: 'Fildişi Sahili', fa: 'ساحل عاج', pt: 'Costa do Marfim', ru: "Кот-д'Ивуар" }, '🇨🇮',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  rw: visa_leg(
    { ar: 'رواندا', fr: 'Rwanda', en: 'Rwanda', de: 'Ruanda', es: 'Ruanda', tr: 'Ruanda', fa: 'رواندا', pt: 'Ruanda', ru: 'Руанда' }, '🇷🇼',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  ne: visa_leg(
    { ar: 'النيجر', fr: 'Niger', en: 'Niger', de: 'Niger', es: 'Níger', tr: 'Nijer', fa: 'نیجر', pt: 'Níger', ru: 'Нигер' }, '🇳🇪',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  td: visa_leg(
    { ar: 'تشاد', fr: 'Tchad', en: 'Chad', de: 'Tschad', es: 'Chad', tr: 'Çad', fa: 'چاد', pt: 'Chade', ru: 'Чад' }, '🇹🇩',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  mg: visa_leg(
    { ar: 'مدغشقر', fr: 'Madagascar', en: 'Madagascar', de: 'Madagaskar', es: 'Madagascar', tr: 'Madagaskar', fa: 'ماداگاسکار', pt: 'Madagáscar', ru: 'Мадагаскар' }, '🇲🇬',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  ke: visa_leg(
    { ar: 'كينيا', fr: 'Kenya', en: 'Kenya', de: 'Kenia', es: 'Kenia', tr: 'Kenya', fa: 'کنیا', pt: 'Quénia', ru: 'Кения' }, '🇰🇪',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  tz: visa_leg(
    { ar: 'تنزانيا', fr: 'Tanzanie', en: 'Tanzania', de: 'Tansania', es: 'Tanzania', tr: 'Tanzanya', fa: 'تانزانیا', pt: 'Tanzânia', ru: 'Танзания' }, '🇹🇿',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  ug: visa_leg(
    { ar: 'أوغندا', fr: 'Ouganda', en: 'Uganda', de: 'Uganda', es: 'Uganda', tr: 'Uganda', fa: 'اوگاندا', pt: 'Uganda', ru: 'Уганда' }, '🇺🇬',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  cd: visa_leg(
    { ar: 'الكونغو الديمقراطية', fr: 'RD Congo', en: 'DR Congo', de: 'DR Kongo', es: 'RD Congo', tr: 'Kongo', fa: 'کنگو', pt: 'RD Congo', ru: 'ДР Конго' }, '🇨🇩',
    [30, 100], [28, 70], false, [0, 0], 90,
  ),
  ly: visa_leg(
    { ar: 'ليبيا', fr: 'Libye', en: 'Libya', de: 'Libyen', es: 'Libia', tr: 'Libya', fa: 'لیبی', pt: 'Líbia', ru: 'Ливия' }, '🇱🇾',
    [30, 100], [28, 70], false, [0, 0], 90,
  ),
  sd: visa_leg(
    { ar: 'السودان', fr: 'Soudan', en: 'Sudan', de: 'Sudan', es: 'Sudán', tr: 'Sudan', fa: 'سودان', pt: 'Sudão', ru: 'Судан' }, '🇸🇩',
    [30, 100], [28, 70], false, [0, 0], 90,
  ),
  za: visa_ap(
    { ar: 'جنوب أفريقيا', fr: 'Afrique du Sud', en: 'South Africa', de: 'Südafrika', es: 'Sudáfrica', tr: 'Güney Afrika', fa: 'آفریقای جنوبی', pt: 'África do Sul', ru: 'ЮАР' }, '🇿🇦',
    [10, 30], [7, 21], false, [0, 0], 90,
  ),
  bw: visa_ap(
    { ar: 'بوتسوانا', fr: 'Botswana', en: 'Botswana', de: 'Botswana', es: 'Botsuana', tr: 'Botsvana', fa: 'بوتسوانا', pt: 'Botsuana', ru: 'Ботсвана' }, '🇧🇼',
    [10, 30], [7, 21], false, [0, 0], 90,
  ),
  mw: visa_ap(
    { ar: 'مالاوي', fr: 'Malawi', en: 'Malawi', de: 'Malawi', es: 'Malaui', tr: 'Malavi', fa: 'مالاوی', pt: 'Malawi', ru: 'Малави' }, '🇲🇼',
    [10, 30], [7, 21], false, [0, 0], 90,
  ),
  zw: visa_leg(
    { ar: 'زيمبابوي', fr: 'Zimbabwe', en: 'Zimbabwe', de: 'Simbabwe', es: 'Zimbabue', tr: 'Zimbabve', fa: 'زیمبابوه', pt: 'Zimbábue', ru: 'Зимбабве' }, '🇿🇼',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),

  // Asia
  af: visa_leg(
    { ar: 'أفغانستان', fr: 'Afghanistan', en: 'Afghanistan', de: 'Afghanistan', es: 'Afganistán', tr: 'Afganistan', fa: 'افغانستان', pt: 'Afeganistão', ru: 'Афганистан' }, '🇦🇫',
    [60, 120], [30, 90], false, [0, 0], 90,
  ),
  am: visa_ap(
    { ar: 'أرمينيا', fr: 'Arménie', en: 'Armenia', de: 'Armenien', es: 'Armenia', tr: 'Ermenistan', fa: 'ارمنستان', pt: 'Armênia', ru: 'Армения' }, '🇦🇲',
    [10, 30], [7, 21], false, [0, 0], 35,
  ),
  az: visa_ap(
    { ar: 'أذربيجان', fr: 'Azerbaïdjan', en: 'Azerbaijan', de: 'Aserbaidschan', es: 'Azerbaiyán', tr: 'Azerbaycan', fa: 'آذربایجان', pt: 'Azerbaijão', ru: 'Азербайджан' }, '🇦🇿',
    [10, 30], [7, 21], false, [0, 0], 35,
  ),
  bd: visa_leg(
    { ar: 'بنغلاديش', fr: 'Bangladesh', en: 'Bangladesh', de: 'Bangladesch', es: 'Bangladés', tr: 'Bangladeş', fa: 'بنگلادش', pt: 'Bangladesh', ru: 'Бангладеш' }, '🇧🇩',
    [60, 100], [28, 70], false, [0, 0], 90,
  ),
  cn: visa_ap(
    { ar: 'الصين', fr: 'Chine', en: 'China', de: 'China', es: 'China', tr: 'Çin', fa: 'چین', pt: 'China', ru: 'Китай' }, '🇨🇳',
    [5, 20], [7, 21], true, [300, 340], 90, 'aps',
  ),
  id: visa_leg(
    { ar: 'إندونيسيا', fr: 'Indonésie', en: 'Indonesia', de: 'Indonesien', es: 'Indonesia', tr: 'Endonezya', fa: 'اندونزی', pt: 'Indonésia', ru: 'Индонезия' }, '🇮🇩',
    [30, 80], [14, 42], false, [0, 0], 90,
  ),
  in: visa_leg(
    { ar: 'الهند', fr: 'Inde', en: 'India', de: 'Indien', es: 'India', tr: 'Hindistan', fa: 'هند', pt: 'Índia', ru: 'Индия' }, '🇮🇳',
    [50, 100], [14, 42], true, [165, 225], 90, 'aps',
  ),
  iq: visa_leg(
    { ar: 'العراق', fr: 'Irak', en: 'Iraq', de: 'Irak', es: 'Irak', tr: 'Irak', fa: 'عراق', pt: 'Iraque', ru: 'Ирак' }, '🇮🇶',
    [60, 120], [28, 70], false, [0, 0], 90,
  ),
  ir: visa_leg(
    { ar: 'إيران', fr: 'Iran', en: 'Iran', de: 'Iran', es: 'Irán', tr: 'İran', fa: 'ایران', pt: 'Irã', ru: 'Иран' }, '🇮🇷',
    [60, 120], [28, 70], false, [0, 0], 90,
  ),
  jo: visa_ap(
    { ar: 'الأردن', fr: 'Jordanie', en: 'Jordan', de: 'Jordanien', es: 'Jordania', tr: 'Ürdün', fa: 'اردن', pt: 'Jordânia', ru: 'Иордания' }, '🇯🇴',
    [20, 50], [7, 28], false, [0, 0], 90,
  ),
  kz: visa_ap(
    { ar: 'كازاخستان', fr: 'Kazakhstan', en: 'Kazakhstan', de: 'Kasachstan', es: 'Kazajistán', tr: 'Kazakistan', fa: 'قزاقستان', pt: 'Cazaquistão', ru: 'Казахстан' }, '🇰🇿',
    [15, 70], [7, 28], false, [0, 0], 90,
  ),
  kg: visa_ap(
    { ar: 'قيرغيزستان', fr: 'Kirghizistan', en: 'Kyrgyzstan', de: 'Kirgisistan', es: 'Kirguistán', tr: 'Kırgızistan', fa: 'قرقیزستان', pt: 'Quirguistão', ru: 'Киргизия' }, '🇰🇬',
    [10, 30], [7, 21], false, [0, 0], 90,
  ),
  mn: visa_ap(
    { ar: 'منغوليا', fr: 'Mongolie', en: 'Mongolia', de: 'Mongolei', es: 'Mongolia', tr: 'Moğolistan', fa: 'مغولستان', pt: 'Mongólia', ru: 'Монголия' }, '🇲🇳',
    [10, 30], [7, 21], true, [100, 200], 90, 'aps',
  ),
  np: visa_leg(
    { ar: 'نيبال', fr: 'Népal', en: 'Nepal', de: 'Nepal', es: 'Nepal', tr: 'Nepal', fa: 'نپال', pt: 'Nepal', ru: 'Непал' }, '🇳🇵',
    [30, 80], [21, 56], false, [0, 0], 90,
  ),
  pk: visa_leg(
    { ar: 'باكستان', fr: 'Pakistan', en: 'Pakistan', de: 'Pakistan', es: 'Pakistán', tr: 'Pakistan', fa: 'پاکستان', pt: 'Paquistão', ru: 'Пакистан' }, '🇵🇰',
    [50, 100], [21, 56], true, [80, 120], 90, 'aps',
  ),
  ph: visa_leg(
    { ar: 'الفلبين', fr: 'Philippines', en: 'Philippines', de: 'Philippinen', es: 'Filipinas', tr: 'Filipinler', fa: 'فیلیپین', pt: 'Filipinas', ru: 'Филиппины' }, '🇵🇭',
    [32, 50], [14, 42], false, [0, 0], 90,
  ),
  sa: visa_leg(
    { ar: 'المملكة العربية السعودية', fr: 'Arabie saoudite', en: 'Saudi Arabia', de: 'Saudi-Arabien', es: 'Arabia Saudita', tr: 'Suudi Arabistan', fa: 'عربستان سعودی', pt: 'Arábia Saudita', ru: 'Саудовская Аравия' }, '🇸🇦',
    [30, 60], [14, 42], false, [0, 0], 90,
  ),
  lk: visa_leg(
    { ar: 'سريلانكا', fr: 'Sri Lanka', en: 'Sri Lanka', de: 'Sri Lanka', es: 'Sri Lanka', tr: 'Sri Lanka', fa: 'سریلانکا', pt: 'Sri Lanka', ru: 'Шри-Ланка' }, '🇱🇰',
    [30, 80], [14, 42], false, [0, 0], 90,
  ),
  th: visa_ap(
    { ar: 'تايلاند', fr: 'Thaïlande', en: 'Thailand', de: 'Thailand', es: 'Tailandia', tr: 'Tayland', fa: 'تایلند', pt: 'Tailândia', ru: 'Таиланд' }, '🇹🇭',
    [10, 30], [7, 21], false, [0, 0], 90,
  ),
  tr: visa_ap(
    { ar: 'تركيا', fr: 'Turquie', en: 'Turkey', de: 'Türkei', es: 'Turquía', tr: 'Türkiye', fa: 'ترکیه', pt: 'Turquia', ru: 'Турция' }, '🇹🇷',
    [0, 20], [3, 14], false, [0, 0], 90,
  ),
  uz: visa_leg(
    { ar: 'أوزبكستان', fr: 'Ouzbékistan', en: 'Uzbekistan', de: 'Usbekistan', es: 'Uzbekistán', tr: 'Özbekistan', fa: 'ازبکستان', pt: 'Uzbequistão', ru: 'Узбекистан' }, '🇺🇿',
    [40, 100], [14, 56], false, [0, 0], 90,
  ),
  vn: visa_leg(
    { ar: 'فيتنام', fr: 'Vietnam', en: 'Vietnam', de: 'Vietnam', es: 'Vietnam', tr: 'Vietnam', fa: 'ویتنام', pt: 'Vietnã', ru: 'Вьетнам' }, '🇻🇳',
    [20, 60], [21, 42], true, [140, 240], 90, 'aps',
  ),

  // Americas (visa required)
  bo: visa_ap(
    { ar: 'بوليفيا', fr: 'Bolivie', en: 'Bolivia', de: 'Bolivien', es: 'Bolivia', tr: 'Bolivya', fa: 'بولیوی', pt: 'Bolívia', ru: 'Боливия' }, '🇧🇴',
    [10, 30], [3, 14], false, [0, 0], 90,
  ),
  ec: visa_ap(
    { ar: 'الإكوادور', fr: 'Équateur', en: 'Ecuador', de: 'Ecuador', es: 'Ecuador', tr: 'Ekvador', fa: 'اکوادور', pt: 'Equador', ru: 'Эквадор' }, '🇪🇨',
    [10, 30], [3, 14], false, [0, 0], 90,
  ),

  // Fallback
  other: {
    name: { ar: 'بلد آخر', fr: 'Autre pays', en: 'Other country', de: 'Anderes Land', es: 'Otro país', tr: 'Diğer ülke', fa: 'کشور دیگر', pt: 'Outro país', ru: 'Другая страна' },
    flag: '🌍', auth: 'legalization', authFeeEur: [30, 100], authDays: [21, 56],
    translationPerPageEur: [20, 60], apsRequired: false, apsFeeEur: [0, 0],
    touristVisaRequired: true, nationalDVisaRequired: true, touristVisaFeeEur: 90, noteKey: 'generic',
  },
}

export const COUNTRY_ORDER: CountryKey[] = [
  // Africa / MENA (primary audience)
  'ma', 'dz', 'tn', 'eg', 'ly', 'sd', 'ng', 'gh', 'sn', 'ci', 'cm', 'ne', 'td', 'rw',
  'cd', 'et', 'ke', 'tz', 'ug', 'mg', 'mw', 'bw', 'za', 'zw',
  // Middle East & Central Asia
  'tr', 'sa', 'jo', 'iq', 'ir', 'kz', 'az', 'am', 'kg', 'uz', 'ge',
  // South / Southeast / East Asia
  'in', 'cn', 'pk', 'bd', 'vn', 'ph', 'id', 'mn', 'np', 'lk', 'af', 'my', 'th', 'jp',
  // Europe (visa required or visa-free)
  'ua', 'rs', 'ba', 'mk', 'me', 'md', 'al', 'xk', 'by', 'ad',
  // Americas
  'br', 'co', 'mx', 'ar', 'cl', 'pe', 'ec', 'bo', 'py', 'uy', 'ca', 'us',
  // Oceania
  'au', 'nz',
  // EU / EEA / Schengen
  'fr', 'es', 'it', 'nl', 'be', 'pl', 'se', 'at', 'ch', 'no', 'dk', 'fi',
  'pt', 'gr', 'hu', 'ro', 'cz', 'sk', 'bg', 'hr', 'si', 'lt', 'lv', 'ee',
  'lu', 'mt', 'cy', 'ie', 'is', 'li',
  // Fallback last
  'other',
]

// ── Checklist input ───────────────────────────────────────────────────────
export type ChecklistInput = {
  country: CountryKey
  path: PathKey
  education: EducationKey       // used for ausbildung / studium only
  family: FamilyKey
  vorab?: boolean               // ausbildung only
  apsDone?: boolean             // studium only
  hasGermanCert?: boolean       // ausbildung / studium only
  bringFamily?: boolean         // ausbildung / studium: adds family-reunification docs
}

// ── Document type ─────────────────────────────────────────────────────────
export type Doc = {
  id: string
  category: CategoryKey
  costEur: [number, number]
  timelineDays: [number, number]
  needsAuth: boolean
  needsSwornTranslation: boolean
  mandatory: boolean
  alternativeTo?: string
  translationPages?: number
  applies(input: ChecklistInput): boolean
}

// ── Applies helpers ───────────────────────────────────────────────────────
const ALWAYS = () => true
const isAusb   = (i: ChecklistInput) => i.path === 'ausbildung'
const isStud   = (i: ChecklistInput) => i.path === 'studium'
const isTourist = (i: ChecklistInput) => i.path === 'tourist'
const isFamilyR = (i: ChecklistInput) => i.path === 'family_reunification'
const isNatD   = (i: ChecklistInput) => !isTourist(i)        // all D-visa paths
const isAuSt   = (i: ChecklistInput) => isAusb(i) || isStud(i)

// ── Documents ─────────────────────────────────────────────────────────────
export const DOCUMENTS: Doc[] = [
  // ── IDENTITY ─────────────────────────────────────────────────────────────
  { id: 'passport',             category: 'identity',  costEur: [40, 90],   timelineDays: [14, 28], needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: ALWAYS },
  { id: 'biometric_photos',     category: 'identity',  costEur: [5, 15],    timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: ALWAYS },
  { id: 'birth_certificate',    category: 'identity',  costEur: [2, 15],    timelineDays: [1, 3],   needsAuth: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 1, applies: isNatD },
  { id: 'police_clearance',     category: 'identity',  costEur: [5, 40],    timelineDays: [3, 10],  needsAuth: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 1, applies: isNatD },
  { id: 'marriage_certificate', category: 'identity',  costEur: [2, 15],    timelineDays: [1, 3],   needsAuth: true,  needsSwornTranslation: true,  mandatory: false, translationPages: 1,
    applies: (i) => (isFamilyR(i) && (i.family === 'married' || i.family === 'married_kids'))
                 || (!isTourist(i) && !!i.bringFamily && (i.family === 'married' || i.family === 'married_kids')) },
  { id: 'children_birth_certs', category: 'identity',  costEur: [4, 20],    timelineDays: [1, 3],   needsAuth: true,  needsSwornTranslation: true,  mandatory: false, translationPages: 2,
    applies: (i) => (isFamilyR(i) && i.family === 'married_kids')
                 || (!isTourist(i) && !!i.bringFamily && i.family === 'married_kids') },

  // ── ACADEMIC (ausbildung / studium only) ──────────────────────────────────
  { id: 'bac_diploma',          category: 'academic',  costEur: [0, 15],    timelineDays: [7, 14],  needsAuth: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 1, applies: isAuSt },
  { id: 'bac_transcripts',      category: 'academic',  costEur: [0, 15],    timelineDays: [7, 14],  needsAuth: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 2, applies: isAuSt },
  { id: 'higher_ed_diploma',    category: 'academic',  costEur: [10, 50],   timelineDays: [14, 28], needsAuth: true,  needsSwornTranslation: true,  mandatory: false, translationPages: 1, applies: (i) => isAuSt(i) && i.education !== 'bac' },
  { id: 'higher_ed_transcripts', category: 'academic', costEur: [10, 50],   timelineDays: [14, 28], needsAuth: true,  needsSwornTranslation: true,  mandatory: false, translationPages: 3, applies: (i) => isAuSt(i) && i.education !== 'bac' },
  { id: 'aps_certificate',      category: 'academic',  costEur: [0, 0],     timelineDays: [42, 140], needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: (i) => isStud(i) && !i.apsDone && COUNTRIES[i.country]?.apsRequired },
  { id: 'anabin_check',         category: 'academic',  costEur: [0, 0],     timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: false, applies: isAuSt },
  { id: 'studienkolleg',        category: 'academic',  costEur: [0, 20],    timelineDays: [28, 56], needsAuth: false, needsSwornTranslation: false, mandatory: false, applies: (i) => isStud(i) && i.education === 'bac' },

  // ── LANGUAGE ─────────────────────────────────────────────────────────────
  { id: 'german_b1',            category: 'language',  costEur: [150, 280], timelineDays: [42, 84], needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: (i) => isAusb(i) && !i.hasGermanCert },
  { id: 'german_b2',            category: 'language',  costEur: [180, 320], timelineDays: [42, 84], needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: (i) => isStud(i) && !i.hasGermanCert },
  { id: 'german_a1_cert',       category: 'language',  costEur: [150, 250], timelineDays: [42, 84], needsAuth: false, needsSwornTranslation: false, mandatory: true,
    applies: (i) => isFamilyR(i) && (i.family === 'married' || i.family === 'married_kids') },

  // ── APPLICATION (D-visa paths) ────────────────────────────────────────────
  { id: 'visa_application_form', category: 'application', costEur: [0, 0],  timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isNatD },
  { id: 'cv_german',            category: 'application', costEur: [0, 0],   timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isAuSt },
  { id: 'motivation_letter',    category: 'application', costEur: [0, 0],   timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isAuSt },

  // ── EMPLOYER (ausbildung) ─────────────────────────────────────────────────
  { id: 'ausbildungsvertrag',   category: 'employer',  costEur: [0, 0],     timelineDays: [7, 30],  needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isAusb },
  { id: 'taetigkeitsbeschreibung', category: 'employer', costEur: [0, 0],   timelineDays: [3, 10],  needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isAusb },
  { id: 'vorab_zustimmung',     category: 'employer',  costEur: [0, 0],     timelineDays: [14, 28], needsAuth: false, needsSwornTranslation: false, mandatory: false, applies: (i) => isAusb(i) && i.vorab === true },

  // ── UNIVERSITY (studium) ───────────────────────────────────────────────────
  { id: 'university_admission', category: 'university', costEur: [0, 0],    timelineDays: [28, 84], needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isStud },

  // ── FINANCIAL ────────────────────────────────────────────────────────────
  { id: 'sperrkonto',           category: 'financial', costEur: [89, 150],  timelineDays: [7, 14],  needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isAuSt },
  { id: 'verpflichtungserklaerung', category: 'financial', costEur: [29, 29], timelineDays: [7, 14], needsAuth: false, needsSwornTranslation: false, mandatory: false, alternativeTo: 'sperrkonto', applies: isAuSt },
  { id: 'bank_statements',      category: 'financial', costEur: [5, 15],    timelineDays: [1, 3],   needsAuth: false, needsSwornTranslation: false, mandatory: false, applies: isAuSt },

  // ── HEALTH ────────────────────────────────────────────────────────────────
  { id: 'travel_health_insurance', category: 'health', costEur: [30, 90],   timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isAuSt },

  // ── HOUSING ──────────────────────────────────────────────────────────────
  { id: 'accommodation_proof',  category: 'housing',   costEur: [0, 150],   timelineDays: [7, 14],  needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isAuSt },

  // ── VISA PROCEDURE (D-visa) ───────────────────────────────────────────────
  { id: 'visa_appointment',     category: 'visa_procedure', costEur: [0, 40], timelineDays: [30, 90], needsAuth: false, needsSwornTranslation: false, mandatory: true, applies: isNatD },
  { id: 'visa_fee',             category: 'visa_procedure', costEur: [75, 75], timelineDays: [0, 1],  needsAuth: false, needsSwornTranslation: false, mandatory: true, applies: isNatD },

  // ── SPONSOR (family reunification, provided by sponsor in Germany) ─────────
  { id: 'sponsor_permit_copy',  category: 'sponsor',   costEur: [0, 0],     timelineDays: [0, 3],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isFamilyR },
  { id: 'sponsor_income_proof', category: 'sponsor',   costEur: [0, 15],    timelineDays: [1, 7],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isFamilyR },
  { id: 'sponsor_housing_proof', category: 'sponsor',  costEur: [0, 0],     timelineDays: [1, 7],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isFamilyR },

  // ── TOURIST / SCHENGEN C VISA ─────────────────────────────────────────────
  { id: 'schengen_visa_form',   category: 'application', costEur: [0, 0],   timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isTourist },
  { id: 'travel_insurance_tourist', category: 'health', costEur: [25, 90],  timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isTourist },
  { id: 'flight_reservation',   category: 'application', costEur: [0, 20],  timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isTourist },
  { id: 'accommodation_tourist', category: 'housing',  costEur: [0, 150],   timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isTourist },
  { id: 'financial_means_proof', category: 'financial', costEur: [0, 15],   timelineDays: [0, 3],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isTourist },
  { id: 'employment_ties_proof', category: 'application', costEur: [0, 10], timelineDays: [0, 3],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isTourist },
  { id: 'schengen_visa_fee',    category: 'visa_procedure', costEur: [90, 90], timelineDays: [0, 1], needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isTourist },
  { id: 'schengen_appointment', category: 'visa_procedure', costEur: [0, 40], timelineDays: [14, 60], needsAuth: false, needsSwornTranslation: false, mandatory: true, applies: isTourist },
]

// ── CalcResult ───────────────────────────────────────────────────────────
export type CalcResult = {
  noVisaRequired?: boolean
  applicableDocs: Doc[]
  byCategory: Record<CategoryKey, Doc[]>
  totalDocs: number
  baseCostEur: [number, number]
  authCostEur: [number, number]
  authCount: number
  authMethod: AuthMethod
  translationCostEur: [number, number]
  translationPages: number
  apsCostEur: [number, number]
  totalCostEur: [number, number]
  longestTimelineDays: [number, number]
  realisticTimelineWeeks: [number, number]
}

const EMPTY_RESULT = (country: CountryRule, noVisa: boolean): CalcResult => ({
  noVisaRequired: noVisa,
  applicableDocs: [], byCategory: {} as Record<CategoryKey, Doc[]>,
  totalDocs: 0, baseCostEur: [0, 0], authCostEur: [0, 0], authCount: 0,
  authMethod: country.auth, translationCostEur: [0, 0], translationPages: 0,
  apsCostEur: [0, 0], totalCostEur: [0, 0], longestTimelineDays: [0, 0], realisticTimelineWeeks: [0, 0],
})

export function calculate(input: ChecklistInput): CalcResult {
  const country = COUNTRIES[input.country] ?? COUNTRIES.other

  // Early-exit: no visa required for this country + path combo
  if (input.path === 'tourist' && !country.touristVisaRequired) return EMPTY_RESULT(country, true)
  if (input.path !== 'tourist' && !country.nationalDVisaRequired) return EMPTY_RESULT(country, true)

  const applicableDocs = DOCUMENTS.filter(d => d.applies(input))
  const byCategory = applicableDocs.reduce<Record<CategoryKey, Doc[]>>((acc, d) => {
    (acc[d.category] = acc[d.category] || []).push(d)
    return acc
  }, {} as Record<CategoryKey, Doc[]>)

  const sumRange = (arr: [number, number][]): [number, number] =>
    arr.reduce<[number, number]>((acc, [lo, hi]) => [acc[0] + lo, acc[1] + hi], [0, 0])

  const baseCostEur = sumRange(applicableDocs.map(d => d.costEur))

  const authCount = applicableDocs.filter(d => d.needsAuth).length
  const authCostEur: [number, number] = [authCount * country.authFeeEur[0], authCount * country.authFeeEur[1]]

  const translationPages = applicableDocs.reduce((s, d) => s + (d.translationPages || 0), 0)
  const translationCostEur: [number, number] = [
    translationPages * country.translationPerPageEur[0],
    translationPages * country.translationPerPageEur[1],
  ]

  const apsInScope = applicableDocs.some(d => d.id === 'aps_certificate')
  const apsCostEur: [number, number] = apsInScope ? country.apsFeeEur : [0, 0]

  const totalCostEur: [number, number] = [
    baseCostEur[0] + authCostEur[0] + translationCostEur[0] + apsCostEur[0],
    baseCostEur[1] + authCostEur[1] + translationCostEur[1] + apsCostEur[1],
  ]

  const docBottleneck = applicableDocs.reduce<[number, number]>(
    (acc, d) => {
      const extra: [number, number] = d.needsAuth ? country.authDays : [0, 0]
      return [Math.max(acc[0], d.timelineDays[0] + extra[0]), Math.max(acc[1], d.timelineDays[1] + extra[1])]
    },
    [0, 0],
  )

  const realisticTimelineWeeks: [number, number] = [
    Math.ceil((docBottleneck[0] * 1.2) / 7),
    Math.ceil((docBottleneck[1] * 1.4) / 7),
  ]

  return {
    applicableDocs, byCategory, totalDocs: applicableDocs.length,
    baseCostEur, authCostEur, authCount, authMethod: country.auth,
    translationCostEur, translationPages, apsCostEur, totalCostEur,
    longestTimelineDays: docBottleneck, realisticTimelineWeeks,
  }
}

export const CATEGORY_ORDER: CategoryKey[] = [
  'identity', 'academic', 'language', 'application',
  'employer', 'university', 'financial', 'health', 'housing', 'visa_procedure', 'sponsor',
]

export const CATEGORY_ICON: Record<CategoryKey, string> = {
  identity: '👤',
  academic: '🎓',
  language: '🗣️',
  application: '📝',
  employer: '💼',
  university: '🏛️',
  financial: '💰',
  health: '⚕️',
  housing: '🏠',
  visa_procedure: '🛂',
  sponsor: '👥',
}
