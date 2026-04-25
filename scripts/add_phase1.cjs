// Phase 1 i18n patch:
// - New landing.banner.{messages[], dismiss}
// - Overwrite landing.hero numeric copy
// - Replace landing.stats with 4 tiles: jobs / universities / stipend / tuition

const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '..', 'messages')

const DATA = {
  ar: {
    banner: {
      messages: [
        '🇲🇦 ← 🇩🇪 جديد: +1,200 عرض Ausbildung هذا الأسبوع',
        '📄 سيرة ذاتية ورسالة تحفيز مجاناً — دون تسجيل',
        '🎓 الجامعات: استقبال شتاء 2026 مفتوح',
      ],
      dismiss: 'إغلاق',
    },
    hero: {
      eyebrow: 'من المغرب إلى ألمانيا · 2026',
      titleLine1: 'تكوين Ausbildung ودراسة في ألمانيا',
      titleHighlight: '€1.100/شهر أو دراسة مجانية',
      titleLine2: '',
      sub: 'قدّم على عروض Ausbildung حقيقية وجامعات ألمانية مفتوحة للمغاربة — سيرة ذاتية، رسالة، فيزا وسكن في مكان واحد.',
      ctaStart: 'ابدأ التكوين (Ausbildung)',
      ctaBrowse: 'الدراسة في ألمانيا',
    },
    stats: {
      jobs: { num: '40K+', label: 'عروض Ausbildung موثوقة' },
      universities: { num: '400+', label: 'جامعة ألمانية للطلبة الدوليين' },
      stipend: { text: '€1.100', label: 'متوسط الراتب الشهري' },
      tuition: { text: '€0', label: 'تكلفة الدراسة في ألمانيا' },
    },
  },
  fr: {
    banner: {
      messages: [
        '🇲🇦 → 🇩🇪 Nouveau : +1 200 offres d’Ausbildung cette semaine',
        '📄 CV et lettre de motivation gratuits — sans compte',
        '🎓 Universités : rentrée hiver 2026 ouverte',
      ],
      dismiss: 'Fermer',
    },
    hero: {
      eyebrow: 'Du Maroc vers l’Allemagne · 2026',
      titleLine1: 'Ausbildung & études en Allemagne',
      titleHighlight: '€1 100/mois ou études gratuites',
      titleLine2: '',
      sub: 'Postule à de vraies offres d’Ausbildung et aux universités allemandes ouvertes aux Marocains — CV, lettre, visa et logement au même endroit.',
      ctaStart: 'Commencer une Ausbildung',
      ctaBrowse: 'Étudier en Allemagne',
    },
    stats: {
      jobs: { num: '40K+', label: 'offres d’Ausbildung vérifiées' },
      universities: { num: '400+', label: 'universités allemandes ouvertes aux internationaux' },
      stipend: { text: '€1 100', label: 'salaire mensuel moyen' },
      tuition: { text: '€0', label: 'frais de scolarité en Allemagne' },
    },
  },
  en: {
    banner: {
      messages: [
        '🇲🇦 → 🇩🇪 New: 1,200+ Ausbildung offers this week',
        '📄 Free CV & cover letter — no signup',
        '🎓 Universities: Winter 2026 intake is open',
      ],
      dismiss: 'Dismiss',
    },
    hero: {
      eyebrow: 'From Morocco to Germany · 2026',
      titleLine1: 'Ausbildung & Studium in Germany —',
      titleHighlight: '€1,100/mo or free tuition',
      titleLine2: '',
      sub: 'Apply to real verified Ausbildung jobs and German universities open to Moroccans — CV, cover letter, visa and housing in one place.',
      ctaStart: 'Start Ausbildung',
      ctaBrowse: 'Study in Germany',
    },
    stats: {
      jobs: { num: '40K+', label: 'verified Ausbildung jobs' },
      universities: { num: '400+', label: 'German universities for international students' },
      stipend: { text: '€1,100', label: 'average monthly stipend' },
      tuition: { text: '€0', label: 'tuition to study in Germany' },
    },
  },
  de: {
    banner: {
      messages: [
        '🇲🇦 → 🇩🇪 Neu: 1.200+ Ausbildungsstellen diese Woche',
        '📄 Kostenloser Lebenslauf & Anschreiben — ohne Anmeldung',
        '🎓 Universitäten: Wintersemester 2026 geöffnet',
      ],
      dismiss: 'Schließen',
    },
    hero: {
      eyebrow: 'Von Marokko nach Deutschland · 2026',
      titleLine1: 'Ausbildung & Studium in Deutschland —',
      titleHighlight: '€1.100/Monat oder gebührenfrei studieren',
      titleLine2: '',
      sub: 'Bewirb dich auf echte Ausbildungsstellen und deutsche Universitäten, die für Marokkaner offen sind — Lebenslauf, Anschreiben, Visum und Unterkunft an einem Ort.',
      ctaStart: 'Ausbildung starten',
      ctaBrowse: 'In Deutschland studieren',
    },
    stats: {
      jobs: { num: '40K+', label: 'geprüfte Ausbildungsstellen' },
      universities: { num: '400+', label: 'deutsche Universitäten für Internationale' },
      stipend: { text: '€1.100', label: 'durchschnittliches Monatsgehalt' },
      tuition: { text: '€0', label: 'Studiengebühren in Deutschland' },
    },
  },
}

for (const loc of ['ar', 'fr', 'en', 'de']) {
  const p = path.join(ROOT, `${loc}.json`)
  const j = JSON.parse(fs.readFileSync(p, 'utf8'))
  j.landing = j.landing || {}
  const d = DATA[loc]

  j.landing.banner = d.banner
  j.landing.hero = { ...(j.landing.hero || {}), ...d.hero }
  // Merge new stat tiles alongside any old keys (old ones become unused, harmless)
  j.landing.stats = { ...(j.landing.stats || {}), ...d.stats }

  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8')
  console.log(`patched ${loc}.json`)
}
