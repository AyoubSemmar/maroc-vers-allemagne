'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'

type Article = {
  id: string
  title: string
  category?: string | null
  image_url?: string | null
  date?: string | null
  read_time?: string | null
}

const tools = [
  { name: 'البنوك',         desc: 'افتح حساباً بسهولة من المغرب', icon: '🏦', href: '/banking',     c: 'brand' as const },
  { name: 'السكن',          desc: 'شقق وغرف مشتركة WG',        icon: '🏠', href: '/listings',    c: 'gold'  as const },
  { name: 'الجامعات',       desc: 'ادرس في ألمانيا مجاناً',     icon: '🎓', href: '/universities', c: 'teal'  as const },
  { name: 'العمل',          desc: 'ابحث عن وظيفتك المناسبة',   icon: '💼', href: '/jobs',        c: 'berry' as const },
  { name: 'السيرة الذاتية', desc: 'Lebenslauf احترافي + ذكاء اصطناعي', icon: '📄', href: '/cv-builder', c: 'brand' as const },
  { name: 'خطاب التحفيز', desc: 'Anschreiben بالألمانية في ثوانٍ',  icon: '✍️', href: '/anschreiben-generator', c: 'teal' as const },
  { name: 'Ausbildung',     desc: 'التدريب المهني المزدوج',     icon: '🔧', href: '/ausbildung',  c: 'gold'  as const },
  { name: 'فرص Ausbildung', desc: 'عروض حقيقية محدّثة يومياً',    icon: '🔍', href: '/ausbildung-jobs', c: 'brand' as const },
  { name: 'التأشيرة',       desc: 'كل الأوراق والإجراءات',      icon: '📄', href: '/visa',        c: 'brand' as const },
  { name: 'تعلم الألمانية', desc: 'دروس من A1 إلى C1',          icon: '📚', href: '/learn-german', c: 'teal'  as const },
  { name: 'شرائح SIM',      desc: 'ابقَ متصلاً من اليوم الأول',  icon: '📱', href: '/categories/شرائح الاتصال', c: 'berry' as const },
]

const levels: Array<{ id: string; title: string; desc: string; state: 'done' | 'active' | '' }> = [
  { id: 'A1', title: 'المبتدئ',  desc: 'السلام، الأرقام، تقديم النفس',     state: 'done' },
  { id: 'A2', title: 'أساسيات', desc: 'تسوق، مواعيد، وصف الأشخاص',        state: 'done' },
  { id: 'B1', title: 'متوسط',   desc: 'محادثات يومية، آراء، عمل',          state: 'active' },
  { id: 'B2', title: 'متقدم',   desc: 'نقاشات معقدة، نصوص رسمية',         state: '' },
  { id: 'C1', title: 'إتقان',    desc: 'مستوى أكاديمي ومهني',              state: '' },
]

const faqs = [
  {
    q: 'هل الموقع مجاني فعلاً؟',
    a: 'نعم، الوصول الكامل لجميع المقالات والأدوات ودروس الألمانية من A1 إلى C1 مجاني تماماً. هدفنا هو مساعدة المغاربة على الانتقال بثقة، بدون عوائق.',
    open: true,
  },
  {
    q: 'هل أحتاج لمعرفة الألمانية قبل السفر؟',
    a: 'يُفضّل معرفة المستوى B1 على الأقل للعمل والدراسة الجامعية، و A2 للـ Ausbildung. لكن الكثير من البرامج تقبل المبتدئين وتوفّر كورسات لغة مدمجة. دروسنا تغطي كل المستويات.',
  },
  {
    q: 'ما الفرق بين Studium و Ausbildung؟',
    a: 'الـ Studium هو الدراسة الجامعية الأكاديمية، بينما الـ Ausbildung هو تدريب مهني مزدوج (نظري + عملي) مدفوع الأجر، يؤهّلك لمهنة محددة خلال 2-3 سنوات. كلاهما مسارات ممتازة للهجرة.',
  },
  {
    q: 'كم من الوقت تستغرق إجراءات التأشيرة؟',
    a: 'تختلف حسب نوع التأشيرة والسفارة، لكنها عموماً تتراوح بين 4 و 12 أسبوعاً. ننصح دائماً ببدء التحضير قبل 4-6 أشهر من الموعد المطلوب. نوفّر دليلاً كاملاً لكل نوع تأشيرة.',
  },
  {
    q: 'هل المعلومات محدّثة ورسمية؟',
    a: 'نحرص على تحديث المحتوى بشكل مستمر بناءً على المصادر الرسمية الألمانية والسفارات. لكن للقرارات الرسمية، ننصح دائماً بالتحقق من الجهات الرسمية المختصة. معلوماتنا إرشادية.',
  },
]

const marqueeItems = [
  '🏦 البنوك الألمانية', '🎓 Studium & Universität', '📄 Visa & Aufenthalt', '💼 سوق العمل',
  '🔧 Ausbildung', '🏠 Wohnung & WG', '📚 من A1 إلى C1', '📱 شرائح SIM',
]

function Stat({ target, suffix, label, text }: { target?: number; suffix?: string; label: string; text?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [val, setVal] = useState(target ? 0 : null)

  useEffect(() => {
    if (target === undefined) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        const start = performance.now()
        const dur = 1400
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur)
          setVal(Math.round(target * (1 - Math.pow(1 - t, 3))))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        io.unobserve(el)
      })
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return (
    <div ref={ref} className="reveal">
      <div className="stat-num">
        {text ? <span style={{ fontFamily: 'var(--font-ar)' }}>{text}</span> : `${val ?? 0}${suffix ?? ''}`}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function RihlaLanding({ articles }: { articles: Article[] }) {
  const [email, setEmail] = useState('')
  const [nlStatus, setNlStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    // reveal-on-scroll
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in')
          io.unobserve(en.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })
    document.querySelectorAll('.rihla .reveal').forEach((el) => io.observe(el))

    // tool hover tracking
    const handlers: Array<() => void> = []
    document.querySelectorAll<HTMLElement>('.rihla .tool').forEach((t) => {
      const onMove = (e: MouseEvent) => {
        const r = t.getBoundingClientRect()
        t.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
        t.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
      }
      t.addEventListener('mousemove', onMove)
      handlers.push(() => t.removeEventListener('mousemove', onMove))
    })

    return () => {
      io.disconnect()
      handlers.forEach((h) => h())
    }
  }, [])

  async function submitNewsletter(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setNlStatus('loading')
    const supabase = createClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: email.trim().toLowerCase() }])
    if (!error) { setNlStatus('success'); setEmail('') }
    else if (error.code === '23505') setNlStatus('duplicate')
    else setNlStatus('error')
  }

  const articleList = articles.slice(0, 3)

  return (
    <div className="rihla" dir="rtl">
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-mesh"></div>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              MA→DE · الدليل الأول للمغاربة في ألمانيا
            </span>
            <h1 className="hero-title">
              رحلتك إلى <span className="gradient-text">ألمانيا</span><br />
              تبدأ من هنا
            </h1>
            <p className="hero-sub">
              أدوات عملية، دروس ألمانية تفاعلية، وإعلانات سكن — كل ما تحتاجه للانتقال بثقة وبدون تعقيد، في مكان واحد.
            </p>
            <div className="hero-ctas">
              <a href="/learn-german" className="btn btn-primary">
                ابدأ رحلتك
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              </a>
              <a href="#tools" className="btn btn-ghost">تصفح الأدوات</a>
            </div>
            <div className="hero-trust">
              <div className="avatars">
                <div>ي</div><div>س</div><div>ك</div><div>+</div>
              </div>
              <span>انضم لآلاف المغاربة في رحلتهم نحو ألمانيا</span>
            </div>
          </div>

          {/* JOURNEY VISUAL */}
          <div className="journey">
            <div className="journey-title">رحلتك</div>

            <svg className="journey-svg" viewBox="0 0 500 500" preserveAspectRatio="none">
              <defs>
                <linearGradient id="rihlaPathGrad" x1="100%" y1="100%" x2="0" y2="0">
                  <stop offset="0" stopColor="oklch(0.72 0.26 25)" />
                  <stop offset="0.5" stopColor="oklch(0.78 0.24 45)" />
                  <stop offset="1" stopColor="oklch(0.84 0.22 75)" />
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path className="path-bg" d="M 427 443 C 360 430, 330 410, 340 370 S 390 310, 300 280 S 180 290, 210 220 S 340 180, 256 150 S 110 110, 56 73" />
              <path className="path-fg" d="M 427 443 C 360 430, 330 410, 340 370 S 390 310, 300 280 S 180 290, 210 220 S 340 180, 256 150 S 110 110, 56 73" filter="url(#neonGlow)" />
            </svg>

            <div className="flag flag-start">MA</div>
            <div className="stop stop-contract" data-label="عقد">📝</div>
            <div className="stop stop-visa" data-label="التأشيرة">📄</div>
            <div className="stop stop-house" data-label="سكن">🏠</div>
            <div className="flag flag-end">DE</div>
            <div className="plane">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2 12l20-8-8 20-2-9-10-3z" /></svg>
            </div>

            <div className="word-chip chip-willkommen">
              Willkommen
              <small>welcome · أهلاً</small>
            </div>
            <div className="word-chip chip-gutentag">
              Guten Tag
              <small>hello · مرحباً</small>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="marquee">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((it, i) => (
            <span key={i} className="marquee-item">{it}</span>
          ))}
        </div>
      </div>

      {/* ============ STATS ============ */}
      <section className="stats">
        <div className="wrap stats-grid">
          <Stat target={20} suffix="+" label="مقال ودليل عملي" />
          <Stat target={5} suffix=" مستويات" label="دروس ألمانية من A1 إلى C1" />
          <Stat target={8} suffix=" فئات" label="أدوات عملية مُنظّمة" />
          <Stat text="مجاناً" label="الوصول الكامل، دائماً" />
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">كيف يعمل</span>
            <h2>ثلاث خطوات للانطلاق</h2>
            <p className="section-sub">من البحث عن أداة، إلى تعلّم اللغة، إلى الوصول — كل شيء مُبسّط.</p>
          </div>
          <div className="steps">
            <div className="step reveal">
              <div className="step-num">الخطوة 01</div>
              <div className="step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="oklch(0.42 0.15 32)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              </div>
              <h3>ابحث عن أداتك</h3>
              <p>من السكن والبنوك إلى التأشيرات — كل ما تحتاجه منظم وواضح في فئات سهلة التصفح.</p>
            </div>
            <div className="step reveal">
              <div className="step-num">الخطوة 02</div>
              <div className="step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              </div>
              <h3>تعلم الألمانية</h3>
              <p>دروس تفاعلية مبنية خصيصاً للمغاربة، مع مفردات وقواعد وتمارين من A1 إلى C1.</p>
            </div>
            <div className="step reveal">
              <div className="step-num">الخطوة 03</div>
              <div className="step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="oklch(0.50 0.11 200)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>
              </div>
              <h3>انطلق بثقة</h3>
              <p>مسلحاً بالمعرفة والأدوات والمجتمع، ابدأ حياتك الجديدة في ألمانيا بدون تعقيد.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TOOLS GRID ============ */}
      <section id="tools" style={{ background: 'var(--bg-warm)' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">الأدوات العملية</span>
            <h2>كل ما تحتاجه، في مكان واحد</h2>
            <p className="section-sub">ثمانية أقسام، عشرات المقالات، وكل الأدوات التي ستحتاجها طوال رحلتك.</p>
          </div>
          <div className="tools">
            {tools.map((t) => (
              <a key={t.name} href={t.href} className="tool reveal" data-c={t.c}>
                <div className="tool-icon">{t.icon}</div>
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
                <div className="tool-link">اكتشف <span>←</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GERMAN LADDER ============ */}
      <section id="learn">
        <div className="wrap">
          <div className="ladder-wrap reveal">
            <div className="ladder-copy">
              <span className="kicker">تعلم الألمانية</span>
              <h2>من <span className="gradient-text">A1</span> إلى <span className="gradient-text">C1</span> — خطوة بخطوة</h2>
              <p>قواعد، مفردات، وتمارين تفاعلية مُصمّمة خصيصاً للمتحدثين بالعربية. تقدم بالسرعة التي تناسبك مع تتبع فوري لتقدمك.</p>
              <a href="/learn-german" className="btn btn-primary">ابدأ التعلم مجاناً</a>
              <div className="ladder-meta">
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                  مجاني تماماً
                </div>
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                  تفاعلي
                </div>
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                  للمغاربة
                </div>
              </div>
            </div>
            <div className="ladder" style={{ ['--progress' as string]: '55%' } as React.CSSProperties}>
              <div className="ladder-line"></div>
              {levels.map((l, i) => {
                const card = (
                  <div className="level-card">
                    <div className="lvl-title">{l.title}</div>
                    <div className="lvl-desc">{l.desc}</div>
                  </div>
                )
                const dot = <div className="level-dot">{l.id}</div>
                return (
                  <div key={l.id} className={`level ${l.state}`}>
                    {i % 2 === 0 ? <>{card}{dot}</> : <>{dot}{card}</>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ ARTICLES ============ */}
      {articleList.length > 0 && (
        <section id="articles" style={{ background: 'var(--bg-warm)' }}>
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">مقالات مميزة</span>
              <h2>أحدث الأدلة والنصائح</h2>
            </div>
            <div className="articles">
              {articleList.map((a) => (
                <a key={a.id} href={`/articles/${a.id}`} className="article reveal">
                  <div className="article-img">
                    {a.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.image_url} alt={a.title} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: 48 }}>📰</div>
                    )}
                    {a.category && <span className="article-tag">{a.category}</span>}
                  </div>
                  <div className="article-body">
                    <h3>{a.title}</h3>
                    <div className="article-meta">
                      <span>{a.read_time ? `قراءة · ${a.read_time}` : 'اقرأ المزيد'}</span>
                      <span>{a.date ?? ''}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FAQ ============ */}
      <section id="faq">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">أسئلة شائعة</span>
            <h2>كل ما تريد معرفته</h2>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="faq reveal"
                open={openFaq === i}
                onToggle={(e) => {
                  if ((e.currentTarget as HTMLDetailsElement).open) setOpenFaq(i)
                  else if (openFaq === i) setOpenFaq(null)
                }}
              >
                <summary>
                  {f.q}
                  <span className="faq-icon"></span>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="newsletter reveal">
            <h2>ابقَ على اطلاع دائم</h2>
            <p>نشرة أسبوعية فيها أحدث الأدلة، فرص العمل، والنصائح العملية للانتقال إلى ألمانيا.</p>
            {nlStatus === 'success' ? (
              <div style={{ background: 'oklch(1 0 0 / 0.2)', backdropFilter: 'blur(12px)', padding: '14px 24px', borderRadius: 999, maxWidth: 480, margin: '0 auto', fontWeight: 700 }}>
                ✓ تم الاشتراك بنجاح!
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={submitNewsletter}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  required
                  dir="ltr"
                />
                <button type="submit" disabled={nlStatus === 'loading'}>
                  {nlStatus === 'loading' ? '...' : 'اشترك'}
                </button>
              </form>
            )}
            {nlStatus === 'duplicate' && <small style={{ color: 'oklch(0.95 0.08 90)' }}>هذا البريد مسجل مسبقاً</small>}
            {nlStatus === 'error' && <small>حدث خطأ، حاول مرة أخرى</small>}
            {nlStatus !== 'duplicate' && nlStatus !== 'error' && <small>لن نشارك بريدك مع أي جهة · يمكنك إلغاء الاشتراك في أي وقت</small>}
          </div>
        </div>
      </section>
    </div>
  )
}
