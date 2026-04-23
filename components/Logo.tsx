export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const text = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
  const badge = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'

  return (
    <div className={`flex items-center gap-2 font-black ${text} select-none`} dir="ltr">
      <div className="flex items-center gap-0.5">
        <span className="text-red-500">MA</span>
        <span className="text-gray-400 font-light mx-0.5">→</span>
        <span className="text-green-700">DE</span>
      </div>
      <span className={`bg-green-700 text-white rounded-md font-bold leading-none ${badge}`}>
        دليلك
      </span>
    </div>
  )
}
