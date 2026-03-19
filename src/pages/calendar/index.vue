<template>
  <view class="page">
    <NavBar :title="t('pageCalendar')" />
    <!-- 视图切换 Tab -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: currentTab === tab.key }"
        @tap="currentTab = tab.key"
      >
        <text class="tab-text">{{ tab.label }}</text>
      </view>
    </view>

    <!-- 月视图 -->
    <view v-if="currentTab === 'month'" class="month-view">
      <view class="month-header">
        <view class="arrow" @tap="prevMonth">
          <text class="arrow-text">◀</text>
        </view>
        <text class="month-title">{{ formatMonthTitle(currentYear, currentMonth) }}</text>
        <view class="arrow" @tap="nextMonth">
          <text class="arrow-text">▶</text>
        </view>
      </view>

      <view class="weekday-row">
        <text v-for="d in weekdayNames" :key="d" class="weekday-cell">{{ d }}</text>
      </view>

      <view v-for="(week, wi) in monthGrid" :key="wi" class="week-row">
        <view
          v-for="(day, di) in week"
          :key="di"
          class="day-cell"
          :class="{
            empty: !day,
            today: isToday(day),
            selected: selectedDay === day,
            'has-records': day && getDayCount(day) > 0,
          }"
          @tap="day && selectDay(day)"
        >
          <text v-if="day" class="day-num">{{ day }}</text>
          <view v-if="day && getDayCount(day) > 0" class="day-dots">
            <text class="dot-text">{{ getDayCount(day) > 3 ? getDayCount(day) : '🍅'.repeat(getDayCount(day)) }}</text>
          </view>
        </view>
      </view>

      <view class="summary-card">
        <text class="summary-title">{{ currentMonth }}{{ t('monthStats') }}</text>
        <view class="summary-grid">
          <view class="summary-item">
            <text class="summary-val">{{ monthStats.count }}</text>
            <text class="summary-label">{{ t('totalPomodoro') }}</text>
          </view>
          <view class="summary-item">
            <text class="summary-val">{{ formatDurationText(monthStats.totalDuration) }}</text>
            <text class="summary-label">{{ t('totalTime') }}</text>
          </view>
          <view class="summary-item">
            <text class="summary-val">{{ monthStats.totalDistance.toLocaleString() }}</text>
            <text class="summary-label">{{ t('totalMileage') }}</text>
          </view>
          <view class="summary-item">
            <text class="summary-val">{{ monthStats.cities.length }}</text>
            <text class="summary-label">{{ t('visitedCities') }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 周视图 -->
    <view v-if="currentTab === 'week'" class="week-view">
      <view class="month-header">
        <view class="arrow" @tap="prevWeek">
          <text class="arrow-text">◀</text>
        </view>
        <text class="month-title">{{ weekRange.start }} ~ {{ weekRange.end }}</text>
        <view class="arrow" @tap="nextWeek">
          <text class="arrow-text">▶</text>
        </view>
      </view>

      <view class="bar-chart">
        <view v-for="(s, i) in weekSummaries" :key="i" class="bar-col">
          <view class="bar-wrap">
            <view class="bar-fill" :style="{ height: barHeight(s.count) + '%' }"></view>
          </view>
          <text class="bar-label">{{ weekdayShortNames[i] }}</text>
          <text class="bar-count">{{ s.count || '' }}</text>
        </view>
      </view>

      <view class="summary-card">
        <text class="summary-title">{{ t('weekStats') }}</text>
        <view class="summary-grid">
          <view class="summary-item">
            <text class="summary-val">{{ weekTotalStats.count }}</text>
            <text class="summary-label">{{ t('totalPomodoro') }}</text>
          </view>
          <view class="summary-item">
            <text class="summary-val">{{ formatDurationText(weekTotalStats.totalDuration) }}</text>
            <text class="summary-label">{{ t('totalTime') }}</text>
          </view>
          <view class="summary-item">
            <text class="summary-val">{{ weekTotalStats.totalDistance.toLocaleString() }}</text>
            <text class="summary-label">{{ t('totalMileage') }}</text>
          </view>
        </view>
      </view>

      <view class="daily-list">
        <view v-for="(s, i) in weekSummaries" :key="i" class="daily-row">
          <text class="daily-day">{{ weekdayShortNames[i] }} {{ s.date.slice(5) }}</text>
          <text v-if="s.count" class="daily-info">🍅×{{ s.count }}  {{ formatDurationText(s.totalDuration) }}  {{ s.totalDistance }}km</text>
          <text v-else class="daily-info muted">—</text>
        </view>
      </view>
    </view>

    <!-- 日视图 -->
    <view v-if="currentTab === 'day'" class="day-view">
      <view class="month-header">
        <view class="arrow" @tap="prevDay">
          <text class="arrow-text">◀</text>
        </view>
        <text class="month-title">{{ selectedDate }}</text>
        <view class="arrow" @tap="nextDay">
          <text class="arrow-text">▶</text>
        </view>
      </view>

      <view v-if="dayRecords.length === 0" class="empty-state">
        <text class="empty-text">{{ t('noRecord') }}</text>
      </view>

      <view v-for="r in dayRecords" :key="r.id" class="record-card">
        <view class="record-header">
          <text class="record-time">{{ r.startTime.slice(0, 5) }}</text>
          <text class="record-route">{{ displayRecordCity(r.originCity, r.originCountry) }} → {{ displayRecordCity(r.destCity, r.destCountry) }}</text>
        </view>
        <view class="record-meta">
          <text class="record-dist">{{ r.distance }}km</text>
        </view>
        <text v-if="r.note" class="record-note">"{{ r.note }}"</text>
        <text v-else class="record-note muted">{{ t('notFilled') }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getMonthGrid, formatDurationText, formatDate, today } from '@/utils/dateUtils'
import { t, cityName, useLang, formatMonthTitle, getWeekdayNames, getWeekdayShortNames } from '@/utils/i18n'
import NavBar from '@/components/NavBar.vue'
import * as storage from '@/utils/storage'
import citiesData from '@/data/cities.json'
import type { PomodoroRecord, DailySummary } from '@/types'

const { currentLang } = useLang()

const tabs = computed(() => [
  { key: 'month', label: t('month') },
  { key: 'week', label: t('week') },
  { key: 'day', label: t('day') },
])
const currentTab = ref('month')
const weekdayNames = computed(() => getWeekdayNames())
const weekdayShortNames = computed(() => getWeekdayShortNames())

// 根据记录中的城市名查找翻译
function displayRecordCity(name: string, country: string): string {
  const found = (citiesData as any[]).find(c => c.name === name && c.country === country)
  if (found) return cityName(found)
  return name
}

// 月视图
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)
const selectedDay = ref<number | null>(null)
const selectedDate = ref(today())

const monthGrid = computed(() => getMonthGrid(currentYear.value, currentMonth.value))
const monthSummaries = computed(() => storage.getMonthlySummaries(currentYear.value, currentMonth.value))

const monthStats = computed(() => {
  const all = monthSummaries.value
  const cities = new Set<string>()
  let count = 0, dur = 0, dist = 0
  for (const s of all) {
    count += s.count; dur += s.totalDuration; dist += s.totalDistance
    s.cities.forEach(c => cities.add(c))
  }
  return { count, totalDuration: dur, totalDistance: dist, cities: [...cities] }
})

function getDayCount(day: number | null): number {
  if (!day) return 0
  const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return monthSummaries.value.find(s => s.date === dateStr)?.count || 0
}

function isToday(day: number | null): boolean {
  if (!day) return false
  const now = new Date()
  return currentYear.value === now.getFullYear() && currentMonth.value === now.getMonth() + 1 && day === now.getDate()
}

function selectDay(day: number) {
  selectedDay.value = day
  selectedDate.value = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  currentTab.value = 'day'
}

function prevMonth() { if (currentMonth.value === 1) { currentMonth.value = 12; currentYear.value-- } else { currentMonth.value-- } }
function nextMonth() { if (currentMonth.value === 12) { currentMonth.value = 1; currentYear.value++ } else { currentMonth.value++ } }

// 周视图
const weekOffset = ref(0)
const weekRange = computed(() => {
  const d = new Date(); d.setDate(d.getDate() + weekOffset.value * 7)
  const day = d.getDay() || 7
  const monday = new Date(d); monday.setDate(d.getDate() - day + 1)
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6)
  return { start: formatDate(monday), end: formatDate(sunday), monday }
})

const weekSummaries = computed(() => storage.getWeeklySummaries(weekRange.value.start))
const weekTotalStats = computed(() => {
  let count = 0, dur = 0, dist = 0
  for (const s of weekSummaries.value) { count += s.count; dur += s.totalDuration; dist += s.totalDistance }
  return { count, totalDuration: dur, totalDistance: dist }
})

function barHeight(count: number): number {
  const max = Math.max(...weekSummaries.value.map(s => s.count), 1)
  return (count / max) * 100
}

function prevWeek() { weekOffset.value-- }
function nextWeek() { weekOffset.value++ }

// 日视图
const dayRecords = computed(() => storage.getRecordsByDate(selectedDate.value).filter(r => r.completed))
function prevDay() { const d = new Date(selectedDate.value); d.setDate(d.getDate() - 1); selectedDate.value = formatDate(d) }
function nextDay() { const d = new Date(selectedDate.value); d.setDate(d.getDate() + 1); selectedDate.value = formatDate(d) }
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-dark;
  padding: $page-padding;
  padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
}

/* ===== Tab ===== */
.tab-bar {
  display: flex;
  background: $bg-card;
  border-radius: 20rpx;
  padding: 8rpx;
  margin-bottom: 32rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 22rpx;
  border-radius: 16rpx;

  &.active {
    background: $tomato-red;
  }
}

.tab-text {
  font-size: 32rpx;
  color: $text-primary;
  font-weight: bold;
}

/* ===== 月份/周/日 切换头 ===== */
.month-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
  margin-bottom: 28rpx;
}

.arrow {
  padding: 16rpx 24rpx;
  &:active { opacity: 0.6; }
}

.arrow-text {
  font-size: 32rpx;
  color: $text-secondary;
}

.month-title {
  font-size: 36rpx;
  font-weight: bold;
  color: $text-primary;
}

/* ===== 日历网格 ===== */
.weekday-row {
  display: flex;
  margin-bottom: 16rpx;
}

.weekday-cell {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: $text-secondary;
}

.week-row {
  display: flex;
  margin-bottom: 10rpx;
}

.day-cell {
  flex: 1;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  margin: 4rpx;

  &.today { border: 2rpx solid $tomato-red; }
  &.selected { background: rgba(231, 76, 60, 0.2); }
  &.has-records { background: rgba(231, 76, 60, 0.1); }
  &:active:not(.empty) { background: $bg-card-active; }
}

.day-num {
  font-size: 30rpx;
  color: $text-primary;
}

.day-dots {
  margin-top: 4rpx;
}

.dot-text {
  font-size: 18rpx;
}

/* ===== 统计卡 ===== */
.summary-card {
  background: $bg-card;
  border-radius: $card-radius;
  padding: 36rpx;
  margin-top: 28rpx;
  margin-bottom: 28rpx;
}

.summary-title {
  font-size: 30rpx;
  color: $text-secondary;
  display: block;
  margin-bottom: 20rpx;
}

.summary-grid {
  display: flex;
  flex-wrap: wrap;
}

.summary-item {
  width: 50%;
  padding: 16rpx 0;
  text-align: center;
}

.summary-val {
  font-size: 42rpx;
  font-weight: bold;
  color: $text-primary;
  display: block;
}

.summary-label {
  font-size: 26rpx;
  color: $text-secondary;
  margin-top: 4rpx;
}

/* ===== 柱状图 ===== */
.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 320rpx;
  padding: 0 16rpx;
  margin-bottom: 20rpx;
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-wrap {
  width: 48rpx;
  height: 220rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10rpx;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, $tomato-red, $warm-orange);
  border-radius: 10rpx;
  min-height: 4rpx;
  transition: height 0.3s;
}

.bar-label {
  font-size: 26rpx;
  color: $text-secondary;
  margin-top: 10rpx;
}

.bar-count {
  font-size: 24rpx;
  color: $warm-orange;
  height: 36rpx;
}

/* ===== 每日明细 ===== */
.daily-list {
  background: $bg-card;
  border-radius: $card-radius;
  padding: 20rpx 28rpx;
}

.daily-row {
  display: flex;
  justify-content: space-between;
  padding: 22rpx 0;
  border-bottom: 1rpx solid $border-subtle;
  &:last-child { border-bottom: none; }
}

.daily-day {
  font-size: 30rpx;
  color: $text-primary;
  width: 180rpx;
  flex-shrink: 0;
}

.daily-info {
  font-size: 28rpx;
  color: $text-secondary;
  flex: 1;
  text-align: right;
  &.muted { color: $text-muted; }
}

/* ===== 日视图记录 ===== */
.record-card {
  background: $bg-card;
  border-radius: $card-radius;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.record-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.record-time {
  font-size: 32rpx;
  color: $warm-orange;
  font-weight: bold;
}

.record-route {
  font-size: 30rpx;
  color: $text-primary;
  flex: 1;
}

.record-meta {
  margin-bottom: 8rpx;
}

.record-dist {
  font-size: 28rpx;
  color: $text-secondary;
}

.record-note {
  font-size: 28rpx;
  color: $text-secondary;
  font-style: italic;
  &.muted { color: $text-muted; }
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
