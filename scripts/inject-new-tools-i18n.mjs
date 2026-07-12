/**
 * Inject landing.tools.{key}.name/desc for the five 2026-07 tools into all 12
 * message files, so the nav dropdown, landing grid and RelatedTools can label
 * them in every locale. One-off; idempotent (overwrites the same keys).
 * Run: node scripts/inject-new-tools-i18n.mjs
 */
import fs from 'fs'

const T = {
  chancenkarte: {
    ar: { name: 'حاسبة بطاقة الفرص', desc: 'هل تبلغ 6 نقاط للهجرة إلى ألمانيا للبحث عن عمل؟ اختبر في دقيقة.' },
    fr: { name: 'Calculateur Chancenkarte', desc: 'Atteignez-vous les 6 points de la carte d’opportunité ? Testez en une minute.' },
    en: { name: 'Chancenkarte Calculator', desc: 'Do you reach the 6 points for Germany’s Opportunity Card? Check in one minute.' },
    de: { name: 'Chancenkarten-Rechner', desc: 'Erreichen Sie die 6 Punkte für die Chancenkarte? In einer Minute prüfen.' },
    es: { name: 'Calculadora Chancenkarte', desc: '¿Alcanzas los 6 puntos de la tarjeta de oportunidades? Compruébalo en un minuto.' },
    tr: { name: 'Chancenkarte Hesaplayıcı', desc: 'Fırsat Kartı için 6 puana ulaşıyor musunuz? Bir dakikada kontrol edin.' },
    fa: { name: 'ماشین‌حساب کارت فرصت', desc: 'آیا به ۶ امتیاز کارت فرصت آلمان می‌رسید؟ در یک دقیقه بسنجید.' },
    pt: { name: 'Calculadora Chancenkarte', desc: 'Você atinge os 6 pontos do Cartão de Oportunidades? Verifique em um minuto.' },
    ru: { name: 'Калькулятор Chancenkarte', desc: 'Набираете ли вы 6 баллов для Карты возможностей? Проверьте за минуту.' },
    hi: { name: 'Chancenkarte कैलकुलेटर', desc: 'क्या आप ऑपर्च्युनिटी कार्ड के 6 पॉइंट तक पहुँचते हैं? एक मिनट में जाँचें।' },
    ur: { name: 'Chancenkarte کیلکولیٹر', desc: 'کیا آپ مواقع کارڈ کے 6 پوائنٹس تک پہنچتے ہیں؟ ایک منٹ میں جانچیں۔' },
    zh: { name: '机会卡积分计算器', desc: '你达到德国机会卡所需的 6 分了吗？一分钟自测。' },
  },
  sperrkonto: {
    ar: { name: 'حاسبة الحساب المجمّد', desc: 'المبلغ الدقيق للحساب المجمّد وميزانية التأشيرة الكاملة لسنة 2026.' },
    fr: { name: 'Calculateur compte bloqué', desc: 'Le montant exact du Sperrkonto et votre budget visa complet pour 2026.' },
    en: { name: 'Sperrkonto Calculator', desc: 'Your exact blocked-account amount and full visa budget for 2026.' },
    de: { name: 'Sperrkonto-Rechner', desc: 'Der genaue Sperrbetrag und Ihr komplettes Visa-Budget für 2026.' },
    es: { name: 'Calculadora de cuenta bloqueada', desc: 'El importe exacto del Sperrkonto y tu presupuesto de visado 2026.' },
    tr: { name: 'Sperrkonto Hesaplayıcı', desc: '2026 için tam bloke hesap tutarınız ve eksiksiz vize bütçeniz.' },
    fa: { name: 'ماشین‌حساب حساب مسدود', desc: 'مبلغ دقیق حساب مسدود و بودجه کامل ویزای شما برای ۲۰۲۶.' },
    pt: { name: 'Calculadora de conta bloqueada', desc: 'O valor exato do Sperrkonto e seu orçamento completo de visto para 2026.' },
    ru: { name: 'Калькулятор Sperrkonto', desc: 'Точная сумма блокированного счёта и полный визовый бюджет на 2026 год.' },
    hi: { name: 'Sperrkonto कैलकुलेटर', desc: '2026 के लिए ब्लॉक्ड अकाउंट की सटीक राशि और पूरा वीज़ा बजट।' },
    ur: { name: 'Sperrkonto کیلکولیٹر', desc: '2026 کے لیے بلاکڈ اکاؤنٹ کی درست رقم اور مکمل ویزا بجٹ۔' },
    zh: { name: '冻结账户计算器', desc: '2026 年冻结账户的确切金额与完整签证预算。' },
  },
  bruttoNetto: {
    ar: { name: 'حاسبة الراتب الصافي', desc: 'كم يتبقى فعلاً من راتبك الألماني بعد الضرائب والتأمينات؟' },
    fr: { name: 'Calculateur Brut → Net', desc: 'Ce qui reste vraiment de votre salaire allemand après impôts et cotisations.' },
    en: { name: 'Brutto → Netto Calculator', desc: 'What is really left of a German salary after taxes and contributions.' },
    de: { name: 'Brutto-Netto-Rechner', desc: 'Was vom deutschen Gehalt nach Steuern und Abgaben wirklich übrig bleibt.' },
    es: { name: 'Calculadora Bruto → Neto', desc: 'Lo que de verdad queda de un sueldo alemán tras impuestos y cotizaciones.' },
    tr: { name: 'Brüt → Net Hesaplayıcı', desc: 'Alman maaşından vergi ve kesintilerden sonra gerçekte ne kalıyor.' },
    fa: { name: 'ماشین‌حساب ناخالص ← خالص', desc: 'از حقوق آلمانی پس از مالیات و بیمه‌ها واقعاً چقدر می‌ماند؟' },
    pt: { name: 'Calculadora Bruto → Líquido', desc: 'O que realmente sobra de um salário alemão após impostos e contribuições.' },
    ru: { name: 'Калькулятор Брутто → Нетто', desc: 'Сколько реально остаётся от немецкой зарплаты после налогов и взносов.' },
    hi: { name: 'Brutto → Netto कैलकुलेटर', desc: 'टैक्स और कटौतियों के बाद जर्मन सैलरी से असल में कितना बचता है।' },
    ur: { name: 'Brutto → Netto کیلکولیٹر', desc: 'ٹیکس اور کٹوتیوں کے بعد جرمن تنخواہ سے اصل میں کتنا بچتا ہے۔' },
    zh: { name: '税前→税后工资计算器', desc: '德国工资扣完税和社保后，实际到手多少？' },
  },
  anerkennung: {
    ar: { name: 'مساعد الاعتراف بالشهادات', desc: 'أي جهة تعترف بشهادتك في ألمانيا؟ الإجراء والتكاليف والمدة.' },
    fr: { name: 'Assistant Anerkennung', desc: 'Quelle autorité reconnaît votre diplôme en Allemagne ? Procédure, coûts, délais.' },
    en: { name: 'Anerkennung Wizard', desc: 'Which authority recognises your qualification in Germany — procedure, costs, timeline.' },
    de: { name: 'Anerkennungs-Assistent', desc: 'Welche Stelle Ihren Abschluss anerkennt — Verfahren, Kosten, Dauer.' },
    es: { name: 'Asistente Anerkennung', desc: '¿Qué autoridad reconoce tu título en Alemania? Procedimiento, costes y plazos.' },
    tr: { name: 'Anerkennung Sihirbazı', desc: 'Diplomanızı Almanya’da hangi makam tanır — prosedür, maliyet, süre.' },
    fa: { name: 'دستیار Anerkennung', desc: 'کدام نهاد مدرک شما را در آلمان می‌شناسد — روند، هزینه‌ها و زمان.' },
    pt: { name: 'Assistente Anerkennung', desc: 'Qual autoridade reconhece seu diploma na Alemanha — procedimento, custos, prazos.' },
    ru: { name: 'Мастер Anerkennung', desc: 'Какая инстанция признаёт ваш диплом в Германии — процедура, стоимость, сроки.' },
    hi: { name: 'Anerkennung विज़ार्ड', desc: 'जर्मनी में आपकी योग्यता किस अथॉरिटी से मान्य होगी — प्रक्रिया, लागत, समय।' },
    ur: { name: 'Anerkennung وزرڈ', desc: 'جرمنی میں آپ کی قابلیت کون سی اتھارٹی تسلیم کرے گی — طریقہ، لاگت، دورانیہ۔' },
    zh: { name: '学历认证向导', desc: '你的学历该由德国哪家机构认证——流程、费用与时长。' },
  },
  allTools: {
    ar: { name: 'كل الأدوات', desc: 'كل الحاسبات والقوائم في صفحة واحدة.' },
    fr: { name: 'Tous les outils', desc: 'Tous les calculateurs et checklists sur une page.' },
    en: { name: 'All tools', desc: 'Every calculator and checklist on one page.' },
    de: { name: 'Alle Tools', desc: 'Alle Rechner und Checklisten auf einer Seite.' },
    es: { name: 'Todas las herramientas', desc: 'Todas las calculadoras y checklists en una página.' },
    tr: { name: 'Tüm araçlar', desc: 'Tüm hesaplayıcılar ve kontrol listeleri tek sayfada.' },
    fa: { name: 'همه ابزارها', desc: 'همه ماشین‌حساب‌ها و چک‌لیست‌ها در یک صفحه.' },
    pt: { name: 'Todas as ferramentas', desc: 'Todas as calculadoras e checklists em uma página.' },
    ru: { name: 'Все инструменты', desc: 'Все калькуляторы и чек-листы на одной странице.' },
    hi: { name: 'सभी टूल', desc: 'सभी कैलकुलेटर और चेकलिस्ट एक पेज पर।' },
    ur: { name: 'تمام ٹولز', desc: 'تمام کیلکولیٹر اور چیک لسٹیں ایک صفحے پر۔' },
    zh: { name: '全部工具', desc: '所有计算器和清单，一页看全。' },
  },
  gradeConverter: {
    ar: { name: 'حاسبة المعدل الألماني', desc: 'حوّل معدلك من أي نظام عالمي إلى السلم الألماني 1.0–4.0 (المعادلة البافارية).' },
    fr: { name: 'Convertisseur de notes', desc: 'Convertissez vos notes vers l’échelle allemande 1,0–4,0 (formule bavaroise).' },
    en: { name: 'German Grade Calculator', desc: 'Convert your grades into the German 1.0–4.0 scale (Bavarian formula).' },
    de: { name: 'Notenumrechner', desc: 'Ausländische Noten in die deutsche Skala 1,0–4,0 umrechnen (bayerische Formel).' },
    es: { name: 'Conversor de notas alemanas', desc: 'Convierte tus notas a la escala alemana 1,0–4,0 (fórmula bávara).' },
    tr: { name: 'Alman Not Hesaplayıcı', desc: 'Notlarınızı Alman 1,0–4,0 ölçeğine çevirin (Bavyera formülü).' },
    fa: { name: 'مبدل نمره آلمانی', desc: 'نمره‌هایتان را به مقیاس آلمانی ۱٫۰–۴٫۰ تبدیل کنید (فرمول باواریا).' },
    pt: { name: 'Conversor de notas alemãs', desc: 'Converta suas notas para a escala alemã 1,0–4,0 (fórmula bávara).' },
    ru: { name: 'Конвертер оценок', desc: 'Переведите свои оценки в немецкую шкалу 1,0–4,0 (баварская формула).' },
    hi: { name: 'जर्मन ग्रेड कैलकुलेटर', desc: 'अपने ग्रेड जर्मन 1.0–4.0 स्केल में बदलें (बवेरियन फ़ॉर्मूला)।' },
    ur: { name: 'جرمن گریڈ کیلکولیٹر', desc: 'اپنے گریڈ جرمن 1.0–4.0 اسکیل میں بدلیں (باویرین فارمولا)۔' },
    zh: { name: '德国成绩换算器', desc: '用巴伐利亚公式把你的成绩换算成德国 1.0–4.0 制。' },
  },
  cityComparator: {
    ar: { name: 'مقارنة المدن', desc: 'قارن تكلفة المعيشة بين مدينتين ألمانيتين جنباً إلى جنب.' },
    fr: { name: 'Comparateur de villes', desc: 'Comparez le coût de la vie de deux villes allemandes côte à côte.' },
    en: { name: 'City Comparator', desc: 'Compare two German cities’ living costs side by side.' },
    de: { name: 'Städtevergleich', desc: 'Die Lebenskosten zweier deutscher Städte im direkten Vergleich.' },
    es: { name: 'Comparador de ciudades', desc: 'Compara el coste de vida de dos ciudades alemanas lado a lado.' },
    tr: { name: 'Şehir Karşılaştırıcı', desc: 'İki Alman şehrinin yaşam maliyetini yan yana karşılaştırın.' },
    fa: { name: 'مقایسه‌گر شهرها', desc: 'هزینه زندگی دو شهر آلمان را کنار هم مقایسه کنید.' },
    pt: { name: 'Comparador de cidades', desc: 'Compare o custo de vida de duas cidades alemãs lado a lado.' },
    ru: { name: 'Сравнение городов', desc: 'Сравните стоимость жизни двух немецких городов бок о бок.' },
    hi: { name: 'सिटी कम्पेरेटर', desc: 'दो जर्मन शहरों की रहने की लागत आमने-सामने तुलना करें।' },
    ur: { name: 'شہر موازنہ ٹول', desc: 'دو جرمن شہروں کی رہائشی لاگت کا آمنے سامنے موازنہ کریں۔' },
    zh: { name: '城市对比器', desc: '并排对比两座德国城市的生活成本。' },
  },
}

const LOCALES = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh']
for (const loc of LOCALES) {
  const path = `messages/${loc}.json`
  const msgs = JSON.parse(fs.readFileSync(path, 'utf8'))
  msgs.landing = msgs.landing || {}
  msgs.landing.tools = msgs.landing.tools || {}
  let added = 0
  for (const [key, byLoc] of Object.entries(T)) {
    msgs.landing.tools[key] = byLoc[loc]
    added++
  }
  fs.writeFileSync(path, JSON.stringify(msgs, null, 2) + '\n')
  console.log(`${loc}: injected ${added} tool labels`)
}
