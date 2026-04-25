const fs = require('fs')
const path = require('path')
const MSGS = path.join(__dirname, '..', 'messages')

const patches = {
  ar: 'مكتمل',
  fr: 'Complet',
  en: 'Complete',
  de: 'Abgeschlossen',
}

for (const loc of Object.keys(patches)) {
  const file = path.join(MSGS, `${loc}.json`)
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (!json.dashboard || !json.dashboard.sidebar) {
    console.log(`skip ${loc}: missing dashboard.sidebar`)
    continue
  }
  json.dashboard.sidebar.complete = patches[loc]
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`patched ${loc}`)
}
