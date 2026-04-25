const fs = require('fs')
const path = require('path')
const MSGS = path.join(__dirname, '..', 'messages')

const patches = {
  ar: {
    nav: { opportunities: 'الفرص' },
    opportunitiesPicker: {
      title: 'ما الذي تبحث عنه؟',
      subtitle: 'اختر نوع الفرصة لاستعراضها.',
      ausbildung: 'عروض التكوين المهني',
      ausbildungDesc: 'تكوينات بعقد رسمي ومدفوعة الأجر في ألمانيا.',
      universities: 'الجامعات',
      universitiesDesc: 'تخصصات وبرامج جامعية في ألمانيا.',
      close: 'إغلاق',
    },
  },
  fr: {
    nav: { opportunities: 'Opportunités' },
    opportunitiesPicker: {
      title: 'Que cherchez-vous ?',
      subtitle: 'Choisissez le type d’opportunité à explorer.',
      ausbildung: 'Offres d’Ausbildung',
      ausbildungDesc: 'Formations rémunérées avec contrat officiel en Allemagne.',
      universities: 'Universités',
      universitiesDesc: 'Filières et programmes universitaires en Allemagne.',
      close: 'Fermer',
    },
  },
  en: {
    nav: { opportunities: 'Opportunities' },
    opportunitiesPicker: {
      title: 'What are you looking for?',
      subtitle: 'Pick the kind of opportunity you want to browse.',
      ausbildung: 'Ausbildung offers',
      ausbildungDesc: 'Paid training positions with an official contract in Germany.',
      universities: 'Universities',
      universitiesDesc: 'Degree programs and study fields across Germany.',
      close: 'Close',
    },
  },
  de: {
    nav: { opportunities: 'Möglichkeiten' },
    opportunitiesPicker: {
      title: 'Wonach suchst du?',
      subtitle: 'Wähle, welche Art von Möglichkeit du sehen möchtest.',
      ausbildung: 'Ausbildungsplätze',
      ausbildungDesc: 'Bezahlte Ausbildungen mit offiziellem Vertrag in Deutschland.',
      universities: 'Universitäten',
      universitiesDesc: 'Studiengänge und Fachrichtungen in Deutschland.',
      close: 'Schließen',
    },
  },
}

for (const loc of Object.keys(patches)) {
  const file = path.join(MSGS, `${loc}.json`)
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  json.nav = json.nav || {}
  Object.assign(json.nav, patches[loc].nav)
  json.opportunitiesPicker = patches[loc].opportunitiesPicker
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`patched ${loc}`)
}
