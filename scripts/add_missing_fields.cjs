const fs = require('fs')
const path = require('path')
const MSGS = path.join(__dirname, '..', 'messages')

const patches = {
  ar: { firstName: 'أضف اسمك الأول', lastName: 'أضف اسم العائلة', email: 'أضف بريدك الإلكتروني' },
  fr: { firstName: 'Ajoutez votre prénom', lastName: 'Ajoutez votre nom', email: 'Ajoutez votre email' },
  en: { firstName: 'Add your first name', lastName: 'Add your last name', email: 'Add your email' },
  de: { firstName: 'Vornamen hinzufügen', lastName: 'Nachnamen hinzufügen', email: 'E-Mail hinzufügen' },
}

for (const loc of Object.keys(patches)) {
  const file = path.join(MSGS, `${loc}.json`)
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  const m = json.dashboard && json.dashboard.profilePage && json.dashboard.profilePage.missing
  if (!m) { console.log(`skip ${loc}`); continue }
  Object.assign(m, patches[loc])
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`patched ${loc}`)
}
