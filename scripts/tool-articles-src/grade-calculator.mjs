// Companion article for /tools/german-grade-calculator — written in-session, no API.
export default {
  slug: 'g-german-grade-system-convert-your-gpa-bavarian-formula',
  category: 'universities',
  audience: 'global',
  imagePrompt: 'A focused student compares two transcripts at a desk with a calculator and laptop, university campus visible through the window behind, bright morning light',
  translations: {
    en: {
      title: 'The German Grade System Explained: Convert Your GPA With the Bavarian Formula (2026)',
      summary: 'German grades run from 1.0 (best) to 5.0. How the Bavarian formula converts your foreign GPA, what counts as a "good" grade, and why 1.7 beats 2.5.',
      content: `In Germany, a 1.0 is perfection and a 4.0 barely passes — the exact opposite of most countries' systems. If you are applying to a German university or having your degree recognized, admissions offices will convert your home grades with one specific formula, and understanding it BEFORE you apply can decide where you get in.

💡 **Shortcut:** convert your GPA to the German scale in seconds with the free [German Grade Calculator](/tools/german-grade-calculator) — it applies the official Bavarian formula for your country's grading scale.

## The German scale, decoded

- **1.0–1.5:** sehr gut (very good) — the elite band, needed for medicine and top scholarships.
- **1.6–2.5:** gut (good) — competitive for most master's programs.
- **2.6–3.5:** befriedigend (satisfactory) — fine for many programs, tight for selective ones.
- **3.6–4.0:** ausreichend (sufficient) — passed.
- **Above 4.0:** failed.

Counterintuitive rule number one: LOWER is BETTER. A German 1.7 is a strong result; a 2.5 is average.

## The Bavarian formula (modifizierte bayerische Formel)

Almost every German university converts foreign grades with the same formula: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin), where Nmax is the best possible grade in your system, Nmin the minimum passing grade, and Nd your grade. Example: a Moroccan 14/20 (with 10 as passing) converts to 1 + 3 × (20 − 14) / (20 − 10) = **2.8**. An Indian 8.0 CGPA out of 10 (pass at 4) converts to 1 + 3 × (10 − 8) / (10 − 4) = **2.0** — a very solid German grade.

Do not eyeball this — small differences in Nmin change the result a lot, which is why the [German Grade Calculator](/tools/german-grade-calculator) has the right scales per country built in.

## Why it matters so much

- **Numerus clausus (NC):** capped programs admit strictly by converted grade.
- **Master's admissions** often require a converted 2.5 or better.
- **Scholarships** (DAAD and others) look for 1.x–2.0 bands.
- **Uni-assist** — the clearing house most internationals apply through — uses this conversion in your VPD document.

If your converted grade is borderline, strategy helps: apply to programs without NC, highlight strong subject grades over the average, and remember universities of applied sciences (HAW/FH) often weigh work experience alongside grades. For checking whether your degree itself is recognized, run the [Anerkennung Wizard](/tools/anerkennung-wizard) first — recognition and conversion are separate steps people constantly confuse.

## Common mistakes

- Assuming your "80%" means the same everywhere — 80% converts very differently from a 20-point, 10-point or letter system.
- Using the overall average when the program admits by subject-specific grades.
- Ignoring Nmin: a system that passes at 50% converts very differently from one that passes at 40%.
- Waiting for uni-assist to reveal your grade after payment — know your number FIRST with the [German Grade Calculator](/tools/german-grade-calculator), then choose programs where it actually competes.`,
      faqs: [
        { q: 'How does the German grading system work?', a: 'From 1.0 (best) to 4.0 (barely passing); above 4.0 is a fail. Lower is better: 1.0–1.5 is very good, up to 2.5 is good, 3.5 satisfactory, 4.0 sufficient.' },
        { q: 'What is the Bavarian formula?', a: 'The standard conversion for foreign grades: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin). It maps your home scale to the German 1.0–4.0 scale using your system\'s best and minimum passing grades.' },
        { q: 'What German grade do I need for a master\'s program?', a: 'Most programs ask for a converted 2.5 or better; competitive programs want 2.0 or better, and scholarships typically look for the 1.x band. Requirements are listed per program.' },
        { q: 'Is a German 2.0 a good grade?', a: 'Yes — 2.0 sits in the "gut" band and is competitive for most master\'s admissions and many scholarships. Remember the scale is inverted: lower numbers are better.' },
        { q: 'Who converts my grades officially?', a: 'Uni-assist (via the VPD) or the university\'s admissions office converts officially. Knowing your converted grade beforehand with a calculator lets you target programs where your grade is competitive.' },
      ],
    },
    fr: {
      title: 'Le système de notes allemand expliqué : convertissez votre moyenne avec la formule bavaroise (2026)',
      summary: 'Les notes allemandes vont de 1,0 (meilleure) à 5,0. Comment la formule bavaroise convertit votre moyenne étrangère, ce qu’est une « bonne » note, et pourquoi 1,7 bat 2,5.',
      content: `En Allemagne, 1,0 est la perfection et 4,0 passe tout juste — l’exact inverse de la plupart des systèmes. Si vous candidatez dans une université allemande ou faites reconnaître votre diplôme, les services d’admission convertiront vos notes avec une formule précise, et la comprendre AVANT de candidater peut décider de votre admission.

💡 **Raccourci :** convertissez votre moyenne vers l’échelle allemande en quelques secondes avec le [Calculateur de notes allemandes](/tools/german-grade-calculator) gratuit — il applique la formule bavaroise officielle selon le barème de votre pays.

## L’échelle allemande, décodée

- **1,0–1,5 :** sehr gut (très bien) — la bande d’élite, requise pour médecine et les grandes bourses.
- **1,6–2,5 :** gut (bien) — compétitif pour la plupart des masters.
- **2,6–3,5 :** befriedigend (satisfaisant) — suffisant pour beaucoup de programmes, juste pour les sélectifs.
- **3,6–4,0 :** ausreichend (passable) — admis.
- **Au-dessus de 4,0 :** échec.

Règle contre-intuitive numéro un : PLUS BAS = MEILLEUR. Un 1,7 allemand est un excellent résultat ; un 2,5 est moyen.

## La formule bavaroise (modifizierte bayerische Formel)

Presque toutes les universités allemandes convertissent avec la même formule : x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin), où Nmax est la meilleure note possible de votre système, Nmin la note minimale de passage, Nd votre note. Exemple : un 14/20 marocain (passage à 10) donne 1 + 3 × (20 − 14) / (20 − 10) = **2,8**. Un 16/20 donne **1,6** — excellent en Allemagne.

Ne le faites pas au pif — de petites différences de Nmin changent beaucoup le résultat, d’où l’intérêt du [Calculateur de notes allemandes](/tools/german-grade-calculator) avec les bons barèmes par pays intégrés.

## Pourquoi c’est si important

- **Numerus clausus (NC) :** les filières contingentées admettent strictement à la note convertie.
- **Les admissions en master** exigent souvent 2,5 converti ou mieux.
- **Les bourses** (DAAD et autres) visent les bandes 1,x–2,0.
- **Uni-assist** — la plateforme par laquelle passent la plupart des internationaux — applique cette conversion dans votre document VPD.

Si votre note convertie est limite, la stratégie aide : visez des filières sans NC, mettez en avant vos notes fortes par matière plutôt que la moyenne, et rappelez-vous que les écoles supérieures spécialisées (HAW/FH) pèsent souvent l’expérience professionnelle avec les notes. Pour vérifier si votre diplôme lui-même est reconnu, passez d’abord par l’[Assistant Anerkennung](/tools/anerkennung-wizard) — reconnaissance et conversion sont deux étapes distinctes que l’on confond sans cesse.

## Erreurs fréquentes

- Croire que votre « 80 % » signifie la même chose partout — 80 % se convertit très différemment depuis un système sur 20, sur 10 ou en lettres.
- Utiliser la moyenne générale quand la filière admet sur les notes par matière.
- Ignorer Nmin : un système qui passe à 50 % ne se convertit pas comme un système qui passe à 40 %.
- Attendre qu’uni-assist révèle votre note après paiement — connaissez votre chiffre D’ABORD avec le [Calculateur de notes allemandes](/tools/german-grade-calculator), puis choisissez des filières où il est réellement compétitif.`,
      faqs: [
        { q: 'Comment fonctionne le système de notes allemand ?', a: 'De 1,0 (meilleure) à 4,0 (passage limite) ; au-delà de 4,0 c’est l’échec. Plus bas = meilleur : 1,0–1,5 très bien, jusqu’à 2,5 bien, 3,5 satisfaisant, 4,0 passable.' },
        { q: 'Qu’est-ce que la formule bavaroise ?', a: 'La conversion standard des notes étrangères : x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin). Elle projette votre barème national sur l’échelle allemande 1,0–4,0 à partir de la meilleure note et de la note de passage de votre système.' },
        { q: 'Quelle note allemande faut-il pour un master ?', a: 'La plupart des programmes demandent 2,5 converti ou mieux ; les programmes compétitifs veulent 2,0 ou mieux, et les bourses visent la bande 1,x. Les exigences sont indiquées par programme.' },
        { q: 'Un 2,0 allemand est-il une bonne note ?', a: 'Oui — 2,0 est dans la bande « gut » et reste compétitif pour la plupart des masters et beaucoup de bourses. L’échelle est inversée : plus bas = meilleur.' },
        { q: 'Qui convertit officiellement mes notes ?', a: 'Uni-assist (via la VPD) ou le service d’admission de l’université. Connaître votre note convertie à l’avance avec un calculateur permet de cibler les filières où elle est compétitive.' },
      ],
    },
    ar: {
      title: 'نظام النقط الألماني ببساطة: حوّل معدلك بالصيغة البافارية (2026)',
      summary: 'النقط الألمانية من 1.0 (الأفضل) إلى 5.0. كيف تحوّل الصيغة البافارية معدلك الأجنبي، وما «النقطة الجيدة»، ولماذا 1.7 أفضل من 2.5.',
      content: `في ألمانيا، 1.0 هي الكمال و4.0 نجاح بالكاد — عكس معظم أنظمة العالم تماماً. إن كنت تتقدم لجامعة ألمانية أو تعترف بشهادتك، ستحوّل مكاتب القبول نقطك بصيغة محددة، وفهمها قبل التقديم قد يحسم أين تُقبل.

💡 **اختصار:** حوّل معدلك إلى السلم الألماني في ثوانٍ عبر [حاسبة النقط الألمانية](/tools/german-grade-calculator) المجانية — تطبق الصيغة البافارية الرسمية حسب سلم التنقيط في بلدك.

## السلم الألماني مفكوكاً

- **1.0–1.5:** sehr gut (ممتاز) — نطاق النخبة، مطلوب للطب وكبرى المنح.
- **1.6–2.5:** gut (جيد) — تنافسي لمعظم برامج الماستر.
- **2.6–3.5:** befriedigend (مقبول جيد) — كافٍ لبرامج كثيرة، ضيق للانتقائية.
- **3.6–4.0:** ausreichend (كافٍ) — ناجح.
- **فوق 4.0:** راسب.

القاعدة العكسية الأولى: الأقل هو الأفضل. 1.7 الألمانية نتيجة قوية؛ و2.5 متوسطة.

## الصيغة البافارية (modifizierte bayerische Formel)

كل الجامعات الألمانية تقريباً تحوّل النقط الأجنبية بالصيغة نفسها: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin)، حيث Nmax أعلى نقطة ممكنة في نظامك، وNmin نقطة النجاح الدنيا، وNd نقطتك. مثال مغربي: 14/20 (والنجاح من 10) تعطي 1 + 3 × (20 − 14) / (20 − 10) = **2.8**. و16/20 تعطي **1.6** — ممتازة بالمقياس الألماني.

لا تحسبها تخميناً — فروق صغيرة في Nmin تغيّر النتيجة كثيراً، ولهذا تأتي [حاسبة النقط الألمانية](/tools/german-grade-calculator) بسلالم التنقيط الصحيحة لكل بلد.

## لماذا تهم لهذه الدرجة

- **النوميروس كلاوزوس (NC):** التخصصات المحدودة المقاعد تقبل حصراً بالنقطة المحوّلة.
- **قبول الماستر** يشترط غالباً 2.5 محوّلة أو أفضل.
- **المنح** (DAAD وغيرها) تبحث عن نطاق 1.x–2.0.
- **Uni-assist** — المنصة التي يمر عبرها معظم الدوليين — تعتمد هذا التحويل في وثيقة VPD.

إن كانت نقطتك المحوّلة على الحافة، تساعد الاستراتيجية: تقدّم لبرامج بلا NC، وأبرز نقط المواد القوية بدل المعدل، وتذكر أن جامعات العلوم التطبيقية (HAW/FH) توازن غالباً الخبرة العملية مع النقط. وللتحقق من اعتراف شهادتك نفسها ابدأ بـ[مرشد الاعتراف بالشهادات](/tools/anerkennung-wizard) — فالاعتراف والتحويل خطوتان منفصلتان يخلط الناس بينهما دائماً.

## أخطاء شائعة

- افتراض أن «80%» تعني الشيء نفسه في كل مكان — 80% تتحول بشكل مختلف جداً من نظام على 20 أو على 10 أو بالحروف.
- استعمال المعدل العام بينما البرنامج يقبل بنقط مواد محددة.
- تجاهل Nmin: نظام ينجح من 50% لا يتحول كنظام ينجح من 40%.
- انتظار uni-assist لتكشف نقطتك بعد الدفع — اعرف رقمك أولاً عبر [حاسبة النقط الألمانية](/tools/german-grade-calculator) ثم اختر برامج تنافس فيها نقطتك فعلاً.`,
      faqs: [
        { q: 'كيف يعمل نظام النقط الألماني؟', a: 'من 1.0 (الأفضل) إلى 4.0 (نجاح بالكاد)؛ وما فوق 4.0 رسوب. الأقل أفضل: 1.0–1.5 ممتاز، حتى 2.5 جيد، 3.5 مقبول، 4.0 كافٍ.' },
        { q: 'ما الصيغة البافارية؟', a: 'التحويل المعياري للنقط الأجنبية: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin). تُسقط سلم بلدك على السلم الألماني 1.0–4.0 باستخدام أعلى نقطة ونقطة النجاح في نظامك.' },
        { q: 'ما النقطة الألمانية اللازمة للماستر؟', a: 'تطلب معظم البرامج 2.5 محوّلة أو أفضل؛ والتنافسية 2.0 أو أفضل، والمنح عادة نطاق 1.x. الشروط تُنشر لكل برنامج.' },
        { q: 'هل 2.0 الألمانية نقطة جيدة؟', a: 'نعم — 2.0 في نطاق «gut» وتنافسية لمعظم قبولات الماستر وكثير من المنح. تذكر أن السلم معكوس: الأرقام الأصغر أفضل.' },
        { q: 'من يحوّل نقطي رسمياً؟', a: 'Uni-assist (عبر وثيقة VPD) أو مكتب القبول بالجامعة. معرفة نقطتك المحوّلة مسبقاً بالحاسبة تتيح استهداف برامج تكون فيها نقطتك تنافسية.' },
      ],
    },
    de: {
      title: 'Das deutsche Notensystem erklärt: GPA mit der bayerischen Formel umrechnen (2026)',
      summary: 'Deutsche Noten laufen von 1,0 (beste) bis 5,0. Wie die bayerische Formel ausländische Noten umrechnet, was als „gut" gilt und warum 1,7 besser ist als 2,5.',
      content: `In Deutschland ist die 1,0 die Perfektion und die 4,0 gerade noch bestanden — das exakte Gegenteil der meisten Systeme weltweit. Wer sich an einer deutschen Hochschule bewirbt oder seinen Abschluss anerkennen lässt, dessen Noten werden mit einer ganz bestimmten Formel umgerechnet — und wer sie VOR der Bewerbung versteht, kann damit über die Zulassung entscheiden.

💡 **Abkürzung:** Rechnen Sie Ihre Note in Sekunden auf die deutsche Skala um — mit dem kostenlosen [Notenumrechner](/tools/german-grade-calculator), der die offizielle bayerische Formel mit der richtigen Skala Ihres Landes anwendet.

## Die deutsche Skala, entschlüsselt

- **1,0–1,5:** sehr gut — die Eliteband, nötig für Medizin und Top-Stipendien.
- **1,6–2,5:** gut — wettbewerbsfähig für die meisten Masterprogramme.
- **2,6–3,5:** befriedigend — für viele Programme okay, knapp für selektive.
- **3,6–4,0:** ausreichend — bestanden.
- **Über 4,0:** durchgefallen.

Kontraintuitive Regel Nummer eins: NIEDRIGER ist BESSER. Eine deutsche 1,7 ist stark; eine 2,5 ist Durchschnitt.

## Die modifizierte bayerische Formel

Fast jede deutsche Hochschule rechnet ausländische Noten mit derselben Formel um: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin) — mit Nmax als bester möglicher Note Ihres Systems, Nmin als Mindestbestehensnote und Nd als Ihrer Note. Beispiel: marokkanische 14/20 (bestanden ab 10) ergeben 1 + 3 × (20 − 14) / (20 − 10) = **2,8**. Ein indischer CGPA von 8,0/10 (bestanden ab 4) ergibt **2,0** — eine sehr solide deutsche Note.

Nicht schätzen — kleine Unterschiede bei Nmin verändern das Ergebnis stark. Genau deshalb hat der [Notenumrechner](/tools/german-grade-calculator) die richtigen Skalen pro Land eingebaut.

## Warum das so wichtig ist

- **Numerus clausus (NC):** zulassungsbeschränkte Fächer nehmen strikt nach umgerechneter Note.
- **Master-Zulassungen** verlangen oft eine umgerechnete 2,5 oder besser.
- **Stipendien** (DAAD u. a.) suchen die Bänder 1,x–2,0.
- **Uni-assist** — über das die meisten Internationalen laufen — nutzt diese Umrechnung in der VPD.

Ist Ihre umgerechnete Note grenzwertig, hilft Strategie: NC-freie Programme wählen, starke Fachnoten statt des Schnitts betonen — und Hochschulen für angewandte Wissenschaften (HAW/FH) gewichten oft Berufserfahrung mit. Ob Ihr Abschluss selbst anerkannt wird, prüfen Sie zuerst im [Anerkennungs-Wizard](/tools/anerkennung-wizard) — Anerkennung und Umrechnung sind getrennte Schritte, die ständig verwechselt werden.

## Häufige Fehler

- Annehmen, „80 %" bedeute überall dasselbe — 80 % rechnen sich aus einem 20-Punkte-, 10-Punkte- oder Briefsystem völlig unterschiedlich um.
- Den Gesamtschnitt nehmen, wenn das Programm nach Fachnoten zulässt.
- Nmin ignorieren: Ein System mit Bestehensgrenze 50 % rechnet sich anders um als eines mit 40 %.
- Warten, bis uni-assist nach Bezahlung die Note verrät — kennen Sie Ihre Zahl ZUERST mit dem [Notenumrechner](/tools/german-grade-calculator) und wählen Sie dann Programme, in denen sie wirklich konkurrenzfähig ist.`,
      faqs: [
        { q: 'Wie funktioniert das deutsche Notensystem?', a: 'Von 1,0 (beste) bis 4,0 (gerade bestanden); über 4,0 ist durchgefallen. Niedriger ist besser: 1,0–1,5 sehr gut, bis 2,5 gut, 3,5 befriedigend, 4,0 ausreichend.' },
        { q: 'Was ist die bayerische Formel?', a: 'Die Standardumrechnung ausländischer Noten: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin). Sie bildet Ihre Heimatskala über beste Note und Bestehensgrenze auf die deutsche Skala 1,0–4,0 ab.' },
        { q: 'Welche deutsche Note brauche ich für den Master?', a: 'Die meisten Programme verlangen eine umgerechnete 2,5 oder besser; kompetitive Programme 2,0 oder besser, Stipendien meist die 1,x-Band. Die Anforderungen stehen je Programm.' },
        { q: 'Ist eine deutsche 2,0 eine gute Note?', a: 'Ja — 2,0 liegt im „gut"-Band und ist für die meisten Master-Zulassungen und viele Stipendien konkurrenzfähig. Die Skala ist invertiert: kleinere Zahlen sind besser.' },
        { q: 'Wer rechnet meine Noten offiziell um?', a: 'Uni-assist (über die VPD) oder das Zulassungsbüro der Hochschule. Wer seine umgerechnete Note vorher per Rechner kennt, kann gezielt Programme wählen, in denen sie konkurrenzfähig ist.' },
      ],
    },
    es: {
      title: 'El sistema de notas alemán explicado: convierte tu media con la fórmula bávara (2026)',
      summary: 'Las notas alemanas van de 1,0 (la mejor) a 5,0. Cómo la fórmula bávara convierte tu media extranjera, qué es una «buena» nota y por qué 1,7 gana a 2,5.',
      content: `En Alemania, un 1,0 es la perfección y un 4,0 aprueba por los pelos — justo lo contrario de la mayoría de sistemas. Si solicitas plaza en una universidad alemana o reconoces tu título, admisiones convertirá tus notas con una fórmula concreta, y entenderla ANTES de solicitar puede decidir dónde entras.

💡 **Atajo:** convierte tu media a la escala alemana en segundos con la [Calculadora de notas alemanas](/tools/german-grade-calculator) gratuita — aplica la fórmula bávara oficial con el baremo de tu país.

## La escala alemana, descodificada

- **1,0–1,5:** sehr gut (sobresaliente) — la banda de élite, necesaria para medicina y las grandes becas.
- **1,6–2,5:** gut (notable) — competitivo para la mayoría de másteres.
- **2,6–3,5:** befriedigend (bien) — suficiente para muchos programas, justo para los selectivos.
- **3,6–4,0:** ausreichend (aprobado) — aprobado.
- **Por encima de 4,0:** suspenso.

Regla contraintuitiva número uno: MÁS BAJO es MEJOR. Un 1,7 alemán es un resultado fuerte; un 2,5 es la media.

## La fórmula bávara (modifizierte bayerische Formel)

Casi todas las universidades alemanas convierten las notas extranjeras con la misma fórmula: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin), donde Nmax es la mejor nota posible de tu sistema, Nmin la mínima de aprobado y Nd tu nota. Ejemplo: un 8 sobre 10 (aprobado en 5) da 1 + 3 × (10 − 8) / (10 − 5) = **2,2** — una nota alemana muy sólida.

No lo calcules a ojo — pequeñas diferencias en Nmin cambian mucho el resultado; por eso la [Calculadora de notas alemanas](/tools/german-grade-calculator) trae los baremos correctos por país.

## Por qué importa tanto

- **Numerus clausus (NC):** las carreras con cupo admiten estrictamente por nota convertida.
- **Las admisiones de máster** suelen exigir 2,5 convertido o mejor.
- **Las becas** (DAAD y otras) buscan las bandas 1,x–2,0.
- **Uni-assist** — la plataforma por la que pasan la mayoría de internacionales — usa esta conversión en tu documento VPD.

Si tu nota convertida está al límite, ayuda la estrategia: solicita programas sin NC, destaca notas fuertes por asignatura sobre la media, y recuerda que las universidades de ciencias aplicadas (HAW/FH) suelen valorar la experiencia laboral junto a las notas. Para saber si tu título en sí está reconocido, pasa antes por el [Asistente de Anerkennung](/tools/anerkennung-wizard) — reconocimiento y conversión son pasos distintos que la gente confunde sin parar.

## Errores comunes

- Suponer que tu «80 %» significa lo mismo en todas partes — un 80 % se convierte muy distinto desde un sistema sobre 20, sobre 10 o con letras.
- Usar la media general cuando el programa admite por notas de asignaturas concretas.
- Ignorar Nmin: un sistema que aprueba al 50 % no se convierte como uno que aprueba al 40 %.
- Esperar a que uni-assist revele tu nota tras pagar — conoce tu número PRIMERO con la [Calculadora de notas alemanas](/tools/german-grade-calculator) y elige programas donde de verdad compita.`,
      faqs: [
        { q: '¿Cómo funciona el sistema de notas alemán?', a: 'De 1,0 (la mejor) a 4,0 (aprobado justo); por encima de 4,0 es suspenso. Más bajo es mejor: 1,0–1,5 sobresaliente, hasta 2,5 notable, 3,5 bien, 4,0 aprobado.' },
        { q: '¿Qué es la fórmula bávara?', a: 'La conversión estándar de notas extranjeras: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin). Proyecta tu baremo nacional a la escala alemana 1,0–4,0 usando la mejor nota y la nota de aprobado de tu sistema.' },
        { q: '¿Qué nota alemana necesito para un máster?', a: 'La mayoría pide un 2,5 convertido o mejor; los competitivos, 2,0 o mejor, y las becas suelen buscar la banda 1,x. Los requisitos se publican por programa.' },
        { q: '¿Es buena nota un 2,0 alemán?', a: 'Sí — el 2,0 está en la banda «gut» y es competitivo para la mayoría de másteres y muchas becas. La escala está invertida: números más bajos son mejores.' },
        { q: '¿Quién convierte mis notas oficialmente?', a: 'Uni-assist (vía VPD) o la oficina de admisiones de la universidad. Conocer tu nota convertida antes con una calculadora te permite apuntar a programas donde tu nota compite.' },
      ],
    },
    tr: {
      title: 'Alman Not Sistemi: Ortalamanızı Bavyera Formülüyle Çevirin (2026)',
      summary: 'Alman notları 1,0 (en iyi) ile 5,0 arasında. Bavyera formülü yabancı ortalamanızı nasıl çevirir, «iyi» not nedir ve 1,7 neden 2,5’i yener.',
      content: `Almanya’da 1,0 mükemmelliktir, 4,0 ise kıl payı geçer — çoğu ülkenin sisteminin tam tersi. Bir Alman üniversitesine başvuruyorsanız veya diplomanızı denkleştiriyorsanız, kabul ofisleri notlarınızı belirli bir formülle çevirir — ve bunu başvurudan ÖNCE anlamak nereye kabul edileceğinizi belirleyebilir.

💡 **Kestirme:** ortalamanızı saniyeler içinde Alman ölçeğine çevirin — ücretsiz [Alman Not Hesaplayıcı](/tools/german-grade-calculator), ülkenizin not sistemine göre resmî Bavyera formülünü uygular.

## Alman ölçeğinin şifresi

- **1,0–1,5:** sehr gut (pekiyi) — elit bant; tıp ve büyük burslar için gerekli.
- **1,6–2,5:** gut (iyi) — çoğu yüksek lisans için rekabetçi.
- **2,6–3,5:** befriedigend (orta) — birçok program için yeterli, seçici olanlar için dar.
- **3,6–4,0:** ausreichend (geçer) — geçti.
- **4,0 üzeri:** kaldı.

Mantığa aykırı kural bir: DÜŞÜK olan İYİDİR. Alman 1,7 güçlü bir sonuçtur; 2,5 ortalamadır.

## Bavyera formülü (modifizierte bayerische Formel)

Neredeyse her Alman üniversitesi yabancı notları aynı formülle çevirir: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin) — Nmax sisteminizdeki en iyi not, Nmin geçme notu, Nd sizin notunuz. Örnek: 100 üzerinden 80 (geçme 50) → 1 + 3 × (100 − 80) / (100 − 50) = **2,2** — gayet sağlam bir Alman notu.

Göz kararı yapmayın — Nmin’deki küçük farklar sonucu çok değiştirir; [Alman Not Hesaplayıcı](/tools/german-grade-calculator) bu yüzden ülke ülke doğru ölçekleri içinde barındırır.

## Neden bu kadar önemli

- **Numerus clausus (NC):** kontenjanlı bölümler kesinlikle çevrilmiş nota göre alır.
- **Yüksek lisans kabulleri** çoğu zaman çevrilmiş 2,5 veya daha iyisini ister.
- **Burslar** (DAAD ve diğerleri) 1,x–2,0 bantlarına bakar.
- **Uni-assist** — uluslararası öğrencilerin çoğunun geçtiği merkez — bu çevirmeyi VPD belgenizde kullanır.

Çevrilmiş notunuz sınırdaysa strateji yardım eder: NC’siz programlara başvurun, ortalama yerine güçlü ders notlarını öne çıkarın ve uygulamalı bilimler üniversitelerinin (HAW/FH) iş deneyimini notlarla birlikte tarttığını unutmayın. Diplomanızın kendisinin tanınıp tanınmadığını önce [Denklik Sihirbazı](/tools/anerkennung-wizard) ile kontrol edin — tanınma ve not çevirme, sürekli karıştırılan iki ayrı adımdır.

## Sık yapılan hatalar

- «%80»in her yerde aynı anlama geldiğini sanmak — %80, 20’lik, 10’luk veya harfli sistemden çok farklı çevrilir.
- Program ders bazlı kabul yaparken genel ortalamayı kullanmak.
- Nmin’i yok saymak: %50’de geçen bir sistem, %40’ta geçenle aynı çevrilmez.
- Ödemeden sonra notu uni-assist’in açıklamasını beklemek — numaranızı ÖNCE [Alman Not Hesaplayıcı](/tools/german-grade-calculator) ile öğrenin, sonra gerçekten rekabet ettiği programları seçin.`,
      faqs: [
        { q: 'Alman not sistemi nasıl çalışır?', a: '1,0 (en iyi) ile 4,0 (kıl payı geçme) arası; 4,0 üzeri kalır. Düşük daha iyidir: 1,0–1,5 pekiyi, 2,5’e kadar iyi, 3,5 orta, 4,0 geçer.' },
        { q: 'Bavyera formülü nedir?', a: 'Yabancı notların standart çevirisi: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin). Sisteminizin en iyi notu ile geçme notunu kullanarak ölçeğinizi Alman 1,0–4,0 ölçeğine taşır.' },
        { q: 'Yüksek lisans için hangi Alman notu gerekir?', a: 'Çoğu program çevrilmiş 2,5 veya daha iyisini ister; rekabetçi programlar 2,0 ve üstü, burslar ise genelde 1,x bandını arar. Şartlar program bazında ilan edilir.' },
        { q: 'Alman 2,0 iyi bir not mu?', a: 'Evet — 2,0 «gut» bandındadır ve çoğu yüksek lisans kabulü ile birçok burs için rekabetçidir. Ölçek terstir: küçük sayılar daha iyidir.' },
        { q: 'Notlarımı resmî olarak kim çevirir?', a: 'Uni-assist (VPD üzerinden) veya üniversitenin kabul ofisi. Çevrilmiş notunuzu önceden hesaplayıcıyla bilmek, notunuzun gerçekten rekabetçi olduğu programları hedeflemenizi sağlar.' },
      ],
    },
    fa: {
      title: 'سیستم نمره آلمانی به زبان ساده: معدل‌تان را با فرمول باواریایی تبدیل کنید (2026)',
      summary: 'نمره‌های آلمانی از ۱٫۰ (بهترین) تا ۵٫۰ هستند. فرمول باواریایی چطور معدل خارجی را تبدیل می‌کند، نمره «خوب» چیست و چرا ۱٫۷ از ۲٫۵ بهتر است.',
      content: `در آلمان ۱٫۰ یعنی کمال و ۴٫۰ یعنی به‌زور قبولی — دقیقاً برعکس بیشتر سیستم‌های دنیا. اگر برای دانشگاه آلمانی اقدام می‌کنید یا مدرک‌تان را تأیید می‌کنید، دفتر پذیرش نمره‌هایتان را با یک فرمول مشخص تبدیل می‌کند و فهمیدن آن قبل از اقدام می‌تواند تعیین کند کجا پذیرفته می‌شوید.

💡 **میان‌بر:** معدل‌تان را در چند ثانیه با [محاسبه‌گر نمره آلمانی](/tools/german-grade-calculator) رایگان به مقیاس آلمانی تبدیل کنید — فرمول رسمی باواریایی را با مقیاس درست کشور شما اعمال می‌کند.

## رمزگشایی مقیاس آلمانی

- **۱٫۰–۱٫۵:** sehr gut (عالی) — باند نخبگان، لازم برای پزشکی و بورس‌های بزرگ.
- **۱٫۶–۲٫۵:** gut (خوب) — رقابتی برای بیشتر برنامه‌های ارشد.
- **۲٫۶–۳٫۵:** befriedigend (قابل قبول) — برای خیلی از برنامه‌ها کافی، برای گزینشی‌ها تنگ.
- **۳٫۶–۴٫۰:** ausreichend (کافی) — قبول.
- **بالای ۴٫۰:** مردود.

قانون خلاف شهود شماره یک: پایین‌تر یعنی بهتر. ۱٫۷ آلمانی نتیجه‌ای قوی است؛ ۲٫۵ متوسط است.

## فرمول باواریایی (modifizierte bayerische Formel)

تقریباً همه دانشگاه‌های آلمان نمره‌های خارجی را با همین فرمول تبدیل می‌کنند: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin) که در آن Nmax بهترین نمره ممکن سیستم شما، Nmin حداقل نمره قبولی و Nd نمره شماست. مثال: معدل ۱۷ از ۲۰ (قبولی از ۱۰) می‌شود 1 + 3 × (20 − 17) / (20 − 10) = **۱٫۹** — نمره‌ای بسیار خوب در آلمان.

چشمی حساب نکنید — تفاوت‌های کوچک در Nmin نتیجه را خیلی تغییر می‌دهد؛ برای همین [محاسبه‌گر نمره آلمانی](/tools/german-grade-calculator) مقیاس‌های درست هر کشور را داخل خودش دارد.

## چرا این‌قدر مهم است

- **نومروس کلاوزوس (NC):** رشته‌های ظرفیت‌دار دقیقاً با نمره تبدیل‌شده پذیرش می‌کنند.
- **پذیرش ارشد** اغلب ۲٫۵ تبدیل‌شده یا بهتر می‌خواهد.
- **بورس‌ها** (DAAD و دیگران) دنبال باند ۱٫x–۲٫۰ هستند.
- **Uni-assist** — سامانه‌ای که بیشتر بین‌المللی‌ها از آن رد می‌شوند — همین تبدیل را در سند VPD شما به کار می‌برد.

اگر نمره تبدیل‌شده‌تان مرزی است، استراتژی کمک می‌کند: به برنامه‌های بدون NC اقدام کنید، نمره‌های قوی درسی را به‌جای معدل برجسته کنید، و یادتان باشد دانشگاه‌های علوم کاربردی (HAW/FH) اغلب سابقه کار را کنار نمره می‌سنجند. برای اینکه بدانید خود مدرک‌تان به رسمیت شناخته می‌شود، اول [راهنمای تأیید مدارک](/tools/anerkennung-wizard) را اجرا کنید — تأیید مدرک و تبدیل نمره دو مرحله جدا هستند که همیشه با هم اشتباه گرفته می‌شوند.

## اشتباهات رایج

- این فرض که «۸۰٪» شما همه‌جا یک معنا دارد — ۸۰٪ از سیستم ۲۰نمره‌ای، ۱۰نمره‌ای یا حرفی خیلی متفاوت تبدیل می‌شود.
- استفاده از معدل کل وقتی برنامه با نمره‌های درسی خاص پذیرش می‌گیرد.
- نادیده گرفتن Nmin: سیستمی که با ۵۰٪ قبول می‌شود مثل سیستمی که با ۴۰٪ قبول می‌شود تبدیل نمی‌شود.
- منتظر ماندن تا uni-assist بعد از پرداخت نمره را بگوید — اول عددتان را با [محاسبه‌گر نمره آلمانی](/tools/german-grade-calculator) بدانید، بعد برنامه‌هایی را انتخاب کنید که نمره‌تان واقعاً در آن‌ها رقابتی است.`,
      faqs: [
        { q: 'سیستم نمره‌دهی آلمان چطور کار می‌کند؟', a: 'از ۱٫۰ (بهترین) تا ۴٫۰ (به‌زور قبول)؛ بالای ۴٫۰ مردودی است. پایین‌تر بهتر است: ۱٫۰–۱٫۵ عالی، تا ۲٫۵ خوب، ۳٫۵ قابل قبول، ۴٫۰ کافی.' },
        { q: 'فرمول باواریایی چیست؟', a: 'تبدیل استاندارد نمره‌های خارجی: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin). مقیاس کشور شما را با بهترین نمره و نمره قبولی سیستم‌تان به مقیاس آلمانی ۱٫۰–۴٫۰ می‌برد.' },
        { q: 'برای ارشد چه نمره آلمانی لازم است؟', a: 'بیشتر برنامه‌ها ۲٫۵ تبدیل‌شده یا بهتر می‌خواهند؛ برنامه‌های رقابتی ۲٫۰ یا بهتر، و بورس‌ها معمولاً باند ۱٫x. شرایط هر برنامه جداگانه اعلام می‌شود.' },
        { q: 'آیا ۲٫۰ آلمانی نمره خوبی است؟', a: 'بله — ۲٫۰ در باند «gut» است و برای بیشتر پذیرش‌های ارشد و خیلی از بورس‌ها رقابتی است. مقیاس برعکس است: عدد کوچک‌تر بهتر است.' },
        { q: 'چه کسی نمره‌ها را رسماً تبدیل می‌کند؟', a: 'Uni-assist (از طریق VPD) یا دفتر پذیرش دانشگاه. دانستن نمره تبدیل‌شده از قبل با محاسبه‌گر کمک می‌کند برنامه‌هایی را هدف بگیرید که نمره‌تان در آن‌ها رقابتی است.' },
      ],
    },
    pt: {
      title: 'O sistema de notas alemão explicado: converta sua média com a fórmula bávara (2026)',
      summary: 'As notas alemãs vão de 1,0 (melhor) a 5,0. Como a fórmula bávara converte sua média estrangeira, o que é uma nota «boa» e por que 1,7 vence 2,5.',
      content: `Na Alemanha, um 1,0 é a perfeição e um 4,0 passa raspando — exatamente o contrário da maioria dos sistemas. Se você está se candidatando a uma universidade alemã ou reconhecendo seu diploma, a admissão converterá suas notas com uma fórmula específica — e entendê-la ANTES de se candidatar pode decidir onde você entra.

💡 **Atalho:** converta sua média para a escala alemã em segundos com a [Calculadora de Notas Alemãs](/tools/german-grade-calculator) gratuita — ela aplica a fórmula bávara oficial com a escala correta do seu país.

## A escala alemã, decodificada

- **1,0–1,5:** sehr gut (excelente) — a banda de elite, exigida para medicina e grandes bolsas.
- **1,6–2,5:** gut (bom) — competitivo para a maioria dos mestrados.
- **2,6–3,5:** befriedigend (satisfatório) — suficiente para muitos programas, apertado para os seletivos.
- **3,6–4,0:** ausreichend (suficiente) — aprovado.
- **Acima de 4,0:** reprovado.

Regra contraintuitiva número um: MENOR é MELHOR. Um 1,7 alemão é um resultado forte; um 2,5 é mediano.

## A fórmula bávara (modifizierte bayerische Formel)

Quase toda universidade alemã converte notas estrangeiras com a mesma fórmula: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin), onde Nmax é a melhor nota possível do seu sistema, Nmin a nota mínima de aprovação e Nd a sua nota. Exemplo: um 8,0 em 10 (aprovação em 5) dá 1 + 3 × (10 − 8) / (10 − 5) = **2,2** — uma nota alemã muito sólida.

Não faça de cabeça — pequenas diferenças no Nmin mudam muito o resultado; por isso a [Calculadora de Notas Alemãs](/tools/german-grade-calculator) traz as escalas corretas por país.

## Por que importa tanto

- **Numerus clausus (NC):** cursos com vagas limitadas admitem estritamente pela nota convertida.
- **Admissões de mestrado** costumam exigir 2,5 convertido ou melhor.
- **Bolsas** (DAAD e outras) buscam as bandas 1,x–2,0.
- **Uni-assist** — a central por onde a maioria dos internacionais passa — usa essa conversão no seu documento VPD.

Se sua nota convertida está no limite, estratégia ajuda: candidate-se a cursos sem NC, destaque notas fortes por disciplina em vez da média, e lembre que as universidades de ciências aplicadas (HAW/FH) costumam pesar experiência profissional junto com as notas. Para saber se o seu diploma em si é reconhecido, rode antes o [Assistente de Anerkennung](/tools/anerkennung-wizard) — reconhecimento e conversão são etapas separadas que as pessoas confundem o tempo todo.

## Erros comuns

- Achar que seus «80%» significam o mesmo em todo lugar — 80% converte muito diferente de um sistema de 20 pontos, de 10 pontos ou de letras.
- Usar a média geral quando o curso admite por notas de disciplinas específicas.
- Ignorar o Nmin: um sistema que aprova com 50% não converte como um que aprova com 40%.
- Esperar o uni-assist revelar sua nota depois de pagar — saiba seu número PRIMEIRO com a [Calculadora de Notas Alemãs](/tools/german-grade-calculator) e escolha cursos onde ele realmente compete.`,
      faqs: [
        { q: 'Como funciona o sistema de notas alemão?', a: 'De 1,0 (melhor) a 4,0 (aprovado no limite); acima de 4,0 é reprovação. Menor é melhor: 1,0–1,5 excelente, até 2,5 bom, 3,5 satisfatório, 4,0 suficiente.' },
        { q: 'O que é a fórmula bávara?', a: 'A conversão padrão de notas estrangeiras: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin). Ela projeta sua escala nacional na escala alemã 1,0–4,0 usando a melhor nota e a nota de aprovação do seu sistema.' },
        { q: 'Que nota alemã preciso para um mestrado?', a: 'A maioria pede 2,5 convertido ou melhor; programas concorridos querem 2,0 ou melhor, e bolsas buscam a banda 1,x. Os requisitos são publicados por programa.' },
        { q: 'Um 2,0 alemão é boa nota?', a: 'Sim — 2,0 fica na banda «gut» e é competitivo para a maioria das admissões de mestrado e muitas bolsas. A escala é invertida: números menores são melhores.' },
        { q: 'Quem converte minhas notas oficialmente?', a: 'O uni-assist (via VPD) ou o setor de admissões da universidade. Conhecer sua nota convertida antes, com uma calculadora, permite mirar cursos onde ela compete de verdade.' },
      ],
    },
    ru: {
      title: 'Немецкая система оценок: переведите свой средний балл по баварской формуле (2026)',
      summary: 'Немецкие оценки — от 1,0 (лучшая) до 5,0. Как баварская формула переводит иностранный средний балл, что считается «хорошей» оценкой и почему 1,7 лучше 2,5.',
      content: `В Германии 1,0 — совершенство, а 4,0 — еле-еле сдал: ровно наоборот по сравнению с большинством стран. Если вы поступаете в немецкий вуз или признаёте диплом, приёмная комиссия переведёт ваши оценки по одной конкретной формуле — и понять её ДО подачи значит повлиять на то, куда вас возьмут.

💡 **Быстрый путь:** переведите свой балл в немецкую шкалу за секунды в бесплатном [Калькуляторе немецких оценок](/tools/german-grade-calculator) — он применяет официальную баварскую формулу с правильной шкалой вашей страны.

## Немецкая шкала в расшифровке

- **1,0–1,5:** sehr gut (отлично) — элитная полоса, нужна для медицины и топ-стипендий.
- **1,6–2,5:** gut (хорошо) — конкурентно для большинства магистратур.
- **2,6–3,5:** befriedigend (удовлетворительно) — хватает для многих программ, впритык для селективных.
- **3,6–4,0:** ausreichend (достаточно) — сдал.
- **Выше 4,0:** не сдал.

Контринтуитивное правило номер один: МЕНЬШЕ — ЛУЧШЕ. Немецкая 1,7 — сильный результат; 2,5 — середина.

## Баварская формула (modifizierte bayerische Formel)

Почти каждый немецкий вуз переводит иностранные оценки одной формулой: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin), где Nmax — лучшая возможная оценка вашей системы, Nmin — минимальный проходной балл, Nd — ваша оценка. Пример: российская «4,5» из 5 (проходной 3) даёт 1 + 3 × (5 − 4,5) / (5 − 3) = **1,75** — очень сильная немецкая оценка.

Не прикидывайте на глаз — небольшие различия в Nmin сильно меняют результат, поэтому в [Калькуляторе немецких оценок](/tools/german-grade-calculator) уже встроены правильные шкалы по странам.

## Почему это так важно

- **Numerus clausus (NC):** программы с ограниченным набором принимают строго по переведённой оценке.
- **Приём в магистратуру** часто требует переведённые 2,5 или лучше.
- **Стипендии** (DAAD и другие) смотрят на полосы 1,x–2,0.
- **Uni-assist** — центр, через который подаются большинство иностранцев, — использует этот перевод в документе VPD.

Если переведённая оценка на грани, помогает стратегия: подавайтесь на программы без NC, подчёркивайте сильные оценки по профильным предметам вместо среднего, и помните, что вузы прикладных наук (HAW/FH) часто учитывают опыт работы наряду с оценками. А признаётся ли сам диплом — проверьте сначала в [Мастере Anerkennung](/tools/anerkennung-wizard): признание и перевод оценок — отдельные шаги, которые постоянно путают.

## Типичные ошибки

- Считать, что ваши «80%» везде значат одно и то же — 80% из 20-балльной, 10-балльной или буквенной системы переводятся совсем по-разному.
- Брать общий средний балл, когда программа принимает по профильным предметам.
- Игнорировать Nmin: система с проходным 50% переводится не так, как с проходным 40%.
- Ждать, пока uni-assist раскроет оценку после оплаты — узнайте своё число ЗАРАНЕЕ в [Калькуляторе немецких оценок](/tools/german-grade-calculator) и выбирайте программы, где оно реально конкурентно.`,
      faqs: [
        { q: 'Как работает немецкая система оценок?', a: 'От 1,0 (лучшая) до 4,0 (едва сдал); выше 4,0 — незачёт. Меньше — лучше: 1,0–1,5 отлично, до 2,5 хорошо, 3,5 удовлетворительно, 4,0 достаточно.' },
        { q: 'Что такое баварская формула?', a: 'Стандартный перевод иностранных оценок: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin). Она проецирует вашу шкалу на немецкую 1,0–4,0 через лучшую и проходную оценки вашей системы.' },
        { q: 'Какая немецкая оценка нужна для магистратуры?', a: 'Большинство программ требуют переведённые 2,5 или лучше; конкурентные — 2,0 и лучше, стипендии обычно ищут полосу 1,x. Требования публикуются по каждой программе.' },
        { q: 'Немецкая 2,0 — это хорошая оценка?', a: 'Да — 2,0 находится в полосе «gut» и конкурентна для большинства магистратур и многих стипендий. Шкала перевёрнута: меньшие числа лучше.' },
        { q: 'Кто официально переводит мои оценки?', a: 'Uni-assist (через VPD) или приёмная комиссия вуза. Зная переведённую оценку заранее через калькулятор, вы целитесь в программы, где она действительно конкурентна.' },
      ],
    },
    hi: {
      title: 'जर्मन ग्रेड सिस्टम समझाया गया: बवेरियन फ़ॉर्मूले से अपना GPA बदलें (2026)',
      summary: 'जर्मन ग्रेड 1.0 (सर्वश्रेष्ठ) से 5.0 तक चलते हैं। बवेरियन फ़ॉर्मूला आपके विदेशी GPA को कैसे बदलता है, «अच्छा» ग्रेड क्या है, और 1.7 क्यों 2.5 से बेहतर है।',
      content: `जर्मनी में 1.0 पूर्णता है और 4.0 बमुश्किल पास — ज़्यादातर देशों के सिस्टम का ठीक उल्टा। अगर आप जर्मन विश्वविद्यालय में आवेदन कर रहे हैं या डिग्री की मान्यता करा रहे हैं, तो प्रवेश कार्यालय आपके ग्रेड एक ख़ास फ़ॉर्मूले से बदलेंगे — और आवेदन से पहले इसे समझना तय कर सकता है कि आपको कहाँ दाख़िला मिलेगा।

💡 **शॉर्टकट:** अपना GPA सेकंडों में जर्मन स्केल में बदलें — मुफ़्त [जर्मन ग्रेड कैलकुलेटर](/tools/german-grade-calculator) आपके देश के ग्रेडिंग स्केल के साथ आधिकारिक बवेरियन फ़ॉर्मूला लागू करता है।

## जर्मन स्केल, डिकोड किया हुआ

- **1.0–1.5:** sehr gut (बहुत अच्छा) — एलीट बैंड, मेडिसिन और शीर्ष स्कॉलरशिप के लिए ज़रूरी।
- **1.6–2.5:** gut (अच्छा) — ज़्यादातर मास्टर्स के लिए प्रतिस्पर्धी।
- **2.6–3.5:** befriedigend (संतोषजनक) — कई प्रोग्रामों के लिए ठीक, चुनिंदा के लिए तंग।
- **3.6–4.0:** ausreichend (पर्याप्त) — पास।
- **4.0 से ऊपर:** फ़ेल।

उलटा नियम नंबर एक: कम = बेहतर। जर्मन 1.7 मज़बूत नतीजा है; 2.5 औसत।

## बवेरियन फ़ॉर्मूला (modifizierte bayerische Formel)

लगभग हर जर्मन विश्वविद्यालय विदेशी ग्रेड इसी फ़ॉर्मूले से बदलता है: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin), जहाँ Nmax आपके सिस्टम का सर्वोत्तम संभव ग्रेड, Nmin न्यूनतम पासिंग ग्रेड, और Nd आपका ग्रेड। उदाहरण: 10 में से 8.0 CGPA (पास 4 पर) देता है 1 + 3 × (10 − 8) / (10 − 4) = **2.0** — बहुत ठोस जर्मन ग्रेड।

अंदाज़े से न करें — Nmin के छोटे फ़र्क़ नतीजा बहुत बदल देते हैं, इसीलिए [जर्मन ग्रेड कैलकुलेटर](/tools/german-grade-calculator) में हर देश के सही स्केल पहले से हैं।

## यह इतना क्यों मायने रखता है

- **Numerus clausus (NC):** सीमित सीटों वाले प्रोग्राम सख़्ती से परिवर्तित ग्रेड से दाख़िला देते हैं।
- **मास्टर्स प्रवेश** अक्सर परिवर्तित 2.5 या बेहतर माँगते हैं।
- **स्कॉलरशिप** (DAAD आदि) 1.x–2.0 बैंड देखती हैं।
- **Uni-assist** — जिससे ज़्यादातर अंतरराष्ट्रीय आवेदन जाते हैं — आपकी VPD में यही रूपांतरण इस्तेमाल करता है।

अगर परिवर्तित ग्रेड सीमा पर है, तो रणनीति मदद करती है: बिना NC वाले प्रोग्राम चुनें, औसत की जगह मज़बूत विषय-ग्रेड उभारें, और याद रखें कि एप्लाइड साइंसेज़ विश्वविद्यालय (HAW/FH) अक्सर ग्रेड के साथ कार्य-अनुभव भी तौलते हैं। आपकी डिग्री ख़ुद मान्य है या नहीं, यह पहले [Anerkennung विज़ार्ड](/tools/anerkennung-wizard) से जाँचें — मान्यता और रूपांतरण अलग-अलग क़दम हैं जिन्हें लोग हमेशा गड्ड-मड्ड करते हैं।

## आम गलतियाँ

- मान लेना कि आपका «80%» हर जगह एक ही मतलब रखता है — 20-पॉइंट, 10-पॉइंट या लेटर सिस्टम से 80% बहुत अलग बदलता है।
- जब प्रोग्राम विषय-विशेष ग्रेड से दाख़िला देता है तब कुल औसत इस्तेमाल करना।
- Nmin की अनदेखी: 50% पर पास होने वाला सिस्टम 40% वाले जैसा नहीं बदलता।
- भुगतान के बाद uni-assist के ग्रेड बताने का इंतज़ार — पहले [जर्मन ग्रेड कैलकुलेटर](/tools/german-grade-calculator) से अपना नंबर जानें, फिर वही प्रोग्राम चुनें जहाँ वह सच में टिकता है।`,
      faqs: [
        { q: 'जर्मन ग्रेडिंग सिस्टम कैसे काम करता है?', a: '1.0 (सर्वश्रेष्ठ) से 4.0 (बमुश्किल पास) तक; 4.0 से ऊपर फ़ेल। कम बेहतर है: 1.0–1.5 बहुत अच्छा, 2.5 तक अच्छा, 3.5 संतोषजनक, 4.0 पर्याप्त।' },
        { q: 'बवेरियन फ़ॉर्मूला क्या है?', a: 'विदेशी ग्रेड का मानक रूपांतरण: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin)। यह आपके सिस्टम के सर्वोत्तम और पासिंग ग्रेड से आपकी स्केल को जर्मन 1.0–4.0 स्केल पर ले जाता है।' },
        { q: 'मास्टर्स के लिए कौन-सा जर्मन ग्रेड चाहिए?', a: 'ज़्यादातर प्रोग्राम परिवर्तित 2.5 या बेहतर माँगते हैं; प्रतिस्पर्धी प्रोग्राम 2.0 या बेहतर, और स्कॉलरशिप आमतौर पर 1.x बैंड। शर्तें प्रोग्राम-वार दी जाती हैं।' },
        { q: 'क्या जर्मन 2.0 अच्छा ग्रेड है?', a: 'हाँ — 2.0 «gut» बैंड में है और ज़्यादातर मास्टर्स दाख़िलों और कई स्कॉलरशिप के लिए प्रतिस्पर्धी है। स्केल उलटा है: छोटे अंक बेहतर हैं।' },
        { q: 'मेरे ग्रेड आधिकारिक रूप से कौन बदलता है?', a: 'Uni-assist (VPD के ज़रिए) या विश्वविद्यालय का प्रवेश कार्यालय। कैलकुलेटर से पहले ही अपना परिवर्तित ग्रेड जानने से आप वही प्रोग्राम चुन पाते हैं जहाँ आपका ग्रेड टिकता है।' },
      ],
    },
    ur: {
      title: 'جرمن گریڈ سسٹم کی وضاحت: باویرین فارمولے سے اپنا GPA بدلیں (2026)',
      summary: 'جرمن گریڈ 1.0 (بہترین) سے 5.0 تک ہیں۔ باویرین فارمولا آپ کے غیر ملکی GPA کو کیسے بدلتا ہے، «اچھا» گریڈ کیا ہے، اور 1.7 کیوں 2.5 سے بہتر ہے۔',
      content: `جرمنی میں 1.0 کمال ہے اور 4.0 بمشکل پاس — زیادہ تر ملکوں کے نظام کا بالکل الٹ۔ اگر آپ جرمن یونیورسٹی میں درخواست دے رہے ہیں یا ڈگری تسلیم کروا رہے ہیں تو داخلہ دفتر آپ کے گریڈ ایک مخصوص فارمولے سے بدلے گا — اور درخواست سے پہلے اسے سمجھنا طے کر سکتا ہے کہ داخلہ کہاں ملے گا۔

💡 **شارٹ کٹ:** اپنا GPA سیکنڈوں میں جرمن اسکیل میں بدلیں — مفت [جرمن گریڈ کیلکولیٹر](/tools/german-grade-calculator) آپ کے ملک کے گریڈنگ اسکیل کے ساتھ سرکاری باویرین فارمولا لگاتا ہے۔

## جرمن اسکیل، آسان زبان میں

- **1.0–1.5:** sehr gut (بہت اچھا) — اشرافیہ بینڈ؛ میڈیسن اور بڑی اسکالرشپس کے لیے درکار۔
- **1.6–2.5:** gut (اچھا) — زیادہ تر ماسٹرز کے لیے مسابقتی۔
- **2.6–3.5:** befriedigend (تسلی بخش) — کئی پروگراموں کے لیے کافی، منتخب کے لیے تنگ۔
- **3.6–4.0:** ausreichend (کافی) — پاس۔
- **4.0 سے اوپر:** فیل۔

الٹا اصول نمبر ایک: کم = بہتر۔ جرمن 1.7 مضبوط نتیجہ ہے؛ 2.5 اوسط۔

## باویرین فارمولا (modifizierte bayerische Formel)

تقریباً ہر جرمن یونیورسٹی غیر ملکی گریڈ اسی فارمولے سے بدلتی ہے: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin)، جہاں Nmax آپ کے نظام کا بہترین ممکنہ گریڈ، Nmin کم از کم پاسنگ گریڈ، اور Nd آپ کا گریڈ۔ مثال: 10 میں سے 8.0 CGPA (پاس 4 پر) دیتا ہے 1 + 3 × (10 − 8) / (10 − 4) = **2.0** — بہت ٹھوس جرمن گریڈ۔

اندازے سے نہ کریں — Nmin کے چھوٹے فرق نتیجہ بہت بدل دیتے ہیں؛ اسی لیے [جرمن گریڈ کیلکولیٹر](/tools/german-grade-calculator) میں ہر ملک کے درست اسکیل پہلے سے موجود ہیں۔

## یہ اتنا اہم کیوں ہے

- **Numerus clausus (NC):** محدود نشستوں والے پروگرام سختی سے تبدیل شدہ گریڈ پر داخلہ دیتے ہیں۔
- **ماسٹرز داخلے** اکثر تبدیل شدہ 2.5 یا بہتر مانگتے ہیں۔
- **اسکالرشپس** (DAAD وغیرہ) 1.x–2.0 بینڈ دیکھتی ہیں۔
- **Uni-assist** — جس سے زیادہ تر بین الاقوامی درخواستیں جاتی ہیں — آپ کی VPD میں یہی تبدیلی استعمال کرتا ہے۔

اگر تبدیل شدہ گریڈ سرحد پر ہے تو حکمتِ عملی مدد دیتی ہے: بغیر NC والے پروگرام چنیں، اوسط کی بجائے مضبوط مضمونی گریڈ اجاگر کریں، اور یاد رکھیں کہ اپلائیڈ سائنسز یونیورسٹیاں (HAW/FH) اکثر گریڈ کے ساتھ کام کا تجربہ بھی تولتی ہیں۔ آپ کی ڈگری خود تسلیم ہوتی ہے یا نہیں، یہ پہلے [تسلیمِ اسناد وزارڈ](/tools/anerkennung-wizard) سے جانچیں — تسلیم اور تبدیلی دو الگ مراحل ہیں جنہیں لوگ ہمیشہ خلط ملط کرتے ہیں۔

## عام غلطیاں

- یہ سمجھنا کہ آپ کا «80%» ہر جگہ ایک ہی معنی رکھتا ہے — 20 پوائنٹ، 10 پوائنٹ یا حرفی نظام سے 80% بہت مختلف بدلتا ہے۔
- جب پروگرام مخصوص مضامین کے گریڈ پر داخلہ دے تو مجموعی اوسط استعمال کرنا۔
- Nmin کو نظرانداز کرنا: 50% پر پاس ہونے والا نظام 40% والے جیسا نہیں بدلتا۔
- ادائیگی کے بعد uni-assist کے گریڈ بتانے کا انتظار — پہلے اپنا نمبر [جرمن گریڈ کیلکولیٹر](/tools/german-grade-calculator) سے جانیں، پھر وہ پروگرام چنیں جہاں وہ واقعی مقابلہ کرتا ہے۔`,
      faqs: [
        { q: 'جرمن گریڈنگ سسٹم کیسے کام کرتا ہے؟', a: '1.0 (بہترین) سے 4.0 (بمشکل پاس) تک؛ 4.0 سے اوپر فیل۔ کم بہتر ہے: 1.0–1.5 بہت اچھا، 2.5 تک اچھا، 3.5 تسلی بخش، 4.0 کافی۔' },
        { q: 'باویرین فارمولا کیا ہے؟', a: 'غیر ملکی گریڈوں کی معیاری تبدیلی: x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin)۔ یہ آپ کے نظام کے بہترین اور پاسنگ گریڈ سے آپ کے اسکیل کو جرمن 1.0–4.0 اسکیل پر لے جاتا ہے۔' },
        { q: 'ماسٹرز کے لیے کون سا جرمن گریڈ چاہیے؟', a: 'زیادہ تر پروگرام تبدیل شدہ 2.5 یا بہتر مانگتے ہیں؛ مسابقتی پروگرام 2.0 یا بہتر، اور اسکالرشپس عموماً 1.x بینڈ۔ شرائط ہر پروگرام کے مطابق شائع ہوتی ہیں۔' },
        { q: 'کیا جرمن 2.0 اچھا گریڈ ہے؟', a: 'جی ہاں — 2.0 «gut» بینڈ میں ہے اور زیادہ تر ماسٹرز داخلوں اور کئی اسکالرشپس کے لیے مسابقتی ہے۔ اسکیل الٹا ہے: چھوٹے اعداد بہتر ہیں۔' },
        { q: 'میرے گریڈ سرکاری طور پر کون بدلتا ہے؟', a: 'Uni-assist (VPD کے ذریعے) یا یونیورسٹی کا داخلہ دفتر۔ کیلکولیٹر سے پہلے اپنا تبدیل شدہ گریڈ جاننے سے آپ وہی پروگرام ہدف بنا سکتے ہیں جہاں آپ کا گریڈ واقعی مقابلہ کرتا ہے۔' },
      ],
    },
    zh: {
      title: '德国成绩体系详解：用巴伐利亚公式换算你的 GPA（2026）',
      summary: '德国成绩从 1.0（最好）到 5.0。巴伐利亚公式如何换算你的外国成绩、什么算「好成绩」，以及为什么 1.7 比 2.5 强。',
      content: `在德国，1.0 是满分，4.0 勉强及格——和大多数国家的体系正好相反。如果你在申请德国大学或办理学历认证，招生办会用一个特定公式换算你的成绩——在申请之前搞懂它，可能直接决定你能进哪所学校。

💡 **捷径：** 用免费的[德国成绩计算器](/tools/german-grade-calculator)几秒钟把 GPA 换算成德国分制——它按你所在国家的评分体系套用官方巴伐利亚公式。

## 德国分制解码

- **1.0–1.5：** sehr gut（优秀）——精英区间，医学和顶级奖学金的门槛。
- **1.6–2.5：** gut（良好）——大多数硕士项目的竞争线。
- **2.6–3.5：** befriedigend（中等）——许多项目够用，热门项目吃紧。
- **3.6–4.0：** ausreichend（及格）——通过。
- **高于 4.0：** 不及格。

反直觉规则第一条：数字越小越好。德国的 1.7 是很强的成绩；2.5 只是平均水平。

## 巴伐利亚公式（modifizierte bayerische Formel）

几乎所有德国大学都用同一个公式换算外国成绩：x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin)，其中 Nmax 是你所在体系的最高分，Nmin 是最低及格分，Nd 是你的成绩。例子：百分制 85 分（60 分及格）换算为 1 + 3 × (100 − 85) / (100 − 60) = **2.1**——相当扎实的德国成绩。

别靠目测——Nmin 的细微差别会大幅改变结果，这正是[德国成绩计算器](/tools/german-grade-calculator)内置各国正确评分体系的原因。

## 为什么如此重要

- **Numerus clausus（NC）名额限制：** 有名额上限的专业严格按换算成绩录取。
- **硕士录取**常要求换算后 2.5 或更好。
- **奖学金**（DAAD 等）通常看 1.x–2.0 区间。
- **Uni-assist** ——大多数国际学生递交申请的中转机构——在你的 VPD 文件中就用这个换算。

如果换算成绩在边缘，策略能帮忙：申请无 NC 的专业、突出强势科目成绩而非平均分，并记住应用科学大学（HAW/FH）往往把工作经验和成绩一起衡量。至于你的学位本身是否被承认，先跑一遍[学历认证向导](/tools/anerkennung-wizard)——认证和换算是两回事，人们总把它们搞混。

## 常见错误

- 以为你的「80%」在哪里都一样——从 20 分制、10 分制或字母制换算出来的 80% 大不相同。
- 项目按单科成绩录取时却用总平均分。
- 忽略 Nmin：50% 及格的体系和 40% 及格的体系换算结果差很多。
- 等 uni-assist 收了钱才知道成绩——先用[德国成绩计算器](/tools/german-grade-calculator)算出你的数字，再挑那些它真正有竞争力的项目。`,
      faqs: [
        { q: '德国的评分体系是怎样的？', a: '从 1.0（最好）到 4.0（勉强及格）；高于 4.0 为不及格。越小越好：1.0–1.5 优秀，2.5 以内良好，3.5 中等，4.0 及格。' },
        { q: '什么是巴伐利亚公式？', a: '外国成绩的标准换算公式：x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin)。它用你所在体系的最高分和及格分，把你的分数映射到德国 1.0–4.0 分制。' },
        { q: '申请硕士需要什么德国成绩？', a: '大多数项目要求换算后 2.5 或更好；热门项目要 2.0 以上，奖学金通常看 1.x 区间。具体要求按项目公布。' },
        { q: '德国 2.0 算好成绩吗？', a: '算——2.0 处于「gut」区间，对大多数硕士录取和许多奖学金都有竞争力。记住分制是倒的：数字越小越好。' },
        { q: '谁来官方换算我的成绩？', a: 'Uni-assist（通过 VPD 文件）或大学招生办。先用计算器知道自己的换算成绩，就能瞄准成绩真正有竞争力的项目。' },
      ],
    },
  },
}
