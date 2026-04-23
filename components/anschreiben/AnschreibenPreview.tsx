'use client'

import { useState } from 'react'
import { saveAnschreibenDocument } from '@/lib/documents'
import { createClient } from '@/lib/supabase-browser'

type Props = {
  letter: string
  fullName: string
  position: string // raw user input — AI expands it inside the letter
}

// Lines that start with >>DATE>> are rendered right-aligned (date line)
const DATE_MARKER = '>>DATE>>'

function parseLine(line: string): { text: string; isDate: boolean } {
  if (line.startsWith(DATE_MARKER)) {
    return { text: line.slice(DATE_MARKER.length).trim(), isDate: true }
  }
  return { text: line, isDate: false }
}

export default function AnschreibenPreview({ letter, fullName, position }: Props) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // Clean letter for clipboard (strip markers)
  const cleanLetter = letter.replace(new RegExp(DATE_MARKER, 'g'), '')

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(cleanLetter)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = cleanLetter
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleSave() {
    if (saving) return
    setSaving(true)
    setSaveMsg('')
    try {
      const supabase = createClient()
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) {
        if (confirm('يجب تسجيل الدخول لحفظ الوثيقة. هل تريد الانتقال لصفحة تسجيل الدخول؟')) {
          window.location.href = '/login'
        }
        return
      }
      const title = fullName
        ? `${fullName} — ${position || 'Anschreiben'}`
        : (position || 'Anschreiben')
      await saveAnschreibenDocument(title, letter)
      setSaveMsg('✅ محفوظ!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (e: any) {
      setSaveMsg('❌ ' + (e?.message || 'خطأ'))
      setTimeout(() => setSaveMsg(''), 4000)
    } finally {
      setSaving(false)
    }
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

      const margin = 20
      const pageWidth = 210
      const maxWidth = pageWidth - margin * 2
      const lineHeight = 7
      let y = margin

      // Title only — no subtitle, no city
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(13)
      pdf.text('Bewerbungsanschreiben', margin, y)
      y += 10

      // Divider
      pdf.setDrawColor(220)
      pdf.line(margin, y, pageWidth - margin, y)
      y += 8

      // Letter body
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')

      for (const rawLine of letter.split('\n')) {
        const { text, isDate } = parseLine(rawLine)

        if (text.trim() === '') {
          y += lineHeight * 0.6
          continue
        }

        if (isDate) {
          // Right-aligned date
          const dateWidth = pdf.getTextWidth(text)
          if (y > 277) { pdf.addPage(); y = margin }
          pdf.text(text, pageWidth - margin - dateWidth, y)
          y += lineHeight
          continue
        }

        const wrapped = pdf.splitTextToSize(text, maxWidth)
        for (const wl of wrapped) {
          if (y > 277) { pdf.addPage(); y = margin }
          pdf.text(wl, margin, y)
          y += lineHeight
        }
      }

      const safeName = fullName.replace(/\s+/g, '_')
      const safePos = position.replace(/\s+/g, '_').slice(0, 30)
      pdf.save(`Anschreiben_${safeName}_${safePos}.pdf`)
    } catch (e) {
      console.error(e)
      alert('حدث خطأ أثناء التحميل. حاول مرة أخرى.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="ansch-preview-card">
      <div className="ansch-preview-header">
        <div>
          <h2 className="ansch-section-title" style={{ margin: 0 }}>خطاب التحفيز</h2>
          <p className="ansch-hint-small" style={{ marginTop: 4 }}>Bewerbungsanschreiben · {position}</p>
        </div>
        <div className="ansch-preview-actions">
          <button type="button" className="ansch-btn-ghost" onClick={handleCopy}>
            {copied ? '✅ تم النسخ' : '📋 نسخ'}
          </button>
          <button type="button" className="ansch-btn-ghost" onClick={handleSave} disabled={saving}>
            {saving ? '⏳...' : saveMsg || '💾 حفظ'}
          </button>
          <button type="button" className="ansch-btn-brand" onClick={handleDownload} disabled={downloading}>
            {downloading ? '⏳ ...' : '📥 PDF'}
          </button>
        </div>
      </div>

      {/* Letter rendered LTR in German */}
      <div className="ansch-letter-body" dir="ltr" lang="de">
        {letter.split('\n').map((rawLine, i) => {
          const { text, isDate } = parseLine(rawLine)
          if (text.trim() === '') return <div key={i} className="ansch-letter-spacer" />
          if (isDate) return <p key={i} className="ansch-letter-date">{text}</p>
          return <p key={i}>{text}</p>
        })}
      </div>
    </div>
  )
}
