<template>
  <view class="navbar">
    <view :style="{ height: topSafeHeight + 'px' }"></view>
    <view class="navbar-inner">
      <view class="navbar-left" @tap="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="navbar-title">{{ title }}</text>
      <view class="navbar-right"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps<{ title: string }>()

const topSafeHeight = ref(0)
onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  // statusBarHeight + 额外安全间距，确保刘海屏不遮挡
  topSafeHeight.value = (sysInfo.statusBarHeight || 20) + 10
})

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.navbar {
  background: #1A1A2E;
}

.navbar-inner {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 16rpx;
}

.navbar-left {
  width: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 48rpx;
  color: #FFFFFF;
  font-weight: 300;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.navbar-right {
  width: 80rpx;
}
</style>
