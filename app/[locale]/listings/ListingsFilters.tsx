'use client'

import { useRouter } from 'next/navigation'

export default function ListingsFilters({ cities, currentCity, currentType }: {
  cities: string[]
  currentCity?: string
  currentType?: string
}) {
  const router = useRouter()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams()
    if (key !== 'city' && currentCity && currentCity !== 'كل المدن') params.set('city', currentCity)
    if (key !== 'type' && currentType) params.set('type', currentType)
    if (key === 'city' && value !== 'كل المدن') params.set('city', value)
    if (key === 'type' && value) params.set('type', value)
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3 mb-8 items-center">
      {/* Type filters */}
      <button onClick={() => updateFilter('type', '')} className={`px-4 py-2 rounded-full text-sm border ${!currentType ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>الكل</button>
      <button onClick={() => updateFilter('type', 'غرفة')} className={`px-4 py-2 rounded-full text-sm border ${currentType === 'غرفة' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>غرفة</button>
      <button onClick={() => updateFilter('type', 'شقة')} className={`px-4 py-2 rounded-full text-sm border ${currentType === 'شقة' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>شقة</button>

      {/* City filter */}
      <select
        value={currentCity || 'كل المدن'}
        onChange={e => updateFilter('city', e.target.value)}
        className="border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 bg-white"
      >
        {cities.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  )
}
