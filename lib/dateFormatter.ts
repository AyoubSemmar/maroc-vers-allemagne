// Format a date as "Today", "1 day ago", "N days ago" in Arabic.
export function formatRelativeDateAr(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  const diffMs = Date.now() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'اليوم'
  if (diffDays === 1) return 'منذ يوم'
  if (diffDays === 2) return 'منذ يومين'
  if (diffDays <= 10) return `منذ ${diffDays} أيام`
  return `منذ ${diffDays} يوماً`
}

export function formatRelativeDateEn(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  const diffMs = Date.now() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
}
