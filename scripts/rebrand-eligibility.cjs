/* Bucket B — eligibility checker i18n globalisation. */
const fs = require('fs')

const SET = {
  en: {
    countryLabel: 'Your country',
    metaTitle: 'Visa Eligibility Checker — Move to Germany',
    metaDesc: 'Check your eligibility for a German Ausbildung or Studium visa — readiness score, blockers and personalised next steps, for applicants from any country.',
    hasApsHint: 'Required only for some countries (China, India, Vietnam, Pakistan…). Issued by the APS office for your country.',
    'financial.family_support': 'Family will support me from my home country',
    'rules.aps_studium.title': 'APS certificate',
    'explain.aps_studium.missing': 'APS is required for applicants from some countries (China, India, Vietnam, Pakistan…). Apply at the APS office for your country — processing takes 6–20 weeks and blocks every other Studium step. Bring all your transcripts since secondary school.',
    'explain.passport.expiring': "Your passport must be valid for at least 12 months at the time of your visa appointment. Renew with your country's passport authority — plan ahead, it can take weeks.",
    'explain.clean_record.clean': 'A clean police-clearance certificate is fine. It usually takes a few days to a few weeks to obtain and must be issued within 3 months of your visa appointment.',
  },
  fr: {
    countryLabel: 'Votre pays',
    metaTitle: "Vérificateur d'éligibilité visa — Partir en Allemagne",
    metaDesc: "Vérifiez votre éligibilité au visa Ausbildung ou Studium en Allemagne — score, blocages et étapes personnalisées, pour les candidats de tout pays.",
    hasApsHint: 'Requis seulement pour certains pays (Chine, Inde, Vietnam, Pakistan…). Délivré par le bureau APS de votre pays.',
    'financial.family_support': 'Ma famille me soutiendra depuis mon pays',
    'rules.aps_studium.title': 'Certificat APS',
    'explain.aps_studium.missing': "L'APS est requis pour les candidats de certains pays (Chine, Inde, Vietnam, Pakistan…). Demandez-le au bureau APS de votre pays — délai 6 à 20 semaines, il bloque toute autre étape du Studium. Apportez tous vos relevés depuis le secondaire.",
    'explain.passport.expiring': "Votre passeport doit être valide au moins 12 mois au moment du rendez-vous visa. Renouvelez-le auprès de l'autorité compétente de votre pays — anticipez, cela peut prendre des semaines.",
    'explain.clean_record.clean': "Un casier judiciaire vierge convient. Il s'obtient généralement en quelques jours à quelques semaines et doit dater de moins de 3 mois au rendez-vous visa.",
  },
  de: {
    countryLabel: 'Dein Land',
    hasApsHint: 'Nur für einige Länder erforderlich (China, Indien, Vietnam, Pakistan…). Ausgestellt von der APS-Stelle deines Landes.',
    'rules.aps_studium.title': 'APS-Zertifikat',
    'explain.aps_studium.missing': 'APS ist für Bewerber aus einigen Ländern Pflicht (China, Indien, Vietnam, Pakistan…). Beantrage es bei der APS-Stelle deines Landes — Bearbeitung 6–20 Wochen, blockiert jeden weiteren Studium-Schritt. Bring alle Zeugnisse seit der Schule mit.',
    'explain.clean_record.clean': 'Ein sauberes Führungszeugnis ist in Ordnung. Es dauert meist einige Tage bis Wochen und muss bei deinem Visumtermin höchstens 3 Monate alt sein.',
  },
  ar: {
    countryLabel: 'بلدك',
    metaTitle: 'فاحص أهلية التأشيرة — الانتقال إلى ألمانيا',
    metaDesc: 'تحقّق من أهليتك لتأشيرة الأوزبيلدونغ أو الـStudium الألمانية — درجة الجاهزية والعوائق وخطوات شخصية، للمتقدّمين من أي بلد.',
    hasApsHint: 'مطلوبة فقط لبعض الدول (الصين، الهند، فيتنام، باكستان…). تُصدر من مكتب APS الخاص ببلدك.',
    'financial.family_support': 'العائلة ستدعمني من بلدي',
    'explain.aps_studium.missing': 'شهادة APS إلزامية للمتقدّمين من بعض الدول (الصين، الهند، فيتنام، باكستان…). تقدّم بطلبها في مكتب APS الخاص ببلدك — المدّة 6 إلى 20 أسبوعاً، وتعيق كل خطوة أخرى في الـStudium. أحضر كل كشوف نقاطك منذ الثانوية.',
    'explain.passport.expiring': 'يجب أن يكون جواز سفرك صالحاً لمدة 12 شهراً على الأقل وقت موعد الفيزا. جدّده لدى الجهة المختصّة في بلدك — خطّط مسبقاً، قد يستغرق أسابيع.',
    'explain.clean_record.clean': 'سجلّ عدلي نظيف يكفي. يُستخرج عادةً في أيام إلى أسابيع، ويجب أن يصدر خلال 3 أشهر قبل موعد الفيزا.',
  },
}

const PATCH = {
  en: {
    'seoSection.intro': [
      ['qualifies for a German visa from Morocco', 'qualifies for a German visa'],
      ['the actual 2026 German consulate rules used in Rabat and Casablanca', 'the actual 2026 German consulate rules'],
    ],
    'explain.german_level_ausbildung.a2_close': [['at Goethe Institut Casablanca/Rabat or a telc-licensed school', 'at a Goethe-Institut or telc-licensed school']],
    'explain.german_level_ausbildung.below': [['Goethe Institut Casablanca/Rabat, telc-licensed schools, or online', 'a Goethe-Institut, telc-licensed school, or online']],
    'explain.education_studium_master.bac_plus_2': [['complete a 3rd year of Licence in Morocco', 'complete a 3rd year of your degree in your home country']],
    'explain.education_studium_master.below': [['complete your Licence in Morocco', 'complete your degree in your home country']],
  },
  fr: {
    'seoSection.intro': [
      ['qualifie pour un visa allemand depuis le Maroc', 'qualifie pour un visa allemand'],
      ['les règles consulaires allemandes 2026 réellement utilisées à Rabat et Casablanca', 'les règles consulaires allemandes 2026'],
    ],
    metaDesc: [['en tant que candidat marocain', 'pour les candidats de tout pays']],
    'explain.german_level_ausbildung.a2_close': [['au Goethe Institut Casablanca/Rabat ou école agréée telc', "à un Goethe-Institut ou une école agréée telc"]],
    'explain.german_level_ausbildung.below': [['Goethe Institut Casablanca/Rabat, écoles agréées telc, ou en ligne', 'un Goethe-Institut, une école agréée telc, ou en ligne']],
    'explain.education_studium_master.bac_plus_2': [['terminez une 3e année de Licence au Maroc', 'terminez une 3e année de votre diplôme dans votre pays']],
    'explain.education_studium_master.below': [['terminer la Licence au Maroc', 'terminer votre diplôme dans votre pays']],
  },
  de: {
    'seoSection.intro': [
      ['für ein deutsches Visum aus Marokko qualifiziert', 'für ein deutsches Visum qualifiziert'],
      ['nach den tatsächlichen Konsulatsregeln 2026, die in Rabat und Casablanca angewandt werden', 'nach den tatsächlichen Konsulatsregeln 2026'],
    ],
    'explain.german_level_ausbildung.a2_close': [['am Goethe Institut Casablanca/Rabat oder telc-Lizenzschule', 'an einem Goethe-Institut oder einer telc-Lizenzschule']],
    'explain.german_level_ausbildung.below': [['Goethe Institut Casablanca/Rabat, telc-Lizenzschulen oder online', 'einem Goethe-Institut, einer telc-Lizenzschule oder online']],
  },
  ar: {
    'seoSection.intro': [
      ['كيتأهل لتأشيرة ألمانية من المغرب', 'كيتأهل لتأشيرة ألمانية'],
      ['المستعملة فالرباط والدار البيضاء', 'المعتمدة لدى البعثات الألمانية'],
    ],
    'seoSection.faqs.0.a': [['للمرشحين المغاربة', 'للمرشحين الدوليين']],
    'explain.financial_proof.sperrkonto': [['أغلب المغاربة يستعملون', 'أغلب المتقدّمين يستعملون']],
    'explain.education_studium_master.bac_plus_2': [['تكمل سنة ثالثة من الإجازة في المغرب', 'تكمل سنة ثالثة من شهادتك في بلدك']],
    'explain.education_studium_master.below': [['أكمل إجازتك في المغرب', 'أكمل شهادتك في بلدك']],
  },
}

function ref(o, path) { const p = path.split('.'); let c = o; for (let i = 0; i < p.length - 1; i++) c = c?.[p[i]]; return [c, p[p.length - 1]] }

for (const loc of ['en', 'fr', 'de', 'ar']) {
  const file = `messages/${loc}.json`
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  const ec = json.eligibilityChecker
  const miss = []
  for (const [path, val] of Object.entries(SET[loc] || {})) { const [c, k] = ref(ec, path); if (c && k in c) c[k] = val; else miss.push('SET ' + path) }
  for (const [path, pairs] of Object.entries(PATCH[loc] || {})) {
    const [c, k] = ref(ec, path); if (!c || !(k in c)) { miss.push('PATCH ' + path); continue }
    for (const [a, b] of pairs) { if (c[k].includes(a)) c[k] = c[k].split(a).join(b); else miss.push('PATCH-str ' + path + ' :: ' + a.slice(0, 25)) }
  }
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n')
  console.log(loc, miss.length ? 'MISS: ' + miss.join(' | ') : 'ok')
}
for (const l of ['en', 'fr', 'de', 'ar']) JSON.parse(fs.readFileSync(`messages/${l}.json`, 'utf8'))
console.log('JSON valid')
