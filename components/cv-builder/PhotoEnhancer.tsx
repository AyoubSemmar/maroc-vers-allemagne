'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  currentImage: string
  onAccept: (newImage: string) => void
}

type HijabChoice = 'none' | 'keep' | 'remove'
type ProfessionChoice = 'office' | 'health' | 'lkw' | 'handwerk' | 'gastronomie'

type GalleryItem = {
  id: string
  image: string          // data URL
  profession: ProfessionChoice
  hijab: HijabChoice
  createdAt: number
}

const PROFESSIONS: { value: ProfessionChoice; label: string; icon: string }[] = [
  { value: 'office',   label: 'مكتب / شركة',            icon: '💼' },
  { value: 'health',   label: 'رعاية صحية / تمريض',    icon: '🩺' },
  { value: 'lkw',      label: 'سائق شاحنة (LKW)',      icon: '🚚' },
  { value: 'handwerk', label: 'حرفي (كهرباء، ميكانيك)', icon: '🔧' },
  { value: 'gastronomie', label: 'مطاعم / فندقة',       icon: '🍽️' },
]

function professionLabel(v: ProfessionChoice): string {
  return PROFESSIONS.find(p => p.value === v)?.label ?? v
}

export default function PhotoEnhancer({ currentImage, onAccept }: Props) {
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [modalOpen, setModalOpen]   = useState(false)
  const [remaining, setRemaining]   = useState<number | null>(null)
  const [limit, setLimit]           = useState(5)
  const [hijab, setHijab]           = useState<HijabChoice>('none')
  const [profession, setProfession] = useState<ProfessionChoice>('office')

  // Gallery of every image the user has generated in this session
  const [gallery, setGallery]       = useState<GalleryItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Always send the ORIGINAL uploaded photo to the API (prevents drift)
  const [originalImage, setOriginalImage] = useState(currentImage)
  const producedImagesRef = useRef<Set<string>>(new Set())

  // Fetch server-side remaining quota on mount
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/enhance-photo', { method: 'GET' })
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        if (typeof data.remaining === 'number') setRemaining(data.remaining)
        if (typeof data.limit === 'number') setLimit(data.limit)
      } catch {}
    })()
    return () => { cancelled = true }
  }, [])

  // Track fresh uploads (not our own AI outputs)
  useEffect(() => {
    if (currentImage && !producedImagesRef.current.has(currentImage)) {
      setOriginalImage(currentImage)
    }
  }, [currentImage])

  async function run() {
    const source = originalImage || currentImage
    if (!source) { setError('ارفع صورة أولاً'); return }
    if (remaining !== null && remaining <= 0) {
      setError(`وصلت الحد اليومي (${limit} محاولات). جرّب غداً.`)
      return
    }

    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/enhance-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: source, hijab, profession }),
      })
      const data = await res.json()
      if (res.status === 401) {
        throw new Error('يجب تسجيل الدخول لاستخدام هذه الميزة.')
      }
      if (!res.ok || !data.image) {
        if (typeof data.remaining === 'number') setRemaining(data.remaining)
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      producedImagesRef.current.add(data.image)
      if (typeof data.remaining === 'number') setRemaining(data.remaining)
      if (typeof data.limit === 'number') setLimit(data.limit)

      const item: GalleryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        image: data.image,
        profession,
        hijab,
        createdAt: Date.now(),
      }
      setGallery(g => [item, ...g])
      setSelectedId(item.id)
      setModalOpen(true)
    } catch (e: any) {
      setError(e?.message || 'تعذر تحسين الصورة. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  function accept() {
    const pick = gallery.find(g => g.id === selectedId) ?? gallery[0]
    if (pick) {
      onAccept(pick.image)
      setModalOpen(false)
    }
  }

  function cancel() {
    setModalOpen(false)
  }

  async function downloadItem(it: GalleryItem) {
    const filename = `cv-photo-${it.profession}-${new Date(it.createdAt).toISOString().slice(0, 10)}.jpg`

    // iOS Safari ignores the <a download> attribute for data URLs and usually
    // navigates to the image instead of saving it. The only reliable way to
    // "save" a photo on iOS is via the native share sheet → "Save to Photos".
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes('Mac') && typeof document !== 'undefined' && 'ontouchend' in document)

    if (isIOS) {
      try {
        const res = await fetch(it.image)
        const blob = await res.blob()
        const file = new File([blob], filename, { type: blob.type || 'image/jpeg' })
        const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
        if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
          await nav.share({ files: [file], title: 'صورة CV' })
          return
        }
      } catch (e: any) {
        if (e?.name === 'AbortError') return
        // fall through to blob-url fallback
      }
    }

    // Desktop + Android: blob URL + anchor click is reliable.
    try {
      const res = await fetch(it.image)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      // Last-ditch fallback: open in new tab so user can long-press / right-click → save.
      window.open(it.image, '_blank')
    }
  }

  async function shareItem(it: GalleryItem) {
    const filename = `cv-photo-${it.profession}-${new Date(it.createdAt).toISOString().slice(0, 10)}.jpg`
    try {
      const res = await fetch(it.image)
      const blob = await res.blob()
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' })

      // 1. Native share sheet (iOS/Android Safari+Chrome) — opens WhatsApp, Instagram, etc.
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
      if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
        await nav.share({
          files: [file],
          title: 'صورة CV احترافية',
          text: 'تم إنشاؤها على "دليلك نحو ألمانيا" 🇩🇪',
        })
        return
      }

      // 2. Desktop fallback: copy the image to the clipboard.
      const CI = (window as unknown as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem
      if (CI && navigator.clipboard && 'write' in navigator.clipboard) {
        const item = new CI({ [blob.type || 'image/png']: blob })
        await navigator.clipboard.write([item])
        alert('✅ تم نسخ الصورة إلى الحافظة — الصقها في أي تطبيق (WhatsApp، Instagram، ...).')
        return
      }

      // 3. Final fallback: just download it.
      downloadItem(it)
      alert('📥 تم تحميل الصورة. شاركها يدوياً في أي تطبيق.')
    } catch (e: any) {
      if (e?.name === 'AbortError') return // user cancelled the share dialog
      console.error('[share]', e)
      alert('❌ تعذر المشاركة: ' + (e?.message || 'خطأ غير معروف'))
    }
  }

  const selected = gallery.find(g => g.id === selectedId) ?? gallery[0] ?? null
  const canGenerate = remaining === null ? true : remaining > 0

  return (
    <>
      <div className="rihla-cvb-ai-bar">
        <div>
          <strong>📸 تحويل الصورة إلى صورة CV احترافية</strong>
          <p className="rihla-cvb-hint-small" style={{ margin: '4px 0 0' }}>
            خلفية واقعية، ملابس مناسبة لمجالك، مع الحفاظ على ملامحك.
            {remaining !== null && (
              <> &nbsp;·&nbsp; <span style={{ color: remaining === 0 ? '#dc2626' : 'var(--ink-mute)' }}>
                متبقي اليوم: {remaining}/{limit}
              </span></>
            )}
          </p>
          {error && (
            <p className="rihla-cvb-hint-small" style={{ color: '#dc2626', margin: '6px 0 0' }}>
              ❌ {error}
            </p>
          )}

          {/* Profession selector */}
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <span className="rihla-cvb-hint-small" style={{ margin: 0, fontWeight: 600 }}>
              🎯 نوع الصورة:
            </span>
            {PROFESSIONS.map(p => (
              <label key={p.value}
                className="rihla-cvb-hint-small"
                style={{
                  margin: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  border: `1px solid ${profession === p.value ? 'var(--brand, #0ea5a0)' : 'rgba(0,0,0,0.15)'}`,
                  background: profession === p.value ? 'rgba(14,165,160,0.1)' : 'transparent',
                  borderRadius: 999,
                  cursor: 'pointer',
                  fontWeight: profession === p.value ? 600 : 400,
                }}
              >
                <input type="radio" name="profession" value={p.value}
                  checked={profession === p.value}
                  onChange={() => setProfession(p.value)}
                  style={{ display: 'none' }} />
                <span>{p.icon} {p.label}</span>
              </label>
            ))}
          </div>

          {/* Hijab selector */}
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span className="rihla-cvb-hint-small" style={{ margin: 0, fontWeight: 600 }}>
              🧕 الحجاب:
            </span>
            <label className="rihla-cvb-hint-small" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <input type="radio" name="hijab" value="none"
                checked={hijab === 'none'} onChange={() => setHijab('none')} />
              لا أرتدي الحجاب
            </label>
            <label className="rihla-cvb-hint-small" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <input type="radio" name="hijab" value="keep"
                checked={hijab === 'keep'} onChange={() => setHijab('keep')} />
              احتفظ بالحجاب
            </label>
            <label className="rihla-cvb-hint-small" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <input type="radio" name="hijab" value="remove"
                checked={hijab === 'remove'} onChange={() => setHijab('remove')} />
              أزل الحجاب
            </label>
          </div>

          {/* Mini gallery (shown outside modal after at least one generation) */}
          {gallery.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <p className="rihla-cvb-hint-small" style={{ margin: '0 0 6px', fontWeight: 600 }}>
                🖼️ صورك المولّدة ({gallery.length}):
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {gallery.map(it => (
                  <div key={it.id}
                    style={{
                      border: `2px solid ${selectedId === it.id ? 'var(--brand, #0ea5a0)' : 'rgba(0,0,0,0.12)'}`,
                      borderRadius: 8,
                      overflow: 'hidden',
                      width: 72,
                      height: 72,
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => setSelectedId(it.id)}
                    title={professionLabel(it.profession)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt={professionLabel(it.profession)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
                <button type="button" className="rihla-cvb-btn-ghost"
                  onClick={() => setModalOpen(true)}
                  style={{ height: 72, padding: '0 12px' }}>
                  عرض التفاصيل →
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="rihla-cvb-btn-primary"
          onClick={run}
          disabled={loading || !currentImage || !canGenerate}
        >
          {loading ? '⏳ جاري المعالجة...' : gallery.length > 0 ? '✨ إنشاء صورة أخرى' : '✨ إنشاء صورة احترافية'}
        </button>
      </div>

      {modalOpen && gallery.length > 0 && (
        <div
          className="rihla-photo-modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) cancel() }}
        >
          <div className="rihla-photo-modal" style={{ maxWidth: 920 }}>
            <div className="rihla-photo-modal-header">
              <h3>صورك المولّدة — اختر الأفضل</h3>
              <button type="button" onClick={cancel} className="rihla-photo-modal-close">✕</button>
            </div>

            <div className="rihla-photo-compare">
              <figure>
                <figcaption>قبل (الأصلية)</figcaption>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalImage || currentImage} alt="قبل" />
              </figure>
              <figure>
                <figcaption>
                  بعد ✨ {selected && <span style={{ opacity: 0.7, fontSize: 12 }}>
                    ({professionLabel(selected.profession)})
                  </span>}
                </figcaption>
                {selected && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={selected.image} alt="بعد" />
                )}
              </figure>
            </div>

            {/* Full-size gallery strip */}
            <div style={{ padding: '0 16px 8px' }}>
              <p className="rihla-cvb-hint-small" style={{ margin: '4px 0 8px', fontWeight: 600 }}>
                كل الصور ({gallery.length}) — اضغط لتحديد صورة:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {gallery.map(it => (
                  <div key={it.id}
                    style={{
                      border: `3px solid ${selectedId === it.id ? 'var(--brand, #0ea5a0)' : 'rgba(0,0,0,0.12)'}`,
                      borderRadius: 10,
                      overflow: 'hidden',
                      width: 120,
                      cursor: 'pointer',
                      position: 'relative',
                      background: '#fff',
                    }}
                    onClick={() => setSelectedId(it.id)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt={professionLabel(it.profession)}
                      style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                    <div style={{
                      fontSize: 11,
                      padding: '4px 6px',
                      textAlign: 'center',
                      borderTop: '1px solid rgba(0,0,0,0.08)',
                      color: '#444',
                    }}>
                      {professionLabel(it.profession)}
                    </div>
                    <button type="button"
                      onClick={(e) => { e.stopPropagation(); downloadItem(it) }}
                      title="تحميل"
                      aria-label="تحميل"
                      style={{
                        position: 'absolute',
                        top: 4, insetInlineEnd: 4,
                        background: 'rgba(255,255,255,0.95)',
                        border: '1px solid rgba(0,0,0,0.15)',
                        borderRadius: 6,
                        width: 26, height: 26,
                        padding: 0,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#111',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 3v13" />
                        <path d="M6 11l6 6 6-6" />
                        <path d="M4 21h16" />
                      </svg>
                    </button>
                    <button type="button"
                      onClick={(e) => { e.stopPropagation(); shareItem(it) }}
                      title="مشاركة"
                      aria-label="مشاركة"
                      style={{
                        position: 'absolute',
                        top: 4, insetInlineEnd: 34,
                        background: 'rgba(255,255,255,0.95)',
                        border: '1px solid rgba(0,0,0,0.15)',
                        borderRadius: 6,
                        width: 26, height: 26,
                        padding: 0,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#111',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                        <path d="M16 6l-4-4-4 4" />
                        <path d="M12 2v14" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rihla-photo-modal-footer">
              <button type="button" className="rihla-cvb-btn-ghost" onClick={cancel}>
                ✕ إغلاق
              </button>
              <button
                type="button"
                className="rihla-cvb-btn-ghost"
                onClick={run}
                disabled={loading || !canGenerate}
              >
                {loading ? '⏳...' : '↻ إنشاء صورة أخرى'}
              </button>
              <button type="button" className="rihla-cvb-btn-primary" onClick={accept} disabled={!selected}>
                ✓ استخدم المحددة في السيرة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
