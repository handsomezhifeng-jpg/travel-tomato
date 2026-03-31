<template>
  <view class="page-outer">
    <view class="page-inner timer-inner" :style="scaleStyle">
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
        <view class="btn-control btn-stop" @tap="abandonTrip">
          <text class="btn-control-icon">⏹</text>
          <text class="btn-control-text">{{ t('endTrip') }}</text>
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
    </view>

    </view>
    <!-- 到达弹框 (outside scale wrapper for position:fixed) -->
    <view v-if="showArrival" class="arrival-mask">
      <view class="arrival-modal">
        <!-- 撒花效果 -->
        <view class="confetti">
          <view v-for="i in 20" :key="i" class="confetti-piece" :style="confettiStyle(i)"></view>
        </view>

        <text class="arrival-title">🎉 {{ t('congrats') }}</text>
        <text class="arrival-city">{{ destDisplayName }}, {{ destDisplayCountry }}</text>

        <text class="arrival-desc">{{ destDescDisplay }}</text>

        <!-- 获得特产 -->
        <view v-if="specialty" class="specialty-reward">
          <text class="specialty-icon">{{ specialty.icon }}</text>
          <view class="specialty-info">
            <text class="specialty-label">{{ t('gotSpecialty') }}</text>
            <text class="specialty-name">{{ specialtyDisplayName }}</text>
            <text class="specialty-desc">{{ specialtyDisplayDesc }}</text>
          </view>
        </view>

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
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import { usePomodoroStore } from '@/stores/pomodoroStore'
import { usePageScale } from '@/utils/usePageScale'
import { formatDuration, formatDurationText, formatDate, formatTime, uuid } from '@/utils/dateUtils'
import { t, cityName, countryName, cityFullName, useLang } from '@/utils/i18n'
import { cityDescription } from '@/utils/cityI18n'
import type { PomodoroRecord, CollectedSpecialty } from '@/types'
import citiesData from '@/data/cities.json'
import { getSpecialtyForCity, type SpecialtyInfo } from '@/data/specialties'
import { addSpecialty } from '@/utils/storage'

const store = usePomodoroStore()
const { scaleStyle, recalc } = usePageScale(800)

// 页面参数
const destName = ref('')
const destCountry = ref('')
const destCoord = ref<[number, number]>([0, 0])
const totalDistance = ref(0)
const totalDuration = ref(0)
const destDesc = ref('')
const destTagline = ref('')

// 状态
const remainingSeconds = ref(0)
const isPaused = ref(false)
const showArrival = ref(false)
const noteText = ref('')
const startTimeStr = ref('')
const videoSrc = ref('/static/kaiche.mp4')
const specialty = ref<SpecialtyInfo | null>(null)

const specialtyDisplayName = computed(() => {
  if (!specialty.value) return ''
  const { currentLang } = useLang()
  return currentLang.value === 'zh' ? specialty.value.nameZh : specialty.value.name
})
const specialtyDisplayDesc = computed(() => {
  if (!specialty.value) return ''
  const { currentLang } = useLang()
  return currentLang.value === 'zh' ? specialty.value.descriptionZh : specialty.value.description
})

let timerId: ReturnType<typeof setInterval> | null = null
let expectedEndTime = 0   // 预计结束的时间戳(ms)
let pausedAtRemaining = 0 // 暂停时剩余秒数

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
  // 1秒后开始计时
  remainingSeconds.value = totalDuration.value
  const now = new Date()
  startTimeStr.value = formatTime(now)

  setTimeout(() => {
    expectedEndTime = Date.now() + totalDuration.value * 1000
    startTimer()
  }, 1000)
})

onUnmounted(() => {
  stopTimer()
})

// 从后台返回时，基于真实时间重新计算
onShow(() => {
  recalc()
  if (!isPaused.value && expectedEndTime > 0) {
    const remaining = Math.ceil((expectedEndTime - Date.now()) / 1000)
    remainingSeconds.value = Math.max(remaining, 0)
    if (remainingSeconds.value <= 0) {
      stopTimer()
      onArrival()
    }
  }
})

// 进入后台时保存状态
onHide(() => {
  if (!isPaused.value && remainingSeconds.value > 0) {
    // 设置本地通知提醒到达
    try {
      // #ifdef APP-PLUS
      const remaining = remainingSeconds.value
      plus.push.createMessage(`旅程完成！你已到达目的地`, 'arrival', {
        delay: remaining,
        title: t('congrats'),
      })
      // #endif
    } catch (e) {}
  }
})

function startTimer() {
  timerId = setInterval(() => {
    if (!isPaused.value) {
      // 基于真实时间计算剩余，避免后台 setInterval 不准
      const now = Date.now()
      const remaining = Math.ceil((expectedEndTime - now) / 1000)
      remainingSeconds.value = Math.max(remaining, 0)

      if (remainingSeconds.value <= 0) {
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
  if (!isPaused.value) {
    // 暂停：记住剩余秒数
    pausedAtRemaining = remainingSeconds.value
    isPaused.value = true
  } else {
    // 恢复：重新计算结束时间
    expectedEndTime = Date.now() + pausedAtRemaining * 1000
    isPaused.value = false
  }
}

function onArrival() {
  // 加载特产信息
  const found = (citiesData as any[]).find(c => c.name === destName.value && c.country === destCountry.value)
  specialty.value = getSpecialtyForCity(destName.value, destCountry.value, found?.nameZh, found?.description)
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

  // 保存特产
  if (specialty.value) {
    const found = (citiesData as any[]).find(c => c.name === destName.value && c.country === destCountry.value)
    const s: CollectedSpecialty = {
      cityName: destName.value,
      cityCountry: destCountry.value,
      cityNameZh: found?.nameZh,
      name: specialty.value.name,
      nameZh: specialty.value.nameZh,
      icon: specialty.value.icon,
      description: specialty.value.description,
      descriptionZh: specialty.value.descriptionZh,
      collectedAt: new Date().toISOString(),
    }
    addSpecialty(s)
  }

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
.timer-inner {
  padding-left: $page-padding;
  padding-right: $page-padding;
}

.info-section {
  flex-shrink: 0;
  background: $bg-dark;
}

.video-section {
  flex: 1;
  position: relative;
  min-height: 0;
  border-radius: 24rpx;
  overflow: hidden;
}

.video-player {
  width: 100%;
  height: 100%;
  display: block;
}

/* ===== 路线 ===== */
.route-section {
  padding: 16rpx 0;
  text-align: center;
}

.route-bar {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.route-city {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
  max-width: 140rpx;
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
  width: 14rpx;
  height: 14rpx;
  background: #FFF;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 12rpx rgba(231, 76, 60, 0.8);
  transition: left 1s linear;
}

.route-km {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8rpx;
  display: block;
  text-align: center;
}

/* ===== 计时器 ===== */
.timer-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
}

.timer-ring {
  width: 300rpx;
  height: 300rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  border: 4rpx solid rgba(231, 76, 60, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer-text {
  font-size: 80rpx;
  font-weight: bold;
  color: #FFFFFF;
  font-family: 'JetBrains Mono', 'Roboto Mono', 'Courier New', monospace;
  letter-spacing: 4rpx;
}

.timer-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 6rpx;
}

/* ===== 里程 ===== */
.distance-section {
  padding: 16rpx 0;
  text-align: center;
}

.distance-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 8rpx;
}

.progress-track {
  height: 10rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 5rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $tomato-red, $warm-orange);
  border-radius: 5rpx;
  transition: width 1s linear;
}

.distance-percent {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 6rpx;
  display: block;
}

/* ===== 控制 ===== */
.controls {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  padding: 16rpx 0;
}

.btn-control {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 18rpx 40rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 36rpx;

  &:active {
    background: rgba(255, 255, 255, 0.25);
  }

  &.btn-stop {
    background: rgba(231, 76, 60, 0.25);

    &:active {
      background: rgba(231, 76, 60, 0.4);
    }
  }
}

.btn-control-icon {
  font-size: 26rpx;
  color: #FFFFFF;
}

.btn-control-text {
  font-size: 26rpx;
  color: #FFFFFF;
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
  max-height: 80vh;
  background: #1E2A3A;
  border-radius: 36rpx 36rpx 0 0;
  padding: 36rpx $page-padding;
  padding-bottom: calc(env(safe-area-inset-bottom) + 36rpx);
  position: relative;
  overflow-y: auto;
  animation: slideUp 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* no max-width constraint - fill screen */

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.arrival-title {
  font-size: 30rpx;
  color: $text-secondary;
  display: block;
  text-align: center;
}

.arrival-city {
  font-size: 40rpx;
  font-weight: bold;
  color: #FFFFFF;
  display: block;
  text-align: center;
  margin: 10rpx 0 20rpx;
}

.arrival-desc {
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1.5;
  display: block;
  margin-bottom: 20rpx;
  max-height: 120rpx;
  overflow: hidden;
}

/* ===== 特产奖励 ===== */
.specialty-reward {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  background: rgba(243, 156, 18, 0.15);
  border: 1rpx solid rgba(243, 156, 18, 0.3);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.specialty-icon {
  font-size: 48rpx;
  flex-shrink: 0;
}

.specialty-info {
  flex: 1;
  min-width: 0;
}

.specialty-label {
  font-size: 22rpx;
  color: $warm-orange;
  display: block;
  margin-bottom: 4rpx;
}

.specialty-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #FFFFFF;
  display: block;
  margin-bottom: 6rpx;
}

.specialty-desc {
  font-size: 22rpx;
  color: $text-secondary;
  line-height: 1.4;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.arrival-stats {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin-bottom: 24rpx;
}

.arrival-stat {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.stat-val {
  font-size: 26rpx;
  color: $text-primary;
  font-weight: bold;
}

.note-section {
  margin-bottom: 24rpx;
}

.note-label {
  font-size: 24rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 10rpx;
}

.note-input {
  width: 100%;
  min-height: 100rpx;
  max-height: 160rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 16rpx;
  font-size: 26rpx;
  color: $text-primary;
  box-sizing: border-box;
}

.note-placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.btn-confirm {
  height: 88rpx;
  background: linear-gradient(135deg, $success-green, #27ae60);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.85;
  }
}

.btn-text {
  font-size: 28rpx;
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
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(600rpx) rotate(720deg); opacity: 0; }
}


</style>
