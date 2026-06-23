<!-- 食-餐厅列表页 -->
<template>
  <view class="restaurant-list-page">
    <view class="miao-divider"></view>
    <view class="container">
      <view class="restaurant-card" v-for="(item, idx) in restaurants" :key="idx" @tap="goDetail(item)">
        <image class="restaurant-cover" :src="item.cover" mode="aspectFill" />
        <view class="restaurant-info">
          <text class="restaurant-name">{{ item.name }}</text>
          <view class="restaurant-tags">
            <text class="tag tag-orange" v-for="(t, i) in item.tags" :key="i">{{ t }}</text>
          </view>
          <view class="restaurant-meta">
            <text class="rating">⭐ {{ item.rating }}</text>
            <text class="distance">📍 {{ item.distance }}</text>
          </view>
          <text class="restaurant-desc">{{ item.description }}</text>
        </view>
      </view>
    </view>
    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get } from '../../../utils/request';

const fallbackRestaurants = [
  { id: 1, name: '苗家大院', cover: 'https://via.placeholder.com/750x400/FFF1EA/E85D2F?text=苗家大院', tags: ['长桌宴', '苗家菜'], rating: 4.8, distance: '500m', description: '正宗苗家菜，特色长桌宴，体验最地道的乌东风味' },
  { id: 2, name: '梯田人家', cover: 'https://via.placeholder.com/750x400/E8F1FB/1F5FA8?text=梯田人家', tags: ['农家菜', '观景'], rating: 4.5, distance: '800m', description: '坐拥梯田美景，食材全部来自本地农家' },
];

const restaurants = ref(fallbackRestaurants);

function goDetail(item) {
  wx.navigateTo({ url: `/pages_food/restaurant/detail?id=${item.id}` });
}

onMounted(async () => {
  try {
    const res = await get('/page', { type: 'restaurant', page: 1, pageSize: 20 });
    restaurants.value = res?.list?.length
      ? res.list.map(item => ({
          id: item.id,
          name: item.title,
          cover: item.image,
          tags: ['苗家菜', item.meta].filter(Boolean),
          rating: item.rating || 5,
          distance: item.address || item.meta || '乌东村',
          description: item.description || item.subtitle,
        }))
      : fallbackRestaurants;
  } catch (e) {
    restaurants.value = fallbackRestaurants;
  }
});
</script>

<style lang="scss" scoped>
.restaurant-list-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.restaurant-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin: 16rpx;
  box-shadow: var(--shadow-light);
}

.restaurant-cover {
  width: 100%;
  height: 360rpx;
}

.restaurant-info {
  padding: 20rpx;
}

.restaurant-name {
  font-size: 32rpx;
  font-weight: 500;
  display: block;
}

.restaurant-tags {
  margin: 8rpx 0;
  display: flex;
  gap: 8rpx;
}

.restaurant-meta {
  display: flex;
  gap: 24rpx;
  font-size: 24rpx;
  color: var(--color-text-secondary);
  margin-bottom: 8rpx;
}

.restaurant-desc {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
