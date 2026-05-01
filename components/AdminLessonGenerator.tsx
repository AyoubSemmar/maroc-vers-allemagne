'use client'

/**
 * Admin Learn-German lesson generator.
 *
 * Workflow:
 *   1. Admin picks level + lesson id + topic + grammar focus.
 *   2. Click "Generate" → Claude writes the Arabic lesson.
 *   3. Click "Translate" (auto) → Claude returns FR/EN/DE overlays.
 *   4. Admin reviews per-language tabs.
 *   5. Click "Copy AR source" / "Copy FR overlay" / etc. — admin pastes
 *      the JSON into the right file in the repo:
 *        - AR source: lib/german-data/<level>.ts (inside the lessons[] array)
 *        - FR/EN/DE overlay: lib/german-data/translations/<level>.<locale>.json
 *          (inside the lessons key, under the lesson id)
 *   6. Commit + redeploy. Lesson is live.
 *
 * The "copy" rather than "save to DB" approach keeps the Learn-German
 * pipeline deterministic — every lesson exists in version control. No
 * mystery DB rows, no need to migrate the loader. Once volume justifies
 * it, we'll add a custom-lessons table; for now this is the lowest-
 * friction path that ships content reliably.
 */

import { useState } from 'react'

type GenerateState = '' | 'text' | 'translate'

type Lesson = {
  id: string
  title: string
  order: number
  grammar: any
  vocabulary: any[]
  exercise: { questions: any[] }
}

type Translations = { fr?: Partial<Lesson>; en?: Partial<Lesson>; de?: Partial<Lesson> }

type Tab = 'ar' | 'fr' | 'en' | 'de'

const LEVEL_OPTIONS = [
  { key: 'a1', label: 'A1' },
  { key: 'a2', label: 'A2' },
  { key: 'b1', label: 'B1' },
  { key: 'b2', label: 'B2' },
  { key: 'c1', label: 'C1' },
] as const

async function safeParse(resp: Response) {
  const raw = await resp.text()
  try { return raw ? JSON.parse(raw) : null } catch { return null }
}

export default function AdminLessonGenerator() {
  const [level, setLevel] = useState<'a1' | 'a2' | 'b1' | 'b2' | 'c1'>('a1')
  const [lessonId, setLessonId] = useState('a1-13')
  const [order, setOrder] = useState(13)
  const [topic, setTopic] = useState('')
  const [grammarFocus, setGrammarFocus] = useState('')

  const [stage, setStage] = useState<GenerateState>('')
  const [error, setError] = useState<string | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [translations, setTranslations] = useState<Translations>({})
  const [activeTab, setActiveTab] = useState<Tab>('ar')

  async function generate() {
    setStage('text')
    setError(null)
    setLesson(null)
    setTranslations({})
    try {
      const r = await fetch('/api/admin/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, lessonId, order, topic, grammarFocus }),
      })
      const d = await safeParse(r)
      if (!r.ok || !d) {
        setError(d?.error || `Generate failed (HTTP ${r.status})`)
        setStage('')
        return
      }
      setLesson(d.lesson)
      setActiveTab('ar')

      // Auto-fire the translation pass.
      setStage('translate')
      const tr = await fetch('/api/admin/translate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson: d.lesson }),
      })
      const td = await safeParse(tr)
      if (!tr.ok || !td) {
        setError(td?.error || `Translation failed (HTTP ${tr.status}). The Arabic lesson is still usable on its own.`)
      } else {
        setTranslations(td.translations || {})
      }
    } catch (e: any) {
      setError(e?.message || 'Network error')
    } finally {
      setStage('')
    }
  }

  function activeJson(): string {
    if (activeTab === 'ar') return lesson ? JSON.stringify(lesson, null, 2) : ''
    return translations[activeTab] ? JSON.stringify(translations[activeTab], null, 2) : ''
  }

  function copyActive() {
    const txt = activeJson()
    if (!txt || typeof navigator === 'undefined' || !navigator.clipboard) return
    navigator.clipboard.writeText(txt).then(
      () => { /* could toast */ },
      () => {},
    )
  }

  const targetFile =
    activeTab === 'ar'
      ? `lib/german-data/${level}.ts (inside the lessons array)`
      : `lib/german-data/translations/${level}.${activeTab}.json (inside lessons["${lessonId}"])`

  return (
    <section className="adm-card" style={{
      marginBottom: 18,
      borderColor: '#86efac',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
    }}>
      <div className="adm-card-head">
        <h3 className="adm-card-title">📚 Learn-German lesson generator</h3>
        <span style={{ fontSize: 12, color: 'var(--adm-ink-mute)' }}>
          AR source + FR/EN/DE overlays · matches /lib/german-data/types.ts schema
        </span>
      </div>

      <div className="adm-row" style={{ alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <label className="adm-label">Level</label>
          <select className="adm-select" value={level} onChange={e => setLevel(e.target.value as any)} disabled={!!stage}>
            {LEVEL_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="adm-label">Lesson id</label>
          <input
            className="adm-input"
            value={lessonId}
            onChange={e => setLessonId(e.target.value)}
            placeholder="a1-13"
            disabled={!!stage}
            style={{ width: 110 }}
          />
        </div>
        <div>
          <label className="adm-label">Order #</label>
          <input
            type="number"
            className="adm-input"
            value={order}
            onChange={e => setOrder(Number(e.target.value))}
            min={1}
            max={30}
            disabled={!!stage}
            style={{ width: 80 }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <label className="adm-label">Topic (free text)</label>
          <input
            className="adm-input"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. Modal verbs in everyday speech"
            disabled={!!stage}
          />
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <label className="adm-label">Grammar focus</label>
          <input
            className="adm-input"
            value={grammarFocus}
            onChange={e => setGrammarFocus(e.target.value)}
            placeholder="e.g. Conjugation of können, müssen, wollen + sentence position"
            disabled={!!stage}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="adm-btn"
          onClick={generate}
          disabled={!!stage || !topic.trim() || !grammarFocus.trim()}
        >
          {stage === 'text' ? 'Writing Arabic lesson…'
            : stage === 'translate' ? 'Translating to FR / EN / DE…'
            : '✨ Generate lesson'}
        </button>
      </div>

      {error && (
        <div style={{
          background: '#fee2e2', border: '1px solid #fca5a5', color: '#7f1d1d',
          borderRadius: 10, padding: 12, fontSize: 13, marginTop: 12, fontFamily: 'monospace',
        }}>
          <strong>⚠ {error}</strong>
        </div>
      )}

      {lesson && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {(['ar', 'fr', 'en', 'de'] as Tab[]).map(t => {
              const has = t === 'ar' ? !!lesson : !!translations[t]
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTab(t)}
                  disabled={!has}
                  style={{
                    padding: '6px 12px', fontSize: 13, borderRadius: 8, cursor: has ? 'pointer' : 'wait',
                    border: '1px solid ' + (activeTab === t ? '#0f172a' : '#cbd5e1'),
                    background: activeTab === t ? '#0f172a' : 'white',
                    color: activeTab === t ? 'white' : '#0f172a',
                    fontWeight: activeTab === t ? 700 : 500,
                    opacity: has ? 1 : 0.5,
                  }}
                >
                  {t.toUpperCase()}{has ? '' : ' (loading)'}
                </button>
              )
            })}
            <div style={{ flex: 1 }} />
            <button
              type="button"
              className="adm-btn"
              onClick={copyActive}
              style={{ background: '#0f766e' }}
            >
              📋 Copy {activeTab.toUpperCase()} JSON
            </button>
          </div>

          <div style={{
            background: '#fef3c7', border: '1px solid #fcd34d', color: '#78350f',
            borderRadius: 10, padding: '8px 12px', fontSize: 12, marginBottom: 10,
          }}>
            👉 Paste into: <code style={{ background: '#fde68a', padding: '1px 6px', borderRadius: 4 }}>{targetFile}</code>
          </div>

          <pre style={{
            background: '#0f172a', color: '#f8fafc', padding: 16, borderRadius: 10,
            fontSize: 12, lineHeight: 1.5, maxHeight: 480, overflow: 'auto',
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          }}>{activeJson()}</pre>
        </div>
      )}
    </section>
  )
}
