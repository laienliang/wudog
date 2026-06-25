<template>
  <view class="restaurant-list-page">
    <view class="list-hero food">
      <text class="hero-kicker">Taste</text>
      <text class="hero-title">从长桌宴开始认识乌东</text>
    </view>
    <view class="miao-divider"></view>

    <view class="container">
      <view class="restaurant-card" v-for="item in restaurants" :key="item.id" @tap="goDetail(item)">
        <image class="restaurant-cover" :src="imageOf(item.cover)" mode="aspectFill" />
        <view class="restaurant-info">
          <view class="title-row">
            <text class="restaurant-name">{{ item.name }}</text>
            <text class="rating">{{ item.rating }} 分</text>
          </view>
          <view class="restaurant-tags">
            <text class="tag tag-orange" v-for="t in item.tags" :key="t">{{ t }}</text>
          </view>
          <text class="restaurant-desc">{{ item.description }}</text>
          <text class="restaurant-address">{{ item.distance }}</text>
        </view>
      </view>
    </view>
    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '../../utils/request'

const placeholder = '/static/placeholder.png'
const fallbackRestaurants = [
  { id: 1, name: '苗家大院', cover: placeholder, tags: ['长桌宴', '苗家菜'], rating: 4.8, distance: '乌东村中心', description: '正宗苗家菜，特色长桌宴，体验最地道的乌东风味' },
  { id: 2, name: '梯田人家', cover: placeholder, tags: ['农家菜', '观景'], rating: 4.5, distance: '梯田观景口', description: '坐拥梯田美景，食材来自本地农家' },
]

const restaurants = ref(fallbackRestaurants)

function imageOf(src) {
  return src || placeholder
}

function goDetail(item) {
  uni.navigateTo({ url: item.miniPath || `/pages_food/restaurant/detail?id=${item.id}` })
}

onMounted(async () => {
  try {
    const res = await get('/page', { type: 'restaurant', page: 1, pageSize: 20 })
    restaurants.value = res?.list?.length
      ? res.list.map(item => ({
          id: item.id,
          name: item.title,
          cover: item.image,
          tags: ['苗家菜', item.meta].filter(Boolean).slice(0, 2),
          rating: item.rating || 5,
          distance: item.address || item.meta || '乌东村',
          description: item.description || item.subtitle || '乌东本地风味餐厅',
          miniPath: item.miniPath,
        }))
      : fallbackRestaurants
  } catch (e) {
    restaurants.value = fallbackRestaurants
  }
})
</script>

<style lang="scss" scoped>
.restaurant-list-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.list-hero {
  padding: 34rpx 28rpx 30rpx;
  color: #fff;
  background: linear-gradient(135deg, #d84b2a, #8e2f20);
}

.hero-kicker,
.hero-title {
  display: block;
}

.hero-kicker {
  font-size: 20rpx;
  opacity: 0.72;
}

.hero-title {
  width: 520rpx;
  margin-top: 10rpx;
  font-size: 40rpx;
  font-weight: 800;
  line-height: 1.18;
}

.container {
  padding: 24rpx;
}

.restaurant-card {
  overflow: hidden;
  margin-bottom: 22rpx;
  border-radius: 28rpx;
  background: var(--color-paper);
  box-shadow: var(--shadow-card);
}

.restaurant-cover {
  width: 100%;
  height: 360rpx;
  background: #fff0e7;
}

.restaurant-info {
  padding: 22rpx;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.restaurant-name {
  flex: 1;
  color: var(--color-ink);
  font-size: 32rpx;
  font-weight: 800;
  line-height: 1.25;
}

.rating {
  padding: 8rpx 14rpx;
  border-radius: var(--radius-full);
  background: rgba(216, 75, 42, 0.1);
  color: var(--color-cinnabar);
  font-size: 22rpx;
  font-weight: 700;
}

.restaurant-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin: 14rpx 0;
}

.restaurant-desc,
.restaurant-address {
  display: block;
  color: var(--color-text-secondary);
  font-size: 24rpx;
  line-height: 1.45;
}

.restaurant-address {
  margin-top: 12rpx;
  color: var(--color-text-tertiary);
}
</style>
