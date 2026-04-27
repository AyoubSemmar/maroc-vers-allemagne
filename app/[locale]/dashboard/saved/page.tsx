import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { createClient } from '@/lib/supabase-server'
import SaveButton from '@/components/SaveButton'
import UniLogo from '@/components/universities/UniLogo'

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function SavedOpportunitiesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard.savedOpps' })
  const tCat = await getTranslations({ locale, namespace: 'ausbJobs.cats' })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/dashboard/saved`)
  }

  const { data: saves } = await supabase
    .from('user_saves')
    .select('item_type, item_id, created_at')
    .order('created_at', { ascending: false })

  const uniIds = (saves ?? []).filter(s => s.item_type === 'university').map(s => s.item_id)
  const jobIds = (saves ?? []).filter(s => s.item_type === 'ausbildung_job').map(s => s.item_id)

  const [uniRes, jobRes] = await Promise.all([
    uniIds.length
      ? supabase
          .from('universities')
          .select('id, name_de, name_en, name_ar, name_fr, city, state, type, logo_url, website')
          .in('id', uniIds)
      : Promise.resolve({ data: [] as any[] }),
    jobIds.length
      ? supabase
          .from('ausbildung_jobs')
          .select('id, title, company, location, category, apply_url, contact_email')
          .in('id', jobIds)
      : Promise.resolve({ data: [] as any[] }),
  ])

  const unis = ((uniRes.data ?? []) as any[]).map(u => ({
    ...u,
    name: u[`name_${locale}`] || u.name_en || u.name_de,
  }))
  const jobs = (jobRes.data ?? []) as any[]
  const totalSaved = unis.length + jobs.length

  return (
    <div className="dashpage" dir={dirFor(locale)}>
      <div className="saved-page">
        <header className="saved-page-head">
          <h1>{t('title')}</h1>
          <p className="saved-page-sub">
            {totalSaved === 0 ? t('emptyHint') : t('countLabel', { n: totalSaved })}
          </p>
        </header>

        {totalSaved === 0 && (
          <div className="saved-empty">
            <div className="saved-empty-icon" aria-hidden>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2>{t('emptyTitle')}</h2>
            <p>{t('emptyBody')}</p>
            <div className="saved-empty-cta">
              <Link href="/ausbildung-jobs" className="btn btn-primary">{t('browseJobs')}</Link>
              <Link href="/universities" className="btn btn-secondary">{t('browseUnis')}</Link>
            </div>
          </div>
        )}

        {jobs.length > 0 && (
          <section className="saved-section">
            <h2 className="saved-section-title">
              💼 {t('jobsHeading')} <span className="saved-section-count">{jobs.length}</span>
            </h2>
            <div className="saved-list">
              {jobs.map((j: any) => (
                <article key={j.id} className="saved-row">
                  <div className="saved-row-icon" aria-hidden>🏢</div>
                  <div className="saved-row-body">
                    <h3>{j.title}</h3>
                    <p className="saved-row-meta">
                      {j.company}
                      {j.location && j.location !== '—' ? ` · 📍 ${j.location}` : ''}
                      {j.category ? ` · ${tCat(j.category as any)}` : ''}
                    </p>
                  </div>
                  <div className="saved-row-actions">
                    {j.apply_url && (
                      <a href={j.apply_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                        {t('apply')} ↗
                      </a>
                    )}
                    <SaveButton itemType="ausbildung_job" itemId={j.id} size="compact" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {unis.length > 0 && (
          <section className="saved-section">
            <h2 className="saved-section-title">
              🎓 {t('unisHeading')} <span className="saved-section-count">{unis.length}</span>
            </h2>
            <div className="saved-list">
              {unis.map((u: any) => (
                <article key={u.id} className="saved-row">
                  <div className="saved-row-uni-logo" aria-hidden>
                    <UniLogo src={u.logo_url} fallback={u.name?.charAt(0) || '?'} />
                  </div>
                  <div className="saved-row-body">
                    <h3>{u.name}</h3>
                    <p className="saved-row-meta">
                      {u.city ? `📍 ${u.city}${u.state ? `, ${u.state}` : ''}` : ''}
                      {u.type ? ` · ${u.type}` : ''}
                    </p>
                  </div>
                  <div className="saved-row-actions">
                    {u.website && (
                      <a href={u.website} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                        {t('website')} ↗
                      </a>
                    )}
                    <SaveButton itemType="university" itemId={u.id} size="compact" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
