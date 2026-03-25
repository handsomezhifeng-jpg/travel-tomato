<template>
  <view class="navbar">
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
defineProps<{ title: string }>()

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.navbar {
  background: transparent;
  flex-shrink: 0;
  width: 100%;
}

.navbar-inner {
  display: flex;
  align-items: center;
  height: 88rpx;
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
