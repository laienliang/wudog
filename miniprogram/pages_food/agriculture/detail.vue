<template>
  <view class="detail-page">
    <image class="cover" :src="goods.image" mode="aspectFill" />
    <view class="info-section">
      <text class="price">￥{{ goods.price }}</text>
      <text class="title">{{ goods.title }}</text>
      <text class="desc">{{ goods.description }}</text>
    </view>
    <view class="section">
      <text class="section-title">产地故事</text>
      <text class="section-content">{{ goods.story }}</text>
    </view>
    <view class="bottom-btn" @tap="addCart">加入购物车</view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const goods = ref({
  id: 1,
  title: '梯田红米',
  price: 39,
  image: 'https://via.placeholder.com/750x520/F7F8FA/6B8E3D?text=梯田红米',
  description: '高山梯田自然生长，米香浓郁。',
  story: '红米来自乌东高山梯田，采用传统稻作方式种植，保留稻谷自然风味，适合作为伴手礼和日常主食。',
});

function addCart() {
  wx.showToast({ title: '已加入购物车', icon: 'success' });
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  padding-bottom: 120rpx;
  background: var(--color-bg-secondary);
}

.cover {
  width: 100%;
  height: 520rpx;
}

.info-section,
.section {
  padding: 28rpx;
  margin-bottom: 16rpx;
  background: #fff;
}

.price {
  color: var(--color-secondary-orange);
  font-size: 44rpx;
  font-weight: bold;
}

.title,
.section-title {
  display: block;
  margin-top: 14rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.desc,
.section-content {
  display: block;
  margin-top: 14rpx;
  color: var(--color-text-secondary);
  font-size: 26rpx;
  line-height: 1.7;
}

.bottom-btn {
  position: fixed;
  right: 24rpx;
  bottom: calc(20rpx + env(safe-area-inset-bottom));
  left: 24rpx;
  padding: 22rpx 0;
  text-align: center;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
}
</style>
