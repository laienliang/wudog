<!-- 食-餐厅详情页（含餐位预订） -->
<template>
  <view class="restaurant-detail-page">
    <swiper class="detail-swiper" indicator-dots circular>
      <swiper-item v-for="(img, idx) in images" :key="idx">
        <image class="detail-img" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="info-section">
      <text class="name">{{ restaurant.name }}</text>
      <view class="meta-row">
        <text class="rating">⭐ {{ restaurant.rating }}</text>
        <text class="distance">📍 {{ restaurant.distance }}</text>
      </view>
      <text class="desc">{{ restaurant.description }}</text>
    </view>

    <view class="miao-divider"></view>

    <!-- 菜品列表 -->
    <view class="section">
      <text class="section-title">招牌菜品</text>
      <view class="dish-item" v-for="(dish, idx) in dishes" :key="idx">
        <image class="dish-img" :src="dish.image" mode="aspectFill" />
        <view class="dish-info">
          <text class="dish-name">{{ dish.name }}</text>
          <text class="dish-desc">{{ dish.description }}</text>
          <text class="dish-price">¥{{ dish.price }}</text>
        </view>
      </view>
    </view>

    <view class="miao-divider"></view>

    <!-- 餐位预订 -->
    <view class="section">
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

      <view class="submit-btn" @tap="submitBooking">提交预订</view>
    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const restaurant = ref({
  name: '苗家大院',
  rating: 4.8,
  distance: '500m',
  description: '正宗苗家菜，特色长桌宴，体验最地道的乌东风味。采用本地新鲜食材，传承百年烹饪技艺。',
});

const images = ref([
  'https://via.placeholder.com/750x500/FFF1EA/E85D2F?text=苗家大院',
  'https://via.placeholder.com/750x500/FFF1EA/E85D2F?text=店内环境',
]);

const dishes = ref([
  { name: '酸汤鱼', price: '88', image: 'https://via.placeholder.com/200x200/F7F8FA/E85D2F?text=酸汤鱼', description: '苗族经典菜肴，酸辣开胃' },
  { name: '腊肉炒蕨菜', price: '58', image: 'https://via.placeholder.com/200x200/F7F8FA/E85D2F?text=腊肉', description: '农家烟熏腊肉，搭配新鲜蕨菜' },
]);

const timeSlots = ref([
  { id: 1, name: '午餐 11:30-13:30' },
  { id: 2, name: '晚餐 17:30-19:30' },
  { id: 3, name: '长桌宴 18:00-20:00' },
]);

const activeSlot = ref(0);
const selectedDate = ref('');
const personCount = ref(2);
const contactName = ref('');
const contactPhone = ref('');

function onDateChange(e) {
  selectedDate.value = e.detail.value;
}

function increaseCount() { personCount.value++; }
function decreaseCount() { if (personCount.value > 1) personCount.value--; }

function submitBooking() {
  if (!selectedDate.value) {
    wx.showToast({ title: '请选择日期', icon: 'none' });
    return;
  }
  if (!contactName.value || !contactPhone.value) {
    wx.showToast({ title: '请填写联系信息', icon: 'none' });
    return;
  }
  wx.showToast({ title: '预订成功！', icon: 'success' });
}
</script>

<style lang="scss" scoped>
.restaurant-detail-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.detail-swiper {
  height: 500rpx;
}

.detail-img {
  width: 100%;
  height: 100%;
}

.info-section {
  background: #fff;
  padding: 32rpx;
}

.name {
  font-size: 36rpx;
  font-weight: 500;
}

.meta-row {
  display: flex;
  gap: 24rpx;
  margin: 16rpx 0;
  font-size: 26rpx;
  color: var(--color-text-secondary);
}

.desc {
  font-size: 26rpx;
  color: var(--color-text-tertiary);
  line-height: 1.6;
}

.section {
  background: #fff;
  padding: 32rpx;
  margin-top: 16rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 500;
  margin-bottom: 24rpx;
  display: block;
}

.dish-item {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.dish-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: var(--radius-md);
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
  font-weight: 500;
}

.dish-desc {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
}

.dish-price {
  color: var(--color-secondary-orange);
  font-weight: bold;
  font-size: 30rpx;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-label {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  margin-bottom: 12rpx;
  display: block;
}

.picker-value,
.form-input {
  width: 100%;
  padding: 16rpx 20rpx;
  border: 1rpx solid var(--color-border-primary);
  border-radius: var(--radius-md);
  font-size: 28rpx;
  background: var(--color-bg-secondary);
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.time-slot {
  padding: 12rpx 28rpx;
  border: 1rpx solid var(--color-border-primary);
  border-radius: var(--radius-md);
  font-size: 26rpx;
}

.time-slot.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.count-control {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.count-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx solid var(--color-border-primary);
  border-radius: var(--radius-md);
  font-size: 32rpx;
  background: #fff;
}

.count-value {
  font-size: 32rpx;
  font-weight: 500;
  min-width: 48rpx;
  text-align: center;
}

.submit-btn {
  background: var(--color-primary);
  color: #fff;
  text-align: center;
  padding: 24rpx;
  border-radius: var(--radius-lg);
  font-size: 30rpx;
  margin-top: 32rpx;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
