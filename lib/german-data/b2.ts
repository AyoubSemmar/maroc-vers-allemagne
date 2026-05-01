import type { Level } from './types'

export const B2: Level = {
  id: 'B2',
  title: 'المستوى الرابع',
  description: 'الألمانية المتقدمة للعمل والجامعة.',
  color: 'bg-orange-500',
  emoji: '🎯',
  iconName: 'target',
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
    // ─────────────────────────────────────────────
    // LESSON 13 — Konjunktiv I (الكلام غير المباشر الرسمي)
    // ─────────────────────────────────────────────
    {
      id: 'b2-13',
      title: 'الكلام غير المباشر الرسمي — Konjunktiv I',
      order: 13,
      grammar: {
        title: 'Konjunktiv I لنقل أقوال الآخرين بحياد + متى نلجأ لـ Konjunktiv II',
        content: `الـ **Konjunktiv I** هو صيغة خاصة لنقل أقوال الآخرين دون تأكيدها أو إنكارها — تستعمل في الصحف والأخبار والتقارير الرسمية. الهدف: **النقل المحايد** (= "وفقاً لما قاله...").\n\n→ Der Minister **sagt**, er **habe** keine Zeit. (الوزير يقول إنه لا وقت لديه — كذا وفقاً لقوله)\n\nفي الكلام اليومي يستعمل الناطقون **dass-Satz + Indikativ** أو **Konjunktiv II** بدلاً منه — Konjunktiv I يبقى للسياقات الرسمية والصحفية. اختبار B2 (telc/Goethe) يختبره — لا تتجاوزه.`,
        tables: [
          { title: 'Konjunktiv I — تصريف الأفعال الشائعة', headers: ['Pronomen', 'sein', 'haben', 'sagen', 'kommen'], rows: [
            { cells: ['ich', 'sei', 'habe', 'sage', 'komme'] },
            { cells: ['du', 'sei(e)st', 'habest', 'sagest', 'kommest'] },
            { cells: ['er/sie/es', 'sei', 'habe', 'sage', 'komme'], highlight: true },
            { cells: ['wir', 'seien', 'haben', 'sagen', 'kommen'] },
            { cells: ['ihr', 'seiet', 'habet', 'saget', 'kommet'] },
            { cells: ['sie/Sie', 'seien', 'haben', 'sagen', 'kommen'] },
          ], theme: 'conjugation', note: 'sein هو الوحيد المنتظم تماماً في Konj. I. الباقي يضيف -e- على الجذر.' },
          { title: 'متى نلجأ لـ Konjunktiv II', headers: ['الحالة', 'مثال', 'السبب'], rows: [
            { cells: ['Konj.I = Indikativ', 'sie sagen → sie sagen', 'لا فرق — استبدله بـ würde + Inf'] },
            { cells: ['البديل', 'sie würden sagen', 'يحلّ الالتباس'] },
            { cells: ['ich/wir غالباً', 'ich habe → ich hätte', 'لتجنّب اللبس مع Indikativ'] },
          ], theme: 'default', note: 'القاعدة: إذا تطابق Konj. I مع الحاضر العادي، استبدله بـ Konj. II أو würde+Inf.' },
          { title: 'صيغ Konjunktiv I في الأزمنة', headers: ['الزمن', 'البنية', 'مثال'], rows: [
            { cells: ['Präsens (Konj.I)', 'فعل + -e/-est/-e/-en/-et/-en', 'Er sage, dass...'] },
            { cells: ['Vergangenheit (Konj.I)', 'habe/sei + Partizip II', 'Sie habe das gesagt.'] },
            { cells: ['Zukunft (Konj.I)', 'werde + Infinitiv', 'Er werde kommen.'] },
          ], theme: 'default', note: 'الماضي في Konj. I يستعمل دائماً Perfekt (haben/sein + Partizip).' },
        ],
        rules: [
          { rule: 'في الكلام غير المباشر الرسمي، استعمل Konj. I دون "dass"؛ ترتيب الكلمات يبقى كالجملة العادية.', example: 'Er sagt, er habe Zeit. (وليس Er sagt, dass er habe Zeit.)', translation: 'يقول إنه لديه وقت.' },
          { rule: 'إذا تطابقت Konj. I مع Indikativ، استبدلها بـ Konj. II (würde + Inf أو forme einfach).', example: 'sie sagen → sie würden sagen / sie sagten', translation: 'يقولون.' },
          { rule: 'اقتصر استعمال Konj. I على الصحافة، التقارير، الكتابة الأكاديمية، والامتحانات الرسمية.', example: 'In den Nachrichten: "Der Präsident habe das nicht gewusst."', translation: 'في الأخبار: الرئيس قال إنه لم يكن يعلم.' },
          { rule: 'صيغة sei/seien في Konj. I تُستعمل أيضاً في تعليمات وصفات الطعام: "Man nehme..."', example: 'Man nehme drei Eier.', translation: 'يؤخذ ثلاث بيضات. (وصفة)' },
        ],
        examples: [
          'Der Politiker sagt, er sei unschuldig. — السياسي يقول إنه بريء.',
          'Sie behauptet, sie habe nichts davon gewusst. — تدّعي أنها لم تكن تعلم.',
          'Laut der Studie nehme die Inflation zu. — وفقاً للدراسة، التضخم يتزايد.',
          'Der Arzt erklärt, der Patient brauche mehr Ruhe. — الطبيب يوضّح أن المريض يحتاج راحة أكثر.',
          'Er fragt, ob sie kommen werde. — يسأل ما إذا كانت ستأتي.',
          'Die Zeitung berichtet, der Minister habe das Land verlassen. — الصحيفة تذكر أن الوزير غادر البلد.',
          'Man sage, das Wetter werde besser. — يُقال إن الطقس سيتحسّن.',
        ],
        tip: 'اختبار B2 يختبر بالأخص نقل الأخبار من المباشر إلى Konj. I. تدرّب 10 جمل يومياً من الجرائد الألمانية: حوّل "ich sage" إلى "er sagt, er sage". خلال أسبوعين تتقن البنية.',
      },
      vocabulary: [
        { german: 'sagen', arabic: 'يقول', example: 'Er sagt, er habe Zeit.', exampleArabic: 'يقول إن لديه وقتاً.', type: 'verb' },
        { german: 'behaupten', arabic: 'يدّعي', example: 'Sie behauptet, sie sei krank.', exampleArabic: 'تدّعي أنها مريضة.', type: 'verb' },
        { german: 'erklären', arabic: 'يوضّح', example: 'Er erklärt, das sei einfach.', exampleArabic: 'يوضّح أن ذلك سهل.', type: 'verb' },
        { german: 'berichten', arabic: 'يذكر / يبلّغ', example: 'Die Presse berichtet, er sei zurückgetreten.', exampleArabic: 'الصحافة تذكر أنه استقال.', type: 'verb' },
        { german: 'meinen', arabic: 'يعتقد / يقصد', example: 'Sie meint, ich hätte das gesagt.', exampleArabic: 'تعتقد أنني قلت ذلك.', type: 'verb' },
        { german: 'erzählen', arabic: 'يحكي', example: 'Er erzählt, er sei in Berlin gewesen.', exampleArabic: 'يحكي أنه كان في برلين.', type: 'verb' },
        { german: 'mitteilen', arabic: 'يُبلّغ', example: 'Er teilt mit, er komme später.', exampleArabic: 'يبلّغ أنه سيأتي لاحقاً.', type: 'verb' },
        { german: 'fragen', arabic: 'يسأل', example: 'Sie fragt, ob er da sei.', exampleArabic: 'تسأل ما إذا كان موجوداً.', type: 'verb' },
        { german: 'antworten', arabic: 'يجيب', example: 'Er antwortet, er wisse es nicht.', exampleArabic: 'يجيب أنه لا يعلم.', type: 'verb' },
        { german: 'die Aussage', arabic: 'التصريح', example: 'Seine Aussage war klar.', exampleArabic: 'تصريحه كان واضحاً.', type: 'noun', gender: 'die', plural: 'die Aussagen' },
        { german: 'das Zitat', arabic: 'الاقتباس', example: 'Das Zitat ist berühmt.', exampleArabic: 'الاقتباس مشهور.', type: 'noun', gender: 'das', plural: 'die Zitate' },
        { german: 'die Quelle', arabic: 'المصدر', example: 'Was ist die Quelle?', exampleArabic: 'ما المصدر؟', type: 'noun', gender: 'die', plural: 'die Quellen' },
        { german: 'der Bericht', arabic: 'التقرير', example: 'Der Bericht erscheint heute.', exampleArabic: 'التقرير يصدر اليوم.', type: 'noun', gender: 'der', plural: 'die Berichte' },
        { german: 'die Nachricht', arabic: 'الخبر', example: 'Die Nachricht ist wichtig.', exampleArabic: 'الخبر مهم.', type: 'noun', gender: 'die', plural: 'die Nachrichten' },
        { german: 'die Presse', arabic: 'الصحافة', example: 'Die Presse berichtet darüber.', exampleArabic: 'الصحافة تذكر ذلك.', type: 'noun', gender: 'die' },
        { german: 'der Journalist', arabic: 'الصحفي', example: 'Der Journalist fragt nach.', exampleArabic: 'الصحفي يسأل.', type: 'noun', gender: 'der', plural: 'die Journalisten' },
        { german: 'der Minister', arabic: 'الوزير', example: 'Der Minister erklärt die Entscheidung.', exampleArabic: 'الوزير يشرح القرار.', type: 'noun', gender: 'der', plural: 'die Minister' },
        { german: 'die Regierung', arabic: 'الحكومة', example: 'Die Regierung kündigt eine Reform an.', exampleArabic: 'الحكومة تعلن إصلاحاً.', type: 'noun', gender: 'die', plural: 'die Regierungen' },
        { german: 'die Studie', arabic: 'الدراسة', example: 'Laut der Studie...', exampleArabic: 'وفقاً للدراسة...', type: 'noun', gender: 'die', plural: 'die Studien' },
        { german: 'das Ergebnis', arabic: 'النتيجة', example: 'Das Ergebnis ist überraschend.', exampleArabic: 'النتيجة مفاجئة.', type: 'noun', gender: 'das', plural: 'die Ergebnisse' },
        { german: 'die Untersuchung', arabic: 'التحقيق / الفحص', example: 'Die Untersuchung dauert noch.', exampleArabic: 'التحقيق ما زال جارياً.', type: 'noun', gender: 'die', plural: 'die Untersuchungen' },
        { german: 'die Behauptung', arabic: 'الادعاء', example: 'Die Behauptung ist falsch.', exampleArabic: 'الادعاء خاطئ.', type: 'noun', gender: 'die', plural: 'die Behauptungen' },
        { german: 'die Erklärung', arabic: 'الإيضاح', example: 'Eine offizielle Erklärung kam.', exampleArabic: 'صدر إيضاح رسمي.', type: 'noun', gender: 'die', plural: 'die Erklärungen' },
        { german: 'angeblich', arabic: 'مزعوماً', example: 'Er ist angeblich krank.', exampleArabic: 'هو مزعوماً مريض.', type: 'adverb' },
        { german: 'laut', arabic: 'وفقاً لـ', example: 'Laut der Zeitung...', exampleArabic: 'وفقاً للجريدة...', type: 'preposition' },
        { german: 'gemäß', arabic: 'حسب', example: 'Gemäß dem Vertrag...', exampleArabic: 'حسب العقد...', type: 'preposition' },
        { german: 'offiziell', arabic: 'رسمي', example: 'Das ist offiziell.', exampleArabic: 'هذا رسمي.', type: 'adjective' },
        { german: 'inoffiziell', arabic: 'غير رسمي', example: 'Eine inoffizielle Aussage.', exampleArabic: 'تصريح غير رسمي.', type: 'adjective' },
        { german: 'angesehen', arabic: 'مرموق', example: 'Eine angesehene Zeitung.', exampleArabic: 'جريدة مرموقة.', type: 'adjective' },
        { german: 'kontrovers', arabic: 'مثير للجدل', example: 'Eine kontroverse Behauptung.', exampleArabic: 'ادعاء مثير للجدل.', type: 'adjective' },
        { german: 'glaubwürdig', arabic: 'موثوق', example: 'Eine glaubwürdige Quelle.', exampleArabic: 'مصدر موثوق.', type: 'adjective' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'b2-13-q1', question: 'حوّل: "Er hat Zeit." → "Er sagt, er ___ Zeit." (Konj. I)', answer: 'habe', hint: 'haben → habe في Konj. I (er)' },
          { type: 'multiple-choice', id: 'b2-13-q2', question: 'Konjunktiv I من sein مع er؟', options: ['ist', 'sei', 'sein', 'wäre'], answer: 'sei' },
          { type: 'fill-blank', id: 'b2-13-q3', question: 'ماذا نفعل إذا تطابق Konj. I مع Indikativ؟ نستعمل ___ + Inf.', answer: 'würde', hint: 'البديل الأكثر استعمالاً' },
          { type: 'multiple-choice', id: 'b2-13-q4', question: 'Konj. I في الماضي؟', options: ['werde + Inf', 'habe/sei + Partizip', 'würde + Inf', 'hätte/wäre + Partizip'], answer: 'habe/sei + Partizip' },
          { type: 'fill-blank', id: 'b2-13-q5', question: 'حوّل: "Sie kommt morgen." → "Er sagt, sie ___ morgen." (Konj. I)', answer: 'komme', hint: 'kommen → komme' },
          { type: 'matching', id: 'b2-13-q6', question: 'اربط الفعل بصيغة Konj. I (er):', pairs: [
            { left: 'haben', right: 'habe' },
            { left: 'sein', right: 'sei' },
            { left: 'kommen', right: 'komme' },
            { left: 'sagen', right: 'sage' },
            { left: 'gehen', right: 'gehe' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'b2-13-q7', question: 'رتّب: "الوزير يقول إنه بريء"', words: ['Der', 'Minister', 'sagt,', 'er', 'sei', 'unschuldig'], answer: 'Der Minister sagt, er sei unschuldig' },
          { type: 'speaking', id: 'b2-13-q8', question: 'قل بـ Konj. I: "تقول إنها مشغولة"', answer: 'Sie sagt, sie sei beschäftigt' },
          { type: 'fill-blank', id: 'b2-13-q9', question: 'استمع: "Laut der Studie ___ die Inflation zu." (Konj. I من zunehmen)', audioPrompt: 'Laut der Studie nehme die Inflation zu.', answer: 'nehme', hint: 'zunehmen → nehme...zu' },
          { type: 'multiple-choice', id: 'b2-13-q10', question: 'Konj. I يستعمل بشكل أساسي في:', options: ['الكلام اليومي', 'الصحافة والتقارير الرسمية', 'الرسائل الشخصية', 'الإعلانات'], answer: 'الصحافة والتقارير الرسمية' },
          { type: 'fill-blank', id: 'b2-13-q11', question: 'Konj. I من müssen مع er؟', answer: 'müsse', hint: 'müssen → müsse (Konj. I)' },
          { type: 'multiple-choice', id: 'b2-13-q12', question: 'في الكلام الرسمي بدون dass:', options: ['ترتيب فرعي', 'ترتيب رئيسي', 'فعل في النهاية', 'لا فعل'], answer: 'ترتيب رئيسي' },
          { type: 'fill-blank', id: 'b2-13-q13', question: '"Sie ___ das Land verlassen." (Konj. I ماضي haben + Partizip)', answer: 'habe', hint: 'habe + verlassen' },
          { type: 'matching', id: 'b2-13-q14', question: 'اربط الجملة المباشرة بـ Konj. I:', pairs: [
            { left: '"Ich bin müde."', right: 'Er sagt, er sei müde.' },
            { left: '"Ich habe Geld."', right: 'Er sagt, er habe Geld.' },
            { left: '"Sie kommt morgen."', right: 'Er sagt, sie komme morgen.' },
            { left: '"Wir wissen es nicht."', right: 'Sie sagen, sie wüssten es nicht.' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'b2-13-q15', question: 'رتّب: "الوزير يقول إنه استقال"', words: ['Der', 'Minister', 'sagt,', 'er', 'sei', 'zurückgetreten'], answer: 'Der Minister sagt, er sei zurückgetreten' },
          { type: 'fill-blank', id: 'b2-13-q16', question: 'استمع: "Sie behauptet, sie ___ unschuldig." (sein Konj. I)', audioPrompt: 'Sie behauptet, sie sei unschuldig.', answer: 'sei', hint: 'sein → sei' },
          { type: 'multiple-choice', id: 'b2-13-q17', question: 'متى نلجأ لـ würde + Inf؟', options: ['دائماً', 'حين Konj. I = Indikativ', 'مع haben فقط', 'في الكلام اليومي'], answer: 'حين Konj. I = Indikativ' },
          { type: 'speaking', id: 'b2-13-q18', question: 'قل بـ Konj. I: "السياسي يقول إنه بريء"', answer: 'Der Politiker sagt, er sei unschuldig' },
          { type: 'fill-blank', id: 'b2-13-q19', question: '"Laut der Studie ___ die Inflation zu." (zunehmen Konj. I)', answer: 'nehme', hint: 'zunehmen → nehme...zu' },
          { type: 'multiple-choice', id: 'b2-13-q20', question: 'صيغة sei في jussive (وصفة طعام):', options: ['اقتراح', 'وصف', '"يؤخذ..."', 'سؤال'], answer: '"يؤخذ..."' },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 14 — Modalpartikeln (الجواهر التي تجعل ألمانيتك طبيعية)
    // ─────────────────────────────────────────────
    {
      id: 'b2-14',
      title: 'حروف الإضافة المُلوِّنة — Modalpartikeln',
      order: 14,
      grammar: {
        title: 'doch, halt, eben, ja, mal, denn, wohl — كيف تجعل كلامك ألمانياً حقيقياً',
        content: `**Modalpartikeln** هي كلمات صغيرة (doch, halt, eben, ja, mal, denn, wohl) تُضاف إلى الجمل لإعطاء **لون عاطفي** — تأكيد، استغراب، تلطيف، إصرار. لا ترجمة لها مباشرة، لكنها **علامة الفصل بين B2 ومتحدث طبيعي**.\n\n→ Komm **mal** her. (تعالَ هنا — بأدب وعدم رسمية)\n→ Das ist **doch** unmöglich! (لكن هذا مستحيل! — استغراب)\n→ Was machst du **denn** hier? (ماذا تفعل هنا؟ — فضول/تأكيد)\n\nاحفظها مع السياق. كل كلمة لها استعمالات متعدّدة، لكن تَعَلَّم استعمالاً واحداً لكل واحدة أولاً.`,
        tables: [
          { title: 'الـ Modalpartikeln الأساسية + استعمالها', headers: ['الكلمة', 'الاستعمال الرئيسي', 'مثال', 'الترجمة'], rows: [
            { cells: ['doch', 'استغراب / إصرار', 'Das ist doch klar!', 'لكن هذا واضح!'] },
            { cells: ['halt', 'تسليم بالأمر', 'Das ist halt so.', 'هكذا هي الأمور.'] },
            { cells: ['eben', 'تأكيد بديهي', 'Das ist eben das Problem.', 'هذه بالضبط المشكلة.'] },
            { cells: ['ja', 'تأكيد معلوم', 'Du weißt ja, dass...', 'كما تعلم...'] },
            { cells: ['mal', 'تلطيف الأمر', 'Komm mal her!', 'تعالَ من فضلك.'] },
            { cells: ['denn', 'فضول في السؤال', 'Wo bist du denn?', 'أين أنت يا ترى؟'] },
            { cells: ['wohl', 'تخمين', 'Er ist wohl zu Hause.', 'هو على الأرجح بالبيت.'] },
            { cells: ['nur / bloß', 'تشديد في السؤال', 'Was hast du nur gemacht?', 'ماذا فعلت بالضبط؟'] },
          ], theme: 'default', note: 'الترتيب: Modalpartikel تأتي بعد الفاعل وقبل المعلومة الجديدة.' },
          { title: 'مقارنة: نفس الجملة بـ Modalpartikel وبدونها', headers: ['بدون', 'مع Modalpartikel', 'الفرق'], rows: [
            { cells: ['Komm her.', 'Komm mal her.', 'الثانية ألطف، أقل أمراً.'] },
            { cells: ['Wo bist du?', 'Wo bist du denn?', 'الثانية تُظهر الفضول والقلق.'] },
            { cells: ['Das ist klar.', 'Das ist doch klar!', 'الثانية تأكيد قوي.'] },
            { cells: ['Er ist krank.', 'Er ist halt krank.', 'الثانية تسليم لا تذمّر.'] },
          ], theme: 'default', note: 'بدون Modalpartikel، الكلام صحيح لكن "بارد" — كأنك تقرأ تعليمات.' },
        ],
        rules: [
          { rule: 'احفظ كل Modalpartikel مع موقف واحد فقط في البداية. doch = استغراب، mal = تلطيف، denn = فضول.', example: 'Komm mal! / Das geht doch nicht!', translation: 'تعالَ! / لكن هذا لا يصح!' },
          { rule: 'في السؤال، استعمل denn — يجعله أقل تحقيقاً، أكثر فضولاً.', example: 'Wie heißt du denn? (وليس Wie heißt du?)', translation: 'ما اسمك يا ترى؟' },
          { rule: 'mal ينعّم الأوامر — استعمله دائماً عند الطلبات.', example: 'Schau mal! / Hör mal zu!', translation: 'انظر! / استمع!' },
          { rule: 'doch تجيب بـ "بل" على سؤال نفي: "Du kommst nicht?" — "Doch, ich komme."', example: 'Hast du keine Zeit? — Doch, ich habe Zeit!', translation: 'ألا لديك وقت؟ — بل لدي وقت!' },
        ],
        examples: [
          'Das ist doch unmöglich! — لكن هذا مستحيل!',
          'Komm mal kurz hierher. — تعالَ لحظة من فضلك.',
          'Was machst du denn da? — ماذا تفعل هناك يا ترى؟',
          'Du weißt ja, dass ich Marokkaner bin. — كما تعلم، أنا مغربي.',
          'Das ist eben so im Leben. — هكذا هي الحياة بكل بساطة.',
          'Es regnet halt im Februar. — في فبراير المطر طبيعي.',
          'Er wird wohl zu Hause sein. — هو على الأرجح بالبيت.',
          'Hör mal, ich muss dir was sagen. — اسمع، لازم أقولك شيء.',
          'Was hast du nur getan? — ماذا فعلت بالضبط؟',
        ],
        tip: 'لا تحاول استعمال كلها دفعة واحدة. اختر 3 (مثلاً mal/denn/doch) واستعملها أسبوعاً كاملاً في كل جملة. ثم أضِف 3 أخرى. خلال شهر تتكلّم مثل ناطق.',
      },
      vocabulary: [
        { german: 'doch', arabic: 'لكن / بل', example: 'Das ist doch klar!', exampleArabic: 'لكن هذا واضح!', type: 'adverb' },
        { german: 'halt', arabic: 'هكذا (تسليم)', example: 'Das ist halt so.', exampleArabic: 'هكذا هي.', type: 'adverb' },
        { german: 'eben', arabic: 'بالضبط', example: 'Das ist eben das Problem.', exampleArabic: 'هذه بالضبط المشكلة.', type: 'adverb' },
        { german: 'ja', arabic: 'كما تعلم', example: 'Du weißt ja, was ich meine.', exampleArabic: 'كما تعلم ما أقصد.', type: 'adverb' },
        { german: 'mal', arabic: '(تلطيف)', example: 'Komm mal her!', exampleArabic: 'تعالَ من فضلك!', type: 'adverb' },
        { german: 'denn', arabic: '(في السؤال للفضول)', example: 'Wo bist du denn?', exampleArabic: 'أين أنت يا ترى؟', type: 'adverb' },
        { german: 'wohl', arabic: 'على الأرجح', example: 'Er wird wohl müde sein.', exampleArabic: 'هو على الأرجح متعب.', type: 'adverb' },
        { german: 'nur', arabic: 'بالضبط (تشديد)', example: 'Was hast du nur gemacht?', exampleArabic: 'ماذا فعلت بالضبط؟', type: 'adverb' },
        { german: 'bloß', arabic: 'بالضبط (تشديد)', example: 'Wie konnte das bloß passieren?', exampleArabic: 'كيف حصل هذا بالضبط؟', type: 'adverb' },
        { german: 'eigentlich', arabic: 'في الواقع', example: 'Wer bist du eigentlich?', exampleArabic: 'من أنت في الواقع؟', type: 'adverb' },
        { german: 'überhaupt', arabic: 'أصلاً', example: 'Hat er überhaupt Zeit?', exampleArabic: 'هل لديه وقت أصلاً؟', type: 'adverb' },
        { german: 'sowieso', arabic: 'على أي حال', example: 'Ich gehe sowieso.', exampleArabic: 'سأذهب على أي حال.', type: 'adverb' },
        { german: 'tatsächlich', arabic: 'بالفعل', example: 'Er kommt tatsächlich.', exampleArabic: 'يأتي بالفعل.', type: 'adverb' },
        { german: 'ehrlich gesagt', arabic: 'بصراحة', example: 'Ehrlich gesagt, weiß ich nicht.', exampleArabic: 'بصراحة، لا أعلم.', type: 'phrase' },
        { german: 'übrigens', arabic: 'بالمناسبة', example: 'Übrigens, hast du schon gehört?', exampleArabic: 'بالمناسبة، هل سمعت؟', type: 'adverb' },
        { german: 'klar', arabic: 'واضح / طبعاً', example: 'Klar, ich komme.', exampleArabic: 'طبعاً سآتي.', type: 'adjective' },
        { german: 'kurz', arabic: 'قصير / لحظة', example: 'Komm kurz her.', exampleArabic: 'تعالَ لحظة.', type: 'adjective' },
        { german: 'unmöglich', arabic: 'مستحيل', example: 'Das ist unmöglich!', exampleArabic: 'هذا مستحيل!', type: 'adjective' },
        { german: 'merkwürdig', arabic: 'غريب', example: 'Das ist merkwürdig.', exampleArabic: 'هذا غريب.', type: 'adjective' },
        { german: 'unglaublich', arabic: 'لا يُصدَّق', example: 'Unglaublich, was passiert ist!', exampleArabic: 'لا يُصدَّق ما حدث!', type: 'adjective' },
        { german: 'das Gespräch', arabic: 'الحديث', example: 'Wir hatten ein langes Gespräch.', exampleArabic: 'كان لنا حديث طويل.', type: 'noun', gender: 'das', plural: 'die Gespräche' },
        { german: 'die Stimmung', arabic: 'المزاج / الجو', example: 'Die Stimmung ist gut.', exampleArabic: 'المزاج جيد.', type: 'noun', gender: 'die', plural: 'die Stimmungen' },
        { german: 'der Ton', arabic: 'النغمة / النبرة', example: 'In welchem Ton sprichst du?', exampleArabic: 'بأي نبرة تتحدّث؟', type: 'noun', gender: 'der', plural: 'die Töne' },
        { german: 'die Bedeutung', arabic: 'المعنى', example: 'Die Bedeutung ist wichtig.', exampleArabic: 'المعنى مهم.', type: 'noun', gender: 'die', plural: 'die Bedeutungen' },
        { german: 'die Nuance', arabic: 'الفارق الدقيق', example: 'Eine kleine Nuance reicht.', exampleArabic: 'فارق صغير يكفي.', type: 'noun', gender: 'die', plural: 'die Nuancen' },
        { german: 'sich wundern', arabic: 'يستغرب', example: 'Ich wundere mich darüber.', exampleArabic: 'أستغرب من ذلك.', type: 'verb' },
        { german: 'erstaunt sein', arabic: 'مذهول', example: 'Ich bin erstaunt.', exampleArabic: 'أنا مذهول.', type: 'phrase' },
        { german: 'das Erstaunen', arabic: 'الدهشة', example: 'Zu meinem Erstaunen kam er.', exampleArabic: 'لدهشتي، أتى.', type: 'noun', gender: 'das' },
        { german: 'übertreiben', arabic: 'يُبالغ', example: 'Du übertreibst!', exampleArabic: 'أنت تبالغ!', type: 'verb' },
        { german: 'die Färbung', arabic: 'النكهة / اللون اللغوي', example: 'Modalpartikeln geben Färbung.', exampleArabic: 'أحرف الإضافة تُعطي نكهة.', type: 'noun', gender: 'die' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'b2-14-q1', question: 'تلطيف الأمر: "Komm ___ her!"', answer: 'mal', hint: 'mal = تلطيف الطلبات' },
          { type: 'multiple-choice', id: 'b2-14-q2', question: 'في سؤال للفضول: "Was machst du ___ hier?"', options: ['mal', 'doch', 'denn', 'halt'], answer: 'denn' },
          { type: 'fill-blank', id: 'b2-14-q3', question: 'استغراب: "Das ist ___ unmöglich!"', answer: 'doch', hint: 'doch = استغراب/إصرار' },
          { type: 'multiple-choice', id: 'b2-14-q4', question: 'تخمين: "Er ist ___ zu Hause."', options: ['mal', 'wohl', 'doch', 'eben'], answer: 'wohl' },
          { type: 'fill-blank', id: 'b2-14-q5', question: 'تسليم: "Das ist ___ so im Leben."', answer: 'eben', hint: 'eben = هكذا هي/تسليم' },
          { type: 'matching', id: 'b2-14-q6', question: 'اربط Modalpartikel باستعمالها:', pairs: [
            { left: 'mal', right: 'تلطيف' },
            { left: 'denn', right: 'فضول في السؤال' },
            { left: 'doch', right: 'استغراب' },
            { left: 'wohl', right: 'تخمين' },
            { left: 'eben', right: 'تسليم' },
            { left: 'ja', right: 'كما تعلم' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'b2-14-q7', question: 'رتّب (مع تلطيف): "تعالَ هنا!"', words: ['Komm', 'mal', 'her'], answer: 'Komm mal her' },
          { type: 'speaking', id: 'b2-14-q8', question: 'قل (مع فضول): "أين أنت يا ترى؟"', answer: 'Wo bist du denn' },
          { type: 'fill-blank', id: 'b2-14-q9', question: 'استمع: "Du weißt ___ , dass ich beschäftigt bin." (كما تعلم)', audioPrompt: 'Du weißt ja, dass ich beschäftigt bin.', answer: 'ja', hint: 'ja = معلوم بيننا' },
          { type: 'multiple-choice', id: 'b2-14-q10', question: 'الإجابة "Doch" تستعمل عندما:', options: ['نوافق', 'ننفي السؤال السلبي', 'نشكر', 'نطلب'], answer: 'ننفي السؤال السلبي' },
          { type: 'fill-blank', id: 'b2-14-q11', question: 'سؤال للفضول: "Wie heißt du ___?"', answer: 'denn', hint: 'denn = فضول في السؤال' },
          { type: 'multiple-choice', id: 'b2-14-q12', question: 'الفرق بين "Komm her" و "Komm mal her":', options: ['نفس الشيء', 'الثانية ألطف', 'الثانية أمر شديد', 'الثانية في الماضي'], answer: 'الثانية ألطف' },
          { type: 'fill-blank', id: 'b2-14-q13', question: 'تأكيد على معلوم: "Du weißt ___, was zu tun ist."', answer: 'ja', hint: 'ja = كما تعلم' },
          { type: 'matching', id: 'b2-14-q14', question: 'اربط Modalpartikel بسياقها:', pairs: [
            { left: 'Komm doch mal!', right: 'تلطيف + إصرار' },
            { left: 'Was machst du denn?', right: 'فضول' },
            { left: 'Das ist halt so.', right: 'تسليم' },
            { left: 'Er ist wohl da.', right: 'تخمين' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'b2-14-q15', question: 'رتّب (مع تخمين): "هو على الأرجح في البيت"', words: ['Er', 'ist', 'wohl', 'zu', 'Hause'], answer: 'Er ist wohl zu Hause' },
          { type: 'fill-blank', id: 'b2-14-q16', question: 'استمع: "Das ist ___ unmöglich!" (لكن — استغراب)', audioPrompt: 'Das ist doch unmöglich!', answer: 'doch', hint: 'doch = استغراب' },
          { type: 'multiple-choice', id: 'b2-14-q17', question: 'في الجملة: "Hast du etwa kein Geld?"', options: ['طلب', 'استغراب/استنكار', 'تأكيد', 'إخبار'], answer: 'استغراب/استنكار' },
          { type: 'speaking', id: 'b2-14-q18', question: 'قل (مع تسليم): "هكذا هي الحياة"', answer: 'Das ist halt so im Leben' },
          { type: 'fill-blank', id: 'b2-14-q19', question: 'إجابة على سؤال نفي: "Du kommst nicht?" — "___, ich komme!"', answer: 'Doch', hint: 'Doch = بل (نفي للنفي)' },
          { type: 'multiple-choice', id: 'b2-14-q20', question: 'لماذا Modalpartikeln مهمة في B2؟', options: ['تختصر الكلام', 'تجعل الكلام طبيعياً', 'تُلزم القواعد', 'تستبدل الأفعال'], answer: 'تجعل الكلام طبيعياً' },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 15 — Wortbildung (تكوين الكلمات)
    // ─────────────────────────────────────────────
    {
      id: 'b2-15',
      title: 'تكوين الكلمات — Wortbildung',
      order: 15,
      grammar: {
        title: 'الكلمات المركّبة (Komposita) + اللواحق -keit/-heit/-ung + البادئات ver-/ent-/be-/zer-',
        content: `الألمانية تخلق كلمات جديدة بسهولة عبر **التركيب** (Komposita) و**اللواحق والبادئات**. إذا فهمت هذه القواعد، تستطيع فهم آلاف الكلمات حتى لو لم تَرَها من قبل.\n\n**Komposita:** كلمتان أو أكثر تُلصَقان لتكوّن واحدة. الكلمة **الأخيرة** تحدّد الجنس.\n→ die Tür + der Schlüssel = **der Türschlüssel** (مفتاح الباب)\n→ die Hand + die Tasche = **die Handtasche** (حقيبة اليد)\n\n**اللواحق:** تخلق أسماء من أفعال أو صفات. -ung, -heit, -keit, -er, -in.\n**البادئات:** تغيّر معنى الفعل. ver-, ent-, be-, zer-, er-.`,
        tables: [
          { title: 'اللواحق المُكوِّنة للأسماء', headers: ['اللاحقة', 'الأصل', 'مثال', 'المعنى'], rows: [
            { cells: ['-ung', 'فعل', 'lernen → die Lernung (التعلّم)', 'فعلٌ كاسم'] },
            { cells: ['-heit', 'صفة', 'frei → die Freiheit (الحرية)', 'صفة كحالة'] },
            { cells: ['-keit', 'صفة (تنتهي بـ -ig/-lich)', 'möglich → die Möglichkeit', 'صفة كحالة'] },
            { cells: ['-er', 'فعل', 'lehren → der Lehrer (المعلم)', 'الفاعل الذكر'] },
            { cells: ['-in', 'اسم ذكر', 'der Lehrer → die Lehrerin', 'الأنثى المقابلة'] },
            { cells: ['-schaft', 'اسم/صفة', 'die Freundschaft (الصداقة)', 'مجموعة أو حالة'] },
            { cells: ['-tum', 'اسم', 'das Eigentum (الملكية)', 'حالة أو ملكية'] },
          ], theme: 'default', note: 'الأسماء التي تنتهي بـ -ung/-heit/-keit/-schaft/-tion **دائماً مؤنثة (die)**.' },
          { title: 'البادئات المُغيِّرة لمعنى الفعل', headers: ['البادئة', 'المعنى', 'مثال', 'تأثيرها'], rows: [
            { cells: ['ver-', 'تغيير حالة / إنجاز', 'kaufen → verkaufen', 'يبيع (vs يشتري)'] },
            { cells: ['ent-', 'إزالة / ابتعاد', 'fliehen → entfliehen', 'يهرب من'] },
            { cells: ['be-', 'تأثير على شيء', 'arbeiten → bearbeiten', 'يعالج/يُحرِّر'] },
            { cells: ['zer-', 'تكسير / إتلاف', 'brechen → zerbrechen', 'يكسر تماماً'] },
            { cells: ['er-', 'إنجاز / تحقيق', 'reichen → erreichen', 'يصل إلى'] },
            { cells: ['miss-', 'سلبي / خطأ', 'verstehen → missverstehen', 'يسوء فهمه'] },
          ], theme: 'default', note: 'هذه البادئات **غير قابلة للفصل** — تبقى ملتصقة بالفعل في كل الأزمنة.' },
          { title: 'Komposita — الكلمة الأخيرة تحدّد الجنس', headers: ['التركيبة', 'الجنس', 'الترجمة'], rows: [
            { cells: ['der Bahn + der Hof = der Bahnhof', 'der', 'محطة القطار'] },
            { cells: ['die Hand + die Tasche = die Handtasche', 'die', 'حقيبة اليد'] },
            { cells: ['das Haus + die Tür = die Haustür', 'die', 'باب البيت'] },
            { cells: ['der Geburts + der Tag = der Geburtstag', 'der', 'يوم الميلاد'] },
            { cells: ['die Sprache + die Schule = die Sprachschule', 'die', 'مدرسة اللغات'] },
          ], theme: 'default', note: 'تذكّر: آخر اسم في التركيبة هو الذي يحدّد der/die/das.' },
        ],
        rules: [
          { rule: 'كل الأسماء التي تنتهي بـ -ung/-heit/-keit/-schaft/-tion/-ität **مؤنثة** (die).', example: 'die Lösung, die Schönheit, die Möglichkeit, die Universität', translation: 'الحل، الجمال، الإمكانية، الجامعة.' },
          { rule: 'البادئات ver/ent/be/zer/er/miss غير قابلة للفصل ولا تحمل ge- في Partizip II.', example: 'verkaufen → verkauft (وليس geverkauft)', translation: 'باع.' },
          { rule: 'في Komposita، اللواحق الرابطة (-s-/-n-/-en-) تظهر أحياناً: Tageszeitung, Schweinefleisch.', example: 'der Tag + die Zeitung → die Tageszeitung', translation: 'الجريدة اليومية.' },
          { rule: 'لا تخف من الكلمات الطويلة — قسّمها من اليمين لليسار: Lebensversicherungsgesellschaft = Gesellschaft (شركة) ← Versicherung (تأمين) ← Leben (حياة).', example: 'der Donaudampfschifffahrtskapitän', translation: 'قبطان شركة الشحن البخاري على نهر الدانوب.' },
        ],
        examples: [
          'der Bahnhof = die Bahn + der Hof — محطة القطار.',
          'die Möglichkeit = möglich + -keit — الإمكانية.',
          'die Schönheit = schön + -heit — الجمال.',
          'die Lehrerin = der Lehrer + -in — المعلّمة.',
          'Er hat das Buch verkauft. — باع الكتاب.',
          'Das Glas ist zerbrochen. — انكسر الكأس.',
          'Ich erreiche mein Ziel. — أحقّق هدفي.',
          'Er hat mich missverstanden. — لقد أساء فهمي.',
        ],
        tip: 'تعلّم 5 لواحق و 5 بادئات. حين تواجه كلمة جديدة طويلة، فكّكها: ver- + kauf + -en. هكذا تفهم 50% من المفردات الجديدة دون قاموس.',
      },
      vocabulary: [
        { german: 'die Möglichkeit', arabic: 'الإمكانية', example: 'Es gibt viele Möglichkeiten.', exampleArabic: 'هناك إمكانيات كثيرة.', type: 'noun', gender: 'die', plural: 'die Möglichkeiten' },
        { german: 'die Schwierigkeit', arabic: 'الصعوبة', example: 'Die Schwierigkeit ist groß.', exampleArabic: 'الصعوبة كبيرة.', type: 'noun', gender: 'die', plural: 'die Schwierigkeiten' },
        { german: 'die Wirklichkeit', arabic: 'الواقع', example: 'In der Wirklichkeit ist es anders.', exampleArabic: 'في الواقع الأمر مختلف.', type: 'noun', gender: 'die' },
        { german: 'die Freiheit', arabic: 'الحرية', example: 'Freiheit ist wichtig.', exampleArabic: 'الحرية مهمة.', type: 'noun', gender: 'die', plural: 'die Freiheiten' },
        { german: 'die Gesundheit', arabic: 'الصحة', example: 'Gesundheit ist alles.', exampleArabic: 'الصحة هي كل شيء.', type: 'noun', gender: 'die' },
        { german: 'die Schönheit', arabic: 'الجمال', example: 'Die Schönheit der Stadt.', exampleArabic: 'جمال المدينة.', type: 'noun', gender: 'die', plural: 'die Schönheiten' },
        { german: 'die Lösung', arabic: 'الحل', example: 'Wir suchen eine Lösung.', exampleArabic: 'نبحث عن حل.', type: 'noun', gender: 'die', plural: 'die Lösungen' },
        { german: 'die Bewegung', arabic: 'الحركة', example: 'In Bewegung bleiben.', exampleArabic: 'البقاء في حركة.', type: 'noun', gender: 'die', plural: 'die Bewegungen' },
        { german: 'die Entscheidung', arabic: 'القرار', example: 'Eine wichtige Entscheidung.', exampleArabic: 'قرار مهم.', type: 'noun', gender: 'die', plural: 'die Entscheidungen' },
        { german: 'die Erfahrung', arabic: 'التجربة', example: 'Aus Erfahrung weiß ich es.', exampleArabic: 'من تجربتي أعلم ذلك.', type: 'noun', gender: 'die', plural: 'die Erfahrungen' },
        { german: 'die Gesellschaft', arabic: 'المجتمع / الشركة', example: 'Die Gesellschaft verändert sich.', exampleArabic: 'المجتمع يتغيّر.', type: 'noun', gender: 'die', plural: 'die Gesellschaften' },
        { german: 'die Freundschaft', arabic: 'الصداقة', example: 'Wir haben eine alte Freundschaft.', exampleArabic: 'لنا صداقة قديمة.', type: 'noun', gender: 'die', plural: 'die Freundschaften' },
        { german: 'die Universität', arabic: 'الجامعة', example: 'Ich studiere an der Universität.', exampleArabic: 'أدرس في الجامعة.', type: 'noun', gender: 'die', plural: 'die Universitäten' },
        { german: 'die Information', arabic: 'المعلومة', example: 'Eine wichtige Information.', exampleArabic: 'معلومة مهمة.', type: 'noun', gender: 'die', plural: 'die Informationen' },
        { german: 'die Nation', arabic: 'الأمة', example: 'Die deutsche Nation.', exampleArabic: 'الأمة الألمانية.', type: 'noun', gender: 'die', plural: 'die Nationen' },
        { german: 'verkaufen', arabic: 'يبيع', example: 'Ich verkaufe mein Auto.', exampleArabic: 'أبيع سيارتي.', type: 'verb' },
        { german: 'verstehen', arabic: 'يفهم', example: 'Ich verstehe dich.', exampleArabic: 'أفهمك.', type: 'verb' },
        { german: 'vergessen', arabic: 'ينسى', example: 'Vergiss das nicht!', exampleArabic: 'لا تنسَ ذلك!', type: 'verb' },
        { german: 'entdecken', arabic: 'يكتشف', example: 'Wir haben es entdeckt.', exampleArabic: 'اكتشفناه.', type: 'verb' },
        { german: 'entscheiden', arabic: 'يقرّر', example: 'Du musst entscheiden.', exampleArabic: 'يجب أن تقرّر.', type: 'verb' },
        { german: 'bearbeiten', arabic: 'يعالج / يُحرِّر', example: 'Ich bearbeite den Text.', exampleArabic: 'أعالج النص.', type: 'verb' },
        { german: 'besuchen', arabic: 'يزور', example: 'Ich besuche meine Familie.', exampleArabic: 'أزور عائلتي.', type: 'verb' },
        { german: 'zerbrechen', arabic: 'يتكسّر', example: 'Das Glas ist zerbrochen.', exampleArabic: 'الكأس مكسور.', type: 'verb' },
        { german: 'zerstören', arabic: 'يدمّر', example: 'Der Krieg zerstört alles.', exampleArabic: 'الحرب تدمّر كل شيء.', type: 'verb' },
        { german: 'erreichen', arabic: 'يصل / يحقق', example: 'Ich erreiche das Ziel.', exampleArabic: 'أصل إلى الهدف.', type: 'verb' },
        { german: 'missverstehen', arabic: 'يسيء فهم', example: 'Du missverstehst mich!', exampleArabic: 'تسيء فهمي!', type: 'verb' },
        { german: 'der Bahnhof', arabic: 'محطة القطار', example: 'Wir treffen uns am Bahnhof.', exampleArabic: 'نلتقي في المحطة.', type: 'noun', gender: 'der', plural: 'die Bahnhöfe' },
        { german: 'der Geburtstag', arabic: 'يوم الميلاد', example: 'Mein Geburtstag ist im Mai.', exampleArabic: 'عيد ميلادي في ماي.', type: 'noun', gender: 'der', plural: 'die Geburtstage' },
        { german: 'die Handtasche', arabic: 'حقيبة اليد', example: 'Wo ist meine Handtasche?', exampleArabic: 'أين حقيبتي؟', type: 'noun', gender: 'die', plural: 'die Handtaschen' },
        { german: 'die Tageszeitung', arabic: 'الجريدة اليومية', example: 'Ich lese die Tageszeitung.', exampleArabic: 'أقرأ الجريدة اليومية.', type: 'noun', gender: 'die', plural: 'die Tageszeitungen' },
        { german: 'die Sprachschule', arabic: 'مدرسة اللغات', example: 'Goethe ist eine Sprachschule.', exampleArabic: 'Goethe مدرسة لغات.', type: 'noun', gender: 'die', plural: 'die Sprachschulen' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'b2-15-q1', question: 'لاحقة -ung تجعل الكلمة دائماً ___ (الجنس).', answer: 'die', hint: 'كل الأسماء بـ -ung مؤنّثة' },
          { type: 'multiple-choice', id: 'b2-15-q2', question: 'في Komposita "der Bahnhof"، الجنس يأتي من؟', options: ['الكلمة الأولى', 'الكلمة الأخيرة', 'يحدّده النحاة', 'kein Genus'], answer: 'الكلمة الأخيرة' },
          { type: 'fill-blank', id: 'b2-15-q3', question: 'البادئة لمعنى "يبيع" من kaufen هي ___-.', answer: 'ver', hint: 'verkaufen' },
          { type: 'multiple-choice', id: 'b2-15-q4', question: 'صفة → اسم بـ -keit: möglich → ?', options: ['Möglichung', 'Möglichkeit', 'Möglichheit', 'Möglichschaft'], answer: 'Möglichkeit' },
          { type: 'fill-blank', id: 'b2-15-q5', question: 'die Hand + die Tasche = die ___.', answer: 'Handtasche', hint: 'Komposita بدون لاحقة' },
          { type: 'matching', id: 'b2-15-q6', question: 'اربط البادئة بمعناها:', pairs: [
            { left: 'ver-', right: 'تغيير حالة' },
            { left: 'ent-', right: 'إزالة' },
            { left: 'zer-', right: 'تكسير' },
            { left: 'be-', right: 'تأثير' },
            { left: 'er-', right: 'إنجاز' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'b2-15-q7', question: 'كوّن: "محطة القطار في برلين"', words: ['Der', 'Bahnhof', 'ist', 'in', 'Berlin'], answer: 'Der Bahnhof ist in Berlin' },
          { type: 'speaking', id: 'b2-15-q8', question: 'قل: "أبحث عن حل" (مع كلمة Lösung)', answer: 'Ich suche eine Lösung' },
          { type: 'fill-blank', id: 'b2-15-q9', question: 'استمع: "Die ___ ist groß." (الصعوبة)', audioPrompt: 'Die Schwierigkeit ist groß.', answer: 'Schwierigkeit', hint: 'schwierig + -keit' },
          { type: 'multiple-choice', id: 'b2-15-q10', question: 'كم مفردة الإفعال يمكن إضافة "ge-" في Partizip II؟', options: ['ver/ent/be', 'kaufen/lernen', 'الأفعال غير القابلة للفصل بـ ver/ent/be', 'كل الأفعال'], answer: 'الأفعال غير القابلة للفصل بـ ver/ent/be' },
          { type: 'fill-blank', id: 'b2-15-q11', question: 'صفة → اسم بـ -heit: schön → die ___', answer: 'Schönheit', hint: 'schön + heit' },
          { type: 'multiple-choice', id: 'b2-15-q12', question: 'اللاحقة لاسم الفاعل المؤنث:', options: ['-er', '-in', '-tum', '-schaft'], answer: '-in' },
          { type: 'fill-blank', id: 'b2-15-q13', question: 'die Hand + der Schuh = der ___', answer: 'Handschuh', hint: 'الكلمة الأخيرة → der' },
          { type: 'matching', id: 'b2-15-q14', question: 'اربط الكلمة باللاحقة:', pairs: [
            { left: 'die Möglichkeit', right: '-keit' },
            { left: 'die Freundschaft', right: '-schaft' },
            { left: 'die Universität', right: '-ität' },
            { left: 'die Lösung', right: '-ung' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'b2-15-q15', question: 'فكّك Komposita: "die Sprachschule"', words: ['die', 'Sprache', '+', 'die', 'Schule'], answer: 'die Sprache + die Schule' },
          { type: 'fill-blank', id: 'b2-15-q16', question: 'استمع: "Eine wichtige ___" (التطوّر)', audioPrompt: 'Eine wichtige Entwicklung.', answer: 'Entwicklung', hint: 'entwickeln + ung' },
          { type: 'multiple-choice', id: 'b2-15-q17', question: 'البادئة zer- تعني:', options: ['تكرار', 'إنجاز', 'تكسير/إتلاف', 'إزالة'], answer: 'تكسير/إتلاف' },
          { type: 'speaking', id: 'b2-15-q18', question: 'قل: "أحقّق هدفي" (ربط بـ erreichen)', answer: 'Ich erreiche mein Ziel' },
          { type: 'fill-blank', id: 'b2-15-q19', question: 'die Tat + die Sache = die ___ (شيء فعلي)', answer: 'Tatsache', hint: 'Komposita بسيطة' },
          { type: 'multiple-choice', id: 'b2-15-q20', question: 'كل الأسماء بـ -ung و -heit و -keit مؤنّثة. صحيح أم خطأ؟', options: ['صحيح', 'خطأ', 'فقط -ung', 'يعتمد'], answer: 'صحيح' },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 16 — Konditionalsätze
    // ─────────────────────────────────────────────
    {
      id: 'b2-16',
      title: 'الجمل الشرطية — Konditionalsätze',
      order: 16,
      grammar: {
        title: 'wenn (شرطي) + شرط واقعي vs غير واقعي + Konjunktiv II للأماني',
        content: `الجمل الشرطية تُعبّر عن سبب ونتيجة. الألمانية تميّز بين:\n\n**الواقعي (Realer Bedingung):** ممكن أن يحدث.\n→ **Wenn** ich Zeit **habe**, **komme** ich. (إذا كان لديّ وقت، آتي)\n\n**غير الواقعي (Irrealer Bedingung):** افتراض، تمنّي، شيء لم يحدث.\n→ **Wenn** ich Zeit **hätte**, **würde** ich kommen. (لو كان لديّ وقت، لأتيت)\n\n**الماضي غير الواقعي:** ندم على الماضي.\n→ **Wenn** ich Zeit **gehabt hätte**, **wäre** ich gekommen. (لو كان لديّ وقت أمس، لكنت أتيت)`,
        tables: [
          { title: 'الأنواع الثلاثة للجمل الشرطية', headers: ['النوع', 'الشرط', 'النتيجة', 'مثال'], rows: [
            { cells: ['واقعي (حاضر/مستقبل)', 'Indikativ', 'Indikativ', 'Wenn es regnet, bleibe ich zu Hause.'] },
            { cells: ['غير واقعي (حاضر/مستقبل)', 'Konj. II', 'würde + Inf', 'Wenn ich reich wäre, würde ich reisen.'] },
            { cells: ['غير واقعي (ماضي)', 'hätte/wäre + Partizip', 'hätte/wäre + Partizip', 'Wenn ich Zeit gehabt hätte, wäre ich gekommen.'] },
          ], theme: 'default', note: 'الفاصلة دائماً بعد wenn-Satz: "Wenn..., (verb)..."' },
          { title: 'البدائل عن wenn', headers: ['الكلمة', 'المعنى', 'مثال'], rows: [
            { cells: ['falls', 'في حال', 'Falls es regnet, nehmen wir Schirme.'] },
            { cells: ['sofern', 'بقدر ما', 'Sofern du Zeit hast, komm vorbei.'] },
            { cells: ['unter der Bedingung, dass', 'بشرط أن', 'Ich helfe dir unter der Bedingung, dass du auch hilfst.'] },
            { cells: ['ohne wenn (انعكاس الفعل)', 'حذف wenn', 'Hätte ich Zeit, würde ich kommen.'] },
          ], theme: 'default', note: 'بدون wenn، يأتي الفعل في البداية: "Hätte ich..., würde ich..."' },
          { title: 'Konjunktiv II — أمثلة لأفعال شائعة', headers: ['Infinitiv', 'Konj. II', 'مثال'], rows: [
            { cells: ['sein', 'wäre', 'Wenn ich du wäre...'] },
            { cells: ['haben', 'hätte', 'Wenn ich Zeit hätte...'] },
            { cells: ['werden', 'würde', 'Ich würde reisen.'] },
            { cells: ['können', 'könnte', 'Ich könnte helfen.'] },
            { cells: ['wissen', 'wüsste', 'Wenn ich es wüsste...'] },
            { cells: ['gehen', 'ginge / würde gehen', 'Ich würde gehen.'] },
          ], theme: 'conjugation', note: 'الأفعال المنتظمة في Konj. II = Präteritum + ä/ö/ü. الباقي: würde + Inf.' },
        ],
        rules: [
          { rule: 'في الواقعي، الفعل في wenn-Satz ثاني، وفي الجملة الرئيسية أول (بعد wenn-Satz).', example: 'Wenn es regnet, bleibe ich zu Hause.', translation: 'إذا أمطرت، أبقى في البيت.' },
          { rule: 'غير الواقعي الحاضر = Konj. II (هو ما يقابل "لو" في العربية).', example: 'Wenn ich reich wäre, würde ich helfen.', translation: 'لو كنت غنياً، لساعدت.' },
          { rule: 'الماضي غير الواقعي = hätte/wäre + Partizip — "لو كنت قد..."', example: 'Wenn du gekommen wärst, hätten wir gespielt.', translation: 'لو كنت قد جئت، لكنا قد لعبنا.' },
          { rule: 'بدون wenn = الفعل في البداية: "Hätte ich Zeit, würde ich..."', example: 'Wäre ich du, würde ich es tun.', translation: 'لو كنت مكانك، لفعلتها.' },
        ],
        examples: [
          'Wenn ich Zeit habe, lerne ich Deutsch. — حين أملك وقتاً، أتعلّم الألمانية.',
          'Falls es regnet, bleiben wir zu Hause. — في حال أمطرت، نبقى في البيت.',
          'Wenn ich reich wäre, würde ich nach Japan reisen. — لو كنت غنياً لسافرت إلى اليابان.',
          'Wenn ich du wäre, würde ich das machen. — لو كنت مكانك، لفعلت ذلك.',
          'Hätten wir mehr Zeit, könnten wir mehr lernen. — لو كان لدينا مزيد من الوقت، لتعلّمنا أكثر.',
          'Wenn du gekommen wärst, hätten wir gefeiert. — لو كنت قد جئت، لاحتفلنا.',
          'Sofern du einverstanden bist, fangen wir an. — بقدر ما توافق، نبدأ.',
          'Ich würde dir helfen, wenn ich könnte. — كنت سأساعدك لو استطعت.',
        ],
        tip: 'تدرّب على: "Wenn ich + Konj. II, würde ich + Inf". هذه البنية تكفي لـ 80% من الجمل الشرطية في B2. أضِف الماضي غير الواقعي (hätte gehabt) لاحقاً.',
      },
      vocabulary: [
        { german: 'wenn', arabic: 'إذا / لو', example: 'Wenn ich Zeit habe...', exampleArabic: 'إذا كان لدي وقت...', type: 'conjunction' },
        { german: 'falls', arabic: 'في حال', example: 'Falls es regnet...', exampleArabic: 'في حال أمطرت...', type: 'conjunction' },
        { german: 'sofern', arabic: 'بقدر ما', example: 'Sofern du willst...', exampleArabic: 'بقدر ما تريد...', type: 'conjunction' },
        { german: 'unter der Bedingung', arabic: 'بشرط', example: 'Unter der Bedingung, dass du hilfst.', exampleArabic: 'بشرط أن تساعد.', type: 'phrase' },
        { german: 'wäre', arabic: 'لو كان (Konj. II من sein)', example: 'Wenn ich reich wäre...', exampleArabic: 'لو كنت غنياً...', type: 'verb' },
        { german: 'hätte', arabic: 'لو كان لدي', example: 'Wenn ich Zeit hätte...', exampleArabic: 'لو كان لدي وقت...', type: 'verb' },
        { german: 'würde', arabic: 'لـ + فعل', example: 'Ich würde gerne kommen.', exampleArabic: 'كنت أودّ المجيء.', type: 'verb' },
        { german: 'könnte', arabic: 'كان بإمكاني', example: 'Ich könnte helfen.', exampleArabic: 'كان بإمكاني المساعدة.', type: 'verb' },
        { german: 'müsste', arabic: 'كان عليّ', example: 'Du müsstest jetzt gehen.', exampleArabic: 'كان عليك الذهاب الآن.', type: 'verb' },
        { german: 'sollte', arabic: 'ينبغي', example: 'Du solltest mehr lernen.', exampleArabic: 'ينبغي عليك التعلّم أكثر.', type: 'verb' },
        { german: 'wüsste', arabic: 'لو كنت أعلم', example: 'Wenn ich es wüsste!', exampleArabic: 'لو كنت أعلم!', type: 'verb' },
        { german: 'die Bedingung', arabic: 'الشرط', example: 'Eine wichtige Bedingung.', exampleArabic: 'شرط مهم.', type: 'noun', gender: 'die', plural: 'die Bedingungen' },
        { german: 'die Voraussetzung', arabic: 'المتطلّب', example: 'Was sind die Voraussetzungen?', exampleArabic: 'ما المتطلّبات؟', type: 'noun', gender: 'die', plural: 'die Voraussetzungen' },
        { german: 'die Möglichkeit', arabic: 'الإمكانية', example: 'Es gibt eine Möglichkeit.', exampleArabic: 'هناك إمكانية.', type: 'noun', gender: 'die', plural: 'die Möglichkeiten' },
        { german: 'der Fall', arabic: 'الحالة', example: 'In diesem Fall...', exampleArabic: 'في هذه الحالة...', type: 'noun', gender: 'der', plural: 'die Fälle' },
        { german: 'der Wunsch', arabic: 'الأمنية', example: 'Mein Wunsch ist...', exampleArabic: 'أمنيتي هي...', type: 'noun', gender: 'der', plural: 'die Wünsche' },
        { german: 'die Konsequenz', arabic: 'العاقبة', example: 'Die Konsequenzen sind klar.', exampleArabic: 'العواقب واضحة.', type: 'noun', gender: 'die', plural: 'die Konsequenzen' },
        { german: 'die Entscheidung', arabic: 'القرار', example: 'Die Entscheidung war richtig.', exampleArabic: 'القرار كان صحيحاً.', type: 'noun', gender: 'die', plural: 'die Entscheidungen' },
        { german: 'das Risiko', arabic: 'المخاطرة', example: 'Das Risiko ist groß.', exampleArabic: 'المخاطرة كبيرة.', type: 'noun', gender: 'das', plural: 'die Risiken' },
        { german: 'die Gelegenheit', arabic: 'الفرصة', example: 'Eine gute Gelegenheit.', exampleArabic: 'فرصة جيدة.', type: 'noun', gender: 'die', plural: 'die Gelegenheiten' },
        { german: 'reich', arabic: 'غني', example: 'Wenn ich reich wäre...', exampleArabic: 'لو كنت غنياً...', type: 'adjective' },
        { german: 'arm', arabic: 'فقير', example: 'Niemand will arm sein.', exampleArabic: 'لا أحد يريد أن يكون فقيراً.', type: 'adjective' },
        { german: 'frei', arabic: 'حر', example: 'Wenn ich frei wäre...', exampleArabic: 'لو كنت حراً...', type: 'adjective' },
        { german: 'glücklich', arabic: 'سعيد', example: 'Ich wäre glücklich.', exampleArabic: 'كنت سأكون سعيداً.', type: 'adjective' },
        { german: 'zufrieden', arabic: 'راضٍ', example: 'Wir wären zufrieden.', exampleArabic: 'كنا سنكون راضين.', type: 'adjective' },
        { german: 'theoretisch', arabic: 'نظرياً', example: 'Theoretisch ist es möglich.', exampleArabic: 'نظرياً ممكن.', type: 'adverb' },
        { german: 'praktisch', arabic: 'عملياً', example: 'Praktisch geht das nicht.', exampleArabic: 'عملياً لا يمكن.', type: 'adverb' },
        { german: 'angenommen', arabic: 'لنفترض أن', example: 'Angenommen, du gewinnst.', exampleArabic: 'لنفترض أنك ربحت.', type: 'phrase' },
        { german: 'realisieren', arabic: 'يحقق', example: 'Träume realisieren.', exampleArabic: 'تحقيق الأحلام.', type: 'verb' },
        { german: 'verwirklichen', arabic: 'يجعل واقعاً', example: 'Pläne verwirklichen.', exampleArabic: 'تحقيق الخطط.', type: 'verb' },
        { german: 'feiern', arabic: 'يحتفل', example: 'Wir feiern den Erfolg.', exampleArabic: 'نحتفل بالنجاح.', type: 'verb' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'b2-16-q1', question: 'شرط واقعي: "Wenn ich Zeit ___, komme ich." (haben)', answer: 'habe', hint: 'حاضر — Indikativ' },
          { type: 'multiple-choice', id: 'b2-16-q2', question: 'غير واقعي: "Wenn ich reich ___, würde ich reisen." (sein)', options: ['bin', 'war', 'wäre', 'wäre gewesen'], answer: 'wäre' },
          { type: 'fill-blank', id: 'b2-16-q3', question: 'بدون wenn: "___ ich Zeit, würde ich kommen." (haben Konj. II)', answer: 'Hätte', hint: 'الفعل في البداية' },
          { type: 'multiple-choice', id: 'b2-16-q4', question: 'الماضي غير الواقعي يستعمل؟', options: ['hätte/wäre + Partizip', 'würde + Inf', 'Konj. II بسيط', 'Indikativ Perfekt'], answer: 'hätte/wäre + Partizip' },
          { type: 'fill-blank', id: 'b2-16-q5', question: 'بديل wenn: "___ es regnet, bleiben wir zu Hause." (في حال)', answer: 'Falls', hint: 'falls = wenn رسمي' },
          { type: 'matching', id: 'b2-16-q6', question: 'اربط الفعل بـ Konj. II:', pairs: [
            { left: 'sein', right: 'wäre' },
            { left: 'haben', right: 'hätte' },
            { left: 'werden', right: 'würde' },
            { left: 'können', right: 'könnte' },
            { left: 'wissen', right: 'wüsste' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'b2-16-q7', question: 'رتّب: "لو كان لدي وقت، لكنت قد جئت" (ماضي غير واقعي)', words: ['Wenn', 'ich', 'Zeit', 'gehabt', 'hätte,', 'wäre', 'ich', 'gekommen'], answer: 'Wenn ich Zeit gehabt hätte, wäre ich gekommen' },
          { type: 'speaking', id: 'b2-16-q8', question: 'قل: "لو كنت مكانك، لفعلت ذلك"', answer: 'Wenn ich du wäre, würde ich das machen' },
          { type: 'fill-blank', id: 'b2-16-q9', question: 'استمع: "Wenn du gekommen ___, hätten wir gefeiert." (sein Konj. II ماضي)', audioPrompt: 'Wenn du gekommen wärst, hätten wir gefeiert.', answer: 'wärst', hint: 'wärst = sein Konj. II مع du' },
          { type: 'multiple-choice', id: 'b2-16-q10', question: 'البنية الأكثر استعمالاً للحاضر غير الواقعي:', options: ['hätte gehabt', 'Wenn + Konj. II + würde + Inf', 'wenn + Indikativ', 'Imperativ'], answer: 'Wenn + Konj. II + würde + Inf' },
          { type: 'fill-blank', id: 'b2-16-q11', question: 'Konj. II من können؟', answer: 'könnte', hint: 'können → könnte' },
          { type: 'multiple-choice', id: 'b2-16-q12', question: 'الأكثر طبيعية في الكلام لـ "لو فعلت":', options: ['ich täte', 'ich würde tun', 'ich tüte', 'ich werde tun'], answer: 'ich würde tun' },
          { type: 'fill-blank', id: 'b2-16-q13', question: '"Wenn ich es ___, würde ich antworten." (wissen Konj. II)', answer: 'wüsste', hint: 'wissen → wüsste' },
          { type: 'matching', id: 'b2-16-q14', question: 'اربط النوع بالبنية:', pairs: [
            { left: 'واقعي حاضر', right: 'wenn + Indikativ' },
            { left: 'غير واقعي حاضر', right: 'wenn + Konj. II + würde' },
            { left: 'غير واقعي ماضي', right: 'wenn + hätte/wäre + Partizip' },
            { left: 'بدون wenn', right: 'فعل في البداية' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'b2-16-q15', question: 'رتّب: "لو كنت أعلم لأخبرتك"', words: ['Wenn', 'ich', 'es', 'wüsste,', 'würde', 'ich', 'es', 'dir', 'sagen'], answer: 'Wenn ich es wüsste, würde ich es dir sagen' },
          { type: 'fill-blank', id: 'b2-16-q16', question: 'استمع: "___ ich Geld, würde ich reisen." (بدون wenn)', audioPrompt: 'Hätte ich Geld, würde ich reisen.', answer: 'Hätte', hint: 'الفعل في البداية' },
          { type: 'multiple-choice', id: 'b2-16-q17', question: 'أيّ بديل عن wenn؟', options: ['falls', 'sofern', 'unter der Bedingung dass', 'كلها'], answer: 'كلها' },
          { type: 'speaking', id: 'b2-16-q18', question: 'قل: "لو كنت قد جئت، لاحتفلنا"', answer: 'Wenn du gekommen wärst, hätten wir gefeiert' },
          { type: 'fill-blank', id: 'b2-16-q19', question: '"Wenn ich Zeit ___ ___, wäre ich gekommen." (haben — Konj. II ماضي)', answer: 'gehabt hätte', hint: 'gehabt + hätte' },
          { type: 'multiple-choice', id: 'b2-16-q20', question: 'الجملة "Hätte ich Geld" تعني:', options: ['عندي مال', 'لو كان عندي مال', 'سيكون عندي مال', 'كان عندي مال'], answer: 'لو كان عندي مال' },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 17 — Konnektoren erweitert
    // ─────────────────────────────────────────────
    {
      id: 'b2-17',
      title: 'الروابط المتقدمة — Konnektoren erweitert',
      order: 17,
      grammar: {
        title: 'indem, ohne dass, anstatt zu, dadurch, sodass — كيف تربط الأفكار بدقة',
        content: `في B2، الجمل البسيطة لم تعد كافية. تحتاج إلى **روابط دقيقة** للتعبير عن الطريقة، السبب، التناقض، النتيجة.\n\n**أنواع الروابط:**\n- **الطريقة (Modal):** indem, dadurch, ohne dass\n- **التناقض (Konzessiv):** trotzdem, obwohl, dennoch\n- **النتيجة (Konsekutiv):** sodass, deshalb, daher\n- **البديل (Alternativ):** anstatt zu, anstatt dass\n\nكل رابط يفرض ترتيباً معيّناً للفعل.`,
        tables: [
          { title: 'روابط الطريقة والوسيلة', headers: ['الرابط', 'المعنى', 'مثال'], rows: [
            { cells: ['indem', 'بأن (وسيلة)', 'Ich lerne, indem ich viel lese.'] },
            { cells: ['dadurch, dass', 'بذلك (سبب)', 'Dadurch, dass ich übe, werde ich besser.'] },
            { cells: ['ohne zu', 'دون أن', 'Er ging weg, ohne zu sprechen.'] },
            { cells: ['ohne dass', 'دون أن (مع فاعل مختلف)', 'Er ging, ohne dass ich es merkte.'] },
            { cells: ['anstatt zu', 'بدلاً من أن', 'Anstatt zu lernen, schaut er fern.'] },
            { cells: ['anstatt dass', 'بدلاً من أن (مع فاعل مختلف)', 'Anstatt dass er kam, blieb er zu Hause.'] },
          ], theme: 'default', note: 'mit/zu + Inf للفاعل واحد. dass للفاعلين مختلفين.' },
          { title: 'روابط النتيجة والتناقض', headers: ['الرابط', 'المعنى', 'ترتيب الفعل'], rows: [
            { cells: ['sodass / so dass', 'بحيث (نتيجة)', 'Hauptsatz, sodass + verb am Ende'] },
            { cells: ['so..., dass', 'كذا، بحيث', 'Es ist so kalt, dass wir frieren.'] },
            { cells: ['deshalb', 'لذلك', 'Es regnet. Deshalb bleiben wir.'] },
            { cells: ['trotzdem', 'مع ذلك', 'Es regnet. Trotzdem gehen wir.'] },
            { cells: ['je...desto', 'كلما...كلما', 'Je mehr, desto besser.'] },
            { cells: ['zumal', 'خصوصاً وأن', 'Ich komme, zumal ich Zeit habe.'] },
          ], theme: 'default', note: 'deshalb/trotzdem تأتي في الجملة الثانية الرئيسية. sodass تبدأ جملة فرعية.' },
        ],
        rules: [
          { rule: 'indem يصف الوسيلة — الفعل في النهاية: "Ich lerne, indem ich Filme schaue."', example: 'Sie verbessert ihr Deutsch, indem sie täglich liest.', translation: 'تحسّن ألمانيتها بأن تقرأ يومياً.' },
          { rule: 'ohne zu/anstatt zu للفاعل واحد. ohne dass/anstatt dass لفاعلين مختلفين.', example: 'Er ging, ohne zu sprechen. (نفس الفاعل) / Er ging, ohne dass ich es wusste. (فاعل مختلف)', translation: 'ذهب دون أن يتحدّث / دون أن أعلم.' },
          { rule: 'sodass تأتي بعد فاصلة وفعلها في النهاية. so + adj + dass تستعمل لتشديد سبب.', example: 'Er ist krank, sodass er nicht kommen kann. / Es ist so kalt, dass wir frieren.', translation: 'هو مريض بحيث لا يستطيع المجيء.' },
          { rule: 'je...desto يبدأ بفاصلة كل جملة، ويستعمل صيغة المقارنة.', example: 'Je mehr du übst, desto besser wirst du.', translation: 'كلما تدرّبت أكثر، كلما تحسّنت.' },
        ],
        examples: [
          'Ich lerne Deutsch, indem ich Filme schaue. — أتعلّم الألمانية بمشاهدة الأفلام.',
          'Sie verbessert sich, dadurch dass sie täglich übt. — تتحسّن بالتدريب اليومي.',
          'Er ging, ohne zu fragen. — ذهب دون أن يسأل.',
          'Anstatt zu lernen, schaut er fern. — بدلاً من التعلّم، يشاهد التلفاز.',
          'Es ist so kalt, dass wir frieren. — الجو بارد لدرجة أننا نتجمّد.',
          'Je mehr ich lerne, desto besser werde ich. — كلما تعلّمت أكثر، كلما تحسّنت.',
          'Trotzdem ist er gekommen. — مع ذلك أتى.',
          'Ich komme, zumal ich Zeit habe. — سآتي خصوصاً وأن لدي وقتاً.',
        ],
        tip: 'احفظ 5 روابط جديدة كل أسبوع وكوّن جملة لكل واحد. خلال شهرين، ستكتب جملاً معقّدة بسهولة. اختبار B2 يقدّر الـ Konnektoren — كلما زادت تنوّعت كتابتك.',
      },
      vocabulary: [
        { german: 'indem', arabic: 'بأن', example: 'Ich lerne, indem ich übe.', exampleArabic: 'أتعلّم بالتدريب.', type: 'conjunction' },
        { german: 'dadurch dass', arabic: 'بذلك أن', example: 'Dadurch dass er hilft, lerne ich schneller.', exampleArabic: 'بذلك أنه يساعد، أتعلم أسرع.', type: 'conjunction' },
        { german: 'ohne zu', arabic: 'دون أن', example: 'Er ging, ohne zu sprechen.', exampleArabic: 'ذهب دون أن يتحدّث.', type: 'conjunction' },
        { german: 'ohne dass', arabic: 'دون أن (فاعل مختلف)', example: 'Er kam, ohne dass ich es wusste.', exampleArabic: 'أتى دون أن أعلم.', type: 'conjunction' },
        { german: 'anstatt zu', arabic: 'بدلاً من أن', example: 'Anstatt zu lernen, spielt er.', exampleArabic: 'بدلاً من التعلّم، يلعب.', type: 'conjunction' },
        { german: 'anstatt dass', arabic: 'بدلاً من أن (مختلف)', example: 'Anstatt dass er hilft, lacht er.', exampleArabic: 'بدلاً من أن يساعد، يضحك.', type: 'conjunction' },
        { german: 'sodass', arabic: 'بحيث', example: 'Es regnet, sodass wir bleiben.', exampleArabic: 'تمطر بحيث نبقى.', type: 'conjunction' },
        { german: 'so...dass', arabic: 'كذا...بحيث', example: 'Es ist so kalt, dass wir frieren.', exampleArabic: 'الجو بارد لدرجة أننا نتجمّد.', type: 'conjunction' },
        { german: 'trotzdem', arabic: 'مع ذلك', example: 'Es regnet. Trotzdem gehe ich.', exampleArabic: 'تمطر. مع ذلك أذهب.', type: 'adverb' },
        { german: 'dennoch', arabic: 'ومع ذلك', example: 'Er ist müde, dennoch arbeitet er.', exampleArabic: 'هو متعب، ومع ذلك يعمل.', type: 'adverb' },
        { german: 'jedoch', arabic: 'إلا أن', example: 'Er kam, jedoch zu spät.', exampleArabic: 'أتى، إلا أنه متأخّراً.', type: 'adverb' },
        { german: 'allerdings', arabic: 'مع ذلك', example: 'Allerdings ist es kalt.', exampleArabic: 'مع ذلك الجو بارد.', type: 'adverb' },
        { german: 'deshalb', arabic: 'لذلك', example: 'Es regnet. Deshalb bleiben wir.', exampleArabic: 'تمطر. لذلك نبقى.', type: 'adverb' },
        { german: 'daher', arabic: 'لذا', example: 'Daher ist es wichtig.', exampleArabic: 'لذا فهو مهم.', type: 'adverb' },
        { german: 'demzufolge', arabic: 'وبالتالي', example: 'Demzufolge ändert sich alles.', exampleArabic: 'وبالتالي يتغيّر كل شيء.', type: 'adverb' },
        { german: 'je...desto', arabic: 'كلما...كلما', example: 'Je mehr, desto besser.', exampleArabic: 'كلما أكثر، كلما أفضل.', type: 'phrase' },
        { german: 'zumal', arabic: 'خصوصاً وأن', example: 'Ich komme, zumal ich Zeit habe.', exampleArabic: 'سآتي خصوصاً ولديّ وقت.', type: 'conjunction' },
        { german: 'sofern', arabic: 'بقدر ما', example: 'Sofern es geht, helfe ich.', exampleArabic: 'بقدر ما يمكن، أساعد.', type: 'conjunction' },
        { german: 'insofern', arabic: 'بقدر ما / بهذا القدر', example: 'Insofern stimme ich zu.', exampleArabic: 'إلى هذا القدر أوافق.', type: 'adverb' },
        { german: 'falls', arabic: 'في حال', example: 'Falls es regnet...', exampleArabic: 'في حال أمطرت...', type: 'conjunction' },
        { german: 'sobald', arabic: 'حالما', example: 'Sobald er kommt, gehen wir.', exampleArabic: 'حالما يأتي، نذهب.', type: 'conjunction' },
        { german: 'während', arabic: 'بينما', example: 'Während er liest, koche ich.', exampleArabic: 'بينما يقرأ، أطبخ.', type: 'conjunction' },
        { german: 'inzwischen', arabic: 'في تلك الأثناء', example: 'Inzwischen ist es spät geworden.', exampleArabic: 'في تلك الأثناء أصبح متأخّراً.', type: 'adverb' },
        { german: 'mittlerweile', arabic: 'في غضون ذلك', example: 'Mittlerweile habe ich es verstanden.', exampleArabic: 'في غضون ذلك فهمته.', type: 'adverb' },
        { german: 'die Folge', arabic: 'النتيجة', example: 'Die Folgen sind klar.', exampleArabic: 'النتائج واضحة.', type: 'noun', gender: 'die', plural: 'die Folgen' },
        { german: 'die Ursache', arabic: 'السبب', example: 'Was ist die Ursache?', exampleArabic: 'ما السبب؟', type: 'noun', gender: 'die', plural: 'die Ursachen' },
        { german: 'der Zusammenhang', arabic: 'الترابط', example: 'Der Zusammenhang ist klar.', exampleArabic: 'الترابط واضح.', type: 'noun', gender: 'der', plural: 'die Zusammenhänge' },
        { german: 'der Vergleich', arabic: 'المقارنة', example: 'Im Vergleich dazu...', exampleArabic: 'بالمقارنة مع ذلك...', type: 'noun', gender: 'der', plural: 'die Vergleiche' },
        { german: 'der Gegensatz', arabic: 'النقيض', example: 'Im Gegensatz zu ihm...', exampleArabic: 'على عكسه...', type: 'noun', gender: 'der', plural: 'die Gegensätze' },
        { german: 'das Argument', arabic: 'الحجة', example: 'Ein starkes Argument.', exampleArabic: 'حجة قوية.', type: 'noun', gender: 'das', plural: 'die Argumente' },
        { german: 'die Begründung', arabic: 'التبرير', example: 'Die Begründung ist überzeugend.', exampleArabic: 'التبرير مقنع.', type: 'noun', gender: 'die', plural: 'die Begründungen' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'b2-17-q1', question: 'وسيلة: "Ich lerne, ___ ich Filme schaue."', answer: 'indem', hint: 'indem = بأن (وسيلة)' },
          { type: 'multiple-choice', id: 'b2-17-q2', question: 'بدلاً من أن (نفس الفاعل):', options: ['anstatt dass', 'anstatt zu', 'ohne zu', 'sodass'], answer: 'anstatt zu' },
          { type: 'fill-blank', id: 'b2-17-q3', question: 'نتيجة: "Es ist so kalt, ___ wir frieren."', answer: 'dass', hint: 'so + adj + dass' },
          { type: 'multiple-choice', id: 'b2-17-q4', question: '"كلما...كلما"', options: ['je...desto', 'wenn...dann', 'so...wie', 'als...so'], answer: 'je...desto' },
          { type: 'fill-blank', id: 'b2-17-q5', question: 'تناقض: "Es regnet. ___ gehe ich." (مع ذلك)', answer: 'Trotzdem', hint: 'trotzdem = مع ذلك' },
          { type: 'matching', id: 'b2-17-q6', question: 'اربط الرابط بنوعه:', pairs: [
            { left: 'indem', right: 'وسيلة' },
            { left: 'sodass', right: 'نتيجة' },
            { left: 'trotzdem', right: 'تناقض' },
            { left: 'anstatt zu', right: 'بديل' },
            { left: 'während', right: 'وقت متزامن' },
            { left: 'sobald', right: 'وقت لاحق' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'b2-17-q7', question: 'رتّب: "أتعلّم بأن أشاهد الأفلام"', words: ['Ich', 'lerne,', 'indem', 'ich', 'Filme', 'schaue'], answer: 'Ich lerne, indem ich Filme schaue' },
          { type: 'speaking', id: 'b2-17-q8', question: 'قل: "كلما تدرّبت أكثر، كلما تحسّنت"', answer: 'Je mehr du übst, desto besser wirst du' },
          { type: 'fill-blank', id: 'b2-17-q9', question: 'استمع: "Er ging, ___ zu sprechen."', audioPrompt: 'Er ging, ohne zu sprechen.', answer: 'ohne', hint: 'ohne zu = دون أن' },
          { type: 'multiple-choice', id: 'b2-17-q10', question: 'بعد sodass، الفعل في:', options: ['البداية', 'الثاني', 'النهاية', 'لا فرق'], answer: 'النهاية' },
          { type: 'fill-blank', id: 'b2-17-q11', question: 'تشديد سبب: "Es ist ___ kalt, dass wir frieren." (كذا)', answer: 'so', hint: 'so + adj + dass' },
          { type: 'multiple-choice', id: 'b2-17-q12', question: 'دون أن (مع فاعلين مختلفين):', options: ['ohne zu', 'ohne dass', 'sodass', 'als ob'], answer: 'ohne dass' },
          { type: 'fill-blank', id: 'b2-17-q13', question: '"Sie verbessert sich ___ tägliches Üben." (بـ — وسيلة، اسم)', answer: 'durch', hint: 'durch + Akk = وسيلة' },
          { type: 'matching', id: 'b2-17-q14', question: 'اربط الرابط بالنوع:', pairs: [
            { left: 'während', right: 'وقت متزامن' },
            { left: 'sobald', right: 'وقت لاحق' },
            { left: 'zumal', right: 'سبب إضافي' },
            { left: 'allerdings', right: 'تخفيف موافقة' },
            { left: 'sofern', right: 'شرط' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'b2-17-q15', question: 'رتّب: "كلما تعلّمت أكثر، كلما تحسّنت"', words: ['Je', 'mehr', 'du', 'lernst,', 'desto', 'besser', 'wirst', 'du'], answer: 'Je mehr du lernst, desto besser wirst du' },
          { type: 'fill-blank', id: 'b2-17-q16', question: 'استمع: "Er ging weg, ___ zu sprechen." (دون أن)', audioPrompt: 'Er ging weg, ohne zu sprechen.', answer: 'ohne', hint: 'ohne zu + Inf' },
          { type: 'multiple-choice', id: 'b2-17-q17', question: 'بعد je، الفعل:', options: ['في النهاية', 'في الثاني', 'مع verb-comma-verb pattern', 'حذف'], answer: 'في النهاية' },
          { type: 'speaking', id: 'b2-17-q18', question: 'قل: "أتعلّم بقراءة الكتب الألمانية"', answer: 'Ich lerne, indem ich deutsche Bücher lese' },
          { type: 'fill-blank', id: 'b2-17-q19', question: '"Sie kam, ___ ich es wusste." (دون أن، فاعل مختلف)', answer: 'ohne dass', hint: 'ohne dass + فاعل مختلف' },
          { type: 'multiple-choice', id: 'b2-17-q20', question: 'الفرق بين trotzdem و obwohl؟', options: ['نفس الشيء', 'trotzdem أداة، obwohl حرف ربط', 'trotzdem في النهاية، obwohl في البداية', 'لا فرق'], answer: 'trotzdem أداة، obwohl حرف ربط' },
        ],
      },
    },
  ],
}
