<template>
  <view class="hostel-detail-page">
    <swiper class="swiper" indicator-dots circular>
      <swiper-item v-for="img in images" :key="img">
        <image class="cover" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>
    <view class="info-section">
      <text class="title">{{ hostel.name }}</text>
      <text class="meta">⭐ {{ hostel.rating }} · {{ hostel.facilities }}</text>
      <text class="price">￥{{ hostel.price }}/晚起</text>
    </view>
    <view class="section">
      <text class="section-title">房型选择</text>
      <view class="room-card" v-for="room in rooms" :key="room.id">
        <text class="room-name">{{ room.name }}</text>
        <text class="room-meta">{{ room.desc }}</text>
        <view class="room-bottom">
          <text class="room-price">￥{{ room.price }}</text>
          <view class="book-btn" @tap="book(room)">预订</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get } from '../../utils/request';

const hostel = ref({ name: '梯田观景民宿', rating: 4.9, price: 388, facilities: 'WiFi/空调/观景台' });
const images = ref([
  'https://via.placeholder.com/750x500/F7F8FA/6B8E3D?text=梯田观景民宿',
  'https://via.placeholder.com/750x500/E8F1FB/1F5FA8?text=观景客房',
]);
const rooms = ref([
  { id: 1, name: '梯田大床房', desc: '1张大床，可住2人，含早餐', price: 388 },
  { id: 2, name: '苗寨家庭房', desc: '2张床，可住3人，带观景阳台', price: 568 },
]);

function book(room) {
  wx.showToast({ title: `${room.name} 已提交预订`, icon: 'none' });
}

onMounted(async () => {
  const pages = getCurrentPages();
  const current = pages[pages.length - 1];
  const id = current?.options?.id || 1;
  try {
    const data = await get('/detail', { type: 'lodging', id });
    hostel.value = {
      name: data.title,
      rating: data.rating || 5,
      price: data.rooms?.[0]?.price || data.price || hostel.value.price,
      facilities: data.raw?.facilityTags || data.description || hostel.value.facilities,
    };
    images.value = data.images?.length ? data.images : [data.image].filter(Boolean);
    rooms.value = data.rooms?.length
      ? data.rooms.map(item => ({
          id: item.id,
          name: item.name,
          desc: [item.bedType, item.area ? `${item.area}㎡` : '', item.capacity ? `可住${item.capacity}人` : ''].filter(Boolean).join(' · '),
          price: item.price,
        }))
      : rooms.value;
  } catch (e) {
    //
  }
});
</script>

<style lang="scss" scoped>
.hostel-detail-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.swiper,
.cover {
  width: 100%;
  height: 500rpx;
}

.info-section,
.section {
  padding: 28rpx;
  margin-bottom: 16rpx;
  background: #fff;
}

.title,
.section-title {
  display: block;
  font-size: 34rpx;
  font-weight: 500;
}

.meta {
  display: block;
  margin: 14rpx 0;
  color: var(--color-text-secondary);
  font-size: 24rpx;
}

.price,
.room-price {
  color: var(--color-secondary-orange);
  font-weight: bold;
}

.room-card {
  padding: 22rpx 0;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.room-name {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
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
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
  font-size: 24rpx;
}
</style>
