<template>
  <view class="route-detail-page">
    <image class="cover" :src="route.mainImage" mode="aspectFill" />
    <view class="info-section">
      <text class="title">{{ route.title }}</text>
      <text class="price">￥{{ route.price }}起</text>
      <view class="include-list">
        <text class="include-tag" v-for="item in route.includes" :key="item">{{ item }}</text>
      </view>
    </view>
    <view class="section">
      <text class="section-title">行程安排</text>
      <view class="day-card" v-for="day in days" :key="day.day">
        <text class="day-title">第{{ day.day }}天 · {{ day.title }}</text>
        <text class="day-desc">{{ day.desc }}</text>
      </view>
    </view>
    <view class="bottom-btn" @tap="bookRoute">立即预订</view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const route = ref({
  title: '乌东苗寨深度一日游',
  mainImage: 'https://via.placeholder.com/750x500/F7F8FA/D4A14B?text=一日游',
  price: 298,
  includes: ['三餐', '导游', '门票', '银饰体验'],
});
const days = ref([
  { day: 1, title: '苗寨迎宾与梯田漫游', desc: '上午游览苗寨古村落，午餐体验长桌宴，下午前往梯田观景台并参加银饰体验。' },
]);

function bookRoute() {
  wx.showToast({ title: '线路预订已提交', icon: 'success' });
}
</script>

<style lang="scss" scoped>
.route-detail-page {
  min-height: 100vh;
  padding-bottom: 120rpx;
  background: var(--color-bg-secondary);
}

.cover {
  width: 100%;
  height: 500rpx;
}

.info-section,
.section {
  padding: 28rpx;
  margin-bottom: 16rpx;
  background: #fff;
}

.title,
.section-title {
  display: block;
  font-size: 34rpx;
  font-weight: 500;
}

.price {
  display: block;
  margin: 16rpx 0;
  color: var(--color-secondary-orange);
  font-size: 40rpx;
  font-weight: bold;
}

.include-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.include-tag {
  padding: 6rpx 14rpx;
  border-radius: var(--radius-sm);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 22rpx;
}

.day-card {
  padding: 22rpx 0;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.day-title {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
}

.day-desc {
  display: block;
  margin-top: 12rpx;
  color: var(--color-text-secondary);
  font-size: 24rpx;
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
