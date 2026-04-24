import ArticleHub, { ArticleItem, Bullets, Tip } from '@/components/ArticleHub'

export const metadata = {
  title: 'شرائح SIM والإنترنت في ألمانيا — دليل المغاربة',
  description: '20 مقالاً عن شرائح الاتصال، الإنترنت المنزلي، العروض، وتفادي النصب في ألمانيا.',
}

export default function SimcardsPage() {
  return (
    <ArticleHub
      eyebrow="الاتصالات والإنترنت"
      title="شرائح SIM والإنترنت في ألمانيا"
      subtitle="رقم ألماني ليس خياراً بل ضرورة. هنا كيف تختار الشركة المناسبة، والعرض المناسب، والحلول لكل وضع."
      intro="20 مقالاً يجيب عن كل أسئلتك: Prepaid أم Vertrag؟ Telekom أم O2؟ eSIM أم بطاقة فعلية؟ وكيف تتجنّب فخاخ العقود طويلة الأمد."
    >
      <ArticleItem
        num={1}
        title="لماذا تحتاج رقماً ألمانياً منذ اليوم الأول؟"
        summary="لن تستطيع التسجيل البنكي، التسجيل البلدي، البحث عن شقة، أو حتى تسلّم طرد بدون رقم ألماني فعّال."
        tag="أساسيات"
      >
        <Bullets items={[
          'البنوك تتحقق من هويتك برسالة SMS إلى رقم ألماني فقط.',
          'طلبات الشقق تُرفض دون رقم ألماني يُتصل به.',
          'Ausländerbehörde يراسلك عبر الهاتف لبعض المواعيد.',
          'Anmeldung في بعض المدن تتطلب رقم اتصال محلي.',
        ]} />
        <Tip>احتفظ برقمك المغربي مفعّلاً عبر الأرقام الافتراضية (WhatsApp/Google Voice) لمدة شهرين على الأقل بعد الوصول.</Tip>
      </ArticleItem>

      <ArticleItem
        num={2}
        title="Prepaid مقابل Vertrag — الاختيار الأول"
        summary="قرار يحدّد مرونتك ومصاريفك طوال سنتين. اختر بناء على استقرارك، لا على السعر الظاهري."
        tag="مقارنة"
      >
        <Bullets items={[
          <><strong>Prepaid:</strong> دفع مسبق، لا عقد، لا Schufa، يُفعَّل فوراً.</>,
          <><strong>Vertrag:</strong> عقد 24 شهراً، أسعار أقل، يتطلّب Schufa + حساب بنكي.</>,
          'كطالب جديد: ابدأ Prepaid ثم انقُل الرقم لاحقاً إلى Vertrag.',
          'Vertrag مع iPhone/هاتف جديد: غالباً أغلى من شراء الهاتف منفصلاً.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={3}
        title="الشبكات الثلاث الكبرى في ألمانيا"
        summary="ثلاث شبكات فيزيائية، وعشرات العلامات التي تستخدمها. الشبكة الفعلية مهمّة أكثر من الاسم."
        tag="شبكات"
      >
        <Bullets items={[
          <><strong>Deutsche Telekom (D1):</strong> التغطية الأفضل خصوصاً في الريف.</>,
          <><strong>Vodafone (D2):</strong> الأسرع في المدن الكبرى، جيدة في القرى.</>,
          <><strong>O2 (Telefónica):</strong> الأرخص، تغطية جيدة في المدن، ضعيفة في الريف.</>,
          'أي شركة صغيرة (Aldi Talk, Lidl Connect, Congstar...) تستخدم إحدى هذه الشبكات.',
        ]} />
        <Tip>قبل اختيار الشركة، افحص التغطية في منطقتك عبر breitbandmessung.de أو netzabdeckung.o2online.de.</Tip>
      </ArticleItem>

      <ArticleItem
        num={4}
        title="Telekom (Magenta) — الأغلى والأفضل تغطية"
        summary="إذا كنت في قرية أو تسافر كثيراً بالقطار، Telekom هي الخيار الأكيد. السعر عالٍ لكن يستحق."
        tag="Telekom"
      >
        <Bullets items={[
          'MagentaMobil Start: 30€/شهر، 20GB، اتصالات مفتوحة.',
          'خيارات عائلية (MagentaEins) ممتازة إن كان لديك إنترنت منزلي منها.',
          'الشبكة الوحيدة المستقرة في القطارات السريعة (ICE).',
          '5G متوفّر في أغلب المدن الكبرى.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={5}
        title="Vodafone — منافس متوازن"
        summary="شركة كبيرة بشبكة قوية وعروض تنافسية. مثالية لمن يعيش في مدن كبرى أو متوسطة."
        tag="Vodafone"
      >
        <Bullets items={[
          'GigaMobil S: ~25€/شهر، 15GB.',
          'عروض Unlimited متاحة بسعر معقول.',
          '5G منتشر جيداً في Hamburg, München, Köln, Berlin.',
          'تغطية Unterwegs جيدة في الطرق السيارة.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={6}
        title="O2 — الأرخص في المدن"
        summary="إن كنت في مدينة كبرى وتستهلك كثيراً، O2 أفضل قيمة. لكن تجنّبها في الريف."
        tag="O2"
      >
        <Bullets items={[
          'o2 Mobile M: ~20€/شهر، 20GB.',
          'عروض Free Unlimited حقيقية (30–40€).',
          'تغطية ضعيفة في القرى وبعض القطارات الإقليمية.',
          'خدمة عملاء متوسطة — بالألمانية فقط غالباً.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={7}
        title="Aldi Talk — أشهر خيار Prepaid"
        summary="يستخدمه مئات الآلاف. سعر منخفض، تفعيل سهل، شبكة O2 فعلياً."
        tag="Aldi Talk"
      >
        <Bullets items={[
          'Paket S: 7.99€/أسبوعين، 5GB + اتصالات مفتوحة.',
          'Paket M: 12.99€/4 أسابيع، 12GB + مكالمات مفتوحة.',
          'تفعيل عبر PostIdent أو VideoIdent في بضع دقائق.',
          'متوفّر في كل فرع Aldi Süd و Aldi Nord.',
        ]} />
        <Tip>تحتاج NFC لهاتفك لاستعمال تفعيل Online. إن لم يتوفّر، اذهب إلى فرع Aldi مع جوازك.</Tip>
      </ArticleItem>

      <ArticleItem
        num={8}
        title="Lidl Connect — بديل Aldi Talk"
        summary="يعمل على شبكة Vodafone، لذا يغطّي مناطق ريفية أفضل من Aldi Talk."
        tag="Lidl"
      >
        <Bullets items={[
          'Smart S: 7.99€/4 أسابيع، 5GB.',
          'Smart L: 17.99€/4 أسابيع، 25GB.',
          'يُباع في فروع Lidl والإنترنت.',
          'تفعيل عبر VideoIdent أو في الفرع.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={9}
        title="Congstar — Telekom بأسعار أقل"
        summary="علامة Telekom الرخيصة. تحصل على نفس الشبكة الممتازة بثمن أقل بـ 30–40%."
        tag="Congstar"
      >
        <Bullets items={[
          'Allnet Flat M: 17€/شهر، 10GB.',
          'عقد 24 شهراً أو شهرياً (أغلى قليلاً).',
          'جودة مكالمات متطابقة مع Telekom.',
          'خدمة عملاء ألمانية جيدة.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={10}
        title="Blau — Vodafone بسعر مخفّض"
        summary="علامة Vodafone الرخيصة. مثالية لمن يريد شبكة قوية دون سعر Vodafone الرسمي."
        tag="Blau"
      >
        <Bullets items={[
          'Blau Allnet L: 15€/4 أسابيع، 15GB.',
          'خيار شهري بدون عقد.',
          'Roaming مجاني كامل الاتحاد الأوروبي.',
          'تفعيل سريع عبر التطبيق.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={11}
        title="التحقق من الهوية (PostIdent / VideoIdent)"
        summary="لا يمكنك شراء SIM دون إثبات هوية. ألمانيا تأخذ ذلك بجدية منذ 2017."
        tag="تحقق"
      >
        <Bullets items={[
          'VideoIdent: مكالمة فيديو 5 دقائق، جواز + إضاءة جيّدة، متاح لأغلب الشركات.',
          'PostIdent: زيارة مكتب بريد مع نموذج مطبوع، مجاني للشركة.',
          'في المحلات: اذهب بجوازك، ينتهي التفعيل في 10 دقائق.',
          'الرقم المغربي غير مقبول للتحقق — تحتاج إيميل.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={12}
        title="نقل الرقم بين الشركات (Rufnummermitnahme)"
        summary="يمكنك الاحتفاظ برقمك عند تبديل الشركة. العملية مجانية تقريباً."
        tag="نقل رقم"
      >
        <Bullets items={[
          'أعطِ الشركة الجديدة: رقمك القديم + Kundennummer + Kündigungstermin.',
          'الشركة الجديدة تتكفّل بكل شيء تقريباً.',
          'مدة النقل: 1–7 أيام.',
          'منذ 2020، الرسم 6.82€ كحد أقصى قانوناً.',
        ]} />
        <Tip>انقل الرقم قبل نهاية العقد بـ 3 أشهر لتضمن عدم انقطاعه وخسارته.</Tip>
      </ArticleItem>

      <ArticleItem
        num={13}
        title="eSIM — البديل الرقمي الحديث"
        summary="eSIM متوفّرة في ألمانيا من أغلب الشركات. مثالية للهواتف الحديثة والسفر."
        tag="eSIM"
      >
        <Bullets items={[
          'Telekom, Vodafone, O2, Congstar, 1&1 تدعم eSIM.',
          'Aldi Talk بدأت تدعمها 2024.',
          'هواتف iPhone XS+ و Samsung Galaxy S20+ تدعم eSIM.',
          'يمكن تفعيل خطين (SIM فعلية + eSIM) معاً.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={14}
        title="Roaming في الاتحاد الأوروبي"
        summary="منذ 2017، الـ Roaming داخل الاتحاد مجاني مع أي SIM ألمانية. لكن هناك قيود."
        tag="Roaming"
      >
        <Bullets items={[
          'Fair Use: إذا قضيت وقتاً طويلاً خارج ألمانيا، الشركة قد تحدّد الاستهلاك.',
          'الاستعمال اليومي في فرنسا/إسبانيا/إيطاليا كما في ألمانيا دون رسم.',
          'المغرب = خارج الاتحاد = Roaming مدفوع (10–20€/ميجا).',
          'للسفر للمغرب: اشترِ eSIM سفر مؤقتة (Holafly, Airalo).',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={15}
        title="الإنترنت المنزلي (DSL, Kabel, Glasfaser)"
        summary="ثلاث تقنيات، وأسعار متباينة، وعقود تربطك 24 شهراً. تأنَّ قبل التوقيع."
        tag="إنترنت منزلي"
      >
        <Bullets items={[
          <><strong>DSL:</strong> الأكثر انتشاراً، سرعات 50–250Mbit.</>,
          <><strong>Kabel:</strong> Vodafone + Pyur، سرعات 100–1000Mbit.</>,
          <><strong>Glasfaser:</strong> الألياف، الأسرع (1GB+)، لكن غير متوفّر في كل الأحياء.</>,
          'تحقّق من العنوان على verfügbarkeit-check.de قبل التوقيع.',
          'وقت التفعيل: 2–8 أسابيع — لا تتأخر في الطلب.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={16}
        title="حلول الإنترنت المؤقّتة (LTE Router)"
        summary="إن كنت تنتظر توصيل DSL، راوتر LTE مع SIM يُشغّلك فوراً. مفيد للسكن الطلابي."
        tag="LTE"
      >
        <Bullets items={[
          'راوتر محمول (MiFi) + SIM بـ 50GB شهرياً: ~30€/شهر.',
          'Congstar Homespot و Telekom SpeedStick حلول معروفة.',
          'مناسب للإقامات القصيرة (شهر Airbnb، فندق طويل).',
          'لا يصلح كحل دائم — أغلى من DSL على المدى البعيد.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={17}
        title="كيفية إلغاء العقد (Kündigung)"
        summary="كل عقد في ألمانيا ينتظر Kündigung كتابي. دون رسالة رسمية، يتجدّد تلقائياً."
        tag="إلغاء"
      >
        <Bullets items={[
          'المدة القانونية للإلغاء: 3 أشهر قبل نهاية العقد (الحد الأقصى).',
          'أرسل Kündigung كتابياً عبر Einschreiben (بريد مسجّل) أو عبر موقع الشركة.',
          'اطلب تأكيد كتابي (Kündigungsbestätigung).',
          'منذ 2022، يجب على الشركات توفير زرّ إلغاء مباشر على الموقع.',
        ]} />
        <Tip>موقع kuendigung.org يولّد رسالة رسمية قانونية ويرسلها نيابة عنك — موثوق جداً.</Tip>
      </ArticleItem>

      <ArticleItem
        num={18}
        title="عروض الطلاب والشباب"
        summary="شركات كثيرة تقدّم خصومات لحاملي بطاقة طالب أو لمن أعمارهم تحت 28."
        tag="خصومات"
      >
        <Bullets items={[
          'Telekom MagentaMobil Young: خصم 30% حتى سنّ 28.',
          'Vodafone Young: 10GB بـ 15€ بدل 25€.',
          'O2 My Young: شروط مماثلة.',
          'اطلب الخصم عبر موقع الشركة مع رفع Studierendenausweis.',
          'الخصم يبقى حتى يوم ميلادك الـ 28.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={19}
        title="شرائح بدون عنوان ألماني"
        summary="ما تفعله لو وصلت ألمانيا ولا عنوان ثابت بعد. خيارات محدودة لكنها ممكنة."
        tag="دون عنوان"
      >
        <Bullets items={[
          'Lycamobile و Lebara Prepaid: تقبل التسجيل بعنوان فندق أو Airbnb.',
          'Aldi Talk: قد تقبل عنوان مؤقت ثم تحدّثه لاحقاً.',
          'Vodafone CallYa: اشتر من المحل بجواز السفر فقط.',
          'بمجرد Anmeldung، حدّث عنوانك في التطبيق.',
        ]} />
      </ArticleItem>

      <ArticleItem
        num={20}
        title="احذر النصب والاحتيال"
        summary="محلات الاتصالات في المحطات وبعض المواقع تبيع عقوداً تعبر بشروط مخفية. خطر حقيقي."
        tag="تحذيرات"
      >
        <Bullets items={[
          'لا توقّع ورقة باللغة الألمانية لا تفهمها 100%.',
          'تجنّب محلات الهاتف في محطات القطار الكبرى — أسعار مبالغ فيها.',
          'احذر مكالمات باسم "الشركة" تطلب بيانات — الاحتيال منتشر.',
          'اعرض العقد على صديق ألماني قبل التوقيع.',
          'احتفظ بالعقد وأي إيصالات لمدة 3 سنوات على الأقل.',
        ]} />
        <Tip>أفضل طريقة: افتح العقد أونلاين في موقع الشركة الرسمي. لا وسيط، لا مشاكل لاحقة.</Tip>
      </ArticleItem>
    </ArticleHub>
  )
}
