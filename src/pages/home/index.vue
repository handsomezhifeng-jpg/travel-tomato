<template>
  <view class="page">
    <!-- 顶部安全区（刘海屏适配） -->
    <view :style="{ height: topSafeHeight + 'px' }"></view>

    <!-- 标题栏 -->
    <view class="header">
      <text class="title">{{ t('appTitle') }}</text>
      <LangSelector />
    </view>

    <!-- 首次使用：选择出发点 -->
    <view v-if="isFirstUse" class="first-use">
      <!-- 定位中 -->
      <view v-if="locating" class="section-card locating-card">
        <text class="locating-icon">📍</text>
        <text class="locating-text">{{ t('locating') }}</text>
      </view>

      <view v-else class="section-card">
        <text class="card-title">{{ t('selectOrigin') }}</text>
        <text class="card-desc">{{ t('startJourney') }}</text>

        <!-- 定位到的城市 -->
        <view v-if="locatedCity && !showResults" class="located-city">
          <text class="located-label">📍 {{ t('locatedCity') }}</text>
          <text class="located-name">{{ cityFullName(locatedCity) }}</text>
          <view class="located-actions">
            <view class="btn-primary" @tap="confirmLocatedCity">
              <text class="btn-text">{{ t('useThisCity') }}</text>
            </view>
            <view class="btn-secondary" @tap="showManualSearch">
              <text class="btn-secondary-text">{{ t('chooseOther') }}</text>
            </view>
          </view>
        </view>

        <!-- 手动搜索（定位失败或用户选择其他城市） -->
        <view v-if="!locatedCity || showManual">
          <!-- 搜索框 -->
          <view class="search-box">
            <input
              class="search-input"
              v-model="searchText"
              :placeholder="t('searchCity')"
              placeholder-class="search-placeholder"
              @input="onSearchInput"
            />
          </view>

          <!-- 搜索结果 -->
          <scroll-view v-if="showResults && searchResults.length > 0" scroll-y class="search-results">
            <view
              v-for="city in searchResults"
              :key="city.name + city.country"
              class="search-item"
              :class="{ active: selectedCity?.name === city.name && selectedCity?.country === city.country }"
              @tap="selectCity(city)"
            >
              <text class="city-name">{{ cityName(city) }}</text>
              <text class="city-country">{{ countryName(city) }}</text>
            </view>
          </scroll-view>

          <!-- 无结果提示 -->
          <view v-if="searchText.trim() && searchResults.length === 0 && showResults" class="no-result">
            <text class="no-result-text">{{ t('noMatch') }}</text>
          </view>

          <!-- 已选城市 -->
          <view v-if="selectedCity" class="selected-city">
            <text class="selected-label">{{ t('origin') }}</text>
            <text class="selected-name">{{ cityFullName(selectedCity) }}</text>
          </view>

          <!-- 确认按钮 -->
          <view
            class="btn-primary"
            :class="{ disabled: !selectedCity }"
            @tap="confirmOrigin"
          >
            <text class="btn-text">{{ t('confirmOrigin') }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 继续旅行：主界面 -->
    <view v-else class="continue-travel">
      <!-- 当前位置卡片 -->
      <view class="location-card">
        <view class="location-icon-wrap">
          <text class="location-icon">📍</text>
        </view>
        <view class="location-info">
          <text class="location-label">{{ t('youAreAt') }}</text>
          <text class="location-city">{{ currentCityDisplay }}</text>
        </view>
      </view>

      <!-- 统计卡片 -->
      <view class="stats-row">
        <view class="stat-card">
          <text class="stat-value">{{ stats.totalRecords }}</text>
          <text class="stat-label">{{ t('pomodoro') }}</text>
        </view>
        <view class="stat-card">
          <text class="stat-value">{{ formatKm(stats.totalDistance) }}</text>
          <text class="stat-label">{{ t('totalDistance') }}</text>
        </view>
        <view class="stat-card">
          <text class="stat-value">{{ stats.totalCities }}</text>
          <text class="stat-label">{{ t('cities') }}</text>
        </view>
      </view>

      <!-- 继续旅行按钮 -->
      <view class="btn-primary btn-travel" @tap="goDestination">
        <text class="btn-text">{{ t('continueTravel') }}</text>
      </view>

      <!-- 最近旅程 -->
      <view v-if="recentTrips.length > 0" class="recent-section">
        <text class="section-title">{{ t('recentTrips') }}</text>
        <scroll-view scroll-x class="recent-list">
          <view v-for="r in recentTrips" :key="r.id" class="recent-item">
            <text class="recent-route">{{ translateCity(r.originCity, r.originCountry) }} → {{ translateCity(r.destCity, r.destCountry) }}</text>
            <text class="recent-dist">{{ r.distance }}km</text>
          </view>
        </scroll-view>
      </view>

      <!-- 底部导航 -->
      <view class="bottom-nav">
        <view class="nav-item" @tap="goCalendar">
          <text class="nav-icon">📅</text>
          <text class="nav-label">{{ t('calendar') }}</text>
        </view>
        <view class="nav-item" @tap="goTravelMap">
          <text class="nav-icon">🗺</text>
          <text class="nav-label">{{ t('map') }}</text>
        </view>
        <view class="nav-item" @tap="resetOrigin">
          <text class="nav-icon">🔄</text>
          <text class="nav-label">{{ t('reset') }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { usePomodoroStore } from '@/stores/pomodoroStore'
import type { CityData, CurrentCity } from '@/types'
import citiesData from '@/data/cities.json'
import { getDistance } from '@/utils/distance'
import { t, cityName, countryName, cityFullName, useLang } from '@/utils/i18n'
import LangSelector from '@/components/LangSelector.vue'

const store = usePomodoroStore()
const topSafeHeight = ref(0)
const searchText = ref('')
const searchResults = ref<CityData[]>([])
const selectedCity = ref<CityData | null>(null)
const showResults = ref(false)
const locating = ref(false)
const locatedCity = ref<CityData | null>(null)
const showManual = ref(false)

const { currentLang } = useLang()
const isFirstUse = computed(() => store.isFirstUse)
const stats = computed(() => store.totalStats)
const recentTrips = computed(() => [...store.recentRecords].reverse().slice(0, 10))

const currentCityDisplay = computed(() => {
  // 引用 currentLang 确保语言切换时重新计算
  const _lang = currentLang.value
  if (!store.currentCity) return ''
  const found = (citiesData as any[]).find(
    c => c.name === store.currentCity!.name && c.country === store.currentCity!.country
  )
  if (found) return cityFullName(found)
  return `${store.currentCity!.name}, ${store.currentCity!.country}`
})

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  topSafeHeight.value = (sysInfo.statusBarHeight || 20) + 10

  // 首次使用时尝试定位
  if (store.isFirstUse) {
    tryAutoLocate()
  }
})

onShow(() => {
  store.initialize()
})

/** 尝试通过 GPS 定位获取最近城市 */
function tryAutoLocate() {
  locating.value = true

  // #ifdef APP-PLUS
  // App 端：先检查定位权限，没有则请求
  checkAndRequestLocationPermission(() => {
    doGetLocation()
  }, () => {
    locating.value = false
    showManual.value = true
  })
  // #endif

  // #ifdef H5
  // H5 端：浏览器会自动弹出授权
  doGetLocation()
  // #endif

  // #ifdef MP
  // 小程序端：先检查授权
  uni.getSetting({
    success(res) {
      if (res.authSetting['scope.userLocation']) {
        doGetLocation()
      } else {
        uni.authorize({
          scope: 'scope.userLocation',
          success() { doGetLocation() },
          fail() {
            locating.value = false
            showManual.value = true
          },
        })
      }
    },
    fail() { doGetLocation() },
  })
  // #endif
}

/** 实际获取定位 */
function doGetLocation() {
  uni.getLocation({
    type: 'wgs84',
    timeout: 10,
    highAccuracyExpireTime: 8000,
    success(res) {
      const userCoord: [number, number] = [res.longitude, res.latitude]
      const nearest = findNearestCity(userCoord)
      if (nearest) {
        locatedCity.value = nearest
      } else {
        showManual.value = true
      }
      locating.value = false
    },
    fail(err) {
      console.warn('定位失败:', err)
      locating.value = false

      // 如果是权限被拒，引导用户打开设置
      if (err.errMsg && (err.errMsg.includes('deny') || err.errMsg.includes('auth'))) {
        uni.showModal({
          title: t('locationDeniedTitle'),
          content: t('locationDeniedMsg'),
          confirmText: t('goSettings'),
          cancelText: t('manualSelect'),
          success(modalRes) {
            if (modalRes.confirm) {
              // #ifdef APP-PLUS
              plus.runtime.openURL('app-settings:')
              // #endif
            }
            showManual.value = true
          },
        })
      } else {
        showManual.value = true
      }
    },
  })
}

/** App 端检查并请求定位权限 */
function checkAndRequestLocationPermission(onGranted: () => void, onDenied: () => void) {
  // #ifdef APP-PLUS
  const system = uni.getSystemInfoSync()
  if (system.platform === 'android') {
    // Android: 通过 plus.android 请求权限
    plus.android.requestPermissions(
      ['android.permission.ACCESS_FINE_LOCATION', 'android.permission.ACCESS_COARSE_LOCATION'],
      (e: any) => {
        if (e.granted && e.granted.length > 0) {
          onGranted()
        } else {
          onDenied()
        }
      },
      (e: any) => {
        onDenied()
      }
    )
  } else {
    // iOS: uni.getLocation 会自动触发系统授权弹窗
    onGranted()
  }
  // #endif
}

/** 从城市数据库中找到离坐标最近的城市 */
function findNearestCity(coord: [number, number]): CityData | null {
  let minDist = Infinity
  let nearest: CityData | null = null

  for (const city of (citiesData as CityData[])) {
    const dist = getDistance(coord, city.coord)
    if (dist < minDist) {
      minDist = dist
      nearest = city
    }
  }
  return nearest
}

/** 使用定位到的城市 */
function confirmLocatedCity() {
  if (!locatedCity.value) return
  const city: CurrentCity = {
    name: locatedCity.value.name,
    country: locatedCity.value.country,
    coord: locatedCity.value.coord,
    arrivedAt: new Date().toISOString(),
  }
  store.setOriginCity(city)
}

/** 显示手动搜索 */
function showManualSearch() {
  showManual.value = true
}

function onSearchInput() {
  const q = searchText.value.trim().toLowerCase()
  if (!q) {
    searchResults.value = []
    showResults.value = false
    selectedCity.value = null
    return
  }
  showResults.value = true
  searchResults.value = (citiesData as any[])
    .filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      (c.nameZh && c.nameZh.includes(searchText.value.trim())) ||
      (c.countryZh && c.countryZh.includes(searchText.value.trim()))
    )
    .slice(0, 20)

  // 如果精确匹配到唯一结果，自动选中
  const exact = searchResults.value.filter(c =>
    c.name.toLowerCase() === q || (c as any).nameZh === searchText.value.trim()
  )
  if (exact.length === 1) {
    selectedCity.value = exact[0]
  } else {
    selectedCity.value = null
  }
}

function selectCity(city: CityData) {
  selectedCity.value = city
  showResults.value = false
  searchText.value = city.name
}

function confirmOrigin() {
  if (!selectedCity.value) return
  const city: CurrentCity = {
    name: selectedCity.value.name,
    country: selectedCity.value.country,
    coord: selectedCity.value.coord,
    arrivedAt: new Date().toISOString(),
  }
  store.setOriginCity(city)
}

function goDestination() {
  uni.navigateTo({ url: '/pages/destination/index' })
}

function goCalendar() {
  uni.navigateTo({ url: '/pages/calendar/index' })
}

function goTravelMap() {
  uni.navigateTo({ url: '/pages/travel-map/index' })
}

function resetOrigin() {
  uni.showModal({
    title: t('resetTitle'),
    content: t('resetConfirm'),
    success(res) {
      if (res.confirm) {
        uni.removeStorageSync('current_city')
        store.initialize()
        selectedCity.value = null
        searchText.value = ''
      }
    },
  })
}

function translateCity(name: string, country: string): string {
  const found = (citiesData as any[]).find(c => c.name === name && c.country === country)
  return found ? cityName(found) : name
}

function formatKm(km: number): string {
  if (km >= 10000) return (km / 1000).toFixed(1) + 'k'
  return km.toLocaleString()
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-dark;
  padding: 0 $page-padding;
  padding-bottom: env(safe-area-inset-bottom);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
}

.title {
  font-size: 44rpx;
  font-weight: bold;
  color: $text-primary;
}

/* ===== 首次使用 ===== */
.first-use {
  padding-top: 48rpx;
}

.section-card {
  background: $bg-card;
  border-radius: $card-radius;
  padding: 48rpx;
}

/* ===== 定位中 ===== */
.locating-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 48rpx;
}

.locating-icon {
  font-size: 64rpx;
  margin-bottom: 24rpx;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}

.locating-text {
  font-size: 32rpx;
  color: $text-secondary;
}

/* ===== 定位到的城市 ===== */
.located-city {
  text-align: center;
  padding: 20rpx 0;
}

.located-label {
  font-size: 28rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 12rpx;
}

.located-name {
  font-size: 44rpx;
  font-weight: bold;
  color: $tomato-red;
  display: block;
  margin-bottom: 32rpx;
}

.located-actions {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.btn-secondary {
  height: 88rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    background: rgba(255, 255, 255, 0.05);
  }
}

.btn-secondary-text {
  font-size: 30rpx;
  color: $text-secondary;
}

.card-title {
  font-size: 40rpx;
  font-weight: bold;
  color: $text-primary;
  display: block;
  margin-bottom: 12rpx;
}

.card-desc {
  font-size: 30rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 40rpx;
}

.search-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 0 28rpx;
  margin-bottom: 20rpx;
}

.search-input {
  height: 96rpx;
  font-size: 32rpx;
  color: $text-primary;
}

.search-placeholder {
  color: $text-muted;
}

.search-results {
  max-height: 480rpx;
  margin-bottom: 20rpx;
}

.search-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 20rpx;
  border-bottom: 1rpx solid $border-subtle;

  &.active {
    background: $bg-card-active;
  }
}

.city-name {
  font-size: 34rpx;
  color: $text-primary;
}

.city-country {
  font-size: 28rpx;
  color: $text-secondary;
}

.no-result {
  padding: 32rpx;
  text-align: center;
}

.no-result-text {
  font-size: 30rpx;
  color: $text-muted;
}

.selected-city {
  background: rgba(231, 76, 60, 0.15);
  border: 1rpx solid rgba(231, 76, 60, 0.3);
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 28rpx;
  text-align: center;
}

.selected-label {
  font-size: 28rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 8rpx;
}

.selected-name {
  font-size: 38rpx;
  font-weight: bold;
  color: $tomato-red;
}

/* ===== 继续旅行 ===== */
.continue-travel {
  padding-top: 24rpx;
}

.location-card {
  display: flex;
  align-items: center;
  background: $bg-card;
  border-radius: $card-radius;
  padding: 40rpx;
  margin-bottom: 28rpx;
}

.location-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: rgba(231, 76, 60, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
}

.location-icon {
  font-size: 44rpx;
}

.location-label {
  font-size: 28rpx;
  color: $text-secondary;
  display: block;
}

.location-city {
  font-size: 38rpx;
  font-weight: bold;
  color: $text-primary;
}

.stats-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 36rpx;
}

.stat-card {
  flex: 1;
  background: $bg-card;
  border-radius: $card-radius;
  padding: 32rpx;
  text-align: center;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: $text-primary;
  display: block;
}

.stat-label {
  font-size: 26rpx;
  color: $text-secondary;
  margin-top: 8rpx;
}

/* ===== 按钮 ===== */
.btn-primary {
  height: 108rpx;
  background: linear-gradient(135deg, $tomato-red, $warm-orange);
  border-radius: 54rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 36rpx;

  &:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  &.disabled {
    opacity: 0.4;
  }
}

.btn-text {
  font-size: 34rpx;
  font-weight: bold;
  color: #FFFFFF;
}

/* ===== 最近旅程 ===== */
.recent-section {
  margin-bottom: 36rpx;
}

.section-title {
  font-size: 32rpx;
  color: $text-secondary;
  margin-bottom: 20rpx;
  display: block;
}

.recent-list {
  white-space: nowrap;
}

.recent-item {
  display: inline-flex;
  flex-direction: column;
  background: $bg-card;
  border-radius: 20rpx;
  padding: 24rpx 28rpx;
  margin-right: 20rpx;
}

.recent-route {
  font-size: 30rpx;
  color: $text-primary;
}

.recent-dist {
  font-size: 26rpx;
  color: $text-secondary;
  margin-top: 6rpx;
}

/* ===== 底部导航 ===== */
.bottom-nav {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  padding: 36rpx 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 40rpx;
  background: $bg-card;
  border-radius: $card-radius;

  &:active {
    background: $bg-card-active;
  }
}

.nav-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.nav-label {
  font-size: 26rpx;
  color: $text-secondary;
}
</style>
