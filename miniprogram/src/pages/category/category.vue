<template>
  <view class="category-page">
    <view class="category-hero">
      <text class="hero-kicker">Category</text>
      <text class="hero-title">按纹样、手艺和旅程挑选乌东</text>
    </view>
    <view class="miao-divider"></view>

    <scroll-view scroll-x class="category-tabs" enable-flex>
      <view
        class="category-tab"
        :class="{ active: activeIdx === idx }"
        v-for="(cat, idx) in categories"
        :key="cat.id || cat.name"
        @tap="switchCategory(idx)"
      >
        <ui-icon :name="cat.icon || iconOfCategory(cat.name)" :size="15" :color="activeIdx === idx ? '#fff' : 'var(--color-indigo)'" :stroke-width="2.2" />
        <text>{{ cat.name }}</text>
      </view>
    </scroll-view>

    <view class="topic-strip" v-if="topics.length">
      <text class="topic-label">社区热议</text>
      <scroll-view scroll-x class="topic-scroll">
        <text class="topic-chip" v-for="topic in topics" :key="topic.id">{{ topic.name }}</text>
      </scroll-view>
    </view>

    <view class="goods-list">
      <view class="goods-item" v-for="item in goodsList" :key="item.id" @tap="goDetail(item)">
        <image class="goods-thumb" :src="imageOf(item.mainImage)" mode="aspectFill" />
        <view class="goods-info">
          <text class="goods-type">{{ item.typeName || activeCategory.name }}</text>
          <text class="goods-title">{{ item.title }}</text>
          <text class="goods-desc">{{ item.subtitle }}</text>
          <view class="goods-footer">
            <text class="goods-price">¥{{ item.price || '--' }}</text>
            <text class="goods-sales">已售 {{ item.sales || 0 }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-if="!goodsList.length && !loading">
      <text class="empty-text">这个分类还在上新路上</text>
    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { get } from '../../utils/request'
import UiIcon from '../../components/ui-icon.vue'

const placeholder = '/static/placeholder.png'
const categories = ref([
  { id: 0, name: '全部', icon: 'category' },
  { id: 1, name: '银饰', icon: 'star' },
  { id: 2, name: '蜡染', icon: 'album' },
  { id: 3, name: '刺绣', icon: 'publish' },
  { id: 4, name: '服饰', icon: 'clothing' },
])
const topics = ref([])
const activeIdx = ref(0)
const activeCategory = computed(() => categories.value[activeIdx.value] || categories.value[0])
const goodsList = ref([])
const loading = ref(false)

const fallbackGoods = [
  { id: 1, title: '苗族银饰手镯', subtitle: '手工锻造，传承百年工艺', price: 368, mainImage: placeholder, sales: 128, typeName: '银饰' },
  { id: 2, title: '蜡染布艺挂画', subtitle: '天然植物染料，蓝白纹样', price: 198, mainImage: placeholder, sales: 86, typeName: '蜡染' },
  { id: 3, title: '苗族刺绣香包', subtitle: '精密针脚，适合作伴手礼', price: 68, mainImage: placeholder, sales: 256, typeName: '刺绣' },
]

function imageOf(src) {
  return src || placeholder
}

function iconOfCategory(name = '') {
  if (name.includes('银')) return 'star'
  if (name.includes('蜡') || name.includes('染')) return 'album'
  if (name.includes('绣')) return 'publish'
  if (name.includes('服') || name.includes('衣')) return 'clothing'
  return 'category'
}

function switchCategory(idx) {
  activeIdx.value = idx
  loadGoods()
}

function goDetail(item) {
  uni.navigateTo({ url: item.miniPath || `/pages_clothing/detail?id=${item.id}` })
}

function normalizeGoods(item) {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle || item.description,
    price: item.price,
    mainImage: item.image,
    sales: item.sales || 0,
    typeName: item.typeName,
    miniPath: item.miniPath,
  }
}

async function loadCategories() {
  try {
    const res = await get('/categories')
    if (res?.clothing?.length) {
      categories.value = [
        { id: 0, name: '全部', icon: 'category' },
        ...res.clothing.map(item => ({ id: item.id, name: item.name, icon: iconOfCategory(item.name) })),
      ]
    }
    topics.value = (res?.topics || []).slice(0, 8)
  } catch (e) {
    topics.value = []
  }
}

async function loadGoods() {
  loading.value = true
  try {
    const query = {
      type: 'clothing',
      page: 1,
      pageSize: 20,
    }
    if (activeCategory.value?.id) {
      query.categoryId = activeCategory.value.id
    }
    const res = await get('/page', query)
    goodsList.value = res?.list?.length ? res.list.map(normalizeGoods) : fallbackGoods
  } catch (e) {
    const name = activeCategory.value?.name || ''
    goodsList.value = name === '全部'
      ? fallbackGoods
      : fallbackGoods.filter(item => item.typeName === name || item.title.includes(name))
    if (!goodsList.value.length) goodsList.value = fallbackGoods
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadCategories()
  await loadGoods()
})
</script>

<style lang="scss" scoped>
.category-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 88% 0, rgba(199, 146, 57, 0.18), transparent 260rpx),
    var(--color-bg-secondary);
}

.category-hero {
  padding: 34rpx 28rpx 28rpx;
  background: linear-gradient(135deg, var(--color-night), #1f5fa8);
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
  width: 560rpx;
  margin-top: 10rpx;
  font-size: 40rpx;
  font-weight: 800;
  line-height: 1.18;
}

.category-tabs {
  padding: 22rpx 20rpx;
  white-space: nowrap;
}

.category-tab {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  height: 64rpx;
  padding: 0 28rpx;
  margin-right: 14rpx;
  border: 1rpx solid rgba(18, 36, 58, 0.08);
  border-radius: var(--radius-full);
  background: rgba(255, 250, 241, 0.92);
  color: var(--color-text-secondary);
  font-size: 26rpx;
  box-shadow: 0 8rpx 20rpx rgba(18, 36, 58, 0.05);
}

.category-tab.active {
  background: var(--color-night);
  color: #fff;
}

.topic-strip {
  margin: 0 24rpx 18rpx;
  padding: 18rpx;
  border-radius: 22rpx;
  background: rgba(255, 250, 241, 0.9);
}

.topic-label {
  display: block;
  margin-bottom: 14rpx;
  color: var(--color-cinnabar);
  font-size: 22rpx;
  font-weight: 700;
}

.topic-scroll {
  white-space: nowrap;
}

.topic-chip {
  display: inline-block;
  margin-right: 12rpx;
  padding: 8rpx 18rpx;
  border-radius: var(--radius-full);
  background: var(--color-indigo-soft);
  color: var(--color-night);
  font-size: 22rpx;
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
  height: 300rpx;
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
  font-size: 27rpx;
  font-weight: 800;
  line-height: 33rpx;
  overflow: hidden;
}

.goods-desc {
  display: block;
  height: 34rpx;
  margin-top: 6rpx;
  color: var(--color-text-tertiary);
  font-size: 22rpx;
  overflow: hidden;
}

.goods-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 14rpx;
}

.goods-price {
  color: var(--color-cinnabar);
  font-size: 32rpx;
  font-weight: 800;
}

.goods-sales {
  color: var(--color-text-tertiary);
  font-size: 20rpx;
}
</style>
