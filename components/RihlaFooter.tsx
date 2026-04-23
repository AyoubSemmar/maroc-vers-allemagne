const columns = [
  {
    heading: 'عن المشروع',
    links: [
      { label: 'من نحن', href: '/about' },
      { label: 'رسالتنا', href: '/about' },
      { label: 'تواصل معنا', href: '/contact' },
    ],
  },
  {
    heading: 'الأدلة العملية',
    links: [
      { label: 'السكن والشقق', href: '/housing' },
      { label: 'البنوك والحسابات', href: '/banking' },
      { label: 'شرائح SIM والإنترنت', href: '/simcards' },
      { label: 'الجامعات', href: '/universities' },
      { label: 'سوق العمل', href: '/jobs' },
      { label: 'الأوزبيلدونغ', href: '/ausbildung' },
      { label: 'الفيزا والأوراق', href: '/visa' },
    ],
  },
  {
    heading: 'الموارد',
    links: [
      { label: 'تعلم الألمانية', href: '/learn-german' },
      { label: 'المقالات', href: '/articles' },
      { label: 'روابط مفيدة', href: '/useful-links' },
    ],
  },
  {
    heading: 'قانوني',
    links: [
      { label: 'شروط الاستخدام', href: '/terms-of-use' },
      { label: 'سياسة الخصوصية', href: '/privacy-policy' },
      { label: 'إخلاء المسؤولية', href: '/disclaimer' },
    ],
  },
]

export default function RihlaFooter() {
  return (
    <footer className="rihla-footer" dir="rtl">
      <div className="rihla-foot-warning">
        <div className="wrap">
          ⚠️ المعلومات المقدمة هنا لأغراض إرشادية فقط ولا تُعدّ استشارة قانونية أو رسمية. يُرجى التحقق دائماً من المصادر الرسمية.
        </div>
      </div>

      <div className="wrap rihla-foot-grid">
        <div className="rihla-foot-brand">
          <a href="/" className="rihla-logo">
            <div className="rihla-logo-mark">MA→DE</div>
            <span>دليلك</span>
          </a>
          <p>دليلك الشامل للهجرة والعمل والدراسة في ألمانيا — مبني خصيصاً للمغاربة.</p>
          <a href="mailto:contact@maroc-vers-allemagne.com" className="rihla-foot-mail">
            ✉️ راسلنا
          </a>
        </div>

        {columns.map((col) => (
          <div key={col.heading} className="rihla-foot-col">
            <h4>{col.heading}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rihla-foot-bottom">
        <div className="wrap rihla-foot-bottom-inner">
          <span>© {new Date().getFullYear()} MA→DE · مغرب نحو ألمانيا</span>
          <span>المعلومات لأغراض إرشادية فقط · تحقق دائماً من المصادر الرسمية</span>
        </div>
      </div>
    </footer>
  )
}
