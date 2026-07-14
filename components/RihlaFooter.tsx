import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import CookieSettingsButton from './CookieSettingsButton'

// Social profiles — keep in sync with the Organization JSON-LD in the layout.
const SOCIALS = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/gogermanyma',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.12-2.45-.12-2.4 0-4.05 1.46-4.05 4.15v2.27H7.5V13h2.7v8h3.3z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/gogermany.ma',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@gogermany.ma',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16.6 3c.35 1.9 1.55 3.35 3.4 3.75v3.1c-1.3.05-2.5-.35-3.4-1v6.3c0 3.55-2.55 5.85-5.7 5.85C7.9 21 5.5 18.7 5.5 15.7c0-3.1 2.6-5.5 5.9-5.3v3.2c-1.55-.3-2.85.75-2.85 2.1 0 1.3 1 2.25 2.25 2.25 1.35 0 2.3-1 2.3-2.55V3h3.5z" />
      </svg>
    ),
  },
]

export default function RihlaFooter() {
  const t = useTranslations('footer')
  const tTools = useTranslations('landing.tools')
  const tCommon = useTranslations('common')
  const locale = useLocale() as AppLocale
  const dir = dirFor(locale)

  const columns = [
    {
      heading: t('sections.guides.heading'),
      links: [
        { label: t('sections.guides.ausbildung'), href: '/ausbildung' },
        { label: t('sections.guides.ausbJobs'), href: '/ausbildung-jobs' },
        { label: t('sections.guides.studium'), href: '/studium' },
        { label: t('sections.guides.universities'), href: '/universities' },
        { label: t('sections.guides.visa'), href: '/visa' },
        { label: t('sections.guides.jobs'), href: '/jobs' },
        { label: t('sections.guides.housing'), href: '/housing' },
        { label: t('sections.guides.banking'), href: '/banking' },
        { label: t('sections.guides.simcards'), href: '/simcards' },
      ],
    },
    {
      // Sitewide links into the interactive tools — the site's strongest
      // pages for both users and internal-link equity.
      heading: t('sections.tools.heading'),
      links: [
        { label: tTools('eligibilityChecker.name'), href: '/tools/eligibility-checker' },
        { label: tTools('cv.name'), href: '/cv-builder' },
        { label: tTools('interviewPrep.name'), href: '/interview-prep' },
        { label: tTools('chancenkarte.name'), href: '/tools/chancenkarte-calculator' },
        { label: tTools('bruttoNetto.name'), href: '/tools/brutto-netto-rechner' },
        { label: tTools('furnishedHousing.name'), href: '/tools/furnished-housing' },
        { label: tTools('taxRefund.name'), href: '/tools/tax-refund-calculator' },
        { label: `🧰 ${tTools('allTools.name')}`, href: '/tools' },
      ],
    },
    {
      heading: t('sections.resources.heading'),
      links: [
        { label: t('sections.resources.learnGerman'), href: '/learn-german' },
        { label: t('sections.resources.articles'), href: '/articles' },
        { label: t('sections.resources.usefulLinks'), href: '/useful-links' },
        { label: t('sections.about.aboutUs'), href: '/about' },
        { label: t('sections.about.contact'), href: '/contact' },
      ],
    },
  ]

  return (
    <footer className="rihla-footer" dir={dir}>
      <div className="rihla-foot-warning">
        <div className="wrap">{t('warning')}</div>
      </div>

      <div className="wrap rihla-foot-grid">
        <div className="rihla-foot-brand">
          <Link href="/" className="rihla-logo">
            <div className="rihla-logo-mark" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 8.5A8 8 0 1 0 19.6 15" />
                <path d="M13 12.5h6.5V18" />
              </svg>
            </div>
            <span>GoGermany</span>
          </Link>
          <p>{t('brandTag')}</p>
          <a href="mailto:contact@gogermany.ma" className="rihla-foot-mail">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ display: 'inline', verticalAlign: '-2px', marginInlineEnd: 6 }}>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 6 10-6" />
            </svg>
            {t('contactMail')}
          </a>
          <div className="rihla-foot-socials">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.heading} className="rihla-foot-col">
            <h4>{col.heading}</h4>
            <ul>
              {col.links.map((l, i) => (
                <li key={`${l.href}-${i}`}>
                  <Link href={l.href as any}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Legal column — includes the GDPR cookie-preferences re-opener. */}
        <div className="rihla-foot-col">
          <h4>{t('sections.legal.heading')}</h4>
          <ul>
            <li><Link href="/terms-of-use">{t('sections.legal.terms')}</Link></li>
            <li><Link href="/privacy-policy">{t('sections.legal.privacy')}</Link></li>
            <li><Link href="/disclaimer">{t('sections.legal.disclaimer')}</Link></li>
            <li><CookieSettingsButton label={t('sections.legal.cookies')} /></li>
          </ul>
        </div>
      </div>

      <div className="rihla-foot-bottom">
        <div className="wrap rihla-foot-bottom-inner">
          <span>{t('copyright', { year: new Date().getFullYear() })}</span>
          <span>{t('disclaimer')}</span>
        </div>
      </div>
    </footer>
  )
}
