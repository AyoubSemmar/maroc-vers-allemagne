'use client'

import { useEffect, useState, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { useCatLabel } from '@/lib/article-cat'

type Article = {
  id: string
  title: string
  category?: string | null
  image_url?: string | null
  date?: string | null
  read_time?: string | null
}

/* Lucide-thin icon set, inlined to avoid a dep — stroke 1.5 for editorial feel */
const Icon = {
  arrow: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
  ),
  compass: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="m14.5 9.5-2 5-5 2 2-5 5-2z"/></svg>
  ),
  book: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 5h16"/><path d="M4 12h12"/><path d="M4 19h8"/></svg>
  ),
  send: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v7H3V3h7"/></svg>
  ),
  pin: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
  ),
  hammer: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2"/><rect x="5" y="6" width="14" height="4" rx="1"/><path d="M12 10v11"/><path d="M9 21h6"/></svg>
  ),
  cap: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m22 9-10 4L2 9l10-4 10 4z"/><path d="M6 11v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg>
  ),
  doc: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
  ),
  euro: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 10h12"/><path d="M4 14h12"/><path d="M19 5a8 8 0 1 0 0 14"/></svg>
  ),
  cal: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>
  ),
  check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l4 4L19 7"/></svg>
  ),
  list: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>
  ),
}

export default function RihlaLanding({ articles }: { articles: Article[] }) {
  const t = useTranslations('landing')
  const locale = useLocale() as AppLocale
  const dir = dirFor(locale)
  const catLabel = useCatLabel()

  const [email, setEmail] = useState('')
  const [nlStatus, setNlStatus] = useState<
    'idle' | 'loading' | 'success' | 'error' | 'duplicate'
  >('idle')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const tools = [
    { key: 'cv',                  Icon: Icon.doc,    href: '/cv-builder' },
    { key: 'anschreiben',         Icon: Icon.send,   href: '/anschreiben-generator' },
    { key: 'livingCost',          Icon: Icon.euro,   href: '/tools/living-cost-calculator' },
    { key: 'migrationTimeline',   Icon: Icon.cal,    href: '/tools/migration-timeline' },
    { key: 'documentChecklist',   Icon: Icon.list,   href: '/tools/document-checklist' },
    { key: 'eligibilityChecker',  Icon: Icon.check,  href: '/tools/eligibility-checker' },
  ] as const

  type JourneyStep = {
    Icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement
    metaKey: string
    titleKey: string
    noteKey: string
    accent?: boolean
  }
  const journeySteps: JourneyStep[] = [
    { Icon: Icon.compass, metaKey: 'journeyStep1Meta', titleKey: 'hero.stopChoose',  noteKey: 'journeyStep1Note' },
    { Icon: Icon.book,    metaKey: 'journeyStep2Meta', titleKey: 'hero.stopGerman',  noteKey: 'journeyStep2Note' },
    { Icon: Icon.send,    metaKey: 'journeyStep3Meta', titleKey: 'hero.stopVisa',    noteKey: 'journeyStep3Note' },
    { Icon: Icon.pin,     metaKey: 'journeyStep4Meta', titleKey: 'hero.stopArrival', noteKey: 'journeyStep4Note', accent: true },
  ]

  const levels: Array<{
    id: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
    state: 'done' | 'active' | ''
  }> = [
    { id: 'A1', state: 'done' },
    { id: 'A2', state: 'done' },
    { id: 'B1', state: 'active' },
    { id: 'B2', state: '' },
    { id: 'C1', state: '' },
  ]

  const faqIds = [1, 2, 3, 4, 5] as const

  const marqueeKeys = [
    'banks', 'studium', 'visa', 'jobs',
    'ausbildung', 'housing', 'levels', 'sim',
  ] as const

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in')
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )
    document.querySelectorAll('.rihla .reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  async function submitNewsletter(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setNlStatus('loading')
    const supabase = createClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: email.trim().toLowerCase() }])
    if (!error) {
      setNlStatus('success')
      setEmail('')
    } else if (error.code === '23505') setNlStatus('duplicate')
    else setNlStatus('error')
  }

  const articleList = articles.slice(0, 3)
  const isAr = dir === 'rtl'

  return (
    <div className="rihla rihla--editorial" dir={dir}>
      {/* ============ HERO ============ */}
      <section className="hero hero--calm">
        <div className="hero-dotgrid" aria-hidden />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow eyebrow--mono">
              <span className="eyebrow-dot" />
              {t('hero.eyebrow')}
            </span>
            <h1 className="hero-title hero-title--serif">
              {t('hero.titleLine1')}{' '}
              <em className="accent-gold">{t('hero.titleHighlight')}</em>
              {t.raw('hero.titleLine2') ? (
                <>
                  <br />
                  <em className="accent-italic">{t('hero.titleLine2')}</em>
                </>
              ) : null}
            </h1>
            <p className="hero-sub hero-sub--editorial">{t('hero.sub')}</p>
            <div className="hero-ctas">
              <Link href="/ausbildung" className="btn btn-primary">
                {t('hero.ctaAusbildung')}
                <Icon.arrow width="16" height="16" style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
              </Link>
              <Link href="/studium" className="btn btn-ghost">
                {t('hero.ctaStudium')}
                <Icon.arrow width="16" height="16" style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
              </Link>
            </div>
            <div className="hero-trust">
              <div className="avatars" aria-hidden>
                <div>ي</div><div>س</div><div>ك</div><div>+</div>
              </div>
              <span>{t('hero.trust')}</span>
            </div>
          </div>

          {/* JOURNEY CARD — replaces the busy SVG map */}
          <aside className="hero-card hero-card--journey reveal" aria-label={t('hero.journeyTitle')}>
            <div className="hero-card-eyebrow">{t('hero.journeyEyebrow')}</div>
            <div className="hero-card-title">
              {t('hero.journeyHeadline')}
            </div>
            <div className="hero-card-sub">{t('hero.journeySub')}</div>
            <ol className="journey">
              {journeySteps.map((s, i) => (
                <li key={i} className="journey-step">
                  <span className={`journey-dot ${s.accent ? 'journey-dot--end' : ''}`} aria-hidden>
                    <s.Icon />
                  </span>
                  <div className="journey-body">
                    <span className="journey-meta">{t(s.metaKey)}</span>
                    <span className="journey-name">{t(s.titleKey)}</span>
                    <span className="journey-note">{t(s.noteKey)}</span>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="marquee">
        <div className="marquee-track">
          {[...marqueeKeys, ...marqueeKeys].map((k, i) => (
            <span key={i} className="marquee-item">{t(`marquee.${k}`)}</span>
          ))}
        </div>
      </div>

      {/* ============ STATS — light editorial grid (replaces the dark stripe) ============ */}
      <section className="stats stats--editorial">
        <div className="wrap stats-grid">
          <div className="stat reveal">
            <div className="stat-num">{t('stats.jobs.num')}</div>
            <div className="stat-label">{t('stats.jobs.label')}</div>
          </div>
          <div className="stat reveal">
            <div className="stat-num">{t('stats.universities.num')}</div>
            <div className="stat-label">{t('stats.universities.label')}</div>
          </div>
          <div className="stat reveal">
            <div className="stat-num">{t('stats.stipend.text')}</div>
            <div className="stat-label">{t('stats.stipend.label')}</div>
          </div>
          <div className="stat reveal">
            <div className="stat-num">{t('stats.tuition.text')}</div>
            <div className="stat-label">{t('stats.tuition.label')}</div>
          </div>
        </div>
      </section>

      {/* ============ CHOOSE YOUR PATH ============ */}
      <section id="paths" className="r-section">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">{t('paths.kicker')}</span>
            <h2 className="section-title section-title--serif">{t('paths.title')}</h2>
            <p className="section-sub">{t('paths.sub')}</p>
          </div>
          <div className="cards cards--two">
            <Link href="/ausbildung" className="card card-feature reveal">
              <span className="card-icon"><Icon.hammer /></span>
              <h3 className="card-title">{t('paths.ausbildung.title')}</h3>
              <p className="card-desc">{t('paths.ausbildung.desc')}</p>
              <div className="card-link">
                {t('paths.ausbildung.cta')}
                <Icon.arrow width="14" height="14" style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
              </div>
            </Link>
            <Link href="/studium" className="card card-feature reveal">
              <span className="card-icon card-icon--gold"><Icon.cap /></span>
              <h3 className="card-title">{t('paths.studium.title')}</h3>
              <p className="card-desc">{t('paths.studium.desc')}</p>
              <div className="card-link">
                {t('paths.studium.cta')}
                <Icon.arrow width="14" height="14" style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TOOLS ============ */}
      <section id="tools" className="r-section r-section--warm">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">{t('tools.kicker')}</span>
            <h2 className="section-title section-title--serif">{t('tools.title')}</h2>
            <p className="section-sub">{t('tools.sub')}</p>
          </div>
          <div className="cards cards--three">
            {tools.map((tool) => (
              <Link key={tool.key} href={tool.href} className="card reveal">
                <span className="card-icon"><tool.Icon /></span>
                <h3 className="card-title">{t(`tools.${tool.key}.name`)}</h3>
                <p className="card-desc">{t(`tools.${tool.key}.desc`)}</p>
                <div className="card-link">
                  {t('tools.discover')}
                  <Icon.arrow width="14" height="14" style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OPPORTUNITIES (Ausbildung-jobs + Universities) ============ */}
      <section id="opportunities" className="r-section">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">{t('opportunities.kicker')}</span>
            <h2 className="section-title section-title--serif">{t('opportunities.title')}</h2>
            <p className="section-sub">{t('opportunities.sub')}</p>
          </div>
          <div className="cards cards--two">
            <Link href="/ausbildung-jobs" className="card card-feature reveal">
              <span className="card-icon"><Icon.compass /></span>
              <h3 className="card-title">{t('opportunities.ausbildungJobs.title')}</h3>
              <p className="card-desc">{t('opportunities.ausbildungJobs.desc')}</p>
              <div className="card-link">
                {t('opportunities.ausbildungJobs.cta')}
                <Icon.arrow width="14" height="14" style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
              </div>
            </Link>
            <Link href="/universities" className="card card-feature reveal">
              <span className="card-icon card-icon--gold"><Icon.cap /></span>
              <h3 className="card-title">{t('opportunities.universities.title')}</h3>
              <p className="card-desc">{t('opportunities.universities.desc')}</p>
              <div className="card-link">
                {t('opportunities.universities.cta')}
                <Icon.arrow width="14" height="14" style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ GERMAN LADDER ============ */}
      <section id="learn" className="r-section r-section--warm">
        <div className="wrap">
          <div className="ladder-wrap reveal">
            <div className="ladder-copy">
              <span className="kicker">{t('ladder.kicker')}</span>
              <h2 className="section-title section-title--serif">
                {t('ladder.titlePrefix')}{' '}
                <em className="accent-gold">A1</em>{' '}
                {t('ladder.titleBetween')}{' '}
                <em className="accent-gold">C1</em>{' '}
                {t('ladder.titleSuffix')}
              </h2>
              <p>{t('ladder.sub')}</p>
              <Link href="/learn-german" className="btn btn-primary">
                {t('ladder.cta')}
                <Icon.arrow width="16" height="16" style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
              </Link>
            </div>
            <ol className="ladder-list">
              {levels.map((l) => (
                <li key={l.id} className={`ladder-item ladder-item--${l.state || 'next'}`}>
                  <span className="ladder-chip">{l.id}</span>
                  <div className="ladder-body">
                    <div className="ladder-info-title">{t(`ladder.levels.${l.id}.title`)}</div>
                    <div className="ladder-info-desc">{t(`ladder.levels.${l.id}.desc`)}</div>
                  </div>
                  <span className="ladder-status">
                    {l.state === 'done' ? 'DONE' : l.state === 'active' ? 'NOW' : 'NEXT'}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============ ARTICLES ============ */}
      {articleList.length > 0 && (
        <section id="articles" className="r-section">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">{t('guides.kicker')}</span>
              <h2 className="section-title section-title--serif">{t('guides.title')}</h2>
            </div>
            <div className="articles">
              {articleList.map((a) => (
                <Link key={a.id} href={`/articles/${a.id}`} className="article reveal">
                  <div className="article-img">
                    {a.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.image_url} alt={a.title} />
                    ) : (
                      <div className="article-img-fallback" aria-hidden />
                    )}
                    {a.category && <span className="article-tag">{catLabel(a.category)}</span>}
                  </div>
                  <div className="article-body">
                    <h3>{a.title}</h3>
                    <div className="article-meta">
                      <span>
                        {a.read_time
                          ? t('articles.readTime', { time: a.read_time })
                          : t('articles.readMore')}
                      </span>
                      <span>{a.date ?? ''}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FAQ ============ */}
      <section id="faq" className="r-section r-section--warm">
        <div className="wrap wrap--narrow">
          <div className="section-head reveal">
            <span className="kicker">{t('faq.kicker')}</span>
            <h2 className="section-title section-title--serif">{t('faq.title')}</h2>
          </div>
          <div className="faq-list">
            {faqIds.map((n, i) => (
              <details
                key={n}
                className="faq reveal"
                open={openFaq === i}
                onToggle={(e) => {
                  if ((e.currentTarget as HTMLDetailsElement).open) setOpenFaq(i)
                  else if (openFaq === i) setOpenFaq(null)
                }}
              >
                <summary>
                  {t(`faq.q${n}`)}
                  <span className="faq-icon" aria-hidden />
                </summary>
                <p>{t(`faq.a${n}`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER — navy panel with tricolor stripe ============ */}
      <section className="r-section r-section--newsletter">
        <div className="wrap">
          <div className="newsletter newsletter--editorial reveal">
            <div className="newsletter-stripe" aria-hidden />
            <h2 className="section-title section-title--serif">{t('newsletter.title')}</h2>
            <p>{t('newsletter.sub')}</p>
            {nlStatus === 'success' ? (
              <div className="newsletter-success">{t('newsletter.success')}</div>
            ) : (
              <form className="newsletter-form" onSubmit={submitNewsletter}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  required
                  dir="ltr"
                />
                <button type="submit" disabled={nlStatus === 'loading'}>
                  {nlStatus === 'loading' ? t('newsletter.submitting') : t('newsletter.submit')}
                </button>
              </form>
            )}
            {nlStatus === 'duplicate' && <small>{t('newsletter.duplicate')}</small>}
            {nlStatus === 'error' && <small>{t('newsletter.error')}</small>}
            {nlStatus !== 'duplicate' && nlStatus !== 'error' && (
              <small>{t('newsletter.disclaimer')}</small>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
