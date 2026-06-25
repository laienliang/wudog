<template>
  <view class="orders-page">
    <view class="page-head">
      <text class="kicker">我的订单</text>
      <text class="title">把预订、购物和行程都放在一张清单里</text>
    </view>

    <view class="tabs card">
      <text
        class="tab"
        :class="{ active: activeStatus === item.value }"
        v-for="item in tabs"
        :key="item.value"
        @tap="switchTab(item.value)"
      >
        {{ item.label }}
      </text>
    </view>

    <view class="order-card card" v-for="order in filteredOrders" :key="order.id" @tap="goDetail(order)">
      <view class="order-head">
        <view>
          <text class="order-title">{{ order.title }}</text>
          <text class="order-subtitle">{{ order.moduleName }} · {{ order.orderNo }}</text>
        </view>
        <text class="status" :class="statusClass(order.status)">{{ statusText(order.status) }}</text>
      </view>
      <text class="order-meta">{{ order.createdAt }}</text>
      <view class="order-bottom">
        <text class="amount">合计 ¥{{ order.amount }}</text>
        <view class="action-btn">查看详情</view>
      </view>
    </view>

    <view class="empty-state" v-if="!filteredOrders.length">
      <text class="empty-text">这里还没有订单，去逛逛把第一单补上</text>
      <view class="btn-primary go-btn" @tap="goHome">去首页</view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { get } from '../utils/request'
import { getCurrentUser, getOrders } from '../utils/local'

const tabs = [
  { label: '全部', value: -1 },
  { label: '待支付', value: 0 },
  { label: '已支付', value: 1 },
  { label: '待使用', value: 2 },
  { label: '已完成', value: 4 },
]

const activeStatus = ref(-1)
const orders = ref([])

function moduleNameOf(moduleType) {
  return {
    1: '非遗商品',
    2: '农特好物',
    3: '民宿住宿',
    4: '旅行线路',
  }[Number(moduleType)] || '文旅订单'
}

const filteredOrders = computed(() =>
  activeStatus.value === -1
    ? orders.value
    : orders.value.filter(order => Number(order.status) === Number(activeStatus.value))
)

function loadOrders() {
  get('/order/page', {
    userId: getCurrentUser().id,
    status: activeStatus.value === -1 ? '' : activeStatus.value,
    page: 1,
    pageSize: 50,
  })
    .then(res => {
      orders.value = res?.list?.length
        ? res.list.map(item => {
            const firstItem = Array.isArray(item.items) ? item.items[0] : null
            return {
              ...item,
              title: item.title || firstItem?.goodsTitle || firstItem?.title || `${moduleNameOf(item.moduleType)}订单`,
              moduleName: item.moduleName || moduleNameOf(item.moduleType),
              amount: item.payAmount ?? item.totalAmount ?? 0,
              createdAt: item.createTime || item.createdAt || '',
            }
          })
        : getOrders()
    })
    .catch(() => {
      orders.value = getOrders()
    })
}

function switchTab(status) {
  activeStatus.value = status
}

function goDetail(order) {
  uni.navigateTo({ url: `/pages_user/orderDetail?id=${order.id}` })
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' })
}

function statusText(status) {
  return {
    0: '待支付',
    1: '已支付',
    2: '待使用',
    3: '进行中',
    4: '已完成',
    5: '已取消',
    6: '已退款',
  }[Number(status)] || '待支付'
}

function statusClass(status) {
  return `status-${Number(status)}`
}

onLoad(options => {
  if (options?.status !== undefined) {
    activeStatus.value = Number(options.status)
  }
  loadOrders()
})

onShow(loadOrders)
</script>

<style lang="scss" scoped>
.orders-page {
  min-height: 100vh;
  padding: 24rpx 20rpx 32rpx;
  background:
    linear-gradient(180deg, rgba(31, 95, 168, 0.10), transparent 260rpx),
    var(--color-bg-secondary);
}

.page-head {
  padding: 8rpx 8rpx 18rpx;
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

.tabs {
  display: flex;
  gap: 8rpx;
  padding: 10rpx;
  overflow-x: auto;
}

.tab {
  flex: 1;
  min-width: 112rpx;
  padding: 16rpx 0;
  border-radius: 18rpx;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 24rpx;
}

.tab.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 700;
}

.order-card {
  margin-top: 16rpx;
}

.order-head,
.order-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}

.order-title {
  display: block;
  font-size: 30rpx;
  font-weight: 800;
}

.order-subtitle,
.order-meta {
  display: block;
  margin-top: 8rpx;
  color: var(--color-text-tertiary);
  font-size: 22rpx;
}

.status {
  flex-shrink: 0;
  font-size: 24rpx;
  font-weight: 700;
}

.status-0,
.status-2 {
  color: var(--color-cinnabar);
}

.status-1,
.status-4 {
  color: var(--color-success);
}

.status-5,
.status-6 {
  color: var(--color-text-tertiary);
}

.amount {
  color: var(--color-cinnabar);
  font-size: 28rpx;
  font-weight: 800;
}

.action-btn {
  padding: 10rpx 22rpx;
  border-radius: 999rpx;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 22rpx;
}

.empty-state {
  padding-top: 120rpx;
  text-align: center;
}

.go-btn {
  margin: 26rpx auto 0;
  width: 240rpx;
}
</style>
