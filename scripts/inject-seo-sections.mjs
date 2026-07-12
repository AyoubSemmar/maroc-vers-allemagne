// Injects long-form SEO sections (rendered by ToolSeoSection) into all 12
// message files for the two big free tools that were missing crawlable copy:
//   learnGerman.seoSection   → shown on the public /learn-german page
//   interviewPrep.seoSection → shown on the new public /interview-prep page
// Also adds nav.interviewPrep so the landing page can live in the Learn menu.
// Hand-written translations — no API. Idempotent: re-running overwrites the
// same keys.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const SEO = {
  en: {
    nav: 'Interview Prep',
    learn: {
      title: 'Learn German online for free — the full A1 to C1 course',
      intro:
        "GoGermany's German course takes you from absolute beginner (A1) to advanced (C1) with interactive lessons that follow the same CEFR levels used by the Goethe, telc and ÖSD exams. Every lesson combines clear grammar explanations, practical vocabulary and instantly corrected exercises — including AI-corrected writing tasks, so you actually produce German instead of only reading it. The course was built for people preparing a real move to Germany: Ausbildung, university, work visa or Chancenkarte.\n\nStart with the placement quiz to find your level, then progress at your own pace — two lessons per week is enough to advance steadily. Add the daily 5-minute verb drill to build a streak, and when you want a teacher, join our live online classes in small groups with a graded curriculum. No payment and no sign-up is needed to start learning; a free account simply saves your progress across devices.",
      faqTitle: 'Frequently asked questions',
      faqs: [
        { q: 'Is the German course really free?', a: 'Yes. All lessons from A1 to C1 are free, including the exercises and the AI writing correction. A free account only adds progress saving. The optional paid offer is the live classes with a teacher.' },
        { q: 'What German level do I need to move to Germany?', a: 'For an Ausbildung most employers expect B1–B2. German-taught university programs usually require C1 (TestDaF or DSH). For the Chancenkarte, A1 already earns points and A2 or higher earns more. In daily life you will want at least B1.' },
        { q: 'How long does it take to reach B1?', a: 'With 1–2 hours per day, most learners reach B1 in about 6–9 months. Our pacing of two lessons per week plus the daily verb drill is designed to get you there without burning out.' },
        { q: 'Does the course prepare me for Goethe or telc exams?', a: 'The curriculum mirrors the official CEFR levels, so everything you learn maps directly to the Goethe, telc and ÖSD exams. The site also includes a dedicated exam preparation section with model exercises for each level.' },
      ],
    },
    prep: {
      title: 'Ausbildung interview questions and answers in German',
      intro:
        'The Vorstellungsgespräch is the step that decides whether you get your Ausbildung contract — and most candidates fail it not because of their German level, but because they never prepared the standard questions. This tool collects the 15 questions German employers ask most in Ausbildung and job interviews, from “Erzählen Sie etwas über sich” to salary and relocation logistics, organised in 8 categories.\n\nEvery question comes with a model answer written in B1–B2 German that you can adapt and memorise, an explanation of why the interviewer asks it, and concrete things to say and to avoid. The first three questions are open to everyone; a free account unlocks all 15. Practise them out loud until the answers feel natural — that is what makes the difference on the day.',
      faqTitle: 'Frequently asked questions',
      faqs: [
        { q: 'What questions are asked in an Ausbildung interview?', a: 'Nearly every interview covers the same core: introduce yourself, why this company, why Germany, strengths and weaknesses, school and work experience, teamwork situations, your goals, and logistics such as visa, accommodation and start date. The tool covers all of them with model answers.' },
        { q: 'Is the interview in German or English?', a: 'Almost always in German. Employers use the interview to check your real speaking level — usually B1 is expected for an Ausbildung. Answering confidently in simple, correct German beats complicated sentences full of mistakes.' },
        { q: 'How do I answer “Erzählen Sie etwas über sich”?', a: 'Use a simple one-minute structure: name, age, where you are from, your diploma, your current German level, why you chose this profession, and one hobby that shows initiative. Our model answer gives you the exact sentences to adapt.' },
        { q: 'Is the interview prep tool free?', a: 'Yes. Three complete questions with model answers are open without any account, and a free account unlocks all 15. No payment is required.' },
      ],
    },
  },

  fr: {
    nav: 'Préparation entretien',
    learn: {
      title: "Apprendre l'allemand en ligne gratuitement — cours complet A1 à C1",
      intro:
        "Le cours d'allemand de GoGermany vous emmène de grand débutant (A1) au niveau avancé (C1) avec des leçons interactives qui suivent les niveaux CECR utilisés par les examens Goethe, telc et ÖSD. Chaque leçon combine des explications de grammaire claires, du vocabulaire pratique et des exercices corrigés instantanément — y compris des exercices d'écriture corrigés par IA, pour produire de l'allemand au lieu de seulement le lire. Le cours est conçu pour ceux qui préparent un vrai départ en Allemagne : Ausbildung, université, visa de travail ou Chancenkarte.\n\nCommencez par le test de niveau, puis avancez à votre rythme — deux leçons par semaine suffisent pour progresser régulièrement. Ajoutez le drill quotidien de conjugaison de 5 minutes, et quand vous voulez un professeur, rejoignez nos cours en direct en petits groupes avec un programme noté. Aucun paiement ni inscription n'est nécessaire pour commencer ; un compte gratuit sert seulement à sauvegarder votre progression.",
      faqTitle: 'Questions fréquentes',
      faqs: [
        { q: "Le cours d'allemand est-il vraiment gratuit ?", a: "Oui. Toutes les leçons de A1 à C1 sont gratuites, y compris les exercices et la correction d'écriture par IA. Un compte gratuit ajoute seulement la sauvegarde de progression. L'option payante, ce sont les cours en direct avec un professeur." },
        { q: "Quel niveau d'allemand faut-il pour partir en Allemagne ?", a: "Pour une Ausbildung, la plupart des employeurs attendent B1–B2. Les études universitaires en allemand exigent souvent C1 (TestDaF ou DSH). Pour la Chancenkarte, A1 rapporte déjà des points et A2 ou plus en rapporte davantage. Au quotidien, visez au moins B1." },
        { q: 'Combien de temps pour atteindre B1 ?', a: "Avec 1 à 2 heures par jour, la plupart des apprenants atteignent B1 en 6 à 9 mois environ. Notre rythme de deux leçons par semaine plus le drill quotidien est conçu pour y arriver sans s'épuiser." },
        { q: 'Le cours prépare-t-il aux examens Goethe ou telc ?', a: "Le programme suit les niveaux officiels du CECR : tout ce que vous apprenez correspond directement aux examens Goethe, telc et ÖSD. Le site inclut aussi une section dédiée de préparation aux examens avec des exercices types pour chaque niveau." },
      ],
    },
    prep: {
      title: "Questions et réponses d'entretien d'Ausbildung en allemand",
      intro:
        "Le Vorstellungsgespräch est l'étape qui décide si vous obtenez votre contrat d'Ausbildung — et la plupart des candidats échouent non pas à cause de leur niveau d'allemand, mais parce qu'ils n'ont jamais préparé les questions standard. Cet outil rassemble les 15 questions que les employeurs allemands posent le plus en entretien d'Ausbildung et d'embauche, de « Erzählen Sie etwas über sich » à la logistique du visa, organisées en 8 catégories.\n\nChaque question vient avec une réponse-type rédigée en allemand B1–B2 que vous pouvez adapter et mémoriser, une explication du pourquoi de la question, et ce qu'il faut dire et éviter. Les trois premières questions sont ouvertes à tous ; un compte gratuit débloque les 15. Entraînez-vous à voix haute jusqu'à ce que les réponses deviennent naturelles — c'est ce qui fait la différence le jour J.",
      faqTitle: 'Questions fréquentes',
      faqs: [
        { q: "Quelles questions pose-t-on en entretien d'Ausbildung ?", a: "Presque tous les entretiens couvrent le même cœur : se présenter, pourquoi cette entreprise, pourquoi l'Allemagne, points forts et faiblesses, parcours scolaire et professionnel, travail en équipe, vos objectifs, et la logistique (visa, logement, date de début). L'outil les couvre toutes avec des réponses-types." },
        { q: "L'entretien est-il en allemand ou en anglais ?", a: "Presque toujours en allemand. L'employeur utilise l'entretien pour vérifier votre vrai niveau à l'oral — B1 est généralement attendu pour une Ausbildung. Répondre avec assurance dans un allemand simple et correct vaut mieux que des phrases compliquées pleines de fautes." },
        { q: 'Comment répondre à « Erzählen Sie etwas über sich » ?', a: "Utilisez une structure simple d'environ une minute : nom, âge, origine, diplôme, niveau d'allemand actuel, pourquoi ce métier, et un hobby qui montre de l'initiative. Notre réponse-type vous donne les phrases exactes à adapter." },
        { q: "L'outil de préparation est-il gratuit ?", a: 'Oui. Trois questions complètes avec réponses-types sont accessibles sans compte, et un compte gratuit débloque les 15. Aucun paiement n\'est demandé.' },
      ],
    },
  },

  ar: {
    nav: 'تحضير المقابلة',
    learn: {
      title: 'تعلّم الألمانية أونلاين مجاناً — دورة كاملة من A1 إلى C1',
      intro:
        'تأخذك دورة GoGermany لتعلّم الألمانية من مستوى المبتدئ التام (A1) إلى المستوى المتقدم (C1) عبر دروس تفاعلية تتبع مستويات الإطار الأوروبي المرجعي (CEFR) نفسها المعتمدة في امتحانات Goethe وtelc وÖSD. يجمع كل درس بين شرح واضح للقواعد ومفردات عملية وتمارين تُصحَّح فوراً — بما فيها تمارين كتابة يصحّحها الذكاء الاصطناعي، لتُنتج الألمانية فعلاً بدل الاكتفاء بقراءتها. صُمِّمت الدورة لمن يحضّر انتقالاً حقيقياً إلى ألمانيا: أوسبيلدونغ، دراسة جامعية، تأشيرة عمل أو بطاقة الفرص.\n\nابدأ باختبار تحديد المستوى ثم تقدّم بإيقاعك الخاص — درسان في الأسبوع يكفيان لتقدّم ثابت. أضِف تمرين تصريف الأفعال اليومي (5 دقائق) لبناء سلسلة التزام، وإذا أردت أستاذاً فانضم إلى حصصنا المباشرة أونلاين في مجموعات صغيرة مع منهج مُقيَّم. لا حاجة لأي دفع أو تسجيل للبدء؛ الحساب المجاني يحفظ تقدّمك فقط.',
      faqTitle: 'أسئلة شائعة',
      faqs: [
        { q: 'هل دورة الألمانية مجانية فعلاً؟', a: 'نعم. جميع الدروس من A1 إلى C1 مجانية، بما فيها التمارين وتصحيح الكتابة بالذكاء الاصطناعي. الحساب المجاني يضيف فقط حفظ التقدّم. الخيار المدفوع الوحيد هو الحصص المباشرة مع أستاذ.' },
        { q: 'ما مستوى الألمانية المطلوب للانتقال إلى ألمانيا؟', a: 'للأوسبيلدونغ يتوقع معظم أرباب العمل B1–B2. الدراسة الجامعية بالألمانية تتطلب غالباً C1 (TestDaF أو DSH). في بطاقة الفرص يمنحك A1 نقاطاً وA2 فأكثر نقاطاً إضافية. للحياة اليومية تحتاج B1 على الأقل.' },
        { q: 'كم من الوقت يلزم للوصول إلى B1؟', a: 'بساعة إلى ساعتين يومياً يصل معظم المتعلمين إلى B1 خلال 6 إلى 9 أشهر تقريباً. إيقاعنا المقترح — درسان أسبوعياً مع التمرين اليومي — مصمَّم لتصل دون إرهاق.' },
        { q: 'هل تحضّر الدورة لامتحانات Goethe أو telc؟', a: 'يتبع المنهج مستويات CEFR الرسمية، فكل ما تتعلمه يقابل مباشرة امتحانات Goethe وtelc وÖSD. يتضمن الموقع أيضاً قسماً مخصصاً للتحضير للامتحانات مع تمارين نموذجية لكل مستوى.' },
      ],
    },
    prep: {
      title: 'أسئلة مقابلة الأوسبيلدونغ وأجوبتها بالألمانية',
      intro:
        'مقابلة العمل (Vorstellungsgespräch) هي الخطوة التي تحسم حصولك على عقد الأوسبيلدونغ — ومعظم المرشحين يفشلون فيها لا بسبب مستواهم في الألمانية، بل لأنهم لم يحضّروا الأسئلة المعتادة. تجمع هذه الأداة الأسئلة الـ15 الأكثر طرحاً من أرباب العمل الألمان في مقابلات الأوسبيلدونغ والتوظيف، من «Erzählen Sie etwas über sich» إلى لوجستيات التأشيرة والسكن، مرتّبةً في 8 فئات.\n\nيرافق كل سؤال جوابٌ نموذجي مكتوب بألمانية بمستوى B1–B2 يمكنك تعديله وحفظه، وشرحٌ لسبب طرح السؤال، وما يجب قوله وما يجب تجنبه. الأسئلة الثلاثة الأولى متاحة للجميع؛ والحساب المجاني يفتح الأسئلة الـ15 كلها. تدرّب عليها بصوت عالٍ حتى تصبح الأجوبة طبيعية — فهذا ما يصنع الفارق يوم المقابلة.',
      faqTitle: 'أسئلة شائعة',
      faqs: [
        { q: 'ما الأسئلة التي تُطرح في مقابلة الأوسبيلدونغ؟', a: 'تكاد كل المقابلات تغطي النواة نفسها: قدّم نفسك، لماذا هذه الشركة، لماذا ألمانيا، نقاط القوة والضعف، المسار الدراسي والمهني، العمل الجماعي، أهدافك، ثم اللوجستيات (التأشيرة، السكن، تاريخ البدء). تغطي الأداة كل ذلك بأجوبة نموذجية.' },
        { q: 'هل تكون المقابلة بالألمانية أم الإنجليزية؟', a: 'بالألمانية في الغالب الأعم. يستخدم رب العمل المقابلة للتحقق من مستواك الحقيقي في الكلام — وعادةً يُتوقع B1 للأوسبيلدونغ. الإجابة بثقة بألمانية بسيطة وصحيحة أفضل من جمل معقدة مليئة بالأخطاء.' },
        { q: 'كيف أجيب عن «Erzählen Sie etwas über sich»؟', a: 'استعمل بنية بسيطة لدقيقة واحدة تقريباً: الاسم، العمر، بلدك، شهادتك، مستواك الحالي في الألمانية، لماذا اخترت هذه المهنة، وهواية تُظهر روح المبادرة. جوابنا النموذجي يعطيك الجمل الجاهزة لتعديلها.' },
        { q: 'هل أداة تحضير المقابلة مجانية؟', a: 'نعم. ثلاثة أسئلة كاملة بأجوبتها النموذجية متاحة دون حساب، والحساب المجاني يفتح الأسئلة الـ15 كلها. لا يُطلب أي دفع.' },
      ],
    },
  },

  de: {
    nav: 'Interview-Vorbereitung',
    learn: {
      title: 'Deutsch online kostenlos lernen — kompletter Kurs von A1 bis C1',
      intro:
        'Der Deutschkurs von GoGermany führt dich vom absoluten Anfänger (A1) bis zum fortgeschrittenen Niveau (C1) — mit interaktiven Lektionen, die denselben GER-Stufen folgen wie die Prüfungen von Goethe, telc und ÖSD. Jede Lektion verbindet klare Grammatikerklärungen, praktischen Wortschatz und sofort korrigierte Übungen — inklusive KI-korrigierter Schreibaufgaben, damit du Deutsch wirklich produzierst statt nur zu lesen. Der Kurs ist für Menschen gemacht, die einen echten Umzug nach Deutschland vorbereiten: Ausbildung, Studium, Arbeitsvisum oder Chancenkarte.\n\nStarte mit dem Einstufungstest und lerne dann in deinem Tempo — zwei Lektionen pro Woche reichen für stetigen Fortschritt. Ergänze das tägliche 5-Minuten-Konjugationstraining, und wenn du eine Lehrkraft möchtest, nimm an unseren Live-Onlinekursen in kleinen Gruppen mit benotetem Lehrplan teil. Zum Lernen brauchst du weder Bezahlung noch Anmeldung; ein kostenloses Konto speichert lediglich deinen Fortschritt.',
      faqTitle: 'Häufige Fragen',
      faqs: [
        { q: 'Ist der Deutschkurs wirklich kostenlos?', a: 'Ja. Alle Lektionen von A1 bis C1 sind kostenlos, einschließlich der Übungen und der KI-Schreibkorrektur. Ein kostenloses Konto dient nur dem Speichern des Fortschritts. Kostenpflichtig sind nur die Live-Kurse mit Lehrkraft.' },
        { q: 'Welches Deutschniveau brauche ich für Deutschland?', a: 'Für eine Ausbildung erwarten die meisten Betriebe B1–B2. Deutschsprachige Studiengänge verlangen meist C1 (TestDaF oder DSH). Bei der Chancenkarte bringt schon A1 Punkte, A2 und höher noch mehr. Für den Alltag solltest du mindestens B1 anpeilen.' },
        { q: 'Wie lange dauert es bis B1?', a: 'Mit 1–2 Stunden täglich erreichen die meisten Lernenden B1 in etwa 6–9 Monaten. Unser Rhythmus von zwei Lektionen pro Woche plus täglichem Training ist genau darauf ausgelegt.' },
        { q: 'Bereitet der Kurs auf Goethe- oder telc-Prüfungen vor?', a: 'Der Lehrplan folgt den offiziellen GER-Stufen — alles Gelernte entspricht direkt den Prüfungen von Goethe, telc und ÖSD. Die Seite enthält außerdem einen eigenen Prüfungsvorbereitungsbereich mit Modellübungen für jede Stufe.' },
      ],
    },
    prep: {
      title: 'Fragen und Antworten fürs Ausbildungs-Vorstellungsgespräch',
      intro:
        'Das Vorstellungsgespräch entscheidet, ob du deinen Ausbildungsvertrag bekommst — und die meisten Bewerber scheitern nicht am Deutschniveau, sondern daran, dass sie die Standardfragen nie vorbereitet haben. Dieses Tool sammelt die 15 Fragen, die deutsche Arbeitgeber in Ausbildungs- und Jobinterviews am häufigsten stellen — von „Erzählen Sie etwas über sich“ bis zu Visum und Umzugslogistik, geordnet in 8 Kategorien.\n\nZu jeder Frage gibt es eine Musterantwort auf B1–B2-Deutsch zum Anpassen und Einprägen, eine Erklärung, warum die Frage gestellt wird, und konkrete Dos und Don\'ts. Die ersten drei Fragen sind frei zugänglich; ein kostenloses Konto schaltet alle 15 frei. Übe sie laut, bis die Antworten natürlich klingen — genau das macht am Tag des Gesprächs den Unterschied.',
      faqTitle: 'Häufige Fragen',
      faqs: [
        { q: 'Welche Fragen kommen im Ausbildungs-Vorstellungsgespräch?', a: 'Fast jedes Gespräch deckt denselben Kern ab: Selbstvorstellung, warum dieser Betrieb, warum Deutschland, Stärken und Schwächen, Schul- und Berufserfahrung, Teamarbeit, deine Ziele sowie Logistik wie Visum, Wohnung und Starttermin. Das Tool behandelt alle mit Musterantworten.' },
        { q: 'Ist das Gespräch auf Deutsch oder Englisch?', a: 'Fast immer auf Deutsch. Der Betrieb prüft im Gespräch dein echtes Sprechniveau — für eine Ausbildung wird meist B1 erwartet. Selbstbewusste Antworten in einfachem, korrektem Deutsch schlagen komplizierte Sätze voller Fehler.' },
        { q: 'Wie beantworte ich „Erzählen Sie etwas über sich“?', a: 'Nutze eine einfache Ein-Minuten-Struktur: Name, Alter, Herkunft, Abschluss, aktuelles Deutschniveau, warum dieser Beruf, und ein Hobby, das Eigeninitiative zeigt. Unsere Musterantwort liefert dir die Sätze zum Anpassen.' },
        { q: 'Ist das Interview-Tool kostenlos?', a: 'Ja. Drei komplette Fragen mit Musterantworten sind ohne Konto zugänglich, ein kostenloses Konto schaltet alle 15 frei. Es fällt keine Zahlung an.' },
      ],
    },
  },

  es: {
    nav: 'Preparación de entrevista',
    learn: {
      title: 'Aprende alemán online gratis — curso completo de A1 a C1',
      intro:
        'El curso de alemán de GoGermany te lleva desde principiante absoluto (A1) hasta el nivel avanzado (C1) con lecciones interactivas que siguen los mismos niveles MCER que usan los exámenes Goethe, telc y ÖSD. Cada lección combina explicaciones claras de gramática, vocabulario práctico y ejercicios corregidos al instante — incluidas tareas de escritura corregidas por IA, para que produzcas alemán en lugar de solo leerlo. El curso está pensado para quienes preparan una mudanza real a Alemania: Ausbildung, universidad, visado de trabajo o Chancenkarte.\n\nEmpieza con el test de nivel y avanza a tu ritmo — dos lecciones por semana bastan para progresar de forma constante. Añade el drill diario de conjugación de 5 minutos, y cuando quieras un profesor, únete a nuestras clases en directo en grupos pequeños con un programa evaluado. No necesitas pagar ni registrarte para empezar; una cuenta gratuita solo guarda tu progreso.',
      faqTitle: 'Preguntas frecuentes',
      faqs: [
        { q: '¿El curso de alemán es realmente gratis?', a: 'Sí. Todas las lecciones de A1 a C1 son gratuitas, incluidos los ejercicios y la corrección de escritura por IA. Una cuenta gratuita solo añade el guardado de progreso. La opción de pago son las clases en directo con profesor.' },
        { q: '¿Qué nivel de alemán necesito para irme a Alemania?', a: 'Para una Ausbildung la mayoría de las empresas esperan B1–B2. Los estudios universitarios en alemán suelen exigir C1 (TestDaF o DSH). Para la Chancenkarte, A1 ya suma puntos y A2 o más suma aún más. Para la vida diaria conviene al menos B1.' },
        { q: '¿Cuánto se tarda en llegar a B1?', a: 'Con 1–2 horas al día, la mayoría alcanza B1 en unos 6–9 meses. Nuestro ritmo de dos lecciones por semana más el drill diario está diseñado para lograrlo sin quemarte.' },
        { q: '¿El curso prepara para los exámenes Goethe o telc?', a: 'El programa sigue los niveles oficiales del MCER, así que todo lo que aprendes corresponde directamente a los exámenes Goethe, telc y ÖSD. La web incluye además una sección específica de preparación de exámenes con ejercicios modelo por nivel.' },
      ],
    },
    prep: {
      title: 'Preguntas y respuestas de la entrevista de Ausbildung en alemán',
      intro:
        'El Vorstellungsgespräch es el paso que decide si consigues tu contrato de Ausbildung — y la mayoría de los candidatos fallan no por su nivel de alemán, sino porque nunca prepararon las preguntas estándar. Esta herramienta reúne las 15 preguntas que más hacen los empleadores alemanes en entrevistas de Ausbildung y de trabajo, desde «Erzählen Sie etwas über sich» hasta la logística del visado, organizadas en 8 categorías.\n\nCada pregunta incluye una respuesta modelo escrita en alemán B1–B2 que puedes adaptar y memorizar, una explicación de por qué la hacen, y qué decir y qué evitar. Las tres primeras preguntas están abiertas a todos; una cuenta gratuita desbloquea las 15. Practícalas en voz alta hasta que suenen naturales — eso es lo que marca la diferencia ese día.',
      faqTitle: 'Preguntas frecuentes',
      faqs: [
        { q: '¿Qué preguntas hacen en una entrevista de Ausbildung?', a: 'Casi todas las entrevistas cubren lo mismo: preséntate, por qué esta empresa, por qué Alemania, fortalezas y debilidades, formación y experiencia, trabajo en equipo, tus objetivos, y logística como visado, alojamiento y fecha de inicio. La herramienta las cubre todas con respuestas modelo.' },
        { q: '¿La entrevista es en alemán o en inglés?', a: 'Casi siempre en alemán. La empresa usa la entrevista para comprobar tu nivel real al hablar — normalmente se espera B1 para una Ausbildung. Responder con seguridad en un alemán simple y correcto vale más que frases complicadas llenas de errores.' },
        { q: '¿Cómo respondo a «Erzählen Sie etwas über sich»?', a: 'Usa una estructura simple de un minuto: nombre, edad, origen, diploma, nivel actual de alemán, por qué elegiste esta profesión y un hobby que muestre iniciativa. Nuestra respuesta modelo te da las frases exactas para adaptar.' },
        { q: '¿La herramienta de preparación es gratis?', a: 'Sí. Tres preguntas completas con respuestas modelo están disponibles sin cuenta, y una cuenta gratuita desbloquea las 15. No se pide ningún pago.' },
      ],
    },
  },

  tr: {
    nav: 'Mülakat Hazırlığı',
    learn: {
      title: "Ücretsiz online Almanca öğren — A1'den C1'e tam kurs",
      intro:
        "GoGermany'nin Almanca kursu, Goethe, telc ve ÖSD sınavlarında kullanılan CEFR seviyelerini takip eden interaktif derslerle sizi sıfırdan (A1) ileri seviyeye (C1) taşır. Her ders net gramer anlatımı, pratik kelime bilgisi ve anında düzeltilen alıştırmaları birleştirir — yapay zekâ tarafından düzeltilen yazma görevleri dahil; böylece Almancayı sadece okumak yerine gerçekten üretirsiniz. Kurs, Almanya'ya gerçek bir taşınma hazırlayanlar için tasarlandı: Ausbildung, üniversite, çalışma vizesi veya Chancenkarte.\n\nSeviye tespit sınavıyla başlayın, sonra kendi hızınızda ilerleyin — haftada iki ders düzenli ilerleme için yeterli. Günlük 5 dakikalık fiil çekimi antrenmanını ekleyin; bir öğretmen istediğinizde küçük gruplarla, notlandırılan müfredatlı canlı online derslerimize katılın. Öğrenmeye başlamak için ödeme veya kayıt gerekmez; ücretsiz hesap yalnızca ilerlemenizi kaydeder.",
      faqTitle: 'Sıkça sorulan sorular',
      faqs: [
        { q: 'Almanca kursu gerçekten ücretsiz mi?', a: "Evet. A1'den C1'e tüm dersler, alıştırmalar ve yapay zekâ yazma düzeltmesi dahil ücretsizdir. Ücretsiz hesap yalnızca ilerleme kaydı ekler. Ücretli tek seçenek öğretmenli canlı derslerdir." },
        { q: 'Almanya için hangi Almanca seviyesi gerekir?', a: 'Ausbildung için çoğu işveren B1–B2 bekler. Almanca üniversite programları genellikle C1 ister (TestDaF veya DSH). Chancenkarte için A1 bile puan kazandırır, A2 ve üzeri daha fazlasını. Günlük yaşam için en az B1 hedefleyin.' },
        { q: "B1'e ulaşmak ne kadar sürer?", a: 'Günde 1–2 saatle çoğu öğrenci yaklaşık 6–9 ayda B1 seviyesine ulaşır. Haftada iki ders artı günlük antrenman ritmimiz, tükenmeden oraya varmanız için tasarlandı.' },
        { q: 'Kurs Goethe veya telc sınavlarına hazırlar mı?', a: 'Müfredat resmi CEFR seviyelerini izler; öğrendiğiniz her şey Goethe, telc ve ÖSD sınavlarıyla doğrudan örtüşür. Sitede ayrıca her seviye için örnek alıştırmalar içeren özel bir sınav hazırlık bölümü vardır.' },
      ],
    },
    prep: {
      title: 'Almanca Ausbildung mülakat soruları ve cevapları',
      intro:
        "Vorstellungsgespräch, Ausbildung sözleşmenizi alıp almayacağınızı belirleyen adımdır — ve adayların çoğu Almanca seviyesi yüzünden değil, standart soruları hiç hazırlamadıkları için başarısız olur. Bu araç, Alman işverenlerin Ausbildung ve iş mülakatlarında en çok sorduğu 15 soruyu bir araya getirir: “Erzählen Sie etwas über sich”ten vize ve taşınma lojistiğine kadar, 8 kategoride düzenlenmiş.\n\nHer soru; uyarlayıp ezberleyebileceğiniz B1–B2 Almanca yazılmış örnek bir cevap, sorunun neden sorulduğunun açıklaması ve somut yapılması/yapılmaması gerekenlerle gelir. İlk üç soru herkese açıktır; ücretsiz hesap 15 sorunun tamamını açar. Cevaplar doğal gelene kadar yüksek sesle çalışın — mülakat günü farkı yaratan budur.",
      faqTitle: 'Sıkça sorulan sorular',
      faqs: [
        { q: 'Ausbildung mülakatında hangi sorular sorulur?', a: 'Hemen her mülakat aynı çekirdeği kapsar: kendini tanıt, neden bu şirket, neden Almanya, güçlü ve zayıf yönler, okul ve iş deneyimi, ekip çalışması, hedeflerin ve vize, konaklama, başlangıç tarihi gibi lojistik. Araç hepsini örnek cevaplarla kapsar.' },
        { q: 'Mülakat Almanca mı İngilizce mi yapılır?', a: 'Neredeyse her zaman Almanca. İşveren mülakatta gerçek konuşma seviyenizi ölçer — Ausbildung için genellikle B1 beklenir. Basit ve doğru Almancayla özgüvenli cevaplar, hatalarla dolu karmaşık cümlelerden iyidir.' },
        { q: '“Erzählen Sie etwas über sich” sorusuna nasıl cevap veririm?', a: 'Yaklaşık bir dakikalık basit bir yapı kullanın: isim, yaş, memleket, diploma, mevcut Almanca seviyesi, bu mesleği neden seçtiğiniz ve inisiyatif gösteren bir hobi. Örnek cevabımız uyarlayacağınız cümleleri verir.' },
        { q: 'Mülakat hazırlık aracı ücretsiz mi?', a: 'Evet. Üç tam soru örnek cevaplarıyla hesapsız erişilebilir; ücretsiz hesap 15 sorunun tamamını açar. Hiçbir ödeme istenmez.' },
      ],
    },
  },

  fa: {
    nav: 'آمادگی مصاحبه',
    learn: {
      title: 'آموزش رایگان آنلاین زبان آلمانی — دوره کامل A1 تا C1',
      intro:
        'دوره آلمانی GoGermany شما را از مبتدی مطلق (A1) تا سطح پیشرفته (C1) می‌رساند؛ با درس‌های تعاملی که از همان سطوح CEFR استفاده‌شده در آزمون‌های Goethe و telc و ÖSD پیروی می‌کنند. هر درس توضیح روشن گرامر، واژگان کاربردی و تمرین‌هایی با تصحیح فوری را ترکیب می‌کند — از جمله تمرین‌های نوشتاری با تصحیح هوش مصنوعی، تا واقعاً آلمانی تولید کنید نه اینکه فقط بخوانید. این دوره برای کسانی ساخته شده که مهاجرتی واقعی به آلمان را آماده می‌کنند: آوسبیلدونگ، دانشگاه، ویزای کار یا کارت فرصت.\n\nبا آزمون تعیین سطح شروع کنید و سپس با ریتم خودتان پیش بروید — دو درس در هفته برای پیشرفت پیوسته کافی است. تمرین روزانه ۵ دقیقه‌ای صرف افعال را اضافه کنید و هر وقت معلم خواستید، به کلاس‌های زنده آنلاین ما در گروه‌های کوچک با برنامه درسی نمره‌دار بپیوندید. برای شروع نه پرداختی لازم است نه ثبت‌نام؛ حساب رایگان فقط پیشرفت شما را ذخیره می‌کند.',
      faqTitle: 'پرسش‌های متداول',
      faqs: [
        { q: 'آیا دوره آلمانی واقعاً رایگان است؟', a: 'بله. همه درس‌ها از A1 تا C1 رایگان‌اند، از جمله تمرین‌ها و تصحیح نوشتار با هوش مصنوعی. حساب رایگان فقط ذخیره پیشرفت را اضافه می‌کند. تنها گزینه پولی، کلاس‌های زنده با معلم است.' },
        { q: 'برای رفتن به آلمان چه سطحی از آلمانی لازم است؟', a: 'برای آوسبیلدونگ بیشتر کارفرمایان B1–B2 انتظار دارند. تحصیل دانشگاهی به زبان آلمانی معمولاً C1 می‌خواهد (TestDaF یا DSH). برای کارت فرصت، همان A1 هم امتیاز می‌آورد و A2 به بالا بیشتر. برای زندگی روزمره دست‌کم B1 لازم است.' },
        { q: 'رسیدن به B1 چقدر طول می‌کشد؟', a: 'با ۱ تا ۲ ساعت در روز، بیشتر زبان‌آموزان در حدود ۶ تا ۹ ماه به B1 می‌رسند. ریتم پیشنهادی ما — دو درس در هفته به‌علاوه تمرین روزانه — برای رسیدن بدون فرسودگی طراحی شده است.' },
        { q: 'آیا این دوره برای آزمون‌های Goethe یا telc آماده می‌کند؟', a: 'برنامه درسی از سطوح رسمی CEFR پیروی می‌کند؛ پس هر چه یاد می‌گیرید مستقیماً با آزمون‌های Goethe و telc و ÖSD مطابقت دارد. سایت همچنین بخش ویژه آمادگی آزمون با تمرین‌های نمونه برای هر سطح دارد.' },
      ],
    },
    prep: {
      title: 'سؤالات مصاحبه آوسبیلدونگ با پاسخ‌های آلمانی',
      intro:
        'مصاحبه کاری (Vorstellungsgespräch) مرحله‌ای است که تعیین می‌کند قرارداد آوسبیلدونگ را بگیرید یا نه — و بیشتر داوطلبان نه به‌خاطر سطح آلمانی، بلکه چون سؤالات استاندارد را هرگز آماده نکرده‌اند رد می‌شوند. این ابزار ۱۵ سؤالی را که کارفرمایان آلمانی در مصاحبه‌های آوسبیلدونگ و استخدام بیش از همه می‌پرسند گرد آورده است؛ از «Erzählen Sie etwas über sich» تا مسائل ویزا و اسکان، در ۸ دسته.\n\nهر سؤال با یک پاسخ نمونه به آلمانی سطح B1–B2 همراه است که می‌توانید آن را تغییر دهید و حفظ کنید، به‌علاوه توضیح اینکه چرا مصاحبه‌گر این را می‌پرسد و بایدها و نبایدهای مشخص. سه سؤال اول برای همه باز است؛ حساب رایگان هر ۱۵ سؤال را باز می‌کند. آن‌ها را با صدای بلند تمرین کنید تا پاسخ‌ها طبیعی شوند — همین در روز مصاحبه تفاوت می‌سازد.',
      faqTitle: 'پرسش‌های متداول',
      faqs: [
        { q: 'در مصاحبه آوسبیلدونگ چه سؤالاتی می‌پرسند؟', a: 'تقریباً همه مصاحبه‌ها هسته یکسانی دارند: معرفی خود، چرا این شرکت، چرا آلمان، نقاط قوت و ضعف، سوابق تحصیلی و کاری، کار تیمی، اهداف شما و مسائل عملی مثل ویزا، مسکن و تاریخ شروع. این ابزار همه را با پاسخ نمونه پوشش می‌دهد.' },
        { q: 'مصاحبه به آلمانی است یا انگلیسی؟', a: 'تقریباً همیشه به آلمانی. کارفرما با مصاحبه سطح واقعی گفتار شما را می‌سنجد — برای آوسبیلدونگ معمولاً B1 انتظار می‌رود. پاسخ دادن با اعتمادبه‌نفس به آلمانی ساده و درست، بهتر از جمله‌های پیچیده پر از خطاست.' },
        { q: 'به «Erzählen Sie etwas über sich» چگونه پاسخ دهم؟', a: 'از ساختاری ساده حدود یک دقیقه استفاده کنید: نام، سن، کشور، مدرک، سطح فعلی آلمانی، چرایی انتخاب این حرفه و یک سرگرمی که ابتکار عمل نشان دهد. پاسخ نمونه ما جمله‌های دقیق را برای شخصی‌سازی می‌دهد.' },
        { q: 'آیا ابزار آمادگی مصاحبه رایگان است؟', a: 'بله. سه سؤال کامل با پاسخ نمونه بدون حساب در دسترس است و حساب رایگان هر ۱۵ سؤال را باز می‌کند. هیچ پرداختی لازم نیست.' },
      ],
    },
  },

  pt: {
    nav: 'Preparação para entrevista',
    learn: {
      title: 'Aprenda alemão online grátis — curso completo de A1 a C1',
      intro:
        'O curso de alemão da GoGermany leva você do iniciante absoluto (A1) ao nível avançado (C1) com aulas interativas que seguem os mesmos níveis do QECR usados nos exames Goethe, telc e ÖSD. Cada lição combina explicações claras de gramática, vocabulário prático e exercícios corrigidos na hora — incluindo tarefas de escrita corrigidas por IA, para você realmente produzir alemão em vez de só ler. O curso foi feito para quem prepara uma mudança real para a Alemanha: Ausbildung, universidade, visto de trabalho ou Chancenkarte.\n\nComece pelo teste de nivelamento e avance no seu ritmo — duas lições por semana bastam para progredir de forma constante. Adicione o treino diário de conjugação de 5 minutos e, quando quiser um professor, participe das nossas aulas ao vivo em grupos pequenos com currículo avaliado. Não é preciso pagar nem se cadastrar para começar; uma conta gratuita apenas salva seu progresso.',
      faqTitle: 'Perguntas frequentes',
      faqs: [
        { q: 'O curso de alemão é realmente grátis?', a: 'Sim. Todas as lições de A1 a C1 são gratuitas, incluindo os exercícios e a correção de escrita por IA. Uma conta gratuita só adiciona o salvamento do progresso. A opção paga são as aulas ao vivo com professor.' },
        { q: 'Que nível de alemão preciso para ir à Alemanha?', a: 'Para uma Ausbildung, a maioria dos empregadores espera B1–B2. Cursos universitários em alemão costumam exigir C1 (TestDaF ou DSH). Para a Chancenkarte, A1 já rende pontos e A2 ou mais rende ainda mais. No dia a dia, mire pelo menos B1.' },
        { q: 'Quanto tempo leva para chegar ao B1?', a: 'Com 1–2 horas por dia, a maioria chega ao B1 em cerca de 6–9 meses. Nosso ritmo de duas lições por semana mais o treino diário foi pensado para chegar lá sem se esgotar.' },
        { q: 'O curso prepara para os exames Goethe ou telc?', a: 'O currículo segue os níveis oficiais do QECR, então tudo o que você aprende corresponde diretamente aos exames Goethe, telc e ÖSD. O site também tem uma seção dedicada de preparação para exames com exercícios-modelo por nível.' },
      ],
    },
    prep: {
      title: 'Perguntas e respostas da entrevista de Ausbildung em alemão',
      intro:
        'O Vorstellungsgespräch é a etapa que decide se você consegue seu contrato de Ausbildung — e a maioria dos candidatos falha não pelo nível de alemão, mas porque nunca preparou as perguntas padrão. Esta ferramenta reúne as 15 perguntas que os empregadores alemães mais fazem em entrevistas de Ausbildung e de emprego, de “Erzählen Sie etwas über sich” à logística do visto, organizadas em 8 categorias.\n\nCada pergunta vem com uma resposta-modelo escrita em alemão B1–B2 para adaptar e memorizar, uma explicação do porquê da pergunta e o que dizer e evitar. As três primeiras perguntas são abertas a todos; uma conta gratuita desbloqueia as 15. Treine em voz alta até as respostas soarem naturais — é isso que faz a diferença no dia.',
      faqTitle: 'Perguntas frequentes',
      faqs: [
        { q: 'Quais perguntas caem numa entrevista de Ausbildung?', a: 'Quase toda entrevista cobre o mesmo núcleo: apresente-se, por que esta empresa, por que a Alemanha, pontos fortes e fracos, formação e experiência, trabalho em equipe, seus objetivos e logística como visto, moradia e data de início. A ferramenta cobre todas com respostas-modelo.' },
        { q: 'A entrevista é em alemão ou inglês?', a: 'Quase sempre em alemão. O empregador usa a entrevista para verificar seu nível real de fala — geralmente se espera B1 para uma Ausbildung. Responder com confiança num alemão simples e correto vale mais que frases complicadas cheias de erros.' },
        { q: 'Como responder a “Erzählen Sie etwas über sich”?', a: 'Use uma estrutura simples de cerca de um minuto: nome, idade, origem, diploma, nível atual de alemão, por que escolheu essa profissão e um hobby que mostre iniciativa. Nossa resposta-modelo dá as frases exatas para adaptar.' },
        { q: 'A ferramenta de preparação é grátis?', a: 'Sim. Três perguntas completas com respostas-modelo ficam abertas sem conta, e uma conta gratuita desbloqueia as 15. Nenhum pagamento é exigido.' },
      ],
    },
  },

  ru: {
    nav: 'Подготовка к собеседованию',
    learn: {
      title: 'Учите немецкий онлайн бесплатно — полный курс от A1 до C1',
      intro:
        'Курс немецкого от GoGermany ведёт вас от полного новичка (A1) до продвинутого уровня (C1) через интерактивные уроки, которые следуют тем же уровням CEFR, что и экзамены Goethe, telc и ÖSD. Каждый урок сочетает понятные объяснения грамматики, практическую лексику и упражнения с мгновенной проверкой — включая письменные задания с проверкой ИИ, чтобы вы действительно говорили и писали по-немецки, а не только читали. Курс создан для тех, кто готовит реальный переезд в Германию: Ausbildung, университет, рабочая виза или Chancenkarte.\n\nНачните с теста на уровень и двигайтесь в своём темпе — двух уроков в неделю достаточно для стабильного прогресса. Добавьте ежедневную 5-минутную тренировку спряжений, а когда захотите преподавателя — присоединяйтесь к нашим живым онлайн-занятиям в мини-группах с оцениваемой программой. Чтобы начать, не нужны ни оплата, ни регистрация; бесплатный аккаунт лишь сохраняет ваш прогресс.',
      faqTitle: 'Частые вопросы',
      faqs: [
        { q: 'Курс немецкого действительно бесплатный?', a: 'Да. Все уроки от A1 до C1 бесплатны, включая упражнения и проверку письма ИИ. Бесплатный аккаунт добавляет только сохранение прогресса. Платная опция — живые занятия с преподавателем.' },
        { q: 'Какой уровень немецкого нужен для переезда в Германию?', a: 'Для Ausbildung большинство работодателей ждут B1–B2. Немецкоязычные университетские программы обычно требуют C1 (TestDaF или DSH). Для Chancenkarte уже A1 даёт баллы, а A2 и выше — больше. Для повседневной жизни нужен минимум B1.' },
        { q: 'Сколько времени нужно до B1?', a: 'При 1–2 часах в день большинство достигает B1 примерно за 6–9 месяцев. Наш ритм — два урока в неделю плюс ежедневная тренировка — рассчитан именно на это без выгорания.' },
        { q: 'Готовит ли курс к экзаменам Goethe или telc?', a: 'Программа повторяет официальные уровни CEFR, поэтому всё выученное напрямую соответствует экзаменам Goethe, telc и ÖSD. На сайте есть и отдельный раздел подготовки к экзаменам с типовыми заданиями для каждого уровня.' },
      ],
    },
    prep: {
      title: 'Вопросы и ответы собеседования на Ausbildung на немецком',
      intro:
        'Vorstellungsgespräch — этап, который решает, получите ли вы контракт на Ausbildung. Большинство кандидатов проваливаются не из-за уровня немецкого, а потому что никогда не готовили стандартные вопросы. Этот инструмент собирает 15 вопросов, которые немецкие работодатели задают чаще всего на собеседованиях, — от «Erzählen Sie etwas über sich» до визы и переезда, в 8 категориях.\n\nК каждому вопросу прилагается образцовый ответ на немецком уровня B1–B2, который можно адаптировать и выучить, объяснение, зачем его задают, и конкретные «говорите» и «избегайте». Первые три вопроса открыты всем; бесплатный аккаунт открывает все 15. Отрабатывайте ответы вслух, пока они не станут естественными — именно это решает всё в день собеседования.',
      faqTitle: 'Частые вопросы',
      faqs: [
        { q: 'Какие вопросы задают на собеседовании на Ausbildung?', a: 'Почти каждое собеседование покрывает одно ядро: расскажите о себе, почему эта компания, почему Германия, сильные и слабые стороны, учёба и опыт, работа в команде, ваши цели и логистика — виза, жильё, дата начала. Инструмент покрывает все с образцовыми ответами.' },
        { q: 'Собеседование на немецком или английском?', a: 'Почти всегда на немецком. Работодатель проверяет ваш реальный разговорный уровень — для Ausbildung обычно ждут B1. Уверенные ответы простым и правильным немецким лучше сложных фраз с ошибками.' },
        { q: 'Как ответить на «Erzählen Sie etwas über sich»?', a: 'Используйте простую структуру на минуту: имя, возраст, откуда вы, диплом, текущий уровень немецкого, почему выбрали эту профессию и одно хобби, показывающее инициативность. Наш образцовый ответ даёт готовые фразы для адаптации.' },
        { q: 'Инструмент подготовки бесплатный?', a: 'Да. Три полных вопроса с ответами доступны без аккаунта, бесплатный аккаунт открывает все 15. Оплата не требуется.' },
      ],
    },
  },

  hi: {
    nav: 'इंटरव्यू की तैयारी',
    learn: {
      title: 'मुफ्त ऑनलाइन जर्मन सीखें — A1 से C1 तक पूरा कोर्स',
      intro:
        'GoGermany का जर्मन कोर्स आपको बिल्कुल शुरुआती स्तर (A1) से एडवांस्ड (C1) तक ले जाता है — इंटरैक्टिव पाठों के साथ, जो Goethe, telc और ÖSD परीक्षाओं में इस्तेमाल होने वाले CEFR स्तरों का ही पालन करते हैं। हर पाठ में स्पष्ट व्याकरण, व्यावहारिक शब्दावली और तुरंत जाँचे जाने वाले अभ्यास मिलते हैं — AI द्वारा जाँचे गए लेखन कार्य भी, ताकि आप जर्मन सिर्फ पढ़ें नहीं, बल्कि खुद बनाएँ। यह कोर्स उनके लिए बना है जो सच में जर्मनी जाने की तैयारी कर रहे हैं: Ausbildung, विश्वविद्यालय, वर्क वीज़ा या Chancenkarte।\n\nपहले लेवल टेस्ट से अपना स्तर जानें, फिर अपनी गति से आगे बढ़ें — हफ्ते में दो पाठ स्थिर प्रगति के लिए काफी हैं। रोज़ का 5 मिनट का क्रिया अभ्यास जोड़ें, और जब शिक्षक चाहिए हो तो छोटे समूहों वाली हमारी लाइव ऑनलाइन क्लासेस जॉइन करें। शुरू करने के लिए न भुगतान चाहिए न रजिस्ट्रेशन; मुफ्त खाता सिर्फ आपकी प्रगति सहेजता है।',
      faqTitle: 'अक्सर पूछे जाने वाले सवाल',
      faqs: [
        { q: 'क्या जर्मन कोर्स सच में मुफ्त है?', a: 'हाँ। A1 से C1 तक सभी पाठ मुफ्त हैं — अभ्यास और AI लेखन सुधार समेत। मुफ्त खाता केवल प्रगति सहेजने के लिए है। सशुल्क विकल्प सिर्फ शिक्षक के साथ लाइव क्लासेस हैं।' },
        { q: 'जर्मनी जाने के लिए कौन-सा जर्मन स्तर चाहिए?', a: 'Ausbildung के लिए ज़्यादातर नियोक्ता B1–B2 चाहते हैं। जर्मन-माध्यम विश्वविद्यालय अक्सर C1 माँगते हैं (TestDaF या DSH)। Chancenkarte में A1 से ही अंक मिलते हैं और A2+ से ज़्यादा। रोज़मर्रा की ज़िंदगी के लिए कम से कम B1 रखें।' },
        { q: 'B1 तक पहुँचने में कितना समय लगता है?', a: 'रोज़ 1–2 घंटे से ज़्यादातर लोग करीब 6–9 महीनों में B1 पर पहुँच जाते हैं। हफ्ते में दो पाठ और रोज़ के अभ्यास की हमारी रफ़्तार इसी के लिए बनी है — बिना थके।' },
        { q: 'क्या यह कोर्स Goethe या telc परीक्षाओं की तैयारी कराता है?', a: 'पाठ्यक्रम आधिकारिक CEFR स्तरों का पालन करता है, इसलिए जो भी आप सीखते हैं वह सीधे Goethe, telc और ÖSD परीक्षाओं से मेल खाता है। साइट पर हर स्तर के लिए मॉडल अभ्यासों वाला अलग परीक्षा-तैयारी सेक्शन भी है।' },
      ],
    },
    prep: {
      title: 'जर्मन में Ausbildung इंटरव्यू के सवाल और जवाब',
      intro:
        'Vorstellungsgespräch वही कदम है जो तय करता है कि आपको Ausbildung कॉन्ट्रैक्ट मिलेगा या नहीं — और ज़्यादातर उम्मीदवार जर्मन स्तर की वजह से नहीं, बल्कि स्टैंडर्ड सवालों की तैयारी न करने की वजह से असफल होते हैं। यह टूल जर्मन नियोक्ताओं द्वारा Ausbildung और नौकरी के इंटरव्यू में सबसे ज़्यादा पूछे जाने वाले 15 सवाल जुटाता है — “Erzählen Sie etwas über sich” से लेकर वीज़ा और रहने की व्यवस्था तक, 8 श्रेणियों में।\n\nहर सवाल के साथ B1–B2 जर्मन में लिखा मॉडल जवाब मिलता है जिसे आप ढालकर याद कर सकते हैं, यह समझ कि सवाल क्यों पूछा जाता है, और क्या कहें–क्या न कहें। पहले तीन सवाल सबके लिए खुले हैं; मुफ्त खाता सभी 15 खोल देता है। जवाबों को ज़ोर से बोलकर तब तक दोहराएँ जब तक वे स्वाभाविक न लगें — इंटरव्यू के दिन यही फर्क डालता है।',
      faqTitle: 'अक्सर पूछे जाने वाले सवाल',
      faqs: [
        { q: 'Ausbildung इंटरव्यू में कौन-से सवाल पूछे जाते हैं?', a: 'लगभग हर इंटरव्यू का मूल एक जैसा होता है: अपना परिचय, यह कंपनी क्यों, जर्मनी क्यों, ताकत और कमज़ोरियाँ, पढ़ाई और अनुभव, टीमवर्क, आपके लक्ष्य, और वीज़ा, आवास व शुरुआत की तारीख जैसी व्यवस्थाएँ। टूल इन सबको मॉडल जवाबों के साथ कवर करता है।' },
        { q: 'इंटरव्यू जर्मन में होता है या अंग्रेज़ी में?', a: 'लगभग हमेशा जर्मन में। नियोक्ता इंटरव्यू से आपका असली बोलने का स्तर परखता है — Ausbildung के लिए आमतौर पर B1 अपेक्षित है। सरल, सही जर्मन में आत्मविश्वास से जवाब देना गलतियों से भरे जटिल वाक्यों से बेहतर है।' },
        { q: '“Erzählen Sie etwas über sich” का जवाब कैसे दें?', a: 'करीब एक मिनट की सरल संरचना अपनाएँ: नाम, उम्र, आप कहाँ से हैं, डिप्लोमा, मौजूदा जर्मन स्तर, यह पेशा क्यों चुना, और एक शौक जो पहल दिखाए। हमारा मॉडल जवाब आपको ढालने लायक सटीक वाक्य देता है।' },
        { q: 'क्या इंटरव्यू तैयारी टूल मुफ्त है?', a: 'हाँ। तीन पूरे सवाल मॉडल जवाबों समेत बिना खाते के खुले हैं, और मुफ्त खाता सभी 15 खोल देता है। कोई भुगतान नहीं माँगा जाता।' },
      ],
    },
  },

  ur: {
    nav: 'انٹرویو کی تیاری',
    learn: {
      title: 'مفت آن لائن جرمن سیکھیں — A1 سے C1 تک مکمل کورس',
      intro:
        'GoGermany کا جرمن کورس آپ کو بالکل ابتدائی سطح (A1) سے ایڈوانس (C1) تک لے جاتا ہے — ایسے انٹرایکٹو اسباق کے ساتھ جو Goethe، telc اور ÖSD امتحانات میں استعمال ہونے والی CEFR سطحوں ہی کی پیروی کرتے ہیں۔ ہر سبق میں واضح گرامر، عملی ذخیرۂ الفاظ اور فوری جانچے جانے والی مشقیں شامل ہیں — AI سے جانچے گئے تحریری کام بھی، تاکہ آپ جرمن صرف پڑھیں نہیں بلکہ خود بنائیں۔ یہ کورس ان کے لیے بنایا گیا ہے جو واقعی جرمنی منتقل ہونے کی تیاری کر رہے ہیں: آؤسبلڈنگ، یونیورسٹی، ورک ویزا یا چانسن کارٹے۔\n\nپہلے لیول ٹیسٹ سے اپنی سطح جانیں، پھر اپنی رفتار سے آگے بڑھیں — ہفتے میں دو اسباق مستقل پیش رفت کے لیے کافی ہیں۔ روزانہ 5 منٹ کی فعل گردان مشق شامل کریں، اور جب استاد چاہیے ہو تو چھوٹے گروپوں والی ہماری لائیو آن لائن کلاسوں میں شامل ہوں۔ شروع کرنے کے لیے نہ ادائیگی درکار ہے نہ رجسٹریشن؛ مفت اکاؤنٹ صرف آپ کی پیش رفت محفوظ کرتا ہے۔',
      faqTitle: 'اکثر پوچھے جانے والے سوالات',
      faqs: [
        { q: 'کیا جرمن کورس واقعی مفت ہے؟', a: 'جی ہاں۔ A1 سے C1 تک تمام اسباق مفت ہیں — مشقیں اور AI تحریری اصلاح سمیت۔ مفت اکاؤنٹ صرف پیش رفت محفوظ کرنے کے لیے ہے۔ ادائیگی والا واحد آپشن استاد کے ساتھ لائیو کلاسیں ہیں۔' },
        { q: 'جرمنی جانے کے لیے کون سی جرمن سطح درکار ہے؟', a: 'آؤسبلڈنگ کے لیے زیادہ تر آجر B1–B2 چاہتے ہیں۔ جرمن زبان میں یونیورسٹی پروگرام عموماً C1 مانگتے ہیں (TestDaF یا DSH)۔ چانسن کارٹے میں A1 سے ہی پوائنٹس ملتے ہیں اور A2+ سے زیادہ۔ روزمرہ زندگی کے لیے کم از کم B1 رکھیں۔' },
        { q: 'B1 تک پہنچنے میں کتنا وقت لگتا ہے؟', a: 'روزانہ 1–2 گھنٹے کے ساتھ زیادہ تر سیکھنے والے تقریباً 6–9 مہینوں میں B1 پر پہنچ جاتے ہیں۔ ہفتے میں دو اسباق اور روزانہ مشق کی ہماری رفتار اسی کے لیے بنائی گئی ہے۔' },
        { q: 'کیا یہ کورس Goethe یا telc امتحانات کی تیاری کراتا ہے؟', a: 'نصاب سرکاری CEFR سطحوں کی پیروی کرتا ہے، اس لیے آپ جو کچھ سیکھتے ہیں وہ براہِ راست Goethe، telc اور ÖSD امتحانات سے مطابقت رکھتا ہے۔ سائٹ پر ہر سطح کے لیے نمونہ مشقوں والا الگ امتحانی تیاری کا حصہ بھی ہے۔' },
      ],
    },
    prep: {
      title: 'جرمن میں آؤسبلڈنگ انٹرویو کے سوالات اور جوابات',
      intro:
        'Vorstellungsgespräch وہ مرحلہ ہے جو طے کرتا ہے کہ آپ کو آؤسبلڈنگ کا معاہدہ ملے گا یا نہیں — اور زیادہ تر امیدوار جرمن سطح کی وجہ سے نہیں بلکہ اس لیے ناکام ہوتے ہیں کہ انہوں نے معیاری سوالات کبھی تیار ہی نہیں کیے۔ یہ ٹول جرمن آجروں کے آؤسبلڈنگ اور ملازمت کے انٹرویوز میں سب سے زیادہ پوچھے جانے والے 15 سوالات جمع کرتا ہے — “Erzählen Sie etwas über sich” سے لے کر ویزا اور رہائش کے امور تک، 8 زمروں میں۔\n\nہر سوال کے ساتھ B1–B2 جرمن میں لکھا نمونہ جواب ملتا ہے جسے آپ ڈھال کر یاد کر سکتے ہیں، یہ وضاحت کہ سوال کیوں پوچھا جاتا ہے، اور کیا کہنا ہے اور کس سے بچنا ہے۔ پہلے تین سوالات سب کے لیے کھلے ہیں؛ مفت اکاؤنٹ تمام 15 کھول دیتا ہے۔ جوابات کو بلند آواز میں اتنا دہرائیں کہ فطری لگنے لگیں — انٹرویو کے دن یہی فرق ڈالتا ہے۔',
      faqTitle: 'اکثر پوچھے جانے والے سوالات',
      faqs: [
        { q: 'آؤسبلڈنگ انٹرویو میں کون سے سوالات پوچھے جاتے ہیں؟', a: 'تقریباً ہر انٹرویو کا بنیادی حصہ ایک جیسا ہوتا ہے: اپنا تعارف، یہ کمپنی کیوں، جرمنی کیوں، خوبیاں اور خامیاں، تعلیم اور تجربہ، ٹیم ورک، آپ کے اہداف، اور ویزا، رہائش اور آغاز کی تاریخ جیسے عملی امور۔ ٹول ان سب کو نمونہ جوابات کے ساتھ شامل کرتا ہے۔' },
        { q: 'انٹرویو جرمن میں ہوتا ہے یا انگریزی میں؟', a: 'تقریباً ہمیشہ جرمن میں۔ آجر انٹرویو سے آپ کی اصل بولنے کی سطح جانچتا ہے — آؤسبلڈنگ کے لیے عموماً B1 متوقع ہے۔ سادہ اور درست جرمن میں پراعتماد جواب، غلطیوں سے بھرے پیچیدہ جملوں سے بہتر ہے۔' },
        { q: '“Erzählen Sie etwas über sich” کا جواب کیسے دوں؟', a: 'تقریباً ایک منٹ کی سادہ ساخت اپنائیں: نام، عمر، آپ کہاں سے ہیں، ڈپلومہ، موجودہ جرمن سطح، یہ پیشہ کیوں چنا، اور ایک مشغلہ جو خود اعتمادی ظاہر کرے۔ ہمارا نمونہ جواب آپ کو ڈھالنے کے لیے تیار جملے دیتا ہے۔' },
        { q: 'کیا انٹرویو تیاری کا ٹول مفت ہے؟', a: 'جی ہاں۔ تین مکمل سوالات نمونہ جوابات سمیت بغیر اکاؤنٹ دستیاب ہیں، اور مفت اکاؤنٹ تمام 15 کھول دیتا ہے۔ کوئی ادائیگی نہیں مانگی جاتی۔' },
      ],
    },
  },

  zh: {
    nav: '面试准备',
    learn: {
      title: '免费在线学德语 — A1 到 C1 完整课程',
      intro:
        'GoGermany 的德语课程带你从零基础（A1）一路学到高级（C1），互动课程完全对应歌德学院（Goethe）、telc 和 ÖSD 考试所用的 CEFR 等级。每节课都包含清晰的语法讲解、实用词汇和即时批改的练习——包括由 AI 批改的写作任务，让你真正开口和动笔，而不只是阅读。课程专为真正准备移居德国的人设计：Ausbildung 职业培训、大学留学、工作签证或机会卡（Chancenkarte）。\n\n先做定级测试找到自己的水平，然后按自己的节奏学习——每周两课足以稳步提升。再加上每天 5 分钟的动词变位训练养成习惯；想要老师指导时，可加入我们的小班在线直播课，配有计分课程体系。开始学习无需付费也无需注册；免费账户只用于跨设备保存进度。',
      faqTitle: '常见问题',
      faqs: [
        { q: '德语课程真的免费吗？', a: '是的。A1 到 C1 的全部课程免费，包括练习和 AI 写作批改。免费账户只是用来保存学习进度。唯一的付费项目是有老师的在线直播课。' },
        { q: '去德国需要什么德语水平？', a: '做 Ausbildung 大多数雇主要求 B1–B2；德语授课的大学项目通常要求 C1（TestDaF 或 DSH）；机会卡中 A1 就能加分，A2 及以上加分更多。日常生活至少需要 B1。' },
        { q: '达到 B1 需要多长时间？', a: '每天学习 1–2 小时，大多数学习者约 6–9 个月可达到 B1。我们每周两课加每日训练的节奏正是为此设计，不会让你过度疲劳。' },
        { q: '这门课能帮我备考歌德或 telc 考试吗？', a: '课程体系完全对应官方 CEFR 等级，所学内容直接对应歌德、telc 和 ÖSD 考试。网站还设有专门的备考板块，为每个等级提供样题练习。' },
      ],
    },
    prep: {
      title: '德国 Ausbildung 面试问题与德语答案',
      intro:
        '求职面试（Vorstellungsgespräch）是决定你能否拿到 Ausbildung 合同的关键一步——大多数候选人失败不是因为德语水平，而是因为从未准备过那些标准问题。这个工具汇集了德国雇主在 Ausbildung 和求职面试中最常问的 15 个问题，从“Erzählen Sie etwas über sich”到签证与安置安排，分为 8 个类别。\n\n每个问题都配有一份 B1–B2 水平的德语范例回答，可直接改编背诵，并解释面试官为什么这样问，以及该说什么、避免什么。前三个问题对所有人开放；注册免费账户即可解锁全部 15 个。大声反复练习，直到回答自然流畅——这正是面试当天拉开差距的关键。',
      faqTitle: '常见问题',
      faqs: [
        { q: 'Ausbildung 面试会问哪些问题？', a: '几乎所有面试都围绕同一核心：自我介绍、为什么选这家公司、为什么选德国、优缺点、学习和工作经历、团队合作、你的目标，以及签证、住宿、入职日期等实际安排。工具用范例回答覆盖了全部内容。' },
        { q: '面试用德语还是英语？', a: '几乎总是德语。雇主借面试考察你真实的口语水平——Ausbildung 通常要求 B1。用简单、正确的德语自信作答，胜过满是错误的复杂句子。' },
        { q: '如何回答“Erzählen Sie etwas über sich”？', a: '用大约一分钟的简单结构：姓名、年龄、来自哪里、学历、当前德语水平、为什么选择这个职业，以及一个能体现主动性的爱好。我们的范例回答提供了可直接改编的句子。' },
        { q: '面试准备工具免费吗？', a: '免费。三个完整问题及范例回答无需账户即可查看，注册免费账户可解锁全部 15 个，无需任何付费。' },
      ],
    },
  },
}

const locales = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh']

for (const loc of locales) {
  const file = join(root, 'messages', `${loc}.json`)
  const m = JSON.parse(readFileSync(file, 'utf8'))
  const c = SEO[loc]
  if (!c) throw new Error(`missing content for ${loc}`)

  m.learnGerman = m.learnGerman || {}
  m.learnGerman.seoSection = {
    title: c.learn.title,
    intro: c.learn.intro,
    faqTitle: c.learn.faqTitle,
    faqs: c.learn.faqs,
  }

  m.interviewPrep = m.interviewPrep || {}
  m.interviewPrep.seoSection = {
    title: c.prep.title,
    intro: c.prep.intro,
    faqTitle: c.prep.faqTitle,
    faqs: c.prep.faqs,
  }

  m.nav = m.nav || {}
  m.nav.interviewPrep = c.nav

  writeFileSync(file, JSON.stringify(m, null, 2) + '\n', 'utf8')
  console.log(`✓ ${loc}: learnGerman.seoSection + interviewPrep.seoSection + nav.interviewPrep`)
}
console.log('done')
