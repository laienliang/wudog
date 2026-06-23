<template>
  <view class="scenic-detail-page">
    <image class="cover" :src="scenic.mainImage" mode="aspectFill" />
    <view class="info-section">
      <text class="title">{{ scenic.name }}</text>
      <text class="meta">⭐ {{ scenic.rating }} · {{ scenic.openHours }}</text>
      <text class="address">📍 {{ scenic.address }}</text>
      <text class="desc">{{ scenic.description }}</text>
    </view>
    <view class="section">
      <text class="section-title">门票预订</text>
      <view class="ticket-card" v-for="ticket in tickets" :key="ticket.id">
        <view>
          <text class="ticket-name">{{ ticket.name }}</text>
          <text class="ticket-tip">{{ ticket.tip }}</text>
        </view>
        <view class="ticket-action">
          <text class="ticket-price">￥{{ ticket.price }}</text>
          <view class="book-btn" @tap="book(ticket)">预订</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const scenic = ref({
  name: '乌东梯田景区',
  mainImage: 'https://via.placeholder.com/750x500/F7F8FA/D4A14B?text=乌东梯田',
  rating: 4.8,
  openHours: '06:00-18:00',
  address: '贵州省黔东南州乌东村',
  description: '千年梯田，四季风光各异，春季灌水如镜，秋季金黄如画。',
});
const tickets = ref([
  { id: 1, name: '成人票', tip: '当天可订，扫码入园', price: 68 },
  { id: 2, name: '亲子票', tip: '1大1小，含讲解服务', price: 108 },
]);

function book(ticket) {
  wx.showToast({ title: `${ticket.name} 已加入订单`, icon: 'none' });
}
</script>

<style lang="scss" scoped>
.scenic-detail-page {
  min-height: 100vh;
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

.meta,
.address,
.desc,
.ticket-tip {
  display: block;
  margin-top: 12rpx;
  color: var(--color-text-secondary);
  font-size: 24rpx;
}

.desc {
  line-height: 1.7;
}

.ticket-card {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  padding: 22rpx 0;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.ticket-name {
  font-size: 28rpx;
  font-weight: 500;
}

.ticket-action {
  text-align: right;
}

.ticket-price {
  display: block;
  color: var(--color-secondary-orange);
  font-weight: bold;
}

.book-btn {
  margin-top: 10rpx;
  padding: 8rpx 24rpx;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
  font-size: 24rpx;
}
</style>
