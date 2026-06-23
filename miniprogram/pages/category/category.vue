<!-- 分类页 -->
<template>
  <view class="category-page">
    <view class="miao-divider"></view>

    <!-- 一级分类 Tab -->
    <scroll-view scroll-x class="category-tabs">
      <view
        class="category-tab"
        :class="{ active: activeIdx === idx }"
        v-for="(cat, idx) in categories"
        :key="idx"
        @tap="switchCategory(idx)"
      >
        <text>{{ cat.name }}</text>
      </view>
    </scroll-view>

    <!-- 二级分类网格 -->
    <view class="sub-grid" v-if="activeCategory.children && activeCategory.children.length > 0">
      <view
        class="sub-item"
        v-for="(sub, idx) in activeCategory.children"
        :key="idx"
        @tap="goSubCategory(sub)"
      >
        <image class="sub-icon" :src="sub.icon || '/static/placeholder.png'" mode="aspectFill" />
        <text class="sub-name">{{ sub.name }}</text>
      </view>
    </view>

    <!-- 分类商品列表 -->
    <view class="goods-list">
      <view class="goods-item" v-for="(item, idx) in goodsList" :key="idx" @tap="goDetail(item)">
        <image class="goods-thumb" :src="item.mainImage" mode="aspectFill" />
        <view class="goods-info">
          <text class="goods-title">{{ item.title }}</text>
          <text class="goods-tags">
            <text class="tag" v-for="(t, i) in (item.tags || [])" :key="i">{{ t }}</text>
          </text>
          <text class="goods-price">¥{{ item.price }}</text>
        </view>
      </view>
    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { get } from '../../utils/request';

const categories = ref([
  { name: '银饰', children: [
    { name: '手镯', icon: '' },
    { name: '头饰', icon: '' },
    { name: '项圈', icon: '' },
  ]},
  { name: '蜡染', children: [
    { name: '布料', icon: '' },
    { name: '服饰', icon: '' },
    { name: '装饰画', icon: '' },
  ]},
  { name: '刺绣', children: [
    { name: '苗服', icon: '' },
    { name: '香包', icon: '' },
  ]},
  { name: '服饰', children: [
    { name: '日常款', icon: '' },
    { name: '节庆款', icon: '' },
  ]},
]);

const activeIdx = ref(0);
const activeCategory = computed(() => categories.value[activeIdx.value]);

const goodsList = ref([]);
const loading = ref(false);

const fallbackGoods = [
  { id: 1, title: '苗族银饰手镯', price: '368', mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=银饰手镯', tags: ['银饰', '手工'] },
  { id: 2, title: '蜡染布艺挂画', price: '198', mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=蜡染挂画', tags: ['蜡染', '非遗'] },
  { id: 3, title: '苗族刺绣香包', price: '68', mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=刺绣香包', tags: ['刺绣', '伴手礼'] },
  { id: 4, title: '节庆苗服体验款', price: '299', mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=节庆苗服', tags: ['服饰', '节庆'] },
];

function switchCategory(idx) {
  activeIdx.value = idx;
  loadGoods();
}

function goSubCategory(sub) {
  wx.navigateTo({ url: `/pages_clothing/list?parentId=${sub.name}` });
}

function goDetail(item) {
  wx.navigateTo({ url: `/pages_clothing/detail?id=${item.id}` });
}

async function loadGoods() {
  loading.value = true;
  try {
    const categoryRes = await get('/categories');
    if (categoryRes?.clothing?.length) {
      categories.value = categoryRes.clothing.map(item => ({ ...item, children: [] }));
    }
    const res = await get('/page', {
      type: 'clothing',
      page: 1,
      pageSize: 20,
      keyword: activeCategory.value?.name,
    });
    goodsList.value = res?.list?.length
      ? res.list.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          mainImage: item.image,
          tags: [item.typeName, item.meta].filter(Boolean),
        }))
      : fallbackGoods;
  } catch (e) {
    goodsList.value = fallbackGoods.filter((item) => {
      const name = activeCategory.value?.name || '';
      return item.title.includes(name) || (item.tags || []).includes(name);
    });
    if (!goodsList.value.length) goodsList.value = fallbackGoods;
  } finally {
    loading.value = false;
  }
}

onMounted(loadGoods);
</script>

<style lang="scss" scoped>
.category-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.category-tabs {
  display: flex;
  background: #fff;
  padding: 16rpx 0;
  white-space: nowrap;
}

.category-tab {
  display: inline-block;
  padding: 12rpx 32rpx;
  margin: 0 12rpx;
  font-size: 28rpx;
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
}

.category-tab.active {
  background: var(--color-primary);
  color: #fff;
}

.sub-grid {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  padding: 24rpx;
  gap: 20rpx;
}

.sub-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(33.33% - 28rpx);
}

.sub-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: var(--radius-lg);
  margin-bottom: 8rpx;
}

.sub-name {
  font-size: 24rpx;
  color: var(--color-text-primary);
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  padding: 16rpx;
  gap: 16rpx;
}

.goods-item {
  display: flex;
  flex-direction: column;
  width: calc(50% - 8rpx);
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.goods-thumb {
  width: 100%;
  height: 300rpx;
}

.goods-info {
  padding: 16rpx;
}

.goods-title {
  font-size: 26rpx;
  color: var(--color-text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8rpx;
}

.goods-tags {
  margin-bottom: 8rpx;
}

.goods-price {
  font-weight: bold;
  color: var(--color-secondary-orange);
  font-size: 32rpx;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
