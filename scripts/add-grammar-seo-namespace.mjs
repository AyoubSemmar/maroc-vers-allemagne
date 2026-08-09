// Inject a `grammarSeo` namespace into every messages/<locale>.json.
// Proper ar/fr/en/de now; other locales English-seeded (translate later).
// Idempotent: overwrites the grammarSeo key each run.
import fs from 'node:fs'

const en = {
  eyebrow: 'Grammar reference',
  hubTitle: 'German Grammar Explained — A1 to C1',
  hubIntro: 'Every German grammar topic from beginner to advanced, explained simply in your language — with tables, real examples and the common mistakes to avoid.',
  hubMetaTitle: 'German Grammar Explained (A1–C1) — Free Reference | GoGermany',
  hubMetaDesc: 'Clear explanations of every German grammar topic from A1 to C1 — cases, verb tenses, articles, word order and more, with examples, in your language.',
  breadcrumbGrammar: 'Grammar',
  practice: 'Practice this in the free course',
  examplesLabel: 'Examples',
  tipLabel: 'Tip',
  rulesLabel: 'Key rules',
  relatedLabel: 'More {level} grammar',
  allTopics: 'All grammar topics',
  metaTitleSuffix: 'German {level} grammar',
}

const overrides = {
  ar: {
    eyebrow: 'مرجع القواعد',
    hubTitle: 'شرح قواعد الألمانية — من A1 إلى C1',
    hubIntro: 'كل مواضيع قواعد اللغة الألمانية من المبتدئ إلى المتقدّم، مشروحة ببساطة بلغتك — مع جداول وأمثلة حقيقية والأخطاء الشائعة التي يجب تجنّبها.',
    hubMetaTitle: 'شرح قواعد الألمانية (A1–C1) — مرجع مجاني | GoGermany',
    hubMetaDesc: 'شروحات واضحة لكل مواضيع قواعد الألمانية من A1 إلى C1 — الحالات والأزمنة والأدوات وترتيب الجملة والمزيد، مع أمثلة، بلغتك.',
    breadcrumbGrammar: 'القواعد',
    practice: 'تدرّب على هذا في الدورة المجانية',
    examplesLabel: 'أمثلة',
    tipLabel: 'نصيحة',
    rulesLabel: 'قواعد أساسية',
    relatedLabel: 'المزيد من قواعد {level}',
    allTopics: 'كل مواضيع القواعد',
    metaTitleSuffix: 'قواعد الألمانية {level}',
  },
  fr: {
    eyebrow: 'Référence de grammaire',
    hubTitle: "Grammaire allemande expliquée — de A1 à C1",
    hubIntro: "Tous les points de grammaire allemande, du débutant à l'avancé, expliqués simplement dans votre langue — avec des tableaux, de vrais exemples et les erreurs à éviter.",
    hubMetaTitle: 'Grammaire allemande expliquée (A1–C1) — Référence gratuite | GoGermany',
    hubMetaDesc: "Explications claires de chaque point de grammaire allemande de A1 à C1 — cas, temps, articles, ordre des mots et plus, avec des exemples, dans votre langue.",
    breadcrumbGrammar: 'Grammaire',
    practice: "S'entraîner dans le cours gratuit",
    examplesLabel: 'Exemples',
    tipLabel: 'Astuce',
    rulesLabel: 'Règles clés',
    relatedLabel: 'Plus de grammaire {level}',
    allTopics: 'Tous les points de grammaire',
    metaTitleSuffix: 'grammaire allemande {level}',
  },
  de: {
    eyebrow: 'Grammatik-Referenz',
    hubTitle: 'Deutsche Grammatik erklärt — A1 bis C1',
    hubIntro: 'Jedes Thema der deutschen Grammatik vom Anfänger bis fortgeschritten, einfach in deiner Sprache erklärt — mit Tabellen, echten Beispielen und den häufigsten Fehlern.',
    hubMetaTitle: 'Deutsche Grammatik erklärt (A1–C1) — Kostenlose Referenz | GoGermany',
    hubMetaDesc: 'Klare Erklärungen zu jedem Thema der deutschen Grammatik von A1 bis C1 — Fälle, Zeitformen, Artikel, Wortstellung und mehr, mit Beispielen, in deiner Sprache.',
    breadcrumbGrammar: 'Grammatik',
    practice: 'Im kostenlosen Kurs üben',
    examplesLabel: 'Beispiele',
    tipLabel: 'Tipp',
    rulesLabel: 'Wichtige Regeln',
    relatedLabel: 'Mehr {level}-Grammatik',
    allTopics: 'Alle Grammatikthemen',
    metaTitleSuffix: 'Deutsch {level} Grammatik',
  },
}

const locales = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh', 'uk', 'sq', 'id']
for (const loc of locales) {
  const p = `messages/${loc}.json`
  const m = JSON.parse(fs.readFileSync(p, 'utf8'))
  m.grammarSeo = { ...en, ...(overrides[loc] || {}) }
  fs.writeFileSync(p, JSON.stringify(m, null, 2) + '\n')
  console.log('updated', p, overrides[loc] ? '(localized)' : '(en-seeded)')
}
console.log('done')
