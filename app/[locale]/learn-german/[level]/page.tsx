import { getLevel } from '@/lib/german-data'
import { notFound } from 'next/navigation'
import LessonsList from '@/components/learn-german/LessonsList'

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: levelParam } = await params
  const level = getLevel(levelParam)

  if (!level || level.lessons.length === 0) notFound()

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <a href="/learn-german" className="text-sm text-green-700 hover:underline mb-4 block">
            → العودة إلى المستويات
          </a>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${level.color} flex items-center justify-center text-white font-bold text-xl`}>
              {level.id}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{level.title} — {level.id}</h1>
              <p className="text-gray-500 text-sm mt-1">{level.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">الدروس</h2>
        <LessonsList level={level} />
      </div>
    </div>
  )
}
