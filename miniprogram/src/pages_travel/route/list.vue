<template>
  <view class="route-list-page">
    <view class="list-hero">
      <text class="hero-kicker">Route</text>
      <text class="hero-title">把乌东的一天、两天、三天安排好</text>
    </view>
    <view class="miao-divider"></view>
    <view class="container">
      <view class="route-card" v-for="item in routes" :key="item.id" @tap="goDetail(item)">
        <image class="route-cover" :src="imageOf(item.mainImage)" mode="aspectFill" />
        <view class="route-info">
          <text class="route-title">{{ item.title }}</text>
          <text class="route-desc">{{ item.description }}</text>
          <view class="route-includes">
            <text class="include-tag" v-for="inc in (item.includes || []).slice(0, 3)" :key="inc">{{ inc }}</text>
          </view>
          <view class="route-meta">
            <text class="days">{{ item.days }} 天行程</text>
            <text class="price-tag">¥{{ item.price || '--' }} 起</text>
          </view>
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
const fallbackRoutes = [
  { id: 1, title: '乌东苗寨深度一日游', mainImage: placeholder, days: 1, includes: ['三餐', '导游', '门票'], price: 298, description: '从梯田到苗寨，把经典点位一次走完。' },
  { id: 2, title: '苗寨+梯田徒步两日游', mainImage: placeholder, days: 2, includes: ['住宿', '三餐', '徒步'], price: 498, description: '留一晚给山风和清晨的雾。' },
]

const routes = ref(fallbackRoutes)

function imageOf(src) {
  return src || placeholder
}

function goDetail(item) {
  uni.navigateTo({ url: item.miniPath || `/pages_travel/route/detail?id=${item.id}` })
}

onMounted(async () => {
  try {
    const res = await get('/page', { type: 'route', page: 1, pageSize: 20 })
    routes.value = res?.list?.length
      ? res.list.map(item => ({
          id: item.id,
          title: item.title,
          mainImage: item.image,
          days: Number((item.meta || '').match(/\d+/)?.[0] || 1),
          includes: [item.subtitle, item.typeName, item.meta].filter(Boolean),
          price: item.price || 0,
          description: item.description || item.subtitle || '乌东精选旅行线路',
          miniPath: item.miniPath,
        }))
      : fallbackRoutes
  } catch (e) {
    routes.value = fallbackRoutes
  }
})
</script>

<style lang="scss" scoped>
.route-list-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.list-hero {
  padding: 34rpx 28rpx 30rpx;
  color: #fff;
  background: linear-gradient(135deg, #1f5fa8, #153b5f);
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
  width: 560rpx;
  margin-top: 10rpx;
  font-size: 40rpx;
  font-weight: 800;
  line-height: 1.18;
}

.container {
  padding: 24rpx;
}

.route-card {
  overflow: hidden;
  margin-bottom: 22rpx;
  border-radius: 28rpx;
  background: var(--color-paper);
  box-shadow: var(--shadow-card);
}

.route-cover {
  width: 100%;
  height: 360rpx;
  background: var(--color-indigo-soft);
}

.route-info {
  padding: 22rpx;
}

.route-title {
  display: block;
  color: var(--color-ink);
  font-size: 32rpx;
  font-weight: 800;
}

.route-desc {
  display: block;
  margin-top: 10rpx;
  color: var(--color-text-secondary);
  font-size: 24rpx;
  line-height: 1.45;
}

.route-includes {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin: 16rpx 0;
}

.include-tag {
  display: inline-block;
  padding: 6rpx 14rpx;
  border-radius: var(--radius-full);
  background: var(--color-indigo-soft);
  color: var(--color-night);
  font-size: 21rpx;
}

.route-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12rpx;
}

.days {
  color: var(--color-text-secondary);
  font-size: 24rpx;
}

.price-tag {
  color: var(--color-cinnabar);
  font-size: 32rpx;
  font-weight: 800;
}
</style>
