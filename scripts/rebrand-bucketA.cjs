/* Bucket A — global rebrand of light copy (landing, migrationTimeline,
 * cvBuilder, anschreiben, interviewPrep, dashboardServices, examPrepCta,
 * dashboard, articles). SET = full-string replace by path; PATCH =
 * substring replace inside one long field. */
const fs = require('fs')

const SET = {
  en: {
    'landing.tools.banks.desc': "Open an account easily, wherever you're from",
    'landing.tools.migrationTimeline.desc': 'Estimate your timeline to Germany phase by phase',
    'landing.ladder.metaMoroccans': 'For internationals',
    'landing.housing.sub': 'Rooms and apartment listings for international students and apprentices moving to Germany.',
    'landing.pathHub.ausbildung.pillars.visa.desc': 'Step-by-step guide for the Ausbildung visa from your country.',
    'landing.pathHub.studium.pillars.visa.desc': 'Step-by-step guide for the student visa from your country.',
    'migrationTimeline.seoSection.title': 'How long does it really take to move to Germany?',
    'migrationTimeline.metaDesc': 'Estimate how long it takes to move to Germany for Ausbildung or Studium — phase-by-phase, based on real BAMF and DAAD timelines.',
    'migrationTimeline.subtitle': 'Estimate your full timeline to Germany — German learning, application, visa, and relocation — based on real 2026 BAMF / DAAD figures.',
    'cvBuilder.seoSection.title': 'How a German Lebenslauf differs from a typical international CV',
    'cvBuilder.metaTitle': 'CV Builder — Move to Germany',
    'anschreiben.metaTitle': 'Cover Letter Generator — Move to Germany',
    'dashboardServices.metaDesc': 'All paid consultation services to help you move to Germany.',
    'dashboardServices.services.document-checklist.bullet2': 'Tells you the cheapest legal way to get the missing ones in your country',
    'examPrepCta.subtitle': 'Book a 30-minute paid 1-on-1 session with a German-speaking specialist who knows the Goethe and telc exam routine — online, wherever you are.',
    'dashboard.videoStudioPage.subtitle': 'Live, instructor-led video classes from A1 to B2 — small groups, structured curriculum, native-speaker teachers, designed for international learners.',
    'articles.metaTitle': 'Articles — Move to Germany',
    'articles.subtitle': 'Your guide to Germany — practical articles on banking, work, universities, Ausbildung and more.',
  },
  fr: {
    'landing.tools.banks.desc': 'Ouvrez un compte facilement, où que vous soyez',
    'landing.tools.migrationTimeline.desc': "Estimez votre délai vers l'Allemagne phase par phase",
    'landing.housing.sub': "Annonces de chambres et d'appartements pour étudiants et apprentis internationaux qui s'installent en Allemagne.",
    'landing.pathHub.ausbildung.pillars.visa.desc': 'Guide pas à pas pour la demande de visa Ausbildung depuis votre pays.',
    'landing.pathHub.studium.pillars.visa.desc': 'Guide pas à pas pour la demande de visa étudiant depuis votre pays.',
    'migrationTimeline.seoSection.title': "Combien de temps faut-il vraiment pour partir en Allemagne ?",
    'migrationTimeline.metaDesc': "Estimez le temps nécessaire pour vous installer en Allemagne pour une Ausbildung ou un Studium — phase par phase, selon les délais réels BAMF et DAAD.",
    'migrationTimeline.subtitle': "Estimez votre délai complet vers l'Allemagne — apprentissage de l'allemand, candidature, visa, installation — basé sur les chiffres BAMF / DAAD 2026.",
    'cvBuilder.seoSection.title': "Pourquoi le Lebenslauf allemand n'a rien à voir avec un CV international classique",
    'cvBuilder.photo.shareText': 'Créé sur GoGermany 🇩🇪',
    'cvBuilder.metaTitle': "Créateur de CV — Partir en Allemagne",
    'anschreiben.metaTitle': "Générateur de lettre de motivation — Partir en Allemagne",
    'dashboardServices.metaDesc': "Toutes les consultations payantes pour vous installer en Allemagne.",
    'dashboardServices.services.document-checklist.bullet2': "Indique le moyen légal le moins cher d'obtenir le manquant dans votre pays",
    'dashboardServices.services.ausbildung.bullet2': "Indique les Länder et villes où le taux d'acceptation international est le plus haut",
    'examPrepCta.subtitle': "Réservez une session payante de 30 minutes en 1-à-1 avec un spécialiste germanophone qui connaît les sessions Goethe et telc — en ligne, où que vous soyez.",
    'dashboard.videoStudioPage.subtitle': "Cours vidéo en direct avec un professeur, du A1 au B2 — petits groupes, programme structuré, professeurs natifs, conçu pour les apprenants internationaux.",
    'articles.metaTitle': "Articles — Partir en Allemagne",
  },
  de: {
    'landing.ladder.metaMoroccans': 'Für internationale Lernende',
    'cvBuilder.seoSection.title': 'Was den deutschen Lebenslauf von einem typischen internationalen CV unterscheidet',
    'examPrepCta.subtitle': 'Buche eine 30-minütige bezahlte 1-zu-1-Sitzung mit einem deutschsprachigen Spezialisten, der die Goethe- und telc-Prüfungstermine kennt — online, wo immer du bist.',
    'dashboard.videoStudioPage.subtitle': 'Live-Videokurse mit Lehrer von A1 bis B2 — kleine Gruppen, strukturiertes Curriculum, Muttersprachler-Lehrer, für internationale Lernende konzipiert.',
    'articles.subtitle': 'Dein Leitfaden für Deutschland — praktische Artikel zu Banken, Arbeit, Universitäten, Ausbildung und mehr.',
  },
  ar: {
    'landing.tools.banks.desc': 'افتح حساباً بسهولة من أي بلد',
    'landing.tools.migrationTimeline.desc': 'احسب مدّتك إلى ألمانيا مرحلة بمرحلة',
    'landing.opportunities.universities.desc': 'دليل شامل للجامعات وشروط القبول للطلبة الدوليين.',
    'landing.housing.sub': 'إعلانات غرف وشقق للطلبة والمتدربين الدوليين القادمين إلى ألمانيا.',
    'landing.pathHub.ausbildung.pillars.visa.desc': 'دليل شامل لتأشيرة Ausbildung خطوة بخطوة من بلدك.',
    'landing.pathHub.studium.pillars.visa.desc': 'دليل شامل لتأشيرة الطالب خطوة بخطوة من بلدك.',
    'migrationTimeline.seoSection.title': 'شحال كتأخذ من الوقت فعلاً باش تنتقل لألمانيا؟',
    'migrationTimeline.metaDesc': 'احسب المدّة اللازمة للانتقال إلى ألمانيا لـ Ausbildung أو Studium — مرحلة بمرحلة، استناداً إلى أوقات BAMF وDAAD الفعلية.',
    'migrationTimeline.subtitle': 'احسب مدّتك الكاملة إلى ألمانيا — تعلّم الألمانية، الترشيح، التأشيرة، الانتقال — استناداً إلى أرقام BAMF / DAAD لعام 2026.',
    'cvBuilder.seoSection.title': 'الـ Lebenslauf الألماني مختلف بزّاف على السيرة الذاتية الدولية المعتادة',
    'cvBuilder.metaTitle': 'منشئ السيرة الذاتية — الانتقال إلى ألمانيا',
    'anschreiben.metaTitle': 'مولّد خطاب التحفيز — الانتقال إلى ألمانيا',
    'dashboardServices.metaDesc': 'جميع الاستشارات المؤدّى عنها لمساعدتك على الانتقال إلى ألمانيا.',
    'dashboardServices.services.document-checklist.bullet2': 'الطريقة القانونية الأقل ثمناً للحصول على الناقص في بلدك',
    'examPrepCta.subtitle': 'احجز جلسة فردية مدفوعة مدّتها 30 دقيقة مع مختصّ ناطق بالألمانية يعرف امتحانات Goethe وtelc — عن بُعد، من أي مكان.',
    'dashboard.videoStudioPage.subtitle': 'دروس فيديو مباشرة مع مدرّس من A1 إلى B2 — مجموعات صغيرة، منهج منظّم، مدرّسون ناطقون أصليّون، مصمّم للمتعلمين الدوليين.',
    'articles.metaTitle': 'المقالات — الانتقال إلى ألمانيا',
    'articles.subtitle': 'دليلك إلى ألمانيا — مقالات عملية في البنوك، العمل، الجامعات، الأوزبيلدونغ والمزيد.',
  },
}

const PATCH = {
  en: {
    'migrationTimeline.seoSection.intro': [
      ['migration timeline from Morocco to Germany', 'migration timeline to Germany'],
      ['timeline from Morocco to Germany', 'timeline to Germany'],
      ['The German consulate in Rabat currently issues Ausbildung visas in 6 to 12 weeks', 'German missions currently issue Ausbildung visas in roughly 6 to 12 weeks'],
    ],
    'cvBuilder.seoSection.intro': [['structured very differently from a Moroccan or French CV', 'structured very differently from a typical international CV']],
    'interviewPrep.questions.why_germany.why': [['just an "exit" from Morocco', 'just an "exit" from your home country']],
    'interviewPrep.questions.why_germany.dontSay': [['Don\'t criticise Morocco.', 'Don\'t criticise your home country.']],
    'interviewPrep.questions.five_years.dontSay': [['Don\'t mention going back to Morocco.', 'Don\'t mention going back home.']],
  },
  fr: {
    'cvBuilder.seoSection.intro': [['structuré très différemment d\'un CV marocain ou français', 'structuré très différemment d\'un CV international classique']],
    'interviewPrep.questions.why_germany.why': [["l'Allemagne n'est qu'une \"sortie\" du Maroc", "l'Allemagne n'est qu'une \"sortie\" de votre pays"]],
    'interviewPrep.questions.why_germany.dontSay': [['Ne critiquez pas le Maroc.', 'Ne critiquez pas votre pays.']],
    'interviewPrep.questions.five_years.dontSay': [['Pas de retour au Maroc.', 'Pas de retour au pays.']],
  },
  de: {
    'cvBuilder.seoSection.intro': [['ganz anders aufgebaut als ein marokkanischer oder französischer Lebenslauf', 'ganz anders aufgebaut als ein typischer internationaler Lebenslauf']],
  },
  ar: {
    'cvBuilder.seoSection.intro': [['على CV مغربي ولا فرنسي', 'على CV دولي معتاد']],
    'interviewPrep.questions.why_germany.why': [['مجرد "مخرج" من المغرب', 'مجرد "مخرج" من بلدك']],
    'interviewPrep.questions.why_germany.dontSay': [['لا تنتقد المغرب.', 'لا تنتقد بلدك.']],
    'interviewPrep.questions.what_sets_you_apart.why': [['هناك مغاربة آخرون بمواصفات مشابهة', 'هناك مترشحون آخرون بمواصفات مشابهة']],
    'interviewPrep.questions.five_years.dontSay': [['لا تذكر العودة إلى المغرب.', 'لا تذكر العودة إلى بلدك.']],
  },
}

function getRef(o, path) { const p = path.split('.'); let c = o; for (let i = 0; i < p.length - 1; i++) c = c?.[p[i]]; return [c, p[p.length - 1]] }

for (const loc of ['en', 'fr', 'de', 'ar']) {
  const file = `messages/${loc}.json`
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  let setN = 0, patchN = 0, miss = []
  for (const [path, val] of Object.entries(SET[loc] || {})) {
    const [c, k] = getRef(json, path)
    if (c && k in c) { c[k] = val; setN++ } else miss.push('SET ' + path)
  }
  for (const [path, pairs] of Object.entries(PATCH[loc] || {})) {
    const [c, k] = getRef(json, path)
    if (!c || !(k in c)) { miss.push('PATCH ' + path); continue }
    for (const [a, b] of pairs) {
      if (c[k].includes(a)) { c[k] = c[k].split(a).join(b); patchN++ } else miss.push('PATCH-str ' + path + ' :: ' + a.slice(0, 30))
    }
  }
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n')
  console.log(loc, 'set=' + setN, 'patch=' + patchN, miss.length ? 'MISS:\n  ' + miss.join('\n  ') : '')
}
for (const l of ['en', 'fr', 'de', 'ar']) JSON.parse(fs.readFileSync(`messages/${l}.json`, 'utf8'))
console.log('JSON valid')
