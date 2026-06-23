<template>
  <view class="agri-page">
    <view class="miao-divider"></view>
    <view class="goods-list">
      <view class="goods-card" v-for="item in goods" :key="item.id" @tap="goDetail(item)">
        <image class="goods-cover" :src="item.image" mode="aspectFill" />
        <view class="goods-info">
          <text class="goods-title">{{ item.title }}</text>
          <text class="goods-desc">{{ item.description }}</text>
          <text class="goods-price">￥{{ item.price }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const goods = ref([
  { id: 1, title: '梯田红米', price: 39, image: 'https://via.placeholder.com/750x420/F7F8FA/6B8E3D?text=梯田红米', description: '高山梯田自然生长，米香浓郁。' },
  { id: 2, title: '苗寨蜂蜜', price: 58, image: 'https://via.placeholder.com/750x420/FFF7E6/D4A14B?text=苗寨蜂蜜', description: '山花蜜源，清甜不腻。' },
]);

function goDetail(item) {
  wx.navigateTo({ url: `/pages_food/agriculture/detail?id=${item.id}` });
}
</script>

<style lang="scss" scoped>
.agri-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.goods-list {
  padding: 16rpx;
}

.goods-card {
  margin-bottom: 16rpx;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: #fff;
}

.goods-cover {
  width: 100%;
  height: 340rpx;
}

.goods-info {
  padding: 20rpx;
}

.goods-title {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
}

.goods-desc {
  display: block;
  margin: 10rpx 0;
  color: var(--color-text-secondary);
  font-size: 24rpx;
}

.goods-price {
  color: var(--color-secondary-orange);
  font-size: 32rpx;
  font-weight: bold;
}
</style>
