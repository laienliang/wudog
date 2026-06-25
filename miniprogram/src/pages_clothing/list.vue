<template>
  <view class="clothing-list-page">
    <view class="list-hero">
      <text class="hero-kicker">Handcraft</text>
      <text class="hero-title">把银饰、蜡染和刺绣带回家</text>
    </view>

    <scroll-view scroll-x class="filter-bar" enable-flex>
      <view
        class="filter-tab"
        :class="{ active: activeFilter === item.value }"
        v-for="item in filters"
        :key="item.value"
        @tap="switchFilter(item.value)"
      >
        <text>{{ item.label }}</text>
      </view>
    </scroll-view>

    <view class="goods-list">
      <view class="goods-item" v-for="item in sortedGoods" :key="item.id" @tap="goDetail(item)">
        <image class="goods-thumb" :src="imageOf(item.mainImage)" mode="aspectFill" lazy-load />
        <view class="goods-info">
          <text class="goods-type">{{ item.typeName || '非遗商品' }}</text>
          <text class="goods-title">{{ item.title }}</text>
          <text class="goods-subtitle">{{ item.subtitle }}</text>
          <view class="goods-meta">
            <text class="price">{{ item.price || '--' }}</text>
            <text class="goods-sales">{{ item.sales || 0 }} 人带走</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-if="!goodsList.length && !loading">
      <text class="empty-text">暂无商品</text>
    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { get } from '../utils/request'

const placeholder = '/static/placeholder.png'
const activeFilter = ref('default')
const loading = ref(false)
const goodsList = ref([])

const filters = [
  { label: '综合', value: 'default' },
  { label: '销量', value: 'sales' },
  { label: '价格', value: 'price' },
  { label: '最新', value: 'new' },
]

const sortedGoods = computed(() => {
  const list = [...goodsList.value]
  if (activeFilter.value === 'sales') return list.sort((a, b) => Number(b.sales || 0) - Number(a.sales || 0))
  if (activeFilter.value === 'price') return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
  return list
})

function imageOf(src) {
  return src || placeholder
}

function switchFilter(value) {
  activeFilter.value = value
}

function goDetail(item) {
  uni.navigateTo({ url: item.miniPath || `/pages_clothing/detail?id=${item.id}` })
}

function normalize(item) {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle || item.description || item.meta,
    price: item.price,
    mainImage: item.image,
    sales: item.sales || 0,
    typeName: item.typeName,
    miniPath: item.miniPath,
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await get('/page', { type: 'clothing', page: 1, pageSize: 24 })
    goodsList.value = res?.list?.length ? res.list.map(normalize) : []
  } catch (e) {
    goodsList.value = [
      { id: 1, title: '苗族银饰手镯', subtitle: '手工锻造，传承百年工艺', price: 368, mainImage: placeholder, sales: 128 },
      { id: 2, title: '蜡染布艺挂画', subtitle: '天然植物染料，纯手工制作', price: 198, mainImage: placeholder, sales: 86 },
      { id: 3, title: '苗族刺绣香包', subtitle: '精美刺绣，天然香料填充', price: 68, mainImage: placeholder, sales: 256 },
    ]
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.clothing-list-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.list-hero {
  padding: 34rpx 28rpx 30rpx;
  background: linear-gradient(135deg, #12243a, #1f5fa8);
  color: #fff;
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

.filter-bar {
  padding: 22rpx 24rpx;
  white-space: nowrap;
}

.filter-tab {
  display: inline-flex;
  align-items: center;
  height: 62rpx;
  padding: 0 28rpx;
  margin-right: 14rpx;
  border: 1rpx solid rgba(18, 36, 58, 0.08);
  border-radius: var(--radius-full);
  background: var(--color-paper);
  color: var(--color-text-secondary);
  font-size: 25rpx;
}

.filter-tab.active {
  background: var(--color-night);
  color: #fff;
}

.goods-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;
  padding: 0 24rpx 24rpx;
}

.goods-item {
  overflow: hidden;
  border-radius: 24rpx;
  background: var(--color-paper);
  box-shadow: var(--shadow-card);
}

.goods-thumb {
  width: 100%;
  height: 340rpx;
  background: var(--color-indigo-soft);
}

.goods-info {
  padding: 18rpx;
}

.goods-type {
  color: var(--color-cinnabar);
  font-size: 20rpx;
}

.goods-title {
  display: block;
  height: 66rpx;
  margin-top: 6rpx;
  color: var(--color-ink);
  font-size: 28rpx;
  font-weight: 800;
  line-height: 33rpx;
  overflow: hidden;
}

.goods-subtitle {
  display: block;
  height: 34rpx;
  margin-top: 6rpx;
  color: var(--color-text-tertiary);
  font-size: 22rpx;
  overflow: hidden;
}

.goods-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 14rpx;
}

.goods-sales {
  color: var(--color-text-tertiary);
  font-size: 20rpx;
}
</style>
