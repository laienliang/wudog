<template>
  <view class="orders-page">
    <view class="tabs">
      <text class="tab active">全部</text>
      <text class="tab">待付款</text>
      <text class="tab">待使用</text>
      <text class="tab">已完成</text>
    </view>
    <view class="order-card" v-for="order in orders" :key="order.id" @tap="goDetail(order)">
      <view class="order-head">
        <text>{{ order.title }}</text>
        <text class="status">{{ order.status }}</text>
      </view>
      <text class="order-meta">{{ order.time }}</text>
      <view class="order-bottom">
        <text>合计 ￥{{ order.amount }}</text>
        <view class="action-btn">查看详情</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const orders = ref([
  { id: 1, title: '乌东苗寨深度一日游', time: '2026-06-23 10:30', amount: 298, status: '待使用' },
  { id: 2, title: '苗族银饰手镯', time: '2026-06-20 16:12', amount: 368, status: '已完成' },
]);

function goDetail(order) {
  wx.navigateTo({ url: `/pages_user/orderDetail?id=${order.id}` });
}
</script>

<style lang="scss" scoped>
.orders-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.tabs {
  display: flex;
  padding: 18rpx;
  background: #fff;
}

.tab {
  flex: 1;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 26rpx;
}

.tab.active {
  color: var(--color-primary);
  font-weight: 500;
}

.order-card {
  margin: 16rpx;
  padding: 24rpx;
  border-radius: var(--radius-lg);
  background: #fff;
}

.order-head,
.order-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  color: var(--color-primary);
  font-size: 24rpx;
}

.order-meta {
  display: block;
  margin: 14rpx 0 24rpx;
  color: var(--color-text-tertiary);
  font-size: 24rpx;
}

.action-btn {
  padding: 8rpx 22rpx;
  border-radius: var(--radius-full);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 24rpx;
}
</style>
