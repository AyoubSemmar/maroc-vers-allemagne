/* eslint-disable */
// Patch i18n messages with dashboard keys.
const fs = require('fs')
const path = require('path')

const LOCALES = ['ar', 'fr', 'en', 'de']

const DASHBOARD = {
  ar: {
    title: 'لوحة التحكم',
    welcomeBack: 'مرحباً بعودتك',
    greeting: 'مرحباً، {name}',
    subtitle: 'إليك خطواتك القادمة في رحلتك نحو ألمانيا',
    path: {
      label: 'مسارك',
      ausbildung: 'مسار التدريب المهني',
      studium: 'مسار الدراسة',
      unset: 'اختر مسارك',
      chooseAus: 'اختر التدريب المهني',
      chooseStud: 'اختر الدراسة',
    },
    profile: {
      title: 'اكتمال الملف الشخصي',
      percent: '{p}٪ مكتمل',
      complete: 'ممتاز! ملفك مكتمل 🎉',
      nextStep: 'الخطوة التالية',
      items: {
        avatar: 'أضف صورة شخصية',
        whatsapp: 'أضف رقم واتساب',
        status: 'حدد وضعك الحالي',
        cv: 'أنشئ سيرتك الذاتية',
        letter: 'أنشئ رسالة تحفيزية',
      },
      fix: 'إصلاح',
    },
    journey: {
      title: 'رحلتك في 3 خطوات',
      status: {
        todo: 'لم تبدأ',
        doing: 'قيد التقدم',
        done: 'مكتمل',
        soon: 'قريباً',
      },
      continue: 'متابعة',
      start: 'ابدأ',
    },
    docs: {
      title: 'وثائقي',
      count: '{n} وثيقة',
      countZero: 'لا توجد وثائق بعد',
      empty: 'ابدأ ببناء سيرتك الذاتية أو رسالتك التحفيزية',
      viewAll: 'عرض الكل',
    },
    tools: {
      title: 'أدواتك السريعة',
      cv: 'منشئ السيرة الذاتية',
      cvDesc: 'سيرة ذاتية ألمانية احترافية في دقائق',
      letter: 'منشئ الرسالة التحفيزية',
      letterDesc: 'رسالة تحفيزية مقنعة بالذكاء الاصطناعي',
    },
    cta: {
      profile: 'إدارة الملف الشخصي',
      consult: 'احجز استشارة',
    },
  },
  fr: {
    title: 'Tableau de bord',
    welcomeBack: 'Bon retour',
    greeting: 'Bonjour, {name}',
    subtitle: 'Voici vos prochaines étapes vers l’Allemagne',
    path: {
      label: 'Votre parcours',
      ausbildung: 'Parcours Ausbildung',
      studium: 'Parcours Études',
      unset: 'Choisissez votre parcours',
      chooseAus: 'Choisir Ausbildung',
      chooseStud: 'Choisir Études',
    },
    profile: {
      title: 'Profil complété',
      percent: '{p}% complet',
      complete: 'Parfait ! Votre profil est complet 🎉',
      nextStep: 'Prochaine étape',
      items: {
        avatar: 'Ajouter une photo de profil',
        whatsapp: 'Ajouter votre WhatsApp',
        status: 'Définir votre statut actuel',
        cv: 'Créer votre CV',
        letter: 'Créer votre lettre de motivation',
      },
      fix: 'Compléter',
    },
    journey: {
      title: 'Votre parcours en 3 étapes',
      status: {
        todo: 'À faire',
        doing: 'En cours',
        done: 'Terminé',
        soon: 'Bientôt',
      },
      continue: 'Continuer',
      start: 'Commencer',
    },
    docs: {
      title: 'Mes documents',
      count: '{n} document(s)',
      countZero: 'Aucun document',
      empty: 'Commencez par créer votre CV ou votre lettre de motivation',
      viewAll: 'Tout voir',
    },
    tools: {
      title: 'Outils rapides',
      cv: 'Créateur de CV',
      cvDesc: 'Un CV allemand professionnel en minutes',
      letter: 'Générateur de lettre',
      letterDesc: 'Lettre de motivation convaincante avec l’IA',
    },
    cta: {
      profile: 'Gérer le profil',
      consult: 'Réserver une consultation',
    },
  },
  en: {
    title: 'Dashboard',
    welcomeBack: 'Welcome back',
    greeting: 'Hello, {name}',
    subtitle: 'Here are your next steps on the road to Germany',
    path: {
      label: 'Your path',
      ausbildung: 'Ausbildung path',
      studium: 'Studium path',
      unset: 'Choose your path',
      chooseAus: 'Choose Ausbildung',
      chooseStud: 'Choose Studium',
    },
    profile: {
      title: 'Profile completion',
      percent: '{p}% complete',
      complete: 'Great! Your profile is complete 🎉',
      nextStep: 'Next step',
      items: {
        avatar: 'Add a profile picture',
        whatsapp: 'Add your WhatsApp number',
        status: 'Set your current status',
        cv: 'Build your CV',
        letter: 'Generate a motivation letter',
      },
      fix: 'Fix',
    },
    journey: {
      title: 'Your journey in 3 steps',
      status: {
        todo: 'Not started',
        doing: 'In progress',
        done: 'Done',
        soon: 'Coming soon',
      },
      continue: 'Continue',
      start: 'Start',
    },
    docs: {
      title: 'My documents',
      count: '{n} document(s)',
      countZero: 'No documents yet',
      empty: 'Start by creating your CV or motivation letter',
      viewAll: 'View all',
    },
    tools: {
      title: 'Quick tools',
      cv: 'CV Builder',
      cvDesc: 'A professional German CV in minutes',
      letter: 'Motivation Letter Generator',
      letterDesc: 'Persuasive motivation letters with AI',
    },
    cta: {
      profile: 'Manage profile',
      consult: 'Book a consultation',
    },
  },
  de: {
    title: 'Dashboard',
    welcomeBack: 'Willkommen zurück',
    greeting: 'Hallo, {name}',
    subtitle: 'Hier sind deine nächsten Schritte nach Deutschland',
    path: {
      label: 'Dein Weg',
      ausbildung: 'Ausbildungsweg',
      studium: 'Studiumsweg',
      unset: 'Wähle deinen Weg',
      chooseAus: 'Ausbildung wählen',
      chooseStud: 'Studium wählen',
    },
    profile: {
      title: 'Profilvollständigkeit',
      percent: '{p}% vollständig',
      complete: 'Super! Dein Profil ist vollständig 🎉',
      nextStep: 'Nächster Schritt',
      items: {
        avatar: 'Profilbild hinzufügen',
        whatsapp: 'WhatsApp-Nummer hinzufügen',
        status: 'Aktuellen Status festlegen',
        cv: 'Lebenslauf erstellen',
        letter: 'Motivationsschreiben erstellen',
      },
      fix: 'Erledigen',
    },
    journey: {
      title: 'Deine Reise in 3 Schritten',
      status: {
        todo: 'Nicht begonnen',
        doing: 'In Arbeit',
        done: 'Erledigt',
        soon: 'Bald verfügbar',
      },
      continue: 'Fortsetzen',
      start: 'Starten',
    },
    docs: {
      title: 'Meine Dokumente',
      count: '{n} Dokument(e)',
      countZero: 'Noch keine Dokumente',
      empty: 'Starte mit deinem Lebenslauf oder Motivationsschreiben',
      viewAll: 'Alle anzeigen',
    },
    tools: {
      title: 'Schnellzugriff-Tools',
      cv: 'Lebenslauf-Builder',
      cvDesc: 'Ein professioneller deutscher CV in Minuten',
      letter: 'Motivationsschreiben-Generator',
      letterDesc: 'Überzeugende Anschreiben mit KI',
    },
    cta: {
      profile: 'Profil verwalten',
      consult: 'Beratung buchen',
    },
  },
}

const NAV_DASHBOARD = { ar: 'لوحة التحكم', fr: 'Tableau de bord', en: 'Dashboard', de: 'Dashboard' }

for (const loc of LOCALES) {
  const p = path.join(__dirname, '..', 'messages', `${loc}.json`)
  const j = JSON.parse(fs.readFileSync(p, 'utf8'))
  j.dashboard = DASHBOARD[loc]
  j.nav = j.nav || {}
  j.nav.dashboard = NAV_DASHBOARD[loc]
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8')
  console.log(`patched ${loc}`)
}
