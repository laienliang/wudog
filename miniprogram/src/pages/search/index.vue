<template>
  <view class="search-page">
    <view class="search-head">
      <view class="search-box">
        <ui-icon name="search" :size="18" color="var(--color-cinnabar)" />
        <input class="search-input" v-model="keyword" placeholder="搜索景点、美食、民宿、好物" confirm-type="search" @confirm="doSearch" />
      </view>
      <view class="search-btn" @tap="doSearch">搜索</view>
    </view>

    <view class="quick-tags" v-if="!searched">
      <text class="quick-title">热门搜索</text>
      <view class="tag-list">
        <text class="quick-tag" v-for="item in hotWords" :key="item" @tap="useKeyword(item)">{{ item }}</text>
      </view>
    </view>

    <view class="result-list" v-else>
      <view class="result-item" v-for="item in results" :key="`${item.type}-${item.id}`" @tap="goResult(item)">
        <image class="result-cover" :src="imageOf(item.image)" mode="aspectFill" />
        <view class="result-info">
          <view class="result-top">
            <text class="result-title">{{ item.title }}</text>
            <text class="result-type">{{ item.typeName }}</text>
          </view>
          <text class="result-desc">{{ item.description }}</text>
          <text class="result-meta">{{ item.meta }}</text>
        </view>
      </view>
      <view class="empty-state" v-if="!results.length">
        <text class="empty-text">没有找到相关内容</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import UiIcon from '../../components/ui-icon.vue'
import { get } from '../../utils/request'

const placeholder = '/static/placeholder.png'
const keyword = ref('')
const searched = ref(false)
const results = ref([])
const hotWords = ['梯田', '长桌宴', '苗服', '蜡染', '民宿', '一日游']

const fallbackResults = [
  { id: 1, type: 'scenic', typeName: '景区景点', title: '乌东梯田景区', image: placeholder, description: '千年梯田，四季风光各异。', meta: '全天开放', miniPath: '/pages_travel/scenic/detail?id=1' },
  { id: 2, type: 'restaurant', typeName: '美食餐厅', title: '苗家大院', image: placeholder, description: '正宗苗家菜和特色长桌宴。', meta: '乌东村', miniPath: '/pages_food/restaurant/detail?id=2' },
]

function imageOf(src) {
  return src || placeholder
}

function useKeyword(value) {
  keyword.value = value
  doSearch()
}

async function doSearch() {
  const key = keyword.value.trim()
  searched.value = true
  if (!key) {
    results.value = []
    return
  }
  try {
    const res = await get('/search', { keyword: key, limit: 10 })
    results.value = res?.list?.length
      ? res.list.map(item => ({
          id: item.id,
          type: item.type,
          typeName: item.typeName,
          title: item.title,
          image: item.image,
          description: item.description || item.subtitle || '',
          meta: item.meta || '',
          miniPath: item.miniPath,
        }))
      : fallbackResults.filter(item => item.title.includes(key) || item.description.includes(key))
  } catch (e) {
    results.value = fallbackResults.filter(item => item.title.includes(key) || item.description.includes(key))
  }
}

function goResult(item) {
  const fallbackPaths = {
    clothing: `/pages_clothing/detail?id=${item.id}`,
    restaurant: `/pages_food/restaurant/detail?id=${item.id}`,
    agriculture: `/pages_food/agriculture/detail?id=${item.id}`,
    lodging: `/pages_lodging/detail?id=${item.id}`,
    scenic: `/pages_travel/scenic/detail?id=${item.id}`,
    route: `/pages_travel/route/detail?id=${item.id}`,
    article: `/pages_community/article/detail?id=${item.id}`,
  }
  uni.navigateTo({ url: item.miniPath || fallbackPaths[item.type] || '/pages/index/index' })
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
  padding: 28rpx 24rpx;
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  height: 78rpx;
  padding: 0 22rpx;
  border-radius: var(--radius-full);
  background: var(--color-paper);
}

.search-input {
  flex: 1;
  height: 78rpx;
  color: var(--color-ink);
  font-size: 26rpx;
}

.search-btn {
  width: 126rpx;
  height: 78rpx;
  line-height: 78rpx;
  text-align: center;
  border-radius: var(--radius-full);
  background: var(--color-cinnabar);
  color: #fff;
  font-size: 26rpx;
  font-weight: 700;
}

.quick-tags {
  padding: 36rpx 24rpx;
}

.quick-title {
  display: block;
  margin-bottom: 22rpx;
  color: var(--color-ink);
  font-size: 32rpx;
  font-weight: 800;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.quick-tag {
  padding: 14rpx 24rpx;
  border-radius: var(--radius-full);
  background: var(--color-paper);
  color: var(--color-text-secondary);
  font-size: 26rpx;
  box-shadow: 0 8rpx 22rpx rgba(18, 36, 58, 0.06);
}

.result-list {
  padding: 24rpx;
}

.result-item {
  display: flex;
  gap: 20rpx;
  padding: 18rpx;
  margin-bottom: 18rpx;
  border-radius: 24rpx;
  background: var(--color-paper);
  box-shadow: var(--shadow-card);
}

.result-cover {
  width: 190rpx;
  height: 154rpx;
  border-radius: 18rpx;
  flex-shrink: 0;
  background: var(--color-indigo-soft);
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12rpx;
}

.result-title {
  flex: 1;
  color: var(--color-ink);
  font-size: 28rpx;
  font-weight: 800;
  line-height: 1.3;
}

.result-type {
  padding: 5rpx 12rpx;
  border-radius: var(--radius-full);
  background: var(--color-indigo-soft);
  color: var(--color-indigo);
  font-size: 20rpx;
}

.result-desc,
.result-meta {
  display: block;
  margin-top: 10rpx;
  color: var(--color-text-secondary);
  font-size: 23rpx;
  line-height: 1.35;
}

.result-meta {
  color: var(--color-text-tertiary);
}
</style>
