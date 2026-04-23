// PDF export via jspdf + html2canvas-pro (supports oklch, modern CSS, multi-page)
import type { CVData } from './types'

export async function exportCvToPdf(element: HTMLElement, data: CVData) {
  if (typeof window === 'undefined') return

  const [{ default: jsPDF }, html2canvasMod] = await Promise.all([
    import('jspdf'),
    import('html2canvas-pro'),
  ])
  const html2canvas = (html2canvasMod as any).default

  const first = data.personalInfo.firstName || 'CV'
  const last = data.personalInfo.lastName || ''
  const filename =
    `CV_${first}_${last}`.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') + '.pdf'

  // IMPORTANT: the preview element may have `transform: scale()` applied on mobile
  // and `position: absolute` with offset margins. That makes html2canvas capture
  // the wrong region.
  //
  // Cleanest fix: clone the element into an off-screen container at native
  // 794px size, render from there, then remove the clone.
  const clone = element.cloneNode(true) as HTMLElement
  clone.style.transform = 'none'
  clone.style.position = 'static'
  clone.style.top = 'auto'
  clone.style.left = 'auto'
  clone.style.right = 'auto'
  clone.style.bottom = 'auto'
  clone.style.margin = '0'
  clone.style.width = '794px'

  const stage = document.createElement('div')
  stage.style.position = 'fixed'
  stage.style.left = '-10000px'
  stage.style.top = '0'
  stage.style.width = '794px'
  stage.style.background = '#ffffff'
  stage.style.pointerEvents = 'none'
  stage.appendChild(clone)
  document.body.appendChild(stage)

  // Force layout
  void stage.offsetHeight

  let canvas: HTMLCanvasElement
  try {
    canvas = await html2canvas(clone, {
      scale: 3,              // 3× for crisp PDF
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    })
  } finally {
    document.body.removeChild(stage)
  }

  // PNG for crisp text (larger file but no JPEG artifacts on text edges)
  const imgData = canvas.toDataURL('image/png')

  // A4 dimensions in mm
  const pdfWidth = 210
  const pdfHeight = 297

  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
  })

  // Calculate image dimensions
  const imgWidthNatural = pdfWidth
  const imgHeightNatural = (canvas.height * imgWidthNatural) / canvas.width

  // If content is less than ~1.5 A4 pages, fit it onto ONE page by scaling
  // (scale down uniformly to fit within 210×297mm, centered).
  // Only truly multi-page CVs (1.5+ pages of actual content) get paginated.
  const FORCE_SINGLE_PAGE_LIMIT = pdfHeight * 1.5 // ~445mm

  if (imgHeightNatural <= FORCE_SINGLE_PAGE_LIMIT) {
    // Scale to fit one page exactly
    const ratio = Math.min(pdfWidth / imgWidthNatural, pdfHeight / imgHeightNatural)
    const finalW = imgWidthNatural * ratio
    const finalH = imgHeightNatural * ratio
    const offsetX = (pdfWidth - finalW) / 2
    const offsetY = (pdfHeight - finalH) / 2
    pdf.addImage(imgData, 'PNG', offsetX, offsetY, finalW, finalH)
  } else {
    // Genuinely multi-page: slice canvas across pages
    const MIN_OVERFLOW_MM = 15
    let position = 0
    let pageCount = 0
    while (true) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidthNatural, imgHeightNatural)
      pageCount++
      const consumed = pageCount * pdfHeight
      const remaining = imgHeightNatural - consumed
      if (remaining <= MIN_OVERFLOW_MM) break
      pdf.addPage()
      position -= pdfHeight
    }
  }

  pdf.save(filename)
}
