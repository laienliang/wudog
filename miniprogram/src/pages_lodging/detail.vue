<template>
  <view class="hostel-detail-page">
    <swiper class="swiper" indicator-dots circular>
      <swiper-item v-for="img in images" :key="img">
        <image class="cover" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="info-section card">
      <text class="title">{{ hostel.name }}</text>
      <text class="meta">评分 {{ hostel.rating }} · {{ hostel.facilities }}</text>
      <text class="price">¥{{ hostel.price }}/晚起</text>
    </view>

    <view class="section card">
      <text class="section-title">房型选择</text>
      <view class="room-card" v-for="room in rooms" :key="room.id">
        <text class="room-name">{{ room.name }}</text>
        <text class="room-meta">{{ room.desc }}</text>
        <view class="room-bottom">
          <text class="room-price">¥{{ room.price }}</text>
          <view class="book-btn" @tap="book(room)">预订</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { get, post } from '../utils/request'
import { getCurrentUser, appendOrder } from '../utils/local'

const hostel = ref({ name: '梯田观景民宿', rating: 4.9, price: 388, facilities: 'WiFi/空调/观景台' })
const images = ref(['/static/placeholder.png'])
const rooms = ref([
  { id: 1, name: '梯田大床房', desc: '1张大床，可住2人，含早餐', price: 388 },
  { id: 2, name: '苗寨家庭房', desc: '2张床，可住3人，带观景阳台', price: 568 },
])

async function loadDetail(id) {
  const data = await get('/detail', { type: 'lodging', id })
  if (!data) return
  hostel.value = {
    name: data.title,
    rating: data.rating || 5,
    price: data.rooms?.[0]?.price || data.price || hostel.value.price,
    facilities: data.raw?.facilityTags || data.description || hostel.value.facilities,
  }
  images.value = data.images?.length ? data.images : data.image ? [data.image] : images.value
  rooms.value = data.rooms?.length
    ? data.rooms.map(item => ({
        id: item.id,
        name: item.name,
        desc: [item.bedType, item.area ? `${item.area}㎡` : '', item.capacity ? `可住${item.capacity}人` : ''].filter(Boolean).join(' · '),
        price: item.price,
      }))
    : rooms.value
}

async function book(room) {
  const response = await post('/order/create', {
    userId: getCurrentUser().id,
    moduleType: 3,
    title: `${hostel.value.name} · ${room.name}`,
    totalAmount: Number(room.price || 0),
    payAmount: Number(room.price || 0),
    status: 0,
    items: [
      {
        hostelName: hostel.value.name,
        roomTypeName: room.name,
        roomTypeId: room.id,
        nights: 1,
        price: Number(room.price || 0),
      },
    ],
    remark: room.desc,
  })
  if (response?.order) {
    appendOrder({
      id: response.order.id,
      orderNo: response.order.orderNo,
      title: `${hostel.value.name} · ${room.name}`,
      moduleType: 3,
      moduleName: '民宿住宿',
      status: 0,
      statusText: '待支付',
      amount: Number(room.price || 0),
      items: response.order.items || [],
    })
    uni.showToast({ title: '预订已提交', icon: 'success' })
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
.hostel-detail-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding-bottom: 30rpx;
}

.swiper,
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

.meta {
  display: block;
  margin: 14rpx 0;
  color: var(--color-text-secondary);
  font-size: 24rpx;
}

.price,
.room-price {
  color: var(--color-cinnabar);
  font-weight: 800;
}

.room-card {
  padding: 22rpx 0;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.room-name {
  display: block;
  font-size: 28rpx;
  font-weight: 800;
}

.room-meta {
  display: block;
  margin: 10rpx 0 16rpx;
  color: var(--color-text-tertiary);
  font-size: 24rpx;
}

.room-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.book-btn {
  padding: 10rpx 30rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
  font-size: 24rpx;
}
</style>
