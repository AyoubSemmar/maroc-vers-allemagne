// Edit a single ausbildung_jobs row. Auth handled by the admin layout.
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { updateJob } from '../../../actions.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

const CATEGORIES = [
  ['hospitality',    'Hospitality & Restauration'],
  ['handwerk',       'Construction & Handwerk'],
  ['it',             'IT'],
  ['healthcare',     'Healthcare'],
  ['logistics',      'Logistics & Transport'],
  ['education',      'Education'],
  ['media',          'Media'],
  ['public_service', 'Public service'],
  ['retail',         'Retail'],
  ['automotive',     'Automotive'],
  ['engineering',    'Engineering'],
  ['finance',        'Finance & Banking'],
] as const

const ANSTELLUNGSARTEN = ['Ausbildung', 'Praktikum', 'Vollzeit', 'Teilzeit', 'Werkstudent', 'Trainee'] as const

export default async function EditJobPage({ params }: { params: Promise<{ id: string; locale: AppLocale }> }) {
  const { id, locale } = await params
  const { data: job } = await supabase
    .from('ausbildung_jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (!job) redirect(`/${locale}/console-x7k9/jobs`)

  // <input type="date"> wants YYYY-MM-DD — strip time portion if present.
  const publishedDate = job.published_at ? String(job.published_at).slice(0, 10) : ''

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Edit offer</h1>
          <p className="adm-page-sub">{job.title} <span style={{ color: 'var(--adm-ink-mute)' }}>· {job.external_id}</span></p>
        </div>
        <Link href="/console-x7k9/jobs" className="adm-btn adm-btn--ghost">← Back to jobs</Link>
      </header>

      <div style={{ maxWidth: 820 }}>
        <div className="adm-card">
          <form action={updateJob} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="hidden" name="id" value={job.id} />

            <div className="adm-row">
              <input name="title"   className="adm-input" defaultValue={job.title || ''} placeholder="Title" required />
              <input name="company" className="adm-input" defaultValue={job.company || ''} placeholder="Company" required />
            </div>

            <div className="adm-row">
              <input name="location" className="adm-input" defaultValue={job.location || ''} placeholder="Location" />
              <select name="category" className="adm-select" required defaultValue={job.category || ''}>
                <option value="" disabled>Category…</option>
                {CATEGORIES.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
              </select>
              <select name="anstellungsart" className="adm-select" defaultValue={job.anstellungsart || 'Ausbildung'}>
                {ANSTELLUNGSARTEN.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <textarea
              name="description"
              className="adm-textarea"
              rows={8}
              defaultValue={job.description || ''}
              placeholder="Description (markdown supported)"
            />

            <div className="adm-row">
              <input name="apply_url"     className="adm-input" defaultValue={job.apply_url || ''}     placeholder="Application URL" dir="ltr" />
              <input name="contact_email" className="adm-input" defaultValue={job.contact_email || ''} placeholder="Contact email"    dir="ltr" type="email" />
              <input name="phone"         className="adm-input" defaultValue={job.phone || ''}         placeholder="Phone"            dir="ltr" />
            </div>
            <small style={{ color: 'var(--adm-ink-mute)', fontSize: 12 }}>At least one of URL / email / phone is required.</small>

            <div className="adm-row">
              <input name="external_url" className="adm-input" defaultValue={job.external_url || ''} placeholder="External URL" dir="ltr" />
              <input name="published_at" className="adm-input" type="date" defaultValue={publishedDate} />
            </div>

            <button type="submit" className="adm-btn">Save changes</button>
          </form>
        </div>
      </div>
    </>
  )
}
