import type { Metadata } from 'next'
import CVBuilderClient from './CVBuilderClient'
import './cv-builder.css'

export const metadata: Metadata = {
  title: 'منشئ السيرة الذاتية — مغرب نحو ألمانيا',
  description: 'أنشئ سيرة ذاتية ألمانية احترافية (Lebenslauf) بسهولة — عدة قوالب وتصدير PDF مجاني.',
}

export default function CVBuilderPage() {
  return <CVBuilderClient />
}
