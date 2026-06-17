/* Bucket B-ii — de-Morocco the visa-guide copy (place names, visa
 * centre, authentication authority). Token sweep on the visaGuide
 * namespace per locale. Full per-country visa logic (apostille vs
 * legalization, APS gating, in-text costs) is tracked separately. */
const fs = require('fs')

const TOK = {
  en: [
    ['the German consulate in Rabat', 'the German mission'],
    ['German Embassy in Rabat', 'the German embassy in your country'],
    ['German Embassy Rabat', 'the German embassy in your country'],
    ['in Rabat and Casablanca', 'in your country'],
    ['in Rabat or Casablanca', 'in your country'],
    ['Rabat and Casablanca', "your country's German missions"],
    ['Casablanca, Rabat, Tanger', 'your country'],
    ['Casablanca/Rabat', 'your country'],
    ['Goethe Institut Casablanca', 'a Goethe-Institut'],
    ['Goethe-Institut Casablanca', 'a Goethe-Institut'],
    ['TLScontact Morocco', 'the visa centre'],
    ['TLScontact', 'the visa centre (VFS / TLScontact / embassy)'],
    ['Moroccan MAEC', "your country's foreign-affairs ministry"],
    ['the MAEC', "your country's foreign-affairs ministry"],
    ['MAEC', "your country's foreign-affairs ministry"],
    ["Cour d'Appel", 'the competent local authority'],
    ['Bulletin n°3', 'a police-clearance certificate'],
    ['Bulletin No. 3', 'a police-clearance certificate'],
    ['your local Préfecture', "your country's passport authority"],
    ['Préfecture', 'passport authority'],
    ['Moroccan applicants', 'applicants'],
    ['for Moroccans', 'for applicants'],
    ['from Morocco', 'to Germany'],
    ['Rabat', 'the German mission'],
    ['Tanger', ''],
    ['Tangier', ''],
  ],
  fr: [
    ['le consulat allemand à Rabat', 'la représentation allemande'],
    ["l'ambassade d'Allemagne à Rabat", "l'ambassade d'Allemagne de votre pays"],
    ['à Rabat et Casablanca', 'dans votre pays'],
    ['à Rabat ou Casablanca', 'dans votre pays'],
    ['Rabat et Casablanca', 'les représentations allemandes de votre pays'],
    ['Casablanca, Rabat, Tanger', 'votre pays'],
    ['Goethe Institut Casablanca', 'un Goethe-Institut'],
    ['TLScontact Maroc', 'le centre de visa'],
    ['TLScontact', 'le centre de visa (VFS / TLScontact / ambassade)'],
    ['MAEC marocain', 'le ministère des Affaires étrangères de votre pays'],
    ['le MAEC', 'le ministère des Affaires étrangères de votre pays'],
    ['MAEC', 'le ministère des Affaires étrangères de votre pays'],
    ["Cour d'Appel", "l'autorité locale compétente"],
    ['Bulletin n°3', 'un casier judiciaire'],
    ['votre Préfecture locale', "l'autorité compétente de votre pays"],
    ['Préfecture', 'autorité compétente'],
    ['candidats marocains', 'candidats'],
    ['pour les Marocains', 'pour les candidats'],
    ['depuis le Maroc', "vers l'Allemagne"],
    ['Rabat', 'la représentation allemande'],
    ['Tanger', ''],
  ],
  de: [
    ['das deutsche Konsulat in Rabat', 'die deutsche Vertretung'],
    ['Deutschen Botschaft Rabat', 'der deutschen Botschaft deines Landes'],
    ['Deutsche Botschaft Rabat', 'die deutsche Botschaft deines Landes'],
    ['in Rabat und Casablanca', 'in deinem Land'],
    ['Rabat und Casablanca', 'die deutschen Vertretungen deines Landes'],
    ['Goethe Institut Casablanca', 'ein Goethe-Institut'],
    ['Goethe-Institut Casablanca', 'ein Goethe-Institut'],
    ['TLScontact Marokko', 'das Visumzentrum'],
    ['TLScontact', 'das Visumzentrum (VFS / TLScontact / Botschaft)'],
    ['marokkanische MAEC', 'das Außenministerium deines Landes'],
    ['MAEC', 'das Außenministerium deines Landes'],
    ["Cour d'Appel", 'die zuständige lokale Behörde'],
    ['Bulletin n°3', 'ein Führungszeugnis'],
    ['Préfecture', 'Passbehörde'],
    ['marokkanische Bewerber', 'Bewerber'],
    ['aus Marokko', 'nach Deutschland'],
    ['Rabat', 'die deutsche Vertretung'],
    ['Tanger', ''],
  ],
  ar: [
    ['القنصلية الألمانية بالرباط', 'البعثة الألمانية'],
    ['السفارة الألمانية بالرباط', 'السفارة الألمانية في بلدك'],
    ['السفارة الألمانية في الرباط', 'السفارة الألمانية في بلدك'],
    ['فالرباط والدار البيضاء', 'في بلدك'],
    ['الرباط والدار البيضاء', 'البعثات الألمانية في بلدك'],
    ['الدار البيضاء، الرباط، طنجة', 'بلدك'],
    ['Goethe Institut الدار البيضاء', 'معهد Goethe'],
    ['TLScontact المغرب', 'مركز التأشيرات'],
    ['TLScontact', 'مركز التأشيرات (VFS / TLScontact / السفارة)'],
    ['MAEC المغربي', 'وزارة الخارجية في بلدك'],
    ['MAEC', 'وزارة الخارجية في بلدك'],
    ['المتقدّمين المغاربة', 'المتقدّمين'],
    ['من المغرب', 'إلى ألمانيا'],
    ['الرباط', 'البعثة الألمانية'],
    ['الدار البيضاء', 'مدينتك'],
    ['طنجة', ''],
  ],
}

for (const loc of ['en', 'fr', 'de', 'ar']) {
  const file = `messages/${loc}.json`
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  let str = JSON.stringify(json.visaGuide)
  let n = 0
  for (const [a, b] of TOK[loc]) {
    const before = str
    str = str.split(a).join(b)
    if (str !== before) n++
  }
  json.visaGuide = JSON.parse(str)
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n')
  console.log(loc, 'tokens applied:', n)
}
for (const l of ['en', 'fr', 'de', 'ar']) JSON.parse(fs.readFileSync(`messages/${l}.json`, 'utf8'))
console.log('JSON valid')
