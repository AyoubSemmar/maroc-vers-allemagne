// Inject a `pwa` message namespace into every messages/<locale>.json.
// Proper ar/fr/en/de now; other locales are English-seeded and get translated
// afterwards (subagent batch). Idempotent: overwrites the pwa key each run.
import fs from 'node:fs'

const en = {
  installTitle: 'Install the app',
  installBody: 'Add German lessons to your home screen — works offline.',
  install: 'Install',
  later: 'Not now',
  iosTitle: 'Add to Home Screen',
  iosBody: 'Tap the Share icon, then “Add to Home Screen”.',
  iosGotIt: 'Got it',
  navHome: 'Home',
  navCourse: 'My course',
  navResults: 'Results',
  offlineReady: 'Ready to use offline',
}

const overrides = {
  ar: {
    installTitle: 'ثبّت التطبيق',
    installBody: 'أضِف دروس الألمانية إلى شاشتك الرئيسية — تعمل دون إنترنت.',
    install: 'تثبيت',
    later: 'لاحقاً',
    iosTitle: 'إضافة إلى الشاشة الرئيسية',
    iosBody: 'اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».',
    iosGotIt: 'حسناً',
    navHome: 'الرئيسية',
    navCourse: 'دورتي',
    navResults: 'نتائجي',
    offlineReady: 'جاهز للعمل دون إنترنت',
  },
  fr: {
    installTitle: "Installer l'application",
    installBody: "Ajoutez les cours d'allemand à votre écran d'accueil — fonctionne hors ligne.",
    install: 'Installer',
    later: 'Plus tard',
    iosTitle: "Ajouter à l'écran d'accueil",
    iosBody: "Touchez l'icône Partager, puis « Sur l'écran d'accueil ».",
    iosGotIt: 'Compris',
    navHome: 'Accueil',
    navCourse: 'Mon cours',
    navResults: 'Résultats',
    offlineReady: 'Prêt hors ligne',
  },
  de: {
    installTitle: 'App installieren',
    installBody: 'Deutschkurse zum Startbildschirm hinzufügen — funktioniert offline.',
    install: 'Installieren',
    later: 'Später',
    iosTitle: 'Zum Home-Bildschirm',
    iosBody: 'Tippe auf „Teilen“ und dann „Zum Home-Bildschirm“.',
    iosGotIt: 'Verstanden',
    navHome: 'Start',
    navCourse: 'Mein Kurs',
    navResults: 'Ergebnisse',
    offlineReady: 'Offline verfügbar',
  },
}

const locales = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh', 'uk', 'sq', 'id']
for (const loc of locales) {
  const p = `messages/${loc}.json`
  const m = JSON.parse(fs.readFileSync(p, 'utf8'))
  m.pwa = { ...en, ...(overrides[loc] || {}) }
  fs.writeFileSync(p, JSON.stringify(m, null, 2) + '\n')
  console.log('updated', p, overrides[loc] ? '(localized)' : '(en-seeded)')
}
console.log('done')
