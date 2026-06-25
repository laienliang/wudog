<template>
  <view class="hostel-list-page">
    <view class="list-hero stay">
      <text class="hero-kicker">Stay</text>
      <text class="hero-title">住进有山风穿过的吊脚楼</text>
    </view>
    <view class="miao-divider"></view>

    <view class="container">
      <view class="hostel-card" v-for="item in hostels" :key="item.id" @tap="goDetail(item)">
        <image class="hostel-cover" :src="imageOf(item.mainImage)" mode="aspectFill" />
        <view class="hostel-info">
          <view class="title-row">
            <text class="hostel-name">{{ item.name }}</text>
            <text class="hostel-price">¥{{ item.price || '--' }} 起</text>
          </view>
          <view class="hostel-tags">
            <text class="tag" v-for="t in (item.styleTags || []).slice(0, 2)" :key="t">{{ t }}</text>
          </view>
          <text class="hostel-meta">{{ item.facilityTags || '观景、安静、适合慢住' }}</text>
          <text class="rating">{{ item.rating }} 分 · {{ item.address }}</text>
        </view>
      </view>
    </view>
    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '../utils/request'

const placeholder = '/static/placeholder.png'
const fallbackHostels = [
  { id: 1, name: '梯田观景民宿', mainImage: placeholder, styleTags: ['田园风', '吊脚楼'], rating: 4.9, facilityTags: 'WiFi/空调/独立卫浴/观景台', price: 388, address: '梯田旁' },
  { id: 2, name: '苗寨小院', mainImage: placeholder, styleTags: ['民族风', '庭院'], rating: 4.7, facilityTags: 'WiFi/厨房/庭院/烧烤', price: 268, address: '古寨内' },
]

const hostels = ref(fallbackHostels)

function imageOf(src) {
  return src || placeholder
}

function goDetail(item) {
  uni.navigateTo({ url: item.miniPath || `/pages_lodging/detail?id=${item.id}` })
}

onMounted(async () => {
  try {
    const res = await get('/page', { type: 'lodging', page: 1, pageSize: 20 })
    hostels.value = res?.list?.length
      ? res.list.map(item => ({
          id: item.id,
          name: item.title,
          mainImage: item.image,
          styleTags: [item.meta, item.address].filter(Boolean),
          rating: item.rating || 5,
          facilityTags: item.description || item.subtitle || '',
          price: item.price || 0,
          address: item.address || item.meta || '乌东村',
          miniPath: item.miniPath,
        }))
      : fallbackHostels
  } catch (e) {
    hostels.value = fallbackHostels
  }
})
</script>

<style lang="scss" scoped>
.hostel-list-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.list-hero {
  padding: 34rpx 28rpx 30rpx;
  color: #fff;
  background: linear-gradient(135deg, #5f7d50, #2f4d36);
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

.hostel-card {
  overflow: hidden;
  margin-bottom: 22rpx;
  border-radius: 28rpx;
  background: var(--color-paper);
  box-shadow: var(--shadow-card);
}

.hostel-cover {
  width: 100%;
  height: 380rpx;
  background: #edf4e7;
}

.hostel-info {
  padding: 22rpx;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20rpx;
}

.hostel-name {
  flex: 1;
  color: var(--color-ink);
  font-size: 32rpx;
  font-weight: 800;
  line-height: 1.25;
}

.hostel-price {
  color: var(--color-cinnabar);
  font-size: 28rpx;
  font-weight: 800;
}

.hostel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin: 14rpx 0;
}

.hostel-meta,
.rating {
  display: block;
  color: var(--color-text-secondary);
  font-size: 24rpx;
  line-height: 1.45;
}

.rating {
  margin-top: 12rpx;
  color: var(--color-text-tertiary);
}
</style>
