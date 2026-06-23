<!-- 衣-商品列表页 -->
<template>
  <view class="clothing-list-page">
    <view class="filter-bar">
      <view
        class="filter-tab"
        :class="{ active: activeFilter === item.value }"
        v-for="item in filters"
        :key="item.value"
        @tap="activeFilter = item.value"
      >
        <text>{{ item.label }}</text>
      </view>
    </view>

    <view class="goods-list">
      <view class="goods-item" v-for="(item, idx) in goodsList" :key="idx" @tap="goDetail(item)">
        <image class="goods-thumb" :src="item.mainImage" mode="aspectFill" lazy-load />
        <view class="goods-info">
          <text class="goods-title">{{ item.title }}</text>
          <text class="goods-subtitle">{{ item.subtitle }}</text>
          <view class="goods-meta">
            <text class="price">{{ item.price }}</text>
            <text class="goods-sales">已售 {{ item.sales }}</text>
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
import { ref, onMounted } from 'vue';
import { get } from '../../utils/request';

const activeFilter = ref('default');
const loading = ref(false);
const goodsList = ref([]);

const filters = [
  { label: '综合', value: 'default' },
  { label: '销量', value: 'sales' },
  { label: '价格', value: 'price' },
  { label: '最新', value: 'new' },
];

function goDetail(item) {
  wx.navigateTo({ url: `/pages_clothing/detail?id=${item.id}` });
}

onMounted(async () => {
  loading.value = true;
  try {
    const res = await get('/clothing/goods/page', { page: 1, pageSize: 20, status: 1 });
    if (res?.list) goodsList.value = res.list;
  } catch (e) {
    // 使用 mock 数据
    goodsList.value = [
      { id: 1, title: '苗族银饰手镯', subtitle: '手工锻造，传承百年工艺', price: '368', mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=银饰手镯', sales: 128 },
      { id: 2, title: '蜡染布艺挂画', subtitle: '天然植物染料，纯手工制作', price: '198', mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=蜡染挂画', sales: 86 },
      { id: 3, title: '苗族刺绣香包', subtitle: '精美刺绣，天然香料填充', price: '68', mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=刺绣香包', sales: 256 },
    ];
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.clothing-list-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.filter-bar {
  display: flex;
  background: #fff;
  padding: 16rpx 24rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.filter-tab {
  display: inline-block;
  padding: 10rpx 28rpx;
  margin-right: 16rpx;
  border-radius: var(--radius-full);
  font-size: 26rpx;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.filter-tab.active {
  background: var(--color-primary);
  color: #fff;
}

.goods-list {
  padding: 16rpx;
  display: flex;
  flex-wrap: wrap;
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
  height: 360rpx;
}

.goods-info {
  padding: 16rpx;
}

.goods-title {
  font-size: 28rpx;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-subtitle {
  font-size: 22rpx;
  color: var(--color-text-tertiary);
  margin-top: 6rpx;
  margin-bottom: 12rpx;
}

.goods-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.goods-sales {
  font-size: 20rpx;
  color: var(--color-text-tertiary);
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
