<template>
  <view class="page">
    <NavBar :title="t('pageTravelMap')" />

    <view class="map-content">
      <!-- Leaflet 地图 -->
      <view class="map-section">
        <view id="leafletMap" class="leaflet-container"></view>
        <!-- 图例 -->
        <view class="map-legend">
          <view class="legend-item">
            <view class="legend-dot legend-gold"></view>
            <text class="legend-text">{{ t('cities') }}</text>
          </view>
          <view class="legend-item">
            <view class="legend-dot legend-red"></view>
            <text class="legend-text">{{ t('youAreAt') }}</text>
          </view>
        </view>
      </view>

      <!-- 统计面板 -->
      <view class="stats-panel">
      <view class="overview-card">
        <view class="overview-row">
          <view class="overview-item">
            <text class="ov-val">{{ visitedCities.length }}</text>
            <text class="ov-label">{{ t('cities') }}</text>
          </view>
          <view class="overview-item">
            <text class="ov-val">{{ formatKm(totalDistance) }}</text>
            <text class="ov-label">{{ t('totalDistance') }}</text>
          </view>
          <view class="overview-item">
            <text class="ov-val">{{ visitedContinents.length }}</text>
            <text class="ov-label">{{ t('continents') }}</text>
          </view>
        </view>
      </view>

      <view class="continent-section">
        <view v-for="c in continentStats" :key="c.name" class="continent-row">
          <text class="cont-name">{{ c.name }}</text>
          <view class="cont-bar-wrap">
            <view class="cont-bar-track">
              <view class="cont-bar-fill" :style="{ width: c.percent + '%' }"></view>
            </view>
            <text class="cont-count">{{ c.visited }}/{{ c.total }}</text>
          </view>
        </view>
      </view>

      <view v-if="visitedCities.length === 0" class="empty-state">
        <text class="empty-text">{{ t('emptyMap') }}</text>
      </view>
    </view>
    </view>

    <!-- 城市详情浮层 -->
    <view v-if="selectedMarkerCity" class="city-detail-mask" @tap="selectedMarkerCity = null">
      <view class="city-detail-card" @tap.stop>
        <text class="detail-name">{{ displayCity(selectedMarkerCity) }}</text>
        <text class="detail-info">{{ t('firstArrival') }}{{ selectedMarkerCity.firstVisit }}</text>
        <text class="detail-info">{{ t('visitCount') }}{{ selectedMarkerCity.visitCount }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import * as storage from '@/utils/storage'
import type { VisitedCity, CityData } from '@/types'
import citiesData from '@/data/cities.json'
import { t, cityName, countryName, useLang, continentName } from '@/utils/i18n'
import NavBar from '@/components/NavBar.vue'

const { currentLang } = useLang()

const visitedCities = ref<VisitedCity[]>([])
const selectedMarkerCity = ref<VisitedCity | null>(null)
const totalDistance = ref(0)

const allCities = citiesData as any[]

function displayCity(city: { name: string; country: string }) {
  const found = allCities.find((c: any) => c.name === city.name && c.country === city.country)
  if (found) return `${cityName(found)}, ${countryName(found)}`
  return `${city.name}, ${city.country}`
}

const visitedContinents = computed(() => {
  const set = new Set<string>()
  for (const c of visitedCities.value) {
    if (c.continent) set.add(c.continent)
  }
  return [...set]
})

const continentKeys = ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania']

const continentStats = computed(() => {
  return continentKeys.map(eng => {
    const total = allCities.filter((c: any) => c.continent === eng).length
    const visited = visitedCities.value.filter(c => c.continent === eng).length
    return {
      name: continentName(eng),
      total: total || 1,
      visited,
      percent: Math.round((visited / (total || 1)) * 100),
    }
  })
})

const recentVisited = computed(() =>
  [...visitedCities.value].sort((a, b) => b.firstVisit.localeCompare(a.firstVisit)).slice(0, 10)
)

function formatKm(km: number): string {
  if (km >= 10000) return (km / 1000).toFixed(1) + 'k'
  return km.toLocaleString()
}

onMounted(() => {
  visitedCities.value = storage.getVisitedCities()

  for (const vc of visitedCities.value) {
    const found = allCities.find((c: any) => c.name === vc.name && c.country === vc.country)
    if (found) vc.continent = found.continent
  }

  const stats = storage.getTotalStats()
  totalDistance.value = stats.totalDistance

  nextTick(() => {
    initLeafletMap()
  })
})

function initLeafletMap() {
  // 动态加载 Leaflet CSS 和 JS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  document.head.appendChild(link)

  const script = document.createElement('script')
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  script.onload = () => {
    createMap()
  }
  document.head.appendChild(script)
}

function createMap() {
  const L = (window as any).L
  if (!L) return

  const container = document.getElementById('leafletMap')
  if (!container) return

  // 确定中心点
  let center: [number, number] = [30, 105] // 默认
  const currentCity = storage.getCurrentCity()

  if (visitedCities.value.length > 0) {
    const lats = visitedCities.value.map(c => c.coord[1])
    const lngs = visitedCities.value.map(c => c.coord[0])
    center = [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
    ]
  } else if (currentCity) {
    center = [currentCity.coord[1], currentCity.coord[0]]
  }

  const map = L.map(container, {
    center: center,
    zoom: 3,
    minZoom: 2,
    maxZoom: 12,
    zoomControl: false,
    attributionControl: false,
  })

  // 深色风格地图瓦片
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
  }).addTo(map)

  // 旅行轨迹连线
  const records = storage.getAllRecords().filter(r => r.completed)
  if (records.length > 0) {
    const points: [number, number][] = []
    for (const r of records) {
      if (points.length === 0) {
        points.push([r.originCoord[1], r.originCoord[0]])
      }
      points.push([r.destCoord[1], r.destCoord[0]])
    }
    L.polyline(points, {
      color: '#E74C3C',
      weight: 2,
      opacity: 0.5,
      dashArray: '8, 6',
    }).addTo(map)
  }

  // 已到访城市标记 - 金色发光圆点
  visitedCities.value.forEach((city, i) => {
    const marker = L.circleMarker([city.coord[1], city.coord[0]], {
      radius: 6,
      fillColor: '#FFD700',
      color: '#FFD700',
      weight: 2,
      opacity: 0.9,
      fillOpacity: 0.7,
    }).addTo(map)

    marker.bindPopup(`<b style="color:#FFD700">${displayCity(city)}</b>`, {
      className: 'dark-popup',
    })

    marker.on('click', () => {
      selectedMarkerCity.value = visitedCities.value[i]
    })
  })

  // 当前城市 - 红色大标记
  if (currentCity) {
    L.circleMarker([currentCity.coord[1], currentCity.coord[0]], {
      radius: 10,
      fillColor: '#E74C3C',
      color: '#FFFFFF',
      weight: 3,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(map)

    L.popup({ className: 'dark-popup', closeButton: false, autoClose: false, closeOnClick: false })
      .setLatLng([currentCity.coord[1], currentCity.coord[0]])
      .setContent(`<b style="color:#E74C3C">📍 ${displayCity(currentCity)}</b>`)
      .addTo(map)
  }

  // 适配视图
  if (visitedCities.value.length > 1) {
    const bounds = visitedCities.value.map(c => [c.coord[1], c.coord[0]] as [number, number])
    if (currentCity) bounds.push([currentCity.coord[1], currentCity.coord[0]])
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 })
  }
}
</script>

<style lang="scss" scoped>
$margin: 40px;

.page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: $bg-dark;
  overflow: hidden;
  padding: $margin;
  padding-top: max(#{$margin}, env(safe-area-inset-top));
  padding-bottom: max(#{$margin}, env(safe-area-inset-bottom));
  padding-left: max(#{$margin}, env(safe-area-inset-left));
  padding-right: max(#{$margin}, env(safe-area-inset-right));
  box-sizing: border-box;
}

.map-section {
  flex: 1;
  min-height: 0;
  position: relative;
}

.leaflet-container {
  width: 100%;
  height: 100%;
  background: #1a1a2e;
}

.map-legend {
  position: absolute;
  bottom: 16rpx;
  left: 16rpx;
  background: rgba(26, 26, 46, 0.85);
  border-radius: 12rpx;
  padding: 10rpx 16rpx;
  display: flex;
  gap: 20rpx;
  z-index: 1000;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.legend-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
}

.legend-gold {
  background: #FFD700;
  box-shadow: 0 0 8rpx #FFD700;
}

.legend-red {
  background: #E74C3C;
  box-shadow: 0 0 8rpx #E74C3C;
}

.legend-text {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
}

.map-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.stats-panel {
  flex-shrink: 0;
  padding: 20rpx 0 0 0;
  width: 100%;
}

.overview-card {
  background: $bg-card;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.overview-row {
  display: flex;
}

.overview-item {
  flex: 1;
  text-align: center;
}

.ov-val {
  font-size: 40rpx;
  font-weight: bold;
  color: $gold-lit;
  display: block;
}

.ov-label {
  font-size: 22rpx;
  color: $text-secondary;
  margin-top: 2rpx;
}

.continent-section {
  background: $bg-card;
  border-radius: 20rpx;
  padding: 16rpx 20rpx;
}

.continent-row {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
  &:last-child { margin-bottom: 0; }
}

.cont-name {
  font-size: 22rpx;
  color: $text-primary;
  width: 100rpx;
  flex-shrink: 0;
}

.cont-bar-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-width: 0;
}

.cont-bar-track {
  flex: 1;
  height: 14rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 7rpx;
  overflow: hidden;
  min-width: 0;
}

.cont-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, $gold-lit, $warm-orange);
  border-radius: 7rpx;
  min-width: 4rpx;
}

.cont-count {
  font-size: 20rpx;
  color: $text-secondary;
  width: 90rpx;
  text-align: right;
  flex-shrink: 0;
}

.city-detail-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.city-detail-card {
  background: #1E2A3A;
  border-radius: 20rpx;
  padding: 40rpx;
  width: 85%;
  max-width: 480px;
}

.detail-name {
  font-size: 36rpx;
  font-weight: bold;
  color: $gold-lit;
  display: block;
  margin-bottom: 16rpx;
}

.detail-info {
  font-size: 28rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 10rpx;
}

.empty-state {
  padding: 24rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 26rpx;
  color: $text-muted;
}

/* no landscape overrides - rpx auto-scales */
</style>

<style>
/* Leaflet 全局样式覆盖 - 深色主题 */
.dark-popup .leaflet-popup-content-wrapper {
  background: #1E2A3A;
  color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.5);
}
.dark-popup .leaflet-popup-tip {
  background: #1E2A3A;
}
.leaflet-control-attribution {
  display: none !important;
}
</style>
