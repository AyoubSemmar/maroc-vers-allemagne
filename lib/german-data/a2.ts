import type { Level } from './types'

export const A2: Level = {
  id: 'A2',
  title: 'المستوى الثاني',
  description: 'الماضي، المقارنات، الجمل المركبة والتواصل اليومي.',
  color: 'bg-blue-500',
  emoji: '📘',
  iconName: 'book',
  lessons: [
    // ─────────────────────────────────────────────
    // LESSON 1 — Perfekt مع haben
    // ─────────────────────────────────────────────
    {
      id: 'a2-01',
      title: 'الماضي مع haben — Perfekt mit haben',
      order: 1,
      grammar: {
        title: 'صيغة Perfekt مع الفعل المساعد haben',
        content: `صيغة **Perfekt** هي الصيغة الأساسية للتعبير عن الماضي في اللغة المنطوقة.

**التركيب:** haben (مُصرَّف) + ... + Partizip II (في نهاية الجملة)

→ Ich **habe** gestern viel **gearbeitet**.

معظم الأفعال (حوالي 80%) تستخدم haben — كل الأفعال الانتقالية (لها مفعول به) وكل الأفعال المنعكسة.`,
        tables: [
          {
            title: 'تكوين Partizip II — الأفعال المنتظمة',
            headers: ['Infinitiv', 'Partizip II', 'القاعدة'],
            rows: [
              { cells: ['machen', 'gemacht', 'ge + جذر + t'] },
              { cells: ['lernen', 'gelernt', 'ge + lern + t'] },
              { cells: ['kochen', 'gekocht', 'ge + koch + t'] },
              { cells: ['spielen', 'gespielt', 'ge + spiel + t'] },
              { cells: ['kaufen', 'gekauft', 'ge + kauf + t'] },
              { cells: ['arbeiten', 'gearbeitet', 'ge + arbeit + et ⚠️'] },
            ],
            theme: 'conjugation',
            note: '⚠️ الأفعال التي تنتهي بـ -ten/-den تأخذ -et بدل -t.',
          },
          {
            title: 'Partizip II — الأفعال غير المنتظمة (الأكثر استخداماً)',
            headers: ['Infinitiv', 'Partizip II', 'المعنى'],
            rows: [
              { cells: ['essen', 'gegessen', 'أكل'] },
              { cells: ['trinken', 'getrunken', 'شرب'] },
              { cells: ['lesen', 'gelesen', 'قرأ'] },
              { cells: ['schreiben', 'geschrieben', 'كتب'] },
              { cells: ['sprechen', 'gesprochen', 'تكلم'] },
              { cells: ['sehen', 'gesehen', 'رأى'] },
              { cells: ['nehmen', 'genommen', 'أخذ'] },
              { cells: ['finden', 'gefunden', 'وجد'] },
              { cells: ['helfen', 'geholfen', 'ساعد'] },
              { cells: ['schlafen', 'geschlafen', 'نام'] },
            ],
            theme: 'conjugation',
            note: 'يجب حفظها — لا توجد قاعدة لها.',
          },
          {
            title: 'حالات خاصة: بدون ge-',
            headers: ['Infinitiv', 'Partizip II', 'السبب'],
            rows: [
              { cells: ['besuchen', 'besucht', 'البوادئ غير المنفصلة (be-)'] },
              { cells: ['bezahlen', 'bezahlt', 'be-'] },
              { cells: ['verstehen', 'verstanden', 'ver-'] },
              { cells: ['studieren', 'studiert', 'الأفعال المنتهية بـ -ieren'] },
              { cells: ['telefonieren', 'telefoniert', '-ieren'] },
            ],
            theme: 'conjugation',
            note: 'الأفعال بالبوادئ be-, ge-, er-, ver-, zer-, ent-, emp- والأفعال المنتهية بـ -ieren لا تأخذ ge-.',
          },
        ],
        rules: [
          {
            rule: 'تركيب الجملة: الفاعل + haben (ثانياً) + ... + Partizip II (في النهاية).',
            example: 'Ich **habe** gestern einen Film **gesehen**.',
            translation: 'شاهدت فيلماً أمس.',
          },
          {
            rule: 'في السؤال: haben في البداية، Partizip II في النهاية.',
            example: '**Hast** du die Hausaufgaben **gemacht**?',
            translation: 'هل عملت الواجب المنزلي؟',
          },
          {
            rule: 'الأفعال المنفصلة: ge- يأتي **بين** البادئة والجذر.',
            example: 'aufräumen → **auf**ge**räumt** / einkaufen → **ein**ge**kauft**',
            translation: 'رتّب / تسوّق',
          },
        ],
        examples: [
          'Ich habe gestern viel gearbeitet. — عملت كثيراً أمس.',
          'Er hat einen Kaffee getrunken. — شرب قهوة.',
          'Wir haben zusammen Pizza gegessen. — أكلنا بيتزا معاً.',
          'Hast du das Buch gelesen? — هل قرأت الكتاب؟',
          'Sie hat ihre Mutter angerufen. — اتصلت بأمها.',
          'Ich habe das noch nicht gemacht. — لم أفعل ذلك بعد.',
          'Wir haben einen Film im Kino gesehen. — شاهدنا فيلماً في السينما.',
          'Ich habe heute eingekauft. — تسوقت اليوم.',
        ],
        tip: '💡 حيلة لحفظ Partizip II للأفعال الشاذة: قسّمها إلى مجموعات حسب التغيير (e→o: gesprochen/geholfen، i→u: gefunden/getrunken). هذا النمط يسهّل الحفظ.',
      },
      vocabulary: [
        { german: 'gestern', arabic: 'أمس', example: 'Gestern habe ich gearbeitet.', exampleArabic: 'أمس عملت.', type: 'adverb' },
        { german: 'vorgestern', arabic: 'أول أمس', example: 'Vorgestern war ich krank.', exampleArabic: 'أول أمس كنت مريضاً.', type: 'adverb' },
        { german: 'letzte Woche', arabic: 'الأسبوع الماضي', example: 'Letzte Woche war es schön.', exampleArabic: 'الأسبوع الماضي كان جميلاً.', type: 'phrase' },
        { german: 'letztes Jahr', arabic: 'السنة الماضية', example: 'Letztes Jahr war ich in Marokko.', exampleArabic: 'السنة الماضية كنت في المغرب.', type: 'phrase' },
        { german: 'vor zwei Tagen', arabic: 'قبل يومين', example: 'Vor zwei Tagen hat es geregnet.', exampleArabic: 'قبل يومين أمطرت.', type: 'phrase' },
        { german: 'schon', arabic: 'بالفعل', example: 'Ich habe schon gegessen.', exampleArabic: 'أكلت بالفعل.', type: 'adverb' },
        { german: 'noch nicht', arabic: 'لم ... بعد', example: 'Ich habe das noch nicht gemacht.', exampleArabic: 'لم أفعل ذلك بعد.', type: 'phrase' },
        { german: 'nie', arabic: 'أبداً', example: 'Ich habe das nie gesehen.', exampleArabic: 'لم أر هذا أبداً.', type: 'adverb' },
        { german: 'immer', arabic: 'دائماً', example: 'Er hat immer gelernt.', exampleArabic: 'كان يتعلم دائماً.', type: 'adverb' },
        { german: 'Perfekt', arabic: 'الماضي المركب', gender: 'das', example: 'Im Perfekt spricht man.', exampleArabic: 'يتحدث الناس في الماضي المركب.', type: 'noun' },
        { german: 'gemacht', arabic: 'فعل / صنع (ماضي)', example: 'Was hast du gemacht?', exampleArabic: 'ماذا فعلت؟', type: 'verb' },
        { german: 'gegessen', arabic: 'أكل (ماضي)', example: 'Ich habe gegessen.', exampleArabic: 'لقد أكلت.', type: 'verb' },
        { german: 'getrunken', arabic: 'شرب (ماضي)', example: 'Ich habe Tee getrunken.', exampleArabic: 'شربت شاياً.', type: 'verb' },
        { german: 'gelernt', arabic: 'تعلم (ماضي)', example: 'Ich habe Deutsch gelernt.', exampleArabic: 'تعلمت الألمانية.', type: 'verb' },
        { german: 'gearbeitet', arabic: 'عمل (ماضي)', example: 'Sie hat gearbeitet.', exampleArabic: 'هي عملت.', type: 'verb' },
        { german: 'gelesen', arabic: 'قرأ (ماضي)', example: 'Ich habe ein Buch gelesen.', exampleArabic: 'قرأت كتاباً.', type: 'verb' },
        { german: 'geschrieben', arabic: 'كتب (ماضي)', example: 'Ich habe eine E-Mail geschrieben.', exampleArabic: 'كتبت إيميلاً.', type: 'verb' },
        { german: 'gesprochen', arabic: 'تكلم (ماضي)', example: 'Wir haben Deutsch gesprochen.', exampleArabic: 'تكلمنا الألمانية.', type: 'verb' },
        { german: 'gesehen', arabic: 'رأى (ماضي)', example: 'Ich habe einen Film gesehen.', exampleArabic: 'شاهدت فيلماً.', type: 'verb' },
        { german: 'gekauft', arabic: 'اشترى (ماضي)', example: 'Ich habe Brot gekauft.', exampleArabic: 'اشتريت خبزاً.', type: 'verb' },
        { german: 'bezahlt', arabic: 'دفع (ماضي)', example: 'Ich habe bar bezahlt.', exampleArabic: 'دفعت نقداً.', type: 'verb' },
        { german: 'besucht', arabic: 'زار (ماضي)', example: 'Ich habe meine Oma besucht.', exampleArabic: 'زرت جدتي.', type: 'verb' },
      ],
      exercise: {
        questions: [
          {
            type: 'multiple-choice', id: 'a2-01-q1',
            question: 'أي صيغة صحيحة لـ "أكلت البيتزا"؟',
            options: ['Ich bin Pizza gegessen.', 'Ich habe Pizza gegessen.', 'Ich habe Pizza essen.', 'Ich bin Pizza essen.'],
            answer: 'Ich habe Pizza gegessen.',
          },
          {
            type: 'fill-blank', id: 'a2-01-q2',
            question: 'أكمل: "Ich ___ gestern Deutsch ___." (تعلمت الألمانية)',
            answer: 'habe',
            hint: 'haben مع ich: habe — Partizip II: gelernt',
          },
          {
            type: 'multiple-choice', id: 'a2-01-q3',
            question: 'ما معنى "Ich habe gestern viel gelernt"؟',
            options: ['سأتعلم كثيراً غداً.', 'أتعلم كثيراً الآن.', 'تعلمت كثيراً أمس.', 'أحب التعلم كثيراً.'],
            answer: 'تعلمت كثيراً أمس.',
          },
          {
            type: 'fill-blank', id: 'a2-01-q4',
            question: 'أكمل: "Er hat das Buch ___." (قرأ — lesen → gelesen)',
            answer: 'gelesen',
            hint: 'Partizip II من lesen هو gelesen',
          },
          {
            type: 'matching', id: 'a2-01-q5',
            question: 'اربط المصدر بـ Partizip II:',
            pairs: [
              { left: 'machen', right: 'gemacht' },
              { left: 'essen', right: 'gegessen' },
              { left: 'trinken', right: 'getrunken' },
              { left: 'sprechen', right: 'gesprochen' },
              { left: 'sehen', right: 'gesehen' },
              { left: 'schreiben', right: 'geschrieben' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-01-q6',
            question: 'رتّب: "شاهدت فيلماً أمس"',
            words: ['Ich', 'habe', 'gestern', 'einen', 'Film', 'gesehen'],
            answer: 'Ich habe gestern einen Film gesehen',
            hint: 'Partizip II في النهاية',
          },
          {
            type: 'speaking', id: 'a2-01-q7',
            question: 'قل بالألمانية: "اشتريت خبزاً وشربت قهوة اليوم"',
            answer: 'Ich habe heute Brot gekauft und Kaffee getrunken',
          },
          {
            type: 'fill-blank', id: 'a2-01-q8',
            question: 'استمع وأكمل: "Sie hat ein Buch ___." (كتبت)',
            audioPrompt: 'Sie hat ein Buch geschrieben.',
            answer: 'geschrieben',
            hint: 'Partizip II من schreiben',
          },
          {
            type: 'multiple-choice', id: 'a2-01-q9',
            question: 'ما Partizip II من "studieren"؟',
            options: ['gestudiert', 'studiert', 'studen', 'gestudier'],
            answer: 'studiert',
          },
          {
            type: 'drag-drop', id: 'a2-01-q10',
            question: 'رتّب: "هل اتصلت بأمك؟" (السؤال)',
            words: ['Hast', 'du', 'deine', 'Mutter', 'angerufen'],
            answer: 'Hast du deine Mutter angerufen',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 2 — Perfekt مع sein
    // ─────────────────────────────────────────────
    {
      id: 'a2-02',
      title: 'الماضي مع sein — Perfekt mit sein',
      order: 2,
      grammar: {
        title: 'متى نستخدم sein كفعل مساعد؟',
        content: `بعض الأفعال تستخدم **sein** (وليس haben) كفعل مساعد في Perfekt.

**ثلاث مجموعات تستخدم sein:**
1. **أفعال الحركة** (من مكان إلى آخر) — gehen, fahren, fliegen, kommen
2. **أفعال التغيير** (تغير حالة) — aufstehen, einschlafen, werden
3. **استثناءات خاصة** — sein, bleiben, passieren`,
        tables: [
          {
            title: 'أفعال الحركة مع sein',
            headers: ['Infinitiv', 'Partizip II', 'المعنى'],
            rows: [
              { cells: ['gehen', 'gegangen', 'ذهب (مشياً)'] },
              { cells: ['fahren', 'gefahren', 'ذهب (بوسيلة)'] },
              { cells: ['fliegen', 'geflogen', 'طار'] },
              { cells: ['kommen', 'gekommen', 'أتى'] },
              { cells: ['laufen', 'gelaufen', 'ركض / مشى'] },
              { cells: ['reisen', 'gereist', 'سافر'] },
              { cells: ['schwimmen', 'geschwommen', 'سبح'] },
            ],
            theme: 'conjugation',
          },
          {
            title: 'أفعال التغيير والاستثناءات',
            headers: ['Infinitiv', 'Partizip II', 'المعنى'],
            rows: [
              { cells: ['aufstehen', 'aufgestanden', 'استيقظ'] },
              { cells: ['einschlafen', 'eingeschlafen', 'نام'] },
              { cells: ['werden', 'geworden', 'صار'] },
              { cells: ['sterben', 'gestorben', 'مات'] },
              { cells: ['sein', 'gewesen', 'كان ⚠️'], highlight: true },
              { cells: ['bleiben', 'geblieben', 'بقي ⚠️'], highlight: true },
              { cells: ['passieren', 'passiert', 'حدث'] },
            ],
            theme: 'conjugation',
            note: '⚠️ sein وbleiben لا يعبّران عن حركة لكنهما يستخدمان sein.',
          },
        ],
        rules: [
          {
            rule: 'قاعدة الحركة: إذا كان الفعل يعبر عن الذهاب من A إلى B → sein.',
            example: 'Ich **bin** nach Berlin **gefahren**.',
            translation: 'ذهبت إلى برلين.',
          },
          {
            rule: 'قاعدة التغيير: إذا تغيرت الحالة (نام → مستيقظ) → sein.',
            example: 'Er **ist** um 6 **aufgestanden**.',
            translation: 'استيقظ الساعة 6.',
          },
          {
            rule: 'الاستثناء المهم: sein, bleiben, passieren — كلها تستخدم sein.',
            example: 'Gestern **ist** etwas Komisches **passiert**.',
            translation: 'أمس حدث شيء غريب.',
          },
        ],
        examples: [
          'Ich bin gestern nach Berlin gefahren. — ذهبت إلى برلين أمس.',
          'Sie ist um 6 Uhr aufgestanden. — استيقظت الساعة 6.',
          'Wir sind zu Fuß gegangen. — مشينا على الأقدام.',
          'Er ist nach Marokko geflogen. — سافر إلى المغرب.',
          'Ich bin letztes Jahr in Deutschland gewesen. — كنت في ألمانيا السنة الماضية.',
          'Sie ist zu Hause geblieben. — بقيت في البيت.',
          'Was ist passiert? — ماذا حدث؟',
          'Ich bin früh eingeschlafen. — نمت مبكراً.',
        ],
        tip: '💡 اختبار بسيط للاختيار بين haben و sein: اسأل "هل تغير المكان أو الحالة؟" — إذا نعم → sein. إذا لا → haben. تذكّر الاستثناءات (sein, bleiben, passieren) كمجموعة منفصلة.',
      },
      vocabulary: [
        { german: 'fahren', arabic: 'يذهب بمركبة', example: 'Ich fahre nach Köln.', exampleArabic: 'أذهب إلى كولونيا.', type: 'verb' },
        { german: 'gefahren', arabic: 'ذهب (ماضي)', example: 'Wir sind gefahren.', exampleArabic: 'ذهبنا.', type: 'verb' },
        { german: 'fliegen', arabic: 'يطير', example: 'Ich fliege nach Marokko.', exampleArabic: 'أطير إلى المغرب.', type: 'verb' },
        { german: 'geflogen', arabic: 'طار (ماضي)', example: 'Er ist geflogen.', exampleArabic: 'طار.', type: 'verb' },
        { german: 'gehen', arabic: 'يذهب مشياً', example: 'Ich gehe zur Schule.', exampleArabic: 'أذهب إلى المدرسة.', type: 'verb' },
        { german: 'gegangen', arabic: 'ذهب (ماضي)', example: 'Ich bin gegangen.', exampleArabic: 'ذهبت.', type: 'verb' },
        { german: 'kommen', arabic: 'يأتي', example: 'Er kommt spät.', exampleArabic: 'يأتي متأخراً.', type: 'verb' },
        { german: 'gekommen', arabic: 'أتى (ماضي)', example: 'Er ist gekommen.', exampleArabic: 'أتى.', type: 'verb' },
        { german: 'reisen', arabic: 'يسافر', example: 'Ich reise gern.', exampleArabic: 'أحب السفر.', type: 'verb' },
        { german: 'gereist', arabic: 'سافر (ماضي)', example: 'Sie ist viel gereist.', exampleArabic: 'سافرت كثيراً.', type: 'verb' },
        { german: 'bleiben', arabic: 'يبقى', example: 'Ich bleibe hier.', exampleArabic: 'أبقى هنا.', type: 'verb' },
        { german: 'geblieben', arabic: 'بقي (ماضي)', example: 'Wir sind geblieben.', exampleArabic: 'بقينا.', type: 'verb' },
        { german: 'aufgestanden', arabic: 'استيقظ (ماضي)', example: 'Ich bin früh aufgestanden.', exampleArabic: 'استيقظت مبكراً.', type: 'verb' },
        { german: 'eingeschlafen', arabic: 'نام (ماضي)', example: 'Das Baby ist eingeschlafen.', exampleArabic: 'نام الرضيع.', type: 'verb' },
        { german: 'gewesen', arabic: 'كان (ماضي من sein)', example: 'Ich bin in Berlin gewesen.', exampleArabic: 'كنت في برلين.', type: 'verb' },
        { german: 'passieren', arabic: 'يحدث', example: 'Was passiert?', exampleArabic: 'ماذا يحدث؟', type: 'verb' },
        { german: 'passiert', arabic: 'حدث (ماضي)', example: 'Was ist passiert?', exampleArabic: 'ماذا حدث؟', type: 'verb' },
        { german: 'Urlaub', arabic: 'العطلة', gender: 'der', plural: 'Urlaube', example: 'Ich fahre in Urlaub.', exampleArabic: 'أذهب في عطلة.', type: 'noun' },
        { german: 'Reise', arabic: 'الرحلة', gender: 'die', plural: 'Reisen', example: 'Gute Reise!', exampleArabic: 'رحلة سعيدة!', type: 'noun' },
        { german: 'Zug', arabic: 'القطار', gender: 'der', plural: 'Züge', example: 'Der Zug ist weg.', exampleArabic: 'غادر القطار.', type: 'noun' },
        { german: 'Flugzeug', arabic: 'الطائرة', gender: 'das', plural: 'Flugzeuge', example: 'Das Flugzeug landet.', exampleArabic: 'الطائرة تهبط.', type: 'noun' },
        { german: 'Auto', arabic: 'السيارة', gender: 'das', plural: 'Autos', example: 'Mein Auto ist neu.', exampleArabic: 'سيارتي جديدة.', type: 'noun' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a2-02-q1',
            question: 'أكمل: "Wir ___ nach München gefahren." (sein مع wir)',
            answer: 'sind',
            hint: 'أفعال الحركة تستخدم sein',
          },
          {
            type: 'multiple-choice', id: 'a2-02-q2',
            question: 'أي جملة صحيحة؟',
            options: [
              'Ich habe nach Berlin gefahren.',
              'Ich bin nach Berlin gefahren.',
              'Ich habe gefahren nach Berlin.',
              'Ich nach Berlin bin gefahren.',
            ],
            answer: 'Ich bin nach Berlin gefahren.',
          },
          {
            type: 'fill-blank', id: 'a2-02-q3',
            question: 'أكمل: "Er ___ um 6 Uhr aufgestanden."',
            answer: 'ist',
            hint: 'aufstehen = فعل تغيير → sein',
          },
          {
            type: 'multiple-choice', id: 'a2-02-q4',
            question: 'ما الفعل المساعد الصحيح لـ "bleiben"؟',
            options: ['haben', 'sein', 'werden', 'كلاهما'],
            answer: 'sein',
          },
          {
            type: 'matching', id: 'a2-02-q5',
            question: 'اربط الفعل بصيغة Partizip II:',
            pairs: [
              { left: 'gehen', right: 'gegangen' },
              { left: 'fahren', right: 'gefahren' },
              { left: 'kommen', right: 'gekommen' },
              { left: 'sein', right: 'gewesen' },
              { left: 'bleiben', right: 'geblieben' },
              { left: 'fliegen', right: 'geflogen' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-02-q6',
            question: 'رتّب: "طرنا إلى المغرب"',
            words: ['Wir', 'sind', 'nach', 'Marokko', 'geflogen'],
            answer: 'Wir sind nach Marokko geflogen',
          },
          {
            type: 'speaking', id: 'a2-02-q7',
            question: 'قل بالألمانية: "استيقظت مبكراً وذهبت إلى العمل"',
            answer: 'Ich bin früh aufgestanden und zur Arbeit gegangen',
          },
          {
            type: 'fill-blank', id: 'a2-02-q8',
            question: 'استمع وأكمل: "Was ___ passiert?" (حدث)',
            audioPrompt: 'Was ist passiert?',
            answer: 'ist',
            hint: 'passieren يستخدم sein',
          },
          {
            type: 'multiple-choice', id: 'a2-02-q9',
            question: 'ما الفعل المساعد الصحيح للجملة: "___ du gut geschlafen?"',
            options: ['Habst', 'Hast', 'Bist', 'Sind'],
            answer: 'Hast',
          },
          {
            type: 'drag-drop', id: 'a2-02-q10',
            question: 'رتّب: "بقيت في البيت أمس"',
            words: ['Ich', 'bin', 'gestern', 'zu', 'Hause', 'geblieben'],
            answer: 'Ich bin gestern zu Hause geblieben',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 3 — Dativ
    // ─────────────────────────────────────────────
    {
      id: 'a2-03',
      title: 'حالة الإضافة — Dativ',
      order: 3,
      grammar: {
        title: 'حالة Dativ مع الضمائر وأدوات التعريف',
        content: `**Dativ** هي الحالة الثالثة في الألمانية. تُستخدم للإجابة عن سؤال **Wem?** (لمن؟).

**متى نستخدم Dativ؟**
- مع المفعول به غير المباشر (المتلقي)
- بعد حروف جر معينة (mit, zu, bei, von, aus, nach, seit)
- مع أفعال معينة (helfen, danken, gefallen, gehören)`,
        tables: [
          {
            title: 'أداة التعريف في Dativ',
            headers: ['Genus', 'Nominativ', 'Akkusativ', 'Dativ'],
            rows: [
              { cells: ['Maskulin', 'der', 'den', 'dem'], highlight: true },
              { cells: ['Feminin', 'die', 'die', 'der'], highlight: true },
              { cells: ['Neutrum', 'das', 'das', 'dem'], highlight: true },
              { cells: ['Plural', 'die', 'die', 'den + n ⚠️'], highlight: true },
            ],
            theme: 'cases',
            note: '⚠️ في Dativ Plural، نضيف -n إلى الاسم: den Kindern, den Frauen.',
          },
          {
            title: 'ضمائر Dativ',
            headers: ['Nominativ', 'Akkusativ', 'Dativ'],
            rows: [
              { cells: ['ich', 'mich', 'mir'] },
              { cells: ['du', 'dich', 'dir'] },
              { cells: ['er', 'ihn', 'ihm'] },
              { cells: ['sie', 'sie', 'ihr'] },
              { cells: ['es', 'es', 'ihm'] },
              { cells: ['wir', 'uns', 'uns'] },
              { cells: ['ihr', 'euch', 'euch'] },
              { cells: ['sie/Sie', 'sie/Sie', 'ihnen/Ihnen'] },
            ],
            theme: 'conjugation',
          },
          {
            title: 'حروف الجر التي تأخذ Dativ دائماً',
            headers: ['Präposition', 'المعنى', 'مثال'],
            rows: [
              { cells: ['mit', 'مع / بـ', 'Ich fahre mit dem Bus.'] },
              { cells: ['zu', 'إلى (شخص/مكان)', 'Ich gehe zu dem (zum) Arzt.'] },
              { cells: ['bei', 'عند', 'Ich wohne bei meinen Eltern.'] },
              { cells: ['von', 'من', 'Das ist ein Geschenk von Oma.'] },
              { cells: ['aus', 'من (الأصل)', 'Ich komme aus Marokko.'] },
              { cells: ['nach', 'إلى (البلد)', 'Wir fahren nach Deutschland.'] },
              { cells: ['seit', 'منذ', 'Ich lerne seit einem Jahr.'] },
              { cells: ['gegenüber', 'مقابل', 'Gegenüber dem Park.'] },
            ],
            theme: 'cases',
          },
        ],
        rules: [
          {
            rule: 'أفعال مهمة دائماً مع Dativ: helfen, danken, gefallen, gehören, antworten.',
            example: 'Ich helfe **meiner Mutter**. / Das Buch gefällt **mir**.',
            translation: 'أساعد أمي. / الكتاب يعجبني.',
          },
          {
            rule: 'اختصارات شائعة: zu dem = zum / zu der = zur / bei dem = beim.',
            example: 'Ich gehe **zum** Bahnhof. / Wir sind **beim** Arzt.',
            translation: 'أذهب إلى المحطة. / نحن عند الطبيب.',
          },
          {
            rule: 'جملة مع مفعولين: ترتيب ضمير Dativ قبل Akkusativ عادة.',
            example: 'Ich gebe **dir** (Dativ) **das Buch** (Akk).',
            translation: 'أعطيك الكتاب.',
          },
        ],
        examples: [
          'Ich fahre mit dem Auto. — أذهب بالسيارة.',
          'Er hilft seiner Mutter. — يساعد أمه.',
          'Das Buch gefällt mir sehr. — الكتاب يعجبني كثيراً.',
          'Wir wohnen bei unseren Freunden. — نسكن عند أصدقائنا.',
          'Ich komme aus der Türkei. — أنا من تركيا.',
          'Seit einem Monat lerne ich Deutsch. — أتعلم الألمانية منذ شهر.',
          'Gib mir bitte das Buch. — أعطني الكتاب من فضلك.',
          'Wem gehört dieses Auto? — لمن هذه السيارة؟',
        ],
        tip: '💡 لحفظ حروف الجر مع Dativ استخدم هذه الجملة السحرية: "aus, bei, mit, nach, seit, von, zu" — كرّرها حتى تحفظها. كل هذه تأخذ Dativ دائماً!',
      },
      vocabulary: [
        { german: 'mit', arabic: 'مع / بـ', example: 'Mit dem Bus fahren.', exampleArabic: 'الذهاب بالحافلة.', type: 'preposition' },
        { german: 'zu', arabic: 'إلى', example: 'Ich gehe zum Arzt.', exampleArabic: 'أذهب للطبيب.', type: 'preposition' },
        { german: 'bei', arabic: 'عند', example: 'Bei meiner Oma.', exampleArabic: 'عند جدتي.', type: 'preposition' },
        { german: 'von', arabic: 'من', example: 'Von meinem Vater.', exampleArabic: 'من أبي.', type: 'preposition' },
        { german: 'aus', arabic: 'من (الأصل)', example: 'Ich komme aus Marokko.', exampleArabic: 'أنا من المغرب.', type: 'preposition' },
        { german: 'nach', arabic: 'إلى (البلد)', example: 'Nach Berlin fahren.', exampleArabic: 'الذهاب إلى برلين.', type: 'preposition' },
        { german: 'seit', arabic: 'منذ', example: 'Seit einem Jahr.', exampleArabic: 'منذ سنة.', type: 'preposition' },
        { german: 'gegenüber', arabic: 'مقابل', example: 'Gegenüber dem Park.', exampleArabic: 'مقابل الحديقة.', type: 'preposition' },
        { german: 'helfen', arabic: 'يساعد', example: 'Kannst du mir helfen?', exampleArabic: 'هل تساعدني؟', type: 'verb' },
        { german: 'danken', arabic: 'يشكر', example: 'Ich danke dir.', exampleArabic: 'أشكرك.', type: 'verb' },
        { german: 'gefallen', arabic: 'يعجب', example: 'Das gefällt mir.', exampleArabic: 'يعجبني.', type: 'verb' },
        { german: 'gehören', arabic: 'يخص / ملك لـ', example: 'Das gehört mir.', exampleArabic: 'هذا لي.', type: 'verb' },
        { german: 'antworten', arabic: 'يجيب', example: 'Antworte mir bitte.', exampleArabic: 'أجبني من فضلك.', type: 'verb' },
        { german: 'geben', arabic: 'يعطي', example: 'Gib mir das Buch.', exampleArabic: 'أعطني الكتاب.', type: 'verb' },
        { german: 'zeigen', arabic: 'يُري', example: 'Zeig mir dein Haus.', exampleArabic: 'أرني بيتك.', type: 'verb' },
        { german: 'schicken', arabic: 'يرسل', example: 'Ich schicke dir ein Foto.', exampleArabic: 'أرسل لك صورة.', type: 'verb' },
        { german: 'schreiben', arabic: 'يكتب', example: 'Ich schreibe dir eine Mail.', exampleArabic: 'أكتب لك إيميلاً.', type: 'verb' },
        { german: 'erzählen', arabic: 'يحكي', example: 'Erzähl mir etwas.', exampleArabic: 'احكِ لي شيئاً.', type: 'verb' },
        { german: 'mir / dir / ihm', arabic: 'لي / لك / له', example: 'Gib mir das.', exampleArabic: 'أعطني هذا.', type: 'pronoun' },
        { german: 'Geschenk', arabic: 'الهدية', gender: 'das', plural: 'Geschenke', example: 'Das ist ein Geschenk.', exampleArabic: 'هذه هدية.', type: 'noun' },
        { german: 'Meinung', arabic: 'الرأي', gender: 'die', plural: 'Meinungen', example: 'Meiner Meinung nach...', exampleArabic: 'في رأيي...', type: 'noun' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a2-03-q1',
            question: 'أكمل: "Ich fahre mit ___ Bus." (مذكر Dativ)',
            answer: 'dem',
            hint: 'der → dem في Dativ',
          },
          {
            type: 'multiple-choice', id: 'a2-03-q2',
            question: 'ما ضمير Dativ لـ "ich"؟',
            options: ['mich', 'mir', 'mein', 'meinem'],
            answer: 'mir',
          },
          {
            type: 'fill-blank', id: 'a2-03-q3',
            question: 'أكمل: "Ich helfe ___ Mutter." (أمي — Dativ مؤنث)',
            answer: 'meiner',
            hint: 'mein- مع Dativ مؤنث → meiner',
          },
          {
            type: 'multiple-choice', id: 'a2-03-q4',
            question: 'أي حرف جر يأخذ دائماً Dativ؟',
            options: ['für', 'ohne', 'mit', 'durch'],
            answer: 'mit',
          },
          {
            type: 'matching', id: 'a2-03-q5',
            question: 'اربط الضمير بـ Dativ المقابل:',
            pairs: [
              { left: 'ich', right: 'mir' },
              { left: 'du', right: 'dir' },
              { left: 'er', right: 'ihm' },
              { left: 'sie (هي)', right: 'ihr' },
              { left: 'wir', right: 'uns' },
              { left: 'sie (هم)', right: 'ihnen' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-03-q6',
            question: 'رتّب: "أعطني الكتاب من فضلك"',
            words: ['Gib', 'mir', 'bitte', 'das', 'Buch'],
            answer: 'Gib mir bitte das Buch',
          },
          {
            type: 'speaking', id: 'a2-03-q7',
            question: 'قل بالألمانية: "أسكن منذ سنة مع صديقي"',
            answer: 'Ich wohne seit einem Jahr mit meinem Freund',
          },
          {
            type: 'fill-blank', id: 'a2-03-q8',
            question: 'استمع وأكمل: "Das Buch gefällt ___." (لي)',
            audioPrompt: 'Das Buch gefällt mir.',
            answer: 'mir',
            hint: 'ضمير Dativ لـ ich',
          },
          {
            type: 'multiple-choice', id: 'a2-03-q9',
            question: 'ما معنى "zum" (اختصار)؟',
            options: ['zu + die', 'zu + der', 'zu + dem', 'zu + das'],
            answer: 'zu + dem',
          },
          {
            type: 'fill-blank', id: 'a2-03-q10',
            question: 'أكمل: "Ich komme ___ Marokko." (من الأصل)',
            answer: 'aus',
            hint: 'مع البلد الأصلي نستخدم aus',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 4 — حروف الجر المزدوجة (Wechselpräpositionen)
    // ─────────────────────────────────────────────
    {
      id: 'a2-04',
      title: 'حروف الجر المزدوجة — Wechselpräpositionen',
      order: 4,
      grammar: {
        title: 'تسعة حروف جر تتغير حالتها حسب المعنى',
        content: `توجد **9 حروف جر خاصة** تأخذ إما Akkusativ أو Dativ حسب المعنى:

**القاعدة الذهبية:**
- **Wohin?** (إلى أين؟ — حركة) → Akkusativ
- **Wo?** (أين؟ — مكان ثابت) → Dativ

مثال:
- Ich lege das Buch **auf den** Tisch. (أين أضعه؟ حركة → Akk)
- Das Buch liegt **auf dem** Tisch. (أين هو؟ ثابت → Dativ)`,
        tables: [
          {
            title: 'الـ 9 حروف جر المزدوجة',
            headers: ['Präposition', 'المعنى'],
            rows: [
              { cells: ['in', 'في / داخل'] },
              { cells: ['an', 'على (عمودي) / بجانب'] },
              { cells: ['auf', 'على (أفقي)'] },
              { cells: ['über', 'فوق'] },
              { cells: ['unter', 'تحت'] },
              { cells: ['vor', 'أمام'] },
              { cells: ['hinter', 'خلف'] },
              { cells: ['neben', 'بجانب'] },
              { cells: ['zwischen', 'بين'] },
            ],
            theme: 'default',
            note: 'احفظها بالجملة: "in, an, auf, über, unter, vor, hinter, neben, zwischen".',
          },
          {
            title: 'المقارنة: Akkusativ (حركة) vs Dativ (مكان)',
            headers: ['السؤال', 'الحالة', 'مثال'],
            rows: [
              { cells: ['Wohin?', 'Akkusativ', 'Ich gehe in die Küche.'] },
              { cells: ['Wo?', 'Dativ', 'Ich bin in der Küche.'] },
              { cells: ['Wohin?', 'Akkusativ', 'Er hängt das Bild an die Wand.'] },
              { cells: ['Wo?', 'Dativ', 'Das Bild hängt an der Wand.'] },
              { cells: ['Wohin?', 'Akkusativ', 'Ich lege das Buch auf den Tisch.'] },
              { cells: ['Wo?', 'Dativ', 'Das Buch liegt auf dem Tisch.'] },
            ],
            theme: 'cases',
          },
          {
            title: 'اختصارات شائعة',
            headers: ['Lang', 'Kurz', 'مثال'],
            rows: [
              { cells: ['in das', 'ins', 'Ich gehe ins Kino.'] },
              { cells: ['in dem', 'im', 'Ich bin im Kino.'] },
              { cells: ['an das', 'ans', 'Ich gehe ans Meer.'] },
              { cells: ['an dem', 'am', 'Ich bin am Meer.'] },
              { cells: ['auf das', 'aufs', 'Ich lege es aufs Regal.'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'سؤال Wohin? (إلى أين) يعني حركة → Akkusativ.',
            example: 'Ich gehe **in den** Park. (Akk مذكر)',
            translation: 'أذهب إلى الحديقة.',
          },
          {
            rule: 'سؤال Wo? (أين) يعني موقع ثابت → Dativ.',
            example: 'Ich bin **in dem (im)** Park. (Dativ مذكر)',
            translation: 'أنا في الحديقة.',
          },
          {
            rule: 'أفعال مفيدة: legen (يضع أفقياً) / stellen (يضع عمودياً) → Akk. liegen (يستلقي) / stehen (يقف) → Dativ.',
            example: 'Ich **stelle** die Flasche **auf den** Tisch. / Die Flasche **steht auf dem** Tisch.',
            translation: 'أضع الزجاجة على الطاولة. / الزجاجة على الطاولة.',
          },
        ],
        examples: [
          'Ich gehe in den Supermarkt. — أذهب إلى السوبرماركت. (Wohin)',
          'Ich bin im Supermarkt. — أنا في السوبرماركت. (Wo)',
          'Die Katze liegt unter dem Tisch. — القطة تحت الطاولة.',
          'Die Katze geht unter den Tisch. — القطة تذهب تحت الطاولة.',
          'Das Auto steht vor dem Haus. — السيارة أمام البيت.',
          'Die Lampe hängt über dem Tisch. — المصباح فوق الطاولة.',
          'Ich setze mich neben meinen Freund. — أجلس بجانب صديقي.',
          'Er arbeitet am Computer. — يعمل على الكمبيوتر.',
        ],
        tip: '💡 أسئلة السحر: قبل اختيار الحالة، اسأل نفسك "Wohin oder Wo?" إذا كانت الإجابة "إلى" → Akkusativ. إذا كانت "في مكان" → Dativ. هذا يعمل 100%!',
      },
      vocabulary: [
        { german: 'in', arabic: 'في / داخل', example: 'In der Stadt.', exampleArabic: 'في المدينة.', type: 'preposition' },
        { german: 'an', arabic: 'على (عمودي)', example: 'An der Wand.', exampleArabic: 'على الحائط.', type: 'preposition' },
        { german: 'auf', arabic: 'على (أفقي)', example: 'Auf dem Tisch.', exampleArabic: 'على الطاولة.', type: 'preposition' },
        { german: 'über', arabic: 'فوق', example: 'Über dem Bett.', exampleArabic: 'فوق السرير.', type: 'preposition' },
        { german: 'unter', arabic: 'تحت', example: 'Unter dem Stuhl.', exampleArabic: 'تحت الكرسي.', type: 'preposition' },
        { german: 'vor', arabic: 'أمام', example: 'Vor dem Haus.', exampleArabic: 'أمام البيت.', type: 'preposition' },
        { german: 'hinter', arabic: 'خلف', example: 'Hinter dem Park.', exampleArabic: 'خلف الحديقة.', type: 'preposition' },
        { german: 'neben', arabic: 'بجانب', example: 'Neben der Schule.', exampleArabic: 'بجانب المدرسة.', type: 'preposition' },
        { german: 'zwischen', arabic: 'بين', example: 'Zwischen zwei Bäumen.', exampleArabic: 'بين شجرتين.', type: 'preposition' },
        { german: 'legen', arabic: 'يضع (أفقياً)', example: 'Ich lege das Buch auf den Tisch.', exampleArabic: 'أضع الكتاب على الطاولة.', type: 'verb' },
        { german: 'liegen', arabic: 'يستلقي', example: 'Das Buch liegt auf dem Tisch.', exampleArabic: 'الكتاب على الطاولة.', type: 'verb' },
        { german: 'stellen', arabic: 'يضع (عمودياً)', example: 'Ich stelle die Flasche ins Regal.', exampleArabic: 'أضع الزجاجة في الرف.', type: 'verb' },
        { german: 'stehen', arabic: 'يقف', example: 'Die Flasche steht im Regal.', exampleArabic: 'الزجاجة في الرف.', type: 'verb' },
        { german: 'hängen', arabic: 'يعلّق / معلّق', example: 'Das Bild hängt an der Wand.', exampleArabic: 'الصورة على الحائط.', type: 'verb' },
        { german: 'sitzen', arabic: 'يجلس', example: 'Ich sitze auf dem Stuhl.', exampleArabic: 'أجلس على الكرسي.', type: 'verb' },
        { german: 'setzen', arabic: 'يُجلس', example: 'Ich setze mich auf den Stuhl.', exampleArabic: 'أجلس على الكرسي.', type: 'verb' },
        { german: 'Wand', arabic: 'الحائط', gender: 'die', plural: 'Wände', example: 'Das Bild ist an der Wand.', exampleArabic: 'الصورة على الحائط.', type: 'noun' },
        { german: 'Regal', arabic: 'الرف', gender: 'das', plural: 'Regale', example: 'Das Buch ist im Regal.', exampleArabic: 'الكتاب في الرف.', type: 'noun' },
        { german: 'Park', arabic: 'الحديقة', gender: 'der', plural: 'Parks', example: 'Wir gehen in den Park.', exampleArabic: 'نذهب إلى الحديقة.', type: 'noun' },
        { german: 'Kino', arabic: 'السينما', gender: 'das', plural: 'Kinos', example: 'Ich gehe ins Kino.', exampleArabic: 'أذهب إلى السينما.', type: 'noun' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a2-04-q1',
            question: 'أكمل: "Ich gehe in ___ Küche." (Wohin? — مؤنث Akk)',
            answer: 'die',
            hint: 'Wohin → Akkusativ',
          },
          {
            type: 'fill-blank', id: 'a2-04-q2',
            question: 'أكمل: "Ich bin in ___ Küche." (Wo? — مؤنث Dativ)',
            answer: 'der',
            hint: 'Wo → Dativ — die → der',
          },
          {
            type: 'multiple-choice', id: 'a2-04-q3',
            question: 'أي حرف جر يعني "بين"؟',
            options: ['neben', 'zwischen', 'unter', 'vor'],
            answer: 'zwischen',
          },
          {
            type: 'multiple-choice', id: 'a2-04-q4',
            question: 'Wohin? يأخذ أي حالة؟',
            options: ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'],
            answer: 'Akkusativ',
          },
          {
            type: 'matching', id: 'a2-04-q5',
            question: 'اربط حرف الجر بمعناه:',
            pairs: [
              { left: 'über', right: 'فوق' },
              { left: 'unter', right: 'تحت' },
              { left: 'vor', right: 'أمام' },
              { left: 'hinter', right: 'خلف' },
              { left: 'neben', right: 'بجانب' },
              { left: 'zwischen', right: 'بين' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-04-q6',
            question: 'رتّب: "الكتاب على الطاولة" (Wo?)',
            words: ['Das', 'Buch', 'liegt', 'auf', 'dem', 'Tisch'],
            answer: 'Das Buch liegt auf dem Tisch',
          },
          {
            type: 'speaking', id: 'a2-04-q7',
            question: 'قل بالألمانية: "أضع الكتاب على الطاولة"',
            answer: 'Ich lege das Buch auf den Tisch',
            hint: 'Wohin → den',
          },
          {
            type: 'fill-blank', id: 'a2-04-q8',
            question: 'استمع وأكمل: "Das Bild hängt an ___ Wand." (Dativ)',
            audioPrompt: 'Das Bild hängt an der Wand.',
            answer: 'der',
            hint: 'Wo → die → der',
          },
          {
            type: 'multiple-choice', id: 'a2-04-q9',
            question: 'ما معنى "ins"؟',
            options: ['in + die', 'in + der', 'in + das', 'in + dem'],
            answer: 'in + das',
          },
          {
            type: 'fill-blank', id: 'a2-04-q10',
            question: 'أكمل: "Ich gehe ___ Kino." (إلى السينما — ins/im؟)',
            answer: 'ins',
            hint: 'Wohin → ins',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 5 — المقارنة والتفضيل
    // ─────────────────────────────────────────────
    {
      id: 'a2-05',
      title: 'المقارنة والتفضيل — Komparativ und Superlativ',
      order: 5,
      grammar: {
        title: 'ثلاث درجات للصفات: إيجابي، مقارن، تفضيل',
        content: `كل صفة في الألمانية لها ثلاث درجات:
1. **إيجابي** (Positiv) — الصفة الأساسية: groß (كبير)
2. **مقارن** (Komparativ) — مقارنة بين شيئين: größer (أكبر)
3. **تفضيل** (Superlativ) — الأفضل من الكل: am größten (الأكبر)`,
        tables: [
          {
            title: 'تكوين الدرجات الثلاث',
            headers: ['Positiv', 'Komparativ', 'Superlativ'],
            rows: [
              { cells: ['klein', 'kleiner', 'am kleinsten'] },
              { cells: ['schnell', 'schneller', 'am schnellsten'] },
              { cells: ['schön', 'schöner', 'am schönsten'] },
              { cells: ['groß', 'größer ⚠️', 'am größten'] },
              { cells: ['alt', 'älter ⚠️', 'am ältesten'] },
              { cells: ['jung', 'jünger ⚠️', 'am jüngsten'] },
              { cells: ['kalt', 'kälter ⚠️', 'am kältesten'] },
            ],
            theme: 'conjugation',
            note: '⚠️ الصفات ذات a/o/u قصيرة تأخذ Umlaut في Komparativ.',
          },
          {
            title: 'الصفات الشاذة (حفظ)',
            headers: ['Positiv', 'Komparativ', 'Superlativ'],
            rows: [
              { cells: ['gut', 'besser', 'am besten'], highlight: true },
              { cells: ['viel', 'mehr', 'am meisten'], highlight: true },
              { cells: ['gern', 'lieber', 'am liebsten'], highlight: true },
              { cells: ['hoch', 'höher', 'am höchsten'] },
              { cells: ['nah', 'näher', 'am nächsten'] },
            ],
            theme: 'conjugation',
            note: 'احفظها — لا قاعدة لها.',
          },
        ],
        rules: [
          {
            rule: 'مقارنة شيئين: استخدم "als" (من).',
            example: 'Berlin ist **größer als** Köln.',
            translation: 'برلين أكبر من كولونيا.',
          },
          {
            rule: 'التساوي: استخدم "so ... wie" (مثل).',
            example: 'Er ist **so alt wie** ich.',
            translation: 'هو بعمري تماماً.',
          },
          {
            rule: 'للتفضيل: "am" + صفة + "sten" (أو estem في بعض الصفات).',
            example: 'Im Sommer ist es **am heißesten**.',
            translation: 'الصيف هو الأكثر حرارة.',
          },
        ],
        examples: [
          'Berlin ist größer als München. — برلين أكبر من ميونخ.',
          'Meine Schwester ist jünger als ich. — أختي أصغر مني.',
          'Dein Auto ist schneller als mein Auto. — سيارتك أسرع من سيارتي.',
          'Er spricht am besten Deutsch. — هو يتكلم الألمانية بأفضل شكل.',
          'Ich trinke lieber Tee als Kaffee. — أفضل شرب الشاي على القهوة.',
          'Das ist der höchste Berg. — هذا أعلى جبل.',
          'Welche Stadt ist am schönsten? — أي مدينة هي الأجمل؟',
          'Heute ist es kälter als gestern. — اليوم أبرد من أمس.',
        ],
        tip: '💡 gern → lieber → am liebsten: هذه الصفة الشاذة مهمة جداً للتعبير عن التفضيل في الطعام والنشاطات: "Ich trinke lieber Kaffee" (أفضل القهوة).',
      },
      vocabulary: [
        { german: 'groß', arabic: 'كبير', example: 'ein großes Haus', exampleArabic: 'بيت كبير', type: 'adjective' },
        { german: 'klein', arabic: 'صغير', example: 'ein kleines Zimmer', exampleArabic: 'غرفة صغيرة', type: 'adjective' },
        { german: 'gut / besser / am besten', arabic: 'جيد / أفضل / الأفضل', example: 'Er spielt am besten.', exampleArabic: 'يلعب الأفضل.', type: 'adjective' },
        { german: 'schlecht', arabic: 'سيء', example: 'Das Wetter ist schlecht.', exampleArabic: 'الجو سيء.', type: 'adjective' },
        { german: 'schnell / schneller', arabic: 'سريع / أسرع', example: 'Schneller als der Bus.', exampleArabic: 'أسرع من الحافلة.', type: 'adjective' },
        { german: 'langsam', arabic: 'بطيء', example: 'Bitte langsam!', exampleArabic: 'ببطء من فضلك!', type: 'adjective' },
        { german: 'alt', arabic: 'كبير السن / قديم', example: 'Ein altes Auto.', exampleArabic: 'سيارة قديمة.', type: 'adjective' },
        { german: 'jung', arabic: 'شاب', example: 'Sie ist noch jung.', exampleArabic: 'ما زالت شابة.', type: 'adjective' },
        { german: 'neu', arabic: 'جديد', example: 'Ein neues Handy.', exampleArabic: 'هاتف جديد.', type: 'adjective' },
        { german: 'billig / teuer', arabic: 'رخيص / غالٍ', example: 'Sehr teuer!', exampleArabic: 'غالٍ جداً!', type: 'adjective' },
        { german: 'leicht / schwer', arabic: 'سهل / صعب', example: 'Das ist leicht.', exampleArabic: 'هذا سهل.', type: 'adjective' },
        { german: 'kalt / heiß', arabic: 'بارد / ساخن', example: 'Heiße Suppe.', exampleArabic: 'شوربة ساخنة.', type: 'adjective' },
        { german: 'warm / kühl', arabic: 'دافئ / منعش', example: 'Ein warmes Hemd.', exampleArabic: 'قميص دافئ.', type: 'adjective' },
        { german: 'schön / hässlich', arabic: 'جميل / قبيح', example: 'Eine schöne Stadt.', exampleArabic: 'مدينة جميلة.', type: 'adjective' },
        { german: 'interessant / langweilig', arabic: 'مثير للاهتمام / ممل', example: 'Der Film ist interessant.', exampleArabic: 'الفيلم مثير.', type: 'adjective' },
        { german: 'einfach / kompliziert', arabic: 'بسيط / معقد', example: 'Das ist kompliziert.', exampleArabic: 'هذا معقد.', type: 'adjective' },
        { german: 'als', arabic: 'من (في المقارنة)', example: 'Er ist älter als ich.', exampleArabic: 'هو أكبر مني.', type: 'conjunction' },
        { german: 'wie', arabic: 'مثل (في التساوي)', example: 'So groß wie ich.', exampleArabic: 'بحجمي.', type: 'conjunction' },
        { german: 'lieber', arabic: 'يفضل', example: 'Ich trinke lieber Tee.', exampleArabic: 'أفضل الشاي.', type: 'adverb' },
        { german: 'mehr / weniger', arabic: 'أكثر / أقل', example: 'Mehr Zucker, bitte.', exampleArabic: 'المزيد من السكر.', type: 'adverb' },
      ],
      exercise: {
        questions: [
          {
            type: 'multiple-choice', id: 'a2-05-q1',
            question: 'ما Komparativ من "groß"؟',
            options: ['größer', 'mehr groß', 'grösser', 'am größten'],
            answer: 'größer',
          },
          {
            type: 'fill-blank', id: 'a2-05-q2',
            question: 'أكمل: "Berlin ist größer ___ Köln."',
            answer: 'als',
            hint: 'مع المقارنة نستخدم als',
          },
          {
            type: 'multiple-choice', id: 'a2-05-q3',
            question: 'ما Superlativ من "gut"؟',
            options: ['am gut', 'am gutsten', 'am besten', 'am gutesten'],
            answer: 'am besten',
          },
          {
            type: 'fill-blank', id: 'a2-05-q4',
            question: 'أكمل: "Er ist so alt ___ ich." (التساوي)',
            answer: 'wie',
            hint: 'التساوي = wie',
          },
          {
            type: 'matching', id: 'a2-05-q5',
            question: 'اربط الصفة بـ Komparativ:',
            pairs: [
              { left: 'gut', right: 'besser' },
              { left: 'viel', right: 'mehr' },
              { left: 'gern', right: 'lieber' },
              { left: 'alt', right: 'älter' },
              { left: 'hoch', right: 'höher' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-05-q6',
            question: 'رتّب: "أفضل شرب الشاي على القهوة"',
            words: ['Ich', 'trinke', 'lieber', 'Tee', 'als', 'Kaffee'],
            answer: 'Ich trinke lieber Tee als Kaffee',
          },
          {
            type: 'speaking', id: 'a2-05-q7',
            question: 'قل بالألمانية: "اليوم أبرد من أمس"',
            answer: 'Heute ist es kälter als gestern',
          },
          {
            type: 'fill-blank', id: 'a2-05-q8',
            question: 'استمع وأكمل: "Das ist der ___ Berg." (الأعلى)',
            audioPrompt: 'Das ist der höchste Berg.',
            answer: 'höchste',
            hint: 'Superlativ من hoch',
          },
          {
            type: 'multiple-choice', id: 'a2-05-q9',
            question: 'أي جملة صحيحة؟',
            options: [
              'Er ist mehr groß als ich.',
              'Er ist größer wie ich.',
              'Er ist größer als ich.',
              'Er größer als ich ist.',
            ],
            answer: 'Er ist größer als ich.',
          },
          {
            type: 'fill-blank', id: 'a2-05-q10',
            question: 'أكمل: "Im Sommer ist es am ___." (الأكثر حراً)',
            answer: 'heißesten',
            hint: 'Superlativ: heiß → heißesten',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 6 — weil, dass, wenn
    // ─────────────────────────────────────────────
    {
      id: 'a2-06',
      title: 'الجمل المركبة — Nebensätze',
      order: 6,
      grammar: {
        title: 'أدوات الربط weil, dass, wenn, ob',
        content: `الجمل المركبة تتكون من جملة رئيسية + جملة ثانوية (Nebensatz) تبدأ بـ **أداة ربط**.

**القاعدة الذهبية:** في الجملة الثانوية، **الفعل يذهب إلى النهاية**.

→ Ich lerne Deutsch, **weil** ich in Deutschland **arbeite**.
                                                    ↑ الفعل في النهاية`,
        tables: [
          {
            title: 'أدوات الربط الأساسية',
            headers: ['Konjunktion', 'المعنى', 'مثال'],
            rows: [
              { cells: ['weil', 'لأن', 'Ich bleibe, weil es regnet.'] },
              { cells: ['dass', 'أنّ', 'Ich weiß, dass du kommst.'] },
              { cells: ['wenn', 'إذا / عندما', 'Wenn es regnet, bleibe ich.'] },
              { cells: ['ob', 'هل (سؤال غير مباشر)', 'Ich frage, ob er kommt.'] },
              { cells: ['obwohl', 'رغم أن', 'Ich komme, obwohl ich müde bin.'] },
              { cells: ['damit', 'لكي', 'Ich lerne, damit ich Arbeit finde.'] },
              { cells: ['bevor', 'قبل أن', 'Bevor ich esse, wasche ich die Hände.'] },
              { cells: ['nachdem', 'بعد أن', 'Nachdem ich gegessen habe, gehe ich.'] },
            ],
            theme: 'default',
          },
          {
            title: 'مقارنة: ترتيب الفعل',
            headers: ['نوع الجملة', 'موقع الفعل', 'مثال'],
            rows: [
              { cells: ['رئيسية', 'المكان الثاني', 'Ich lerne Deutsch.'] },
              { cells: ['رئيسية (سؤال)', 'المكان الأول', 'Lernst du Deutsch?'] },
              { cells: ['ثانوية (weil/dass...)', 'في النهاية', 'weil ich Deutsch **lerne**.'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'بعد أداة الربط (weil, dass, wenn...) الفعل يذهب للنهاية.',
            example: 'Ich komme nicht, weil ich **krank bin**.',
            translation: 'لا آتي لأنني مريض.',
          },
          {
            rule: 'إذا بدأت بالجملة الثانوية، الفاصلة + ثم الفعل الرئيسي مباشرة.',
            example: 'Weil es regnet, **bleibe** ich zu Hause.',
            translation: 'لأنها تمطر، أبقى في البيت.',
          },
          {
            rule: 'wenn = إذا / عندما (للمستقبل أو العادة)، als = عندما (للماضي مرة واحدة).',
            example: '**Wenn** es regnet, bleibe ich. / **Als** ich ein Kind war, wohnte ich in Fes.',
            translation: 'إذا أمطرت أبقى. / عندما كنت طفلاً سكنت في فاس.',
          },
        ],
        examples: [
          'Ich lerne Deutsch, weil ich in Deutschland arbeiten will. — أتعلم الألمانية لأني أريد العمل في ألمانيا.',
          'Ich weiß, dass du Recht hast. — أعلم أنك على حق.',
          'Wenn du Zeit hast, komm zu uns! — إذا كان لديك وقت، تعال إلينا!',
          'Ich frage, ob er heute kommt. — أسأل إن كان سيأتي اليوم.',
          'Obwohl ich müde bin, arbeite ich weiter. — رغم أنني متعب، أكمل العمل.',
          'Ich lerne viel, damit ich die Prüfung bestehe. — أتعلم كثيراً لأنجح في الامتحان.',
          'Bevor ich schlafe, lese ich ein Buch. — قبل النوم أقرأ كتاباً.',
          'Nachdem er gegessen hat, ist er müde. — بعد أن أكل هو متعب.',
        ],
        tip: '💡 الفرق بين weil و denn: كلاهما يعني "لأن"، لكن **weil** يرسل الفعل للنهاية (رسمي)، و**denn** لا يغير ترتيب الجملة (عامي). في الكتابة استخدم weil دائماً.',
      },
      vocabulary: [
        { german: 'weil', arabic: 'لأن', example: 'Ich bleibe, weil ich müde bin.', exampleArabic: 'أبقى لأني متعب.', type: 'conjunction' },
        { german: 'dass', arabic: 'أنّ', example: 'Ich denke, dass du Recht hast.', exampleArabic: 'أعتقد أنك محق.', type: 'conjunction' },
        { german: 'wenn', arabic: 'إذا / عندما', example: 'Wenn es regnet...', exampleArabic: 'إذا أمطرت...', type: 'conjunction' },
        { german: 'ob', arabic: 'هل (غير مباشر)', example: 'Ich weiß nicht, ob er kommt.', exampleArabic: 'لا أعلم إن كان سيأتي.', type: 'conjunction' },
        { german: 'obwohl', arabic: 'رغم أن', example: 'Obwohl ich müde bin...', exampleArabic: 'رغم أني متعب...', type: 'conjunction' },
        { german: 'damit', arabic: 'لكي', example: 'Ich lerne, damit ich Arbeit finde.', exampleArabic: 'أتعلم لأجد عملاً.', type: 'conjunction' },
        { german: 'bevor', arabic: 'قبل أن', example: 'Bevor ich gehe...', exampleArabic: 'قبل أن أذهب...', type: 'conjunction' },
        { german: 'nachdem', arabic: 'بعد أن', example: 'Nachdem ich gegessen habe...', exampleArabic: 'بعد أن أكلت...', type: 'conjunction' },
        { german: 'als', arabic: 'عندما (ماضي)', example: 'Als ich Kind war...', exampleArabic: 'عندما كنت طفلاً...', type: 'conjunction' },
        { german: 'denken', arabic: 'يفكر', example: 'Was denkst du?', exampleArabic: 'ما رأيك؟', type: 'verb' },
        { german: 'wissen', arabic: 'يعرف', example: 'Ich weiß das nicht.', exampleArabic: 'لا أعرف ذلك.', type: 'verb' },
        { german: 'glauben', arabic: 'يعتقد', example: 'Ich glaube, du hast Recht.', exampleArabic: 'أعتقد أنك محق.', type: 'verb' },
        { german: 'hoffen', arabic: 'يأمل', example: 'Ich hoffe, du kommst.', exampleArabic: 'أرجو أنك ستأتي.', type: 'verb' },
        { german: 'meinen', arabic: 'يقصد', example: 'Was meinst du?', exampleArabic: 'ماذا تقصد؟', type: 'verb' },
        { german: 'sagen', arabic: 'يقول', example: 'Er sagt, dass er kommt.', exampleArabic: 'يقول إنه سيأتي.', type: 'verb' },
        { german: 'fragen', arabic: 'يسأل', example: 'Er fragt, ob es regnet.', exampleArabic: 'يسأل إن كانت تمطر.', type: 'verb' },
        { german: 'Grund', arabic: 'السبب', gender: 'der', plural: 'Gründe', example: 'Aus welchem Grund?', exampleArabic: 'لأي سبب؟', type: 'noun' },
        { german: 'Prüfung', arabic: 'الامتحان', gender: 'die', plural: 'Prüfungen', example: 'Die Prüfung ist schwer.', exampleArabic: 'الامتحان صعب.', type: 'noun' },
        { german: 'Meinung', arabic: 'الرأي', gender: 'die', plural: 'Meinungen', example: 'Meine Meinung ist...', exampleArabic: 'رأيي هو...', type: 'noun' },
        { german: 'Recht haben', arabic: 'يكون محقاً', example: 'Du hast Recht.', exampleArabic: 'أنت محق.', type: 'phrase' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a2-06-q1',
            question: 'أكمل: "Ich lerne Deutsch, ___ ich in Deutschland arbeiten will." (لأن)',
            answer: 'weil',
          },
          {
            type: 'multiple-choice', id: 'a2-06-q2',
            question: 'في الجملة "Ich weiß, dass du kommst" — أين يكون الفعل في الجملة الثانوية؟',
            options: ['في البداية', 'في المكان الثاني', 'في النهاية', 'قبل dass'],
            answer: 'في النهاية',
          },
          {
            type: 'fill-blank', id: 'a2-06-q3',
            question: 'أكمل: "Ich frage, ___ er heute kommt." (إن كان)',
            answer: 'ob',
            hint: 'السؤال غير المباشر = ob',
          },
          {
            type: 'multiple-choice', id: 'a2-06-q4',
            question: 'ما معنى "obwohl"؟',
            options: ['لأن', 'رغم أن', 'إذا', 'لكي'],
            answer: 'رغم أن',
          },
          {
            type: 'matching', id: 'a2-06-q5',
            question: 'اربط أداة الربط بمعناها:',
            pairs: [
              { left: 'weil', right: 'لأن' },
              { left: 'dass', right: 'أن' },
              { left: 'wenn', right: 'إذا' },
              { left: 'obwohl', right: 'رغم أن' },
              { left: 'damit', right: 'لكي' },
              { left: 'bevor', right: 'قبل أن' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-06-q6',
            question: 'رتّب: "أبقى في البيت لأنها تمطر"',
            words: ['Ich', 'bleibe', 'zu', 'Hause', 'weil', 'es', 'regnet'],
            answer: 'Ich bleibe zu Hause weil es regnet',
          },
          {
            type: 'speaking', id: 'a2-06-q7',
            question: 'قل بالألمانية: "أعتقد أن الفيلم مثير"',
            answer: 'Ich glaube dass der Film interessant ist',
          },
          {
            type: 'fill-blank', id: 'a2-06-q8',
            question: 'استمع وأكمل: "___ ich Zeit habe, komme ich." (إذا)',
            audioPrompt: 'Wenn ich Zeit habe, komme ich.',
            answer: 'Wenn',
            hint: 'إذا = wenn',
          },
          {
            type: 'multiple-choice', id: 'a2-06-q9',
            question: 'أي جملة صحيحة؟',
            options: [
              'Ich weiß, dass du hast Recht.',
              'Ich weiß, dass Recht du hast.',
              'Ich weiß, dass du Recht hast.',
              'Ich weiß dass du Recht hast.',
            ],
            answer: 'Ich weiß, dass du Recht hast.',
          },
          {
            type: 'fill-blank', id: 'a2-06-q10',
            question: 'أكمل: "Ich lerne Deutsch, ___ ich eine Arbeit finde." (لكي)',
            answer: 'damit',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 7 — الأفعال المنعكسة
    // ─────────────────────────────────────────────
    {
      id: 'a2-07',
      title: 'الأفعال المنعكسة — Reflexive Verben',
      order: 7,
      grammar: {
        title: 'الأفعال المنعكسة مع sich',
        content: `الأفعال المنعكسة تعبّر عن فعل يقوم به الفاعل على **نفسه**.

**القاعدة:** الضمير المنعكس (sich) يتغير حسب الفاعل.

→ Ich wasche **mich**. (أغسل نفسي)
→ Du wäschst **dich**.
→ Er wäscht **sich**.`,
        tables: [
          {
            title: 'ضمائر الانعكاس — Akkusativ',
            headers: ['Pronomen', 'Reflexiv', 'مثال'],
            rows: [
              { cells: ['ich', 'mich', 'Ich wasche mich.'] },
              { cells: ['du', 'dich', 'Du wäschst dich.'] },
              { cells: ['er/sie/es', 'sich', 'Er wäscht sich.'] },
              { cells: ['wir', 'uns', 'Wir waschen uns.'] },
              { cells: ['ihr', 'euch', 'Ihr wascht euch.'] },
              { cells: ['sie/Sie', 'sich', 'Sie waschen sich.'] },
            ],
            theme: 'conjugation',
          },
          {
            title: 'أفعال منعكسة شائعة',
            headers: ['Verb', 'المعنى', 'مثال'],
            rows: [
              { cells: ['sich waschen', 'يغتسل', 'Ich wasche mich.'] },
              { cells: ['sich anziehen', 'يرتدي', 'Ich ziehe mich an.'] },
              { cells: ['sich ausziehen', 'يخلع', 'Er zieht sich aus.'] },
              { cells: ['sich freuen', 'يفرح', 'Ich freue mich.'] },
              { cells: ['sich ärgern', 'يغضب', 'Er ärgert sich.'] },
              { cells: ['sich beeilen', 'يسرع', 'Beeil dich!'] },
              { cells: ['sich ausruhen', 'يستريح', 'Ich ruhe mich aus.'] },
              { cells: ['sich treffen', 'يلتقي', 'Wir treffen uns um 8.'] },
              { cells: ['sich interessieren für', 'يهتم بـ', 'Ich interessiere mich für Musik.'] },
              { cells: ['sich fühlen', 'يشعر', 'Ich fühle mich gut.'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'الضمير المنعكس يأتي **بعد الفعل مباشرة** في الجملة الرئيسية.',
            example: 'Ich **wasche mich** jeden Morgen.',
            translation: 'أغتسل كل صباح.',
          },
          {
            rule: 'في السؤال: الضمير بعد الفاعل.',
            example: '**Wäscht du dich**?',
            translation: 'هل تغتسل؟',
          },
          {
            rule: 'بعض الأفعال تستخدم Dativ: sich die Hände waschen.',
            example: 'Ich wasche **mir** die Hände.',
            translation: 'أغسل يديّ. (لنفسي الأيدي)',
          },
        ],
        examples: [
          'Ich wasche mich jeden Morgen. — أغتسل كل صباح.',
          'Er ärgert sich über den Verkehr. — يغضب من الازدحام.',
          'Wir freuen uns auf das Wochenende. — نفرح بقدوم العطلة.',
          'Beeil dich, wir sind spät dran! — أسرع، نحن متأخرون!',
          'Ich interessiere mich für Fußball. — أهتم بكرة القدم.',
          'Wie fühlst du dich heute? — كيف تشعر اليوم؟',
          'Sie treffen sich um 19 Uhr. — يلتقون الساعة 7 مساءً.',
          'Ich muss mich ausruhen. — يجب أن أستريح.',
        ],
        tip: '💡 كثير من الأفعال المنعكسة بالألمانية ليست منعكسة بالعربية. مثلاً "sich freuen" (يفرح) لا يحتاج "نفسه" في العربية. احفظها مع sich كوحدة واحدة!',
      },
      vocabulary: [
        { german: 'sich waschen', arabic: 'يغتسل', example: 'Ich wasche mich.', exampleArabic: 'أغتسل.', type: 'verb' },
        { german: 'sich duschen', arabic: 'يستحم', example: 'Ich dusche mich.', exampleArabic: 'أستحم.', type: 'verb' },
        { german: 'sich anziehen', arabic: 'يرتدي', example: 'Ich ziehe mich an.', exampleArabic: 'أرتدي ملابسي.', type: 'verb' },
        { german: 'sich ausziehen', arabic: 'يخلع الملابس', example: 'Er zieht sich aus.', exampleArabic: 'يخلع ملابسه.', type: 'verb' },
        { german: 'sich umziehen', arabic: 'يغير ملابسه', example: 'Ich ziehe mich um.', exampleArabic: 'أغير ملابسي.', type: 'verb' },
        { german: 'sich rasieren', arabic: 'يحلق', example: 'Er rasiert sich.', exampleArabic: 'يحلق.', type: 'verb' },
        { german: 'sich kämmen', arabic: 'يمشط شعره', example: 'Ich kämme mich.', exampleArabic: 'أمشط شعري.', type: 'verb' },
        { german: 'sich freuen', arabic: 'يفرح', example: 'Ich freue mich!', exampleArabic: 'أنا مسرور!', type: 'verb' },
        { german: 'sich ärgern', arabic: 'يغضب', example: 'Er ärgert sich.', exampleArabic: 'هو غاضب.', type: 'verb' },
        { german: 'sich beeilen', arabic: 'يسرع', example: 'Beeil dich!', exampleArabic: 'أسرع!', type: 'verb' },
        { german: 'sich ausruhen', arabic: 'يستريح', example: 'Ich ruhe mich aus.', exampleArabic: 'أستريح.', type: 'verb' },
        { german: 'sich entspannen', arabic: 'يسترخي', example: 'Ich entspanne mich.', exampleArabic: 'أسترخي.', type: 'verb' },
        { german: 'sich treffen', arabic: 'يلتقي', example: 'Wir treffen uns.', exampleArabic: 'نلتقي.', type: 'verb' },
        { german: 'sich verabreden', arabic: 'يتواعد', example: 'Ich verabrede mich mit ihm.', exampleArabic: 'أتواعد معه.', type: 'verb' },
        { german: 'sich interessieren für', arabic: 'يهتم بـ', example: 'Ich interessiere mich für Kunst.', exampleArabic: 'أهتم بالفن.', type: 'verb' },
        { german: 'sich fühlen', arabic: 'يشعر', example: 'Wie fühlst du dich?', exampleArabic: 'كيف تشعر؟', type: 'verb' },
        { german: 'sich erinnern an', arabic: 'يتذكر', example: 'Ich erinnere mich an ihn.', exampleArabic: 'أتذكره.', type: 'verb' },
        { german: 'sich unterhalten', arabic: 'يتحدث / يسلّي نفسه', example: 'Wir unterhalten uns.', exampleArabic: 'نتحدث.', type: 'verb' },
        { german: 'sich verlieben', arabic: 'يقع في الحب', example: 'Sie verliebt sich.', exampleArabic: 'هي تقع في الحب.', type: 'verb' },
        { german: 'sich konzentrieren', arabic: 'يركز', example: 'Ich muss mich konzentrieren.', exampleArabic: 'يجب أن أركز.', type: 'verb' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a2-07-q1',
            question: 'أكمل: "Ich wasche ___ jeden Morgen."',
            answer: 'mich',
            hint: 'الضمير المنعكس لـ ich',
          },
          {
            type: 'multiple-choice', id: 'a2-07-q2',
            question: 'ما الضمير المنعكس لـ "er"؟',
            options: ['mich', 'dich', 'sich', 'ihm'],
            answer: 'sich',
          },
          {
            type: 'fill-blank', id: 'a2-07-q3',
            question: 'أكمل: "Wir freuen ___ auf den Urlaub." (نحن)',
            answer: 'uns',
          },
          {
            type: 'multiple-choice', id: 'a2-07-q4',
            question: 'ما معنى "Beeil dich!"؟',
            options: ['تعال!', 'أسرع!', 'تعلم!', 'افرح!'],
            answer: 'أسرع!',
          },
          {
            type: 'matching', id: 'a2-07-q5',
            question: 'اربط الضمير بالمنعكس:',
            pairs: [
              { left: 'ich', right: 'mich' },
              { left: 'du', right: 'dich' },
              { left: 'er', right: 'sich' },
              { left: 'wir', right: 'uns' },
              { left: 'ihr', right: 'euch' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-07-q6',
            question: 'رتّب: "أهتم بالموسيقى"',
            words: ['Ich', 'interessiere', 'mich', 'für', 'Musik'],
            answer: 'Ich interessiere mich für Musik',
          },
          {
            type: 'speaking', id: 'a2-07-q7',
            question: 'قل بالألمانية: "أشعر اليوم بتحسن"',
            answer: 'Ich fühle mich heute besser',
          },
          {
            type: 'fill-blank', id: 'a2-07-q8',
            question: 'استمع وأكمل: "Sie ärgert ___." (هي)',
            audioPrompt: 'Sie ärgert sich.',
            answer: 'sich',
          },
          {
            type: 'multiple-choice', id: 'a2-07-q9',
            question: 'أي جملة صحيحة؟',
            options: [
              'Er freut sich auf das Wochenende.',
              'Er freut auf das Wochenende sich.',
              'Er sich freut auf das Wochenende.',
              'Er freut mich auf das Wochenende.',
            ],
            answer: 'Er freut sich auf das Wochenende.',
          },
          {
            type: 'fill-blank', id: 'a2-07-q10',
            question: 'أكمل: "Ihr trefft ___ um 8 Uhr." (أنتم)',
            answer: 'euch',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 8 — Präteritum
    // ─────────────────────────────────────────────
    {
      id: 'a2-08',
      title: 'الماضي البسيط — Präteritum',
      order: 8,
      grammar: {
        title: 'الماضي البسيط — خاصة sein, haben والأفعال الناقصة',
        content: `**Präteritum** هو الماضي البسيط — يُستخدم في اللغة المكتوبة (الصحف، الكتب) وفي المحادثة مع أفعال معينة.

**الأفعال الأكثر استخداماً في Präteritum:**
- sein → war
- haben → hatte
- الأفعال الناقصة (können, müssen, wollen...)

للأفعال الأخرى، يُستخدم Perfekt في المحادثة.`,
        tables: [
          {
            title: 'sein و haben في Präteritum',
            headers: ['Pronomen', 'sein (war)', 'haben (hatte)'],
            rows: [
              { cells: ['ich', 'war', 'hatte'] },
              { cells: ['du', 'warst', 'hattest'] },
              { cells: ['er/sie/es', 'war', 'hatte'] },
              { cells: ['wir', 'waren', 'hatten'] },
              { cells: ['ihr', 'wart', 'hattet'] },
              { cells: ['sie/Sie', 'waren', 'hatten'] },
            ],
            theme: 'conjugation',
          },
          {
            title: 'الأفعال الناقصة في Präteritum',
            headers: ['Infinitiv', 'Präteritum', 'المعنى'],
            rows: [
              { cells: ['können', 'konnte', 'استطاع'] },
              { cells: ['müssen', 'musste', 'وجب عليه'] },
              { cells: ['wollen', 'wollte', 'أراد'] },
              { cells: ['dürfen', 'durfte', 'سُمح له'] },
              { cells: ['sollen', 'sollte', 'يُفترض'] },
              { cells: ['mögen', 'mochte', 'أحب'] },
            ],
            theme: 'conjugation',
            note: '⚠️ تصريف ich و er لها نفس الشكل (بدون نهاية).',
          },
          {
            title: 'تصريف الأفعال الناقصة في Präteritum',
            headers: ['Pronomen', 'können', 'müssen', 'wollen'],
            rows: [
              { cells: ['ich', 'konnte', 'musste', 'wollte'] },
              { cells: ['du', 'konntest', 'musstest', 'wolltest'] },
              { cells: ['er/sie/es', 'konnte', 'musste', 'wollte'] },
              { cells: ['wir', 'konnten', 'mussten', 'wollten'] },
              { cells: ['ihr', 'konntet', 'musstet', 'wolltet'] },
              { cells: ['sie/Sie', 'konnten', 'mussten', 'wollten'] },
            ],
            theme: 'conjugation',
          },
        ],
        rules: [
          {
            rule: 'في المحادثة اليومية: استخدم Präteritum فقط مع sein, haben, والأفعال الناقصة.',
            example: 'Ich **war** gestern krank. / Wir **hatten** keine Zeit.',
            translation: 'كنت مريضاً أمس. / لم يكن لدينا وقت.',
          },
          {
            rule: 'للأفعال الأخرى في المحادثة استخدم Perfekt.',
            example: '✅ Ich **habe** gegessen. ⚠️ Ich aß. (أدبي فقط)',
            translation: 'أكلت (أسلوب المحادثة / الكتابة الأدبية)',
          },
          {
            rule: 'Präteritum للأفعال الناقصة أبسط وأكثر طبيعية من Perfekt.',
            example: '✅ Ich **musste** arbeiten. ⚠️ Ich habe arbeiten müssen. (نادر)',
            translation: 'كان يجب أن أعمل.',
          },
        ],
        examples: [
          'Ich war gestern sehr müde. — كنت متعباً جداً أمس.',
          'Wir hatten ein schönes Wochenende. — كانت لدينا عطلة جميلة.',
          'Als Kind konnte ich nicht schwimmen. — كطفل، لم أستطع السباحة.',
          'Ich musste früh aufstehen. — كان عليّ الاستيقاظ مبكراً.',
          'Er wollte kommen, aber er war krank. — أراد المجيء، لكنه كان مريضاً.',
          'Wir durften nicht rauchen. — لم يُسمح لنا بالتدخين.',
          'Sie hatten viele Fragen. — كان لديهم كثير من الأسئلة.',
          'Warst du schon mal in Berlin? — هل سبق وكنت في برلين؟',
        ],
        tip: '💡 قاعدة 1-2-3 للماضي: لـ sein/haben/modal verbs → Präteritum (war, hatte, konnte). لكل الأفعال الأخرى في المحادثة → Perfekt (habe/bin + Partizip II). هذا يعمل 99% من الوقت!',
      },
      vocabulary: [
        { german: 'war', arabic: 'كان (sein)', example: 'Ich war dort.', exampleArabic: 'كنت هناك.', type: 'verb' },
        { german: 'hatte', arabic: 'كان لديه (haben)', example: 'Ich hatte Zeit.', exampleArabic: 'كان لدي وقت.', type: 'verb' },
        { german: 'konnte', arabic: 'استطاع (können)', example: 'Ich konnte nicht schlafen.', exampleArabic: 'لم أستطع النوم.', type: 'verb' },
        { german: 'musste', arabic: 'وجب (müssen)', example: 'Ich musste arbeiten.', exampleArabic: 'وجب أن أعمل.', type: 'verb' },
        { german: 'wollte', arabic: 'أراد (wollen)', example: 'Er wollte kommen.', exampleArabic: 'أراد المجيء.', type: 'verb' },
        { german: 'durfte', arabic: 'سُمح (dürfen)', example: 'Wir durften bleiben.', exampleArabic: 'سُمح لنا بالبقاء.', type: 'verb' },
        { german: 'sollte', arabic: 'يُفترض (sollen)', example: 'Du solltest kommen.', exampleArabic: 'كان عليك المجيء.', type: 'verb' },
        { german: 'mochte', arabic: 'أحب (mögen)', example: 'Ich mochte den Film.', exampleArabic: 'أحببت الفيلم.', type: 'verb' },
        { german: 'damals', arabic: 'في ذلك الوقت', example: 'Damals war ich jung.', exampleArabic: 'حينها كنت شاباً.', type: 'adverb' },
        { german: 'früher', arabic: 'سابقاً', example: 'Früher war alles anders.', exampleArabic: 'سابقاً كان كل شيء مختلفاً.', type: 'adverb' },
        { german: 'als Kind', arabic: 'كطفل', example: 'Als Kind war ich schüchtern.', exampleArabic: 'كطفل كنت خجولاً.', type: 'phrase' },
        { german: 'in der Schule', arabic: 'في المدرسة', example: 'In der Schule hatte ich gute Noten.', exampleArabic: 'في المدرسة كانت درجاتي جيدة.', type: 'phrase' },
        { german: 'Kindheit', arabic: 'الطفولة', gender: 'die', example: 'Meine Kindheit war schön.', exampleArabic: 'طفولتي كانت جميلة.', type: 'noun' },
        { german: 'Erinnerung', arabic: 'الذكرى', gender: 'die', plural: 'Erinnerungen', example: 'Schöne Erinnerungen.', exampleArabic: 'ذكريات جميلة.', type: 'noun' },
        { german: 'Vergangenheit', arabic: 'الماضي', gender: 'die', example: 'In der Vergangenheit...', exampleArabic: 'في الماضي...', type: 'noun' },
        { german: 'Leben', arabic: 'الحياة', gender: 'das', example: 'Das Leben ist schön.', exampleArabic: 'الحياة جميلة.', type: 'noun' },
        { german: 'Geschichte', arabic: 'القصة', gender: 'die', plural: 'Geschichten', example: 'Erzähl mir eine Geschichte.', exampleArabic: 'احكِ قصة.', type: 'noun' },
        { german: 'Schule', arabic: 'المدرسة', gender: 'die', plural: 'Schulen', example: 'Die Schule beginnt um 8.', exampleArabic: 'المدرسة تبدأ الساعة 8.', type: 'noun' },
        { german: 'krank / gesund', arabic: 'مريض / بصحة', example: 'Ich war krank.', exampleArabic: 'كنت مريضاً.', type: 'adjective' },
        { german: 'müde', arabic: 'متعب', example: 'Ich war sehr müde.', exampleArabic: 'كنت متعباً جداً.', type: 'adjective' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a2-08-q1',
            question: 'أكمل: "Ich ___ gestern krank." (كنت)',
            answer: 'war',
            hint: 'Präteritum من sein مع ich: war',
          },
          {
            type: 'multiple-choice', id: 'a2-08-q2',
            question: 'ما Präteritum من "haben" مع "wir"؟',
            options: ['haben', 'hatte', 'hatten', 'hattet'],
            answer: 'hatten',
          },
          {
            type: 'fill-blank', id: 'a2-08-q3',
            question: 'أكمل: "Er ___ nicht kommen." (لم يستطع — können)',
            answer: 'konnte',
          },
          {
            type: 'multiple-choice', id: 'a2-08-q4',
            question: 'أي صيغة أكثر طبيعية في المحادثة؟',
            options: [
              'Ich habe arbeiten müssen.',
              'Ich musste arbeiten.',
              'Ich muss gearbeitet.',
              'Ich war arbeiten.',
            ],
            answer: 'Ich musste arbeiten.',
          },
          {
            type: 'matching', id: 'a2-08-q5',
            question: 'اربط المصدر بـ Präteritum (ich):',
            pairs: [
              { left: 'sein', right: 'war' },
              { left: 'haben', right: 'hatte' },
              { left: 'können', right: 'konnte' },
              { left: 'müssen', right: 'musste' },
              { left: 'wollen', right: 'wollte' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-08-q6',
            question: 'رتّب: "كطفل لم أستطع السباحة"',
            words: ['Als', 'Kind', 'konnte', 'ich', 'nicht', 'schwimmen'],
            answer: 'Als Kind konnte ich nicht schwimmen',
          },
          {
            type: 'speaking', id: 'a2-08-q7',
            question: 'قل بالألمانية: "كان لدي اجتماع مهم أمس"',
            answer: 'Ich hatte gestern einen wichtigen Termin',
          },
          {
            type: 'fill-blank', id: 'a2-08-q8',
            question: 'استمع وأكمل: "Wir ___ in Berlin." (كنا)',
            audioPrompt: 'Wir waren in Berlin.',
            answer: 'waren',
          },
          {
            type: 'multiple-choice', id: 'a2-08-q9',
            question: 'ما معنى "Ich durfte nicht ausgehen"؟',
            options: [
              'لم أستطع الخروج.',
              'لم أرد الخروج.',
              'لم يُسمح لي بالخروج.',
              'كان عليّ الخروج.',
            ],
            answer: 'لم يُسمح لي بالخروج.',
          },
          {
            type: 'fill-blank', id: 'a2-08-q10',
            question: 'أكمل: "Du ___ gestern müde." (كنت متعباً — sein / du)',
            answer: 'warst',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 9 — السفر والمواصلات
    // ─────────────────────────────────────────────
    {
      id: 'a2-09',
      title: 'السفر والمواصلات — Reisen und Verkehr',
      order: 9,
      grammar: {
        title: 'Futur I + شراء تذاكر + سؤال عن الاتجاهات',
        content: `**Futur I** (المستقبل) = werden + Infinitiv (في النهاية)

→ Ich **werde** morgen nach Berlin **fahren**.

**ملاحظة:** غالباً في الألمانية نستخدم **Präsens + ظرف مستقبلي** بدلاً من Futur I.
→ Ich fahre morgen. ✅ (أبسط وأكثر استخداماً)`,
        tables: [
          {
            title: 'تصريف werden',
            headers: ['Pronomen', 'werden', 'مثال'],
            rows: [
              { cells: ['ich', 'werde', 'Ich werde gehen.'] },
              { cells: ['du', 'wirst', 'Du wirst kommen.'] },
              { cells: ['er/sie/es', 'wird', 'Er wird arbeiten.'] },
              { cells: ['wir', 'werden', 'Wir werden reisen.'] },
              { cells: ['ihr', 'werdet', 'Ihr werdet lernen.'] },
              { cells: ['sie/Sie', 'werden', 'Sie werden fliegen.'] },
            ],
            theme: 'conjugation',
          },
          {
            title: 'وسائل النقل',
            headers: ['Verkehrsmittel', 'العربية', 'مع حرف الجر'],
            rows: [
              { cells: ['das Auto', 'السيارة', 'mit dem Auto'] },
              { cells: ['der Bus', 'الحافلة', 'mit dem Bus'] },
              { cells: ['der Zug', 'القطار', 'mit dem Zug'] },
              { cells: ['die Bahn', 'السكة الحديدية', 'mit der Bahn'] },
              { cells: ['das Flugzeug', 'الطائرة', 'mit dem Flugzeug'] },
              { cells: ['das Fahrrad', 'الدراجة', 'mit dem Fahrrad'] },
              { cells: ['die U-Bahn', 'المترو', 'mit der U-Bahn'] },
              { cells: ['das Taxi', 'التاكسي', 'mit dem Taxi'] },
              { cells: ['zu Fuß', 'مشياً', '(بدون حرف جر)'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'Futur I = werden (المكان الثاني) + Infinitiv (النهاية).',
            example: 'Ich **werde** nächstes Jahr nach Marokko **fliegen**.',
            translation: 'سأطير إلى المغرب العام القادم.',
          },
          {
            rule: 'في المحادثة اليومية، Präsens + ظرف مستقبلي أكثر شيوعاً.',
            example: 'Morgen **fahre** ich nach Köln. (= Ich werde morgen nach Köln fahren.)',
            translation: 'غداً سأذهب إلى كولونيا.',
          },
          {
            rule: 'mit + Dativ لوسائل النقل، aber zu Fuß بدون حرف جر.',
            example: 'Ich fahre **mit dem** Bus. / Ich gehe **zu Fuß**.',
            translation: 'أذهب بالحافلة. / أمشي.',
          },
        ],
        examples: [
          'Ich werde nächste Woche nach Deutschland fliegen. — سأطير إلى ألمانيا الأسبوع القادم.',
          'Der Zug fährt um 14:30 ab. — القطار ينطلق الساعة 2:30.',
          'Wann kommt der Bus? — متى تأتي الحافلة؟',
          'Eine Fahrkarte nach München, bitte. — تذكرة إلى ميونخ من فضلك.',
          'Wie lange dauert die Reise? — كم تستغرق الرحلة؟',
          'Ich muss in Köln umsteigen. — يجب أن أغير القطار في كولونيا.',
          'Wo ist der Bahnhof? — أين المحطة؟',
          'Fährt dieser Bus zum Zentrum? — هل تذهب هذه الحافلة إلى المركز؟',
        ],
        tip: '💡 تذاكر القطار الألمانية (Deutsche Bahn / DB): ابحث عن "Sparpreis" (التذكرة الرخيصة) و"BahnCard" (بطاقة خصم). التطبيق "DB Navigator" ممتاز للبحث عن الرحلات.',
      },
      vocabulary: [
        { german: 'Zug', arabic: 'القطار', gender: 'der', plural: 'Züge', example: 'Der Zug kommt.', exampleArabic: 'القطار آتٍ.', type: 'noun' },
        { german: 'Bus', arabic: 'الحافلة', gender: 'der', plural: 'Busse', example: 'Der Bus ist voll.', exampleArabic: 'الحافلة ممتلئة.', type: 'noun' },
        { german: 'Bahn', arabic: 'السكة الحديدية', gender: 'die', plural: 'Bahnen', example: 'Die Bahn ist pünktlich.', exampleArabic: 'القطار في وقته.', type: 'noun' },
        { german: 'U-Bahn', arabic: 'المترو', gender: 'die', plural: 'U-Bahnen', example: 'Ich nehme die U-Bahn.', exampleArabic: 'آخذ المترو.', type: 'noun' },
        { german: 'Straßenbahn', arabic: 'الترام', gender: 'die', plural: 'Straßenbahnen', example: 'Die Straßenbahn fährt.', exampleArabic: 'الترام يسير.', type: 'noun' },
        { german: 'Flugzeug', arabic: 'الطائرة', gender: 'das', plural: 'Flugzeuge', example: 'Das Flugzeug landet.', exampleArabic: 'الطائرة تهبط.', type: 'noun' },
        { german: 'Fahrrad', arabic: 'الدراجة', gender: 'das', plural: 'Fahrräder', example: 'Mein Fahrrad ist kaputt.', exampleArabic: 'دراجتي خربانة.', type: 'noun' },
        { german: 'Taxi', arabic: 'التاكسي', gender: 'das', plural: 'Taxis', example: 'Ich rufe ein Taxi.', exampleArabic: 'أستدعي تاكسي.', type: 'noun' },
        { german: 'Bahnhof', arabic: 'المحطة', gender: 'der', plural: 'Bahnhöfe', example: 'Am Bahnhof treffen wir uns.', exampleArabic: 'نلتقي في المحطة.', type: 'noun' },
        { german: 'Flughafen', arabic: 'المطار', gender: 'der', plural: 'Flughäfen', example: 'Der Flughafen ist weit.', exampleArabic: 'المطار بعيد.', type: 'noun' },
        { german: 'Haltestelle', arabic: 'المحطة (حافلة)', gender: 'die', plural: 'Haltestellen', example: 'Die Haltestelle ist da.', exampleArabic: 'المحطة هناك.', type: 'noun' },
        { german: 'Fahrkarte / Ticket', arabic: 'التذكرة', gender: 'die', plural: 'Fahrkarten', example: 'Eine Fahrkarte, bitte.', exampleArabic: 'تذكرة من فضلك.', type: 'noun' },
        { german: 'Reise', arabic: 'الرحلة', gender: 'die', plural: 'Reisen', example: 'Gute Reise!', exampleArabic: 'رحلة سعيدة!', type: 'noun' },
        { german: 'Urlaub', arabic: 'العطلة', gender: 'der', plural: 'Urlaube', example: 'Ich fahre in Urlaub.', exampleArabic: 'أذهب في عطلة.', type: 'noun' },
        { german: 'Koffer', arabic: 'الحقيبة', gender: 'der', plural: 'Koffer', example: 'Mein Koffer ist schwer.', exampleArabic: 'حقيبتي ثقيلة.', type: 'noun' },
        { german: 'fahren', arabic: 'يسافر / يذهب بمركبة', example: 'Ich fahre nach Köln.', exampleArabic: 'أذهب إلى كولونيا.', type: 'verb' },
        { german: 'fliegen', arabic: 'يطير', example: 'Wir fliegen morgen.', exampleArabic: 'نطير غداً.', type: 'verb' },
        { german: 'abfahren', arabic: 'ينطلق / يغادر', example: 'Der Zug fährt ab.', exampleArabic: 'القطار يغادر.', type: 'verb' },
        { german: 'ankommen', arabic: 'يصل', example: 'Wann kommst du an?', exampleArabic: 'متى تصل؟', type: 'verb' },
        { german: 'umsteigen', arabic: 'يغيّر وسيلة النقل', example: 'Ich steige in Frankfurt um.', exampleArabic: 'أغير في فرانكفورت.', type: 'verb' },
        { german: 'werden', arabic: 'سيكون / سوف', example: 'Ich werde kommen.', exampleArabic: 'سآتي.', type: 'verb' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a2-09-q1',
            question: 'أكمل: "Ich ___ morgen nach Berlin fahren." (werden مع ich)',
            answer: 'werde',
          },
          {
            type: 'multiple-choice', id: 'a2-09-q2',
            question: 'كيف تقول "أذهب بالحافلة"؟',
            options: ['Ich fahre in Bus.', 'Ich fahre mit dem Bus.', 'Ich fahre bei Bus.', 'Ich fahre auf Bus.'],
            answer: 'Ich fahre mit dem Bus.',
          },
          {
            type: 'fill-blank', id: 'a2-09-q3',
            question: 'أكمل: "Eine ___ nach München, bitte." (تذكرة)',
            answer: 'Fahrkarte',
          },
          {
            type: 'multiple-choice', id: 'a2-09-q4',
            question: 'ما معنى "umsteigen"؟',
            options: ['ينزل', 'يصعد', 'يغيّر (القطار)', 'يصل'],
            answer: 'يغيّر (القطار)',
          },
          {
            type: 'matching', id: 'a2-09-q5',
            question: 'اربط وسيلة النقل بمعناها:',
            pairs: [
              { left: 'Zug', right: 'قطار' },
              { left: 'Bus', right: 'حافلة' },
              { left: 'Flugzeug', right: 'طائرة' },
              { left: 'Fahrrad', right: 'دراجة' },
              { left: 'U-Bahn', right: 'مترو' },
              { left: 'Taxi', right: 'تاكسي' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-09-q6',
            question: 'رتّب: "سأطير إلى المغرب الأسبوع القادم"',
            words: ['Ich', 'werde', 'nächste', 'Woche', 'nach', 'Marokko', 'fliegen'],
            answer: 'Ich werde nächste Woche nach Marokko fliegen',
          },
          {
            type: 'speaking', id: 'a2-09-q7',
            question: 'قل بالألمانية: "متى ينطلق القطار إلى هامبورغ؟"',
            answer: 'Wann fährt der Zug nach Hamburg ab',
          },
          {
            type: 'fill-blank', id: 'a2-09-q8',
            question: 'استمع وأكمل: "Der Zug ___ um 14 Uhr ab." (ينطلق)',
            audioPrompt: 'Der Zug fährt um 14 Uhr ab.',
            answer: 'fährt',
          },
          {
            type: 'multiple-choice', id: 'a2-09-q9',
            question: 'كيف تسأل "كم تستغرق الرحلة؟"',
            options: [
              'Wo ist die Reise?',
              'Wann ist die Reise?',
              'Wie lange dauert die Reise?',
              'Wie teuer ist die Reise?',
            ],
            answer: 'Wie lange dauert die Reise?',
          },
          {
            type: 'fill-blank', id: 'a2-09-q10',
            question: 'أكمل: "Ich gehe ___ Fuß." (مشياً)',
            answer: 'zu',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 10 — الطقس والمواسم
    // ─────────────────────────────────────────────
    {
      id: 'a2-10',
      title: 'الطقس والمواسم — Wetter und Jahreszeiten',
      order: 10,
      grammar: {
        title: 'عبارات الطقس + es + الفصول والأنشطة',
        content: `في الألمانية نستخدم كثيراً الضمير **es** للحديث عن الطقس.

→ **Es** regnet. (تمطر)
→ **Es** ist kalt. (الجو بارد)
→ **Es** schneit. (تثلج)

**ملاحظة:** es هنا "فاعل وهمي" لا يشير إلى شيء محدد.`,
        tables: [
          {
            title: 'عبارات الطقس الأساسية',
            headers: ['Deutsch', 'العربية'],
            rows: [
              { cells: ['Es ist sonnig.', 'الجو مشمس.'] },
              { cells: ['Es ist bewölkt.', 'الجو غائم.'] },
              { cells: ['Es regnet.', 'تمطر.'] },
              { cells: ['Es schneit.', 'تثلج.'] },
              { cells: ['Es ist windig.', 'عاصف.'] },
              { cells: ['Es ist neblig.', 'ضبابي.'] },
              { cells: ['Es ist heiß.', 'الجو حار.'] },
              { cells: ['Es ist kalt.', 'الجو بارد.'] },
              { cells: ['Es ist warm.', 'دافئ.'] },
              { cells: ['Es ist schön.', 'الجو جميل.'] },
            ],
            theme: 'default',
          },
          {
            title: 'الفصول الأربعة مع أنشطة',
            headers: ['Jahreszeit', 'الترجمة', 'Aktivität'],
            rows: [
              { cells: ['der Frühling', 'الربيع', 'Ich gehe spazieren.'] },
              { cells: ['der Sommer', 'الصيف', 'Wir schwimmen im Meer.'] },
              { cells: ['der Herbst', 'الخريف', 'Ich trinke heißen Tee.'] },
              { cells: ['der Winter', 'الشتاء', 'Wir fahren Ski.'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'es يُستخدم كفاعل وهمي للطقس والوقت.',
            example: '**Es** ist 20 Grad. / **Es** regnet stark.',
            translation: 'الحرارة 20 درجة. / تمطر بقوة.',
          },
          {
            rule: 'درجات الحرارة: الرقم + Grad.',
            example: 'Heute ist es **30 Grad**. / Minus 5 Grad im Winter.',
            translation: 'اليوم 30 درجة. / -5 درجات في الشتاء.',
          },
          {
            rule: 'مع الفصول: im + الفصل.',
            example: '**Im** Sommer fahren wir ans Meer.',
            translation: 'في الصيف نذهب إلى البحر.',
          },
        ],
        examples: [
          'Heute ist das Wetter schön. — اليوم الجو جميل.',
          'Wie wird das Wetter morgen? — كيف سيكون الجو غداً؟',
          'Es regnet den ganzen Tag. — تمطر طوال اليوم.',
          'Im Sommer ist es sehr heiß. — في الصيف الجو حار جداً.',
          'Im Winter schneit es oft. — في الشتاء تثلج كثيراً.',
          'Die Temperatur ist heute 25 Grad. — الحرارة اليوم 25 درجة.',
          'Nimm einen Regenschirm mit! — خذ مظلة معك!',
          'Ich mag den Frühling am liebsten. — أحب الربيع أكثر شيء.',
        ],
        tip: '💡 الطقس في ألمانيا متقلب جداً! راجع تطبيقات مثل "Wetter.com" أو "DWD WarnWetter" قبل الخروج. الأيام الماطرة كثيرة، فاحتفظ بـ Regenschirm (مظلة) دائماً في حقيبتك.',
      },
      vocabulary: [
        { german: 'Wetter', arabic: 'الطقس', gender: 'das', example: 'Das Wetter ist schön.', exampleArabic: 'الطقس جميل.', type: 'noun' },
        { german: 'Temperatur', arabic: 'الحرارة', gender: 'die', plural: 'Temperaturen', example: 'Die Temperatur ist 20 Grad.', exampleArabic: 'الحرارة 20.', type: 'noun' },
        { german: 'Grad', arabic: 'درجة', gender: 'das', example: '25 Grad Celsius.', exampleArabic: '25 درجة.', type: 'noun' },
        { german: 'Sonne', arabic: 'الشمس', gender: 'die', example: 'Die Sonne scheint.', exampleArabic: 'الشمس مشرقة.', type: 'noun' },
        { german: 'Regen', arabic: 'المطر', gender: 'der', example: 'Der Regen ist stark.', exampleArabic: 'المطر غزير.', type: 'noun' },
        { german: 'Schnee', arabic: 'الثلج', gender: 'der', example: 'Der Schnee ist weiß.', exampleArabic: 'الثلج أبيض.', type: 'noun' },
        { german: 'Wind', arabic: 'الريح', gender: 'der', plural: 'Winde', example: 'Der Wind weht.', exampleArabic: 'الريح تهب.', type: 'noun' },
        { german: 'Wolke', arabic: 'السحابة', gender: 'die', plural: 'Wolken', example: 'Viele Wolken am Himmel.', exampleArabic: 'سحب كثيرة في السماء.', type: 'noun' },
        { german: 'Nebel', arabic: 'الضباب', gender: 'der', example: 'Der Nebel ist dick.', exampleArabic: 'الضباب كثيف.', type: 'noun' },
        { german: 'Himmel', arabic: 'السماء', gender: 'der', example: 'Der Himmel ist blau.', exampleArabic: 'السماء زرقاء.', type: 'noun' },
        { german: 'Gewitter', arabic: 'العاصفة الرعدية', gender: 'das', plural: 'Gewitter', example: 'Es gibt ein Gewitter.', exampleArabic: 'هناك عاصفة.', type: 'noun' },
        { german: 'Regenschirm', arabic: 'المظلة', gender: 'der', plural: 'Regenschirme', example: 'Nimm deinen Regenschirm!', exampleArabic: 'خذ مظلتك!', type: 'noun' },
        { german: 'Frühling', arabic: 'الربيع', gender: 'der', example: 'Im Frühling blühen Blumen.', exampleArabic: 'في الربيع تزهر الورود.', type: 'noun' },
        { german: 'Sommer', arabic: 'الصيف', gender: 'der', example: 'Im Sommer ist es heiß.', exampleArabic: 'في الصيف الجو حار.', type: 'noun' },
        { german: 'Herbst', arabic: 'الخريف', gender: 'der', example: 'Der Herbst ist bunt.', exampleArabic: 'الخريف ملون.', type: 'noun' },
        { german: 'Winter', arabic: 'الشتاء', gender: 'der', example: 'Der Winter ist kalt.', exampleArabic: 'الشتاء بارد.', type: 'noun' },
        { german: 'regnen', arabic: 'تمطر', example: 'Es regnet.', exampleArabic: 'تمطر.', type: 'verb' },
        { german: 'schneien', arabic: 'تثلج', example: 'Es schneit.', exampleArabic: 'تثلج.', type: 'verb' },
        { german: 'scheinen', arabic: 'يشرق', example: 'Die Sonne scheint.', exampleArabic: 'الشمس تشرق.', type: 'verb' },
        { german: 'sonnig / bewölkt', arabic: 'مشمس / غائم', example: 'Heute ist es sonnig.', exampleArabic: 'اليوم مشمس.', type: 'adjective' },
        { german: 'kalt / heiß / warm', arabic: 'بارد / حار / دافئ', example: 'Es ist sehr heiß!', exampleArabic: 'الجو حار جداً!', type: 'adjective' },
        { german: 'nass / trocken', arabic: 'مبلل / جاف', example: 'Meine Schuhe sind nass.', exampleArabic: 'حذائي مبلل.', type: 'adjective' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a2-10-q1',
            question: 'أكمل: "___ regnet heute." (تمطر)',
            answer: 'Es',
            hint: 'ضمير الطقس = es',
          },
          {
            type: 'multiple-choice', id: 'a2-10-q2',
            question: 'ما معنى "Es schneit"؟',
            options: ['تمطر.', 'تثلج.', 'مشمس.', 'عاصف.'],
            answer: 'تثلج.',
          },
          {
            type: 'fill-blank', id: 'a2-10-q3',
            question: 'أكمل: "___ Sommer ist es heiß." (في الصيف)',
            answer: 'Im',
          },
          {
            type: 'multiple-choice', id: 'a2-10-q4',
            question: 'كيف تقول "الجو بارد جداً"؟',
            options: ['Es ist zu heiß.', 'Es ist sehr kalt.', 'Es ist sehr warm.', 'Es ist windig.'],
            answer: 'Es ist sehr kalt.',
          },
          {
            type: 'matching', id: 'a2-10-q5',
            question: 'اربط الكلمة بمعناها:',
            pairs: [
              { left: 'Regen', right: 'مطر' },
              { left: 'Schnee', right: 'ثلج' },
              { left: 'Sonne', right: 'شمس' },
              { left: 'Wind', right: 'ريح' },
              { left: 'Wolke', right: 'سحابة' },
              { left: 'Nebel', right: 'ضباب' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-10-q6',
            question: 'رتّب: "في الشتاء تثلج كثيراً"',
            words: ['Im', 'Winter', 'schneit', 'es', 'oft'],
            answer: 'Im Winter schneit es oft',
          },
          {
            type: 'speaking', id: 'a2-10-q7',
            question: 'قل بالألمانية: "اليوم الحرارة 25 درجة"',
            answer: 'Heute ist es fünfundzwanzig Grad',
          },
          {
            type: 'fill-blank', id: 'a2-10-q8',
            question: 'استمع وأكمل: "Die ___ scheint heute." (الشمس)',
            audioPrompt: 'Die Sonne scheint heute.',
            answer: 'Sonne',
          },
          {
            type: 'multiple-choice', id: 'a2-10-q9',
            question: 'كيف تسأل عن الطقس غداً؟',
            options: [
              'Wie ist das Wetter?',
              'Was ist das Wetter?',
              'Wie wird das Wetter morgen?',
              'Wann ist das Wetter morgen?',
            ],
            answer: 'Wie wird das Wetter morgen?',
          },
          {
            type: 'fill-blank', id: 'a2-10-q10',
            question: 'أكمل: "Nimm einen ___ mit!" (مظلة)',
            answer: 'Regenschirm',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 11 — الصحة والحياة اليومية المتقدمة
    // ─────────────────────────────────────────────
    {
      id: 'a2-11',
      title: 'الصحة والطعام — Gesundheit und Ernährung',
      order: 11,
      grammar: {
        title: 'الأمر مع Sie / du + ينصح / يجب',
        content: `عندما نقدم نصائح صحية، نستخدم:
- **الأمر (Imperativ)** للأصدقاء و العائلة
- **sollten** للنصائح العامة
- **müssen** للضرورة`,
        tables: [
          {
            title: 'صيغة الأمر — du vs Sie',
            headers: ['Verb', 'du (غير رسمي)', 'Sie (رسمي)'],
            rows: [
              { cells: ['essen', 'Iss mehr Obst!', 'Essen Sie mehr Obst!'] },
              { cells: ['trinken', 'Trink viel Wasser!', 'Trinken Sie viel Wasser!'] },
              { cells: ['machen', 'Mach Sport!', 'Machen Sie Sport!'] },
              { cells: ['schlafen', 'Schlaf früh!', 'Schlafen Sie früh!'] },
              { cells: ['gehen', 'Geh spazieren!', 'Gehen Sie spazieren!'] },
              { cells: ['sein', 'Sei vorsichtig!', 'Seien Sie vorsichtig!'] },
            ],
            theme: 'conjugation',
          },
          {
            title: 'sollten للنصائح',
            headers: ['Pronomen', 'sollten', 'مثال'],
            rows: [
              { cells: ['ich', 'sollte', 'Ich sollte mehr schlafen.'] },
              { cells: ['du', 'solltest', 'Du solltest weniger Zucker essen.'] },
              { cells: ['er/sie/es', 'sollte', 'Er sollte zum Arzt gehen.'] },
              { cells: ['wir', 'sollten', 'Wir sollten gesund essen.'] },
            ],
            theme: 'conjugation',
            note: 'sollten = Konjunktiv II = "يُفترض أن / من الأفضل أن"',
          },
        ],
        rules: [
          {
            rule: 'صيغة الأمر لـ du: جذر الفعل (بدون نهاية) + !',
            example: '**Trink** viel Wasser! / **Iss** weniger Süßes!',
            translation: 'اشرب كثيراً من الماء! / كل أقل من الحلويات!',
          },
          {
            rule: 'Sie-Form: الفعل + Sie + !',
            example: '**Gehen Sie** zum Arzt! / **Nehmen Sie** die Tabletten!',
            translation: 'اذهب للطبيب! / خذ الأقراص!',
          },
          {
            rule: 'sollten + Infinitiv للنصائح الخفيفة.',
            example: 'Du **solltest** mehr Gemüse **essen**.',
            translation: 'يُفترض أن تأكل خضار أكثر.',
          },
        ],
        examples: [
          'Du solltest mehr Obst essen. — من الأفضل أن تأكل فواكه أكثر.',
          'Trink mindestens 2 Liter Wasser pro Tag. — اشرب على الأقل 2 لتر ماء يومياً.',
          'Sie müssen zum Arzt gehen. — يجب أن تذهب للطبيب.',
          'Geh spazieren, das ist gesund! — اذهب للمشي، هذا صحي!',
          'Iss nicht so viel Zucker! — لا تأكل كثيراً من السكر!',
          'Ich habe Kopfschmerzen. — لدي صداع.',
          'Wie oft treiben Sie Sport? — كم مرة تمارس الرياضة؟',
          'Rauchen ist ungesund. — التدخين غير صحي.',
        ],
        tip: '💡 في النظام الصحي الألماني، التأمين الصحي (Krankenversicherung) إجباري. احتفظ ببطاقتك (Gesundheitskarte) دائماً. لحجز موعد طبيب: "Ich möchte einen Termin vereinbaren".',
      },
      vocabulary: [
        { german: 'Gesundheit', arabic: 'الصحة', gender: 'die', example: 'Auf deine Gesundheit!', exampleArabic: 'بصحتك!', type: 'noun' },
        { german: 'gesund / ungesund', arabic: 'صحي / غير صحي', example: 'Obst ist gesund.', exampleArabic: 'الفواكه صحية.', type: 'adjective' },
        { german: 'Ernährung', arabic: 'التغذية', gender: 'die', example: 'Gesunde Ernährung!', exampleArabic: 'تغذية صحية!', type: 'noun' },
        { german: 'Obst', arabic: 'الفواكه', gender: 'das', example: 'Iss viel Obst!', exampleArabic: 'كل الكثير من الفواكه!', type: 'noun' },
        { german: 'Gemüse', arabic: 'الخضار', gender: 'das', example: 'Gemüse ist gesund.', exampleArabic: 'الخضار صحية.', type: 'noun' },
        { german: 'Fleisch', arabic: 'اللحم', gender: 'das', example: 'Ich esse kein Fleisch.', exampleArabic: 'لا آكل لحماً.', type: 'noun' },
        { german: 'Fisch', arabic: 'السمك', gender: 'der', plural: 'Fische', example: 'Der Fisch ist frisch.', exampleArabic: 'السمك طازج.', type: 'noun' },
        { german: 'Milch', arabic: 'الحليب', gender: 'die', example: 'Ein Glas Milch.', exampleArabic: 'كأس حليب.', type: 'noun' },
        { german: 'Käse', arabic: 'الجبن', gender: 'der', plural: 'Käsesorten', example: 'Ich mag Käse.', exampleArabic: 'أحب الجبن.', type: 'noun' },
        { german: 'Zucker', arabic: 'السكر', gender: 'der', example: 'Zu viel Zucker ist ungesund.', exampleArabic: 'السكر الكثير غير صحي.', type: 'noun' },
        { german: 'Salz', arabic: 'الملح', gender: 'das', example: 'Etwas Salz, bitte.', exampleArabic: 'بعض الملح من فضلك.', type: 'noun' },
        { german: 'Sport', arabic: 'الرياضة', gender: 'der', example: 'Ich mache Sport.', exampleArabic: 'أمارس الرياضة.', type: 'noun' },
        { german: 'Krankheit', arabic: 'المرض', gender: 'die', plural: 'Krankheiten', example: 'Eine ernste Krankheit.', exampleArabic: 'مرض خطير.', type: 'noun' },
        { german: 'Erkältung', arabic: 'نزلة البرد', gender: 'die', plural: 'Erkältungen', example: 'Ich habe eine Erkältung.', exampleArabic: 'لدي نزلة برد.', type: 'noun' },
        { german: 'Fieber', arabic: 'الحمى', gender: 'das', example: 'Ich habe Fieber.', exampleArabic: 'لدي حمى.', type: 'noun' },
        { german: 'Husten', arabic: 'السعال', gender: 'der', example: 'Ich habe Husten.', exampleArabic: 'لدي سعال.', type: 'noun' },
        { german: 'Schnupfen', arabic: 'الزكام', gender: 'der', example: 'Ich habe Schnupfen.', exampleArabic: 'لدي زكام.', type: 'noun' },
        { german: 'essen', arabic: 'يأكل', example: 'Iss mehr Obst!', exampleArabic: 'كل فواكه أكثر!', type: 'verb' },
        { german: 'trinken', arabic: 'يشرب', example: 'Trink viel Wasser!', exampleArabic: 'اشرب الكثير من الماء!', type: 'verb' },
        { german: 'rauchen', arabic: 'يدخن', example: 'Rauchen verboten!', exampleArabic: 'ممنوع التدخين!', type: 'verb' },
        { german: 'sollten', arabic: 'يُفترض أن', example: 'Du solltest schlafen.', exampleArabic: 'عليك أن تنام.', type: 'verb' },
        { german: 'vegetarisch / vegan', arabic: 'نباتي / صارم نباتي', example: 'Ich bin Vegetarier.', exampleArabic: 'أنا نباتي.', type: 'adjective' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a2-11-q1',
            question: 'أكمل: "Du ___ mehr Wasser trinken." (يجب عليك — نصيحة)',
            answer: 'solltest',
            hint: 'sollen → solltest مع du',
          },
          {
            type: 'multiple-choice', id: 'a2-11-q2',
            question: 'كيف تقول "اشرب كثيراً!" لصديق (du)؟',
            options: ['Trinken du viel!', 'Trink viel!', 'Du trinken viel!', 'Trinke du viel!'],
            answer: 'Trink viel!',
          },
          {
            type: 'fill-blank', id: 'a2-11-q3',
            question: 'أكمل: "___ Sie zum Arzt!" (اذهب — رسمي)',
            answer: 'Gehen',
          },
          {
            type: 'multiple-choice', id: 'a2-11-q4',
            question: 'ما معنى "Rauchen ist ungesund"؟',
            options: [
              'التدخين صحي.',
              'التدخين ممنوع.',
              'التدخين غير صحي.',
              'التدخين مسموح.',
            ],
            answer: 'التدخين غير صحي.',
          },
          {
            type: 'matching', id: 'a2-11-q5',
            question: 'اربط الطعام بمعناه:',
            pairs: [
              { left: 'Obst', right: 'فواكه' },
              { left: 'Gemüse', right: 'خضار' },
              { left: 'Fleisch', right: 'لحم' },
              { left: 'Fisch', right: 'سمك' },
              { left: 'Käse', right: 'جبن' },
              { left: 'Milch', right: 'حليب' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-11-q6',
            question: 'رتّب: "يجب أن تأكل خضار أكثر"',
            words: ['Du', 'solltest', 'mehr', 'Gemüse', 'essen'],
            answer: 'Du solltest mehr Gemüse essen',
          },
          {
            type: 'speaking', id: 'a2-11-q7',
            question: 'قل بالألمانية: "أمارس الرياضة ثلاث مرات في الأسبوع"',
            answer: 'Ich mache dreimal pro Woche Sport',
          },
          {
            type: 'fill-blank', id: 'a2-11-q8',
            question: 'استمع وأكمل: "Ich habe ___." (نزلة برد)',
            audioPrompt: 'Ich habe eine Erkältung.',
            answer: 'eine Erkältung',
          },
          {
            type: 'multiple-choice', id: 'a2-11-q9',
            question: 'ما الأمر الصحيح لـ sein مع Sie؟',
            options: ['Sei!', 'Bist Sie!', 'Seien Sie!', 'Sein Sie!'],
            answer: 'Seien Sie!',
          },
          {
            type: 'fill-blank', id: 'a2-11-q10',
            question: 'أكمل: "Sie müssen zum ___ gehen." (الطبيب)',
            answer: 'Arzt',
          },
        ],
      },
    },

    // ─────────────────────────────────────────────
    // LESSON 12 — مراجعة + محادثات يومية
    // ─────────────────────────────────────────────
    {
      id: 'a2-12',
      title: 'مراجعة ومحادثات — Wiederholung und Kommunikation',
      order: 12,
      grammar: {
        title: 'مراجعة شاملة + التعبير عن الرأي والمشاعر',
        content: `في هذا الدرس نراجع أهم مهارات A2 ونتعلم كيف نعبّر عن:
- **الرأي:** Ich finde... / Meiner Meinung nach...
- **الموافقة والرفض:** Ich bin einverstanden / Ich bin dagegen
- **المشاعر:** Ich bin glücklich / traurig / überrascht`,
        tables: [
          {
            title: 'عبارات التعبير عن الرأي',
            headers: ['Deutsch', 'العربية'],
            rows: [
              { cells: ['Ich finde, dass...', 'أجد أن...'] },
              { cells: ['Meiner Meinung nach...', 'في رأيي...'] },
              { cells: ['Ich denke / Ich glaube...', 'أعتقد...'] },
              { cells: ['Das stimmt.', 'هذا صحيح.'] },
              { cells: ['Das stimmt nicht.', 'هذا غير صحيح.'] },
              { cells: ['Ich bin einverstanden.', 'أنا موافق.'] },
              { cells: ['Ich bin dagegen.', 'أنا ضد ذلك.'] },
              { cells: ['Vielleicht hast du Recht.', 'ربما أنت محق.'] },
            ],
            theme: 'default',
          },
          {
            title: 'التعبير عن المشاعر',
            headers: ['Gefühl', 'العربية', 'مثال'],
            rows: [
              { cells: ['glücklich', 'سعيد', 'Ich bin glücklich.'] },
              { cells: ['traurig', 'حزين', 'Warum bist du traurig?'] },
              { cells: ['müde', 'متعب', 'Ich bin sehr müde.'] },
              { cells: ['überrascht', 'متفاجئ', 'Ich bin überrascht.'] },
              { cells: ['wütend', 'غاضب', 'Er ist wütend.'] },
              { cells: ['nervös', 'متوتر', 'Ich bin nervös vor der Prüfung.'] },
              { cells: ['stolz', 'فخور', 'Ich bin stolz auf dich.'] },
              { cells: ['verliebt', 'مُحبّ', 'Sie ist verliebt.'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          {
            rule: 'بعد "Ich finde/denke/glaube, dass..." الفعل في النهاية.',
            example: 'Ich finde, dass Deutsch **schwer ist**.',
            translation: 'أجد أن الألمانية صعبة.',
          },
          {
            rule: 'عبارات لإنقاذ المحادثة.',
            example: 'Wie bitte? / Können Sie das wiederholen? / Ich verstehe nicht.',
            translation: 'ماذا؟ / هل يمكنك الإعادة؟ / لا أفهم.',
          },
          {
            rule: 'للتعبير عن التفضيل: lieber / am liebsten.',
            example: 'Ich trinke **lieber** Tee als Kaffee. / Ich esse **am liebsten** Couscous.',
            translation: 'أفضل الشاي على القهوة. / أحب أكل الكسكس أكثر شيء.',
          },
        ],
        examples: [
          'Meiner Meinung nach ist das eine gute Idee. — في رأيي هذه فكرة جيدة.',
          'Ich bin einverstanden mit dir. — أنا موافق معك.',
          'Das ist mir egal. — لا يهمني.',
          'Es tut mir leid! — أنا آسف!',
          'Herzlichen Glückwunsch! — تهانينا!',
          'Vielen Dank für deine Hilfe! — شكراً جزيلاً لمساعدتك!',
          'Ich bin sehr stolz auf dich. — أنا فخور بك جداً.',
          'Alles Gute zum Geburtstag! — كل عام وأنت بخير!',
        ],
        tip: '💡 للحفاظ على المحادثة حيّة، تعلم عبارات التفاعل: "Wirklich?" (حقاً؟)، "Interessant!" (مثير!)، "Das glaube ich nicht!" (لا أصدق!)، "Genau!" (بالضبط!). هذه تجعلك تبدو مُتفاعلاً وطبيعياً.',
      },
      vocabulary: [
        { german: 'Meinung', arabic: 'الرأي', gender: 'die', plural: 'Meinungen', example: 'Meine Meinung ist...', exampleArabic: 'رأيي هو...', type: 'noun' },
        { german: 'einverstanden', arabic: 'موافق', example: 'Ich bin einverstanden.', exampleArabic: 'أنا موافق.', type: 'adjective' },
        { german: 'dagegen', arabic: 'ضد', example: 'Ich bin dagegen.', exampleArabic: 'أنا ضد ذلك.', type: 'adverb' },
        { german: 'finden', arabic: 'يجد / يعتبر', example: 'Ich finde es gut.', exampleArabic: 'أجده جيداً.', type: 'verb' },
        { german: 'glauben', arabic: 'يعتقد', example: 'Ich glaube, du hast Recht.', exampleArabic: 'أعتقد أنك محق.', type: 'verb' },
        { german: 'denken', arabic: 'يفكر', example: 'Was denkst du?', exampleArabic: 'ما رأيك؟', type: 'verb' },
        { german: 'glücklich', arabic: 'سعيد', example: 'Ich bin glücklich!', exampleArabic: 'أنا سعيد!', type: 'adjective' },
        { german: 'traurig', arabic: 'حزين', example: 'Warum traurig?', exampleArabic: 'لماذا حزين؟', type: 'adjective' },
        { german: 'müde', arabic: 'متعب', example: 'Ich bin müde.', exampleArabic: 'أنا متعب.', type: 'adjective' },
        { german: 'überrascht', arabic: 'متفاجئ', example: 'Ich bin überrascht!', exampleArabic: 'أنا متفاجئ!', type: 'adjective' },
        { german: 'wütend / sauer', arabic: 'غاضب', example: 'Er ist wütend.', exampleArabic: 'هو غاضب.', type: 'adjective' },
        { german: 'nervös', arabic: 'متوتر', example: 'Ich bin nervös.', exampleArabic: 'أنا متوتر.', type: 'adjective' },
        { german: 'stolz', arabic: 'فخور', example: 'Ich bin stolz auf dich.', exampleArabic: 'أنا فخور بك.', type: 'adjective' },
        { german: 'langweilig', arabic: 'ممل', example: 'Das ist langweilig.', exampleArabic: 'هذا ممل.', type: 'adjective' },
        { german: 'interessant', arabic: 'مثير للاهتمام', example: 'Sehr interessant!', exampleArabic: 'مثير جداً!', type: 'adjective' },
        { german: 'Herzlichen Glückwunsch', arabic: 'تهانينا', example: 'Herzlichen Glückwunsch!', exampleArabic: 'تهانينا!', type: 'phrase' },
        { german: 'Es tut mir leid', arabic: 'أنا آسف', example: 'Es tut mir leid.', exampleArabic: 'أنا آسف.', type: 'phrase' },
        { german: 'Das macht nichts', arabic: 'لا يهم', example: 'Das macht nichts.', exampleArabic: 'لا يهم.', type: 'phrase' },
        { german: 'Das ist mir egal', arabic: 'لا يهمني', example: 'Das ist mir egal.', exampleArabic: 'لا يهمني.', type: 'phrase' },
        { german: 'Alles Gute', arabic: 'كل الخير', example: 'Alles Gute zum Geburtstag!', exampleArabic: 'عيد ميلاد سعيد!', type: 'phrase' },
        { german: 'wirklich', arabic: 'حقاً', example: 'Wirklich?', exampleArabic: 'حقاً؟', type: 'adverb' },
        { german: 'genau', arabic: 'بالضبط', example: 'Genau!', exampleArabic: 'بالضبط!', type: 'adverb' },
      ],
      exercise: {
        questions: [
          {
            type: 'fill-blank', id: 'a2-12-q1',
            question: 'أكمل: "___ Meinung nach ist das gut." (في رأيي)',
            answer: 'Meiner',
          },
          {
            type: 'multiple-choice', id: 'a2-12-q2',
            question: 'ما معنى "Ich bin einverstanden"؟',
            options: ['أنا ضد.', 'أنا آسف.', 'أنا موافق.', 'لا يهمني.'],
            answer: 'أنا موافق.',
          },
          {
            type: 'fill-blank', id: 'a2-12-q3',
            question: 'أكمل: "Ich bin sehr ___." (سعيد)',
            answer: 'glücklich',
          },
          {
            type: 'multiple-choice', id: 'a2-12-q4',
            question: 'كيف تقول "تهانينا!" بالألمانية؟',
            options: [
              'Es tut mir leid!',
              'Alles Gute!',
              'Herzlichen Glückwunsch!',
              'Vielen Dank!',
            ],
            answer: 'Herzlichen Glückwunsch!',
          },
          {
            type: 'matching', id: 'a2-12-q5',
            question: 'اربط الشعور بمعناه:',
            pairs: [
              { left: 'glücklich', right: 'سعيد' },
              { left: 'traurig', right: 'حزين' },
              { left: 'müde', right: 'متعب' },
              { left: 'wütend', right: 'غاضب' },
              { left: 'stolz', right: 'فخور' },
              { left: 'überrascht', right: 'متفاجئ' },
            ],
            answer: 'matched',
          },
          {
            type: 'drag-drop', id: 'a2-12-q6',
            question: 'رتّب: "أعتقد أنك محق"',
            words: ['Ich', 'glaube', 'dass', 'du', 'Recht', 'hast'],
            answer: 'Ich glaube dass du Recht hast',
          },
          {
            type: 'speaking', id: 'a2-12-q7',
            question: 'قل بالألمانية: "في رأيي، هذا الفيلم ممتاز"',
            answer: 'Meiner Meinung nach ist dieser Film ausgezeichnet',
          },
          {
            type: 'fill-blank', id: 'a2-12-q8',
            question: 'استمع وأكمل: "Es ___ mir leid." (آسف)',
            audioPrompt: 'Es tut mir leid.',
            answer: 'tut',
          },
          {
            type: 'multiple-choice', id: 'a2-12-q9',
            question: 'ما معنى "Das ist mir egal"؟',
            options: [
              'هذا يهمني.',
              'لا يهمني.',
              'هذا مهم.',
              'لا أعرف.',
            ],
            answer: 'لا يهمني.',
          },
          {
            type: 'fill-blank', id: 'a2-12-q10',
            question: 'أكمل: "Ich trinke ___ Tee als Kaffee." (أفضل)',
            answer: 'lieber',
          },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 13 — أساسيات صفة الصفة (Adjektivdeklination Grundlagen)
    // ─────────────────────────────────────────────
    {
      id: 'a2-13',
      title: 'تصريف الصفة (الأساسيات) — Adjektivdeklination',
      order: 13,
      grammar: {
        title: 'تصريف الصفة بعد der/die/das + ein/eine — في حالتي Nominativ و Akkusativ',
        content: `الصفة في الألمانية تتغيّر نهايتها حسب: **(1) الجنس، (2) الحالة، (3) نوع الأداة قبلها**. اللحظة التي تتعب فيها أعصابك مع كل أمر، اطمئن: في A2 نتعلّم فقط نمطين شائعين — **بعد der/die/das** و **بعد ein/eine** — في الحالتين الأكثر استعمالاً (Nominativ و Akkusativ).

**القاعدة الذهبية الأبسط:**
- بعد **der/die/das** (الأداة المعرّفة): الصفة تأخذ **-e** أو **-en**.
- بعد **ein/eine** (الأداة النكرة): الصفة تأخذ نهاية الأداة المفقودة.`,
        tables: [
          {
            title: 'بعد der/die/das (التصريف الضعيف)',
            headers: ['', 'der (مذكّر)', 'die (مؤنّث)', 'das (محايد)', 'die (جمع)'],
            rows: [
              { cells: ['Nominativ', 'der **schöne** Mann', 'die **schöne** Frau', 'das **schöne** Kind', 'die **schönen** Männer'] },
              { cells: ['Akkusativ', 'den **schönen** Mann', 'die **schöne** Frau', 'das **schöne** Kind', 'die **schönen** Männer'] },
            ],
            theme: 'cases',
            note: 'فقط Akkusativ-der يتغيّر إلى schönen. البقية -e.',
          },
          {
            title: 'بعد ein/eine (التصريف المختلط)',
            headers: ['', 'ein (مذكّر)', 'eine (مؤنّث)', 'ein (محايد)'],
            rows: [
              { cells: ['Nominativ', 'ein **schöner** Mann', 'eine **schöne** Frau', 'ein **schönes** Kind'] },
              { cells: ['Akkusativ', 'einen **schönen** Mann', 'eine **schöne** Frau', 'ein **schönes** Kind'] },
            ],
            theme: 'cases',
            note: 'بعد ein النكرة، الصفة تحمل النهاية: -er (مذكّر), -e (مؤنّث), -es (محايد).',
          },
        ],
        rules: [
          { rule: 'بدون أداة، الصفة تحمل دائماً نهاية الجنس: kalter Tee (شاي بارد), warme Milch (حليب دافئ).', example: 'Ich trinke kalten Tee.', translation: 'أشرب شاياً بارداً.' },
          { rule: 'في Akkusativ، فقط der المذكّر يجبر الصفة على -en. الباقي يبقى نفسه.', example: 'Ich kaufe den neuen Tisch / die neue Lampe / das neue Auto.', translation: 'أشتري الطاولة الجديدة / المصباح / السيارة.' },
          { rule: 'kein يتصرّف مثل ein. mein, dein, sein, ihr, unser, euer, Ihr — أيضاً.', example: 'mein neuer Bruder / keine alte Frau', translation: 'أخي الجديد / امرأة عجوز.' },
        ],
        examples: [
          'Der nette Lehrer kommt aus Berlin. — المعلم اللطيف من برلين.',
          'Ich habe einen guten Freund. — لي صديق طيب.',
          'Sie kauft ein schönes Kleid. — تشتري فستاناً جميلاً.',
          'Die jungen Studenten lernen viel. — الطلاب الشباب يدرسون كثيراً.',
          'Mein neues Auto ist schnell. — سيارتي الجديدة سريعة.',
          'Wir essen frisches Brot. — نأكل خبزاً طازجاً.',
          'Er liest die deutschen Zeitungen. — يقرأ الجرائد الألمانية.',
          'Trinkst du kalten Kaffee? — هل تشرب قهوة باردة؟',
        ],
        tip: 'لا تحفظ كل الجدول الكبير دفعة واحدة. ابدأ بـ "der + Adjektiv + e" و "ein + Adjektiv + er/e/es"، وجرّبها بعشر جمل يومياً. خلال أسبوع تصبح تلقائية.',
      },
      vocabulary: [
        { german: 'schön',     arabic: 'جميل',          example: 'eine schöne Stadt',           exampleArabic: 'مدينة جميلة',         type: 'adjective' },
        { german: 'gut',       arabic: 'جيد',           example: 'ein guter Tag',                exampleArabic: 'يوم جيد',             type: 'adjective' },
        { german: 'neu',       arabic: 'جديد',          example: 'mein neues Auto',             exampleArabic: 'سيارتي الجديدة',      type: 'adjective' },
        { german: 'alt',       arabic: 'قديم / مسنّ',   example: 'das alte Haus',                exampleArabic: 'البيت القديم',       type: 'adjective' },
        { german: 'jung',      arabic: 'شاب',           example: 'eine junge Frau',              exampleArabic: 'امرأة شابة',          type: 'adjective' },
        { german: 'groß',      arabic: 'كبير',          example: 'ein großes Zimmer',            exampleArabic: 'غرفة كبيرة',          type: 'adjective' },
        { german: 'klein',     arabic: 'صغير',          example: 'die kleine Katze',             exampleArabic: 'القطة الصغيرة',      type: 'adjective' },
        { german: 'kalt',      arabic: 'بارد',          example: 'kalter Kaffee',                exampleArabic: 'قهوة باردة',          type: 'adjective' },
        { german: 'warm',      arabic: 'دافئ',          example: 'warme Milch',                  exampleArabic: 'حليب دافئ',          type: 'adjective' },
        { german: 'heiß',      arabic: 'ساخن جداً',     example: 'heißer Tee',                   exampleArabic: 'شاي ساخن',           type: 'adjective' },
        { german: 'frisch',    arabic: 'طازج',          example: 'frisches Brot',                exampleArabic: 'خبز طازج',           type: 'adjective' },
        { german: 'lecker',    arabic: 'لذيذ',          example: 'ein leckeres Essen',           exampleArabic: 'طعام لذيذ',          type: 'adjective' },
        { german: 'schnell',   arabic: 'سريع',          example: 'ein schnelles Auto',           exampleArabic: 'سيارة سريعة',        type: 'adjective' },
        { german: 'langsam',   arabic: 'بطيء',          example: 'ein langsamer Bus',            exampleArabic: 'حافلة بطيئة',        type: 'adjective' },
        { german: 'einfach',   arabic: 'سهل',           example: 'eine einfache Frage',          exampleArabic: 'سؤال سهل',           type: 'adjective' },
        { german: 'schwer',    arabic: 'صعب / ثقيل',     example: 'eine schwere Prüfung',         exampleArabic: 'امتحان صعب',         type: 'adjective' },
        { german: 'leicht',    arabic: 'خفيف / سهل',     example: 'ein leichter Koffer',          exampleArabic: 'حقيبة خفيفة',        type: 'adjective' },
        { german: 'teuer',     arabic: 'غالي',          example: 'ein teures Hotel',             exampleArabic: 'فندق غالٍ',          type: 'adjective' },
        { german: 'billig',    arabic: 'رخيص',          example: 'ein billiger Tisch',           exampleArabic: 'طاولة رخيصة',        type: 'adjective' },
        { german: 'nett',      arabic: 'لطيف',          example: 'eine nette Lehrerin',          exampleArabic: 'معلّمة لطيفة',      type: 'adjective' },
        { german: 'freundlich', arabic: 'ودود',         example: 'ein freundlicher Mann',        exampleArabic: 'رجل ودود',           type: 'adjective' },
        { german: 'müde',      arabic: 'متعب',          example: 'Ich bin sehr müde.',           exampleArabic: 'أنا متعب جداً.',     type: 'adjective' },
        { german: 'hungrig',   arabic: 'جائع',          example: 'ein hungriges Kind',           exampleArabic: 'طفل جائع',           type: 'adjective' },
        { german: 'fleißig',   arabic: 'مجتهد',         example: 'eine fleißige Studentin',      exampleArabic: 'طالبة مجتهدة',       type: 'adjective' },
        { german: 'intelligent', arabic: 'ذكي',         example: 'ein intelligenter Schüler',    exampleArabic: 'تلميذ ذكي',          type: 'adjective' },
        { german: 'das Kleid', arabic: 'الفستان',       example: 'Sie trägt ein rotes Kleid.',   exampleArabic: 'ترتدي فستاناً أحمر.', type: 'noun', gender: 'das', plural: 'die Kleider' },
        { german: 'das Hemd',  arabic: 'القميص',        example: 'ein weißes Hemd',              exampleArabic: 'قميص أبيض',          type: 'noun', gender: 'das', plural: 'die Hemden' },
        { german: 'die Hose',  arabic: 'البنطلون',      example: 'eine neue Hose',                exampleArabic: 'بنطلون جديد',        type: 'noun', gender: 'die', plural: 'die Hosen' },
        { german: 'die Schuhe', arabic: 'الأحذية',      example: 'schwarze Schuhe',              exampleArabic: 'أحذية سوداء',        type: 'noun', gender: 'pl' },
        { german: 'rot',       arabic: 'أحمر',          example: 'das rote Auto',                exampleArabic: 'السيارة الحمراء',    type: 'adjective' },
        { german: 'blau',      arabic: 'أزرق',          example: 'der blaue Himmel',             exampleArabic: 'السماء الزرقاء',     type: 'adjective' },
        { german: 'grün',      arabic: 'أخضر',          example: 'grüner Tee',                   exampleArabic: 'شاي أخضر',          type: 'adjective' },
        { german: 'schwarz',   arabic: 'أسود',          example: 'eine schwarze Tasche',         exampleArabic: 'حقيبة سوداء',        type: 'adjective' },
        { german: 'weiß',      arabic: 'أبيض',          example: 'ein weißes Hemd',              exampleArabic: 'قميص أبيض',          type: 'adjective' },
        { german: 'sehr',      arabic: 'جداً',          example: 'sehr gut',                      exampleArabic: 'جيد جداً',           type: 'adverb' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'a2-13-q1', question: 'أكمل: "der schön__ Mann" (Nominativ)', answer: 'e', hint: 'der + Adjektiv + e' },
          { type: 'multiple-choice', id: 'a2-13-q2', question: 'صحّح: "Ich kaufe ein ___ Auto."', options: ['neu', 'neue', 'neues', 'neuer'], answer: 'neues' },
          { type: 'fill-blank', id: 'a2-13-q3', question: 'أكمل: "Ich habe einen gut___ Freund."', answer: 'en', hint: 'einen + Akk-mask → -en' },
          { type: 'multiple-choice', id: 'a2-13-q4', question: 'أيّ جملة صحيحة؟', options: ['Sie trägt eine rotes Kleid.', 'Sie trägt ein rotes Kleid.', 'Sie trägt ein rote Kleid.', 'Sie trägt einen rotes Kleid.'], answer: 'Sie trägt ein rotes Kleid.' },
          { type: 'fill-blank', id: 'a2-13-q5', question: 'أكمل: "die jung__ Studenten" (جمع، Nominativ)', answer: 'en', hint: 'بعد die الجمع → -en' },
          { type: 'matching', id: 'a2-13-q6', question: 'اربط الصفة بمعناها:', pairs: [
            { left: 'schön', right: 'جميل' },
            { left: 'alt', right: 'قديم' },
            { left: 'klein', right: 'صغير' },
            { left: 'teuer', right: 'غالي' },
            { left: 'lecker', right: 'لذيذ' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'a2-13-q7', question: 'رتّب: "أشتري قميصاً أبيض"', words: ['Ich', 'kaufe', 'ein', 'weißes', 'Hemd'], answer: 'Ich kaufe ein weißes Hemd' },
          { type: 'speaking', id: 'a2-13-q8', question: 'قل بالألمانية: "البيت الجديد كبير"', answer: 'Das neue Haus ist groß' },
          { type: 'fill-blank', id: 'a2-13-q9', question: 'استمع: "Wir trinken heiß___ Tee." (بدون أداة)', audioPrompt: 'Wir trinken heißen Tee.', answer: 'en', hint: 'Akk-mask بدون أداة → -en' },
          { type: 'multiple-choice', id: 'a2-13-q10', question: 'كلمة kein تتصرّف مثل:', options: ['der', 'die', 'das', 'ein'], answer: 'ein' },
          { type: 'fill-blank', id: 'a2-13-q11', question: 'أكمل: "Die alt___ Häuser sind schön." (جمع، Nom)', answer: 'en', hint: 'بعد die الجمع → -en' },
          { type: 'multiple-choice', id: 'a2-13-q12', question: 'أيّ صفة بدون أداة في Akk-mask؟', options: ['kalt Tee', 'kalter Tee', 'kalten Tee', 'kalte Tee'], answer: 'kalten Tee' },
          { type: 'fill-blank', id: 'a2-13-q13', question: '"Mein neu___ Auto ist schnell." (مذكر/محايد، Nom)', answer: 'es', hint: 'mein/dein/sein... + neutrum → -es' },
          { type: 'matching', id: 'a2-13-q14', question: 'اربط النهاية بالحالة:', pairs: [
            { left: 'der schöne...', right: '-e' },
            { left: 'einen schönen...', right: '-en' },
            { left: 'ein schönes Kind', right: '-es' },
            { left: 'kalter Tee', right: '-er' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'a2-13-q15', question: 'رتّب: "أشتري سيارة جميلة"', words: ['Ich', 'kaufe', 'ein', 'schönes', 'Auto'], answer: 'Ich kaufe ein schönes Auto' },
          { type: 'fill-blank', id: 'a2-13-q16', question: 'استمع: "Sie hat eine ___ Tasche." (سوداء)', audioPrompt: 'Sie hat eine schwarze Tasche.', answer: 'schwarze', hint: 'eine + adj + -e (مؤنث Akk)' },
          { type: 'multiple-choice', id: 'a2-13-q17', question: 'الصفة بعد kein تتبع نمط:', options: ['der', 'die', 'das', 'ein'], answer: 'ein' },
          { type: 'speaking', id: 'a2-13-q18', question: 'قل: "أحبّ القهوة الساخنة"', answer: 'Ich mag heißen Kaffee' },
          { type: 'fill-blank', id: 'a2-13-q19', question: '"Wir essen frisch___ Brot." (بدون أداة، محايد Akk)', answer: 'es', hint: 'بدون أداة، Akk-neutrum → -es' },
          { type: 'multiple-choice', id: 'a2-13-q20', question: 'أيّ جملة فيها تصريف صحيح؟', options: ['Der grüner Tee.', 'Der grüne Tee.', 'Der grünen Tee.', 'Den grüne Tee.'], answer: 'Der grüne Tee.' },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 14 — Modalverben im Perfekt
    // ─────────────────────────────────────────────
    {
      id: 'a2-14',
      title: 'الأفعال الناقصة في الماضي — Modalverben Perfekt',
      order: 14,
      grammar: {
        title: 'صيغة الـ Perfekt مع الأفعال الناقصة + بنية المصدر المزدوج',
        content: `حين نتكلّم عن الماضي مع الأفعال الناقصة، الألمانية تستعمل بنية خاصة جداً — **حرف "haben" + الفعل الرئيسي + الفعل الناقص في النهاية، كلاهما في صيغة المصدر**.

→ Ich **habe** gestern arbeiten **müssen**. (كان عليّ العمل أمس)

هذه البنية تُسمّى "**Doppelter Infinitiv**" (المصدر المزدوج). لاحظ أنه لا يوجد ge- ولا أيّ تصريف عادي للماضي.

**بديل أبسط:** في الكلام اليومي يستخدم الناطقون الـ **Präteritum** (الماضي البسيط) للأفعال الناقصة بدلاً من Perfekt — أكثر شيوعاً وأسهل.

→ Ich **musste** gestern arbeiten. = Ich habe gestern arbeiten müssen.`,
        tables: [
          {
            title: 'Präteritum للأفعال الناقصة (الأكثر استعمالاً)',
            headers: ['Pronomen', 'können', 'müssen', 'wollen', 'mögen', 'dürfen', 'sollen'],
            rows: [
              { cells: ['ich',     'konnte',   'musste',   'wollte',   'mochte',   'durfte',   'sollte'] },
              { cells: ['du',      'konntest', 'musstest', 'wolltest', 'mochtest', 'durftest', 'solltest'] },
              { cells: ['er/sie/es', 'konnte', 'musste',   'wollte',   'mochte',   'durfte',   'sollte'], highlight: true },
              { cells: ['wir',     'konnten',  'mussten',  'wollten',  'mochten',  'durften',  'sollten'] },
              { cells: ['ihr',     'konntet',  'musstet',  'wolltet',  'mochtet',  'durftet',  'solltet'] },
              { cells: ['sie/Sie', 'konnten',  'mussten',  'wollten',  'mochten',  'durften',  'sollten'] },
            ],
            theme: 'conjugation',
            note: 'تتشكّل بإضافة -te- بعد الجذر. ich و er/sie/es متطابقان (لا -t).',
          },
          {
            title: 'الفرق بين Präteritum و Perfekt للأفعال الناقصة',
            headers: ['الزمن', 'الجملة', 'الاستعمال'],
            rows: [
              { cells: ['Präteritum',  'Ich musste arbeiten.',           'في الكتابة والكلام (الأكثر شيوعاً)'] },
              { cells: ['Perfekt',     'Ich habe arbeiten müssen.',      'في الكلام اليومي (أقل شيوعاً، رسمي أحياناً)'] },
            ],
            theme: 'default',
            note: 'استعمل Präteritum أولاً — إنها الصيغة الطبيعية في كل المواقف.',
          },
        ],
        rules: [
          { rule: 'بنية Doppelter Infinitiv: haben + Hauptverb + Modalverb (كلاهما مصدر، الترتيب مهم).', example: 'Ich habe gestern lange arbeiten müssen.', translation: 'كان عليّ العمل لوقت طويل أمس.' },
          { rule: 'الـ Präteritum يضاف -te- + النهاية: konnte, musste, wollte. ich = er/sie/es دائماً.', example: 'Sie konnte gut Deutsch sprechen.', translation: 'كانت تستطيع التحدث بالألمانية جيداً.' },
          { rule: 'بدون فعل رئيسي، يُصرّف الفعل الناقص بشكل عادي مع haben/sein (نادر).', example: 'Ich habe das gewollt. (أردت ذلك)', translation: 'أردت ذلك.' },
          { rule: 'mögen في الماضي يصبح mochte (دون umlaut أحياناً) — إيّاك والخلط بـ möchte.', example: 'Als Kind mochte ich keinen Kaffee.', translation: 'حين كنت طفلاً لم أحبّ القهوة.' },
        ],
        examples: [
          'Ich musste gestern früh aufstehen. — كان عليّ الاستيقاظ مبكراً أمس.',
          'Wir konnten nicht kommen. — لم نستطع المجيء.',
          'Mein Vater wollte nach Berlin reisen. — أبي أراد السفر إلى برلين.',
          'Als Kind mochte ich keinen Spinat. — حين كنت طفلاً لم أحب السبانخ.',
          'Ich habe lange warten müssen. — كان عليّ الانتظار طويلاً.',
          'Sie hat das nicht machen können. — لم تستطع فعل ذلك.',
          'Was hast du gestern machen wollen? — ماذا أردت أن تفعل أمس؟',
          'Wir durften ins Kino gehen. — كان مسموحاً لنا الذهاب إلى السينما.',
        ],
        tip: 'في 95% من الحالات، استعمل Präteritum (musste, konnte, wollte). احتفظ بـ Perfekt مع الأفعال الناقصة للمواقف الرسمية أو الكتابية.',
      },
      vocabulary: [
        { german: 'gestern',   arabic: 'أمس',           example: 'Ich musste gestern arbeiten.',  exampleArabic: 'كان عليّ العمل أمس.', type: 'adverb' },
        { german: 'heute',     arabic: 'اليوم',          example: 'Heute kann ich frei machen.',   exampleArabic: 'اليوم أستطيع أن أرتاح.', type: 'adverb' },
        { german: 'früh',      arabic: 'مبكراً',         example: 'Ich musste früh aufstehen.',    exampleArabic: 'كان عليّ الاستيقاظ مبكراً.', type: 'adverb' },
        { german: 'spät',      arabic: 'متأخراً',        example: 'Er kam spät nach Hause.',       exampleArabic: 'عاد إلى البيت متأخراً.', type: 'adverb' },
        { german: 'lange',     arabic: 'طويلاً',         example: 'Ich habe lange warten müssen.',  exampleArabic: 'كان عليّ الانتظار طويلاً.', type: 'adverb' },
        { german: 'damals',    arabic: 'في ذلك الوقت',    example: 'Damals konnte ich kein Deutsch.', exampleArabic: 'في ذلك الوقت لم أكن أعرف الألمانية.', type: 'adverb' },
        { german: 'als Kind',  arabic: 'حين كنت طفلاً',   example: 'Als Kind mochte ich Schokolade.', exampleArabic: 'حين كنت طفلاً كنت أحب الشوكولاتة.', type: 'phrase' },
        { german: 'letzte Woche', arabic: 'الأسبوع الماضي', example: 'Letzte Woche musste ich nach München fahren.', exampleArabic: 'الأسبوع الماضي كان عليّ السفر إلى ميونخ.', type: 'phrase' },
        { german: 'arbeiten',  arabic: 'يعمل',          example: 'Er hat arbeiten müssen.',       exampleArabic: 'كان عليه العمل.',      type: 'verb' },
        { german: 'lernen',    arabic: 'يتعلّم',         example: 'Ich musste viel lernen.',        exampleArabic: 'كان عليّ التعلّم كثيراً.', type: 'verb' },
        { german: 'aufstehen', arabic: 'يستيقظ',        example: 'Wir mussten früh aufstehen.',   exampleArabic: 'كان علينا الاستيقاظ مبكراً.', type: 'verb' },
        { german: 'warten',    arabic: 'ينتظر',         example: 'Ich konnte nicht warten.',       exampleArabic: 'لم أستطع الانتظار.',  type: 'verb' },
        { german: 'helfen',    arabic: 'يساعد',         example: 'Sie wollte mir helfen.',         exampleArabic: 'أرادت أن تساعدني.',   type: 'verb' },
        { german: 'kommen',    arabic: 'يأتي',          example: 'Er konnte nicht kommen.',        exampleArabic: 'لم يستطع المجيء.',    type: 'verb' },
        { german: 'fahren',    arabic: 'يسافر',         example: 'Wir wollten nach Spanien fahren.', exampleArabic: 'أردنا السفر إلى إسبانيا.', type: 'verb' },
        { german: 'essen',     arabic: 'يأكل',          example: 'Ich konnte nichts essen.',       exampleArabic: 'لم أستطع أكل شيء.',  type: 'verb' },
        { german: 'machen',    arabic: 'يفعل',          example: 'Was wolltest du machen?',        exampleArabic: 'ماذا أردت أن تفعل؟',  type: 'verb' },
        { german: 'die Prüfung', arabic: 'الامتحان',     example: 'Ich musste für die Prüfung lernen.', exampleArabic: 'كان عليّ الدراسة للامتحان.', type: 'noun', gender: 'die', plural: 'die Prüfungen' },
        { german: 'die Schule', arabic: 'المدرسة',       example: 'Als Kind musste ich in die Schule gehen.', exampleArabic: 'حين كنت طفلاً كان عليّ الذهاب للمدرسة.', type: 'noun', gender: 'die', plural: 'die Schulen' },
        { german: 'der Termin', arabic: 'الموعد',        example: 'Ich konnte den Termin nicht halten.', exampleArabic: 'لم أستطع الالتزام بالموعد.', type: 'noun', gender: 'der', plural: 'die Termine' },
        { german: 'das Wochenende', arabic: 'عطلة الأسبوع', example: 'Am Wochenende wollte ich schlafen.', exampleArabic: 'في عطلة الأسبوع أردت النوم.', type: 'noun', gender: 'das', plural: 'die Wochenenden' },
        { german: 'der Urlaub', arabic: 'الإجازة',        example: 'Im Urlaub konnten wir nicht reisen.', exampleArabic: 'في الإجازة لم نستطع السفر.', type: 'noun', gender: 'der', plural: 'die Urlaube' },
        { german: 'leider',    arabic: 'للأسف',          example: 'Ich konnte leider nicht kommen.', exampleArabic: 'للأسف لم أستطع المجيء.', type: 'adverb' },
        { german: 'plötzlich', arabic: 'فجأة',           example: 'Plötzlich musste ich gehen.',    exampleArabic: 'فجأة كان عليّ الذهاب.',  type: 'adverb' },
        { german: 'eigentlich', arabic: 'في الواقع',     example: 'Eigentlich wollte ich bleiben.', exampleArabic: 'في الواقع أردت البقاء.', type: 'adverb' },
        { german: 'die Idee', arabic: 'الفكرة',           example: 'Das war eine gute Idee.',        exampleArabic: 'كانت فكرة جيدة.',     type: 'noun', gender: 'die', plural: 'die Ideen' },
        { german: 'das Problem', arabic: 'المشكلة',       example: 'Ich hatte ein Problem.',         exampleArabic: 'كانت لديّ مشكلة.',  type: 'noun', gender: 'das', plural: 'die Probleme' },
        { german: 'der Grund', arabic: 'السبب',           example: 'Aus diesem Grund musste ich gehen.', exampleArabic: 'لهذا السبب كان عليّ الذهاب.', type: 'noun', gender: 'der', plural: 'die Gründe' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'a2-14-q1', question: 'Präteritum: "Ich ___ gestern arbeiten." (müssen)', answer: 'musste', hint: 'müssen → musste' },
          { type: 'multiple-choice', id: 'a2-14-q2', question: 'صيغة Präteritum من können مع er؟', options: ['kannte', 'konnte', 'könnte', 'gekonnt'], answer: 'konnte' },
          { type: 'fill-blank', id: 'a2-14-q3', question: 'Doppelter Infinitiv: "Ich habe gestern lernen ___."', answer: 'müssen', hint: 'الفعل الناقص في النهاية، مصدر' },
          { type: 'multiple-choice', id: 'a2-14-q4', question: 'أيّ جملة صحيحة في Präteritum؟', options: ['Wir wolltet nach Berlin fahren.', 'Wir wollten nach Berlin fahren.', 'Wir wollen nach Berlin fahren.', 'Wir gewollt nach Berlin fahren.'], answer: 'Wir wollten nach Berlin fahren.' },
          { type: 'fill-blank', id: 'a2-14-q5', question: 'Als Kind ___ ich keinen Spinat. (mögen)', answer: 'mochte', hint: 'mögen → mochte (الماضي)' },
          { type: 'matching', id: 'a2-14-q6', question: 'اربط الفعل الناقص بصيغة Präteritum:', pairs: [
            { left: 'können', right: 'konnte' },
            { left: 'müssen', right: 'musste' },
            { left: 'wollen', right: 'wollte' },
            { left: 'dürfen', right: 'durfte' },
            { left: 'sollen', right: 'sollte' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'a2-14-q7', question: 'رتّب (Präteritum): "أبي أراد السفر إلى برلين"', words: ['Mein', 'Vater', 'wollte', 'nach', 'Berlin', 'reisen'], answer: 'Mein Vater wollte nach Berlin reisen' },
          { type: 'speaking', id: 'a2-14-q8', question: 'قل بـ Präteritum: "كان عليّ الاستيقاظ مبكراً"', answer: 'Ich musste früh aufstehen' },
          { type: 'fill-blank', id: 'a2-14-q9', question: 'استمع وأكمل: "Wir ___ ins Kino gehen." (durften / dürfen)', audioPrompt: 'Wir durften ins Kino gehen.', answer: 'durften', hint: 'dürfen في الماضي → durften (wir)' },
          { type: 'multiple-choice', id: 'a2-14-q10', question: 'في 95% من الحالات اليومية نستعمل أيّ صيغة للأفعال الناقصة في الماضي؟', options: ['Perfekt', 'Präteritum', 'Plusquamperfekt', 'Konjunktiv'], answer: 'Präteritum' },
          { type: 'fill-blank', id: 'a2-14-q11', question: 'Präteritum من dürfen مع wir؟', answer: 'durften', hint: 'dürfen → durfte/durften' },
          { type: 'multiple-choice', id: 'a2-14-q12', question: 'صيغة Präteritum من sollen مع ich؟', options: ['solle', 'sollte', 'sollst', 'sollten'], answer: 'sollte' },
          { type: 'fill-blank', id: 'a2-14-q13', question: '"Ich ___ gestern nicht arbeiten." (لم يكن عليّ — sollen)', answer: 'sollte', hint: 'sollen → sollte' },
          { type: 'matching', id: 'a2-14-q14', question: 'اربط الفعل الناقص بمضارع/ماضي:', pairs: [
            { left: 'können', right: 'konnte' },
            { left: 'müssen', right: 'musste' },
            { left: 'wollen', right: 'wollte' },
            { left: 'mögen', right: 'mochte' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'a2-14-q15', question: 'رتّب (Doppelter Inf): "كان عليّ أن أتعلّم كثيراً"', words: ['Ich', 'habe', 'viel', 'lernen', 'müssen'], answer: 'Ich habe viel lernen müssen' },
          { type: 'fill-blank', id: 'a2-14-q16', question: 'استمع: "Wir ___ ins Kino gehen." (durften)', audioPrompt: 'Wir durften ins Kino gehen.', answer: 'durften', hint: 'dürfen + wir في الماضي' },
          { type: 'multiple-choice', id: 'a2-14-q17', question: 'صيغة Doppelter Infinitiv هي:', options: ['haben + Modal + Inf', 'haben + Inf + Modal', 'sein + Inf + Modal', 'haben + Partizip + Modal'], answer: 'haben + Inf + Modal' },
          { type: 'speaking', id: 'a2-14-q18', question: 'قل (Präteritum): "أردنا السفر إلى ألمانيا"', answer: 'Wir wollten nach Deutschland reisen' },
          { type: 'fill-blank', id: 'a2-14-q19', question: '"Du ___ nicht zur Schule gehen." (لم يكن عليك — müssen)', answer: 'musstest', hint: 'müssen + du في الماضي' },
          { type: 'multiple-choice', id: 'a2-14-q20', question: 'الفرق بين möchte و mochte؟', options: ['نفس الشيء', 'möchte حاضر مهذّب، mochte ماضي عادي', 'kein فرق', 'möchte ماضي، mochte حاضر'], answer: 'möchte حاضر مهذّب، mochte ماضي عادي' },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 15 — Konjunktiv II höflich
    // ─────────────────────────────────────────────
    {
      id: 'a2-15',
      title: 'صيغة المهذّبة — Konjunktiv II für Höflichkeit',
      order: 15,
      grammar: {
        title: 'würde, hätte, wäre + كيف تطلب بأدب',
        content: `الـ **Konjunktiv II** (التمنّي) صيغة كاملة في B1، لكن في A2 نتعلّم استعمالها الأبسط والأهم: **التهذيب**. حين تطلب شيئاً في مطعم، محل، أو من غريب، استعمل صيغة Konjunktiv II بدلاً من الصيغة العادية — فهي ألطف بكثير.

**الصيغ الثلاث الأساسية:**
- **würde + Infinitiv** = أحبّ أن... (مع كل الأفعال تقريباً)
- **hätte** = "لو كان لديّ..."
- **wäre** = "لو كنت..."

**أمثلة من الحياة اليومية:**
→ Ich **möchte** einen Kaffee, bitte. (أودّ قهوة من فضلك — möchte هو Konjunktiv II من mögen)
→ Ich **hätte** gern einen Tisch für zwei. (أودّ طاولة لاثنين)
→ **Würden** Sie mir helfen? (هل تتفضّلون بمساعدتي؟)`,
        tables: [
          {
            title: 'صيغة würde + Infinitiv (الأكثر استعمالاً)',
            headers: ['Pronomen', 'würde + ...', 'مثال'],
            rows: [
              { cells: ['ich',     'würde',     'Ich würde gern kommen.'] },
              { cells: ['du',      'würdest',   'Würdest du mir helfen?'] },
              { cells: ['er/sie/es', 'würde',   'Sie würde gern bleiben.'] },
              { cells: ['wir',     'würden',    'Wir würden gern bestellen.'] },
              { cells: ['ihr',     'würdet',    'Würdet ihr kommen?'] },
              { cells: ['sie/Sie', 'würden',    'Würden Sie bitte warten?'] },
            ],
            theme: 'conjugation',
            note: 'würde + الفعل الرئيسي في النهاية بصيغة المصدر.',
          },
          {
            title: 'hätte و wäre — حالات خاصة',
            headers: ['Pronomen', 'hätte (يملك مهذّب)', 'wäre (يكون مهذّب)'],
            rows: [
              { cells: ['ich',     'hätte',    'wäre'] },
              { cells: ['du',      'hättest',  'wärst (wärest)'] },
              { cells: ['er/sie/es', 'hätte',  'wäre'] },
              { cells: ['wir',     'hätten',   'wären'] },
              { cells: ['ihr',     'hättet',   'wärt (wäret)'] },
              { cells: ['sie/Sie', 'hätten',   'wären'] },
            ],
            theme: 'conjugation',
            note: 'استعمل hätte gern (= أودّ) و wäre gern (= أودّ أن أكون).',
          },
        ],
        rules: [
          { rule: 'möchte هو Konjunktiv II من mögen — استعمله في المطاعم والمحلات.', example: 'Ich möchte ein Wasser, bitte.', translation: 'أودّ ماء من فضلك.' },
          { rule: 'würde + Infinitiv هي أكثر صيغة Konjunktiv II استعمالاً في الكلام.', example: 'Ich würde gern Deutschland besuchen.', translation: 'أودّ زيارة ألمانيا.' },
          { rule: 'hätte gern + اسم = أودّ هذا الشيء (مهذّب جداً للطلب).', example: 'Ich hätte gern einen Tisch am Fenster.', translation: 'أودّ طاولة عند النافذة.' },
          { rule: 'استعمال Könnten Sie...? و Würden Sie...? في الأسئلة المهذّبة.', example: 'Könnten Sie mir helfen? / Würden Sie das wiederholen?', translation: 'هل بإمكانكم مساعدتي؟ / هل تعيدون من فضلكم؟' },
        ],
        examples: [
          'Ich möchte einen Tisch reservieren. — أودّ حجز طاولة.',
          'Würden Sie mir bitte helfen? — هل تتفضّلون بمساعدتي؟',
          'Könntest du das Fenster öffnen? — هل بإمكانك فتح النافذة؟',
          'Ich hätte gern einen Cappuccino. — أودّ كابتشينو.',
          'Wir würden gern in Berlin wohnen. — نودّ السكن في برلين.',
          'Wäre das möglich? — هل ذلك ممكن؟',
          'Ich würde mehr Wasser trinken. — أودّ شرب المزيد من الماء.',
          'Hättest du Zeit für mich? — هل لديك وقت من أجلي؟',
        ],
        tip: 'في كل مرة تطلب فيها شيئاً من غريب أو في موقف رسمي، استعمل صيغة مهذّبة. الفرق بين "Ich will Wasser" (أريد ماء) و "Ich möchte Wasser, bitte" (أودّ ماء من فضلك) هو الفرق بين الفظاظة والاحترام.',
      },
      vocabulary: [
        { german: 'möchten',   arabic: 'يودّ',           example: 'Ich möchte einen Kaffee.',       exampleArabic: 'أودّ قهوة.',          type: 'verb' },
        { german: 'würden',    arabic: 'يودّ (مع فعل)',  example: 'Ich würde gern kommen.',         exampleArabic: 'أودّ المجيء.',        type: 'verb' },
        { german: 'hätte',     arabic: 'كان لديه (مهذّب)', example: 'Ich hätte gern einen Tee.',     exampleArabic: 'أودّ كأس شاي.',      type: 'verb' },
        { german: 'wäre',      arabic: 'كان (مهذّب)',     example: 'Wäre das möglich?',              exampleArabic: 'هل ذلك ممكن؟',       type: 'verb' },
        { german: 'könnten',   arabic: 'بإمكانكم (مهذّب)', example: 'Könnten Sie mir helfen?',        exampleArabic: 'هل بإمكانكم مساعدتي؟', type: 'verb' },
        { german: 'gern',      arabic: 'بسرور',          example: 'Ich würde gern bleiben.',         exampleArabic: 'أودّ البقاء.',        type: 'adverb' },
        { german: 'lieber',    arabic: 'أفضّل',           example: 'Ich hätte lieber Tee.',           exampleArabic: 'أفضّل الشاي.',        type: 'adverb' },
        { german: 'bitte',     arabic: 'من فضلك',         example: 'Einen Kaffee, bitte.',           exampleArabic: 'قهوة من فضلك.',      type: 'adverb' },
        { german: 'vielleicht', arabic: 'ربما',          example: 'Vielleicht würde ich kommen.',   exampleArabic: 'ربما أودّ المجيء.',  type: 'adverb' },
        { german: 'reservieren', arabic: 'يحجز',         example: 'Ich möchte einen Tisch reservieren.', exampleArabic: 'أودّ حجز طاولة.', type: 'verb' },
        { german: 'bestellen', arabic: 'يطلب',           example: 'Ich würde gern bestellen.',       exampleArabic: 'أودّ الطلب.',         type: 'verb' },
        { german: 'wiederholen', arabic: 'يكرّر',         example: 'Würden Sie das wiederholen?',     exampleArabic: 'هل تعيدون من فضلكم؟', type: 'verb' },
        { german: 'erklären',  arabic: 'يشرح',           example: 'Könnten Sie das erklären?',       exampleArabic: 'هل بإمكانكم الشرح؟', type: 'verb' },
        { german: 'zeigen',    arabic: 'يُري',            example: 'Würden Sie mir das zeigen?',      exampleArabic: 'هل تتفضّلون بإريائي؟', type: 'verb' },
        { german: 'öffnen',    arabic: 'يفتح',           example: 'Könntest du das Fenster öffnen?', exampleArabic: 'هل تفتح النافذة؟',  type: 'verb' },
        { german: 'schließen', arabic: 'يغلق',           example: 'Würden Sie die Tür schließen?',   exampleArabic: 'هل تغلق الباب؟',     type: 'verb' },
        { german: 'der Tisch', arabic: 'الطاولة',         example: 'Einen Tisch für zwei, bitte.',   exampleArabic: 'طاولة لاثنين من فضلك.', type: 'noun', gender: 'der', plural: 'die Tische' },
        { german: 'die Rechnung', arabic: 'الفاتورة',     example: 'Die Rechnung, bitte.',           exampleArabic: 'الفاتورة من فضلك.', type: 'noun', gender: 'die', plural: 'die Rechnungen' },
        { german: 'die Speisekarte', arabic: 'قائمة الطعام', example: 'Könnte ich die Speisekarte haben?', exampleArabic: 'هل يمكنني الحصول على قائمة الطعام؟', type: 'noun', gender: 'die', plural: 'die Speisekarten' },
        { german: 'die Bestellung', arabic: 'الطلب',      example: 'Eine Bestellung, bitte.',         exampleArabic: 'طلب من فضلكم.',     type: 'noun', gender: 'die', plural: 'die Bestellungen' },
        { german: 'das Restaurant', arabic: 'المطعم',     example: 'Wir gehen ins Restaurant.',       exampleArabic: 'نذهب إلى المطعم.', type: 'noun', gender: 'das', plural: 'die Restaurants' },
        { german: 'das Café',  arabic: 'المقهى',          example: 'Ich gehe ins Café.',              exampleArabic: 'أذهب إلى المقهى.', type: 'noun', gender: 'das', plural: 'die Cafés' },
        { german: 'der Kellner', arabic: 'النادل',         example: 'Der Kellner kommt gleich.',       exampleArabic: 'النادل سيأتي حالاً.', type: 'noun', gender: 'der', plural: 'die Kellner' },
        { german: 'das Glas',  arabic: 'الكأس',           example: 'Ein Glas Wasser, bitte.',         exampleArabic: 'كأس ماء من فضلك.',   type: 'noun', gender: 'das', plural: 'die Gläser' },
        { german: 'die Flasche', arabic: 'القنينة',       example: 'Eine Flasche Wein, bitte.',       exampleArabic: 'قنينة نبيذ من فضلك.', type: 'noun', gender: 'die', plural: 'die Flaschen' },
        { german: 'die Tasse', arabic: 'الفنجان',         example: 'Eine Tasse Kaffee.',              exampleArabic: 'فنجان قهوة.',        type: 'noun', gender: 'die', plural: 'die Tassen' },
        { german: 'höflich',   arabic: 'مهذّب',           example: 'Sei bitte höflich.',              exampleArabic: 'كن مهذّباً من فضلك.', type: 'adjective' },
        { german: 'freundlich', arabic: 'ودود',           example: 'Der Kellner war sehr freundlich.', exampleArabic: 'النادل كان ودوداً جداً.', type: 'adjective' },
        { german: 'natürlich', arabic: 'طبعاً',           example: 'Natürlich helfe ich dir.',        exampleArabic: 'طبعاً أساعدك.',      type: 'adverb' },
        { german: 'sicher',    arabic: 'بالتأكيد',         example: 'Sicher kannst du kommen.',         exampleArabic: 'بالتأكيد يمكنك المجيء.', type: 'adverb' },
        { german: 'möglich',   arabic: 'ممكن',            example: 'Wäre das möglich?',                 exampleArabic: 'هل ذلك ممكن؟',     type: 'adjective' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'a2-15-q1', question: 'صيغة مهذّبة من mögen مع ich؟', answer: 'möchte', hint: 'mögen → möchte (Konj. II)' },
          { type: 'multiple-choice', id: 'a2-15-q2', question: 'كيف تطلب بأدب: "هل بإمكانك مساعدتي؟"', options: ['Hilf mir!', 'Du hilfst mir.', 'Könntest du mir helfen?', 'Ich helfe dir.'], answer: 'Könntest du mir helfen?' },
          { type: 'fill-blank', id: 'a2-15-q3', question: 'أكمل: "Ich ___ gern einen Tisch am Fenster." (مهذّب)', answer: 'hätte', hint: 'hätte gern + اسم' },
          { type: 'multiple-choice', id: 'a2-15-q4', question: 'صيغة würde مع wir؟', options: ['würde', 'würdest', 'würden', 'würdet'], answer: 'würden' },
          { type: 'fill-blank', id: 'a2-15-q5', question: 'أكمل (مهذّب): "___ Sie das wiederholen?" (هل تعيدون؟)', answer: 'Würden', hint: 'Würden Sie + Infinitiv' },
          { type: 'matching', id: 'a2-15-q6', question: 'اربط الصيغة المهذّبة بمعناها:', pairs: [
            { left: 'Ich möchte', right: 'أودّ' },
            { left: 'Ich hätte gern', right: 'أودّ (مع اسم)' },
            { left: 'Würden Sie', right: 'هل تتفضّلون' },
            { left: 'Könnten Sie', right: 'هل بإمكانكم' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'a2-15-q7', question: 'رتّب: "أودّ كابتشينو من فضلك"', words: ['Ich', 'hätte', 'gern', 'einen', 'Cappuccino', 'bitte'], answer: 'Ich hätte gern einen Cappuccino bitte' },
          { type: 'speaking', id: 'a2-15-q8', question: 'قل بأدب في مطعم: "هل يمكنني الحصول على الفاتورة؟"', answer: 'Könnte ich die Rechnung haben bitte' },
          { type: 'fill-blank', id: 'a2-15-q9', question: 'استمع: "___ das möglich?" (هل ذلك ممكن؟ — مهذّب)', audioPrompt: 'Wäre das möglich?', answer: 'Wäre', hint: 'wäre = sein في Konj. II' },
          { type: 'multiple-choice', id: 'a2-15-q10', question: 'الجملة الأكثر تهذيباً:', options: ['Ich will Kaffee.', 'Gib mir Kaffee.', 'Kaffee!', 'Ich hätte gern einen Kaffee, bitte.'], answer: 'Ich hätte gern einen Kaffee, bitte.' },
          { type: 'fill-blank', id: 'a2-15-q11', question: 'مهذّب: "___ Sie mir den Weg zeigen?" (هل بإمكانكم — können Konj. II)', answer: 'Könnten', hint: 'können → könnten' },
          { type: 'multiple-choice', id: 'a2-15-q12', question: 'صيغة hätte مع du؟', options: ['hätte', 'hättest', 'hätten', 'hattet'], answer: 'hättest' },
          { type: 'fill-blank', id: 'a2-15-q13', question: '"Ich ___ gerne in Berlin wohnen." (würde-form)', answer: 'würde', hint: 'würde + Inf' },
          { type: 'matching', id: 'a2-15-q14', question: 'اربط الصيغة العادية بالمهذّبة:', pairs: [
            { left: 'Ich will', right: 'Ich möchte' },
            { left: 'Kannst du', right: 'Könntest du' },
            { left: 'Hilf mir', right: 'Würden Sie mir helfen' },
            { left: 'Geben Sie', right: 'Hätten Sie' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'a2-15-q15', question: 'رتّب: "هل تتفضّلون بفتح النافذة؟"', words: ['Würden', 'Sie', 'das', 'Fenster', 'öffnen'], answer: 'Würden Sie das Fenster öffnen' },
          { type: 'fill-blank', id: 'a2-15-q16', question: 'استمع: "Ich ___ gern bestellen." (مهذّب — würde)', audioPrompt: 'Ich würde gern bestellen.', answer: 'würde', hint: 'würde + Inf' },
          { type: 'multiple-choice', id: 'a2-15-q17', question: 'الفعل möchten أصله:', options: ['mögen', 'machen', 'müssen', 'müssen + möglich'], answer: 'mögen' },
          { type: 'speaking', id: 'a2-15-q18', question: 'قل بأدب: "هل بإمكانكم تكرار ذلك؟"', answer: 'Könnten Sie das wiederholen' },
          { type: 'fill-blank', id: 'a2-15-q19', question: '"Wir ___ gern einen Tisch für vier." (مهذّب)', answer: 'hätten', hint: 'hätten gern + اسم' },
          { type: 'multiple-choice', id: 'a2-15-q20', question: 'في الكلام مع غريب أو موقف رسمي:', options: ['الصيغة العادية', 'Imperativ', 'Konjunktiv II المهذّب', 'بدون أداة'], answer: 'Konjunktiv II المهذّب' },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 16 — Pronominaladverbien
    // ─────────────────────────────────────────────
    {
      id: 'a2-16',
      title: 'الظروف الضميرية — Pronominaladverbien',
      order: 16,
      grammar: {
        title: 'darüber, davon, damit + worauf, wovon, womit',
        content: `**الظروف الضميرية** (Pronominaladverbien) تُستعمل لتجنّب تكرار اسم سبق ذكره عندما يأتي بعد حرف جر — لكن **فقط حين يكون الاسم شيئاً، لا شخصاً**.

**القاعدة الذهبية:**
- شخص → حرف الجر + ضمير: *für **ihn**, mit **ihr**, von **ihm***
- شيء → **da(r) + حرف الجر**: *dafür, damit, davon, darüber, daran*

**في الأسئلة:**
- شخص → **wem / wen** + حرف الجر: *Mit wem? Auf wen?*
- شيء → **wo(r) + حرف الجر**: *Womit? Worauf? Wovon?*`,
        tables: [
          {
            title: 'الأشكال الإجابية da(r)- مع حروف الجر الشائعة',
            headers: ['حرف الجر', 'الشكل', 'مثال (إجابة)'],
            rows: [
              { cells: ['für',  'dafür',     'Bist du dafür?'] },
              { cells: ['von',  'davon',     'Ich habe davon gehört.'] },
              { cells: ['mit',  'damit',     'Was machst du damit?'] },
              { cells: ['über', 'darüber',   'Wir sprechen darüber.'], highlight: true },
              { cells: ['auf',  'darauf',    'Ich freue mich darauf.'], highlight: true },
              { cells: ['an',   'daran',     'Denkst du daran?'], highlight: true },
              { cells: ['in',   'darin',     'Was ist darin?'], highlight: true },
              { cells: ['bei',  'dabei',     'Ich habe es nicht dabei.'] },
              { cells: ['gegen','dagegen',   'Ich bin dagegen.'] },
            ],
            theme: 'default',
            note: 'الصفوف المُلوَّنة (über, auf, an, in) تأخذ حرف r إضافي إذا بدأ حرف الجر بحرف صوتي.',
          },
          {
            title: 'الأشكال الاستفهامية wo(r)- — للأسئلة',
            headers: ['حرف الجر', 'الشكل', 'مثال'],
            rows: [
              { cells: ['mit',  'womit',     'Womit fährst du?'] },
              { cells: ['von',  'wovon',     'Wovon sprichst du?'] },
              { cells: ['auf',  'worauf',    'Worauf wartest du?'] },
              { cells: ['über', 'worüber',   'Worüber lacht ihr?'] },
              { cells: ['an',   'woran',     'Woran denkst du?'] },
              { cells: ['für',  'wofür',     'Wofür ist das gut?'] },
              { cells: ['gegen','wogegen',   'Wogegen bist du?'] },
            ],
            theme: 'default',
            note: 'تستعمل هذه الأشكال للأسئلة عن الأشياء فقط — لا الأشخاص.',
          },
        ],
        rules: [
          { rule: 'الفرق بين الأشخاص والأشياء أساسي: für ihn (لشخص) ≠ dafür (لشيء).', example: 'Ich kaufe das Buch für meinen Bruder. → Für wen? / Ich brauche das für die Arbeit. → Wofür?', translation: 'أشتري الكتاب لأخي. لمن؟ / أحتاج هذا للعمل. لماذا؟' },
          { rule: 'حروف الجر التي تبدأ بحرف صوتي (a, e, i, o, u) تأخذ -r- إضافي: darüber, darauf, daran, darin.', example: 'Ich denke daran. (وليس daan)', translation: 'أفكر في ذلك.' },
          { rule: 'بعض الأفعال تتطلب حرف جر معيّن — احفظها كزوج: warten **auf**, denken **an**, sprechen **über**, sich freuen **auf**, sich interessieren **für**.', example: 'Ich warte auf den Bus. → Worauf wartest du?', translation: 'أنتظر الحافلة. ماذا تنتظر؟' },
          { rule: 'في إجابة سؤال يبدأ بـ wo(r)-، نجيب بـ da(r)-: Worüber? → Darüber.', example: 'Worauf wartest du? — Auf den Zug. / Darauf.', translation: 'ماذا تنتظر؟ — القطار. / أنتظره.' },
        ],
        examples: [
          'Ich freue mich auf das Wochenende. — Ich freue mich darauf. (أتطلّع إلى عطلة الأسبوع.)',
          'Worauf wartest du? — Auf den Bus. (ماذا تنتظر؟ — الحافلة.)',
          'Wir sprechen über das Problem. — Wir sprechen darüber. (نتحدّث عن المشكلة.)',
          'Womit fährst du? — Mit dem Auto. (بماذا تذهب؟ — بالسيارة.)',
          'Wofür ist das? — Das ist für die Arbeit. — Dafür. (لماذا هذا؟ — للعمل.)',
          'Woran denkst du? — An meine Familie. (في ماذا تفكر؟ — في عائلتي.)',
          'Bist du dafür oder dagegen? (هل أنت مع أم ضد؟)',
          'Ich habe meinen Schlüssel nicht dabei. (مفتاحي ليس معي.)',
        ],
        tip: 'احفظ 3 أزواج فعل + حرف جر يومياً (warten auf, denken an, sich freuen auf...). بعد شهر تستعمل darauf و worauf بشكل تلقائي.',
      },
      vocabulary: [
        { german: 'darüber',  arabic: 'عن ذلك',          example: 'Wir sprechen darüber.',           exampleArabic: 'نتحدّث عن ذلك.',     type: 'adverb' },
        { german: 'darauf',   arabic: 'على ذلك / إليه',  example: 'Ich freue mich darauf.',          exampleArabic: 'أتطلّع إليه.',       type: 'adverb' },
        { german: 'davon',    arabic: 'من ذلك / عنه',    example: 'Ich habe davon gehört.',          exampleArabic: 'سمعت عن ذلك.',       type: 'adverb' },
        { german: 'damit',    arabic: 'بذلك',            example: 'Was machst du damit?',            exampleArabic: 'ماذا تفعل بذلك؟',    type: 'adverb' },
        { german: 'dafür',    arabic: 'لذلك / مع',        example: 'Bist du dafür?',                  exampleArabic: 'هل أنت مع ذلك؟',     type: 'adverb' },
        { german: 'dagegen',  arabic: 'ضد ذلك',           example: 'Ich bin dagegen.',                exampleArabic: 'أنا ضد ذلك.',         type: 'adverb' },
        { german: 'daran',    arabic: 'في ذلك',           example: 'Denkst du daran?',                exampleArabic: 'هل تفكر في ذلك؟',    type: 'adverb' },
        { german: 'darin',    arabic: 'في داخل ذلك',      example: 'Was ist darin?',                   exampleArabic: 'ماذا في داخل ذلك؟',  type: 'adverb' },
        { german: 'dabei',    arabic: 'معي / لديّ',         example: 'Ich habe es nicht dabei.',         exampleArabic: 'ليس معي.',           type: 'adverb' },
        { german: 'worauf',   arabic: 'على ماذا',          example: 'Worauf wartest du?',               exampleArabic: 'ماذا تنتظر؟',        type: 'adverb' },
        { german: 'worüber',  arabic: 'عن ماذا',           example: 'Worüber sprecht ihr?',             exampleArabic: 'عن ماذا تتحدّثون؟',  type: 'adverb' },
        { german: 'wovon',    arabic: 'عن ماذا / من ماذا', example: 'Wovon sprichst du?',                exampleArabic: 'عن ماذا تتحدّث؟',    type: 'adverb' },
        { german: 'womit',    arabic: 'بماذا',             example: 'Womit fährst du?',                 exampleArabic: 'بماذا تسافر؟',       type: 'adverb' },
        { german: 'woran',    arabic: 'في ماذا',           example: 'Woran denkst du?',                 exampleArabic: 'في ماذا تفكر؟',      type: 'adverb' },
        { german: 'wofür',    arabic: 'لماذا',             example: 'Wofür ist das?',                    exampleArabic: 'لماذا هذا؟',         type: 'adverb' },
        { german: 'warten auf', arabic: 'ينتظر',            example: 'Ich warte auf den Bus.',           exampleArabic: 'أنتظر الحافلة.',     type: 'verb' },
        { german: 'denken an', arabic: 'يفكر في',          example: 'Ich denke an dich.',                exampleArabic: 'أفكر فيك.',          type: 'verb' },
        { german: 'sprechen über', arabic: 'يتحدّث عن',    example: 'Wir sprechen über die Arbeit.',    exampleArabic: 'نتحدّث عن العمل.',  type: 'verb' },
        { german: 'sich freuen auf', arabic: 'يتطلّع إلى',  example: 'Ich freue mich auf den Urlaub.',   exampleArabic: 'أتطلّع إلى الإجازة.', type: 'verb' },
        { german: 'sich freuen über', arabic: 'يفرح بـ',    example: 'Sie freut sich über das Geschenk.', exampleArabic: 'تفرح بالهدية.',     type: 'verb' },
        { german: 'sich interessieren für', arabic: 'يهتم بـ', example: 'Ich interessiere mich für Sport.', exampleArabic: 'أهتم بالرياضة.',  type: 'verb' },
        { german: 'sich kümmern um', arabic: 'يعتني بـ',    example: 'Wer kümmert sich um die Kinder?',  exampleArabic: 'من يعتني بالأطفال؟', type: 'verb' },
        { german: 'sich gewöhnen an', arabic: 'يعتاد على',  example: 'Ich gewöhne mich an das Wetter.',  exampleArabic: 'أعتاد على الجو.',    type: 'verb' },
        { german: 'achten auf', arabic: 'ينتبه إلى',         example: 'Achte auf den Verkehr!',           exampleArabic: 'انتبه إلى المرور!',  type: 'verb' },
        { german: 'sich erinnern an', arabic: 'يتذكر',       example: 'Ich erinnere mich an dich.',        exampleArabic: 'أتذكّرك.',          type: 'verb' },
        { german: 'glauben an', arabic: 'يؤمن بـ',           example: 'Ich glaube an dich.',               exampleArabic: 'أنا أؤمن بك.',      type: 'verb' },
        { german: 'die Sache', arabic: 'الشيء / الموضوع',     example: 'Was ist die Sache?',                exampleArabic: 'ما الموضوع؟',       type: 'noun', gender: 'die', plural: 'die Sachen' },
        { german: 'das Thema', arabic: 'الموضوع',             example: 'Wir haben ein wichtiges Thema.',   exampleArabic: 'لدينا موضوع مهم.',  type: 'noun', gender: 'das', plural: 'die Themen' },
        { german: 'die Frage', arabic: 'السؤال',              example: 'Eine Frage, bitte.',                exampleArabic: 'سؤال من فضلك.',     type: 'noun', gender: 'die', plural: 'die Fragen' },
        { german: 'die Antwort', arabic: 'الإجابة',            example: 'Was ist die Antwort?',              exampleArabic: 'ما الإجابة؟',       type: 'noun', gender: 'die', plural: 'die Antworten' },
        { german: 'wichtig',   arabic: 'مهم',                example: 'Das ist wichtig.',                  exampleArabic: 'هذا مهم.',           type: 'adjective' },
        { german: 'interessant', arabic: 'ممتع',              example: 'Das ist interessant.',              exampleArabic: 'هذا ممتع.',          type: 'adjective' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'a2-16-q1', question: 'الشكل الإجابي لـ "über das Problem"؟', answer: 'darüber', hint: 'da + r + über' },
          { type: 'multiple-choice', id: 'a2-16-q2', question: 'سؤال عن شيء "ماذا تنتظر؟"', options: ['Auf wen wartest du?', 'Worauf wartest du?', 'Wer wartet auf dich?', 'Wovon wartest du?'], answer: 'Worauf wartest du?' },
          { type: 'fill-blank', id: 'a2-16-q3', question: 'أكمل: "Ich freue mich ___ den Urlaub."', answer: 'auf', hint: 'sich freuen + auf' },
          { type: 'multiple-choice', id: 'a2-16-q4', question: 'إجابة "Wovon sprichst du?"', options: ['Damit', 'Davon', 'Dafür', 'Darüber'], answer: 'Davon' },
          { type: 'fill-blank', id: 'a2-16-q5', question: '"Ich denke ___ meine Familie."', answer: 'an', hint: 'denken + an' },
          { type: 'matching', id: 'a2-16-q6', question: 'اربط الفعل بحرف جره:', pairs: [
            { left: 'warten', right: 'auf' },
            { left: 'denken', right: 'an' },
            { left: 'sprechen', right: 'über' },
            { left: 'sich freuen', right: 'auf' },
            { left: 'sich interessieren', right: 'für' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'a2-16-q7', question: 'رتّب: "ماذا تفكر في ذلك؟"', words: ['Was', 'denkst', 'du', 'darüber'], answer: 'Was denkst du darüber' },
          { type: 'speaking', id: 'a2-16-q8', question: 'قل بالألمانية: "أنا أتطلّع إلى ذلك"', answer: 'Ich freue mich darauf' },
          { type: 'fill-blank', id: 'a2-16-q9', question: 'استمع: "___ ist das gut?" (لماذا؟)', audioPrompt: 'Wofür ist das gut?', answer: 'Wofür', hint: 'wo + für' },
          { type: 'multiple-choice', id: 'a2-16-q10', question: 'لشخص نقول: "Für wen?" — لشيء نقول؟', options: ['Wofür', 'Worüber', 'Worauf', 'Womit'], answer: 'Wofür' },
          { type: 'fill-blank', id: 'a2-16-q11', question: '"Ich kümmere mich ___ die Kinder."', answer: 'um', hint: 'sich kümmern + um' },
          { type: 'multiple-choice', id: 'a2-16-q12', question: 'إجابة "Womit fährst du?"', options: ['Davon', 'Damit', 'Darauf', 'Dazu'], answer: 'Damit' },
          { type: 'fill-blank', id: 'a2-16-q13', question: '"Ich erinnere mich ___ dich." (شخص)', answer: 'an', hint: 'sich erinnern + an + شخص' },
          { type: 'matching', id: 'a2-16-q14', question: 'اربط السؤال بالإجابة:', pairs: [
            { left: 'Worauf wartest du?', right: 'Auf den Bus.' },
            { left: 'Womit fährst du?', right: 'Mit dem Auto.' },
            { left: 'Wovon träumst du?', right: 'Von Deutschland.' },
            { left: 'Wofür ist das?', right: 'Für die Schule.' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'a2-16-q15', question: 'رتّب: "أتطلّع إلى عطلة الأسبوع"', words: ['Ich', 'freue', 'mich', 'auf', 'das', 'Wochenende'], answer: 'Ich freue mich auf das Wochenende' },
          { type: 'fill-blank', id: 'a2-16-q16', question: 'استمع: "Ich glaube ___ dich."', audioPrompt: 'Ich glaube an dich.', answer: 'an', hint: 'glauben + an' },
          { type: 'multiple-choice', id: 'a2-16-q17', question: 'بعد حروف الجر التي تبدأ بحرف صوتي (a/ü/ö)، نضيف:', options: ['-r-', '-d-', '-s-', '-t-'], answer: '-r-' },
          { type: 'speaking', id: 'a2-16-q18', question: 'قل: "ماذا تفكر في ذلك؟" (شيء)', answer: 'Was denkst du darüber' },
          { type: 'fill-blank', id: 'a2-16-q19', question: '"Bist du ___ oder ___?" (مع/ضد)', answer: 'dafür, dagegen', hint: 'da + für / da + gegen' },
          { type: 'multiple-choice', id: 'a2-16-q20', question: 'القاعدة الأساسية: شيء → da(r)-، شخص →:', options: ['wo(r)-', 'حرف الجر + ضمير', 'لا فرق', 'حرف الجر فقط'], answer: 'حرف الجر + ضمير' },
        ],
      },
    },
  ],
}
