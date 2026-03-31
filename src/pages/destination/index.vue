<template>
  <view class="page-outer">
    <view class="page-inner" :style="scaleStyle">
    <NavBar :title="t('pageDestination')" />
    <!-- 出发城市 -->
    <view class="origin-bar">
      <text class="origin-label">{{ t('from') }}</text>
      <text class="origin-city">{{ originCityDisplay }}</text>
      <text class="origin-label">{{ t('depart') }}</text>
    </view>

    <!-- 候选城市列表 -->
    <view class="candidates">
      <view
        v-for="(city, index) in candidates"
        :key="city.name + city.country"
        class="city-card"
        :class="{ selected: selectedIndex === index }"
        @tap="selectCandidate(index)"
      >
        <view class="card-header">
          <text class="direction-badge">{{ directionLabel(city.direction) }}</text>
          <text class="card-city">{{ cityName(city) }}</text>
          <text class="card-country">{{ countryName(city) }}</text>
        </view>
        <view class="card-body">
          <view class="card-stat">
            <text class="stat-icon">📏</text>
            <text class="stat-text">{{ city.distance }} km</text>
          </view>
          <view class="card-stat">
            <text class="stat-icon">⏱</text>
            <text class="stat-text">{{ formatDurationText(city.estimatedDuration) }}</text>
          </view>
        </view>
        <text class="card-tagline">"{{ cityTagline(city) }}"</text>
      </view>
    </view>

    <!-- 换一批 -->
    <view class="refresh-btn" @tap="refreshCandidates">
      <text class="refresh-icon">🔄</text>
      <text class="refresh-text">{{ t('refreshList') }}</text>
    </view>

    <!-- 搜索半径提示 -->
    <text v-if="expandedRadius > 200" class="radius-hint">
      {{ t('expandedRadius') }} {{ expandedRadius }}km
    </text>

    <!-- 开始按钮 -->
    <view
      class="btn-start"
      :class="{ disabled: selectedIndex < 0 }"
      @tap="startTimer"
    >
      <text class="btn-text">{{ t('go') }}</text>
    </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePageScale } from '@/utils/usePageScale'
import { usePomodoroStore } from '@/stores/pomodoroStore'
import type { CityData, CityCandidate, CurrentCity } from '@/types'
import { getNearbyCities, estimateRoadDistance, calcDuration, getDirection } from '@/utils/distance'
import { formatDurationText } from '@/utils/dateUtils'
import { t, cityName, countryName, cityFullName, useLang } from '@/utils/i18n'
import NavBar from '@/components/NavBar.vue'
import { cityTagline } from '@/utils/cityI18n'
import citiesData from '@/data/cities.json'

const { currentLang } = useLang()
const { scaleStyle } = usePageScale(900)
const store = usePomodoroStore()
const originCity = ref<CurrentCity | null>(null)
const candidates = ref<CityCandidate[]>([])
const selectedIndex = ref(-1)
const expandedRadius = ref(200)

const originCityDisplay = computed(() => {
  const _lang = currentLang.value
  if (!originCity.value) return ''
  const found = (citiesData as any[]).find(
    c => c.name === originCity.value!.name && c.country === originCity.value!.country
  )
  if (found) return cityFullName(found)
  return `${originCity.value.name}, ${originCity.value.country}`
})

onMounted(() => {
  originCity.value = store.currentCity
  refreshCandidates()
})

function refreshCandidates() {
  if (!originCity.value) return
  selectedIndex.value = -1
  expandedRadius.value = 200

  const allCities = citiesData as CityData[]
  let radius = 200
  let nearby: CityCandidate[] = []

  while (nearby.length < 3 && radius <= 1000) {
    nearby = allCities
      .map(city => {
        const dist = estimateRoadDistance(originCity.value!.coord, city.coord)
        const dir = getDirection(originCity.value!.coord, city.coord)
        return { ...city, distance: dist, estimatedDuration: calcDuration(dist), direction: dir }
      })
      .filter(c => c.distance > 20 && c.distance <= radius)
      .filter(c => !(c.name === originCity.value!.name && c.country === originCity.value!.country))

    if (nearby.length < 3) {
      radius += 200
      expandedRadius.value = radius
    }
  }

  // 按方向分组
  const byDir: Record<string, CityCandidate[]> = { E: [], S: [], W: [], N: [] }
  for (const c of nearby) {
    if (c.direction) byDir[c.direction].push(c)
  }

  // 各方向内部 shuffle
  for (const dir of Object.keys(byDir)) {
    shuffle(byDir[dir])
  }

  // 从4个方向中随机选3个
  const dirs = ['E', 'S', 'W', 'N'] as const
  const availableDirs = dirs.filter(d => byDir[d].length > 0)
  shuffle(availableDirs as any)
  const chosenDirs = availableDirs.slice(0, 3)

  // 每个选中方向取1个城市
  let picks: CityCandidate[] = []
  for (const dir of chosenDirs) {
    if (byDir[dir].length > 0) {
      picks.push(byDir[dir][0])
    }
  }

  // 如果不足3个（某些方向没有城市），从剩余城市补充
  if (picks.length < 3) {
    const pickedNames = new Set(picks.map(p => `${p.name}|${p.country}`))
    const remaining = nearby.filter(c => !pickedNames.has(`${c.name}|${c.country}`))
    shuffle(remaining)
    while (picks.length < 3 && remaining.length > 0) {
      picks.push(remaining.shift()!)
    }
  }

  // 最终 shuffle 顺序
  shuffle(picks)
  candidates.value = picks
}

const directionLabels: Record<string, Record<string, string>> = {
  E: { zh: '东', en: 'E', ja: '東', ko: '동' },
  S: { zh: '南', en: 'S', ja: '南', ko: '남' },
  W: { zh: '西', en: 'W', ja: '西', ko: '서' },
  N: { zh: '北', en: 'N', ja: '北', ko: '북' },
}

function directionLabel(dir?: string): string {
  if (!dir) return ''
  const entry = directionLabels[dir]
  if (!entry) return dir
  return entry[currentLang.value] || entry['zh'] || dir
}

function shuffle(arr: any[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

function selectCandidate(index: number) {
  selectedIndex.value = index
}

function startTimer() {
  if (selectedIndex.value < 0) return
  const dest = candidates.value[selectedIndex.value]
  uni.navigateTo({
    url: `/pages/timer/index?destName=${encodeURIComponent(dest.name)}&destCountry=${encodeURIComponent(dest.country)}&destLng=${dest.coord[0]}&destLat=${dest.coord[1]}&distance=${dest.distance}&duration=${dest.estimatedDuration}&destDesc=${encodeURIComponent(dest.description)}&destTagline=${encodeURIComponent(dest.tagline)}`,
  })
}
</script>

<style lang="scss" scoped>
.page-inner {
  padding-left: $page-padding;
  padding-right: $page-padding;
}

.origin-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 16rpx;
  flex-shrink: 0;
}

.origin-label {
  font-size: 28rpx;
  color: $text-secondary;
}

.origin-city {
  font-size: 32rpx;
  font-weight: bold;
  color: $tomato-red;
}

.candidates {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  min-height: 0;
  margin-bottom: 12rpx;
}

.city-card {
  flex: 1;
  background: $bg-card;
  border-radius: 20rpx;
  padding: 24rpx 28rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;

  &.selected {
    border-color: $tomato-red;
    background: rgba(231, 76, 60, 0.12);
  }

  &:active {
    transform: scale(0.98);
  }
}

.card-header {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  margin-bottom: 10rpx;
}

.direction-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: rgba(231, 76, 60, 0.25);
  color: $tomato-red;
  font-size: 22rpx;
  font-weight: bold;
  flex-shrink: 0;
}

.card-city {
  font-size: 36rpx;
  font-weight: bold;
  color: $text-primary;
}

.card-country {
  font-size: 24rpx;
  color: $text-secondary;
}

.card-body {
  display: flex;
  gap: 32rpx;
  margin-bottom: 8rpx;
}

.card-stat {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.stat-icon {
  font-size: 24rpx;
}

.stat-text {
  font-size: 26rpx;
  color: $text-secondary;
}

.card-tagline {
  font-size: 24rpx;
  color: $warm-orange;
  font-style: italic;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 14rpx;
  flex-shrink: 0;

  &:active {
    opacity: 0.7;
  }
}

.refresh-icon {
  font-size: 28rpx;
}

.refresh-text {
  font-size: 28rpx;
  color: $text-secondary;
}

.radius-hint {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: $warm-orange;
  margin-bottom: 12rpx;
  flex-shrink: 0;
}

.btn-start {
  height: 92rpx;
  background: linear-gradient(135deg, $tomato-red, $warm-orange);
  border-radius: 46rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  &.disabled {
    opacity: 0.4;
  }
}

.btn-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #FFFFFF;
}


</style>
