'use client'

import { useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import { getLevel } from '@/lib/german-data'
import { collectLevelVocab } from '@/lib/learn-german/vocab'
import { useProgress } from '@/lib/useProgress'
import { useVocabProgress } from '@/lib/useVocabProgress'
import VocabQuiz from '@/components/learn-german/VocabQuiz'

export default function MyCourseClient({
  locale,
  levelId,
  groupId,
  groupLabel,
  displayName,
  isTeacher,
}: {
  locale: string
  levelId: string
  groupId: string | null
  groupLabel: string | null
  displayName: string
  isTeacher: boolean
}) {
  const level = getLevel(levelId)
  const { scores, progress } = useProgress((level?.id ?? 'A1') as any)
  const vocab = useVocabProgress((level?.id ?? 'A1') as any)

  const vocabTotal = useMemo(() => (level ? collectLevelVocab(level).length : 0), [level])

  if (!level) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-gray-500">Niveau introuvable.</div>
  }

  const lessons = [...level.lessons].sort((a, b) => a.order - b.order)
  const completed = new Set(progress.completedLessons)

  // ── Running grade ── lessons (best score, unattempted = 0) + vocab mastery %.
  const lessonComponent = lessons.length
    ? lessons.reduce((sum, l) => sum + (scores[l.id]?.best ?? 0), 0) / lessons.length
    : 0
  const vocabComponent = vocabTotal ? (vocab.learnedCount / vocabTotal) * 100 : 0
  const grade = Math.round(0.6 * lessonComponent + 0.4 * vocabComponent)

  const gradeColor = grade >= 70 ? 'text-green-700' : grade >= 50 ? 'text-amber-600' : 'text-gray-400'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
        <div>
          <p className="text-xs text-gray-400">Mon cours</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {displayName} · <span className="text-green-700">{level.id}</span>
          </h1>
          {groupLabel && <p className="text-sm text-gray-500 mt-0.5">{groupLabel}</p>}
        </div>
        {groupId && (
          <Link
            href={`/learn-german/classes/${groupId}/room`}
            className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2"
          >
            🎥 Salle de classe
          </Link>
        )}
      </div>

      {/* Grade + vocab summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-xs text-gray-400">Note globale</p>
          <p className={`text-4xl font-black ${gradeColor}`}>{grade}<span className="text-lg text-gray-300">/100</span></p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-xs text-gray-400">Leçons terminées</p>
          <p className="text-4xl font-black text-gray-800">{completed.size}<span className="text-lg text-gray-300">/{lessons.length}</span></p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-xs text-gray-400">Mots mémorisés</p>
          <p className="text-4xl font-black text-gray-800">{vocab.loaded ? vocab.learnedCount : '…'}<span className="text-lg text-gray-300">/{vocabTotal}</span></p>
        </div>
      </div>

      {/* Vocabulary trainer */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Vocabulaire</h2>
        <VocabQuiz level={level} vocab={vocab} />
      </div>

      {/* Syllabus */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Programme · {level.id}</h2>
      <div className="flex flex-col gap-2">
        {lessons.map(lesson => {
          const sc = scores[lesson.id]
          const done = completed.has(lesson.id)
          return (
            <Link
              key={lesson.id}
              href={`/learn-german/${level.id.toLowerCase()}/${lesson.id}`}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-green-300 transition-colors"
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {done ? '✓' : lesson.order}
              </span>
              <span className="flex-1 text-sm font-medium text-gray-800 truncate">{lesson.title}</span>
              {sc ? (
                <span className={`text-xs font-bold px-2 py-1 rounded-md shrink-0
                  ${sc.best >= 70 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {sc.best}%
                </span>
              ) : (
                <span className="text-xs text-gray-300 shrink-0">—</span>
              )}
            </Link>
          )
        })}
      </div>

      {isTeacher && (
        <p className="text-xs text-gray-400 mt-8 text-center">
          👋 Vue enseignant (aperçu A1). Le tableau de bord par élève arrive en Phase 2.
        </p>
      )}
    </div>
  )
}
