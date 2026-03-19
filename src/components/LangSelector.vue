<template>
  <view class="lang-btn" @tap="showPicker = true">
    <text class="lang-icon">🌐</text>
    <text class="lang-current">{{ currentLabel }}</text>
  </view>

  <!-- 语言选择弹层 -->
  <view v-if="showPicker" class="picker-mask" @tap="showPicker = false">
    <view class="picker-panel" @tap.stop>
      <text class="picker-title">{{ t('language') }}</text>
      <scroll-view scroll-y class="picker-list">
        <view
          v-for="lang in languages"
          :key="lang.code"
          class="picker-item"
          :class="{ active: currentLang === lang.code }"
          @tap="onSelect(lang.code)"
        >
          <text class="picker-label">{{ lang.label }}</text>
          <text class="picker-label-zh">{{ lang.labelZh }}</text>
          <text v-if="currentLang === lang.code" class="picker-check">✓</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLang, languages, t } from '@/utils/i18n'
import type { LangCode } from '@/utils/i18n'

const { currentLang, setLang } = useLang()
const showPicker = ref(false)

const currentLabel = computed(() => {
  const found = languages.find(l => l.code === currentLang.value)
  return found?.label || '中文'
})

function onSelect(code: LangCode) {
  setLang(code)
  showPicker.value = false
}
</script>

<style lang="scss" scoped>
.lang-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 32rpx;

  &:active {
    background: rgba(255, 255, 255, 0.15);
  }
}

.lang-icon {
  font-size: 28rpx;
}

.lang-current {
  font-size: 24rpx;
  color: #FFFFFF;
}

/* ===== 弹层 ===== */
.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.picker-panel {
  width: 100%;
  max-height: 70vh;
  background: #1E2A3A;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 32rpx);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.picker-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #FFFFFF;
  display: block;
  text-align: center;
  margin-bottom: 24rpx;
}

.picker-list {
  max-height: 55vh;
}

.picker-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.06);
  border-radius: 12rpx;

  &.active {
    background: rgba(231, 76, 60, 0.12);
  }

  &:active {
    background: rgba(255, 255, 255, 0.08);
  }
}

.picker-label {
  font-size: 30rpx;
  color: #FFFFFF;
  flex: 1;
}

.picker-label-zh {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-right: 16rpx;
}

.picker-check {
  font-size: 28rpx;
  color: #E74C3C;
  font-weight: bold;
}
</style>
