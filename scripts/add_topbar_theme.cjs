const fs = require('fs')
const path = require('path')
const MSGS = path.join(__dirname, '..', 'messages')

const patches = {
  ar: { themeLight: 'الوضع الفاتح', themeDark: 'الوضع الداكن' },
  fr: { themeLight: 'Mode clair',   themeDark: 'Mode sombre' },
  en: { themeLight: 'Light mode',   themeDark: 'Dark mode' },
  de: { themeLight: 'Heller Modus', themeDark: 'Dunkler Modus' },
}

for (const loc of Object.keys(patches)) {
  const file = path.join(MSGS, `${loc}.json`)
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (!json.dashboard || !json.dashboard.topbar) {
    console.log(`skip ${loc}: missing dashboard.topbar`)
    continue
  }
  Object.assign(json.dashboard.topbar, patches[loc])
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`patched ${loc}`)
}
