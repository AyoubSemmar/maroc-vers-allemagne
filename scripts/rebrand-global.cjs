/* Global rebrand sweep: neutralise Morocco-specific identity + audience
 * framing across messages/{en,fr,de,ar}.json. Identity strings are set
 * directly; audience phrases are ordered longest-first and applied to
 * the whole JSON string (keys are English camelCase, never matched). */
const fs = require('fs')

// 1) Identity strings set by path.
const IDENTITY = {
  en: {
    'footer.brandTag': 'Your complete guide to immigration, work, and study in Germany — for people moving from anywhere in the world.',
    'footer.copyright': '© {year} GoGermany · Your move to Germany',
    'landing.hero.eyebrow': 'Your move to Germany',
    'landing.hero.trust': 'Join thousands of people on their way to Germany',
    'landing.hero.sub': 'Apply to real verified Ausbildung jobs and German universities open to international applicants — CV, cover letter, visa and housing in one place.',
    'bookConsult.price': '€{price} · {duration} min',
  },
  fr: {
    'footer.brandTag': "Votre guide complet pour l'immigration, le travail et les études en Allemagne — où que vous soyez dans le monde.",
    'footer.copyright': "© {year} GoGermany · Votre départ vers l'Allemagne",
    'landing.hero.eyebrow': "Votre départ vers l'Allemagne",
    'landing.hero.trust': "Rejoignez des milliers de personnes en route vers l'Allemagne",
    'landing.hero.sub': "Postulez à de vraies offres d'Ausbildung et aux universités allemandes ouvertes aux candidats internationaux — CV, lettre, visa et logement au même endroit.",
    'bookConsult.price': '{price} € · {duration} min',
  },
  de: {
    'footer.brandTag': 'Dein kompletter Leitfaden für Einwanderung, Arbeit und Studium in Deutschland — von überall auf der Welt.',
    'footer.copyright': '© {year} GoGermany · Dein Weg nach Deutschland',
    'landing.hero.eyebrow': 'Dein Weg nach Deutschland',
    'landing.hero.trust': 'Schließ dich Tausenden auf dem Weg nach Deutschland an',
    'landing.hero.sub': 'Bewirb dich auf echte Ausbildungsstellen und deutsche Universitäten, die internationalen Bewerbern offenstehen — Lebenslauf, Anschreiben, Visum und Unterkunft an einem Ort.',
    'bookConsult.price': '{price} € · {duration} Min.',
  },
  ar: {
    'footer.brandTag': 'دليلك الشامل للهجرة والعمل والدراسة في ألمانيا — من أي مكان في العالم.',
    'footer.copyright': '© {year} GoGermany · طريقك إلى ألمانيا',
    'landing.hero.eyebrow': 'طريقك إلى ألمانيا',
    'landing.hero.trust': 'انضم لآلاف الأشخاص في طريقهم نحو ألمانيا',
    'landing.hero.sub': 'قدّم على عروض Ausbildung حقيقية وجامعات ألمانية مفتوحة للمترشحين الدوليين — سيرة ذاتية، رسالة، فيزا وسكن في مكان واحد.',
    'bookConsult.price': '{price} € · {duration} دقيقة',
  },
}

// 2) Ordered phrase replacements (longest/most-specific first).
const PHRASES = {
  en: [
    ['Built for Moroccans', 'Built for people moving from anywhere'],
    ['built for Moroccans', 'built for people moving from anywhere'],
    ['open to Moroccans', 'open to international applicants'],
    ['thousands of Moroccans', 'thousands of people'],
    ['Moroccan students', 'international students'],
    ['Moroccan student', 'international student'],
    ['Moroccan applicants', 'international applicants'],
    ['Moroccan applicant', 'international applicant'],
    ['Moroccan candidates', 'international candidates'],
    ['Moroccan candidate', 'international candidate'],
    ['Moroccan trainees', 'international trainees'],
    ['Moroccan apprentices', 'international apprentices'],
    ['Moroccan families', 'international families'],
    ['for Moroccans', 'for internationals'],
    ['as a Moroccan', 'as an international applicant'],
    ['Moroccans who', 'people who'],
    ['Moroccans,', 'internationals,'],
    ['Moroccans.', 'internationals.'],
    ['Moroccans ', 'internationals '],
    ['200 MAD', '€20'],
  ],
  fr: [
    ['conçus pour les Marocains', 'conçus pour les internationaux'],
    ['des milliers de Marocains', 'des milliers de personnes'],
    ['ouvertes aux Marocains', 'ouvertes aux candidats internationaux'],
    ['pour les Marocains', 'pour les internationaux'],
    ['étudiants marocains', 'étudiants internationaux'],
    ['candidats marocains', 'candidats internationaux'],
    ['apprentis marocains', 'apprentis internationaux'],
    ['aux Marocains', 'aux candidats internationaux'],
    ['les Marocains qui', 'les personnes qui'],
    ['les Marocains', 'les internationaux'],
    ['des Marocains', 'des candidats internationaux'],
    ['aux candidats marocains', 'aux candidats internationaux'],
    ['pour Marocains', 'pour internationaux'],
    ['200 MAD', '20 €'],
  ],
  de: [
    ['Tausenden Marokkanern', 'Tausenden Menschen'],
    ['für Marokkaner', 'für internationale Bewerber'],
    ['marokkanische Studierende', 'internationale Studierende'],
    ['marokkanische Studenten', 'internationale Studierende'],
    ['marokkanische Bewerber', 'internationale Bewerber'],
    ['marokkanischer Bewerber', 'internationaler Bewerber'],
    ['marokkanische Auszubildende', 'internationale Auszubildende'],
    ['marokkanischen Bewerber', 'internationalen Bewerber'],
    ['Marokkaner, die', 'Menschen, die'],
    ['Marokkanerinnen und Marokkaner', 'internationale Bewerber'],
    ['200 MAD', '20 €'],
  ],
  ar: [
    ['مبني خصيصاً للمغاربة', 'مبني للقادمين من كل العالم'],
    ['مصمّمة للمغاربة', 'مصمّمة للمترشحين الدوليين'],
    ['مصممة للمغاربة', 'مصممة للمترشحين الدوليين'],
    ['آلاف المغاربة', 'آلاف الأشخاص'],
    ['مفتوحة للمغاربة', 'مفتوحة للمترشحين الدوليين'],
    ['الطلاب المغاربة', 'الطلاب الدوليين'],
    ['الطلبة المغاربة', 'الطلبة الدوليين'],
    ['المترشحين المغاربة', 'المترشحين الدوليين'],
    ['المرشحين المغاربة', 'المرشحين الدوليين'],
    ['المغاربة الذين', 'الأشخاص الذين'],
    ['للمغاربة', 'للمترشحين الدوليين'],
    ['200 درهم', '€20'],
  ],
}

function setByPath(obj, path, val) {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) cur = cur?.[parts[i]]
  if (cur && parts[parts.length - 1] in cur) cur[parts[parts.length - 1]] = val
  else console.log('  ! path not found:', path)
}

for (const loc of ['en', 'fr', 'de', 'ar']) {
  const file = `messages/${loc}.json`
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))

  for (const [path, val] of Object.entries(IDENTITY[loc])) setByPath(json, path, val)

  let str = JSON.stringify(json)
  for (const [find, repl] of PHRASES[loc]) str = str.split(find).join(repl)
  const out = JSON.parse(str) // validates
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n')
  console.log(loc, '✓')
}
console.log('done')
