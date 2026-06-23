<!-- 行-景区列表页 -->
<template>
  <view class="scenic-list-page">
    <view class="miao-divider"></view>
    <view class="container">
      <view class="scenic-card" v-for="(item, idx) in scenics" :key="idx" @tap="goDetail(item)">
        <image class="scenic-cover" :src="item.mainImage" mode="aspectFill" />
        <view class="scenic-info">
          <text class="scenic-name">{{ item.name }}</text>
          <text class="scenic-address">📍 {{ item.address }}</text>
          <view class="scenic-meta">
            <text class="rating">⭐ {{ item.rating }}</text>
            <text class="hours">🕐 {{ item.openHours }}</text>
          </view>
          <text class="scenic-desc">{{ item.description }}</text>
        </view>
      </view>
    </view>
    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const scenics = ref([
  { id: 1, name: '乌东梯田景区', mainImage: 'https://via.placeholder.com/750x400/F7F8FA/D4A14B?text=梯田', address: '贵州省黔东南州', rating: 4.8, openHours: '06:00-18:00', description: '千年梯田，四季风光各异，春季灌水如镜，秋季金黄如画。' },
  { id: 2, name: '苗寨古村落', mainImage: 'https://via.placeholder.com/750x400/F7F8FA/D4A14B?text=古村落', address: '乌东村内', rating: 4.6, openHours: '全天开放', description: '保存完好的苗族古建筑群，吊脚楼、风雨桥、鼓楼一应俱全。' },
]);

function goDetail(item) {
  wx.navigateTo({ url: `/pages_travel/scenic/detail?id=${item.id}` });
}
</script>

<style lang="scss" scoped>
.scenic-list-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.scenic-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin: 16rpx;
  box-shadow: var(--shadow-light);
}

.scenic-cover {
  width: 100%;
  height: 360rpx;
}

.scenic-info {
  padding: 20rpx;
}

.scenic-name {
  font-size: 32rpx;
  font-weight: 500;
  display: block;
}

.scenic-address {
  font-size: 24rpx;
  color: var(--color-text-secondary);
  margin-top: 8rpx;
  display: block;
}

.scenic-meta {
  display: flex;
  gap: 24rpx;
  font-size: 24rpx;
  color: var(--color-text-secondary);
  margin: 12rpx 0;
}

.scenic-desc {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
