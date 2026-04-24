const fs = require('fs')
const path = require('path')

// Level titles + descriptions
const levels = {
  A1: {
    ar: { title: 'المستوى الأول', description: 'تعلم أساسيات اللغة الألمانية — من الصفر إلى التواصل اليومي.' },
    fr: { title: 'Niveau 1', description: 'Apprends les bases de l\'allemand — de zéro à la communication quotidienne.' },
    en: { title: 'Level 1', description: 'Learn the basics of German — from zero to everyday communication.' },
    de: { title: 'Stufe 1', description: 'Lerne die Grundlagen der deutschen Sprache — von null bis zur Alltagskommunikation.' },
  },
  A2: {
    ar: { title: 'المستوى الثاني', description: 'الماضي، المقارنات، الجمل المركبة والتواصل اليومي.' },
    fr: { title: 'Niveau 2', description: 'Le passé, les comparaisons, les phrases complexes et la communication quotidienne.' },
    en: { title: 'Level 2', description: 'Past tense, comparisons, complex sentences and daily communication.' },
    de: { title: 'Stufe 2', description: 'Vergangenheit, Vergleiche, komplexe Sätze und Alltagskommunikation.' },
  },
  B1: {
    ar: { title: 'المستوى الثالث', description: 'التعبير عن الرأي، العمل، والسفر.' },
    fr: { title: 'Niveau 3', description: 'Exprimer une opinion, le travail et les voyages.' },
    en: { title: 'Level 3', description: 'Expressing opinions, work and travel.' },
    de: { title: 'Stufe 3', description: 'Meinung äußern, Arbeit und Reisen.' },
  },
  B2: {
    ar: { title: 'المستوى الرابع', description: 'الألمانية المتقدمة للعمل والجامعة.' },
    fr: { title: 'Niveau 4', description: 'Allemand avancé pour le travail et l\'université.' },
    en: { title: 'Level 4', description: 'Advanced German for work and university.' },
    de: { title: 'Stufe 4', description: 'Fortgeschrittenes Deutsch für Beruf und Universität.' },
  },
  C1: {
    ar: { title: 'المستوى الخامس', description: 'إتقان اللغة الألمانية — مستوى احترافي.' },
    fr: { title: 'Niveau 5', description: 'Maîtriser l\'allemand — niveau professionnel.' },
    en: { title: 'Level 5', description: 'Mastering German — professional level.' },
    de: { title: 'Stufe 5', description: 'Deutsch beherrschen — professionelles Niveau.' },
  },
}

// Lesson titles (German term kept after em-dash)
const lessons = {
  'a1-01': { ar: 'التعريف بالنفس — Sich vorstellen', fr: 'Se présenter — Sich vorstellen', en: 'Introducing yourself — Sich vorstellen', de: 'Sich vorstellen' },
  'a1-02': { ar: 'الأرقام والأسعار — Zahlen und Preise', fr: 'Nombres et prix — Zahlen und Preise', en: 'Numbers and prices — Zahlen und Preise', de: 'Zahlen und Preise' },
  'a1-03': { ar: 'يومي في ألمانيا — Mein Alltag', fr: 'Mon quotidien en Allemagne — Mein Alltag', en: 'My daily life in Germany — Mein Alltag', de: 'Mein Alltag' },
  'a1-04': { ar: 'في المطعم والمتجر — Im Restaurant', fr: 'Au restaurant et au magasin — Im Restaurant', en: 'At the restaurant and shop — Im Restaurant', de: 'Im Restaurant' },
  'a1-05': { ar: 'العائلة والملكية — Familie und Possessivpronomen', fr: 'Famille et possession — Familie und Possessivpronomen', en: 'Family and possession — Familie und Possessivpronomen', de: 'Familie und Possessivpronomen' },
  'a1-06': { ar: 'البيت والسكن — Wohnen und Wohnung', fr: 'Maison et logement — Wohnen und Wohnung', en: 'Home and housing — Wohnen und Wohnung', de: 'Wohnen und Wohnung' },
  'a1-07': { ar: 'المهن والنفي — Berufe und Negation', fr: 'Métiers et négation — Berufe und Negation', en: 'Professions and negation — Berufe und Negation', de: 'Berufe und Negation' },
  'a1-08': { ar: 'الوقت والتاريخ — Uhrzeit und Datum', fr: 'Heure et date — Uhrzeit und Datum', en: 'Time and date — Uhrzeit und Datum', de: 'Uhrzeit und Datum' },
  'a1-09': { ar: 'التسوق والألوان — Einkaufen und Farben', fr: 'Shopping et couleurs — Einkaufen und Farben', en: 'Shopping and colors — Einkaufen und Farben', de: 'Einkaufen und Farben' },
  'a1-10': { ar: 'الصحة والجسم — Gesundheit und Körper', fr: 'Santé et corps — Gesundheit und Körper', en: 'Health and body — Gesundheit und Körper', de: 'Gesundheit und Körper' },
  'a1-11': { ar: 'الأفعال المنفصلة — Trennbare Verben', fr: 'Verbes à particule séparable — Trennbare Verben', en: 'Separable verbs — Trennbare Verben', de: 'Trennbare Verben' },
  'a1-12': { ar: 'مراجعة ومحادثات يومية — Kommunikation und Wiederholung', fr: 'Révision et conversations — Kommunikation und Wiederholung', en: 'Review and daily conversation — Kommunikation und Wiederholung', de: 'Kommunikation und Wiederholung' },

  'a2-01': { ar: 'الماضي مع haben — Perfekt mit haben', fr: 'Passé composé avec haben — Perfekt mit haben', en: 'Past tense with haben — Perfekt mit haben', de: 'Perfekt mit haben' },
  'a2-02': { ar: 'الماضي مع sein — Perfekt mit sein', fr: 'Passé composé avec sein — Perfekt mit sein', en: 'Past tense with sein — Perfekt mit sein', de: 'Perfekt mit sein' },
  'a2-03': { ar: 'حالة الإضافة — Dativ', fr: 'Le datif — Dativ', en: 'The dative case — Dativ', de: 'Dativ' },
  'a2-04': { ar: 'حروف الجر المزدوجة — Wechselpräpositionen', fr: 'Prépositions mixtes — Wechselpräpositionen', en: 'Two-way prepositions — Wechselpräpositionen', de: 'Wechselpräpositionen' },
  'a2-05': { ar: 'المقارنة والتفضيل — Komparativ und Superlativ', fr: 'Comparatif et superlatif — Komparativ und Superlativ', en: 'Comparative and superlative — Komparativ und Superlativ', de: 'Komparativ und Superlativ' },
  'a2-06': { ar: 'الجمل المركبة — Nebensätze', fr: 'Phrases subordonnées — Nebensätze', en: 'Subordinate clauses — Nebensätze', de: 'Nebensätze' },
  'a2-07': { ar: 'الأفعال المنعكسة — Reflexive Verben', fr: 'Verbes réfléchis — Reflexive Verben', en: 'Reflexive verbs — Reflexive Verben', de: 'Reflexive Verben' },
  'a2-08': { ar: 'الماضي البسيط — Präteritum', fr: 'Prétérit — Präteritum', en: 'Simple past — Präteritum', de: 'Präteritum' },
  'a2-09': { ar: 'السفر والمواصلات — Reisen und Verkehr', fr: 'Voyages et transports — Reisen und Verkehr', en: 'Travel and transport — Reisen und Verkehr', de: 'Reisen und Verkehr' },
  'a2-10': { ar: 'الطقس والمواسم — Wetter und Jahreszeiten', fr: 'Météo et saisons — Wetter und Jahreszeiten', en: 'Weather and seasons — Wetter und Jahreszeiten', de: 'Wetter und Jahreszeiten' },
  'a2-11': { ar: 'الصحة والطعام — Gesundheit und Ernährung', fr: 'Santé et alimentation — Gesundheit und Ernährung', en: 'Health and nutrition — Gesundheit und Ernährung', de: 'Gesundheit und Ernährung' },
  'a2-12': { ar: 'مراجعة ومحادثات — Wiederholung und Kommunikation', fr: 'Révision et conversation — Wiederholung und Kommunikation', en: 'Review and conversation — Wiederholung und Kommunikation', de: 'Wiederholung und Kommunikation' },

  'b1-01': { ar: 'Konjunktiv II — الشرط والتمني', fr: 'Konjunktiv II — conditionnel et souhait', en: 'Konjunktiv II — conditional and wishes', de: 'Konjunktiv II — Bedingung und Wunsch' },
  'b1-02': { ar: 'Passiv — المبني للمجهول', fr: 'Passiv — voix passive', en: 'Passiv — passive voice', de: 'Passiv' },
  'b1-03': { ar: 'Genitiv — حالة الملكية', fr: 'Genitiv — le génitif', en: 'Genitiv — genitive case', de: 'Genitiv' },
  'b1-04': { ar: 'Relativsätze — الجمل الموصولة', fr: 'Relativsätze — propositions relatives', en: 'Relativsätze — relative clauses', de: 'Relativsätze' },
  'b1-05': { ar: 'Konnektoren — أدوات الربط المتقدمة', fr: 'Konnektoren — connecteurs avancés', en: 'Konnektoren — advanced connectors', de: 'Konnektoren' },
  'b1-06': { ar: 'Arbeit und Bewerbung — العمل والترشح للوظيفة', fr: 'Arbeit und Bewerbung — travail et candidature', en: 'Arbeit und Bewerbung — work and applications', de: 'Arbeit und Bewerbung' },
  'b1-07': { ar: 'Indirekte Rede — الكلام غير المباشر', fr: 'Indirekte Rede — discours indirect', en: 'Indirekte Rede — reported speech', de: 'Indirekte Rede' },
  'b1-08': { ar: 'Plusquamperfekt — الماضي التام', fr: 'Plusquamperfekt — plus-que-parfait', en: 'Plusquamperfekt — past perfect', de: 'Plusquamperfekt' },
  'b1-09': { ar: 'Adjektivdeklination — تصريف الصفة', fr: 'Adjektivdeklination — déclinaison de l\'adjectif', en: 'Adjektivdeklination — adjective declension', de: 'Adjektivdeklination' },
  'b1-10': { ar: 'Umwelt und Gesellschaft — البيئة والمجتمع', fr: 'Umwelt und Gesellschaft — environnement et société', en: 'Umwelt und Gesellschaft — environment and society', de: 'Umwelt und Gesellschaft' },
  'b1-11': { ar: 'Reisen und Erfahrungen — السفر والتجارب', fr: 'Reisen und Erfahrungen — voyages et expériences', en: 'Reisen und Erfahrungen — travel and experiences', de: 'Reisen und Erfahrungen' },
  'b1-12': { ar: 'Wiederholung B1 — مراجعة شاملة', fr: 'Wiederholung B1 — révision complète', en: 'Wiederholung B1 — full review', de: 'Wiederholung B1' },

  'b2-01': { ar: 'Nominalisierung — تحويل الأفعال إلى أسماء', fr: 'Nominalisierung — nominalisation', en: 'Nominalisierung — nominalization', de: 'Nominalisierung' },
  'b2-02': { ar: 'Partizip I & II als Attribute — صفات مصدرية', fr: 'Partizip I & II als Attribute — participes attributs', en: 'Partizip I & II als Attribute — participial attributes', de: 'Partizip I & II als Attribute' },
  'b2-03': { ar: 'Finalsätze — جمل الهدف (um...zu / damit)', fr: 'Finalsätze — propositions de but (um…zu / damit)', en: 'Finalsätze — purpose clauses (um…zu / damit)', de: 'Finalsätze (um…zu / damit)' },
  'b2-04': { ar: 'Modalverben subjektiv — الدلالة الافتراضية', fr: 'Modalverben subjektiv — sens subjectif des modaux', en: 'Modalverben subjektiv — subjective modal use', de: 'Modalverben subjektiv' },
  'b2-05': { ar: 'Passiv mit Modalverben', fr: 'Passiv mit Modalverben — passif avec modaux', en: 'Passiv mit Modalverben — passive with modals', de: 'Passiv mit Modalverben' },
  'b2-06': { ar: 'Verben mit Präpositionen — الأفعال مع حروف الجر', fr: 'Verben mit Präpositionen — verbes prépositionnels', en: 'Verben mit Präpositionen — verbs with prepositions', de: 'Verben mit Präpositionen' },
  'b2-07': { ar: 'Adjektive mit Präpositionen', fr: 'Adjektive mit Präpositionen — adjectifs prépositionnels', en: 'Adjektive mit Präpositionen — adjectives with prepositions', de: 'Adjektive mit Präpositionen' },
  'b2-08': { ar: 'Konnektoren B2 — sodass, je...desto, anstatt', fr: 'Konnektoren B2 — sodass, je…desto, anstatt', en: 'Konnektoren B2 — sodass, je…desto, anstatt', de: 'Konnektoren B2 — sodass, je…desto, anstatt' },
  'b2-09': { ar: 'Arbeitswelt und Karriere', fr: 'Arbeitswelt und Karriere — monde du travail et carrière', en: 'Arbeitswelt und Karriere — work world and career', de: 'Arbeitswelt und Karriere' },
  'b2-10': { ar: 'Bildung und Studium — التعليم والجامعة', fr: 'Bildung und Studium — éducation et études', en: 'Bildung und Studium — education and studies', de: 'Bildung und Studium' },
  'b2-11': { ar: 'Meinung und Argumentation — الحجاج والرأي', fr: 'Meinung und Argumentation — opinion et argumentation', en: 'Meinung und Argumentation — opinion and argumentation', de: 'Meinung und Argumentation' },
  'b2-12': { ar: 'Wiederholung B2 — مراجعة شاملة', fr: 'Wiederholung B2 — révision complète', en: 'Wiederholung B2 — full review', de: 'Wiederholung B2' },

  'c1-01': { ar: 'Konjunktiv II الماضي — التمني والأسف', fr: 'Konjunktiv II passé — souhait et regret', en: 'Konjunktiv II past — wishes and regrets', de: 'Konjunktiv II der Vergangenheit' },
  'c1-02': { ar: 'n-Deklination — انحراف الأسماء الضعيفة', fr: 'n-Deklination — déclinaison faible', en: 'n-Deklination — weak noun declension', de: 'n-Deklination' },
  'c1-03': { ar: 'بدائل المبني للمجهول — Passiversatzformen', fr: 'Alternatives au passif — Passiversatzformen', en: 'Passive alternatives — Passiversatzformen', de: 'Passiversatzformen' },
  'c1-04': { ar: 'الجمل الشرطية بدون wenn — Konditional ohne "wenn"', fr: 'Conditionnelles sans wenn — Konditional ohne „wenn"', en: 'Conditionals without wenn — Konditional ohne "wenn"', de: 'Konditional ohne „wenn"' },
  'c1-05': { ar: 'Funktionsverbgefüge — المركبات الفعلية الوظيفية', fr: 'Funktionsverbgefüge — constructions verbales fonctionnelles', en: 'Funktionsverbgefüge — functional verb phrases', de: 'Funktionsverbgefüge' },
  'c1-06': { ar: 'الاشتقاق الاسمي الموسع — Erweiterte Partizipialattribute', fr: 'Attributs participiaux étendus — Erweiterte Partizipialattribute', en: 'Extended participial attributes — Erweiterte Partizipialattribute', de: 'Erweiterte Partizipialattribute' },
  'c1-07': { ar: 'اللغة العلمية — Wissenschaftliche Sprache', fr: 'Langue scientifique — Wissenschaftliche Sprache', en: 'Academic language — Wissenschaftliche Sprache', de: 'Wissenschaftliche Sprache' },
  'c1-08': { ar: 'التعابير الاصطلاحية — Redewendungen', fr: 'Expressions idiomatiques — Redewendungen', en: 'Idiomatic expressions — Redewendungen', de: 'Redewendungen' },
  'c1-09': { ar: 'الاقتصاد والسياسة — Wirtschaft und Politik', fr: 'Économie et politique — Wirtschaft und Politik', en: 'Economy and politics — Wirtschaft und Politik', de: 'Wirtschaft und Politik' },
  'c1-10': { ar: 'الأدب والثقافة — Literatur und Kultur', fr: 'Littérature et culture — Literatur und Kultur', en: 'Literature and culture — Literatur und Kultur', de: 'Literatur und Kultur' },
  'c1-11': { ar: 'العرض والمناقشة — Präsentation und Diskussion', fr: 'Présentation et discussion — Präsentation und Diskussion', en: 'Presentation and discussion — Präsentation und Diskussion', de: 'Präsentation und Diskussion' },
  'c1-12': { ar: 'مراجعة شاملة — Wiederholung C1', fr: 'Révision complète — Wiederholung C1', en: 'Full review — Wiederholung C1', de: 'Wiederholung C1' },
}

for (const loc of ['ar', 'fr', 'en', 'de']) {
  const p = path.join(__dirname, '..', 'messages', `${loc}.json`)
  const j = JSON.parse(fs.readFileSync(p, 'utf8'))
  j.learnGerman = j.learnGerman || {}
  j.learnGerman.data = {
    levels: Object.fromEntries(Object.entries(levels).map(([k, v]) => [k, v[loc]])),
    lessons: Object.fromEntries(Object.entries(lessons).map(([k, v]) => [k, v[loc]])),
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8')
  console.log(`✓ ${loc}.json`)
}
