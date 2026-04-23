import { supabase } from '@/lib/supabase'
import RihlaLanding from '@/components/landing/RihlaLanding'

export default async function Home() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false })

  const featured = (articles ?? []).filter((a) => a.featured)
  const list = featured.length > 0 ? featured.slice(0, 3) : (articles ?? []).slice(0, 3)

  return <RihlaLanding articles={list} />
}
