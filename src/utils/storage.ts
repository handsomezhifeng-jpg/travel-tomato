import type { PomodoroRecord, CurrentCity, DailySummary, VisitedCity } from '@/types'

const RECORDS_KEY = 'pomodoro_records'
const CURRENT_CITY_KEY = 'current_city'

// ============ 番茄钟记录 ============

export function addRecord(record: PomodoroRecord): void {
  const records = getAllRecords()
  records.push(record)
  uni.setStorageSync(RECORDS_KEY, JSON.stringify(records))
}

export function getAllRecords(): PomodoroRecord[] {
  const raw = uni.getStorageSync(RECORDS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as PomodoroRecord[]
  } catch {
    return []
  }
}

export function getRecordsByDate(date: string): PomodoroRecord[] {
  return getAllRecords().filter(r => r.date === date)
}

export function getRecordsByDateRange(from: string, to: string): PomodoroRecord[] {
  return getAllRecords().filter(r => r.date >= from && r.date <= to)
}

// ============ 当前城市 ============

export function getCurrentCity(): CurrentCity | null {
  const raw = uni.getStorageSync(CURRENT_CITY_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CurrentCity
  } catch {
    return null
  }
}

export function setCurrentCity(city: CurrentCity): void {
  uni.setStorageSync(CURRENT_CITY_KEY, JSON.stringify(city))
}

// ============ 统计计算 ============

export function getDailySummary(date: string): DailySummary {
  const records = getRecordsByDate(date).filter(r => r.completed)
  const cities = [...new Set(records.map(r => r.destCity))]
  return {
    date,
    count: records.length,
    totalDuration: records.reduce((s, r) => s + r.duration, 0),
    totalDistance: records.reduce((s, r) => s + r.distance, 0),
    cities,
  }
}

export function getWeeklySummaries(weekStart: string): DailySummary[] {
  const summaries: DailySummary[] = []
  const d = new Date(weekStart)
  for (let i = 0; i < 7; i++) {
    const dateStr = d.toISOString().slice(0, 10)
    summaries.push(getDailySummary(dateStr))
    d.setDate(d.getDate() + 1)
  }
  return summaries
}

export function getMonthlySummaries(year: number, month: number): DailySummary[] {
  const daysInMonth = new Date(year, month, 0).getDate()
  const summaries: DailySummary[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    summaries.push(getDailySummary(dateStr))
  }
  return summaries
}

// ============ 已到访城市 ============

export function getVisitedCities(): VisitedCity[] {
  const records = getAllRecords().filter(r => r.completed)
  const map = new Map<string, VisitedCity>()

  for (const r of records) {
    const key = `${r.destCity}_${r.destCountry}`
    const existing = map.get(key)
    if (existing) {
      existing.visitCount++
      if (r.date < existing.firstVisit) existing.firstVisit = r.date
    } else {
      map.set(key, {
        name: r.destCity,
        country: r.destCountry,
        continent: '', // 从城市数据中补充
        coord: r.destCoord,
        firstVisit: r.date,
        visitCount: 1,
      })
    }
  }

  return Array.from(map.values())
}

// ============ 全局统计 ============

export function getTotalStats() {
  const records = getAllRecords().filter(r => r.completed)
  const visitedCities = getVisitedCities()
  return {
    totalRecords: records.length,
    totalDuration: records.reduce((s, r) => s + r.duration, 0),
    totalDistance: records.reduce((s, r) => s + r.distance, 0),
    totalCities: visitedCities.length,
  }
}
