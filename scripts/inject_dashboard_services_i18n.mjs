// Inject the `dashboardServices` namespace into all 4 locale files.
// Idempotent: re-running overwrites the namespace.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MESSAGES_DIR = path.join(__dirname, '..', 'messages')

// Per-service content. 'name', 'blurb', 3 bullets, optional 'ribbon'.
const SERVICES = {
  'apply-for-me': {
    en: {
      name: 'Apply For Me',
      blurb: 'We handle your full Ausbildung application from start to invitation.',
      bullet1: 'CV + Anschreiben rewritten in German for each employer',
      bullet2: 'Direct outreach to 30+ pre-vetted Ausbildung employers',
      bullet3: 'Interview coaching once you get callbacks',
      ribbon: 'Most booked',
    },
    fr: {
      name: 'Postulez pour moi',
      blurb: 'Nous gérons votre candidature Ausbildung de A à Z, jusqu\'à l\'entretien.',
      bullet1: 'CV + Anschreiben réécrits en allemand pour chaque employeur',
      bullet2: 'Démarchage direct de 30+ employeurs Ausbildung pré-sélectionnés',
      bullet3: 'Coaching entretien dès les premiers retours',
      ribbon: 'Le plus réservé',
    },
    ar: {
      name: 'قدّم نيابة عني',
      blurb: 'نتولّى ملف ترشحك للتكوين المهني من الصفر إلى الاستدعاء.',
      bullet1: 'إعادة كتابة السيرة الذاتية ورسالة التحفيز بالألمانية لكل صاحب عمل',
      bullet2: 'تواصل مباشر مع أزيد من 30 شركة تكوين منتقاة',
      bullet3: 'تدريب على المقابلة بمجرد وصول أول الردود',
      ribbon: 'الأكثر طلباً',
    },
    de: {
      name: 'Für mich bewerben',
      blurb: 'Wir übernehmen deine komplette Ausbildungs-Bewerbung — bis zur Einladung.',
      bullet1: 'Lebenslauf + Anschreiben pro Arbeitgeber neu auf Deutsch',
      bullet2: 'Direkter Kontakt zu 30+ vorgeprüften Ausbildungsbetrieben',
      bullet3: 'Interview-Coaching, sobald Rückmeldungen kommen',
      ribbon: 'Am häufigsten gebucht',
    },
  },
  'interview-prep': {
    en: {
      name: 'Mock Vorstellungsgespräch',
      blurb: 'Run a realistic German interview, get scored, fix what costs you the offer.',
      bullet1: '30 min real-time German interview with a native-trained coach',
      bullet2: 'Live scoring on language, structure, content, body language',
      bullet3: 'Concrete fixes for your top 3 weak answers — written summary after',
    },
    fr: {
      name: 'Entretien blanc en allemand',
      blurb: 'Simulez un vrai entretien en allemand, soyez noté, corrigez ce qui vous coûte le poste.',
      bullet1: '30 min d\'entretien en allemand avec un coach formé natif',
      bullet2: 'Notation en direct : langue, structure, contenu, langage corporel',
      bullet3: 'Correctifs concrets sur vos 3 réponses les plus faibles — synthèse écrite après',
    },
    ar: {
      name: 'مقابلة تجريبية بالألمانية',
      blurb: 'محاكاة مقابلة حقيقية بالألمانية، تقييم فوري، وتصحيح ما يكلّفك الفرصة.',
      bullet1: '30 دقيقة مقابلة بالألمانية مع مدرّب بمستوى الناطق الأصلي',
      bullet2: 'تقييم مباشر للغة، البناء، المضمون، ولغة الجسد',
      bullet3: 'تصحيحات ملموسة لأضعف 3 إجابات لديك — وملخص مكتوب بعد الجلسة',
    },
    de: {
      name: 'Probe-Vorstellungsgespräch',
      blurb: 'Echtes Bewerbungsgespräch auf Deutsch, Live-Bewertung, gezielte Korrekturen.',
      bullet1: '30 Min. Interview auf Deutsch mit muttersprachlich geschultem Coach',
      bullet2: 'Live-Score zu Sprache, Struktur, Inhalt, Körpersprache',
      bullet3: 'Konkrete Fixes für deine 3 schwächsten Antworten — schriftliche Zusammenfassung danach',
    },
  },
  'cv-anschreiben': {
    en: {
      name: 'CV & Anschreiben review',
      blurb: 'Get your CV and motivation letter audited by someone who reads German recruiter inboxes daily.',
      bullet1: 'Line-by-line rewrite of CV (Lebenslauf) in German format',
      bullet2: 'Anschreiben rewritten for one specific job ad you bring',
      bullet3: 'Format check (PDF, photo, page count, file naming)',
    },
    fr: {
      name: 'Relecture CV & Anschreiben',
      blurb: 'Faites auditer votre CV et lettre de motivation par quelqu\'un qui lit les boîtes de recruteurs allemands chaque jour.',
      bullet1: 'Réécriture ligne par ligne du CV (Lebenslauf) au format allemand',
      bullet2: 'Anschreiben réécrit pour une annonce précise que vous apportez',
      bullet3: 'Vérif format (PDF, photo, pagination, nommage des fichiers)',
    },
    ar: {
      name: 'مراجعة السيرة الذاتية ورسالة التحفيز',
      blurb: 'احصل على مراجعة احترافية من شخص يطّلع يومياً على مراسلات الموظِّفين الألمان.',
      bullet1: 'إعادة كتابة سطر بسطر للسيرة الذاتية (Lebenslauf) بالصيغة الألمانية',
      bullet2: 'إعادة صياغة رسالة التحفيز لإعلان توظيف واحد محدد',
      bullet3: 'مراجعة الشكل (PDF، الصورة، عدد الصفحات، تسمية الملفات)',
    },
    de: {
      name: 'Lebenslauf & Anschreiben-Check',
      blurb: 'Lass deinen Lebenslauf und dein Anschreiben von jemandem prüfen, der täglich Personaler-Postfächer liest.',
      bullet1: 'Lebenslauf zeilenweise auf deutsches Format umgeschrieben',
      bullet2: 'Anschreiben neu für eine konkrete Stellenanzeige',
      bullet3: 'Format-Check (PDF, Foto, Seitenzahl, Dateibenennung)',
    },
  },
  'eligibility': {
    en: {
      name: 'Eligibility deep-dive',
      blurb: 'A specialist runs your profile against the real visa rules — no guesswork.',
      bullet1: 'Reviews your Bac, German level, finances, criminal record requirements',
      bullet2: 'Tells you exactly what blocks you and how long the fix takes',
      bullet3: 'Personalised pathway: Studium, Studienkolleg, Ausbildung, or wait',
    },
    fr: {
      name: 'Test d\'éligibilité approfondi',
      blurb: 'Un spécialiste passe votre profil au crible des vraies règles de visa — aucune supposition.',
      bullet1: 'Vérification Bac, niveau d\'allemand, finances, casier judiciaire',
      bullet2: 'Identifie ce qui vous bloque et combien de temps la correction prend',
      bullet3: 'Chemin personnalisé : Studium, Studienkolleg, Ausbildung ou attente',
    },
    ar: {
      name: 'فحص أهلية معمّق',
      blurb: 'يدرس مختصّ ملفّك وفق القواعد الفعلية للتأشيرة، بلا تخمين.',
      bullet1: 'مراجعة الباكالوريا، مستوى الألمانية، الجانب المالي، السجل العدلي',
      bullet2: 'تحديد ما يعيقك بالضبط والمدّة اللازمة لتجاوزه',
      bullet3: 'مسار شخصي: الدراسة الجامعية، Studienkolleg، التكوين المهني، أو الانتظار',
    },
    de: {
      name: 'Eignungsprüfung im Detail',
      blurb: 'Ein Spezialist prüft dein Profil gegen die echten Visa-Regeln — kein Raten.',
      bullet1: 'Prüfung von Abi, Deutschniveau, Finanzen, Führungszeugnis',
      bullet2: 'Sagt dir genau, was blockiert und wie lange die Lösung dauert',
      bullet3: 'Persönlicher Weg: Studium, Studienkolleg, Ausbildung oder warten',
    },
  },
  'migration-timeline': {
    en: {
      name: 'Migration timeline review',
      blurb: 'Map your next 12 months month-by-month — German, application, visa, arrival.',
      bullet1: 'Stress-tests your goal date against current Goethe slots & TLS waits',
      bullet2: 'Identifies bottlenecks (B1 exam date, APS, visa appointment)',
      bullet3: 'Hands you a printable monthly action plan',
    },
    fr: {
      name: 'Revue du calendrier de migration',
      blurb: 'Cartographiez vos 12 prochains mois mois par mois — allemand, candidature, visa, arrivée.',
      bullet1: 'Confronte votre date cible aux créneaux Goethe et délais TLS actuels',
      bullet2: 'Identifie les goulots (date examen B1, APS, RDV visa)',
      bullet3: 'Plan d\'action mensuel imprimable remis à la fin',
    },
    ar: {
      name: 'مراجعة الجدول الزمني للهجرة',
      blurb: 'خطّط أشهرك الـ12 المقبلة شهراً بشهر — الألمانية، الترشّح، التأشيرة، الوصول.',
      bullet1: 'اختبار تاريخ الهدف مقابل المواعيد المتاحة في Goethe ومدة TLS',
      bullet2: 'تحديد العوائق (موعد امتحان B1، APS، موعد التأشيرة)',
      bullet3: 'تسليم خطة عمل شهرية قابلة للطباعة',
    },
    de: {
      name: 'Migrations-Timeline-Check',
      blurb: 'Plane die nächsten 12 Monate, Schritt für Schritt — Deutsch, Bewerbung, Visum, Ankunft.',
      bullet1: 'Stress-Test deines Zieldatums gegen aktuelle Goethe-Slots & TLS-Wartezeit',
      bullet2: 'Engpässe erkennen (B1-Termin, APS, Visa-Termin)',
      bullet3: 'Druckbarer monatlicher Aktionsplan zum Mitnehmen',
    },
  },
  'document-checklist': {
    en: {
      name: 'Document checklist help',
      blurb: 'A specialist goes through every document with you — what you have, what\'s missing, what\'s wrong.',
      bullet1: 'Reviews each piece (apostille, sworn translation, validity dates)',
      bullet2: 'Tells you the cheapest legal way to get the missing ones in Morocco',
      bullet3: 'Spots common rejection reasons before TLS does',
    },
    fr: {
      name: 'Aide à la liste des documents',
      blurb: 'Un spécialiste passe chaque document avec vous — ce que vous avez, ce qui manque, ce qui cloche.',
      bullet1: 'Revue de chaque pièce (apostille, traduction assermentée, dates de validité)',
      bullet2: 'Indique le moyen légal le moins cher d\'obtenir le manquant au Maroc',
      bullet3: 'Détecte les motifs de rejet avant TLS',
    },
    ar: {
      name: 'مساعدة في لائحة الوثائق',
      blurb: 'يستعرض المختصّ كل وثيقة معك — ما لديك، ما ينقصك، وما يجب تصحيحه.',
      bullet1: 'مراجعة كل وثيقة (الأبوستيل، الترجمة المحلّفة، تواريخ الصلاحية)',
      bullet2: 'الطريقة القانونية الأقل ثمناً للحصول على الناقص داخل المغرب',
      bullet3: 'كشف أسباب الرفض الشائعة قبل أن يكشفها TLS',
    },
    de: {
      name: 'Dokumenten-Checkliste',
      blurb: 'Ein Spezialist geht jedes Dokument mit dir durch — was da ist, was fehlt, was falsch ist.',
      bullet1: 'Prüfung jedes Stücks (Apostille, beglaubigte Übersetzung, Gültigkeit)',
      bullet2: 'Günstigster legaler Weg, fehlende Dokumente in Marokko zu beschaffen',
      bullet3: 'Erkennt typische Ablehnungsgründe, bevor TLS sie sieht',
    },
  },
  'studium': {
    en: {
      name: 'Studium guidance',
      blurb: 'Pick the right university and program — public, English-taught, Studienkolleg or direct Bachelor.',
      bullet1: 'Match Bac average + budget + city preference to 5–10 real programs',
      bullet2: 'Explains uni-assist, APS, and how to send the application correctly',
      bullet3: 'Checklist of deadlines per uni so you don\'t miss admissions',
    },
    fr: {
      name: 'Orientation Studium',
      blurb: 'Choisissez la bonne université et la bonne filière — publique, anglophone, Studienkolleg ou Bachelor direct.',
      bullet1: 'Croise note du Bac + budget + ville pour identifier 5–10 vrais cursus',
      bullet2: 'Explique uni-assist, APS et comment déposer la candidature correctement',
      bullet3: 'Liste des deadlines par université pour ne rien manquer',
    },
    ar: {
      name: 'توجيه نحو الدراسة الجامعية',
      blurb: 'اختر الجامعة والمسلك المناسبين — عمومية، بالإنجليزية، Studienkolleg، أو إجازة مباشرة.',
      bullet1: 'مقارنة معدّل الباكالوريا + الميزانية + المدينة لاختيار 5 إلى 10 مسالك حقيقية',
      bullet2: 'شرح Uni-assist و APS وكيفية إرسال الملف بشكل صحيح',
      bullet3: 'مواعيد التسجيل حسب كل جامعة حتى لا يفوتك أي قبول',
    },
    de: {
      name: 'Studium-Beratung',
      blurb: 'Wähle die richtige Uni und den richtigen Studiengang — staatlich, englischsprachig, Studienkolleg oder direkt zum Bachelor.',
      bullet1: 'Abi-Note + Budget + Stadt-Wunsch zu 5–10 echten Programmen abgleichen',
      bullet2: 'Erklärt uni-assist, APS und wie man richtig bewirbt',
      bullet3: 'Deadlines pro Uni, damit du keine Bewerbungsfrist verpasst',
    },
  },
  'ausbildung': {
    en: {
      name: 'Ausbildung guidance',
      blurb: 'Choose the right Beruf, the right region, and the right channel to get hired.',
      bullet1: 'Match your background + German level to high-acceptance Berufe',
      bullet2: 'Tells you which states & cities have the best take-rate for Moroccans',
      bullet3: 'Application playbook: Make-it-in-Germany, Hwk, BIBB, recruiters',
    },
    fr: {
      name: 'Orientation Ausbildung',
      blurb: 'Choisissez le bon métier, la bonne région et le bon canal pour être recruté.',
      bullet1: 'Croise votre parcours + niveau d\'allemand avec les Berufe les plus accessibles',
      bullet2: 'Indique les Länder et villes où le taux d\'acceptation marocain est le plus haut',
      bullet3: 'Guide de candidature : Make-it-in-Germany, Hwk, BIBB, recruteurs',
    },
    ar: {
      name: 'توجيه نحو التكوين المهني',
      blurb: 'اختر المهنة المناسبة، المنطقة المناسبة، والقناة الأنجع للتوظيف.',
      bullet1: 'مقارنة مسارك ومستواك بالألمانية مع المهن الأعلى قبولاً',
      bullet2: 'الولايات والمدن التي تسجّل أعلى نسب قبول للمغاربة',
      bullet3: 'دليل الترشّح: Make-it-in-Germany، Hwk، BIBB، وكالات التوظيف',
    },
    de: {
      name: 'Ausbildungs-Beratung',
      blurb: 'Wähle den richtigen Beruf, die richtige Region und den richtigen Kanal zum Vertrag.',
      bullet1: 'Profil + Deutschniveau mit Berufen mit hoher Annahmequote abgleichen',
      bullet2: 'Bundesländer & Städte mit der besten Quote für Marokkaner',
      bullet3: 'Bewerbungsstrategie: Make-it-in-Germany, Hwk, BIBB, Recruiter',
    },
  },
  'visa': {
    en: {
      name: 'Visa appointment help',
      blurb: 'Walk into the consulate with the right file, the right answers, and the right mindset.',
      bullet1: 'Pre-appointment dossier review (every page, in order)',
      bullet2: 'Mock interview for the consulate questions',
      bullet3: 'Action plan if your appointment is far away (or already missed)',
    },
    fr: {
      name: 'Aide RDV visa',
      blurb: 'Présentez-vous au consulat avec le bon dossier, les bonnes réponses, le bon état d\'esprit.',
      bullet1: 'Revue du dossier avant RDV (page par page, dans l\'ordre)',
      bullet2: 'Simulation d\'entretien consulat',
      bullet3: 'Plan d\'action si le RDV est lointain (ou déjà raté)',
    },
    ar: {
      name: 'مساعدة في موعد التأشيرة',
      blurb: 'ادخل إلى القنصلية بالملف الصحيح، الأجوبة الصحيحة، والذهنية الصحيحة.',
      bullet1: 'مراجعة كاملة للملف قبل الموعد (صفحة صفحة، بالترتيب)',
      bullet2: 'محاكاة لمقابلة القنصلية',
      bullet3: 'خطة بديلة إن كان موعدك بعيداً (أو فاتك)',
    },
    de: {
      name: 'Hilfe beim Visa-Termin',
      blurb: 'Geh ins Konsulat mit der richtigen Akte, den richtigen Antworten und der richtigen Einstellung.',
      bullet1: 'Akten-Check vor dem Termin (jede Seite, in Reihenfolge)',
      bullet2: 'Probe-Interview für die Konsulats-Fragen',
      bullet3: 'Aktionsplan, falls der Termin weit weg ist (oder verpasst wurde)',
    },
  },
  'german-tutoring': {
    en: {
      name: 'German tutoring (A1–B2)',
      blurb: 'One-on-one focused sessions to push you from where you are to the next CEFR level.',
      bullet1: 'Diagnostic in session 1 — exact gaps in grammar, vocab, speaking',
      bullet2: 'Custom lesson plan to your target exam (Goethe, telc, ÖSD)',
      bullet3: 'Speaking + listening drills using real Vorstellungsgespräch material',
    },
    fr: {
      name: 'Cours d\'allemand (A1–B2)',
      blurb: 'Sessions ciblées 1-à-1 pour passer du niveau actuel au suivant (CECRL).',
      bullet1: 'Diagnostic en session 1 — lacunes exactes en grammaire, vocabulaire, oral',
      bullet2: 'Plan de cours personnalisé selon l\'examen visé (Goethe, telc, ÖSD)',
      bullet3: 'Exercices d\'oral + écoute basés sur de vrais Vorstellungsgespräch',
    },
    ar: {
      name: 'دروس الألمانية (A1–B2)',
      blurb: 'حصص فردية مكثّفة للانتقال من مستواك الحالي إلى المستوى التالي (CEFR).',
      bullet1: 'تشخيص في الحصّة الأولى — تحديد الفجوات في القواعد والمفردات والمحادثة',
      bullet2: 'برنامج مخصّص حسب الامتحان المستهدف (Goethe، telc، ÖSD)',
      bullet3: 'تمارين محادثة واستماع مبنية على مقابلات Vorstellungsgespräch حقيقية',
    },
    de: {
      name: 'Deutsch-Nachhilfe (A1–B2)',
      blurb: 'Einzelunterricht, der dich gezielt aufs nächste GER-Niveau bringt.',
      bullet1: 'Diagnose in Stunde 1 — exakte Lücken in Grammatik, Vokabular, Sprechen',
      bullet2: 'Lernplan auf deine Zielprüfung zugeschnitten (Goethe, telc, ÖSD)',
      bullet3: 'Sprech- + Hörübungen mit echtem Vorstellungsgespräch-Material',
    },
  },
  'general': {
    en: {
      name: 'General consultation',
      blurb: 'Not sure which service you need? Book a 30-min open call — we\'ll figure it out together.',
      bullet1: 'Tell us where you are, where you want to go',
      bullet2: 'We tell you which of the above services actually fits',
      bullet3: 'No pressure — if none fit, we say so honestly',
    },
    fr: {
      name: 'Consultation générale',
      blurb: 'Pas sûr du service dont vous avez besoin ? Réservez 30 min ouvertes — on y verra clair ensemble.',
      bullet1: 'Dites-nous où vous en êtes et où vous voulez aller',
      bullet2: 'On vous dit lequel des services ci-dessus correspond vraiment',
      bullet3: 'Aucune pression — si aucun ne convient, on vous le dit honnêtement',
    },
    ar: {
      name: 'استشارة عامة',
      blurb: 'لست متأكداً أيّ خدمة تحتاج؟ احجز 30 دقيقة مفتوحة — نوضّح المسار معاً.',
      bullet1: 'أخبرنا أين أنت الآن وأين تريد أن تصل',
      bullet2: 'نقترح عليك الخدمة الأنسب من بين الخدمات أعلاه',
      bullet3: 'بلا ضغط — إن لم تكن أيّ خدمة مناسبة لك، نقولها لك بصراحة',
    },
    de: {
      name: 'Allgemeine Beratung',
      blurb: 'Unsicher, welchen Service du brauchst? Buche 30 offene Minuten — wir finden\'s gemeinsam raus.',
      bullet1: 'Sag uns, wo du stehst und wo du hin willst',
      bullet2: 'Wir sagen dir, welcher der Services oben wirklich passt',
      bullet3: 'Kein Druck — passt keiner, sagen wir das ehrlich',
    },
  },
}

// UI strings
const UI = {
  en: {
    metaTitle: 'Services — GoGermany',
    metaDesc: 'All paid consultation services to move from Morocco to Germany.',
    eyebrow: 'Services',
    title: 'Pick the help that fits your case',
    subtitle: 'Each service is a 30-minute paid consultation by video. You leave with concrete answers, not generic advice.',
    badgePrice: '€16 per session',
    badgeFormat: 'Google Meet, 30 min',
    badgeLanguages: 'Arabic, French, German',
    faqTitle: 'Frequently asked',
    faq1Q: 'How is the €16 paid?',
    faq1A: 'Bank transfer. After you book on Calendly, you receive a confirmation email with the bank details (FR + AR). The session is confirmed once payment arrives.',
    faq2Q: 'What if I need help across several services?',
    faq2A: 'Book one session — we cover what fits in 30 min, then tell you whether a second session makes sense or whether you can handle the rest yourself.',
    faq3Q: 'In which language is the call?',
    faq3A: 'Your choice: Arabic, French, or German. Mention it when booking; it\'s the second question on Calendly.',
    faq4Q: 'Can I get a refund if it\'s not useful?',
    faq4A: 'If after 5 minutes the session genuinely doesn\'t apply to you, we end the call and refund. Honesty before money.',
  },
  fr: {
    metaTitle: 'Services — GoGermany',
    metaDesc: 'Toutes les consultations payantes pour passer du Maroc à l\'Allemagne.',
    eyebrow: 'Services',
    title: 'Choisissez l\'aide adaptée à votre cas',
    subtitle: 'Chaque service est une consultation payante de 30 minutes en visio. Vous repartez avec des réponses concrètes, pas des conseils génériques.',
    badgePrice: '16 € par session',
    badgeFormat: 'Google Meet, 30 min',
    badgeLanguages: 'Arabe, français, allemand',
    faqTitle: 'Questions fréquentes',
    faq1Q: 'Comment se règlent les 16 € ?',
    faq1A: 'Par virement bancaire. Après réservation Calendly, vous recevez un e-mail avec les coordonnées bancaires (FR + AR). La session est confirmée à réception du paiement.',
    faq2Q: 'Si j\'ai besoin de plusieurs services ?',
    faq2A: 'Réservez une session — on traite ce qui rentre en 30 min, puis on vous dit si une 2e séance est utile ou si vous pouvez finir seul.',
    faq3Q: 'Dans quelle langue est l\'appel ?',
    faq3A: 'Au choix : arabe, français ou allemand. Précisez-le à la réservation, c\'est la 2e question sur Calendly.',
    faq4Q: 'Remboursement si ce n\'est pas utile ?',
    faq4A: 'Si après 5 minutes la session ne s\'applique vraiment pas à vous, on arrête l\'appel et on rembourse. L\'honnêteté avant l\'argent.',
  },
  ar: {
    metaTitle: 'الخدمات — GoGermany',
    metaDesc: 'جميع الاستشارات المؤدّى عنها للانتقال من المغرب إلى ألمانيا.',
    eyebrow: 'الخدمات',
    title: 'اختر المساعدة المناسبة لحالتك',
    subtitle: 'كل خدمة عبارة عن استشارة مدّتها 30 دقيقة بالفيديو ومدفوعة. تخرج بأجوبة ملموسة لا بنصائح عامة.',
    badgePrice: '16 € للجلسة',
    badgeFormat: 'Google Meet · 30 دقيقة',
    badgeLanguages: 'العربية، الفرنسية، الألمانية',
    faqTitle: 'أسئلة متكررة',
    faq1Q: 'كيف يُدفع مبلغ 16 €؟',
    faq1A: 'عبر تحويل بنكي. بعد الحجز على Calendly تصلك رسالة فيها المعطيات البنكية (بالفرنسية والعربية). تُؤكَّد الجلسة بمجرد وصول الدفعة.',
    faq2Q: 'ماذا لو احتجتُ أكثر من خدمة؟',
    faq2A: 'احجز جلسة واحدة — نغطّي ما يدخل في 30 دقيقة، ثم نخبرك هل تحتاج جلسة ثانية أم يمكنك إكمال الباقي بنفسك.',
    faq3Q: 'بأيّ لغة تكون المكالمة؟',
    faq3A: 'حسب اختيارك: العربية، الفرنسية، أو الألمانية. اذكر اللغة عند الحجز، فهي السؤال الثاني في Calendly.',
    faq4Q: 'هل أُسترَدّ المبلغ إن لم تنفعني الجلسة؟',
    faq4A: 'إن تبيّن بعد 5 دقائق أن الجلسة لا تناسب حالتك حقاً، نوقفها ونردّ المبلغ. الصدق أولاً.',
  },
  de: {
    metaTitle: 'Services — GoGermany',
    metaDesc: 'Alle bezahlten Beratungsleistungen für den Weg von Marokko nach Deutschland.',
    eyebrow: 'Services',
    title: 'Wähle die Hilfe, die zu deinem Fall passt',
    subtitle: 'Jeder Service ist eine 30-minütige bezahlte Videoberatung. Du gehst mit konkreten Antworten raus, nicht mit Allgemeinplätzen.',
    badgePrice: '16 € pro Sitzung',
    badgeFormat: 'Google Meet, 30 Min',
    badgeLanguages: 'Arabisch, Französisch, Deutsch',
    faqTitle: 'Häufige Fragen',
    faq1Q: 'Wie werden die 16 € bezahlt?',
    faq1A: 'Per Banküberweisung. Nach der Calendly-Buchung kommt eine Bestätigungs-Mail mit den Bankdaten (FR + AR). Sobald das Geld da ist, gilt der Termin.',
    faq2Q: 'Was, wenn ich mehrere Services brauche?',
    faq2A: 'Buche eine Sitzung — wir decken ab, was in 30 Min reinpasst, und sagen dir dann, ob eine zweite sinnvoll ist oder du den Rest selber schaffst.',
    faq3Q: 'In welcher Sprache läuft der Call?',
    faq3A: 'Deine Wahl: Arabisch, Französisch oder Deutsch. Gib das bei der Buchung an — das ist die zweite Calendly-Frage.',
    faq4Q: 'Gibt es Rückerstattung, wenn\'s nichts bringt?',
    faq4A: 'Wenn nach 5 Minuten klar ist, dass die Sitzung wirklich nicht zu dir passt, beenden wir und erstatten. Ehrlichkeit vor Geld.',
  },
}

const LOCALES = ['en', 'fr', 'ar', 'de']

for (const locale of LOCALES) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`)
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  const services = {}
  for (const [topic, byLocale] of Object.entries(SERVICES)) {
    services[topic] = byLocale[locale]
  }

  json.dashboardServices = {
    ...UI[locale],
    services,
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`✓ ${locale}.json — dashboardServices namespace injected`)
}
