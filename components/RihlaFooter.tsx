import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'

export default function RihlaFooter() {
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')
  const locale = useLocale() as AppLocale
  const dir = dirFor(locale)

  const columns = [
    {
      heading: t('sections.about.heading'),
      links: [
        { label: t('sections.about.aboutUs'), href: '/about' },
        { label: t('sections.about.mission'), href: '/about' },
        { label: t('sections.about.contact'), href: '/contact' },
      ],
    },
    {
      heading: t('sections.guides.heading'),
      links: [
        { label: t('sections.guides.housing'), href: '/housing' },
        { label: t('sections.guides.banking'), href: '/banking' },
        { label: t('sections.guides.simcards'), href: '/simcards' },
        { label: t('sections.guides.universities'), href: '/universities' },
        { label: t('sections.guides.jobs'), href: '/jobs' },
        { label: t('sections.guides.ausbildung'), href: '/ausbildung' },
        { label: t('sections.guides.visa'), href: '/visa' },
      ],
    },
    {
      heading: t('sections.resources.heading'),
      links: [
        { label: t('sections.resources.learnGerman'), href: '/learn-german' },
        { label: t('sections.resources.articles'), href: '/articles' },
        { label: t('sections.resources.usefulLinks'), href: '/useful-links' },
      ],
    },
    {
      heading: t('sections.legal.heading'),
      links: [
        { label: t('sections.legal.terms'), href: '/terms-of-use' },
        { label: t('sections.legal.privacy'), href: '/privacy-policy' },
        { label: t('sections.legal.disclaimer'), href: '/disclaimer' },
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
            {t('contactMail')}
          </a>
        </div>

        {columns.map((col) => (
          <div key={col.heading} className="rihla-foot-col">
            <h4>{col.heading}</h4>
            <ul>
              {col.links.map((l, i) => (
                <li key={`${l.href}-${i}`}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
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
