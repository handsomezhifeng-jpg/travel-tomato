<template>
  <view class="timer-page">
    <!-- 顶部安全区 -->
    <view :style="{ height: statusBarHeight + 'px' }" class="status-bar"></view>

    <!-- 上半部分：信息区 -->
    <view class="info-section">
      <!-- 路线进度 -->
      <view class="route-section">
        <view class="route-bar">
          <text class="route-city">{{ originName }}</text>
          <view class="route-line">
            <view class="route-progress" :style="{ width: progressPercent + '%' }"></view>
            <view class="route-dot" :style="{ left: progressPercent + '%' }"></view>
          </view>
          <text class="route-city">{{ destDisplayName }}</text>
        </view>
        <text class="route-km">{{ t('traveled') }} {{ traveledKm }} km</text>
      </view>

      <!-- 计时器 -->
      <view class="timer-section">
        <view class="timer-ring">
          <text class="timer-text">{{ displayTime }}</text>
          <text class="timer-label">{{ isPaused ? t('paused') : t('remainingTime') }}</text>
        </view>
      </view>

      <!-- 里程进度条 -->
      <view class="distance-section">
        <text class="distance-text">{{ traveledKm }} km / {{ totalDistance }} km</text>
        <view class="progress-track">
          <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
        </view>
        <text class="distance-percent">{{ Math.round(progressPercent) }}%</text>
      </view>

      <!-- 控制按钮 -->
      <view class="controls">
        <view class="btn-control" @tap="togglePause">
          <text class="btn-control-icon">{{ isPaused ? '▶' : '⏸' }}</text>
          <text class="btn-control-text">{{ isPaused ? t('resume') : t('pause') }}</text>
        </view>
      </view>
    </view>

    <!-- 下半部分：视频区 -->
    <view class="video-section">
      <video
        id="bgVideo"
        class="video-player"
        :src="videoSrc"
        autoplay
        loop
        muted
        :controls="false"
        object-fit="cover"
        :show-center-play-btn="false"
        :enable-progress-gesture="false"
        :play-strategy="1"
        @error="onVideoError"
      ></video>

      <!-- 放弃按钮 -->
      <view class="abandon-area" @longpress="abandonTrip">
        <text class="abandon-text">{{ t('longPressAbandon') }}</text>
      </view>
    </view>

    <!-- 到达弹框 -->
    <view v-if="showArrival" class="arrival-mask">
      <view class="arrival-modal">
        <!-- 撒花效果 -->
        <view class="confetti">
          <view v-for="i in 20" :key="i" class="confetti-piece" :style="confettiStyle(i)"></view>
        </view>

        <text class="arrival-title">🎉 {{ t('congrats') }}</text>
        <text class="arrival-city">{{ destDisplayName }}, {{ destDisplayCountry }}</text>

        <text class="arrival-desc">{{ destDescDisplay }}</text>

        <view class="arrival-stats">
          <view class="arrival-stat">
            <text class="stat-icon">📏</text>
            <text class="stat-val">{{ totalDistance }} km</text>
          </view>
          <view class="arrival-stat">
            <text class="stat-icon">⏱</text>
            <text class="stat-val">{{ formatDurationText(totalDuration) }}</text>
          </view>
        </view>

        <view class="note-section">
          <text class="note-label">{{ t('recordTime') }}</text>
          <textarea
            class="note-input"
            v-model="noteText"
            :placeholder="t('notePlaceholder')"
            placeholder-class="note-placeholder"
            :maxlength="500"
            :auto-height="true"
          />
        </view>

        <view class="btn-confirm" @tap="confirmArrival">
          <text class="btn-text">{{ noteText ? t('saveFinish') : t('skipFinish') }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { usePomodoroStore } from '@/stores/pomodoroStore'
import { formatDuration, formatDurationText, formatDate, formatTime, uuid } from '@/utils/dateUtils'
import { t, cityName, countryName, cityFullName } from '@/utils/i18n'
import { cityDescription } from '@/utils/cityI18n'
import type { PomodoroRecord } from '@/types'
import citiesData from '@/data/cities.json'

const store = usePomodoroStore()

// 页面参数
const destName = ref('')
const destCountry = ref('')
const destCoord = ref<[number, number]>([0, 0])
const totalDistance = ref(0)
const totalDuration = ref(0)
const destDesc = ref('')
const destTagline = ref('')

// 状态
const statusBarHeight = ref(0)
const remainingSeconds = ref(0)
const isPaused = ref(false)
const showArrival = ref(false)
const noteText = ref('')
const startTimeStr = ref('')
const videoSrc = ref('/static/kaiche.mp4')

let timerId: ReturnType<typeof setInterval> | null = null

const originNameRaw = computed(() => store.currentCity?.name || '')
const originCountry = computed(() => store.currentCity?.country || '')
const originName = computed(() => {
  const found = (citiesData as any[]).find(c => c.name === originNameRaw.value && c.country === originCountry.value)
  return found ? cityName(found) : originNameRaw.value
})
const destDisplayName = computed(() => {
  const found = (citiesData as any[]).find(c => c.name === destName.value && c.country === destCountry.value)
  return found ? cityName(found) : destName.value
})
const destDisplayCountry = computed(() => {
  const found = (citiesData as any[]).find(c => c.name === destName.value && c.country === destCountry.value)
  return found ? countryName(found) : destCountry.value
})
const destDescDisplay = computed(() => {
  const found = (citiesData as any[]).find(c => c.name === destName.value && c.country === destCountry.value)
  if (found) return cityDescription(found)
  return destDesc.value
})

const traveledKm = computed(() => {
  const elapsed = totalDuration.value - remainingSeconds.value
  return Math.min(Math.round(elapsed / 12), totalDistance.value)
})

const progressPercent = computed(() => {
  if (totalDuration.value <= 0) return 0
  return Math.min(((totalDuration.value - remainingSeconds.value) / totalDuration.value) * 100, 100)
})

const displayTime = computed(() => formatDuration(remainingSeconds.value))

onLoad((query: any) => {
  destName.value = decodeURIComponent(query.destName || '')
  destCountry.value = decodeURIComponent(query.destCountry || '')
  destCoord.value = [parseFloat(query.destLng), parseFloat(query.destLat)]
  totalDistance.value = parseInt(query.distance) || 0
  totalDuration.value = parseInt(query.duration) || 0
  destDesc.value = decodeURIComponent(query.destDesc || '')
  destTagline.value = decodeURIComponent(query.destTagline || '')
})

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 0

  // 1秒后开始计时
  remainingSeconds.value = totalDuration.value
  const now = new Date()
  startTimeStr.value = formatTime(now)

  setTimeout(() => {
    startTimer()
  }, 1000)
})

onUnmounted(() => {
  stopTimer()
})

function startTimer() {
  timerId = setInterval(() => {
    if (!isPaused.value) {
      remainingSeconds.value--
      if (remainingSeconds.value <= 0) {
        remainingSeconds.value = 0
        stopTimer()
        onArrival()
      }
    }
  }, 1000)
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

function togglePause() {
  isPaused.value = !isPaused.value
}

function onArrival() {
  showArrival.value = true
}

function confirmArrival() {
  const now = new Date()
  const record: PomodoroRecord = {
    id: uuid(),
    date: formatDate(now),
    startTime: startTimeStr.value,
    endTime: formatTime(now),
    originCity: originName.value,
    originCountry: originCountry.value,
    originCoord: store.currentCity!.coord,
    destCity: destName.value,
    destCountry: destCountry.value,
    destCoord: destCoord.value,
    distance: totalDistance.value,
    duration: totalDuration.value,
    note: noteText.value,
    completed: true,
  }
  store.completePomodoro(record)

  // 返回首页
  uni.navigateBack({ delta: 99 })
}

function abandonTrip() {
  uni.showModal({
    title: t('abandonTitle'),
    content: t('abandonConfirm'),
    success(res) {
      if (res.confirm) {
        stopTimer()
        uni.navigateBack()
      }
    },
  })
}

function onVideoError() {
  console.warn('视频加载失败')
}

function confettiStyle(i: number) {
  const colors = ['#E74C3C', '#F39C12', '#2ECC71', '#3498DB', '#9B59B6', '#FFD700']
  const color = colors[i % colors.length]
  const left = Math.random() * 100
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 2
  return {
    left: left + '%',
    background: color,
    animationDelay: delay + 's',
    animationDuration: duration + 's',
  }
}
</script>

<style lang="scss" scoped>
.timer-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-dark;
  overflow: hidden;
}

.status-bar {
  background: $bg-dark;
  flex-shrink: 0;
}

.info-section {
  flex-shrink: 0;
  padding: 0 $page-padding;
  background: $bg-dark;
}

.video-section {
  flex: 1;
  position: relative;
  min-height: 0;
  border-radius: 32rpx 32rpx 0 0;
  overflow: hidden;
  margin: 0 16rpx;
}

.video-player {
  width: 100%;
  height: 100%;
  display: block;
}

/* ===== 路线 ===== */
.route-section {
  padding: 24rpx 0;
  text-align: center;
}

.route-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.route-city {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
  max-width: 160rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-line {
  flex: 1;
  height: 4rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2rpx;
  position: relative;
}

.route-progress {
  height: 100%;
  background: $tomato-red;
  border-radius: 2rpx;
  transition: width 1s linear;
}

.route-dot {
  position: absolute;
  top: 50%;
  width: 16rpx;
  height: 16rpx;
  background: #FFF;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 12rpx rgba(231, 76, 60, 0.8);
  transition: left 1s linear;
}

.route-km {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 12rpx;
  display: block;
  text-align: center;
}

/* ===== 计时器 ===== */
.timer-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx 0;
}

.timer-ring {
  width: 360rpx;
  height: 360rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  border: 4rpx solid rgba(231, 76, 60, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer-text {
  font-size: 96rpx;
  font-weight: bold;
  color: #FFFFFF;
  font-family: 'JetBrains Mono', 'Roboto Mono', 'Courier New', monospace;
  letter-spacing: 4rpx;
}

.timer-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8rpx;
}

/* ===== 里程 ===== */
.distance-section {
  padding: 24rpx 0;
  text-align: center;
}

.distance-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 12rpx;
}

.progress-track {
  height: 12rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $tomato-red, $warm-orange);
  border-radius: 6rpx;
  transition: width 1s linear;
}

.distance-percent {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8rpx;
  display: block;
}

/* ===== 控制 ===== */
.controls {
  display: flex;
  justify-content: center;
  padding: 24rpx 0;
}

.btn-control {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 48rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 40rpx;

  &:active {
    background: rgba(255, 255, 255, 0.25);
  }
}

.btn-control-icon {
  font-size: 28rpx;
  color: #FFFFFF;
}

.btn-control-text {
  font-size: 28rpx;
  color: #FFFFFF;
}

.abandon-area {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 24rpx 0;
  padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
  background: linear-gradient(transparent, rgba(0,0,0,0.5));
}

.abandon-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.4);
}

/* ===== 到达弹框 ===== */
.arrival-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
  display: flex;
  align-items: flex-end;
}

.arrival-modal {
  width: 100%;
  max-height: 85vh;
  background: #1E2A3A;
  border-radius: 40rpx 40rpx 0 0;
  padding: 48rpx $page-padding;
  padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.arrival-title {
  font-size: 32rpx;
  color: $text-secondary;
  display: block;
  text-align: center;
}

.arrival-city {
  font-size: 44rpx;
  font-weight: bold;
  color: #FFFFFF;
  display: block;
  text-align: center;
  margin: 12rpx 0 24rpx;
}

.arrival-desc {
  font-size: 26rpx;
  color: $text-secondary;
  line-height: 1.6;
  display: block;
  margin-bottom: 24rpx;
}

.arrival-stats {
  display: flex;
  justify-content: center;
  gap: 48rpx;
  margin-bottom: 32rpx;
}

.arrival-stat {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.stat-val {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: bold;
}

.note-section {
  margin-bottom: 32rpx;
}

.note-label {
  font-size: 26rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 12rpx;
}

.note-input {
  width: 100%;
  min-height: 120rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: $text-primary;
  box-sizing: border-box;
}

.note-placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.btn-confirm {
  height: $btn-height;
  background: linear-gradient(135deg, $success-green, #27ae60);
  border-radius: $btn-radius;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.85;
  }
}

.btn-text {
  font-size: 30rpx;
  font-weight: bold;
  color: #FFFFFF;
}

/* ===== 撒花 ===== */
.confetti {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  top: -20rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: 2rpx;
  animation: confettiFall 3s ease-out forwards;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(600rpx) rotate(720deg);
    opacity: 0;
  }
}
</style>
