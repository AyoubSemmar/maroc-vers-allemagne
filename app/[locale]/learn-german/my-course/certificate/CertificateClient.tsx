'use client'

import { Link } from '@/i18n/navigation'
import { getLevel } from '@/lib/german-data'
import { useProgress } from '@/lib/useProgress'

// Qualitative label + German school note for the final average, mirroring the
// dashboard's gradeInfo so the certificate never disagrees with the course.
function noteInfo(g: number): { note: string; text: string } {
  if (g >= 90) return { note: '1', text: 'Ausgezeichnet' }
  if (g >= 80) return { note: '2', text: 'Sehr gut' }
  if (g >= 70) return { note: '3', text: 'Gut' }
  if (g >= 60) return { note: '3', text: 'Befriedigend' }
  return { note: '4', text: 'Ausreichend' }
}

/**
 * Printable completion certificate. Unlocks when every lesson of the level is
 * validated (same completion store the dashboard reads). "Imprimer / PDF" uses
 * the browser's print dialog — the @media print rules isolate the certificate
 * so the saved PDF contains nothing else.
 */
export default function CertificateClient({
  levelId,
  displayName,
  groupLabel,
}: {
  levelId: string
  displayName: string
  groupLabel: string | null
}) {
  const level = getLevel(levelId)
  const { scores, progress } = useProgress((level?.id ?? 'A1') as any)

  if (!level) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-gray-500">Niveau introuvable.</div>
  }

  const lessons = [...level.lessons].sort((a, b) => a.order - b.order)
  const completed = new Set(progress.completedLessons)
  const doneCount = lessons.filter((l) => completed.has(l.id)).length
  const allDone = lessons.length > 0 && doneCount === lessons.length

  if (!allDone) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="text-4xl mb-3">🎓</div>
          <h1 className="text-xl font-bold text-gray-900">Encore un effort !</h1>
          <p className="text-sm text-gray-600 mt-2">
            Le certificat {level.id} se débloque quand toutes les leçons sont validées (score ≥ 70%).
            Vous en êtes à <strong>{doneCount}/{lessons.length}</strong>.
          </p>
          <Link
            href="/learn-german/my-course"
            className="inline-block mt-5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5"
          >
            ← Retour au cours
          </Link>
        </div>
      </div>
    )
  }

  const finalGrade = Math.round(
    lessons.reduce((s, l) => s + (scores[l.id]?.best ?? 0), 0) / lessons.length,
  )
  const info = noteInfo(finalGrade)
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Print isolation: only the certificate is visible in the print/PDF. */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate, #certificate * { visibility: visible; }
          #certificate { position: absolute; inset: 0; margin: 0; box-shadow: none !important; }
        }
      `}</style>

      <div className="flex items-center justify-between gap-3 flex-wrap mb-6 print:hidden">
        <Link href="/learn-german/my-course" className="text-sm text-green-700 hover:underline">
          ← Retour au cours
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5"
        >
          🖨️ Imprimer / Enregistrer en PDF
        </button>
      </div>

      <div
        id="certificate"
        dir="ltr"
        className="bg-white border-8 border-double border-green-700 rounded-lg p-10 sm:p-14 text-center shadow-lg"
      >
        <p className="text-2xl font-black text-green-700 tracking-tight">GoGermany</p>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mt-1">www.gogermany.ma</p>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-8 uppercase tracking-wide">
          Certificat de réussite
        </h1>
        <div className="w-24 h-1 bg-green-600 mx-auto mt-4" />

        <p className="text-sm text-gray-500 mt-8">Ce certificat est décerné à</p>
        <p className="text-3xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Georgia, serif' }}>
          {displayName}
        </p>

        <p className="text-sm text-gray-600 mt-6 max-w-lg mx-auto leading-relaxed">
          pour avoir suivi et validé avec succès l&rsquo;intégralité du niveau{' '}
          <strong className="text-green-700">{level.id}</strong> du cours d&rsquo;allemand en direct
          {groupLabel ? <> (groupe {groupLabel})</> : null} — {lessons.length} leçons, exercices et devoirs inclus.
        </p>

        <div className="flex items-center justify-center gap-10 mt-8">
          <div>
            <p className="text-3xl font-black text-green-700">{finalGrade}<span className="text-lg">/100</span></p>
            <p className="text-xs text-gray-400 mt-1">Note finale</p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div>
            <p className="text-3xl font-black text-green-700">{info.note}</p>
            <p className="text-xs text-gray-400 mt-1">{info.text}</p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div>
            <p className="text-3xl font-black text-green-700">{level.id}</p>
            <p className="text-xs text-gray-400 mt-1">Niveau CECR</p>
          </div>
        </div>

        <div className="flex items-end justify-between mt-12 pt-8 border-t border-gray-100 text-left">
          <div>
            <p className="text-xs text-gray-400">Fait le</p>
            <p className="text-sm font-semibold text-gray-700">{dateStr}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
              L&rsquo;équipe pédagogique
            </p>
            <p className="text-xs text-gray-400">GoGermany — Cours d&rsquo;allemand en direct</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4 print:hidden">
        Astuce : dans la boîte d&rsquo;impression, choisissez « Enregistrer au format PDF » et l&rsquo;orientation paysage.
      </p>
    </div>
  )
}
