// i18n for the 4 additional Interview Prep fields (fahrer, bau, mfa,
// baecker): field name + "what they check" note and translations for the
// 20 new technical questions. Hand-written, all 12 locales, no API.
// Idempotent — merges into the existing interviewPrep namespace.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const LOCALES = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh']

const FIELDS = {
  fahrer: {
    en: ['Truck & Bus Driving', 'Technical question for professional driving — they check responsibility, respect for driving and rest rules, and whether you stay calm and reliable under time pressure.'],
    fr: ['Conduite poids lourd & bus', 'Question technique de la conduite professionnelle — on vérifie le sens des responsabilités, le respect des temps de conduite et de repos, et le calme sous la pression des délais.'],
    ar: ['سياقة الشاحنات والحافلات', 'سؤال تقني في السياقة المهنية — تُختبر روح المسؤولية واحترام أوقات القيادة والراحة والهدوء والموثوقية تحت ضغط المواعيد.'],
    de: ['Berufskraftfahrer', 'Fachfrage aus dem Fahrberuf — geprüft werden Verantwortungsbewusstsein, Respekt vor Lenk- und Ruhezeiten und ob du unter Termindruck ruhig und zuverlässig bleibst.'],
    es: ['Conducción de camión y bus', 'Pregunta técnica de la conducción profesional: comprueban responsabilidad, respeto por los tiempos de conducción y descanso, y calma y fiabilidad bajo presión de plazos.'],
    tr: ['Kamyon ve otobüs şoförlüğü', 'Profesyonel sürücülükten teknik soru — sorumluluk bilinci, sürüş ve dinlenme sürelerine saygı ve zaman baskısı altında sakin ve güvenilir kalıp kalmadığın ölçülür.'],
    fa: ['رانندگی کامیون و اتوبوس', 'سؤال فنی رانندگی حرفه‌ای — حس مسئولیت، رعایت زمان‌های رانندگی و استراحت و آرامش و قابل‌اعتماد بودن زیر فشار زمانی سنجیده می‌شود.'],
    pt: ['Motorista de caminhão e ônibus', 'Pergunta técnica da condução profissional — avaliam responsabilidade, respeito aos tempos de direção e descanso, e calma e confiabilidade sob pressão de prazos.'],
    ru: ['Водитель грузовика и автобуса', 'Профильный вопрос профессионального вождения — проверяют ответственность, соблюдение режима труда и отдыха и способность оставаться спокойным и надёжным под давлением сроков.'],
    hi: ['ट्रक व बस ड्राइविंग', 'पेशेवर ड्राइविंग का तकनीकी सवाल — ज़िम्मेदारी, ड्राइविंग व आराम के नियमों का पालन और समय के दबाव में शांत, भरोसेमंद रहना परखा जाता है।'],
    ur: ['ٹرک اور بس ڈرائیونگ', 'پیشہ ورانہ ڈرائیونگ کا تکنیکی سوال — ذمہ داری، ڈرائیونگ اور آرام کے اوقات کی پابندی اور وقت کے دباؤ میں پرسکون اور قابلِ اعتماد رہنا جانچا جاتا ہے۔'],
    zh: ['卡车与巴士驾驶', '职业驾驶领域的专业问题——考察责任心、对驾驶与休息时间规定的遵守，以及在时间压力下能否保持冷静可靠。'],
  },
  bau: {
    en: ['Construction', 'Technical question for construction — they check physical readiness, safety awareness on site and whether you fit into a rough, tight-knit team.'],
    fr: ['Bâtiment & travaux publics', 'Question technique du bâtiment — on vérifie la condition physique, la conscience de la sécurité sur chantier et l’intégration dans une équipe soudée.'],
    ar: ['البناء والأشغال', 'سؤال تقني في البناء — تُختبر الجاهزية البدنية والوعي بالسلامة في الورش والاندماج في فريق متماسك.'],
    de: ['Bau', 'Fachfrage vom Bau — geprüft werden körperliche Belastbarkeit, Sicherheitsbewusstsein auf der Baustelle und ob du in ein eingeschworenes Team passt.'],
    es: ['Construcción', 'Pregunta técnica de la construcción: comprueban preparación física, conciencia de seguridad en obra y si encajas en un equipo unido.'],
    tr: ['İnşaat', 'İnşaat alanından teknik soru — fiziksel hazırlık, şantiyede güvenlik bilinci ve sıkı bir ekibe uyum sağlayıp sağlamadığın ölçülür.'],
    fa: ['ساختمان', 'سؤال فنی حوزه ساختمان — آمادگی جسمانی، آگاهی ایمنی در کارگاه و جا افتادن در یک تیم منسجم سنجیده می‌شود.'],
    pt: ['Construção civil', 'Pergunta técnica da construção — avaliam preparo físico, consciência de segurança na obra e se você se encaixa numa equipe unida.'],
    ru: ['Стройка', 'Профильный вопрос со стройки — проверяют физическую готовность, понимание безопасности на площадке и умение вписаться в сплочённую бригаду.'],
    hi: ['निर्माण (कंस्ट्रक्शन)', 'निर्माण क्षेत्र का तकनीकी सवाल — शारीरिक तैयारी, साइट पर सुरक्षा की समझ और एकजुट टीम में घुलना-मिलना परखा जाता है।'],
    ur: ['تعمیرات', 'تعمیرات کے شعبے کا تکنیکی سوال — جسمانی تیاری، سائٹ پر حفاظتی شعور اور جُڑی ہوئی ٹیم میں گھل مل جانا جانچا جاتا ہے۔'],
    zh: ['建筑施工', '建筑领域的专业问题——考察身体素质、工地安全意识，以及能否融入一个紧密协作的团队。'],
  },
  mfa: {
    en: ['Medical Practice Assistant (MFA)', 'Technical question for medical practice work — they check empathy with patients, hygiene basics, absolute confidentiality and calm multitasking at the front desk.'],
    fr: ['Assistant(e) médical(e) (MFA)', 'Question technique du travail en cabinet médical — on vérifie l’empathie avec les patients, les bases d’hygiène, la confidentialité absolue et le calme dans le multitâche à l’accueil.'],
    ar: ['مساعد طبي (MFA)', 'سؤال تقني في العمل بعيادة طبية — يُختبر التعاطف مع المرضى وأساسيات النظافة والسرية التامة والهدوء في تعدد المهام بالاستقبال.'],
    de: ['Medizinische Fachangestellte (MFA)', 'Fachfrage aus der Arztpraxis — geprüft werden Empathie mit Patienten, Hygiene-Grundlagen, absolute Verschwiegenheit und ruhiges Multitasking am Empfang.'],
    es: ['Asistente médico (MFA)', 'Pregunta técnica del trabajo en consulta médica: comprueban empatía con los pacientes, bases de higiene, confidencialidad absoluta y calma en el multitasking de recepción.'],
    tr: ['Tıbbi asistanlık (MFA)', 'Muayenehane işinden teknik soru — hastalarla empati, hijyen temelleri, mutlak gizlilik ve resepsiyonda sakin çoklu görev becerisi ölçülür.'],
    fa: ['دستیار مطب (MFA)', 'سؤال فنی کار در مطب — همدلی با بیماران، اصول بهداشت، رازداری مطلق و چندوظیفگی آرام در پذیرش سنجیده می‌شود.'],
    pt: ['Assistente médico (MFA)', 'Pergunta técnica do trabalho em consultório — avaliam empatia com pacientes, noções de higiene, sigilo absoluto e multitarefa calma na recepção.'],
    ru: ['Ассистент врача (MFA)', 'Профильный вопрос работы в медпрактике — проверяют эмпатию к пациентам, основы гигиены, абсолютную конфиденциальность и спокойную многозадачность на ресепшене.'],
    hi: ['मेडिकल असिस्टेंट (MFA)', 'क्लिनिक कार्य का तकनीकी सवाल — मरीज़ों से सहानुभूति, स्वच्छता की बुनियाद, पूर्ण गोपनीयता और रिसेप्शन पर शांत मल्टीटास्किंग परखी जाती है।'],
    ur: ['میڈیکل اسسٹنٹ (MFA)', 'کلینک کے کام کا تکنیکی سوال — مریضوں سے ہمدردی، حفظانِ صحت کی بنیادیں، مکمل رازداری اور استقبالیہ پر پرسکون ملٹی ٹاسکنگ جانچی جاتی ہے۔'],
    zh: ['医疗诊所助理 (MFA)', '诊所工作的专业问题——考察对病人的同理心、卫生基础、绝对的保密意识以及前台的从容多任务能力。'],
  },
  baecker: {
    en: ['Bakery & Pastry', 'Technical question for the bakery trade — they check above all whether you can genuinely handle night work, plus precision and food hygiene.'],
    fr: ['Boulangerie & pâtisserie', 'Question technique de la boulangerie — on vérifie avant tout si vous supportez réellement le travail de nuit, plus la précision et l’hygiène alimentaire.'],
    ar: ['المخبزة والحلويات', 'سؤال تقني في مهنة المخبزة — يُختبر قبل كل شيء تحمّلك الفعلي للعمل الليلي، إضافة إلى الدقة ونظافة الأغذية.'],
    de: ['Bäckerei & Konditorei', 'Fachfrage aus dem Bäckerhandwerk — geprüft wird vor allem, ob du Nachtarbeit wirklich durchhältst, dazu Präzision und Lebensmittelhygiene.'],
    es: ['Panadería y pastelería', 'Pregunta técnica del oficio panadero: comprueban sobre todo si de verdad aguantas el trabajo nocturno, además de precisión e higiene alimentaria.'],
    tr: ['Fırıncılık ve pastacılık', 'Fırıncılık zanaatından teknik soru — her şeyden önce gece çalışmasına gerçekten dayanıp dayanamayacağın, ayrıca hassasiyet ve gıda hijyeni ölçülür.'],
    fa: ['نانوایی و قنادی', 'سؤال فنی حرفه نانوایی — پیش از همه تحمل واقعی کار شبانه، سپس دقت و بهداشت مواد غذایی سنجیده می‌شود.'],
    pt: ['Padaria e confeitaria', 'Pergunta técnica do ofício de padeiro — avaliam sobretudo se você realmente aguenta o trabalho noturno, além de precisão e higiene alimentar.'],
    ru: ['Пекарня и кондитерская', 'Профильный вопрос пекарского ремесла — прежде всего проверяют, действительно ли вы выдержите ночную работу, а также точность и пищевую гигиену.'],
    hi: ['बेकरी व पेस्ट्री', 'बेकरी पेशे का तकनीकी सवाल — सबसे पहले परखा जाता है कि आप वाकई रात के काम को निभा पाएँगे या नहीं, साथ में सटीकता और खाद्य स्वच्छता।'],
    ur: ['بیکری اور پیسٹری', 'بیکری پیشے کا تکنیکی سوال — سب سے پہلے جانچا جاتا ہے کہ آپ واقعی رات کے کام کو نبھا سکتے ہیں یا نہیں، ساتھ درستگی اور خوراک کی صفائی۔'],
    zh: ['烘焙糕点', '烘焙行业的专业问题——首先考察你是否真能长期承受夜间工作，其次是精确性和食品卫生。'],
  },
}

const TR = {
  fahrer_warum: {
    en: 'Why do you want to become a professional driver?', fr: 'Pourquoi voulez-vous devenir conducteur professionnel ?', ar: 'لماذا تريد أن تصبح سائقاً مهنياً؟', de: 'Warum möchten Sie Berufskraftfahrer werden?', es: '¿Por qué quieres ser conductor profesional?', tr: 'Neden profesyonel şoför olmak istiyorsun?', fa: 'چرا می‌خواهید راننده حرفه‌ای شوید؟', pt: 'Por que você quer ser motorista profissional?', ru: 'Почему вы хотите стать профессиональным водителем?', hi: 'आप पेशेवर ड्राइवर क्यों बनना चाहते हैं?', ur: 'آپ پیشہ ور ڈرائیور کیوں بننا چاہتے ہیں؟', zh: '你为什么想成为职业司机？',
  },
  fahrer_fuehrerschein: {
    en: 'Do you already have a driving licence, and how are your driving skills?', fr: 'Avez-vous déjà un permis, et quel est votre niveau de conduite ?', ar: 'هل لديك رخصة سياقة، وما مستواك في القيادة؟', de: 'Haben Sie schon einen Führerschein, und wie sind Ihre Fahrkenntnisse?', es: '¿Ya tienes carnet de conducir y qué tal conduces?', tr: 'Ehliyetin var mı, sürüş becerilerin nasıl?', fa: 'گواهینامه دارید و مهارت رانندگی‌تان چطور است؟', pt: 'Você já tem carteira de motorista e como são suas habilidades?', ru: 'Есть ли у вас уже права и каковы ваши навыки вождения?', hi: 'क्या आपके पास ड्राइविंग लाइसेंस है, और आपकी ड्राइविंग कैसी है?', ur: 'کیا آپ کے پاس ڈرائیونگ لائسنس ہے اور آپ کی ڈرائیونگ کیسی ہے؟', zh: '你已经有驾照了吗？驾驶水平如何？',
  },
  fahrer_verantwortung: {
    en: 'As a driver you carry great responsibility. How do you handle it?', fr: 'En tant que conducteur, vous portez une grande responsabilité. Comment la gérez-vous ?', ar: 'كسائق تتحمل مسؤولية كبيرة. كيف تتعامل معها؟', de: 'Als Fahrer tragen Sie große Verantwortung. Wie gehen Sie damit um?', es: 'Como conductor llevas una gran responsabilidad. ¿Cómo la gestionas?', tr: 'Şoför olarak büyük sorumluluk taşıyorsun. Bununla nasıl başa çıkarsın?', fa: 'به‌عنوان راننده مسئولیت بزرگی دارید. چگونه با آن کنار می‌آیید؟', pt: 'Como motorista você carrega grande responsabilidade. Como lida com isso?', ru: 'Как водитель вы несёте большую ответственность. Как вы с ней справляетесь?', hi: 'ड्राइवर के रूप में आप पर बड़ी ज़िम्मेदारी है। आप इसे कैसे निभाएँगे?', ur: 'بطور ڈرائیور آپ پر بڑی ذمہ داری ہے۔ آپ اسے کیسے نبھائیں گے؟', zh: '作为司机你肩负重大责任，你如何应对？',
  },
  fahrer_alleinsein: {
    en: 'On the road you are often alone for many hours. Does that suit you?', fr: 'Sur la route, vous êtes souvent seul pendant des heures. Cela vous convient-il ?', ar: 'على الطريق تكون وحيداً لساعات طويلة. هل يناسبك ذلك؟', de: 'Unterwegs sind Sie oft viele Stunden allein. Passt das zu Ihnen?', es: 'En ruta pasas muchas horas solo. ¿Te encaja?', tr: 'Yolda çoğu zaman saatlerce yalnızsın. Bu sana uyar mı?', fa: 'در جاده اغلب ساعت‌ها تنها هستید. برایتان مناسب است؟', pt: 'Na estrada você fica muitas horas sozinho. Combina com você?', ru: 'В дороге вы часто много часов один. Вам это подходит?', hi: 'सड़क पर आप अक्सर घंटों अकेले रहेंगे। क्या यह आपको सूट करता है?', ur: 'سڑک پر آپ اکثر گھنٹوں اکیلے ہوں گے۔ کیا یہ آپ کو موافق ہے؟', zh: '在路上你常常要独自工作很多小时，你能适应吗？',
  },
  fahrer_zeiten: {
    en: 'Early departures, traffic jams, deadline pressure — how do you stay reliable and calm?', fr: 'Départs matinaux, bouchons, pression des délais — comment restez-vous fiable et calme ?', ar: 'انطلاقات مبكرة وازدحام وضغط مواعيد — كيف تبقى موثوقاً وهادئاً؟', de: 'Frühe Abfahrten, Staus, Termindruck — wie bleiben Sie zuverlässig und ruhig?', es: 'Salidas tempranas, atascos, presión de plazos: ¿cómo te mantienes fiable y tranquilo?', tr: 'Erken çıkışlar, trafik, termin baskısı — nasıl güvenilir ve sakin kalırsın?', fa: 'حرکت‌های صبح زود، ترافیک، فشار زمانی — چگونه قابل‌اعتماد و آرام می‌مانید؟', pt: 'Saídas cedo, engarrafamentos, pressão de prazos — como você se mantém confiável e calmo?', ru: 'Ранние выезды, пробки, давление сроков — как вы остаётесь надёжным и спокойным?', hi: 'सुबह जल्दी निकलना, जाम, समय का दबाव — आप भरोसेमंद और शांत कैसे रहेंगे?', ur: 'صبح سویرے روانگی، ٹریفک جام، وقت کا دباؤ — آپ قابلِ اعتماد اور پرسکون کیسے رہیں گے؟', zh: '凌晨出车、堵车、交期压力——你如何保持可靠和冷静？',
  },
  bau_warum: {
    en: 'Why do you want to work in construction?', fr: 'Pourquoi voulez-vous travailler dans le bâtiment ?', ar: 'لماذا تريد العمل في البناء؟', de: 'Warum wollen Sie auf dem Bau arbeiten?', es: '¿Por qué quieres trabajar en la construcción?', tr: 'Neden inşaatta çalışmak istiyorsun?', fa: 'چرا می‌خواهید در ساختمان کار کنید؟', pt: 'Por que você quer trabalhar na construção?', ru: 'Почему вы хотите работать на стройке?', hi: 'आप निर्माण क्षेत्र में क्यों काम करना चाहते हैं?', ur: 'آپ تعمیرات میں کیوں کام کرنا چاہتے ہیں؟', zh: '你为什么想在建筑行业工作？',
  },
  bau_koerperlich: {
    en: 'Site work is tough — weather, noise, heavy loads. Are you ready for it?', fr: 'Le chantier est dur — météo, bruit, charges lourdes. Y êtes-vous prêt ?', ar: 'العمل في الورش قاسٍ — طقس وضجيج وأحمال ثقيلة. هل أنت مستعد؟', de: 'Die Arbeit auf der Baustelle ist hart — Wetter, Lärm, schwere Lasten. Sind Sie bereit dafür?', es: 'La obra es dura: clima, ruido, cargas pesadas. ¿Estás preparado?', tr: 'Şantiye işi zordur — hava, gürültü, ağır yükler. Buna hazır mısın?', fa: 'کار در کارگاه سخت است — هوا، سروصدا، بارهای سنگین. آماده‌اید؟', pt: 'O trabalho na obra é duro — clima, barulho, cargas pesadas. Você está pronto?', ru: 'Работа на площадке тяжёлая — погода, шум, тяжести. Вы готовы?', hi: 'साइट का काम कठिन है — मौसम, शोर, भारी बोझ। क्या आप तैयार हैं?', ur: 'سائٹ کا کام سخت ہے — موسم، شور، بھاری وزن۔ کیا آپ تیار ہیں؟', zh: '工地工作很辛苦——风吹日晒、噪音、重物。你准备好了吗？',
  },
  bau_sicherheit: {
    en: 'What do you know about safety on a construction site?', fr: 'Que savez-vous de la sécurité sur un chantier ?', ar: 'ماذا تعرف عن السلامة في ورش البناء؟', de: 'Was wissen Sie über Sicherheit auf der Baustelle?', es: '¿Qué sabes sobre la seguridad en la obra?', tr: 'Şantiyede güvenlik hakkında ne biliyorsun?', fa: 'درباره ایمنی در کارگاه ساختمانی چه می‌دانید؟', pt: 'O que você sabe sobre segurança no canteiro de obras?', ru: 'Что вы знаете о безопасности на стройплощадке?', hi: 'निर्माण स्थल पर सुरक्षा के बारे में आप क्या जानते हैं?', ur: 'تعمیراتی سائٹ پر حفاظت کے بارے میں آپ کیا جانتے ہیں؟', zh: '你对工地安全了解多少？',
  },
  bau_team: {
    en: 'Many trades work together on site. How do you work in a team?', fr: 'Plusieurs corps de métier travaillent ensemble sur le chantier. Comment travaillez-vous en équipe ?', ar: 'في الورش تعمل حرف عديدة معاً. كيف تعمل ضمن فريق؟', de: 'Auf der Baustelle arbeiten viele Gewerke zusammen. Wie arbeiten Sie im Team?', es: 'En la obra colaboran muchos oficios. ¿Cómo trabajas en equipo?', tr: 'Şantiyede birçok zanaat birlikte çalışır. Ekipte nasıl çalışırsın?', fa: 'در کارگاه حرفه‌های زیادی با هم کار می‌کنند. در تیم چگونه کار می‌کنید؟', pt: 'Na obra muitos ofícios trabalham juntos. Como você trabalha em equipe?', ru: 'На стройке вместе работают многие специальности. Как вы работаете в команде?', hi: 'साइट पर कई ट्रेड साथ काम करते हैं। आप टीम में कैसे काम करते हैं?', ur: 'سائٹ پر کئی شعبے مل کر کام کرتے ہیں۔ آپ ٹیم میں کیسے کام کرتے ہیں؟', zh: '工地上多个工种协同作业，你如何进行团队合作？',
  },
  bau_plaene: {
    en: 'Can you read technical drawings or construction plans?', fr: 'Savez-vous lire des dessins techniques ou des plans de construction ?', ar: 'هل تستطيع قراءة الرسوم التقنية أو مخططات البناء؟', de: 'Können Sie technische Zeichnungen oder Baupläne lesen?', es: '¿Sabes leer planos técnicos o de construcción?', tr: 'Teknik çizim veya inşaat planı okuyabilir misin?', fa: 'می‌توانید نقشه‌های فنی یا ساختمانی بخوانید؟', pt: 'Você sabe ler desenhos técnicos ou plantas de construção?', ru: 'Умеете ли вы читать технические чертежи или строительные планы?', hi: 'क्या आप तकनीकी ड्रॉइंग या निर्माण योजनाएँ पढ़ सकते हैं?', ur: 'کیا آپ تکنیکی ڈرائنگ یا تعمیراتی نقشے پڑھ سکتے ہیں؟', zh: '你会看技术图纸或施工图吗？',
  },
  mfa_warum: {
    en: 'Why do you want to work in a medical practice?', fr: 'Pourquoi voulez-vous travailler dans un cabinet médical ?', ar: 'لماذا تريد العمل في عيادة طبية؟', de: 'Warum möchten Sie in einer Arztpraxis arbeiten?', es: '¿Por qué quieres trabajar en una consulta médica?', tr: 'Neden bir muayenehanede çalışmak istiyorsun?', fa: 'چرا می‌خواهید در مطب پزشکی کار کنید؟', pt: 'Por que você quer trabalhar em um consultório médico?', ru: 'Почему вы хотите работать в медицинской практике?', hi: 'आप डॉक्टर के क्लिनिक में क्यों काम करना चाहते हैं?', ur: 'آپ ڈاکٹر کے کلینک میں کیوں کام کرنا چاہتے ہیں؟', zh: '你为什么想在诊所工作？',
  },
  mfa_patienten: {
    en: 'A patient is nervous or afraid. How do you calm them down?', fr: 'Un patient est nerveux ou a peur. Comment le rassurez-vous ?', ar: 'مريض متوتر أو خائف. كيف تهدّئه؟', de: 'Ein Patient ist nervös oder hat Angst. Wie beruhigen Sie ihn?', es: 'Un paciente está nervioso o asustado. ¿Cómo lo calmas?', tr: 'Bir hasta gergin veya korkuyor. Onu nasıl sakinleştirirsin?', fa: 'بیماری مضطرب یا ترسیده است. چگونه آرامش می‌کنید؟', pt: 'Um paciente está nervoso ou com medo. Como você o acalma?', ru: 'Пациент нервничает или боится. Как вы его успокоите?', hi: 'मरीज़ घबराया या डरा हुआ है। आप उसे कैसे शांत करेंगे?', ur: 'مریض گھبرایا یا ڈرا ہوا ہے۔ آپ اسے کیسے پرسکون کریں گے؟', zh: '病人紧张或害怕时，你如何安抚？',
  },
  mfa_hygiene: {
    en: 'What role does hygiene play in the practice?', fr: 'Quel rôle joue l’hygiène au cabinet ?', ar: 'ما دور النظافة في العيادة؟', de: 'Welche Rolle spielt Hygiene in der Praxis?', es: '¿Qué papel juega la higiene en la consulta?', tr: 'Muayenehanede hijyenin rolü nedir?', fa: 'بهداشت در مطب چه نقشی دارد؟', pt: 'Qual o papel da higiene no consultório?', ru: 'Какую роль играет гигиена в практике?', hi: 'क्लिनिक में स्वच्छता की क्या भूमिका है?', ur: 'کلینک میں حفظانِ صحت کا کیا کردار ہے؟', zh: '卫生在诊所中扮演什么角色？',
  },
  mfa_diskretion: {
    en: 'What does medical confidentiality mean to you?', fr: 'Que signifie le secret médical pour vous ?', ar: 'ماذا يعني لك السر الطبي؟', de: 'Was bedeutet die ärztliche Schweigepflicht für Sie?', es: '¿Qué significa para ti el secreto médico?', tr: 'Tıbbi gizlilik senin için ne anlama geliyor?', fa: 'رازداری پزشکی برای شما چه معنایی دارد؟', pt: 'O que o sigilo médico significa para você?', ru: 'Что для вас означает врачебная тайна?', hi: 'चिकित्सीय गोपनीयता आपके लिए क्या मायने रखती है?', ur: 'طبی رازداری آپ کے لیے کیا معنی رکھتی ہے؟', zh: '医疗保密义务对你意味着什么？',
  },
  mfa_stress: {
    en: 'Full waiting room, the phone rings, an emergency walks in. What do you do?', fr: 'Salle d’attente pleine, le téléphone sonne, une urgence arrive. Que faites-vous ?', ar: 'قاعة الانتظار ممتلئة والهاتف يرن وحالة طارئة تدخل. ماذا تفعل؟', de: 'Volles Wartezimmer, das Telefon klingelt, ein Notfall kommt herein. Was machen Sie?', es: 'Sala de espera llena, suena el teléfono, entra una urgencia. ¿Qué haces?', tr: 'Bekleme salonu dolu, telefon çalıyor, bir acil vaka geliyor. Ne yaparsın?', fa: 'اتاق انتظار پر، تلفن زنگ می‌زند، یک اورژانسی وارد می‌شود. چه می‌کنید؟', pt: 'Sala de espera cheia, o telefone toca, chega uma emergência. O que você faz?', ru: 'Полная приёмная, звонит телефон, заходит экстренный пациент. Что делаете?', hi: 'भरा वेटिंग रूम, फोन बज रहा है, एक इमरजेंसी आ जाती है। आप क्या करेंगे?', ur: 'بھرا ویٹنگ روم، فون بج رہا ہے، ایک ایمرجنسی آ جاتی ہے۔ آپ کیا کریں گے؟', zh: '候诊室爆满、电话响个不停、又来了急诊病人，你怎么办？',
  },
  baecker_warum: {
    en: 'Why do you want to become a baker?', fr: 'Pourquoi voulez-vous devenir boulanger ?', ar: 'لماذا تريد أن تصبح خبازاً؟', de: 'Warum wollen Sie Bäcker werden?', es: '¿Por qué quieres ser panadero?', tr: 'Neden fırıncı olmak istiyorsun?', fa: 'چرا می‌خواهید نانوا شوید؟', pt: 'Por que você quer ser padeiro?', ru: 'Почему вы хотите стать пекарем?', hi: 'आप बेकर क्यों बनना चाहते हैं?', ur: 'آپ نان بائی کیوں بننا چاہتے ہیں؟', zh: '你为什么想成为面包师？',
  },
  baecker_nachtarbeit: {
    en: 'Bakers start at two or three in the morning. Can you sustain that long-term?', fr: 'Les boulangers commencent à deux ou trois heures du matin. Pouvez-vous tenir sur la durée ?', ar: 'يبدأ الخبازون العمل في الثانية أو الثالثة فجراً. هل تتحمل ذلك على المدى الطويل؟', de: 'Bäcker fangen nachts um zwei oder drei Uhr an. Schaffen Sie das dauerhaft?', es: 'Los panaderos empiezan a las dos o tres de la mañana. ¿Puedes aguantarlo a largo plazo?', tr: 'Fırıncılar gece iki-üçte başlar. Bunu uzun vadede sürdürebilir misin?', fa: 'نانواها ساعت دو یا سه بامداد شروع می‌کنند. می‌توانید در بلندمدت دوام بیاورید؟', pt: 'Padeiros começam às duas ou três da manhã. Você aguenta isso a longo prazo?', ru: 'Пекари начинают в два-три часа ночи. Выдержите ли вы это постоянно?', hi: 'बेकर रात दो-तीन बजे काम शुरू करते हैं। क्या आप लंबे समय तक यह निभा पाएँगे?', ur: 'نان بائی رات دو تین بجے کام شروع کرتے ہیں۔ کیا آپ طویل عرصے تک یہ نبھا سکیں گے؟', zh: '面包师凌晨两三点就开工，你能长期坚持吗？',
  },
  baecker_hygiene: {
    en: 'Why is hygiene so important in the bakery?', fr: 'Pourquoi l’hygiène est-elle si importante au fournil ?', ar: 'لماذا النظافة مهمة جداً في المخبزة؟', de: 'Warum ist Hygiene in der Backstube so wichtig?', es: '¿Por qué es tan importante la higiene en el obrador?', tr: 'Fırında hijyen neden bu kadar önemli?', fa: 'چرا بهداشت در نانوایی این‌قدر مهم است؟', pt: 'Por que a higiene é tão importante na padaria?', ru: 'Почему гигиена так важна в пекарне?', hi: 'बेकरी में स्वच्छता इतनी ज़रूरी क्यों है?', ur: 'بیکری میں صفائی اتنی اہم کیوں ہے؟', zh: '为什么烘焙坊的卫生如此重要？',
  },
  baecker_handwerk: {
    en: 'Have you baked before or worked in a kitchen?', fr: 'Avez-vous déjà fait de la boulangerie ou travaillé en cuisine ?', ar: 'هل سبق أن خبزت أو عملت في مطبخ؟', de: 'Haben Sie schon einmal gebacken oder in einer Küche gearbeitet?', es: '¿Has horneado antes o trabajado en una cocina?', tr: 'Daha önce ekmek/pasta yaptın mı veya mutfakta çalıştın mı?', fa: 'قبلاً نان یا شیرینی پخته‌اید یا در آشپزخانه کار کرده‌اید؟', pt: 'Você já assou antes ou trabalhou em uma cozinha?', ru: 'Вы раньше пекли или работали на кухне?', hi: 'क्या आपने पहले बेकिंग की है या किचन में काम किया है?', ur: 'کیا آپ نے پہلے بیکنگ کی ہے یا کچن میں کام کیا ہے؟', zh: '你以前烤过面包或在厨房工作过吗？',
  },
  baecker_praezision: {
    en: 'In baking, quantities and timings must be exact. Are you a precise person?', fr: 'En boulangerie, les quantités et les temps doivent être exacts. Êtes-vous quelqu’un de précis ?', ar: 'في الخَبز تُحسب المقادير والأوقات بدقة. هل أنت شخص دقيق؟', de: 'Beim Backen zählen Mengen und Zeiten genau. Sind Sie ein genauer Mensch?', es: 'Al hornear, cantidades y tiempos deben ser exactos. ¿Eres una persona precisa?', tr: 'Fırıncılıkta miktarlar ve süreler tam olmalı. Titiz biri misin?', fa: 'در پخت، مقادیر و زمان‌ها باید دقیق باشند. آدم دقیقی هستید؟', pt: 'Na panificação, quantidades e tempos devem ser exatos. Você é uma pessoa precisa?', ru: 'В выпечке количества и время должны быть точными. Вы точный человек?', hi: 'बेकिंग में मात्रा और समय बिल्कुल सटीक चाहिए। क्या आप सटीक इंसान हैं?', ur: 'بیکنگ میں مقدار اور وقت بالکل درست ہونے چاہئیں۔ کیا آپ درستگی پسند ہیں؟', zh: '烘焙中用量和时间必须精确，你是个严谨的人吗？',
  },
}

for (const loc of LOCALES) {
  const file = join(root, 'messages', `${loc}.json`)
  const m = JSON.parse(readFileSync(file, 'utf8'))
  const ip = (m.interviewPrep = m.interviewPrep || {})

  ip.fields = ip.fields || {}
  for (const [key, byLoc] of Object.entries(FIELDS)) {
    const [name, why] = byLoc[loc]
    ip.fields[key] = { name, why }
  }

  ip.questions = ip.questions || {}
  for (const [id, byLoc] of Object.entries(TR)) {
    ip.questions[id] = { ...(ip.questions[id] || {}), translation: byLoc[loc] }
  }

  writeFileSync(file, JSON.stringify(m, null, 2) + '\n', 'utf8')
  console.log(`✓ ${loc}: 4 fields + ${Object.keys(TR).length} translations`)
}
console.log('done')
