'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { aaDetailUrl, type AaJob, type AaResult } from '@/lib/ausbildungSearch'

// The professions with the most Ausbildung openings + the ones our
// audience actually asks about. Kept in German — that's what the offers
// (and employers) use, and the search matches German titles.
const POPULAR: string[] = [
  'Pflegefachmann/-frau',
  'KFZ-Mechatroniker/in',
  'Elektroniker/in',
  'Fachinformatiker/in',
  'Kaufmann/-frau Büromanagement',
  'Hotelfachmann/-frau',
  'Koch/Köchin',
  'Verkäufer/in',
  'Anlagenmechaniker/in SHK',
  'Bäcker/in',
  'Zahnmedizinische/r Fachangestellte/r',
  'Zerspanungsmechaniker/in',
]

const FRESHNESS: { key: string; days: string | null }[] = [
  { key: 'freshAll', days: null },
  { key: 'freshToday', days: '0' },
  { key: 'freshWeek', days: '7' },
  { key: 'freshMonth', days: '30' },
]

function daysSince(iso: string | null): number | null {
  if (!iso) return null
  const then = new Date(`${iso}T00:00:00Z`).getTime()
  if (Number.isNaN(then)) return null
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000))
}

export default function AusbildungBoard({
  locale,
  initial,
}: {
  locale: AppLocale
  initial: AaResult
}) {
  const t = useTranslations('ausbJobs.board')

  const [was, setWas] = useState('')
  const [wo, setWo] = useState('')
  const [umkreis, setUmkreis] = useState('50')
  const [days, setDays] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [jobs, setJobs] = useState<AaJob[]>(initial.jobs)
  const [total, setTotal] = useState(initial.total)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  async function fetchPage(opts: { was: string; wo: string; umkreis: string; days: string | null; page: number }): Promise<AaResult | null> {
    const p = new URLSearchParams()
    if (opts.was) p.set('was', opts.was)
    if (opts.wo) { p.set('wo', opts.wo); p.set('umkreis', opts.umkreis) }
    if (opts.days !== null) p.set('days', opts.days)
    if (opts.page > 1) p.set('page', String(opts.page))
    try {
      const res = await fetch(`/api/ausbildung-search?${p.toString()}`)
      if (!res.ok) return null
      return (await res.json()) as AaResult
    } catch {
      return null
    }
  }

  async function runSearch(next: { was?: string; days?: string | null } = {}) {
    const q = { was: next.was ?? was, wo, umkreis, days: next.days !== undefined ? next.days : days, page: 1 }
    setLoading(true)
    setFailed(false)
    const result = await fetchPage(q)
    setLoading(false)
    if (!result) { setFailed(true); return }
    setJobs(result.jobs)
    setTotal(result.total)
    setPage(1)
  }

  async function loadMore() {
    const nextPage = page + 1
    setLoading(true)
    const result = await fetchPage({ was, wo, umkreis, days, page: nextPage })
    setLoading(false)
    if (!result) { setFailed(true); return }
    // Dedup on refnr — the feed shifts as offers are added, so page
    // boundaries can repeat an item.
    setJobs((prev) => {
      const seen = new Set(prev.map((j) => j.refnr))
      return [...prev, ...result.jobs.filter((j) => !seen.has(j.refnr))]
    })
    setPage(nextPage)
  }

  function pickChip(profession: string) {
    const value = was === profession ? '' : profession
    setWas(value)
    runSearch({ was: value })
  }

  function pickDays(value: string | null) {
    setDays(value)
    runSearch({ days: value })
  }

  const nf = new Intl.NumberFormat(locale)
  const df = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div dir={dirFor(locale)}>
      {/* ── Search form ── */}
      <form
        onSubmit={(e) => { e.preventDefault(); runSearch() }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col gap-3"
      >
        <div className="grid sm:grid-cols-[1.4fr_1fr_auto_auto] gap-3">
          <input
            type="text"
            value={was}
            onChange={(e) => setWas(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 min-w-0"
          />
          <input
            type="text"
            value={wo}
            onChange={(e) => setWo(e.target.value)}
            placeholder={t('cityPlaceholder')}
            className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 min-w-0"
          />
          <select
            value={umkreis}
            onChange={(e) => setUmkreis(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-3 text-sm bg-white"
            aria-label="Radius"
          >
            {['25', '50', '100', '200'].map((km) => (
              <option key={km} value={km}>{t('km', { km })}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold rounded-xl px-6 py-3 text-sm transition-colors"
          >
            {t('searchBtn')}
          </button>
        </div>

        {/* Freshness filter */}
        <div className="flex flex-wrap gap-2">
          {FRESHNESS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => pickDays(f.days)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                days === f.days ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(f.key as any)}
            </button>
          ))}
        </div>
      </form>

      {/* ── Popular professions ── */}
      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{t('popular')}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {POPULAR.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => pickChip(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                was === p
                  ? 'bg-green-700 border-green-700 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-green-500'
              }`}
              lang="de"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="flex items-baseline justify-between mt-8 mb-3">
        <h2 className="text-sm font-bold text-gray-700">{t('resultsCount', { n: nf.format(total) })}</h2>
        {loading && <span className="text-xs text-gray-400 animate-pulse">{t('loading')}</span>}
      </div>

      {failed && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center text-sm text-orange-800">
          {t('error')}{' '}
          <button type="button" onClick={() => runSearch()} className="font-bold underline">{t('retry')}</button>
        </div>
      )}

      {!failed && jobs.length === 0 && !loading && (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <div className="text-4xl mb-2">🔍</div>
          <p className="font-bold text-gray-900">{t('empty')}</p>
          <p className="text-sm text-gray-500 mt-1">{t('emptyHint')}</p>
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {jobs.map((job, i) => {
          const age = daysSince(job.published)
          return (
            <li key={job.refnr}>
              {/* Funnel strip mid-list, once */}
              {i === 6 && <PrepStrip t={t} />}
              <a
                href={aaDetailUrl(job.refnr)}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:border-green-400 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 leading-snug" lang="de">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">{job.company}</p>
                  </div>
                  {age === 0 && (
                    <span className="shrink-0 bg-green-100 text-green-800 text-[11px] font-black uppercase tracking-wide rounded-full px-2.5 py-1">
                      {t('newBadge')}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                  {job.beruf && job.beruf !== job.title && (
                    <span className="bg-gray-100 rounded-full px-2.5 py-0.5 font-medium" lang="de">{job.beruf}</span>
                  )}
                  <span>📍 {[job.plz, job.city].filter(Boolean).join(' ')}{job.region ? ` · ${job.region}` : ''}</span>
                  {age !== null && (
                    <span>🕒 {age === 0 ? t('today') : t('daysAgo', { d: age })}</span>
                  )}
                  {job.start && (
                    <span>🚀 {t('startLabel', { date: df.format(new Date(`${job.start}T00:00:00Z`)) })}</span>
                  )}
                </div>
                <span className="inline-block mt-3 text-sm font-semibold text-green-700">
                  {t('viewOffer')} ↗
                </span>
              </a>
            </li>
          )
        })}
      </ul>

      {jobs.length > 0 && jobs.length < total && !failed && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="w-full mt-5 bg-white border border-gray-300 hover:border-green-500 text-gray-800 font-bold rounded-2xl py-3.5 text-sm transition-colors disabled:opacity-50"
        >
          {loading ? t('loading') : t('loadMore')}
        </button>
      )}

      <PrepStrip t={t} className="mt-8" />

      <p className="text-[11px] text-gray-400 mt-6 text-center">{t('sourceNote')}</p>
    </div>
  )
}

// "Prepare your application" funnel — every offer links out to the official
// site, so this strip is where the visit converts into our tools.
function PrepStrip({ t, className = '' }: { t: ReturnType<typeof useTranslations<'ausbJobs.board'>>; className?: string }) {
  const items = [
    { href: '/cv-builder', emoji: '📄', label: t('prepCv') },
    { href: '/anschreiben-generator', emoji: '✍️', label: t('prepLetter') },
    { href: '/interview-prep', emoji: '🎤', label: t('prepInterview') },
  ] as const
  return (
    <div className={`bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl p-5 my-3 ${className}`}>
      <p className="text-white font-bold">{t('prepTitle')}</p>
      <p className="text-green-100 text-xs mt-0.5">{t('prepSub')}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-full px-3.5 py-2 transition-colors"
          >
            {it.emoji} {it.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
