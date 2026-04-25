const fs = require('fs')
const path = require('path')
const MSGS = path.join(__dirname, '..', 'messages')

const patches = {
  ar: 'تعلّم',
  fr: 'Apprendre',
  en: 'Learn',
  de: 'Lernen',
}

for (const loc of Object.keys(patches)) {
  const file = path.join(MSGS, `${loc}.json`)
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (!json.nav) { console.log(`skip ${loc}`); continue }
  json.nav.learn = patches[loc]
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`patched ${loc}`)
}
