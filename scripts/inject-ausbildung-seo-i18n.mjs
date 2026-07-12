// Adds ausbJobs.seoSection.* (long-form crawlable copy + FAQ for the live
// Ausbildung board, rendered via ToolSeoSection with FAQPage JSON-LD) to
// all 12 message files. Hand-written translations — no API. Idempotent.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const SEO = {
  en: {
    title: 'Find an Ausbildung in Germany — live offers from the official job board',
    intro:
      "An Ausbildung is Germany's paid dual vocational training: you work in a company three to four days a week, attend vocational school the rest, and earn a salary from day one — typically €800–1,300 per month depending on the trade and year. After two to three and a half years you hold a recognized German qualification with excellent job prospects, because Germany is short of skilled workers in care, crafts, logistics, gastronomy and IT. Foreigners can apply: with a visa for vocational training (§16a AufenthG), non-EU candidates can move to Germany once they have a signed training contract.\n\nThis page searches the official job board of the Bundesagentur für Arbeit — over 170,000 live Ausbildung positions, with hundreds of new offers added every day. Filter by profession, city and radius, check what was published today, and apply directly on the official site. Before you apply, use our free tools to build a German-style CV and Anschreiben — most rejections happen because the application doesn't follow German conventions, not because of the candidate.",
    faqTitle: 'Frequently asked questions',
    faqs: [
      { q: 'Can foreigners get an Ausbildung in Germany?', a: 'Yes. Non-EU citizens can obtain a vocational training visa (§16a AufenthG) once they have a signed Ausbildung contract with a German employer, usually with proof of German at B1 level and financial means or a training salary that covers living costs.' },
      { q: 'How much does an Ausbildung pay?', a: 'Trainees earn from the first day — most trades pay between €800 and €1,300 gross per month in the first year, rising each year. Care, construction and industrial professions pay at the higher end; the legal minimum training wage in 2026 is around €680 for the first year.' },
      { q: 'What German level do I need for an Ausbildung?', a: 'Most employers and visa authorities expect B1, and B2 significantly improves your chances — especially in healthcare. Some technical employers accept A2 with a commitment to keep learning. Our free German course takes you from A1 to C1.' },
      { q: 'How do I apply for these offers from abroad?', a: 'Open the offer on the official Arbeitsagentur page and apply with a German-style application: Lebenslauf (CV), Anschreiben (cover letter) and certificates. Interviews are usually held online in German. Once you have a contract, you apply for the §16a visa at the German embassy.' },
    ],
  },
  fr: {
    title: "Trouver une Ausbildung en Allemagne — offres en direct du site officiel de l'emploi",
    intro:
      "L'Ausbildung est la formation professionnelle duale allemande, rémunérée : vous travaillez en entreprise trois à quatre jours par semaine, suivez l'école professionnelle le reste du temps, et touchez un salaire dès le premier jour — en général 800 à 1 300 € par mois selon le métier et l'année. Après deux à trois ans et demi, vous obtenez un diplôme allemand reconnu avec d'excellentes perspectives d'embauche, car l'Allemagne manque de main-d'œuvre qualifiée dans les soins, l'artisanat, la logistique, la restauration et l'informatique. Les étrangers peuvent postuler : avec le visa de formation professionnelle (§16a AufenthG), les candidats hors UE peuvent s'installer en Allemagne dès qu'ils ont un contrat de formation signé.\n\nCette page interroge le site officiel de l'Agence fédérale pour l'emploi (Bundesagentur für Arbeit) — plus de 170 000 places d'Ausbildung actives, avec des centaines de nouvelles offres chaque jour. Filtrez par métier, ville et rayon, consultez ce qui a été publié aujourd'hui, et postulez directement sur le site officiel. Avant de postuler, utilisez nos outils gratuits pour créer un CV allemand et un Anschreiben — la plupart des refus viennent d'une candidature qui ne respecte pas les conventions allemandes, pas du candidat.",
    faqTitle: 'Questions fréquentes',
    faqs: [
      { q: 'Un étranger peut-il faire une Ausbildung en Allemagne ?', a: "Oui. Les citoyens hors UE peuvent obtenir un visa de formation professionnelle (§16a AufenthG) dès qu'ils ont un contrat d'Ausbildung signé avec un employeur allemand, généralement avec un allemand niveau B1 et des moyens financiers ou un salaire de formation couvrant le coût de la vie." },
      { q: 'Combien gagne-t-on pendant une Ausbildung ?', a: "L'apprenti est payé dès le premier jour — la plupart des métiers versent entre 800 et 1 300 € brut par mois la première année, avec une augmentation chaque année. Les soins, le BTP et l'industrie paient le mieux ; le salaire minimum légal de formation est d'environ 680 € la première année en 2026." },
      { q: "Quel niveau d'allemand faut-il pour une Ausbildung ?", a: "La plupart des employeurs et des consulats attendent B1, et B2 augmente nettement vos chances — surtout dans la santé. Certains employeurs techniques acceptent A2 avec engagement de progresser. Notre cours d'allemand gratuit vous mène de A1 à C1." },
      { q: "Comment postuler à ces offres depuis l'étranger ?", a: "Ouvrez l'offre sur la page officielle de l'Arbeitsagentur et postulez avec un dossier à l'allemande : Lebenslauf (CV), Anschreiben (lettre de motivation) et diplômes. Les entretiens se font souvent en ligne, en allemand. Une fois le contrat signé, demandez le visa §16a à l'ambassade d'Allemagne." },
    ],
  },
  ar: {
    title: 'ابحث عن أوسبيلدونغ في ألمانيا — عروض مباشرة من موقع التوظيف الرسمي',
    intro:
      'الأوسبيلدونغ هو التكوين المهني المزدوج الألماني المدفوع الأجر: تعمل في شركة ثلاثة إلى أربعة أيام أسبوعياً وتدرس في المدرسة المهنية بقية الأيام، وتتقاضى راتباً من اليوم الأول — عادة بين 800 و1300 يورو شهرياً حسب المهنة والسنة. بعد سنتين إلى ثلاث سنوات ونصف تحصل على شهادة ألمانية معترف بها مع فرص توظيف ممتازة، لأن ألمانيا تعاني نقصاً في العمالة المؤهلة في التمريض والحرف واللوجستيك والمطاعم وتقنية المعلومات. يمكن للأجانب التقديم: بتأشيرة التكوين المهني (§16a AufenthG) يستطيع المرشحون من خارج الاتحاد الأوروبي الانتقال إلى ألمانيا بمجرد توقيع عقد التكوين.\n\nتبحث هذه الصفحة مباشرة في الموقع الرسمي لوكالة العمل الاتحادية (Bundesagentur für Arbeit) — أكثر من 170,000 مكان أوسبيلدونغ نشط، مع مئات العروض الجديدة يومياً. صفِّ حسب المهنة والمدينة ونطاق المسافة، واطّلع على ما نُشر اليوم، وقدّم مباشرة على الموقع الرسمي. قبل التقديم، استخدم أدواتنا المجانية لإنشاء سيرة ذاتية ألمانية وAnschreiben — فمعظم حالات الرفض سببها ملف ترشح لا يتبع الأعراف الألمانية، لا المرشح نفسه.',
    faqTitle: 'أسئلة شائعة',
    faqs: [
      { q: 'هل يمكن للأجنبي الحصول على أوسبيلدونغ في ألمانيا؟', a: 'نعم. يمكن لمواطني الدول خارج الاتحاد الأوروبي الحصول على تأشيرة التكوين المهني (§16a AufenthG) بمجرد توقيع عقد أوسبيلدونغ مع مشغّل ألماني، وعادة مع إثبات مستوى B1 في الألمانية وموارد مالية أو راتب تكوين يغطي تكاليف المعيشة.' },
      { q: 'كم يبلغ راتب الأوسبيلدونغ؟', a: 'يتقاضى المتدرب راتباً من اليوم الأول — معظم المهن تدفع بين 800 و1300 يورو إجمالي شهرياً في السنة الأولى، ويرتفع كل سنة. التمريض والبناء والصناعة تدفع أكثر؛ والحد الأدنى القانوني لراتب التكوين في 2026 نحو 680 يورو للسنة الأولى.' },
      { q: 'ما مستوى الألمانية المطلوب للأوسبيلدونغ؟', a: 'يتوقع معظم المشغّلين والقنصليات B1، ويزيد B2 حظوظك بوضوح — خاصة في المجال الصحي. بعض المشغّلين التقنيين يقبلون A2 مع التزام بمواصلة التعلم. دورتنا المجانية للألمانية تأخذك من A1 إلى C1.' },
      { q: 'كيف أقدّم على هذه العروض من خارج ألمانيا؟', a: 'افتح العرض على صفحة Arbeitsagentur الرسمية وقدّم بملف ألماني: Lebenslauf (سيرة ذاتية) وAnschreiben (رسالة تحفيز) والشهادات. تُجرى المقابلات غالباً أونلاين بالألمانية. وبعد توقيع العقد، تطلب تأشيرة §16a من السفارة الألمانية.' },
    ],
  },
  de: {
    title: 'Ausbildung in Deutschland finden — Live-Angebote der offiziellen Jobbörse',
    intro:
      'Die Ausbildung ist Deutschlands bezahlte duale Berufsausbildung: Drei bis vier Tage pro Woche arbeitest du im Betrieb, den Rest verbringst du in der Berufsschule — und verdienst vom ersten Tag an, je nach Beruf und Lehrjahr meist 800–1.300 € im Monat. Nach zwei bis dreieinhalb Jahren hast du einen anerkannten deutschen Abschluss mit hervorragenden Jobchancen, denn in Pflege, Handwerk, Logistik, Gastronomie und IT fehlen Fachkräfte. Auch aus dem Ausland ist die Bewerbung möglich: Mit dem Visum zur Berufsausbildung (§16a AufenthG) können Nicht-EU-Bewerber einreisen, sobald ein unterschriebener Ausbildungsvertrag vorliegt.\n\nDiese Seite durchsucht die offizielle Jobbörse der Bundesagentur für Arbeit — über 170.000 aktuelle Ausbildungsplätze, täglich kommen Hunderte neue hinzu. Filtere nach Beruf, Stadt und Umkreis, sieh dir die heute veröffentlichten Stellen an und bewirb dich direkt auf der offiziellen Seite. Nutze vorher unsere kostenlosen Tools für Lebenslauf und Anschreiben nach deutschen Standards — die meisten Absagen liegen an der Form der Bewerbung, nicht am Bewerber.',
    faqTitle: 'Häufige Fragen',
    faqs: [
      { q: 'Können Ausländer eine Ausbildung in Deutschland machen?', a: 'Ja. Nicht-EU-Bürger erhalten das Visum zur Berufsausbildung (§16a AufenthG), sobald ein unterschriebener Ausbildungsvertrag vorliegt — in der Regel mit Deutschkenntnissen auf B1-Niveau und gesicherter Finanzierung bzw. einer Ausbildungsvergütung, die den Lebensunterhalt deckt.' },
      { q: 'Wie viel verdient man in der Ausbildung?', a: 'Azubis verdienen ab dem ersten Tag — die meisten Berufe zahlen im ersten Jahr 800 bis 1.300 € brutto monatlich, mit jährlicher Steigerung. Pflege, Bau und Industrie zahlen am besten; die gesetzliche Mindestausbildungsvergütung liegt 2026 bei rund 680 € im ersten Jahr.' },
      { q: 'Welches Deutschniveau brauche ich für die Ausbildung?', a: 'Die meisten Betriebe und Visastellen erwarten B1, mit B2 steigen die Chancen deutlich — besonders in der Pflege. Manche technischen Betriebe akzeptieren A2 mit Lernbereitschaft. Unser kostenloser Deutschkurs führt von A1 bis C1.' },
      { q: 'Wie bewerbe ich mich aus dem Ausland auf diese Stellen?', a: 'Öffne die Stelle auf der offiziellen Arbeitsagentur-Seite und bewirb dich mit deutschen Unterlagen: Lebenslauf, Anschreiben und Zeugnissen. Vorstellungsgespräche finden meist online auf Deutsch statt. Mit dem Vertrag beantragst du das §16a-Visum bei der deutschen Botschaft.' },
    ],
  },
  es: {
    title: 'Encontrar una Ausbildung en Alemania — ofertas en vivo de la bolsa de empleo oficial',
    intro:
      'La Ausbildung es la formación profesional dual alemana, remunerada: trabajas en una empresa tres o cuatro días por semana, asistes a la escuela profesional el resto, y cobras desde el primer día — normalmente entre 800 y 1.300 € al mes según el oficio y el año. Tras dos a tres años y medio obtienes un título alemán reconocido con excelentes salidas laborales, porque Alemania carece de mano de obra cualificada en cuidados, oficios, logística, hostelería e informática. Los extranjeros pueden postular: con el visado de formación profesional (§16a AufenthG), los candidatos de fuera de la UE pueden mudarse a Alemania en cuanto firman el contrato de formación.\n\nEsta página busca en la bolsa de empleo oficial de la Bundesagentur für Arbeit — más de 170.000 plazas de Ausbildung activas, con cientos de ofertas nuevas cada día. Filtra por profesión, ciudad y radio, mira lo publicado hoy y postula directamente en el sitio oficial. Antes de postular, usa nuestras herramientas gratuitas para crear un CV alemán y un Anschreiben — la mayoría de los rechazos se deben a candidaturas que no siguen las convenciones alemanas, no al candidato.',
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      { q: '¿Puede un extranjero hacer una Ausbildung en Alemania?', a: 'Sí. Los ciudadanos de fuera de la UE pueden obtener el visado de formación profesional (§16a AufenthG) en cuanto tienen un contrato de Ausbildung firmado con un empleador alemán, normalmente con alemán B1 y medios económicos o un salario de formación que cubra el coste de vida.' },
      { q: '¿Cuánto se cobra durante una Ausbildung?', a: 'El aprendiz cobra desde el primer día — la mayoría de los oficios pagan entre 800 y 1.300 € brutos al mes el primer año, subiendo cada año. Cuidados, construcción e industria pagan más; el salario mínimo legal de formación en 2026 ronda los 680 € el primer año.' },
      { q: '¿Qué nivel de alemán necesito para una Ausbildung?', a: 'La mayoría de los empleadores y consulados esperan B1, y con B2 tus opciones mejoran mucho — sobre todo en sanidad. Algunos empleadores técnicos aceptan A2 con compromiso de seguir aprendiendo. Nuestro curso gratuito de alemán te lleva de A1 a C1.' },
      { q: '¿Cómo postulo a estas ofertas desde el extranjero?', a: 'Abre la oferta en la página oficial de la Arbeitsagentur y postula con un dossier al estilo alemán: Lebenslauf (CV), Anschreiben (carta de motivación) y certificados. Las entrevistas suelen ser online y en alemán. Con el contrato firmado, solicita el visado §16a en la embajada alemana.' },
    ],
  },
  tr: {
    title: "Almanya'da Ausbildung bul — resmî iş kurumundan canlı ilanlar",
    intro:
      "Ausbildung, Almanya'nın ücretli ikili meslek eğitimidir: Haftada üç-dört gün bir şirkette çalışır, kalan günlerde meslek okuluna gidersin ve ilk günden maaş alırsın — mesleğe ve yıla göre genelde ayda 800–1.300 €. İki ila üç buçuk yıl sonra, tanınmış bir Alman diplomasına sahip olursun; bakım, zanaat, lojistik, gastronomi ve BT alanlarında nitelikli eleman açığı olduğu için iş imkânları mükemmeldir. Yabancılar başvurabilir: Meslek eğitimi vizesiyle (§16a AufenthG) AB dışından adaylar, imzalı bir eğitim sözleşmesi olur olmaz Almanya'ya taşınabilir.\n\nBu sayfa, Federal İş Ajansı'nın (Bundesagentur für Arbeit) resmî iş ilanı havuzunda arama yapar — 170.000'den fazla aktif Ausbildung kadrosu, her gün yüzlerce yeni ilan. Mesleğe, şehre ve yarıçapa göre filtrele, bugün yayınlananlara bak ve doğrudan resmî sitede başvur. Başvurmadan önce ücretsiz araçlarımızla Alman standardında CV ve Anschreiben hazırla — retlerin çoğu adaydan değil, Alman kurallarına uymayan başvuru dosyasından kaynaklanır.",
    faqTitle: 'Sıkça sorulan sorular',
    faqs: [
      { q: "Yabancılar Almanya'da Ausbildung yapabilir mi?", a: 'Evet. AB dışı vatandaşlar, bir Alman işverenle imzalı Ausbildung sözleşmesi olduğunda meslek eğitimi vizesi (§16a AufenthG) alabilir — genellikle B1 Almanca ve geçimi karşılayan maddi imkân veya eğitim maaşı şartıyla.' },
      { q: 'Ausbildung sırasında ne kadar kazanılır?', a: 'Çırak ilk günden maaş alır — çoğu meslek ilk yıl ayda brüt 800–1.300 € öder ve her yıl artar. Bakım, inşaat ve sanayi en yüksek ödeyenlerdir; 2026 yasal asgari eğitim ücreti ilk yıl için yaklaşık 680 €.' },
      { q: 'Ausbildung için hangi Almanca seviyesi gerekir?', a: 'Çoğu işveren ve vize makamı B1 bekler; B2 şansını belirgin artırır — özellikle sağlıkta. Bazı teknik işverenler, öğrenmeye devam sözüyle A2 kabul eder. Ücretsiz Almanca kursumuz A1’den C1’e götürür.' },
      { q: 'Bu ilanlara yurt dışından nasıl başvururum?', a: 'İlanı resmî Arbeitsagentur sayfasında aç ve Alman usulü dosya ile başvur: Lebenslauf (CV), Anschreiben (motivasyon mektubu) ve belgeler. Mülakatlar genelde online ve Almanca yapılır. Sözleşme imzalanınca Alman büyükelçiliğinden §16a vizesi başvurusu yaparsın.' },
    ],
  },
  fa: {
    title: 'یافتن آوسبیلدونگ در آلمان — آگهی‌های زنده از سامانه رسمی کاریابی',
    intro:
      'آوسبیلدونگ همان آموزش حرفه‌ای دوگانه آلمان است، با حقوق: سه تا چهار روز در هفته در شرکت کار می‌کنید، بقیه را در مدرسه حرفه‌ای می‌گذرانید و از روز اول حقوق می‌گیرید — معمولاً ۸۰۰ تا ۱٬۳۰۰ یورو در ماه بسته به حرفه و سال. پس از دو تا سه سال و نیم، مدرکی آلمانی و معتبر دارید با چشم‌انداز شغلی عالی، چون آلمان در پرستاری، صنایع دستی، لجستیک، رستوران‌داری و فناوری اطلاعات کمبود نیروی ماهر دارد. خارجی‌ها می‌توانند درخواست دهند: با ویزای آموزش حرفه‌ای (§16a AufenthG)، متقاضیان غیراتحادیه اروپا به محض داشتن قرارداد امضاشده می‌توانند به آلمان بیایند.\n\nاین صفحه مستقیماً در سامانه رسمی آژانس فدرال کار (Bundesagentur für Arbeit) جستجو می‌کند — بیش از ۱۷۰٬۰۰۰ جای آوسبیلدونگ فعال و روزانه صدها آگهی تازه. بر اساس حرفه، شهر و شعاع فیلتر کنید، آگهی‌های امروز را ببینید و مستقیم در سایت رسمی درخواست دهید. پیش از درخواست، با ابزارهای رایگان ما رزومه آلمانی و Anschreiben بسازید — بیشتر ردشدن‌ها به‌خاطر پرونده‌ای است که با عرف آلمانی جور نیست، نه خود متقاضی.',
    faqTitle: 'پرسش‌های متداول',
    faqs: [
      { q: 'آیا خارجی‌ها می‌توانند در آلمان آوسبیلدونگ بگیرند؟', a: 'بله. شهروندان غیراتحادیه اروپا با داشتن قرارداد امضاشده آوسبیلدونگ با کارفرمای آلمانی می‌توانند ویزای آموزش حرفه‌ای (§16a AufenthG) بگیرند — معمولاً با مدرک آلمانی B1 و تمکن مالی یا حقوق آموزشی که هزینه زندگی را بپوشاند.' },
      { q: 'حقوق دوره آوسبیلدونگ چقدر است؟', a: 'کارآموز از روز اول حقوق می‌گیرد — بیشتر حرفه‌ها در سال اول ماهانه ۸۰۰ تا ۱٬۳۰۰ یورو ناخالص می‌پردازند و هر سال بیشتر می‌شود. پرستاری، ساختمان و صنعت بالاترین‌ها هستند؛ حداقل قانونی حقوق آموزش در ۲۰۲۶ حدود ۶۸۰ یورو برای سال اول است.' },
      { q: 'برای آوسبیلدونگ چه سطح آلمانی لازم است؟', a: 'بیشتر کارفرمایان و سفارت‌ها B1 می‌خواهند و B2 شانس شما را به‌ویژه در حوزه سلامت بسیار بالا می‌برد. برخی کارفرمایان فنی با تعهد به ادامه یادگیری A2 را می‌پذیرند. دوره رایگان آلمانی ما شما را از A1 تا C1 می‌رساند.' },
      { q: 'چطور از خارج برای این آگهی‌ها درخواست دهم؟', a: 'آگهی را در صفحه رسمی Arbeitsagentur باز کنید و با پرونده آلمانی درخواست دهید: Lebenslauf (رزومه)، Anschreiben (انگیزه‌نامه) و مدارک. مصاحبه‌ها معمولاً آنلاین و به آلمانی است. پس از امضای قرارداد، ویزای §16a را از سفارت آلمان درخواست می‌کنید.' },
    ],
  },
  pt: {
    title: 'Encontrar uma Ausbildung na Alemanha — vagas ao vivo da bolsa de empregos oficial',
    intro:
      'A Ausbildung é a formação profissional dual alemã, remunerada: você trabalha numa empresa três a quatro dias por semana, frequenta a escola profissional no restante e recebe salário desde o primeiro dia — normalmente entre 800 e 1.300 € por mês, conforme a profissão e o ano. Após dois a três anos e meio, você tem um diploma alemão reconhecido com ótimas perspectivas, pois a Alemanha carece de mão de obra qualificada em cuidados, ofícios, logística, gastronomia e TI. Estrangeiros podem se candidatar: com o visto de formação profissional (§16a AufenthG), candidatos de fora da UE podem se mudar assim que tiverem um contrato de formação assinado.\n\nEsta página pesquisa a bolsa de empregos oficial da Bundesagentur für Arbeit — mais de 170.000 vagas de Ausbildung ativas, com centenas de novas ofertas por dia. Filtre por profissão, cidade e raio, veja o que foi publicado hoje e candidate-se direto no site oficial. Antes de se candidatar, use nossas ferramentas gratuitas para criar um CV alemão e um Anschreiben — a maioria das recusas vem de candidaturas fora do padrão alemão, não do candidato.',
    faqTitle: 'Perguntas frequentes',
    faqs: [
      { q: 'Estrangeiro pode fazer Ausbildung na Alemanha?', a: 'Sim. Cidadãos de fora da UE podem obter o visto de formação profissional (§16a AufenthG) assim que tiverem um contrato de Ausbildung assinado com um empregador alemão, geralmente com alemão B1 e meios financeiros ou salário de formação que cubra o custo de vida.' },
      { q: 'Quanto se ganha durante a Ausbildung?', a: 'O aprendiz recebe desde o primeiro dia — a maioria das profissões paga entre 800 e 1.300 € brutos por mês no primeiro ano, com aumento anual. Cuidados, construção e indústria pagam mais; o salário mínimo legal de formação em 2026 é de cerca de 680 € no primeiro ano.' },
      { q: 'Que nível de alemão preciso para uma Ausbildung?', a: 'A maioria dos empregadores e consulados espera B1, e B2 melhora muito as chances — sobretudo na saúde. Alguns empregadores técnicos aceitam A2 com compromisso de continuar estudando. Nosso curso gratuito de alemão leva você de A1 a C1.' },
      { q: 'Como me candidato a essas vagas do exterior?', a: 'Abra a vaga na página oficial da Arbeitsagentur e candidate-se com dossiê no padrão alemão: Lebenslauf (CV), Anschreiben (carta de motivação) e certificados. As entrevistas costumam ser online, em alemão. Com o contrato assinado, solicite o visto §16a na embaixada alemã.' },
    ],
  },
  ru: {
    title: 'Найти Ausbildung в Германии — живые вакансии официальной биржи труда',
    intro:
      'Ausbildung — это оплачиваемое дуальное профессиональное обучение в Германии: три-четыре дня в неделю вы работаете на предприятии, остальное время учитесь в профшколе и получаете зарплату с первого дня — обычно 800–1 300 € в месяц в зависимости от профессии и года обучения. Через два — три с половиной года у вас признанный немецкий диплом и отличные перспективы: Германии не хватает специалистов в уходе, ремёслах, логистике, гастрономии и ИТ. Иностранцы могут подаваться: с визой для профобучения (§16a AufenthG) кандидаты не из ЕС могут переехать, как только подписан договор об обучении.\n\nЭта страница ищет по официальной бирже труда Федерального агентства занятости (Bundesagentur für Arbeit) — более 170 000 актуальных мест Ausbildung, сотни новых предложений ежедневно. Фильтруйте по профессии, городу и радиусу, смотрите опубликованное сегодня и откликайтесь прямо на официальном сайте. Перед откликом подготовьте немецкое резюме и Anschreiben нашими бесплатными инструментами — большинство отказов происходит из-за оформления заявки не по немецким правилам, а не из-за кандидата.',
    faqTitle: 'Частые вопросы',
    faqs: [
      { q: 'Может ли иностранец пройти Ausbildung в Германии?', a: 'Да. Граждане стран вне ЕС получают визу для профобучения (§16a AufenthG), как только подписан договор Ausbildung с немецким работодателем — обычно при немецком на уровне B1 и финансовом обеспечении либо учебной зарплате, покрывающей проживание.' },
      { q: 'Сколько платят во время Ausbildung?', a: 'Ученик получает зарплату с первого дня — в большинстве профессий 800–1 300 € брутто в месяц в первый год, с ежегодным ростом. Уход, стройка и промышленность платят больше всего; законный минимум учебной зарплаты в 2026 году — около 680 € в первый год.' },
      { q: 'Какой уровень немецкого нужен для Ausbildung?', a: 'Большинство работодателей и визовых органов ждут B1, с B2 шансы заметно выше — особенно в медицине и уходе. Некоторые технические работодатели принимают A2 при готовности учиться дальше. Наш бесплатный курс немецкого ведёт от A1 до C1.' },
      { q: 'Как откликнуться на эти вакансии из-за границы?', a: 'Откройте вакансию на официальной странице Arbeitsagentur и подайте документы по немецкому стандарту: Lebenslauf (резюме), Anschreiben (мотивационное письмо) и сертификаты. Собеседования обычно проходят онлайн на немецком. С подписанным договором подавайте на визу §16a в посольстве Германии.' },
    ],
  },
  hi: {
    title: 'जर्मनी में Ausbildung खोजें — आधिकारिक जॉब पोर्टल की लाइव वेकेंसी',
    intro:
      'Ausbildung जर्मनी की सवेतन ड्युअल वोकेशनल ट्रेनिंग है: हफ्ते में तीन-चार दिन कंपनी में काम, बाकी दिन वोकेशनल स्कूल — और पहले दिन से सैलरी, आमतौर पर पेशे और साल के हिसाब से 800–1,300 € प्रति माह। दो से साढ़े तीन साल बाद आपके पास मान्यता प्राप्त जर्मन डिग्री होती है और नौकरी की शानदार संभावनाएँ — क्योंकि जर्मनी में नर्सिंग, हस्तशिल्प, लॉजिस्टिक्स, होटल-रेस्तरां और IT में कुशल कामगारों की कमी है। विदेशी आवेदन कर सकते हैं: वोकेशनल ट्रेनिंग वीज़ा (§16a AufenthG) से गैर-EU उम्मीदवार अनुबंध साइन होते ही जर्मनी आ सकते हैं।\n\nयह पेज संघीय रोज़गार एजेंसी (Bundesagentur für Arbeit) के आधिकारिक जॉब पोर्टल में खोजता है — 170,000+ सक्रिय Ausbildung पद, हर दिन सैकड़ों नई वेकेंसी। पेशे, शहर और दायरे से फ़िल्टर करें, आज प्रकाशित ऑफ़र देखें और सीधे आधिकारिक साइट पर आवेदन करें। आवेदन से पहले हमारे मुफ्त टूल से जर्मन-शैली CV और Anschreiben बनाएँ — ज़्यादातर अस्वीकृतियाँ उम्मीदवार की वजह से नहीं, जर्मन मानकों से अलग आवेदन की वजह से होती हैं।',
    faqTitle: 'अक्सर पूछे जाने वाले सवाल',
    faqs: [
      { q: 'क्या विदेशी जर्मनी में Ausbildung कर सकते हैं?', a: 'हाँ। गैर-EU नागरिक जर्मन नियोक्ता के साथ साइन किए Ausbildung अनुबंध के बाद वोकेशनल ट्रेनिंग वीज़ा (§16a AufenthG) पा सकते हैं — आमतौर पर B1 जर्मन और रहने के खर्च लायक आर्थिक साधन या ट्रेनिंग सैलरी के साथ।' },
      { q: 'Ausbildung में कितनी सैलरी मिलती है?', a: 'ट्रेनी को पहले दिन से वेतन मिलता है — ज़्यादातर पेशों में पहले साल 800–1,300 € ग्रॉस प्रति माह, हर साल बढ़ोतरी के साथ। नर्सिंग, निर्माण और उद्योग सबसे ज़्यादा देते हैं; 2026 में कानूनी न्यूनतम ट्रेनिंग वेतन पहले साल करीब 680 € है।' },
      { q: 'Ausbildung के लिए कौन-सा जर्मन स्तर चाहिए?', a: 'ज़्यादातर नियोक्ता और वीज़ा अधिकारी B1 चाहते हैं; B2 से अवसर काफी बढ़ते हैं — खासकर हेल्थकेयर में। कुछ तकनीकी नियोक्ता आगे सीखने की शर्त पर A2 भी मानते हैं। हमारा मुफ्त जर्मन कोर्स A1 से C1 तक ले जाता है।' },
      { q: 'विदेश से इन ऑफ़र पर आवेदन कैसे करूँ?', a: 'ऑफ़र को आधिकारिक Arbeitsagentur पेज पर खोलें और जर्मन-शैली दस्तावेज़ों से आवेदन करें: Lebenslauf (CV), Anschreiben (कवर लेटर) और प्रमाणपत्र। इंटरव्यू आमतौर पर ऑनलाइन, जर्मन में होते हैं। अनुबंध मिलने पर जर्मन दूतावास में §16a वीज़ा के लिए आवेदन करें।' },
    ],
  },
  ur: {
    title: 'جرمنی میں آؤسبلڈنگ تلاش کریں — سرکاری جاب پورٹل کی تازہ آسامیاں',
    intro:
      'آؤسبلڈنگ جرمنی کی بامعاوضہ دوہری پیشہ ورانہ تربیت ہے: ہفتے میں تین چار دن کمپنی میں کام، باقی دن ووکیشنل اسکول — اور پہلے دن سے تنخواہ، عام طور پر پیشے اور سال کے حساب سے ماہانہ 800 تا 1,300 یورو۔ دو سے ساڑھے تین سال بعد آپ کے پاس تسلیم شدہ جرمن ڈگری ہوتی ہے اور ملازمت کے بہترین مواقع — کیونکہ جرمنی میں نرسنگ، دستکاری، لاجسٹکس، ہوٹل انڈسٹری اور آئی ٹی میں ہنر مند افراد کی کمی ہے۔ غیر ملکی درخواست دے سکتے ہیں: پیشہ ورانہ تربیت کے ویزے (§16a AufenthG) کے ساتھ غیر یورپی امیدوار معاہدہ سائن ہوتے ہی جرمنی آ سکتے ہیں۔\n\nیہ صفحہ وفاقی روزگار ایجنسی (Bundesagentur für Arbeit) کے سرکاری جاب پورٹل میں تلاش کرتا ہے — 170,000 سے زائد فعال آؤسبلڈنگ آسامیاں، روزانہ سینکڑوں نئی۔ پیشے، شہر اور دائرے سے فلٹر کریں، آج شائع شدہ دیکھیں اور براہِ راست سرکاری سائٹ پر درخواست دیں۔ درخواست سے پہلے ہمارے مفت ٹولز سے جرمن طرز کا CV اور Anschreiben بنائیں — زیادہ تر انکار امیدوار کی وجہ سے نہیں بلکہ جرمن معیار سے ہٹ کر بنائی گئی درخواست کی وجہ سے ہوتے ہیں۔',
    faqTitle: 'اکثر پوچھے جانے والے سوالات',
    faqs: [
      { q: 'کیا غیر ملکی جرمنی میں آؤسبلڈنگ کر سکتے ہیں؟', a: 'جی ہاں۔ غیر یورپی شہری جرمن آجر کے ساتھ سائن شدہ آؤسبلڈنگ معاہدے کے بعد پیشہ ورانہ تربیت کا ویزا (§16a AufenthG) حاصل کر سکتے ہیں — عموماً B1 جرمن اور رہائشی اخراجات کے لیے مالی وسائل یا تربیتی تنخواہ کے ساتھ۔' },
      { q: 'آؤسبلڈنگ میں کتنی تنخواہ ملتی ہے؟', a: 'ٹرینی کو پہلے دن سے تنخواہ ملتی ہے — بیشتر پیشوں میں پہلے سال ماہانہ 800 تا 1,300 یورو گراس، ہر سال اضافے کے ساتھ۔ نرسنگ، تعمیرات اور صنعت سب سے زیادہ دیتے ہیں؛ 2026 میں قانونی کم از کم تربیتی تنخواہ پہلے سال تقریباً 680 یورو ہے۔' },
      { q: 'آؤسبلڈنگ کے لیے کون سی جرمن سطح درکار ہے؟', a: 'زیادہ تر آجر اور ویزا حکام B1 چاہتے ہیں؛ B2 سے مواقع نمایاں بڑھتے ہیں — خاص طور پر شعبہ صحت میں۔ کچھ تکنیکی آجر مزید سیکھنے کی شرط پر A2 بھی قبول کرتے ہیں۔ ہمارا مفت جرمن کورس A1 سے C1 تک لے جاتا ہے۔' },
      { q: 'بیرونِ ملک سے ان آسامیوں پر درخواست کیسے دوں؟', a: 'آسامی کو سرکاری Arbeitsagentur صفحے پر کھولیں اور جرمن طرز کے کاغذات کے ساتھ درخواست دیں: Lebenslauf (CV)، Anschreiben (کور لیٹر) اور اسناد۔ انٹرویو عموماً آن لائن، جرمن میں ہوتے ہیں۔ معاہدہ ملنے پر جرمن سفارت خانے سے §16a ویزے کی درخواست کریں۔' },
    ],
  },
  zh: {
    title: '在德国找 Ausbildung — 官方就业平台的实时职位',
    intro:
      'Ausbildung 是德国带薪的双元制职业培训：每周三到四天在企业工作，其余时间在职业学校上课，从第一天起就有工资——根据职业和年级，通常每月 800–1,300 欧元。两年到三年半后，你将获得受认可的德国职业资格，就业前景极佳，因为德国在护理、手工业、物流、餐饮和 IT 领域严重缺乏技术人才。外国人可以申请：凭职业培训签证（§16a AufenthG），非欧盟候选人只要签订培训合同即可赴德。\n\n本页面直接搜索德国联邦就业局（Bundesagentur für Arbeit）的官方职位库——超过 17 万个在招 Ausbildung 岗位，每天新增数百个。按职业、城市和半径筛选，查看今天发布的岗位，并直接在官网申请。申请前，请用我们的免费工具制作德式简历和 Anschreiben——大多数被拒不是因为候选人本身，而是申请材料不符合德国规范。',
    faqTitle: '常见问题',
    faqs: [
      { q: '外国人能在德国做 Ausbildung 吗？', a: '可以。非欧盟公民与德国雇主签订 Ausbildung 合同后，即可申请职业培训签证（§16a AufenthG），通常需要 B1 德语证明，以及能覆盖生活费的资金证明或培训工资。' },
      { q: 'Ausbildung 期间工资多少？', a: '学徒从第一天起领工资——大多数职业第一年每月税前 800–1,300 欧元，逐年上涨。护理、建筑和工业类支付最高；2026 年法定最低培训工资第一年约为 680 欧元。' },
      { q: '做 Ausbildung 需要什么德语水平？', a: '大多数雇主和签证机构要求 B1，B2 会显著提高录取机会——尤其在医疗护理领域。部分技术类雇主接受 A2 并要求继续学习。我们的免费德语课程覆盖 A1 到 C1。' },
      { q: '身在国外如何申请这些职位？', a: '在官方 Arbeitsagentur 页面打开职位，按德国规范提交申请：Lebenslauf（简历）、Anschreiben（求职信）和证书。面试通常在线进行、用德语。拿到合同后，到德国使馆申请 §16a 签证。' },
    ],
  },
}

const locales = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh']

for (const loc of locales) {
  const file = join(root, 'messages', `${loc}.json`)
  const m = JSON.parse(readFileSync(file, 'utf8'))
  const c = SEO[loc]
  if (!c) throw new Error(`missing content for ${loc}`)
  m.ausbJobs = m.ausbJobs || {}
  m.ausbJobs.seoSection = { title: c.title, intro: c.intro, faqTitle: c.faqTitle, faqs: c.faqs }
  writeFileSync(file, JSON.stringify(m, null, 2) + '\n', 'utf8')
  console.log(`✓ ${loc}: ausbJobs.seoSection`)
}
console.log('done')
