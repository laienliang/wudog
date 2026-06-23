<!-- 住-民宿列表页 -->
<template>
  <view class="hostel-list-page">
    <view class="miao-divider"></view>
    <view class="container">
      <view class="hostel-card" v-for="(item, idx) in hostels" :key="idx" @tap="goDetail(item)">
        <image class="hostel-cover" :src="item.mainImage" mode="aspectFill" />
        <view class="hostel-info">
          <text class="hostel-name">{{ item.name }}</text>
          <view class="hostel-tags">
            <text class="tag" v-for="(t, i) in (item.styleTags || []).slice(0, 2)" :key="i">{{ t }}</text>
          </view>
          <view class="hostel-meta">
            <text class="rating">⭐ {{ item.rating }}</text>
            <text class="facility">{{ item.facilityTags ? item.facilityTags.substring(0, 20) + '...' : '' }}</text>
          </view>
          <text class="hostel-price">￥{{ item.price }}/晚起</text>
        </view>
      </view>
    </view>
    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get } from '../../utils/request';

const fallbackHostels = [
  { id: 1, name: '梯田观景民宿', mainImage: 'https://via.placeholder.com/750x500/F7F8FA/6B8E3D?text=梯田观景', styleTags: ['田园风', '吊脚楼'], rating: 4.9, facilityTags: 'WiFi/空调/独立卫浴/观景台', price: 388 },
  { id: 2, name: '苗寨小院', mainImage: 'https://via.placeholder.com/750x500/F7F8FA/6B8E3D?text=苗寨小院', styleTags: ['民族风', '庭院'], rating: 4.7, facilityTags: 'WiFi/厨房/庭院/烧烤', price: 268 },
];

const hostels = ref(fallbackHostels);

function goDetail(item) {
  wx.navigateTo({ url: `/pages_lodging/detail?id=${item.id}` });
}

onMounted(async () => {
  try {
    const res = await get('/page', { type: 'lodging', page: 1, pageSize: 20 });
    hostels.value = res?.list?.length
      ? res.list.map(item => ({
          id: item.id,
          name: item.title,
          mainImage: item.image,
          styleTags: [item.meta, item.address].filter(Boolean),
          rating: item.rating || 5,
          facilityTags: item.description || '',
          price: item.price || 0,
        }))
      : fallbackHostels;
  } catch (e) {
    hostels.value = fallbackHostels;
  }
});
</script>

<style lang="scss" scoped>
.hostel-list-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.hostel-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin: 16rpx;
  box-shadow: var(--shadow-light);
}

.hostel-cover {
  width: 100%;
  height: 360rpx;
}

.hostel-info {
  padding: 20rpx;
}

.hostel-name {
  font-size: 32rpx;
  font-weight: 500;
  display: block;
}

.hostel-tags {
  margin: 8rpx 0;
  display: flex;
  gap: 8rpx;
}

.hostel-meta {
  display: flex;
  gap: 24rpx;
  font-size: 24rpx;
  color: var(--color-text-secondary);
  margin-bottom: 8rpx;
}

.hostel-price {
  color: var(--color-secondary-orange);
  font-weight: bold;
  font-size: 30rpx;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
