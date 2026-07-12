// landing.tools.{ausbSalary,license,healthInsurance,taxRefund}.name/desc in
// all 12 message files — used by the tools hub, nav, dashboard sidebar and
// RelatedTools cards. Hand-written, no API. Idempotent.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const TOOLS = {
  ausbSalary: {
    en: ['Ausbildung Salary Explorer', 'What 24 apprenticeships really pay — per year, net, and after graduation.'],
    fr: ['Salaires en Ausbildung', 'Ce que 24 formations paient vraiment — par année, en net, et après le diplôme.'],
    ar: ['رواتب الأوسبيلدونغ', 'ما تدفعه 24 مهنة تكوين فعلياً — حسب السنة وبالصافي وبعد التخرج.'],
    de: ['Ausbildungsgehalt-Explorer', 'Was 24 Ausbildungen wirklich zahlen — pro Lehrjahr, netto und nach dem Abschluss.'],
    es: ['Salarios de Ausbildung', 'Lo que pagan realmente 24 formaciones: por año, en neto y tras graduarte.'],
    tr: ['Ausbildung maaş rehberi', '24 meslek eğitiminin gerçek maaşı — yıla göre, net ve mezuniyet sonrası.'],
    fa: ['حقوق آوسبیلدونگ', 'حقوق واقعی ۲۴ رشته کارآموزی — به تفکیک سال، خالص و پس از فارغ‌التحصیلی.'],
    pt: ['Salários de Ausbildung', 'O que 24 formações realmente pagam — por ano, líquido e após a formatura.'],
    ru: ['Зарплаты в Ausbildung', 'Сколько реально платят 24 профессии — по годам, нетто и после выпуска.'],
    hi: ['Ausbildung सैलरी एक्सप्लोरर', '24 अप्रेंटिसशिप की असली कमाई — साल दर साल, नेट और ग्रेजुएशन के बाद।'],
    ur: ['آؤسبلڈنگ تنخواہ ایکسپلورر', '24 اپرنٹس شپس کی اصل تنخواہ — سال بہ سال، نیٹ اور گریجویشن کے بعد۔'],
    zh: ['Ausbildung 工资查询', '24 个培训职业的真实工资——按学年、净收入及毕业后起薪。'],
  },
  license: {
    en: ['Driving Licence Checker', 'Is your licence valid in Germany? Exchange, exams, costs — by country.'],
    fr: ['Vérificateur de permis de conduire', 'Votre permis est-il valable en Allemagne ? Échange, examens, coûts — par pays.'],
    ar: ['فاحص رخصة السياقة', 'هل رخصتك صالحة في ألمانيا؟ التبديل والامتحانات والتكاليف — حسب البلد.'],
    de: ['Führerschein-Umtausch-Check', 'Gilt dein Führerschein in Deutschland? Umtausch, Prüfungen, Kosten — nach Land.'],
    es: ['Verificador de carnet de conducir', '¿Vale tu carnet en Alemania? Canje, exámenes y costes — por país.'],
    tr: ['Ehliyet dönüşüm kontrolü', 'Ehliyetin Almanya’da geçerli mi? Değişim, sınavlar, maliyet — ülkeye göre.'],
    fa: ['بررسی گواهینامه رانندگی', 'گواهینامه شما در آلمان معتبر است؟ تعویض، امتحان‌ها و هزینه‌ها — بر اساس کشور.'],
    pt: ['Verificador de carteira de motorista', 'Sua carteira vale na Alemanha? Troca, exames e custos — por país.'],
    ru: ['Проверка водительских прав', 'Действительны ли ваши права в Германии? Обмен, экзамены, расходы — по странам.'],
    hi: ['ड्राइविंग लाइसेंस चेकर', 'क्या आपका लाइसेंस जर्मनी में मान्य है? एक्सचेंज, परीक्षा, लागत — देश के अनुसार।'],
    ur: ['ڈرائیونگ لائسنس چیکر', 'کیا آپ کا لائسنس جرمنی میں کارآمد ہے؟ تبدیلی، امتحانات، اخراجات — ملک کے حساب سے۔'],
    zh: ['驾照转换查询', '你的驾照在德国有效吗？按国家查询换照、考试与费用。'],
  },
  healthInsurance: {
    en: ['Health Insurance Chooser', 'Which German insurance you need and its real monthly cost — in 2 questions.'],
    fr: ['Choisir son assurance santé', 'Quelle assurance allemande il vous faut et son coût mensuel réel — en 2 questions.'],
    ar: ['اختيار التأمين الصحي', 'أي تأمين ألماني تحتاج وكم تكلفته الشهرية الحقيقية — بسؤالين.'],
    de: ['Krankenversicherungs-Wahl', 'Welche Versicherung du brauchst und was sie wirklich kostet — in 2 Fragen.'],
    es: ['Elige tu seguro médico', 'Qué seguro alemán necesitas y su coste mensual real — en 2 preguntas.'],
    tr: ['Sağlık sigortası seçici', 'Hangi Alman sigortası gerekli ve gerçek aylık maliyeti — 2 soruda.'],
    fa: ['انتخاب بیمه درمانی', 'کدام بیمه آلمانی لازم دارید و هزینه ماهانه واقعی آن — با ۲ سؤال.'],
    pt: ['Escolha do seguro saúde', 'Qual seguro alemão você precisa e o custo mensal real — em 2 perguntas.'],
    ru: ['Подбор медстраховки', 'Какая страховка нужна в Германии и её реальная цена в месяц — за 2 вопроса.'],
    hi: ['हेल्थ इंश्योरेंस चूज़र', 'जर्मनी में कौन-सा बीमा चाहिए और असली मासिक लागत — 2 सवालों में।'],
    ur: ['ہیلتھ انشورنس چُوزر', 'جرمنی میں کون سا بیمہ درکار ہے اور اصل ماہانہ لاگت — 2 سوالوں میں۔'],
    zh: ['医保选择器', '两个问题告诉你需要哪种德国医保及真实月费。'],
  },
  taxRefund: {
    en: ['Tax Refund Calculator', 'The average German tax return brings ~€1,100 back. Estimate yours.'],
    fr: ['Calculateur de remboursement d’impôts', 'La déclaration allemande rapporte ~1 100 € en moyenne. Estimez le vôtre.'],
    ar: ['حاسبة استرجاع الضرائب', 'يعيد التصريح الضريبي الألماني نحو 1100 € في المتوسط. قدّر استرجاعك.'],
    de: ['Steuererstattungs-Rechner', 'Die Steuererklärung bringt im Schnitt ~1.100 € zurück. Schätze deine Erstattung.'],
    es: ['Calculadora de devolución fiscal', 'La declaración alemana devuelve ~1.100 € de media. Estima la tuya.'],
    tr: ['Vergi iadesi hesaplayıcı', 'Alman vergi beyannamesi ortalama ~1.100 € iade getirir. Seninkini hesapla.'],
    fa: ['حاسبه استرداد مالیات', 'اظهارنامه مالیاتی آلمان به‌طور متوسط ~۱۱۰۰ € برمی‌گرداند. مال خود را تخمین بزنید.'],
    pt: ['Calculadora de restituição de imposto', 'A declaração alemã devolve ~1.100 € em média. Estime a sua.'],
    ru: ['Калькулятор возврата налогов', 'Налоговая декларация возвращает в среднем ~1 100 €. Оцените свой возврат.'],
    hi: ['टैक्स रिफंड कैलकुलेटर', 'जर्मन टैक्स रिटर्न औसतन ~€1,100 वापस दिलाता है। अपना अनुमान लगाएँ।'],
    ur: ['ٹیکس ریفنڈ کیلکولیٹر', 'جرمن ٹیکس ریٹرن اوسطاً ~1,100 € واپس دلاتا ہے۔ اپنا اندازہ لگائیں۔'],
    zh: ['退税计算器', '德国报税平均能退回约 1,100 欧元，算算你的退税额。'],
  },
}

const locales = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh']

for (const loc of locales) {
  const file = join(root, 'messages', `${loc}.json`)
  const m = JSON.parse(readFileSync(file, 'utf8'))
  m.landing = m.landing || {}
  m.landing.tools = m.landing.tools || {}
  for (const [key, byLoc] of Object.entries(TOOLS)) {
    const [name, desc] = byLoc[loc]
    m.landing.tools[key] = { name, desc }
  }
  writeFileSync(file, JSON.stringify(m, null, 2) + '\n', 'utf8')
  console.log(`✓ ${loc}`)
}
console.log('done')
