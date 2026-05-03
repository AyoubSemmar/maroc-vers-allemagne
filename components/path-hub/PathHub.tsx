import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import PathConsultCta from './PathConsultCta'
import PathHubReveal from './PathHubReveal'

export type PathTool = {
  key: string
  /** Pass a Lucide <Icon name="..." /> for the new icon system, or a
   *  string emoji for legacy. Both render via {tool.icon}. */
  icon: React.ReactNode
  href: string
  nameKey: string
  descKey: string
}

export type PathArticle = {
  id: string
  title: string
  category?: string | null
  image_url?: string | null
  date?: string | null
  read_time?: string | null
}

export type PathPillar = {
  /** i18n key under landing.pathHub.<path>.pillars */
  key: 'learnGerman' | 'find' | 'visa'
  /** Lucide <Icon /> or string emoji */
  icon: React.ReactNode
  href: string
  /** If true, shows a "Coming soon" badge on the card */
  comingSoon?: boolean
}

export type PathHubConfig = {
  path: 'ausbildung' | 'studium'
  pillars: [PathPillar, PathPillar, PathPillar]
  tools: PathTool[]
  articles: PathArticle[]
  locale: AppLocale
}

export default async function PathHub({ config }: { config: PathHubConfig }) {
  const { path, pillars, tools, articles, locale } = config
  const t = await getTranslations({ locale, namespace: `landing.pathHub.${path}` })
  const s = await getTranslations({ locale, namespace: 'landing.pathHub.shared' })
  const tt = await getTranslations({ locale, namespace: 'landing.tools' })
  const ta = await getTranslations({ locale, namespace: 'landing.articles' })
  const tc = await getTranslations({ locale, namespace: 'articles' })
  const catLabel = (cat: string) => {
    if (!cat) return ''
    try {
      const v = tc(`cat.${cat}` as any)
      return v && v !== `cat.${cat}` ? v : cat
    } catch { return cat }
  }

  const chips = (t.raw('chips') as string[]) ?? []

  return (
    <div className="rihla path-hub">
      <PathHubReveal />
      {/* HERO */}
      <section className="path-hero">
        <div className="path-hero-glow" aria-hidden />
        <div className="wrap">
          <span className="eyebrow path-hero-eyebrow">
            <span className="eyebrow-dot" />
            {t('eyebrow')}
          </span>
          <h1 className="path-hero-title">
            {t('heroPre')}
            <span className="gradient-text">{t('heroHighlight')}</span>
            {t('heroPost')}
          </h1>
          <p className="path-hero-sub">{t('subNew')}</p>
          {chips.length > 0 && (
            <div className="path-chips">
              {chips.map((c, i) => (
                <span key={i} className="path-chip">{c}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PILLARS */}
      <section id="pillars" className="path-pillars-section">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">{s('pillarsKicker')}</span>
            <h2>
              {path === 'ausbildung'
                ? s('pillarsTitleAus')
                : s('pillarsTitleStud')}
            </h2>
          </div>
          <div className="path-pillars">
            {pillars.map((pillar, i) => {
              const num = String(i + 1).padStart(2, '0')
              const pTitle = t(`pillars.${pillar.key}.title`)
              const pDesc = t(`pillars.${pillar.key}.desc`)
              return (
                <Link
                  key={pillar.key}
                  href={pillar.href}
                  className={`path-pillar reveal ${pillar.comingSoon ? 'is-soon' : ''}`}
                  data-c={path === 'ausbildung' ? 'brand' : 'teal'}
                >
                  {pillar.comingSoon && (
                    <span className="path-pillar-badge">{s('comingSoon')}</span>
                  )}
                  <span className="path-pillar-num">{num}</span>
                  <div className="path-pillar-icon">{pillar.icon}</div>
                  <h3 className="path-pillar-title">{pTitle}</h3>
                  <p className="path-pillar-desc">{pDesc}</p>
                  <div className="path-pillar-cta">
                    {pillar.comingSoon ? s('comingSoon') : s('discover')}
                    <span aria-hidden>→</span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div className="path-actions reveal">
            <a href="#tools" className="btn btn-primary">
              {s('ctaTools')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#consult" className="btn btn-primary">
              {s('ctaConsult')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" style={{ background: 'var(--bg-warm)' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">{s('toolsTitle')}</span>
            <h2>{s('toolsTitle')}</h2>
          </div>
          <div className="tools">
            {tools.map((tool) => (
              <Link
                key={tool.key}
                href={tool.href}
                className="tool reveal"
                data-c={path === 'ausbildung' ? 'brand' : 'teal'}
              >
                <div className="tool-icon">{tool.icon}</div>
                <h3>{tt(`${tool.key}.name`)}</h3>
                <p>{tt(`${tool.key}.desc`)}</p>
                <div className="tool-link">
                  {tt('discover')} <span>←</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      {articles.length > 0 && (
        <section id="articles">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">{s('articlesTitle')}</span>
              <h2>{s('articlesTitle')}</h2>
            </div>
            <div className="articles">
              {articles.slice(0, 6).map((a) => (
                <Link
                  key={a.id}
                  href={`/articles/${a.id}`}
                  className="article reveal"
                >
                  <div className="article-img">
                    {a.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.image_url} alt={a.title} />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 48,
                        }}
                      >
                        📰
                      </div>
                    )}
                    {a.category && <span className="article-tag">{catLabel(a.category)}</span>}
                  </div>
                  <div className="article-body">
                    <h3>{a.title}</h3>
                    <div className="article-meta">
                      <span>
                        {a.read_time
                          ? ta('readTime', { time: a.read_time })
                          : ta('readMore')}
                      </span>
                      <span>{a.date ?? ''}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link href="/articles" className="btn btn-ghost">
                {s('articlesCta')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CONSULTATION */}
      <section id="consult" style={{ background: 'var(--bg-warm)' }}>
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="section-head reveal">
            <span className="kicker">{s('nextStepTitle')}</span>
            <h2>{s('consultTitle')}</h2>
          </div>
          <PathConsultCta path={path} />
        </div>
      </section>
    </div>
  )
}
