// Fill static.about / static.contact with substantive sections (12 locales).
import fs from 'fs'

const C = {
  en: {
    about: { subtitle: 'Who is behind GoGermany, how we work, and why everything is free', sections: [
      ['Our story', 'GoGermany started with a simple observation: people pay agencies thousands of euros for information about moving to Germany that should be free. We built the platform we wished existed — step-by-step guidance from "is this possible for me?" to your first weeks in Germany, now available in 12 languages.'],
      ['What you will find here', 'Practical guides for every path (Ausbildung, university, skilled work), 200+ in-depth articles, 18 free interactive tools — from the eligibility checker and German CV builder to interview practice and salary calculators — free German lessons from A1 to C1, and live Ausbildung offers updated every day.'],
      ['How we create our content', 'Our content is researched from official sources (BAMF, Bundesagentur für Arbeit, embassies, universities), drafted with the help of AI tools and reviewed and updated by our team. Every figure carries its publication context, and when rules change, we update. If you spot an error, tell us — we fix it.'],
      ['Our mission', 'Reliable migration information should not depend on how much you can pay or which language you speak. Our mission is to make the entire journey to Germany understandable and achievable for everyone — for free, in your language.'],
      ['How we fund it', 'GoGermany is financed by advertising and clearly marked partner links. That is what keeps every tool and lesson free. We never sell your data, and partnerships never influence what we recommend — our disclaimer explains this in detail.'],
      ['The team', 'We are a small international team working between Morocco and Germany, with first-hand experience of the exact journey you are preparing. Questions, corrections or ideas? Write to contact@gogermany.ma — we read everything.'],
    ]},
    contact: { subtitle: 'Questions, corrections, partnerships — we read everything', sections: [
      ['We would love to hear from you', 'Whether you have a question about your path to Germany, found an error in an article, or want to suggest a tool we should build — your message is welcome.'],
      ['Help us help you faster', 'Include your target path (Ausbildung, studies or work), your country, and your specific question. The more concrete your message, the more useful our answer.'],
      ['Response time', 'We usually reply within 48 hours on weekdays. For quick questions, WhatsApp is the fastest channel.'],
      ['Partnerships and press', 'Language schools, recruiters, universities and media: write to the same address with "Partnership" in the subject line.'],
    ]},
  },
  fr: {
    about: { subtitle: 'Qui est derrière GoGermany, comment nous travaillons, et pourquoi tout est gratuit', sections: [
      ['Notre histoire', 'GoGermany est né d\'un constat simple : des gens paient des milliers d\'euros à des agences pour des informations sur l\'Allemagne qui devraient être gratuites. Nous avons construit la plateforme que nous aurions voulu avoir — un accompagnement pas à pas, de « est-ce possible pour moi ? » jusqu\'à vos premières semaines en Allemagne, aujourd\'hui en 12 langues.'],
      ['Ce que vous trouverez ici', 'Des guides pratiques pour chaque voie (Ausbildung, université, travail qualifié), plus de 200 articles détaillés, 18 outils interactifs gratuits — du vérificateur d\'éligibilité au CV allemand, de l\'entraînement aux entretiens aux calculateurs de salaire — des cours d\'allemand gratuits de A1 à C1, et des offres d\'Ausbildung actualisées chaque jour.'],
      ['Comment nous créons notre contenu', 'Notre contenu est documenté à partir de sources officielles (BAMF, Bundesagentur für Arbeit, ambassades, universités), rédigé avec l\'aide d\'outils d\'IA puis relu et mis à jour par notre équipe. Chaque chiffre porte son contexte de publication, et quand les règles changent, nous mettons à jour. Une erreur ? Dites-le-nous — nous corrigeons.'],
      ['Notre mission', 'Une information fiable sur la migration ne devrait dépendre ni de vos moyens ni de votre langue. Notre mission : rendre tout le parcours vers l\'Allemagne compréhensible et réalisable pour tous — gratuitement, dans votre langue.'],
      ['Comment nous nous finançons', 'GoGermany vit de la publicité et de liens partenaires clairement signalés. C\'est ce qui garde chaque outil et chaque leçon gratuits. Nous ne vendons jamais vos données, et les partenariats n\'influencent jamais nos recommandations — notre avertissement l\'explique en détail.'],
      ['L\'équipe', 'Nous sommes une petite équipe internationale entre le Maroc et l\'Allemagne, avec l\'expérience vécue du parcours exact que vous préparez. Questions, corrections, idées ? Écrivez à contact@gogermany.ma — nous lisons tout.'],
    ]},
    contact: { subtitle: 'Questions, corrections, partenariats — nous lisons tout', sections: [
      ['Nous serions ravis de vous lire', 'Une question sur votre parcours vers l\'Allemagne, une erreur repérée dans un article, une idée d\'outil à construire — votre message est le bienvenu.'],
      ['Aidez-nous à vous aider plus vite', 'Indiquez votre voie cible (Ausbildung, études ou travail), votre pays et votre question précise. Plus votre message est concret, plus notre réponse sera utile.'],
      ['Délai de réponse', 'Nous répondons généralement sous 48 h en semaine. Pour les questions rapides, WhatsApp est le canal le plus rapide.'],
      ['Partenariats et presse', 'Écoles de langues, recruteurs, universités et médias : écrivez à la même adresse avec « Partenariat » en objet.'],
    ]},
  },
  ar: {
    about: { subtitle: 'من وراء GoGermany، وكيف نعمل، ولماذا كل شيء مجاني', sections: [
      ['قصتنا', 'انطلقت GoGermany من ملاحظة بسيطة: يدفع الناس آلاف اليوروهات لوكالات مقابل معلومات عن الانتقال إلى ألمانيا كان يجب أن تكون مجانية. بنينا المنصة التي تمنينا وجودها — مرافقة خطوة بخطوة من «هل هذا ممكن لي؟» حتى أسابيعك الأولى في ألمانيا، واليوم بـ12 لغة.'],
      ['ماذا ستجد هنا', 'أدلة عملية لكل مسار (أوسبيلدونغ، جامعة، عمل مؤهل)، وأكثر من 200 مقال معمق، و18 أداة تفاعلية مجانية — من فاحص الأهلية ومنشئ السيرة الألمانية إلى التدرب على المقابلات وحاسبات الرواتب — ودروس ألمانية مجانية من A1 إلى C1، وعروض أوسبيلدونغ تُحدَّث يومياً.'],
      ['كيف ننتج محتوانا', 'محتوانا موثق من مصادر رسمية (BAMF، وكالة العمل الاتحادية، السفارات، الجامعات)، يُصاغ بمساعدة أدوات الذكاء الاصطناعي ثم يراجعه فريقنا ويحدّثه. كل رقم يحمل سياق نشره، وعندما تتغير القواعد نحدّث. وجدت خطأ؟ أخبرنا — نصحّح.'],
      ['مهمتنا', 'المعلومة الموثوقة عن الهجرة يجب ألا تتوقف على قدرتك على الدفع أو لغتك. مهمتنا: جعل رحلة ألمانيا كلها مفهومة وقابلة للتحقيق للجميع — مجاناً وبلغتك.'],
      ['كيف نموّل المشروع', 'تعيش GoGermany من الإعلانات وروابط الشركاء المميزة بوضوح. هذا ما يبقي كل أداة ودرس مجانيين. لا نبيع بياناتك أبداً، ولا تؤثر الشراكات في توصياتنا — ويشرح إخلاء المسؤولية ذلك بالتفصيل.'],
      ['الفريق', 'نحن فريق دولي صغير يعمل بين المغرب وألمانيا، بتجربة معيشة للمسار نفسه الذي تحضّر له. أسئلة أو تصحيحات أو أفكار؟ راسل contact@gogermany.ma — نقرأ كل شيء.'],
    ]},
    contact: { subtitle: 'أسئلة، تصحيحات، شراكات — نقرأ كل شيء', sections: [
      ['يسعدنا أن نسمع منك', 'سؤال عن مسارك نحو ألمانيا، خطأ لاحظته في مقال، فكرة أداة تريدنا أن نبنيها — رسالتك مرحب بها.'],
      ['ساعدنا لنساعدك أسرع', 'اذكر مسارك المستهدف (أوسبيلدونغ، دراسة أو عمل) وبلدك وسؤالك المحدد. كلما كانت رسالتك أدق كان جوابنا أنفع.'],
      ['مدة الرد', 'نرد عادة خلال 48 ساعة في أيام الأسبوع. وللأسئلة السريعة، واتساب هو الأسرع.'],
      ['الشراكات والإعلام', 'مدارس اللغات والمشغّلون والجامعات ووسائل الإعلام: راسلوا العنوان نفسه واكتبوا «شراكة» في الموضوع.'],
    ]},
  },
  de: {
    about: { subtitle: 'Wer hinter GoGermany steht, wie wir arbeiten und warum alles kostenlos ist', sections: [
      ['Unsere Geschichte', 'GoGermany begann mit einer einfachen Beobachtung: Menschen zahlen Agenturen Tausende Euro für Informationen über den Weg nach Deutschland, die kostenlos sein sollten. Wir haben die Plattform gebaut, die wir uns gewünscht hätten — Schritt-für-Schritt-Begleitung von „Ist das für mich möglich?" bis zu den ersten Wochen in Deutschland, heute in 12 Sprachen.'],
      ['Was Sie hier finden', 'Praktische Guides für jeden Weg (Ausbildung, Studium, Fachkräfte), über 200 ausführliche Artikel, 18 kostenlose interaktive Tools — vom Eligibility-Check über den deutschen Lebenslauf bis zu Interview-Training und Gehaltsrechnern — kostenlose Deutschkurse von A1 bis C1 und täglich aktualisierte Ausbildungsangebote.'],
      ['Wie unsere Inhalte entstehen', 'Unsere Inhalte werden aus offiziellen Quellen recherchiert (BAMF, Bundesagentur für Arbeit, Botschaften, Hochschulen), mit KI-Unterstützung erstellt und vom Team geprüft und aktualisiert. Jede Zahl trägt ihren Veröffentlichungskontext; ändern sich Regeln, aktualisieren wir. Fehler entdeckt? Sagen Sie es uns — wir korrigieren.'],
      ['Unsere Mission', 'Verlässliche Migrationsinformationen dürfen nicht davon abhängen, was Sie zahlen können oder welche Sprache Sie sprechen. Unsere Mission: den gesamten Weg nach Deutschland für alle verständlich und machbar zu machen — kostenlos, in Ihrer Sprache.'],
      ['Wie wir uns finanzieren', 'GoGermany finanziert sich über Werbung und klar gekennzeichnete Partnerlinks. Das hält jedes Tool und jede Lektion kostenlos. Wir verkaufen niemals Ihre Daten, und Partnerschaften beeinflussen unsere Empfehlungen nicht — der Haftungsausschluss erklärt das im Detail.'],
      ['Das Team', 'Wir sind ein kleines internationales Team zwischen Marokko und Deutschland — mit gelebter Erfahrung genau des Weges, den Sie vorbereiten. Fragen, Korrekturen, Ideen? Schreiben Sie an contact@gogermany.ma — wir lesen alles.'],
    ]},
    contact: { subtitle: 'Fragen, Korrekturen, Partnerschaften — wir lesen alles', sections: [
      ['Wir freuen uns auf Ihre Nachricht', 'Ob Frage zu Ihrem Weg nach Deutschland, ein Fehler in einem Artikel oder eine Idee für ein neues Tool — Ihre Nachricht ist willkommen.'],
      ['Helfen Sie uns, schneller zu helfen', 'Nennen Sie Ihren Zielweg (Ausbildung, Studium oder Arbeit), Ihr Land und Ihre konkrete Frage. Je konkreter die Nachricht, desto nützlicher die Antwort.'],
      ['Antwortzeit', 'Wir antworten werktags in der Regel innerhalb von 48 Stunden. Für schnelle Fragen ist WhatsApp der schnellste Kanal.'],
      ['Partnerschaften und Presse', 'Sprachschulen, Recruiter, Hochschulen und Medien: gleiche Adresse, Betreff „Partnerschaft".'],
    ]},
  },
  es: {
    about: { subtitle: 'Quién está detrás de GoGermany, cómo trabajamos y por qué todo es gratis', sections: [
      ['Nuestra historia', 'GoGermany nació de una observación simple: la gente paga miles de euros a agencias por información sobre mudarse a Alemania que debería ser gratuita. Construimos la plataforma que nos habría gustado tener — acompañamiento paso a paso desde «¿es posible para mí?» hasta tus primeras semanas en Alemania, hoy en 12 idiomas.'],
      ['Qué encontrarás aquí', 'Guías prácticas para cada vía (Ausbildung, universidad, trabajo cualificado), más de 200 artículos a fondo, 18 herramientas interactivas gratuitas — del verificador de elegibilidad y el CV alemán al entrenamiento de entrevistas y calculadoras de salario — clases de alemán gratis de A1 a C1 y ofertas de Ausbildung actualizadas a diario.'],
      ['Cómo creamos el contenido', 'Nuestro contenido se documenta en fuentes oficiales (BAMF, Bundesagentur für Arbeit, embajadas, universidades), se redacta con ayuda de IA y lo revisa y actualiza nuestro equipo. Cada cifra lleva su contexto de publicación, y cuando cambian las reglas, actualizamos. ¿Ves un error? Dínoslo — lo corregimos.'],
      ['Nuestra misión', 'La información fiable sobre migración no debería depender de cuánto puedas pagar ni del idioma que hables. Nuestra misión: hacer todo el camino a Alemania comprensible y alcanzable para todos — gratis y en tu idioma.'],
      ['Cómo nos financiamos', 'GoGermany vive de la publicidad y de enlaces de socios claramente marcados. Eso mantiene gratis cada herramienta y cada lección. Nunca vendemos tus datos, y los acuerdos jamás influyen en nuestras recomendaciones — el aviso legal lo explica en detalle.'],
      ['El equipo', 'Somos un pequeño equipo internacional entre Marruecos y Alemania, con experiencia vivida del mismo camino que tú preparas. ¿Preguntas, correcciones, ideas? Escribe a contact@gogermany.ma — lo leemos todo.'],
    ]},
    contact: { subtitle: 'Preguntas, correcciones, colaboraciones — lo leemos todo', sections: [
      ['Nos encantará leerte', 'Una duda sobre tu camino a Alemania, un error en un artículo o una idea de herramienta que deberíamos crear — tu mensaje es bienvenido.'],
      ['Ayúdanos a ayudarte más rápido', 'Indica tu vía objetivo (Ausbildung, estudios o trabajo), tu país y tu pregunta concreta. Cuanto más concreto el mensaje, más útil la respuesta.'],
      ['Tiempo de respuesta', 'Solemos responder en 48 horas en días laborables. Para dudas rápidas, WhatsApp es el canal más veloz.'],
      ['Colaboraciones y prensa', 'Escuelas de idiomas, reclutadores, universidades y medios: misma dirección con asunto «Colaboración».'],
    ]},
  },
  tr: {
    about: { subtitle: 'GoGermany’nin arkasında kim var, nasıl çalışıyoruz ve neden her şey ücretsiz', sections: [
      ['Hikâyemiz', 'GoGermany basit bir gözlemle doğdu: insanlar, ücretsiz olması gereken Almanya bilgileri için ajanslara binlerce euro ödüyor. Keşke olsaydı dediğimiz platformu kurduk — «benim için mümkün mü?» sorusundan Almanya’daki ilk haftalarınıza kadar adım adım rehberlik, bugün 12 dilde.'],
      ['Burada ne bulacaksınız', 'Her yol için pratik rehberler (Ausbildung, üniversite, nitelikli iş), 200’den fazla ayrıntılı makale, 18 ücretsiz etkileşimli araç — uygunluk kontrolünden Alman CV oluşturucuya, mülakat pratiğinden maaş hesaplayıcılara — A1’den C1’e ücretsiz Almanca dersleri ve her gün güncellenen Ausbildung ilanları.'],
      ['İçeriği nasıl üretiyoruz', 'İçeriğimiz resmî kaynaklardan araştırılır (BAMF, Bundesagentur für Arbeit, elçilikler, üniversiteler), yapay zekâ desteğiyle yazılır, ekibimizce incelenir ve güncellenir. Her rakam yayın bağlamını taşır; kurallar değişince güncelleriz. Hata mı gördünüz? Söyleyin — düzeltiriz.'],
      ['Misyonumuz', 'Güvenilir göç bilgisi, ne kadar ödeyebildiğinize veya hangi dili konuştuğunuza bağlı olmamalı. Misyonumuz: Almanya yolculuğunun tamamını herkes için anlaşılır ve başarılabilir kılmak — ücretsiz ve kendi dilinizde.'],
      ['Nasıl finanse oluyoruz', 'GoGermany reklam ve açıkça işaretli iş ortağı bağlantılarıyla ayakta duruyor. Her aracı ve dersi ücretsiz tutan budur. Verilerinizi asla satmayız; ortaklıklar önerilerimizi asla etkilemez — feragatname bunu ayrıntısıyla açıklar.'],
      ['Ekip', 'Fas ile Almanya arasında çalışan, hazırlandığınız yolculuğu bizzat yaşamış küçük, uluslararası bir ekibiz. Soru, düzeltme, fikir? contact@gogermany.ma’ya yazın — hepsini okuyoruz.'],
    ]},
    contact: { subtitle: 'Sorular, düzeltmeler, iş birlikleri — hepsini okuyoruz', sections: [
      ['Sizden haber almak isteriz', 'Almanya yolunuzla ilgili bir soru, bir makalede bulduğunuz bir hata veya yapmamızı istediğiniz bir araç fikri — mesajınız başımızın üstünde.'],
      ['Daha hızlı yardım için', 'Hedef yolunuzu (Ausbildung, eğitim veya iş), ülkenizi ve somut sorunuzu yazın. Mesaj ne kadar somutsa yanıt o kadar faydalı olur.'],
      ['Yanıt süresi', 'Hafta içi genellikle 48 saat içinde yanıtlarız. Hızlı sorular için en hızlı kanal WhatsApp’tır.'],
      ['İş birliği ve basın', 'Dil okulları, işe alım firmaları, üniversiteler ve medya: aynı adrese, konu satırına «İş birliği» yazarak ulaşın.'],
    ]},
  },
  fa: {
    about: { subtitle: 'چه کسانی پشت GoGermany هستند، چطور کار می‌کنیم و چرا همه‌چیز رایگان است', sections: [
      ['داستان ما', 'GoGermany از یک مشاهده ساده شروع شد: مردم هزاران یورو به آژانس‌ها می‌دهند برای اطلاعاتی درباره مهاجرت به آلمان که باید رایگان باشد. ما پلتفرمی ساختیم که آرزو می‌کردیم وجود داشت — همراهی قدم‌به‌قدم از «آیا برای من ممکن است؟» تا هفته‌های اول شما در آلمان، امروز به ۱۲ زبان.'],
      ['اینجا چه می‌یابید', 'راهنماهای عملی برای هر مسیر (آوسبیلدونگ، دانشگاه، کار متخصص)، بیش از ۲۰۰ مقاله عمیق، ۱۸ ابزار تعاملی رایگان — از بررسی واجد شرایط بودن و رزومه‌ساز آلمانی تا تمرین مصاحبه و محاسبه‌گرهای حقوق — درس‌های رایگان آلمانی از A1 تا C1 و فرصت‌های آوسبیلدونگ با به‌روزرسانی روزانه.'],
      ['محتوا را چگونه می‌سازیم', 'محتوای ما از منابع رسمی (BAMF، آژانس فدرال کار، سفارت‌ها، دانشگاه‌ها) تحقیق می‌شود، با کمک ابزارهای هوش مصنوعی نوشته و توسط تیم بازبینی و به‌روزرسانی می‌شود. هر رقم بافت انتشار خود را دارد و وقتی قوانین عوض شوند به‌روزرسانی می‌کنیم. خطایی دیدید؟ بگویید — اصلاح می‌کنیم.'],
      ['مأموریت ما', 'اطلاعات معتبر مهاجرت نباید به توان مالی یا زبان شما وابسته باشد. مأموریت ما: قابل‌فهم و دست‌یافتنی کردن کل مسیر آلمان برای همه — رایگان و به زبان خودتان.'],
      ['هزینه‌ها را چطور تأمین می‌کنیم', 'GoGermany با تبلیغات و پیوندهای شریک مشخص‌شده اداره می‌شود. همین است که هر ابزار و درس را رایگان نگه می‌دارد. داده‌های شما را هرگز نمی‌فروشیم و شراکت‌ها هرگز روی توصیه‌ها اثر نمی‌گذارند — سلب مسئولیت ما با جزئیات توضیح می‌دهد.'],
      ['تیم', 'ما تیمی کوچک و بین‌المللی بین مراکش و آلمان هستیم، با تجربه زیسته همان مسیری که شما آماده می‌کنید. سؤال، اصلاح یا ایده؟ به contact@gogermany.ma بنویسید — همه را می‌خوانیم.'],
    ]},
    contact: { subtitle: 'سؤالات، اصلاحات، همکاری‌ها — همه را می‌خوانیم', sections: [
      ['خوشحال می‌شویم از شما بشنویم', 'پرسشی درباره مسیرتان به آلمان، خطایی در یک مقاله، یا ایده ابزاری که باید بسازیم — پیام شما خوش‌آمد است.'],
      ['کمک‌مان کنید سریع‌تر کمک کنیم', 'مسیر هدف (آوسبیلدونگ، تحصیل یا کار)، کشورتان و سؤال مشخص‌تان را بنویسید. هرچه پیام دقیق‌تر، پاسخ مفیدتر.'],
      ['زمان پاسخ', 'معمولاً در روزهای کاری ظرف ۴۸ ساعت پاسخ می‌دهیم. برای سؤالات سریع، واتساپ سریع‌ترین کانال است.'],
      ['همکاری و رسانه', 'آموزشگاه‌های زبان، کاریاب‌ها، دانشگاه‌ها و رسانه‌ها: به همان آدرس با موضوع «همکاری» بنویسید.'],
    ]},
  },
  pt: {
    about: { subtitle: 'Quem está por trás da GoGermany, como trabalhamos e por que tudo é grátis', sections: [
      ['Nossa história', 'A GoGermany nasceu de uma observação simples: pessoas pagam milhares de euros a agências por informações sobre mudar-se para a Alemanha que deveriam ser gratuitas. Construímos a plataforma que gostaríamos de ter tido — acompanhamento passo a passo, do «será possível para mim?» às primeiras semanas na Alemanha, hoje em 12 idiomas.'],
      ['O que você encontra aqui', 'Guias práticos para cada caminho (Ausbildung, universidade, trabalho qualificado), 200+ artigos aprofundados, 18 ferramentas interativas gratuitas — do verificador de elegibilidade e do CV alemão ao treino de entrevistas e calculadoras de salário — aulas de alemão grátis de A1 a C1 e vagas de Ausbildung atualizadas diariamente.'],
      ['Como criamos o conteúdo', 'Nosso conteúdo é pesquisado em fontes oficiais (BAMF, Bundesagentur für Arbeit, embaixadas, universidades), redigido com ajuda de IA e revisado e atualizado pela equipe. Cada número carrega seu contexto de publicação; quando as regras mudam, atualizamos. Achou um erro? Avise — corrigimos.'],
      ['Nossa missão', 'Informação confiável sobre migração não deveria depender de quanto você pode pagar nem do idioma que fala. Nossa missão: tornar toda a jornada até a Alemanha compreensível e alcançável para todos — de graça e no seu idioma.'],
      ['Como nos financiamos', 'A GoGermany vive de publicidade e de links de parceiros claramente marcados. É isso que mantém cada ferramenta e aula gratuitas. Nunca vendemos seus dados, e parcerias jamais influenciam nossas recomendações — o aviso legal explica em detalhe.'],
      ['A equipe', 'Somos uma pequena equipe internacional entre o Marrocos e a Alemanha, com experiência vivida do mesmo caminho que você prepara. Perguntas, correções, ideias? Escreva para contact@gogermany.ma — lemos tudo.'],
    ]},
    contact: { subtitle: 'Perguntas, correções, parcerias — lemos tudo', sections: [
      ['Adoraríamos ouvir você', 'Uma dúvida sobre seu caminho até a Alemanha, um erro num artigo ou uma ideia de ferramenta que devíamos criar — sua mensagem é bem-vinda.'],
      ['Ajude-nos a ajudar mais rápido', 'Diga seu caminho-alvo (Ausbildung, estudos ou trabalho), seu país e sua pergunta específica. Quanto mais concreta a mensagem, mais útil a resposta.'],
      ['Tempo de resposta', 'Normalmente respondemos em 48 horas nos dias úteis. Para dúvidas rápidas, o WhatsApp é o canal mais veloz.'],
      ['Parcerias e imprensa', 'Escolas de idiomas, recrutadores, universidades e mídia: mesmo endereço, assunto «Parceria».'],
    ]},
  },
  ru: {
    about: { subtitle: 'Кто стоит за GoGermany, как мы работаем и почему всё бесплатно', sections: [
      ['Наша история', 'GoGermany начался с простого наблюдения: люди платят агентствам тысячи евро за информацию о переезде в Германию, которая должна быть бесплатной. Мы построили платформу, которой нам самим не хватало — пошаговое сопровождение от «возможно ли это для меня?» до первых недель в Германии, сегодня на 12 языках.'],
      ['Что вы здесь найдёте', 'Практические гиды по каждому пути (Ausbildung, университет, работа), 200+ подробных статей, 18 бесплатных интерактивных инструментов — от проверки соответствия и немецкого резюме до тренировки собеседований и зарплатных калькуляторов — бесплатные уроки немецкого от A1 до C1 и ежедневно обновляемые вакансии Ausbildung.'],
      ['Как мы создаём контент', 'Наш контент опирается на официальные источники (BAMF, Bundesagentur für Arbeit, посольства, вузы), создаётся с помощью ИИ-инструментов и проверяется и обновляется командой. Каждая цифра несёт контекст публикации; меняются правила — обновляем и мы. Нашли ошибку? Скажите — исправим.'],
      ['Наша миссия', 'Надёжная информация о миграции не должна зависеть от того, сколько вы можете заплатить и на каком языке говорите. Наша миссия — сделать весь путь в Германию понятным и достижимым для каждого: бесплатно и на вашем языке.'],
      ['На что мы живём', 'GoGermany финансируется рекламой и явно помеченными партнёрскими ссылками. Именно это держит все инструменты и уроки бесплатными. Мы никогда не продаём ваши данные, а партнёрства никогда не влияют на рекомендации — подробности в нашем отказе от ответственности.'],
      ['Команда', 'Мы — небольшая международная команда между Марокко и Германией, лично прошедшая тот самый путь, который вы готовите. Вопросы, поправки, идеи? Пишите на contact@gogermany.ma — мы читаем всё.'],
    ]},
    contact: { subtitle: 'Вопросы, поправки, партнёрства — мы читаем всё', sections: [
      ['Будем рады вашему письму', 'Вопрос о вашем пути в Германию, ошибка в статье или идея инструмента, который нам стоит сделать — ваше сообщение всегда кстати.'],
      ['Помогите нам помочь быстрее', 'Укажите целевой путь (Ausbildung, учёба или работа), вашу страну и конкретный вопрос. Чем конкретнее письмо, тем полезнее ответ.'],
      ['Время ответа', 'Обычно отвечаем в течение 48 часов по будням. Для быстрых вопросов самый быстрый канал — WhatsApp.'],
      ['Партнёрства и пресса', 'Языковые школы, рекрутеры, вузы и СМИ: тот же адрес, тема письма — «Партнёрство».'],
    ]},
  },
  hi: {
    about: { subtitle: 'GoGermany के पीछे कौन है, हम कैसे काम करते हैं, और सब कुछ मुफ़्त क्यों है', sections: [
      ['हमारी कहानी', 'GoGermany एक सीधी-सी बात से शुरू हुआ: लोग जर्मनी जाने की उस जानकारी के लिए एजेंसियों को हज़ारों यूरो देते हैं जो मुफ़्त होनी चाहिए। हमने वह प्लेटफ़ॉर्म बनाया जो हम ख़ुद चाहते थे — «क्या यह मेरे लिए संभव है?» से लेकर जर्मनी में आपके पहले हफ़्तों तक क़दम-दर-क़दम साथ, आज 12 भाषाओं में।'],
      ['यहाँ क्या मिलेगा', 'हर रास्ते के लिए व्यावहारिक गाइड (Ausbildung, विश्वविद्यालय, कुशल काम), 200+ विस्तृत लेख, 18 मुफ़्त इंटरैक्टिव टूल — एलिजिबिलिटी चेकर और जर्मन CV बिल्डर से लेकर इंटरव्यू अभ्यास और सैलरी कैलकुलेटर तक — A1 से C1 तक मुफ़्त जर्मन पाठ, और रोज़ अपडेट होते Ausbildung ऑफ़र।'],
      ['हम कंटेंट कैसे बनाते हैं', 'हमारा कंटेंट आधिकारिक स्रोतों (BAMF, Bundesagentur für Arbeit, दूतावास, विश्वविद्यालय) से शोधित है, AI टूल्स की मदद से लिखा जाता है और हमारी टीम समीक्षा-अपडेट करती है। हर आँकड़े के साथ उसका प्रकाशन संदर्भ है; नियम बदलते हैं तो हम अपडेट करते हैं। गलती दिखे? बताइए — हम सुधारते हैं।'],
      ['हमारा मिशन', 'भरोसेमंद माइग्रेशन जानकारी इस पर निर्भर नहीं होनी चाहिए कि आप कितना दे सकते हैं या कौन-सी भाषा बोलते हैं। हमारा मिशन: जर्मनी तक का पूरा सफ़र सबके लिए समझने योग्य और साध्य बनाना — मुफ़्त, आपकी भाषा में।'],
      ['फ़ंडिंग कैसे होती है', 'GoGermany विज्ञापन और स्पष्ट चिह्नित पार्टनर लिंक से चलता है। इसी से हर टूल और पाठ मुफ़्त रहता है। हम आपका डेटा कभी नहीं बेचते, और साझेदारियाँ हमारी सिफ़ारिशों को कभी प्रभावित नहीं करतीं — अस्वीकरण में विस्तार से बताया है।'],
      ['टीम', 'हम मोरक्को और जर्मनी के बीच काम करती एक छोटी अंतरराष्ट्रीय टीम हैं — ठीक उसी सफ़र के अनुभव के साथ जिसकी आप तैयारी कर रहे हैं। सवाल, सुधार, विचार? contact@gogermany.ma पर लिखें — हम सब पढ़ते हैं।'],
    ]},
    contact: { subtitle: 'सवाल, सुधार, साझेदारियाँ — हम सब पढ़ते हैं', sections: [
      ['आपसे सुनकर ख़ुशी होगी', 'जर्मनी के रास्ते पर कोई सवाल, किसी लेख में दिखी गलती, या कोई टूल जो हमें बनाना चाहिए — आपका संदेश स्वागतयोग्य है।'],
      ['तेज़ मदद के लिए', 'अपना लक्षित रास्ता (Ausbildung, पढ़ाई या काम), देश और सटीक सवाल लिखें। संदेश जितना ठोस, जवाब उतना उपयोगी।'],
      ['जवाब का समय', 'कार्यदिवसों में आमतौर पर 48 घंटे के भीतर जवाब देते हैं। छोटे सवालों के लिए WhatsApp सबसे तेज़ है।'],
      ['साझेदारी और प्रेस', 'भाषा स्कूल, रिक्रूटर, विश्वविद्यालय और मीडिया: उसी पते पर, विषय में «Partnership» लिखकर।'],
    ]},
  },
  ur: {
    about: { subtitle: 'GoGermany کے پیچھے کون ہے، ہم کیسے کام کرتے ہیں، اور سب کچھ مفت کیوں ہے', sections: [
      ['ہماری کہانی', 'GoGermany ایک سیدھے مشاہدے سے شروع ہوا: لوگ جرمنی منتقلی کی اُس معلومات کے لیے ایجنسیوں کو ہزاروں یورو دیتے ہیں جو مفت ہونی چاہیے۔ ہم نے وہ پلیٹ فارم بنایا جس کی ہمیں خود خواہش تھی — «کیا یہ میرے لیے ممکن ہے؟» سے جرمنی میں آپ کے ابتدائی ہفتوں تک قدم بہ قدم رہنمائی، آج 12 زبانوں میں۔'],
      ['یہاں کیا ملے گا', 'ہر راستے کے لیے عملی گائیڈز (آؤسبلڈنگ، یونیورسٹی، ہنر مند کام)، 200+ تفصیلی مضامین، 18 مفت انٹرایکٹو ٹولز — اہلیت چیکر اور جرمن CV بلڈر سے انٹرویو مشق اور تنخواہ کیلکولیٹرز تک — A1 سے C1 تک مفت جرمن اسباق، اور روزانہ تازہ ہوتی آؤسبلڈنگ آسامیاں۔'],
      ['ہم مواد کیسے بناتے ہیں', 'ہمارا مواد سرکاری ذرائع (BAMF، وفاقی لیبر ایجنسی، سفارت خانے، یونیورسٹیاں) سے تحقیق شدہ ہے، AI ٹولز کی مدد سے لکھا جاتا ہے اور ہماری ٹیم جائزہ اور تازہ کاری کرتی ہے۔ ہر عدد اپنے اشاعتی سیاق کے ساتھ ہے؛ اصول بدلیں تو ہم اپ ڈیٹ کرتے ہیں۔ غلطی نظر آئے؟ بتائیں — ہم درست کرتے ہیں۔'],
      ['ہمارا مشن', 'قابلِ اعتماد ہجرتی معلومات کا انحصار اس پر نہیں ہونا چاہیے کہ آپ کتنا دے سکتے ہیں یا کون سی زبان بولتے ہیں۔ ہمارا مشن: جرمنی تک کا پورا سفر سب کے لیے قابلِ فہم اور قابلِ حصول بنانا — مفت، آپ کی زبان میں۔'],
      ['فنڈنگ کیسے ہوتی ہے', 'GoGermany اشتہارات اور واضح نشان زد پارٹنر لنکس سے چلتا ہے۔ یہی ہر ٹول اور سبق کو مفت رکھتا ہے۔ ہم آپ کا ڈیٹا کبھی نہیں بیچتے، اور شراکتیں ہماری سفارشات پر کبھی اثر نہیں ڈالتیں — تفصیل ڈس کلیمر میں ہے۔'],
      ['ٹیم', 'ہم مراکش اور جرمنی کے درمیان کام کرتی ایک چھوٹی بین الاقوامی ٹیم ہیں — بالکل اسی سفر کے ذاتی تجربے کے ساتھ جس کی آپ تیاری کر رہے ہیں۔ سوالات، تصحیحات، خیالات؟ contact@gogermany.ma پر لکھیں — ہم سب پڑھتے ہیں۔'],
    ]},
    contact: { subtitle: 'سوالات، تصحیحات، شراکتیں — ہم سب پڑھتے ہیں', sections: [
      ['آپ سے سن کر خوشی ہوگی', 'جرمنی کے راستے پر کوئی سوال، کسی مضمون میں ملی غلطی، یا کوئی ٹول جو ہمیں بنانا چاہیے — آپ کا پیغام خوش آئند ہے۔'],
      ['تیز مدد کے لیے', 'اپنا ہدف راستہ (آؤسبلڈنگ، تعلیم یا کام)، اپنا ملک اور مخصوص سوال لکھیں۔ پیغام جتنا ٹھوس، جواب اتنا مفید۔'],
      ['جواب کا وقت', 'کام کے دنوں میں عموماً 48 گھنٹوں میں جواب دیتے ہیں۔ فوری سوالات کے لیے WhatsApp تیز ترین ذریعہ ہے۔'],
      ['شراکت اور پریس', 'زبان کے اسکول، ریکروٹرز، یونیورسٹیاں اور میڈیا: اسی پتے پر، موضوع میں «Partnership» لکھ کر۔'],
    ]},
  },
  zh: {
    about: { subtitle: 'GoGermany 背后是谁、我们如何工作、以及为什么一切免费', sections: [
      ['我们的故事', 'GoGermany 源于一个简单的观察：人们为本应免费的德国移居信息向中介支付数千欧元。我们打造了自己曾经希望拥有的平台——从「我有可能吗？」到你在德国的最初几周，一步步陪伴，如今支持 12 种语言。'],
      ['你会在这里找到什么', '每条路径的实用指南（职业培训、大学、技术工作）、200 多篇深度文章、18 个免费互动工具——从资格检测器、德式简历生成器到面试练习和工资计算器——A1 到 C1 的免费德语课程，以及每日更新的职业培训岗位。'],
      ['内容如何产生', '我们的内容取材于官方来源（BAMF、联邦劳工局、使馆、大学），借助 AI 工具撰写，并由团队审核和更新。每个数字都带有发布时间背景；规则变化时我们随之更新。发现错误？告诉我们——我们会修正。'],
      ['我们的使命', '可靠的移民信息不应取决于你能支付多少或说哪种语言。我们的使命：让通往德国的整个旅程对每个人都清晰可行——免费、用你的语言。'],
      ['运营资金从哪来', 'GoGermany 依靠广告和明确标注的合作链接维持运转，这让每个工具和课程保持免费。我们绝不出售你的数据，合作也绝不影响我们的推荐——免责声明中有详细说明。'],
      ['团队', '我们是一支往返于摩洛哥和德国之间的小型国际团队，亲身经历过你正在准备的这段旅程。问题、勘误或想法？写信至 contact@gogermany.ma——我们每封都读。'],
    ]},
    contact: { subtitle: '问题、勘误、合作——我们每封都读', sections: [
      ['期待你的来信', '关于你德国之路的疑问、文章中发现的错误、或希望我们开发的工具——欢迎来信。'],
      ['帮我们更快帮到你', '写明你的目标路径（职业培训、留学或工作）、所在国家和具体问题。信息越具体，回复越有用。'],
      ['回复时间', '工作日通常 48 小时内回复。小问题走 WhatsApp 最快。'],
      ['合作与媒体', '语言学校、招聘方、大学和媒体：同一邮箱，主题注明「Partnership」。'],
    ]},
  },
}

for (const loc of Object.keys(C)) {
  const f = `messages/${loc}.json`
  const j = JSON.parse(fs.readFileSync(f, 'utf8'))
  for (const page of ['about', 'contact']) {
    const src = C[loc][page]
    j.static[page] = {
      ...j.static[page],
      subtitle: src.subtitle,
      sections: src.sections.map(([h, b]) => ({ h, b })),
    }
  }
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n')
  console.log('ok', loc)
}
