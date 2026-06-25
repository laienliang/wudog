<template>
  <view class="community-page">
    <view class="community-hero">
      <view>
        <text class="hero-kicker">Community</text>
        <text class="hero-title">把你在乌东遇见的风景讲出来</text>
      </view>
      <view class="publish-btn" @tap="goPublish">
        <view class="publish-icon">
          <ui-icon name="publish" :size="18" color="#fff" />
        </view>
        <view class="publish-copy">
          <text class="publish-label">发布</text>
          <text class="publish-sub">游记</text>
        </view>
      </view>
    </view>
    <view class="miao-divider"></view>

    <view class="topic-tabs">
      <view
        class="topic-tab"
        :class="{ active: activeTab === item.value }"
        v-for="item in tabs"
        :key="item.value"
        @tap="switchTab(item.value)"
      >
        {{ item.label }}
      </view>
    </view>

    <view class="feed-list">
      <view class="feed-card" v-for="item in feeds" :key="item.id" @tap="goDetail(item)">
        <image class="feed-cover" :src="imageOf(item.images && item.images[0])" mode="aspectFill" lazy-load />
        <view class="feed-body">
          <text class="feed-type">{{ item.typeName || '社区游记' }}</text>
          <text class="feed-title">{{ item.title }}</text>
          <text class="feed-desc">{{ item.description }}</text>
          <view class="feed-footer">
            <view class="avatar">
              <text>{{ item.nickName.slice(0, 1) }}</text>
            </view>
            <text class="feed-author">{{ item.nickName }}</text>
            <view class="feed-stats">
              <text>{{ item.likes }} 赞</text>
              <text>{{ item.comments }} 评</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-if="!feeds.length && !loading">
      <text class="empty-text">还没有游记，等你写下第一篇</text>
    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { get } from '../../utils/request'
import UiIcon from '../../components/ui-icon.vue'
import { getCommunityPosts } from '../../utils/local'

const placeholder = '/static/placeholder.png'
const activeTab = ref('recommend')
const feeds = ref([])
const loading = ref(false)
const tabs = [
  { label: '推荐', value: 'recommend' },
  { label: '最新', value: 'latest' },
]

const fallbackFeeds = [
  { id: 1, title: '清晨走进乌东梯田，雾气像一层轻纱', description: '山风很轻，田埂边都是刚醒来的蓝。', images: [placeholder], nickName: '山里来客', likes: 128, comments: 18 },
  { id: 2, title: '在苗家长桌宴里尝到最热闹的一餐', description: '酸汤、稻花鱼和一整晚的笑声。', images: [placeholder], nickName: '阿央', likes: 86, comments: 12 },
]

function imageOf(src) {
  return src || placeholder
}

function switchTab(tab) {
  activeTab.value = tab
  loadFeeds()
}

function goPublish() {
  uni.navigateTo({ url: '/pages_community/publish' })
}

function goDetail(item) {
  uni.navigateTo({ url: item.miniPath || `/pages_community/article/detail?id=${item.id}` })
}

async function loadFeeds() {
  loading.value = true
  try {
    const res = await get('/page', {
      type: 'article',
      page: 1,
      pageSize: 20,
    })
    const list = res?.list?.length ? res.list : []
    const backendFeeds = list.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || item.subtitle || '来自乌东的旅行片段',
      images: item.images || (item.image ? [item.image] : []),
      nickName: item.meta || '乌东游客',
      likes: item.likes || 0,
      comments: item.comments || 0,
      typeName: item.typeName,
      miniPath: item.miniPath,
      createTime: item.createTime,
    }))
    const localFeeds = getCommunityPosts()
    feeds.value = [...localFeeds, ...backendFeeds]
      .filter((item, index, array) => array.findIndex(curr => curr.id === item.id && curr.localOnly === item.localOnly) === index)
      .sort((a, b) => {
        if (activeTab.value === 'latest') {
          return String(b.createTime || '').localeCompare(String(a.createTime || ''))
        }
        return Number(b.likes || 0) - Number(a.likes || 0)
      })
    if (!feeds.value.length) {
      feeds.value = activeTab.value === 'latest' ? [...fallbackFeeds].reverse() : fallbackFeeds
    }
  } catch (e) {
    feeds.value = activeTab.value === 'latest' ? [...fallbackFeeds].reverse() : fallbackFeeds
  } finally {
    loading.value = false
  }
}

onShow(loadFeeds)
</script>

<style lang="scss" scoped>
.community-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 16% 0, rgba(216, 75, 42, 0.16), transparent 240rpx),
    var(--color-bg-secondary);
}

.community-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 36rpx 28rpx 30rpx;
  background: linear-gradient(135deg, #12243a, #1f5fa8);
  color: #fff;
}

.hero-kicker,
.hero-title {
  display: block;
}

.hero-kicker {
  font-size: 20rpx;
  opacity: 0.7;
}

.hero-title {
  width: 500rpx;
  margin-top: 10rpx;
  font-size: 40rpx;
  font-weight: 800;
  line-height: 1.16;
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-width: 144rpx;
  height: 74rpx;
  padding: 0 18rpx 0 10rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.22);
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.12);
}

.publish-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}

.publish-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.publish-label {
  font-size: 24rpx;
  font-weight: 800;
  line-height: 1.1;
}

.publish-sub {
  margin-top: 3rpx;
  color: rgba(255, 255, 255, 0.72);
  font-size: 18rpx;
  line-height: 1.1;
}

.topic-tabs {
  display: flex;
  gap: 14rpx;
  padding: 24rpx;
}

.topic-tab {
  padding: 12rpx 30rpx;
  border: 1rpx solid rgba(18, 36, 58, 0.08);
  border-radius: var(--radius-full);
  background: var(--color-paper);
  color: var(--color-text-secondary);
  font-size: 26rpx;
}

.topic-tab.active {
  background: var(--color-night);
  color: #fff;
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
  padding: 0 24rpx 24rpx;
}

.feed-card {
  overflow: hidden;
  border-radius: 28rpx;
  background: var(--color-paper);
  box-shadow: var(--shadow-card);
}

.feed-cover {
  width: 100%;
  height: 390rpx;
  background: var(--color-indigo-soft);
}

.feed-body {
  padding: 22rpx;
}

.feed-type {
  color: var(--color-cinnabar);
  font-size: 21rpx;
}

.feed-title {
  display: block;
  margin-top: 8rpx;
  color: var(--color-ink);
  font-size: 32rpx;
  font-weight: 800;
  line-height: 1.3;
}

.feed-desc {
  display: block;
  margin-top: 10rpx;
  color: var(--color-text-secondary);
  font-size: 24rpx;
  line-height: 1.45;
}

.feed-footer {
  display: flex;
  align-items: center;
  margin-top: 22rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50rpx;
  height: 50rpx;
  margin-right: 12rpx;
  border-radius: 50%;
  background: var(--color-indigo-soft);
  color: var(--color-indigo);
  font-size: 24rpx;
  font-weight: 800;
}

.feed-author {
  flex: 1;
  min-width: 0;
  color: var(--color-text-secondary);
  font-size: 23rpx;
}

.feed-stats {
  display: flex;
  gap: 14rpx;
  color: var(--color-text-tertiary);
  font-size: 21rpx;
}
</style>
