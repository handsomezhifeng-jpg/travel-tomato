<template>
  <view class="page">
    <NavBar :title="t('pageTravelMap')" />
    <!-- 地图区域 -->
    <view class="map-section">
      <map
        id="travelMap"
        class="map"
        :latitude="mapCenter.lat"
        :longitude="mapCenter.lng"
        :scale="mapScale"
        :markers="markers"
        :polyline="polyline"
        :show-location="false"
        @markertap="onMarkerTap"
      ></map>
    </view>

    <!-- 统计面板 -->
    <scroll-view scroll-y class="stats-panel">
      <!-- 总览 -->
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

      <!-- 大洲进度 -->
      <view class="continent-section">
        <text class="section-title">{{ t('continentProgress') }}</text>
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

      <!-- 最近点亮 -->
      <view v-if="visitedCities.length > 0" class="recent-section">
        <text class="section-title">{{ t('recentLit') }}</text>
        <view v-for="city in recentVisited" :key="city.name + city.country" class="visited-item">
          <text class="visited-city">{{ displayCity(city) }}</text>
          <text class="visited-date">{{ city.firstVisit }}</text>
        </view>
      </view>

      <view v-else class="empty-state">
        <text class="empty-text">{{ t('emptyMap') }}</text>
      </view>
    </scroll-view>

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
import { ref, computed, onMounted } from 'vue'
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

const mapCenter = ref({ lng: 105, lat: 35 })
const mapScale = ref(3)

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

const markers = computed(() => {
  const store = storage.getCurrentCity()
  const result: any[] = []

  visitedCities.value.forEach((city, i) => {
    result.push({
      id: i + 1,
      latitude: city.coord[1],
      longitude: city.coord[0],
      width: 20,
      height: 20,
      iconPath: '/static/marker-gold.png',
      callout: {
        content: displayCity(city),
        color: '#FFD700',
        bgColor: '#1A1A2E',
        borderRadius: 8,
        padding: 6,
        fontSize: 12,
        display: 'BYCLICK',
      },
    })
  })

  if (store) {
    const storeDisplay = displayCity(store)
    result.push({
      id: 0,
      latitude: store.coord[1],
      longitude: store.coord[0],
      width: 28,
      height: 28,
      iconPath: '/static/marker-red.png',
      callout: {
        content: `📍 ${storeDisplay}`,
        color: '#E74C3C',
        bgColor: '#1A1A2E',
        borderRadius: 8,
        padding: 6,
        fontSize: 13,
        display: 'ALWAYS',
      },
    })
  }

  return result
})

const polyline = computed(() => {
  const records = storage.getAllRecords().filter(r => r.completed)
  if (records.length === 0) return []

  const points = []
  for (const r of records) {
    if (points.length === 0) {
      points.push({ latitude: r.originCoord[1], longitude: r.originCoord[0] })
    }
    points.push({ latitude: r.destCoord[1], longitude: r.destCoord[0] })
  }

  return [{
    points,
    color: '#E74C3C80',
    width: 3,
    dottedLine: true,
  }]
})

function onMarkerTap(e: any) {
  const id = e.detail?.markerId ?? e.markerId
  if (id > 0 && id <= visitedCities.value.length) {
    selectedMarkerCity.value = visitedCities.value[id - 1]
  }
}

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

  if (visitedCities.value.length > 0) {
    const lngs = visitedCities.value.map(c => c.coord[0])
    const lats = visitedCities.value.map(c => c.coord[1])
    mapCenter.value = {
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    }
  }
})
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-dark;
}

.map-section {
  height: 45vh;
  flex-shrink: 0;
}

.map {
  width: 100%;
  height: 100%;
}

.stats-panel {
  flex: 1;
  padding: 36rpx $page-padding;
  padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
}

/* ===== 总览 ===== */
.overview-card {
  background: $bg-card;
  border-radius: $card-radius;
  padding: 36rpx;
  margin-bottom: 32rpx;
}

.overview-row {
  display: flex;
}

.overview-item {
  flex: 1;
  text-align: center;
}

.ov-val {
  font-size: 48rpx;
  font-weight: bold;
  color: $gold-lit;
  display: block;
}

.ov-label {
  font-size: 26rpx;
  color: $text-secondary;
  margin-top: 4rpx;
}

/* ===== 大洲进度 ===== */
.continent-section {
  margin-bottom: 32rpx;
  background: $bg-card;
  border-radius: $card-radius;
  padding: 32rpx;
}

.section-title {
  font-size: 30rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 24rpx;
}

.continent-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.cont-name {
  font-size: 28rpx;
  color: $text-primary;
  width: 120rpx;
  flex-shrink: 0;
}

.cont-bar-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
  min-width: 0;
}

.cont-bar-track {
  flex: 1;
  height: 20rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10rpx;
  overflow: hidden;
  min-width: 0;
}

.cont-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, $gold-lit, $warm-orange);
  border-radius: 10rpx;
  min-width: 4rpx;
}

.cont-count {
  font-size: 26rpx;
  color: $text-secondary;
  width: 90rpx;
  text-align: right;
  flex-shrink: 0;
}

/* ===== 最近点亮 ===== */
.recent-section {
  margin-bottom: 32rpx;
}

.visited-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 28rpx;
  background: $bg-card;
  border-radius: 20rpx;
  margin-bottom: 16rpx;
}

.visited-city {
  font-size: 30rpx;
  color: $text-primary;
  flex: 1;
  margin-right: 16rpx;
}

.visited-date {
  font-size: 26rpx;
  color: $text-secondary;
  flex-shrink: 0;
}

/* ===== 城市详情浮层 ===== */
.city-detail-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.city-detail-card {
  background: #1E2A3A;
  border-radius: $card-radius;
  padding: 48rpx;
  width: 85%;
}

.detail-name {
  font-size: 40rpx;
  font-weight: bold;
  color: $gold-lit;
  display: block;
  margin-bottom: 20rpx;
}

.detail-info {
  font-size: 30rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 12rpx;
}

.empty-state {
  padding: 100rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 32rpx;
  color: $text-muted;
}
</style>
