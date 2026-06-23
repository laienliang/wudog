<template>
  <view class="cart-page">
    <view class="cart-list" v-if="items.length">
      <view class="cart-item" v-for="item in items" :key="item.id">
        <checkbox :checked="item.checked" @tap="item.checked = !item.checked" />
        <image class="item-cover" :src="item.image" mode="aspectFill" />
        <view class="item-info">
          <text class="item-title">{{ item.title }}</text>
          <text class="item-spec">{{ item.spec }}</text>
          <view class="item-bottom">
            <text class="item-price">￥{{ item.price }}</text>
            <view class="count-control">
              <text class="count-btn" @tap="decrease(item)">-</text>
              <text class="count-value">{{ item.count }}</text>
              <text class="count-btn" @tap="increase(item)">+</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-text">购物车还是空的</text>
      <view class="btn-primary go-btn" @tap="goShopping">去逛逛</view>
    </view>

    <view class="cart-bar" v-if="items.length">
      <view class="total">合计：<text>￥{{ totalPrice }}</text></view>
      <view class="settle-btn" @tap="settle">结算</view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue';

const items = ref([
  { id: 1, title: '苗族银饰手镯', spec: '中号（内径56mm）', price: 368, count: 1, checked: true, image: 'https://via.placeholder.com/160x160/F7F8FA/1F5FA8?text=银饰' },
  { id: 2, title: '刺绣香包', spec: '蓝色', price: 68, count: 2, checked: true, image: 'https://via.placeholder.com/160x160/F7F8FA/1F5FA8?text=香包' },
]);

const totalPrice = computed(() => items.value.filter((item) => item.checked).reduce((sum, item) => sum + item.price * item.count, 0));

function decrease(item) {
  if (item.count > 1) item.count -= 1;
}

function increase(item) {
  item.count += 1;
}

function goShopping() {
  wx.navigateTo({ url: '/pages_clothing/list' });
}

function settle() {
  wx.showToast({ title: '订单确认功能开发中', icon: 'none' });
}
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  padding-bottom: 120rpx;
  background: var(--color-bg-secondary);
}

.cart-list {
  padding: 16rpx;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  border-radius: var(--radius-lg);
  background: #fff;
}

.item-cover {
  width: 148rpx;
  height: 148rpx;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-title {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
}

.item-spec {
  display: block;
  margin: 10rpx 0 20rpx;
  font-size: 22rpx;
  color: var(--color-text-tertiary);
}

.item-bottom,
.cart-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-price,
.total text {
  color: var(--color-secondary-orange);
  font-weight: bold;
}

.count-control {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.count-btn {
  width: 44rpx;
  height: 44rpx;
  line-height: 44rpx;
  text-align: center;
  border: 1rpx solid var(--color-border-primary);
  border-radius: var(--radius-md);
}

.cart-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.settle-btn {
  width: 220rpx;
  padding: 18rpx 0;
  text-align: center;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
}

.go-btn {
  margin-top: 24rpx;
}
</style>
