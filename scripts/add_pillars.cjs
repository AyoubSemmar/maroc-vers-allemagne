// Phase 2 polish: catchy hero copy + 3 pillars + shared cta buttons
const fs = require('node:fs')
const path = require('node:path')
const ROOT = path.resolve(__dirname, '..', 'messages')

const DATA = {
  ar: {
    shared: {
      ctaTools: 'شاهد الأدوات',
      ctaConsult: 'احجز استشارة',
      pillarsKicker: 'ثلاث خطوات',
      pillarsTitleAus: 'طريقك إلى Ausbildung في ثلاث خطوات',
      pillarsTitleStud: 'طريقك إلى الجامعة في ثلاث خطوات',
      stepLabel: 'الخطوة',
      discover: 'اكتشف',
      comingSoon: 'قريباً',
    },
    ausbildung: {
      heroPre: 'اربح ',
      heroHighlight: '€1.100 شهرياً',
      heroPost: ' أثناء تكوينك في ألمانيا',
      subNew: 'عقد رسمي، تكوين مدفوع الأجر، وأكثر من 5.000 عرض Ausbildung مفتوح للمغاربة.',
      chips: ['📋 عقد رسمي', '💶 راتب شهري', '🇩🇪 إقامة قانونية'],
      pillars: {
        learnGerman: {
          title: 'تعلّم الألمانية',
          desc: 'من A1 إلى C1 — دروس تفاعلية مجانية للمغاربة.',
        },
        find: {
          title: 'اعثر على Ausbildung',
          desc: 'تصفّح +5.000 عرض تكوين بعقد رسمي وراتب في جميع أنحاء ألمانيا.',
        },
        visa: {
          title: 'احصل على تأشيرتك',
          desc: 'دليل شامل لتأشيرة Ausbildung خطوة بخطوة من المغرب.',
        },
      },
    },
    studium: {
      heroPre: 'ادرس ',
      heroHighlight: 'مجاناً',
      heroPost: ' في جامعة ألمانية',
      subNew: 'رسوم دراسية قريبة من الصفر، أكثر من 400 جامعة مفتوحة للمغاربة، وشهادة معترف بها عالمياً.',
      chips: ['🎓 رسوم قريبة من 0€', '🌍 +400 جامعة', '📜 شهادة معترف بها'],
      pillars: {
        learnGerman: {
          title: 'تعلّم الألمانية',
          desc: 'من A1 إلى C1 — دروس تفاعلية مجانية للمغاربة.',
        },
        find: {
          title: 'اختر جامعتك',
          desc: 'تصفّح +400 جامعة ألمانية مع شروط القبول والتخصصات.',
        },
        visa: {
          title: 'احصل على تأشيرة الطالب',
          desc: 'دليل شامل لتأشيرة الطالب خطوة بخطوة من المغرب.',
        },
      },
    },
  },
  fr: {
    shared: {
      ctaTools: 'Voir les outils',
      ctaConsult: 'Prendre rendez-vous',
      pillarsKicker: 'Trois étapes',
      pillarsTitleAus: 'Ton Ausbildung en trois étapes',
      pillarsTitleStud: 'Tes études en trois étapes',
      stepLabel: 'Étape',
      discover: 'Découvrir',
      comingSoon: 'Bientôt',
    },
    ausbildung: {
      heroPre: 'Gagne ',
      heroHighlight: '1 100€/mois',
      heroPost: ' en te formant en Allemagne',
      subNew: 'Contrat officiel, formation rémunérée, plus de 5 000 offres d’Ausbildung ouvertes aux Marocains.',
      chips: ['📋 Contrat officiel', '💶 Salaire mensuel', '🇩🇪 Titre de séjour'],
      pillars: {
        learnGerman: {
          title: 'Apprends l’allemand',
          desc: 'Du niveau A1 à C1 — cours interactifs, gratuits et pensés pour les Marocains.',
        },
        find: {
          title: 'Trouve ton Ausbildung',
          desc: 'Parcoure plus de 5 000 offres avec contrat officiel partout en Allemagne.',
        },
        visa: {
          title: 'Obtiens ton visa',
          desc: 'Guide pas à pas pour la demande de visa Ausbildung depuis le Maroc.',
        },
      },
    },
    studium: {
      heroPre: 'Étudie ',
      heroHighlight: 'gratuitement',
      heroPost: ' dans une université allemande',
      subNew: 'Frais de scolarité proches de 0€, plus de 400 universités ouvertes aux Marocains, diplôme reconnu dans le monde entier.',
      chips: ['🎓 Frais proches de 0€', '🌍 400+ universités', '📜 Diplôme reconnu'],
      pillars: {
        learnGerman: {
          title: 'Apprends l’allemand',
          desc: 'Du niveau A1 à C1 — cours interactifs, gratuits et pensés pour les Marocains.',
        },
        find: {
          title: 'Choisis ton université',
          desc: 'Parcoure plus de 400 universités avec conditions d’admission et spécialités.',
        },
        visa: {
          title: 'Obtiens ton visa étudiant',
          desc: 'Guide pas à pas pour la demande de visa étudiant depuis le Maroc.',
        },
      },
    },
  },
  en: {
    shared: {
      ctaTools: 'See the tools',
      ctaConsult: 'Book a consultation',
      pillarsKicker: 'Three steps',
      pillarsTitleAus: 'Your Ausbildung in three steps',
      pillarsTitleStud: 'Your studies in three steps',
      stepLabel: 'Step',
      discover: 'Discover',
      comingSoon: 'Coming soon',
    },
    ausbildung: {
      heroPre: 'Earn ',
      heroHighlight: '€1,100/mo',
      heroPost: ' while training in Germany',
      subNew: 'Official contract, paid training, 5,000+ Ausbildung offers open to Moroccans.',
      chips: ['📋 Official contract', '💶 Monthly salary', '🇩🇪 Legal residency'],
      pillars: {
        learnGerman: {
          title: 'Learn German',
          desc: 'From A1 to C1 — interactive, free lessons made for Moroccans.',
        },
        find: {
          title: 'Find your Ausbildung',
          desc: 'Browse 5,000+ training positions with an official contract across Germany.',
        },
        visa: {
          title: 'Get your visa',
          desc: 'Step-by-step guide for the Ausbildung visa from Morocco.',
        },
      },
    },
    studium: {
      heroPre: 'Study ',
      heroHighlight: 'for free',
      heroPost: ' at a German university',
      subNew: 'Near-zero tuition, 400+ universities open to Moroccans, and a diploma recognized worldwide.',
      chips: ['🎓 Near-zero tuition', '🌍 400+ universities', '📜 Recognized diploma'],
      pillars: {
        learnGerman: {
          title: 'Learn German',
          desc: 'From A1 to C1 — interactive, free lessons made for Moroccans.',
        },
        find: {
          title: 'Pick your university',
          desc: 'Browse 400+ universities with admission requirements and programs.',
        },
        visa: {
          title: 'Get your student visa',
          desc: 'Step-by-step guide for the student visa from Morocco.',
        },
      },
    },
  },
  de: {
    shared: {
      ctaTools: 'Werkzeuge ansehen',
      ctaConsult: 'Beratung buchen',
      pillarsKicker: 'Drei Schritte',
      pillarsTitleAus: 'Deine Ausbildung in drei Schritten',
      pillarsTitleStud: 'Dein Studium in drei Schritten',
      stepLabel: 'Schritt',
      discover: 'Entdecken',
      comingSoon: 'Bald verfügbar',
    },
    ausbildung: {
      heroPre: 'Verdiene ',
      heroHighlight: '1.100€/Monat',
      heroPost: ' in deiner Ausbildung in Deutschland',
      subNew: 'Offizieller Vertrag, bezahlte Ausbildung, über 5.000 Ausbildungsstellen für Marokkaner.',
      chips: ['📋 Offizieller Vertrag', '💶 Monatliches Gehalt', '🇩🇪 Legaler Aufenthalt'],
      pillars: {
        learnGerman: {
          title: 'Deutsch lernen',
          desc: 'Von A1 bis C1 — kostenlose, interaktive Kurse für Marokkaner.',
        },
        find: {
          title: 'Finde deine Ausbildung',
          desc: 'Über 5.000 Ausbildungsstellen mit offiziellem Vertrag in ganz Deutschland.',
        },
        visa: {
          title: 'Erhalte dein Visum',
          desc: 'Schritt-für-Schritt-Anleitung zum Ausbildungsvisum aus Marokko.',
        },
      },
    },
    studium: {
      heroPre: 'Studiere ',
      heroHighlight: 'gebührenfrei',
      heroPost: ' an einer deutschen Universität',
      subNew: 'Kaum Studiengebühren, über 400 Universitäten für Marokkaner, weltweit anerkannter Abschluss.',
      chips: ['🎓 Kaum Gebühren', '🌍 400+ Universitäten', '📜 Anerkannter Abschluss'],
      pillars: {
        learnGerman: {
          title: 'Deutsch lernen',
          desc: 'Von A1 bis C1 — kostenlose, interaktive Kurse für Marokkaner.',
        },
        find: {
          title: 'Wähle deine Universität',
          desc: 'Über 400 Universitäten mit Zulassungsbedingungen und Studiengängen.',
        },
        visa: {
          title: 'Hol dir dein Studentenvisum',
          desc: 'Schritt-für-Schritt-Anleitung zum Studentenvisum aus Marokko.',
        },
      },
    },
  },
}

for (const loc of ['ar', 'fr', 'en', 'de']) {
  const p = path.join(ROOT, `${loc}.json`)
  const j = JSON.parse(fs.readFileSync(p, 'utf8'))
  j.landing = j.landing || {}
  j.landing.pathHub = j.landing.pathHub || {}
  const d = DATA[loc]

  j.landing.pathHub.shared = { ...(j.landing.pathHub.shared || {}), ...d.shared }
  j.landing.pathHub.ausbildung = { ...(j.landing.pathHub.ausbildung || {}), ...d.ausbildung }
  j.landing.pathHub.studium = { ...(j.landing.pathHub.studium || {}), ...d.studium }

  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8')
  console.log(`patched ${loc}.json`)
}
