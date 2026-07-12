// i18n for the Interview Prep expansion: 8 professional fields (name + one
// "what they check" note each), translations for the 40 field-technical
// questions, and full guidance for the 4 international-candidate questions.
// Hand-written, all 12 locales, no API. Idempotent (merges into existing
// interviewPrep namespace without touching other keys).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const LOCALES = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh']

// ── UI labels ──
const UI = {
  en: { generalTab: 'General questions', fieldsTitle: 'Choose your field' },
  fr: { generalTab: 'Questions générales', fieldsTitle: 'Choisissez votre domaine' },
  ar: { generalTab: 'أسئلة عامة', fieldsTitle: 'اختر مجالك' },
  de: { generalTab: 'Allgemeine Fragen', fieldsTitle: 'Wähle dein Berufsfeld' },
  es: { generalTab: 'Preguntas generales', fieldsTitle: 'Elige tu campo' },
  tr: { generalTab: 'Genel sorular', fieldsTitle: 'Alanını seç' },
  fa: { generalTab: 'سؤالات عمومی', fieldsTitle: 'حوزه خود را انتخاب کنید' },
  pt: { generalTab: 'Perguntas gerais', fieldsTitle: 'Escolha sua área' },
  ru: { generalTab: 'Общие вопросы', fieldsTitle: 'Выберите свою сферу' },
  hi: { generalTab: 'सामान्य सवाल', fieldsTitle: 'अपना क्षेत्र चुनें' },
  ur: { generalTab: 'عمومی سوالات', fieldsTitle: 'اپنا شعبہ منتخب کریں' },
  zh: { generalTab: '通用问题', fieldsTitle: '选择你的领域' },
}

// ── Fields: name + why, [name, why] per locale ──
const FIELDS = {
  pflege: {
    en: ['Care & Nursing', 'Technical question for the care field — they check empathy, realistic expectations of the job and basic hygiene and safety awareness, not perfect medical knowledge.'],
    fr: ['Soins & santé', 'Question technique du domaine des soins — on vérifie votre empathie, une vision réaliste du métier et des bases d’hygiène et de sécurité, pas un savoir médical parfait.'],
    ar: ['التمريض والرعاية', 'سؤال تقني في مجال الرعاية — يُختبر تعاطفك ونظرتك الواقعية للمهنة وأساسيات النظافة والسلامة، لا معرفة طبية كاملة.'],
    de: ['Pflege', 'Fachfrage aus der Pflege — geprüft werden Empathie, realistische Erwartungen an den Beruf und Grundwissen zu Hygiene und Sicherheit, kein perfektes medizinisches Wissen.'],
    es: ['Cuidados y enfermería', 'Pregunta técnica del ámbito de los cuidados: comprueban tu empatía, expectativas realistas del oficio y nociones de higiene y seguridad, no conocimientos médicos perfectos.'],
    tr: ['Bakım ve hemşirelik', 'Bakım alanından teknik soru — empati, mesleğe dair gerçekçi beklentiler ve temel hijyen/güvenlik bilinci ölçülür, mükemmel tıbbi bilgi değil.'],
    fa: ['پرستاری و مراقبت', 'سؤال فنی حوزه مراقبت — همدلی، انتظارات واقع‌بینانه از شغل و اصول بهداشت و ایمنی سنجیده می‌شود، نه دانش کامل پزشکی.'],
    pt: ['Cuidados e enfermagem', 'Pergunta técnica da área de cuidados — avaliam empatia, expectativas realistas da profissão e noções de higiene e segurança, não conhecimento médico perfeito.'],
    ru: ['Уход и медицина', 'Профильный вопрос из сферы ухода — проверяют эмпатию, реалистичные ожидания от профессии и базовые знания гигиены и безопасности, а не идеальные медицинские знания.'],
    hi: ['नर्सिंग व देखभाल', 'देखभाल क्षेत्र का तकनीकी सवाल — सहानुभूति, पेशे की यथार्थ समझ और स्वच्छता-सुरक्षा की बुनियादी जानकारी परखी जाती है, संपूर्ण चिकित्सा ज्ञान नहीं।'],
    ur: ['نرسنگ اور نگہداشت', 'نگہداشت کے شعبے کا تکنیکی سوال — ہمدردی، پیشے کی حقیقت پسندانہ سمجھ اور حفظانِ صحت و حفاظت کی بنیادی آگاہی جانچی جاتی ہے، مکمل طبی علم نہیں۔'],
    zh: ['护理', '护理领域的专业问题——考察你的同理心、对职业的现实预期以及基本的卫生与安全意识，而不是完美的医学知识。'],
  },
  kfz: {
    en: ['Car Mechatronics', 'Technical question for the automotive field — they check hands-on interest, basic mechanical understanding and a systematic way of working, not expert knowledge.'],
    fr: ['Mécanique auto', 'Question technique du domaine automobile — on vérifie votre intérêt pratique, des bases de mécanique et une méthode de travail systématique, pas une expertise.'],
    ar: ['ميكانيك السيارات', 'سؤال تقني في مجال السيارات — يُختبر اهتمامك العملي وفهمك الميكانيكي الأساسي وطريقة عمل منهجية، لا خبرة متخصص.'],
    de: ['KFZ-Mechatronik', 'Fachfrage aus dem KFZ-Bereich — geprüft werden praktisches Interesse, mechanisches Grundverständnis und systematisches Arbeiten, kein Expertenwissen.'],
    es: ['Mecánica de autos', 'Pregunta técnica del ámbito automotriz: comprueban tu interés práctico, comprensión mecánica básica y una forma de trabajar sistemática, no conocimientos de experto.'],
    tr: ['Otomotiv', 'Otomotiv alanından teknik soru — pratik ilgi, temel mekanik anlayış ve sistemli çalışma ölçülür, uzmanlık bilgisi değil.'],
    fa: ['مکانیک خودرو', 'سؤال فنی حوزه خودرو — علاقه عملی، درک مکانیکی پایه و روش کار منظم سنجیده می‌شود، نه دانش تخصصی.'],
    pt: ['Mecânica automotiva', 'Pergunta técnica da área automotiva — avaliam interesse prático, compreensão mecânica básica e método de trabalho sistemático, não conhecimento de especialista.'],
    ru: ['Автомеханика', 'Профильный вопрос из автомобильной сферы — проверяют практический интерес, базовое понимание механики и системный подход к работе, а не экспертные знания.'],
    hi: ['ऑटो मैकेनिक', 'ऑटोमोटिव क्षेत्र का तकनीकी सवाल — व्यावहारिक रुचि, बुनियादी मैकेनिकल समझ और व्यवस्थित काम करने का तरीका परखा जाता है, विशेषज्ञ ज्ञान नहीं।'],
    ur: ['آٹو مکینک', 'آٹوموٹو شعبے کا تکنیکی سوال — عملی دلچسپی، بنیادی مکینیکل سمجھ اور منظم طریقہ کار جانچا جاتا ہے، ماہرانہ علم نہیں۔'],
    zh: ['汽车机电', '汽车领域的专业问题——考察动手兴趣、基本机械理解和系统化的工作方法，而不是专家知识。'],
  },
  elektro: {
    en: ['Electronics', 'Technical question for the electrical field — they check safety awareness above all, plus basic physics and genuine interest in the trade.'],
    fr: ['Électricité', 'Question technique du domaine électrique — on vérifie avant tout la conscience des dangers, puis des bases de physique et un intérêt réel pour le métier.'],
    ar: ['الكهرباء', 'سؤال تقني في مجال الكهرباء — يُختبر أولاً وعيك بالسلامة، ثم أساسيات الفيزياء والاهتمام الحقيقي بالمهنة.'],
    de: ['Elektronik', 'Fachfrage aus der Elektrotechnik — geprüft werden vor allem Sicherheitsbewusstsein, dazu physikalische Grundlagen und echtes Interesse am Handwerk.'],
    es: ['Electricidad', 'Pregunta técnica del ámbito eléctrico: comprueban sobre todo la conciencia de seguridad, además de física básica e interés genuino por el oficio.'],
    tr: ['Elektrik-elektronik', 'Elektrik alanından teknik soru — her şeyden önce güvenlik bilinci, ayrıca temel fizik ve mesleğe gerçek ilgi ölçülür.'],
    fa: ['برق', 'سؤال فنی حوزه برق — پیش از همه آگاهی ایمنی، سپس فیزیک پایه و علاقه واقعی به این حرفه سنجیده می‌شود.'],
    pt: ['Eletrotécnica', 'Pergunta técnica da área elétrica — avaliam sobretudo a consciência de segurança, além de física básica e interesse genuíno pelo ofício.'],
    ru: ['Электротехника', 'Профильный вопрос из электротехники — прежде всего проверяют понимание техники безопасности, а также базовую физику и настоящий интерес к профессии.'],
    hi: ['इलेक्ट्रिकल', 'इलेक्ट्रिकल क्षेत्र का तकनीकी सवाल — सबसे पहले सुरक्षा की समझ, फिर बुनियादी भौतिकी और पेशे में सच्ची रुचि परखी जाती है।'],
    ur: ['الیکٹریکل', 'الیکٹریکل شعبے کا تکنیکی سوال — سب سے پہلے حفاظتی شعور، پھر بنیادی طبیعیات اور پیشے میں حقیقی دلچسپی جانچی جاتی ہے۔'],
    zh: ['电气电子', '电气领域的专业问题——首先考察安全意识，其次是基础物理知识和对这门手艺的真正兴趣。'],
  },
  it: {
    en: ['IT & Software', 'Technical question for the IT field — they check real hands-on practice, a structured problem-solving approach and the ability to learn on your own.'],
    fr: ['Informatique', 'Question technique du domaine informatique — on vérifie une vraie pratique personnelle, une démarche structurée de résolution de problèmes et la capacité à apprendre seul.'],
    ar: ['المعلوميات', 'سؤال تقني في مجال المعلوميات — تُختبر ممارستك الفعلية ومنهجك المنظم في حل المشكلات وقدرتك على التعلم الذاتي.'],
    de: ['IT / Fachinformatik', 'Fachfrage aus der IT — geprüft werden echte praktische Erfahrung, strukturierte Fehlersuche und die Fähigkeit, selbstständig zu lernen.'],
    es: ['Informática', 'Pregunta técnica del ámbito informático: comprueban práctica real, un método estructurado para resolver problemas y capacidad de aprender por tu cuenta.'],
    tr: ['Bilişim (IT)', 'IT alanından teknik soru — gerçek uygulama deneyimi, yapılandırılmış problem çözme ve kendi kendine öğrenme becerisi ölçülür.'],
    fa: ['فناوری اطلاعات', 'سؤال فنی حوزه IT — تجربه عملی واقعی، رویکرد ساخت‌یافته در حل مسئله و توانایی یادگیری مستقل سنجیده می‌شود.'],
    pt: ['Informática', 'Pergunta técnica da área de TI — avaliam prática real, abordagem estruturada de resolução de problemas e capacidade de aprender sozinho.'],
    ru: ['ИТ', 'Профильный вопрос из ИТ — проверяют реальную практику, структурный подход к решению проблем и умение учиться самостоятельно.'],
    hi: ['आईटी', 'आईटी क्षेत्र का तकनीकी सवाल — असली व्यावहारिक अनुभव, समस्या हल करने का व्यवस्थित तरीका और खुद सीखने की क्षमता परखी जाती है।'],
    ur: ['آئی ٹی', 'آئی ٹی شعبے کا تکنیکی سوال — حقیقی عملی تجربہ، مسئلہ حل کرنے کا منظم طریقہ اور خود سیکھنے کی صلاحیت جانچی جاتی ہے۔'],
    zh: ['IT/信息技术', 'IT 领域的专业问题——考察真实的动手实践、结构化的解决问题思路以及自学能力。'],
  },
  gastro: {
    en: ['Hotel & Gastronomy', 'Technical question for hospitality — they check stress resistance, guest orientation and whether you accept the working hours of the trade.'],
    fr: ['Hôtellerie & restauration', 'Question technique de l’hôtellerie-restauration — on vérifie la résistance au stress, le sens du client et l’acceptation des horaires du métier.'],
    ar: ['الفندقة والمطاعم', 'سؤال تقني في الفندقة والمطاعم — تُختبر مقاومتك للضغط واهتمامك بالزبون وتقبّلك لأوقات العمل في هذه المهنة.'],
    de: ['Hotel & Gastronomie', 'Fachfrage aus der Gastronomie — geprüft werden Stressresistenz, Gästeorientierung und ob du die Arbeitszeiten des Berufs akzeptierst.'],
    es: ['Hostelería', 'Pregunta técnica de hostelería: comprueban resistencia al estrés, orientación al cliente y si aceptas los horarios del oficio.'],
    tr: ['Otel ve gastronomi', 'Gastronomi alanından teknik soru — strese dayanıklılık, misafir odaklılık ve mesleğin çalışma saatlerini kabul edip etmediğin ölçülür.'],
    fa: ['هتلداری و رستوران', 'سؤال فنی حوزه مهمان‌نوازی — مقاومت در برابر استرس، مشتری‌مداری و پذیرش ساعات کاری این حرفه سنجیده می‌شود.'],
    pt: ['Hotelaria e gastronomia', 'Pergunta técnica de hotelaria — avaliam resistência ao estresse, foco no cliente e se você aceita os horários da profissão.'],
    ru: ['Отель и гастрономия', 'Профильный вопрос из гостиничного дела — проверяют стрессоустойчивость, ориентацию на гостя и готовность к графику этой профессии.'],
    hi: ['होटल व रेस्टोरेंट', 'हॉस्पिटैलिटी क्षेत्र का तकनीकी सवाल — तनाव झेलने की क्षमता, अतिथि-केंद्रित सोच और पेशे के काम के घंटों की स्वीकृति परखी जाती है।'],
    ur: ['ہوٹل اور ریستوراں', 'مہمان نوازی کے شعبے کا تکنیکی سوال — دباؤ برداشت کرنے کی صلاحیت، مہمان پر توجہ اور پیشے کے اوقاتِ کار کی قبولیت جانچی جاتی ہے۔'],
    zh: ['酒店餐饮', '酒店餐饮领域的专业问题——考察抗压能力、宾客意识，以及你是否接受这一行的工作时间。'],
  },
  shk: {
    en: ['Plumbing & Heating (SHK)', 'Technical question for the SHK trade — they check physical readiness, customer manners and interest in modern heating technology.'],
    fr: ['Sanitaire & chauffage (SHK)', 'Question technique du métier SHK — on vérifie la condition physique, le comportement chez le client et l’intérêt pour les technologies de chauffage modernes.'],
    ar: ['السباكة والتدفئة (SHK)', 'سؤال تقني في مهنة SHK — تُختبر جاهزيتك البدنية وسلوكك عند الزبون واهتمامك بتقنيات التدفئة الحديثة.'],
    de: ['Sanitär, Heizung, Klima', 'Fachfrage aus dem SHK-Handwerk — geprüft werden körperliche Belastbarkeit, Auftreten beim Kunden und Interesse an moderner Heiztechnik.'],
    es: ['Fontanería y calefacción (SHK)', 'Pregunta técnica del oficio SHK: comprueban preparación física, trato con el cliente e interés por la tecnología de calefacción moderna.'],
    tr: ['Sıhhi tesisat ve ısıtma (SHK)', 'SHK zanaatından teknik soru — fiziksel hazırlık, müşteri yanında davranış ve modern ısıtma teknolojisine ilgi ölçülür.'],
    fa: ['تأسیسات و گرمایش (SHK)', 'سؤال فنی حرفه SHK — آمادگی جسمانی، رفتار نزد مشتری و علاقه به فناوری‌های گرمایشی مدرن سنجیده می‌شود.'],
    pt: ['Hidráulica e aquecimento (SHK)', 'Pergunta técnica do ofício SHK — avaliam preparo físico, postura na casa do cliente e interesse por tecnologia moderna de aquecimento.'],
    ru: ['Сантехника и отопление (SHK)', 'Профильный вопрос из ремесла SHK — проверяют физическую готовность, поведение у клиента и интерес к современным отопительным технологиям.'],
    hi: ['प्लंबिंग व हीटिंग (SHK)', 'SHK पेशे का तकनीकी सवाल — शारीरिक तैयारी, ग्राहक के घर में व्यवहार और आधुनिक हीटिंग तकनीक में रुचि परखी जाती है।'],
    ur: ['پلمبنگ اور ہیٹنگ (SHK)', 'SHK پیشے کا تکنیکی سوال — جسمانی تیاری، گاہک کے گھر میں رویہ اور جدید ہیٹنگ ٹیکنالوجی میں دلچسپی جانچی جاتی ہے۔'],
    zh: ['水暖空调 (SHK)', 'SHK 行业的专业问题——考察身体素质、在客户家中的举止以及对现代供暖技术的兴趣。'],
  },
  kaufmann: {
    en: ['Office & Sales', 'Technical question for commercial professions — they check organisation, communication on the phone, number skills and discretion with data.'],
    fr: ['Commerce & bureau', 'Question technique des métiers commerciaux — on vérifie l’organisation, la communication au téléphone, l’aisance avec les chiffres et la discrétion avec les données.'],
    ar: ['التجارة والمكتب', 'سؤال تقني في المهن التجارية — تُختبر قدرتك على التنظيم والتواصل الهاتفي والتعامل مع الأرقام والحفاظ على سرية البيانات.'],
    de: ['Kaufmännisch', 'Fachfrage aus den kaufmännischen Berufen — geprüft werden Organisation, Kommunikation am Telefon, Zahlenverständnis und Diskretion mit Daten.'],
    es: ['Comercio y oficina', 'Pregunta técnica de los oficios comerciales: comprueban organización, comunicación telefónica, manejo de números y discreción con los datos.'],
    tr: ['Ticaret ve büro', 'Ticari mesleklerden teknik soru — organizasyon, telefonda iletişim, sayılarla arası ve verilerde ketumluk ölçülür.'],
    fa: ['اداری و فروش', 'سؤال فنی مشاغل بازرگانی — نظم، ارتباط تلفنی، مهارت با اعداد و رازداری با داده‌ها سنجیده می‌شود.'],
    pt: ['Comércio e escritório', 'Pergunta técnica das profissões comerciais — avaliam organização, comunicação ao telefone, habilidade com números e discrição com dados.'],
    ru: ['Офис и торговля', 'Профильный вопрос коммерческих профессий — проверяют организованность, общение по телефону, работу с числами и конфиденциальность данных.'],
    hi: ['ऑफिस व सेल्स', 'कमर्शियल पेशों का तकनीकी सवाल — संगठन-क्षमता, फोन पर संवाद, अंकों की समझ और डेटा की गोपनीयता परखी जाती है।'],
    ur: ['دفتر اور سیلز', 'تجارتی پیشوں کا تکنیکی سوال — تنظیم، فون پر گفتگو، اعداد کی مہارت اور ڈیٹا کی رازداری جانچی جاتی ہے۔'],
    zh: ['商务办公', '商科职业的专业问题——考察条理性、电话沟通、数字能力以及对数据的保密意识。'],
  },
  logistik: {
    en: ['Warehouse & Logistics', 'Technical question for logistics — they check accuracy, reliability across shifts and whether you take safety and processes seriously.'],
    fr: ['Logistique & entrepôt', 'Question technique de la logistique — on vérifie la précision, la fiabilité en horaires décalés et le sérieux face à la sécurité et aux processus.'],
    ar: ['اللوجستيك والمخازن', 'سؤال تقني في اللوجستيك — تُختبر دقتك وموثوقيتك في نظام الورديات ومدى جديتك تجاه السلامة والإجراءات.'],
    de: ['Lagerlogistik', 'Fachfrage aus der Logistik — geprüft werden Genauigkeit, Zuverlässigkeit im Schichtsystem und ob du Sicherheit und Prozesse ernst nimmst.'],
    es: ['Logística y almacén', 'Pregunta técnica de logística: comprueban precisión, fiabilidad en turnos y si te tomas en serio la seguridad y los procesos.'],
    tr: ['Depo ve lojistik', 'Lojistik alanından teknik soru — doğruluk, vardiyalarda güvenilirlik ve güvenlik ile süreçleri ciddiye alıp almadığın ölçülür.'],
    fa: ['انبار و لجستیک', 'سؤال فنی حوزه لجستیک — دقت، قابل‌اعتماد بودن در شیفت‌ها و جدی گرفتن ایمنی و فرایندها سنجیده می‌شود.'],
    pt: ['Logística e armazém', 'Pergunta técnica de logística — avaliam precisão, confiabilidade em turnos e se você leva a sério a segurança e os processos.'],
    ru: ['Склад и логистика', 'Профильный вопрос из логистики — проверяют точность, надёжность при сменной работе и серьёзное отношение к безопасности и процессам.'],
    hi: ['वेयरहाउस व लॉजिस्टिक्स', 'लॉजिस्टिक्स क्षेत्र का तकनीकी सवाल — सटीकता, शिफ्टों में विश्वसनीयता और सुरक्षा व प्रक्रियाओं के प्रति गंभीरता परखी जाती है।'],
    ur: ['گودام اور لاجسٹکس', 'لاجسٹکس شعبے کا تکنیکی سوال — درستگی، شفٹوں میں قابلِ اعتماد ہونا اور حفاظت و طریقہ کار کو سنجیدہ لینا جانچا جاتا ہے۔'],
    zh: ['仓储物流', '物流领域的专业问题——考察准确性、倒班工作中的可靠性，以及你是否认真对待安全和流程。'],
  },
}

// ── Question translations (localized rendering of the German question) ──
const TR = {
  pflege_gute_pflege: {
    en: 'What does good care mean to you?', fr: 'Que signifie pour vous une bonne prise en charge ?', ar: 'ماذا تعني الرعاية الجيدة بالنسبة لك؟', de: 'Was bedeutet für Sie gute Pflege?', es: '¿Qué significa para ti un buen cuidado?', tr: 'Senin için iyi bakım ne demek?', fa: 'مراقبت خوب برای شما چه معنایی دارد؟', pt: 'O que significa bom cuidado para você?', ru: 'Что для вас означает хороший уход?', hi: 'आपके लिए अच्छी देखभाल का क्या मतलब है?', ur: 'آپ کے لیے اچھی نگہداشت کا کیا مطلب ہے؟', zh: '对你来说，好的护理意味着什么？',
  },
  pflege_dementer_patient: {
    en: 'How would you deal with a confused or dementia patient?', fr: 'Comment géreriez-vous un patient confus ou atteint de démence ?', ar: 'كيف تتعامل مع مريض مشوّش أو مصاب بالخرف؟', de: 'Wie würden Sie mit einem verwirrten oder dementen Patienten umgehen?', es: '¿Cómo tratarías a un paciente confuso o con demencia?', tr: 'Kafası karışık veya demans hastası biriyle nasıl ilgilenirsin?', fa: 'با بیمار گیج یا مبتلا به زوال عقل چگونه رفتار می‌کنید؟', pt: 'Como você lidaria com um paciente confuso ou com demência?', ru: 'Как вы будете обращаться с растерянным пациентом или пациентом с деменцией?', hi: 'भ्रमित या डिमेंशिया के मरीज़ के साथ आप कैसे पेश आएँगे?', ur: 'کنفیوز یا ڈیمنشیا کے مریض کے ساتھ آپ کیسے پیش آئیں گے؟', zh: '你会如何照顾意识混乱或患失智症的病人？',
  },
  pflege_hygiene: {
    en: 'Why is hygiene so important in care?', fr: 'Pourquoi l’hygiène est-elle si importante dans les soins ?', ar: 'لماذا النظافة مهمة جداً في مجال الرعاية؟', de: 'Warum ist Hygiene in der Pflege so wichtig?', es: '¿Por qué es tan importante la higiene en los cuidados?', tr: 'Bakımda hijyen neden bu kadar önemli?', fa: 'چرا بهداشت در مراقبت این‌قدر مهم است؟', pt: 'Por que a higiene é tão importante no cuidado?', ru: 'Почему гигиена так важна в уходе?', hi: 'देखभाल में स्वच्छता इतनी ज़रूरी क्यों है?', ur: 'نگہداشت میں حفظانِ صحت اتنی اہم کیوں ہے؟', zh: '为什么卫生在护理中如此重要？',
  },
  pflege_schichtdienst: {
    en: 'How do you feel about shift work, night shifts and weekends?', fr: 'Que pensez-vous du travail posté, de nuit et le week-end ?', ar: 'ما رأيك في نظام الورديات والعمل الليلي وعطل نهاية الأسبوع؟', de: 'Wie stehen Sie zu Schichtdienst, Nachtdiensten und Wochenendarbeit?', es: '¿Qué opinas de los turnos, las noches y los fines de semana?', tr: 'Vardiya, gece nöbeti ve hafta sonu çalışması hakkında ne düşünüyorsun?', fa: 'نظرتان درباره شیفت، شب‌کاری و کار آخر هفته چیست؟', pt: 'O que você acha de turnos, plantões noturnos e fins de semana?', ru: 'Как вы относитесь к сменам, ночным дежурствам и работе по выходным?', hi: 'शिफ्ट, नाइट ड्यूटी और वीकेंड काम के बारे में आपकी क्या राय है?', ur: 'شفٹ، نائٹ ڈیوٹی اور ویک اینڈ کام کے بارے میں آپ کا کیا خیال ہے؟', zh: '你如何看待倒班、夜班和周末工作？',
  },
  pflege_belastung: {
    en: 'Care can be emotionally hard. How do you cope?', fr: 'Les soins peuvent être émotionnellement durs. Comment tenez-vous ?', ar: 'الرعاية قد تكون مرهقة نفسياً. كيف تتعامل مع ذلك؟', de: 'Pflege kann emotional sehr belastend sein. Wie gehen Sie damit um?', es: 'El cuidado puede ser emocionalmente duro. ¿Cómo lo llevas?', tr: 'Bakım duygusal olarak ağır olabilir. Bununla nasıl başa çıkarsın?', fa: 'مراقبت می‌تواند از نظر روحی سنگین باشد. چطور کنار می‌آیید؟', pt: 'O cuidado pode ser emocionalmente pesado. Como você lida?', ru: 'Уход может быть эмоционально тяжёлым. Как вы справляетесь?', hi: 'देखभाल भावनात्मक रूप से कठिन हो सकती है। आप कैसे संभालेंगे?', ur: 'نگہداشت جذباتی طور پر مشکل ہو سکتی ہے۔ آپ کیسے نبھائیں گے؟', zh: '护理工作在情感上可能很沉重。你如何应对？',
  },
  kfz_erfahrung: {
    en: 'Have you ever worked on a car hands-on?', fr: 'Avez-vous déjà travaillé concrètement sur une voiture ?', ar: 'هل سبق أن عملت عملياً على سيارة؟', de: 'Haben Sie schon einmal praktisch an einem Auto gearbeitet?', es: '¿Has trabajado alguna vez en un coche?', tr: 'Hiç bir arabada elinle çalıştın mı?', fa: 'تا حالا عملاً روی خودرو کار کرده‌اید؟', pt: 'Você já trabalhou na prática em um carro?', ru: 'Вы когда-нибудь работали с автомобилем на практике?', hi: 'क्या आपने कभी गाड़ी पर हाथ से काम किया है?', ur: 'کیا آپ نے کبھی عملی طور پر گاڑی پر کام کیا ہے؟', zh: '你有过实际修车的经历吗？',
  },
  kfz_motor: {
    en: 'What is the difference between a petrol and a diesel engine?', fr: 'Quelle est la différence entre un moteur essence et un moteur diesel ?', ar: 'ما الفرق بين محرك البنزين ومحرك الديزل؟', de: 'Was ist der Unterschied zwischen einem Benzin- und einem Dieselmotor?', es: '¿Cuál es la diferencia entre un motor de gasolina y uno diésel?', tr: 'Benzinli ve dizel motor arasındaki fark nedir?', fa: 'فرق موتور بنزینی و دیزلی چیست؟', pt: 'Qual é a diferença entre um motor a gasolina e um a diesel?', ru: 'В чём разница между бензиновым и дизельным двигателем?', hi: 'पेट्रोल और डीज़ल इंजन में क्या फर्क है?', ur: 'پیٹرول اور ڈیزل انجن میں کیا فرق ہے؟', zh: '汽油发动机和柴油发动机有什么区别？',
  },
  kfz_elektro: {
    en: 'What do you know about electric cars, and how do they change the trade?', fr: 'Que savez-vous des voitures électriques, et comment changent-elles le métier ?', ar: 'ماذا تعرف عن السيارات الكهربائية وكيف تغيّر المهنة؟', de: 'Was wissen Sie über Elektroautos, und wie verändert das den Beruf?', es: '¿Qué sabes de los coches eléctricos y cómo cambian el oficio?', tr: 'Elektrikli arabalar hakkında ne biliyorsun, meslek nasıl değişiyor?', fa: 'درباره خودروهای برقی چه می‌دانید و چگونه این حرفه را تغییر می‌دهند؟', pt: 'O que você sabe sobre carros elétricos e como eles mudam a profissão?', ru: 'Что вы знаете об электромобилях и как они меняют профессию?', hi: 'इलेक्ट्रिक कारों के बारे में क्या जानते हैं, और वे पेशे को कैसे बदल रही हैं?', ur: 'الیکٹرک گاڑیوں کے بارے میں کیا جانتے ہیں اور یہ پیشے کو کیسے بدل رہی ہیں؟', zh: '你对电动汽车了解多少？它如何改变这个职业？',
  },
  kfz_diagnose: {
    en: 'A customer only says: "The car makes strange noises." What do you do?', fr: 'Un client dit seulement : « La voiture fait des bruits bizarres. » Que faites-vous ?', ar: 'يقول الزبون فقط: «السيارة تصدر أصواتاً غريبة». كيف تتصرف؟', de: 'Ein Kunde sagt nur: „Das Auto macht komische Geräusche.“ Wie gehen Sie vor?', es: 'Un cliente solo dice: «El coche hace ruidos raros». ¿Qué haces?', tr: "Müşteri sadece 'Araba tuhaf sesler çıkarıyor' diyor. Nasıl ilerlersin?", fa: 'مشتری فقط می‌گوید: «ماشین صداهای عجیب می‌دهد.» چه می‌کنید؟', pt: 'Um cliente só diz: "O carro faz barulhos estranhos". O que você faz?', ru: 'Клиент говорит только: «Машина издаёт странные звуки». Ваши действия?', hi: 'ग्राहक बस कहता है: "गाड़ी से अजीब आवाज़ें आती हैं।" आप क्या करेंगे?', ur: 'گاہک صرف کہتا ہے: "گاڑی سے عجیب آوازیں آ رہی ہیں۔" آپ کیا کریں گے؟', zh: '客户只说"车有奇怪的响声"，你会怎么做？',
  },
  kfz_sicherheit: {
    en: 'Why is work safety so important in the workshop?', fr: 'Pourquoi la sécurité au travail est-elle si importante à l’atelier ?', ar: 'لماذا سلامة العمل مهمة جداً في الورشة؟', de: 'Warum ist Arbeitssicherheit in der Werkstatt so wichtig?', es: '¿Por qué es tan importante la seguridad en el taller?', tr: 'Atölyede iş güvenliği neden bu kadar önemli?', fa: 'چرا ایمنی کار در تعمیرگاه این‌قدر مهم است؟', pt: 'Por que a segurança do trabalho é tão importante na oficina?', ru: 'Почему охрана труда так важна в мастерской?', hi: 'वर्कशॉप में काम की सुरक्षा इतनी ज़रूरी क्यों है?', ur: 'ورکشاپ میں کام کی حفاظت اتنی اہم کیوں ہے؟', zh: '为什么车间的工作安全如此重要？',
  },
  elektro_gefahren: {
    en: 'What dangers exist when working with electricity, and how do you protect yourself?', fr: 'Quels sont les dangers du travail avec l’électricité, et comment se protéger ?', ar: 'ما مخاطر العمل مع الكهرباء وكيف تحمي نفسك؟', de: 'Welche Gefahren gibt es bei der Arbeit mit Strom, und wie schützt man sich?', es: '¿Qué peligros hay al trabajar con electricidad y cómo protegerse?', tr: 'Elektrikle çalışırken hangi tehlikeler var, nasıl korunursun?', fa: 'کار با برق چه خطراتی دارد و چگونه از خود محافظت می‌کنید؟', pt: 'Quais perigos existem ao trabalhar com eletricidade e como se proteger?', ru: 'Какие опасности есть при работе с электричеством и как защититься?', hi: 'बिजली के काम में क्या खतरे हैं, और खुद को कैसे बचाएँगे?', ur: 'بجلی کے کام میں کیا خطرات ہیں اور خود کو کیسے بچائیں گے؟', zh: '电气作业有哪些危险？如何保护自己？',
  },
  elektro_grundlagen: {
    en: 'Can you explain the difference between voltage, current and resistance?', fr: 'Pouvez-vous expliquer la différence entre tension, courant et résistance ?', ar: 'هل يمكنك شرح الفرق بين الجهد والتيار والمقاومة؟', de: 'Können Sie mir den Unterschied zwischen Spannung, Strom und Widerstand erklären?', es: '¿Puedes explicar la diferencia entre tensión, corriente y resistencia?', tr: 'Gerilim, akım ve direnç arasındaki farkı açıklayabilir misin?', fa: 'می‌توانید فرق ولتاژ، جریان و مقاومت را توضیح دهید؟', pt: 'Você pode explicar a diferença entre tensão, corrente e resistência?', ru: 'Можете объяснить разницу между напряжением, током и сопротивлением?', hi: 'वोल्टेज, करंट और रेज़िस्टेंस में फर्क समझा सकते हैं?', ur: 'وولٹیج، کرنٹ اور مزاحمت میں فرق سمجھا سکتے ہیں؟', zh: '你能解释电压、电流和电阻的区别吗？',
  },
  elektro_erfahrung: {
    en: 'Do you have practical experience with electrical work?', fr: 'Avez-vous une expérience pratique en électricité ?', ar: 'هل لديك خبرة عملية في الكهرباء؟', de: 'Haben Sie schon praktische Erfahrung mit Elektrotechnik?', es: '¿Tienes experiencia práctica en electricidad?', tr: 'Elektrik işlerinde pratik deneyimin var mı?', fa: 'تجربه عملی در کارهای برقی دارید؟', pt: 'Você tem experiência prática com eletricidade?', ru: 'Есть ли у вас практический опыт в электротехнике?', hi: 'क्या आपको बिजली के काम का व्यावहारिक अनुभव है?', ur: 'کیا آپ کو بجلی کے کام کا عملی تجربہ ہے؟', zh: '你有电工方面的实践经验吗？',
  },
  elektro_mathe: {
    en: 'How good are you at maths and physics?', fr: 'Quel est votre niveau en mathématiques et en physique ?', ar: 'ما مستواك في الرياضيات والفيزياء؟', de: 'Wie gut sind Sie in Mathematik und Physik?', es: '¿Qué tal se te dan las matemáticas y la física?', tr: 'Matematik ve fizikte ne kadar iyisin?', fa: 'در ریاضی و فیزیک چقدر قوی هستید؟', pt: 'Você é bom em matemática e física?', ru: 'Насколько вы сильны в математике и физике?', hi: 'गणित और भौतिकी में आप कितने अच्छे हैं?', ur: 'ریاضی اور فزکس میں آپ کتنے اچھے ہیں؟', zh: '你的数学和物理怎么样？',
  },
  elektro_zukunft: {
    en: 'Why do you think the electrical trade has a future?', fr: 'Pourquoi le métier de l’électricité a-t-il de l’avenir selon vous ?', ar: 'لماذا لمهنة الكهرباء مستقبل في رأيك؟', de: 'Warum hat der Elektroberuf Ihrer Meinung nach Zukunft?', es: '¿Por qué crees que el oficio eléctrico tiene futuro?', tr: 'Sence elektrik mesleğinin neden geleceği var?', fa: 'به نظر شما چرا حرفه برق آینده دارد؟', pt: 'Por que você acha que a profissão elétrica tem futuro?', ru: 'Почему, по-вашему, у электропрофессии есть будущее?', hi: 'आपके अनुसार इलेक्ट्रिकल पेशे का भविष्य क्यों है?', ur: 'آپ کے خیال میں الیکٹریکل پیشے کا مستقبل کیوں ہے؟', zh: '你为什么认为电气行业有前途？',
  },
  it_projekte: {
    en: 'Have you built your own IT projects?', fr: 'Avez-vous déjà réalisé vos propres projets informatiques ?', ar: 'هل أنجزت مشاريع معلوماتية خاصة بك؟', de: 'Haben Sie schon eigene IT-Projekte umgesetzt?', es: '¿Has hecho tus propios proyectos de informática?', tr: 'Kendi IT projelerini yaptın mı?', fa: 'پروژه‌های IT شخصی ساخته‌اید؟', pt: 'Você já fez seus próprios projetos de TI?', ru: 'Делали ли вы собственные ИТ-проекты?', hi: 'क्या आपने अपने खुद के आईटी प्रोजेक्ट बनाए हैं?', ur: 'کیا آپ نے اپنے آئی ٹی پروجیکٹ بنائے ہیں؟', zh: '你做过自己的 IT 项目吗？',
  },
  it_sprachen: {
    en: 'Which programming languages or technologies do you know?', fr: 'Quels langages de programmation ou technologies connaissez-vous ?', ar: 'ما لغات البرمجة أو التقنيات التي تعرفها؟', de: 'Welche Programmiersprachen oder Technologien kennen Sie?', es: '¿Qué lenguajes de programación o tecnologías conoces?', tr: 'Hangi programlama dillerini veya teknolojileri biliyorsun?', fa: 'چه زبان‌های برنامه‌نویسی یا فناوری‌هایی بلدید؟', pt: 'Quais linguagens de programação ou tecnologias você conhece?', ru: 'Какие языки программирования или технологии вы знаете?', hi: 'आप कौन-सी प्रोग्रामिंग भाषाएँ या तकनीकें जानते हैं?', ur: 'آپ کون سی پروگرامنگ زبانیں یا ٹیکنالوجیز جانتے ہیں؟', zh: '你会哪些编程语言或技术？',
  },
  it_problem: {
    en: 'A computer no longer starts. How do you proceed systematically?', fr: 'Un ordinateur ne démarre plus. Comment procédez-vous méthodiquement ?', ar: 'حاسوب لا يعمل. كيف تتصرف بشكل منهجي؟', de: 'Ein Rechner startet nicht mehr. Wie gehen Sie systematisch vor?', es: 'Un ordenador ya no arranca. ¿Cómo procedes sistemáticamente?', tr: 'Bir bilgisayar artık açılmıyor. Sistemli olarak nasıl ilerlersin?', fa: 'کامپیوتری روشن نمی‌شود. چگونه سیستماتیک پیش می‌روید؟', pt: 'Um computador não liga mais. Como você procede sistematicamente?', ru: 'Компьютер не включается. Как вы действуете системно?', hi: 'कंप्यूटर चालू नहीं हो रहा। आप व्यवस्थित ढंग से क्या करेंगे?', ur: 'کمپیوٹر اسٹارٹ نہیں ہو رہا۔ آپ منظم طریقے سے کیا کریں گے؟', zh: '一台电脑无法启动，你会如何系统地排查？',
  },
  it_lernen: {
    en: 'IT changes constantly. How do you keep up to date?', fr: 'L’informatique change sans cesse. Comment restez-vous à jour ?', ar: 'المعلوميات تتغير باستمرار. كيف تبقى مطلعاً؟', de: 'IT verändert sich ständig. Wie bleiben Sie auf dem Laufenden?', es: 'La informática cambia sin parar. ¿Cómo te mantienes al día?', tr: 'IT sürekli değişiyor. Nasıl güncel kalıyorsun?', fa: 'IT مدام تغییر می‌کند. چگونه به‌روز می‌مانید؟', pt: 'A TI muda o tempo todo. Como você se mantém atualizado?', ru: 'ИТ постоянно меняется. Как вы остаётесь в курсе?', hi: 'आईटी लगातार बदलती है। आप अपडेट कैसे रहते हैं?', ur: 'آئی ٹی مسلسل بدلتی ہے۔ آپ اپ ڈیٹ کیسے رہتے ہیں؟', zh: 'IT 日新月异，你如何保持学习？',
  },
  it_teamarbeit: {
    en: 'Many think programmers work alone. What is your view?', fr: 'Beaucoup pensent que les programmeurs travaillent seuls. Qu’en pensez-vous ?', ar: 'يعتقد كثيرون أن المبرمجين يعملون وحدهم. ما رأيك؟', de: 'Viele denken, Programmierer arbeiten allein. Wie sehen Sie das?', es: 'Muchos creen que los programadores trabajan solos. ¿Tú qué opinas?', tr: 'Çoğu kişi programcıların yalnız çalıştığını düşünür. Sen ne diyorsun?', fa: 'خیلی‌ها فکر می‌کنند برنامه‌نویس‌ها تنها کار می‌کنند. نظر شما چیست؟', pt: 'Muitos acham que programadores trabalham sozinhos. O que você acha?', ru: 'Многие думают, что программисты работают в одиночку. Ваше мнение?', hi: 'कई लोग सोचते हैं प्रोग्रामर अकेले काम करते हैं। आपकी क्या राय है?', ur: 'بہت سے لوگ سمجھتے ہیں پروگرامر اکیلے کام کرتے ہیں۔ آپ کیا کہتے ہیں؟', zh: '很多人以为程序员是单打独斗，你怎么看？',
  },
  gastro_stress: {
    en: 'Friday night, full restaurant, three tables calling at once. What do you do?', fr: 'Vendredi soir, restaurant plein, trois tables appellent en même temps. Que faites-vous ?', ar: 'مساء الجمعة، المطعم ممتلئ، وثلاث طاولات تنادي في آن واحد. ماذا تفعل؟', de: 'Freitagabend, volles Restaurant, drei Tische rufen gleichzeitig. Was machen Sie?', es: 'Viernes noche, restaurante lleno, tres mesas llaman a la vez. ¿Qué haces?', tr: 'Cuma akşamı, restoran dolu, üç masa aynı anda çağırıyor. Ne yaparsın?', fa: 'جمعه‌شب، رستوران پر، سه میز هم‌زمان صدا می‌زنند. چه می‌کنید؟', pt: 'Sexta à noite, restaurante cheio, três mesas chamam ao mesmo tempo. O que você faz?', ru: 'Вечер пятницы, полный ресторан, три столика зовут одновременно. Что делаете?', hi: 'शुक्रवार रात, भरा रेस्टोरेंट, तीन टेबल एक साथ बुला रही हैं। आप क्या करेंगे?', ur: 'جمعے کی رات، بھرا ریستوراں، تین میزیں بیک وقت بلا رہی ہیں۔ آپ کیا کریں گے؟', zh: '周五晚上餐厅爆满，三桌客人同时叫你，你怎么办？',
  },
  gastro_gast: {
    en: 'A guest complains the food is cold. How do you react?', fr: 'Un client se plaint que le plat est froid. Comment réagissez-vous ?', ar: 'زبون يشتكي أن الطعام بارد. كيف تتصرف؟', de: 'Ein Gast beschwert sich, das Essen sei kalt. Wie reagieren Sie?', es: 'Un cliente se queja de que la comida está fría. ¿Cómo reaccionas?', tr: 'Bir misafir yemeğin soğuk olduğundan şikâyet ediyor. Nasıl tepki verirsin?', fa: 'مهمانی شکایت می‌کند غذا سرد است. چه واکنشی نشان می‌دهید؟', pt: 'Um cliente reclama que a comida está fria. Como você reage?', ru: 'Гость жалуется, что еда холодная. Как вы реагируете?', hi: 'मेहमान शिकायत करता है कि खाना ठंडा है। आप कैसे प्रतिक्रिया देंगे?', ur: 'مہمان شکایت کرتا ہے کہ کھانا ٹھنڈا ہے۔ آپ کیا کریں گے؟', zh: '客人抱怨菜是凉的，你如何应对？',
  },
  gastro_zeiten: {
    en: 'Hospitality means evenings, weekends and holidays. Does that suit you?', fr: 'En restauration, on travaille le soir, le week-end et les jours fériés. Cela vous convient-il ?', ar: 'في المطاعم يُعمل مساءً وفي عطل الأسبوع والأعياد. هل يناسبك ذلك؟', de: 'In der Gastronomie arbeitet man abends, am Wochenende und an Feiertagen. Passt das zu Ihnen?', es: 'En hostelería se trabaja noches, fines de semana y festivos. ¿Te encaja?', tr: 'Gastronomide akşamları, hafta sonları ve bayramlarda çalışılır. Sana uyar mı?', fa: 'در رستوران‌داری شب‌ها، آخر هفته‌ها و تعطیلات کار می‌شود. برایتان مناسب است؟', pt: 'Na gastronomia se trabalha à noite, fins de semana e feriados. Combina com você?', ru: 'В гастрономии работают вечерами, по выходным и праздникам. Вам это подходит?', hi: 'इस पेशे में शाम, वीकेंड और छुट्टियों पर काम होता है। क्या यह आपको सूट करता है?', ur: 'اس پیشے میں شام، ویک اینڈ اور تہواروں پر کام ہوتا ہے۔ کیا یہ آپ کو موافق ہے؟', zh: '餐饮业要在晚上、周末和节假日工作，你能接受吗？',
  },
  gastro_erfahrung: {
    en: 'Have you worked in gastronomy or service before?', fr: 'Avez-vous déjà travaillé en restauration ou en service ?', ar: 'هل عملت من قبل في المطاعم أو الخدمة؟', de: 'Haben Sie schon in der Gastronomie oder im Service gearbeitet?', es: '¿Has trabajado antes en hostelería o servicio?', tr: 'Daha önce gastronomide veya serviste çalıştın mı?', fa: 'قبلاً در رستوران یا بخش خدمات کار کرده‌اید؟', pt: 'Você já trabalhou em gastronomia ou atendimento?', ru: 'Работали ли вы раньше в общепите или сервисе?', hi: 'क्या आपने पहले रेस्टोरेंट या सर्विस में काम किया है?', ur: 'کیا آپ نے پہلے ریستوراں یا سروس میں کام کیا ہے؟', zh: '你以前在餐饮或服务行业工作过吗？',
  },
  gastro_service: {
    en: 'What does good service mean to you?', fr: 'Que signifie un bon service pour vous ?', ar: 'ماذا تعني الخدمة الجيدة بالنسبة لك؟', de: 'Was bedeutet für Sie guter Service?', es: '¿Qué significa para ti un buen servicio?', tr: 'Senin için iyi servis ne demek?', fa: 'خدمات خوب برای شما چه معنایی دارد؟', pt: 'O que significa bom atendimento para você?', ru: 'Что для вас значит хороший сервис?', hi: 'आपके लिए अच्छी सर्विस का क्या मतलब है?', ur: 'آپ کے لیے اچھی سروس کا کیا مطلب ہے؟', zh: '对你来说，好的服务意味着什么？',
  },
  shk_interesse: {
    en: 'Why are you interested in the SHK trade of all things?', fr: 'Pourquoi vous intéressez-vous justement au métier SHK ?', ar: 'لماذا تهتم تحديداً بمهنة SHK؟', de: 'Warum interessieren Sie sich ausgerechnet für den SHK-Beruf?', es: '¿Por qué te interesa precisamente el oficio SHK?', tr: 'Neden özellikle SHK mesleğiyle ilgileniyorsun?', fa: 'چرا دقیقاً به حرفه SHK علاقه دارید؟', pt: 'Por que você se interessa justamente pelo ofício SHK?', ru: 'Почему вас интересует именно профессия SHK?', hi: 'आपको खासतौर पर SHK पेशे में रुचि क्यों है?', ur: 'آپ کو خاص طور پر SHK پیشے میں دلچسپی کیوں ہے؟', zh: '你为什么偏偏对水暖空调（SHK）这一行感兴趣？',
  },
  shk_heizung: {
    en: 'What do you know about modern heating systems, e.g. heat pumps?', fr: 'Que savez-vous des systèmes de chauffage modernes, par ex. les pompes à chaleur ?', ar: 'ماذا تعرف عن أنظمة التدفئة الحديثة مثل المضخات الحرارية؟', de: 'Was wissen Sie über moderne Heizsysteme, zum Beispiel Wärmepumpen?', es: '¿Qué sabes de los sistemas de calefacción modernos, p. ej. bombas de calor?', tr: 'Modern ısıtma sistemleri, örneğin ısı pompaları hakkında ne biliyorsun?', fa: 'درباره سیستم‌های گرمایشی مدرن مثل پمپ حرارتی چه می‌دانید؟', pt: 'O que você sabe sobre sistemas modernos de aquecimento, como bombas de calor?', ru: 'Что вы знаете о современных системах отопления, например тепловых насосах?', hi: 'आधुनिक हीटिंग सिस्टम, जैसे हीट पंप, के बारे में क्या जानते हैं?', ur: 'جدید ہیٹنگ سسٹمز مثلاً ہیٹ پمپ کے بارے میں کیا جانتے ہیں؟', zh: '你对现代供暖系统（如热泵）了解多少？',
  },
  shk_koerperlich: {
    en: 'The work is physically demanding — basements, sites, heavy parts. Are you prepared?', fr: 'Le travail est physique — caves, chantiers, pièces lourdes. Y êtes-vous préparé ?', ar: 'العمل مرهق بدنياً — أقبية وورشات وقطع ثقيلة. هل أنت مستعد؟', de: 'Die Arbeit ist körperlich anstrengend — Keller, Baustellen, schwere Teile. Sind Sie darauf vorbereitet?', es: 'El trabajo es físico: sótanos, obras, piezas pesadas. ¿Estás preparado?', tr: 'İş fiziksel olarak ağır — bodrumlar, şantiyeler, ağır parçalar. Hazır mısın?', fa: 'کار از نظر جسمی سنگین است — زیرزمین، کارگاه، قطعات سنگین. آماده‌اید؟', pt: 'O trabalho é fisicamente pesado — porões, obras, peças pesadas. Você está preparado?', ru: 'Работа физически тяжёлая — подвалы, стройки, тяжёлые детали. Вы готовы?', hi: 'काम शारीरिक रूप से कठिन है — बेसमेंट, साइट, भारी सामान। क्या आप तैयार हैं?', ur: 'کام جسمانی طور پر سخت ہے — تہ خانے، سائٹس، بھاری پرزے۔ کیا آپ تیار ہیں؟', zh: '这份工作对体力要求很高——地下室、工地、重型部件。你准备好了吗？',
  },
  shk_kunde: {
    en: 'You work in customers\' homes. How do you behave there?', fr: 'Vous travaillez chez les clients. Comment vous comportez-vous chez eux ?', ar: 'أنت تعمل في بيوت الزبائن. كيف تتصرف هناك؟', de: 'Sie arbeiten beim Kunden zu Hause. Wie verhalten Sie sich dort?', es: 'Trabajas en casas de clientes. ¿Cómo te comportas allí?', tr: 'Müşterinin evinde çalışıyorsun. Orada nasıl davranırsın?', fa: 'در خانه مشتری کار می‌کنید. آنجا چگونه رفتار می‌کنید؟', pt: 'Você trabalha na casa dos clientes. Como se comporta lá?', ru: 'Вы работаете в домах клиентов. Как вы там себя ведёте?', hi: 'आप ग्राहकों के घर में काम करते हैं। वहाँ कैसे पेश आएँगे?', ur: 'آپ گاہکوں کے گھروں میں کام کرتے ہیں۔ وہاں کیسا رویہ رکھیں گے؟', zh: '你要上门在客户家中作业，在那里你会如何表现？',
  },
  shk_handwerk: {
    en: 'Have you ever done manual/craft work?', fr: 'Avez-vous déjà fait des travaux manuels ?', ar: 'هل سبق أن قمت بأعمال يدوية/حرفية؟', de: 'Haben Sie schon einmal handwerklich gearbeitet?', es: '¿Has hecho alguna vez trabajos manuales?', tr: 'Hiç el işi/zanaat işi yaptın mı?', fa: 'تا حالا کار دستی/فنی انجام داده‌اید؟', pt: 'Você já fez trabalhos manuais?', ru: 'Вы когда-нибудь занимались ручной/ремесленной работой?', hi: 'क्या आपने कभी हाथ का/कारीगरी का काम किया है?', ur: 'کیا آپ نے کبھی ہاتھ کا/دستکاری کا کام کیا ہے؟', zh: '你做过手工或工匠类的工作吗？',
  },
  kauf_organisation: {
    en: 'How do you organise your tasks when many things come at once?', fr: 'Comment organisez-vous vos tâches quand tout arrive en même temps ?', ar: 'كيف تنظّم مهامك عندما تتراكم الأمور دفعة واحدة؟', de: 'Wie organisieren Sie Ihre Aufgaben, wenn vieles gleichzeitig ansteht?', es: '¿Cómo organizas tus tareas cuando llega todo a la vez?', tr: 'Birçok iş aynı anda geldiğinde görevlerini nasıl düzenlersin?', fa: 'وقتی چند کار هم‌زمان پیش می‌آید، کارهایتان را چگونه سازمان می‌دهید؟', pt: 'Como você organiza suas tarefas quando muita coisa chega ao mesmo tempo?', ru: 'Как вы организуете задачи, когда всё приходит одновременно?', hi: 'जब बहुत सारे काम एक साथ आएँ तो आप उन्हें कैसे व्यवस्थित करेंगे?', ur: 'جب بہت سے کام بیک وقت آئیں تو آپ انہیں کیسے منظم کریں گے؟', zh: '当很多任务同时压过来时，你如何安排工作？',
  },
  kauf_programme: {
    en: 'Which computer programs do you master?', fr: 'Quels logiciels maîtrisez-vous ?', ar: 'ما البرامج الحاسوبية التي تتقنها؟', de: 'Welche Computerprogramme beherrschen Sie?', es: '¿Qué programas informáticos dominas?', tr: 'Hangi bilgisayar programlarına hâkimsin?', fa: 'به کدام نرم‌افزارها مسلط هستید؟', pt: 'Quais programas de computador você domina?', ru: 'Какими компьютерными программами вы владеете?', hi: 'आप कौन-से कंप्यूटर प्रोग्राम अच्छे से जानते हैं?', ur: 'آپ کون سے کمپیوٹر پروگرامز پر عبور رکھتے ہیں؟', zh: '你熟练掌握哪些电脑软件？',
  },
  kauf_telefon: {
    en: 'An angry customer calls and complains loudly. How do you react?', fr: 'Un client en colère appelle et se plaint fort. Comment réagissez-vous ?', ar: 'زبون غاضب يتصل ويشتكي بصوت عالٍ. كيف تتصرف؟', de: 'Ein verärgerter Kunde ruft an und beschwert sich lautstark. Wie reagieren Sie?', es: 'Un cliente enfadado llama y se queja a gritos. ¿Cómo reaccionas?', tr: 'Öfkeli bir müşteri arıyor ve yüksek sesle şikâyet ediyor. Nasıl tepki verirsin?', fa: 'مشتری عصبانی زنگ می‌زند و با صدای بلند شکایت می‌کند. چه می‌کنید؟', pt: 'Um cliente irritado liga e reclama alto. Como você reage?', ru: 'Звонит рассерженный клиент и громко жалуется. Как вы реагируете?', hi: 'गुस्साया ग्राहक फोन कर ज़ोर से शिकायत करता है। आप कैसे जवाब देंगे?', ur: 'ناراض گاہک فون کر کے اونچی آواز میں شکایت کرتا ہے۔ آپ کیا کریں گے؟', zh: '一位愤怒的客户来电大声抱怨，你如何应对？',
  },
  kauf_zahlen: {
    en: 'How good are you with numbers?', fr: 'Êtes-vous à l’aise avec les chiffres ?', ar: 'ما مدى إجادتك للتعامل مع الأرقام؟', de: 'Wie gut können Sie mit Zahlen umgehen?', es: '¿Qué tal se te dan los números?', tr: 'Sayılarla aran nasıl?', fa: 'با اعداد چقدر خوب کار می‌کنید؟', pt: 'Você é bom com números?', ru: 'Насколько хорошо вы работаете с числами?', hi: 'अंकों के साथ आप कितने अच्छे हैं?', ur: 'اعداد کے ساتھ آپ کتنے اچھے ہیں؟', zh: '你和数字打交道的能力如何？',
  },
  kauf_diskretion: {
    en: 'In the office you handle confidential data. What does that mean to you?', fr: 'Au bureau, vous manipulez des données confidentielles. Qu’est-ce que cela implique pour vous ?', ar: 'في المكتب تتعامل مع بيانات سرية. ماذا يعني ذلك بالنسبة لك؟', de: 'Im Büro arbeiten Sie mit vertraulichen Daten. Was bedeutet das für Sie?', es: 'En la oficina manejas datos confidenciales. ¿Qué significa eso para ti?', tr: 'Ofiste gizli verilerle çalışıyorsun. Bu senin için ne anlama geliyor?', fa: 'در دفتر با داده‌های محرمانه کار می‌کنید. این برای شما چه معنایی دارد؟', pt: 'No escritório você lida com dados confidenciais. O que isso significa para você?', ru: 'В офисе вы работаете с конфиденциальными данными. Что это значит для вас?', hi: 'ऑफिस में आप गोपनीय डेटा संभालते हैं। यह आपके लिए क्या मायने रखता है?', ur: 'دفتر میں آپ خفیہ ڈیٹا سنبھالتے ہیں۔ اس کا آپ کے لیے کیا مطلب ہے؟', zh: '在办公室你会接触机密数据，这对你意味着什么？',
  },
  log_genauigkeit: {
    en: 'Why is accuracy so important in the warehouse?', fr: 'Pourquoi la précision est-elle si importante en entrepôt ?', ar: 'لماذا الدقة مهمة جداً في المخزن؟', de: 'Warum ist Genauigkeit im Lager so wichtig?', es: '¿Por qué es tan importante la precisión en el almacén?', tr: 'Depoda doğruluk neden bu kadar önemli?', fa: 'چرا دقت در انبار این‌قدر مهم است؟', pt: 'Por que a precisão é tão importante no armazém?', ru: 'Почему точность так важна на складе?', hi: 'वेयरहाउस में सटीकता इतनी ज़रूरी क्यों है?', ur: 'گودام میں درستگی اتنی اہم کیوں ہے؟', zh: '为什么仓库工作中准确性如此重要？',
  },
  log_technik: {
    en: 'Do you have experience with forklifts, scanners or warehouse systems?', fr: 'Avez-vous de l’expérience avec les chariots élévateurs, scanners ou systèmes d’entrepôt ?', ar: 'هل لديك خبرة مع الرافعات الشوكية أو الماسحات أو أنظمة المخازن؟', de: 'Haben Sie Erfahrung mit Gabelstaplern, Scannern oder Lagersystemen?', es: '¿Tienes experiencia con carretillas, escáneres o sistemas de almacén?', tr: 'Forklift, el terminali veya depo sistemleriyle deneyimin var mı?', fa: 'با لیفتراک، اسکنر یا سیستم‌های انبار تجربه دارید؟', pt: 'Você tem experiência com empilhadeiras, scanners ou sistemas de armazém?', ru: 'Есть ли у вас опыт работы с погрузчиками, сканерами или складскими системами?', hi: 'क्या आपको फोर्कलिफ्ट, स्कैनर या वेयरहाउस सिस्टम का अनुभव है?', ur: 'کیا آپ کو فورک لفٹ، اسکینر یا گودام کے نظاموں کا تجربہ ہے؟', zh: '你有使用叉车、扫描枪或仓储系统的经验吗？',
  },
  log_koerper: {
    en: 'Warehouse work is physical. How do you keep going?', fr: 'Le travail en entrepôt est physique. Comment tenez-vous ?', ar: 'العمل في المخزن بدني. كيف تصمد؟', de: 'Die Arbeit im Lager ist körperlich. Wie halten Sie durch?', es: 'El trabajo de almacén es físico. ¿Cómo aguantas?', tr: 'Depo işi fizikseldir. Nasıl dayanırsın?', fa: 'کار انبار جسمی است. چطور دوام می‌آورید؟', pt: 'O trabalho no armazém é físico. Como você aguenta?', ru: 'Работа на складе физическая. Как вы выдерживаете?', hi: 'वेयरहाउस का काम शारीरिक है। आप कैसे टिके रहेंगे?', ur: 'گودام کا کام جسمانی ہے۔ آپ کیسے نبھائیں گے؟', zh: '仓库工作很耗体力，你如何坚持下来？',
  },
  log_schicht: {
    en: 'Can you work in a shift system, including early or night shifts?', fr: 'Pouvez-vous travailler en équipes, y compris tôt le matin ou de nuit ?', ar: 'هل يمكنك العمل بنظام الورديات، بما فيها الصباحية المبكرة أو الليلية؟', de: 'Können Sie im Schichtsystem arbeiten, auch früh oder nachts?', es: '¿Puedes trabajar por turnos, incluso de madrugada o de noche?', tr: 'Vardiyalı çalışabilir misin, sabah erken veya gece dahil?', fa: 'می‌توانید شیفتی کار کنید، حتی صبح زود یا شب؟', pt: 'Você pode trabalhar em turnos, inclusive de madrugada ou à noite?', ru: 'Можете ли вы работать посменно, в том числе рано утром или ночью?', hi: 'क्या आप शिफ्ट सिस्टम में काम कर सकते हैं, सुबह जल्दी या रात में भी?', ur: 'کیا آپ شفٹ سسٹم میں کام کر سکتے ہیں، صبح سویرے یا رات کو بھی؟', zh: '你能接受倒班工作吗？包括早班或夜班？',
  },
  log_fehler: {
    en: 'You notice a shipment was packed wrong — but not by you. What do you do?', fr: 'Vous remarquez qu’une expédition est mal emballée — mais pas par vous. Que faites-vous ?', ar: 'لاحظت أن شحنة عُبّئت بشكل خاطئ — لكن ليس من طرفك. ماذا تفعل؟', de: 'Sie merken, dass eine Lieferung falsch gepackt wurde — aber nicht von Ihnen. Was tun Sie?', es: 'Notas que un envío está mal embalado, pero no lo hiciste tú. ¿Qué haces?', tr: 'Bir sevkiyatın yanlış paketlendiğini fark ediyorsun — ama sen yapmadın. Ne yaparsın?', fa: 'متوجه می‌شوید محموله‌ای اشتباه بسته‌بندی شده — اما نه توسط شما. چه می‌کنید؟', pt: 'Você percebe que uma remessa foi embalada errada — mas não por você. O que faz?', ru: 'Вы замечаете, что груз упакован неверно — но не вами. Что делаете?', hi: 'आप देखते हैं कि एक शिपमेंट गलत पैक हुआ है — पर आपसे नहीं। आप क्या करेंगे?', ur: 'آپ دیکھتے ہیں کہ کوئی کھیپ غلط پیک ہوئی ہے — مگر آپ سے نہیں۔ آپ کیا کریں گے؟', zh: '你发现一批货装错了——但不是你装的，你会怎么做？',
  },
}

// ── International questions: full guidance per locale ──
const INTL = {
  intl_visum: {
    en: { translation: 'What is your current residence status? Do you need a visa?', why: 'They check whether you know the visa process yourself — an employer wants a candidate who manages the §16a procedure without creating work for them.', doSay: 'Show you know the exact steps (contract → embassy → §16a visa), the documents and the realistic timeline, and that you handle it yourself.', dontSay: 'Do not say "I don\'t know, can you help me with the visa?" — uncertainty about your own process is the top reason employers drop foreign applicants.' },
    fr: { translation: 'Quel est votre statut de séjour actuel ? Avez-vous besoin d’un visa ?', why: 'On vérifie si vous connaissez vous-même la procédure de visa — l’employeur veut un candidat qui gère le §16a sans lui créer du travail.', doSay: 'Montrez que vous connaissez les étapes exactes (contrat → ambassade → visa §16a), les documents et les délais réalistes, et que vous vous en occupez vous-même.', dontSay: 'Ne dites pas « je ne sais pas, pouvez-vous m’aider pour le visa ? » — l’incertitude sur votre propre procédure est la première raison d’écarter les candidats étrangers.' },
    ar: { translation: 'ما وضع إقامتك الحالي؟ هل تحتاج إلى تأشيرة؟', why: 'يُختبر إن كنت تعرف مسطرة التأشيرة بنفسك — يريد المشغّل مرشحاً يدبّر إجراءات §16a دون أن يثقل عليه.', doSay: 'أظهر معرفتك بالخطوات بدقة (العقد ← السفارة ← تأشيرة §16a) وبالوثائق والمدة الواقعية، وأنك تتكفل بذلك بنفسك.', dontSay: 'لا تقل «لا أعرف، هل يمكنكم مساعدتي في التأشيرة؟» — الجهل بمسطرتك الخاصة أول سبب لاستبعاد المرشحين الأجانب.' },
    de: { translation: 'Wie ist Ihr aktueller Aufenthaltsstatus? Brauchen Sie ein Visum?', why: 'Geprüft wird, ob du deinen Visumsprozess selbst kennst — der Betrieb will einen Bewerber, der das §16a-Verfahren ohne Mehraufwand für ihn managt.', doSay: 'Zeige, dass du die Schritte genau kennst (Vertrag → Botschaft → §16a-Visum), die Unterlagen und den realistischen Zeitrahmen — und dass du dich selbst kümmerst.', dontSay: 'Sag nicht „Ich weiß nicht, können Sie mir beim Visum helfen?" — Unsicherheit über den eigenen Prozess ist der häufigste Grund für Absagen an ausländische Bewerber.' },
    es: { translation: '¿Cuál es tu estatus de residencia actual? ¿Necesitas visado?', why: 'Comprueban si conoces tú mismo el proceso de visado: el empleador quiere un candidato que gestione el §16a sin darle trabajo extra.', doSay: 'Demuestra que conoces los pasos exactos (contrato → embajada → visado §16a), los documentos y los plazos realistas, y que te encargas tú.', dontSay: 'No digas «no sé, ¿me pueden ayudar con el visado?»: la inseguridad sobre tu propio proceso es la primera razón para descartar candidatos extranjeros.' },
    tr: { translation: 'Mevcut oturum durumun nedir? Vizeye ihtiyacın var mı?', why: 'Vize sürecini kendin bilip bilmediğin ölçülür — işveren, §16a sürecini kendisine iş çıkarmadan yöneten bir aday ister.', doSay: 'Adımları tam bildiğini göster (sözleşme → büyükelçilik → §16a vizesi), belgeleri ve gerçekçi süreyi anlat — ve bunu kendin hallettiğini söyle.', dontSay: "'Bilmiyorum, vizede bana yardım eder misiniz?' deme — kendi sürecini bilmemek, yabancı adayların elenmesinin bir numaralı nedenidir." },
    fa: { translation: 'وضعیت اقامت فعلی شما چیست؟ به ویزا نیاز دارید؟', why: 'می‌سنجند آیا خودتان روند ویزا را می‌شناسید — کارفرما داوطلبی می‌خواهد که روند §16a را بدون زحمت اضافه برای او مدیریت کند.', doSay: 'نشان دهید مراحل را دقیق می‌دانید (قرارداد ← سفارت ← ویزای §16a)، مدارک و زمان‌بندی واقع‌بینانه را بگویید و اینکه خودتان پیگیری می‌کنید.', dontSay: 'نگویید «نمی‌دانم، می‌توانید در ویزا کمکم کنید؟» — بی‌اطلاعی از روند خودتان مهم‌ترین دلیل حذف داوطلبان خارجی است.' },
    pt: { translation: 'Qual é seu status de residência atual? Você precisa de visto?', why: 'Avaliam se você mesmo conhece o processo de visto — o empregador quer um candidato que gerencie o §16a sem lhe criar trabalho.', doSay: 'Mostre que conhece os passos exatos (contrato → embaixada → visto §16a), os documentos e o prazo realista, e que você mesmo cuida disso.', dontSay: 'Não diga "não sei, vocês podem me ajudar com o visto?" — insegurança sobre o próprio processo é o principal motivo de descarte de candidatos estrangeiros.' },
    ru: { translation: 'Каков ваш текущий статус пребывания? Нужна ли вам виза?', why: 'Проверяют, знаете ли вы сами визовый процесс — работодателю нужен кандидат, который ведёт процедуру §16a, не создавая ему лишней работы.', doSay: 'Покажите, что точно знаете шаги (договор → посольство → виза §16a), документы и реалистичные сроки — и что занимаетесь этим сами.', dontSay: 'Не говорите «не знаю, поможете с визой?» — незнание собственного процесса — главная причина отказа иностранным кандидатам.' },
    hi: { translation: 'आपका मौजूदा निवास स्टेटस क्या है? क्या आपको वीज़ा चाहिए?', why: 'परखा जाता है कि आप खुद वीज़ा प्रक्रिया जानते हैं या नहीं — नियोक्ता ऐसा उम्मीदवार चाहता है जो §16a प्रक्रिया बिना उस पर बोझ डाले संभाले।', doSay: 'दिखाएँ कि आप सटीक कदम जानते हैं (अनुबंध → दूतावास → §16a वीज़ा), दस्तावेज़ और यथार्थ समय-सीमा बताएं, और कि आप खुद इसे संभालते हैं।', dontSay: '"मुझे नहीं पता, क्या आप वीज़ा में मदद करेंगे?" न कहें — अपनी ही प्रक्रिया की अनभिज्ञता विदेशी उम्मीदवारों के रिजेक्शन की सबसे बड़ी वजह है।' },
    ur: { translation: 'آپ کا موجودہ قیام کا اسٹیٹس کیا ہے؟ کیا آپ کو ویزا درکار ہے؟', why: 'جانچا جاتا ہے کہ آپ خود ویزا کا طریقہ کار جانتے ہیں یا نہیں — آجر ایسا امیدوار چاہتا ہے جو §16a کا عمل اس پر بوجھ ڈالے بغیر سنبھالے۔', doSay: 'دکھائیں کہ آپ کو صحیح مراحل معلوم ہیں (معاہدہ ← سفارت خانہ ← §16a ویزا)، دستاویزات اور حقیقت پسندانہ وقت بتائیں، اور یہ کہ آپ خود اسے سنبھالتے ہیں۔', dontSay: '"مجھے نہیں معلوم، کیا آپ ویزے میں مدد کریں گے؟" نہ کہیں — اپنے ہی عمل سے ناواقفیت غیر ملکی امیدواروں کے مسترد ہونے کی سب سے بڑی وجہ ہے۔' },
    zh: { translation: '你目前的居留状态是什么？需要签证吗？', why: '考察你是否了解自己的签证流程——雇主想要的是能自己搞定 §16a 手续、不给公司添麻烦的候选人。', doSay: '表明你清楚每个步骤（合同 → 使馆 → §16a 签证）、所需材料和现实的时间安排，并且由你自己负责办理。', dontSay: '不要说"我不知道，你们能帮我办签证吗？"——对自己流程的不确定是外国候选人被拒的头号原因。' },
  },
  intl_umzug: {
    en: { translation: 'How do you concretely picture your move to Germany?', why: 'They check whether your plan is realistic — housing, money, timing — or whether you might not show up on day one.', doSay: 'Give a concrete plan: arrival 2–4 weeks early, registration, bank account, a room already researched, savings for the first months.', dontSay: 'Avoid vague answers like "I will figure it out when I arrive" — the employer\'s biggest fear is an apprentice who never arrives.' },
    fr: { translation: 'Comment imaginez-vous concrètement votre déménagement en Allemagne ?', why: 'On vérifie si votre plan est réaliste — logement, argent, calendrier — ou si vous risquez de ne pas être là le premier jour.', doSay: 'Donnez un plan concret : arrivée 2 à 4 semaines avant, Anmeldung, compte bancaire, chambre déjà repérée, économies pour les premiers mois.', dontSay: 'Évitez le flou type « je verrai sur place » — la plus grande peur de l’employeur est un apprenti qui n’arrive jamais.' },
    ar: { translation: 'كيف تتصور انتقالك إلى ألمانيا بشكل ملموس؟', why: 'يُختبر مدى واقعية خطتك — السكن والمال والتوقيت — أو احتمال ألا تحضر في اليوم الأول.', doSay: 'قدّم خطة ملموسة: الوصول قبل البدء بأسبوعين إلى أربعة، التسجيل، حساب بنكي، غرفة بحثت عنها مسبقاً، ومدخرات للأشهر الأولى.', dontSay: 'تجنّب الإجابات الغامضة مثل «سأدبّر أموري عند الوصول» — أكبر مخاوف المشغّل متدرب لا يصل أبداً.' },
    de: { translation: 'Wie stellen Sie sich den Umzug nach Deutschland konkret vor?', why: 'Geprüft wird, ob dein Plan realistisch ist — Wohnen, Geld, Timing — oder ob du am ersten Tag vielleicht gar nicht erscheinst.', doSay: 'Nenne einen konkreten Plan: Einreise 2–4 Wochen vorher, Anmeldung, Bankkonto, ein bereits recherchiertes Zimmer, Rücklagen für die ersten Monate.', dontSay: 'Vermeide Vages wie „Das regle ich, wenn ich da bin" — die größte Angst des Betriebs ist ein Azubi, der nie ankommt.' },
    es: { translation: '¿Cómo te imaginas concretamente la mudanza a Alemania?', why: 'Comprueban si tu plan es realista —vivienda, dinero, calendario— o si podrías no presentarte el primer día.', doSay: 'Da un plan concreto: llegada 2–4 semanas antes, empadronamiento, cuenta bancaria, habitación ya buscada, ahorros para los primeros meses.', dontSay: 'Evita respuestas vagas como «ya lo resolveré al llegar»: el mayor miedo del empleador es un aprendiz que nunca llega.' },
    tr: { translation: "Almanya'ya taşınmayı somut olarak nasıl planlıyorsun?", why: 'Planının gerçekçi olup olmadığı ölçülür — konut, para, zamanlama — yoksa ilk gün ortaya çıkmama riski mi var.', doSay: 'Somut bir plan ver: 2–4 hafta önce varış, kayıt (Anmeldung), banka hesabı, önceden araştırılmış bir oda, ilk aylar için birikim.', dontSay: "'Oraya gidince hallederim' gibi belirsiz cevaplardan kaçın — işverenin en büyük korkusu hiç gelmeyen çıraktır." },
    fa: { translation: 'نقل مکان به آلمان را دقیقاً چگونه تصور می‌کنید؟', why: 'می‌سنجند برنامه شما واقع‌بینانه است یا نه — مسکن، پول، زمان‌بندی — یا اینکه شاید روز اول اصلاً نیایید.', doSay: 'برنامه مشخص بدهید: ورود ۲ تا ۴ هفته زودتر، ثبت‌نام، حساب بانکی، اتاقی که از قبل بررسی کرده‌اید، پس‌انداز برای ماه‌های اول.', dontSay: 'از پاسخ‌های مبهم مثل «وقتی رسیدم حلش می‌کنم» بپرهیزید — بزرگ‌ترین ترس کارفرما کارآموزی است که هرگز نمی‌رسد.' },
    pt: { translation: 'Como você imagina concretamente a mudança para a Alemanha?', why: 'Avaliam se seu plano é realista — moradia, dinheiro, cronograma — ou se você pode nem aparecer no primeiro dia.', doSay: 'Dê um plano concreto: chegada 2–4 semanas antes, registro, conta bancária, quarto já pesquisado, economias para os primeiros meses.', dontSay: 'Evite respostas vagas como "resolvo quando chegar" — o maior medo do empregador é um aprendiz que nunca chega.' },
    ru: { translation: 'Как вы конкретно представляете переезд в Германию?', why: 'Проверяют, реалистичен ли ваш план — жильё, деньги, сроки — или вы можете вовсе не появиться в первый день.', doSay: 'Назовите конкретный план: приезд за 2–4 недели, регистрация, банковский счёт, уже присмотренная комната, накопления на первые месяцы.', dontSay: 'Избегайте расплывчатого «разберусь на месте» — главный страх работодателя — ученик, который так и не приехал.' },
    hi: { translation: 'जर्मनी शिफ्ट होने की आपकी ठोस योजना क्या है?', why: 'परखा जाता है कि आपकी योजना यथार्थवादी है या नहीं — रहना, पैसा, समय — या कहीं आप पहले दिन आएँ ही नहीं।', doSay: 'ठोस योजना बताएं: 2–4 हफ्ते पहले पहुँचना, रजिस्ट्रेशन, बैंक खाता, पहले से खोजा कमरा, शुरुआती महीनों की बचत।', dontSay: '"वहाँ पहुँचकर देख लूँगा" जैसे अस्पष्ट जवाब न दें — नियोक्ता का सबसे बड़ा डर वह प्रशिक्षु है जो कभी पहुँचता ही नहीं।' },
    ur: { translation: 'جرمنی منتقل ہونے کا آپ کا ٹھوس منصوبہ کیا ہے؟', why: 'جانچا جاتا ہے کہ آپ کا منصوبہ حقیقت پسندانہ ہے یا نہیں — رہائش، پیسہ، وقت — یا کہیں آپ پہلے دن آئیں ہی نہ۔', doSay: 'ٹھوس منصوبہ بتائیں: 2–4 ہفتے پہلے آمد، رجسٹریشن، بینک اکاؤنٹ، پہلے سے تلاش کیا کمرہ، ابتدائی مہینوں کی بچت۔', dontSay: '"وہاں پہنچ کر دیکھ لوں گا" جیسے مبہم جواب نہ دیں — آجر کا سب سے بڑا خوف وہ اپرنٹس ہے جو کبھی پہنچتا ہی نہیں۔' },
    zh: { translation: '你对搬到德国有什么具体的计划？', why: '考察你的计划是否现实——住房、资金、时间安排——还是说你可能第一天就不出现。', doSay: '给出具体计划：提前 2–4 周抵达、户籍登记、银行开户、已经在找的房间、够头几个月用的积蓄。', dontSay: '避免"到了再说"这类模糊回答——雇主最大的恐惧就是学徒永远没来。' },
  },
  intl_familie: {
    en: { translation: 'What does your family say about you going to Germany?', why: 'They check emotional stability: family resistance is a common reason apprentices quit and go home.', doSay: 'Say your family supports the decision and you have discussed it together — support at home means you will stay.', dontSay: 'Do not hint at conflict ("they are against it, but I am going anyway") — it signals a risk you will drop out under pressure.' },
    fr: { translation: 'Que dit votre famille de votre départ en Allemagne ?', why: 'On vérifie votre stabilité émotionnelle : l’opposition familiale est une cause fréquente d’abandon et de retour au pays.', doSay: 'Dites que votre famille soutient la décision et que vous en avez discuté ensemble — un soutien à la maison signifie que vous resterez.', dontSay: 'Ne laissez pas entendre un conflit (« ils sont contre, mais j’y vais quand même ») — cela signale un risque d’abandon sous pression.' },
    ar: { translation: 'ما رأي عائلتك في ذهابك إلى ألمانيا؟', why: 'يُختبر استقرارك العاطفي: معارضة العائلة سبب شائع لتخلي المتدربين والعودة إلى الوطن.', doSay: 'قل إن عائلتك تدعم القرار وإنكم ناقشتموه معاً — الدعم العائلي يعني أنك ستبقى.', dontSay: 'لا تلمّح إلى خلاف («هم ضد ذلك لكنني ذاهب رغم ذلك») — فهذا مؤشر خطر أن تنسحب تحت الضغط.' },
    de: { translation: 'Was sagt Ihre Familie dazu, dass Sie nach Deutschland gehen?', why: 'Geprüft wird emotionale Stabilität: Widerstand der Familie ist ein häufiger Grund, warum Azubis abbrechen und zurückgehen.', doSay: 'Sag, dass deine Familie die Entscheidung unterstützt und ihr sie gemeinsam besprochen habt — Rückhalt zu Hause heißt: du bleibst.', dontSay: 'Deute keinen Konflikt an („Sie sind dagegen, aber ich gehe trotzdem") — das signalisiert Abbruchrisiko unter Druck.' },
    es: { translation: '¿Qué dice tu familia de que te vayas a Alemania?', why: 'Comprueban tu estabilidad emocional: la oposición familiar es una causa frecuente de abandono y regreso a casa.', doSay: 'Di que tu familia apoya la decisión y que la habéis hablado juntos: respaldo en casa significa que te quedarás.', dontSay: 'No insinúes conflicto («están en contra, pero voy igual»): señala riesgo de abandono bajo presión.' },
    tr: { translation: "Ailen Almanya'ya gitmene ne diyor?", why: 'Duygusal istikrar ölçülür: aile karşıtlığı, çırakların bırakıp eve dönmesinin yaygın bir nedenidir.', doSay: 'Ailenin kararı desteklediğini ve birlikte konuştuğunuzu söyle — evdeki destek, kalacağın anlamına gelir.', dontSay: "Çatışma ima etme ('karşılar ama yine de gidiyorum') — baskı altında bırakma riski sinyali verir." },
    fa: { translation: 'خانواده‌تان درباره رفتن شما به آلمان چه می‌گویند؟', why: 'ثبات عاطفی سنجیده می‌شود: مخالفت خانواده دلیل رایج رها کردن دوره و بازگشت به خانه است.', doSay: 'بگویید خانواده از تصمیم حمایت می‌کند و با هم درباره‌اش صحبت کرده‌اید — پشتیبانی خانه یعنی می‌مانید.', dontSay: 'به اختلاف اشاره نکنید («مخالف‌اند اما به‌هرحال می‌روم») — نشانه خطر انصراف زیر فشار است.' },
    pt: { translation: 'O que sua família acha de você ir para a Alemanha?', why: 'Avaliam estabilidade emocional: resistência da família é causa comum de aprendizes desistirem e voltarem para casa.', doSay: 'Diga que sua família apoia a decisão e que vocês conversaram juntos — apoio em casa significa que você vai ficar.', dontSay: 'Não insinue conflito ("são contra, mas vou assim mesmo") — sinaliza risco de desistência sob pressão.' },
    ru: { translation: 'Что говорит ваша семья о вашем отъезде в Германию?', why: 'Проверяют эмоциональную устойчивость: сопротивление семьи — частая причина, по которой ученики бросают всё и возвращаются домой.', doSay: 'Скажите, что семья поддерживает решение и вы обсудили его вместе — поддержка дома означает, что вы останетесь.', dontSay: 'Не намекайте на конфликт («они против, но я всё равно еду») — это сигнал риска срыва под давлением.' },
    hi: { translation: 'आपके जर्मनी जाने पर आपका परिवार क्या कहता है?', why: 'भावनात्मक स्थिरता परखी जाती है: परिवार का विरोध प्रशिक्षुओं के बीच में छोड़कर घर लौटने की आम वजह है।', doSay: 'कहें कि परिवार फैसले का समर्थन करता है और आपने मिलकर चर्चा की है — घर का साथ मतलब आप टिके रहेंगे।', dontSay: 'टकराव का संकेत न दें ("वे खिलाफ हैं, पर मैं फिर भी जा रहा हूँ") — यह दबाव में छोड़ने का जोखिम दिखाता है।' },
    ur: { translation: 'آپ کے جرمنی جانے پر آپ کے گھر والے کیا کہتے ہیں؟', why: 'جذباتی استحکام جانچا جاتا ہے: خاندان کی مخالفت اپرنٹس کے بیچ میں چھوڑ کر واپس جانے کی عام وجہ ہے۔', doSay: 'کہیں کہ گھر والے فیصلے کی حمایت کرتے ہیں اور آپ نے مل کر بات کی ہے — گھر کا سہارا مطلب آپ ٹکے رہیں گے۔', dontSay: 'اختلاف کا اشارہ نہ دیں ("وہ خلاف ہیں مگر میں پھر بھی جا رہا ہوں") — یہ دباؤ میں چھوڑنے کے خطرے کی علامت ہے۔' },
    zh: { translation: '你的家人对你去德国怎么看？', why: '考察情绪稳定性：家人的反对是学徒中途放弃回国的常见原因。', doSay: '说明家人支持这个决定，而且是你们一起商量过的——家里的支持意味着你会坚持下来。', dontSay: '不要流露矛盾（"他们反对，但我还是要去"）——这是你在压力下可能退出的信号。' },
  },
  intl_heimweh: {
    en: { translation: 'What will you do when you get homesick?', why: 'A trap disguised as small talk: they check self-awareness and whether you have a concrete strategy, because homesickness is the number-one dropout reason among foreign apprentices.', doSay: 'Acknowledge homesickness is normal and give a 3-part plan: routine, building local contacts, regular calls home — plus proof you have coped away from home before.', dontSay: 'Do not claim "I never get homesick" (unbelievable) and do not get emotional about missing your family — both raise doubts.' },
    fr: { translation: 'Que ferez-vous quand vous aurez le mal du pays ?', why: 'Un piège déguisé en bavardage : on vérifie votre lucidité et votre stratégie concrète, car le mal du pays est la première cause d’abandon des apprentis étrangers.', doSay: 'Reconnaissez que c’est normal et donnez un plan en 3 points : routine, contacts sur place, appels réguliers à la famille — plus une preuve que vous avez déjà vécu loin de chez vous.', dontSay: 'Ne prétendez pas « je n’ai jamais le mal du pays » (peu crédible) et ne devenez pas émotif sur votre famille — les deux font douter.' },
    ar: { translation: 'ماذا ستفعل إذا شعرت بالحنين إلى الوطن؟', why: 'فخ في صورة حديث عادي: يُختبر وعيك الذاتي ووجود خطة ملموسة، فالحنين إلى الوطن هو السبب الأول لانسحاب المتدربين الأجانب.', doSay: 'اعترف بأن الحنين طبيعي وقدّم خطة من ثلاث نقاط: روتين ثابت، بناء علاقات محلياً، اتصالات منتظمة بالعائلة — مع دليل أنك عشت بعيداً من قبل.', dontSay: 'لا تدّعِ «لا أشعر بالحنين أبداً» (غير مقنع) ولا تنفعل عاطفياً بشأن عائلتك — كلاهما يثير الشك.' },
    de: { translation: 'Was machen Sie, wenn Sie Heimweh bekommen?', why: 'Eine als Smalltalk getarnte Falle: Geprüft werden Selbstreflexion und eine konkrete Strategie, denn Heimweh ist Abbruchgrund Nummer eins bei ausländischen Azubis.', doSay: 'Erkenne an, dass Heimweh normal ist, und nenne einen 3-Punkte-Plan: Routine, Kontakte vor Ort, regelmäßige Anrufe nach Hause — plus einen Beleg, dass du schon einmal weg von zu Hause zurechtgekommen bist.', dontSay: 'Behaupte nicht „Ich habe nie Heimweh" (unglaubwürdig) und werde nicht emotional beim Thema Familie — beides weckt Zweifel.' },
    es: { translation: '¿Qué harás cuando sientas nostalgia de casa?', why: 'Una trampa disfrazada de charla: comprueban tu autoconocimiento y si tienes una estrategia concreta, porque la nostalgia es la primera causa de abandono entre aprendices extranjeros.', doSay: 'Reconoce que la nostalgia es normal y da un plan de 3 puntos: rutina, contactos locales, llamadas regulares a casa — más una prueba de que ya has vivido lejos.', dontSay: 'No digas «yo nunca siento nostalgia» (increíble) ni te pongas emotivo con tu familia: ambas cosas generan dudas.' },
    tr: { translation: 'Memleket özlemi çekersen ne yapacaksın?', why: 'Sohbet gibi görünen bir tuzak: öz farkındalık ve somut bir strateji ölçülür, çünkü memleket özlemi yabancı çırakların bir numaralı bırakma nedenidir.', doSay: 'Özlemin normal olduğunu kabul et ve 3 adımlı plan ver: rutin, yerinde sosyal çevre, eve düzenli aramalar — ve daha önce evden uzak yaşayabildiğine dair bir kanıt.', dontSay: "'Ben hiç özlemem' deme (inandırıcı değil) ve ailen konusunda duygusallaşma — ikisi de şüphe uyandırır." },
    fa: { translation: 'اگر دلتنگ خانه شوید چه می‌کنید؟', why: 'دامی در قالب گپ‌وگفت: خودآگاهی و داشتن راهبرد مشخص سنجیده می‌شود، چون دلتنگی دلیل شماره یک انصراف کارآموزان خارجی است.', doSay: 'بپذیرید دلتنگی طبیعی است و برنامه سه‌بخشی بدهید: روتین، ساختن ارتباطات محلی، تماس منظم با خانه — به‌علاوه شاهدی که قبلاً دور از خانه دوام آورده‌اید.', dontSay: 'نگویید «من هرگز دلتنگ نمی‌شوم» (باورنکردنی) و درباره خانواده احساساتی نشوید — هر دو تردید ایجاد می‌کند.' },
    pt: { translation: 'O que você vai fazer quando sentir saudade de casa?', why: 'Uma armadilha disfarçada de conversa: avaliam autoconhecimento e se você tem estratégia concreta, pois a saudade é a causa número um de desistência entre aprendizes estrangeiros.', doSay: 'Reconheça que saudade é normal e dê um plano de 3 partes: rotina, contatos locais, ligações regulares para casa — e uma prova de que você já viveu longe antes.', dontSay: 'Não diga "eu nunca sinto saudade" (inacreditável) nem fique emotivo sobre a família — ambos geram dúvidas.' },
    ru: { translation: 'Что вы будете делать, когда затоскуете по дому?', why: 'Ловушка под видом светской беседы: проверяют самоанализ и наличие конкретной стратегии, ведь тоска по дому — причина номер один, по которой иностранные ученики бросают обучение.', doSay: 'Признайте, что тоска по дому — это нормально, и назовите план из трёх частей: режим, местные контакты, регулярные звонки домой — плюс доказательство, что вы уже справлялись вдали от дома.', dontSay: 'Не говорите «я никогда не скучаю» (неправдоподобно) и не поддавайтесь эмоциям о семье — и то и другое вызывает сомнения.' },
    hi: { translation: 'घर की याद आएगी तो आप क्या करेंगे?', why: 'बातचीत के भेस में एक जाल: आत्म-जागरूकता और ठोस रणनीति परखी जाती है, क्योंकि होमसिकनेस विदेशी प्रशिक्षुओं के ड्रॉपआउट की सबसे बड़ी वजह है।', doSay: 'मानें कि घर की याद स्वाभाविक है और 3-सूत्री योजना बताएं: दिनचर्या, स्थानीय संपर्क, घर पर नियमित कॉल — साथ में सबूत कि आप पहले भी घर से दूर रह चुके हैं।', dontSay: '"मुझे कभी घर की याद नहीं आती" न कहें (अविश्वसनीय) और परिवार को लेकर भावुक न हों — दोनों शक पैदा करते हैं।' },
    ur: { translation: 'گھر کی یاد آئے گی تو آپ کیا کریں گے؟', why: 'گفتگو کے بھیس میں ایک جال: خود آگاہی اور ٹھوس حکمتِ عملی جانچی جاتی ہے، کیونکہ گھر کی یاد غیر ملکی اپرنٹس کے چھوڑنے کی سب سے بڑی وجہ ہے۔', doSay: 'مانیں کہ گھر کی یاد فطری ہے اور تین نکاتی منصوبہ بتائیں: روٹین، مقامی روابط، گھر پر باقاعدہ کال — ساتھ ثبوت کہ آپ پہلے بھی گھر سے دور رہ چکے ہیں۔', dontSay: '"مجھے کبھی گھر کی یاد نہیں آتی" نہ کہیں (ناقابلِ یقین) اور خاندان کے بارے میں جذباتی نہ ہوں — دونوں شک پیدا کرتے ہیں۔' },
    zh: { translation: '想家的时候你会怎么办？', why: '一个伪装成闲聊的陷阱：考察自我认知和是否有具体对策，因为想家是外国学徒中途退出的头号原因。', doSay: '承认想家很正常，并给出三步计划：固定作息、主动建立本地社交、定期与家里通话——再加上你曾经独自在外生活过的证明。', dontSay: '不要说"我从不想家"（不可信），也不要谈到家人时情绪化——两者都会让人怀疑。' },
  },
}

for (const loc of LOCALES) {
  const file = join(root, 'messages', `${loc}.json`)
  const m = JSON.parse(readFileSync(file, 'utf8'))
  const ip = (m.interviewPrep = m.interviewPrep || {})

  ip.generalTab = UI[loc].generalTab
  ip.fieldsTitle = UI[loc].fieldsTitle

  ip.fields = ip.fields || {}
  for (const [key, byLoc] of Object.entries(FIELDS)) {
    const [name, why] = byLoc[loc]
    ip.fields[key] = { name, why }
  }

  ip.questions = ip.questions || {}
  for (const [id, byLoc] of Object.entries(TR)) {
    ip.questions[id] = { ...(ip.questions[id] || {}), translation: byLoc[loc] }
  }
  for (const [id, byLoc] of Object.entries(INTL)) {
    ip.questions[id] = { ...(ip.questions[id] || {}), ...byLoc[loc] }
  }

  writeFileSync(file, JSON.stringify(m, null, 2) + '\n', 'utf8')
  console.log(`✓ ${loc}: fields + ${Object.keys(TR).length} translations + ${Object.keys(INTL).length} intl sets`)
}
console.log('done')
