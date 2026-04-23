import type { Level } from './types'

export const B2: Level = {
  id: 'B2',
  title: 'المستوى الرابع',
  description: 'الألمانية المتقدمة للعمل والجامعة.',
  color: 'bg-orange-500',
  emoji: '🎯',
  lessons: [
    // ========================= LESSON 1 =========================
    {
      id: 'b2-01',
      title: 'Nominalisierung — تحويل الأفعال إلى أسماء',
      order: 1,
      grammar: {
        title: 'Nominalstil vs. Verbalstil',
        content: `في B2، تتعلم **الأسلوب الاسمي** (Nominalstil) المستعمل في الكتابة الرسمية والعلمية والإعلام.

**قواعد التحويل:**
1. **Infinitiv → das + Infinitiv (neutrum)**
   - lesen → das Lesen (القراءة)
2. **الفعل → اسم بلاحقة -ung**
   - prüfen → die Prüfung
3. **الفعل → اسم بلاحقة -er (الفاعل)**
   - lehren → der Lehrer

**مثال مقارن:**
- Verbalstil: Wenn man die Regeln nicht beachtet, gibt es Probleme.
- Nominalstil: Bei **Nichtbeachtung** der Regeln gibt es Probleme.

⚠️ الأسلوب الاسمي مختصر ورسمي — شائع في القوانين والمقالات.`,
        tables: [
          {
            title: 'تحويل الأفعال إلى أسماء',
            theme: 'default',
            headers: ['الفعل', 'الاسم', 'الجنس'],
            rows: [
              { cells: ['lesen', 'das Lesen / die Lektüre', 'das / die'] },
              { cells: ['schreiben', 'das Schreiben / die Schrift', 'das / die'] },
              { cells: ['prüfen', 'die Prüfung', 'die'], highlight: true },
              { cells: ['entwickeln', 'die Entwicklung', 'die'] },
              { cells: ['verstehen', 'das Verständnis', 'das'] },
              { cells: ['besuchen', 'der Besuch', 'der'] },
              { cells: ['fragen', 'die Frage', 'die'] },
            ],
          },
          {
            title: 'حروف الجر الشائعة مع Nominalstil',
            theme: 'default',
            headers: ['Präposition', 'الاستعمال', 'مثال'],
            rows: [
              { cells: ['bei', 'عند/في حالة', 'bei der Prüfung'] },
              { cells: ['nach', 'بعد', 'nach dem Essen'] },
              { cells: ['vor', 'قبل', 'vor der Reise'] },
              { cells: ['durch', 'بسبب/من خلال', 'durch das Lernen'] },
              { cells: ['wegen', 'بسبب', 'wegen der Verspätung'] },
            ],
          },
        ],
        rules: [
          { rule: 'das + Infinitiv = اسم محايد', example: 'Das Lesen macht Spaß.', translation: 'القراءة ممتعة.' },
          { rule: '-ung lowers الفعل → اسم مؤنث', example: 'die Prüfung', translation: 'الامتحان' },
          { rule: 'Nominalstil في اللغة الرسمية', example: 'bei Nichterscheinen', translation: 'في حالة عدم الحضور' },
        ],
        examples: [
          'Das Lernen einer neuen Sprache braucht Zeit. — تعلّم لغة جديدة يحتاج وقتاً.',
          'Vor der Abreise muss ich packen. — قبل السفر يجب أن أحزم.',
          'Bei Regen findet die Veranstaltung nicht statt. — في حالة المطر، الفعالية لن تُقام.',
          'Die Entwicklung der Technologie ist rasant. — تطور التكنولوجيا سريع.',
          'Nach dem Abschluss suche ich Arbeit. — بعد التخرج أبحث عن عمل.',
          'Das Rauchen ist hier verboten. — التدخين ممنوع هنا.',
          'Durch intensives Üben habe ich Fortschritte gemacht. — عبر التدرب المكثف حققت تقدماً.',
          'Wegen der Verspätung kam ich zu spät. — بسبب التأخير وصلت متأخراً.',
        ],
        tip: 'لفهم الأخبار الألمانية والقوانين، أتقن Nominalstil — فقرة واحدة قد تحتوي 5-10 أسماء من أفعال.',
      },
      vocabulary: [
        { german: 'die Entwicklung', arabic: 'التطور', plural: 'die Entwicklungen', type: 'noun', gender: 'die' },
        { german: 'die Erklärung', arabic: 'الشرح', plural: 'die Erklärungen', type: 'noun', gender: 'die' },
        { german: 'die Beschreibung', arabic: 'الوصف', plural: 'die Beschreibungen', type: 'noun', gender: 'die' },
        { german: 'die Veränderung', arabic: 'التغيير', plural: 'die Veränderungen', type: 'noun', gender: 'die' },
        { german: 'die Verwendung', arabic: 'الاستعمال', plural: 'die Verwendungen', type: 'noun', gender: 'die' },
        { german: 'die Untersuchung', arabic: 'الفحص/الدراسة', plural: 'die Untersuchungen', type: 'noun', gender: 'die' },
        { german: 'die Darstellung', arabic: 'العرض/التقديم', plural: 'die Darstellungen', type: 'noun', gender: 'die' },
        { german: 'die Herstellung', arabic: 'التصنيع', type: 'noun', gender: 'die' },
        { german: 'die Behauptung', arabic: 'الادعاء', plural: 'die Behauptungen', type: 'noun', gender: 'die' },
        { german: 'die Begründung', arabic: 'التبرير', plural: 'die Begründungen', type: 'noun', gender: 'die' },
        { german: 'das Verständnis', arabic: 'الفهم', type: 'noun', gender: 'das' },
        { german: 'das Ergebnis', arabic: 'النتيجة', plural: 'die Ergebnisse', type: 'noun', gender: 'das' },
        { german: 'der Beweis', arabic: 'الدليل', plural: 'die Beweise', type: 'noun', gender: 'der' },
        { german: 'der Anstieg', arabic: 'الارتفاع', type: 'noun', gender: 'der' },
        { german: 'der Rückgang', arabic: 'التراجع', type: 'noun', gender: 'der' },
        { german: 'das Wachstum', arabic: 'النمو', type: 'noun', gender: 'das' },
        { german: 'das Verbot', arabic: 'المنع', plural: 'die Verbote', type: 'noun', gender: 'das' },
        { german: 'die Erlaubnis', arabic: 'الإذن', type: 'noun', gender: 'die' },
        { german: 'stattfinden', arabic: 'يُقام', type: 'verb' },
        { german: 'beachten', arabic: 'يلاحظ', type: 'verb' },
        { german: 'zunehmen', arabic: 'يزداد', type: 'verb' },
        { german: 'abnehmen', arabic: 'ينقص', type: 'verb' },
        { german: 'rasant', arabic: 'سريع جداً', type: 'adjective' },
      ],
      exercise: {
        questions: [
          { id: 'b2-01-q1', type: 'multiple-choice', question: 'التدخين (كاسم):', options: ['rauchen', 'das Rauchen', 'geraucht', 'Raucher'], answer: 'das Rauchen' },
          { id: 'b2-01-q2', type: 'multiple-choice', question: 'تطور التكنولوجيا:', options: ['Technologie entwickeln', 'die Entwicklung der Technologie', 'Technologie entwickelt', 'entwickelt Technologie'], answer: 'die Entwicklung der Technologie' },
          { id: 'b2-01-q3', type: 'fill-blank', question: 'Bei ___ Regen bleiben wir zu Hause. (حالة)', answer: 'Bei' },
          { id: 'b2-01-q4', type: 'fill-blank', question: 'Nach ___ Abreise war es ruhig. (der)', answer: 'der' },
          { id: 'b2-01-q5', type: 'drag-drop', question: 'رتّب: [braucht / Sprache / Das / einer / Lernen / Zeit / neuen]', words: ['Das', 'Lernen', 'einer', 'neuen', 'Sprache', 'braucht', 'Zeit'], answer: 'Das Lernen einer neuen Sprache braucht Zeit' },
          { id: 'b2-01-q6', type: 'drag-drop', question: 'رتّب: [rasant / Technologie / Die / der / ist / Entwicklung]', words: ['Die', 'Entwicklung', 'der', 'Technologie', 'ist', 'rasant'], answer: 'Die Entwicklung der Technologie ist rasant' },
          { id: 'b2-01-q7', type: 'matching', question: 'صل الفعل بالاسم:', pairs: [{ left: 'prüfen', right: 'die Prüfung' }, { left: 'entwickeln', right: 'die Entwicklung' }, { left: 'lesen', right: 'das Lesen' }, { left: 'beschreiben', right: 'die Beschreibung' }], answer: 'match' },
          { id: 'b2-01-q8', type: 'multiple-choice', question: 'اسم "verstehen"؟', options: ['der Verstehen', 'das Verständnis', 'die Versteht', 'das Verstehen'], answer: 'das Verständnis' },
          { id: 'b2-01-q9', type: 'speaking', question: 'قل: "القراءة ممتعة."', answer: 'Das Lesen macht Spaß' },
          { id: 'b2-01-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Wegen der Verspätung kam ich zu spät zur Arbeit.', options: ['وصلت متأخراً للعمل بسبب التأخير', 'وصلت مبكراً', 'لم أذهب للعمل', 'عملت في البيت'], answer: 'وصلت متأخراً للعمل بسبب التأخير' },
        ],
      },
    },
    // ========================= LESSON 2 =========================
    {
      id: 'b2-02',
      title: 'Partizip I & II als Attribute — صفات مصدرية',
      order: 2,
      grammar: {
        title: 'der lesende Mann / das gelesene Buch',
        content: `في الألمانية، يمكن استعمال **Partizip I** و **Partizip II** كصفات قبل الاسم.

**Partizip I** = فعل + **-end** → يُشير إلى فعل **جارٍ** (active, ongoing)
- lesen → lesend → der **lesende** Mann (الرجل القارئ)
- schlafen → schlafend → das **schlafende** Kind (الطفل النائم)

**Partizip II** = التصريف الثالث → يُشير إلى فعل **مكتمل** أو **مبني للمجهول**
- lesen → gelesen → das **gelesene** Buch (الكتاب المقروء)
- öffnen → geöffnet → die **geöffnete** Tür (الباب المفتوح)

⚠️ كلا النوعين يتبع قواعد **Adjektivdeklination** (-e/-en حسب الحالة).`,
        tables: [
          {
            title: 'Partizip I vs Partizip II',
            theme: 'default',
            headers: ['النوع', 'التكوين', 'المعنى', 'مثال'],
            rows: [
              { cells: ['Partizip I', 'فعل + end', 'فعل جارٍ (فاعل)', 'der singende Mann'], highlight: true },
              { cells: ['Partizip II', 'التصريف الثالث', 'فعل مكتمل/passiv', 'das gebackene Brot'] },
            ],
          },
          {
            title: 'أمثلة مع Adjektivdeklination',
            theme: 'cases',
            headers: ['الحالة', 'Partizip I', 'Partizip II'],
            rows: [
              { cells: ['Nominativ', 'der lesende Mann', 'das geschriebene Buch'] },
              { cells: ['Akkusativ', 'den lesenden Mann', 'das geschriebene Buch'] },
              { cells: ['Dativ', 'dem lesenden Mann', 'dem geschriebenen Buch'] },
            ],
          },
        ],
        rules: [
          { rule: 'Partizip I = فاعل نشط', example: 'die singende Frau', translation: 'المرأة المغنية (التي تغني)' },
          { rule: 'Partizip II = مفعول/منتهٍ', example: 'das gekochte Essen', translation: 'الطعام المطبوخ' },
          { rule: 'يتبع قواعد الصفات', example: 'mit dem laufenden Kind', translation: 'مع الطفل الراكض' },
        ],
        examples: [
          'Der schreiende Mann stört alle. — الرجل الصارخ يزعج الجميع.',
          'Das weinende Kind braucht Hilfe. — الطفل الباكي يحتاج مساعدة.',
          'Die geöffneten Fenster lassen Luft herein. — النوافذ المفتوحة تسمح بدخول الهواء.',
          'Ein lachendes Gesicht ist schön. — وجه ضاحك جميل.',
          'Das gebackene Brot duftet. — الخبز المخبوز له رائحة طيبة.',
          'Die gut informierte Bevölkerung wählt klug. — الشعب المطلع يصوّت بحكمة.',
          'Ein schlafender Hund wurde aufgeweckt. — أُيقظ كلب نائم.',
          'Der verlorene Schlüssel wurde gefunden. — وُجد المفتاح المفقود.',
        ],
        tip: 'Partizip I نادر في الكلام اليومي لكنه شائع في النصوص الأدبية والرسمية. Partizip II شائع في كل مكان.',
      },
      vocabulary: [
        { german: 'singen', arabic: 'يغني', type: 'verb' },
        { german: 'laufen', arabic: 'يجري', type: 'verb' },
        { german: 'schreien', arabic: 'يصرخ', type: 'verb' },
        { german: 'weinen', arabic: 'يبكي', type: 'verb' },
        { german: 'lachen', arabic: 'يضحك', type: 'verb' },
        { german: 'schlafen', arabic: 'ينام', type: 'verb' },
        { german: 'wachen', arabic: 'يستيقظ/يحرس', type: 'verb' },
        { german: 'wachsen', arabic: 'ينمو', type: 'verb' },
        { german: 'fließen', arabic: 'يتدفق', type: 'verb' },
        { german: 'brennen', arabic: 'يحترق', type: 'verb' },
        { german: 'verlieren', arabic: 'يفقد', type: 'verb' },
        { german: 'finden', arabic: 'يجد', type: 'verb' },
        { german: 'backen', arabic: 'يخبز', type: 'verb' },
        { german: 'kochen', arabic: 'يطبخ', type: 'verb' },
        { german: 'informieren', arabic: 'يُطلع', type: 'verb' },
        { german: 'begeistert', arabic: 'متحمس (Part. II)', type: 'adjective' },
        { german: 'erschöpft', arabic: 'منهك', type: 'adjective' },
        { german: 'verletzt', arabic: 'مصاب', type: 'adjective' },
        { german: 'überrascht', arabic: 'متفاجئ', type: 'adjective' },
        { german: 'gebraucht', arabic: 'مستعمل', type: 'adjective' },
        { german: 'erwartet', arabic: 'متوقّع', type: 'adjective' },
        { german: 'bekannt', arabic: 'معروف', type: 'adjective' },
      ],
      exercise: {
        questions: [
          { id: 'b2-02-q1', type: 'multiple-choice', question: 'الرجل القارئ:', options: ['der lesen Mann', 'der lesende Mann', 'der gelesene Mann', 'der las Mann'], answer: 'der lesende Mann' },
          { id: 'b2-02-q2', type: 'multiple-choice', question: 'الكتاب المقروء:', options: ['das lesende Buch', 'das gelesene Buch', 'das lesen Buch', 'das Lesen Buch'], answer: 'das gelesene Buch' },
          { id: 'b2-02-q3', type: 'fill-blank', question: 'Das ___ Kind. (الطفل النائم - schlafende)', answer: 'schlafende' },
          { id: 'b2-02-q4', type: 'fill-blank', question: 'Die ___ Tür. (الباب المفتوح - geöffnete)', answer: 'geöffnete' },
          { id: 'b2-02-q5', type: 'drag-drop', question: 'رتّب: [stört / schreiende / alle / Der / Mann]', words: ['Der', 'schreiende', 'Mann', 'stört', 'alle'], answer: 'Der schreiende Mann stört alle' },
          { id: 'b2-02-q6', type: 'drag-drop', question: 'رتّب: [duftet / gebackene / Das / Brot]', words: ['Das', 'gebackene', 'Brot', 'duftet'], answer: 'Das gebackene Brot duftet' },
          { id: 'b2-02-q7', type: 'matching', question: 'صل الفعل بـ Partizip I:', pairs: [{ left: 'singen', right: 'singend' }, { left: 'laufen', right: 'laufend' }, { left: 'schlafen', right: 'schlafend' }, { left: 'lachen', right: 'lachend' }], answer: 'match' },
          { id: 'b2-02-q8', type: 'multiple-choice', question: 'Partizip II من "finden":', options: ['findend', 'gefunden', 'finde', 'findet'], answer: 'gefunden' },
          { id: 'b2-02-q9', type: 'speaking', question: 'قل: "الطفل الضاحك جميل."', answer: 'Das lachende Kind ist schön' },
          { id: 'b2-02-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Der verlorene Schlüssel wurde gestern gefunden.', options: ['المفتاح المفقود وُجد أمس', 'فقدت مفتاحي', 'أبحث عن المفتاح', 'المفتاح جديد'], answer: 'المفتاح المفقود وُجد أمس' },
        ],
      },
    },
    // ========================= LESSON 3 =========================
    {
      id: 'b2-03',
      title: 'Finalsätze — جمل الهدف (um...zu / damit)',
      order: 3,
      grammar: {
        title: 'التعبير عن الهدف',
        content: `للتعبير عن **الهدف أو الغاية**، نستعمل:

**1. um ... zu + Infinitiv** (نفس الفاعل):
- Ich lerne Deutsch, **um** in Deutschland **zu arbeiten**.
  (أتعلم الألمانية لكي أعمل في ألمانيا.)

**2. damit + Nebensatz** (فاعل مختلف):
- Ich spreche langsam, **damit** du mich **verstehst**.
  (أتكلم ببطء لكي تفهمني.)

**القاعدة:**
- نفس الفاعل → **um...zu**
- فاعل مختلف → **damit**

**الفرق عن weil:**
- weil = السبب (لماذا حدث)
- um...zu / damit = الهدف (لأي غاية)`,
        tables: [
          {
            title: 'um...zu vs damit',
            theme: 'default',
            headers: ['الأداة', 'الشرط', 'الفعل'],
            rows: [
              { cells: ['um ... zu', 'نفس الفاعل', 'Infinitiv في الآخر'], highlight: true },
              { cells: ['damit', 'فاعل مختلف', 'مُصرّف في الآخر'] },
            ],
          },
          {
            title: 'مقارنة: Hedef (Finalsatz) vs Sabab (Kausalsatz)',
            theme: 'default',
            headers: ['النوع', 'الأداة', 'مثال'],
            rows: [
              { cells: ['هدف (Final)', 'um...zu / damit', 'Ich lerne, um zu bestehen.'] },
              { cells: ['سبب (Kausal)', 'weil / denn', 'Ich lerne, weil ich muss.'] },
            ],
          },
        ],
        rules: [
          { rule: 'um + zu + Infinitiv (نفس الفاعل)', example: 'Ich gehe zum Arzt, um gesund zu werden.', translation: 'أذهب للطبيب لأُشفى.' },
          { rule: 'damit + Nebensatz (فاعل مختلف)', example: 'Ich lerne, damit meine Eltern stolz sind.', translation: 'أتعلم لكي يفخر والداي.' },
          { rule: 'الفعل في الآخر مع كليهما', example: 'damit du kommst', translation: 'لكي تأتي' },
        ],
        examples: [
          'Ich arbeite, um Geld zu verdienen. — أعمل لكسب المال.',
          'Er spart, um ein Auto zu kaufen. — يوفّر لشراء سيارة.',
          'Wir lernen, um die Prüfung zu bestehen. — ندرس للنجاح في الامتحان.',
          'Ich spreche laut, damit alle mich hören. — أتكلم بصوت عالٍ لكي يسمعني الجميع.',
          'Sie kauft ein Geschenk, damit ihre Mutter sich freut. — تشتري هدية لكي تسعد أمها.',
          'Ich stehe früh auf, um pünktlich zu sein. — أستيقظ مبكراً لأكون في الموعد.',
          'Er erklärt langsam, damit wir verstehen. — يشرح ببطء لكي نفهم.',
          'Um fit zu bleiben, treibe ich Sport. — لأبقى لائقاً، أمارس الرياضة.',
        ],
        tip: 'اختبار سريع: إذا استطعت قول "um zu" (نفس الفاعل)، استعمله. وإلا استعمل "damit".',
      },
      vocabulary: [
        { german: 'das Ziel', arabic: 'الهدف', plural: 'die Ziele', type: 'noun', gender: 'das' },
        { german: 'der Zweck', arabic: 'الغرض', plural: 'die Zwecke', type: 'noun', gender: 'der' },
        { german: 'die Absicht', arabic: 'النية', plural: 'die Absichten', type: 'noun', gender: 'die' },
        { german: 'der Plan', arabic: 'الخطة', plural: 'die Pläne', type: 'noun', gender: 'der' },
        { german: 'die Motivation', arabic: 'الحافز', type: 'noun', gender: 'die' },
        { german: 'erreichen', arabic: 'يحقق', type: 'verb' },
        { german: 'verfolgen', arabic: 'يتابع', type: 'verb' },
        { german: 'planen', arabic: 'يخطط', type: 'verb' },
        { german: 'beabsichtigen', arabic: 'ينوي', type: 'verb' },
        { german: 'anstreben', arabic: 'يطمح', type: 'verb' },
        { german: 'sparen', arabic: 'يوفّر', type: 'verb' },
        { german: 'verdienen', arabic: 'يكسب', type: 'verb' },
        { german: 'investieren', arabic: 'يستثمر', type: 'verb' },
        { german: 'fit', arabic: 'لائق', type: 'adjective' },
        { german: 'pünktlich', arabic: 'في الموعد', type: 'adjective' },
        { german: 'erfolgreich', arabic: 'ناجح', type: 'adjective' },
        { german: 'stolz', arabic: 'فخور', type: 'adjective' },
        { german: 'zufrieden', arabic: 'راضٍ', type: 'adjective' },
        { german: 'der Erfolg', arabic: 'النجاح', plural: 'die Erfolge', type: 'noun', gender: 'der' },
        { german: 'das Vorhaben', arabic: 'المسعى', plural: 'die Vorhaben', type: 'noun', gender: 'das' },
        { german: 'die Bemühung', arabic: 'المسعى/الجهد', plural: 'die Bemühungen', type: 'noun', gender: 'die' },
      ],
      exercise: {
        questions: [
          { id: 'b2-03-q1', type: 'multiple-choice', question: 'أعمل لكسب المال:', options: ['Ich arbeite zu Geld verdienen', 'Ich arbeite, um Geld zu verdienen', 'Ich arbeite, damit Geld', 'Ich arbeite für Geld'], answer: 'Ich arbeite, um Geld zu verdienen' },
          { id: 'b2-03-q2', type: 'multiple-choice', question: 'أتكلم ببطء لكي تفهمني:', options: ['Ich spreche langsam, um du verstehst', 'Ich spreche langsam, damit du verstehst', 'Ich spreche langsam weil du verstehst', 'Ich spreche langsam, um zu verstehen'], answer: 'Ich spreche langsam, damit du verstehst' },
          { id: 'b2-03-q3', type: 'fill-blank', question: 'Ich lerne, ___ die Prüfung zu bestehen. (um)', answer: 'um' },
          { id: 'b2-03-q4', type: 'fill-blank', question: 'Er erklärt langsam, ___ wir verstehen. (damit)', answer: 'damit' },
          { id: 'b2-03-q5', type: 'drag-drop', question: 'رتّب: [, / verdienen / arbeite / Geld / um / Ich / zu]', words: ['Ich', 'arbeite', ',', 'um', 'Geld', 'zu', 'verdienen'], answer: 'Ich arbeite , um Geld zu verdienen' },
          { id: 'b2-03-q6', type: 'drag-drop', question: 'رتّب: [, / mich / damit / laut / Ich / hört / er / spreche]', words: ['Ich', 'spreche', 'laut', ',', 'damit', 'er', 'mich', 'hört'], answer: 'Ich spreche laut , damit er mich hört' },
          { id: 'b2-03-q7', type: 'matching', question: 'صل:', pairs: [{ left: 'um...zu', right: 'نفس الفاعل' }, { left: 'damit', right: 'فاعل مختلف' }, { left: 'weil', right: 'السبب' }, { left: 'trotzdem', right: 'رغم ذلك' }], answer: 'match' },
          { id: 'b2-03-q8', type: 'multiple-choice', question: 'Um fit ___ bleiben, treibe ich Sport.', options: ['damit', 'zu', 'für', 'mit'], answer: 'zu' },
          { id: 'b2-03-q9', type: 'speaking', question: 'قل: "أدرس لكي أنجح."', answer: 'Ich lerne, um zu bestehen' },
          { id: 'b2-03-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Ich stehe früh auf, um pünktlich zur Arbeit zu kommen.', options: ['أستيقظ مبكراً لأصل للعمل في الوقت', 'أصل متأخراً', 'أنام كثيراً', 'لا أعمل'], answer: 'أستيقظ مبكراً لأصل للعمل في الوقت' },
        ],
      },
    },
    // ========================= LESSON 4 =========================
    {
      id: 'b2-04',
      title: 'Modalverben subjektiv — الدلالة الافتراضية',
      order: 4,
      grammar: {
        title: 'Modalverben للتخمين والاحتمال',
        content: `في B2، تستعمل Modalverben بمعنى **افتراضي/ذاتي** للتعبير عن:
- **التخمين** (probability)
- **الشك** (doubt)
- **الادعاء** (claim)

**درجات اليقين:**
| الدرجة | Modalverb | مثال |
|---|---|---|
| 100% | muss | Er muss krank sein. (لا بد أنه مريض) |
| 90% | dürfte | Er dürfte krank sein. (على الأرجح مريض) |
| 60% | könnte | Er könnte krank sein. (ربما مريض) |
| الادعاء | soll | Er soll krank sein. (يُقال إنه مريض) |
| إنكار الذات | will | Er will krank sein. (يدّعي أنه مريض) |

**في الماضي:** Modalverb + Infinitiv II (Partizip II + haben/sein)
- Er **muss** krank **gewesen sein**. (لا بد أنه كان مريضاً)`,
        tables: [
          {
            title: 'Modalverben subjektiv',
            theme: 'conjugation',
            headers: ['Modalverb', 'المعنى الذاتي', 'مثال'],
            rows: [
              { cells: ['müssen', 'يقين قوي', 'Er muss zu Hause sein.'], highlight: true },
              { cells: ['dürfen (Konj II)', 'احتمال قوي', 'Es dürfte regnen.'] },
              { cells: ['können (Konj II)', 'احتمال', 'Er könnte kommen.'] },
              { cells: ['mögen', 'تقدير', 'Er mag etwa 30 sein.'] },
              { cells: ['sollen', 'يُقال / إشاعة', 'Er soll reich sein.'] },
              { cells: ['wollen', 'ادعاء ذاتي', 'Er will es gesehen haben.'] },
            ],
          },
        ],
        rules: [
          { rule: 'muss = يقين 99%', example: 'Er muss krank sein.', translation: 'لا بد أنه مريض.' },
          { rule: 'soll = ادعاء الآخرين', example: 'Sie soll reich sein.', translation: 'يُقال إنها غنية.' },
          { rule: 'Infinitiv II للماضي', example: 'Er muss es vergessen haben.', translation: 'لا بد أنه نسي.' },
        ],
        examples: [
          'Er muss sehr müde sein. — لا بد أنه متعب جداً.',
          'Das könnte stimmen. — قد يكون صحيحاً.',
          'Sie dürfte bald kommen. — من المحتمل أنها ستأتي قريباً.',
          'Er soll ein guter Arzt sein. — يُقال إنه طبيب ماهر.',
          'Sie will alles gewusst haben. — تدّعي أنها عرفت كل شيء.',
          'Das mag wahr sein. — قد يكون صحيحاً.',
          'Er muss es vergessen haben. — لا بد أنه نسي.',
          'Das kann nicht wahr sein. — هذا لا يمكن أن يكون صحيحاً.',
        ],
        tip: 'في الأخبار الألمانية، **soll** شائع جداً (للإشاعات). في نقاش العلماء **dürfte** (احتمال علمي).',
      },
      vocabulary: [
        { german: 'die Vermutung', arabic: 'الافتراض', plural: 'die Vermutungen', type: 'noun', gender: 'die' },
        { german: 'die Wahrscheinlichkeit', arabic: 'الاحتمال', type: 'noun', gender: 'die' },
        { german: 'der Zweifel', arabic: 'الشك', plural: 'die Zweifel', type: 'noun', gender: 'der' },
        { german: 'die Sicherheit', arabic: 'اليقين', type: 'noun', gender: 'die' },
        { german: 'die Gerüchteküche', arabic: 'مصدر الإشاعات', type: 'noun', gender: 'die' },
        { german: 'das Gerücht', arabic: 'الإشاعة', plural: 'die Gerüchte', type: 'noun', gender: 'das' },
        { german: 'die Behauptung', arabic: 'الادعاء', plural: 'die Behauptungen', type: 'noun', gender: 'die' },
        { german: 'offensichtlich', arabic: 'واضح', type: 'adjective' },
        { german: 'wahrscheinlich', arabic: 'محتمل', type: 'adjective' },
        { german: 'vermutlich', arabic: 'افتراضاً', type: 'adverb' },
        { german: 'angeblich', arabic: 'زعماً', type: 'adverb' },
        { german: 'sicher', arabic: 'مؤكد', type: 'adjective' },
        { german: 'unsicher', arabic: 'غير مؤكد', type: 'adjective' },
        { german: 'möglich', arabic: 'ممكن', type: 'adjective' },
        { german: 'unmöglich', arabic: 'مستحيل', type: 'adjective' },
        { german: 'vermuten', arabic: 'يفترض', type: 'verb' },
        { german: 'bezweifeln', arabic: 'يشكك', type: 'verb' },
        { german: 'behaupten', arabic: 'يدّعي', type: 'verb' },
        { german: 'glauben', arabic: 'يعتقد', type: 'verb' },
        { german: 'scheinen', arabic: 'يبدو', type: 'verb' },
        { german: 'wirken', arabic: 'يؤثّر/يبدو', type: 'verb' },
        { german: 'etwa', arabic: 'تقريباً', type: 'adverb' },
      ],
      exercise: {
        questions: [
          { id: 'b2-04-q1', type: 'multiple-choice', question: '"لا بد أنه مريض" (يقين):', options: ['Er soll krank sein', 'Er muss krank sein', 'Er will krank sein', 'Er mag krank sein'], answer: 'Er muss krank sein' },
          { id: 'b2-04-q2', type: 'multiple-choice', question: '"يُقال إنه غني":', options: ['Er muss reich sein', 'Er soll reich sein', 'Er will reich sein', 'Er kann reich sein'], answer: 'Er soll reich sein' },
          { id: 'b2-04-q3', type: 'fill-blank', question: 'Das ___ stimmen. (قد يكون - könnte)', answer: 'könnte' },
          { id: 'b2-04-q4', type: 'fill-blank', question: 'Er ___ alles gewusst haben. (يدّعي - will)', answer: 'will' },
          { id: 'b2-04-q5', type: 'drag-drop', question: 'رتّب: [sein / sehr / muss / Er / müde]', words: ['Er', 'muss', 'sehr', 'müde', 'sein'], answer: 'Er muss sehr müde sein' },
          { id: 'b2-04-q6', type: 'drag-drop', question: 'رتّب: [Arzt / guter / soll / ein / Er / sein]', words: ['Er', 'soll', 'ein', 'guter', 'Arzt', 'sein'], answer: 'Er soll ein guter Arzt sein' },
          { id: 'b2-04-q7', type: 'matching', question: 'صل:', pairs: [{ left: 'muss', right: 'يقين 99%' }, { left: 'könnte', right: 'احتمال' }, { left: 'soll', right: 'إشاعة' }, { left: 'will', right: 'ادعاء ذاتي' }], answer: 'match' },
          { id: 'b2-04-q8', type: 'multiple-choice', question: '"Er muss es vergessen ___." (في الماضي)', options: ['haben', 'hat', 'ist', 'sein'], answer: 'haben' },
          { id: 'b2-04-q9', type: 'speaking', question: 'قل: "قد يكون صحيحاً."', answer: 'Das könnte stimmen' },
          { id: 'b2-04-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Er soll in Berlin wohnen.', options: ['يسكن في برلين (مؤكد)', 'يُقال إنه يسكن في برلين', 'لا يسكن في برلين', 'كان في برلين'], answer: 'يُقال إنه يسكن في برلين' },
        ],
      },
    },
    // ========================= LESSON 5 =========================
    {
      id: 'b2-05',
      title: 'Passiv mit Modalverben',
      order: 5,
      grammar: {
        title: 'Passiv + können/müssen/sollen',
        content: `Passiv يمكن دمجه مع Modalverben للتعبير عن **الإلزام أو الإمكانية في المبني للمجهول**.

**التكوين:**
**Modalverb + Partizip II + werden**

**مثال:**
- Aktiv: Man muss das Formular ausfüllen.
- Passiv: Das Formular **muss** ausgefüllt **werden**.
  (يجب ملء الاستمارة.)

**أزمنة أخرى:**
- Präteritum: Das Formular **musste** ausgefüllt **werden**.
- Perfekt (نادر): Das Formular **hat** ausgefüllt **werden müssen**.

**بديل Passiv شائع في B2:** **sein + zu + Infinitiv**
- Das Formular **ist** auszufüllen. = muss ausgefüllt werden
- Das Auto **ist zu reparieren**. = kann/muss repariert werden`,
        tables: [
          {
            title: 'Passiv mit Modalverben',
            theme: 'conjugation',
            headers: ['Modalverb', 'Aktiv', 'Passiv'],
            rows: [
              { cells: ['müssen', 'Man muss es machen', 'Es muss gemacht werden'], highlight: true },
              { cells: ['können', 'Man kann es sehen', 'Es kann gesehen werden'] },
              { cells: ['sollen', 'Man soll es lesen', 'Es soll gelesen werden'] },
              { cells: ['dürfen', 'Man darf es nicht', 'Es darf nicht gemacht werden'] },
            ],
          },
          {
            title: 'بدائل Passiv',
            theme: 'default',
            headers: ['الصيغة', 'المعنى', 'مثال'],
            rows: [
              { cells: ['sein + zu + Inf', 'muss/kann + werden', 'Das ist zu lesen.'] },
              { cells: ['sich lassen + Inf', 'kann + werden', 'Das lässt sich machen.'] },
              { cells: ['-bar (صفة)', 'kann + werden', 'Das ist lesbar.'] },
            ],
          },
        ],
        rules: [
          { rule: 'Modalverb + PII + werden', example: 'Das muss erledigt werden.', translation: 'يجب إنجاز ذلك.' },
          { rule: 'sein + zu + Inf = Passiv + müssen/können', example: 'Das ist zu beachten.', translation: 'يجب مراعاة ذلك.' },
          { rule: '-bar = kann + werden (passiv)', example: 'essbar = kann gegessen werden', translation: 'صالح للأكل' },
        ],
        examples: [
          'Das Formular muss sofort ausgefüllt werden. — يجب ملء الاستمارة فوراً.',
          'Die Tür kann nicht geöffnet werden. — لا يمكن فتح الباب.',
          'Das Problem soll gelöst werden. — يجب حل المشكلة.',
          'Hier darf nicht geraucht werden. — لا يُسمح بالتدخين هنا.',
          'Die Regeln sind zu befolgen. — يجب اتباع القواعد.',
          'Das lässt sich nicht ändern. — لا يمكن تغيير ذلك.',
          'Dieses Wort ist leicht lesbar. — هذه الكلمة سهلة القراءة.',
          'Der Text musste bis morgen geschrieben werden. — كان يجب كتابة النص حتى الغد.',
        ],
        tip: 'في القوانين والتعليمات الألمانية، Passiv + Modalverben هو النمط الأكثر شيوعاً — أتقنه لفهم الأوراق الرسمية.',
      },
      vocabulary: [
        { german: 'erledigen', arabic: 'ينجز', type: 'verb' },
        { german: 'ausfüllen', arabic: 'يملأ', type: 'verb' },
        { german: 'befolgen', arabic: 'يتّبع', type: 'verb' },
        { german: 'beachten', arabic: 'يلتزم/يلاحظ', type: 'verb' },
        { german: 'einhalten', arabic: 'يلتزم بـ', type: 'verb' },
        { german: 'lösen', arabic: 'يحل', type: 'verb' },
        { german: 'ändern', arabic: 'يغيّر', type: 'verb' },
        { german: 'verbieten', arabic: 'يمنع', type: 'verb' },
        { german: 'erlauben', arabic: 'يسمح', type: 'verb' },
        { german: 'das Formular', arabic: 'الاستمارة', plural: 'die Formulare', type: 'noun', gender: 'das' },
        { german: 'die Regel', arabic: 'القاعدة', plural: 'die Regeln', type: 'noun', gender: 'die' },
        { german: 'die Vorschrift', arabic: 'اللائحة', plural: 'die Vorschriften', type: 'noun', gender: 'die' },
        { german: 'das Gesetz', arabic: 'القانون', plural: 'die Gesetze', type: 'noun', gender: 'das' },
        { german: 'die Anweisung', arabic: 'التعليمات', plural: 'die Anweisungen', type: 'noun', gender: 'die' },
        { german: 'erforderlich', arabic: 'مطلوب', type: 'adjective' },
        { german: 'notwendig', arabic: 'ضروري', type: 'adjective' },
        { german: 'unbedingt', arabic: 'بأي ثمن', type: 'adverb' },
        { german: 'sofort', arabic: 'فوراً', type: 'adverb' },
        { german: 'essbar', arabic: 'صالح للأكل', type: 'adjective' },
        { german: 'lesbar', arabic: 'قابل للقراءة', type: 'adjective' },
        { german: 'lösbar', arabic: 'قابل للحل', type: 'adjective' },
        { german: 'machbar', arabic: 'ممكن', type: 'adjective' },
      ],
      exercise: {
        questions: [
          { id: 'b2-05-q1', type: 'multiple-choice', question: 'يجب ملء الاستمارة:', options: ['Das Formular muss ausfüllen', 'Das Formular muss ausgefüllt werden', 'Das Formular füllt aus', 'Das Formular ist ausfüllen'], answer: 'Das Formular muss ausgefüllt werden' },
          { id: 'b2-05-q2', type: 'multiple-choice', question: 'لا يمكن فتح الباب:', options: ['Die Tür kann nicht öffnen', 'Die Tür öffnet nicht', 'Die Tür kann nicht geöffnet werden', 'Die Tür hat nicht geöffnet'], answer: 'Die Tür kann nicht geöffnet werden' },
          { id: 'b2-05-q3', type: 'fill-blank', question: 'Hier darf nicht ___ werden. (يُدَخَّن - geraucht)', answer: 'geraucht' },
          { id: 'b2-05-q4', type: 'fill-blank', question: 'Das Problem soll ___ werden. (يُحَل - gelöst)', answer: 'gelöst' },
          { id: 'b2-05-q5', type: 'drag-drop', question: 'رتّب: [werden / muss / Das Formular / ausgefüllt]', words: ['Das', 'Formular', 'muss', 'ausgefüllt', 'werden'], answer: 'Das Formular muss ausgefüllt werden' },
          { id: 'b2-05-q6', type: 'drag-drop', question: 'رتّب: [zu / Die Regeln / befolgen / sind]', words: ['Die', 'Regeln', 'sind', 'zu', 'befolgen'], answer: 'Die Regeln sind zu befolgen' },
          { id: 'b2-05-q7', type: 'matching', question: 'صل Aktiv بـ Passiv:', pairs: [{ left: 'Man muss es machen', right: 'Es muss gemacht werden' }, { left: 'Man kann es sehen', right: 'Es kann gesehen werden' }, { left: 'Man darf nicht rauchen', right: 'Es darf nicht geraucht werden' }], answer: 'match' },
          { id: 'b2-05-q8', type: 'multiple-choice', question: '"essbar" = ?', options: ['muss gegessen werden', 'kann gegessen werden', 'isst', 'aß'], answer: 'kann gegessen werden' },
          { id: 'b2-05-q9', type: 'speaking', question: 'قل: "يجب حل المشكلة."', answer: 'Das Problem muss gelöst werden' },
          { id: 'b2-05-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Hier darf nicht geraucht werden.', options: ['يمكن التدخين هنا', 'لا يُسمح بالتدخين هنا', 'يوجد دخان هنا', 'التدخين جيد'], answer: 'لا يُسمح بالتدخين هنا' },
        ],
      },
    },
    // ========================= LESSON 6 =========================
    {
      id: 'b2-06',
      title: 'Verben mit Präpositionen — الأفعال مع حروف الجر',
      order: 6,
      grammar: {
        title: 'warten auf, denken an, sprechen über',
        content: `كثير من الأفعال الألمانية تُستعمل مع **حرف جر ثابت** وحالة محددة. يجب حفظها معاً.

**أمثلة مهمة:**
- **warten auf + Akk** — ينتظر
- **denken an + Akk** — يفكر في
- **sprechen über + Akk** — يتحدث عن
- **sich freuen auf + Akk** — يتطلع إلى
- **sich freuen über + Akk** — يُسرّ بـ
- **sich interessieren für + Akk** — يهتم بـ
- **teilnehmen an + Dat** — يشارك في
- **arbeiten an + Dat** — يعمل على
- **Angst haben vor + Dat** — يخاف من

⚠️ **wo-/da-Komposita:** عند الأشياء نستعمل **darauf, daran, darüber** بدل "auf es":
- Ich denke **daran**. (أفكر فيه - شيء)
- Ich denke **an ihn**. (أفكر فيه - شخص)`,
        tables: [
          {
            title: 'أهم الأفعال مع حروف الجر',
            theme: 'default',
            headers: ['الفعل', 'Präposition', 'Kasus', 'المعنى'],
            rows: [
              { cells: ['warten', 'auf', 'Akk', 'ينتظر'], highlight: true },
              { cells: ['denken', 'an', 'Akk', 'يفكر في'] },
              { cells: ['sich erinnern', 'an', 'Akk', 'يتذكر'] },
              { cells: ['sprechen', 'über/von', 'Akk/Dat', 'يتحدث عن'] },
              { cells: ['sich freuen', 'auf/über', 'Akk', 'يتطلع إلى / يُسرّ بـ'] },
              { cells: ['sich interessieren', 'für', 'Akk', 'يهتم بـ'] },
              { cells: ['teilnehmen', 'an', 'Dat', 'يشارك في'] },
              { cells: ['Angst haben', 'vor', 'Dat', 'يخاف من'] },
              { cells: ['träumen', 'von', 'Dat', 'يحلم بـ'] },
            ],
          },
          {
            title: 'wo-/da-Komposita',
            theme: 'default',
            headers: ['Präposition', 'للشيء (da-)', 'للسؤال (wo-)'],
            rows: [
              { cells: ['auf', 'darauf', 'worauf'] },
              { cells: ['an', 'daran', 'woran'] },
              { cells: ['über', 'darüber', 'worüber'] },
              { cells: ['für', 'dafür', 'wofür'] },
              { cells: ['von', 'davon', 'wovon'] },
            ],
          },
        ],
        rules: [
          { rule: 'احفظ الفعل + حرف الجر + الحالة', example: 'warten auf + Akk', translation: 'ينتظر' },
          { rule: 'da- للأشياء', example: 'Ich denke daran.', translation: 'أفكر فيه (شيء).' },
          { rule: 'auf + ihn للأشخاص', example: 'Ich warte auf ihn.', translation: 'أنتظره.' },
        ],
        examples: [
          'Ich warte auf den Bus. — أنتظر الحافلة.',
          'Sie denkt an ihre Familie. — تفكر في عائلتها.',
          'Wir sprechen über das Wetter. — نتحدث عن الطقس.',
          'Er interessiert sich für Politik. — يهتم بالسياسة.',
          'Sie freut sich auf das Wochenende. — تتطلع إلى نهاية الأسبوع.',
          'Ich habe Angst vor Spinnen. — أخاف من العناكب.',
          'Woran denkst du? — فيم تفكر؟',
          'Ich träume davon, nach Japan zu reisen. — أحلم بالسفر إلى اليابان.',
        ],
        tip: 'اصنع دفتراً للأفعال مع حروف الجر — احفظ 5 جديدة كل أسبوع حتى تصل 100.',
      },
      vocabulary: [
        { german: 'warten auf', arabic: 'ينتظر', type: 'verb' },
        { german: 'denken an', arabic: 'يفكر في', type: 'verb' },
        { german: 'sich erinnern an', arabic: 'يتذكر', type: 'verb' },
        { german: 'sich freuen auf', arabic: 'يتطلع إلى', type: 'verb' },
        { german: 'sich freuen über', arabic: 'يُسَرّ بـ', type: 'verb' },
        { german: 'sich interessieren für', arabic: 'يهتم بـ', type: 'verb' },
        { german: 'sich ärgern über', arabic: 'ينزعج من', type: 'verb' },
        { german: 'sich kümmern um', arabic: 'يعتني بـ', type: 'verb' },
        { german: 'sich entschuldigen für', arabic: 'يعتذر عن', type: 'verb' },
        { german: 'sich bewerben um', arabic: 'يتقدم لـ', type: 'verb' },
        { german: 'teilnehmen an', arabic: 'يشارك في', type: 'verb' },
        { german: 'arbeiten an', arabic: 'يعمل على', type: 'verb' },
        { german: 'glauben an', arabic: 'يؤمن بـ', type: 'verb' },
        { german: 'helfen bei', arabic: 'يساعد في', type: 'verb' },
        { german: 'Angst haben vor', arabic: 'يخاف من', type: 'verb' },
        { german: 'träumen von', arabic: 'يحلم بـ', type: 'verb' },
        { german: 'sprechen über', arabic: 'يتحدث عن', type: 'verb' },
        { german: 'achten auf', arabic: 'ينتبه إلى', type: 'verb' },
        { german: 'sich gewöhnen an', arabic: 'يتعود على', type: 'verb' },
        { german: 'bestehen aus', arabic: 'يتكون من', type: 'verb' },
        { german: 'verzichten auf', arabic: 'يستغني عن', type: 'verb' },
        { german: 'hoffen auf', arabic: 'يأمل في', type: 'verb' },
      ],
      exercise: {
        questions: [
          { id: 'b2-06-q1', type: 'multiple-choice', question: '"أنتظر الحافلة":', options: ['Ich warte für den Bus', 'Ich warte auf den Bus', 'Ich warte zu dem Bus', 'Ich warte mit dem Bus'], answer: 'Ich warte auf den Bus' },
          { id: 'b2-06-q2', type: 'multiple-choice', question: '"أفكر في عائلتي":', options: ['Ich denke an meine Familie', 'Ich denke über meine Familie', 'Ich denke für meine Familie', 'Ich denke von meine Familie'], answer: 'Ich denke an meine Familie' },
          { id: 'b2-06-q3', type: 'fill-blank', question: 'Sie interessiert sich ___ Politik. (für)', answer: 'für' },
          { id: 'b2-06-q4', type: 'fill-blank', question: 'Ich habe Angst ___ Spinnen. (vor)', answer: 'vor' },
          { id: 'b2-06-q5', type: 'drag-drop', question: 'رتّب: [Wochenende / das / auf / freue / mich / Ich]', words: ['Ich', 'freue', 'mich', 'auf', 'das', 'Wochenende'], answer: 'Ich freue mich auf das Wochenende' },
          { id: 'b2-06-q6', type: 'drag-drop', question: 'رتّب: [denkst / Woran / du / ?]', words: ['Woran', 'denkst', 'du', '?'], answer: 'Woran denkst du ?' },
          { id: 'b2-06-q7', type: 'matching', question: 'صل الفعل بحرف جره:', pairs: [{ left: 'warten', right: 'auf + Akk' }, { left: 'träumen', right: 'von + Dat' }, { left: 'Angst haben', right: 'vor + Dat' }, { left: 'sich interessieren', right: 'für + Akk' }], answer: 'match' },
          { id: 'b2-06-q8', type: 'multiple-choice', question: '"أفكر فيه" (شيء):', options: ['Ich denke an es', 'Ich denke darauf', 'Ich denke daran', 'Ich denke ihn'], answer: 'Ich denke daran' },
          { id: 'b2-06-q9', type: 'speaking', question: 'قل: "أنتظر الحافلة."', answer: 'Ich warte auf den Bus' },
          { id: 'b2-06-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Er träumt davon, Arzt zu werden.', options: ['هو طبيب', 'يحلم بأن يصبح طبيباً', 'لا يريد أن يصبح طبيباً', 'كان طبيباً'], answer: 'يحلم بأن يصبح طبيباً' },
        ],
      },
    },
    // ========================= LESSON 7 =========================
    {
      id: 'b2-07',
      title: 'Adjektive mit Präpositionen',
      order: 7,
      grammar: {
        title: 'stolz auf, verliebt in, zufrieden mit',
        content: `مثل الأفعال، كثير من الصفات تأخذ **حرف جر ثابت**.

**الأكثر شيوعاً:**
- **stolz auf + Akk** — فخور بـ
- **verliebt in + Akk** — واقع في حب
- **zufrieden mit + Dat** — راضٍ بـ
- **böse auf + Akk** — غاضب من
- **bereit zu + Dat** — مستعد لـ
- **abhängig von + Dat** — يعتمد على
- **interessiert an + Dat** — مهتم بـ
- **fähig zu + Dat** — قادر على
- **freundlich zu + Dat** — ودود مع
- **reich an + Dat** — غني بـ
- **arm an + Dat** — فقير في

⚠️ هذه الصفات تُستعمل عادةً مع **sein**: Ich bin stolz auf dich.`,
        tables: [
          {
            title: 'أهم الصفات مع حروف الجر',
            theme: 'default',
            headers: ['Adjektiv', 'Präp.', 'Kasus', 'المعنى'],
            rows: [
              { cells: ['stolz', 'auf', 'Akk', 'فخور بـ'], highlight: true },
              { cells: ['zufrieden', 'mit', 'Dat', 'راضٍ بـ'] },
              { cells: ['verliebt', 'in', 'Akk', 'واقع في حب'] },
              { cells: ['eifersüchtig', 'auf', 'Akk', 'غيور من'] },
              { cells: ['böse', 'auf', 'Akk', 'غاضب من'] },
              { cells: ['interessiert', 'an', 'Dat', 'مهتم بـ'] },
              { cells: ['abhängig', 'von', 'Dat', 'يعتمد على'] },
              { cells: ['verantwortlich', 'für', 'Akk', 'مسؤول عن'] },
              { cells: ['traurig', 'über', 'Akk', 'حزين على'] },
              { cells: ['fähig', 'zu', 'Dat', 'قادر على'] },
            ],
          },
        ],
        rules: [
          { rule: 'sein + Adjektiv + Präp + Kasus', example: 'Ich bin stolz auf dich.', translation: 'أنا فخور بك.' },
          { rule: 'auf + Akk شائع للعواطف', example: 'böse auf ihn', translation: 'غاضب منه' },
          { rule: 'mit + Dat للرضا والاتفاق', example: 'zufrieden mit dem Ergebnis', translation: 'راضٍ بالنتيجة' },
        ],
        examples: [
          'Ich bin stolz auf meine Eltern. — أنا فخور بوالديّ.',
          'Er ist zufrieden mit seiner Arbeit. — هو راضٍ بعمله.',
          'Sie ist verliebt in ihn. — هي واقعة في حبه.',
          'Bist du böse auf mich? — هل أنت غاضب مني؟',
          'Ich bin bereit zum Abflug. — أنا مستعد للإقلاع.',
          'Marokko ist reich an Kultur. — المغرب غني بالثقافة.',
          'Er ist verantwortlich für das Projekt. — هو مسؤول عن المشروع.',
          'Wir sind alle abhängig vom Internet. — كلنا نعتمد على الإنترنت.',
        ],
        tip: 'Kapitel-Trick: احفظ الصفة + حرف الجر كوحدة واحدة: "stolz-auf", "zufrieden-mit".',
      },
      vocabulary: [
        { german: 'stolz', arabic: 'فخور', type: 'adjective' },
        { german: 'zufrieden', arabic: 'راضٍ', type: 'adjective' },
        { german: 'unzufrieden', arabic: 'غير راضٍ', type: 'adjective' },
        { german: 'verliebt', arabic: 'واقع في حب', type: 'adjective' },
        { german: 'eifersüchtig', arabic: 'غيور', type: 'adjective' },
        { german: 'böse', arabic: 'غاضب/شرير', type: 'adjective' },
        { german: 'freundlich', arabic: 'ودود', type: 'adjective' },
        { german: 'nett', arabic: 'لطيف', type: 'adjective' },
        { german: 'bereit', arabic: 'مستعد', type: 'adjective' },
        { german: 'fähig', arabic: 'قادر', type: 'adjective' },
        { german: 'unfähig', arabic: 'عاجز', type: 'adjective' },
        { german: 'verantwortlich', arabic: 'مسؤول', type: 'adjective' },
        { german: 'abhängig', arabic: 'مُعتمد', type: 'adjective' },
        { german: 'unabhängig', arabic: 'مستقل', type: 'adjective' },
        { german: 'interessiert', arabic: 'مهتم', type: 'adjective' },
        { german: 'begeistert', arabic: 'متحمس', type: 'adjective' },
        { german: 'überrascht', arabic: 'متفاجئ', type: 'adjective' },
        { german: 'traurig', arabic: 'حزين', type: 'adjective' },
        { german: 'glücklich', arabic: 'سعيد', type: 'adjective' },
        { german: 'dankbar', arabic: 'شاكر', type: 'adjective' },
        { german: 'reich', arabic: 'غني', type: 'adjective' },
        { german: 'arm', arabic: 'فقير', type: 'adjective' },
      ],
      exercise: {
        questions: [
          { id: 'b2-07-q1', type: 'multiple-choice', question: '"فخور بك":', options: ['stolz über dich', 'stolz auf dich', 'stolz für dich', 'stolz von dich'], answer: 'stolz auf dich' },
          { id: 'b2-07-q2', type: 'multiple-choice', question: '"راضٍ بعمله":', options: ['zufrieden auf seine Arbeit', 'zufrieden für seine Arbeit', 'zufrieden mit seiner Arbeit', 'zufrieden über seine Arbeit'], answer: 'zufrieden mit seiner Arbeit' },
          { id: 'b2-07-q3', type: 'fill-blank', question: 'Sie ist verliebt ___ ihn. (in)', answer: 'in' },
          { id: 'b2-07-q4', type: 'fill-blank', question: 'Er ist verantwortlich ___ das Projekt. (für)', answer: 'für' },
          { id: 'b2-07-q5', type: 'drag-drop', question: 'رتّب: [stolz / meine / auf / Eltern / bin / Ich]', words: ['Ich', 'bin', 'stolz', 'auf', 'meine', 'Eltern'], answer: 'Ich bin stolz auf meine Eltern' },
          { id: 'b2-07-q6', type: 'drag-drop', question: 'رتّب: [Kultur / Marokko / an / ist / reich]', words: ['Marokko', 'ist', 'reich', 'an', 'Kultur'], answer: 'Marokko ist reich an Kultur' },
          { id: 'b2-07-q7', type: 'matching', question: 'صل الصفة بحرف جرها:', pairs: [{ left: 'stolz', right: 'auf + Akk' }, { left: 'zufrieden', right: 'mit + Dat' }, { left: 'abhängig', right: 'von + Dat' }, { left: 'fähig', right: 'zu + Dat' }], answer: 'match' },
          { id: 'b2-07-q8', type: 'multiple-choice', question: '"Wir sind abhängig ___ Internet."', options: ['über dem', 'mit dem', 'vom', 'bei dem'], answer: 'vom' },
          { id: 'b2-07-q9', type: 'speaking', question: 'قل: "أنا فخور بوالديّ."', answer: 'Ich bin stolz auf meine Eltern' },
          { id: 'b2-07-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Bist du böse auf mich?', options: ['هل أنت غاضب مني؟', 'هل أنت لطيف؟', 'هل تحبني؟', 'هل تحتاج مساعدة؟'], answer: 'هل أنت غاضب مني؟' },
        ],
      },
    },
    // ========================= LESSON 8 =========================
    {
      id: 'b2-08',
      title: 'Konnektoren B2 — sodass, je...desto, anstatt',
      order: 8,
      grammar: {
        title: 'أدوات ربط متقدمة',
        content: `في B2، تتعلم أدوات ربط أكثر دقة:

**1. sodass / so...dass** (نتيجة):
- Es regnet stark, **sodass** wir zu Hause bleiben.
- Es ist **so** kalt, **dass** ich friere.

**2. je...desto/umso** (مقارنة متوازنة):
- **Je** mehr du lernst, **desto** besser wirst du.
- **Je** älter, **umso** klüger.

**3. anstatt...zu / statt...zu** (بديل):
- **Anstatt** zu arbeiten, schläft er.
- **Statt** Deutsch zu lernen, spielt er.

**4. ohne...zu** (بدون):
- Er ging, **ohne** zu grüßen.

**5. als ob / als wenn + Konjunktiv II** (كما لو):
- Er tut, **als ob** er krank **wäre**.

⚠️ **je + مقارن** → **desto/umso + مقارن** (بالترتيب)`,
        tables: [
          {
            title: 'Konnektoren B2',
            theme: 'default',
            headers: ['Konnektor', 'المعنى', 'مثال'],
            rows: [
              { cells: ['sodass', 'لدرجة أن', 'Es regnet, sodass wir bleiben.'], highlight: true },
              { cells: ['je...desto', 'كلما...كلما', 'Je mehr, desto besser.'] },
              { cells: ['anstatt...zu', 'بدلاً من', 'Anstatt zu essen, schläft er.'] },
              { cells: ['ohne...zu', 'دون أن', 'Er geht, ohne zu sprechen.'] },
              { cells: ['als ob', 'كما لو', 'Er tut, als ob er krank wäre.'] },
              { cells: ['indem', 'عن طريق', 'Ich lerne, indem ich lese.'] },
            ],
          },
        ],
        rules: [
          { rule: 'sodass = نتيجة', example: 'Er ist müde, sodass er schläft.', translation: 'هو متعب لذلك ينام.' },
          { rule: 'je + Komp, desto + Komp', example: 'Je schneller, desto besser.', translation: 'كلما أسرع، كلما أفضل.' },
          { rule: 'als ob + Konjunktiv II', example: 'Er tut, als ob er reich wäre.', translation: 'يتصرف كما لو كان غنياً.' },
        ],
        examples: [
          'Es regnet stark, sodass wir zu Hause bleiben. — تمطر بقوة، لذلك نبقى في البيت.',
          'Je mehr du übst, desto besser wirst du. — كلما تمرّنت أكثر، كلما تحسّنت.',
          'Anstatt zu lernen, spielt er am Handy. — بدلاً من الدراسة، يلعب بالهاتف.',
          'Er ging, ohne ein Wort zu sagen. — ذهب دون أن يقول كلمة.',
          'Sie tut, als ob sie alles wüsste. — تتصرف كما لو كانت تعرف كل شيء.',
          'Ich lerne Deutsch, indem ich jeden Tag lese. — أتعلم الألمانية بالقراءة اليومية.',
          'Je älter er wird, desto ruhiger ist er. — كلما كبر في السن، أصبح أهدأ.',
          'Es ist so kalt, dass ich friere. — الجو بارد جداً لدرجة أنني أتجمد.',
        ],
        tip: 'للكتابة في B2، استعمل Konnektoren متنوعة — ليس كل شيء "weil" و"aber". اصنع قائمة 15 Konnektor وطبّقها.',
      },
      vocabulary: [
        { german: 'sodass', arabic: 'لدرجة أن', type: 'conjunction' },
        { german: 'je ... desto', arabic: 'كلما ... كلما', type: 'conjunction' },
        { german: 'je ... umso', arabic: 'كلما ... كلما', type: 'conjunction' },
        { german: 'anstatt', arabic: 'بدلاً من', type: 'conjunction' },
        { german: 'ohne', arabic: 'بدون', type: 'preposition' },
        { german: 'als ob', arabic: 'كما لو', type: 'conjunction' },
        { german: 'als wenn', arabic: 'كما لو', type: 'conjunction' },
        { german: 'indem', arabic: 'عن طريق', type: 'conjunction' },
        { german: 'nachdem', arabic: 'بعد أن', type: 'conjunction' },
        { german: 'sobald', arabic: 'بمجرد أن', type: 'conjunction' },
        { german: 'solange', arabic: 'ما دام', type: 'conjunction' },
        { german: 'während', arabic: 'بينما', type: 'conjunction' },
        { german: 'inzwischen', arabic: 'في هذه الأثناء', type: 'adverb' },
        { german: 'vorher', arabic: 'قبل ذلك', type: 'adverb' },
        { german: 'hinterher', arabic: 'بعد ذلك', type: 'adverb' },
        { german: 'zunächst', arabic: 'في البداية', type: 'adverb' },
        { german: 'schließlich', arabic: 'في النهاية', type: 'adverb' },
        { german: 'dennoch', arabic: 'ومع ذلك', type: 'adverb' },
        { german: 'jedoch', arabic: 'لكن', type: 'adverb' },
        { german: 'allerdings', arabic: 'غير أن', type: 'adverb' },
        { german: 'einerseits', arabic: 'من ناحية', type: 'adverb' },
        { german: 'andererseits', arabic: 'من ناحية أخرى', type: 'adverb' },
      ],
      exercise: {
        questions: [
          { id: 'b2-08-q1', type: 'multiple-choice', question: '"كلما تمرّنت أكثر كلما تحسنت":', options: ['Wenn du mehr übst, bist du besser', 'Je mehr du übst, desto besser wirst du', 'Während du übst, wirst du besser', 'Nachdem du übst, bist du besser'], answer: 'Je mehr du übst, desto besser wirst du' },
          { id: 'b2-08-q2', type: 'multiple-choice', question: '"بدلاً من الدراسة":', options: ['Statt zu lernen', 'Während zu lernen', 'Ohne zu lernen', 'Um zu lernen'], answer: 'Statt zu lernen' },
          { id: 'b2-08-q3', type: 'fill-blank', question: 'Es regnet, ___ wir bleiben. (sodass)', answer: 'sodass' },
          { id: 'b2-08-q4', type: 'fill-blank', question: 'Er tut, ___ ob er krank wäre. (als)', answer: 'als' },
          { id: 'b2-08-q5', type: 'drag-drop', question: 'رتّب: [desto / Je / besser / lernst / , / mehr / du / wirst / du]', words: ['Je', 'mehr', 'du', 'lernst', ',', 'desto', 'besser', 'wirst', 'du'], answer: 'Je mehr du lernst , desto besser wirst du' },
          { id: 'b2-08-q6', type: 'drag-drop', question: 'رتّب: [zu / sagen / Er / Wort / ein / ohne / ging]', words: ['Er', 'ging', 'ohne', 'ein', 'Wort', 'zu', 'sagen'], answer: 'Er ging ohne ein Wort zu sagen' },
          { id: 'b2-08-q7', type: 'matching', question: 'صل:', pairs: [{ left: 'sodass', right: 'نتيجة' }, { left: 'je...desto', right: 'مقارنة متوازنة' }, { left: 'als ob', right: 'كما لو' }, { left: 'indem', right: 'عن طريق' }], answer: 'match' },
          { id: 'b2-08-q8', type: 'multiple-choice', question: 'Ich lerne, ___ ich lese.', options: ['damit', 'um', 'indem', 'weil'], answer: 'indem' },
          { id: 'b2-08-q9', type: 'speaking', question: 'قل: "كلما أسرعت، كلما أفضل."', answer: 'Je schneller, desto besser' },
          { id: 'b2-08-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Anstatt zu lernen, spielt er am Handy.', options: ['يدرس ويلعب', 'بدلاً من الدراسة يلعب بالهاتف', 'يدرس بالهاتف', 'لا يدرس ولا يلعب'], answer: 'بدلاً من الدراسة يلعب بالهاتف' },
        ],
      },
    },
    // ========================= LESSON 9 =========================
    {
      id: 'b2-09',
      title: 'Arbeitswelt und Karriere',
      order: 9,
      grammar: {
        title: 'لغة عالم العمل المتقدمة',
        content: `في B2، تتقن لغة العمل المتقدمة: التفاوض، الإدارة، التقارير.

**مواضيع مهمة:**
- **Führung** (القيادة): leiten, führen, verantwortlich
- **Teamarbeit** (العمل الجماعي): Zusammenarbeit, Kollegen
- **Konflikt** (الصراع): Streit lösen, Kompromiss
- **Gehaltsverhandlung** (التفاوض على الراتب)
- **Work-Life-Balance** (التوازن بين العمل والحياة)

**عبارات نقاشية:**
- "Meiner Einschätzung nach..." (حسب تقييمي)
- "Ich plädiere dafür, dass..." (أؤيد أن)
- "Das spricht dafür / dagegen" (هذا يدعم / يُعارض)

⚠️ القواعد المهمة: Konjunktiv II للأدب، Passiv، Nominalstil.`,
        tables: [
          {
            title: 'مفردات الإدارة والعمل',
            theme: 'default',
            headers: ['بالعربية', 'بالألمانية'],
            rows: [
              { cells: ['المدير التنفيذي', 'der Geschäftsführer'] },
              { cells: ['رئيس القسم', 'der Abteilungsleiter'] },
              { cells: ['الاجتماع', 'die Besprechung / das Meeting'] },
              { cells: ['المشروع', 'das Projekt'] },
              { cells: ['الموعد النهائي', 'die Deadline / der Termin'] },
              { cells: ['التقرير', 'der Bericht'] },
              { cells: ['الزيادة', 'die Gehaltserhöhung'] },
              { cells: ['الترقية', 'die Beförderung'] },
            ],
          },
        ],
        rules: [
          { rule: 'leiten + Akk', example: 'Er leitet das Projekt.', translation: 'يدير المشروع.' },
          { rule: 'verantwortlich für + Akk', example: 'Ich bin verantwortlich für die Kunden.', translation: 'أنا مسؤول عن العملاء.' },
          { rule: 'sich bewerben um + Akk', example: 'Sie bewirbt sich um eine Beförderung.', translation: 'تتقدم للترقية.' },
        ],
        examples: [
          'Unser Team arbeitet an einem wichtigen Projekt. — فريقنا يعمل على مشروع مهم.',
          'Die Besprechung findet um 10 Uhr statt. — الاجتماع الساعة 10.',
          'Ich möchte eine Gehaltserhöhung besprechen. — أريد مناقشة زيادة الراتب.',
          'Der Chef hat ihn befördert. — رقّاه المدير.',
          'Wir müssen die Deadline einhalten. — يجب الالتزام بالموعد النهائي.',
          'Teamarbeit ist sehr wichtig. — العمل الجماعي مهم جداً.',
          'Er hat gekündigt und ist zu einer anderen Firma gegangen. — استقال وذهب لشركة أخرى.',
          'Die Work-Life-Balance ist schwer zu erreichen. — التوازن بين العمل والحياة صعب التحقيق.',
        ],
        tip: 'في Goethe B2 الكتابي، ستكتب إيميلاً رسمياً — احفظ 10 عبارات رسمية جاهزة للاستعمال.',
      },
      vocabulary: [
        { german: 'der Geschäftsführer', arabic: 'المدير العام', plural: 'die Geschäftsführer', type: 'noun', gender: 'der' },
        { german: 'die Abteilung', arabic: 'القسم', plural: 'die Abteilungen', type: 'noun', gender: 'die' },
        { german: 'die Besprechung', arabic: 'الاجتماع', plural: 'die Besprechungen', type: 'noun', gender: 'die' },
        { german: 'das Projekt', arabic: 'المشروع', plural: 'die Projekte', type: 'noun', gender: 'das' },
        { german: 'der Termin', arabic: 'الموعد', plural: 'die Termine', type: 'noun', gender: 'der' },
        { german: 'die Deadline', arabic: 'الموعد النهائي', type: 'noun', gender: 'die' },
        { german: 'die Gehaltserhöhung', arabic: 'زيادة الراتب', plural: 'die Gehaltserhöhungen', type: 'noun', gender: 'die' },
        { german: 'die Beförderung', arabic: 'الترقية', plural: 'die Beförderungen', type: 'noun', gender: 'die' },
        { german: 'die Kündigung', arabic: 'الاستقالة', plural: 'die Kündigungen', type: 'noun', gender: 'die' },
        { german: 'die Einstellung', arabic: 'التوظيف', plural: 'die Einstellungen', type: 'noun', gender: 'die' },
        { german: 'die Teamarbeit', arabic: 'العمل الجماعي', type: 'noun', gender: 'die' },
        { german: 'die Zusammenarbeit', arabic: 'التعاون', type: 'noun', gender: 'die' },
        { german: 'der Konflikt', arabic: 'الصراع', plural: 'die Konflikte', type: 'noun', gender: 'der' },
        { german: 'der Kompromiss', arabic: 'التسوية', plural: 'die Kompromisse', type: 'noun', gender: 'der' },
        { german: 'die Verantwortung', arabic: 'المسؤولية', plural: 'die Verantwortungen', type: 'noun', gender: 'die' },
        { german: 'leiten', arabic: 'يدير', type: 'verb' },
        { german: 'führen', arabic: 'يقود', type: 'verb' },
        { german: 'verhandeln', arabic: 'يتفاوض', type: 'verb' },
        { german: 'entscheiden', arabic: 'يقرر', type: 'verb' },
        { german: 'befördern', arabic: 'يُرقّي', type: 'verb' },
        { german: 'entlassen', arabic: 'يفصل', type: 'verb' },
        { german: 'einstellen', arabic: 'يوظف', type: 'verb' },
      ],
      exercise: {
        questions: [
          { id: 'b2-09-q1', type: 'multiple-choice', question: 'الاجتماع:', options: ['die Abteilung', 'die Besprechung', 'das Projekt', 'der Bericht'], answer: 'die Besprechung' },
          { id: 'b2-09-q2', type: 'multiple-choice', question: 'زيادة الراتب:', options: ['die Kündigung', 'die Gehaltserhöhung', 'die Einstellung', 'der Vertrag'], answer: 'die Gehaltserhöhung' },
          { id: 'b2-09-q3', type: 'fill-blank', question: 'Er ___ das Projekt. (يدير - leitet)', answer: 'leitet' },
          { id: 'b2-09-q4', type: 'fill-blank', question: 'Ich bin verantwortlich ___ die Kunden. (für)', answer: 'für' },
          { id: 'b2-09-q5', type: 'drag-drop', question: 'رتّب: [einhalten / die / wir / Deadline / müssen]', words: ['Wir', 'müssen', 'die', 'Deadline', 'einhalten'], answer: 'Wir müssen die Deadline einhalten' },
          { id: 'b2-09-q6', type: 'drag-drop', question: 'رتّب: [eine / besprechen / Ich / Gehaltserhöhung / möchte]', words: ['Ich', 'möchte', 'eine', 'Gehaltserhöhung', 'besprechen'], answer: 'Ich möchte eine Gehaltserhöhung besprechen' },
          { id: 'b2-09-q7', type: 'matching', question: 'صل:', pairs: [{ left: 'Teamarbeit', right: 'العمل الجماعي' }, { left: 'Beförderung', right: 'الترقية' }, { left: 'Kündigung', right: 'الاستقالة' }, { left: 'Kompromiss', right: 'التسوية' }], answer: 'match' },
          { id: 'b2-09-q8', type: 'multiple-choice', question: 'يتفاوض:', options: ['verhandeln', 'verstehen', 'versprechen', 'verlieren'], answer: 'verhandeln' },
          { id: 'b2-09-q9', type: 'speaking', question: 'قل: "فريقنا يعمل على مشروع مهم."', answer: 'Unser Team arbeitet an einem wichtigen Projekt' },
          { id: 'b2-09-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Der Chef hat ihn letzte Woche befördert.', options: ['فصل المدير', 'رقاه المدير الأسبوع الماضي', 'كان المدير', 'عمل مع المدير'], answer: 'رقاه المدير الأسبوع الماضي' },
        ],
      },
    },
    // ========================= LESSON 10 =========================
    {
      id: 'b2-10',
      title: 'Bildung und Studium — التعليم والجامعة',
      order: 10,
      grammar: {
        title: 'الدراسة الجامعية في ألمانيا',
        content: `لمن يدرس في ألمانيا، هذه المفردات والتراكيب ضرورية:

**مراحل الدراسة:**
- **Bachelor** (البكالوريوس) — 6 فصول عادةً
- **Master** (الماستر) — 4 فصول
- **Promotion / Doktorarbeit** (الدكتوراه)

**المصطلحات الجامعية:**
- **die Vorlesung** (المحاضرة)
- **das Seminar** (الدرس التطبيقي)
- **die Übung** (التمرين)
- **die Klausur** (الامتحان الكتابي)
- **die Hausarbeit** (الورقة البحثية)
- **die Bachelorarbeit** / **Masterarbeit**

**القواعد المهمة:** Passiv (التعليمات)، Konjunktiv II (الأدب)، Nominalstil.`,
        tables: [
          {
            title: 'نظام الدراسة الألماني',
            theme: 'default',
            headers: ['المرحلة', 'المدة', 'المؤهل'],
            rows: [
              { cells: ['Abitur', 'نهاية الثانوية', 'شهادة البكالوريا'] },
              { cells: ['Bachelor', '3 سنوات', 'B.A. / B.Sc.'] },
              { cells: ['Master', '2 سنوات', 'M.A. / M.Sc.'] },
              { cells: ['Promotion', '3-5 سنوات', 'Dr.'] },
            ],
          },
        ],
        rules: [
          { rule: 'studieren + Akk (تخصص)', example: 'Ich studiere Informatik.', translation: 'أدرس علوم الحاسوب.' },
          { rule: 'sich einschreiben an + Dat', example: 'Ich schreibe mich an der Uni ein.', translation: 'أسجل في الجامعة.' },
          { rule: 'eine Prüfung ablegen', example: 'Ich lege eine Prüfung ab.', translation: 'أؤدي امتحاناً.' },
        ],
        examples: [
          'Ich studiere Medizin an der Universität München. — أدرس الطب في جامعة ميونخ.',
          'Die Vorlesung beginnt um 8 Uhr. — تبدأ المحاضرة الساعة 8.',
          'Ich schreibe meine Bachelorarbeit über KI. — أكتب رسالة البكالوريوس عن الذكاء الاصطناعي.',
          'Er hat die Klausur bestanden. — نجح في الامتحان.',
          'Sie ist durchgefallen. — رسبت.',
          'Nach dem Bachelor mache ich einen Master. — بعد البكالوريوس سأدرس ماستر.',
          'Die Zulassung zum Studium ist schwierig. — القبول بالدراسة صعب.',
          'Ich bewerbe mich für ein Stipendium. — أتقدم لمنحة دراسية.',
        ],
        tip: 'كطالب أجنبي، ابحث عن **DAAD-Stipendium** — منحة دراسية ألمانية مشهورة.',
      },
      vocabulary: [
        { german: 'die Universität', arabic: 'الجامعة', plural: 'die Universitäten', type: 'noun', gender: 'die' },
        { german: 'die Hochschule', arabic: 'المعهد العالي', plural: 'die Hochschulen', type: 'noun', gender: 'die' },
        { german: 'die Fakultät', arabic: 'الكلية', plural: 'die Fakultäten', type: 'noun', gender: 'die' },
        { german: 'das Studium', arabic: 'الدراسة', type: 'noun', gender: 'das' },
        { german: 'das Fach', arabic: 'التخصص', plural: 'die Fächer', type: 'noun', gender: 'das' },
        { german: 'das Semester', arabic: 'الفصل الدراسي', plural: 'die Semester', type: 'noun', gender: 'das' },
        { german: 'die Vorlesung', arabic: 'المحاضرة', plural: 'die Vorlesungen', type: 'noun', gender: 'die' },
        { german: 'das Seminar', arabic: 'الدرس التطبيقي', plural: 'die Seminare', type: 'noun', gender: 'das' },
        { german: 'die Übung', arabic: 'التمرين', plural: 'die Übungen', type: 'noun', gender: 'die' },
        { german: 'die Klausur', arabic: 'الامتحان الكتابي', plural: 'die Klausuren', type: 'noun', gender: 'die' },
        { german: 'die Hausarbeit', arabic: 'الواجب/البحث', plural: 'die Hausarbeiten', type: 'noun', gender: 'die' },
        { german: 'die Bachelorarbeit', arabic: 'رسالة البكالوريوس', type: 'noun', gender: 'die' },
        { german: 'die Masterarbeit', arabic: 'رسالة الماستر', type: 'noun', gender: 'die' },
        { german: 'das Stipendium', arabic: 'المنحة', plural: 'die Stipendien', type: 'noun', gender: 'das' },
        { german: 'die Zulassung', arabic: 'القبول', plural: 'die Zulassungen', type: 'noun', gender: 'die' },
        { german: 'die Immatrikulation', arabic: 'التسجيل الجامعي', type: 'noun', gender: 'die' },
        { german: 'der Professor', arabic: 'الأستاذ', plural: 'die Professoren', type: 'noun', gender: 'der' },
        { german: 'der Dozent', arabic: 'المحاضر', plural: 'die Dozenten', type: 'noun', gender: 'der' },
        { german: 'bestehen', arabic: 'ينجح', type: 'verb' },
        { german: 'durchfallen', arabic: 'يرسب', type: 'verb' },
        { german: 'studieren', arabic: 'يدرس (جامعياً)', type: 'verb' },
        { german: 'sich einschreiben', arabic: 'يسجل', type: 'verb' },
      ],
      exercise: {
        questions: [
          { id: 'b2-10-q1', type: 'multiple-choice', question: 'المحاضرة:', options: ['die Klausur', 'die Vorlesung', 'die Übung', 'das Seminar'], answer: 'die Vorlesung' },
          { id: 'b2-10-q2', type: 'multiple-choice', question: 'أدرس الطب:', options: ['Ich lerne Medizin', 'Ich studiere Medizin', 'Ich unterrichte Medizin', 'Ich arbeite Medizin'], answer: 'Ich studiere Medizin' },
          { id: 'b2-10-q3', type: 'fill-blank', question: 'Er hat die Klausur ___. (bestanden)', answer: 'bestanden' },
          { id: 'b2-10-q4', type: 'fill-blank', question: 'Ich bewerbe mich für ein ___. (منحة)', answer: 'Stipendium' },
          { id: 'b2-10-q5', type: 'drag-drop', question: 'رتّب: [Bachelorarbeit / ich / meine / schreibe / KI / über]', words: ['Ich', 'schreibe', 'meine', 'Bachelorarbeit', 'über', 'KI'], answer: 'Ich schreibe meine Bachelorarbeit über KI' },
          { id: 'b2-10-q6', type: 'drag-drop', question: 'رتّب: [um / Vorlesung / 8 Uhr / Die / beginnt]', words: ['Die', 'Vorlesung', 'beginnt', 'um', '8', 'Uhr'], answer: 'Die Vorlesung beginnt um 8 Uhr' },
          { id: 'b2-10-q7', type: 'matching', question: 'صل:', pairs: [{ left: 'Universität', right: 'جامعة' }, { left: 'Semester', right: 'فصل دراسي' }, { left: 'Klausur', right: 'امتحان كتابي' }, { left: 'Stipendium', right: 'منحة' }], answer: 'match' },
          { id: 'b2-10-q8', type: 'multiple-choice', question: 'بعد البكالوريوس:', options: ['Abitur', 'Promotion', 'Master', 'Schule'], answer: 'Master' },
          { id: 'b2-10-q9', type: 'speaking', question: 'قل: "أدرس في جامعة ميونخ."', answer: 'Ich studiere an der Universität München' },
          { id: 'b2-10-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Sie hat die Klausur bestanden und freut sich sehr.', options: ['رسبت في الامتحان', 'نجحت في الامتحان وفرحت جداً', 'لم تذهب للامتحان', 'ستؤدي الامتحان غداً'], answer: 'نجحت في الامتحان وفرحت جداً' },
        ],
      },
    },
    // ========================= LESSON 11 =========================
    {
      id: 'b2-11',
      title: 'Meinung und Argumentation — الحجاج والرأي',
      order: 11,
      grammar: {
        title: 'بناء حجة متكاملة',
        content: `في Goethe B2 Schreiben، تكتب **تعليقاً** (Kommentar) من 150 كلمة. يجب أن تتضمن:

**هيكل الحجة:**
1. **Einleitung** (مقدمة): عرض الموضوع
2. **These** (الأطروحة): رأيك الرئيسي
3. **Argumente** (الحجج): 2-3 حجج مع أمثلة
4. **Gegenargument** (الحجة المضادة): ثم دحضها
5. **Schluss** (الخاتمة): تلخيص ودعوة للتفكير

**عبارات المقدمة:**
- "In den letzten Jahren wird häufig darüber diskutiert, ob..."
- "Ein aktuelles Thema ist..."

**عبارات الحجج:**
- "Erstens... zweitens... drittens..."
- "Ein weiterer Grund ist..."
- "Darüber hinaus..."
- "Nicht zuletzt..."

**عبارات الخاتمة:**
- "Zusammenfassend lässt sich sagen, dass..."
- "Meiner Meinung nach..."`,
        tables: [
          {
            title: 'عبارات الحجاج',
            theme: 'default',
            headers: ['الوظيفة', 'العبارة'],
            rows: [
              { cells: ['تقديم رأي', 'Ich bin der Meinung, dass...'], highlight: true },
              { cells: ['إضافة حجة', 'Außerdem / Darüber hinaus'] },
              { cells: ['حجة مضادة', 'Allerdings / Dennoch'] },
              { cells: ['مثال', 'Zum Beispiel / Beispielsweise'] },
              { cells: ['نتيجة', 'Daher / Folglich / Somit'] },
              { cells: ['خاتمة', 'Abschließend / Zusammenfassend'] },
            ],
          },
        ],
        rules: [
          { rule: 'Ich bin der Meinung, dass + آخر الجملة', example: 'Ich bin der Meinung, dass das wichtig ist.', translation: 'أرى أن هذا مهم.' },
          { rule: 'Einerseits ... andererseits', example: 'Einerseits gut, andererseits teuer.', translation: 'من ناحية جيد، من ناحية أخرى غالٍ.' },
          { rule: 'Aus meiner Sicht', example: 'Aus meiner Sicht ist es falsch.', translation: 'من وجهة نظري، هذا خطأ.' },
        ],
        examples: [
          'Meiner Meinung nach ist Bildung am wichtigsten. — في رأيي، التعليم هو الأهم.',
          'Ich bin der festen Überzeugung, dass Umweltschutz Priorität hat. — أنا مقتنع تماماً أن حماية البيئة أولوية.',
          'Einerseits ist das Internet nützlich, andererseits gefährlich. — من ناحية الإنترنت مفيد، من ناحية أخرى خطير.',
          'Ein Argument dafür ist, dass... — حجة لصالح ذلك هي...',
          'Dagegen spricht, dass... — ما يعارض ذلك هو...',
          'Zusammenfassend kann man sagen, dass wir handeln müssen. — باختصار، يمكن القول إن علينا التحرك.',
          'Ich bin davon überzeugt, dass... — أنا مقتنع بأن...',
          'Das führt zu der Schlussfolgerung, dass... — هذا يؤدي إلى الاستنتاج بأن...',
        ],
        tip: 'احفظ 20 عبارة جاهزة للحجاج — استعملها في كل كتابة B2/C1.',
      },
      vocabulary: [
        { german: 'die Meinung', arabic: 'الرأي', plural: 'die Meinungen', type: 'noun', gender: 'die' },
        { german: 'die Überzeugung', arabic: 'القناعة', plural: 'die Überzeugungen', type: 'noun', gender: 'die' },
        { german: 'das Argument', arabic: 'الحجة', plural: 'die Argumente', type: 'noun', gender: 'das' },
        { german: 'der Standpunkt', arabic: 'وجهة النظر', plural: 'die Standpunkte', type: 'noun', gender: 'der' },
        { german: 'die These', arabic: 'الأطروحة', plural: 'die Thesen', type: 'noun', gender: 'die' },
        { german: 'die Diskussion', arabic: 'النقاش', plural: 'die Diskussionen', type: 'noun', gender: 'die' },
        { german: 'die Debatte', arabic: 'المناظرة', plural: 'die Debatten', type: 'noun', gender: 'die' },
        { german: 'der Kommentar', arabic: 'التعليق', plural: 'die Kommentare', type: 'noun', gender: 'der' },
        { german: 'die Kritik', arabic: 'النقد', plural: 'die Kritiken', type: 'noun', gender: 'die' },
        { german: 'die Schlussfolgerung', arabic: 'الاستنتاج', plural: 'die Schlussfolgerungen', type: 'noun', gender: 'die' },
        { german: 'kritisieren', arabic: 'ينتقد', type: 'verb' },
        { german: 'verteidigen', arabic: 'يدافع', type: 'verb' },
        { german: 'zustimmen', arabic: 'يوافق', type: 'verb' },
        { german: 'widersprechen', arabic: 'يعارض', type: 'verb' },
        { german: 'bezweifeln', arabic: 'يشكك', type: 'verb' },
        { german: 'befürworten', arabic: 'يؤيد', type: 'verb' },
        { german: 'ablehnen', arabic: 'يرفض', type: 'verb' },
        { german: 'betonen', arabic: 'يشدد', type: 'verb' },
        { german: 'einräumen', arabic: 'يعترف بـ', type: 'verb' },
        { german: 'meiner Meinung nach', arabic: 'في رأيي', type: 'phrase' },
        { german: 'aus meiner Sicht', arabic: 'من وجهة نظري', type: 'phrase' },
        { german: 'im Gegensatz zu', arabic: 'على عكس', type: 'phrase' },
      ],
      exercise: {
        questions: [
          { id: 'b2-11-q1', type: 'multiple-choice', question: '"في رأيي":', options: ['Mit meine Meinung', 'Meine Meinung nach', 'Meiner Meinung nach', 'Für meine Meinung'], answer: 'Meiner Meinung nach' },
          { id: 'b2-11-q2', type: 'multiple-choice', question: '"باختصار":', options: ['Zusammenfassend', 'Außerdem', 'Dennoch', 'Beispielsweise'], answer: 'Zusammenfassend' },
          { id: 'b2-11-q3', type: 'fill-blank', question: 'Ich bin der ___, dass es wichtig ist. (Meinung)', answer: 'Meinung' },
          { id: 'b2-11-q4', type: 'fill-blank', question: '___ meiner Sicht ist das falsch. (Aus)', answer: 'Aus' },
          { id: 'b2-11-q5', type: 'drag-drop', question: 'رتّب: [ist / Meiner / Bildung / wichtig / Meinung / nach / am]', words: ['Meiner', 'Meinung', 'nach', 'ist', 'Bildung', 'am', 'wichtig'], answer: 'Meiner Meinung nach ist Bildung am wichtig' },
          { id: 'b2-11-q6', type: 'drag-drop', question: 'رتّب: [dass / Ich / wichtig / Meinung / , / der / bin / ist / das]', words: ['Ich', 'bin', 'der', 'Meinung', ',', 'dass', 'das', 'wichtig', 'ist'], answer: 'Ich bin der Meinung , dass das wichtig ist' },
          { id: 'b2-11-q7', type: 'matching', question: 'صل:', pairs: [{ left: 'Meinung', right: 'رأي' }, { left: 'Argument', right: 'حجة' }, { left: 'Schlussfolgerung', right: 'استنتاج' }, { left: 'Kritik', right: 'نقد' }], answer: 'match' },
          { id: 'b2-11-q8', type: 'multiple-choice', question: '"Einerseits ... ___":', options: ['sondern', 'trotzdem', 'andererseits', 'deshalb'], answer: 'andererseits' },
          { id: 'b2-11-q9', type: 'speaking', question: 'قل: "أنا مقتنع بأن التعليم مهم."', answer: 'Ich bin davon überzeugt, dass Bildung wichtig ist' },
          { id: 'b2-11-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Zusammenfassend lässt sich sagen, dass wir handeln müssen.', options: ['لا داعي للتحرك', 'باختصار يمكن القول إن علينا التحرك', 'سنتحرك غداً', 'لا نريد التحرك'], answer: 'باختصار يمكن القول إن علينا التحرك' },
        ],
      },
    },
    // ========================= LESSON 12 =========================
    {
      id: 'b2-12',
      title: 'Wiederholung B2 — مراجعة شاملة',
      order: 12,
      grammar: {
        title: 'خلاصة B2 والاستعداد لـ Goethe-Zertifikat B2',
        content: `**ما تعلمته في B2:**

✅ **Nominalstil** — das Lesen / die Verwendung
✅ **Partizipialattribute** — der lesende Mann / das gelesene Buch
✅ **Finalsätze** — um...zu / damit
✅ **Modalverben subjektiv** — muss / dürfte / soll / will
✅ **Passiv mit Modalverben** — muss gemacht werden
✅ **Verben + Präpositionen** — warten auf, denken an
✅ **Adjektive + Präpositionen** — stolz auf, zufrieden mit
✅ **Konnektoren B2** — sodass, je...desto, als ob
✅ **Argumentation** — Kommentar schreiben

**امتحان Goethe B2:**
- **Lesen** (65 دقيقة): 5 نصوص
- **Hören** (40 دقيقة): حوارات وأخبار
- **Schreiben** (75 دقيقة): Forum-Beitrag + E-Mail
- **Sprechen** (15 دقيقة): عرض + نقاش

**نصائح:**
- اقرأ Der Spiegel, Die Zeit — 10 دقائق يومياً
- استمع إلى Deutschlandfunk, Tagesschau
- تكلم مع ناطقين أصليين أسبوعياً (Tandem)`,
        tables: [
          {
            title: 'ملخص أهم القواعد',
            theme: 'default',
            headers: ['القاعدة', 'المثال'],
            rows: [
              { cells: ['Nominalstil', 'das Lernen einer Sprache'] },
              { cells: ['Partizipialattribut', 'der arbeitende Mann'] },
              { cells: ['Finalsatz', 'Ich lerne, um zu bestehen.'] },
              { cells: ['Passiv + Modal', 'Es muss gemacht werden.'] },
              { cells: ['je...desto', 'Je mehr, desto besser.'], highlight: true },
              { cells: ['als ob + Konj II', 'Er tut, als ob er krank wäre.'] },
            ],
          },
        ],
        rules: [
          { rule: 'تنويع الجمل يُحسّن الكتابة', example: 'Er ist müde. Trotzdem arbeitet er.', translation: 'هو متعب. رغم ذلك يعمل.' },
          { rule: 'Konnektoren تربط الأفكار', example: 'Einerseits ... andererseits', translation: 'من ناحية ... من ناحية أخرى' },
          { rule: 'Passiv في الرسميات', example: 'Das muss getan werden.', translation: 'يجب فعل ذلك.' },
        ],
        examples: [
          'Das Lernen einer Fremdsprache erfordert Geduld. — تعلم لغة أجنبية يتطلب صبراً.',
          'Je mehr man übt, desto besser wird man. — كلما تمرّن المرء، تحسّن.',
          'Er tut, als ob er alles wüsste. — يتصرف كما لو كان يعرف كل شيء.',
          'Das Formular muss sofort ausgefüllt werden. — يجب ملء الاستمارة فوراً.',
          'Ich interessiere mich sehr für Politik. — أهتم كثيراً بالسياسة.',
          'Anstatt zu lernen, schaut er fern. — بدلاً من الدراسة، يشاهد التلفاز.',
          'Sie ist stolz auf ihre Leistung. — هي فخورة بإنجازها.',
          'Meiner Meinung nach ist Bildung der Schlüssel. — في رأيي، التعليم هو المفتاح.',
        ],
        tip: 'بعد B2، تستطيع العمل والدراسة الجامعية في ألمانيا. C1 هو المستوى المطلوب للوظائف الأكاديمية والطبية.',
      },
      vocabulary: [
        { german: 'die Prüfung', arabic: 'الامتحان', plural: 'die Prüfungen', type: 'noun', gender: 'die' },
        { german: 'die Vorbereitung', arabic: 'التحضير', type: 'noun', gender: 'die' },
        { german: 'das Zertifikat', arabic: 'الشهادة', plural: 'die Zertifikate', type: 'noun', gender: 'das' },
        { german: 'der Fortschritt', arabic: 'التقدم', plural: 'die Fortschritte', type: 'noun', gender: 'der' },
        { german: 'die Herausforderung', arabic: 'التحدي', plural: 'die Herausforderungen', type: 'noun', gender: 'die' },
        { german: 'das Ziel', arabic: 'الهدف', plural: 'die Ziele', type: 'noun', gender: 'das' },
        { german: 'die Leistung', arabic: 'الإنجاز/الأداء', plural: 'die Leistungen', type: 'noun', gender: 'die' },
        { german: 'der Schlüssel', arabic: 'المفتاح', plural: 'die Schlüssel', type: 'noun', gender: 'der' },
        { german: 'die Grundlage', arabic: 'الأساس', plural: 'die Grundlagen', type: 'noun', gender: 'die' },
        { german: 'das Niveau', arabic: 'المستوى', plural: 'die Niveaus', type: 'noun', gender: 'das' },
        { german: 'vertiefen', arabic: 'يعمّق', type: 'verb' },
        { german: 'beherrschen', arabic: 'يتقن', type: 'verb' },
        { german: 'aneignen', arabic: 'يكتسب', type: 'verb' },
        { german: 'anwenden', arabic: 'يطبّق', type: 'verb' },
        { german: 'verbessern', arabic: 'يحسّن', type: 'verb' },
        { german: 'fortgeschritten', arabic: 'متقدم', type: 'adjective' },
        { german: 'professionell', arabic: 'احترافي', type: 'adjective' },
        { german: 'akademisch', arabic: 'أكاديمي', type: 'adjective' },
        { german: 'wissenschaftlich', arabic: 'علمي', type: 'adjective' },
        { german: 'komplex', arabic: 'معقد', type: 'adjective' },
        { german: 'vielfältig', arabic: 'متنوع', type: 'adjective' },
        { german: 'Glückwunsch!', arabic: 'تهانينا!', type: 'phrase' },
      ],
      exercise: {
        questions: [
          { id: 'b2-12-q1', type: 'multiple-choice', question: 'Partizip I من "schreiben":', options: ['geschrieben', 'schreibend', 'schreibt', 'schrieb'], answer: 'schreibend' },
          { id: 'b2-12-q2', type: 'multiple-choice', question: 'Passiv + müssen (ملء الاستمارة):', options: ['Das Formular muss ausfüllen', 'Das Formular muss ausgefüllt werden', 'Das Formular füllt aus', 'Das Formular wird ausfüllen'], answer: 'Das Formular muss ausgefüllt werden' },
          { id: 'b2-12-q3', type: 'fill-blank', question: 'Ich warte ___ den Bus. (auf)', answer: 'auf' },
          { id: 'b2-12-q4', type: 'fill-blank', question: 'Je mehr, ___ besser. (desto)', answer: 'desto' },
          { id: 'b2-12-q5', type: 'drag-drop', question: 'رتّب: [werden / Das / gemacht / muss / sofort]', words: ['Das', 'muss', 'sofort', 'gemacht', 'werden'], answer: 'Das muss sofort gemacht werden' },
          { id: 'b2-12-q6', type: 'drag-drop', question: 'رتّب: [meine / stolz / Ich / auf / bin / Leistung]', words: ['Ich', 'bin', 'stolz', 'auf', 'meine', 'Leistung'], answer: 'Ich bin stolz auf meine Leistung' },
          { id: 'b2-12-q7', type: 'matching', question: 'صل القاعدة بالمثال:', pairs: [{ left: 'Nominalstil', right: 'das Lernen' }, { left: 'um...zu', right: 'um zu lernen' }, { left: 'je...desto', right: 'je mehr, desto besser' }, { left: 'als ob', right: 'als ob er krank wäre' }], answer: 'match' },
          { id: 'b2-12-q8', type: 'multiple-choice', question: '"Er tut, ___ ob er schläft." (als)', options: ['als', 'wie', 'wenn', 'weil'], answer: 'als' },
          { id: 'b2-12-q9', type: 'speaking', question: 'قل: "أتعلم بكل يوم."', answer: 'Ich lerne jeden Tag' },
          { id: 'b2-12-q10', type: 'multiple-choice', question: 'استمع:', audioPrompt: 'Glückwunsch! Du hast B2 erreicht.', options: ['لم تصل بعد', 'تهانينا! لقد وصلت B2', 'أعد الامتحان', 'المستوى C1'], answer: 'تهانينا! لقد وصلت B2' },
        ],
      },
    },
  ],
}
