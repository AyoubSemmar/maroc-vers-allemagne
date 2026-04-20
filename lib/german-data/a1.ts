import type { Level } from './types'

export const A1: Level = {
  id: 'A1',
  title: 'المستوى الأول',
  description: 'تعلم أساسيات اللغة الألمانية — التعريف بالنفس، الأرقام، والجمل اليومية.',
  color: 'bg-green-500',
  emoji: '🌱',
  lessons: [
    {
      id: 'a1-01',
      title: 'التعريف بالنفس — Sich vorstellen',
      order: 1,
      grammar: {
        title: 'فعل "sein" — أنا، أنت، هو/هي',
        content: `فعل **sein** يعني "يكون" وهو من أهم الأفعال في الألمانية.

نستخدمه للتعريف بالنفس:

| الضمير | الفعل | المعنى |
|--------|-------|--------|
| ich | bin | أنا |
| du | bist | أنت |
| er / sie | ist | هو / هي |
| wir | sind | نحن |

**هيكل الجملة:** الضمير + الفعل + الخبر

مثال: **Ich bin Ahmed.** = أنا أحمد.`,
        examples: [
          'Ich bin Ahmed. — أنا أحمد.',
          'Ich komme aus Marokko. — أنا من المغرب.',
          'Ich wohne in Berlin. — أنا أسكن في برلين.',
          'Wie heißt du? — ما اسمك؟',
          'Ich heiße Sara. — اسمي سارة.',
        ],
      },
      vocabulary: [
        { german: 'ich', arabic: 'أنا', example: 'Ich bin Ahmed.' },
        { german: 'du', arabic: 'أنت', example: 'Wie heißt du?' },
        { german: 'heißen', arabic: 'يُسمى / اسمه', example: 'Ich heiße Ahmed.' },
        { german: 'kommen', arabic: 'يأتي / أصله من', example: 'Ich komme aus Marokko.' },
        { german: 'wohnen', arabic: 'يسكن', example: 'Ich wohne in Berlin.' },
        { german: 'aus', arabic: 'من (بلد)', example: 'Ich komme aus Marokko.' },
        { german: 'in', arabic: 'في', example: 'Ich wohne in Berlin.' },
        { german: 'Marokko', arabic: 'المغرب', example: 'Ich komme aus Marokko.' },
        { german: 'Deutschland', arabic: 'ألمانيا', example: 'Ich wohne in Deutschland.' },
        { german: 'Jahre alt', arabic: 'سنة (العمر)', example: 'Ich bin 25 Jahre alt.' },
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
            type: 'multiple-choice', id: 'a1-01-q2',
            question: 'ما معنى "Ich komme aus Marokko"؟',
            options: ['أنا أسكن في المغرب.', 'أنا أحب المغرب.', 'أنا من المغرب.', 'أنا ذاهب إلى المغرب.'],
            answer: 'أنا من المغرب.',
          },
          {
            type: 'multiple-choice', id: 'a1-01-q3',
            question: 'ما هو فعل "sein" مع ضمير "du"؟',
            options: ['bin', 'ist', 'bist', 'sind'],
            answer: 'bist',
          },
          {
            type: 'multiple-choice', id: 'a1-01-q4',
            question: 'كيف تسأل "ما اسمك؟" بالألمانية؟',
            options: ['Wo wohnst du?', 'Wie alt bist du?', 'Wie heißt du?', 'Woher kommst du?'],
            answer: 'Wie heißt du?',
          },
        ],
      },
    },
    {
      type: 'multiple-choice', id: 'a1-02',
      title: 'الأرقام من ١ إلى ٢٠ — Zahlen',
      order: 2,
      grammar: {
        title: 'الأرقام في الألمانية',
        content: `الأرقام من 1 إلى 12 تُحفظ كما هي، ثم من 13 إلى 19 تأتي بنمط ثابت:

**القاعدة:** من 13 إلى 19 = الرقم + **zehn**

مثال: drei (3) + zehn = **dreizehn** (13)

**العشرون والأكثر:** من 21 إلى 99 = الآحاد + **und** + العشرات

مثال: **einundzwanzig** = واحد وعشرون (21)

تُستخدم الأرقام في:
- العمر: Ich bin **25** Jahre alt.
- الهاتف: Meine Nummer ist **0176...**
- السعر: Das kostet **12** Euro.`,
        examples: [
          'Ich bin zwanzig Jahre alt. — عمري عشرون سنة.',
          'Das kostet fünf Euro. — يكلف خمسة يورو.',
          'Meine Nummer ist null-eins-sieben-sechs... — رقمي هو 0176...',
          'Ich wohne in der dritten Etage. — أسكن في الطابق الثالث.',
        ],
      },
      vocabulary: [
        { german: 'eins', arabic: '١', example: 'eins, zwei, drei...' },
        { german: 'zwei', arabic: '٢', example: 'Ich habe zwei Brüder.' },
        { german: 'drei', arabic: '٣' },
        { german: 'vier', arabic: '٤' },
        { german: 'fünf', arabic: '٥' },
        { german: 'sechs', arabic: '٦' },
        { german: 'sieben', arabic: '٧' },
        { german: 'acht', arabic: '٨' },
        { german: 'neun', arabic: '٩' },
        { german: 'zehn', arabic: '١٠' },
        { german: 'elf', arabic: '١١' },
        { german: 'zwölf', arabic: '١٢' },
        { german: 'zwanzig', arabic: '٢٠' },
        { german: 'hundert', arabic: '١٠٠' },
      ],
      exercise: {
        questions: [
          {
            type: 'multiple-choice', id: 'a1-02-q1',
            question: 'ما هو الرقم "sieben" بالعربية؟',
            options: ['٦', '٧', '٨', '٩'],
            answer: '٧',
          },
          {
            type: 'multiple-choice', id: 'a1-02-q2',
            question: 'كيف تكتب الرقم 15 بالألمانية؟',
            options: ['fünfzehn', 'fünfzehen', 'fünfzig', 'fünfundzwanzig'],
            answer: 'fünfzehn',
          },
          {
            type: 'multiple-choice', id: 'a1-02-q3',
            question: 'ما معنى "Das kostet zwölf Euro"؟',
            options: ['يكلف عشرون يورو.', 'يكلف اثنا عشر يورو.', 'يكلف عشرة يورو.', 'يكلف اثنا عشر دولاراً.'],
            answer: 'يكلف اثنا عشر يورو.',
          },
          {
            type: 'multiple-choice', id: 'a1-02-q4',
            question: 'كيف تقول "عمري خمسة وعشرون سنة"؟',
            options: [
              'Ich bin fünfzig Jahre alt.',
              'Ich bin fünfzehn Jahre alt.',
              'Ich bin fünfundzwanzig Jahre alt.',
              'Ich bin zwanzig Jahre alt.',
            ],
            answer: 'Ich bin fünfundzwanzig Jahre alt.',
          },
        ],
      },
    },
    {
      type: 'multiple-choice', id: 'a1-03',
      title: 'يومي في ألمانيا — Mein Alltag',
      order: 3,
      grammar: {
        title: 'الأفعال في المضارع — Präsens',
        content: `في الألمانية، الأفعال المنتظمة تتصرف بنمط ثابت في المضارع.

**القاعدة:** خذ جذر الفعل + أضف النهاية المناسبة

مثال: **arbeiten** (يعمل) → جذره: **arbeit**

| الضمير | النهاية | مثال |
|--------|---------|------|
| ich | -e | ich arbeite |
| du | -est | du arbeitest |
| er/sie | -et | er arbeitet |
| wir | -en | wir arbeiten |

**ترتيب الجملة:** الفاعل + الفعل + باقي الجملة`,
        examples: [
          'Ich arbeite jeden Tag. — أعمل كل يوم.',
          'Ich lerne Deutsch. — أتعلم اللغة الألمانية.',
          'Ich kaufe im Supermarkt ein. — أتسوق في السوبرماركت.',
          'Ich fahre mit der U-Bahn. — أذهب بالمترو.',
          'Ich schlafe um 23 Uhr. — أنام الساعة الحادية عشرة.',
        ],
      },
      vocabulary: [
        { german: 'arbeiten', arabic: 'يعمل', example: 'Ich arbeite in Berlin.' },
        { german: 'lernen', arabic: 'يتعلم / يدرس', example: 'Ich lerne Deutsch.' },
        { german: 'kaufen', arabic: 'يشتري', example: 'Ich kaufe Brot.' },
        { german: 'fahren', arabic: 'يسافر / يذهب بسيارة أو مواصلات', example: 'Ich fahre mit der U-Bahn.' },
        { german: 'schlafen', arabic: 'ينام', example: 'Ich schlafe um 22 Uhr.' },
        { german: 'essen', arabic: 'يأكل', example: 'Ich esse Brot und Käse.' },
        { german: 'trinken', arabic: 'يشرب', example: 'Ich trinke Kaffee.' },
        { german: 'jeden Tag', arabic: 'كل يوم', example: 'Ich arbeite jeden Tag.' },
        { german: 'morgens', arabic: 'صباحاً', example: 'Morgens trinke ich Kaffee.' },
        { german: 'abends', arabic: 'مساءً', example: 'Abends lerne ich Deutsch.' },
      ],
      exercise: {
        questions: [
          {
            type: 'multiple-choice', id: 'a1-03-q1',
            question: 'ما معنى "Ich lerne Deutsch"؟',
            options: ['أحب اللغة الألمانية.', 'أتعلم اللغة الألمانية.', 'أتكلم الألمانية.', 'أدرّس الألمانية.'],
            answer: 'أتعلم اللغة الألمانية.',
          },
          {
            type: 'multiple-choice', id: 'a1-03-q2',
            question: 'كيف تقول "أشرب قهوة" بالألمانية؟',
            options: ['Ich esse Kaffee.', 'Ich trinke Kaffee.', 'Ich kaufe Kaffee.', 'Ich lerne Kaffee.'],
            answer: 'Ich trinke Kaffee.',
          },
          {
            type: 'multiple-choice', id: 'a1-03-q3',
            question: 'ما هو تصريف "arbeiten" مع "wir"؟',
            options: ['wir arbeite', 'wir arbeitest', 'wir arbeitet', 'wir arbeiten'],
            answer: 'wir arbeiten',
          },
          {
            type: 'multiple-choice', id: 'a1-03-q4',
            question: 'ما معنى "morgens"؟',
            options: ['مساءً', 'ليلاً', 'صباحاً', 'ظهراً'],
            answer: 'صباحاً',
          },
        ],
      },
    },
    {
      id: 'a1-04',
      title: 'في المطعم والمتجر — Im Restaurant',
      order: 4,
      grammar: {
        title: 'أداة التعريف — der, die, das',
        content: `في الألمانية، كل اسم له جنس: مذكر، مؤنث، أو محايد.

| الجنس | أداة التعريف | مثال |
|-------|------------|------|
| مذكر (Maskulinum) | **der** | der Kaffee (القهوة) |
| مؤنث (Femininum) | **die** | die Milch (الحليب) |
| محايد (Neutrum) | **das** | das Wasser (الماء) |

**نصيحة:** احفظ الاسم دائماً مع أداة التعريف.
قل: **der** Kaffee، وليس فقط Kaffee.

**للجمع:** دائماً نستخدم **die** بغض النظر عن الجنس.`,
        examples: [
          'Ich möchte einen Kaffee, bitte. — أريد قهوة من فضلك.',
          'Das Wasser kostet zwei Euro. — الماء يكلف يورويين.',
          'Die Speisekarte, bitte! — القائمة من فضلك!',
          'Was kostet das? — كم يكلف هذا؟',
          'Ich nehme den Salat. — سآخذ السلطة.',
        ],
      },
      vocabulary: [
        { german: 'der Kaffee', arabic: 'القهوة', example: 'Einen Kaffee, bitte.' },
        { german: 'das Wasser', arabic: 'الماء', example: 'Ein Wasser, bitte.' },
        { german: 'die Milch', arabic: 'الحليب' },
        { german: 'das Brot', arabic: 'الخبز', example: 'Ich kaufe Brot.' },
        { german: 'der Salat', arabic: 'السلطة' },
        { german: 'die Speisekarte', arabic: 'قائمة الطعام', example: 'Die Speisekarte, bitte!' },
        { german: 'möchten', arabic: 'يريد / يود', example: 'Ich möchte einen Kaffee.' },
        { german: 'kosten', arabic: 'يكلف', example: 'Was kostet das?' },
        { german: 'bitte', arabic: 'من فضلك', example: 'Einen Kaffee, bitte.' },
        { german: 'danke', arabic: 'شكراً', example: 'Danke schön!' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank',
            id: 'a1-04-q1',
            question: 'أكمل الجملة: "Ich möchte ___ Kaffee, bitte." (القهوة مذكر)',
            answer: 'einen',
            hint: 'أداة التعريف النكرة للمذكر في حالة المفعول به',
          },
          {
            type: 'fill-blank',
            id: 'a1-04-q2',
            question: 'أكمل: "___ Wasser kostet zwei Euro." (الماء محايد)',
            answer: 'Das',
            hint: 'أداة التعريف للمحايد هي das',
          },
          {
            type: 'multiple-choice',
            id: 'a1-04-q3',
            question: 'ما معنى "Was kostet das?"',
            options: ['ما اسم هذا؟', 'كم يكلف هذا؟', 'أين هذا؟', 'من يريد هذا؟'],
            answer: 'كم يكلف هذا؟',
          },
          {
            type: 'fill-blank',
            id: 'a1-04-q4',
            question: 'أكمل: "Die Speisekarte, ___!" (من فضلك)',
            answer: 'bitte',
            hint: 'كلمة تعني "من فضلك" بالألمانية',
          },
          {
            type: 'multiple-choice',
            id: 'a1-04-q5',
            question: 'أي أداة تعريف تستخدم مع "Milch" (المؤنث)؟',
            options: ['der', 'das', 'die', 'den'],
            answer: 'die',
          },
        ],
      },
    },
  ],
}
