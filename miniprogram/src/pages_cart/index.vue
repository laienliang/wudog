<template>
  <view class="cart-page">
    <view class="page-head">
      <text class="kicker">购物车</text>
      <text class="title">把想带走的东西先放进篮子里</text>
    </view>

    <view class="cart-list" v-if="items.length">
      <view class="cart-item card" v-for="item in items" :key="item.id">
        <checkbox :checked="item.checked" @tap="toggleChecked(item)" />
        <image class="item-cover" :src="item.image" mode="aspectFill" />
        <view class="item-info">
          <text class="item-title">{{ item.title }}</text>
          <text class="item-spec">{{ item.spec }}</text>
          <view class="item-bottom">
            <text class="item-price">¥{{ item.price }}</text>
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
      <view class="total">合计：<text>¥{{ totalPrice }}</text></view>
      <view class="settle-btn" @tap="settle">结算</view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { get, post } from '../utils/request'
import { getCurrentUser, appendOrder } from '../utils/local'

const items = ref([])

const totalPrice = computed(() =>
  items.value.filter(item => item.checked).reduce((sum, item) => sum + Number(item.price || 0) * Number(item.count || 1), 0)
)

async function loadCart() {
  const res = await get('/cart', { userId: getCurrentUser().id })
  items.value = res?.list?.length
    ? res.list.map(item => ({
        id: item.id,
        title: item.goodsTitle,
        spec: item.skuName || '默认规格',
        price: Number(item.price || 0),
        count: Number(item.quantity || 1),
        checked: Boolean(item.checked),
        image: item.mainImage || '/static/placeholder.png',
        moduleType: item.moduleType,
        goodsId: item.goodsId,
      }))
    : []
}

function toggleChecked(item) {
  item.checked = !item.checked
}

function decrease(item) {
  if (item.count > 1) item.count -= 1
}

function increase(item) {
  item.count += 1
}

function goShopping() {
  uni.switchTab({ url: '/pages/category/category' })
}

async function settle() {
  const selected = items.value.filter(item => item.checked)
  if (!selected.length) {
    uni.showToast({ title: '请先选择商品', icon: 'none' })
    return
  }
  const amount = selected.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.count || 1), 0)
  const response = await post('/order/create', {
    userId: getCurrentUser().id,
    moduleType: 1,
    title: '购物车结算',
    totalAmount: amount,
    payAmount: amount,
    status: 0,
    items: selected.map(item => ({
      goodsId: item.goodsId,
      goodsTitle: item.title,
      skuName: item.spec,
      quantity: item.count,
      price: item.price,
    })),
  })
  if (response?.order) {
    const created = appendOrder({
      id: response.order.id,
      orderNo: response.order.orderNo,
      title: '购物车结算',
      moduleType: 1,
      moduleName: '购物结算',
      status: 0,
      statusText: '待支付',
      amount,
      items: response.order.items || [],
    })
    uni.showToast({ title: '已生成订单', icon: 'success' })
    setTimeout(() => uni.navigateTo({ url: `/pages_user/orderDetail?id=${created.id}` }), 500)
    return
  }
  uni.showToast({ title: '结算失败', icon: 'none' })
}

onShow(loadCart)
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  padding: 24rpx 20rpx 140rpx;
  background: var(--color-bg-secondary);
}

.page-head {
  padding: 8rpx 6rpx 16rpx;
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
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.item-cover {
  width: 148rpx;
  height: 148rpx;
  border-radius: 18rpx;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-title {
  display: block;
  font-size: 28rpx;
  font-weight: 800;
}

.item-spec {
  display: block;
  margin: 10rpx 0 18rpx;
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
  color: var(--color-cinnabar);
  font-weight: 800;
}

.count-control {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.count-btn {
  width: 44rpx;
  height: 44rpx;
  line-height: 44rpx;
  text-align: center;
  border: 1rpx solid var(--color-border-primary);
  border-radius: 14rpx;
}

.cart-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -8rpx 24rpx rgba(18, 36, 58, 0.08);
}

.settle-btn {
  width: 220rpx;
  padding: 18rpx 0;
  text-align: center;
  border-radius: 999rpx;
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
  font-size: 28rpx;
  font-weight: 800;
}

.go-btn {
  margin-top: 24rpx;
}
</style>
