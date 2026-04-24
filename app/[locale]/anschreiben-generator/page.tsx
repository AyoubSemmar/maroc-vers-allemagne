import type { Metadata } from 'next'
import AnschreibenClient from './AnschreibenClient'
import './anschreiben.css'

export const metadata: Metadata = {
  title: 'مولّد خطاب التحفيز — مغرب نحو ألمانيا',
  description: 'اكتب خطاب تحفيز احترافي بالألمانية لطلب Ausbildung بمساعدة الذكاء الاصطناعي — مجاني وسريع.',
}

export default function AnschreibenPage() {
  return <AnschreibenClient />
}
