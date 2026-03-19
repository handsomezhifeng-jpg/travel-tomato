// 番茄钟记录
export interface PomodoroRecord {
  id: string
  date: string              // "2026-03-18"
  startTime: string         // "09:30:15"
  endTime: string           // "09:30:50"
  originCity: string
  originCountry: string
  originCoord: [number, number] // [经度, 纬度]
  destCity: string
  destCountry: string
  destCoord: [number, number]
  distance: number          // km
  duration: number          // 秒
  note: string
  completed: boolean
}

// 城市数据
export interface CityData {
  name: string
  country: string
  region: string
  continent: string
  coord: [number, number]   // [经度, 纬度]
  description: string
  tagline: string
  population?: number
}

// 当前所在城市
export interface CurrentCity {
  name: string
  country: string
  coord: [number, number]
  arrivedAt: string         // ISO string
}

// 城市距离缓存
export interface CityDistance {
  from: string
  to: string
  distance: number
  source: 'preset' | 'api' | 'estimated'
}

// 已点亮城市
export interface VisitedCity {
  name: string
  country: string
  continent: string
  coord: [number, number]
  firstVisit: string
  visitCount: number
}

// 日统计
export interface DailySummary {
  date: string
  count: number
  totalDuration: number     // 秒
  totalDistance: number      // km
  cities: string[]
}

// 目的地候选（带距离）
export interface CityCandidate extends CityData {
  distance: number          // 距出发点距离 km
  estimatedDuration: number // 预计专注时长 秒
}
