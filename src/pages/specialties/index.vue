<template>
  <view class="page-outer">
    <view class="page-inner" :style="scaleStyle">
    <NavBar :title="t('pageSpecialties')" />

    <!-- 统计 -->
    <view class="stats-bar">
      <text class="stats-text">{{ t('collected') }} {{ specialties.length }} {{ t('items') }}</text>
    </view>

    <!-- 空状态 -->
    <view v-if="specialties.length === 0" class="empty-state">
      <text class="empty-icon">🎁</text>
      <text class="empty-text">{{ t('emptySpecialties') }}</text>
    </view>

    <!-- 特产列表 -->
    <scroll-view v-else scroll-y class="specialty-list">
      <view
        v-for="item in specialties"
        :key="item.cityName + item.cityCountry"
        class="specialty-card"
        @tap="toggleExpand(item.cityName + item.cityCountry)"
      >
        <view class="card-main">
          <text class="card-icon">{{ item.icon }}</text>
          <view class="card-content">
            <text class="card-name">{{ displayName(item) }}</text>
            <text class="card-city">{{ displayCity(item) }}</text>
          </view>
        </view>
        <view v-if="expandedKey === item.cityName + item.cityCountry" class="card-detail">
          <text class="card-desc">{{ displayDesc(item) }}</text>
          <text class="card-date">{{ t('collectedDate') }}{{ formatCollectedDate(item.collectedAt) }}</text>
        </view>
      </view>
    </scroll-view>

    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { usePageScale } from '@/utils/usePageScale'
import { getCollectedSpecialties } from '@/utils/storage'
import { t, useLang } from '@/utils/i18n'
import NavBar from '@/components/NavBar.vue'
import type { CollectedSpecialty } from '@/types'

const { scaleStyle, recalc } = usePageScale(900)
const { currentLang } = useLang()
const specialties = ref<CollectedSpecialty[]>([])
const expandedKey = ref('')

onMounted(() => {
  loadSpecialties()
})

onShow(() => {
  recalc()
  loadSpecialties()
})

function loadSpecialties() {
  specialties.value = getCollectedSpecialties().reverse() // 最新在前
}

function displayName(item: CollectedSpecialty): string {
  return currentLang.value === 'zh' ? item.nameZh : item.name
}

function displayCity(item: CollectedSpecialty): string {
  if (currentLang.value === 'zh' && item.cityNameZh) {
    return item.cityNameZh
  }
  return item.cityName
}

function displayDesc(item: CollectedSpecialty): string {
  return currentLang.value === 'zh' ? item.descriptionZh : item.description
}

function formatCollectedDate(isoStr: string): string {
  const d = new Date(isoStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function toggleExpand(key: string) {
  expandedKey.value = expandedKey.value === key ? '' : key
}
</script>

<style lang="scss" scoped>
.page-inner {
  padding-left: $page-padding;
  padding-right: $page-padding;
}

.stats-bar {
  padding: 16rpx 0;
  flex-shrink: 0;
}

.stats-text {
  font-size: 26rpx;
  color: $text-secondary;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}

.empty-icon {
  font-size: 80rpx;
}

.empty-text {
  font-size: 28rpx;
  color: $text-muted;
  text-align: center;
}

.specialty-list {
  flex: 1;
  min-height: 0;
}

.specialty-card {
  background: $bg-card;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;

  &:active {
    background: $bg-card-active;
  }
}

.card-main {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.card-icon {
  font-size: 48rpx;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 30rpx;
  font-weight: bold;
  color: $text-primary;
  display: block;
}

.card-city {
  font-size: 24rpx;
  color: $text-secondary;
  margin-top: 4rpx;
}

.card-detail {
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid $border-subtle;
}

.card-desc {
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1.6;
  display: block;
  margin-bottom: 10rpx;
}

.card-date {
  font-size: 22rpx;
  color: $text-muted;
}
</style>
