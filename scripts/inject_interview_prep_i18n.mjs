// Inject the `interviewPrep` namespace into all 4 locale message files.
// Idempotent: if the key already exists, it gets overwritten.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MESSAGES_DIR = path.join(__dirname, '..', 'messages')

// Per-question content: translation, why-asked, do/don't tips, by locale.
const QUESTIONS = {
  tell_about_yourself: {
    en: {
      translation: 'Tell me about yourself.',
      why: 'The opener. Recruiters use it to gauge your German fluency, your structure, and whether you can present yourself confidently in 60–90 seconds.',
      doSay: 'Stick to a 3-part structure: who you are (name, age, where from) → what you bring (Bac, German level, motivation) → why this Ausbildung. Stay under 90 seconds.',
      dontSay: 'Don\'t recite your whole CV. Don\'t talk about hobbies for more than one sentence. Don\'t mention salary, holidays, or family problems.',
    },
    fr: {
      translation: 'Parlez-moi de vous.',
      why: 'La question d\'ouverture. Le recruteur évalue votre allemand, votre structure et votre capacité à vous présenter en 60–90 secondes.',
      doSay: 'Structure en 3 parties : qui vous êtes (nom, âge, origine) → ce que vous apportez (Bac, niveau d\'allemand, motivation) → pourquoi cette Ausbildung. Moins de 90 secondes.',
      dontSay: 'Ne récitez pas tout votre CV. Ne parlez pas des loisirs plus d\'une phrase. Ne mentionnez ni salaire ni vacances ni problèmes familiaux.',
    },
    ar: {
      translation: 'حدّثني عن نفسك.',
      why: 'سؤال الافتتاح. يستعمله المُحاور لتقييم مستواك بالألمانية، طريقة تنظيم أفكارك، وقدرتك على تقديم نفسك بثقة في 60 إلى 90 ثانية.',
      doSay: 'اعتمد بنية ثلاثية: من أنت (الاسم، السن، البلد) ← ما تقدّمه (الباكالوريا، مستوى الألمانية، الدافع) ← لماذا هذا التكوين. لا تتجاوز 90 ثانية.',
      dontSay: 'لا تتلُ سيرتك الذاتية كلها. لا تتحدث عن الهوايات أكثر من جملة. لا تذكر الأجر ولا العطل ولا المشاكل العائلية.',
    },
    de: {
      translation: 'Erzählen Sie etwas über sich.',
      why: 'Die Eröffnungsfrage. Der Personaler prüft dein Deutschniveau, deine Struktur und ob du dich in 60–90 Sekunden souverän vorstellen kannst.',
      doSay: 'Dreiteilige Struktur: wer du bist (Name, Alter, Herkunft) → was du mitbringst (Abi, Deutschniveau, Motivation) → warum diese Ausbildung. Unter 90 Sekunden bleiben.',
      dontSay: 'Nicht den ganzen Lebenslauf vorlesen. Hobbys höchstens in einem Satz. Kein Wort über Gehalt, Urlaub oder Familienprobleme.',
    },
  },
  why_us: {
    en: {
      translation: 'Why did you apply to us?',
      why: 'Tests whether you researched the company. The wrong answer ("you have a good reputation") signals a copy-paste application.',
      doSay: 'Cite 2 specific things from their website / press / LinkedIn — a product line, training program, location, recent project. Connect them to your goals.',
      dontSay: 'Don\'t say "I just need any Ausbildung". Don\'t bash competitors. Don\'t pretend you know things you don\'t — research before the call.',
    },
    fr: {
      translation: 'Pourquoi avez-vous postulé chez nous ?',
      why: 'Évalue si vous avez fait des recherches sur l\'entreprise. La mauvaise réponse ("vous avez une bonne réputation") trahit une candidature copiée-collée.',
      doSay: 'Citez 2 éléments précis trouvés sur leur site / presse / LinkedIn — un produit, un programme de formation, un projet récent. Reliez-les à vos objectifs.',
      dontSay: 'Ne dites pas "j\'ai besoin de n\'importe quelle Ausbildung". Ne dénigrez pas les concurrents. N\'inventez pas — préparez vos recherches avant l\'entretien.',
    },
    ar: {
      translation: 'لماذا تقدّمت إلى شركتنا؟',
      why: 'يقيس مدى بحثك عن الشركة. الجواب الخاطئ ("لكم سمعة جيدة") يكشف أن طلبك نسخ ولصق.',
      doSay: 'اذكر شيئين محدّدين من موقعهم أو الصحافة أو لينكدإن — منتج، برنامج تكوين، موقع، مشروع حديث — واربطهما بأهدافك.',
      dontSay: 'لا تقل "أحتاج فقط إلى أي تكوين". لا تنتقد المنافسين. لا تختلق المعلومات — حضّر البحث قبل المقابلة.',
    },
    de: {
      translation: 'Warum haben Sie sich bei uns beworben?',
      why: 'Testet, ob du das Unternehmen recherchiert hast. Die falsche Antwort ("Sie haben einen guten Ruf") zeigt eine Copy-Paste-Bewerbung.',
      doSay: 'Nenne 2 konkrete Punkte von Website / Presse / LinkedIn — Produktlinie, Schulungsprogramm, Standort, aktuelles Projekt. Verknüpfe sie mit deinen Zielen.',
      dontSay: 'Sag nicht "ich brauche irgendeine Ausbildung". Konkurrenz nicht schlechtreden. Nichts behaupten, was du nicht weißt — vorher recherchieren.',
    },
  },
  why_germany: {
    en: {
      translation: 'Why do you want to come to Germany?',
      why: 'Tests whether your motivation is real and project-based — or whether Germany is just an "exit" from Morocco. Recruiters reject candidates who sound like they\'ll leave once they have the visa.',
      doSay: 'Give 3 reasons: dual training system, sector demand & job stability, the work culture (precision, punctuality). Frame it as a career project, not an escape.',
      dontSay: 'Don\'t mention money, weather, or "Europe is better". Don\'t criticise Morocco. Don\'t make it sound like a temporary plan.',
    },
    fr: {
      translation: 'Pourquoi voulez-vous venir en Allemagne ?',
      why: 'Évalue si votre motivation est réelle et structurée — ou si l\'Allemagne n\'est qu\'une "sortie" du Maroc. Les recruteurs rejettent les candidats qui semblent prêts à repartir dès le visa obtenu.',
      doSay: 'Donnez 3 raisons : système dual, demande sectorielle et stabilité de l\'emploi, culture de travail (précision, ponctualité). Présentez-le comme un projet de carrière.',
      dontSay: 'Ne parlez ni d\'argent, ni de climat, ni du fait que "l\'Europe c\'est mieux". Ne critiquez pas le Maroc. Ne donnez pas l\'impression d\'un plan temporaire.',
    },
    ar: {
      translation: 'لماذا تريد القدوم إلى ألمانيا؟',
      why: 'يقيس ما إذا كان دافعك حقيقياً ومهنياً، أم أن ألمانيا مجرد "مخرج" من المغرب. المُحاوِرون يرفضون من يبدو أنه سيغادر بمجرد حصوله على التأشيرة.',
      doSay: 'قدّم ثلاثة أسباب: نظام التكوين المزدوج، الطلب على القطاع واستقرار العمل، ثقافة العمل (الدقة، الانضباط). اعرضه كمشروع مهني لا كهروب.',
      dontSay: 'لا تذكر المال ولا الطقس ولا أن "أوروبا أحسن". لا تنتقد المغرب. لا تجعله يبدو وكأنه خطة مؤقتة.',
    },
    de: {
      translation: 'Warum möchten Sie nach Deutschland kommen?',
      why: 'Testet, ob deine Motivation echt und strukturiert ist — oder Deutschland nur ein Ausweg aus Marokko. Personaler lehnen Kandidaten ab, die klingen, als gingen sie nach dem Visum wieder.',
      doSay: 'Drei Gründe: duales System, Branchenbedarf und Jobstabilität, Arbeitskultur (Genauigkeit, Pünktlichkeit). Als berufliches Projekt formulieren, nicht als Flucht.',
      dontSay: 'Kein Wort zu Geld, Wetter oder "Europa ist besser". Marokko nicht schlechtreden. Nicht wie ein vorübergehender Plan klingen.',
    },
  },
  strengths_weaknesses: {
    en: {
      translation: 'What are your strengths and weaknesses?',
      why: 'Classic trap. Strengths must be relevant, weaknesses must be real but improvable — fake humility ("I work too hard") gets seen instantly.',
      doSay: 'Pick 1–2 strengths tied to the job (reliability, learning speed, languages). For weakness: pick a real one, then explain how you actively manage it.',
      dontSay: 'Don\'t say you have no weaknesses. Don\'t claim "perfectionism" — it\'s the most overused fake answer. Don\'t reveal a deal-breaker (e.g. bad with deadlines).',
    },
    fr: {
      translation: 'Quels sont vos points forts et vos points faibles ?',
      why: 'Piège classique. Les forces doivent être pertinentes, les faiblesses réelles mais corrigeables — la fausse modestie ("je travaille trop") se repère immédiatement.',
      doSay: 'Choisissez 1–2 forces liées au poste (fiabilité, vitesse d\'apprentissage, langues). Pour la faiblesse : une vraie, puis expliquez comment vous la gérez activement.',
      dontSay: 'Ne dites pas que vous n\'avez aucun défaut. Évitez "le perfectionnisme" — la fausse réponse la plus usée. Ne révélez pas un défaut rédhibitoire (mauvais avec les deadlines).',
    },
    ar: {
      translation: 'ما هي نقاط قوتك ونقاط ضعفك؟',
      why: 'فخ كلاسيكي. نقاط القوة يجب أن تكون مرتبطة بالمنصب، ونقاط الضعف حقيقية لكن قابلة للتطوير — التواضع المزيف ("أعمل أكثر من اللازم") يُكشف فوراً.',
      doSay: 'اختر نقطة أو اثنتين مرتبطتين بالعمل (الموثوقية، سرعة التعلم، اللغات). أمّا الضعف: اذكر نقطة حقيقية ثم اشرح كيف تتعامل معها.',
      dontSay: 'لا تقل إنه ليس لديك أي ضعف. تجنّب كلمة "الكمالية" — أكثر إجابة مكرّرة وزائفة. لا تكشف عيباً قاتلاً (سوء احترام المواعيد).',
    },
    de: {
      translation: 'Wo sehen Sie Ihre Stärken und Schwächen?',
      why: 'Klassische Falle. Stärken müssen passen, Schwächen echt aber lösbar — falsche Bescheidenheit ("ich arbeite zu viel") wird sofort durchschaut.',
      doSay: 'Wähle 1–2 Stärken mit Job-Bezug (Zuverlässigkeit, Lerngeschwindigkeit, Sprachen). Bei der Schwäche: eine echte nennen und erklären, wie du sie aktiv steuerst.',
      dontSay: 'Sag nicht, du hättest keine Schwäche. "Perfektionismus" ist die abgegriffenste Floskel. Keinen Deal-Breaker preisgeben (z. B. schlecht mit Deadlines).',
    },
  },
  mistake: {
    en: {
      translation: 'Tell me about a mistake you made.',
      why: 'Tests honesty, self-awareness, and ability to learn. The wrong answer ("I never make mistakes") is an instant disqualifier.',
      doSay: 'Pick a real, low-stakes mistake. Use the structure: what happened → what I did to fix it → what I learned and now do differently.',
      dontSay: 'Don\'t say you\'ve never made a mistake. Don\'t blame others. Don\'t pick something catastrophic (lost a major client) or something trivial (forgot to refill the printer).',
    },
    fr: {
      translation: 'Parlez-moi d\'une erreur que vous avez faite.',
      why: 'Évalue l\'honnêteté, la conscience de soi et la capacité d\'apprendre. La mauvaise réponse ("je ne fais jamais d\'erreurs") est éliminatoire.',
      doSay: 'Choisissez une erreur réelle, à enjeu modéré. Structure : ce qui s\'est passé → ce que j\'ai fait pour réparer → ce que j\'ai appris et que je fais désormais autrement.',
      dontSay: 'Ne dites jamais que vous ne faites pas d\'erreurs. Ne blâmez pas les autres. N\'en choisissez ni une catastrophique ni une triviale.',
    },
    ar: {
      translation: 'حدّثني عن خطأ ارتكبته.',
      why: 'يقيس الصدق، الوعي الذاتي، والقدرة على التعلم. الجواب الخاطئ ("لا أرتكب أخطاء أبداً") يُقصي المرشح فوراً.',
      doSay: 'اختر خطأً حقيقياً متوسط الأهمية. ابنِ الإجابة: ما حدث ← كيف صحّحته ← ماذا تعلّمت وماذا أصبحتُ أفعل بشكل مختلف.',
      dontSay: 'لا تدّعِ أنك لا تخطئ. لا تُلقِ اللوم على الآخرين. لا تختر خطأ كارثياً ولا خطأ تافهاً.',
    },
    de: {
      translation: 'Erzählen Sie mir über einen Fehler, den Sie gemacht haben.',
      why: 'Testet Ehrlichkeit, Selbstreflexion und Lernfähigkeit. Die falsche Antwort ("ich mache keine Fehler") ist ein Sofort-K.O.',
      doSay: 'Echten Fehler mit mittlerem Einsatz. Struktur: was passiert ist → wie ich es behoben habe → was ich gelernt habe und jetzt anders mache.',
      dontSay: 'Nie sagen, du machst keine Fehler. Andere nicht beschuldigen. Weder einen katastrophalen noch einen banalen Fehler wählen.',
    },
  },
  what_sets_you_apart: {
    en: {
      translation: 'What sets you apart from other applicants?',
      why: 'Your sales pitch. Other Moroccan candidates have similar profiles — what\'s your edge?',
      doSay: 'Pick 3 concrete differentiators: languages (AR/FR/DE), independence (organised your own migration), conscious career choice. Be specific, not generic.',
      dontSay: 'Don\'t say "I\'m motivated and hard-working" — every candidate says that. Don\'t criticise other candidates. Don\'t list 10 qualities — pick 3.',
    },
    fr: {
      translation: 'Qu\'est-ce qui vous différencie des autres candidats ?',
      why: 'Votre argumentaire commercial. D\'autres candidats marocains ont un profil similaire — quel est votre avantage ?',
      doSay: 'Trois éléments concrets : langues (AR/FR/DE), autonomie (avoir organisé votre migration), choix de carrière conscient. Soyez précis, pas générique.',
      dontSay: 'Pas de "je suis motivé et travailleur" — tout le monde le dit. Ne critiquez pas les autres candidats. N\'énumérez pas 10 qualités — choisissez 3.',
    },
    ar: {
      translation: 'ما الذي يميّزك عن باقي المترشحين؟',
      why: 'هذه فرصتك للترويج لنفسك. هناك مغاربة آخرون بمواصفات مشابهة — ما الفرق الذي تقدّمه أنت؟',
      doSay: 'ثلاث نقاط ملموسة: اللغات (العربية، الفرنسية، الألمانية)، الاستقلالية (نظّمت هجرتك بنفسك)، اختيار مهني واعٍ. كن محدّداً لا عاماً.',
      dontSay: 'لا تقل "أنا متحمس ومجتهد" — الكل يقولها. لا تنتقد المترشحين الآخرين. لا تعدّد عشر صفات — ثلاث تكفي.',
    },
    de: {
      translation: 'Was unterscheidet Sie von anderen Bewerbern?',
      why: 'Dein Verkaufsargument. Andere marokkanische Bewerber haben ähnliche Profile — was ist dein Vorteil?',
      doSay: 'Drei konkrete Unterscheidungsmerkmale: Sprachen (AR/FR/DE), Eigenständigkeit (eigene Migration organisiert), bewusste Berufswahl. Konkret, nicht allgemein.',
      dontSay: 'Nicht "ich bin motiviert und fleißig" — sagt jeder. Keine anderen Bewerber kritisieren. Keine 10 Eigenschaften — drei reichen.',
    },
  },
  stress: {
    en: {
      translation: 'How do you handle stress?',
      why: 'Tests your work style under pressure. They want to know whether you\'ll cope when an Ausbildung deadline collides with the Berufsschule exam.',
      doSay: 'Describe a method: prioritise → tackle one task at a time → communicate early if a deadline slips. Frame stress as a signal, not a problem.',
      dontSay: 'Don\'t say "I don\'t get stressed" — unrealistic. Don\'t describe panicking, working all night, or skipping breaks. Don\'t blame the workload.',
    },
    fr: {
      translation: 'Comment gérez-vous le stress ?',
      why: 'Évalue votre méthode de travail sous pression. On veut savoir si vous tiendrez quand une échéance d\'Ausbildung croisera l\'examen de Berufsschule.',
      doSay: 'Décrivez une méthode : prioriser → traiter une tâche à la fois → communiquer tôt en cas de glissement. Présentez le stress comme un signal, pas un problème.',
      dontSay: 'Ne dites pas "je ne stresse jamais" — irréaliste. Pas de panique, de nuits blanches ni de pauses sautées. Ne blâmez pas la charge de travail.',
    },
    ar: {
      translation: 'كيف تتعامل مع الضغط؟',
      why: 'يقيس أسلوب عملك تحت الضغط. يريدون معرفة هل ستصمد عندما يتقاطع موعد نهائي في التكوين مع امتحان المدرسة المهنية.',
      doSay: 'صف منهجاً: أولوية ← مهمّة واحدة في كل مرة ← التواصل المبكر عند الانزلاق. اعتبر الضغط إشارة لا مشكلة.',
      dontSay: 'لا تقل "لا أتوتر أبداً" — غير واقعي. لا تصف الذعر ولا السهر ولا تفويت الاستراحات. لا تُلقِ اللوم على الشغل.',
    },
    de: {
      translation: 'Wie gehen Sie mit Stress um?',
      why: 'Testet deinen Arbeitsstil unter Druck. Man will wissen, ob du klarkommst, wenn die Ausbildungs-Deadline mit der Berufsschulprüfung kollidiert.',
      doSay: 'Methode beschreiben: priorisieren → eine Aufgabe nach der anderen → früh kommunizieren, wenn etwas rutscht. Stress als Signal, nicht Problem.',
      dontSay: 'Nicht "ich werde nie gestresst" — unrealistisch. Keine Panik, keine Nachtschichten, keine ausgelassenen Pausen. Nicht die Arbeitslast beschuldigen.',
    },
  },
  criticism: {
    en: {
      translation: 'How do you react to criticism?',
      why: 'Tests teachability — the single most important quality in an Auszubildender. They want a learner, not someone who argues.',
      doSay: 'Describe a process: listen → ask clarifying questions → identify concrete next actions. Show that you separate the message from the messenger.',
      dontSay: 'Don\'t say "criticism doesn\'t affect me" — sounds defensive. Don\'t describe arguing back. Don\'t complain about a previous boss.',
    },
    fr: {
      translation: 'Comment réagissez-vous à la critique ?',
      why: 'Évalue votre capacité à apprendre — la qualité la plus importante chez un Auszubildender. On cherche un apprenant, pas quelqu\'un qui argumente.',
      doSay: 'Décrivez un processus : écouter → poser des questions de clarification → identifier des actions concrètes. Séparez le message du messager.',
      dontSay: 'Pas de "la critique ne me touche pas" — défensif. Ne décrivez pas une dispute. Ne vous plaignez pas d\'un ancien chef.',
    },
    ar: {
      translation: 'كيف تتفاعل مع النقد؟',
      why: 'يقيس قابليتك للتعلّم — أهم صفة في المتدرب. يبحثون عن شخص يتعلم لا عن شخص يجادل.',
      doSay: 'صف عملية: الاستماع ← أسئلة توضيحية ← خطوات ملموسة. أظهر أنك تفصل الرسالة عن صاحبها.',
      dontSay: 'لا تقل "النقد لا يؤثر فيّ" — يبدو دفاعياً. لا تصف الجدال. لا تشتكِ من رئيس سابق.',
    },
    de: {
      translation: 'Wie reagieren Sie auf Kritik?',
      why: 'Testet Lernfähigkeit — die wichtigste Eigenschaft eines Azubis. Man sucht jemanden, der lernt, nicht jemanden, der diskutiert.',
      doSay: 'Prozess beschreiben: zuhören → Verständnisfragen → konkrete nächste Schritte. Zeig, dass du Botschaft und Person trennst.',
      dontSay: 'Nicht "Kritik berührt mich nicht" — wirkt defensiv. Keine Streitgespräche schildern. Nicht über frühere Chefs jammern.',
    },
  },
  team_or_alone: {
    en: {
      translation: 'Do you prefer working alone or in a team?',
      why: 'Tests fit. Most Ausbildung roles are team-heavy, but Berufsschule and exam prep are solo. They want someone who can do both.',
      doSay: 'Say "both, depending on the task". Give one example each: team for collaborative learning, solo for focused execution. Show self-awareness.',
      dontSay: 'Don\'t pick only one. Don\'t say "I\'m a lone wolf". Don\'t say "I love working in teams" without explaining when solo work matters too.',
    },
    fr: {
      translation: 'Préférez-vous travailler seul ou en équipe ?',
      why: 'Évalue l\'adéquation. La plupart des Ausbildungen sont très collectives, mais l\'école professionnelle et la préparation des examens sont solo. On cherche quelqu\'un capable des deux.',
      doSay: 'Répondez "les deux, selon la tâche". Un exemple pour chaque : équipe pour apprendre ensemble, seul pour une exécution concentrée. Montrez du recul.',
      dontSay: 'Ne choisissez pas un seul. Ne dites pas "je suis un loup solitaire". Ne dites pas "j\'adore le travail en équipe" sans préciser quand le solo compte aussi.',
    },
    ar: {
      translation: 'هل تفضّل العمل بمفردك أم ضمن فريق؟',
      why: 'يقيس الملاءمة. أغلب التكوينات جماعية، لكن المدرسة المهنية والامتحانات تتطلب العمل الفردي. يبحثون عن شخص يتقن الاثنين.',
      doSay: 'أجب "الاثنان حسب المهمة". مثال للفريق: التعلّم المشترك. مثال للفردي: التركيز على إنجاز محدد. أظهر وعياً ذاتياً.',
      dontSay: 'لا تختر واحداً فقط. لا تقل "أنا ذئب وحيد". لا تقل "أحب العمل الجماعي" دون توضيح متى يكون الفردي مهماً.',
    },
    de: {
      translation: 'Arbeiten Sie lieber allein oder im Team?',
      why: 'Testet Passung. Ausbildungen sind meist teamlastig, aber Berufsschule und Prüfungsvorbereitung sind solo. Beides muss klappen.',
      doSay: 'Antwort: "beides, je nach Aufgabe". Je ein Beispiel: Team fürs Lernen, allein für konzentrierte Umsetzung. Selbstkenntnis zeigen.',
      dontSay: 'Nicht nur eines wählen. Kein "Einzelkämpfer". Nicht nur "ich liebe Teamarbeit" ohne zu erklären, wann Alleinarbeit auch zählt.',
    },
  },
  overtime: {
    en: {
      translation: 'Would you be willing to work weekends or more than 40 hours?',
      why: 'A loyalty test, but also a legal trap. German Ausbildung law caps your hours — saying "yes always" sounds naive, "no never" sounds lazy.',
      doSay: 'Yes when there\'s a peak load or the team needs it. But also note: chronic overtime usually signals an organisation problem worth fixing together.',
      dontSay: 'Don\'t say "absolutely whenever". Don\'t cite legal limits aggressively (the §17 BBiG). Don\'t complain about pay.',
    },
    fr: {
      translation: 'Accepteriez-vous de travailler les week-ends ou plus de 40 heures ?',
      why: 'Test de loyauté, mais aussi piège juridique. La loi allemande sur l\'Ausbildung plafonne les heures — "oui toujours" est naïf, "non jamais" paresseux.',
      doSay: 'Oui en pic d\'activité ou si l\'équipe en a besoin. Précisez : des heures supplémentaires chroniques signalent un problème d\'organisation à corriger ensemble.',
      dontSay: 'Pas de "absolument quand vous voulez". Ne citez pas agressivement les limites légales. Ne vous plaignez pas du salaire.',
    },
    ar: {
      translation: 'هل تقبل العمل في عطل نهاية الأسبوع أو أكثر من 40 ساعة؟',
      why: 'اختبار للولاء وفخ قانوني في آن واحد. القانون الألماني يحدد ساعات المتدرب — "نعم دائماً" يبدو ساذجاً، و"لا أبداً" كسولاً.',
      doSay: 'نعم في فترات الذروة أو حين يحتاج الفريق ذلك. أضف: الساعات الإضافية المزمنة تكشف غالباً مشكلة تنظيم تستحق الحل جماعياً.',
      dontSay: 'لا تقل "نعم في أي وقت". لا تستشهد بحدّة بالحدود القانونية. لا تشتكِ من الأجر.',
    },
    de: {
      translation: 'Wären Sie bereit, an Wochenenden oder mehr als 40 Stunden zu arbeiten?',
      why: 'Loyalitätstest und juristische Falle zugleich. Das BBiG begrenzt deine Stunden — "ja immer" wirkt naiv, "nie" faul.',
      doSay: 'Ja in Spitzenzeiten oder wenn das Team es braucht. Hinweis: dauerhafte Überstunden sind meist ein Organisationsproblem, das gemeinsam gelöst gehört.',
      dontSay: 'Nicht "absolut, jederzeit". Gesetzesgrenzen nicht aggressiv zitieren. Nicht über Bezahlung klagen.',
    },
  },
  five_years: {
    en: {
      translation: 'Where do you see yourself in five years?',
      why: 'Tests planning ability and loyalty. They want to know if you\'ll stay after the Ausbildung — replacing an Azubi is expensive.',
      doSay: 'Finished Ausbildung, 1–2 years of practice ideally with them, specialised in [concrete area], possibly Meister/Techniker/Fachwirt. Anchor your future at the company.',
      dontSay: 'Don\'t mention going back to Morocco. Don\'t mention switching companies. Don\'t say "I don\'t know" or "self-employed" — both signal flight risk.',
    },
    fr: {
      translation: 'Où vous voyez-vous dans cinq ans ?',
      why: 'Évalue capacité à planifier et fidélité. On veut savoir si vous resterez après l\'Ausbildung — remplacer un Azubi coûte cher.',
      doSay: 'Ausbildung terminée, 1–2 ans de pratique idéalement chez eux, spécialisation dans [domaine concret], éventuellement Meister/Techniker/Fachwirt. Ancrez votre avenir dans l\'entreprise.',
      dontSay: 'Pas de retour au Maroc. Pas de changement d\'entreprise. Pas de "je ne sais pas" ni "à mon compte" — les deux signalent un risque de fuite.',
    },
    ar: {
      translation: 'أين ترى نفسك بعد خمس سنوات؟',
      why: 'يقيس القدرة على التخطيط والوفاء للشركة. يريدون معرفة إن كنت ستبقى بعد التكوين — استبدال متدرب مكلف.',
      doSay: 'إتمام التكوين، سنة أو سنتان من الممارسة لديكم إن أمكن، تخصص في [مجال محدد]، وربما شهادة Meister أو Techniker أو Fachwirt. اربط مستقبلك بالشركة.',
      dontSay: 'لا تذكر العودة إلى المغرب. لا تذكر تغيير الشركة. لا تقل "لا أدري" ولا "العمل الحر" — الاثنان يوحيان بأنك ستغادر.',
    },
    de: {
      translation: 'Wo sehen Sie sich in fünf Jahren?',
      why: 'Testet Planungsfähigkeit und Loyalität. Man will wissen, ob du nach der Ausbildung bleibst — Azubi-Wechsel ist teuer.',
      doSay: 'Ausbildung abgeschlossen, 1–2 Jahre Praxis idealerweise bei ihnen, Spezialisierung in [konkretem Bereich], evtl. Meister/Techniker/Fachwirt. Zukunft im Unternehmen verankern.',
      dontSay: 'Keine Rückkehr nach Marokko. Kein Firmenwechsel. Kein "weiß nicht" und keine "Selbstständigkeit" — beides wirkt wie Fluchtrisiko.',
    },
  },
  why_this_field: {
    en: {
      translation: 'Why did you choose this field?',
      why: 'Tests authenticity. Random Ausbildung choices ("it was available") get rejected — they want a story showing you understand the profession.',
      doSay: 'Three layers: a personal story or experience → research you did (LinkedIn, YouTube, blogs) → the sector\'s future stability. Show genuine interest.',
      dontSay: 'Don\'t say "for the visa". Don\'t say "I had no other choice". Don\'t list random reasons — tell a coherent story.',
    },
    fr: {
      translation: 'Pourquoi avez-vous choisi cette branche ?',
      why: 'Évalue l\'authenticité. Les choix d\'Ausbildung au hasard ("c\'était disponible") sont rejetés — on attend une histoire qui prouve que vous comprenez le métier.',
      doSay: 'Trois couches : une expérience personnelle → des recherches (LinkedIn, YouTube, blogs) → la stabilité future du secteur. Montrez un vrai intérêt.',
      dontSay: 'Ne dites pas "pour le visa". Pas de "je n\'avais pas le choix". N\'énumérez pas des raisons décousues — racontez une histoire cohérente.',
    },
    ar: {
      translation: 'لماذا اخترت هذا القطاع؟',
      why: 'يقيس الأصالة. الاختيارات العشوائية ("كان متاحاً") تُرفض — يريدون قصة تثبت أنك تفهم المهنة.',
      doSay: 'ثلاث طبقات: تجربة شخصية ← بحث قمت به (لينكدإن، يوتيوب، مدوّنات) ← الاستقرار المستقبلي للقطاع. أظهر اهتماماً حقيقياً.',
      dontSay: 'لا تقل "من أجل التأشيرة". لا تقل "لم يكن لي خيار". لا تعدّد أسباباً متفرقة — احكِ قصة متماسكة.',
    },
    de: {
      translation: 'Warum haben Sie sich für diese Branche entschieden?',
      why: 'Testet Authentizität. Zufällige Ausbildungs-Wahlen ("war frei") werden abgelehnt — man will eine Geschichte, die zeigt, dass du den Beruf verstehst.',
      doSay: 'Drei Ebenen: persönliche Erfahrung → eigene Recherche (LinkedIn, YouTube, Blogs) → Zukunft der Branche. Echtes Interesse zeigen.',
      dontSay: 'Nicht "wegen des Visums". Nicht "ich hatte keine Wahl". Keine zufällige Liste — kohärente Geschichte erzählen.',
    },
  },
  salary: {
    en: {
      translation: 'What are your salary expectations?',
      why: 'A trap — naming a number too high gets you rejected, too low signals lack of self-worth. For Ausbildung, the answer is mostly fixed by tariff.',
      doSay: 'For Ausbildung: accept the tariff salary. State that you\'ve seen typical year-1 ranges (€800–1200 brutto depending on sector) and prioritise quality of training.',
      dontSay: 'Don\'t name a high number. Don\'t pretend money doesn\'t matter. Don\'t ask about salary in the first 30 minutes of the interview.',
    },
    fr: {
      translation: 'Quelles sont vos prétentions salariales ?',
      why: 'Un piège — un chiffre trop haut vous écarte, trop bas signale un manque d\'estime de soi. Pour l\'Ausbildung, c\'est surtout fixé par tarif.',
      doSay: 'Pour l\'Ausbildung : acceptez le salaire conventionnel. Mentionnez les fourchettes typiques 1re année (800–1200 € bruts selon secteur) et priorisez la qualité de la formation.',
      dontSay: 'Pas de chiffre élevé. Ne prétendez pas que l\'argent ne compte pas. N\'évoquez pas le salaire dans les 30 premières minutes.',
    },
    ar: {
      translation: 'ما هو الأجر الذي تتوقّعه؟',
      why: 'فخ — رقم مرتفع يقصيك، ومنخفض يدل على ضعف تقديرك لذاتك. في حالة التكوين، الأجر محدد غالباً بالاتفاقية الجماعية.',
      doSay: 'بالنسبة للتكوين: اقبل الأجر التعاقدي. أشر إلى أن السنة الأولى عادة بين 800 و1200 يورو إجمالياً حسب القطاع، وأن جودة التكوين أولويتك.',
      dontSay: 'لا تذكر رقماً مرتفعاً. لا تتظاهر بأن المال لا يهمك. لا تسأل عن الأجر في أول 30 دقيقة من المقابلة.',
    },
    de: {
      translation: 'Was ist Ihre Gehaltsvorstellung?',
      why: 'Eine Falle — zu hohe Zahl disqualifiziert, zu niedrige zeigt mangelndes Selbstwertgefühl. Bei der Ausbildung ist es meist tariflich geregelt.',
      doSay: 'Bei der Ausbildung: tarifliche Vergütung akzeptieren. Spannen im 1. Jahr nennen (800–1200 € brutto je Branche) und Qualität der Ausbildung priorisieren.',
      dontSay: 'Keine hohe Zahl nennen. Nicht so tun, als wäre Geld egal. Gehalt nicht in den ersten 30 Minuten ansprechen.',
    },
  },
  relocate: {
    en: {
      translation: 'Are you willing to relocate?',
      why: 'Easy question, but tests practical readiness. They want to hear that you\'ve already thought through housing, transport, and cost of living.',
      doSay: 'Yes — relocation is part of the plan. Mention you\'ve already researched the city (neighbourhoods, transport, costs). Show flexibility.',
      dontSay: 'Don\'t say "only if I can stay near my family". Don\'t hesitate. Don\'t ask whether the company helps with housing in the same answer.',
    },
    fr: {
      translation: 'Êtes-vous prêt à déménager ?',
      why: 'Question simple, mais teste la préparation pratique. On veut entendre que vous avez déjà pensé au logement, aux transports et au coût de la vie.',
      doSay: 'Oui — le déménagement fait partie du plan. Mentionnez que vous avez déjà cherché la ville (quartiers, transports, coûts). Montrez de la flexibilité.',
      dontSay: 'Pas de "seulement si je reste près de ma famille". N\'hésitez pas. Ne demandez pas dans la même réponse si l\'entreprise aide pour le logement.',
    },
    ar: {
      translation: 'هل أنت مستعد للانتقال للسكن؟',
      why: 'سؤال سهل، لكنه يقيس الاستعداد العملي. يريدون أن تكون قد فكّرت في السكن والنقل وتكاليف المعيشة.',
      doSay: 'نعم — الانتقال جزء من خطّتي. أشر إلى أنك بحثت في المدينة (الأحياء، النقل، التكاليف). أظهر مرونة.',
      dontSay: 'لا تقل "فقط إن بقيت قرب عائلتي". لا تتردّد. لا تسأل في نفس الجواب هل تساعد الشركة في السكن.',
    },
    de: {
      translation: 'Sind Sie umzugsbereit?',
      why: 'Einfache Frage, prüft aber praktische Vorbereitung. Man will hören, dass du Wohnung, Verkehr und Lebenshaltungskosten schon durchdacht hast.',
      doSay: 'Ja — Umzug ist Teil des Plans. Erwähne, dass du die Stadt schon recherchiert hast (Viertel, ÖPNV, Kosten). Flexibilität zeigen.',
      dontSay: 'Nicht "nur in der Nähe meiner Familie". Nicht zögern. Nicht in derselben Antwort nach Wohnungshilfe fragen.',
    },
  },
  questions_for_us: {
    en: {
      translation: 'Do you have any questions for us?',
      why: 'The most underestimated question. "No, none" signals lack of preparation and interest. Use this to demonstrate research and fit.',
      doSay: 'Have 3 questions ready: about a typical first month, the qualities of successful past Auszubildende, the post-Ausbildung retention rate. Show you\'re thinking long-term.',
      dontSay: 'Don\'t say "no questions". Don\'t ask only about salary, holidays, or perks. Don\'t ask things you could find on the website.',
    },
    fr: {
      translation: 'Avez-vous des questions à nous poser ?',
      why: 'La question la plus sous-estimée. "Non, aucune" signale un manque de préparation. Utilisez-la pour démontrer recherche et adéquation.',
      doSay: 'Préparez 3 questions : un premier mois type, les qualités des Auszubildende qui ont réussi chez eux, le taux d\'embauche post-Ausbildung. Vision long-terme.',
      dontSay: 'Pas de "non, aucune". Pas uniquement salaire, congés, avantages. Pas de questions dont la réponse est sur leur site.',
    },
    ar: {
      translation: 'هل لديك أي أسئلة تودّ طرحها علينا؟',
      why: 'السؤال الأكثر استهانة به. "لا، ليس لدي" يدل على غياب التحضير. استغلّه لإظهار البحث والملاءمة.',
      doSay: 'حضّر ثلاثة أسئلة: شكل الشهر الأول، صفات المتدرّبين الناجحين عندهم، نسبة التوظيف بعد التكوين. أظهر تفكيراً بعيد المدى.',
      dontSay: 'لا تقل "لا أسئلة". لا تكتفِ بسؤال الأجر والعطل والامتيازات. لا تطرح أسئلة جوابها موجود على موقعهم.',
    },
    de: {
      translation: 'Haben Sie noch Fragen an uns?',
      why: 'Die unterschätzteste Frage. "Nein, keine" wirkt unvorbereitet. Nutze sie, um Recherche und Passung zu zeigen.',
      doSay: 'Drei Fragen parat: typischer erster Monat, Eigenschaften erfolgreicher Azubis bei ihnen, Übernahmequote. Langfristig denken.',
      dontSay: 'Nicht "keine Fragen". Nicht nur Gehalt, Urlaub, Benefits. Keine Fragen, die auf der Website stehen.',
    },
  },
}

// UI strings
const UI = {
  en: {
    eyebrow: 'Interview prep',
    title: 'Master your German Ausbildung interview',
    subtitle: '15 of the most-asked questions, with sample answers in German plus the "why this is asked" and what to say (and avoid).',
    badgeQuestions: '{n} questions',
    badgeAnswers: 'Sample answers in German',
    badgeGerman: 'B1–B2 level',
    badgeFreePreview: '{n} free, rest after login',
    allFilter: 'All',
    showWhy: 'Why is this asked?',
    hideWhy: 'Hide explanation',
    revealAnswer: 'Click to reveal the answer',
    hideAnswer: 'Hide',
    sampleAnswerLabel: 'Sample answer',
    doSayLabel: 'Do say',
    dontSayLabel: "Don't say",
    lockedTitle: 'Log in to unlock the rest',
    lockedBody: 'The first 3 questions are free. Create a free account to access all 15 questions, sample answers, and tips.',
    lockedCta: 'Log in / Sign up',
    ctaTitle: 'Want a personal mock interview?',
    ctaSub: 'Book a 30-minute consultation. We run a real Vorstellungsgespräch in German, score you, and give you concrete fixes — €16.',
    category: {
      intro: 'Intro',
      motivation: 'Motivation',
      strengths: 'Strengths',
      experience: 'Experience',
      workplace: 'Workplace',
      goals: 'Goals',
      logistics: 'Logistics',
      closing: 'Closing',
    },
    difficulty: { 1: 'Easy', 2: 'Medium', 3: 'Tricky' },
  },
  fr: {
    eyebrow: 'Préparation entretien',
    title: 'Maîtrisez votre entretien d\'Ausbildung en Allemagne',
    subtitle: '15 questions les plus posées, avec des réponses-types en allemand, le "pourquoi de la question", et ce qu\'il faut dire (et éviter).',
    badgeQuestions: '{n} questions',
    badgeAnswers: 'Réponses-types en allemand',
    badgeGerman: 'Niveau B1–B2',
    badgeFreePreview: '{n} gratuites, reste après connexion',
    allFilter: 'Toutes',
    showWhy: 'Pourquoi cette question ?',
    hideWhy: 'Masquer l\'explication',
    revealAnswer: 'Cliquez pour révéler la réponse',
    hideAnswer: 'Masquer',
    sampleAnswerLabel: 'Réponse-type',
    doSayLabel: 'À dire',
    dontSayLabel: 'À éviter',
    lockedTitle: 'Connectez-vous pour débloquer la suite',
    lockedBody: 'Les 3 premières questions sont gratuites. Créez un compte gratuit pour accéder aux 15 questions, réponses et conseils.',
    lockedCta: 'Se connecter / S\'inscrire',
    ctaTitle: 'Vous voulez un entretien blanc personnalisé ?',
    ctaSub: 'Réservez une consultation de 30 minutes. On simule un vrai Vorstellungsgespräch en allemand, on vous note et on vous donne des correctifs concrets — 16 €.',
    category: {
      intro: 'Présentation',
      motivation: 'Motivation',
      strengths: 'Points forts',
      experience: 'Expérience',
      workplace: 'Travail',
      goals: 'Objectifs',
      logistics: 'Logistique',
      closing: 'Conclusion',
    },
    difficulty: { 1: 'Facile', 2: 'Moyenne', 3: 'Délicate' },
  },
  ar: {
    eyebrow: 'تحضير المقابلة',
    title: 'أتقن مقابلة تكوينك المهني في ألمانيا',
    subtitle: '15 من أكثر الأسئلة شيوعاً، مع نماذج أجوبة بالألمانية، شرح سبب طرح كل سؤال، وما يجب قوله وما يجب تجنّبه.',
    badgeQuestions: '{n} سؤال',
    badgeAnswers: 'نماذج أجوبة بالألمانية',
    badgeGerman: 'مستوى B1–B2',
    badgeFreePreview: '{n} مجانية، الباقي بعد تسجيل الدخول',
    allFilter: 'الكل',
    showWhy: 'لماذا يُطرح هذا السؤال؟',
    hideWhy: 'إخفاء الشرح',
    revealAnswer: 'اضغط لكشف الجواب',
    hideAnswer: 'إخفاء',
    sampleAnswerLabel: 'نموذج الإجابة',
    doSayLabel: 'مما يُقال',
    dontSayLabel: 'مما يُتجنّب',
    lockedTitle: 'سجّل دخولك لفتح الباقي',
    lockedBody: 'الأسئلة الثلاثة الأولى مجانية. أنشئ حساباً مجانياً للوصول إلى الأسئلة الخمسة عشر، نماذج الأجوبة، والنصائح.',
    lockedCta: 'تسجيل الدخول / إنشاء حساب',
    ctaTitle: 'تريد مقابلة تجريبية شخصية؟',
    ctaSub: 'احجز استشارة مدّتها 30 دقيقة. نجري معك مقابلة Vorstellungsgespräch حقيقية بالألمانية، نقيّمك، ونعطيك تصحيحات ملموسة — 16 €.',
    category: {
      intro: 'التقديم',
      motivation: 'الدافع',
      strengths: 'نقاط القوة',
      experience: 'التجربة',
      workplace: 'العمل',
      goals: 'الأهداف',
      logistics: 'اللوجستيك',
      closing: 'الختام',
    },
    difficulty: { 1: 'سهل', 2: 'متوسط', 3: 'صعب' },
  },
  de: {
    eyebrow: 'Interview-Vorbereitung',
    title: 'Meistere dein Ausbildungs-Vorstellungsgespräch',
    subtitle: '15 der häufigsten Fragen, mit Beispielantworten auf Deutsch sowie dem "Warum wird das gefragt" und was du sagen (und vermeiden) solltest.',
    badgeQuestions: '{n} Fragen',
    badgeAnswers: 'Beispielantworten auf Deutsch',
    badgeGerman: 'Niveau B1–B2',
    badgeFreePreview: '{n} kostenlos, Rest nach Login',
    allFilter: 'Alle',
    showWhy: 'Warum wird das gefragt?',
    hideWhy: 'Erklärung ausblenden',
    revealAnswer: 'Klicken, um die Antwort zu zeigen',
    hideAnswer: 'Ausblenden',
    sampleAnswerLabel: 'Musterantwort',
    doSayLabel: 'So sagen',
    dontSayLabel: 'So nicht',
    lockedTitle: 'Logge dich ein, um den Rest freizuschalten',
    lockedBody: 'Die ersten 3 Fragen sind kostenlos. Erstelle ein kostenloses Konto, um Zugriff auf alle 15 Fragen, Musterantworten und Tipps zu bekommen.',
    lockedCta: 'Einloggen / Registrieren',
    ctaTitle: 'Willst du ein persönliches Probegespräch?',
    ctaSub: 'Buche eine 30-Minuten-Beratung. Wir führen ein echtes Vorstellungsgespräch auf Deutsch, bewerten dich und geben konkrete Korrekturen — 16 €.',
    category: {
      intro: 'Vorstellung',
      motivation: 'Motivation',
      strengths: 'Stärken',
      experience: 'Erfahrung',
      workplace: 'Arbeitswelt',
      goals: 'Ziele',
      logistics: 'Logistik',
      closing: 'Abschluss',
    },
    difficulty: { 1: 'Leicht', 2: 'Mittel', 3: 'Knifflig' },
  },
}

const LOCALES = ['en', 'fr', 'ar', 'de']

for (const locale of LOCALES) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`)
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  const ui = UI[locale]
  const questions = {}
  for (const [qid, byLocale] of Object.entries(QUESTIONS)) {
    questions[qid] = byLocale[locale]
  }

  json.interviewPrep = {
    ...ui,
    questions,
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`✓ ${locale}.json — interviewPrep namespace injected`)
}
