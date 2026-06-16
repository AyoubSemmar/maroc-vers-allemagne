/* One-off: make the documentChecklist i18n country-neutral + add the
 * new country-aware keys. Mutates messages/{en,fr,de,ar}.json in place. */
const fs = require('fs')

const DATA = {
  en: {
    top: {
      countryLabel: 'Your country',
      summarySubCountry: 'For your {path} visa from {country}',
      legalization: 'Legalization',
      legalizationCount: 'Legalization of {n} documents',
      apsFee: 'APS certificate fee',
      disclaimer: 'Estimates only — costs, fees and processing times vary and rules change. Always confirm with the German mission (embassy/consulate or official visa centre) responsible for your country before you apply.',
    },
    countryNote: {
      ma: 'Germany does not accept the apostille from {country} — your civil and academic documents need full consular legalization by the German mission. That adds several weeks, so start early.',
      aps: 'Applicants from {country} must obtain an APS certificate before a Studium visa. Start it first — it is the longest step.',
      legalizationSlow: 'Documents from {country} need consular legalization, which can be slow. Gather and authenticate them as early as possible.',
      generic: 'Requirements vary by country. This is a general German national-visa checklist — confirm the exact documents and the authentication method ({method}) with the German mission responsible for your country.',
    },
    docs: {
      visa_appointment: { name: 'Visa appointment', where: 'The official German visa centre for your country (VFS Global, TLScontact, or the embassy/consulate)', notes: 'Book early — slots are often 1–3 months out, longer in summer. Any service fee is separate from the visa fee.' },
      birth_certificate: { name: 'Birth certificate', where: 'Civil registry office at your place of birth', notes: 'Get a multilingual/international extract if your country issues one — it can save translation cost.' },
      aps_certificate: { name: 'APS certificate (Akademische Prüfstelle)', where: 'The APS office for your country (German embassy / DAAD)', notes: 'Required for some countries (e.g. China, India, Vietnam, Pakistan). Start it first — processing can take 6–20 weeks. Submit all academic records since high school.' },
      studienkolleg: { name: 'Studienkolleg admission (if your diploma does not directly qualify)', where: 'Apply via your target German university', notes: 'Whether you need it depends on how your secondary diploma compares to the German Abitur. Check anabin / your target university.' },
      german_b1: { name: 'German B1 certificate (Goethe / telc / ÖSD)', where: 'A Goethe-Institut, telc or ÖSD test centre in your country', notes: 'B1 is the minimum for an Ausbildung visa. Most employers prefer B2.' },
      german_b2: { name: 'German B2 certificate (Goethe / telc / ÖSD)', where: 'A Goethe-Institut, telc or ÖSD test centre in your country', notes: 'Required for most Studium programmes. Some require TestDaF or DSH-2 instead.' },
      visa_application_form: { name: 'National D-visa application form', where: "Download from the German mission's site (rk.diplo.de) or your visa centre", notes: 'Fill 2 copies in German or English. Sign each page.' },
      sperrkonto: { name: 'Sperrkonto (€11,904 blocked account)', where: 'Online: Fintiba, Expatrio or Coracle', notes: 'Mandatory for Studium; Ausbildung trainees with salary < €934/mo also need it. ~€89 setup fee + the €11,904 deposit (paid back to you in monthly instalments after arrival).' },
      bank_statements: { name: 'Bank statements (last 3 months)', where: 'Your bank', notes: 'Sometimes requested as supporting evidence even when a Sperrkonto is in place.' },
      visa_fee: { name: 'National D-visa fee (€75)', where: 'Paid at your visa appointment', notes: 'Non-refundable. Payment method depends on the visa centre.' },
    },
  },
  fr: {
    top: {
      countryLabel: 'Votre pays',
      summarySubCountry: 'Pour votre visa {path} depuis {country}',
      legalization: 'Légalisation',
      legalizationCount: 'Légalisation de {n} documents',
      apsFee: 'Frais du certificat APS',
      disclaimer: 'Estimations uniquement — les coûts, frais et délais varient et les règles changent. Vérifiez toujours auprès de la représentation allemande (ambassade/consulat ou centre de visa officiel) compétente pour votre pays avant de déposer votre demande.',
    },
    countryNote: {
      ma: "L'Allemagne n'accepte pas l'apostille depuis {country} — vos documents d'état civil et académiques doivent être légalisés par la représentation allemande. Cela ajoute plusieurs semaines, commencez tôt.",
      aps: 'Les candidats depuis {country} doivent obtenir un certificat APS avant un visa Studium. Commencez par là — c\'est l\'étape la plus longue.',
      legalizationSlow: 'Les documents depuis {country} nécessitent une légalisation consulaire, parfois lente. Rassemblez et authentifiez vos documents le plus tôt possible.',
      generic: "Les exigences varient selon le pays. Ceci est une checklist générale du visa national allemand — confirmez les documents exacts et la méthode d'authentification ({method}) auprès de la représentation allemande compétente.",
    },
    docs: {
      visa_appointment: { name: 'Rendez-vous visa', where: "Le centre de visa allemand officiel de votre pays (VFS Global, TLScontact ou l'ambassade/consulat)", notes: 'Réservez tôt — les créneaux sont souvent à 1–3 mois, plus en été. Les frais de service sont distincts des frais de visa.' },
      birth_certificate: { name: 'Acte de naissance', where: "Bureau d'état civil de votre lieu de naissance", notes: 'Demandez un extrait multilingue/international si votre pays en délivre — cela peut réduire les frais de traduction.' },
      aps_certificate: { name: 'Certificat APS (Akademische Prüfstelle)', where: 'Le bureau APS de votre pays (ambassade allemande / DAAD)', notes: 'Requis pour certains pays (Chine, Inde, Vietnam, Pakistan…). Commencez par là — 6 à 20 semaines de traitement. Soumettez tous les relevés depuis le lycée.' },
      studienkolleg: { name: 'Admission en Studienkolleg (si votre diplôme ne qualifie pas directement)', where: 'Candidatez via votre université allemande cible', notes: "Selon l'équivalence de votre diplôme secondaire avec l'Abitur allemand. Vérifiez anabin / votre université cible." },
      german_b1: { name: 'Certificat allemand B1 (Goethe / telc / ÖSD)', where: 'Un centre Goethe-Institut, telc ou ÖSD de votre pays', notes: "B1 est le minimum pour le visa Ausbildung. La plupart des employeurs préfèrent B2." },
      german_b2: { name: 'Certificat allemand B2 (Goethe / telc / ÖSD)', where: 'Un centre Goethe-Institut, telc ou ÖSD de votre pays', notes: 'Requis pour la plupart des Studium. Certains exigent TestDaF ou DSH-2.' },
      visa_application_form: { name: 'Formulaire de visa national D', where: 'Téléchargez sur le site de la représentation allemande (rk.diplo.de) ou votre centre de visa', notes: 'Remplissez 2 copies en allemand ou anglais. Signez chaque page.' },
      sperrkonto: { name: 'Sperrkonto (compte bloqué de 11 904 €)', where: 'En ligne : Fintiba, Expatrio ou Coracle', notes: 'Obligatoire pour le Studium ; les apprentis Ausbildung avec salaire < 934 €/mois aussi. ~89 € de frais + le dépôt de 11 904 € (restitué en mensualités après l\'arrivée).' },
      bank_statements: { name: 'Relevés bancaires (3 derniers mois)', where: 'Votre banque', notes: 'Parfois demandé comme preuve complémentaire même avec un Sperrkonto.' },
      visa_fee: { name: 'Frais du visa national D (75 €)', where: 'Payés lors de votre rendez-vous visa', notes: 'Non remboursables. Le mode de paiement dépend du centre de visa.' },
    },
  },
  de: {
    top: {
      countryLabel: 'Dein Land',
      summarySubCountry: 'Für dein {path}-Visum aus {country}',
      legalization: 'Legalisierung',
      legalizationCount: 'Legalisierung von {n} Dokumenten',
      apsFee: 'APS-Zertifikat-Gebühr',
      disclaimer: 'Nur Schätzwerte — Kosten, Gebühren und Bearbeitungszeiten variieren und Regeln ändern sich. Bestätige immer mit der für dein Land zuständigen deutschen Vertretung (Botschaft/Konsulat oder offizielles Visumzentrum), bevor du den Antrag stellst.',
    },
    countryNote: {
      ma: 'Deutschland akzeptiert die Apostille aus {country} nicht — deine Personenstands- und Bildungsdokumente brauchen die volle konsularische Legalisierung durch die deutsche Vertretung. Das dauert mehrere Wochen länger, fang früh an.',
      aps: 'Bewerber aus {country} brauchen vor dem Studium-Visum ein APS-Zertifikat. Fang damit zuerst an — es ist der längste Schritt.',
      legalizationSlow: 'Dokumente aus {country} brauchen eine konsularische Legalisierung, die langsam sein kann. Sammle und beglaubige sie so früh wie möglich.',
      generic: 'Die Anforderungen variieren je nach Land. Dies ist eine allgemeine Checkliste für das deutsche nationale Visum — bestätige die genauen Dokumente und die Authentifizierungsart ({method}) mit der zuständigen deutschen Vertretung.',
    },
    docs: {
      visa_appointment: { name: 'Visumtermin', where: 'Das offizielle deutsche Visumzentrum deines Landes (VFS Global, TLScontact oder Botschaft/Konsulat)', notes: 'Früh buchen — Termine sind oft 1–3 Monate entfernt, im Sommer länger. Eine Servicegebühr ist getrennt von der Visumgebühr.' },
      birth_certificate: { name: 'Geburtsurkunde', where: 'Standesamt deines Geburtsorts', notes: 'Hol einen mehrsprachigen/internationalen Auszug, falls dein Land ihn ausstellt — spart Übersetzungskosten.' },
      aps_certificate: { name: 'APS-Zertifikat (Akademische Prüfstelle)', where: 'Die APS-Stelle deines Landes (deutsche Botschaft / DAAD)', notes: 'Für einige Länder erforderlich (China, Indien, Vietnam, Pakistan…). Zuerst starten — 6 bis 20 Wochen Bearbeitung. Alle Zeugnisse seit der Oberstufe einreichen.' },
      studienkolleg: { name: 'Studienkolleg-Zulassung (falls dein Abschluss nicht direkt qualifiziert)', where: 'Über deine deutsche Zieluniversität beantragen', notes: 'Hängt davon ab, wie dein Schulabschluss mit dem Abitur verglichen wird. Prüfe anabin / deine Zieluni.' },
      german_b1: { name: 'Deutsch-B1-Zertifikat (Goethe / telc / ÖSD)', where: 'Ein Goethe-Institut-, telc- oder ÖSD-Testzentrum in deinem Land', notes: 'B1 ist das Minimum für das Ausbildungsvisum. Die meisten Arbeitgeber bevorzugen B2.' },
      german_b2: { name: 'Deutsch-B2-Zertifikat (Goethe / telc / ÖSD)', where: 'Ein Goethe-Institut-, telc- oder ÖSD-Testzentrum in deinem Land', notes: 'Für die meisten Studiengänge erforderlich. Manche verlangen TestDaF oder DSH-2.' },
      visa_application_form: { name: 'Antragsformular nationales D-Visum', where: 'Von der Website der deutschen Vertretung (rk.diplo.de) oder deinem Visumzentrum herunterladen', notes: '2 Kopien auf Deutsch oder Englisch ausfüllen. Jede Seite unterschreiben.' },
      sperrkonto: { name: 'Sperrkonto (11.904 € Sperrbetrag)', where: 'Online: Fintiba, Expatrio oder Coracle', notes: 'Pflicht fürs Studium; Azubis mit Gehalt < 934 €/Monat auch. ~89 € Einrichtungsgebühr + die 11.904 € Kaution (nach Ankunft monatlich zurückgezahlt).' },
      bank_statements: { name: 'Kontoauszüge (letzte 3 Monate)', where: 'Deine Bank', notes: 'Manchmal als zusätzlicher Nachweis verlangt, auch mit Sperrkonto.' },
      visa_fee: { name: 'Gebühr nationales D-Visum (75 €)', where: 'Beim Visumtermin bezahlt', notes: 'Nicht erstattungsfähig. Zahlungsart hängt vom Visumzentrum ab.' },
    },
  },
  ar: {
    top: {
      countryLabel: 'بلدك',
      summarySubCountry: 'لطلب تأشيرة {path} من {country}',
      legalization: 'التصديق القنصلي',
      legalizationCount: 'تصديق {n} وثائق',
      apsFee: 'رسوم شهادة APS',
      disclaimer: 'تقديرات فقط — التكاليف والرسوم ومدد المعالجة تختلف والقواعد تتغيّر. تحقّق دائماً من البعثة الألمانية (السفارة/القنصلية أو مركز التأشيرات الرسمي) المختصّة ببلدك قبل تقديم الطلب.',
    },
    countryNote: {
      ma: 'ألمانيا لا تقبل الأبوستيل من {country} — وثائقك المدنية والأكاديمية تحتاج تصديقاً قنصلياً كاملاً من البعثة الألمانية. هذا يضيف عدّة أسابيع، فابدأ مبكراً.',
      aps: 'المترشحون من {country} يحتاجون شهادة APS قبل تأشيرة الدراسة. ابدأ بها أولاً — فهي أطول خطوة.',
      legalizationSlow: 'وثائق {country} تحتاج تصديقاً قنصلياً قد يكون بطيئاً. اجمع وصدّق وثائقك في أقرب وقت ممكن.',
      generic: 'المتطلبات تختلف حسب البلد. هذه قائمة عامة للتأشيرة الوطنية الألمانية — أكّد الوثائق الدقيقة وطريقة التصديق ({method}) مع البعثة الألمانية المختصّة ببلدك.',
    },
    docs: {
      visa_appointment: { name: 'موعد التأشيرة', where: 'مركز التأشيرات الألماني الرسمي لبلدك (VFS Global أو TLScontact أو السفارة/القنصلية)', notes: 'احجز مبكراً — المواعيد غالباً بعد شهر إلى ثلاثة، وأطول في الصيف. رسوم الخدمة منفصلة عن رسوم التأشيرة.' },
      birth_certificate: { name: 'عقد الازدياد', where: 'مكتب الحالة المدنية بمكان ولادتك', notes: 'اطلب نسخة متعددة اللغات/دولية إن كان بلدك يصدرها — توفّر تكلفة الترجمة.' },
      aps_certificate: { name: 'شهادة APS (Akademische Prüfstelle)', where: 'مكتب APS الخاص ببلدك (السفارة الألمانية / DAAD)', notes: 'مطلوبة لبعض الدول (الصين، الهند، فيتنام، باكستان…). ابدأ بها أولاً — المعالجة 6 إلى 20 أسبوعاً. قدّم كل الوثائق الأكاديمية منذ الثانوية.' },
      studienkolleg: { name: 'القبول في Studienkolleg (إن كانت شهادتك لا تؤهّل مباشرة)', where: 'عبر جامعتك الألمانية المستهدفة', notes: 'يعتمد على مدى معادلة شهادتك الثانوية بالـ Abitur الألماني. تحقّق من anabin / جامعتك المستهدفة.' },
      german_b1: { name: 'شهادة الألمانية B1 (Goethe / telc / ÖSD)', where: 'مركز Goethe-Institut أو telc أو ÖSD في بلدك', notes: 'B1 هو الحد الأدنى لتأشيرة الأوزبيلدونغ. أغلب أرباب العمل يفضّلون B2.' },
      german_b2: { name: 'شهادة الألمانية B2 (Goethe / telc / ÖSD)', where: 'مركز Goethe-Institut أو telc أو ÖSD في بلدك', notes: 'مطلوبة لأغلب برامج الدراسة. بعضها يتطلب TestDaF أو DSH-2.' },
      visa_application_form: { name: 'استمارة التأشيرة الوطنية D', where: 'حمّلها من موقع البعثة الألمانية (rk.diplo.de) أو مركز التأشيرات', notes: 'املأ نسختين بالألمانية أو الإنجليزية. وقّع كل صفحة.' },
      sperrkonto: { name: 'حساب مجمّد Sperrkonto (11٬904 €)', where: 'عبر الإنترنت: Fintiba أو Expatrio أو Coracle', notes: 'إجباري للدراسة؛ ومتدربو الأوزبيلدونغ برواتب أقل من 934 €/شهر أيضاً. ~89 € رسوم تفعيل + وديعة 11٬904 € (تُعاد لك شهرياً بعد الوصول).' },
      bank_statements: { name: 'كشوف بنكية (آخر 3 أشهر)', where: 'بنكك', notes: 'أحياناً تُطلب كدليل إضافي حتى مع وجود Sperrkonto.' },
      visa_fee: { name: 'رسوم التأشيرة الوطنية D (75 €)', where: 'تُدفع في موعد التأشيرة', notes: 'غير قابلة للاسترداد. طريقة الدفع تعتمد على مركز التأشيرات.' },
    },
  },
}

for (const loc of ['en', 'fr', 'de', 'ar']) {
  const file = `messages/${loc}.json`
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  const dc = json.documentChecklist
  const d = DATA[loc]

  Object.assign(dc, d.top)
  dc.countryNote = d.countryNote

  // Rename tls_appointment → visa_appointment
  delete dc.docs.tls_appointment
  for (const [id, val] of Object.entries(d.docs)) {
    dc.docs[id] = { ...(dc.docs[id] || {}), ...val }
  }

  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n')
  console.log(loc, '✓')
}
// validate
for (const loc of ['en', 'fr', 'de', 'ar']) JSON.parse(fs.readFileSync(`messages/${loc}.json`, 'utf8'))
console.log('all JSON valid')
