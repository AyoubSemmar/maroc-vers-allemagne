'use client'

import { useEffect, useState, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { useCatLabel } from '@/lib/article-cat'
import { trackWhatsappClick } from '@/lib/analytics'
import JsonLd from '@/components/seo/JsonLd'

const WHATSAPP_NUMBER = '491771903108'

type Article = {
  id: string
  title: string
  category?: string | null
  image_url?: string | null
  date?: string | null
  read_time?: string | null
}

function Stat({
  target,
  suffix,
  label,
  text,
}: {
  target?: number
  suffix?: string
  label: string
  text?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [val, setVal] = useState(target ? 0 : null)

  useEffect(() => {
    if (target === undefined) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
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
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return (
    <div ref={ref} className="reveal">
      <div className="stat-num">
        {text ? (
          <span>{text}</span>
        ) : (
          `${val ?? 0}${suffix ?? ''}`
        )}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
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

  // Real interactive tools only. Resource pages (visa, banking, jobs,
  // simcards) live elsewhere on the site — they're not "tools".
  // Lucide-thin inline SVGs (stroke 1.5) — modern outline style, currentColor.
  const SVG = (path: React.ReactNode) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {path}
    </svg>
  )
  const ICONS = {
    cv:                  SVG(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h4"/></>),
    anschreiben:         SVG(<><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></>),
    livingCost:          SVG(<><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.5 7.5 0 1 0 0 12"/></>),
    migrationTimeline:   SVG(<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>),
    documentChecklist:   SVG(<><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></>),
    eligibilityChecker:  SVG(<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 11 3 3L22 4"/></>),
    chancenkarte:        SVG(<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15l3-6 2.5 4L15 9l2 6"/></>),
    sperrkonto:          SVG(<><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>),
    bruttoNetto:         SVG(<><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h3M13 10h3M8 14h3M13 14h3M8 18h3M13 18h3"/></>),
    anerkennung:         SVG(<><circle cx="12" cy="8" r="5"/><path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5"/></>),
    cityComparator:      SVG(<><path d="M3 21h18"/><path d="M5 21V7l6-4v18"/><path d="M13 21V11l6-3v13"/><path d="M8 9h.01M8 13h.01M8 17h.01M17 13h.01M17 17h.01"/></>),
    gradeConverter:      SVG(<><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12.5V17c0 1 2.7 3 6 3s6-2 6-3v-4.5"/></>),
  } as const
  const tools = [
    { key: 'cv',                 icon: ICONS.cv,                 href: '/cv-builder',                  c: 'brand' as const },
    { key: 'anschreiben',        icon: ICONS.anschreiben,        href: '/anschreiben-generator',       c: 'teal'  as const },
    { key: 'chancenkarte',       icon: ICONS.chancenkarte,       href: '/tools/chancenkarte-calculator', c: 'gold' as const },
    { key: 'sperrkonto',         icon: ICONS.sperrkonto,         href: '/tools/sperrkonto-calculator', c: 'brand' as const },
    { key: 'bruttoNetto',        icon: ICONS.bruttoNetto,        href: '/tools/brutto-netto-rechner',  c: 'berry' as const },
    { key: 'livingCost',         icon: ICONS.livingCost,         href: '/tools/living-cost-calculator',c: 'gold'  as const },
    { key: 'cityComparator',     icon: ICONS.cityComparator,     href: '/tools/city-comparator',       c: 'teal'  as const },
    { key: 'anerkennung',        icon: ICONS.anerkennung,        href: '/tools/anerkennung-wizard',    c: 'berry' as const },
    { key: 'gradeConverter',     icon: ICONS.gradeConverter,     href: '/tools/german-grade-calculator', c: 'gold' as const },
    { key: 'migrationTimeline',  icon: ICONS.migrationTimeline,  href: '/tools/migration-timeline',    c: 'teal'  as const },
    { key: 'documentChecklist',  icon: ICONS.documentChecklist,  href: '/tools/document-checklist',    c: 'berry' as const },
    { key: 'eligibilityChecker', icon: ICONS.eligibilityChecker, href: '/tools/eligibility-checker',   c: 'brand' as const },
  ] as const

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
    'banks',
    'studium',
    'visa',
    'jobs',
    'ausbildung',
    'housing',
    'levels',
    'sim',
  ] as const

  useEffect(() => {
    // reveal-on-scroll
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
    if (!error) {
      setNlStatus('success')
      setEmail('')
    } else if (error.code === '23505') setNlStatus('duplicate')
    else setNlStatus('error')
  }

  const articleList = articles.slice(0, 3)

  return (
    <div className="rihla" dir={dir}>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-mesh"></div>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              {t('hero.eyebrow')}
            </span>
            <h1 className="hero-title">
              {t('hero.titleLine1')}{' '}
              <span className="gradient-text">{t('hero.titleHighlight')}</span>
              {t('hero.titleLine2') ? (
                <>
                  <br />
                  {t('hero.titleLine2')}
                </>
              ) : null}
            </h1>
            <p className="hero-sub">{t('hero.sub')}</p>
            <div className="hero-ctas">
              <Link href="/ausbildung" className="btn btn-primary">
                {t('hero.ctaStart')}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/studium" className="btn btn-primary">
                {t('hero.ctaBrowse')}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('hero.whatsappMessage'))}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsappClick('landing_hero')}
              className="hero-wa-cta"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.057 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.473-8.413z"/>
              </svg>
              <span className="hero-wa-cta-text">
                <strong>{t('hero.ctaWhatsapp')}</strong>
                <small>{t('hero.ctaWhatsappHint')}</small>
              </span>
            </a>
            <div className="hero-trust">
              <div className="avatars">
                <div>ي</div>
                <div>س</div>
                <div>ك</div>
                <div>+</div>
              </div>
              <span>{t('hero.trust')}</span>
            </div>
          </div>

          {/* JOURNEY VISUAL */}
          <div className="journey">
            <div className="journey-title">{t('hero.journeyTitle')}</div>

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
              <path
                className="path-bg"
                d="M 427 443 C 360 430, 330 410, 340 370 S 390 310, 300 280 S 180 290, 210 220 S 340 180, 256 150 S 110 110, 56 73"
              />
              <path
                className="path-fg"
                d="M 427 443 C 360 430, 330 410, 340 370 S 390 310, 300 280 S 180 290, 210 220 S 340 180, 256 150 S 110 110, 56 73"
                filter="url(#neonGlow)"
              />
            </svg>

            <div className="flag flag-start">MA</div>
            <div className="stop stop-contract" data-label={t('hero.stopContract')}>
              📝
            </div>
            <div className="stop stop-visa" data-label={t('hero.stopVisa')}>
              📄
            </div>
            <div className="stop stop-house" data-label={t('hero.stopHouse')}>
              🏠
            </div>
            <div className="flag flag-end">DE</div>
            <div className="plane">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M2 12l20-8-8 20-2-9-10-3z" />
              </svg>
            </div>

            <div className="word-chip chip-willkommen">
              Willkommen
              <small>{t('hero.willkommenSub')}</small>
            </div>
            <div className="word-chip chip-gutentag">
              Guten Tag
              <small>{t('hero.gutenTagSub')}</small>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="marquee">
        <div className="marquee-track">
          {[...marqueeKeys, ...marqueeKeys].map((k, i) => (
            <span key={i} className="marquee-item">
              {t(`marquee.${k}`)}
            </span>
          ))}
        </div>
      </div>

      {/* ============ STATS ============ */}
      <section className="stats">
        <div className="wrap stats-grid">
          <Stat text={t('stats.jobs.num')} label={t('stats.jobs.label')} />
          <Stat text={t('stats.universities.num')} label={t('stats.universities.label')} />
          <Stat text={t('stats.stipend.text')} label={t('stats.stipend.label')} />
          <Stat text={t('stats.tuition.text')} label={t('stats.tuition.label')} />
        </div>
      </section>

      {/* ============ CHOOSE YOUR PATH ============ */}
      <section id="paths">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">{t('paths.kicker')}</span>
            <h2>{t('paths.title')}</h2>
            <p className="section-sub">{t('paths.sub')}</p>
          </div>
          <div className="tools" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <Link href="/ausbildung" className="tool reveal" data-c="brand">
              <div className="tool-icon">🔧</div>
              <h3>{t('paths.ausbildung.title')}</h3>
              <p>{t('paths.ausbildung.desc')}</p>
              <div className="tool-link">
                {t('paths.ausbildung.cta')} <span>←</span>
              </div>
            </Link>
            <Link href="/studium" className="tool reveal" data-c="teal">
              <div className="tool-icon">🎓</div>
              <h3>{t('paths.studium.title')}</h3>
              <p>{t('paths.studium.desc')}</p>
              <div className="tool-link">
                {t('paths.studium.cta')} <span>←</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TOOLS GRID ============ */}
      <section id="tools" style={{ background: 'var(--bg-warm)' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">{t('tools.kicker')}</span>
            <h2>{t('tools.title')}</h2>
            <p className="section-sub">{t('tools.sub')}</p>
          </div>
          <div className="tools">
            {tools.map((tool) => (
              <Link
                key={tool.key}
                href={tool.href}
                className="tool reveal"
                data-c={tool.c}
              >
                <div className="tool-icon">{tool.icon}</div>
                <h3>{t(`tools.${tool.key}.name`)}</h3>
                <p>{t(`tools.${tool.key}.desc`)}</p>
                <div className="tool-link">
                  {t('tools.discover')} <span>←</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OPPORTUNITIES ============ */}
      <section id="opportunities">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">{t('opportunities.kicker')}</span>
            <h2>{t('opportunities.title')}</h2>
            <p className="section-sub">{t('opportunities.sub')}</p>
          </div>
          <div className="tools" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <Link href="/ausbildung-jobs" className="tool reveal" data-c="gold">
              <div className="tool-icon">🔍</div>
              <h3>{t('opportunities.ausbildungJobs.title')}</h3>
              <p>{t('opportunities.ausbildungJobs.desc')}</p>
              <div className="tool-link">
                {t('opportunities.ausbildungJobs.cta')} <span>←</span>
              </div>
            </Link>
            <Link href="/universities" className="tool reveal" data-c="teal">
              <div className="tool-icon">🎓</div>
              <h3>{t('opportunities.universities.title')}</h3>
              <p>{t('opportunities.universities.desc')}</p>
              <div className="tool-link">
                {t('opportunities.universities.cta')} <span>←</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ HOUSING ============ */}
      <section id="housing" style={{ background: 'var(--bg-warm)' }}>
        <div className="wrap">
          <div className="ladder-wrap reveal">
            <div className="ladder-copy">
              <span className="kicker">{t('housing.kicker')}</span>
              <h2>{t('housing.title')}</h2>
              <p>{t('housing.sub')}</p>
              <Link href="/listings" className="btn btn-primary">
                {t('housing.cta')}
              </Link>
              <div className="ladder-meta">
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {t('housing.feature1')}
                </div>
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {t('housing.feature2')}
                </div>
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {t('housing.feature3')}
                </div>
              </div>
            </div>
            <div
              style={{ display: 'grid', placeItems: 'center', color: 'var(--brand)' }}
              aria-hidden
            >
              <svg
                width="180"
                height="180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M9 22V12h6v10" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GERMAN LADDER ============ */}
      <section id="learn">
        <div className="wrap">
          <div className="ladder-wrap reveal">
            <div className="ladder-copy">
              <span className="kicker">{t('ladder.kicker')}</span>
              <h2>
                {t('ladder.titlePrefix')}{' '}
                <span className="gradient-text">A1</span>{' '}
                {t('ladder.titleBetween')}{' '}
                <span className="gradient-text">C1</span>{' '}
                {t('ladder.titleSuffix')}
              </h2>
              <p>{t('ladder.sub')}</p>
              <Link href="/learn-german" className="btn btn-primary">
                {t('ladder.cta')}
              </Link>
              <div className="ladder-meta">
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {t('ladder.metaFree')}
                </div>
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {t('ladder.metaInteractive')}
                </div>
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {t('ladder.metaMoroccans')}
                </div>
              </div>
            </div>
            <div className="ladder" style={{ ['--progress' as string]: '55%' } as React.CSSProperties}>
              <div className="ladder-line"></div>
              {levels.map((l, i) => {
                const card = (
                  <div className="level-card">
                    <div className="lvl-title">{t(`ladder.levels.${l.id}.title`)}</div>
                    <div className="lvl-desc">{t(`ladder.levels.${l.id}.desc`)}</div>
                  </div>
                )
                const dot = <div className="level-dot">{l.id}</div>
                return (
                  <div key={l.id} className={`level ${l.state}`}>
                    {i % 2 === 0 ? (
                      <>
                        {card}
                        {dot}
                      </>
                    ) : (
                      <>
                        {dot}
                        {card}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ GUIDES / ARTICLES ============ */}
      {articleList.length > 0 && (
        <section id="articles" style={{ background: 'var(--bg-warm)' }}>
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">{t('guides.kicker')}</span>
              <h2>{t('guides.title')}</h2>
            </div>
            <div className="articles">
              {articleList.map((a) => (
                <Link
                  key={a.id}
                  href={`/articles/${a.id}`}
                  className="article reveal"
                >
                  <div className="article-img">
                    {a.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.image_url} alt={a.title} loading="lazy" decoding="async" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: 48 }}>📰</div>
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
      <section id="faq">
        {/* FAQPage schema → eligible for FAQ rich result on Google.
            Built from the same translation keys the visible FAQs use,
            so the schema can never drift from the displayed Q&A. */}
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqIds.map((n) => ({
              '@type': 'Question',
              name: t(`faq.q${n}` as any),
              acceptedAnswer: {
                '@type': 'Answer',
                text: t(`faq.a${n}` as any),
              },
            })),
          }}
        />
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">{t('faq.kicker')}</span>
            <h2>{t('faq.title')}</h2>
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
                  <span className="faq-icon"></span>
                </summary>
                <p>{t(`faq.a${n}`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="newsletter reveal">
            <h2>{t('newsletter.title')}</h2>
            <p>{t('newsletter.sub')}</p>
            {nlStatus === 'success' ? (
              <div style={{ background: 'oklch(1 0 0 / 0.2)', backdropFilter: 'blur(12px)', padding: '14px 24px', borderRadius: 999, maxWidth: 480, margin: '0 auto', fontWeight: 700 }}>
                {t('newsletter.success')}
              </div>
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
            {nlStatus === 'duplicate' && (
              <small style={{ color: 'oklch(0.95 0.08 90)' }}>
                {t('newsletter.duplicate')}
              </small>
            )}
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
