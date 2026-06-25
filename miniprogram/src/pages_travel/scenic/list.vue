<template>
  <view class="scenic-list-page">
    <view class="list-hero travel">
      <text class="hero-kicker">Travel</text>
      <text class="hero-title">从梯田走向古寨深处</text>
    </view>
    <view class="miao-divider"></view>

    <view class="container">
      <view class="scenic-card" v-for="item in scenics" :key="item.id" @tap="goDetail(item)">
        <image class="scenic-cover" :src="imageOf(item.mainImage)" mode="aspectFill" />
        <view class="scenic-info">
          <text class="scenic-name">{{ item.name }}</text>
          <text class="scenic-address">{{ item.address }}</text>
          <view class="scenic-meta">
            <text>{{ item.rating }} 分</text>
            <text>{{ item.openHours }}</text>
          </view>
          <text class="scenic-desc">{{ item.description }}</text>
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
const fallbackScenics = [
  { id: 1, name: '乌东梯田景区', mainImage: placeholder, address: '贵州省黔东南州', rating: 4.8, openHours: '06:00-18:00', description: '千年梯田，四季风光各异，春季灌水如镜，秋季金黄如画。' },
  { id: 2, name: '苗寨古村落', mainImage: placeholder, address: '乌东村内', rating: 4.6, openHours: '全天开放', description: '保存完好的苗族古建筑群，吊脚楼、风雨桥、鼓楼一应俱全。' },
]

const scenics = ref(fallbackScenics)

function imageOf(src) {
  return src || placeholder
}

function goDetail(item) {
  uni.navigateTo({ url: item.miniPath || `/pages_travel/scenic/detail?id=${item.id}` })
}

onMounted(async () => {
  try {
    const res = await get('/page', { type: 'scenic', page: 1, pageSize: 20 })
    scenics.value = res?.list?.length
      ? res.list.map(item => ({
          id: item.id,
          name: item.title,
          mainImage: item.image,
          address: item.address || item.meta || '乌东村',
          rating: item.rating || 5,
          openHours: item.meta || '全天开放',
          description: item.description || item.subtitle || '乌东特色景点',
          miniPath: item.miniPath,
        }))
      : fallbackScenics
  } catch (e) {
    scenics.value = fallbackScenics
  }
})
</script>

<style lang="scss" scoped>
.scenic-list-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.list-hero {
  padding: 34rpx 28rpx 30rpx;
  color: #fff;
  background: linear-gradient(135deg, #c79239, #836125);
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

.scenic-card {
  overflow: hidden;
  margin-bottom: 22rpx;
  border-radius: 28rpx;
  background: var(--color-paper);
  box-shadow: var(--shadow-card);
}

.scenic-cover {
  width: 100%;
  height: 380rpx;
  background: #f6ead2;
}

.scenic-info {
  padding: 22rpx;
}

.scenic-name {
  display: block;
  color: var(--color-ink);
  font-size: 32rpx;
  font-weight: 800;
}

.scenic-address,
.scenic-desc {
  display: block;
  color: var(--color-text-secondary);
  font-size: 24rpx;
  line-height: 1.45;
}

.scenic-address {
  margin-top: 10rpx;
}

.scenic-meta {
  display: flex;
  gap: 14rpx;
  margin: 14rpx 0;
  color: var(--color-cinnabar);
  font-size: 23rpx;
  font-weight: 700;
}

.scenic-desc {
  color: var(--color-text-tertiary);
}
</style>
