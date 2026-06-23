<!-- 行-路线套餐页 -->
<template>
  <view class="route-list-page">
    <view class="miao-divider"></view>
    <view class="container">
      <view class="route-card" v-for="(item, idx) in routes" :key="idx" @tap="goDetail(item)">
        <image class="route-cover" :src="item.mainImage" mode="aspectFill" />
        <view class="route-info">
          <text class="route-title">{{ item.title }}</text>
          <view class="route-includes">
            <text class="include-tag" v-for="(inc, i) in (item.includes || []).slice(0, 3)" :key="i">{{ inc }}</text>
          </view>
          <view class="route-meta">
            <text class="days">📅 {{ item.days }}天{{ item.nights ? item.nights + '晚' : '' }}</text>
            <text class="price-tag">￥{{ item.price }}起</text>
          </view>
        </view>
      </view>
    </view>
    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const routes = ref([
  { id: 1, title: '乌东苗寨深度一日游', mainImage: 'https://via.placeholder.com/750x400/F7F8FA/D4A14B?text=一日游', days: 1, includes: ['三餐', '导游', '门票', '银饰体验'], price: 298 },
  { id: 2, title: '苗寨+梯田徒步两日游', mainImage: 'https://via.placeholder.com/750x400/F7F8FA/D4A14B?text=两日游', days: 2, nights: 1, includes: ['住宿', '三餐', '徒步', '长桌宴'], price: 498 },
  { id: 3, title: '苗年节庆三天游', mainImage: 'https://via.placeholder.com/750x400/F7F8FA/D4A14B?text=苗年游', days: 3, nights: 2, includes: ['住宿', '节庆活动', '歌舞', '银饰锻造'], price: 688 },
]);

function goDetail(item) {
  wx.navigateTo({ url: `/pages_travel/route/detail?id=${item.id}` });
}
</script>

<style lang="scss" scoped>
.route-list-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.route-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin: 16rpx;
  box-shadow: var(--shadow-light);
}

.route-cover {
  width: 100%;
  height: 360rpx;
}

.route-info {
  padding: 20rpx;
}

.route-title {
  font-size: 30rpx;
  font-weight: 500;
  display: block;
}

.route-includes {
  margin: 12rpx 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.include-tag {
  @extend .tag;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
}

.route-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12rpx;
}

.days {
  font-size: 24rpx;
  color: var(--color-text-secondary);
}

.price-tag {
  color: var(--color-secondary-orange);
  font-weight: bold;
  font-size: 32rpx;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
