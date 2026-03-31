import type { CityData, CityCandidate } from '@/types'

function toRad(deg: number): number {
  return deg * Math.PI / 180
}

/** Haversine 公式计算两坐标间球面距离(km) */
export function getDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const R = 6371
  const [lon1, lat1] = coord1
  const [lon2, lat2] = coord2
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

/** 估算真实公路距离 = 球面距离 × 1.3 */
export function estimateRoadDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  return Math.round(getDistance(coord1, coord2) * 1.3)
}

/** 计算专注时长(秒) = 距离 × 12 (5km/分钟 = 1km/12秒) */
export function calcDuration(distanceKm: number): number {
  return Math.round(distanceKm * 12)
}

/** 计算从 coord1 到 coord2 的方位角，返回 E/S/W/N */
export function getDirection(
  coord1: [number, number],
  coord2: [number, number]
): 'E' | 'S' | 'W' | 'N' {
  const [lon1, lat1] = coord1
  const [lon2, lat2] = coord2
  const dLon = toRad(lon2 - lon1)
  const y = Math.sin(dLon) * Math.cos(toRad(lat2))
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon)
  let bearing = Math.atan2(y, x) * 180 / Math.PI
  bearing = (bearing + 360) % 360

  // N: 315-45, E: 45-135, S: 135-225, W: 225-315
  if (bearing >= 45 && bearing < 135) return 'E'
  if (bearing >= 135 && bearing < 225) return 'S'
  if (bearing >= 225 && bearing < 315) return 'W'
  return 'N'
}

/** 筛选附近城市并随机取3个 */
export function getNearbyCities(
  origin: [number, number],
  allCities: CityData[],
  maxRadius = 200
): CityCandidate[] {
  let radius = maxRadius
  let nearby: CityCandidate[] = []

  while (nearby.length < 3 && radius <= 1000) {
    nearby = allCities
      .map(city => {
        const dist = estimateRoadDistance(origin, city.coord)
        return { ...city, distance: dist, estimatedDuration: calcDuration(dist) }
      })
      .filter(c => c.distance > 20 && c.distance <= radius)

    if (nearby.length < 3) radius += 200
  }

  // Fisher-Yates shuffle
  for (let i = nearby.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[nearby[i], nearby[j]] = [nearby[j], nearby[i]]
  }

  return nearby.slice(0, 3)
}
