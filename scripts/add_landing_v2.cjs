// Patch messages/{ar,fr,en,de}.json with:
// - Overridden landing.hero.* copy
// - New landing.paths.* (Choose Your Path)
// - New landing.opportunities.*
// - New landing.housing.*
// - New landing.guides.* (renamed from articles labels)

const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '..', 'messages')

const DATA = {
  ar: {
    hero: {
      eyebrow: 'من المغرب إلى ألمانيا',
      titleLine1: 'من المغرب إلى ألمانيا',
      titleHighlight: 'خطوة بخطوة',
      titleLine2: '',
      sub: 'اصنع سيرتك الذاتية، تقدّم للتكوين المهني (Ausbildung) أو للجامعات، وابدأ رحلتك إلى ألمانيا.',
      ctaStart: 'ابدأ التكوين (Ausbildung)',
      ctaBrowse: 'الدراسة في ألمانيا',
    },
    paths: {
      kicker: 'اختر مسارك',
      title: 'طريقان إلى ألمانيا',
      sub: 'اختر ما يناسبك ودعنا نرافقك خطوة بخطوة.',
      ausbildung: {
        title: 'التكوين المهني (Ausbildung)',
        desc: 'تدرّب واعمل في نفس الوقت، مع راتب شهري وعقد رسمي في ألمانيا.',
        cta: 'ابدأ التكوين',
      },
      studium: {
        title: 'الدراسة في ألمانيا',
        desc: 'تقدّم إلى الجامعات الألمانية وادرس مجاناً أو بتكلفة منخفضة جداً.',
        cta: 'اكتشف الجامعات',
      },
    },
    opportunities: {
      kicker: 'الفرص',
      title: 'وظائف ودراسات بانتظارك',
      sub: 'تصفّح عروض Ausbildung الحقيقية والجامعات المفتوحة للمغاربة.',
      ausbildungJobs: {
        title: 'عروض Ausbildung',
        desc: 'آلاف الوظائف التكوينية بعقد رسمي في جميع أنحاء ألمانيا.',
        cta: 'تصفّح العروض',
      },
      universities: {
        title: 'الجامعات الألمانية',
        desc: 'دليل شامل للجامعات وشروط القبول للطلبة المغاربة.',
        cta: 'اكتشف الجامعات',
      },
    },
    housing: {
      kicker: 'السكن',
      title: 'ابحث عن سكنك في ألمانيا',
      sub: 'إعلانات غرف وشقق موجّهة للطلبة والمتدربين القادمين من المغرب.',
      cta: 'تصفّح الإعلانات',
      feature1: 'إعلانات حقيقية يومياً',
      feature2: 'تواصل مباشر مع المالك',
      feature3: 'مناسبة للطلبة والمتدربين',
    },
    guides: {
      kicker: 'أدلة',
      title: 'أدلة ومقالات لرحلتك',
    },
  },
  fr: {
    hero: {
      eyebrow: 'Du Maroc vers l’Allemagne',
      titleLine1: 'Du Maroc vers l’Allemagne',
      titleHighlight: 'étape par étape',
      titleLine2: '',
      sub: 'Rédige ton CV, postule à une Ausbildung ou aux universités, et démarre ton parcours vers l’Allemagne.',
      ctaStart: 'Commencer une Ausbildung',
      ctaBrowse: 'Étudier en Allemagne',
    },
    paths: {
      kicker: 'Choisis ton parcours',
      title: 'Deux voies vers l’Allemagne',
      sub: 'Choisis ce qui te correspond — on t’accompagne étape par étape.',
      ausbildung: {
        title: 'Formation pro (Ausbildung)',
        desc: 'Apprends et travaille en même temps avec un salaire mensuel et un contrat officiel en Allemagne.',
        cta: 'Commencer',
      },
      studium: {
        title: 'Études en Allemagne',
        desc: 'Postule dans les universités allemandes et étudie gratuitement ou à très faible coût.',
        cta: 'Voir les universités',
      },
    },
    opportunities: {
      kicker: 'Opportunités',
      title: 'Des postes et des études qui t’attendent',
      sub: 'Parcoure des offres réelles d’Ausbildung et les universités ouvertes aux Marocains.',
      ausbildungJobs: {
        title: 'Offres Ausbildung',
        desc: 'Des milliers de postes de formation avec contrat officiel partout en Allemagne.',
        cta: 'Voir les offres',
      },
      universities: {
        title: 'Universités allemandes',
        desc: 'Un guide complet des universités et des conditions d’admission pour les Marocains.',
        cta: 'Découvrir',
      },
    },
    housing: {
      kicker: 'Logement',
      title: 'Trouve ton logement en Allemagne',
      sub: 'Annonces de chambres et d’appartements pensées pour étudiants et apprentis venus du Maroc.',
      cta: 'Voir les annonces',
      feature1: 'Annonces réelles, mises à jour chaque jour',
      feature2: 'Contact direct avec le propriétaire',
      feature3: 'Adapté aux étudiants et apprentis',
    },
    guides: {
      kicker: 'Guides',
      title: 'Guides et articles pour ton parcours',
    },
  },
  en: {
    hero: {
      eyebrow: 'From Morocco to Germany',
      titleLine1: 'From Morocco to Germany',
      titleHighlight: 'Step by Step',
      titleLine2: '',
      sub: 'Build your CV, apply to Ausbildung or universities, and start your journey to Germany.',
      ctaStart: 'Start Ausbildung',
      ctaBrowse: 'Study in Germany',
    },
    paths: {
      kicker: 'Choose Your Path',
      title: 'Two routes to Germany',
      sub: 'Pick the one that fits you — we’ll guide you step by step.',
      ausbildung: {
        title: 'Ausbildung (Vocational training)',
        desc: 'Learn and work at the same time with a monthly salary and a formal contract in Germany.',
        cta: 'Start Ausbildung',
      },
      studium: {
        title: 'Study in Germany',
        desc: 'Apply to German universities and study for free or at very low cost.',
        cta: 'Explore universities',
      },
    },
    opportunities: {
      kicker: 'Opportunities',
      title: 'Real jobs and programs waiting for you',
      sub: 'Browse live Ausbildung offers and universities open to Moroccans.',
      ausbildungJobs: {
        title: 'Ausbildung offers',
        desc: 'Thousands of training positions with a formal contract across Germany.',
        cta: 'Browse offers',
      },
      universities: {
        title: 'German universities',
        desc: 'A complete guide to universities and admission requirements for Moroccan applicants.',
        cta: 'Explore',
      },
    },
    housing: {
      kicker: 'Housing',
      title: 'Find a place to live in Germany',
      sub: 'Rooms and apartment listings tailored for students and apprentices coming from Morocco.',
      cta: 'Browse listings',
      feature1: 'Real listings, updated daily',
      feature2: 'Direct contact with the landlord',
      feature3: 'Suited for students and apprentices',
    },
    guides: {
      kicker: 'Guides',
      title: 'Guides & articles for your journey',
    },
  },
  de: {
    hero: {
      eyebrow: 'Von Marokko nach Deutschland',
      titleLine1: 'Von Marokko nach Deutschland',
      titleHighlight: 'Schritt für Schritt',
      titleLine2: '',
      sub: 'Erstelle deinen Lebenslauf, bewirb dich für eine Ausbildung oder ein Studium und starte deinen Weg nach Deutschland.',
      ctaStart: 'Ausbildung starten',
      ctaBrowse: 'In Deutschland studieren',
    },
    paths: {
      kicker: 'Wähle deinen Weg',
      title: 'Zwei Wege nach Deutschland',
      sub: 'Wähle, was zu dir passt — wir begleiten dich Schritt für Schritt.',
      ausbildung: {
        title: 'Ausbildung',
        desc: 'Lernen und arbeiten gleichzeitig — mit monatlichem Gehalt und offiziellem Vertrag in Deutschland.',
        cta: 'Ausbildung starten',
      },
      studium: {
        title: 'Studium in Deutschland',
        desc: 'Bewirb dich an deutschen Universitäten und studiere kostenlos oder sehr günstig.',
        cta: 'Universitäten entdecken',
      },
    },
    opportunities: {
      kicker: 'Chancen',
      title: 'Echte Stellen und Studienplätze warten auf dich',
      sub: 'Entdecke aktuelle Ausbildungsstellen und Universitäten, die für Marokkaner offen sind.',
      ausbildungJobs: {
        title: 'Ausbildungsstellen',
        desc: 'Tausende Ausbildungsstellen mit offiziellem Vertrag in ganz Deutschland.',
        cta: 'Angebote ansehen',
      },
      universities: {
        title: 'Deutsche Universitäten',
        desc: 'Ein kompletter Leitfaden zu Universitäten und Zulassungsbedingungen für marokkanische Bewerber.',
        cta: 'Entdecken',
      },
    },
    housing: {
      kicker: 'Wohnen',
      title: 'Finde eine Unterkunft in Deutschland',
      sub: 'Zimmer- und Wohnungsangebote, zugeschnitten auf Studierende und Azubis aus Marokko.',
      cta: 'Anzeigen ansehen',
      feature1: 'Echte Anzeigen, täglich aktualisiert',
      feature2: 'Direkter Kontakt zum Vermieter',
      feature3: 'Geeignet für Studierende und Azubis',
    },
    guides: {
      kicker: 'Ratgeber',
      title: 'Ratgeber & Artikel für deinen Weg',
    },
  },
}

for (const loc of ['ar', 'fr', 'en', 'de']) {
  const p = path.join(ROOT, `${loc}.json`)
  const j = JSON.parse(fs.readFileSync(p, 'utf8'))
  j.landing = j.landing || {}
  const d = DATA[loc]

  // Overwrite hero copy
  j.landing.hero = { ...(j.landing.hero || {}), ...d.hero }

  // Add new sections
  j.landing.paths = d.paths
  j.landing.opportunities = d.opportunities
  j.landing.housing = d.housing
  j.landing.guides = d.guides

  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8')
  console.log(`patched ${loc}.json`)
}
