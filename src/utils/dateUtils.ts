/** 获取今天日期 YYYY-MM-DD */
export function today(): string {
  return formatDate(new Date())
}

/** 格式化日期为 YYYY-MM-DD */
export function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 格式化时间为 HH:MM:SS */
export function formatTime(d: Date): string {
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(n => String(n).padStart(2, '0'))
    .join(':')
}

/** 秒数格式化为 MM:SS */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** 秒数格式化为可读文本，支持多语言 */
export function formatDurationText(seconds: number): string {
  // 动态获取语言设置
  const lang = uni.getStorageSync('app_language') || 'zh'
  const units = getDurationUnits(lang)
  if (seconds < 60) return `${seconds}${units.s}`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}${units.m}${s}${units.s}` : `${m}${units.m}`
}

function getDurationUnits(lang: string): { m: string; s: string } {
  const map: Record<string, { m: string; s: string }> = {
    zh: { m: '分', s: '秒' },
    en: { m: 'min ', s: 's' },
    ja: { m: '分', s: '秒' },
    ko: { m: '분 ', s: '초' },
    fr: { m: 'min ', s: 's' },
    de: { m: 'Min ', s: 's' },
    es: { m: 'min ', s: 's' },
    pt: { m: 'min ', s: 's' },
    ru: { m: 'мин ', s: 'с' },
    ar: { m: 'د ', s: 'ث' },
    th: { m: 'นาที ', s: 'วินาที' },
    vi: { m: 'phút ', s: 'giây' },
  }
  return map[lang] || map['zh']
}

/** 获取某月的日历网格 (6行7列) */
export function getMonthGrid(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const grid: (number | null)[][] = []
  let day = 1

  for (let row = 0; row < 6; row++) {
    const week: (number | null)[] = []
    for (let col = 0; col < 7; col++) {
      if (row === 0 && col < firstDay) {
        week.push(null)
      } else if (day > daysInMonth) {
        week.push(null)
      } else {
        week.push(day++)
      }
    }
    grid.push(week)
    if (day > daysInMonth) break
  }
  return grid
}

/** 获取某一周的起止日期 (周一为起始) */
export function getWeekRange(date: Date): { start: string; end: string } {
  const d = new Date(date)
  const day = d.getDay() || 7 // 周日=7
  d.setDate(d.getDate() - day + 1) // 周一
  const start = formatDate(d)
  d.setDate(d.getDate() + 6) // 周日
  const end = formatDate(d)
  return { start, end }
}

/** 生成 UUID */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
