<template>
  <view class="scenic-detail-page">
    <image class="cover" :src="scenic.mainImage" mode="aspectFill" />
    <view class="info-section card">
      <text class="title">{{ scenic.name }}</text>
      <text class="meta">评分 {{ scenic.rating }} · {{ scenic.openHours }}</text>
      <text class="address">位置 {{ scenic.address }}</text>
      <text class="desc">{{ scenic.description }}</text>
    </view>

    <view class="section card">
      <text class="section-title">门票预订</text>
      <view class="ticket-card" v-for="ticket in tickets" :key="ticket.id">
        <view>
          <text class="ticket-name">{{ ticket.name }}</text>
          <text class="ticket-tip">{{ ticket.tip }}</text>
        </view>
        <view class="ticket-action">
          <text class="ticket-price">¥{{ ticket.price }}</text>
          <view class="book-btn" @tap="book(ticket)">预订</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { get, post } from '../../utils/request'
import { getCurrentUser, appendOrder } from '../../utils/local'

const scenic = ref({
  name: '乌东梯田景区',
  mainImage: '/static/placeholder.png',
  rating: 4.8,
  openHours: '06:00-18:00',
  address: '贵州省黔东南州乌东村',
  description: '千年梯田，四季风光各异，春季灌水如镜，秋季金黄如画。',
})
const tickets = ref([
  { id: 1, name: '成人票', tip: '当天可订，扫码入园', price: 68 },
  { id: 2, name: '亲子票', tip: '1大1小，含讲解服务', price: 108 },
])

async function loadDetail(id) {
  const data = await get('/detail', { type: 'scenic', id })
  if (!data) return
  scenic.value = {
    id: data.id,
    name: data.title,
    mainImage: data.image || scenic.value.mainImage,
    rating: data.rating || 5,
    openHours: data.raw?.openHours || data.meta || scenic.value.openHours,
    address: data.address || scenic.value.address,
    description: data.description || scenic.value.description,
  }
  tickets.value = data.tickets?.length
    ? data.tickets.map(item => ({
        id: item.id,
        name: item.name,
        tip: item.description || '当天可订，扫码入园',
        price: item.price,
      }))
    : tickets.value
}

async function book(ticket) {
  const response = await post('/order/create', {
    userId: getCurrentUser().id,
    moduleType: 4,
    title: `${scenic.value.name} · ${ticket.name}`,
    totalAmount: Number(ticket.price || 0),
    payAmount: Number(ticket.price || 0),
    status: 0,
    items: [
      {
        targetId: scenic.value.id,
        title: scenic.value.name,
        quantity: 1,
        price: Number(ticket.price || 0),
      },
    ],
    remark: ticket.tip,
  })
  if (response?.order) {
    appendOrder({
      id: response.order.id,
      orderNo: response.order.orderNo,
      title: `${scenic.value.name} · ${ticket.name}`,
      moduleType: 4,
      moduleName: '景区门票',
      status: 0,
      statusText: '待支付',
      amount: Number(ticket.price || 0),
      items: response.order.items || [],
    })
    uni.showToast({ title: '门票已预订', icon: 'success' })
    setTimeout(() => uni.navigateTo({ url: `/pages_user/orderDetail?id=${response.order.id}` }), 500)
    return
  }
  uni.showToast({ title: '预订失败', icon: 'none' })
}

onLoad(async options => {
  await loadDetail(Number(options?.id || 1))
})
</script>

<style lang="scss" scoped>
.scenic-detail-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding-bottom: 20rpx;
}

.cover {
  width: 100%;
  height: 500rpx;
}

.info-section,
.section {
  margin: 16rpx 20rpx 0;
}

.title,
.section-title {
  display: block;
  font-size: 34rpx;
  font-weight: 800;
}

.meta,
.address,
.desc,
.ticket-tip {
  display: block;
  margin-top: 12rpx;
  color: var(--color-text-secondary);
  font-size: 24rpx;
  line-height: 1.7;
}

.ticket-card {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  padding: 22rpx 0;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.ticket-card:last-child {
  border-bottom: 0;
}

.ticket-name {
  font-size: 28rpx;
  font-weight: 800;
}

.ticket-action {
  text-align: right;
}

.ticket-price {
  display: block;
  color: var(--color-cinnabar);
  font-weight: 800;
}

.book-btn {
  margin-top: 10rpx;
  padding: 8rpx 24rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
  font-size: 24rpx;
}
</style>
