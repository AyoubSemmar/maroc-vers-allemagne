import type { Level } from './types'

export const C1: Level = {
  id: 'C1',
  title: 'المستوى الخامس',
  description: 'إتقان اللغة الألمانية — مستوى احترافي.',
  color: 'bg-red-500',
  emoji: '🏆',
  iconName: 'trophy',
  lessons: [
    {
      id: 'c1-01',
      title: 'Konjunktiv II الماضي — التمني والأسف',
      order: 1,
      grammar: {
        title: 'Konjunktiv II في الزمن الماضي',
        content: `في C1 نُعبر عن الأسف والتمني لأشياء لم تحدث في الماضي باستخدام **Konjunktiv II der Vergangenheit**.

**البنية:** hätte / wäre + Partizip II

- مع أفعال الحركة والتغير: **wäre** + Partizip II
- مع باقي الأفعال: **hätte** + Partizip II

**الاستخدامات:**
1. الأسف على أشياء لم تحدث
2. اللوم والانتقاد
3. النصيحة المتأخرة
4. الشرط غير الحقيقي في الماضي

**مع الأفعال المودالية:** hätte + Infinitiv + Modalverb (Doppelinfinitiv)
→ Ich hätte früher kommen **sollen**.`,
        tables: [
          {
            title: 'Konjunktiv II Vergangenheit',
            headers: ['الفاعل', 'haben', 'sein'],
            rows: [
              { cells: ['ich', 'hätte gemacht', 'wäre gegangen'] },
              { cells: ['du', 'hättest gemacht', 'wärst gegangen'] },
              { cells: ['er/sie/es', 'hätte gemacht', 'wäre gegangen'] },
              { cells: ['wir', 'hätten gemacht', 'wären gegangen'] },
              { cells: ['ihr', 'hättet gemacht', 'wärt gegangen'] },
              { cells: ['sie/Sie', 'hätten gemacht', 'wären gegangen'] },
            ],
            theme: 'conjugation',
          },
          {
            title: 'مع الأفعال المودالية (Doppelinfinitiv)',
            headers: ['الجملة', 'المعنى'],
            rows: [
              { cells: ['Ich hätte lernen **sollen**.', 'كان يجب أن أدرس.'] },
              { cells: ['Du hättest kommen **können**.', 'كان بإمكانك أن تأتي.'] },
              { cells: ['Sie hätte bleiben **müssen**.', 'كان يتعين عليها البقاء.'] },
              { cells: ['Wir hätten gehen **dürfen**.', 'كان مسموحاً لنا بالذهاب.'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'مع haben: hätte + Partizip II', example: 'Ich hätte das gewusst.', translation: 'كنت سأعرف ذلك.' },
          { rule: 'مع sein: wäre + Partizip II', example: 'Er wäre früher gekommen.', translation: 'كان سيأتي مبكراً.' },
          { rule: 'مع Modalverb: hätte + Infinitiv + Modalverb', example: 'Sie hätte es sagen müssen.', translation: 'كان يجب أن تقول ذلك.' },
        ],
        examples: [
          'Wenn ich das gewusst hätte, wäre ich nicht gekommen. — لو كنت أعلم ذلك، لما كنت أتيت.',
          'Du hättest mich anrufen sollen. — كان يجب أن تتصل بي.',
          'An deiner Stelle hätte ich anders reagiert. — لو كنت مكانك لتصرفت بشكل مختلف.',
          'Wir wären fast zu spät gekommen. — كدنا نصل متأخرين.',
          'Sie hätte das Projekt übernehmen können. — كان بإمكانها تولي المشروع.',
          'Hätte er nur früher studiert! — ليته درس مبكراً!',
          'Das hätte nicht passieren dürfen. — ما كان ينبغي أن يحدث ذلك.',
          'Ohne deine Hilfe hätte ich es nicht geschafft. — بدون مساعدتك، لما تمكنت من إنجازها.',
        ],
        tip: '💡 الفرق بين "Ich hätte kommen sollen" (كان يجب أن آتي — لم أفعل) و"Ich sollte kommen" (كان ينبغي أن آتي — بدون تحديد ما حدث فعلاً).',
      },
      vocabulary: [
        { german: 'bedauern', arabic: 'يندم / يأسف', example: 'Ich bedauere, nicht früher gehandelt zu haben.', type: 'verb' },
        { german: 'verpassen', arabic: 'يفوّت', example: 'Ich habe den Zug verpasst.', type: 'verb' },
        { german: 'die Gelegenheit', arabic: 'الفرصة', gender: 'die', plural: 'Gelegenheiten', type: 'noun' },
        { german: 'zögern', arabic: 'يتردد', example: 'Er zögerte, die Entscheidung zu treffen.', type: 'verb' },
        { german: 'versäumen', arabic: 'يُفوّت / يُهمل', example: 'Er hat die Chance versäumt.', type: 'verb' },
        { german: 'rückblickend', arabic: 'بأثر رجعي / عند النظر للوراء', type: 'adverb' },
        { german: 'die Reue', arabic: 'الندم', gender: 'die', type: 'noun' },
        { german: 'der Fehler', arabic: 'الخطأ', gender: 'der', plural: 'Fehler', type: 'noun' },
        { german: 'vermeiden', arabic: 'يتجنب', example: 'Das hätten wir vermeiden sollen.', type: 'verb' },
        { german: 'einsehen', arabic: 'يُدرك / يعترف', example: 'Ich sehe ein, dass ich mich geirrt habe.', type: 'verb' },
        { german: 'der Ratschlag', arabic: 'النصيحة', gender: 'der', plural: 'Ratschläge', type: 'noun' },
        { german: 'die Entscheidung', arabic: 'القرار', gender: 'die', plural: 'Entscheidungen', type: 'noun' },
        { german: 'gehandelt haben', arabic: 'تصرَّف', type: 'verb' },
        { german: 'reagieren', arabic: 'يتفاعل / يرد', type: 'verb' },
        { german: 'an deiner Stelle', arabic: 'لو كنت مكانك', type: 'phrase' },
        { german: 'übernehmen', arabic: 'يتولى', example: 'Sie übernahm die Leitung.', type: 'verb' },
        { german: 'scheitern', arabic: 'يفشل / يُخفق', type: 'verb' },
        { german: 'die Konsequenz', arabic: 'النتيجة / العاقبة', gender: 'die', plural: 'Konsequenzen', type: 'noun' },
        { german: 'nachdenklich', arabic: 'متأمل / مفكر', type: 'adjective' },
        { german: 'vorhersehen', arabic: 'يتوقع / يتنبأ بـ', type: 'verb' },
        { german: 'die Möglichkeit', arabic: 'الإمكانية', gender: 'die', plural: 'Möglichkeiten', type: 'noun' },
        { german: 'die Vergangenheit', arabic: 'الماضي', gender: 'die', type: 'noun' },
        { german: 'die Zukunft', arabic: 'المستقبل', gender: 'die', type: 'noun' },
        { german: 'die Hypothese', arabic: 'الفرضية', gender: 'die', plural: 'Hypothesen', type: 'noun' },
        { german: 'das Schicksal', arabic: 'القدر', gender: 'das', type: 'noun' },
        { german: 'die Vorhersage', arabic: 'التنبؤ', gender: 'die', plural: 'Vorhersagen', type: 'noun' },
        { german: 'die Wahl', arabic: 'الاختيار', gender: 'die', plural: 'Wahlen', type: 'noun' },
        { german: 'die Reflexion', arabic: 'التأمل', gender: 'die', type: 'noun' },
        { german: 'sich überlegen', arabic: 'يفكّر مليّاً', type: 'verb' },
        { german: 'erkennen', arabic: 'يدرك', type: 'verb' },
        { german: 'verzichten', arabic: 'يستغني', type: 'verb' },
        { german: 'verschieben', arabic: 'يؤجّل', type: 'verb' },
        { german: 'aufgeben', arabic: 'يستسلم', type: 'verb' },
        { german: 'unwiederbringlich', arabic: 'لا يعود', type: 'adjective' },
        { german: 'irreversibel', arabic: 'لا رجعة فيه', type: 'adjective' },
      ],
      exercise: {
        questions: [
          { id: 'c1-01-q1', type: 'multiple-choice', question: 'اختر: "Ich ___ dich angerufen, aber ich hatte keine Zeit."', options: ['hätte', 'wäre', 'würde', 'hatte'], answer: 'hätte' },
          { id: 'c1-01-q2', type: 'fill-blank', question: 'أكمل: "Wenn er früher ___ (kommen), hätten wir uns gesehen."', answer: 'gekommen wäre', hint: 'Konjunktiv II Vergangenheit مع sein' },
          { id: 'c1-01-q3', type: 'multiple-choice', question: '"Du hättest lernen sollen" تعني:', options: ['يجب أن تدرس الآن.', 'كان يجب أن تدرس.', 'ستدرس قريباً.', 'أنت تدرس.'], answer: 'كان يجب أن تدرس.' },
          { id: 'c1-01-q4', type: 'drag-drop', question: 'رتب الجملة:', words: ['Das', 'hätte', 'nicht', 'passieren', 'dürfen'], answer: 'Das hätte nicht passieren dürfen' },
          { id: 'c1-01-q5', type: 'fill-blank', question: 'أكمل: "An deiner Stelle ___ ich anders reagiert." (من الحجّة)', answer: 'hätte', hint: 'haben في Konjunktiv II' },
          { id: 'c1-01-q6', type: 'multiple-choice', question: 'اختر الصحيح:', options: ['Ich hätte gegangen.', 'Ich wäre gegangen.', 'Ich würde gegangen.', 'Ich hatte gegangen.'], answer: 'Ich wäre gegangen.' },
          { id: 'c1-01-q7', type: 'matching', question: 'طابق:', pairs: [{ left: 'hätte gesagt', right: 'كان سيقول' }, { left: 'wäre gefahren', right: 'كان سيسافر' }, { left: 'hätte gelesen', right: 'كان سيقرأ' }, { left: 'wäre geblieben', right: 'كان سيبقى' }], answer: 'matched' },
          { id: 'c1-01-q8', type: 'fill-blank', question: 'أكمل: "Ohne deine Hilfe ___ ich es nicht geschafft."', answer: 'hätte', hint: 'haben في Konjunktiv II' },
          { id: 'c1-01-q9', type: 'speaking', question: 'قل: "لو كنت أعلم، لجئت مبكراً." (Wenn ich das gewusst hätte, wäre ich früher gekommen.)', audioPrompt: 'Wenn ich das gewusst hätte, wäre ich früher gekommen.', answer: 'Wenn ich das gewusst hätte, wäre ich früher gekommen' },
          { id: 'c1-01-q10', type: 'drag-drop', question: 'رتب:', words: ['Sie', 'hätte', 'es', 'sagen', 'müssen'], answer: 'Sie hätte es sagen müssen' },
          { id: 'c1-01-q11', type: 'fill-blank', question: '"Hätten wir mehr Zeit ___, wären wir geblieben." (Konj. II Vergangenheit)', answer: 'gehabt', hint: 'haben → gehabt' },
          { id: 'c1-01-q12', type: 'multiple-choice', question: 'لتعبير عن أسف في الماضي، نستعمل:', options: ['Konjunktiv II Präsens', 'Konjunktiv II Vergangenheit', 'Indikativ', 'Imperativ'], answer: 'Konjunktiv II Vergangenheit' },
          { id: 'c1-01-q13', type: 'fill-blank', question: '"Ich ___ das nie machen sollen." (لم يكن ينبغي - Konj. II)', answer: 'hätte', hint: 'hätte + sollen' },
          { id: 'c1-01-q14', type: 'multiple-choice', question: 'بنية Konj. II Vergangenheit:', options: ['würde + Inf', 'hätte/wäre + Partizip II', 'haben/sein + Inf', 'werde + Partizip'], answer: 'hätte/wäre + Partizip II' },
          { id: 'c1-01-q15', type: 'matching', question: 'اربط:', pairs: [{ left: 'بدون مساعدتك', right: 'Ohne deine Hilfe' }, { left: 'لو كنت أعلم', right: 'Wenn ich es gewusst hätte' }, { left: 'لو كنت مكانك', right: 'An deiner Stelle' }, { left: 'كان ينبغي عليّ', right: 'Ich hätte sollen' }], answer: 'matched' },
          { id: 'c1-01-q16', type: 'drag-drop', question: 'رتّب: "لو كان عندي وقت أكثر، لتعلّمت اللغة الفرنسية"', words: ['Wenn', 'ich', 'mehr', 'Zeit', 'gehabt', 'hätte,', 'hätte', 'ich', 'Französisch', 'gelernt'], answer: 'Wenn ich mehr Zeit gehabt hätte, hätte ich Französisch gelernt' },
          { id: 'c1-01-q17', type: 'speaking', question: 'قل: "كان من الأفضل لو فكّرت أكثر"', answer: 'Es wäre besser gewesen, wenn ich mehr nachgedacht hätte' },
          { id: 'c1-01-q18', type: 'fill-blank', question: 'استمع: "Du hättest mich ___." (تتصل — anrufen)', audioPrompt: 'Du hättest mich anrufen sollen.', answer: 'anrufen sollen', hint: 'Modalverb في النهاية' },
          { id: 'c1-01-q19', type: 'multiple-choice', question: '"Wenn er pünktlich gewesen wäre" تعبّر عن:', options: ['شرط واقعي', 'شرط ماضٍ غير محقّق', 'شرط مستقبلي', 'حقيقة'], answer: 'شرط ماضٍ غير محقّق' },
          { id: 'c1-01-q20', type: 'drag-drop', question: 'رتّب: "كنت أفضّل لو لم تأتِ"', words: ['Ich', 'hätte', 'es', 'lieber', 'gehabt,', 'wenn', 'du', 'nicht', 'gekommen', 'wärst'], answer: 'Ich hätte es lieber gehabt, wenn du nicht gekommen wärst' },
        ],
      },
    },
    {
      id: 'c1-02',
      title: 'n-Deklination — انحراف الأسماء الضعيفة',
      order: 2,
      grammar: {
        title: 'أسماء تأخذ -n / -en في كل الحالات عدا Nominativ',
        content: `بعض الأسماء المذكرة تأخذ النهاية **-n** أو **-en** في جميع الحالات عدا Nominativ مفرد.

**أسماء n-Deklination الشائعة:**
- أسماء الأشخاص المذكرة: der Herr, der Student, der Nachbar, der Kollege, der Junge, der Mensch
- الحيوانات: der Löwe, der Bär, der Elefant, der Affe, der Hase
- الجنسيات: der Türke, der Franzose, der Grieche, der Russe
- أسماء لاتينية/يونانية: der Präsident, der Polizist, der Journalist, der Philosoph, der Demokrat

**القاعدة:** كل الحالات عدا Nominativ Singular تأخذ -n أو -en.

**خطأ شائع:** "Ich sehe den Student" ❌ → "Ich sehe den Studenten" ✅`,
        tables: [
          {
            title: 'der Student (n-Deklination)',
            headers: ['الحالة', 'Singular', 'Plural'],
            rows: [
              { cells: ['Nominativ', 'der Student', 'die Studenten'], highlight: true },
              { cells: ['Akkusativ', 'den Studen**ten**', 'die Studenten'] },
              { cells: ['Dativ', 'dem Studen**ten**', 'den Studenten'] },
              { cells: ['Genitiv', 'des Studen**ten**', 'der Studenten'] },
            ],
            theme: 'cases',
          },
          {
            title: 'der Herr (حالة خاصة)',
            headers: ['الحالة', 'Singular', 'Plural'],
            rows: [
              { cells: ['Nominativ', 'der Herr', 'die Herren'], highlight: true },
              { cells: ['Akkusativ', 'den Herr**n**', 'die Herren'] },
              { cells: ['Dativ', 'dem Herr**n**', 'den Herren'] },
              { cells: ['Genitiv', 'des Herr**n**', 'der Herren'] },
            ],
            theme: 'cases',
          },
          {
            title: 'أسماء شائعة في n-Deklination',
            headers: ['الاسم', 'Akkusativ', 'المعنى'],
            rows: [
              { cells: ['der Mensch', 'den Menschen', 'الإنسان'] },
              { cells: ['der Kollege', 'den Kollegen', 'الزميل'] },
              { cells: ['der Nachbar', 'den Nachbarn', 'الجار'] },
              { cells: ['der Präsident', 'den Präsidenten', 'الرئيس'] },
              { cells: ['der Journalist', 'den Journalisten', 'الصحفي'] },
              { cells: ['der Name', 'den Namen', 'الاسم (+ Genitiv -ns)'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'الأسماء المذكرة من n-Deklination تأخذ -n في كل الحالات عدا Nominativ', example: 'Ich helfe dem Nachbarn.', translation: 'أساعد الجار.' },
          { rule: 'Herr يأخذ -n في المفرد و-en في الجمع', example: 'Guten Tag, Herr Müller!', translation: 'صباح الخير، سيد مولر!' },
          { rule: 'Name يأخذ -n + -s في Genitiv (شاذ)', example: 'Der Name des Buches', translation: 'اسم الكتاب (des Namens)' },
        ],
        examples: [
          'Ich kenne den Studenten aus Berlin. — أعرف الطالب من برلين.',
          'Er sprach mit dem Präsidenten. — تحدث مع الرئيس.',
          'Das ist das Auto meines Kollegen. — هذه سيارة زميلي.',
          'Guten Tag, Herr Schmidt! — صباح الخير، سيد شميت!',
          'Wir haben den Nachbarn eingeladen. — دعونا الجار.',
          'Die Rede des Präsidenten war lang. — خطاب الرئيس كان طويلاً.',
          'Ich glaube dem Journalisten nicht. — لا أصدق الصحفي.',
          'Sie hilft dem Jungen. — تساعد الولد.',
        ],
        tip: '💡 تذكر: معظم الأسماء المذكرة المنتهية بـ -e (Junge, Kollege, Löwe) تخضع لـ n-Deklination، وكذلك الأسماء اللاتينية المنتهية بـ -ist, -ent, -ant (Polizist, Student, Praktikant).',
      },
      vocabulary: [
        { german: 'der Herr', arabic: 'السيد', gender: 'der', plural: 'Herren', type: 'noun' },
        { german: 'der Student', arabic: 'الطالب', gender: 'der', plural: 'Studenten', type: 'noun' },
        { german: 'der Kollege', arabic: 'الزميل', gender: 'der', plural: 'Kollegen', type: 'noun' },
        { german: 'der Nachbar', arabic: 'الجار', gender: 'der', plural: 'Nachbarn', type: 'noun' },
        { german: 'der Mensch', arabic: 'الإنسان', gender: 'der', plural: 'Menschen', type: 'noun' },
        { german: 'der Präsident', arabic: 'الرئيس', gender: 'der', plural: 'Präsidenten', type: 'noun' },
        { german: 'der Journalist', arabic: 'الصحفي', gender: 'der', plural: 'Journalisten', type: 'noun' },
        { german: 'der Polizist', arabic: 'الشرطي', gender: 'der', plural: 'Polizisten', type: 'noun' },
        { german: 'der Junge', arabic: 'الولد / الصبي', gender: 'der', plural: 'Jungen', type: 'noun' },
        { german: 'der Name', arabic: 'الاسم', gender: 'der', plural: 'Namen', type: 'noun' },
        { german: 'der Philosoph', arabic: 'الفيلسوف', gender: 'der', plural: 'Philosophen', type: 'noun' },
        { german: 'der Demokrat', arabic: 'الديمقراطي', gender: 'der', plural: 'Demokraten', type: 'noun' },
        { german: 'der Türke', arabic: 'التركي', gender: 'der', plural: 'Türken', type: 'noun' },
        { german: 'der Franzose', arabic: 'الفرنسي', gender: 'der', plural: 'Franzosen', type: 'noun' },
        { german: 'der Praktikant', arabic: 'المتدرب', gender: 'der', plural: 'Praktikanten', type: 'noun' },
        { german: 'der Experte', arabic: 'الخبير', gender: 'der', plural: 'Experten', type: 'noun' },
        { german: 'der Affe', arabic: 'القرد', gender: 'der', plural: 'Affen', type: 'noun' },
        { german: 'der Bär', arabic: 'الدب', gender: 'der', plural: 'Bären', type: 'noun' },
        { german: 'der Löwe', arabic: 'الأسد', gender: 'der', plural: 'Löwen', type: 'noun' },
        { german: 'der Zeuge', arabic: 'الشاهد', gender: 'der', plural: 'Zeugen', type: 'noun' },
        { german: 'der Patient', arabic: 'المريض', gender: 'der', plural: 'Patienten', type: 'noun' },
        { german: 'der Kunde', arabic: 'الزبون', gender: 'der', plural: 'Kunden', type: 'noun' },
        { german: 'der Architekt', arabic: 'المهندس المعماري', gender: 'der', plural: 'Architekten', type: 'noun' },
        { german: 'der Pilot', arabic: 'الطيار', gender: 'der', plural: 'Piloten', type: 'noun' },
        { german: 'der Bauer', arabic: 'الفلاح', gender: 'der', plural: 'Bauern', type: 'noun' },
        { german: 'der Heilige', arabic: 'القدّيس', gender: 'der', plural: 'Heilige', type: 'noun' },
        { german: 'der Held', arabic: 'البطل', gender: 'der', plural: 'Helden', type: 'noun' },
        { german: 'der Idiot', arabic: 'الأحمق', gender: 'der', plural: 'Idioten', type: 'noun' },
        { german: 'der Kandidat', arabic: 'المرشّح', gender: 'der', plural: 'Kandidaten', type: 'noun' },
        { german: 'der Tourist', arabic: 'السائح', gender: 'der', plural: 'Touristen', type: 'noun' },
        { german: 'der Kapitalist', arabic: 'الرأسمالي', gender: 'der', plural: 'Kapitalisten', type: 'noun' },
        { german: 'der Soldat', arabic: 'الجندي', gender: 'der', plural: 'Soldaten', type: 'noun' },
        { german: 'der Mediziner', arabic: 'الطبيب الباحث', gender: 'der', plural: 'Mediziner', type: 'noun' },
        { german: 'der Junggeselle', arabic: 'الأعزب', gender: 'der', plural: 'Junggesellen', type: 'noun' },
        { german: 'der Sklave', arabic: 'العبد', gender: 'der', plural: 'Sklaven', type: 'noun' },
      ],
      exercise: {
        questions: [
          { id: 'c1-02-q1', type: 'multiple-choice', question: 'اختر: "Ich habe ___ gesehen." (الطالب)', options: ['der Student', 'den Student', 'den Studenten', 'dem Studenten'], answer: 'den Studenten' },
          { id: 'c1-02-q2', type: 'fill-blank', question: 'أكمل: "Ich helfe meinem ___." (الجار)', answer: 'Nachbarn', hint: 'Dativ + n-Deklination' },
          { id: 'c1-02-q3', type: 'multiple-choice', question: '"Guten Tag, ___ Müller!"', options: ['Herr', 'Herrn', 'Herren', 'der Herr'], answer: 'Herr' },
          { id: 'c1-02-q4', type: 'fill-blank', question: 'أكمل: "Das Auto des ___." (الزميل)', answer: 'Kollegen', hint: 'Genitiv + n-Deklination' },
          { id: 'c1-02-q5', type: 'drag-drop', question: 'رتب:', words: ['Ich', 'kenne', 'den', 'Journalisten', 'aus', 'Berlin'], answer: 'Ich kenne den Journalisten aus Berlin' },
          { id: 'c1-02-q6', type: 'multiple-choice', question: 'أي جملة صحيحة؟', options: ['Ich sehe der Herr.', 'Ich sehe den Herr.', 'Ich sehe den Herrn.', 'Ich sehe dem Herrn.'], answer: 'Ich sehe den Herrn.' },
          { id: 'c1-02-q7', type: 'matching', question: 'طابق Akkusativ:', pairs: [{ left: 'der Mensch', right: 'den Menschen' }, { left: 'der Junge', right: 'den Jungen' }, { left: 'der Präsident', right: 'den Präsidenten' }, { left: 'der Name', right: 'den Namen' }], answer: 'matched' },
          { id: 'c1-02-q8', type: 'fill-blank', question: 'أكمل: "Er sprach mit dem ___." (الرئيس)', answer: 'Präsidenten', hint: 'Dativ' },
          { id: 'c1-02-q9', type: 'speaking', question: 'قل: "Ich glaube dem Journalisten nicht."', audioPrompt: 'Ich glaube dem Journalisten nicht.', answer: 'Ich glaube dem Journalisten nicht' },
          { id: 'c1-02-q10', type: 'drag-drop', question: 'رتب:', words: ['Das', 'Haus', 'meines', 'Nachbarn', 'ist', 'groß'], answer: 'Das Haus meines Nachbarn ist groß' },
          { id: 'c1-02-q11', type: 'fill-blank', question: 'أكمل: "Ich rufe den ___." (الزبون)', answer: 'Kunden', hint: 'Akkusativ + n-Dekl.' },
          { id: 'c1-02-q12', type: 'multiple-choice', question: 'أيّ اسم لا يخضع لـ n-Deklination؟', options: ['der Junge', 'der Kollege', 'der Vater', 'der Mensch'], answer: 'der Vater' },
          { id: 'c1-02-q13', type: 'fill-blank', question: '"Genitiv von der Name"؟', answer: 'des Namens', hint: 'شاذ: -ns' },
          { id: 'c1-02-q14', type: 'multiple-choice', question: 'الأسماء المنتهية بـ -ist تخضع لـ:', options: ['Nominativ فقط', 'n-Deklination', 'Genitiv فقط', 'لا قاعدة'], answer: 'n-Deklination' },
          { id: 'c1-02-q15', type: 'matching', question: 'اربط Akkusativ:', pairs: [{ left: 'der Mensch', right: 'den Menschen' }, { left: 'der Junge', right: 'den Jungen' }, { left: 'der Bär', right: 'den Bären' }, { left: 'der Pilot', right: 'den Piloten' }, { left: 'der Tourist', right: 'den Touristen' }], answer: 'matched' },
          { id: 'c1-02-q16', type: 'drag-drop', question: 'رتّب: "تحدّثت مع المريض"', words: ['Ich', 'habe', 'mit', 'dem', 'Patienten', 'gesprochen'], answer: 'Ich habe mit dem Patienten gesprochen' },
          { id: 'c1-02-q17', type: 'speaking', question: 'قل: "أنا أعرف ذلك السائح من تركيا"', answer: 'Ich kenne diesen Touristen aus der Türkei' },
          { id: 'c1-02-q18', type: 'fill-blank', question: 'استمع: "Wir haben den ___ getroffen." (الفيلسوف)', audioPrompt: 'Wir haben den Philosophen getroffen.', answer: 'Philosophen', hint: 'Philosoph → Philosophen' },
          { id: 'c1-02-q19', type: 'multiple-choice', question: 'بأيّ صيغة Genitiv من "der Name"؟', options: ['des Names', 'des Namens', 'der Name', 'dem Namen'], answer: 'des Namens' },
          { id: 'c1-02-q20', type: 'drag-drop', question: 'رتّب: "أُجريت المقابلة مع المرشّح"', words: ['Das', 'Interview', 'wurde', 'mit', 'dem', 'Kandidaten', 'geführt'], answer: 'Das Interview wurde mit dem Kandidaten geführt' },
        ],
      },
    },
    {
      id: 'c1-03',
      title: 'بدائل المبني للمجهول — Passiversatzformen',
      order: 3,
      grammar: {
        title: 'طرق بديلة للتعبير عن Passiv',
        content: `بدلاً من استخدام **werden + Partizip II**، توجد بدائل أكثر أناقة في C1.

**1. sich lassen + Infinitiv**
→ يُعبر عن إمكانية (passiv + können)
**Das Problem lässt sich lösen.** = Das Problem kann gelöst werden.

**2. sein + zu + Infinitiv**
→ إمكانية أو ضرورة (passiv + können/müssen)
**Die Aufgabe ist zu lösen.** = Die Aufgabe muss/kann gelöst werden.

**3. صفات بـ -bar / -lich**
→ إمكانية (passiv + können)
**Das Problem ist lösbar.** = Das Problem kann gelöst werden.
**Der Text ist verständlich.** = Der Text kann verstanden werden.

**4. man + فعل فعال**
→ بديل عامي شائع
**Man kann das Problem lösen.**

**5. bekommen / kriegen + Partizip II** (Rezipientenpassiv)
→ يُركز على المتلقي
**Ich bekomme das Paket geschickt.** = Das Paket wird mir geschickt.`,
        tables: [
          {
            title: 'البدائل الأربعة الرئيسية',
            headers: ['الصيغة', 'المثال', 'يعادل'],
            rows: [
              { cells: ['sich lassen', 'Das lässt sich machen.', 'Das kann gemacht werden.'] },
              { cells: ['sein + zu', 'Das ist zu machen.', 'Das muss/kann gemacht werden.'] },
              { cells: ['-bar', 'Das ist machbar.', 'Das kann gemacht werden.'] },
              { cells: ['man + aktiv', 'Man kann das machen.', 'Das kann gemacht werden.'] },
            ],
            theme: 'default',
          },
          {
            title: 'صفات -bar شائعة',
            headers: ['الصفة', 'المعنى', 'يعادل'],
            rows: [
              { cells: ['machbar', 'قابل للإنجاز', 'kann gemacht werden'] },
              { cells: ['lösbar', 'قابل للحل', 'kann gelöst werden'] },
              { cells: ['essbar', 'صالح للأكل', 'kann gegessen werden'] },
              { cells: ['erreichbar', 'قابل للوصول', 'kann erreicht werden'] },
              { cells: ['lesbar', 'مقروء', 'kann gelesen werden'] },
              { cells: ['denkbar', 'قابل للتصور', 'kann gedacht werden'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'sich lassen + Infinitiv = passiv + können', example: 'Die Tür lässt sich öffnen.', translation: 'يمكن فتح الباب.' },
          { rule: 'sein + zu + Infinitiv = passiv + können/müssen', example: 'Das ist leicht zu verstehen.', translation: 'من السهل فهم ذلك.' },
          { rule: 'Adjektiv + -bar = passiv + können', example: 'Diese Frage ist beantwortbar.', translation: 'يمكن الإجابة على هذا السؤال.' },
        ],
        examples: [
          'Das Problem lässt sich lösen. — يمكن حل المشكلة.',
          'Der Text ist leicht zu verstehen. — النص سهل الفهم.',
          'Dieses Gerät ist reparierbar. — هذا الجهاز قابل للإصلاح.',
          'Die Frage ist noch zu klären. — السؤال لا يزال بحاجة إلى توضيح.',
          'Die Tür lässt sich nicht öffnen. — الباب لا يمكن فتحه.',
          'Die Pilze sind essbar. — هذه الفطريات صالحة للأكل.',
          'Das Ergebnis ist nicht vorhersehbar. — النتيجة لا يمكن التنبؤ بها.',
          'Ich bekomme das Paket morgen geliefert. — سأتلقى الطرد غداً.',
        ],
        tip: '💡 في الكتابة الأكاديمية والرسمية، استخدم **"lässt sich"** أو **"ist zu"** بدلاً من "kann ... werden" — يعطي أسلوباً أكثر احترافية.',
      },
      vocabulary: [
        { german: 'sich lassen', arabic: 'يمكن / قابل لـ (مساعد)', type: 'verb' },
        { german: 'machbar', arabic: 'قابل للإنجاز', type: 'adjective' },
        { german: 'lösbar', arabic: 'قابل للحل', type: 'adjective' },
        { german: 'erreichbar', arabic: 'قابل للوصول', type: 'adjective' },
        { german: 'denkbar', arabic: 'قابل للتصور', type: 'adjective' },
        { german: 'vorstellbar', arabic: 'قابل للتخيل', type: 'adjective' },
        { german: 'verständlich', arabic: 'مفهوم', type: 'adjective' },
        { german: 'umsetzbar', arabic: 'قابل للتطبيق', type: 'adjective' },
        { german: 'realisierbar', arabic: 'قابل للتحقيق', type: 'adjective' },
        { german: 'reparierbar', arabic: 'قابل للإصلاح', type: 'adjective' },
        { german: 'ersetzbar', arabic: 'قابل للاستبدال', type: 'adjective' },
        { german: 'unveränderlich', arabic: 'غير قابل للتغيير', type: 'adjective' },
        { german: 'klären', arabic: 'يُوضح / يحسم', type: 'verb' },
        { german: 'beantworten', arabic: 'يجيب على', type: 'verb' },
        { german: 'bewerkstelligen', arabic: 'ينجز / ينفذ (رسمي)', type: 'verb' },
        { german: 'anfechten', arabic: 'يطعن في', type: 'verb' },
        { german: 'in Angriff nehmen', arabic: 'يبدأ بـ / يشرع في', type: 'phrase' },
        { german: 'durchführen', arabic: 'ينفذ / يُجري', type: 'verb' },
        { german: 'die Herausforderung', arabic: 'التحدي', gender: 'die', plural: 'Herausforderungen', type: 'noun' },
        { german: 'die Lösung', arabic: 'الحل', gender: 'die', plural: 'Lösungen', type: 'noun' },
        { german: 'das Problem', arabic: 'المشكلة', gender: 'das', plural: 'Probleme', type: 'noun' },
        { german: 'die Schwierigkeit', arabic: 'الصعوبة', gender: 'die', plural: 'Schwierigkeiten', type: 'noun' },
        { german: 'das Ergebnis', arabic: 'النتيجة', gender: 'das', plural: 'Ergebnisse', type: 'noun' },
        { german: 'die Methode', arabic: 'الطريقة', gender: 'die', plural: 'Methoden', type: 'noun' },
        { german: 'der Ansatz', arabic: 'النهج', gender: 'der', plural: 'Ansätze', type: 'noun' },
        { german: 'der Ausgang', arabic: 'النتيجة النهائية', gender: 'der', plural: 'Ausgänge', type: 'noun' },
        { german: 'die Strategie', arabic: 'الاستراتيجية', gender: 'die', plural: 'Strategien', type: 'noun' },
        { german: 'das Vorgehen', arabic: 'الأسلوب', gender: 'das', type: 'noun' },
        { german: 'verzichtbar', arabic: 'غير ضروري', type: 'adjective' },
        { german: 'unverzichtbar', arabic: 'لا غنى عنه', type: 'adjective' },
        { german: 'erforderlich', arabic: 'مطلوب', type: 'adjective' },
        { german: 'bewältigen', arabic: 'يتغلّب على', type: 'verb' },
        { german: 'meistern', arabic: 'يتقن / يتجاوز', type: 'verb' },
        { german: 'überwinden', arabic: 'يتجاوز', type: 'verb' },
        { german: 'erkennbar', arabic: 'يمكن تمييزه', type: 'adjective' },
      ],
      exercise: {
        questions: [
          { id: 'c1-03-q1', type: 'multiple-choice', question: '"Das Problem lässt sich lösen" تعني:', options: ['يجب حل المشكلة.', 'يمكن حل المشكلة.', 'حُلّت المشكلة.', 'المشكلة صعبة.'], answer: 'يمكن حل المشكلة.' },
          { id: 'c1-03-q2', type: 'fill-blank', question: 'أكمل: "Dieses Gerät ist ___." (قابل للإصلاح)', answer: 'reparierbar', hint: 'صفة من reparieren + bar' },
          { id: 'c1-03-q3', type: 'multiple-choice', question: 'حوّل إلى Passiversatz: "Das kann gemacht werden."', options: ['Das muss machen.', 'Das lässt sich machen.', 'Das war gemacht.', 'Das ist gemacht.'], answer: 'Das lässt sich machen.' },
          { id: 'c1-03-q4', type: 'fill-blank', question: 'أكمل: "Der Text ist leicht ___ verstehen."', answer: 'zu', hint: 'sein + zu + Infinitiv' },
          { id: 'c1-03-q5', type: 'drag-drop', question: 'رتب:', words: ['Die', 'Frage', 'lässt', 'sich', 'beantworten'], answer: 'Die Frage lässt sich beantworten' },
          { id: 'c1-03-q6', type: 'multiple-choice', question: 'أي صفة تعني "قابل للتطبيق"؟', options: ['vorstellbar', 'umsetzbar', 'denkbar', 'lesbar'], answer: 'umsetzbar' },
          { id: 'c1-03-q7', type: 'matching', question: 'طابق:', pairs: [{ left: 'machbar', right: 'kann gemacht werden' }, { left: 'lösbar', right: 'kann gelöst werden' }, { left: 'erreichbar', right: 'kann erreicht werden' }, { left: 'essbar', right: 'kann gegessen werden' }], answer: 'matched' },
          { id: 'c1-03-q8', type: 'fill-blank', question: 'أكمل: "Das Ziel ist ___." (قابل للتحقيق)', answer: 'realisierbar', hint: 'صفة بـ -bar' },
          { id: 'c1-03-q9', type: 'speaking', question: 'قل: "Die Aufgabe ist noch zu klären."', audioPrompt: 'Die Aufgabe ist noch zu klären.', answer: 'Die Aufgabe ist noch zu klären' },
          { id: 'c1-03-q10', type: 'drag-drop', question: 'رتب:', words: ['Diese', 'Pilze', 'sind', 'nicht', 'essbar'], answer: 'Diese Pilze sind nicht essbar' },
          { id: 'c1-03-q11', type: 'fill-blank', question: '"Das Problem ___ sich lösen." (sich lassen)', answer: 'lässt', hint: 'lässt sich + Inf' },
          { id: 'c1-03-q12', type: 'multiple-choice', question: '"Das ist denkbar" تعادل:', options: ['muss gedacht werden', 'kann gedacht werden', 'wurde gedacht', 'darf gedacht werden'], answer: 'kann gedacht werden' },
          { id: 'c1-03-q13', type: 'fill-blank', question: '"Das Auto ist ___." (قابل للإصلاح)', answer: 'reparierbar', hint: '-bar = kann ... werden' },
          { id: 'c1-03-q14', type: 'multiple-choice', question: 'البديل الأكثر رسمية لـ "kann gemacht werden":', options: ['man kann das machen', 'das ist machbar', 'das lässt sich machen', 'beide A و C'], answer: 'beide A و C' },
          { id: 'c1-03-q15', type: 'matching', question: 'اربط الصيغ المتكافئة:', pairs: [{ left: 'Das ist machbar.', right: 'Das kann gemacht werden.' }, { left: 'Das ist zu lesen.', right: 'Das muss gelesen werden.' }, { left: 'Das lässt sich tun.', right: 'Das kann getan werden.' }, { left: 'Man kann das machen.', right: 'Das kann gemacht werden.' }], answer: 'matched' },
          { id: 'c1-03-q16', type: 'drag-drop', question: 'رتّب: "هذه المشكلة قابلة للحل بسهولة"', words: ['Dieses', 'Problem', 'lässt', 'sich', 'leicht', 'lösen'], answer: 'Dieses Problem lässt sich leicht lösen' },
          { id: 'c1-03-q17', type: 'speaking', question: 'قل: "هذه المهمة قابلة للإنجاز خلال أسبوع"', answer: 'Diese Aufgabe ist innerhalb einer Woche machbar' },
          { id: 'c1-03-q18', type: 'fill-blank', question: 'استمع: "Das ___ verständlich." (يكون)', audioPrompt: 'Das ist verständlich.', answer: 'ist', hint: 'sein + adj -lich' },
          { id: 'c1-03-q19', type: 'multiple-choice', question: '"Ich bekomme das Paket geliefert" يُسمى:', options: ['Vorgangspassiv', 'Zustandspassiv', 'Rezipientenpassiv', 'Aktiv'], answer: 'Rezipientenpassiv' },
          { id: 'c1-03-q20', type: 'drag-drop', question: 'رتّب: "النتيجة لا يمكن التنبؤ بها"', words: ['Das', 'Ergebnis', 'ist', 'nicht', 'vorhersehbar'], answer: 'Das Ergebnis ist nicht vorhersehbar' },
        ],
      },
    },
    {
      id: 'c1-04',
      title: 'الجمل الشرطية بدون wenn — Konditional ohne "wenn"',
      order: 4,
      grammar: {
        title: 'الشرطية الرسمية بتقديم الفعل',
        content: `في الألمانية الرسمية والأدبية، يمكن صياغة جمل شرطية **بدون "wenn"** عن طريق تقديم الفعل المُصرَّف إلى بداية الجملة.

**البنية:**
- **مع wenn:** Wenn du Zeit hast, komm vorbei.
- **بدون wenn:** **Hast** du Zeit, komm vorbei.

يعمل هذا في كل الأزمنة:
- **Präsens:** Hat er Geld, kauft er es.
- **Perfekt/Konjunktiv II:** Hätte er gewusst, wäre er gekommen.
- **Plusquamperfekt/Konjunktiv II der Vergangenheit:** Wäre er früher gekommen, hätte er sie getroffen.

**ملاحظات:**
- شائع في الكتابة الرسمية والأدب
- في الحديث: يُفضَّل استخدام wenn
- الجملة الجوابية تبدأ غالباً بـ **so** (اختياري في الكتابة الأدبية)`,
        tables: [
          {
            title: 'مقارنة: مع wenn vs بدون wenn',
            headers: ['مع wenn', 'بدون wenn'],
            rows: [
              { cells: ['Wenn ich Zeit habe, lese ich.', 'Habe ich Zeit, lese ich.'] },
              { cells: ['Wenn du das wüsstest, würdest du lachen.', 'Wüsstest du das, würdest du lachen.'] },
              { cells: ['Wenn er gekommen wäre, hätte er geholfen.', 'Wäre er gekommen, hätte er geholfen.'] },
              { cells: ['Wenn ich reich wäre, würde ich reisen.', 'Wäre ich reich, würde ich reisen.'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'احذف wenn وضع الفعل المُصرَّف في البداية', example: 'Hast du Zeit, ruf mich an.', translation: 'إن كان لديك وقت، اتصل بي.' },
          { rule: 'هذه البنية شائعة في Konjunktiv II وفي الكتابة الرسمية', example: 'Wäre ich du, würde ich bleiben.', translation: 'لو كنت مكانك، لبقيت.' },
          { rule: 'الجزء الرئيسي قد يبدأ بـ so (اختياري)', example: 'Hilft er mir, so helfe ich ihm.', translation: 'إن ساعدني، فسأساعده.' },
        ],
        examples: [
          'Hast du Zeit, komm bitte vorbei. — إن كان لديك وقت، تعال من فضلك.',
          'Hätte ich das gewusst, wäre ich nicht gekommen. — لو كنت أعلم ذلك، لما أتيت.',
          'Wäre er pünktlicher, hätten wir weniger Probleme. — لو كان أكثر انتظاماً، لكانت مشاكلنا أقل.',
          'Sollten Sie Fragen haben, wenden Sie sich an den Service. — إذا كانت لديكم أسئلة، توجهوا إلى الخدمة.',
          'Ist das Wetter gut, gehen wir schwimmen. — إن كان الطقس جيداً، نذهب للسباحة.',
          'Wäre ich an deiner Stelle, würde ich schweigen. — لو كنت مكانك، لصمتُّ.',
          'Käme er jetzt, wären alle überrascht. — لو جاء الآن، لفوجئ الجميع.',
          'Hätten wir mehr Zeit gehabt, wären wir weiter gefahren. — لو كان لدينا وقت أكثر، لواصلنا السفر.',
        ],
        tip: '💡 البداية بـ "Sollten Sie..." شائعة جداً في الرسائل الرسمية والإعلانات: "Sollten Sie Fragen haben, kontaktieren Sie uns." = إذا كانت لديكم أسئلة، اتصلوا بنا.',
      },
      vocabulary: [
        { german: 'vorbeikommen', arabic: 'يمر / يزور', example: 'Komm doch mal vorbei!', type: 'verb' },
        { german: 'sich wenden an', arabic: 'يتوجه إلى', example: 'Wenden Sie sich an den Service.', type: 'verb' },
        { german: 'pünktlich', arabic: 'منتظم / في الوقت', type: 'adjective' },
        { german: 'schweigen', arabic: 'يصمت', type: 'verb' },
        { german: 'überraschen', arabic: 'يُفاجئ', type: 'verb' },
        { german: 'sollen', arabic: 'يجب (هنا: إذا كان...)', type: 'verb' },
        { german: 'zurückhaltend', arabic: 'متحفظ / هادئ', type: 'adjective' },
        { german: 'berücksichtigen', arabic: 'يأخذ بعين الاعتبار', type: 'verb' },
        { german: 'umstehend', arabic: 'المذكور / المرفق', type: 'adjective' },
        { german: 'auftreten', arabic: 'يظهر / يحدث (مشكلة)', type: 'verb' },
        { german: 'die Unklarheit', arabic: 'الغموض / الإبهام', gender: 'die', plural: 'Unklarheiten', type: 'noun' },
        { german: 'die Rückfrage', arabic: 'الاستفسار', gender: 'die', plural: 'Rückfragen', type: 'noun' },
        { german: 'zustande kommen', arabic: 'يتحقق / يتم', type: 'verb' },
        { german: 'ohne weiteres', arabic: 'بلا عناء / بسهولة', type: 'phrase' },
        { german: 'die Voraussetzung', arabic: 'الشرط المسبق', gender: 'die', plural: 'Voraussetzungen', type: 'noun' },
        { german: 'vorausgesetzt', arabic: 'بشرط أن / على افتراض', type: 'conjunction' },
        { german: 'andernfalls', arabic: 'وإلا / خلاف ذلك', type: 'adverb' },
        { german: 'bei Bedarf', arabic: 'عند الحاجة', type: 'phrase' },
        { german: 'die Angelegenheit', arabic: 'الأمر / القضية', gender: 'die', plural: 'Angelegenheiten', type: 'noun' },
        { german: 'der Einwand', arabic: 'الاعتراض', gender: 'der', plural: 'Einwände', type: 'noun' },
        { german: 'der Fall', arabic: 'الحالة', gender: 'der', plural: 'Fälle', type: 'noun' },
        { german: 'die Eventualität', arabic: 'الاحتمال', gender: 'die', plural: 'Eventualitäten', type: 'noun' },
        { german: 'die Annahme', arabic: 'الفرضية', gender: 'die', plural: 'Annahmen', type: 'noun' },
        { german: 'die Bedingung', arabic: 'الشرط', gender: 'die', plural: 'Bedingungen', type: 'noun' },
        { german: 'gegebenenfalls', arabic: 'عند الاقتضاء', type: 'adverb' },
        { german: 'allenfalls', arabic: 'في أحسن الأحوال', type: 'adverb' },
        { german: 'erwägen', arabic: 'يدرس / يتأمّل', type: 'verb' },
        { german: 'voraussetzen', arabic: 'يفترض', type: 'verb' },
        { german: 'angenommen, dass', arabic: 'بافتراض أن', type: 'phrase' },
        { german: 'unter der Bedingung', arabic: 'بشرط', type: 'phrase' },
        { german: 'soweit', arabic: 'بقدر ما', type: 'conjunction' },
        { german: 'sofern', arabic: 'إذا / بقدر ما', type: 'conjunction' },
        { german: 'verbindlich', arabic: 'مُلزم', type: 'adjective' },
        { german: 'unverbindlich', arabic: 'غير مُلزم', type: 'adjective' },
      ],
      exercise: {
        questions: [
          { id: 'c1-04-q1', type: 'multiple-choice', question: 'حوّل إلى بنية بدون wenn: "Wenn ich Zeit habe, komme ich."', options: ['Habe ich Zeit, komme ich.', 'Ich habe Zeit, komme ich.', 'Komme ich, habe ich Zeit.', 'Zeit habe ich, komme ich.'], answer: 'Habe ich Zeit, komme ich.' },
          { id: 'c1-04-q2', type: 'fill-blank', question: 'أكمل: "___ ich reich, würde ich reisen." (لو كنت غنياً)', answer: 'Wäre', hint: 'sein في Konjunktiv II' },
          { id: 'c1-04-q3', type: 'multiple-choice', question: 'أي بنية رسمية مناسبة لرسالة عمل؟', options: ['Wenn du willst...', 'Sollten Sie Fragen haben...', 'Hast du Zeit...', 'Willst du...'], answer: 'Sollten Sie Fragen haben...' },
          { id: 'c1-04-q4', type: 'fill-blank', question: 'أكمل: "___ ich das gewusst, wäre ich nicht gekommen."', answer: 'Hätte', hint: 'haben + Konjunktiv II' },
          { id: 'c1-04-q5', type: 'drag-drop', question: 'رتب:', words: ['Hast', 'du', 'Zeit', 'ruf', 'mich', 'an'], answer: 'Hast du Zeit ruf mich an' },
          { id: 'c1-04-q6', type: 'multiple-choice', question: '"Wäre er gekommen, hätte er geholfen" تعني:', options: ['جاء وساعد.', 'لو جاء، لكان ساعد.', 'سيأتي ويساعد.', 'لم يأت ولم يساعد.'], answer: 'لو جاء، لكان ساعد.' },
          { id: 'c1-04-q7', type: 'matching', question: 'طابق:', pairs: [{ left: 'Wenn er kommt', right: 'Kommt er' }, { left: 'Wenn ich wüsste', right: 'Wüsste ich' }, { left: 'Wenn sie hilft', right: 'Hilft sie' }, { left: 'Wenn wir Zeit hätten', right: 'Hätten wir Zeit' }], answer: 'matched' },
          { id: 'c1-04-q8', type: 'fill-blank', question: 'أكمل: "___ Sie Fragen haben, wenden Sie sich an uns."', answer: 'Sollten', hint: 'sollen في Konjunktiv II للبدء الرسمي' },
          { id: 'c1-04-q9', type: 'speaking', question: 'قل: "Wäre ich du, würde ich bleiben."', audioPrompt: 'Wäre ich du, würde ich bleiben.', answer: 'Wäre ich du würde ich bleiben' },
          { id: 'c1-04-q10', type: 'drag-drop', question: 'رتب:', words: ['Ist', 'das', 'Wetter', 'gut', 'gehen', 'wir', 'schwimmen'], answer: 'Ist das Wetter gut gehen wir schwimmen' },
          { id: 'c1-04-q11', type: 'fill-blank', question: 'حوّل: "Wenn er kommt, freue ich mich." → "___ er, freue ich mich."', answer: 'Kommt', hint: 'الفعل أولاً + بدون wenn' },
          { id: 'c1-04-q12', type: 'multiple-choice', question: 'البديل الرسمي لـ wenn:', options: ['الفعل في النهاية', 'الفعل في البداية', 'حذف الفاعل', 'إضافة "so"'], answer: 'الفعل في البداية' },
          { id: 'c1-04-q13', type: 'fill-blank', question: '"Hätten wir mehr Zeit, ___ wir bleiben." (würden + Inf)', answer: 'würden', hint: 'الجزء الجوابي' },
          { id: 'c1-04-q14', type: 'multiple-choice', question: 'الجملة "Sollten Sie Fragen haben..." شائعة في:', options: ['الكلام اليومي', 'الرسائل الرسمية', 'الأطفال', 'الأغاني'], answer: 'الرسائل الرسمية' },
          { id: 'c1-04-q15', type: 'matching', question: 'اربط (مع wenn vs بدون wenn):', pairs: [{ left: 'Wenn ich Zeit habe', right: 'Habe ich Zeit' }, { left: 'Wenn du wüsstest', right: 'Wüsstest du' }, { left: 'Wenn er gekommen wäre', right: 'Wäre er gekommen' }, { left: 'Wenn ich reich wäre', right: 'Wäre ich reich' }], answer: 'matched' },
          { id: 'c1-04-q16', type: 'drag-drop', question: 'رتّب: "لو كنت أعلم ذلك، لما كنت قد جئت"', words: ['Hätte', 'ich', 'das', 'gewusst,', 'wäre', 'ich', 'nicht', 'gekommen'], answer: 'Hätte ich das gewusst, wäre ich nicht gekommen' },
          { id: 'c1-04-q17', type: 'speaking', question: 'قل (بدون wenn): "إن كانت لديك أسئلة، فأخبرني"', answer: 'Hast du Fragen, sag es mir' },
          { id: 'c1-04-q18', type: 'fill-blank', question: 'استمع: "___ Sie Fragen haben, melden Sie sich." (Sollten)', audioPrompt: 'Sollten Sie Fragen haben, melden Sie sich.', answer: 'Sollten', hint: 'sollen في الكتابة الرسمية' },
          { id: 'c1-04-q19', type: 'multiple-choice', question: 'في الجملة الجوابية، يمكن إضافة:', options: ['so (اختياري)', 'denn (إجباري)', 'aber', 'oder'], answer: 'so (اختياري)' },
          { id: 'c1-04-q20', type: 'drag-drop', question: 'رتّب: "لو كنت أكثر دقة، لما حدثت أخطاء"', words: ['Wäre', 'ich', 'genauer', 'gewesen,', 'wären', 'keine', 'Fehler', 'passiert'], answer: 'Wäre ich genauer gewesen, wären keine Fehler passiert' },
        ],
      },
    },
    {
      id: 'c1-05',
      title: 'Funktionsverbgefüge — المركبات الفعلية الوظيفية',
      order: 5,
      grammar: {
        title: 'تركيبات فعل + اسم في اللغة الرسمية',
        content: `في C1، يستخدم الألمان **Funktionsverbgefüge** (FVG): تركيبات من فعل + اسم تُشكل وحدة معنى واحدة. الفعل يفقد معناه الأصلي ويُعطي الوظيفة النحوية، بينما الاسم يحمل المعنى الأساسي.

**لماذا نستخدمها؟**
- أسلوب رسمي، إداري، صحفي، قانوني
- تعطي دقة وتنوع تعبيري
- شائعة جداً في الكتابة الأكاديمية

**مثال:**
- **فعل بسيط:** Er entschied.
- **FVG:** Er **traf eine Entscheidung**. (أكثر رسمية)`,
        tables: [
          {
            title: 'أهم المركبات الفعلية الوظيفية',
            headers: ['FVG', 'يعادل', 'المعنى'],
            rows: [
              { cells: ['eine Entscheidung treffen', 'entscheiden', 'يتخذ قراراً'] },
              { cells: ['in Kraft treten', 'gültig werden', 'يدخل حيز التنفيذ'] },
              { cells: ['zum Ausdruck bringen', 'ausdrücken', 'يُعبّر عن'] },
              { cells: ['Kritik üben (an)', 'kritisieren', 'ينتقد'] },
              { cells: ['zur Verfügung stehen', 'verfügbar sein', 'متاح / تحت التصرف'] },
              { cells: ['in Frage kommen', 'möglich sein', 'وارد / ممكن'] },
              { cells: ['Rücksicht nehmen (auf)', 'rücksichtsvoll sein', 'يُراعي'] },
              { cells: ['zur Folge haben', 'verursachen', 'يؤدي إلى'] },
              { cells: ['einen Antrag stellen', 'beantragen', 'يُقدم طلباً'] },
              { cells: ['in Anspruch nehmen', 'beanspruchen', 'يستفيد من / يستنفد'] },
              { cells: ['Bezug nehmen (auf)', 'sich beziehen auf', 'يُشير إلى'] },
              { cells: ['zur Sprache bringen', 'ansprechen', 'يطرح موضوعاً'] },
            ],
            theme: 'default',
          },
          {
            title: 'حسب الفعل المساعد',
            headers: ['الفعل', 'أمثلة'],
            rows: [
              { cells: ['treffen', 'Entscheidung / Maßnahmen / Vereinbarung'] },
              { cells: ['bringen', 'zum Ausdruck / zur Sprache / in Ordnung'] },
              { cells: ['nehmen', 'in Anspruch / Rücksicht / Bezug / Abschied'] },
              { cells: ['stellen', 'Antrag / Frage / Forderung / Bedingung'] },
              { cells: ['kommen', 'in Frage / zur Sprache / zum Einsatz'] },
              { cells: ['stehen', 'zur Verfügung / zur Debatte / unter Druck'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'الفعل يفقد معناه الأصلي، والاسم يحمل المعنى', example: 'Er stellt eine Frage.', translation: 'يطرح سؤالاً. (stellt هنا لا تعني "يضع")' },
          { rule: 'FVG تحتاج حرف جر محدد غالباً', example: 'Er nimmt Rücksicht auf mich.', translation: 'هو يراعيني.' },
          { rule: 'تُستخدم بكثرة في السجل الرسمي والأكاديمي', example: 'Das Gesetz tritt in Kraft.', translation: 'القانون يدخل حيز التنفيذ.' },
        ],
        examples: [
          'Die Regierung hat eine wichtige Entscheidung getroffen. — اتخذت الحكومة قراراً مهماً.',
          'Das neue Gesetz tritt am 1. Januar in Kraft. — القانون الجديد يدخل حيز التنفيذ في 1 يناير.',
          'Er brachte seine Enttäuschung zum Ausdruck. — عبّر عن خيبة أمله.',
          'Die Kritiker üben Kritik am neuen Film. — ينتقد النقاد الفيلم الجديد.',
          'Das Angebot steht Ihnen zur Verfügung. — العرض متاح لكم.',
          'Diese Option kommt nicht in Frage. — هذا الخيار غير وارد.',
          'Bitte nehmen Sie Rücksicht auf andere. — يرجى مراعاة الآخرين.',
          'Der Streik hat große Verluste zur Folge. — الإضراب يؤدي إلى خسائر كبيرة.',
        ],
        tip: '💡 في رسالة عمل أو مقال أكاديمي: بدلاً من "Wir entscheiden" استخدم "Wir treffen eine Entscheidung" — يعطي انطباعاً أكثر احترافية ورسمية.',
      },
      vocabulary: [
        { german: 'eine Entscheidung treffen', arabic: 'يتخذ قراراً', type: 'phrase' },
        { german: 'in Kraft treten', arabic: 'يدخل حيز التنفيذ', type: 'phrase' },
        { german: 'zum Ausdruck bringen', arabic: 'يُعبّر عن', type: 'phrase' },
        { german: 'Kritik üben', arabic: 'ينتقد', type: 'phrase' },
        { german: 'zur Verfügung stehen', arabic: 'متاح', type: 'phrase' },
        { german: 'in Frage kommen', arabic: 'وارد / ممكن', type: 'phrase' },
        { german: 'Rücksicht nehmen', arabic: 'يُراعي', type: 'phrase' },
        { german: 'zur Folge haben', arabic: 'يؤدي إلى', type: 'phrase' },
        { german: 'einen Antrag stellen', arabic: 'يقدم طلباً', type: 'phrase' },
        { german: 'in Anspruch nehmen', arabic: 'يستفيد من / يستعمل', type: 'phrase' },
        { german: 'Bezug nehmen', arabic: 'يُشير إلى', type: 'phrase' },
        { german: 'zur Sprache bringen', arabic: 'يطرح موضوعاً', type: 'phrase' },
        { german: 'Maßnahmen treffen', arabic: 'يتخذ تدابير', type: 'phrase' },
        { german: 'eine Frage stellen', arabic: 'يطرح سؤالاً', type: 'phrase' },
        { german: 'unter Druck stehen', arabic: 'يكون تحت ضغط', type: 'phrase' },
        { german: 'zur Debatte stehen', arabic: 'قيد النقاش', type: 'phrase' },
        { german: 'Abschied nehmen', arabic: 'يودّع', type: 'phrase' },
        { german: 'in Ordnung bringen', arabic: 'يُصلح / يرتب', type: 'phrase' },
        { german: 'eine Rolle spielen', arabic: 'يلعب دوراً', type: 'phrase' },
        { german: 'zur Kenntnis nehmen', arabic: 'يأخذ علماً', type: 'phrase' },
        { german: 'in Auftrag geben', arabic: 'يطلب إنجاز', type: 'phrase' },
        { german: 'eine Vereinbarung treffen', arabic: 'يبرم اتفاقاً', type: 'phrase' },
        { german: 'in Erwägung ziehen', arabic: 'يأخذ في الاعتبار', type: 'phrase' },
        { german: 'in die Tat umsetzen', arabic: 'يحوّل إلى فعل', type: 'phrase' },
        { german: 'zum Schluss kommen', arabic: 'يصل إلى استنتاج', type: 'phrase' },
        { german: 'eine Bedingung stellen', arabic: 'يضع شرطاً', type: 'phrase' },
        { german: 'in Betracht kommen', arabic: 'وارد / يؤخذ في الحسبان', type: 'phrase' },
        { german: 'zum Einsatz kommen', arabic: 'يُستعمل', type: 'phrase' },
        { german: 'Stellung nehmen', arabic: 'يبدي رأيه', type: 'phrase' },
        { german: 'einen Beitrag leisten', arabic: 'يقدّم مساهمة', type: 'phrase' },
        { german: 'eine Forderung stellen', arabic: 'يطلب', type: 'phrase' },
        { german: 'einen Eindruck machen', arabic: 'يترك انطباعاً', type: 'phrase' },
        { german: 'das Wort ergreifen', arabic: 'يأخذ الكلمة', type: 'phrase' },
        { german: 'zur Diskussion stellen', arabic: 'يطرح للنقاش', type: 'phrase' },
        { german: 'in Verbindung bringen', arabic: 'يربط بـ', type: 'phrase' },
      ],
      exercise: {
        questions: [
          { id: 'c1-05-q1', type: 'multiple-choice', question: 'أي FVG يعني "يتخذ قراراً"؟', options: ['eine Frage stellen', 'eine Entscheidung treffen', 'in Kraft treten', 'Rücksicht nehmen'], answer: 'eine Entscheidung treffen' },
          { id: 'c1-05-q2', type: 'fill-blank', question: 'أكمل: "Das Gesetz tritt morgen in ___."', answer: 'Kraft', hint: 'FVG للدخول حيز التنفيذ' },
          { id: 'c1-05-q3', type: 'multiple-choice', question: '"Diese Option kommt nicht in Frage" تعني:', options: ['هذا الخيار ممكن.', 'هذا الخيار غير وارد.', 'سنناقش هذا الخيار.', 'هذا الخيار مفضل.'], answer: 'هذا الخيار غير وارد.' },
          { id: 'c1-05-q4', type: 'fill-blank', question: 'أكمل: "Er brachte seine Meinung zum ___."', answer: 'Ausdruck', hint: 'FVG للتعبير' },
          { id: 'c1-05-q5', type: 'drag-drop', question: 'رتب:', words: ['Wir', 'müssen', 'eine', 'Entscheidung', 'treffen'], answer: 'Wir müssen eine Entscheidung treffen' },
          { id: 'c1-05-q6', type: 'multiple-choice', question: 'اختر FVG مع "nehmen":', options: ['Kritik', 'Rücksicht', 'Frage', 'Antrag'], answer: 'Rücksicht' },
          { id: 'c1-05-q7', type: 'matching', question: 'طابق FVG مع الفعل البسيط:', pairs: [{ left: 'Kritik üben', right: 'kritisieren' }, { left: 'einen Antrag stellen', right: 'beantragen' }, { left: 'Bezug nehmen', right: 'sich beziehen' }, { left: 'zur Folge haben', right: 'verursachen' }], answer: 'matched' },
          { id: 'c1-05-q8', type: 'fill-blank', question: 'أكمل: "Das Angebot steht Ihnen zur ___."', answer: 'Verfügung', hint: 'FVG للإتاحة' },
          { id: 'c1-05-q9', type: 'speaking', question: 'قل: "Die Regierung hat Maßnahmen getroffen."', audioPrompt: 'Die Regierung hat Maßnahmen getroffen.', answer: 'Die Regierung hat Maßnahmen getroffen' },
          { id: 'c1-05-q10', type: 'drag-drop', question: 'رتب:', words: ['Er', 'stellt', 'einen', 'Antrag', 'auf', 'Urlaub'], answer: 'Er stellt einen Antrag auf Urlaub' },
          { id: 'c1-05-q11', type: 'fill-blank', question: 'بديل لـ "ausdrücken": "zum Ausdruck ___."', answer: 'bringen', hint: 'zum Ausdruck bringen' },
          { id: 'c1-05-q12', type: 'multiple-choice', question: 'بديل FVG لـ "kritisieren":', options: ['Kritik üben', 'Kritik bringen', 'Kritik machen', 'Kritik kommen'], answer: 'Kritik üben' },
          { id: 'c1-05-q13', type: 'fill-blank', question: '"Ich nehme deinen Vorschlag in ___." (يأخذ في الاعتبار)', answer: 'Erwägung', hint: 'in Erwägung ziehen / nehmen' },
          { id: 'c1-05-q14', type: 'multiple-choice', question: 'لماذا تُستخدم FVG؟', options: ['الكتابة الرسمية والأكاديمية', 'الكلام مع الأطفال', 'فقط في الشعر', 'الإعلانات التجارية'], answer: 'الكتابة الرسمية والأكاديمية' },
          { id: 'c1-05-q15', type: 'matching', question: 'اربط FVG بمعنى:', pairs: [{ left: 'eine Entscheidung treffen', right: 'entscheiden' }, { left: 'zur Verfügung stehen', right: 'verfügbar sein' }, { left: 'in Frage kommen', right: 'möglich sein' }, { left: 'Rücksicht nehmen', right: 'rücksichtsvoll sein' }, { left: 'zur Folge haben', right: 'verursachen' }], answer: 'matched' },
          { id: 'c1-05-q16', type: 'drag-drop', question: 'رتّب: "نأخذ علماً بالخطاب"', words: ['Wir', 'nehmen', 'die', 'Rede', 'zur', 'Kenntnis'], answer: 'Wir nehmen die Rede zur Kenntnis' },
          { id: 'c1-05-q17', type: 'speaking', question: 'قل: "أُلزم نفسي بهذا الالتزام"', answer: 'Ich gehe diese Verpflichtung ein' },
          { id: 'c1-05-q18', type: 'fill-blank', question: 'استمع: "Wir leisten einen ___ zur Lösung." (مساهمة)', audioPrompt: 'Wir leisten einen Beitrag zur Lösung.', answer: 'Beitrag', hint: 'einen Beitrag leisten' },
          { id: 'c1-05-q19', type: 'multiple-choice', question: 'الفعل في FVG:', options: ['يحمل المعنى الأساسي', 'يفقد معناه ويعطي الوظيفة النحوية', 'يُحذف', 'يصبح اسماً'], answer: 'يفقد معناه ويعطي الوظيفة النحوية' },
          { id: 'c1-05-q20', type: 'drag-drop', question: 'رتّب: "هو يبدي رأيه في الموضوع"', words: ['Er', 'nimmt', 'zu', 'dem', 'Thema', 'Stellung'], answer: 'Er nimmt zu dem Thema Stellung' },
        ],
      },
    },
    {
      id: 'c1-06',
      title: 'الاشتقاق الاسمي الموسع — Erweiterte Partizipialattribute',
      order: 6,
      grammar: {
        title: 'الجملة الوصفية الممتدة كصفة',
        content: `في C1، تستبدل جمل الوصل الطويلة بـ **اشتقاق اسمي موسع** (erweitertes Partizipialattribut). هذا أسلوب شائع جداً في الصحافة والأدب.

**البنية:**
Artikel + [كلمات مضافة] + Partizip (I أو II) + اسم

**التحويل من Relativsatz:**
- Relativsatz: der Mann, **der seit Jahren in Berlin lebt**
- Partizipialattribut: der **seit Jahren in Berlin lebende** Mann

**Partizip I (-end):** يُعبر عن فعل متزامن / مستمر
→ der **lesende** Student = der Student, der liest

**Partizip II:** يُعبر عن فعل مكتمل / مبني للمجهول
→ das **geöffnete** Fenster = das Fenster, das geöffnet wurde`,
        tables: [
          {
            title: 'تحويلات Partizip I و II',
            headers: ['Relativsatz', 'Partizipialattribut'],
            rows: [
              { cells: ['der Mann, der schläft', 'der schlafende Mann'] },
              { cells: ['die Frau, die lacht', 'die lachende Frau'] },
              { cells: ['das Kind, das spielt', 'das spielende Kind'] },
              { cells: ['der Brief, der geschrieben wurde', 'der geschriebene Brief'] },
              { cells: ['die Tür, die geöffnet wurde', 'die geöffnete Tür'] },
              { cells: ['das Problem, das gelöst wurde', 'das gelöste Problem'] },
            ],
            theme: 'default',
          },
          {
            title: 'البنية الموسعة',
            headers: ['الجملة بـ Relativsatz', 'Partizipialattribut موسع'],
            rows: [
              { cells: ['der Mann, der seit Jahren in Berlin lebt', 'der seit Jahren in Berlin lebende Mann'] },
              { cells: ['das Gesetz, das gestern verabschiedet wurde', 'das gestern verabschiedete Gesetz'] },
              { cells: ['die Studenten, die an der Uni studieren', 'die an der Uni studierenden Studenten'] },
              { cells: ['die Briefe, die von ihr geschriebenen wurden', 'die von ihr geschriebenen Briefe'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'Partizip I = فعل + -end (متزامن/مستمر)', example: 'der laufende Motor', translation: 'المحرك الذي يعمل' },
          { rule: 'Partizip II = صيغة المضارع التام (مكتمل/مبني للمجهول)', example: 'das verabschiedete Gesetz', translation: 'القانون الذي أُقرّ' },
          { rule: 'الاشتقاق يأخذ نهاية الصفة حسب الحالة والجنس', example: 'dem lesenden Studenten', translation: 'للطالب القارئ' },
        ],
        examples: [
          'Das gestern verabschiedete Gesetz tritt morgen in Kraft. — القانون الذي أُقرّ أمس يدخل حيز التنفيذ غداً.',
          'Die seit Jahren anhaltende Krise macht allen Sorgen. — الأزمة المستمرة منذ سنوات تُقلق الجميع.',
          'Der schnell wachsende Markt bietet neue Chancen. — السوق الذي ينمو بسرعة يُتيح فرصاً جديدة.',
          'Die auf dem Tisch liegenden Dokumente sind vertraulich. — الوثائق الموجودة على الطاولة سرية.',
          'Die neu entwickelte Technologie revolutioniert die Branche. — التكنولوجيا المطورة حديثاً تُحدث ثورة في القطاع.',
          'Der von der Behörde genehmigte Antrag wird bearbeitet. — الطلب الذي أقرته الهيئة يتم معالجته.',
          'Die in den 90er Jahren gebauten Häuser werden renoviert. — البيوت التي بُنيت في التسعينات تُرمم.',
          'Die an der Demonstration teilnehmenden Bürger fordern Reformen. — المواطنون المشاركون في المظاهرة يطالبون بالإصلاحات.',
        ],
        tip: '💡 في المقالات الصحفية الألمانية (FAZ, Zeit, Spiegel) ستصادف هذه البنية في كل عنوان تقريباً. تعلمها يرفع مستوى القراءة الأكاديمية بشكل كبير.',
      },
      vocabulary: [
        { german: 'verabschieden', arabic: 'يُقرّ (قانوناً)', type: 'verb' },
        { german: 'anhaltend', arabic: 'مستمر / دائم', type: 'adjective' },
        { german: 'bevorstehend', arabic: 'وشيك / مقبل', type: 'adjective' },
        { german: 'anwesend', arabic: 'حاضر', type: 'adjective' },
        { german: 'abwesend', arabic: 'غائب', type: 'adjective' },
        { german: 'zutreffend', arabic: 'صحيح / ينطبق', type: 'adjective' },
        { german: 'maßgeblich', arabic: 'حاسم / مؤثر', type: 'adjective' },
        { german: 'umfassend', arabic: 'شامل', type: 'adjective' },
        { german: 'fortschreitend', arabic: 'متقدم / متطور', type: 'adjective' },
        { german: 'genehmigen', arabic: 'يُصرّح / يوافق', type: 'verb' },
        { german: 'bearbeiten', arabic: 'يُعالج', type: 'verb' },
        { german: 'renovieren', arabic: 'يُرمم', type: 'verb' },
        { german: 'entwickeln', arabic: 'يُطور', type: 'verb' },
        { german: 'revolutionieren', arabic: 'يُحدث ثورة', type: 'verb' },
        { german: 'vertraulich', arabic: 'سري / خاص', type: 'adjective' },
        { german: 'die Reform', arabic: 'الإصلاح', gender: 'die', plural: 'Reformen', type: 'noun' },
        { german: 'die Branche', arabic: 'القطاع', gender: 'die', plural: 'Branchen', type: 'noun' },
        { german: 'die Krise', arabic: 'الأزمة', gender: 'die', plural: 'Krisen', type: 'noun' },
        { german: 'der Bürger', arabic: 'المواطن', gender: 'der', plural: 'Bürger', type: 'noun' },
        { german: 'die Demonstration', arabic: 'المظاهرة', gender: 'die', plural: 'Demonstrationen', type: 'noun' },
        { german: 'die Behörde', arabic: 'الجهة الرسمية', gender: 'die', plural: 'Behörden', type: 'noun' },
        { german: 'die Maßnahme', arabic: 'الإجراء', gender: 'die', plural: 'Maßnahmen', type: 'noun' },
        { german: 'eindrucksvoll', arabic: 'مؤثّر', type: 'adjective' },
        { german: 'verheerend', arabic: 'مدمّر', type: 'adjective' },
        { german: 'aufstrebend', arabic: 'صاعد / واعد', type: 'adjective' },
        { german: 'überzeugend', arabic: 'مقنع', type: 'adjective' },
        { german: 'verschwiegen', arabic: 'كتوم', type: 'adjective' },
        { german: 'überrascht', arabic: 'مفاجَأ', type: 'adjective' },
        { german: 'erweitert', arabic: 'موسَّع', type: 'adjective' },
        { german: 'die Veränderung', arabic: 'التغيير', gender: 'die', plural: 'Veränderungen', type: 'noun' },
        { german: 'die Anpassung', arabic: 'التكيُّف', gender: 'die', plural: 'Anpassungen', type: 'noun' },
        { german: 'verlauten', arabic: 'يُذاع / يُعلن', type: 'verb' },
        { german: 'verkünden', arabic: 'يُعلن', type: 'verb' },
        { german: 'einschätzen', arabic: 'يقيّم', type: 'verb' },
        { german: 'bewerten', arabic: 'يُقيّم', type: 'verb' },
      ],
      exercise: {
        questions: [
          { id: 'c1-06-q1', type: 'multiple-choice', question: 'حوّل: "der Mann, der läuft" → ___', options: ['der gelaufene Mann', 'der laufende Mann', 'der läufende Mann', 'der Mann laufend'], answer: 'der laufende Mann' },
          { id: 'c1-06-q2', type: 'fill-blank', question: 'أكمل: "das ___ Fenster" (المفتوح — من öffnen)', answer: 'geöffnete', hint: 'Partizip II + نهاية صفة' },
          { id: 'c1-06-q3', type: 'multiple-choice', question: 'اختر الصحيح: "Die seit Jahren ___ Krise"', options: ['anhalten', 'angehalten', 'anhaltende', 'anhaltend'], answer: 'anhaltende' },
          { id: 'c1-06-q4', type: 'fill-blank', question: 'أكمل: "der schnell ___ Markt" (الذي ينمو — من wachsen)', answer: 'wachsende', hint: 'Partizip I' },
          { id: 'c1-06-q5', type: 'drag-drop', question: 'رتب:', words: ['Das', 'verabschiedete', 'Gesetz', 'tritt', 'in', 'Kraft'], answer: 'Das verabschiedete Gesetz tritt in Kraft' },
          { id: 'c1-06-q6', type: 'multiple-choice', question: 'ما الفرق بين Partizip I و II؟', options: ['لا فرق.', 'I للحدث المتزامن، II للمكتمل/المبني للمجهول.', 'I مذكر، II مؤنث.', 'I للحاضر، II للمستقبل.'], answer: 'I للحدث المتزامن، II للمكتمل/المبني للمجهول.' },
          { id: 'c1-06-q7', type: 'matching', question: 'طابق:', pairs: [{ left: 'schlafende Kind', right: 'das Kind, das schläft' }, { left: 'geöffnete Tür', right: 'die Tür, die geöffnet wurde' }, { left: 'lachende Frau', right: 'die Frau, die lacht' }, { left: 'gelöste Problem', right: 'das Problem, das gelöst wurde' }], answer: 'matched' },
          { id: 'c1-06-q8', type: 'fill-blank', question: 'أكمل: "die auf dem Tisch ___ Dokumente" (الموجودة — من liegen)', answer: 'liegenden', hint: 'Partizip I' },
          { id: 'c1-06-q9', type: 'speaking', question: 'قل: "Die neu entwickelte Technologie."', audioPrompt: 'Die neu entwickelte Technologie.', answer: 'Die neu entwickelte Technologie' },
          { id: 'c1-06-q10', type: 'drag-drop', question: 'رتب:', words: ['der', 'von', 'der', 'Behörde', 'genehmigte', 'Antrag'], answer: 'der von der Behörde genehmigte Antrag' },
          { id: 'c1-06-q11', type: 'fill-blank', question: 'حوّل: "Die Tür wurde geöffnet" → "die ___ Tür"', answer: 'geöffnete', hint: 'Partizip II مع نهاية صفة' },
          { id: 'c1-06-q12', type: 'multiple-choice', question: 'Partizip I تعبّر عن:', options: ['فعل مكتمل', 'فعل جارٍ نشط', 'مبني للمجهول', 'مستقبل'], answer: 'فعل جارٍ نشط' },
          { id: 'c1-06-q13', type: 'fill-blank', question: '"die ___ Krise" (الأزمة المستمرة)', answer: 'anhaltende', hint: 'anhalten → anhaltend' },
          { id: 'c1-06-q14', type: 'multiple-choice', question: 'في صفة موسّعة، الصفات تأتي:', options: ['بعد الاسم', 'قبل الاسم بترتيب', 'في النهاية', 'لا قاعدة'], answer: 'قبل الاسم بترتيب' },
          { id: 'c1-06-q15', type: 'matching', question: 'اربط:', pairs: [{ left: 'das brennende Haus', right: 'البيت المشتعل' }, { left: 'das verlorene Buch', right: 'الكتاب المفقود' }, { left: 'die wachsende Stadt', right: 'المدينة المتنامية' }, { left: 'die fertige Arbeit', right: 'العمل المنتهي' }], answer: 'matched' },
          { id: 'c1-06-q16', type: 'drag-drop', question: 'رتّب: "البيت المبني في عام 1900 يُرمَّم"', words: ['Das', 'im', 'Jahr', '1900', 'gebaute', 'Haus', 'wird', 'renoviert'], answer: 'Das im Jahr 1900 gebaute Haus wird renoviert' },
          { id: 'c1-06-q17', type: 'speaking', question: 'قل: "المواطنون المشاركون في النقاش"', answer: 'Die an der Diskussion teilnehmenden Bürger' },
          { id: 'c1-06-q18', type: 'fill-blank', question: 'استمع: "Die ___ Reformen kommen bald." (المقبلة)', audioPrompt: 'Die bevorstehenden Reformen kommen bald.', answer: 'bevorstehenden', hint: 'bevorstehen → bevorstehend' },
          { id: 'c1-06-q19', type: 'multiple-choice', question: 'هذه البنية شائعة في:', options: ['الكلام اليومي', 'الصحف الألمانية والمقالات الأكاديمية', 'الأطفال', 'الإعلانات'], answer: 'الصحف الألمانية والمقالات الأكاديمية' },
          { id: 'c1-06-q20', type: 'drag-drop', question: 'رتّب: "التكنولوجيا المُطوَّرة حديثاً"', words: ['Die', 'neu', 'entwickelte', 'Technologie'], answer: 'Die neu entwickelte Technologie' },
        ],
      },
    },
    {
      id: 'c1-07',
      title: 'اللغة العلمية — Wissenschaftliche Sprache',
      order: 7,
      grammar: {
        title: 'خصائص الكتابة الأكاديمية بالألمانية',
        content: `في C1 تحتاج إتقان **اللغة الأكاديمية** للكتابة الجامعية والرسمية.

**1. الموضوعية — Objektivität**
- تجنب "ich": استخدم Passiv أو "man"
- ❌ Ich habe untersucht...
- ✅ Es wurde untersucht... / Es ist zu untersuchen...

**2. الدقة — Präzision**
- حدد المصطلحات والمفاهيم
- استخدم أدوات الربط الرسمية

**3. التنوع المعجمي — Lexikalische Vielfalt**
- لا تكرر نفس الفعل؛ استخدم مرادفات

**4. أدوات الربط الأكاديمية:**
- **إضافة:** darüber hinaus, ferner, zudem
- **تعارض:** jedoch, hingegen, indessen
- **نتيجة:** folglich, demnach, mithin
- **توضيح:** das heißt (d. h.), nämlich, beispielsweise`,
        tables: [
          {
            title: 'تعبيرات أكاديمية أساسية',
            headers: ['التعبير', 'المعنى / الاستخدام'],
            rows: [
              { cells: ['Im Folgenden wird ... erörtert.', 'سنناقش في ما يلي...'] },
              { cells: ['Die vorliegende Arbeit beschäftigt sich mit...', 'يتناول هذا البحث...'] },
              { cells: ['Es stellt sich die Frage, ob...', 'يُطرح السؤال ما إذا كان...'] },
              { cells: ['Daraus lässt sich schließen, dass...', 'يُستنتج من ذلك أن...'] },
              { cells: ['Zusammenfassend lässt sich sagen, dass...', 'باختصار يمكن القول إن...'] },
              { cells: ['Es ist davon auszugehen, dass...', 'يُفترض أن...'] },
            ],
            theme: 'default',
          },
          {
            title: 'بدائل لكلمات عامية',
            headers: ['عامي', 'رسمي / أكاديمي'],
            rows: [
              { cells: ['sagen', 'äußern / darlegen / feststellen'] },
              { cells: ['zeigen', 'aufzeigen / verdeutlichen / darstellen'] },
              { cells: ['viele', 'zahlreiche / eine Vielzahl von'] },
              { cells: ['wichtig', 'bedeutend / relevant / maßgeblich'] },
              { cells: ['klar', 'eindeutig / offensichtlich'] },
              { cells: ['schlimm', 'gravierend / schwerwiegend'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'تجنب الضمير "ich" واستخدم Passiv أو "man"', example: 'Es wurde festgestellt, dass...', translation: 'تم إثبات أن...' },
          { rule: 'استخدم أدوات ربط رسمية بدل "aber/weil"', example: 'Folglich ist zu schließen, dass...', translation: 'وبالتالي يُستنتج أن...' },
          { rule: 'استخدم FVG والأسماء بدلاً من الأفعال البسيطة', example: 'Eine Analyse wurde durchgeführt.', translation: 'تم إجراء تحليل.' },
        ],
        examples: [
          'Die vorliegende Untersuchung beschäftigt sich mit der Frage... — يتناول هذا البحث سؤال...',
          'Im Folgenden wird der Begriff X definiert. — فيما يلي يُعرَّف مصطلح X.',
          'Es lässt sich festhalten, dass die Ergebnisse signifikant sind. — يمكن الإشارة إلى أن النتائج ذات دلالة.',
          'Daraus ergibt sich die Frage, ob... — ومن هنا يطرح السؤال ما إذا كان...',
          'Die Hypothese wurde durch die Daten bestätigt. — أُكدت الفرضية من خلال البيانات.',
          'Es ist davon auszugehen, dass weitere Forschung nötig ist. — يُفترض أن مزيداً من البحث ضروري.',
          'Zusammenfassend lässt sich sagen, dass die Methode geeignet ist. — باختصار، يمكن القول إن المنهج مناسب.',
          'Darüber hinaus ist zu berücksichtigen, dass... — علاوة على ذلك، يجب مراعاة أن...',
        ],
        tip: '💡 في رسالة الماجستير أو أطروحة الدكتوراه الألمانية، استخدم **"Es lässt sich feststellen"** أو **"Es ist davon auszugehen"** بدلاً من "Ich glaube" أو "Ich denke".',
      },
      vocabulary: [
        { german: 'die Untersuchung', arabic: 'البحث / الدراسة', gender: 'die', plural: 'Untersuchungen', type: 'noun' },
        { german: 'die Hypothese', arabic: 'الفرضية', gender: 'die', plural: 'Hypothesen', type: 'noun' },
        { german: 'die These', arabic: 'الأطروحة', gender: 'die', plural: 'Thesen', type: 'noun' },
        { german: 'erörtern', arabic: 'يناقش / يدرس', type: 'verb' },
        { german: 'darlegen', arabic: 'يعرض / يوضح', type: 'verb' },
        { german: 'feststellen', arabic: 'يُثبت / يُلاحظ', type: 'verb' },
        { german: 'belegen', arabic: 'يؤكد / يُوثق', type: 'verb' },
        { german: 'nahelegen', arabic: 'يُشير إلى', type: 'verb' },
        { german: 'aufzeigen', arabic: 'يُبيّن / يُظهر', type: 'verb' },
        { german: 'verdeutlichen', arabic: 'يُوضح', type: 'verb' },
        { german: 'zusammenfassend', arabic: 'باختصار / تلخيصاً', type: 'adverb' },
        { german: 'folglich', arabic: 'وبالتالي', type: 'adverb' },
        { german: 'demnach', arabic: 'وفقاً لذلك', type: 'adverb' },
        { german: 'hingegen', arabic: 'بينما / في المقابل', type: 'adverb' },
        { german: 'zudem', arabic: 'علاوة على ذلك', type: 'adverb' },
        { german: 'ferner', arabic: 'علاوة على / كذلك', type: 'adverb' },
        { german: 'signifikant', arabic: 'ذو دلالة / مهم إحصائياً', type: 'adjective' },
        { german: 'relevant', arabic: 'مهم / ذو صلة', type: 'adjective' },
        { german: 'die Forschung', arabic: 'البحث العلمي', gender: 'die', plural: 'Forschungen', type: 'noun' },
        { german: 'die Methodik', arabic: 'المنهجية', gender: 'die', type: 'noun' },
        { german: 'die Quelle', arabic: 'المصدر', gender: 'die', plural: 'Quellen', type: 'noun' },
        { german: 'die Studie', arabic: 'الدراسة', gender: 'die', plural: 'Studien', type: 'noun' },
        { german: 'die Analyse', arabic: 'التحليل', gender: 'die', plural: 'Analysen', type: 'noun' },
        { german: 'der Befund', arabic: 'النتيجة العلمية', gender: 'der', plural: 'Befunde', type: 'noun' },
        { german: 'die Argumentation', arabic: 'الحجاج', gender: 'die', plural: 'Argumentationen', type: 'noun' },
        { german: 'analysieren', arabic: 'يُحلّل', type: 'verb' },
        { german: 'interpretieren', arabic: 'يفسّر', type: 'verb' },
        { german: 'argumentieren', arabic: 'يحاجّ', type: 'verb' },
        { german: 'beweisen', arabic: 'يبرهن', type: 'verb' },
        { german: 'widerlegen', arabic: 'يدحض', type: 'verb' },
        { german: 'objektiv', arabic: 'موضوعي', type: 'adjective' },
        { german: 'wissenschaftlich', arabic: 'علمي', type: 'adjective' },
        { german: 'maßgeblich', arabic: 'حاسم', type: 'adjective' },
        { german: 'umfassend', arabic: 'شامل', type: 'adjective' },
        { german: 'differenziert', arabic: 'دقيق / متمايز', type: 'adjective' },
      ],
      exercise: {
        questions: [
          { id: 'c1-07-q1', type: 'multiple-choice', question: 'أي جملة مناسبة للأسلوب الأكاديمي؟', options: ['Ich finde das super.', 'Es lässt sich feststellen, dass die Ergebnisse signifikant sind.', 'Das ist klar.', 'Ich glaube das stimmt.'], answer: 'Es lässt sich feststellen, dass die Ergebnisse signifikant sind.' },
          { id: 'c1-07-q2', type: 'fill-blank', question: 'أكمل: "___ lässt sich sagen, dass die Methode geeignet ist." (باختصار)', answer: 'Zusammenfassend', hint: 'كلمة تعني "تلخيصاً"' },
          { id: 'c1-07-q3', type: 'multiple-choice', question: 'بديل أكاديمي لـ "viele":', options: ['voll', 'so viele', 'zahlreiche', 'ganz viele'], answer: 'zahlreiche' },
          { id: 'c1-07-q4', type: 'fill-blank', question: 'أكمل: "___ ist zu berücksichtigen, dass..." (علاوة على ذلك)', answer: 'Darüber hinaus', hint: 'أداة ربط رسمية للإضافة' },
          { id: 'c1-07-q5', type: 'multiple-choice', question: 'ما البديل الرسمي لـ "aber"؟', options: ['auch', 'jedoch', 'und', 'weil'], answer: 'jedoch' },
          { id: 'c1-07-q6', type: 'matching', question: 'طابق:', pairs: [{ left: 'sagen', right: 'äußern' }, { left: 'zeigen', right: 'darstellen' }, { left: 'wichtig', right: 'relevant' }, { left: 'klar', right: 'eindeutig' }], answer: 'matched' },
          { id: 'c1-07-q7', type: 'fill-blank', question: 'أكمل: "Die Hypothese wurde durch Daten ___." (تم تأكيدها)', answer: 'bestätigt', hint: 'Partizip II من bestätigen' },
          { id: 'c1-07-q8', type: 'drag-drop', question: 'رتب:', words: ['Die', 'vorliegende', 'Arbeit', 'beschäftigt', 'sich', 'mit', 'der', 'Frage'], answer: 'Die vorliegende Arbeit beschäftigt sich mit der Frage' },
          { id: 'c1-07-q9', type: 'speaking', question: 'قل: "Daraus lässt sich schließen, dass..."', audioPrompt: 'Daraus lässt sich schließen, dass weitere Forschung nötig ist.', answer: 'Daraus lässt sich schließen' },
          { id: 'c1-07-q10', type: 'drag-drop', question: 'رتب:', words: ['Es', 'ist', 'davon', 'auszugehen', 'dass', 'die', 'Methode', 'geeignet', 'ist'], answer: 'Es ist davon auszugehen dass die Methode geeignet ist' },
          { id: 'c1-07-q11', type: 'fill-blank', question: 'بديل أكاديمي لـ "viele": "___ Studien"', answer: 'zahlreiche', hint: 'zahlreiche = viele (formal)' },
          { id: 'c1-07-q12', type: 'multiple-choice', question: 'في الكتابة الأكاديمية نتجنب:', options: ['Passiv', 'Nominalstil', 'Konjunktiv II', 'Ich-Form'], answer: 'Ich-Form' },
          { id: 'c1-07-q13', type: 'fill-blank', question: '"Daraus lässt sich ___, dass..." (يُستنتج)', answer: 'schließen', hint: 'sich schließen lassen' },
          { id: 'c1-07-q14', type: 'multiple-choice', question: 'ما البديل الأكاديمي لـ "wichtig"؟', options: ['groß', 'gut', 'maßgeblich', 'schön'], answer: 'maßgeblich' },
          { id: 'c1-07-q15', type: 'matching', question: 'اربط العامي بالأكاديمي:', pairs: [{ left: 'sagen', right: 'darlegen' }, { left: 'zeigen', right: 'aufzeigen' }, { left: 'wichtig', right: 'maßgeblich' }, { left: 'klar', right: 'eindeutig' }, { left: 'schlimm', right: 'gravierend' }], answer: 'matched' },
          { id: 'c1-07-q16', type: 'drag-drop', question: 'رتّب: "هذا البحث يتناول مسألة معقّدة"', words: ['Die', 'vorliegende', 'Arbeit', 'beschäftigt', 'sich', 'mit', 'einer', 'komplexen', 'Frage'], answer: 'Die vorliegende Arbeit beschäftigt sich mit einer komplexen Frage' },
          { id: 'c1-07-q17', type: 'speaking', question: 'قل: "علاوة على ذلك، يجب الإشارة إلى أن..."', answer: 'Darüber hinaus ist anzumerken dass' },
          { id: 'c1-07-q18', type: 'fill-blank', question: 'استمع: "Die ___ wurden durch die Daten bestätigt." (الفرضيات)', audioPrompt: 'Die Hypothesen wurden durch die Daten bestätigt.', answer: 'Hypothesen', hint: 'die Hypothese (pl)' },
          { id: 'c1-07-q19', type: 'multiple-choice', question: 'الجملة الأكثر علميّة:', options: ['Es ist klar.', 'Es lässt sich eindeutig feststellen.', 'Das stimmt.', 'Ich denke ja.'], answer: 'Es lässt sich eindeutig feststellen.' },
          { id: 'c1-07-q20', type: 'drag-drop', question: 'رتّب: "النتائج لها أهمية كبيرة"', words: ['Die', 'Ergebnisse', 'sind', 'von', 'großer', 'Bedeutung'], answer: 'Die Ergebnisse sind von großer Bedeutung' },
        ],
      },
    },
    {
      id: 'c1-08',
      title: 'التعابير الاصطلاحية — Redewendungen',
      order: 8,
      grammar: {
        title: 'الأمثال والتعابير الشائعة في C1',
        content: `في C1، معرفة **التعابير الاصطلاحية (Redewendungen)** ضرورية لفهم الأدب والصحافة والحديث اليومي.

**أنواعها:**
1. تعابير عن أجزاء الجسم (die Nase voll haben)
2. تعابير حيوانية (den Stier bei den Hörnern packen)
3. تعابير طبيعية (auf Wolke 7 schweben)
4. تعابير مهنية (in trockenen Tüchern sein)

**تحذير:** تعلم التعابير في سياق كامل؛ ترجمتها الحرفية تخدع.`,
        tables: [
          {
            title: 'تعابير الجسم الشائعة',
            headers: ['التعبير', 'المعنى الحرفي', 'المعنى الفعلي'],
            rows: [
              { cells: ['die Nase voll haben', 'أنفه ممتلئ', 'سئم / طفح به الكيل'] },
              { cells: ['jdm. auf die Nerven gehen', 'يذهب على الأعصاب', 'يزعج / يُضايق'] },
              { cells: ['die Daumen drücken', 'يضغط الإبهامين', 'يتمنى الحظ'] },
              { cells: ['sich den Kopf zerbrechen', 'يكسر رأسه', 'يُفكر بعمق'] },
              { cells: ['jdm. die kalte Schulter zeigen', 'يُظهر الكتف البارد', 'يتجاهل'] },
              { cells: ['mit dem Kopf durch die Wand', 'برأسه عبر الجدار', 'يُصر بعناد'] },
            ],
            theme: 'default',
          },
          {
            title: 'تعابير متنوعة',
            headers: ['التعبير', 'المعنى'],
            rows: [
              { cells: ['auf Wolke 7 schweben', 'يطير في سعادة'] },
              { cells: ['aus allen Wolken fallen', 'يُصدم بشدة'] },
              { cells: ['Tomaten auf den Augen haben', 'لا يلاحظ الواضح'] },
              { cells: ['um den heißen Brei reden', 'يدور حول الموضوع'] },
              { cells: ['ins kalte Wasser springen', 'يقتحم الموقف'] },
              { cells: ['in trockenen Tüchern sein', 'منجز / محسوم'] },
              { cells: ['die Katze aus dem Sack lassen', 'يكشف السر'] },
              { cells: ['das A und O', 'الأساس / الأهم'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'لا تترجم التعابير حرفياً — تعلمها كوحدة واحدة', example: 'Ich drücke dir die Daumen!', translation: 'أتمنى لك التوفيق!' },
          { rule: 'التعابير تختلف حسب المنطقة (ألمانيا / النمسا / سويسرا)', example: 'Das ist nicht mein Bier.', translation: 'هذا ليس شأني.' },
          { rule: 'استخدام التعابير يدل على إتقان اللغة', example: 'Jetzt ist alles in trockenen Tüchern.', translation: 'الآن كل شيء محسوم.' },
        ],
        examples: [
          'Ich drücke dir die Daumen für die Prüfung! — أتمنى لك التوفيق في الامتحان!',
          'Er hat die Nase voll von der Arbeit. — طفح به الكيل من العمل.',
          'Sie schwebt auf Wolke 7, seit sie verliebt ist. — تطير في السماء منذ وقعت في الحب.',
          'Jetzt lass endlich die Katze aus dem Sack! — اكشف السر أخيراً!',
          'Er redet immer um den heißen Brei herum. — دائماً يدور حول الموضوع.',
          'Mathe ist für ihn ein Buch mit sieben Siegeln. — الرياضيات بالنسبة له لغز محكم.',
          'Das Geschäft ist in trockenen Tüchern. — الصفقة محسومة.',
          'Ich muss mir den Kopf zerbrechen, wie ich das löse. — يجب أن أفكر بعمق في كيفية حل هذا.',
        ],
        tip: '💡 تعلم التعابير يُحسن الاستماع وفهم الأفلام والأخبار بشكل هائل. احتفظ بقائمة شخصية وأضف تعبيرين أو ثلاثة أسبوعياً.',
      },
      vocabulary: [
        { german: 'die Daumen drücken', arabic: 'يتمنى الحظ', type: 'phrase' },
        { german: 'die Nase voll haben', arabic: 'سئم / طفح الكيل', type: 'phrase' },
        { german: 'auf Wolke 7 schweben', arabic: 'يطير في السعادة', type: 'phrase' },
        { german: 'sich den Kopf zerbrechen', arabic: 'يفكر بعمق', type: 'phrase' },
        { german: 'ins kalte Wasser springen', arabic: 'يقتحم الموقف', type: 'phrase' },
        { german: 'die Katze aus dem Sack lassen', arabic: 'يكشف السر', type: 'phrase' },
        { german: 'um den heißen Brei reden', arabic: 'يلف ويدور', type: 'phrase' },
        { german: 'in trockenen Tüchern sein', arabic: 'محسوم / منتهٍ', type: 'phrase' },
        { german: 'auf die Nerven gehen', arabic: 'يزعج', type: 'phrase' },
        { german: 'die kalte Schulter zeigen', arabic: 'يتجاهل', type: 'phrase' },
        { german: 'das A und O', arabic: 'الأهم / الأساس', type: 'phrase' },
        { german: 'aus allen Wolken fallen', arabic: 'يُصدم بشدة', type: 'phrase' },
        { german: 'Tomaten auf den Augen haben', arabic: 'لا يلاحظ الواضح', type: 'phrase' },
        { german: 'ein Buch mit sieben Siegeln', arabic: 'لغز / مُعقد', type: 'phrase' },
        { german: 'den Nagel auf den Kopf treffen', arabic: 'يُصيب كبد الحقيقة', type: 'phrase' },
        { german: 'in den sauren Apfel beißen', arabic: 'يقبل الأمر الصعب', type: 'phrase' },
        { german: 'ich verstehe nur Bahnhof', arabic: 'لا أفهم شيئاً', type: 'phrase' },
        { german: 'etwas geht in die Hose', arabic: 'شيء يفشل', type: 'phrase' },
        { german: 'den Stier bei den Hörnern packen', arabic: 'يواجه المشكلة مباشرة', type: 'phrase' },
        { german: 'Schwein haben', arabic: 'يحالفه الحظ', type: 'phrase' },
      ],
      exercise: {
        questions: [
          { id: 'c1-08-q1', type: 'multiple-choice', question: '"Ich drücke dir die Daumen" تعني:', options: ['أضغط على يدك.', 'أتمنى لك التوفيق.', 'أمسك إبهامك.', 'لا أعرف ماذا أفعل.'], answer: 'أتمنى لك التوفيق.' },
          { id: 'c1-08-q2', type: 'fill-blank', question: 'أكمل: "Er hat die ___ voll von der Arbeit."', answer: 'Nase', hint: 'تعبير يعني "طفح الكيل"' },
          { id: 'c1-08-q3', type: 'multiple-choice', question: '"Auf Wolke 7 schweben" تعني:', options: ['يسقط.', 'يطير في السعادة.', 'يسافر بالطائرة.', 'يفكر في السحاب.'], answer: 'يطير في السعادة.' },
          { id: 'c1-08-q4', type: 'fill-blank', question: 'أكمل: "Lass endlich die ___ aus dem Sack!" (تعبير: اكشف السر)', answer: 'Katze', hint: 'حيوان أليف' },
          { id: 'c1-08-q5', type: 'multiple-choice', question: '"um den heißen Brei reden" تعني:', options: ['يطبخ طعاماً.', 'يدور حول الموضوع.', 'يتكلم بصوت عال.', 'يأكل بسرعة.'], answer: 'يدور حول الموضوع.' },
          { id: 'c1-08-q6', type: 'matching', question: 'طابق التعبير بمعناه:', pairs: [{ left: 'die Nase voll haben', right: 'سئم' }, { left: 'auf Wolke 7', right: 'في قمة السعادة' }, { left: 'Schwein haben', right: 'يحالفه الحظ' }, { left: 'das A und O', right: 'الأهم' }], answer: 'matched' },
          { id: 'c1-08-q7', type: 'fill-blank', question: 'أكمل: "Das Geschäft ist in ___ Tüchern." (محسوم)', answer: 'trockenen', hint: 'عكس "رطب"' },
          { id: 'c1-08-q8', type: 'multiple-choice', question: '"Ich verstehe nur Bahnhof" تعني:', options: ['أفهم محطة القطار فقط.', 'لا أفهم شيئاً.', 'أحب السفر.', 'أنا في المحطة.'], answer: 'لا أفهم شيئاً.' },
          { id: 'c1-08-q9', type: 'speaking', question: 'قل: "Ich drücke dir die Daumen!"', audioPrompt: 'Ich drücke dir die Daumen!', answer: 'Ich drücke dir die Daumen' },
          { id: 'c1-08-q10', type: 'drag-drop', question: 'رتب:', words: ['Er', 'trifft', 'den', 'Nagel', 'auf', 'den', 'Kopf'], answer: 'Er trifft den Nagel auf den Kopf' },
        ],
      },
    },
    {
      id: 'c1-09',
      title: 'الاقتصاد والسياسة — Wirtschaft und Politik',
      order: 9,
      grammar: {
        title: 'المفردات الرسمية للاقتصاد والسياسة',
        content: `في C1 تحتاج مفردات متخصصة لفهم الأخبار والمقالات الاقتصادية والسياسية.

**المجالات الرئيسية:**

**1. الاقتصاد (Wirtschaft):**
- der Markt, die Konjunktur, die Inflation, die Rezession
- das BIP (Bruttoinlandsprodukt), die Arbeitslosenquote
- der Export / Import, die Handelsbilanz

**2. السياسة (Politik):**
- die Regierung, das Parlament, die Opposition
- der Bundestag, der Bundesrat, die Koalition
- die Wahl, das Mandat, der Abgeordnete

**3. الاتحاد الأوروبي (EU):**
- die Europäische Union, die Kommission, das Parlament
- der Binnenmarkt, die Währungsunion`,
        tables: [
          {
            title: 'مصطلحات اقتصادية',
            headers: ['المصطلح', 'المعنى'],
            rows: [
              { cells: ['die Inflation', 'التضخم'] },
              { cells: ['die Rezession', 'الركود'] },
              { cells: ['das Wachstum', 'النمو'] },
              { cells: ['die Arbeitslosenquote', 'نسبة البطالة'] },
              { cells: ['das BIP', 'الناتج المحلي الإجمالي'] },
              { cells: ['die Handelsbilanz', 'الميزان التجاري'] },
              { cells: ['der Aktienmarkt', 'سوق الأسهم'] },
              { cells: ['die Steuer', 'الضريبة'] },
            ],
            theme: 'default',
          },
          {
            title: 'مصطلحات سياسية',
            headers: ['المصطلح', 'المعنى'],
            rows: [
              { cells: ['die Regierung', 'الحكومة'] },
              { cells: ['die Opposition', 'المعارضة'] },
              { cells: ['der Bundestag', 'البرلمان الألماني'] },
              { cells: ['der Bundeskanzler', 'المستشار الاتحادي'] },
              { cells: ['die Koalition', 'التحالف'] },
              { cells: ['die Abstimmung', 'التصويت'] },
              { cells: ['das Gesetz', 'القانون'] },
              { cells: ['der Abgeordnete', 'النائب'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'معظم المصطلحات مؤنثة بنهاية -ung أو -ion', example: 'die Regierung, die Inflation', translation: 'الحكومة، التضخم' },
          { rule: 'استخدم Passiv في النصوص الصحفية', example: 'Das Gesetz wurde verabschiedet.', translation: 'أُقرّ القانون.' },
          { rule: 'الاختصارات شائعة: BIP, EU, SPD, CDU', example: 'Die CDU hat die Wahl gewonnen.', translation: 'فاز CDU بالانتخابات.' },
        ],
        examples: [
          'Die Inflation ist im letzten Quartal gestiegen. — ارتفع التضخم في الربع الأخير.',
          'Die Regierung hat ein neues Gesetz verabschiedet. — أقرّت الحكومة قانوناً جديداً.',
          'Das BIP wuchs um 2,5 Prozent. — نما الناتج المحلي الإجمالي بنسبة 2.5%.',
          'Die Opposition kritisiert den Haushaltsplan. — تنتقد المعارضة خطة الميزانية.',
          'Die Arbeitslosenquote ist gesunken. — انخفضت نسبة البطالة.',
          'Die EU hat neue Sanktionen verhängt. — فرض الاتحاد الأوروبي عقوبات جديدة.',
          'Der Bundeskanzler hielt eine Rede. — ألقى المستشار الاتحادي خطاباً.',
          'Die Koalition verhandelt über den Klimaschutz. — يتفاوض التحالف بشأن حماية المناخ.',
        ],
        tip: '💡 اقرأ مقالة واحدة يومياً من **Tagesschau**, **FAZ**, أو **Süddeutsche Zeitung**. ابدأ بـ "Themen" وانتقل للمقالات الاقتصادية مع الوقت.',
      },
      vocabulary: [
        { german: 'die Regierung', arabic: 'الحكومة', gender: 'die', plural: 'Regierungen', type: 'noun' },
        { german: 'die Opposition', arabic: 'المعارضة', gender: 'die', type: 'noun' },
        { german: 'der Bundestag', arabic: 'البرلمان الألماني', gender: 'der', type: 'noun' },
        { german: 'der Bundeskanzler', arabic: 'المستشار', gender: 'der', plural: 'Bundeskanzler', type: 'noun' },
        { german: 'die Koalition', arabic: 'التحالف', gender: 'die', plural: 'Koalitionen', type: 'noun' },
        { german: 'die Wahl', arabic: 'الانتخابات', gender: 'die', plural: 'Wahlen', type: 'noun' },
        { german: 'der Abgeordnete', arabic: 'النائب', gender: 'der', plural: 'Abgeordneten', type: 'noun' },
        { german: 'die Inflation', arabic: 'التضخم', gender: 'die', type: 'noun' },
        { german: 'die Rezession', arabic: 'الركود', gender: 'die', type: 'noun' },
        { german: 'das Wachstum', arabic: 'النمو', gender: 'das', type: 'noun' },
        { german: 'die Arbeitslosenquote', arabic: 'نسبة البطالة', gender: 'die', type: 'noun' },
        { german: 'das BIP', arabic: 'الناتج المحلي الإجمالي', gender: 'das', type: 'noun' },
        { german: 'die Steuer', arabic: 'الضريبة', gender: 'die', plural: 'Steuern', type: 'noun' },
        { german: 'der Haushalt', arabic: 'الميزانية / المنزل', gender: 'der', plural: 'Haushalte', type: 'noun' },
        { german: 'die Sanktion', arabic: 'العقوبة', gender: 'die', plural: 'Sanktionen', type: 'noun' },
        { german: 'verhängen', arabic: 'يفرض (عقوبة)', type: 'verb' },
        { german: 'verhandeln', arabic: 'يتفاوض', type: 'verb' },
        { german: 'verabschieden', arabic: 'يُقرّ (قانوناً)', type: 'verb' },
        { german: 'der Abschwung', arabic: 'الانحدار الاقتصادي', gender: 'der', type: 'noun' },
        { german: 'der Aufschwung', arabic: 'الازدهار الاقتصادي', gender: 'der', type: 'noun' },
      ],
      exercise: {
        questions: [
          { id: 'c1-09-q1', type: 'multiple-choice', question: 'ما معنى "die Inflation"؟', options: ['الركود', 'التضخم', 'النمو', 'الاستثمار'], answer: 'التضخم' },
          { id: 'c1-09-q2', type: 'fill-blank', question: 'أكمل: "Die ___ hat ein neues Gesetz verabschiedet." (الحكومة)', answer: 'Regierung', hint: 'مؤسسة الحكم التنفيذية' },
          { id: 'c1-09-q3', type: 'multiple-choice', question: '"der Bundeskanzler" هو:', options: ['الرئيس', 'المستشار', 'الوزير', 'النائب'], answer: 'المستشار' },
          { id: 'c1-09-q4', type: 'fill-blank', question: 'أكمل: "Die Arbeitslosen___ ist gesunken." (نسبة)', answer: 'quote', hint: 'كلمة تعني "نسبة / حصة"' },
          { id: 'c1-09-q5', type: 'drag-drop', question: 'رتب:', words: ['Die', 'EU', 'hat', 'neue', 'Sanktionen', 'verhängt'], answer: 'Die EU hat neue Sanktionen verhängt' },
          { id: 'c1-09-q6', type: 'multiple-choice', question: 'ما البديل الرسمي لـ "das Wachstum"؟', options: ['die Rezession', 'die Inflation', 'der Aufschwung', 'die Steuer'], answer: 'der Aufschwung' },
          { id: 'c1-09-q7', type: 'matching', question: 'طابق:', pairs: [{ left: 'die Wahl', right: 'الانتخابات' }, { left: 'der Abgeordnete', right: 'النائب' }, { left: 'die Koalition', right: 'التحالف' }, { left: 'das Gesetz', right: 'القانون' }], answer: 'matched' },
          { id: 'c1-09-q8', type: 'fill-blank', question: 'أكمل: "Das ___ wuchs um 2,5 Prozent." (الناتج المحلي الإجمالي)', answer: 'BIP', hint: 'اختصار' },
          { id: 'c1-09-q9', type: 'speaking', question: 'قل: "Die Regierung hat ein neues Gesetz verabschiedet."', audioPrompt: 'Die Regierung hat ein neues Gesetz verabschiedet.', answer: 'Die Regierung hat ein neues Gesetz verabschiedet' },
          { id: 'c1-09-q10', type: 'drag-drop', question: 'رتب:', words: ['Die', 'Opposition', 'kritisiert', 'den', 'Haushaltsplan'], answer: 'Die Opposition kritisiert den Haushaltsplan' },
        ],
      },
    },
    {
      id: 'c1-10',
      title: 'الأدب والثقافة — Literatur und Kultur',
      order: 10,
      grammar: {
        title: 'مصطلحات النقد الأدبي والثقافي',
        content: `في C1، فهم ومناقشة الأدب جزء من الامتحان (Goethe-Zertifikat C1, TestDaF).

**أنواع النصوص الأدبية:**
- **die Prosa:** der Roman, die Kurzgeschichte, die Novelle
- **die Lyrik:** das Gedicht, die Ballade
- **das Drama:** die Tragödie, die Komödie

**عناصر التحليل الأدبي:**
- **die Handlung** (الحبكة)
- **die Figur / der Charakter** (الشخصية)
- **der Erzähler** (الراوي)
- **die Perspektive** (المنظور: Ich / Er-Erzähler)
- **das Motiv** (الموضوع المتكرر)
- **die Metapher / das Symbol**

**أشهر الكتاب الألمان:**
Goethe, Schiller, Kafka, Thomas Mann, Hesse, Brecht, Böll, Grass`,
        tables: [
          {
            title: 'مصطلحات النقد الأدبي',
            headers: ['المصطلح', 'المعنى'],
            rows: [
              { cells: ['die Handlung', 'الحبكة / الأحداث'] },
              { cells: ['der Protagonist', 'البطل الرئيسي'] },
              { cells: ['der Antagonist', 'الخصم'] },
              { cells: ['der Höhepunkt', 'الذروة'] },
              { cells: ['die Auflösung', 'الحل / النهاية'] },
              { cells: ['die Metapher', 'الاستعارة'] },
              { cells: ['das Symbol', 'الرمز'] },
              { cells: ['der Konflikt', 'الصراع'] },
            ],
            theme: 'default',
          },
          {
            title: 'العصور الأدبية الألمانية',
            headers: ['العصر', 'الفترة', 'ممثل'],
            rows: [
              { cells: ['Aufklärung', '1720-1800', 'Lessing'] },
              { cells: ['Sturm und Drang', '1765-1790', 'Goethe (jung)'] },
              { cells: ['Klassik', '1786-1832', 'Goethe, Schiller'] },
              { cells: ['Romantik', '1798-1835', 'Novalis, Brüder Grimm'] },
              { cells: ['Realismus', '1848-1890', 'Fontane'] },
              { cells: ['Expressionismus', '1910-1925', 'Kafka, Trakl'] },
              { cells: ['Nachkriegsliteratur', '1945-1990', 'Böll, Grass'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'عند تحليل نص أدبي، حدد النوع (Gattung) أولاً', example: 'Dieser Text ist eine Kurzgeschichte.', translation: 'هذا النص قصة قصيرة.' },
          { rule: 'استخدم الحاضر (Präsens) لسرد أحداث العمل الأدبي', example: 'Der Protagonist verliebt sich in...', translation: 'يقع البطل في حب...' },
          { rule: 'احلل الأسلوب (Stil) والصور البلاغية (Stilmittel)', example: 'Der Autor verwendet viele Metaphern.', translation: 'يستخدم المؤلف استعارات كثيرة.' },
        ],
        examples: [
          'Der Roman spielt im 19. Jahrhundert. — تدور أحداث الرواية في القرن التاسع عشر.',
          'Kafka ist ein wichtiger Vertreter des Expressionismus. — كافكا ممثل مهم للتعبيرية.',
          'Die Metapher verdeutlicht die innere Zerrissenheit. — تُوضح الاستعارة التمزق الداخلي.',
          'Der Autor kritisiert die Gesellschaft seiner Zeit. — ينتقد المؤلف مجتمع عصره.',
          'Die Handlung erreicht ihren Höhepunkt im dritten Kapitel. — تصل الحبكة لذروتها في الفصل الثالث.',
          'Thomas Mann erhielt 1929 den Nobelpreis. — حصل توماس مان على جائزة نوبل 1929.',
          'Das Gedicht besteht aus vier Strophen. — يتكون الشعر من أربع مقاطع.',
          'Brecht entwickelte das epische Theater. — طور بريشت المسرح الملحمي.',
        ],
        tip: '💡 لتحضير C1 الأدبي: اقرأ "Die Verwandlung" لكافكا أو "Der Besuch der alten Dame" لدورنمات. هي قصيرة، لغتها صعبة لكنها كلاسيكية.',
      },
      vocabulary: [
        { german: 'der Roman', arabic: 'الرواية', gender: 'der', plural: 'Romane', type: 'noun' },
        { german: 'die Kurzgeschichte', arabic: 'القصة القصيرة', gender: 'die', plural: 'Kurzgeschichten', type: 'noun' },
        { german: 'das Gedicht', arabic: 'الشعر / القصيدة', gender: 'das', plural: 'Gedichte', type: 'noun' },
        { german: 'das Drama', arabic: 'المسرحية', gender: 'das', plural: 'Dramen', type: 'noun' },
        { german: 'die Handlung', arabic: 'الحبكة', gender: 'die', plural: 'Handlungen', type: 'noun' },
        { german: 'der Protagonist', arabic: 'البطل', gender: 'der', plural: 'Protagonisten', type: 'noun' },
        { german: 'der Erzähler', arabic: 'الراوي', gender: 'der', plural: 'Erzähler', type: 'noun' },
        { german: 'die Metapher', arabic: 'الاستعارة', gender: 'die', plural: 'Metaphern', type: 'noun' },
        { german: 'das Symbol', arabic: 'الرمز', gender: 'das', plural: 'Symbole', type: 'noun' },
        { german: 'der Konflikt', arabic: 'الصراع', gender: 'der', plural: 'Konflikte', type: 'noun' },
        { german: 'der Höhepunkt', arabic: 'الذروة', gender: 'der', plural: 'Höhepunkte', type: 'noun' },
        { german: 'die Auflösung', arabic: 'الحل / النهاية', gender: 'die', type: 'noun' },
        { german: 'die Gattung', arabic: 'النوع الأدبي', gender: 'die', plural: 'Gattungen', type: 'noun' },
        { german: 'die Epoche', arabic: 'العصر', gender: 'die', plural: 'Epochen', type: 'noun' },
        { german: 'der Autor', arabic: 'المؤلف', gender: 'der', plural: 'Autoren', type: 'noun' },
        { german: 'die Autorin', arabic: 'المؤلفة', gender: 'die', plural: 'Autorinnen', type: 'noun' },
        { german: 'interpretieren', arabic: 'يُفسر', type: 'verb' },
        { german: 'analysieren', arabic: 'يُحلل', type: 'verb' },
        { german: 'verfassen', arabic: 'يؤلف / يكتب', type: 'verb' },
        { german: 'die Strophe', arabic: 'المقطع الشعري', gender: 'die', plural: 'Strophen', type: 'noun' },
      ],
      exercise: {
        questions: [
          { id: 'c1-10-q1', type: 'multiple-choice', question: 'ما معنى "die Handlung"؟', options: ['المؤلف', 'الحبكة', 'الشخصية', 'العصر'], answer: 'الحبكة' },
          { id: 'c1-10-q2', type: 'fill-blank', question: 'أكمل: "Kafka ist ein Vertreter des ___." (التعبيرية)', answer: 'Expressionismus', hint: 'العصر الأدبي 1910-1925' },
          { id: 'c1-10-q3', type: 'multiple-choice', question: 'ما هو "der Protagonist"؟', options: ['الراوي', 'البطل الرئيسي', 'الخصم', 'المؤلف'], answer: 'البطل الرئيسي' },
          { id: 'c1-10-q4', type: 'fill-blank', question: 'أكمل: "Das Gedicht besteht aus vier ___." (المقاطع الشعرية)', answer: 'Strophen', hint: 'جمع die Strophe' },
          { id: 'c1-10-q5', type: 'drag-drop', question: 'رتب:', words: ['Der', 'Roman', 'spielt', 'im', '19.', 'Jahrhundert'], answer: 'Der Roman spielt im 19. Jahrhundert' },
          { id: 'c1-10-q6', type: 'multiple-choice', question: 'ما هي "die Metapher"؟', options: ['المسرحية', 'الحبكة', 'الاستعارة', 'النهاية'], answer: 'الاستعارة' },
          { id: 'c1-10-q7', type: 'matching', question: 'طابق الكاتب بعصره:', pairs: [{ left: 'Goethe', right: 'Klassik' }, { left: 'Kafka', right: 'Expressionismus' }, { left: 'Grass', right: 'Nachkriegsliteratur' }, { left: 'Novalis', right: 'Romantik' }], answer: 'matched' },
          { id: 'c1-10-q8', type: 'fill-blank', question: 'أكمل: "Die Handlung erreicht ihren ___ im dritten Kapitel." (الذروة)', answer: 'Höhepunkt', hint: 'النقطة الأعلى في الحبكة' },
          { id: 'c1-10-q9', type: 'speaking', question: 'قل: "Der Autor kritisiert die Gesellschaft seiner Zeit."', audioPrompt: 'Der Autor kritisiert die Gesellschaft seiner Zeit.', answer: 'Der Autor kritisiert die Gesellschaft seiner Zeit' },
          { id: 'c1-10-q10', type: 'drag-drop', question: 'رتب:', words: ['Brecht', 'entwickelte', 'das', 'epische', 'Theater'], answer: 'Brecht entwickelte das epische Theater' },
        ],
      },
    },
    {
      id: 'c1-11',
      title: 'العرض والمناقشة — Präsentation und Diskussion',
      order: 11,
      grammar: {
        title: 'مهارات العرض والجدال الشفهي',
        content: `في C1، يُقَيَّم العرض الشفهي والمشاركة في النقاش (امتحان Mündlich).

**هيكل العرض (Präsentation):**

**1. المقدمة (Einleitung):**
- "Ich möchte Ihnen heute das Thema X vorstellen."
- "Ich werde in drei Schritten vorgehen: ..."

**2. الجزء الرئيسي (Hauptteil):**
- "Zunächst möchte ich auf X eingehen."
- "Als Nächstes werde ich Y erläutern."
- "Schließlich komme ich zu Z."

**3. الخاتمة (Schluss):**
- "Zusammenfassend lässt sich feststellen..."
- "Zum Abschluss möchte ich betonen..."
- "Vielen Dank für Ihre Aufmerksamkeit!"

**في النقاش (Diskussion):**
- الاتفاق: "Da stimme ich Ihnen zu." / "Das sehe ich genauso."
- الاختلاف: "Da muss ich Ihnen widersprechen." / "Das sehe ich anders."
- طلب التوضيح: "Könnten Sie das näher erläutern?"
- الإدارة: "Lassen Sie mich kurz etwas ergänzen."`,
        tables: [
          {
            title: 'تعبيرات العرض',
            headers: ['الوظيفة', 'تعبير'],
            rows: [
              { cells: ['البداية', 'Zunächst möchte ich...'] },
              { cells: ['الانتقال', 'Kommen wir nun zu...'] },
              { cells: ['التوضيح', 'Damit meine ich...'] },
              { cells: ['المثال', 'Ein Beispiel dafür ist...'] },
              { cells: ['النتيجة', 'Daraus folgt, dass...'] },
              { cells: ['الخاتمة', 'Abschließend möchte ich...'] },
            ],
            theme: 'default',
          },
          {
            title: 'تعبيرات النقاش',
            headers: ['الوظيفة', 'تعبير'],
            rows: [
              { cells: ['إبداء رأي', 'Meiner Meinung nach...'] },
              { cells: ['اتفاق قوي', 'Dem kann ich nur zustimmen.'] },
              { cells: ['اتفاق جزئي', 'Da haben Sie teilweise recht, aber...'] },
              { cells: ['اختلاف لبق', 'Ich sehe das differenzierter.'] },
              { cells: ['اختلاف حازم', 'Dem muss ich entschieden widersprechen.'] },
              { cells: ['تلخيص', 'Wenn ich Sie richtig verstehe...'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'رتّب العرض بأدوات ربط واضحة (zunächst, danach, abschließend)', example: 'Zunächst werde ich ... vorstellen.', translation: 'في البداية سأقدم...' },
          { rule: 'في النقاش، عبّر عن رأيك بوضوح مع التحفظ المناسب', example: 'Meiner Meinung nach ist es sinnvoll...', translation: 'في رأيي من المنطقي...' },
          { rule: 'استخدم أدوات لتخفيف الاختلاف (Ich verstehe Ihren Punkt, jedoch...)', example: 'Ich kann Ihren Standpunkt nachvollziehen, jedoch...', translation: 'أفهم وجهة نظرك، ولكن...' },
        ],
        examples: [
          'Ich möchte Ihnen heute das Thema "Digitalisierung" vorstellen. — أود أن أقدم لكم اليوم موضوع "الرقمنة".',
          'Zunächst werde ich auf die Vorteile eingehen. — أولاً سأتناول المزايا.',
          'Abschließend komme ich zu meiner persönlichen Einschätzung. — في النهاية أصل إلى تقييمي الشخصي.',
          'Da stimme ich Ihnen grundsätzlich zu. — أتفق معك من حيث المبدأ.',
          'Das sehe ich allerdings differenzierter. — لكنني أراه بشكل أكثر دقة.',
          'Könnten Sie das Argument näher erläutern? — هل يمكنك توضيح الحجة أكثر؟',
          'Vielen Dank für Ihre Aufmerksamkeit. Gibt es noch Fragen? — شكراً لاهتمامكم. هل هناك أسئلة؟',
          'Wenn ich Sie richtig verstehe, plädieren Sie für... — إذا فهمتك جيداً، فأنت تدعو إلى...',
        ],
        tip: '💡 تدرّب على عرض مدته 3-5 دقائق يومياً. سجل صوتك وأعد الاستماع. هذا هو السر الأكبر لاجتياز مُمتحن Goethe C1 الشفهي.',
      },
      vocabulary: [
        { german: 'die Präsentation', arabic: 'العرض التقديمي', gender: 'die', plural: 'Präsentationen', type: 'noun' },
        { german: 'die Diskussion', arabic: 'النقاش', gender: 'die', plural: 'Diskussionen', type: 'noun' },
        { german: 'vorstellen', arabic: 'يُقدم', type: 'verb' },
        { german: 'eingehen auf', arabic: 'يتناول / يدخل في', type: 'verb' },
        { german: 'erläutern', arabic: 'يشرح', type: 'verb' },
        { german: 'zustimmen', arabic: 'يوافق', type: 'verb' },
        { german: 'widersprechen', arabic: 'يعارض', type: 'verb' },
        { german: 'ergänzen', arabic: 'يُكمل / يضيف', type: 'verb' },
        { german: 'nachvollziehen', arabic: 'يتفهم / يستوعب', type: 'verb' },
        { german: 'der Standpunkt', arabic: 'وجهة النظر', gender: 'der', plural: 'Standpunkte', type: 'noun' },
        { german: 'die Einschätzung', arabic: 'التقييم', gender: 'die', plural: 'Einschätzungen', type: 'noun' },
        { german: 'der Aspekt', arabic: 'الجانب', gender: 'der', plural: 'Aspekte', type: 'noun' },
        { german: 'die These', arabic: 'الأطروحة', gender: 'die', plural: 'Thesen', type: 'noun' },
        { german: 'grundsätzlich', arabic: 'من حيث المبدأ', type: 'adverb' },
        { german: 'differenziert', arabic: 'بدقة / بتمييز', type: 'adjective' },
        { german: 'abschließend', arabic: 'في الختام', type: 'adverb' },
        { german: 'zunächst', arabic: 'أولاً / في البداية', type: 'adverb' },
        { german: 'daraus folgt', arabic: 'يترتب على ذلك', type: 'phrase' },
        { german: 'die Aufmerksamkeit', arabic: 'الاهتمام', gender: 'die', type: 'noun' },
        { german: 'die Rückfrage', arabic: 'السؤال / الاستفسار', gender: 'die', plural: 'Rückfragen', type: 'noun' },
      ],
      exercise: {
        questions: [
          { id: 'c1-11-q1', type: 'multiple-choice', question: 'أي عبارة مناسبة لبداية عرض؟', options: ['Okay, los geht\'s.', 'Ich möchte Ihnen das Thema vorstellen.', 'Hallo Leute!', 'Macht nichts, egal.'], answer: 'Ich möchte Ihnen das Thema vorstellen.' },
          { id: 'c1-11-q2', type: 'fill-blank', question: 'أكمل: "___ möchte ich auf die Vorteile eingehen." (أولاً)', answer: 'Zunächst', hint: 'كلمة تعني "في البداية"' },
          { id: 'c1-11-q3', type: 'multiple-choice', question: 'ما أسلوب معارضة لبق؟', options: ['Nein, das stimmt nicht!', 'Das sehe ich differenzierter.', 'Blödsinn!', 'Quatsch.'], answer: 'Das sehe ich differenzierter.' },
          { id: 'c1-11-q4', type: 'fill-blank', question: 'أكمل: "___ lässt sich feststellen..." (في الختام)', answer: 'Abschließend', hint: 'كلمة لخاتمة العرض' },
          { id: 'c1-11-q5', type: 'drag-drop', question: 'رتب:', words: ['Vielen', 'Dank', 'für', 'Ihre', 'Aufmerksamkeit'], answer: 'Vielen Dank für Ihre Aufmerksamkeit' },
          { id: 'c1-11-q6', type: 'multiple-choice', question: '"Da stimme ich Ihnen zu" تعني:', options: ['أعارضك.', 'أتفق معك.', 'لا أفهمك.', 'اشرح أكثر.'], answer: 'أتفق معك.' },
          { id: 'c1-11-q7', type: 'matching', question: 'طابق:', pairs: [{ left: 'zunächst', right: 'في البداية' }, { left: 'abschließend', right: 'في الختام' }, { left: 'zustimmen', right: 'يوافق' }, { left: 'widersprechen', right: 'يعارض' }], answer: 'matched' },
          { id: 'c1-11-q8', type: 'fill-blank', question: 'أكمل: "Könnten Sie das ___ erläutern?" (أكثر / أقرب)', answer: 'näher', hint: 'صفة للتوسع في التوضيح' },
          { id: 'c1-11-q9', type: 'speaking', question: 'قل: "Meiner Meinung nach ist das sinnvoll."', audioPrompt: 'Meiner Meinung nach ist das sinnvoll.', answer: 'Meiner Meinung nach ist das sinnvoll' },
          { id: 'c1-11-q10', type: 'drag-drop', question: 'رتب:', words: ['Wenn', 'ich', 'Sie', 'richtig', 'verstehe', 'plädieren', 'Sie', 'für', 'Reformen'], answer: 'Wenn ich Sie richtig verstehe plädieren Sie für Reformen' },
        ],
      },
    },
    {
      id: 'c1-12',
      title: 'مراجعة شاملة — Wiederholung C1',
      order: 12,
      grammar: {
        title: 'تثبيت جميع قواعد C1',
        content: `في هذا الدرس الأخير، نراجع كل مفاتيح مستوى C1.

**القواعد الرئيسية:**

**1. Konjunktiv II الماضي:** hätte/wäre + Partizip II للأسف والتمني
**2. n-Deklination:** أسماء مذكرة تأخذ -n في كل الحالات عدا Nominativ
**3. Passiversatzformen:** lassen, sein + zu, -bar
**4. Partizipialattribute:** der laufende Mann (Partizip I), das gelöste Problem (Partizip II)
**5. Konditional ohne wenn:** تقديم الفعل المصرف (Hätte ich Zeit...)
**6. Funktionsverbgefüge:** eine Entscheidung treffen, in Kraft treten
**7. لغة أكاديمية:** folglich, darüber hinaus, es lässt sich feststellen
**8. Redewendungen:** die Daumen drücken, auf Wolke 7 schweben

**نصائح الامتحان (Goethe-Zertifikat C1 / TestDaF):**
- **Lesen:** اقرأ مقالات صحفية ألمانية يومياً
- **Hören:** استمع إلى Tagesschau و podcasts يومياً
- **Schreiben:** اكتب موضوعاً واحداً أسبوعياً بأسلوب أكاديمي
- **Sprechen:** سجل نفسك تعرض موضوعاً كل يوم`,
        tables: [
          {
            title: 'ملخص قواعد C1',
            headers: ['الموضوع', 'مثال'],
            rows: [
              { cells: ['Konjunktiv II Vergangenheit', 'Ich hätte kommen sollen.'] },
              { cells: ['n-Deklination', 'Ich helfe dem Nachbarn.'] },
              { cells: ['sich lassen (Passiversatz)', 'Das lässt sich lösen.'] },
              { cells: ['sein + zu', 'Das ist zu tun.'] },
              { cells: ['Partizip I attributiv', 'der schlafende Hund'] },
              { cells: ['Partizip II attributiv', 'das verlorene Buch'] },
              { cells: ['Konditional ohne wenn', 'Hätte ich Zeit, käme ich.'] },
              { cells: ['FVG', 'eine Entscheidung treffen'] },
            ],
            theme: 'default',
          },
          {
            title: 'أدوات الربط الأكاديمية',
            headers: ['الوظيفة', 'أداة'],
            rows: [
              { cells: ['إضافة رسمية', 'darüber hinaus, ferner, zudem'] },
              { cells: ['تعارض رسمي', 'jedoch, hingegen, dennoch'] },
              { cells: ['نتيجة رسمية', 'folglich, demnach, mithin'] },
              { cells: ['سبب رسمي', 'aufgrund, wegen, infolge'] },
              { cells: ['شرط', 'sofern, falls, vorausgesetzt'] },
              { cells: ['تلخيص', 'zusammenfassend, abschließend'] },
            ],
            theme: 'default',
          },
        ],
        rules: [
          { rule: 'استخدم Konjunktiv II Vergangenheit للأسف', example: 'Ich hätte anders entscheiden sollen.', translation: 'كان يجب أن أقرر بشكل مختلف.' },
          { rule: 'اتقن n-Deklination لتجنب الأخطاء الصغيرة', example: 'Ich kenne den Studenten.', translation: 'أعرف الطالب.' },
          { rule: 'نوّع أسلوبك بـ Passiversatzformen والاشتقاقات الاسمية', example: 'Das lässt sich lösen.', translation: 'يمكن حل هذا.' },
        ],
        examples: [
          'Hätte ich früher gewusst, dass das Problem so komplex ist, wäre ich anders vorgegangen. — لو كنت أعلم مبكراً أن المشكلة بهذا التعقيد، لتصرفت بشكل مختلف.',
          'Der von der Regierung verabschiedete Gesetzesentwurf tritt nächste Woche in Kraft. — مشروع القانون الذي أقرته الحكومة يدخل حيز التنفيذ الأسبوع المقبل.',
          'Das Problem lässt sich nicht ohne weiteres lösen. — لا يمكن حل المشكلة بسهولة.',
          'Die seit Jahren anhaltende Debatte über die Bildung führt zu keiner Lösung. — النقاش المستمر منذ سنوات حول التعليم لا يؤدي لأي حل.',
          'Folglich ist davon auszugehen, dass weitere Reformen nötig sind. — وبالتالي يُفترض أن مزيداً من الإصلاحات ضروري.',
          'Der Experte nahm Bezug auf die aktuelle Studie. — أشار الخبير إلى الدراسة الحالية.',
          'Hätten wir mehr Zeit, würden wir intensiver recherchieren. — لو كان لدينا وقت أكثر، لبحثنا بعمق أكبر.',
          'Die Digitalisierung stellt uns vor neue Herausforderungen. — الرقمنة تضعنا أمام تحديات جديدة.',
        ],
        tip: '💡 بعد C1: امتحانات TestDaF (للجامعات) و Goethe-Zertifikat C2 (للإتقان الكامل). معظم الجامعات الألمانية تطلب C1 أو TestDaF 4x4.',
      },
      vocabulary: [
        { german: 'bedauern', arabic: 'يندم', type: 'verb' },
        { german: 'die Herausforderung', arabic: 'التحدي', gender: 'die', plural: 'Herausforderungen', type: 'noun' },
        { german: 'verabschieden', arabic: 'يُقر (قانوناً)', type: 'verb' },
        { german: 'in Kraft treten', arabic: 'يدخل حيز التنفيذ', type: 'phrase' },
        { german: 'Bezug nehmen', arabic: 'يُشير إلى', type: 'phrase' },
        { german: 'recherchieren', arabic: 'يبحث', type: 'verb' },
        { german: 'intensiver', arabic: 'بعمق أكبر', type: 'adverb' },
        { german: 'anhaltend', arabic: 'مستمر', type: 'adjective' },
        { german: 'die Debatte', arabic: 'النقاش', gender: 'die', plural: 'Debatten', type: 'noun' },
        { german: 'folglich', arabic: 'وبالتالي', type: 'adverb' },
        { german: 'die Digitalisierung', arabic: 'الرقمنة', gender: 'die', type: 'noun' },
        { german: 'die Reform', arabic: 'الإصلاح', gender: 'die', plural: 'Reformen', type: 'noun' },
        { german: 'die Bildung', arabic: 'التعليم', gender: 'die', type: 'noun' },
        { german: 'der Gesetzesentwurf', arabic: 'مشروع القانون', gender: 'der', plural: 'Gesetzesentwürfe', type: 'noun' },
        { german: 'der Experte', arabic: 'الخبير', gender: 'der', plural: 'Experten', type: 'noun' },
        { german: 'die Studie', arabic: 'الدراسة', gender: 'die', plural: 'Studien', type: 'noun' },
        { german: 'aktuell', arabic: 'حالي / راهن', type: 'adjective' },
        { german: 'komplex', arabic: 'معقد', type: 'adjective' },
        { german: 'vorgehen', arabic: 'يتصرف / يمضي', type: 'verb' },
        { german: 'die Erkenntnis', arabic: 'المعرفة / الاستنتاج', gender: 'die', plural: 'Erkenntnisse', type: 'noun' },
      ],
      exercise: {
        questions: [
          { id: 'c1-12-q1', type: 'multiple-choice', question: 'اختر Konjunktiv II Vergangenheit: "Ich ___ gekommen, wenn ich Zeit gehabt hätte."', options: ['wäre', 'hätte', 'würde', 'war'], answer: 'wäre' },
          { id: 'c1-12-q2', type: 'fill-blank', question: 'أكمل (n-Deklination): "Ich helfe dem ___." (الزميل)', answer: 'Kollegen', hint: 'Dativ + n-Deklination' },
          { id: 'c1-12-q3', type: 'multiple-choice', question: 'أي جملة تستخدم Passiversatz بـ "lassen"؟', options: ['Das wird gemacht.', 'Das lässt sich machen.', 'Das ist gemacht.', 'Das war gemacht.'], answer: 'Das lässt sich machen.' },
          { id: 'c1-12-q4', type: 'fill-blank', question: 'أكمل: "der von der Regierung ___ Antrag" (الموافَق عليه)', answer: 'genehmigte', hint: 'Partizip II + نهاية صفة' },
          { id: 'c1-12-q5', type: 'drag-drop', question: 'رتب (konditional ohne wenn):', words: ['Hätte', 'ich', 'Zeit', 'käme', 'ich'], answer: 'Hätte ich Zeit käme ich' },
          { id: 'c1-12-q6', type: 'multiple-choice', question: 'أي FVG صحيح؟', options: ['eine Frage machen', 'eine Entscheidung treffen', 'einen Gesetz tun', 'Kritik werden'], answer: 'eine Entscheidung treffen' },
          { id: 'c1-12-q7', type: 'matching', question: 'طابق:', pairs: [{ left: 'Konjunktiv II Vergangenheit', right: 'hätte gemacht' }, { left: 'n-Deklination', right: 'den Studenten' }, { left: 'sein + zu', right: 'ist zu tun' }, { left: 'FVG', right: 'in Kraft treten' }], answer: 'matched' },
          { id: 'c1-12-q8', type: 'fill-blank', question: 'أكمل بأداة ربط أكاديمية: "___ ist zu berücksichtigen..." (علاوة على ذلك)', answer: 'Darüber hinaus', hint: 'أداة رسمية للإضافة' },
          { id: 'c1-12-q9', type: 'speaking', question: 'قل: "Das Problem lässt sich nicht ohne weiteres lösen."', audioPrompt: 'Das Problem lässt sich nicht ohne weiteres lösen.', answer: 'Das Problem lässt sich nicht ohne weiteres lösen' },
          { id: 'c1-12-q10', type: 'drag-drop', question: 'رتب:', words: ['Die', 'Digitalisierung', 'stellt', 'uns', 'vor', 'neue', 'Herausforderungen'], answer: 'Die Digitalisierung stellt uns vor neue Herausforderungen' },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 13 — Modalpartikeln advanced
    // ─────────────────────────────────────────────
    {
      id: 'c1-13',
      title: 'حروف الإضافة المتقدّمة — Modalpartikeln (C1)',
      order: 13,
      grammar: {
        title: 'تركيبات Modalpartikeln المتقدمة + الفروق الدقيقة',
        content: `في B2 تعلّمت Modalpartikeln الأساسية. في C1 تتعلّم الـ **تركيبات** (compound usage) والاستعمالات الناطقية الدقيقة. الناطق الأصلي يجمع بينها: *eben mal*, *halt doch*, *ja gerade*. كل تركيبة لها لون خاص.\n\n→ Komm **doch mal** her! (تعالَ من فضلك! — أكثر تأكيداً من mal وحدها)\n→ Das ist **eben halt** so. (هكذا هي الأمور بكل بساطة — تأكيد التسليم)\n→ Du weißt **ja eigentlich**, dass... (كما تعلم في الواقع... — تأكيد + تأمل)`,
        tables: [
          { title: 'تركيبات Modalpartikeln الشائعة', headers: ['التركيبة', 'الاستعمال', 'مثال'], rows: [
            { cells: ['doch mal', 'تأكيد + تلطيف', 'Komm doch mal her!'] },
            { cells: ['halt eben', 'تسليم مزدوج', 'Das ist halt eben so.'] },
            { cells: ['ja wohl', 'تأكيد + تخمين', 'Das wirst du ja wohl wissen!'] },
            { cells: ['mal eben', 'لحظة سريعة', 'Kannst du mal eben helfen?'] },
            { cells: ['ja eigentlich', 'تأكيد + تأمّل', 'Das ist ja eigentlich logisch.'] },
            { cells: ['doch eigentlich', 'استغراب + تأمّل', 'Das ist doch eigentlich klar.'] },
          ], theme: 'default', note: 'الترتيب يهم — التغيير يغيّر المعنى. تعلّم كل تركيبة كوحدة.' },
          { title: 'Modalpartikeln إضافية لـ C1', headers: ['الكلمة', 'الاستعمال', 'مثال'], rows: [
            { cells: ['allerdings', 'تخفيف الموافقة', 'Das ist allerdings teuer.'] },
            { cells: ['immerhin', 'على الأقل', 'Immerhin haben wir es versucht.'] },
            { cells: ['schließlich', 'في النهاية / فعلاً', 'Schließlich bist du erwachsen.'] },
            { cells: ['gerade', 'تأكيد على الكلمة التالية', 'Gerade du solltest das wissen.'] },
            { cells: ['ohnehin', 'على أي حال', 'Ich gehe ohnehin.'] },
            { cells: ['ruhig', 'بدون قلق', 'Du kannst ruhig fragen.'] },
            { cells: ['etwa', 'حقاً؟ (في السؤال السلبي)', 'Hast du etwa keine Zeit?'] },
          ], theme: 'default', note: 'هذه الـ Partikeln أكثر دقة من المستوى B2 — تظهر في الأدب والصحافة الراقية.' },
        ],
        rules: [
          { rule: 'doch mal أكثر إصراراً من mal وحدها — استعملها للحثّ.', example: 'Komm doch mal her! (مع إصرار)', translation: 'تعالَ بالله عليك!' },
          { rule: 'gerade قبل اسم/ضمير = تأكيد عليه ("بالضبط هذا، لا غيره").', example: 'Gerade du solltest das verstehen.', translation: 'أنت بالذات يجب أن تفهم هذا.' },
          { rule: 'etwa في السؤال السلبي = تعجّب/استنكار.', example: 'Hast du etwa kein Geld? (= ألا تقول إنك...؟)', translation: 'هل أنت حقاً بلا مال؟' },
          { rule: 'ruhig في الأمر = "بدون تردّد، أنا موافق".', example: 'Frag ruhig! / Bleib ruhig sitzen.', translation: 'اسأل بدون تردّد. / ابقَ جالساً، لا بأس.' },
        ],
        examples: [
          'Komm doch mal her, ich muss dir was zeigen. — تعالَ من فضلك، يجب أن أريك شيئاً.',
          'Das ist halt eben so im Leben. — هكذا هي الحياة بكل بساطة.',
          'Gerade du solltest das wissen! — أنت بالذات يجب أن تعلم هذا!',
          'Frag ruhig, ich antworte gern. — اسأل بدون تردّد، سأجيب بسرور.',
          'Hast du etwa keine Zeit? — هل أنت حقاً بلا وقت؟',
          'Ich gehe ohnehin in die Stadt. — سأذهب على أي حال إلى المدينة.',
          'Allerdings ist das problematisch. — مع ذلك فهذا إشكالي.',
          'Schließlich sind wir hier, um zu lernen. — في النهاية نحن هنا للتعلّم.',
          'Immerhin haben wir es versucht. — على الأقل حاولنا.',
          'Du weißt ja wohl, was zu tun ist. — أكيد تعلم ما يجب فعله.',
        ],
        tip: 'في C1، الـ Modalpartikeln تفرّقك عن المتحدّث "الأكاديمي" والمتحدّث "الطبيعي". اقرأ روايات معاصرة (Schlink, Süskind) ولاحظ كيف تستعمل. خلال شهرين، تستعملها بشكل تلقائي.',
      },
      vocabulary: [
        { german: 'allerdings', arabic: 'مع ذلك / إنما', example: 'Das ist allerdings teuer.', exampleArabic: 'مع ذلك فهو غالٍ.', type: 'adverb' },
        { german: 'immerhin', arabic: 'على الأقل', example: 'Immerhin hast du es versucht.', exampleArabic: 'على الأقل حاولت.', type: 'adverb' },
        { german: 'schließlich', arabic: 'في النهاية', example: 'Schließlich sind wir Freunde.', exampleArabic: 'في النهاية نحن أصدقاء.', type: 'adverb' },
        { german: 'gerade', arabic: 'بالضبط', example: 'Gerade du solltest helfen.', exampleArabic: 'أنت بالذات يجب أن تساعد.', type: 'adverb' },
        { german: 'ohnehin', arabic: 'على أي حال', example: 'Ich gehe ohnehin.', exampleArabic: 'أذهب على أي حال.', type: 'adverb' },
        { german: 'ruhig', arabic: 'بدون قلق', example: 'Frag ruhig!', exampleArabic: 'اسأل بدون تردّد!', type: 'adverb' },
        { german: 'etwa', arabic: 'حقاً؟', example: 'Hast du etwa Angst?', exampleArabic: 'هل أنت حقاً خائف؟', type: 'adverb' },
        { german: 'durchaus', arabic: 'تماماً', example: 'Das ist durchaus möglich.', exampleArabic: 'ذلك ممكن تماماً.', type: 'adverb' },
        { german: 'keineswegs', arabic: 'إطلاقاً', example: 'Das ist keineswegs einfach.', exampleArabic: 'هذا ليس سهلاً إطلاقاً.', type: 'adverb' },
        { german: 'gewiss', arabic: 'بالتأكيد', example: 'Gewiss kommt er.', exampleArabic: 'بالتأكيد سيأتي.', type: 'adverb' },
        { german: 'einigermaßen', arabic: 'إلى حدٍّ ما', example: 'Es geht mir einigermaßen.', exampleArabic: 'حالي إلى حدٍّ ما.', type: 'adverb' },
        { german: 'beinahe', arabic: 'تقريباً / كاد', example: 'Ich wäre beinahe gefallen.', exampleArabic: 'كدت أسقط.', type: 'adverb' },
        { german: 'nahezu', arabic: 'تقريباً', example: 'Es ist nahezu unmöglich.', exampleArabic: 'هو شبه مستحيل.', type: 'adverb' },
        { german: 'doch mal', arabic: 'تأكيد + تلطيف', example: 'Komm doch mal her!', exampleArabic: 'تعالَ من فضلك!', type: 'phrase' },
        { german: 'halt eben', arabic: 'بكل بساطة', example: 'Das ist halt eben so.', exampleArabic: 'هكذا هي ببساطة.', type: 'phrase' },
        { german: 'ja wohl', arabic: 'بالتأكيد', example: 'Das weißt du ja wohl.', exampleArabic: 'بالتأكيد أنت تعلم.', type: 'phrase' },
        { german: 'mal eben', arabic: 'لحظة سريعة', example: 'Kannst du mal eben helfen?', exampleArabic: 'هل تساعدني لحظة؟', type: 'phrase' },
        { german: 'noch nicht einmal', arabic: 'حتى لم', example: 'Er hat noch nicht einmal gegrüßt.', exampleArabic: 'حتى لم يلقِ التحية.', type: 'phrase' },
        { german: 'einigermaßen', arabic: 'إلى حدٍّ ما', example: 'Einigermaßen verstehe ich.', exampleArabic: 'أفهم إلى حدٍّ ما.', type: 'adverb' },
        { german: 'ehrlich gesagt', arabic: 'بصراحة', example: 'Ehrlich gesagt, weiß ich nicht.', exampleArabic: 'بصراحة لا أعلم.', type: 'phrase' },
        { german: 'der Beleg', arabic: 'الدليل', example: 'Wo ist der Beleg dafür?', exampleArabic: 'أين الدليل على ذلك؟', type: 'noun', gender: 'der', plural: 'die Belege' },
        { german: 'die Andeutung', arabic: 'الإشارة', example: 'Eine versteckte Andeutung.', exampleArabic: 'إشارة خفيّة.', type: 'noun', gender: 'die', plural: 'die Andeutungen' },
        { german: 'die Betonung', arabic: 'التأكيد / النبر', example: 'Die Betonung liegt auf dem Wort.', exampleArabic: 'النبر على الكلمة.', type: 'noun', gender: 'die', plural: 'die Betonungen' },
        { german: 'der Tonfall', arabic: 'النبرة', example: 'Sein Tonfall war scharf.', exampleArabic: 'نبرته كانت حادة.', type: 'noun', gender: 'der' },
        { german: 'die Ironie', arabic: 'السخرية', example: 'Das war reine Ironie.', exampleArabic: 'كانت سخرية محضة.', type: 'noun', gender: 'die' },
        { german: 'die Anspielung', arabic: 'التلميح', example: 'Eine subtile Anspielung.', exampleArabic: 'تلميح دقيق.', type: 'noun', gender: 'die', plural: 'die Anspielungen' },
        { german: 'subtil', arabic: 'دقيق', example: 'Eine subtile Bedeutung.', exampleArabic: 'معنى دقيق.', type: 'adjective' },
        { german: 'feinfühlig', arabic: 'مرهف الحس', example: 'Eine feinfühlige Bemerkung.', exampleArabic: 'ملاحظة مرهفة.', type: 'adjective' },
        { german: 'ausdrucksstark', arabic: 'معبّر', example: 'Eine ausdrucksstarke Sprache.', exampleArabic: 'لغة معبّرة.', type: 'adjective' },
        { german: 'gewichtig', arabic: 'ذو وزن', example: 'Ein gewichtiges Argument.', exampleArabic: 'حجة ذات وزن.', type: 'adjective' },
        { german: 'beiläufig', arabic: 'عرضي', example: 'Eine beiläufige Bemerkung.', exampleArabic: 'ملاحظة عرضية.', type: 'adjective' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'c1-13-q1', question: 'تأكيد + تلطيف: "Komm ___ ___ her!"', answer: 'doch mal', hint: 'doch mal — تركيبة' },
          { type: 'multiple-choice', id: 'c1-13-q2', question: 'استنكار في سؤال سلبي:', options: ['eben', 'wohl', 'etwa', 'doch'], answer: 'etwa' },
          { type: 'fill-blank', id: 'c1-13-q3', question: '"___ du solltest das wissen!" (أنت بالذات)', answer: 'Gerade', hint: 'gerade للتأكيد' },
          { type: 'multiple-choice', id: 'c1-13-q4', question: 'في الأمر، "بدون تردّد":', options: ['ruhig', 'gerade', 'wohl', 'eben'], answer: 'ruhig' },
          { type: 'fill-blank', id: 'c1-13-q5', question: '"Es ist ___ teuer." (مع ذلك / إنما)', answer: 'allerdings', hint: 'allerdings = إنما' },
          { type: 'matching', id: 'c1-13-q6', question: 'اربط الكلمة بمعناها:', pairs: [
            { left: 'allerdings', right: 'مع ذلك' },
            { left: 'immerhin', right: 'على الأقل' },
            { left: 'ohnehin', right: 'على أي حال' },
            { left: 'gerade', right: 'بالضبط' },
            { left: 'etwa', right: 'حقاً؟' },
            { left: 'ruhig', right: 'بدون تردّد' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'c1-13-q7', question: 'رتّب: "أنت بالذات تعلم ذلك"', words: ['Gerade', 'du', 'weißt', 'das'], answer: 'Gerade du weißt das' },
          { type: 'speaking', id: 'c1-13-q8', question: 'قل: "هكذا هي الأمور ببساطة"', answer: 'Das ist halt eben so' },
          { type: 'fill-blank', id: 'c1-13-q9', question: 'استمع: "Du weißt ___ ___, was zu tun ist."', audioPrompt: 'Du weißt ja wohl, was zu tun ist.', answer: 'ja wohl', hint: 'ja wohl = بالتأكيد' },
          { type: 'multiple-choice', id: 'c1-13-q10', question: 'الفرق بين B2 و C1 في Modalpartikeln:', options: ['كثرة الكلمات', 'استعمال التركيبات', 'لا فرق', 'حذف الـ Partikeln'], answer: 'استعمال التركيبات' },
          { type: 'fill-blank', id: 'c1-13-q11', question: '"Es ist ___ teuer, aber wertvoll." (تخفيف موافقة)', answer: 'allerdings', hint: 'allerdings = إنما' },
          { type: 'multiple-choice', id: 'c1-13-q12', question: 'الفرق بين nahezu و beinahe؟', options: ['نفس المعنى تقريباً', 'nahezu أكاديمي، beinahe كلامي', 'nahezu للمستقبل', 'مختلفان جذرياً'], answer: 'nahezu أكاديمي، beinahe كلامي' },
          { type: 'fill-blank', id: 'c1-13-q13', question: '"Das ist ___ möglich." (تماماً ممكن)', answer: 'durchaus', hint: 'durchaus = تماماً' },
          { type: 'matching', id: 'c1-13-q14', question: 'اربط الكلمة المتقدمة بمعناها:', pairs: [
            { left: 'durchaus', right: 'تماماً' },
            { left: 'keineswegs', right: 'إطلاقاً' },
            { left: 'einigermaßen', right: 'إلى حدٍّ ما' },
            { left: 'beinahe', right: 'تقريباً' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'c1-13-q15', question: 'رتّب: "هكذا هي الأمور بكل بساطة"', words: ['Das', 'ist', 'halt', 'eben', 'so'], answer: 'Das ist halt eben so' },
          { type: 'fill-blank', id: 'c1-13-q16', question: 'استمع: "___ stimme ich zu." (إلى هذا القدر)', audioPrompt: 'Insofern stimme ich zu.', answer: 'Insofern', hint: 'insofern = إلى هذا القدر' },
          { type: 'multiple-choice', id: 'c1-13-q17', question: 'في النص الأدبي:', options: ['Modalpartikeln غير مستحبّة', 'تستعمل بكثرة لإغناء الأسلوب', 'تُحذف', 'فقط في الحوار'], answer: 'تستعمل بكثرة لإغناء الأسلوب' },
          { type: 'speaking', id: 'c1-13-q18', question: 'قل: "اسأل بدون تردّد، أنا موافق"', answer: 'Frag ruhig, ich antworte gern' },
          { type: 'fill-blank', id: 'c1-13-q19', question: '"___ haben wir es versucht." (على الأقل)', answer: 'Immerhin', hint: 'immerhin = على الأقل' },
          { type: 'multiple-choice', id: 'c1-13-q20', question: 'في "Gerade du solltest das wissen!", تعني gerade:', options: ['الآن', 'بسرعة', 'بالضبط أنت', 'مستقيم'], answer: 'بالضبط أنت' },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 14 — Verbalstil vs Nominalstil
    // ─────────────────────────────────────────────
    {
      id: 'c1-14',
      title: 'الأسلوب الفعلي مقابل الأسلوب الإسمي — Verbalstil vs Nominalstil',
      order: 14,
      grammar: {
        title: 'تحويل الأفعال إلى أسماء (Nominalisierung) والعكس — مهارة C1 الأساسية',
        content: `في C1، التمييز بين **Verbalstil** (أسلوب الفعل) و**Nominalstil** (أسلوب الاسم) **حاسم**. كل امتحان C1 يطلب التحويل بينهما.\n\n**Verbalstil** = جمل بأفعال، أوضح، أكثر طبيعية للكلام:\n→ Wenn die Preise steigen, sinkt der Konsum.\n\n**Nominalstil** = جمل بأسماء، أكثر كثافة، يستعمل في النصوص الرسمية والعلمية:\n→ Bei Preisanstieg sinkt der Konsum.\n\nالتحويل يستعمل **حروف جر** (bei, durch, nach, trotz, wegen) + اسم بدلاً من جملة فرعية.`,
        tables: [
          { title: 'التحويل من Verbalstil إلى Nominalstil', headers: ['Verbalstil (فعل)', 'Nominalstil (اسم)', 'حرف الجر'], rows: [
            { cells: ['wenn er kommt', 'bei seinem Kommen', 'bei (شرط)'] },
            { cells: ['weil das Wetter schlecht ist', 'wegen des schlechten Wetters', 'wegen (سبب)'] },
            { cells: ['obwohl es regnet', 'trotz des Regens', 'trotz (تناقض)'] },
            { cells: ['nachdem ich gegessen habe', 'nach dem Essen', 'nach (وقت لاحق)'] },
            { cells: ['bevor wir abreisen', 'vor der Abreise', 'vor (وقت سابق)'] },
            { cells: ['indem er hilft', 'durch seine Hilfe', 'durch (وسيلة)'] },
            { cells: ['ohne zu helfen', 'ohne Hilfe', 'ohne (نفي)'] },
            { cells: ['dass er kommt', 'sein Kommen', 'الحالة Genitiv'] },
          ], theme: 'default', note: 'كل رابط في Verbalstil له حرف جر مقابل في Nominalstil.' },
          { title: 'Nominalisierung — تحويل الفعل إلى اسم', headers: ['الفعل', 'الاسم', 'الجنس'], rows: [
            { cells: ['kommen', 'das Kommen / die Ankunft', 'das/die'] },
            { cells: ['gehen', 'der Gang / das Gehen', 'der/das'] },
            { cells: ['fahren', 'die Fahrt', 'die'] },
            { cells: ['reisen', 'die Reise', 'die'] },
            { cells: ['lernen', 'das Lernen', 'das'] },
            { cells: ['lösen', 'die Lösung', 'die'] },
            { cells: ['untersuchen', 'die Untersuchung', 'die'] },
            { cells: ['entscheiden', 'die Entscheidung', 'die'] },
            { cells: ['entwickeln', 'die Entwicklung', 'die'] },
            { cells: ['steigen', 'der Anstieg', 'der'] },
            { cells: ['sinken', 'der Rückgang', 'der'] },
          ], theme: 'default', note: '-ung للأسماء المؤنّثة (die). كل فعل قابل للتحويل إلى das + Infinitiv (das Lernen).' },
        ],
        rules: [
          { rule: 'في الكتابة الأكاديمية والصحفية، استعمل Nominalstil — أكثف وأرسخ.', example: 'Bei Preisanstieg sinkt der Konsum. (= Wenn die Preise steigen, sinkt der Konsum.)', translation: 'بارتفاع الأسعار، ينخفض الاستهلاك.' },
          { rule: 'في الكلام والحوار، استعمل Verbalstil — أوضح وأطبيعي.', example: 'Weil es regnet, bleiben wir zu Hause. (= Wegen des Regens bleiben wir zu Hause.)', translation: 'لأنها تمطر، نبقى في البيت.' },
          { rule: 'بعد bei/durch/wegen/trotz/nach/vor/ohne، الاسم يأخذ الحالة المناسبة (Dativ أو Genitiv).', example: 'wegen des Wetters (Genitiv) / bei dem Treffen (Dativ)', translation: 'بسبب الجو / في الاجتماع.' },
          { rule: 'لا تبالغ في Nominalstil — جمل كثيرة بالأسماء قد تصبح غامضة. الأسلوب الجيد يخلط الاثنين.', example: 'Schlecht: Die Verbesserung der Qualität durch Optimierung der Prozesse... / Besser: Wir verbessern die Qualität, indem wir die Prozesse optimieren.', translation: 'الأسلوب المختلط أوضح.' },
        ],
        examples: [
          'Verbalstil: Wenn das Projekt abgeschlossen ist, feiern wir. — حين ينتهي المشروع، نحتفل.',
          'Nominalstil: Nach Abschluss des Projekts feiern wir.',
          'Verbalstil: Weil ich krank war, bin ich zu Hause geblieben. — لأنني كنت مريضاً، بقيت في البيت.',
          'Nominalstil: Wegen meiner Krankheit bin ich zu Hause geblieben.',
          'Verbalstil: Obwohl es regnete, gingen wir spazieren. — رغم أنها أمطرت، تنزّهنا.',
          'Nominalstil: Trotz des Regens gingen wir spazieren.',
          'Verbalstil: Bevor wir abreisen, packen wir die Koffer. — قبل أن نسافر، نحضّر الحقائب.',
          'Nominalstil: Vor der Abreise packen wir die Koffer.',
        ],
        tip: 'حدّد نصاً ألمانياً (مقالة، تقرير) وحوّل 5 جمل من Verbalstil إلى Nominalstil يومياً. خلال شهر تتقن الانتقال بين الأسلوبين — مهارة C1 الأساسية في امتحانات DSH/TestDaF.',
      },
      vocabulary: [
        { german: 'die Nominalisierung', arabic: 'الإسمنة', example: 'Die Nominalisierung ist häufig.', exampleArabic: 'الإسمنة شائعة.', type: 'noun', gender: 'die', plural: 'die Nominalisierungen' },
        { german: 'der Anstieg', arabic: 'الارتفاع', example: 'Ein starker Anstieg.', exampleArabic: 'ارتفاع قوي.', type: 'noun', gender: 'der', plural: 'die Anstiege' },
        { german: 'der Rückgang', arabic: 'الانخفاض', example: 'Der Rückgang ist klar.', exampleArabic: 'الانخفاض واضح.', type: 'noun', gender: 'der', plural: 'die Rückgänge' },
        { german: 'die Entwicklung', arabic: 'التطوّر', example: 'Eine positive Entwicklung.', exampleArabic: 'تطور إيجابي.', type: 'noun', gender: 'die', plural: 'die Entwicklungen' },
        { german: 'die Veränderung', arabic: 'التغيير', example: 'Eine wichtige Veränderung.', exampleArabic: 'تغيير مهم.', type: 'noun', gender: 'die', plural: 'die Veränderungen' },
        { german: 'die Verbesserung', arabic: 'التحسين', example: 'Eine deutliche Verbesserung.', exampleArabic: 'تحسين واضح.', type: 'noun', gender: 'die', plural: 'die Verbesserungen' },
        { german: 'die Optimierung', arabic: 'التحسين الأمثل', example: 'Die Optimierung der Prozesse.', exampleArabic: 'تحسين العمليات.', type: 'noun', gender: 'die', plural: 'die Optimierungen' },
        { german: 'die Untersuchung', arabic: 'التحقيق', example: 'Eine genaue Untersuchung.', exampleArabic: 'تحقيق دقيق.', type: 'noun', gender: 'die', plural: 'die Untersuchungen' },
        { german: 'die Auswertung', arabic: 'التقييم', example: 'Die Auswertung der Daten.', exampleArabic: 'تقييم البيانات.', type: 'noun', gender: 'die', plural: 'die Auswertungen' },
        { german: 'die Bewertung', arabic: 'التقدير', example: 'Eine objektive Bewertung.', exampleArabic: 'تقدير موضوعي.', type: 'noun', gender: 'die', plural: 'die Bewertungen' },
        { german: 'der Abschluss', arabic: 'الإنهاء', example: 'Nach Abschluss des Studiums.', exampleArabic: 'بعد إنهاء الدراسة.', type: 'noun', gender: 'der', plural: 'die Abschlüsse' },
        { german: 'die Abreise', arabic: 'المغادرة', example: 'Vor der Abreise.', exampleArabic: 'قبل المغادرة.', type: 'noun', gender: 'die', plural: 'die Abreisen' },
        { german: 'die Ankunft', arabic: 'الوصول', example: 'Bei der Ankunft.', exampleArabic: 'عند الوصول.', type: 'noun', gender: 'die', plural: 'die Ankünfte' },
        { german: 'die Durchführung', arabic: 'التنفيذ', example: 'Bei der Durchführung des Projekts.', exampleArabic: 'في تنفيذ المشروع.', type: 'noun', gender: 'die', plural: 'die Durchführungen' },
        { german: 'die Berücksichtigung', arabic: 'الأخذ بعين الاعتبار', example: 'Unter Berücksichtigung aller Faktoren.', exampleArabic: 'مع الأخذ بعين الاعتبار كل العوامل.', type: 'noun', gender: 'die' },
        { german: 'die Voraussetzung', arabic: 'الشرط المسبق', example: 'Die Voraussetzungen sind erfüllt.', exampleArabic: 'الشروط مستوفاة.', type: 'noun', gender: 'die', plural: 'die Voraussetzungen' },
        { german: 'die Konsequenz', arabic: 'العاقبة', example: 'Die Konsequenzen sind unvermeidbar.', exampleArabic: 'العواقب لا مفر منها.', type: 'noun', gender: 'die', plural: 'die Konsequenzen' },
        { german: 'unter', arabic: 'تحت / مع', example: 'Unter Berücksichtigung von...', exampleArabic: 'مع مراعاة...', type: 'preposition' },
        { german: 'aufgrund', arabic: 'بسبب', example: 'Aufgrund des Wetters.', exampleArabic: 'بسبب الجو.', type: 'preposition' },
        { german: 'mittels', arabic: 'بواسطة', example: 'Mittels einer Studie.', exampleArabic: 'بواسطة دراسة.', type: 'preposition' },
        { german: 'angesichts', arabic: 'في ضوء', example: 'Angesichts der Lage.', exampleArabic: 'في ضوء الوضع.', type: 'preposition' },
        { german: 'hinsichtlich', arabic: 'فيما يخص', example: 'Hinsichtlich des Themas.', exampleArabic: 'فيما يخص الموضوع.', type: 'preposition' },
        { german: 'bezüglich', arabic: 'بخصوص', example: 'Bezüglich Ihrer Anfrage.', exampleArabic: 'بخصوص طلبكم.', type: 'preposition' },
        { german: 'der Umstand', arabic: 'الظرف', example: 'Unter normalen Umständen.', exampleArabic: 'في ظروف عادية.', type: 'noun', gender: 'der', plural: 'die Umstände' },
        { german: 'das Ausmaß', arabic: 'النطاق / المدى', example: 'Das Ausmaß ist enorm.', exampleArabic: 'النطاق هائل.', type: 'noun', gender: 'das', plural: 'die Ausmaße' },
        { german: 'der Faktor', arabic: 'العامل', example: 'Ein wichtiger Faktor.', exampleArabic: 'عامل مهم.', type: 'noun', gender: 'der', plural: 'die Faktoren' },
        { german: 'die Tendenz', arabic: 'الاتجاه', example: 'Die Tendenz ist positiv.', exampleArabic: 'الاتجاه إيجابي.', type: 'noun', gender: 'die', plural: 'die Tendenzen' },
        { german: 'der Beleg', arabic: 'الدليل', example: 'Ein klarer Beleg dafür.', exampleArabic: 'دليل واضح على ذلك.', type: 'noun', gender: 'der', plural: 'die Belege' },
        { german: 'umfassend', arabic: 'شامل', example: 'Eine umfassende Analyse.', exampleArabic: 'تحليل شامل.', type: 'adjective' },
        { german: 'differenziert', arabic: 'متمايز', example: 'Eine differenzierte Sicht.', exampleArabic: 'رؤية متمايزة.', type: 'adjective' },
        { german: 'zusammenhängend', arabic: 'مترابط', example: 'Ein zusammenhängender Text.', exampleArabic: 'نص مترابط.', type: 'adjective' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'c1-14-q1', question: 'حوّل: "Wenn er kommt..." → "___ seinem Kommen..."', answer: 'Bei', hint: 'wenn → bei' },
          { type: 'multiple-choice', id: 'c1-14-q2', question: 'مقابل Nominalstil لـ "weil das Wetter schlecht ist":', options: ['trotz des Wetters', 'wegen des schlechten Wetters', 'bei dem Wetter', 'durch das Wetter'], answer: 'wegen des schlechten Wetters' },
          { type: 'fill-blank', id: 'c1-14-q3', question: 'Nominalstil: "obwohl es regnet" → "___ des Regens"', answer: 'trotz', hint: 'obwohl → trotz' },
          { type: 'multiple-choice', id: 'c1-14-q4', question: 'Verbalstil لـ "Vor der Abreise":', options: ['Wenn wir abreisen', 'Bevor wir abreisen', 'Nachdem wir abreisen', 'Während wir abreisen'], answer: 'Bevor wir abreisen' },
          { type: 'fill-blank', id: 'c1-14-q5', question: 'الفعل entwickeln كاسم: "die ___"', answer: 'Entwicklung', hint: 'entwickeln → Entwicklung' },
          { type: 'matching', id: 'c1-14-q6', question: 'اربط الرابط بحرف الجر المقابل:', pairs: [
            { left: 'wenn', right: 'bei' },
            { left: 'weil', right: 'wegen' },
            { left: 'obwohl', right: 'trotz' },
            { left: 'nachdem', right: 'nach' },
            { left: 'bevor', right: 'vor' },
            { left: 'indem', right: 'durch' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'c1-14-q7', question: 'رتّب (Nominalstil): "بسبب الجو السيء، نبقى"', words: ['Wegen', 'des', 'schlechten', 'Wetters', 'bleiben', 'wir'], answer: 'Wegen des schlechten Wetters bleiben wir' },
          { type: 'speaking', id: 'c1-14-q8', question: 'حوّل إلى Nominalstil: "Wenn das Projekt abgeschlossen ist, feiern wir."', answer: 'Nach Abschluss des Projekts feiern wir' },
          { type: 'fill-blank', id: 'c1-14-q9', question: 'استمع: "___ Berücksichtigung aller Faktoren..."', audioPrompt: 'Unter Berücksichtigung aller Faktoren analysieren wir.', answer: 'Unter', hint: 'unter Berücksichtigung = مع مراعاة' },
          { type: 'multiple-choice', id: 'c1-14-q10', question: 'Nominalstil يستعمل بشكل أساسي في:', options: ['الكلام اليومي', 'الكتابة الأكاديمية والصحفية', 'الرسائل الشخصية', 'التواصل العائلي'], answer: 'الكتابة الأكاديمية والصحفية' },
          { type: 'fill-blank', id: 'c1-14-q11', question: 'حوّل: "indem er hilft" → "___ seine Hilfe"', answer: 'durch', hint: 'indem → durch' },
          { type: 'multiple-choice', id: 'c1-14-q12', question: 'Verbalstil لـ "wegen des Wetters":', options: ['wenn das Wetter', 'weil das Wetter', 'obwohl das Wetter', 'während das Wetter'], answer: 'weil das Wetter' },
          { type: 'fill-blank', id: 'c1-14-q13', question: 'اسم لـ untersuchen: "die ___"', answer: 'Untersuchung', hint: '-ung' },
          { type: 'matching', id: 'c1-14-q14', question: 'اربط حرف الجر الأكاديمي بمعناه:', pairs: [
            { left: 'aufgrund', right: 'بسبب' },
            { left: 'mittels', right: 'بواسطة' },
            { left: 'angesichts', right: 'في ضوء' },
            { left: 'hinsichtlich', right: 'فيما يخص' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'c1-14-q15', question: 'رتّب (Nominalstil): "بعد إنهاء المشروع نحتفل"', words: ['Nach', 'Abschluss', 'des', 'Projekts', 'feiern', 'wir'], answer: 'Nach Abschluss des Projekts feiern wir' },
          { type: 'fill-blank', id: 'c1-14-q16', question: 'استمع: "___ Berücksichtigung aller Faktoren..." (تحت/مع)', audioPrompt: 'Unter Berücksichtigung aller Faktoren analysieren wir.', answer: 'Unter', hint: 'unter Berücksichtigung' },
          { type: 'multiple-choice', id: 'c1-14-q17', question: 'الكتابة المثالية في C1:', options: ['Verbalstil فقط', 'Nominalstil فقط', 'مزيج يلائم السياق', 'بدون فاصلة'], answer: 'مزيج يلائم السياق' },
          { type: 'speaking', id: 'c1-14-q18', question: 'حوّل إلى Nominalstil: "Bevor wir abreisen, packen wir."', answer: 'Vor der Abreise packen wir' },
          { type: 'fill-blank', id: 'c1-14-q19', question: 'اسم من entwickeln: "die ___"', answer: 'Entwicklung', hint: '-ung' },
          { type: 'multiple-choice', id: 'c1-14-q20', question: 'الجملة الأكثر أكاديمية:', options: ['Wegen schlechtem Wetter blieben wir.', 'Wegen des schlechten Wetters blieben wir zu Hause.', 'Weil schlecht Wetter, bleiben wir.', 'Es ist schlecht Wetter, also bleiben wir.'], answer: 'Wegen des schlechten Wetters blieben wir zu Hause.' },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 15 — Kommasetzung (علامات الترقيم)
    // ─────────────────────────────────────────────
    {
      id: 'c1-15',
      title: 'علامات الترقيم — Kommasetzung',
      order: 15,
      grammar: {
        title: 'متى تضع فاصلة في الألمانية — قواعد الجمل الفرعية والقوائم والإضافات',
        content: `Kommasetzung (وضع الفاصلة) في الألمانية **منهجي وصارم** — ليس "حسب الذوق". في امتحان C1 الكتابي، الفواصل الخاطئة تخصم 0.5–1 نقطة لكل خطأ. تعلّم القواعد جيداً.\n\n**القواعد الست الذهبية:**\n1. **بين Hauptsatz و Nebensatz** — دائماً.\n2. **بين عناصر القائمة** — مع آخر "und" بدون فاصلة.\n3. **قبل aber/sondern** — دائماً.\n4. **حول الإضافات (Apposition)** — قبلها وبعدها.\n5. **حول Infinitivkonstruktion مع zu** — في الحالات المركّبة.\n6. **بين Hauptsatz + Hauptsatz** بدون رابط — اختياري.`,
        tables: [
          { title: 'القواعد الإلزامية للفاصلة', headers: ['الحالة', 'مثال', 'القاعدة'], rows: [
            { cells: ['Nebensatz', 'Ich weiß, dass du kommst.', 'دائماً قبل dass/weil/wenn/...'] },
            { cells: ['قائمة', 'Ich kaufe Brot, Milch und Käse.', 'لا فاصلة قبل آخر und'] },
            { cells: ['aber/sondern', 'Er kommt, aber spät.', 'دائماً قبل aber/sondern'] },
            { cells: ['Apposition', 'Mein Bruder, der Arzt, kommt.', 'حول الإضافة المعرّفة'] },
            { cells: ['Infinitiv mit zu', 'Ich versuche, das zu lernen.', 'بعد فعل مع zu-Inf مركّب'] },
            { cells: ['Anrede', 'Hallo, Maria, wie geht\'s?', 'حول النداء'] },
          ], theme: 'default', note: 'هذه القواعد إلزامية في الكتابة الرسمية وامتحانات C1.' },
          { title: 'الحالات الاختيارية', headers: ['الحالة', 'بدون فاصلة', 'مع فاصلة'], rows: [
            { cells: ['HS + und + HS', 'Ich gehe und du bleibst.', 'Ich gehe, und du bleibst.'] },
            { cells: ['Infinitiv بسيط', 'Er versucht zu lernen.', 'Er versucht, zu lernen.'] },
            { cells: ['Adverb في البداية', 'Heute komme ich nicht.', '(لا فاصلة عادة)'] },
          ], theme: 'default', note: 'في الحالات الاختيارية، اختر الفاصلة لتوضيح المعنى.' },
          { title: 'الأخطاء الشائعة لتجنّبها', headers: ['خطأ', 'صواب', 'السبب'], rows: [
            { cells: ['Ich denke, dass, er kommt.', 'Ich denke, dass er kommt.', 'لا فاصلة بين dass والفاعل'] },
            { cells: ['Brot, und Milch.', 'Brot und Milch.', 'لا فاصلة قبل und في القائمة'] },
            { cells: ['Er ist krank, aber, kommt.', 'Er ist krank, aber kommt.', 'لا فاصلة بعد aber'] },
            { cells: ['Nach dem Essen, gehen wir.', 'Nach dem Essen gehen wir.', 'لا فاصلة بعد ظرف الزمان'] },
          ], theme: 'default', note: 'القاعدة: الفاصلة بين الجمل، لا داخل الجملة الواحدة.' },
        ],
        rules: [
          { rule: 'بين Hauptsatz و Nebensatz: فاصلة دائماً.', example: 'Ich weiß, dass es schwer ist.', translation: 'أعلم أن الأمر صعب.' },
          { rule: 'في القائمة، لا فاصلة قبل آخر und/oder.', example: 'Brot, Milch und Käse.', translation: 'خبز وحليب وجبن.' },
          { rule: 'قبل aber/sondern، فاصلة دائماً.', example: 'Er ist klug, aber faul.', translation: 'هو ذكي، لكنه كسول.' },
          { rule: 'حول الإضافة (Apposition) المعرّفة، فاصلتان.', example: 'Mein Vater, ein Lehrer, lebt in Casablanca.', translation: 'أبي، وهو معلم، يعيش في الدار البيضاء.' },
        ],
        examples: [
          'Ich glaube, dass du recht hast. — أعتقد أنك على حق.',
          'Wir kaufen Brot, Milch, Käse und Butter. — نشتري خبزاً وحليباً وجبناً وزبدة.',
          'Er ist freundlich, aber sehr beschäftigt. — هو ودود لكنه مشغول جداً.',
          'Mein Onkel, der in Berlin wohnt, kommt morgen. — عمي الذي يسكن في برلين، يأتي غداً.',
          'Ich versuche, das Problem zu lösen. — أحاول حل المشكلة.',
          'Hallo, Maria, wie geht\'s? — مرحباً يا ماريا، كيف الحال؟',
          'Obwohl es regnet, gehen wir spazieren. — رغم أنها تمطر، نتنزّه.',
          'Wenn du Zeit hast, ruf mich an. — حين يكون لديك وقت، اتصل بي.',
        ],
        tip: 'اكتب 5 جمل يومياً وحدّد فيها الفواصل الإلزامية. مع التدرّب، تصبح القواعد تلقائية. في الامتحان، راجع كتابتك مرتين لرصد الفواصل المنسية.',
      },
      vocabulary: [
        { german: 'das Komma', arabic: 'الفاصلة', example: 'Das Komma fehlt.', exampleArabic: 'الفاصلة ناقصة.', type: 'noun', gender: 'das', plural: 'die Kommas' },
        { german: 'der Punkt', arabic: 'النقطة', example: 'Setze einen Punkt.', exampleArabic: 'ضع نقطة.', type: 'noun', gender: 'der', plural: 'die Punkte' },
        { german: 'der Strichpunkt', arabic: 'الفاصلة المنقوطة', example: 'Hier brauchen wir einen Strichpunkt.', exampleArabic: 'هنا نحتاج فاصلة منقوطة.', type: 'noun', gender: 'der' },
        { german: 'der Doppelpunkt', arabic: 'النقطتان', example: 'Nach dem Doppelpunkt.', exampleArabic: 'بعد النقطتين.', type: 'noun', gender: 'der' },
        { german: 'das Anführungszeichen', arabic: 'علامة الاقتباس', example: 'Anführungszeichen oben und unten.', exampleArabic: 'علامة الاقتباس فوق وتحت.', type: 'noun', gender: 'das', plural: 'die Anführungszeichen' },
        { german: 'der Bindestrich', arabic: 'الواصلة', example: 'Wir benutzen einen Bindestrich.', exampleArabic: 'نستعمل واصلة.', type: 'noun', gender: 'der', plural: 'die Bindestriche' },
        { german: 'das Ausrufezeichen', arabic: 'علامة التعجّب', example: 'Mit Ausrufezeichen!', exampleArabic: 'بعلامة تعجّب!', type: 'noun', gender: 'das' },
        { german: 'das Fragezeichen', arabic: 'علامة الاستفهام', example: 'Vergiss das Fragezeichen nicht.', exampleArabic: 'لا تنسَ علامة الاستفهام.', type: 'noun', gender: 'das' },
        { german: 'die Klammer', arabic: 'القوس', example: 'In Klammern stehen Erklärungen.', exampleArabic: 'في القوسين توضع الشروح.', type: 'noun', gender: 'die', plural: 'die Klammern' },
        { german: 'der Hauptsatz', arabic: 'الجملة الرئيسية', example: 'Ein Hauptsatz hat Subjekt und Verb.', exampleArabic: 'الجملة الرئيسية فيها فاعل وفعل.', type: 'noun', gender: 'der', plural: 'die Hauptsätze' },
        { german: 'der Nebensatz', arabic: 'الجملة الفرعية', example: 'Nebensätze beginnen mit dass, weil, wenn.', exampleArabic: 'الجمل الفرعية تبدأ بـ dass، weil، wenn.', type: 'noun', gender: 'der', plural: 'die Nebensätze' },
        { german: 'die Apposition', arabic: 'الإضافة الإيضاحية', example: 'Mein Bruder, der Arzt — Apposition.', exampleArabic: 'أخي الطبيب — إضافة إيضاحية.', type: 'noun', gender: 'die', plural: 'die Appositionen' },
        { german: 'die Aufzählung', arabic: 'القائمة', example: 'In einer Aufzählung trennen Kommas.', exampleArabic: 'في القائمة تفصل الفواصل.', type: 'noun', gender: 'die', plural: 'die Aufzählungen' },
        { german: 'die Anrede', arabic: 'النداء', example: 'Hallo, Maria — Anrede.', exampleArabic: 'مرحباً ماريا — نداء.', type: 'noun', gender: 'die', plural: 'die Anreden' },
        { german: 'der Einschub', arabic: 'الجملة المعترضة', example: 'Ein Einschub wird mit Kommas getrennt.', exampleArabic: 'الجملة المعترضة تُفصل بالفواصل.', type: 'noun', gender: 'der', plural: 'die Einschübe' },
        { german: 'die Konjunktion', arabic: 'حرف الربط', example: 'aber ist eine Konjunktion.', exampleArabic: 'aber حرف ربط.', type: 'noun', gender: 'die', plural: 'die Konjunktionen' },
        { german: 'die Zeichensetzung', arabic: 'علامات الترقيم', example: 'Die Zeichensetzung ist wichtig.', exampleArabic: 'علامات الترقيم مهمة.', type: 'noun', gender: 'die' },
        { german: 'die Rechtschreibung', arabic: 'الإملاء', example: 'Achten Sie auf die Rechtschreibung.', exampleArabic: 'انتبه إلى الإملاء.', type: 'noun', gender: 'die' },
        { german: 'die Grammatik', arabic: 'القواعد', example: 'Deutsche Grammatik ist logisch.', exampleArabic: 'القواعد الألمانية منطقية.', type: 'noun', gender: 'die' },
        { german: 'der Satzbau', arabic: 'بناء الجملة', example: 'Der Satzbau ist klar.', exampleArabic: 'بناء الجملة واضح.', type: 'noun', gender: 'der' },
        { german: 'die Regel', arabic: 'القاعدة', example: 'Eine wichtige Regel.', exampleArabic: 'قاعدة مهمة.', type: 'noun', gender: 'die', plural: 'die Regeln' },
        { german: 'die Ausnahme', arabic: 'الاستثناء', example: 'Eine Ausnahme von der Regel.', exampleArabic: 'استثناء من القاعدة.', type: 'noun', gender: 'die', plural: 'die Ausnahmen' },
        { german: 'der Fehler', arabic: 'الخطأ', example: 'Ein häufiger Fehler.', exampleArabic: 'خطأ شائع.', type: 'noun', gender: 'der', plural: 'die Fehler' },
        { german: 'die Korrektur', arabic: 'التصحيح', example: 'Eine wichtige Korrektur.', exampleArabic: 'تصحيح مهم.', type: 'noun', gender: 'die', plural: 'die Korrekturen' },
        { german: 'trennen', arabic: 'يفصل', example: 'Kommas trennen Satzteile.', exampleArabic: 'الفواصل تفصل أجزاء الجملة.', type: 'verb' },
        { german: 'verbinden', arabic: 'يربط', example: 'und verbindet zwei Sätze.', exampleArabic: 'und تربط جملتين.', type: 'verb' },
        { german: 'beginnen', arabic: 'يبدأ', example: 'Der Satz beginnt mit einem Großbuchstaben.', exampleArabic: 'الجملة تبدأ بحرف كبير.', type: 'verb' },
        { german: 'beenden', arabic: 'ينهي', example: 'Beende den Satz mit einem Punkt.', exampleArabic: 'أنهِ الجملة بنقطة.', type: 'verb' },
        { german: 'verbessern', arabic: 'يصحّح', example: 'Verbessere deinen Text.', exampleArabic: 'صحّح نصّك.', type: 'verb' },
        { german: 'überprüfen', arabic: 'يتفحّص', example: 'Überprüfe die Zeichensetzung.', exampleArabic: 'تفحّص الترقيم.', type: 'verb' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'c1-15-q1', question: 'فاصلة قبل dass؟ "Ich weiß ___ er kommt."', answer: ',', hint: 'دائماً قبل Nebensatz' },
          { type: 'multiple-choice', id: 'c1-15-q2', question: 'القائمة الصحيحة:', options: ['Brot, Milch, und Käse', 'Brot Milch und Käse', 'Brot, Milch und Käse', 'Brot, Milch, Käse, und Butter,'], answer: 'Brot, Milch und Käse' },
          { type: 'fill-blank', id: 'c1-15-q3', question: 'فاصلة قبل aber؟ "Er ist klug ___ faul."', answer: ', aber', hint: 'aber دائماً مع فاصلة' },
          { type: 'multiple-choice', id: 'c1-15-q4', question: 'Apposition صحيحة:', options: ['Mein Bruder der Arzt kommt.', 'Mein Bruder, der Arzt, kommt.', 'Mein Bruder, der Arzt kommt.', 'Mein Bruder der Arzt, kommt.'], answer: 'Mein Bruder, der Arzt, kommt.' },
          { type: 'fill-blank', id: 'c1-15-q5', question: 'النداء: "Hallo ___ Maria ___ wie geht\'s?"', answer: ', ,', hint: 'فاصلتان حول الاسم' },
          { type: 'matching', id: 'c1-15-q6', question: 'اربط القاعدة بمثالها:', pairs: [
            { left: 'Nebensatz', right: 'فاصلة دائماً' },
            { left: 'Aufzählung', right: 'بدون فاصلة قبل آخر und' },
            { left: 'aber/sondern', right: 'فاصلة دائماً' },
            { left: 'Apposition', right: 'فاصلتان حولها' },
            { left: 'Anrede', right: 'فاصلتان حولها' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'c1-15-q7', question: 'رتّب جملة صحيحة الفواصل: "أعتقد أنك على حق"', words: ['Ich', 'glaube,', 'dass', 'du', 'recht', 'hast'], answer: 'Ich glaube, dass du recht hast' },
          { type: 'speaking', id: 'c1-15-q8', question: 'قل مع فواصل: "أبي، وهو معلم، يعيش في الدار البيضاء"', answer: 'Mein Vater, ein Lehrer, lebt in Casablanca' },
          { type: 'fill-blank', id: 'c1-15-q9', question: 'استمع: "Wir kaufen Brot ___ Milch ___ Käse." (مع علامات الترقيم)', audioPrompt: 'Wir kaufen Brot, Milch und Käse.', answer: ', ,', hint: 'فاصلة بعد الأولين، ثم und' },
          { type: 'multiple-choice', id: 'c1-15-q10', question: 'الخطأ الشائع:', options: ['فاصلة بين dass والفاعل', 'فاصلة قبل aber', 'فاصلة قبل dass', 'فواصل حول Apposition'], answer: 'فاصلة بين dass والفاعل' },
          { type: 'fill-blank', id: 'c1-15-q11', question: 'فاصلة قبل sondern؟ "Er ist nicht traurig ___ glücklich."', answer: ', sondern', hint: 'sondern مثل aber' },
          { type: 'multiple-choice', id: 'c1-15-q12', question: 'فاصلة بعد ظرف الزمان في البداية؟', options: ['دائماً', 'لا، عادة', 'فقط مع heute', 'إجباري في الصحافة'], answer: 'لا، عادة' },
          { type: 'fill-blank', id: 'c1-15-q13', question: 'Apposition: "Mein Bruder ___ der Lehrer ___ kommt morgen."', answer: ', ,', hint: 'فاصلتان حول Apposition' },
          { type: 'matching', id: 'c1-15-q14', question: 'اربط القاعدة بمثالها:', pairs: [
            { left: 'قبل aber/sondern', right: 'فاصلة دائماً' },
            { left: 'في القائمة قبل und', right: 'بدون فاصلة' },
            { left: 'حول Anrede', right: 'فاصلتان' },
            { left: 'بعد ظرف زمان', right: 'بدون فاصلة' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'c1-15-q15', question: 'صحّح (مع فواصل صحيحة): "Ich glaube dass du recht hast"', words: ['Ich', 'glaube,', 'dass', 'du', 'recht', 'hast'], answer: 'Ich glaube, dass du recht hast' },
          { type: 'fill-blank', id: 'c1-15-q16', question: 'استمع: "Er ist klug ___ sehr beschäftigt."', audioPrompt: 'Er ist klug, aber sehr beschäftigt.', answer: ', aber', hint: 'aber دائماً مع فاصلة' },
          { type: 'multiple-choice', id: 'c1-15-q17', question: 'في امتحان C1، خطأ في الفاصلة يخصم:', options: ['لا شيء', '0.5-1 نقطة', 'الموضوع كاملاً', 'يعفو القارئ'], answer: '0.5-1 نقطة' },
          { type: 'speaking', id: 'c1-15-q18', question: 'قل مع فواصل: "نشتري خبزاً وحليباً وجبناً وزبدة"', answer: 'Wir kaufen Brot, Milch, Käse und Butter' },
          { type: 'fill-blank', id: 'c1-15-q19', question: '"Ich versuche ___ das zu lernen." (Inf مركّب مع zu)', answer: ',', hint: 'فاصلة قبل zu-Inf مركّب' },
          { type: 'multiple-choice', id: 'c1-15-q20', question: 'في القائمة "Brot, Milch und Käse" نلاحظ:', options: ['فاصلة قبل und', 'لا فاصلة قبل und', 'فاصلتان قبل und', 'فواصل بين كل العناصر'], answer: 'لا فاصلة قبل und' },
        ],
      },
    },
    // ─────────────────────────────────────────────
    // LESSON 16 — Hypotaxe vs Parataxe
    // ─────────────────────────────────────────────
    {
      id: 'c1-16',
      title: 'الجمل المركّبة المعقّدة — Hypotaxe vs Parataxe',
      order: 16,
      grammar: {
        title: 'بناء جمل متعدّدة المستويات + التحكّم في تعقيد الأسلوب',
        content: `**Parataxe** = جمل مرصوفة (Hauptsatz + Hauptsatz) — بسيطة، واضحة، شائعة في الكلام.\n→ Es regnet. Wir bleiben zu Hause. Wir lesen Bücher.\n\n**Hypotaxe** = جمل متداخلة (Hauptsatz مع عدّة Nebensätze) — معقّدة، غنية، شائعة في الأدب والكتابة الأكاديمية.\n→ Da es regnet, bleiben wir, weil wir nicht nass werden wollen, zu Hause, wo wir Bücher lesen können, die wir lange aufgeschoben haben.\n\nC1 يتطلّب **التحكّم في كلا الأسلوبين**. الكاتب الجيد يخلط بينهما حسب الحاجة — Hypotaxe للمحاجّة العميقة، Parataxe للتأكيد والوضوح.`,
        tables: [
          { title: 'الفرق العملي بين Parataxe و Hypotaxe', headers: ['الجانب', 'Parataxe', 'Hypotaxe'], rows: [
            { cells: ['البنية', 'جمل قصيرة منفصلة', 'جملة طويلة بفروع'] },
            { cells: ['السهولة', 'سهلة القراءة', 'تتطلب تركيزاً'] },
            { cells: ['الاستعمال', 'الكلام، التقارير الصحفية', 'الأدب، البحث الأكاديمي'] },
            { cells: ['الإيقاع', 'سريع، حازم', 'بطيء، تأملي'] },
            { cells: ['التأثير', 'وضوح وقوة', 'دقة وعمق'] },
          ], theme: 'default', note: 'الكتابة الناجحة في C1 تخلط بينهما لتجنّب الملل.' },
          { title: 'بنية Hypotaxe — المستويات المتداخلة', headers: ['المستوى', 'العنصر', 'مثال'], rows: [
            { cells: ['1', 'Hauptsatz (الأساسي)', 'Wir bleiben zu Hause'] },
            { cells: ['2', 'Nebensatz 1 (سبب)', 'weil es regnet'] },
            { cells: ['3', 'Nebensatz 2 (نتيجة)', 'sodass wir lesen können'] },
            { cells: ['4', 'Relativsatz (وصف)', 'die Bücher, die alt sind'] },
            { cells: ['5', 'Infinitivsatz (هدف)', 'um die Zeit zu nutzen'] },
          ], theme: 'default', note: 'لا تتجاوز 3-4 مستويات في الجملة الواحدة — وإلا تصبح غامضة.' },
          { title: 'تحويل بين الأسلوبين', headers: ['Parataxe', 'Hypotaxe', 'الأداة'], rows: [
            { cells: ['Es regnet. Wir bleiben.', 'Da es regnet, bleiben wir.', 'da/weil'] },
            { cells: ['Er ist krank. Er kommt nicht.', 'Da er krank ist, kommt er nicht.', 'da'] },
            { cells: ['Sie liest viel. Sie schreibt gut.', 'Weil sie viel liest, schreibt sie gut.', 'weil'] },
            { cells: ['Es ist kalt. Wir frieren.', 'Es ist so kalt, dass wir frieren.', 'so...dass'] },
          ], theme: 'default', note: 'استعمل الـ Konnektoren التي تعلّمتها في B2 (Lektion 17).' },
        ],
        rules: [
          { rule: 'في الكتابة الأكاديمية، استعمل Hypotaxe للأفكار المتشعّبة. لا تتجاوز 4 مستويات.', example: 'Da das Klima sich verändert, was zu Problemen führt, die wir lösen müssen, brauchen wir Maßnahmen.', translation: 'بما أن المناخ يتغيّر، مما يؤدي إلى مشاكل علينا حلّها، نحتاج تدابير.' },
          { rule: 'في الخطابة وكتابة الرأي، استعمل Parataxe للقوة والإيقاع.', example: 'Wir können. Wir wollen. Wir werden.', translation: 'نستطيع. نريد. سنفعل.' },
          { rule: 'اخلط بين الأسلوبين — جملة طويلة Hypotaxe تليها جملتان قصيرتان Parataxe = إيقاع أدبي.', example: 'Obwohl es schwer war, haben wir es geschafft. Es war hart. Aber wir sind hier.', translation: 'رغم صعوبته، أنجزناه. كان قاسياً. لكننا هنا.' },
          { rule: 'تجنّب الجمل الطويلة (5+ مستويات) — تصبح غير قابلة للقراءة.', example: 'Die Tatsache, dass die Studie, die wir gestern gelesen haben, in der die Daten, die seit Jahren gesammelt wurden, analysiert werden... → غامض.', translation: 'الحقيقة التي قرأناها أمس... → استبدلها بجملتين أو ثلاث.' },
        ],
        examples: [
          'Parataxe: Es regnet. Wir bleiben zu Hause. Wir lesen Bücher. — تمطر. نبقى في البيت. نقرأ كتباً.',
          'Hypotaxe: Da es regnet, bleiben wir zu Hause, wo wir Bücher lesen, die wir lange aufgeschoben haben.',
          'Parataxe: Er kam. Er sah. Er siegte. — أتى. رأى. انتصر.',
          'Hypotaxe: Obwohl er müde war, hat er, nachdem er den ganzen Tag gearbeitet hatte, noch geholfen.',
          'مختلط: Wir hatten ein Problem. Da wir keine Zeit hatten, mussten wir improvisieren. Es funktionierte.',
          'علمي: Die Untersuchung, die im Jahr 2024 durchgeführt wurde, zeigt, dass die Inflation steigt, was sich auf die Wirtschaft auswirkt.',
          'أدبي: Sie ging. Langsam. Bedacht. Als ob die Welt vor ihr lag.',
        ],
        tip: 'كتابة C1: ابدأ بأفكارك على شكل Parataxe (جمل بسيطة)، ثم اربط بين الجمل المتقاربة بـ Hypotaxe لخلق تنوّع. لا تكتب فقرة كاملة من جمل طويلة — تصبح ثقيلة.',
      },
      vocabulary: [
        { german: 'die Hypotaxe', arabic: 'التراكب الجملي', example: 'Hypotaxe ist komplex.', exampleArabic: 'التراكب معقّد.', type: 'noun', gender: 'die' },
        { german: 'die Parataxe', arabic: 'الترصيف الجملي', example: 'Parataxe ist klar.', exampleArabic: 'الترصيف واضح.', type: 'noun', gender: 'die' },
        { german: 'der Hauptsatz', arabic: 'الجملة الرئيسية', example: 'Jeder Text braucht Hauptsätze.', exampleArabic: 'كل نص يحتاج جملاً رئيسية.', type: 'noun', gender: 'der', plural: 'die Hauptsätze' },
        { german: 'der Nebensatz', arabic: 'الجملة الفرعية', example: 'Nebensätze geben Details.', exampleArabic: 'الجمل الفرعية تعطي تفاصيل.', type: 'noun', gender: 'der', plural: 'die Nebensätze' },
        { german: 'der Relativsatz', arabic: 'الجملة الموصولة', example: 'Ein Relativsatz beschreibt ein Nomen.', exampleArabic: 'الجملة الموصولة تصف اسماً.', type: 'noun', gender: 'der', plural: 'die Relativsätze' },
        { german: 'der Infinitivsatz', arabic: 'جملة المصدر', example: 'Infinitivsätze sind elegant.', exampleArabic: 'جمل المصدر أنيقة.', type: 'noun', gender: 'der', plural: 'die Infinitivsätze' },
        { german: 'die Verschachtelung', arabic: 'التداخل', example: 'Zu viele Verschachtelungen sind schwer zu verstehen.', exampleArabic: 'كثرة التداخلات صعبة الفهم.', type: 'noun', gender: 'die', plural: 'die Verschachtelungen' },
        { german: 'die Komplexität', arabic: 'التعقيد', example: 'Die Komplexität wächst.', exampleArabic: 'التعقيد يتزايد.', type: 'noun', gender: 'die' },
        { german: 'die Klarheit', arabic: 'الوضوح', example: 'Klarheit ist wichtig.', exampleArabic: 'الوضوح مهم.', type: 'noun', gender: 'die' },
        { german: 'die Eleganz', arabic: 'الأناقة', example: 'Sprachliche Eleganz.', exampleArabic: 'أناقة لغوية.', type: 'noun', gender: 'die' },
        { german: 'der Stil', arabic: 'الأسلوب', example: 'Sein Stil ist akademisch.', exampleArabic: 'أسلوبه أكاديمي.', type: 'noun', gender: 'der', plural: 'die Stile' },
        { german: 'der Rhythmus', arabic: 'الإيقاع', example: 'Der Rhythmus des Textes.', exampleArabic: 'إيقاع النص.', type: 'noun', gender: 'der' },
        { german: 'die Struktur', arabic: 'البنية', example: 'Eine logische Struktur.', exampleArabic: 'بنية منطقية.', type: 'noun', gender: 'die', plural: 'die Strukturen' },
        { german: 'die Argumentation', arabic: 'الحجاج', example: 'Eine überzeugende Argumentation.', exampleArabic: 'حجاج مقنع.', type: 'noun', gender: 'die', plural: 'die Argumentationen' },
        { german: 'der Gedankengang', arabic: 'سير الأفكار', example: 'Sein Gedankengang ist klar.', exampleArabic: 'سير أفكاره واضح.', type: 'noun', gender: 'der', plural: 'die Gedankengänge' },
        { german: 'die Verknüpfung', arabic: 'الربط', example: 'Die Verknüpfung der Sätze.', exampleArabic: 'ربط الجمل.', type: 'noun', gender: 'die', plural: 'die Verknüpfungen' },
        { german: 'die Verflechtung', arabic: 'التشابك', example: 'Eine komplexe Verflechtung.', exampleArabic: 'تشابك معقّد.', type: 'noun', gender: 'die', plural: 'die Verflechtungen' },
        { german: 'sich verzweigen', arabic: 'يتفرّع', example: 'Der Satz verzweigt sich.', exampleArabic: 'الجملة تتفرّع.', type: 'verb' },
        { german: 'sich entfalten', arabic: 'يتفتّح', example: 'Der Gedanke entfaltet sich.', exampleArabic: 'الفكرة تتفتّح.', type: 'verb' },
        { german: 'gliedern', arabic: 'يُقسّم', example: 'Gliedere deinen Text.', exampleArabic: 'قسّم نصّك.', type: 'verb' },
        { german: 'untergliedern', arabic: 'يُجزّئ فرعياً', example: 'Untergliedere die Argumente.', exampleArabic: 'جزّئ الحجج فرعياً.', type: 'verb' },
        { german: 'durchdacht', arabic: 'مدروس', example: 'Eine durchdachte Argumentation.', exampleArabic: 'حجاج مدروس.', type: 'adjective' },
        { german: 'kohärent', arabic: 'متماسك', example: 'Ein kohärenter Text.', exampleArabic: 'نص متماسك.', type: 'adjective' },
        { german: 'stringent', arabic: 'صارم', example: 'Stringente Logik.', exampleArabic: 'منطق صارم.', type: 'adjective' },
        { german: 'verwoben', arabic: 'منسوج', example: 'Eng verwoben.', exampleArabic: 'منسوج بإحكام.', type: 'adjective' },
        { german: 'gewunden', arabic: 'متعرّج', example: 'Ein gewundener Stil.', exampleArabic: 'أسلوب متعرّج.', type: 'adjective' },
        { german: 'prägnant', arabic: 'موجز ودقيق', example: 'Prägnante Formulierung.', exampleArabic: 'صياغة موجزة دقيقة.', type: 'adjective' },
        { german: 'die Aussagekraft', arabic: 'القوة التعبيرية', example: 'Hohe Aussagekraft.', exampleArabic: 'قوة تعبيرية عالية.', type: 'noun', gender: 'die' },
        { german: 'beibehalten', arabic: 'يحافظ على', example: 'Den Stil beibehalten.', exampleArabic: 'الحفاظ على الأسلوب.', type: 'verb' },
        { german: 'wechseln', arabic: 'يبدّل', example: 'Zwischen Stilen wechseln.', exampleArabic: 'التبديل بين الأساليب.', type: 'verb' },
      ],
      exercise: {
        questions: [
          { type: 'fill-blank', id: 'c1-16-q1', question: '___ هي جمل مرصوفة (= Hauptsatz + Hauptsatz)', answer: 'Parataxe', hint: 'parataxe = الترصيف' },
          { type: 'multiple-choice', id: 'c1-16-q2', question: 'الجمل المتداخلة (HS + كذا NS) تسمّى:', options: ['Parataxe', 'Hypotaxe', 'Apposition', 'Konjunktion'], answer: 'Hypotaxe' },
          { type: 'fill-blank', id: 'c1-16-q3', question: 'حوّل إلى Hypotaxe: "Es regnet. Wir bleiben." → "___ es regnet, bleiben wir."', answer: 'Da', hint: 'da = weil' },
          { type: 'multiple-choice', id: 'c1-16-q4', question: 'أي أسلوب أنسب للأدب؟', options: ['Parataxe فقط', 'Hypotaxe فقط', 'مزيج بين الاثنين', 'Telegramme'], answer: 'مزيج بين الاثنين' },
          { type: 'fill-blank', id: 'c1-16-q5', question: 'لا تتجاوز ___ مستويات في الجملة المعقّدة.', answer: '4', hint: '4 مستويات حد أعلى' },
          { type: 'matching', id: 'c1-16-q6', question: 'اربط الأسلوب باستعماله:', pairs: [
            { left: 'Parataxe', right: 'كلام / تقارير صحفية' },
            { left: 'Hypotaxe', right: 'أدب / بحث أكاديمي' },
            { left: 'Mischstil', right: 'كتابة C1 الجيدة' },
            { left: 'Verschachtelung', right: 'يجب الحدّ منها' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'c1-16-q7', question: 'كوّن Hypotaxe: "بما أن الجو بارد، نشرب شاياً ساخناً"', words: ['Da', 'es', 'kalt', 'ist,', 'trinken', 'wir', 'heißen', 'Tee'], answer: 'Da es kalt ist, trinken wir heißen Tee' },
          { type: 'speaking', id: 'c1-16-q8', question: 'حوّل إلى Parataxe بإيقاع: "Er kam. Er sah. Er siegte"', answer: 'Er kam. Er sah. Er siegte' },
          { type: 'fill-blank', id: 'c1-16-q9', question: 'استمع: "Obwohl es schwer war, ___ wir es geschafft."', audioPrompt: 'Obwohl es schwer war, haben wir es geschafft.', answer: 'haben', hint: 'Hauptsatz: حركة الفعل' },
          { type: 'multiple-choice', id: 'c1-16-q10', question: 'الكتابة المثالية في C1:', options: ['Parataxe فقط', 'Hypotaxe فقط', 'مزيج للحفاظ على الإيقاع', 'جمل قصيرة فقط'], answer: 'مزيج للحفاظ على الإيقاع' },
          { type: 'fill-blank', id: 'c1-16-q11', question: 'حوّل Parataxe إلى Hypotaxe: "Es ist kalt. Wir frieren." → "___ es kalt ist, frieren wir."', answer: 'Da', hint: 'da/weil' },
          { type: 'multiple-choice', id: 'c1-16-q12', question: 'الجمل الطويلة جداً (5+ مستويات):', options: ['أفضل في الأكاديمية', 'تجعل النص غامضاً', 'إجبارية في C1', 'ممنوعة'], answer: 'تجعل النص غامضاً' },
          { type: 'fill-blank', id: 'c1-16-q13', question: 'Relativsatz داخل Hauptsatz: "Die Bücher, ___ ich lese, sind gut." (التي)', answer: 'die', hint: 'Relativpronomen مع جمع/مؤنث Akk' },
          { type: 'matching', id: 'c1-16-q14', question: 'اربط الأسلوب بسياقه:', pairs: [
            { left: 'Parataxe', right: 'الخطابة' },
            { left: 'Hypotaxe', right: 'البحث الأكاديمي' },
            { left: 'الإيقاع المختلط', right: 'الأدب' },
            { left: 'كلام يومي', right: 'Parataxe بسيطة' },
          ], answer: 'matched' },
          { type: 'drag-drop', id: 'c1-16-q15', question: 'كوّن Hypotaxe من 3 مستويات: "بما أن المناخ يتغيّر، نحتاج تدابير، تساعد البيئة"', words: ['Da', 'das', 'Klima', 'sich', 'verändert,', 'brauchen', 'wir', 'Maßnahmen,', 'die', 'der', 'Umwelt', 'helfen'], answer: 'Da das Klima sich verändert, brauchen wir Maßnahmen, die der Umwelt helfen' },
          { type: 'fill-blank', id: 'c1-16-q16', question: 'استمع: "Obwohl es schwer war, ___ wir es geschafft."', audioPrompt: 'Obwohl es schwer war, haben wir es geschafft.', answer: 'haben', hint: 'Hauptsatz: حركة الفعل (V2)' },
          { type: 'multiple-choice', id: 'c1-16-q17', question: 'الكاتب الجيد:', options: ['يستعمل Hypotaxe دائماً', 'يستعمل Parataxe دائماً', 'يخلط بين الأسلوبين بحذر', 'يكتب بدون روابط'], answer: 'يخلط بين الأسلوبين بحذر' },
          { type: 'speaking', id: 'c1-16-q18', question: 'قل (Hypotaxe): "بما أن الجو بارد، نشرب شاياً ساخناً"', answer: 'Da es kalt ist, trinken wir heißen Tee' },
          { type: 'fill-blank', id: 'c1-16-q19', question: 'لا تتجاوز ___ مستويات في الجملة المعقّدة.', answer: '4', hint: '3-4 حد أعلى' },
          { type: 'multiple-choice', id: 'c1-16-q20', question: '"Er kam. Er sah. Er siegte." هي مثال على:', options: ['Hypotaxe', 'Parataxe', 'Apposition', 'Relativsatz'], answer: 'Parataxe' },
        ],
      },
    },
  ],
}
