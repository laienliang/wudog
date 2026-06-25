<template>
  <view class="agri-page">
    <view class="list-hero">
      <text class="hero-kicker">Harvest</text>
      <text class="hero-title">把梯田和山花的味道带走</text>
    </view>
    <view class="miao-divider"></view>
    <view class="goods-list">
      <view class="goods-card" v-for="item in goods" :key="item.id" @tap="goDetail(item)">
        <image class="goods-cover" :src="imageOf(item.image)" mode="aspectFill" />
        <view class="goods-info">
          <text class="goods-title">{{ item.title }}</text>
          <text class="goods-desc">{{ item.description }}</text>
          <view class="goods-footer">
            <text class="goods-price">¥{{ item.price || '--' }}</text>
            <text class="goods-origin">{{ item.origin }}</text>
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
const goods = ref([
  { id: 1, title: '梯田红米', price: 39, image: placeholder, description: '高山梯田自然生长，米香浓郁。', origin: '乌东梯田' },
  { id: 2, title: '苗寨蜂蜜', price: 58, image: placeholder, description: '山花蜜源，清甜不腻。', origin: '苗岭山花' },
])

function imageOf(src) {
  return src || placeholder
}

function goDetail(item) {
  uni.navigateTo({ url: item.miniPath || `/pages_food/agriculture/detail?id=${item.id}` })
}

onMounted(async () => {
  try {
    const res = await get('/page', { type: 'agriculture', page: 1, pageSize: 20 })
    if (res?.list?.length) {
      goods.value = res.list.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        description: item.description || item.subtitle || '乌东农特好物',
        origin: item.meta || '乌东',
        miniPath: item.miniPath,
      }))
    }
  } catch (e) {
    // 使用本地兜底数据
  }
})
</script>

<style lang="scss" scoped>
.agri-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.list-hero {
  padding: 34rpx 28rpx 30rpx;
  color: #fff;
  background: linear-gradient(135deg, #5f7d50, #c79239);
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

.goods-list {
  padding: 24rpx;
}

.goods-card {
  margin-bottom: 22rpx;
  overflow: hidden;
  border-radius: 28rpx;
  background: var(--color-paper);
  box-shadow: var(--shadow-card);
}

.goods-cover {
  width: 100%;
  height: 340rpx;
  background: #edf4e7;
}

.goods-info {
  padding: 22rpx;
}

.goods-title {
  display: block;
  color: var(--color-ink);
  font-size: 32rpx;
  font-weight: 800;
}

.goods-desc {
  display: block;
  margin: 10rpx 0 16rpx;
  color: var(--color-text-secondary);
  font-size: 24rpx;
  line-height: 1.45;
}

.goods-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-price {
  color: var(--color-cinnabar);
  font-size: 32rpx;
  font-weight: 800;
}

.goods-origin {
  color: var(--color-text-tertiary);
  font-size: 22rpx;
}
</style>
