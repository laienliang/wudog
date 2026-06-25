<template>
  <view class="order-detail-page" v-if="order">
    <view class="status-card card">
      <text class="status">{{ statusText(order.status) }}</text>
      <text class="tip">{{ statusTip(order) }}</text>
    </view>

    <view class="info-card card">
      <text class="title">{{ order.title }}</text>
      <text class="row">订单编号：{{ order.orderNo }}</text>
      <text class="row">下单时间：{{ order.createdAt }}</text>
      <text class="row" v-if="order.appointmentDate">预约日期：{{ order.appointmentDate }}</text>
      <text class="row" v-if="order.appointmentTime">预约时段：{{ order.appointmentTime }}</text>
      <text class="row" v-if="order.contactName">联系人：{{ order.contactName }} {{ order.contactPhone }}</text>
      <text class="row" v-if="order.address">送达/入住：{{ order.address }}</text>
      <text class="row">订单金额：¥{{ order.amount }}</text>
    </view>

    <view class="code-card card">
      <text class="code">{{ order.orderNo }}</text>
      <text class="tip">核销或支付时可直接出示这个编号</text>
    </view>

    <view class="action-bar card">
      <view class="action ghost" @tap="cancelOrder" v-if="canCancel">取消订单</view>
      <view class="action primary" @tap="payOrder" v-if="canPay">去支付</view>
      <view class="action primary" @tap="finishOrder" v-if="canFinish">确认完成</view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { get, post } from '../utils/request'
import { getCurrentUser, getOrderById, updateOrder } from '../utils/local'

const order = ref(null)

const canPay = computed(() => Number(order.value?.status) === 0)
const canCancel = computed(() => [0, 1, 2, 3].includes(Number(order.value?.status)))
const canFinish = computed(() => Number(order.value?.status) === 2 || Number(order.value?.status) === 3)

function loadOrder(id) {
  const deriveTitle = item => {
    const firstItem = Array.isArray(item?.items) ? item.items[0] : null
    const moduleName = {
      1: '非遗商品',
      2: '农特好物',
      3: '民宿住宿',
      4: '旅行线路',
    }[Number(item?.moduleType)] || '文旅订单'
    return item?.title || firstItem?.goodsTitle || firstItem?.title || `${moduleName}订单`
  }

  get('/order/detail', { id, userId: getCurrentUser().id })
    .then(res => {
      if (res) {
        order.value = {
          ...res,
          amount: res.payAmount ?? res.totalAmount ?? 0,
          createdAt: res.createTime || '',
          title: deriveTitle(res),
        }
        return
      }
      order.value = getOrderById(id)
      if (!order.value) {
        uni.showToast({ title: '订单不存在', icon: 'none' })
        setTimeout(() => uni.navigateBack(), 500)
      }
    })
    .catch(() => {
      order.value = getOrderById(id)
      if (!order.value) {
        uni.showToast({ title: '订单不存在', icon: 'none' })
        setTimeout(() => uni.navigateBack(), 500)
      }
    })
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

function statusTip(item) {
  const tips = {
    0: '支付后即可进入下一步流程',
    1: '等待商家确认或安排服务',
    2: '请在预约日期前往核销',
    3: '服务正在进行中',
    4: '订单已经完成',
    5: '订单已取消',
    6: '订单已退款',
  }
  return tips[Number(item.status)] || '订单已创建'
}

function payOrder() {
  if (!order.value) return
  const nextStatus = [3, 4].includes(Number(order.value.moduleType)) ? 2 : 1
  post('/order/status', { id: order.value.id, status: nextStatus }).finally(() => {
    order.value = updateOrder(order.value.id, { status: nextStatus, statusText: statusText(nextStatus) }) || order.value
    uni.showToast({ title: '支付已完成', icon: 'success' })
  })
}

function cancelOrder() {
  if (!order.value) return
  post('/order/status', { id: order.value.id, status: 5 }).finally(() => {
    order.value = updateOrder(order.value.id, { status: 5, statusText: statusText(5) }) || order.value
    uni.showToast({ title: '订单已取消', icon: 'none' })
  })
}

function finishOrder() {
  if (!order.value) return
  post('/order/status', { id: order.value.id, status: 4 }).finally(() => {
    order.value = updateOrder(order.value.id, { status: 4, statusText: statusText(4) }) || order.value
    uni.showToast({ title: '已标记完成', icon: 'success' })
  })
}

onLoad(options => {
  loadOrder(options?.id)
})
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  padding: 20rpx;
  background:
    linear-gradient(180deg, rgba(31, 95, 168, 0.10), transparent 220rpx),
    var(--color-bg-secondary);
}

.card {
  margin-bottom: 16rpx;
}

.status-card,
.info-card,
.code-card,
.action-bar {
  padding: 28rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: var(--shadow-card);
}

.status {
  display: block;
  color: var(--color-primary);
  font-size: 36rpx;
  font-weight: 800;
}

.tip,
.row {
  display: block;
  margin-top: 12rpx;
  color: var(--color-text-secondary);
  font-size: 26rpx;
  line-height: 1.6;
}

.title {
  display: block;
  margin-bottom: 16rpx;
  font-size: 34rpx;
  font-weight: 800;
}

.code-card {
  text-align: center;
}

.code {
  display: block;
  color: var(--color-cinnabar);
  font-size: 34rpx;
  font-weight: 800;
  letter-spacing: 2rpx;
}

.action-bar {
  display: flex;
  gap: 12rpx;
}

.action {
  flex: 1;
  height: 84rpx;
  line-height: 84rpx;
  text-align: center;
  border-radius: 999rpx;
  font-size: 28rpx;
  font-weight: 700;
}

.action.ghost {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.action.primary {
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
}
</style>
