import type { Level } from './types'

export const A1: Level = {
  id: 'A1',
  title: 'المستوى الأول',
  description: 'تعلم أساسيات اللغة الألمانية — من الصفر إلى التواصل اليومي.',
  color: 'bg-green-500',
  emoji: '🌱',
  lessons: [
    // ─────────────────────────────────────────────
    // LESSON 1 — التعريف بالنفس
    // ─────────────────────────────────────────────
    {
      id: 'a1-01',
      title: 'التعريف بالنفس — Sich vorstellen',
      order: 1,
      grammar: {
        title: 'فعل sein الكامل + أسئلة W-Fragen',
        content: `فعل **sein** (يكون) هو أهم فعل في الألمانية. يُستخدم للتعريف بالنفس، وتحديد المهنة، والحالة، والمكان.

**هيكل الجملة الألمانية البسيطة:**
الفاعل (Subjekt) + الفعل (Verb) + باقي الجملة
→ Ich **bin** Ahmed. / Ich **komme** aus Marokko.

**القاعدة الذهبية:** الفعل دائماً في المكان الثاني في الجملة الخبرية.`,
        tables: [
          {
            title: 'تصريف فعل sein (يكون)',
            headers: ['Pronomen', 'sein', 'المعنى'],
            rows: [
              { cells: ['ich', 'bin', 'أنا أكون'] },
              { cells: ['du', 'bist', 'أنت تكون'] },
              { cells: ['er / sie / es', 'ist', 'هو / هي / محايد'] },
              { cells: ['wir', 'sind', 'نحن نكون'] },
              { cells: ['ihr', 'seid', 'أنتم تكونون'] },
              { cells: ['sie / Sie', 'sind', 'هم / حضرتك'] },
            ],
            theme: 'conjugation',
            note: 'احفظ sein تماماً — سوف تستخدمه في كل جملة تعريف تقريباً.',
          },
          {
            title: 'أسئلة W-Fragen الأساسية',
            headers: ['السؤال', 'الترجمة', 'مثال'],
            rows: [
              { cells: ['Wie heißt du?', 'ما اسمك؟', 'Ich heiße Ahmed.'] },
              { cells: ['Woher kommst du?', 'من أين أنت؟', 'Ich komme aus Marokko.'] },
              { cells: ['Wo wohnst du?', 'أين تسكن؟', 'Ich wohne in Berlin.'] },
              { cells: ['Wie alt bist du?', 'كم عمرك؟', 'Ich bin 25 Jahre alt.'] },
              { cells: ['Was machst du?', 'ماذا تعمل؟', 'Ich bin Student.'] },
              { cells: ['Sprechen Sie Deutsch?', 'هل تتكلم الألمانية؟', 'Ja, ein bisschen.'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'في اللغة الرسمية استخدم Sie (بحرف كبير) مع الغرباء وكبار السن.',
            example: 'Wie heißen Sie? — Ich heiße Youssef El Amrani.',
            translation: 'ما اسم حضرتك؟ — اسمي يوسف العمراني.',
          },
          {
            rule: 'في اللغة غير الرسمية استخدم du مع الأصدقاء والأقران والعائلة.',
            example: 'Wie heißt du? — Ich heiße Sara.',
            translation: 'ما اسمك؟ — اسمي سارة.',
          },
          {
            rule: 'الفعل يأخذ دائماً المكان الثاني في الجملة الخبرية.',
            example: 'Heute bin ich in München.',
            translation: 'اليوم أنا في ميونخ. (الظرف في المكان الأول، الفعل في الثاني)',
          },
        ],
        examples: [
          'Ich bin Ahmed. Ich komme aus Marokko. — أنا أحمد. أنا من المغرب.',
          'Ich wohne in Berlin. Ich bin 25 Jahre alt. — أسكن في برلين. عمري 25 سنة.',
          'Wie heißt du? — Ich heiße Sara. — ما اسمك؟ — اسمي سارة.',
          'Woher kommst du? — Ich komme aus Casablanca. — من أين أنت؟ — أنا من الدار البيضاء.',
          'Was machst du? — Ich bin Student. — ماذا تعمل؟ — أنا طالب.',
          'Sprechen Sie Deutsch? — Ja, ein bisschen. — هل تتكلم الألمانية؟ — نعم، قليلاً.',
          'Das ist mein Freund Karim. Er ist aus Rabat. — هذا صديقي كريم. هو من الرباط.',
          'Freut mich, Sie kennenzulernen! — سعيد بلقائك!',
        ],
        tip: '💡 عند التعريف بنفسك في ألمانيا، ابدأ بـ "Hallo" أو "Guten Tag"، ثم اسمك، ثم من أين أنت، ثم مهنتك. هذا الترتيب طبيعي ومقبول في كل المواقف.',
      },
      vocabulary: [
        { german: 'heißen', arabic: 'يُسمى / اسمه', example: 'Ich heiße Ahmed.', exampleArabic: 'اسمي أحمد.', type: 'verb' },
        { german: 'kommen aus', arabic: 'يأتي من / أصله من', example: 'Ich komme aus Marokko.', exampleArabic: 'أنا من المغرب.', type: 'verb' },
        { german: 'wohnen in', arabic: 'يسكن في', example: 'Ich wohne in Berlin.', exampleArabic: 'أسكن في برلين.', type: 'verb' },
        { german: 'sprechen', arabic: 'يتكلم', example: 'Ich spreche Arabisch und Deutsch.', exampleArabic: 'أتحدث العربية والألمانية.', type: 'verb' },
        { german: 'lernen', arabic: 'يتعلم', example: 'Ich lerne Deutsch.', exampleArabic: 'أتعلم الألمانية.', type: 'verb' },
        { german: 'verstehen', arabic: 'يفهم', example: 'Ich verstehe nicht.', exampleArabic: 'أنا لا أفهم.', type: 'verb' },
        { german: 'Sprache', arabic: 'اللغة', gender: 'die', plural: 'Sprachen', example: 'Welche Sprache sprichst du?', exampleArabic: 'أي لغة تتكلم؟', type: 'noun' },
        { german: 'Name', arabic: 'الاسم', gender: 'der', plural: 'Namen', example: 'Mein Name ist Fatima.', exampleArabic: 'اسمي فاطمة.', type: 'noun' },
        { german: 'Student', arabic: 'الطالب', gender: 'der', plural: 'Studenten', example: 'Ich bin Student.', exampleArabic: 'أنا طالب.', type: 'noun' },
        { german: 'Studentin', arabic: 'الطالبة', gender: 'die', plural: 'Studentinnen', example: 'Sie ist Studentin.', exampleArabic: 'هي طالبة.', type: 'noun' },
        { german: 'Freund', arabic: 'الصديق', gender: 'der', plural: 'Freunde', example: 'Das ist mein Freund.', exampleArabic: 'هذا صديقي.', type: 'noun' },
        { german: 'Nationalität', arabic: 'الجنسية', gender: 'die', plural: 'Nationalitäten', example: 'Meine Nationalität ist marokkanisch.', exampleArabic: 'جنسيتي مغربية.', type: 'noun' },
        { german: 'Land', arabic: 'البلد', gender: 'das', plural: 'Länder', example: 'Mein Land ist Marokko.', exampleArabic: 'بلدي هو المغرب.', type: 'noun' },
        { german: 'Marokko', arabic: 'المغرب', example: 'Ich komme aus Marokko.', exampleArabic: 'أنا من المغرب.', type: 'noun' },
        { german: 'Deutschland', arabic: 'ألمانيا', example: 'Ich wohne in Deutschland.', exampleArabic: 'أسكن في ألمانيا.', type: 'noun' },
        { german: 'marokkanisch', arabic: 'مغربي', example: 'Ich bin marokkanisch.', exampleArabic: 'أنا مغربي.', type: 'adjective' },
        { german: 'deutsch', arabic: 'ألماني', example: 'Er ist deutsch.', exampleArabic: 'هو ألماني.', type: 'adjective' },
        { german: 'verheiratet', arabic: 'متزوج', example: 'Ich bin verheiratet.', exampleArabic: 'أنا متزوج.', type: 'adjective' },
        { german: 'ledig', arabic: 'أعزب', example: 'Ich bin noch ledig.', exampleArabic: 'ما زلت أعزب.', type: 'adjective' },
        { german: 'Hallo', arabic: 'مرحبا', example: 'Hallo, wie geht\'s?', exampleArabic: 'مرحبا، كيف الحال؟', type: 'phrase' },
        { german: 'Guten Tag', arabic: 'طاب يومك (رسمي)', example: 'Guten Tag, Herr Müller!', exampleArabic: 'طاب يومك يا سيد مولر!', type: 'phrase' },
        { german: 'Freut mich', arabic: 'سعيد بلقائك', example: 'Freut mich, dich kennenzulernen.', exampleArabic: 'سعيد بالتعرف عليك.', type: 'phrase' },
        { german: 'Ja / Nein', arabic: 'نعم / لا', example: 'Ja, ich komme aus Marokko.', exampleArabic: 'نعم، أنا من المغرب.', type: 'adverb' },
        { german: 'Bitte / Danke', arabic: 'من فضلك / شكراً', example: 'Danke schön!', exampleArabic: 'شكراً جزيلاً!', type: 'phrase' },
      ],
      exercise: {
        questions: [
          {
            type: 'multiple-choice', id: 'a1-01-q1',
            question: 'كيف تقول "أنا أحمد" بالألمانية؟',
            options: ['Du bist Ahmed.', 'Ich bin Ahmed.', 'Er ist Ahmed.', 'Wir sind Ahmed.'],
            answer: 'Ich bin Ahmed.',
          },
          {
            type: 'fill-blank', id: 'a1-01-q2',
            question: 'أكمل الجملة: "Ich ___ aus Marokko." (أنا من المغرب)',
            answer: 'komme',
            hint: 'تصريف فعل kommen مع ich',
          },
          {
            type: 'multiple-choice', id: 'a1-01-q3',
            question: 'ما هو فعل sein مع ضمير "ihr"؟',
            options: ['bin', 'sind', 'seid', 'bist'],
            answer: 'seid',
          },
          {
            type: 'drag-drop', id: 'a1-01-q4',
            question: 'رتّب الكلمات لتكوين جملة صحيحة:',
            words: ['Ich', 'aus', 'komme', 'Marokko'],
            answer: 'Ich komme aus Marokko',
            hint: 'الفاعل + الفعل + حرف الجر + البلد',
          },
          {
            type: 'matching', id: 'a1-01-q5',
            question: 'اربط كل سؤال بإجابته المناسبة:',
            pairs: [
              { left: 'Wie heißt du?', right: 'Ich heiße Sara.' },
              { left: 'Woher kommst du?', right: 'Ich komme aus Marokko.' },
              { left: 'Wo wohnst du?', right: 'Ich wohne in Berlin.' },
              { left: 'Wie alt bist du?', right: 'Ich bin 25 Jahre alt.' },
            ],
            answer: 'matched',
          },
          {
            type: 'fill-blank', id: 'a1-01-q6',
            question: 'أكمل السؤال: "___ heißt du?" (ما اسمك؟)',
            answer: 'Wie',
            hint: 'كلمة سؤال تعني "كيف / ما"',
          },
          {
            type: 'multiple-choice', id: 'a1-01-q7',
            question: 'كيف تسأل "من أين أنت؟" بالألمانية؟',
            options: ['Wo wohnst du?', 'Wie alt bist du?', 'Woher kommst du?', 'Was machst du?'],
            answer: 'Woher kommst du?',
          },
          {
            type: 'speaking', id: 'a1-01-q8',
            question: 'قل بالألمانية: "اسمي (اسمك) وأنا من المغرب"',
            answer: 'Ich heiße ... und ich komme aus Marokko',
            hint: 'استخدم heißen و kommen aus',
          },
          {
            type: 'fill-blank', id: 'a1-01-q9',
            question: 'استمع ثم أكمل: "Ich ___ Student."',
            audioPrompt: 'Ich bin Student.',
            answer: 'bin',
            hint: 'فعل sein مع ich',
          },
          {
            type: 'drag-drop', id: 'a1-01-q10',
            question: 'رتّب: "ما اسم حضرتك؟" (رسمي)',
            words: ['Wie', 'heißen', 'Sie', '?'],
            answer: 'Wie heißen Sie ?',
            hint: 'السؤال يبدأ بـ Wie، الفعل في المكان الثاني',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 2 — الأرقام
    // ─────────────────────────────────────────────
    {
      id: 'a1-02',
      title: 'الأرقام والأسعار — Zahlen und Preise',
      order: 2,
      grammar: {
        title: 'الأرقام من 1 إلى 100 — قواعد وأنماط',
        content: `الأرقام الألمانية لها نمط مميز: **العشرات تأتي بعد الآحاد** (وليس قبلها كما في العربية والإنجليزية).

**مثال:** 21 = einundzwanzig = واحد + و + عشرون`,
        tables: [
          {
            title: 'الأرقام من 0 إلى 12 (تُحفظ كما هي)',
            headers: ['Zahl', 'Deutsch', 'Zahl', 'Deutsch'],
            rows: [
              { cells: ['0', 'null', '7', 'sieben'] },
              { cells: ['1', 'eins', '8', 'acht'] },
              { cells: ['2', 'zwei', '9', 'neun'] },
              { cells: ['3', 'drei', '10', 'zehn'] },
              { cells: ['4', 'vier', '11', 'elf'] },
              { cells: ['5', 'fünf', '12', 'zwölf'] },
              { cells: ['6', 'sechs', '—', '—'] },
            ],
            theme: 'default',
          },
          {
            title: 'الأرقام من 13 إلى 19 — قاعدة: رقم + zehn',
            headers: ['Zahl', 'Deutsch', 'ملاحظة'],
            rows: [
              { cells: ['13', 'dreizehn', 'drei + zehn'] },
              { cells: ['14', 'vierzehn', 'vier + zehn'] },
              { cells: ['15', 'fünfzehn', 'fünf + zehn'] },
              { cells: ['16', 'sechzehn', '⚠️ sechs → sech'] },
              { cells: ['17', 'siebzehn', '⚠️ sieben → sieb'] },
              { cells: ['18', 'achtzehn', 'acht + zehn'] },
              { cells: ['19', 'neunzehn', 'neun + zehn'] },
            ],
            theme: 'default',
          },
          {
            title: 'العشرات من 20 إلى 100',
            headers: ['Zahl', 'Deutsch', 'Zahl', 'Deutsch'],
            rows: [
              { cells: ['20', 'zwanzig', '60', 'sechzig'] },
              { cells: ['30', 'dreißig', '70', 'siebzig'] },
              { cells: ['40', 'vierzig', '80', 'achtzig'] },
              { cells: ['50', 'fünfzig', '90', 'neunzig'] },
              { cells: ['100', 'hundert', '1000', 'tausend'] },
            ],
            theme: 'default',
            note: '⚠️ 30 تُكتب dreißig بـ ß (وليس z)',
          },
        ],
        rules: [
          {
            rule: 'الأرقام المركبة (21-99): الآحاد + und + العشرات — كلمة واحدة!',
            example: 'einundzwanzig (21), fünfunddreißig (35), neunundneunzig (99)',
            translation: 'واحد وعشرون، خمسة وثلاثون، تسعة وتسعون',
          },
          {
            rule: 'السعر باليورو: الرقم + Euro (بدون s في الجمع)',
            example: 'Das kostet fünfzehn Euro und zwanzig Cent.',
            translation: 'هذا يكلف 15 يورو و20 سنت.',
          },
          {
            rule: 'عند السؤال عن السعر استخدم "Wie viel kostet...?"',
            example: 'Wie viel kostet das Brot? — Zwei Euro fünfzig.',
            translation: 'كم يكلف الخبز؟ — 2.50 يورو.',
          },
        ],
        examples: [
          'Ich bin dreiundzwanzig Jahre alt. — عمري 23 سنة.',
          'Das kostet fünfzehn Euro, bitte. — هذا يكلف 15 يورو من فضلك.',
          'Meine Handynummer ist null-eins-sieben-sechs... — رقم هاتفي هو 0176...',
          'Wir haben zwei Kinder. — لدينا طفلان.',
          'Der Bus kommt in zehn Minuten. — الحافلة تأتي بعد 10 دقائق.',
          'Das Hotel hat fünfzig Zimmer. — الفندق به 50 غرفة.',
          'Ein Kilo Äpfel kostet drei Euro. — كيلو التفاح بثلاثة يورو.',
        ],
        tip: '💡 عند قول رقم هاتف ألماني، يُلفظ رقماً رقماً (null-eins-sieben...) وليس كعدد كامل. والبادئة الألمانية هي +49.',
      },
      vocabulary: [
        { german: 'eins', arabic: '1 (واحد)', example: 'Ein Kaffee, bitte.', exampleArabic: 'قهوة من فضلك.', type: 'number' },
        { german: 'zwei', arabic: '2 (اثنان)', example: 'Ich habe zwei Brüder.', exampleArabic: 'لدي أخوان.', type: 'number' },
        { german: 'drei', arabic: '3 (ثلاثة)', example: 'drei Euro', exampleArabic: '3 يورو', type: 'number' },
        { german: 'vier', arabic: '4 (أربعة)', example: 'vier Kinder', exampleArabic: '4 أطفال', type: 'number' },
        { german: 'fünf', arabic: '5 (خمسة)', example: 'fünf Minuten', exampleArabic: '5 دقائق', type: 'number' },
        { german: 'zehn', arabic: '10 (عشرة)', example: 'zehn Euro', exampleArabic: '10 يورو', type: 'number' },
        { german: 'zwölf', arabic: '12 (اثنا عشر)', example: 'zwölf Monate', exampleArabic: '12 شهراً', type: 'number' },
        { german: 'zwanzig', arabic: '20 (عشرون)', example: 'zwanzig Euro', exampleArabic: '20 يورو', type: 'number' },
        { german: 'dreißig', arabic: '30 (ثلاثون)', example: 'dreißig Grad', exampleArabic: '30 درجة', type: 'number' },
        { german: 'hundert', arabic: '100 (مئة)', example: 'hundert Prozent', exampleArabic: '100%', type: 'number' },
        { german: 'tausend', arabic: '1000 (ألف)', example: 'tausend Euro', exampleArabic: '1000 يورو', type: 'number' },
        { german: 'kosten', arabic: 'يكلف', example: 'Wie viel kostet das?', exampleArabic: 'كم يكلف هذا؟', type: 'verb' },
        { german: 'Nummer', arabic: 'الرقم', gender: 'die', plural: 'Nummern', example: 'Wie ist deine Nummer?', exampleArabic: 'ما هو رقمك؟', type: 'noun' },
        { german: 'Euro', arabic: 'يورو', gender: 'der', example: 'Das sind zehn Euro.', exampleArabic: 'هذه عشرة يورو.', type: 'noun' },
        { german: 'Preis', arabic: 'السعر', gender: 'der', plural: 'Preise', example: 'Der Preis ist gut.', exampleArabic: 'السعر جيد.', type: 'noun' },
        { german: 'Telefonnummer', arabic: 'رقم الهاتف', gender: 'die', plural: 'Telefonnummern', example: 'Meine Telefonnummer ist...', exampleArabic: 'رقم هاتفي هو...', type: 'noun' },
        { german: 'Jahr', arabic: 'السنة', gender: 'das', plural: 'Jahre', example: 'Ich bin 25 Jahre alt.', exampleArabic: 'عمري 25 سنة.', type: 'noun' },
        { german: 'Minute', arabic: 'الدقيقة', gender: 'die', plural: 'Minuten', example: 'in fünf Minuten', exampleArabic: 'بعد 5 دقائق', type: 'noun' },
        { german: 'Stunde', arabic: 'الساعة (الفترة)', gender: 'die', plural: 'Stunden', example: 'zwei Stunden', exampleArabic: 'ساعتان', type: 'noun' },
        { german: 'viel / wenig', arabic: 'كثير / قليل', example: 'Das ist viel!', exampleArabic: 'هذا كثير!', type: 'adverb' },
      ],
      exercise: {
        questions: [
          {
            type: 'multiple-choice', id: 'a1-02-q1',
            question: 'ما هو الرقم "siebzehn"؟',
            options: ['7', '17', '70', '27'],
            answer: '17',
          },
          {
            type: 'fill-blank', id: 'a1-02-q2',
            question: 'كيف تكتب الرقم 35 بالألمانية؟',
            answer: 'fünfunddreißig',
            hint: 'الآحاد + und + العشرات',
          },
          {
            type: 'multiple-choice', id: 'a1-02-q3',
            question: 'ما معنى "Das kostet zwölf Euro"؟',
            options: ['يكلف عشرون يورو.', 'يكلف اثنا عشر يورو.', 'يكلف اثني عشر دولاراً.', 'يكلف عشرة يورو.'],
            answer: 'يكلف اثنا عشر يورو.',
          },
          {
            type: 'matching', id: 'a1-02-q4',
            question: 'اربط الرقم بكلمته الألمانية:',
            pairs: [
              { left: '13', right: 'dreizehn' },
              { left: '30', right: 'dreißig' },
              { left: '16', right: 'sechzehn' },
              { left: '60', right: 'sechzig' },
              { left: '100', right: 'hundert' },
            ],
            answer: 'matched',
          },
          {
            type: 'fill-blank', id: 'a1-02-q5',
            question: 'أكمل: "Ich bin ___ Jahre alt." (عمري 25 سنة)',
            answer: 'fünfundzwanzig',
            hint: 'خمسة وعشرون بالألمانية',
          },
          {
            type: 'multiple-choice', id: 'a1-02-q6',
            question: 'كيف تقول "مئة" بالألمانية؟',
            options: ['tausend', 'hundert', 'neunzig', 'zwanzig'],
            answer: 'hundert',
          },
          {
            type: 'fill-blank', id: 'a1-02-q7',
            question: 'استمع ثم اكتب الرقم كرقم (وليس كلمة):',
            audioPrompt: 'einundvierzig',
            answer: '41',
            hint: 'ein + und + vierzig',
          },
          {
            type: 'drag-drop', id: 'a1-02-q8',
            question: 'رتّب الجملة:',
            words: ['Das', 'kostet', 'fünfzehn', 'Euro'],
            answer: 'Das kostet fünfzehn Euro',
          },
          {
            type: 'speaking', id: 'a1-02-q9',
            question: 'قل بالألمانية: "رقم هاتفي هو 0176..."',
            answer: 'Meine Telefonnummer ist null eins sieben sechs',
            hint: 'اقرأ الأرقام رقماً رقماً',
          },
          {
            type: 'multiple-choice', id: 'a1-02-q10',
            question: 'كم يساوي "achtundneunzig"؟',
            options: ['89', '98', '88', '99'],
            answer: '98',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 3 — يومي في ألمانيا
    // ─────────────────────────────────────────────
    {
      id: 'a1-03',
      title: 'يومي في ألمانيا — Mein Alltag',
      order: 3,
      grammar: {
        title: 'تصريف الأفعال المنتظمة في المضارع — Präsens',
        content: `الأفعال المنتظمة في الألمانية تتصرف بنمط ثابت: نأخذ **الجذر** ونضيف **النهاية** حسب الضمير.

**مثال:** machen (يفعل) → الجذر: **mach** + النهاية حسب الضمير.`,
        tables: [
          {
            title: 'تصريف machen (يفعل / يصنع)',
            headers: ['Pronomen', 'Endung', 'machen'],
            rows: [
              { cells: ['ich', '-e', 'ich mache'] },
              { cells: ['du', '-st', 'du machst'] },
              { cells: ['er/sie/es', '-t', 'er macht'] },
              { cells: ['wir', '-en', 'wir machen'] },
              { cells: ['ihr', '-t', 'ihr macht'] },
              { cells: ['sie/Sie', '-en', 'sie machen'] },
            ],
            theme: 'conjugation',
          },
          {
            title: 'الأفعال الشاذة في جذرها (Stamm-Vokalwechsel)',
            headers: ['Infinitiv', 'du', 'er/sie', 'التغيير'],
            rows: [
              { cells: ['fahren', 'fährst', 'fährt', 'a → ä'] },
              { cells: ['schlafen', 'schläfst', 'schläft', 'a → ä'] },
              { cells: ['essen', 'isst', 'isst', 'e → i'] },
              { cells: ['sprechen', 'sprichst', 'spricht', 'e → i'] },
              { cells: ['sehen', 'siehst', 'sieht', 'e → ie'] },
              { cells: ['lesen', 'liest', 'liest', 'e → ie'] },
            ],
            theme: 'conjugation',
            note: 'التغيير يحدث فقط مع du و er/sie/es.',
          },
        ],
        rules: [
          {
            rule: 'الأفعال التي تنتهي بـ -ten أو -den تضاف إليها e قبل النهاية.',
            example: 'arbeiten → du arbeit**e**st / er arbeit**e**t',
            translation: 'يعمل → أنت تعمل / هو يعمل',
          },
          {
            rule: 'الفعل دائماً في المكان الثاني — حتى عندما تبدأ بظرف الزمان.',
            example: 'Morgens **trinke** ich Kaffee.',
            translation: 'في الصباح أشرب قهوة. (morgens في الأول، trinke في الثاني، ich في الثالث)',
          },
          {
            rule: 'الضمائر er (هو) و sie (هي) و es (محايد) كلها تأخذ نهاية -t.',
            example: 'Er lernt / Sie lernt / Es kostet viel.',
            translation: 'هو يتعلم / هي تتعلم / هذا يكلف كثيراً.',
          },
        ],
        examples: [
          'Ich stehe um 7 Uhr auf. — أستيقظ الساعة 7.',
          'Morgens trinke ich Kaffee und esse Brot. — صباحاً أشرب قهوة وآكل خبزاً.',
          'Ich arbeite von 9 bis 17 Uhr. — أعمل من الساعة 9 حتى 5.',
          'Abends lerne ich Deutsch. — مساءً أتعلم الألمانية.',
          'Am Wochenende schlafe ich lange. — في عطلة الأسبوع أنام كثيراً.',
          'Wir kochen zusammen. — نطبخ معاً.',
          'Er fährt mit dem Bus zur Arbeit. — يذهب إلى العمل بالحافلة.',
          'Was isst du zum Frühstück? — ماذا تأكل في الفطور؟',
        ],
        tip: '💡 لحفظ تصريف الأفعال: ركز على النهايات الأربعة الأساسية: -e (ich), -st (du), -t (er/ihr), -en (wir/sie/Sie). هذه القاعدة تنطبق على 95% من الأفعال.',
      },
      vocabulary: [
        { german: 'aufstehen', arabic: 'يستيقظ', example: 'Ich stehe um 6 Uhr auf.', exampleArabic: 'أستيقظ الساعة 6.', type: 'verb' },
        { german: 'frühstücken', arabic: 'يتناول الفطور', example: 'Ich frühstücke um 7 Uhr.', exampleArabic: 'أفطر الساعة 7.', type: 'verb' },
        { german: 'arbeiten', arabic: 'يعمل', example: 'Ich arbeite in einem Büro.', exampleArabic: 'أعمل في مكتب.', type: 'verb' },
        { german: 'lernen', arabic: 'يتعلم / يدرس', example: 'Ich lerne jeden Tag Deutsch.', exampleArabic: 'أتعلم الألمانية كل يوم.', type: 'verb' },
        { german: 'kochen', arabic: 'يطبخ', example: 'Ich koche Abendessen.', exampleArabic: 'أطبخ العشاء.', type: 'verb' },
        { german: 'schlafen', arabic: 'ينام', example: 'Ich schlafe um 23 Uhr.', exampleArabic: 'أنام الساعة 11 مساءً.', type: 'verb' },
        { german: 'essen', arabic: 'يأكل', example: 'Ich esse gern Couscous.', exampleArabic: 'أحب أكل الكسكس.', type: 'verb' },
        { german: 'trinken', arabic: 'يشرب', example: 'Ich trinke Tee.', exampleArabic: 'أشرب الشاي.', type: 'verb' },
        { german: 'fahren', arabic: 'يقود / يذهب بمركبة', example: 'Ich fahre mit dem Bus.', exampleArabic: 'أذهب بالحافلة.', type: 'verb' },
        { german: 'lesen', arabic: 'يقرأ', example: 'Ich lese ein Buch.', exampleArabic: 'أقرأ كتاباً.', type: 'verb' },
        { german: 'morgens', arabic: 'صباحاً', example: 'Morgens trinke ich Kaffee.', exampleArabic: 'صباحاً أشرب القهوة.', type: 'adverb' },
        { german: 'mittags', arabic: 'ظهراً', example: 'Mittags esse ich in der Kantine.', exampleArabic: 'ظهراً آكل في المطعم.', type: 'adverb' },
        { german: 'abends', arabic: 'مساءً', example: 'Abends sehe ich fern.', exampleArabic: 'مساءً أشاهد التلفاز.', type: 'adverb' },
        { german: 'nachts', arabic: 'ليلاً', example: 'Nachts schlafe ich.', exampleArabic: 'ليلاً أنام.', type: 'adverb' },
        { german: 'jeden Tag', arabic: 'كل يوم', example: 'Ich lerne jeden Tag.', exampleArabic: 'أتعلم كل يوم.', type: 'phrase' },
        { german: 'Wochenende', arabic: 'عطلة نهاية الأسبوع', gender: 'das', plural: 'Wochenenden', example: 'Am Wochenende schlafe ich lang.', exampleArabic: 'في العطلة أنام طويلاً.', type: 'noun' },
        { german: 'Alltag', arabic: 'الحياة اليومية', gender: 'der', example: 'Mein Alltag ist voll.', exampleArabic: 'يومي مزدحم.', type: 'noun' },
        { german: 'Arbeit', arabic: 'العمل', gender: 'die', plural: 'Arbeiten', example: 'Ich gehe zur Arbeit.', exampleArabic: 'أذهب إلى العمل.', type: 'noun' },
        { german: 'Frühstück', arabic: 'الفطور', gender: 'das', example: 'Das Frühstück ist fertig.', exampleArabic: 'الفطور جاهز.', type: 'noun' },
        { german: 'Abendessen', arabic: 'العشاء', gender: 'das', example: 'Wir essen Abendessen um 19 Uhr.', exampleArabic: 'نتعشى الساعة 7.', type: 'noun' },
        { german: 'zusammen', arabic: 'معاً', example: 'Wir essen zusammen.', exampleArabic: 'نأكل معاً.', type: 'adverb' },
        { german: 'oft / manchmal / nie', arabic: 'غالباً / أحياناً / أبداً', example: 'Ich trinke oft Tee.', exampleArabic: 'أشرب الشاي غالباً.', type: 'adverb' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a1-03-q1',
            question: 'أكمل: "Ich ___ jeden Tag Deutsch." (أتعلم كل يوم)',
            answer: 'lerne',
            hint: 'تصريف lernen مع ich: جذر lern + نهاية -e',
          },
          {
            type: 'multiple-choice', id: 'a1-03-q2',
            question: 'ما هو تصريف "arbeiten" مع "du"؟',
            options: ['du arbeitest', 'du arbeitet', 'du arbeiten', 'du arbeite'],
            answer: 'du arbeitest',
          },
          {
            type: 'fill-blank', id: 'a1-03-q3',
            question: 'أكمل: "Morgens ___ ich Kaffee." (أشرب — trinken)',
            answer: 'trinke',
            hint: 'جذر trink + نهاية -e',
          },
          {
            type: 'multiple-choice', id: 'a1-03-q4',
            question: 'ما معنى "Abends lerne ich Deutsch"؟',
            options: ['صباحاً أتعلم الألمانية.', 'مساءً أتعلم الألمانية.', 'كل يوم أتعلم.', 'ظهراً أدرس.'],
            answer: 'مساءً أتعلم الألمانية.',
          },
          {
            type: 'fill-blank', id: 'a1-03-q5',
            question: 'اكتب الجملة صحيحة: نحن نطبخ معاً — "Wir ___ zusammen."',
            answer: 'kochen',
            hint: 'تصريف kochen مع wir ينتهي بـ -en',
          },
          {
            type: 'drag-drop', id: 'a1-03-q6',
            question: 'رتّب الجملة:',
            words: ['Morgens', 'trinke', 'ich', 'Kaffee'],
            answer: 'Morgens trinke ich Kaffee',
            hint: 'الفعل في المكان الثاني',
          },
          {
            type: 'matching', id: 'a1-03-q7',
            question: 'اربط الفعل بتصريفه مع "er/sie":',
            pairs: [
              { left: 'essen', right: 'er isst' },
              { left: 'fahren', right: 'er fährt' },
              { left: 'sehen', right: 'er sieht' },
              { left: 'sprechen', right: 'er spricht' },
              { left: 'schlafen', right: 'er schläft' },
            ],
            answer: 'matched',
          },
          {
            type: 'speaking', id: 'a1-03-q8',
            question: 'قل بالألمانية: "أستيقظ الساعة 7 وأشرب قهوة"',
            answer: 'Ich stehe um sieben Uhr auf und trinke Kaffee',
            hint: 'aufstehen + trinken',
          },
          {
            type: 'fill-blank', id: 'a1-03-q9',
            question: 'استمع وأكمل: "Er ___ ein Buch." (يقرأ)',
            audioPrompt: 'Er liest ein Buch.',
            answer: 'liest',
            hint: 'lesen مع er: e → ie',
          },
          {
            type: 'multiple-choice', id: 'a1-03-q10',
            question: 'ما تصريف "fahren" مع "du"؟',
            options: ['du fahrst', 'du fährst', 'du fahrt', 'du fährt'],
            answer: 'du fährst',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 4 — في المطعم
    // ─────────────────────────────────────────────
    {
      id: 'a1-04',
      title: 'في المطعم والمتجر — Im Restaurant',
      order: 4,
      grammar: {
        title: 'أداة التعريف der/die/das + حالة المفعول به Akkusativ',
        content: `كل اسم في الألمانية له جنس (مذكر، مؤنث، محايد). **لا توجد قاعدة 100% لتحديد الجنس** — يجب حفظ الاسم دائماً مع أدانه.

**الأجناس الثلاثة:**
🔵 der (مذكر) — der Tisch (الطاولة)
🌸 die (مؤنث) — die Suppe (الشوربة)
🟢 das (محايد) — das Wasser (الماء)`,
        tables: [
          {
            title: 'أداة التعريف والنكرة — المقارنة',
            headers: ['Genus', 'معرفة', 'نكرة', 'مثال'],
            rows: [
              { cells: ['Maskulin', 'der', 'ein', 'der / ein Kaffee'] },
              { cells: ['Feminin', 'die', 'eine', 'die / eine Suppe'] },
              { cells: ['Neutrum', 'das', 'ein', 'das / ein Wasser'] },
              { cells: ['Plural', 'die', '— (بدون)', 'die Getränke'] },
            ],
            theme: 'cases',
          },
          {
            title: 'Nominativ ↔ Akkusativ — فقط المذكر يتغير!',
            headers: ['Genus', 'Nominativ', 'Akkusativ'],
            rows: [
              { cells: ['Maskulin', 'der / ein Kaffee', 'den / einen Kaffee ⚠️'], highlight: true },
              { cells: ['Feminin', 'die / eine Suppe', 'die / eine Suppe'] },
              { cells: ['Neutrum', 'das / ein Wasser', 'das / ein Wasser'] },
              { cells: ['Plural', 'die Getränke', 'die Getränke'] },
            ],
            theme: 'cases',
            note: 'هذه أهم قاعدة في A1 — فقط der → den و ein → einen.',
          },
        ],
        rules: [
          {
            rule: 'Nominativ (الفاعل) = الاسم هو من يقوم بالفعل.',
            example: '**Der Kaffee** ist heiß.',
            translation: 'القهوة ساخنة. (القهوة = الفاعل)',
          },
          {
            rule: 'Akkusativ (المفعول به) = الاسم هو من يقع عليه الفعل.',
            example: 'Ich trinke **den Kaffee**.',
            translation: 'أشرب القهوة. (القهوة = المفعول به)',
          },
          {
            rule: 'عند الطلب في المطعم استخدم möchten أو hätte gern.',
            example: 'Ich möchte **einen** Kaffee, bitte.',
            translation: 'أريد قهوة من فضلك. (Kaffee مذكر في حالة مفعول به → einen)',
          },
        ],
        examples: [
          'Ich möchte einen Kaffee und ein Wasser, bitte. — أريد قهوة وماء من فضلك.',
          'Was kostet die Suppe? — كم تكلف الشوربة؟',
          'Ich nehme den Salat als Vorspeise. — سآخذ السلطة كمقبلات.',
          'Die Rechnung, bitte! — الحساب من فضلك!',
          'Haben Sie einen Tisch für zwei Personen? — هل عندكم طاولة لشخصين؟',
          'Das schmeckt sehr gut! — هذا لذيذ جداً!',
          'Wir hätten gern die Speisekarte. — نريد قائمة الطعام.',
          'Zum Trinken nehme ich eine Cola. — سآخذ كولا للشرب.',
        ],
        tip: '💡 عندما تحفظ كلمة جديدة، احفظها دائماً مع أداة تعريفها بالصورة: der (أزرق)، die (وردي)، das (أخضر). هذا يجعل الجنس يلتصق بذاكرتك بصرياً.',
      },
      vocabulary: [
        { german: 'Kaffee', arabic: 'القهوة', gender: 'der', example: 'Einen Kaffee, bitte.', exampleArabic: 'قهوة من فضلك.', type: 'noun' },
        { german: 'Tee', arabic: 'الشاي', gender: 'der', plural: 'Tees', example: 'Ich trinke gern Tee.', exampleArabic: 'أحب شرب الشاي.', type: 'noun' },
        { german: 'Wasser', arabic: 'الماء', gender: 'das', example: 'Ein Wasser, bitte.', exampleArabic: 'ماء من فضلك.', type: 'noun' },
        { german: 'Saft', arabic: 'العصير', gender: 'der', plural: 'Säfte', example: 'Ich möchte einen Saft.', exampleArabic: 'أريد عصيراً.', type: 'noun' },
        { german: 'Suppe', arabic: 'الشوربة', gender: 'die', plural: 'Suppen', example: 'Die Suppe ist heiß.', exampleArabic: 'الشوربة ساخنة.', type: 'noun' },
        { german: 'Brot', arabic: 'الخبز', gender: 'das', plural: 'Brote', example: 'Ich esse Brot zum Frühstück.', exampleArabic: 'آكل خبزاً في الفطور.', type: 'noun' },
        { german: 'Salat', arabic: 'السلطة', gender: 'der', plural: 'Salate', example: 'Ich nehme den Salat.', exampleArabic: 'سآخذ السلطة.', type: 'noun' },
        { german: 'Fleisch', arabic: 'اللحم', gender: 'das', example: 'Ich esse kein Fleisch.', exampleArabic: 'لا آكل اللحم.', type: 'noun' },
        { german: 'Fisch', arabic: 'السمك', gender: 'der', plural: 'Fische', example: 'Der Fisch schmeckt gut.', exampleArabic: 'السمك لذيذ.', type: 'noun' },
        { german: 'Kartoffel', arabic: 'البطاطا', gender: 'die', plural: 'Kartoffeln', example: 'Kartoffeln mit Fleisch.', exampleArabic: 'بطاطا مع لحم.', type: 'noun' },
        { german: 'Reis', arabic: 'الأرز', gender: 'der', example: 'Ich esse Reis.', exampleArabic: 'آكل أرزاً.', type: 'noun' },
        { german: 'Apfel', arabic: 'التفاح', gender: 'der', plural: 'Äpfel', example: 'Ein Apfel pro Tag!', exampleArabic: 'تفاحة كل يوم!', type: 'noun' },
        { german: 'Speisekarte', arabic: 'قائمة الطعام', gender: 'die', plural: 'Speisekarten', example: 'Die Speisekarte, bitte!', exampleArabic: 'قائمة الطعام من فضلك!', type: 'noun' },
        { german: 'Rechnung', arabic: 'الحساب', gender: 'die', plural: 'Rechnungen', example: 'Die Rechnung, bitte!', exampleArabic: 'الحساب من فضلك!', type: 'noun' },
        { german: 'Tisch', arabic: 'الطاولة', gender: 'der', plural: 'Tische', example: 'Ein Tisch für zwei.', exampleArabic: 'طاولة لشخصين.', type: 'noun' },
        { german: 'Restaurant', arabic: 'المطعم', gender: 'das', plural: 'Restaurants', example: 'Das Restaurant ist gut.', exampleArabic: 'المطعم جيد.', type: 'noun' },
        { german: 'möchten', arabic: 'يريد / يود', example: 'Ich möchte bestellen.', exampleArabic: 'أريد أن أطلب.', type: 'verb' },
        { german: 'nehmen', arabic: 'يأخذ / يختار', example: 'Ich nehme die Suppe.', exampleArabic: 'سآخذ الشوربة.', type: 'verb' },
        { german: 'bestellen', arabic: 'يطلب', example: 'Wir bestellen jetzt.', exampleArabic: 'سنطلب الآن.', type: 'verb' },
        { german: 'bezahlen', arabic: 'يدفع', example: 'Ich möchte bezahlen.', exampleArabic: 'أريد الدفع.', type: 'verb' },
        { german: 'schmecken', arabic: 'يكون لذيذاً', example: 'Das schmeckt gut!', exampleArabic: 'هذا لذيذ!', type: 'verb' },
        { german: 'lecker', arabic: 'لذيذ', example: 'Sehr lecker!', exampleArabic: 'لذيذ جداً!', type: 'adjective' },
        { german: 'bitte / danke', arabic: 'من فضلك / شكراً', example: 'Einen Tisch, bitte.', exampleArabic: 'طاولة من فضلك.', type: 'phrase' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a1-04-q1',
            question: 'أكمل: "Ich möchte ___ Kaffee, bitte." (قهوة — مذكر، مفعول به)',
            answer: 'einen',
            hint: 'النكرة للمذكر في Akkusativ: einen',
          },
          {
            type: 'multiple-choice', id: 'a1-04-q2',
            question: 'ما أداة التعريف لكلمة "Milch" (مؤنث)؟',
            options: ['der', 'das', 'die', 'den'],
            answer: 'die',
          },
          {
            type: 'fill-blank', id: 'a1-04-q3',
            question: 'أكمل: "___ Wasser kostet zwei Euro." (الماء — محايد)',
            answer: 'Das',
            hint: 'أداة التعريف للمحايد هي das',
          },
          {
            type: 'multiple-choice', id: 'a1-04-q4',
            question: 'كيف تطلب الحساب بالألمانية؟',
            options: ['Die Speisekarte, bitte!', 'Die Rechnung, bitte!', 'Ein Tisch, bitte!', 'Das Essen, bitte!'],
            answer: 'Die Rechnung, bitte!',
          },
          {
            type: 'matching', id: 'a1-04-q5',
            question: 'اربط كل كلمة بأداة تعريفها الصحيحة:',
            pairs: [
              { left: 'Kaffee', right: 'der' },
              { left: 'Suppe', right: 'die' },
              { left: 'Wasser', right: 'das' },
              { left: 'Apfel', right: 'der' },
              { left: 'Speisekarte', right: 'die' },
            ],
            answer: 'matched',
          },
          {
            type: 'fill-blank', id: 'a1-04-q6',
            question: 'أكمل: "Das ___ sehr gut!" (هذا لذيذ جداً)',
            answer: 'schmeckt',
            hint: 'فعل schmecken مع das: جذر schmeck + نهاية -t',
          },
          {
            type: 'drag-drop', id: 'a1-04-q7',
            question: 'رتّب الجملة:',
            words: ['Ich', 'möchte', 'einen', 'Kaffee', 'bitte'],
            answer: 'Ich möchte einen Kaffee bitte',
          },
          {
            type: 'speaking', id: 'a1-04-q8',
            question: 'قل بالألمانية: "طاولة لشخصين من فضلك"',
            answer: 'Einen Tisch für zwei Personen bitte',
            hint: 'Tisch مذكر → einen',
          },
          {
            type: 'fill-blank', id: 'a1-04-q9',
            question: 'استمع ثم أكمل: "Ich nehme ___ Salat."',
            audioPrompt: 'Ich nehme den Salat.',
            answer: 'den',
            hint: 'Salat مذكر في Akkusativ: der → den',
          },
          {
            type: 'multiple-choice', id: 'a1-04-q10',
            question: 'أي جملة صحيحة؟',
            options: [
              'Ich möchte ein Suppe.',
              'Ich möchte eine Suppe.',
              'Ich möchte einen Suppe.',
              'Ich möchte den Suppe.',
            ],
            answer: 'Ich möchte eine Suppe.',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 5 — العائلة
    // ─────────────────────────────────────────────
    {
      id: 'a1-05',
      title: 'العائلة والملكية — Familie und Possessivpronomen',
      order: 5,
      grammar: {
        title: 'ضمائر الملكية — mein, dein, sein, ihr',
        content: `ضمائر الملكية تُظهر لمن ينتمي الشيء. **جذر الضمير** يتحدد حسب المالك، و**النهاية** حسب الشيء المملوك.

**الجذور الأساسية:**
- mein (لي) / dein (لك) / sein (له) / ihr (لها) / unser (لنا) / euer (لكم)`,
        tables: [
          {
            title: 'ضمائر الملكية — جذر حسب المالك',
            headers: ['Pronomen', 'Possessiv', 'المعنى'],
            rows: [
              { cells: ['ich', 'mein-', 'لي (my)'] },
              { cells: ['du', 'dein-', 'لك (your)'] },
              { cells: ['er / es', 'sein-', 'له / محايد (his)'] },
              { cells: ['sie', 'ihr-', 'لها (her)'] },
              { cells: ['wir', 'unser-', 'لنا (our)'] },
              { cells: ['ihr', 'euer-', 'لكم (your pl.)'] },
              { cells: ['sie / Sie', 'ihr- / Ihr-', 'لهم / لحضرتك'] },
            ],
            theme: 'conjugation',
          },
          {
            title: 'نهايات الملكية حسب جنس الاسم',
            headers: ['Genus', 'Nominativ', 'Akkusativ', 'مثال'],
            rows: [
              { cells: ['Maskulin', 'mein', 'meinen', 'mein / meinen Vater'] },
              { cells: ['Feminin', 'meine', 'meine', 'meine Mutter'] },
              { cells: ['Neutrum', 'mein', 'mein', 'mein Kind'] },
              { cells: ['Plural', 'meine', 'meine', 'meine Eltern'] },
            ],
            theme: 'cases',
            note: 'نفس نهايات ein/eine/ein — فقط المذكر يتغير في Akkusativ.',
          },
        ],
        rules: [
          {
            rule: 'مع الأسماء المذكرة والمحايدة في Nominativ: بدون نهاية.',
            example: 'Das ist **mein** Vater. Das ist **mein** Kind.',
            translation: 'هذا أبي. هذا طفلي.',
          },
          {
            rule: 'مع الأسماء المؤنثة والجمع: أضف -e.',
            example: 'Das ist **meine** Mutter. Das sind **meine** Eltern.',
            translation: 'هذه أمي. هؤلاء والديّ.',
          },
          {
            rule: 'في حالة المفعول به (Akkusativ) للمذكر فقط: أضف -en.',
            example: 'Ich liebe **meinen** Bruder.',
            translation: 'أحب أخي. (Bruder مذكر + Akkusativ → meinen)',
          },
        ],
        examples: [
          'Mein Vater heißt Hassan. Er ist 55 Jahre alt. — اسم أبي حسن. عمره 55 سنة.',
          'Meine Mutter kommt aus Fes. — أمي من فاس.',
          'Ich habe zwei Geschwister — einen Bruder und eine Schwester. — لدي أخوان — أخ وأخت.',
          'Sein Name ist Youssef. — اسمه يوسف.',
          'Wie heißt deine Schwester? — ما اسم أختك؟',
          'Unsere Familie wohnt in Casablanca. — عائلتنا تسكن في الدار البيضاء.',
          'Ihre Kinder gehen schon zur Schule. — أطفالها يذهبون للمدرسة.',
          'Meine Großmutter kocht das beste Couscous! — جدتي تطبخ أفضل كسكس!',
        ],
        tip: '💡 لاحظ أن "ihr" تعني "لها" (her) أو "لهم" (their) أو "لكم" (your pl.) — السياق هو ما يوضح المعنى. عند كتابة "Ihr" بحرف كبير في وسط الجملة، تعني "لحضرتك" (رسمي).',
      },
      vocabulary: [
        { german: 'Vater', arabic: 'الأب', gender: 'der', plural: 'Väter', example: 'Mein Vater arbeitet als Arzt.', exampleArabic: 'أبي يعمل طبيباً.', type: 'noun' },
        { german: 'Mutter', arabic: 'الأم', gender: 'die', plural: 'Mütter', example: 'Meine Mutter kocht gut.', exampleArabic: 'أمي تطبخ جيداً.', type: 'noun' },
        { german: 'Bruder', arabic: 'الأخ', gender: 'der', plural: 'Brüder', example: 'Ich habe einen Bruder.', exampleArabic: 'لدي أخ.', type: 'noun' },
        { german: 'Schwester', arabic: 'الأخت', gender: 'die', plural: 'Schwestern', example: 'Meine Schwester studiert.', exampleArabic: 'أختي تدرس.', type: 'noun' },
        { german: 'Eltern', arabic: 'الوالدان', gender: 'pl', example: 'Meine Eltern wohnen in Marokko.', exampleArabic: 'والديّ في المغرب.', type: 'noun' },
        { german: 'Geschwister', arabic: 'الأخوة والأخوات', gender: 'pl', example: 'Ich habe drei Geschwister.', exampleArabic: 'لي ثلاثة أخوة.', type: 'noun' },
        { german: 'Sohn', arabic: 'الابن', gender: 'der', plural: 'Söhne', example: 'Mein Sohn ist 5.', exampleArabic: 'ابني عمره 5.', type: 'noun' },
        { german: 'Tochter', arabic: 'الابنة', gender: 'die', plural: 'Töchter', example: 'Meine Tochter heißt Lina.', exampleArabic: 'ابنتي اسمها لينا.', type: 'noun' },
        { german: 'Kind', arabic: 'الطفل', gender: 'das', plural: 'Kinder', example: 'Wir haben zwei Kinder.', exampleArabic: 'لدينا طفلان.', type: 'noun' },
        { german: 'Baby', arabic: 'الرضيع', gender: 'das', plural: 'Babys', example: 'Das Baby schläft.', exampleArabic: 'الرضيع نائم.', type: 'noun' },
        { german: 'Großvater / Opa', arabic: 'الجد', gender: 'der', plural: 'Großväter', example: 'Mein Opa ist 80.', exampleArabic: 'جدي عمره 80.', type: 'noun' },
        { german: 'Großmutter / Oma', arabic: 'الجدة', gender: 'die', plural: 'Großmütter', example: 'Meine Oma lebt noch.', exampleArabic: 'جدتي ما زالت حية.', type: 'noun' },
        { german: 'Onkel', arabic: 'العم / الخال', gender: 'der', plural: 'Onkel', example: 'Mein Onkel wohnt in Rabat.', exampleArabic: 'عمي في الرباط.', type: 'noun' },
        { german: 'Tante', arabic: 'العمة / الخالة', gender: 'die', plural: 'Tanten', example: 'Meine Tante ist sehr nett.', exampleArabic: 'خالتي لطيفة جداً.', type: 'noun' },
        { german: 'Cousin', arabic: 'ابن العم', gender: 'der', plural: 'Cousins', example: 'Mein Cousin spielt Fußball.', exampleArabic: 'ابن عمي يلعب كرة القدم.', type: 'noun' },
        { german: 'Familie', arabic: 'العائلة', gender: 'die', plural: 'Familien', example: 'Meine Familie ist groß.', exampleArabic: 'عائلتي كبيرة.', type: 'noun' },
        { german: 'Mann / Ehemann', arabic: 'الزوج', gender: 'der', plural: 'Männer', example: 'Mein Mann heißt Karim.', exampleArabic: 'زوجي اسمه كريم.', type: 'noun' },
        { german: 'Frau / Ehefrau', arabic: 'الزوجة', gender: 'die', plural: 'Frauen', example: 'Meine Frau ist Lehrerin.', exampleArabic: 'زوجتي معلمة.', type: 'noun' },
        { german: 'verheiratet / ledig', arabic: 'متزوج / أعزب', example: 'Ich bin verheiratet.', exampleArabic: 'أنا متزوج.', type: 'adjective' },
        { german: 'groß / klein', arabic: 'كبير / صغير', example: 'Meine Familie ist groß.', exampleArabic: 'عائلتي كبيرة.', type: 'adjective' },
        { german: 'jung / alt', arabic: 'شاب / كبير السن', example: 'Er ist jung.', exampleArabic: 'هو شاب.', type: 'adjective' },
        { german: 'lieben', arabic: 'يحب', example: 'Ich liebe meine Familie.', exampleArabic: 'أحب عائلتي.', type: 'verb' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a1-05-q1',
            question: 'أكمل: "___ Vater heißt Hassan." (أبي — مذكر)',
            answer: 'Mein',
            hint: 'ضمير ملكية للمذكر مع ich: Mein',
          },
          {
            type: 'multiple-choice', id: 'a1-05-q2',
            question: 'كيف تقول "أمي" بالألمانية؟',
            options: ['mein Mutter', 'meine Mutter', 'meinen Mutter', 'seiner Mutter'],
            answer: 'meine Mutter',
          },
          {
            type: 'fill-blank', id: 'a1-05-q3',
            question: 'أكمل: "Ich habe ___ Bruder." (أخ — Akkusativ مذكر)',
            answer: 'einen',
            hint: 'النكرة للمذكر في Akkusativ: einen',
          },
          {
            type: 'multiple-choice', id: 'a1-05-q4',
            question: 'ما معنى "Meine Geschwister wohnen in Berlin"؟',
            options: ['أخي يسكن في برلين.', 'أختي تسكن في برلين.', 'أخوتي يسكنون في برلين.', 'عائلتي تسكن في برلين.'],
            answer: 'أخوتي يسكنون في برلين.',
          },
          {
            type: 'fill-blank', id: 'a1-05-q5',
            question: 'أكمل: "___ Name ist Youssef." (اسمه — للمذكر الغائب)',
            answer: 'Sein',
            hint: 'ضمير الملكية للغائب المذكر: Sein',
          },
          {
            type: 'matching', id: 'a1-05-q6',
            question: 'اربط الضمير بضمير ملكيته:',
            pairs: [
              { left: 'ich', right: 'mein' },
              { left: 'du', right: 'dein' },
              { left: 'er', right: 'sein' },
              { left: 'sie (هي)', right: 'ihr' },
              { left: 'wir', right: 'unser' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a1-05-q7',
            question: 'رتّب: "هؤلاء والديّ في المغرب"',
            words: ['Das', 'sind', 'meine', 'Eltern', 'in', 'Marokko'],
            answer: 'Das sind meine Eltern in Marokko',
          },
          {
            type: 'speaking', id: 'a1-05-q8',
            question: 'قل بالألمانية: "أختي اسمها فاطمة"',
            answer: 'Meine Schwester heißt Fatima',
            hint: 'Schwester مؤنث → meine',
          },
          {
            type: 'fill-blank', id: 'a1-05-q9',
            question: 'استمع وأكمل: "Ich liebe ___ Bruder." (مفعول به مذكر)',
            audioPrompt: 'Ich liebe meinen Bruder.',
            answer: 'meinen',
            hint: 'Bruder مذكر + Akkusativ → meinen',
          },
          {
            type: 'multiple-choice', id: 'a1-05-q10',
            question: 'ما الضمير الصحيح: "___ Kinder sind nett." (أطفالهم لطيفون)',
            options: ['sein', 'ihre', 'mein', 'unser'],
            answer: 'ihre',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 6 — البيت والسكن
    // ─────────────────────────────────────────────
    {
      id: 'a1-06',
      title: 'البيت والسكن — Wohnen und Wohnung',
      order: 6,
      grammar: {
        title: 'es gibt + حروف الجر للمكان — Präpositionen',
        content: `**es gibt** = "يوجد / هناك". يأخذ دائماً حالة Akkusativ.

**الفرق بين Wo? (أين) و Wohin? (إلى أين):**
- Wo? → Dativ (السكون)
- Wohin? → Akkusativ (الحركة)`,
        tables: [
          {
            title: 'أداة التعريف في جميع الحالات',
            headers: ['Kasus', 'Maskulin', 'Feminin', 'Neutrum', 'Plural'],
            rows: [
              { cells: ['Nominativ', 'der', 'die', 'das', 'die'] },
              { cells: ['Akkusativ', 'den ⚠️', 'die', 'das', 'die'] },
              { cells: ['Dativ', 'dem', 'der', 'dem', 'den'], highlight: true },
            ],
            theme: 'cases',
          },
          {
            title: 'حروف الجر للمكان (مع Dativ — Wo?)',
            headers: ['Präposition', 'المعنى', 'مثال'],
            rows: [
              { cells: ['in', 'في', 'Das Buch ist in der Tasche.'] },
              { cells: ['auf', 'على (سطح أفقي)', 'Die Tasse ist auf dem Tisch.'] },
              { cells: ['unter', 'تحت', 'Die Schuhe sind unter dem Bett.'] },
              { cells: ['neben', 'بجانب', 'Der Stuhl ist neben dem Schrank.'] },
              { cells: ['an', 'على (سطح عمودي)', 'Das Bild ist an der Wand.'] },
              { cells: ['zwischen', 'بين', 'Der Tisch ist zwischen den Stühlen.'] },
              { cells: ['hinter', 'خلف', 'Der Garten ist hinter dem Haus.'] },
              { cells: ['vor', 'أمام', 'Das Auto steht vor dem Haus.'] },
            ],
            theme: 'cases',
          },
        ],
        rules: [
          {
            rule: 'مع Dativ: der → dem، die → der، das → dem، die (جمع) → den + n على الاسم.',
            example: 'in dem Zimmer = **im** Zimmer / in der Küche',
            translation: 'في الغرفة / في المطبخ',
          },
          {
            rule: 'اختصارات شائعة: in dem = im / an dem = am / in das = ins / an das = ans.',
            example: 'Ich bin **im** Wohnzimmer. / Ich gehe **ins** Bad.',
            translation: 'أنا في غرفة المعيشة. / أذهب إلى الحمام.',
          },
          {
            rule: 'es gibt + Akkusativ (دائماً)، بنفي kein.',
            example: 'Es gibt **einen** Supermarkt, aber **keine** Apotheke.',
            translation: 'يوجد سوبر ماركت لكن لا توجد صيدلية.',
          },
        ],
        examples: [
          'Ich wohne in einer Wohnung im dritten Stock. — أسكن في شقة في الطابق الثالث.',
          'Es gibt zwei Zimmer, eine Küche und ein Badezimmer. — يوجد غرفتان ومطبخ وحمام.',
          'Die Küche ist neben dem Wohnzimmer. — المطبخ بجانب غرفة المعيشة.',
          'Das Bett ist unter dem Fenster. — السرير تحت النافذة.',
          'Wie viel kostet die Miete? — كم الإيجار؟',
          'Ich suche eine Wohnung in München. — أبحث عن شقة في ميونخ.',
          'Meine Wohnung ist hell und groß. — شقتي مضيئة وكبيرة.',
          'Das Bild hängt an der Wand. — الصورة معلقة على الحائط.',
        ],
        tip: '💡 في ألمانيا، الطابق الأرضي = Erdgeschoss (EG)، الطابق الأول = 1. Stock، إلخ. لذا "الطابق الأول" الألماني هو الطابق الثاني الأمريكي!',
      },
      vocabulary: [
        { german: 'Wohnung', arabic: 'الشقة', gender: 'die', plural: 'Wohnungen', example: 'Ich suche eine Wohnung.', exampleArabic: 'أبحث عن شقة.', type: 'noun' },
        { german: 'Haus', arabic: 'البيت', gender: 'das', plural: 'Häuser', example: 'Das Haus ist groß.', exampleArabic: 'البيت كبير.', type: 'noun' },
        { german: 'Zimmer', arabic: 'الغرفة', gender: 'das', plural: 'Zimmer', example: 'Die Wohnung hat drei Zimmer.', exampleArabic: 'الشقة بها 3 غرف.', type: 'noun' },
        { german: 'Küche', arabic: 'المطبخ', gender: 'die', plural: 'Küchen', example: 'Die Küche ist modern.', exampleArabic: 'المطبخ حديث.', type: 'noun' },
        { german: 'Badezimmer / Bad', arabic: 'الحمام', gender: 'das', plural: 'Badezimmer', example: 'Das Bad ist klein.', exampleArabic: 'الحمام صغير.', type: 'noun' },
        { german: 'Wohnzimmer', arabic: 'غرفة المعيشة', gender: 'das', plural: 'Wohnzimmer', example: 'Wir sitzen im Wohnzimmer.', exampleArabic: 'نجلس في غرفة المعيشة.', type: 'noun' },
        { german: 'Schlafzimmer', arabic: 'غرفة النوم', gender: 'das', plural: 'Schlafzimmer', example: 'Mein Schlafzimmer ist ruhig.', exampleArabic: 'غرفة نومي هادئة.', type: 'noun' },
        { german: 'Balkon', arabic: 'الشرفة', gender: 'der', plural: 'Balkone', example: 'Die Wohnung hat einen Balkon.', exampleArabic: 'الشقة بها شرفة.', type: 'noun' },
        { german: 'Tisch', arabic: 'الطاولة', gender: 'der', plural: 'Tische', example: 'Der Tisch ist aus Holz.', exampleArabic: 'الطاولة من خشب.', type: 'noun' },
        { german: 'Stuhl', arabic: 'الكرسي', gender: 'der', plural: 'Stühle', example: 'Der Stuhl ist bequem.', exampleArabic: 'الكرسي مريح.', type: 'noun' },
        { german: 'Bett', arabic: 'السرير', gender: 'das', plural: 'Betten', example: 'Das Bett ist sehr bequem.', exampleArabic: 'السرير مريح جداً.', type: 'noun' },
        { german: 'Schrank', arabic: 'الخزانة', gender: 'der', plural: 'Schränke', example: 'Meine Kleider sind im Schrank.', exampleArabic: 'ملابسي في الخزانة.', type: 'noun' },
        { german: 'Sofa', arabic: 'الأريكة', gender: 'das', plural: 'Sofas', example: 'Das Sofa ist neu.', exampleArabic: 'الأريكة جديدة.', type: 'noun' },
        { german: 'Lampe', arabic: 'المصباح', gender: 'die', plural: 'Lampen', example: 'Die Lampe ist hell.', exampleArabic: 'المصباح مضيء.', type: 'noun' },
        { german: 'Fenster', arabic: 'النافذة', gender: 'das', plural: 'Fenster', example: 'Das Fenster ist offen.', exampleArabic: 'النافذة مفتوحة.', type: 'noun' },
        { german: 'Tür', arabic: 'الباب', gender: 'die', plural: 'Türen', example: 'Die Tür ist zu.', exampleArabic: 'الباب مغلق.', type: 'noun' },
        { german: 'Miete', arabic: 'الإيجار', gender: 'die', plural: 'Mieten', example: 'Die Miete beträgt 800 Euro.', exampleArabic: 'الإيجار 800 يورو.', type: 'noun' },
        { german: 'Stock / Etage', arabic: 'الطابق', gender: 'der', plural: 'Stockwerke', example: 'Ich wohne im 2. Stock.', exampleArabic: 'أسكن في الطابق الثاني.', type: 'noun' },
        { german: 'suchen', arabic: 'يبحث عن', example: 'Ich suche eine WG.', exampleArabic: 'أبحث عن شقة مشتركة.', type: 'verb' },
        { german: 'mieten', arabic: 'يستأجر', example: 'Ich miete eine Wohnung.', exampleArabic: 'أستأجر شقة.', type: 'verb' },
        { german: 'groß / klein', arabic: 'كبير / صغير', example: 'Die Wohnung ist groß.', exampleArabic: 'الشقة كبيرة.', type: 'adjective' },
        { german: 'hell / dunkel', arabic: 'مضيء / مظلم', example: 'Das Zimmer ist hell.', exampleArabic: 'الغرفة مضيئة.', type: 'adjective' },
        { german: 'möbliert', arabic: 'مؤثثة', example: 'Die Wohnung ist möbliert.', exampleArabic: 'الشقة مؤثثة.', type: 'adjective' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a1-06-q1',
            question: 'أكمل: "Es ___ zwei Zimmer und eine Küche." (يوجد)',
            answer: 'gibt',
            hint: 'es gibt = يوجد',
          },
          {
            type: 'multiple-choice', id: 'a1-06-q2',
            question: 'أين الكتاب؟ "Das Buch ist ___ dem Tisch." (على)',
            options: ['in', 'unter', 'auf', 'neben'],
            answer: 'auf',
          },
          {
            type: 'fill-blank', id: 'a1-06-q3',
            question: 'أكمل: "Ich suche eine ___ in Berlin." (شقة)',
            answer: 'Wohnung',
            hint: 'الشقة بالألمانية',
          },
          {
            type: 'multiple-choice', id: 'a1-06-q4',
            question: 'ما معنى "Die Küche ist neben dem Wohnzimmer"؟',
            options: ['المطبخ أمام غرفة المعيشة.', 'المطبخ بجانب غرفة المعيشة.', 'المطبخ تحت غرفة المعيشة.', 'المطبخ في غرفة المعيشة.'],
            answer: 'المطبخ بجانب غرفة المعيشة.',
          },
          {
            type: 'fill-blank', id: 'a1-06-q5',
            question: 'أكمل: "Die Schuhe sind ___ dem Bett." (تحت)',
            answer: 'unter',
            hint: 'حرف جر يعني تحت',
          },
          {
            type: 'matching', id: 'a1-06-q6',
            question: 'اربط حرف الجر بمعناه:',
            pairs: [
              { left: 'in', right: 'في' },
              { left: 'auf', right: 'على' },
              { left: 'unter', right: 'تحت' },
              { left: 'neben', right: 'بجانب' },
              { left: 'vor', right: 'أمام' },
              { left: 'hinter', right: 'خلف' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a1-06-q7',
            question: 'رتّب الجملة:',
            words: ['Das', 'Bett', 'ist', 'unter', 'dem', 'Fenster'],
            answer: 'Das Bett ist unter dem Fenster',
          },
          {
            type: 'speaking', id: 'a1-06-q8',
            question: 'قل بالألمانية: "أسكن في شقة صغيرة في برلين"',
            answer: 'Ich wohne in einer kleinen Wohnung in Berlin',
            hint: 'wohnen in + Dativ',
          },
          {
            type: 'fill-blank', id: 'a1-06-q9',
            question: 'استمع وأكمل: "Die Lampe steht ___ dem Tisch." (بجانب)',
            audioPrompt: 'Die Lampe steht neben dem Tisch.',
            answer: 'neben',
          },
          {
            type: 'multiple-choice', id: 'a1-06-q10',
            question: 'أي جملة صحيحة لـ "لا توجد حديقة"؟',
            options: [
              'Es gibt nicht einen Garten.',
              'Es gibt keinen Garten.',
              'Es gibt kein Garten.',
              'Es nicht gibt Garten.',
            ],
            answer: 'Es gibt keinen Garten.',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 7 — المهن والنفي
    // ─────────────────────────────────────────────
    {
      id: 'a1-07',
      title: 'المهن والنفي — Berufe und Negation',
      order: 7,
      grammar: {
        title: 'فعل haben + النفي بـ nicht و kein',
        content: `**haben** (يملك) من أهم الأفعال في الألمانية. يُستخدم لوصف ما نملك، وكذلك مع بعض التعابير.

**النفي في الألمانية:**
- **nicht** — ينفي الأفعال والصفات والأشياء المعرفة
- **kein** — ينفي الأسماء النكرة (ein/eine)`,
        tables: [
          {
            title: 'تصريف haben (يملك)',
            headers: ['Pronomen', 'haben', 'مثال'],
            rows: [
              { cells: ['ich', 'habe', 'Ich habe Zeit.'] },
              { cells: ['du', 'hast', 'Du hast einen Hund.'] },
              { cells: ['er/sie/es', 'hat', 'Sie hat Kinder.'] },
              { cells: ['wir', 'haben', 'Wir haben Hunger.'] },
              { cells: ['ihr', 'habt', 'Habt ihr Fragen?'] },
              { cells: ['sie/Sie', 'haben', 'Sie haben Recht.'] },
            ],
            theme: 'conjugation',
          },
          {
            title: 'النفي بـ kein حسب الجنس والحالة',
            headers: ['Genus', 'Nominativ', 'Akkusativ', 'مثال'],
            rows: [
              { cells: ['Maskulin', 'kein', 'keinen', 'Ich habe keinen Job.'] },
              { cells: ['Feminin', 'keine', 'keine', 'Ich habe keine Zeit.'] },
              { cells: ['Neutrum', 'kein', 'kein', 'Ich habe kein Auto.'] },
              { cells: ['Plural', 'keine', 'keine', 'Ich habe keine Kinder.'] },
            ],
            theme: 'cases',
          },
        ],
        rules: [
          {
            rule: 'استخدم nicht لنفي الأفعال والصفات وأسماء معرفة.',
            example: 'Ich arbeite **nicht**. / Das ist **nicht** gut.',
            translation: 'لا أعمل. / هذا ليس جيداً.',
          },
          {
            rule: 'استخدم kein/keine/kein لنفي أسماء نكرة (ein/eine) أو جمع بدون أداة.',
            example: 'Ich habe **keinen** Bruder. / Wir haben **keine** Kinder.',
            translation: 'ليس لدي أخ. / ليس لدينا أطفال.',
          },
          {
            rule: 'عند ذكر المهنة في الألمانية، لا نستخدم أداة نكرة!',
            example: '✅ Ich bin Lehrer. ❌ Ich bin ein Lehrer.',
            translation: 'أنا معلم. (بدون ein)',
          },
        ],
        examples: [
          'Ich bin Arzt von Beruf. — أنا طبيب من حيث المهنة.',
          'Sie arbeitet als Lehrerin. — تعمل معلمة.',
          'Er hat keinen Job. Er sucht Arbeit. — ليس لديه عمل. يبحث عن عمل.',
          'Ich habe keine Zeit heute. — ليس لديّ وقت اليوم.',
          'Wir haben ein Auto, aber kein Fahrrad. — لدينا سيارة لكن ليس لنا دراجة.',
          'Ich arbeite nicht am Wochenende. — لا أعمل في نهاية الأسبوع.',
          'Mein Chef ist sehr nett. — مديري لطيف جداً.',
          'Was bist du von Beruf? — Ich bin Ingenieur. — ما مهنتك؟ — أنا مهندس.',
        ],
        tip: '💡 قاعدة عملية: إذا كانت الجملة تحتوي ein/eine → انفِها بـ kein/keine. إذا لم تحتوي ein → انفِها بـ nicht.',
      },
      vocabulary: [
        { german: 'Arzt', arabic: 'الطبيب', gender: 'der', plural: 'Ärzte', example: 'Mein Vater ist Arzt.', exampleArabic: 'أبي طبيب.', type: 'noun' },
        { german: 'Ärztin', arabic: 'الطبيبة', gender: 'die', plural: 'Ärztinnen', example: 'Sie ist Ärztin.', exampleArabic: 'هي طبيبة.', type: 'noun' },
        { german: 'Lehrer', arabic: 'المعلم', gender: 'der', plural: 'Lehrer', example: 'Er ist Lehrer.', exampleArabic: 'هو معلم.', type: 'noun' },
        { german: 'Lehrerin', arabic: 'المعلمة', gender: 'die', plural: 'Lehrerinnen', example: 'Sie ist Lehrerin.', exampleArabic: 'هي معلمة.', type: 'noun' },
        { german: 'Ingenieur', arabic: 'المهندس', gender: 'der', plural: 'Ingenieure', example: 'Ich bin Ingenieur.', exampleArabic: 'أنا مهندس.', type: 'noun' },
        { german: 'Kellner', arabic: 'النادل', gender: 'der', plural: 'Kellner', example: 'Er arbeitet als Kellner.', exampleArabic: 'يعمل نادلاً.', type: 'noun' },
        { german: 'Verkäufer', arabic: 'البائع', gender: 'der', plural: 'Verkäufer', example: 'Der Verkäufer ist nett.', exampleArabic: 'البائع لطيف.', type: 'noun' },
        { german: 'Koch', arabic: 'الطباخ', gender: 'der', plural: 'Köche', example: 'Der Koch ist aus Italien.', exampleArabic: 'الطباخ من إيطاليا.', type: 'noun' },
        { german: 'Krankenschwester', arabic: 'الممرضة', gender: 'die', plural: 'Krankenschwestern', example: 'Meine Tante ist Krankenschwester.', exampleArabic: 'خالتي ممرضة.', type: 'noun' },
        { german: 'Polizist', arabic: 'الشرطي', gender: 'der', plural: 'Polizisten', example: 'Er ist Polizist.', exampleArabic: 'هو شرطي.', type: 'noun' },
        { german: 'Mechaniker', arabic: 'الميكانيكي', gender: 'der', plural: 'Mechaniker', example: 'Mein Bruder ist Mechaniker.', exampleArabic: 'أخي ميكانيكي.', type: 'noun' },
        { german: 'Student / Studentin', arabic: 'الطالب / الطالبة', gender: 'der', example: 'Ich bin noch Student.', exampleArabic: 'ما زلت طالباً.', type: 'noun' },
        { german: 'Beruf', arabic: 'المهنة', gender: 'der', plural: 'Berufe', example: 'Was ist dein Beruf?', exampleArabic: 'ما مهنتك؟', type: 'noun' },
        { german: 'Arbeit', arabic: 'العمل', gender: 'die', plural: 'Arbeiten', example: 'Ich suche Arbeit.', exampleArabic: 'أبحث عن عمل.', type: 'noun' },
        { german: 'Job', arabic: 'الوظيفة', gender: 'der', plural: 'Jobs', example: 'Ich habe einen neuen Job.', exampleArabic: 'لدي وظيفة جديدة.', type: 'noun' },
        { german: 'Chef / Chefin', arabic: 'المدير / المديرة', gender: 'der', plural: 'Chefs', example: 'Mein Chef ist streng.', exampleArabic: 'مديري صارم.', type: 'noun' },
        { german: 'Büro', arabic: 'المكتب', gender: 'das', plural: 'Büros', example: 'Ich arbeite im Büro.', exampleArabic: 'أعمل في المكتب.', type: 'noun' },
        { german: 'Firma', arabic: 'الشركة', gender: 'die', plural: 'Firmen', example: 'Die Firma ist groß.', exampleArabic: 'الشركة كبيرة.', type: 'noun' },
        { german: 'Gehalt', arabic: 'الراتب', gender: 'das', plural: 'Gehälter', example: 'Das Gehalt ist gut.', exampleArabic: 'الراتب جيد.', type: 'noun' },
        { german: 'arbeiten als', arabic: 'يعمل كـ', example: 'Ich arbeite als Koch.', exampleArabic: 'أعمل طباخاً.', type: 'verb' },
        { german: 'verdienen', arabic: 'يكسب', example: 'Sie verdient gut.', exampleArabic: 'تكسب جيداً.', type: 'verb' },
        { german: 'arbeitslos', arabic: 'عاطل عن العمل', example: 'Er ist arbeitslos.', exampleArabic: 'هو عاطل.', type: 'adjective' },
        { german: 'selbstständig', arabic: 'مستقل (صاحب عمل)', example: 'Ich bin selbstständig.', exampleArabic: 'أنا مستقل.', type: 'adjective' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a1-07-q1',
            question: 'أكمل: "Ich ___ keinen Job." (ليس لديّ وظيفة)',
            answer: 'habe',
            hint: 'تصريف haben مع ich',
          },
          {
            type: 'multiple-choice', id: 'a1-07-q2',
            question: 'كيف تنفي جملة "Ich habe ein Auto"؟',
            options: ['Ich habe nicht Auto.', 'Ich habe kein Auto.', 'Ich nicht habe Auto.', 'Ich habe keine Auto.'],
            answer: 'Ich habe kein Auto.',
          },
          {
            type: 'fill-blank', id: 'a1-07-q3',
            question: 'أكمل: "Sie arbeitet ___ Lehrerin." (كمعلمة)',
            answer: 'als',
            hint: 'حرف الجر المستخدم مع المهنة هو als',
          },
          {
            type: 'multiple-choice', id: 'a1-07-q4',
            question: 'متى نستخدم "nicht" ومتى "kein"؟',
            options: [
              'nicht للأفعال، kein للأسماء النكرة',
              'kein للأفعال، nicht للأسماء',
              'كلاهما نفس الاستخدام',
              'nicht للمذكر، kein للمؤنث',
            ],
            answer: 'nicht للأفعال، kein للأسماء النكرة',
          },
          {
            type: 'fill-blank', id: 'a1-07-q5',
            question: 'أكمل: "Ich arbeite ___ am Wochenende." (لا أعمل في عطلة الأسبوع)',
            answer: 'nicht',
            hint: 'النفي مع الأفعال: nicht',
          },
          {
            type: 'matching', id: 'a1-07-q6',
            question: 'اربط المهنة بمعناها:',
            pairs: [
              { left: 'Arzt', right: 'طبيب' },
              { left: 'Lehrer', right: 'معلم' },
              { left: 'Koch', right: 'طباخ' },
              { left: 'Verkäufer', right: 'بائع' },
              { left: 'Ingenieur', right: 'مهندس' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a1-07-q7',
            question: 'رتّب: "ليس لديّ وقت اليوم"',
            words: ['Ich', 'habe', 'heute', 'keine', 'Zeit'],
            answer: 'Ich habe heute keine Zeit',
          },
          {
            type: 'speaking', id: 'a1-07-q8',
            question: 'قل بالألمانية: "أنا مهندس وأعمل في مكتب كبير"',
            answer: 'Ich bin Ingenieur und ich arbeite in einem großen Büro',
            hint: 'المهنة بدون ein',
          },
          {
            type: 'fill-blank', id: 'a1-07-q9',
            question: 'استمع وأكمل: "Sie ___ drei Kinder." (لديها)',
            audioPrompt: 'Sie hat drei Kinder.',
            answer: 'hat',
            hint: 'haben مع sie: hat',
          },
          {
            type: 'multiple-choice', id: 'a1-07-q10',
            question: 'أي جملة صحيحة لمعنى "أنا لست معلماً"؟',
            options: [
              'Ich bin kein Lehrer.',
              'Ich bin nicht Lehrer.',
              'كلاهما صحيح',
              'لا شيء صحيح',
            ],
            answer: 'كلاهما صحيح',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 8 — الوقت واليوم
    // ─────────────────────────────────────────────
    {
      id: 'a1-08',
      title: 'الوقت والتاريخ — Uhrzeit und Datum',
      order: 8,
      grammar: {
        title: 'قراءة الساعة + أيام الأسبوع + الأشهر',
        content: `هناك طريقتان للتعبير عن الوقت:
- **الرسمية:** Es ist 14:30 Uhr. (الرقمية)
- **اليومية:** Es ist halb drei. (الاجتماعية)

⚠️ القاعدة الألمانية المحيرة: **halb + الساعة التالية** (halb drei = 2:30 وليس 3:30!)`,
        tables: [
          {
            title: 'قراءة الساعة — اليومية',
            headers: ['الوقت', 'بالألمانية', 'المعنى'],
            rows: [
              { cells: ['3:00', 'Es ist drei Uhr.', 'الساعة 3 تماماً'] },
              { cells: ['3:15', 'Viertel nach drei', '3 وربع'] },
              { cells: ['3:30', 'halb vier ⚠️', '3 ونصف (حرفياً: نصف الرابعة)'] },
              { cells: ['3:45', 'Viertel vor vier', '4 إلا ربع'] },
              { cells: ['3:10', 'zehn nach drei', '3 وعشر دقائق'] },
              { cells: ['3:50', 'zehn vor vier', '4 إلا عشر دقائق'] },
            ],
            theme: 'default',
          },
          {
            title: 'أيام الأسبوع (am + Tag)',
            headers: ['Tag', 'Kurz', 'المعنى'],
            rows: [
              { cells: ['Montag', 'Mo.', 'الاثنين'] },
              { cells: ['Dienstag', 'Di.', 'الثلاثاء'] },
              { cells: ['Mittwoch', 'Mi.', 'الأربعاء'] },
              { cells: ['Donnerstag', 'Do.', 'الخميس'] },
              { cells: ['Freitag', 'Fr.', 'الجمعة'] },
              { cells: ['Samstag', 'Sa.', 'السبت'] },
              { cells: ['Sonntag', 'So.', 'الأحد'] },
            ],
            theme: 'default',
          },
          {
            title: 'الأشهر (im + Monat)',
            headers: ['Deutsch', 'المعنى', 'Deutsch', 'المعنى'],
            rows: [
              { cells: ['Januar', 'يناير', 'Juli', 'يوليو'] },
              { cells: ['Februar', 'فبراير', 'August', 'أغسطس'] },
              { cells: ['März', 'مارس', 'September', 'سبتمبر'] },
              { cells: ['April', 'أبريل', 'Oktober', 'أكتوبر'] },
              { cells: ['Mai', 'مايو', 'November', 'نوفمبر'] },
              { cells: ['Juni', 'يونيو', 'Dezember', 'ديسمبر'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'مع أيام الأسبوع استخدم am: am Montag, am Freitag.',
            example: '**Am** Montag habe ich Deutschkurs.',
            translation: 'يوم الاثنين عندي دورة ألمانية.',
          },
          {
            rule: 'مع الأشهر والفصول استخدم im: im Januar, im Sommer.',
            example: '**Im** Sommer fahre ich nach Marokko.',
            translation: 'في الصيف أسافر للمغرب.',
          },
          {
            rule: 'مع الساعة استخدم um: um 7 Uhr, um halb zehn.',
            example: 'Der Kurs beginnt **um** 9 Uhr.',
            translation: 'الدورة تبدأ الساعة 9.',
          },
        ],
        examples: [
          'Es ist halb acht. — الساعة السابعة والنصف.',
          'Der Kurs beginnt um neun Uhr. — الدورة تبدأ الساعة التاسعة.',
          'Am Freitag habe ich frei. — يوم الجمعة عندي إجازة.',
          'Im Sommer fahre ich nach Marokko. — في الصيف أسافر إلى المغرب.',
          'Mein Geburtstag ist am zwanzigsten Mai. — عيد ميلادي في 20 مايو.',
          'Wann kommst du? — Um sieben Uhr abends. — متى تأتي؟ — الساعة السابعة مساءً.',
          'Heute ist Montag, der 15. März. — اليوم الاثنين 15 مارس.',
          'Der Zug fährt um Viertel nach acht. — القطار ينطلق الساعة 8:15.',
        ],
        tip: '💡 حيلة لحفظ halb: فكر به كـ"نصف الطريق نحو الساعة التالية". halb drei = "نصف الطريق إلى 3" = 2:30. مع الوقت، ركز على الساعة التي تقترب، وليس التي مضت.',
      },
      vocabulary: [
        { german: 'Uhr', arabic: 'الساعة', gender: 'die', plural: 'Uhren', example: 'Wie viel Uhr ist es?', exampleArabic: 'كم الساعة؟', type: 'noun' },
        { german: 'Zeit', arabic: 'الوقت', gender: 'die', plural: 'Zeiten', example: 'Ich habe keine Zeit.', exampleArabic: 'ليس لدي وقت.', type: 'noun' },
        { german: 'Tag', arabic: 'اليوم', gender: 'der', plural: 'Tage', example: 'Guten Tag!', exampleArabic: 'طاب يومك!', type: 'noun' },
        { german: 'Woche', arabic: 'الأسبوع', gender: 'die', plural: 'Wochen', example: 'Diese Woche arbeite ich viel.', exampleArabic: 'هذا الأسبوع أعمل كثيراً.', type: 'noun' },
        { german: 'Monat', arabic: 'الشهر', gender: 'der', plural: 'Monate', example: 'Der Monat hat 30 Tage.', exampleArabic: 'الشهر به 30 يوماً.', type: 'noun' },
        { german: 'Jahr', arabic: 'السنة', gender: 'das', plural: 'Jahre', example: 'Das Jahr 2024.', exampleArabic: 'سنة 2024.', type: 'noun' },
        { german: 'Montag', arabic: 'الاثنين', gender: 'der', example: 'Am Montag arbeite ich.', exampleArabic: 'يوم الاثنين أعمل.', type: 'noun' },
        { german: 'Mittwoch', arabic: 'الأربعاء', gender: 'der', example: 'Am Mittwoch habe ich Kurs.', exampleArabic: 'يوم الأربعاء عندي دورة.', type: 'noun' },
        { german: 'Freitag', arabic: 'الجمعة', gender: 'der', example: 'Am Freitag ist Wochenende.', exampleArabic: 'الجمعة عطلة.', type: 'noun' },
        { german: 'Samstag', arabic: 'السبت', gender: 'der', example: 'Am Samstag schlafe ich lange.', exampleArabic: 'السبت أنام طويلاً.', type: 'noun' },
        { german: 'Sonntag', arabic: 'الأحد', gender: 'der', example: 'Am Sonntag besuche ich Freunde.', exampleArabic: 'الأحد أزور أصدقاء.', type: 'noun' },
        { german: 'Januar', arabic: 'يناير', gender: 'der', example: 'Im Januar ist es kalt.', exampleArabic: 'في يناير البرد.', type: 'noun' },
        { german: 'Sommer', arabic: 'الصيف', gender: 'der', example: 'Im Sommer ist es heiß.', exampleArabic: 'في الصيف الحر.', type: 'noun' },
        { german: 'Winter', arabic: 'الشتاء', gender: 'der', example: 'Der Winter ist lang.', exampleArabic: 'الشتاء طويل.', type: 'noun' },
        { german: 'Frühling', arabic: 'الربيع', gender: 'der', example: 'Im Frühling blühen die Blumen.', exampleArabic: 'في الربيع تزهر الورود.', type: 'noun' },
        { german: 'Herbst', arabic: 'الخريف', gender: 'der', example: 'Der Herbst ist bunt.', exampleArabic: 'الخريف ملون.', type: 'noun' },
        { german: 'heute', arabic: 'اليوم', example: 'Heute lerne ich Deutsch.', exampleArabic: 'اليوم أتعلم.', type: 'adverb' },
        { german: 'morgen', arabic: 'غداً', example: 'Morgen habe ich frei.', exampleArabic: 'غداً عندي إجازة.', type: 'adverb' },
        { german: 'gestern', arabic: 'أمس', example: 'Gestern war ich krank.', exampleArabic: 'أمس كنت مريضاً.', type: 'adverb' },
        { german: 'pünktlich', arabic: 'دقيق المواعيد', example: 'Bitte sei pünktlich!', exampleArabic: 'كن دقيق المواعيد!', type: 'adjective' },
        { german: 'Geburtstag', arabic: 'عيد الميلاد', gender: 'der', plural: 'Geburtstage', example: 'Wann ist dein Geburtstag?', exampleArabic: 'متى عيد ميلادك؟', type: 'noun' },
        { german: 'Termin', arabic: 'الموعد', gender: 'der', plural: 'Termine', example: 'Ich habe einen Termin.', exampleArabic: 'لدي موعد.', type: 'noun' },
        { german: 'beginnen', arabic: 'يبدأ', example: 'Der Kurs beginnt um 9.', exampleArabic: 'الدورة تبدأ الساعة 9.', type: 'verb' },
        { german: 'enden', arabic: 'ينتهي', example: 'Die Arbeit endet um 17 Uhr.', exampleArabic: 'العمل ينتهي الساعة 5.', type: 'verb' },
      ],
      exercise: {
        questions: [
          {
            type: 'multiple-choice', id: 'a1-08-q1',
            question: 'ماذا تعني "Es ist halb acht"؟',
            options: ['8:30', '7:30', '8:15', '7:45'],
            answer: '7:30',
          },
          {
            type: 'fill-blank', id: 'a1-08-q2',
            question: 'أكمل: "___ Montag habe ich Deutschkurs." (يوم الاثنين)',
            answer: 'Am',
            hint: 'حرف الجر مع أيام الأسبوع هو am',
          },
          {
            type: 'multiple-choice', id: 'a1-08-q3',
            question: 'كيف تقول "الساعة الثالثة والربع"؟',
            options: ['Es ist halb drei.', 'Es ist Viertel vor drei.', 'Es ist Viertel nach drei.', 'Es ist drei Uhr.'],
            answer: 'Es ist Viertel nach drei.',
          },
          {
            type: 'fill-blank', id: 'a1-08-q4',
            question: 'أكمل: "___ Januar ist es sehr kalt." (في يناير)',
            answer: 'Im',
            hint: 'حرف الجر مع الأشهر هو im',
          },
          {
            type: 'multiple-choice', id: 'a1-08-q5',
            question: 'ما معنى "Mein Geburtstag ist im August"؟',
            options: ['عيد ميلادي في أغسطس.', 'عيد ميلادي في يونيو.', 'أنا وُلدت يوم الاثنين.', 'لديّ حفلة في أغسطس.'],
            answer: 'عيد ميلادي في أغسطس.',
          },
          {
            type: 'matching', id: 'a1-08-q6',
            question: 'اربط اليوم بمعناه:',
            pairs: [
              { left: 'Montag', right: 'الاثنين' },
              { left: 'Mittwoch', right: 'الأربعاء' },
              { left: 'Freitag', right: 'الجمعة' },
              { left: 'Sonntag', right: 'الأحد' },
              { left: 'Samstag', right: 'السبت' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a1-08-q7',
            question: 'رتّب: "الدورة تبدأ الساعة 9"',
            words: ['Der', 'Kurs', 'beginnt', 'um', '9', 'Uhr'],
            answer: 'Der Kurs beginnt um 9 Uhr',
          },
          {
            type: 'speaking', id: 'a1-08-q8',
            question: 'قل بالألمانية: "يوم السبت عندي إجازة"',
            answer: 'Am Samstag habe ich frei',
            hint: 'am + اليوم',
          },
          {
            type: 'fill-blank', id: 'a1-08-q9',
            question: 'استمع واكتب الوقت: "Es ist ___." (الساعة 2:30)',
            audioPrompt: 'Es ist halb drei.',
            answer: 'halb drei',
            hint: 'halb + الساعة التالية',
          },
          {
            type: 'multiple-choice', id: 'a1-08-q10',
            question: 'ما معنى "Viertel vor neun"؟',
            options: ['9:15', '8:45', '9:45', '8:15'],
            answer: '8:45',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 9 — التسوق والألوان
    // ─────────────────────────────────────────────
    {
      id: 'a1-09',
      title: 'التسوق والألوان — Einkaufen und Farben',
      order: 9,
      grammar: {
        title: 'الصفات مع Akkusativ + dieser/diese',
        content: `عند الشراء، نستخدم كثيراً **الصفات** مع الأسماء.
الصفة في الألمانية **تتغير** حسب جنس الاسم والحالة والأداة.

**dieser/diese/dieses** = هذا/هذه (يُصرَّف كـ der/die/das)`,
        tables: [
          {
            title: 'الصفات بعد ein/eine في Akkusativ',
            headers: ['Genus', 'Akkusativ + Adjektiv', 'مثال'],
            rows: [
              { cells: ['Maskulin', 'einen + adj + en', 'einen rot**en** Pullover'] },
              { cells: ['Feminin', 'eine + adj + e', 'eine blau**e** Hose'] },
              { cells: ['Neutrum', 'ein + adj + es', 'ein weiß**es** Hemd'] },
              { cells: ['Plural', '— + adj + e', 'rot**e** Schuhe'] },
            ],
            theme: 'cases',
          },
          {
            title: 'dieser/diese/dieses — كما der/die/das',
            headers: ['Kasus', 'Maskulin', 'Feminin', 'Neutrum', 'Plural'],
            rows: [
              { cells: ['Nominativ', 'dieser', 'diese', 'dieses', 'diese'] },
              { cells: ['Akkusativ', 'diesen', 'diese', 'dieses', 'diese'] },
            ],
            theme: 'cases',
            note: 'أمثلة: dieser Pullover, diese Hose, dieses Hemd, diese Schuhe.',
          },
          {
            title: 'الألوان',
            headers: ['Deutsch', 'العربية', 'Deutsch', 'العربية'],
            rows: [
              { cells: ['rot', 'أحمر', 'blau', 'أزرق'] },
              { cells: ['grün', 'أخضر', 'gelb', 'أصفر'] },
              { cells: ['schwarz', 'أسود', 'weiß', 'أبيض'] },
              { cells: ['grau', 'رمادي', 'braun', 'بني'] },
              { cells: ['rosa', 'وردي', 'lila', 'بنفسجي'] },
              { cells: ['orange', 'برتقالي', 'bunt', 'ملون'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'عبارات مهمة في المتجر للسؤال عن السعر والمقاس.',
            example: 'Was kostet das? / Welche Größe haben Sie?',
            translation: 'كم يكلف هذا؟ / ما هو مقاسك؟',
          },
          {
            rule: 'عند المقارنة استخدم zu (= أكثر من اللازم).',
            example: 'Das ist **zu** teuer. / Die Hose ist **zu** klein.',
            translation: 'هذا غالٍ جداً. / البنطلون صغير جداً.',
          },
          {
            rule: 'dieser يشير إلى شيء محدد قريب.',
            example: '**Dieser** Pullover ist schön. Wie viel kostet **dieser** Pullover?',
            translation: 'هذا البلوفر جميل. كم يكلف هذا البلوفر؟',
          },
        ],
        examples: [
          'Ich kaufe den roten Pullover. Er kostet 25 Euro. — أشتري البلوفر الأحمر. يكلف 25 يورو.',
          'Welche Farbe möchten Sie? — Blau, bitte. — أي لون تريد؟ — أزرق من فضلك.',
          'Ich möchte die schwarzen Schuhe anprobieren. — أريد تجربة الحذاء الأسود.',
          'Das ist zu teuer. Haben Sie etwas Günstigeres? — هذا غالٍ جداً. هل عندكم شيء أرخص؟',
          'Diese Hose ist zu groß. Ich brauche Größe 40. — هذا البنطلون كبير جداً. أحتاج مقاس 40.',
          'Gibt es das auch in Blau? — هل يوجد هذا باللون الأزرق أيضاً؟',
          'Wo sind die Umkleidekabinen? — أين غرف القياس؟',
          'Zahlen Sie bar oder mit Karte? — هل تدفع نقداً أم بالبطاقة؟',
        ],
        tip: '💡 لتجنب أخطاء نهايات الصفات في البداية: احفظ عبارات كاملة (einen roten Pullover, eine blaue Hose) بدلاً من حفظ القواعد. مع الوقت سوف يصبح النمط طبيعياً.',
      },
      vocabulary: [
        { german: 'rot', arabic: 'أحمر', example: 'ein roter Apfel', exampleArabic: 'تفاحة حمراء', type: 'adjective' },
        { german: 'blau', arabic: 'أزرق', example: 'ein blaues Hemd', exampleArabic: 'قميص أزرق', type: 'adjective' },
        { german: 'grün', arabic: 'أخضر', example: 'eine grüne Tasche', exampleArabic: 'حقيبة خضراء', type: 'adjective' },
        { german: 'gelb', arabic: 'أصفر', example: 'eine gelbe Blume', exampleArabic: 'زهرة صفراء', type: 'adjective' },
        { german: 'schwarz', arabic: 'أسود', example: 'schwarze Schuhe', exampleArabic: 'حذاء أسود', type: 'adjective' },
        { german: 'weiß', arabic: 'أبيض', example: 'ein weißes T-Shirt', exampleArabic: 'قميص أبيض', type: 'adjective' },
        { german: 'grau', arabic: 'رمادي', example: 'ein grauer Pullover', exampleArabic: 'بلوفر رمادي', type: 'adjective' },
        { german: 'braun', arabic: 'بني', example: 'braune Schuhe', exampleArabic: 'حذاء بني', type: 'adjective' },
        { german: 'Pullover / Pulli', arabic: 'البلوفر', gender: 'der', plural: 'Pullover', example: 'Der Pullover ist warm.', exampleArabic: 'البلوفر دافئ.', type: 'noun' },
        { german: 'Hose', arabic: 'البنطلون', gender: 'die', plural: 'Hosen', example: 'Die Hose passt gut.', exampleArabic: 'البنطلون يناسب.', type: 'noun' },
        { german: 'Hemd', arabic: 'القميص', gender: 'das', plural: 'Hemden', example: 'Das Hemd ist neu.', exampleArabic: 'القميص جديد.', type: 'noun' },
        { german: 'T-Shirt', arabic: 'القميص القصير', gender: 'das', plural: 'T-Shirts', example: 'Ich trage ein T-Shirt.', exampleArabic: 'أرتدي قميصاً قصيراً.', type: 'noun' },
        { german: 'Jacke', arabic: 'الجاكيت', gender: 'die', plural: 'Jacken', example: 'Die Jacke ist warm.', exampleArabic: 'الجاكيت دافئ.', type: 'noun' },
        { german: 'Rock', arabic: 'التنورة', gender: 'der', plural: 'Röcke', example: 'Ein schwarzer Rock.', exampleArabic: 'تنورة سوداء.', type: 'noun' },
        { german: 'Kleid', arabic: 'الفستان', gender: 'das', plural: 'Kleider', example: 'Das Kleid ist schön.', exampleArabic: 'الفستان جميل.', type: 'noun' },
        { german: 'Schuhe', arabic: 'الأحذية', gender: 'pl', example: 'Die Schuhe sind groß.', exampleArabic: 'الأحذية كبيرة.', type: 'noun' },
        { german: 'Größe', arabic: 'المقاس', gender: 'die', plural: 'Größen', example: 'Welche Größe haben Sie?', exampleArabic: 'ما مقاسك؟', type: 'noun' },
        { german: 'Farbe', arabic: 'اللون', gender: 'die', plural: 'Farben', example: 'Welche Farbe?', exampleArabic: 'أي لون؟', type: 'noun' },
        { german: 'Geschäft', arabic: 'المتجر', gender: 'das', plural: 'Geschäfte', example: 'Das Geschäft ist geöffnet.', exampleArabic: 'المتجر مفتوح.', type: 'noun' },
        { german: 'Supermarkt', arabic: 'السوبرماركت', gender: 'der', plural: 'Supermärkte', example: 'Ich gehe in den Supermarkt.', exampleArabic: 'أذهب للسوبرماركت.', type: 'noun' },
        { german: 'teuer', arabic: 'غالٍ', example: 'Das ist zu teuer!', exampleArabic: 'هذا غالٍ جداً!', type: 'adjective' },
        { german: 'günstig / billig', arabic: 'رخيص', example: 'Das ist günstig.', exampleArabic: 'هذا رخيص.', type: 'adjective' },
        { german: 'kaufen', arabic: 'يشتري', example: 'Ich kaufe einen Pullover.', exampleArabic: 'أشتري بلوفر.', type: 'verb' },
        { german: 'anprobieren', arabic: 'يجرب (ملابس)', example: 'Kann ich das anprobieren?', exampleArabic: 'هل يمكنني التجربة؟', type: 'verb' },
      ],
      exercise: {
        questions: [
          {
            type: 'multiple-choice', id: 'a1-09-q1',
            question: 'كيف تقول "أشتري البلوفر" (مذكر — Akkusativ)؟',
            options: ['Ich kaufe der Pullover.', 'Ich kaufe den Pullover.', 'Ich kaufe dem Pullover.', 'Ich kaufe ein Pullover.'],
            answer: 'Ich kaufe den Pullover.',
          },
          {
            type: 'fill-blank', id: 'a1-09-q2',
            question: 'أكمل: "Ich möchte einen ___ Pullover." (أحمر)',
            answer: 'roten',
            hint: 'الصفة rot في Akkusativ مذكر تصبح roten',
          },
          {
            type: 'multiple-choice', id: 'a1-09-q3',
            question: 'ما معنى "Das ist zu teuer"؟',
            options: ['هذا جميل جداً.', 'هذا غالٍ جداً.', 'هذا صغير جداً.', 'هذا مناسب.'],
            answer: 'هذا غالٍ جداً.',
          },
          {
            type: 'fill-blank', id: 'a1-09-q4',
            question: 'أكمل: "Kann ich das ___?" (هل يمكنني تجربته؟)',
            answer: 'anprobieren',
            hint: 'فعل يعني تجربة الملابس',
          },
          {
            type: 'matching', id: 'a1-09-q5',
            question: 'اربط اللون بمعناه:',
            pairs: [
              { left: 'rot', right: 'أحمر' },
              { left: 'blau', right: 'أزرق' },
              { left: 'grün', right: 'أخضر' },
              { left: 'schwarz', right: 'أسود' },
              { left: 'gelb', right: 'أصفر' },
              { left: 'weiß', right: 'أبيض' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a1-09-q6',
            question: 'رتّب: "أريد قميصاً أبيض"',
            words: ['Ich', 'möchte', 'ein', 'weißes', 'Hemd'],
            answer: 'Ich möchte ein weißes Hemd',
          },
          {
            type: 'speaking', id: 'a1-09-q7',
            question: 'قل بالألمانية: "كم يكلف هذا البنطلون؟"',
            answer: 'Wie viel kostet diese Hose',
            hint: 'Hose مؤنث → diese',
          },
          {
            type: 'fill-blank', id: 'a1-09-q8',
            question: 'استمع وأكمل: "Die Hose ist zu ___." (كبيرة)',
            audioPrompt: 'Die Hose ist zu groß.',
            answer: 'groß',
            hint: 'كبير بالألمانية',
          },
          {
            type: 'multiple-choice', id: 'a1-09-q9',
            question: 'أي جملة صحيحة؟',
            options: [
              'Ich kaufe eine blau Kleid.',
              'Ich kaufe ein blaues Kleid.',
              'Ich kaufe einen blauen Kleid.',
              'Ich kaufe das blau Kleid.',
            ],
            answer: 'Ich kaufe ein blaues Kleid.',
          },
          {
            type: 'fill-blank', id: 'a1-09-q10',
            question: 'أكمل: "Zahlen Sie bar oder mit ___?" (بطاقة)',
            answer: 'Karte',
            hint: 'البطاقة بالألمانية',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 10 — الصحة والجسم
    // ─────────────────────────────────────────────
    {
      id: 'a1-10',
      title: 'الصحة والجسم — Gesundheit und Körper',
      order: 10,
      grammar: {
        title: 'الأفعال الناقصة — Modalverben',
        content: `الأفعال الناقصة تُعبّر عن القدرة أو الضرورة أو الرغبة.

**القاعدة الذهبية:** مع الفعل الناقص، **الفعل الأصلي يأتي في نهاية الجملة بصيغة Infinitiv** (المصدر).

→ Ich **muss** heute zum Arzt **gehen**. ✅
→ Ich muss heute gehen zum Arzt. ❌`,
        tables: [
          {
            title: 'تصريف الأفعال الناقصة الأساسية',
            headers: ['Pronomen', 'können', 'müssen', 'wollen', 'dürfen'],
            rows: [
              { cells: ['ich', 'kann', 'muss', 'will', 'darf'] },
              { cells: ['du', 'kannst', 'musst', 'willst', 'darfst'] },
              { cells: ['er/sie/es', 'kann', 'muss', 'will', 'darf'] },
              { cells: ['wir', 'können', 'müssen', 'wollen', 'dürfen'] },
              { cells: ['ihr', 'könnt', 'müsst', 'wollt', 'dürft'] },
              { cells: ['sie/Sie', 'können', 'müssen', 'wollen', 'dürfen'] },
            ],
            theme: 'conjugation',
            note: '⚠️ ich و er لهما نفس التصريف في الأفعال الناقصة.',
          },
          {
            title: 'معنى كل فعل ناقص',
            headers: ['Verb', 'المعنى', 'مثال'],
            rows: [
              { cells: ['können', 'يستطيع', 'Ich kann Deutsch sprechen.'] },
              { cells: ['müssen', 'يجب', 'Ich muss zur Arbeit gehen.'] },
              { cells: ['wollen', 'يريد', 'Ich will Deutsch lernen.'] },
              { cells: ['dürfen', 'مسموح له', 'Hier darf man nicht rauchen.'] },
              { cells: ['sollen', 'يُفترض أن', 'Du sollst viel trinken.'] },
              { cells: ['möchten', 'يود', 'Ich möchte einen Kaffee.'] },
            ],
            theme: 'default',
          },
          {
            title: 'أجزاء الجسم',
            headers: ['Deutsch', 'العربية', 'Deutsch', 'العربية'],
            rows: [
              { cells: ['der Kopf', 'الرأس', 'die Hand', 'اليد'] },
              { cells: ['das Auge', 'العين', 'der Fuß', 'القدم'] },
              { cells: ['der Mund', 'الفم', 'das Bein', 'الساق'] },
              { cells: ['die Nase', 'الأنف', 'der Arm', 'الذراع'] },
              { cells: ['das Ohr', 'الأذن', 'der Bauch', 'البطن'] },
              { cells: ['der Hals', 'الرقبة', 'der Rücken', 'الظهر'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'البنية: الضمير + الفعل الناقص (مُصرَّف) + ... + الفعل الأصلي (Infinitiv).',
            example: 'Ich **muss** heute zum Arzt **gehen**.',
            translation: 'يجب أن أذهب إلى الطبيب اليوم.',
          },
          {
            rule: 'للتعبير عن الألم استخدم: Mir tut ... weh / Ich habe ... schmerzen.',
            example: 'Mir tut der Kopf weh. / Ich habe Kopfschmerzen.',
            translation: 'رأسي يؤلمني / لدي صداع.',
          },
          {
            rule: 'möchten أدبٌ في الطلب، أقوى من wollen.',
            example: '✅ Ich möchte Wasser. (مهذب) / ⚠️ Ich will Wasser. (مباشر)',
            translation: 'أريد ماءً (طلب مؤدب) / أريد ماءً (طلب مباشر).',
          },
        ],
        examples: [
          'Mir tut der Kopf weh. — رأسي يؤلمني.',
          'Ich muss zum Arzt gehen. — يجب أن أذهب إلى الطبيب.',
          'Ich kann heute nicht arbeiten. Ich bin krank. — لا أستطيع العمل اليوم. أنا مريض.',
          'Du musst viel Wasser trinken. — يجب أن تشرب كثيراً من الماء.',
          'Kann ich bitte ein Rezept bekommen? — هل يمكنني الحصول على وصفة من فضلك؟',
          'Ich will heute früh schlafen. — أريد النوم مبكراً اليوم.',
          'Hier darf man nicht rauchen. — التدخين ممنوع هنا.',
          'Sie sollen diese Tabletten dreimal täglich nehmen. — يجب أن تأخذ هذه الأقراص 3 مرات يومياً.',
        ],
        tip: '💡 عند زيارة الطبيب في ألمانيا، لا تنسَ بطاقة التأمين الصحي (Krankenkarte). وستحتاج غالباً لموعد مسبق (Termin). الكلمات الأساسية: Wo tut es weh? (أين تشعر بالألم؟) و seit wann? (منذ متى؟).',
      },
      vocabulary: [
        { german: 'Körper', arabic: 'الجسم', gender: 'der', plural: 'Körper', example: 'Der Körper ist müde.', exampleArabic: 'الجسم متعب.', type: 'noun' },
        { german: 'Kopf', arabic: 'الرأس', gender: 'der', plural: 'Köpfe', example: 'Mir tut der Kopf weh.', exampleArabic: 'رأسي يؤلمني.', type: 'noun' },
        { german: 'Bauch', arabic: 'البطن', gender: 'der', plural: 'Bäuche', example: 'Ich habe Bauchschmerzen.', exampleArabic: 'بطني يؤلمني.', type: 'noun' },
        { german: 'Arm', arabic: 'الذراع', gender: 'der', plural: 'Arme', example: 'Mein Arm tut weh.', exampleArabic: 'ذراعي تؤلم.', type: 'noun' },
        { german: 'Bein', arabic: 'الساق', gender: 'das', plural: 'Beine', example: 'Das Bein ist gebrochen.', exampleArabic: 'الساق مكسورة.', type: 'noun' },
        { german: 'Hand', arabic: 'اليد', gender: 'die', plural: 'Hände', example: 'Gib mir die Hand.', exampleArabic: 'أعطني يدك.', type: 'noun' },
        { german: 'Fuß', arabic: 'القدم', gender: 'der', plural: 'Füße', example: 'Meine Füße sind kalt.', exampleArabic: 'قدماي باردتان.', type: 'noun' },
        { german: 'Auge', arabic: 'العين', gender: 'das', plural: 'Augen', example: 'Ihre Augen sind blau.', exampleArabic: 'عيناها زرقاوان.', type: 'noun' },
        { german: 'Ohr', arabic: 'الأذن', gender: 'das', plural: 'Ohren', example: 'Mein Ohr tut weh.', exampleArabic: 'أذني تؤلم.', type: 'noun' },
        { german: 'Mund', arabic: 'الفم', gender: 'der', plural: 'Münder', example: 'Mach den Mund auf!', exampleArabic: 'افتح فمك!', type: 'noun' },
        { german: 'Nase', arabic: 'الأنف', gender: 'die', plural: 'Nasen', example: 'Meine Nase ist zu.', exampleArabic: 'أنفي مسدود.', type: 'noun' },
        { german: 'Zahn', arabic: 'السن', gender: 'der', plural: 'Zähne', example: 'Ich habe Zahnschmerzen.', exampleArabic: 'ضرسي يؤلم.', type: 'noun' },
        { german: 'wehtun', arabic: 'يؤلم', example: 'Was tut weh?', exampleArabic: 'ما الذي يؤلمك؟', type: 'verb' },
        { german: 'krank', arabic: 'مريض', example: 'Ich bin krank.', exampleArabic: 'أنا مريض.', type: 'adjective' },
        { german: 'gesund', arabic: 'بصحة جيدة', example: 'Ich bin wieder gesund.', exampleArabic: 'عدت إلى الصحة.', type: 'adjective' },
        { german: 'Schmerzen', arabic: 'الآلام', gender: 'pl', example: 'Ich habe starke Schmerzen.', exampleArabic: 'لدي آلام قوية.', type: 'noun' },
        { german: 'Arzt / Ärztin', arabic: 'الطبيب / ـة', gender: 'der', example: 'Ich gehe zum Arzt.', exampleArabic: 'أذهب للطبيب.', type: 'noun' },
        { german: 'Krankenhaus', arabic: 'المستشفى', gender: 'das', plural: 'Krankenhäuser', example: 'Er ist im Krankenhaus.', exampleArabic: 'هو في المستشفى.', type: 'noun' },
        { german: 'Apotheke', arabic: 'الصيدلية', gender: 'die', plural: 'Apotheken', example: 'Die Apotheke ist nebenan.', exampleArabic: 'الصيدلية بجانبنا.', type: 'noun' },
        { german: 'Medikament', arabic: 'الدواء', gender: 'das', plural: 'Medikamente', example: 'Ich brauche ein Medikament.', exampleArabic: 'أحتاج دواء.', type: 'noun' },
        { german: 'Rezept', arabic: 'الوصفة الطبية', gender: 'das', plural: 'Rezepte', example: 'Haben Sie ein Rezept?', exampleArabic: 'هل لديك وصفة؟', type: 'noun' },
        { german: 'Tablette', arabic: 'القرص الدوائي', gender: 'die', plural: 'Tabletten', example: 'Drei Tabletten pro Tag.', exampleArabic: '3 أقراص يومياً.', type: 'noun' },
        { german: 'Termin', arabic: 'الموعد', gender: 'der', plural: 'Termine', example: 'Ich habe einen Termin.', exampleArabic: 'لدي موعد.', type: 'noun' },
        { german: 'Versicherung', arabic: 'التأمين', gender: 'die', plural: 'Versicherungen', example: 'Meine Versicherung zahlt.', exampleArabic: 'تأميني يدفع.', type: 'noun' },
        { german: 'Fieber', arabic: 'الحمى', gender: 'das', example: 'Ich habe Fieber.', exampleArabic: 'لدي حمى.', type: 'noun' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a1-10-q1',
            question: 'أكمل: "Ich ___ heute zum Arzt gehen." (يجب عليّ)',
            answer: 'muss',
            hint: 'الفعل الناقص müssen مع ich: muss',
          },
          {
            type: 'multiple-choice', id: 'a1-10-q2',
            question: 'كيف تقول "أنا لا أستطيع العمل اليوم"؟',
            options: [
              'Ich will heute nicht arbeiten.',
              'Ich kann heute nicht arbeiten.',
              'Ich muss heute arbeiten.',
              'Ich darf heute arbeiten.',
            ],
            answer: 'Ich kann heute nicht arbeiten.',
          },
          {
            type: 'fill-blank', id: 'a1-10-q3',
            question: 'أكمل: "Mir tut der ___ weh." (رأسي يؤلمني)',
            answer: 'Kopf',
            hint: 'الرأس بالألمانية',
          },
          {
            type: 'multiple-choice', id: 'a1-10-q4',
            question: 'ما معنى "Du musst viel Wasser trinken"؟',
            options: [
              'يمكنك شرب الكثير من الماء.',
              'تريد شرب الكثير من الماء.',
              'يجب أن تشرب الكثير من الماء.',
              'تشرب الكثير من الماء.',
            ],
            answer: 'يجب أن تشرب الكثير من الماء.',
          },
          {
            type: 'fill-blank', id: 'a1-10-q5',
            question: 'أكمل: "___ du mir helfen?" (هل تستطيع مساعدتي؟)',
            answer: 'Kannst',
            hint: 'können مع du: kannst',
          },
          {
            type: 'matching', id: 'a1-10-q6',
            question: 'اربط عضو الجسم بمعناه:',
            pairs: [
              { left: 'Kopf', right: 'الرأس' },
              { left: 'Hand', right: 'اليد' },
              { left: 'Auge', right: 'العين' },
              { left: 'Mund', right: 'الفم' },
              { left: 'Bein', right: 'الساق' },
              { left: 'Bauch', right: 'البطن' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a1-10-q7',
            question: 'رتّب: "يجب أن أذهب إلى الطبيب اليوم"',
            words: ['Ich', 'muss', 'heute', 'zum', 'Arzt', 'gehen'],
            answer: 'Ich muss heute zum Arzt gehen',
            hint: 'الفعل الأصلي في النهاية',
          },
          {
            type: 'speaking', id: 'a1-10-q8',
            question: 'قل بالألمانية: "لدي صداع وحمى"',
            answer: 'Ich habe Kopfschmerzen und Fieber',
          },
          {
            type: 'fill-blank', id: 'a1-10-q9',
            question: 'استمع وأكمل: "Ich ___ Deutsch sprechen." (أستطيع)',
            audioPrompt: 'Ich kann Deutsch sprechen.',
            answer: 'kann',
            hint: 'können مع ich',
          },
          {
            type: 'multiple-choice', id: 'a1-10-q10',
            question: 'ما الفرق بين "wollen" و"möchten"؟',
            options: [
              'لا فرق بينهما.',
              'möchten أكثر تهذيباً.',
              'wollen أكثر تهذيباً.',
              'möchten للسلبي فقط.',
            ],
            answer: 'möchten أكثر تهذيباً.',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 11 — الأفعال المنفصلة
    // ─────────────────────────────────────────────
    {
      id: 'a1-11',
      title: 'الأفعال المنفصلة — Trennbare Verben',
      order: 11,
      grammar: {
        title: 'الأفعال المنفصلة — البادئة تنتقل إلى نهاية الجملة',
        content: `بعض الأفعال في الألمانية لها **بادئة قابلة للفصل** (trennbare Präfix).

**القاعدة الذهبية:** في الجملة الرئيسية، البادئة **تنفصل** وتنتقل إلى **نهاية الجملة**.

→ **auf**stehen → Ich **stehe** um 7 Uhr **auf**.`,
        tables: [
          {
            title: 'الأفعال المنفصلة الأكثر استخداماً',
            headers: ['Verb', 'المعنى', 'مثال في الجملة'],
            rows: [
              { cells: ['aufstehen', 'يستيقظ', 'Ich stehe um 7 auf.'] },
              { cells: ['einkaufen', 'يتسوق', 'Er kauft im Supermarkt ein.'] },
              { cells: ['anrufen', 'يتصل هاتفياً', 'Ich rufe dich an.'] },
              { cells: ['abfahren', 'ينطلق / يغادر', 'Der Zug fährt um 8 ab.'] },
              { cells: ['ankommen', 'يصل', 'Wann kommst du an?'] },
              { cells: ['fernsehen', 'يشاهد التلفاز', 'Wir sehen abends fern.'] },
              { cells: ['aufräumen', 'يرتب', 'Ich räume auf.'] },
              { cells: ['mitbringen', 'يُحضر معه', 'Bring bitte Brot mit.'] },
              { cells: ['zumachen', 'يغلق', 'Mach die Tür zu!'] },
              { cells: ['aufmachen', 'يفتح', 'Mach das Fenster auf.'] },
            ],
            theme: 'default',
          },
          {
            title: 'البوادئ الأكثر شيوعاً',
            headers: ['Präfix', 'المعنى الأساسي', 'مثال'],
            rows: [
              { cells: ['auf-', 'للأعلى / فتح', 'aufstehen, aufmachen'] },
              { cells: ['ab-', 'بعيد / انطلاق', 'abfahren, abholen'] },
              { cells: ['an-', 'اقتراب', 'ankommen, anrufen'] },
              { cells: ['ein-', 'للداخل', 'einkaufen, einsteigen'] },
              { cells: ['aus-', 'للخارج', 'aussteigen, ausmachen'] },
              { cells: ['mit-', 'معاً', 'mitkommen, mitbringen'] },
              { cells: ['zu-', 'إغلاق', 'zumachen'] },
              { cells: ['zurück-', 'رجوع', 'zurückkommen'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'في الجملة الرئيسية: الفعل في المكان الثاني، البادئة في النهاية.',
            example: 'Ich **rufe** dich **an**.',
            translation: 'أتصل بك. (rufe في الثاني، an في النهاية)',
          },
          {
            rule: 'مع الأفعال الناقصة: الفعل المنفصل يبقى **كاملاً** في النهاية.',
            example: 'Ich muss mein Zimmer **aufräumen**.',
            translation: 'يجب أن أرتب غرفتي. (aufräumen كاملاً في النهاية)',
          },
          {
            rule: 'في صيغة الأمر: البادئة في نهاية الجملة.',
            example: 'Räum dein Zimmer **auf**! / Ruf mich **an**!',
            translation: 'رتب غرفتك! / اتصل بي!',
          },
        ],
        examples: [
          'Ich stehe jeden Morgen um 6 Uhr auf. — أستيقظ كل صباح الساعة 6.',
          'Wann kommt der Zug an? — متى يصل القطار؟',
          'Ruf mich bitte an! — اتصل بي من فضلك!',
          'Er sieht jeden Abend fern. — يشاهد التلفاز كل مساء.',
          'Ich muss heute einkaufen. — يجب أن أتسوق اليوم.',
          'Kannst du bitte aufräumen? — هل يمكنك الترتيب من فضلك؟',
          'Mach bitte die Tür zu! — أغلق الباب من فضلك!',
          'Ich hole dich vom Bahnhof ab. — سأقلّك من المحطة.',
        ],
        tip: '💡 عندما تتعلم فعلاً جديداً، تحقق إذا كانت البادئة منفصلة أم لا. القاعدة العامة: البوادئ be-, ge-, er-, ver-, zer-, emp-, ent- **غير منفصلة**. كل البوادئ الأخرى عادة **منفصلة**.',
      },
      vocabulary: [
        { german: 'aufstehen', arabic: 'يستيقظ', example: 'Ich stehe um 7 Uhr auf.', exampleArabic: 'أستيقظ الساعة 7.', type: 'verb' },
        { german: 'einkaufen', arabic: 'يتسوق', example: 'Ich kaufe im Supermarkt ein.', exampleArabic: 'أتسوق في السوبرماركت.', type: 'verb' },
        { german: 'anrufen', arabic: 'يتصل هاتفياً', example: 'Ich rufe meine Mutter an.', exampleArabic: 'أتصل بأمي.', type: 'verb' },
        { german: 'abfahren', arabic: 'يغادر', example: 'Der Bus fährt um 9 ab.', exampleArabic: 'الحافلة تغادر 9.', type: 'verb' },
        { german: 'ankommen', arabic: 'يصل', example: 'Wann kommst du an?', exampleArabic: 'متى تصل؟', type: 'verb' },
        { german: 'abholen', arabic: 'يقلّ / يأخذ من مكان', example: 'Ich hole dich ab.', exampleArabic: 'سأقلّك.', type: 'verb' },
        { german: 'fernsehen', arabic: 'يشاهد التلفاز', example: 'Wir sehen abends fern.', exampleArabic: 'نشاهد التلفاز مساءً.', type: 'verb' },
        { german: 'aufräumen', arabic: 'يرتب', example: 'Ich räume mein Zimmer auf.', exampleArabic: 'أرتب غرفتي.', type: 'verb' },
        { german: 'mitbringen', arabic: 'يُحضر معه', example: 'Bring etwas mit!', exampleArabic: 'أحضر شيئاً!', type: 'verb' },
        { german: 'mitkommen', arabic: 'يأتي معاً', example: 'Kommst du mit?', exampleArabic: 'هل ستأتي معنا؟', type: 'verb' },
        { german: 'zumachen', arabic: 'يغلق', example: 'Mach die Tür zu!', exampleArabic: 'أغلق الباب!', type: 'verb' },
        { german: 'aufmachen', arabic: 'يفتح', example: 'Kannst du das Fenster aufmachen?', exampleArabic: 'هل يمكنك فتح النافذة؟', type: 'verb' },
        { german: 'einschlafen', arabic: 'يغفو', example: 'Ich schlafe früh ein.', exampleArabic: 'أنام مبكراً.', type: 'verb' },
        { german: 'aussteigen', arabic: 'ينزل من وسيلة نقل', example: 'Ich steige hier aus.', exampleArabic: 'سأنزل هنا.', type: 'verb' },
        { german: 'einsteigen', arabic: 'يصعد إلى وسيلة نقل', example: 'Wir steigen in den Bus ein.', exampleArabic: 'نصعد إلى الحافلة.', type: 'verb' },
        { german: 'umsteigen', arabic: 'يغير وسيلة النقل', example: 'Ich steige in Köln um.', exampleArabic: 'أغير في كولونيا.', type: 'verb' },
        { german: 'zurückkommen', arabic: 'يعود', example: 'Ich komme später zurück.', exampleArabic: 'سأعود لاحقاً.', type: 'verb' },
        { german: 'weggehen', arabic: 'يمشي / يغادر', example: 'Sie geht weg.', exampleArabic: 'هي تغادر.', type: 'verb' },
        { german: 'vorbeikommen', arabic: 'يمر بـ', example: 'Komm bei mir vorbei!', exampleArabic: 'مرّ عليّ!', type: 'verb' },
        { german: 'ausmachen', arabic: 'يطفئ', example: 'Mach das Licht aus.', exampleArabic: 'أطفئ النور.', type: 'verb' },
        { german: 'anmachen', arabic: 'يشغل', example: 'Mach das Radio an.', exampleArabic: 'شغل الراديو.', type: 'verb' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a1-11-q1',
            question: 'أكمل: "Ich stehe um 7 Uhr ___." (أستيقظ الساعة 7)',
            answer: 'auf',
            hint: 'البادئة من aufstehen تذهب إلى نهاية الجملة',
          },
          {
            type: 'multiple-choice', id: 'a1-11-q2',
            question: 'كيف تقول "أتصل بك" بالألمانية؟',
            options: ['Ich anrufe dich.', 'Ich rufe dich an.', 'Ich rufe an dich.', 'Anrufe ich dich.'],
            answer: 'Ich rufe dich an.',
          },
          {
            type: 'fill-blank', id: 'a1-11-q3',
            question: 'أكمل: "Der Zug ___ um 8 Uhr ab." (ينطلق — abfahren)',
            answer: 'fährt',
            hint: 'تصريف fahren مع der Zug: fährt',
          },
          {
            type: 'multiple-choice', id: 'a1-11-q4',
            question: 'ما الموقع الصحيح للبادئة مع الفعل الناقص؟',
            options: [
              'Ich muss auf räumen mein Zimmer.',
              'Ich muss mein Zimmer aufräumen.',
              'Ich auf muss mein Zimmer räumen.',
              'Aufräumen ich muss mein Zimmer.',
            ],
            answer: 'Ich muss mein Zimmer aufräumen.',
          },
          {
            type: 'fill-blank', id: 'a1-11-q5',
            question: 'أكمل: "Wir ___ abends fern." (نشاهد التلفاز)',
            answer: 'sehen',
            hint: 'sehen في المكان الثاني، fern في النهاية',
          },
          {
            type: 'matching', id: 'a1-11-q6',
            question: 'اربط الفعل بمعناه:',
            pairs: [
              { left: 'aufstehen', right: 'يستيقظ' },
              { left: 'anrufen', right: 'يتصل' },
              { left: 'einkaufen', right: 'يتسوق' },
              { left: 'abfahren', right: 'يغادر' },
              { left: 'ankommen', right: 'يصل' },
              { left: 'fernsehen', right: 'يشاهد التلفاز' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a1-11-q7',
            question: 'رتّب: "اتصل بي من فضلك!"',
            words: ['Ruf', 'mich', 'bitte', 'an'],
            answer: 'Ruf mich bitte an',
          },
          {
            type: 'speaking', id: 'a1-11-q8',
            question: 'قل بالألمانية: "أستيقظ الساعة 6 وأتسوق الساعة 10"',
            answer: 'Ich stehe um sechs Uhr auf und kaufe um zehn Uhr ein',
          },
          {
            type: 'fill-blank', id: 'a1-11-q9',
            question: 'استمع وأكمل: "Mach das Fenster ___!" (افتح)',
            audioPrompt: 'Mach das Fenster auf!',
            answer: 'auf',
            hint: 'aufmachen = يفتح',
          },
          {
            type: 'multiple-choice', id: 'a1-11-q10',
            question: 'أي جملة صحيحة؟',
            options: [
              'Ich kaufe ein im Supermarkt.',
              'Ich kaufe im Supermarkt ein.',
              'Ich ein kaufe im Supermarkt.',
              'Einkaufe ich im Supermarkt.',
            ],
            answer: 'Ich kaufe im Supermarkt ein.',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 12 — مراجعة عامة ومحادثات
    // ─────────────────────────────────────────────
    {
      id: 'a1-12',
      title: 'مراجعة ومحادثات يومية — Kommunikation und Wiederholung',
      order: 12,
      grammar: {
        title: 'الأمر Imperativ + ترتيب الجملة — مراجعة',
        content: `صيغة الأمر (Imperativ) تُستخدم للطلبات والأوامر والنصائح.

**ثلاث صيغ للأمر حسب المخاطَب:**
- **du** (غير رسمي، مفرد)
- **ihr** (غير رسمي، جمع)
- **Sie** (رسمي، مفرد أو جمع)`,
        tables: [
          {
            title: 'صيغة الأمر (Imperativ)',
            headers: ['الضمير', 'التكوين', 'مثال'],
            rows: [
              { cells: ['du', 'جذر الفعل + !', 'Komm! / Lern! / Mach!'] },
              { cells: ['ihr', 'جذر + t!', 'Kommt! / Lernt!'] },
              { cells: ['Sie', 'Verb + Sie!', 'Kommen Sie! / Lernen Sie!'] },
            ],
            theme: 'conjugation',
            note: '⚠️ بعض الأفعال: sein → Sei! / fahren → Fahr! / lesen → Lies!',
          },
          {
            title: 'كلمات السؤال W-Fragen — مراجعة شاملة',
            headers: ['السؤال', 'المعنى', 'مثال'],
            rows: [
              { cells: ['Wer?', 'من؟', 'Wer ist das?'] },
              { cells: ['Was?', 'ماذا؟', 'Was machst du?'] },
              { cells: ['Wo?', 'أين؟', 'Wo wohnst du?'] },
              { cells: ['Woher?', 'من أين؟', 'Woher kommst du?'] },
              { cells: ['Wohin?', 'إلى أين؟', 'Wohin gehst du?'] },
              { cells: ['Wann?', 'متى؟', 'Wann kommst du?'] },
              { cells: ['Wie?', 'كيف؟', 'Wie heißt du?'] },
              { cells: ['Warum?', 'لماذا؟', 'Warum lernst du Deutsch?'] },
              { cells: ['Wie viel?', 'كم؟', 'Wie viel kostet das?'] },
              { cells: ['Welcher?', 'أي؟', 'Welche Farbe magst du?'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'ترتيب الجملة: الفاعل + الفعل (ثانياً) + الزمان + الطريقة + المكان.',
            example: 'Ich fahre **morgen** (زمان) **mit dem Zug** (طريقة) **nach Berlin** (مكان).',
            translation: 'سأذهب غداً بالقطار إلى برلين.',
          },
          {
            rule: 'مع weil (لأن): الفعل يذهب إلى نهاية الجملة الثانوية.',
            example: 'Ich lerne Deutsch, **weil** ich in Deutschland **arbeite**.',
            translation: 'أتعلم الألمانية لأنني أعمل في ألمانيا.',
          },
          {
            rule: 'عبارات أدب مفيدة لطلب الوضوح أو المساعدة.',
            example: 'Wie bitte? / Können Sie das wiederholen? / Entschuldigung!',
            translation: 'ماذا قلت؟ / هل يمكنك الإعادة؟ / عذراً!',
          },
        ],
        examples: [
          'Entschuldigung, sprechen Sie langsamer bitte? — عذراً، هل يمكنك التكلم بشكل أبطأ؟',
          'Wie bitte? Ich habe das nicht verstanden. — ماذا قلت؟ لم أفهم.',
          'Können Sie das wiederholen, bitte? — هل يمكنك الإعادة من فضلك؟',
          'Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte. — أتعلم الألمانية لأنني أريد العمل في ألمانيا.',
          'Kommen Sie bitte herein! — تفضل بالدخول!',
          'Auf Wiedersehen! Bis morgen! — مع السلامة! إلى الغد!',
          'Hilf mir bitte! — ساعدني من فضلك!',
          'Lernt fleißig Deutsch! — تعلموا الألمانية بجد!',
        ],
        tip: '💡 عبارات "انقاذ المحادثة" التي يجب حفظها: Entschuldigung, ich verstehe nicht (عذراً، لا أفهم)، Sprechen Sie bitte langsamer (تكلم أبطأ من فضلك)، Können Sie das wiederholen? (هل يمكنك الإعادة؟). هذه العبارات تجنبك الإحراج في أي موقف!',
      },
      vocabulary: [
        { german: 'Entschuldigung', arabic: 'عفواً / معذرة', example: 'Entschuldigung, wo ist der Bahnhof?', exampleArabic: 'عفواً، أين المحطة؟', type: 'phrase' },
        { german: 'Wie bitte?', arabic: 'ماذا قلت؟', example: 'Wie bitte? Ich verstehe nicht.', exampleArabic: 'ماذا؟ لا أفهم.', type: 'phrase' },
        { german: 'Ich verstehe nicht', arabic: 'لا أفهم', example: 'Ich verstehe das nicht.', exampleArabic: 'لا أفهم ذلك.', type: 'phrase' },
        { german: 'langsamer bitte', arabic: 'بشكل أبطأ من فضلك', example: 'Sprechen Sie langsamer!', exampleArabic: 'تكلم بشكل أبطأ!', type: 'phrase' },
        { german: 'wiederholen', arabic: 'يعيد', example: 'Können Sie das wiederholen?', exampleArabic: 'هل يمكنك الإعادة؟', type: 'verb' },
        { german: 'natürlich', arabic: 'بالطبع', example: 'Natürlich! Kein Problem.', exampleArabic: 'طبعاً! لا مشكلة.', type: 'adverb' },
        { german: 'kein Problem', arabic: 'لا مشكلة', example: 'Kein Problem!', exampleArabic: 'لا مشكلة!', type: 'phrase' },
        { german: 'gern / gerne', arabic: 'بكل سرور', example: 'Ja, gerne!', exampleArabic: 'نعم بكل سرور!', type: 'adverb' },
        { german: 'Auf Wiedersehen', arabic: 'مع السلامة (رسمي)', example: 'Auf Wiedersehen, Herr Müller!', exampleArabic: 'إلى اللقاء يا سيد مولر!', type: 'phrase' },
        { german: 'Tschüss', arabic: 'مع السلامة (غير رسمي)', example: 'Tschüss! Bis morgen!', exampleArabic: 'سلام! إلى الغد!', type: 'phrase' },
        { german: 'Bis bald', arabic: 'إلى اللقاء قريباً', example: 'Bis bald!', exampleArabic: 'إلى اللقاء قريباً!', type: 'phrase' },
        { german: 'weil', arabic: 'لأن', example: 'Ich bleibe, weil es regnet.', exampleArabic: 'أبقى لأنها تمطر.', type: 'conjunction' },
        { german: 'aber', arabic: 'لكن', example: 'Ich bin müde, aber glücklich.', exampleArabic: 'أنا متعب لكن سعيد.', type: 'conjunction' },
        { german: 'und', arabic: 'و', example: 'Ich und du.', exampleArabic: 'أنا وأنت.', type: 'conjunction' },
        { german: 'oder', arabic: 'أو', example: 'Tee oder Kaffee?', exampleArabic: 'شاي أم قهوة؟', type: 'conjunction' },
        { german: 'denn', arabic: 'لأن (عامي)', example: 'Ich bleibe, denn es regnet.', exampleArabic: 'أبقى لأنها تمطر.', type: 'conjunction' },
        { german: 'Hilfe', arabic: 'المساعدة', gender: 'die', example: 'Ich brauche Hilfe!', exampleArabic: 'أحتاج مساعدة!', type: 'noun' },
        { german: 'helfen', arabic: 'يساعد', example: 'Kannst du mir helfen?', exampleArabic: 'هل يمكنك مساعدتي؟', type: 'verb' },
        { german: 'verstehen', arabic: 'يفهم', example: 'Ich verstehe Deutsch.', exampleArabic: 'أفهم الألمانية.', type: 'verb' },
        { german: 'fragen', arabic: 'يسأل', example: 'Darf ich fragen?', exampleArabic: 'هل يمكنني السؤال؟', type: 'verb' },
        { german: 'antworten', arabic: 'يجيب', example: 'Antworte bitte!', exampleArabic: 'أجب من فضلك!', type: 'verb' },
        { german: 'Freude', arabic: 'الفرح', gender: 'die', example: 'Viel Freude!', exampleArabic: 'الكثير من الفرح!', type: 'noun' },
        { german: 'Glück', arabic: 'الحظ', gender: 'das', example: 'Viel Glück!', exampleArabic: 'حظاً سعيداً!', type: 'noun' },
      ],
      exercise: {
        questions: [
          {
            type: 'multiple-choice', id: 'a1-12-q1',
            question: 'كيف تقول "تكلم أبطأ من فضلك" للشخص الرسمي؟',
            options: [
              'Sprich langsamer!',
              'Sprechen Sie langsamer, bitte.',
              'Langsam sprechen du!',
              'Sprecht langsamer!',
            ],
            answer: 'Sprechen Sie langsamer, bitte.',
          },
          {
            type: 'fill-blank', id: 'a1-12-q2',
            question: 'أكمل: "___, wo ist die Apotheke?" (عذراً / معذرة)',
            answer: 'Entschuldigung',
            hint: 'كلمة تعني "عفواً" بالألمانية',
          },
          {
            type: 'multiple-choice', id: 'a1-12-q3',
            question: 'ما أداة السؤال عن السبب؟',
            options: ['Wo?', 'Wann?', 'Warum?', 'Wer?'],
            answer: 'Warum?',
          },
          {
            type: 'fill-blank', id: 'a1-12-q4',
            question: 'أكمل: "Ich lerne Deutsch, ___ ich in Deutschland arbeiten will." (لأن)',
            answer: 'weil',
            hint: 'أداة السبب في الألمانية',
          },
          {
            type: 'multiple-choice', id: 'a1-12-q5',
            question: 'ما الفرق بين "Auf Wiedersehen" و"Tschüss"؟',
            options: [
              'لا فرق بينهما.',
              'Auf Wiedersehen رسمي، Tschüss غير رسمي.',
              'Tschüss رسمي، Auf Wiedersehen غير رسمي.',
              'Tschüss للصباح، Auf Wiedersehen للمساء.',
            ],
            answer: 'Auf Wiedersehen رسمي، Tschüss غير رسمي.',
          },
          {
            type: 'matching', id: 'a1-12-q6',
            question: 'اربط كلمة السؤال بمعناها:',
            pairs: [
              { left: 'Wer?', right: 'من؟' },
              { left: 'Was?', right: 'ماذا؟' },
              { left: 'Wo?', right: 'أين؟' },
              { left: 'Wann?', right: 'متى؟' },
              { left: 'Warum?', right: 'لماذا؟' },
              { left: 'Wie?', right: 'كيف؟' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a1-12-q7',
            question: 'رتّب: "أتعلم الألمانية لأنني أحبها"',
            words: ['Ich', 'lerne', 'Deutsch', 'weil', 'ich', 'es', 'liebe'],
            answer: 'Ich lerne Deutsch weil ich es liebe',
          },
          {
            type: 'speaking', id: 'a1-12-q8',
            question: 'قل بالألمانية: "عذراً، لم أفهم. هل يمكنك الإعادة؟"',
            answer: 'Entschuldigung ich habe nicht verstanden können Sie das wiederholen',
          },
          {
            type: 'fill-blank', id: 'a1-12-q9',
            question: 'استمع وأكمل: "Viel ___!" (حظاً سعيداً)',
            audioPrompt: 'Viel Glück!',
            answer: 'Glück',
            hint: 'الحظ بالألمانية',
          },
          {
            type: 'multiple-choice', id: 'a1-12-q10',
            question: 'كيف تقول "ساعدني من فضلك" لصديق؟',
            options: [
              'Helfen Sie mir bitte!',
              'Hilf mir bitte!',
              'Helft mir bitte!',
              'Ich helfen dir bitte!',
            ],
            answer: 'Hilf mir bitte!',
          },
        ],
      },
    },
  ],
}
