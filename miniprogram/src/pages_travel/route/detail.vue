<template>
  <view class="route-detail-page">
    <image class="cover" :src="route.mainImage" mode="aspectFill" />
    <view class="info-section card">
      <text class="title">{{ route.title }}</text>
      <text class="price">¥{{ route.price }}起</text>
      <view class="include-list">
        <text class="include-tag" v-for="item in route.includes" :key="item">{{ item }}</text>
      </view>
    </view>
    <view class="section card">
      <text class="section-title">行程安排</text>
      <view class="day-card" v-for="day in days" :key="day.day">
        <text class="day-title">第{{ day.day }}天 · {{ day.title }}</text>
        <text class="day-desc">{{ day.desc }}</text>
      </view>
    </view>
    <view class="bottom-btn" @tap="bookRoute">
      <ui-icon name="ticket" :size="18" color="#fff" />
      <text>立即预订</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import UiIcon from '../../components/ui-icon.vue'
import { get, post } from '../../utils/request'
import { getCurrentUser, appendOrder } from '../../utils/local'

const route = ref({
  title: '乌东苗寨深度一日游',
  mainImage: '/static/placeholder.png',
  price: 298,
  includes: ['三餐', '导游', '门票', '银饰体验'],
})
const days = ref([
  { day: 1, title: '苗寨迎宾与梯田漫游', desc: '上午游览苗寨古村落，午餐体验长桌宴，下午前往梯田观景台并参加银饰体验。' },
])

async function loadDetail(id) {
  const data = await get('/detail', { type: 'route', id })
  if (!data) return
  route.value = {
    id: data.id,
    title: data.title,
    mainImage: data.image || route.value.mainImage,
    price: data.price || route.value.price,
    includes: data.raw?.includes || route.value.includes,
  }
  days.value = data.days?.length
    ? data.days.map(item => ({
        day: item.day,
        title: item.title,
        desc: item.content || item.desc,
      }))
    : days.value
}

async function bookRoute() {
  const response = await post('/order/create', {
    userId: getCurrentUser().id,
    moduleType: 4,
    title: route.value.title,
    totalAmount: Number(route.value.price || 0),
    payAmount: Number(route.value.price || 0),
    status: 0,
    items: [
      {
        targetId: route.value.id,
        title: route.value.title,
        quantity: 1,
        price: Number(route.value.price || 0),
      },
    ],
    remark: route.value.includes.join(' / '),
  })
  if (response?.order) {
    appendOrder({
      id: response.order.id,
      orderNo: response.order.orderNo,
      title: route.value.title,
      moduleType: 4,
      moduleName: '旅行线路',
      status: 0,
      statusText: '待支付',
      amount: Number(route.value.price || 0),
      items: response.order.items || [],
    })
    uni.showToast({ title: '线路预订已提交', icon: 'success' })
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
.route-detail-page {
  min-height: 100vh;
  padding-bottom: 132rpx;
  background: var(--color-bg-secondary);
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

.price {
  display: block;
  margin: 16rpx 0;
  color: var(--color-cinnabar);
  font-size: 40rpx;
  font-weight: 800;
}

.include-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.include-tag {
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 22rpx;
}

.day-card {
  padding: 22rpx 0;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.day-card:last-child {
  border-bottom: 0;
}

.day-title {
  display: block;
  font-size: 28rpx;
  font-weight: 800;
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
  left: 20rpx;
  right: 20rpx;
  bottom: calc(18rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 92rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
  font-size: 30rpx;
  font-weight: 800;
  box-shadow: 0 16rpx 34rpx rgba(31, 95, 168, 0.24);
}
</style>
