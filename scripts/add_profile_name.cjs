// Adds profile.name.* keys to all locales.
const fs = require('fs')
const path = require('path')

const MSGS = path.join(__dirname, '..', 'messages')

const patches = {
  ar: {
    heading: 'الاسم',
    firstLabel: 'الاسم الأول',
    lastLabel: 'الاسم العائلي',
    firstPlaceholder: 'مثال: أحمد',
    lastPlaceholder: 'مثال: العلوي',
  },
  fr: {
    heading: 'Nom',
    firstLabel: 'Prénom',
    lastLabel: 'Nom de famille',
    firstPlaceholder: 'Ex. Ahmed',
    lastPlaceholder: 'Ex. El Alaoui',
  },
  en: {
    heading: 'Name',
    firstLabel: 'First name',
    lastLabel: 'Last name',
    firstPlaceholder: 'e.g. Ahmed',
    lastPlaceholder: 'e.g. El Alaoui',
  },
  de: {
    heading: 'Name',
    firstLabel: 'Vorname',
    lastLabel: 'Nachname',
    firstPlaceholder: 'z. B. Ahmed',
    lastPlaceholder: 'z. B. El Alaoui',
  },
}

for (const loc of Object.keys(patches)) {
  const file = path.join(MSGS, `${loc}.json`)
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (!json.profile) {
    console.log(`skip ${loc}: no profile namespace`)
    continue
  }
  json.profile.name = patches[loc]
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`patched ${loc}`)
}
