<template>
  <view class="collect-page">
    <view class="page-head">
      <text class="kicker">我的收藏</text>
      <text class="title">把喜欢的景、食、住、行都留在这里</text>
    </view>

    <view class="collect-card card" v-for="item in collects" :key="item.id" @tap="openItem(item)">
      <image class="cover" :src="item.image || '/static/placeholder.png'" mode="aspectFill" />
      <view class="info">
        <text class="title-text">{{ item.title }}</text>
        <text class="type">{{ item.typeName }}</text>
      </view>
      <ui-icon name="arrow-right" :size="18" color="var(--color-text-tertiary)" />
    </view>

    <view class="empty-state" v-if="!collects.length">
      <text class="empty-text">暂无收藏，去商品和景点页点一下心形图标吧</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import UiIcon from '../components/ui-icon.vue'
import { getCollectList } from '../utils/local'

const collects = ref([])

const paths = {
  scenic: item => `/pages_travel/scenic/detail?id=${item.id}`,
  goods: item => `/pages_clothing/detail?id=${item.id}`,
}

function loadCollects() {
  collects.value = getCollectList()
}

function openItem(item) {
  const target = paths[item.type]
  if (target) {
    uni.navigateTo({ url: target(item) })
  }
}

onShow(loadCollects)
</script>

<style lang="scss" scoped>
.collect-page {
  min-height: 100vh;
  padding: 24rpx 20rpx 28rpx;
  background: var(--color-bg-secondary);
}

.page-head {
  padding: 8rpx 6rpx 18rpx;
}

.kicker {
  display: block;
  color: var(--color-cinnabar);
  font-size: 22rpx;
  font-weight: 700;
}

.title {
  display: block;
  margin-top: 8rpx;
  font-size: 36rpx;
  font-weight: 800;
  line-height: 1.25;
}

.collect-card {
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-bottom: 16rpx;
}

.cover {
  width: 180rpx;
  height: 140rpx;
  border-radius: 18rpx;
  flex-shrink: 0;
}

.info {
  flex: 1;
}

.title-text {
  display: block;
  font-size: 28rpx;
  font-weight: 800;
}

.type {
  display: inline-block;
  margin-top: 14rpx;
  padding: 4rpx 14rpx;
  border-radius: 999rpx;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 22rpx;
}
</style>
