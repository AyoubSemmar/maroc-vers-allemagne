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

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto" dir="rtl">
      {/* Disclaimer banner */}
      <div className="border-b border-gray-700 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 text-center text-xs text-gray-400">
          ⚠️ المعلومات المقدمة هنا لأغراض إرشادية فقط ولا تُعدّ استشارة قانونية أو رسمية. يُرجى التحقق دائماً من المصادر الرسمية.
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        {/* Top: brand + columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5 font-black text-xl" dir="ltr">
                <span className="text-red-400">MA</span>
                <span className="text-gray-500 font-light mx-0.5">→</span>
                <span className="text-green-400">DE</span>
              </div>
              <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-md font-bold">دليلك</span>
            </a>
            <p className="text-sm text-gray-400 leading-relaxed">
              دليلك الشامل للهجرة والعمل والدراسة في ألمانيا — مبني خصيصاً للمغاربة.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="mailto:contact@gogermany.ma"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                ✉️ راسلنا
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">{col.heading}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} مغرب نحو ألمانيا. جميع الحقوق محفوظة.</span>
          <div className="flex items-center gap-4">
            <a href="/terms-of-use" className="hover:text-gray-300 transition-colors">شروط الاستخدام</a>
            <span>·</span>
            <a href="/privacy-policy" className="hover:text-gray-300 transition-colors">الخصوصية</a>
            <span>·</span>
            <a href="/disclaimer" className="hover:text-gray-300 transition-colors">إخلاء المسؤولية</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
