<template>
  <view class="restaurant-detail-page">
    <swiper class="detail-swiper" indicator-dots circular>
      <swiper-item v-for="(img, idx) in images" :key="idx">
        <image class="detail-img" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="info-section card">
      <text class="name">{{ restaurant.name }}</text>
      <view class="meta-row">
        <text class="rating">评分 {{ restaurant.rating }}</text>
        <text class="distance">位置 {{ restaurant.distance }}</text>
      </view>
      <text class="desc">{{ restaurant.description }}</text>
    </view>

    <view class="section card">
      <text class="section-title">招牌菜品</text>
      <view class="dish-item" v-for="(dish, idx) in dishes" :key="idx">
        <image class="dish-img" :src="dish.image" mode="aspectFill" />
        <view class="dish-info">
          <text class="dish-name">{{ dish.name }}</text>
          <text class="dish-desc">{{ dish.description }}</text>
          <text class="dish-price">{{ dish.price }}</text>
        </view>
      </view>
    </view>

    <view class="section card">
      <text class="section-title">预订餐位</text>
      <view class="form-group">
        <text class="form-label">预订日期</text>
        <picker mode="date" @change="onDateChange">
          <view class="picker-value">{{ selectedDate || '选择日期' }}</view>
        </picker>
      </view>
      <view class="form-group">
        <text class="form-label">用餐时段</text>
        <view class="time-slots">
          <view
            class="time-slot"
            :class="{ active: activeSlot === slot.id }"
            v-for="slot in timeSlots"
            :key="slot.id"
            @tap="activeSlot = slot.id"
          >
            {{ slot.name }}
          </view>
        </view>
      </view>
      <view class="form-group">
        <text class="form-label">用餐人数</text>
        <view class="count-control">
          <view class="count-btn" @tap="decreaseCount">-</view>
          <text class="count-value">{{ personCount }}</text>
          <view class="count-btn" @tap="increaseCount">+</view>
        </view>
      </view>
      <view class="form-group">
        <text class="form-label">联系人</text>
        <input class="form-input" v-model="contactName" placeholder="请输入姓名" />
      </view>
      <view class="form-group">
        <text class="form-label">联系电话</text>
        <input class="form-input" type="number" v-model="contactPhone" placeholder="请输入手机号" />
      </view>

      <view class="submit-btn" @tap="submitBooking">
        <ui-icon name="ticket" :size="18" color="#fff" />
        <text>提交预订</text>
      </view>
    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import UiIcon from '../../components/ui-icon.vue'
import { get, post } from '../../utils/request'
import { getCurrentUser, appendOrder } from '../../utils/local'

const restaurant = ref({
  name: '苗家大院',
  rating: 4.8,
  distance: '乌东村中心',
  description: '正宗苗家菜，特色长桌宴，体验最地道的乌东风味。',
})
const images = ref(['/static/placeholder.png'])
const dishes = ref([])
const timeSlots = ref([
  { id: 1, name: '午餐 11:30-13:30' },
  { id: 2, name: '晚餐 17:30-19:30' },
  { id: 3, name: '长桌宴 18:00-20:00' },
])

const activeSlot = ref(0)
const selectedDate = ref('')
const personCount = ref(2)
const contactName = ref('')
const contactPhone = ref('')

async function loadDetail(id) {
  const data = await get('/detail', { type: 'restaurant', id })
  if (!data) return
  restaurant.value = {
    name: data.title,
    rating: data.rating || 5,
    distance: data.address || data.meta || '乌东村',
    description: data.description,
  }
  images.value = data.images?.length ? data.images : data.image ? [data.image] : images.value
  dishes.value = data.dishes?.length
    ? data.dishes.map(item => ({
        name: item.name,
        price: `¥${item.price}`,
        image: item.mainImage,
        description: item.description,
      }))
    : [
        { name: '酸汤鱼', price: '¥88', image: '/static/placeholder.png', description: '苗族经典菜肴，酸辣开胃' },
      ]
}

function onDateChange(e) {
  selectedDate.value = e.detail.value
}

function increaseCount() {
  personCount.value += 1
}

function decreaseCount() {
  if (personCount.value > 1) personCount.value -= 1
}

async function submitBooking() {
  if (!selectedDate.value) {
    uni.showToast({ title: '请选择日期', icon: 'none' })
    return
  }
  if (!activeSlot.value) {
    uni.showToast({ title: '请选择时段', icon: 'none' })
    return
  }
  if (!contactName.value || !contactPhone.value) {
    uni.showToast({ title: '请填写联系信息', icon: 'none' })
    return
  }

  const response = await post('/order/create', {
    userId: getCurrentUser().id,
    moduleType: 2,
    title: `${restaurant.value.name} 餐位预订`,
    totalAmount: 0,
    payAmount: 0,
    status: 2,
    appointmentDate: selectedDate.value,
    appointmentTime: timeSlots.value.find(item => item.id === activeSlot.value)?.name || '',
    contactName: contactName.value,
    contactPhone: contactPhone.value,
    remark: `餐位预订 · ${personCount.value}人`,
    items: [
      {
        title: `${restaurant.value.name} 餐位预订`,
        restaurantName: restaurant.value.name,
        personCount: personCount.value,
        selectedDate: selectedDate.value,
        timeSlotId: activeSlot.value,
      },
    ],
  })

  if (response?.order) {
    appendOrder({
      id: response.order.id,
      orderNo: response.order.orderNo,
      title: `${restaurant.value.name} 餐位预订`,
      moduleType: 2,
      moduleName: '餐位预订',
      status: 2,
      statusText: '待使用',
      amount: 0,
      appointmentDate: selectedDate.value,
      appointmentTime: timeSlots.value.find(item => item.id === activeSlot.value)?.name || '',
      contactName: contactName.value,
      contactPhone: contactPhone.value,
      items: response.order.items || [],
    })
    uni.showToast({ title: '预订成功', icon: 'success' })
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
.restaurant-detail-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding-bottom: 110rpx;
}

.detail-swiper {
  height: 500rpx;
}

.detail-img {
  width: 100%;
  height: 100%;
}

.info-section,
.section {
  margin: 16rpx 20rpx 0;
}

.name {
  display: block;
  font-size: 36rpx;
  font-weight: 800;
}

.meta-row {
  display: flex;
  gap: 24rpx;
  margin: 16rpx 0;
  font-size: 24rpx;
  color: var(--color-text-secondary);
}

.desc {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 800;
  margin-bottom: 20rpx;
}

.dish-item {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.dish-item:last-child {
  border-bottom: 0;
}

.dish-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 18rpx;
  flex-shrink: 0;
}

.dish-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dish-name {
  font-size: 28rpx;
  font-weight: 700;
}

.dish-desc {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
}

.dish-price {
  color: var(--color-cinnabar);
  font-weight: 800;
  font-size: 30rpx;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-label {
  display: block;
  margin-bottom: 12rpx;
  color: var(--color-text-secondary);
  font-size: 26rpx;
}

.picker-value,
.form-input {
  width: 100%;
  min-height: 84rpx;
  padding: 18rpx 20rpx;
  border: 1rpx solid var(--color-border-primary);
  border-radius: 18rpx;
  background: var(--color-bg-secondary);
  font-size: 28rpx;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.time-slot {
  padding: 12rpx 22rpx;
  border: 1rpx solid var(--color-border-primary);
  border-radius: 16rpx;
  font-size: 24rpx;
}

.time-slot.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.count-control {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.count-btn {
  width: 56rpx;
  height: 56rpx;
  line-height: 56rpx;
  text-align: center;
  border: 1rpx solid var(--color-border-primary);
  border-radius: 16rpx;
  background: #fff;
  font-size: 32rpx;
}

.count-value {
  min-width: 48rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 800;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 92rpx;
  margin-top: 28rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
  font-size: 30rpx;
  font-weight: 800;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
