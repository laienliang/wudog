<template>
  <view class="search-page">
    <view class="search-head">
      <input class="search-input" v-model="keyword" placeholder="搜索景点、美食、民宿、好物" confirm-type="search" @confirm="doSearch" />
      <view class="search-btn" @tap="doSearch">搜索</view>
    </view>

    <view class="quick-tags" v-if="!searched">
      <text class="quick-title">热门搜索</text>
      <view class="tag-list">
        <text class="quick-tag" v-for="item in hotWords" :key="item" @tap="useKeyword(item)">{{ item }}</text>
      </view>
    </view>

    <view class="result-list" v-else>
      <view class="result-item" v-for="item in results" :key="item.id" @tap="goResult(item)">
        <image class="result-cover" :src="item.image" mode="aspectFill" />
        <view class="result-info">
          <text class="result-title">{{ item.title }}</text>
          <text class="result-type">{{ item.typeName }}</text>
          <text class="result-desc">{{ item.description }}</text>
        </view>
      </view>
      <view class="empty-state" v-if="!results.length">
        <text class="empty-text">没有找到相关内容</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { get } from '../../utils/request';

const keyword = ref('');
const searched = ref(false);
const results = ref([]);
const hotWords = ['梯田', '长桌宴', '苗服', '蜡染', '民宿', '一日游'];

const fallbackResults = [
  { id: 1, type: 'scenic', typeName: '景点', title: '乌东梯田景区', image: 'https://via.placeholder.com/220x160/E8F1FB/1F5FA8?text=梯田', description: '千年梯田，四季风光各异。' },
  { id: 2, type: 'food', typeName: '餐厅', title: '苗家大院', image: 'https://via.placeholder.com/220x160/FFF1EA/E85D2F?text=长桌宴', description: '正宗苗家菜和特色长桌宴。' },
  { id: 3, type: 'goods', typeName: '好物', title: '苗族银饰手镯', image: 'https://via.placeholder.com/220x160/F7F8FA/1F5FA8?text=银饰', description: '手工锻造，传承百年工艺。' },
];

function useKeyword(value) {
  keyword.value = value;
  doSearch();
}

async function doSearch() {
  const key = keyword.value.trim();
  searched.value = true;
  if (!key) {
    results.value = [];
    return;
  }
  try {
    const res = await get('/search', { keyword: key });
    results.value = res?.list?.length
      ? res.list.map(item => ({
          id: item.id,
          type: mapType(item.type),
          typeName: item.typeName,
          title: item.title,
          image: item.image,
          description: item.description || item.subtitle || '',
        }))
      : fallbackResults.filter((item) => item.title.includes(key) || item.description.includes(key));
  } catch (e) {
    results.value = fallbackResults.filter((item) => item.title.includes(key) || item.description.includes(key));
  }
}

function goResult(item) {
  const paths = {
    scenic: `/pages_travel/scenic/detail?id=${item.id}`,
    food: `/pages_food/restaurant/detail?id=${item.id}`,
    goods: `/pages_clothing/detail?id=${item.id}`,
  };
  wx.navigateTo({ url: paths[item.type] || '/pages/index/index' });
}

function mapType(type) {
  if (type === 'restaurant' || type === 'agriculture') return 'food';
  if (type === 'scenic' || type === 'route' || type === 'guide') return 'scenic';
  if (type === 'lodging') return 'lodging';
  return 'goods';
}
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.search-head {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  background: #fff;
}

.search-input {
  flex: 1;
  height: 72rpx;
  padding: 0 24rpx;
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
  font-size: 26rpx;
}

.search-btn {
  width: 128rpx;
  height: 72rpx;
  line-height: 72rpx;
  text-align: center;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
  font-size: 26rpx;
}

.quick-tags {
  padding: 32rpx 24rpx;
}

.quick-title {
  display: block;
  margin-bottom: 20rpx;
  font-size: 30rpx;
  font-weight: 500;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.quick-tag {
  padding: 12rpx 24rpx;
  border-radius: var(--radius-full);
  background: #fff;
  color: var(--color-text-secondary);
  font-size: 26rpx;
}

.result-list {
  padding: 16rpx;
}

.result-item {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  border-radius: var(--radius-lg);
  background: #fff;
}

.result-cover {
  width: 180rpx;
  height: 140rpx;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.result-title {
  font-size: 28rpx;
  font-weight: 500;
}

.result-type {
  width: fit-content;
  padding: 4rpx 12rpx;
  border-radius: var(--radius-sm);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 20rpx;
}

.result-desc {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
}
</style>
