<template>
  <view class="page">
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePomodoroStore } from '@/stores/pomodoroStore'
import type { CityData, CityCandidate, CurrentCity } from '@/types'
import { getNearbyCities, estimateRoadDistance, calcDuration } from '@/utils/distance'
import { formatDurationText } from '@/utils/dateUtils'
import { t, cityName, countryName, cityFullName, useLang } from '@/utils/i18n'
import NavBar from '@/components/NavBar.vue'
import { cityTagline } from '@/utils/cityI18n'
import citiesData from '@/data/cities.json'

const { currentLang } = useLang()
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
  const originCountry = originCity.value!.country
  let radius = 200
  let nearby: CityCandidate[] = []

  while (nearby.length < 3 && radius <= 1000) {
    nearby = allCities
      .map(city => {
        const dist = estimateRoadDistance(originCity.value!.coord, city.coord)
        return { ...city, distance: dist, estimatedDuration: calcDuration(dist) }
      })
      .filter(c => c.distance > 20 && c.distance <= radius)
      .filter(c => !(c.name === originCity.value!.name && c.country === originCity.value!.country))

    if (nearby.length < 3) {
      radius += 200
      expandedRadius.value = radius
    }
  }

  // 分为本国城市和跨国城市
  const domestic = nearby.filter(c => c.country === originCountry)
  const foreign = nearby.filter(c => c.country !== originCountry)

  // Shuffle 两组
  shuffle(domestic)
  shuffle(foreign)

  // 组合3个候选：如果有跨国城市，保证至少1个
  let picks: CityCandidate[] = []
  if (foreign.length > 0 && domestic.length >= 2) {
    picks = [...domestic.slice(0, 2), foreign[0]]
  } else if (foreign.length >= 2 && domestic.length >= 1) {
    picks = [domestic[0], ...foreign.slice(0, 2)]
  } else {
    // 没有跨国城市或本国城市不够，直接混合取3个
    const all = [...nearby]
    shuffle(all)
    picks = all.slice(0, 3)
  }

  // 最终再 shuffle 一次顺序
  shuffle(picks)
  candidates.value = picks
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
.page {
  min-height: 100vh;
  background: $bg-dark;
  padding: $page-padding;
  padding-bottom: calc(env(safe-area-inset-bottom) + 32rpx);
}

.origin-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 28rpx;
  margin-bottom: 36rpx;
}

.origin-label {
  font-size: 32rpx;
  color: $text-secondary;
}

.origin-city {
  font-size: 36rpx;
  font-weight: bold;
  color: $tomato-red;
}

.candidates {
  margin-bottom: 28rpx;
}

.city-card {
  background: $bg-card;
  border-radius: $card-radius;
  padding: 40rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s;

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
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.card-city {
  font-size: 42rpx;
  font-weight: bold;
  color: $text-primary;
}

.card-country {
  font-size: 28rpx;
  color: $text-secondary;
}

.card-body {
  display: flex;
  gap: 40rpx;
  margin-bottom: 16rpx;
}

.card-stat {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.stat-icon {
  font-size: 28rpx;
}

.stat-text {
  font-size: 30rpx;
  color: $text-secondary;
}

.card-tagline {
  font-size: 28rpx;
  color: $warm-orange;
  font-style: italic;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;

  &:active {
    opacity: 0.7;
  }
}

.refresh-icon {
  font-size: 32rpx;
}

.refresh-text {
  font-size: 32rpx;
  color: $text-secondary;
}

.radius-hint {
  display: block;
  text-align: center;
  font-size: 28rpx;
  color: $warm-orange;
  margin-bottom: 28rpx;
}

.btn-start {
  height: 108rpx;
  background: linear-gradient(135deg, $tomato-red, $warm-orange);
  border-radius: 54rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  &.disabled {
    opacity: 0.4;
  }
}

.btn-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
}
</style>
