<!-- 社区页 -->
<template>
  <view class="community-page">
    <view class="miao-divider"></view>

    <!-- 话题 Tab -->
    <scroll-view scroll-x class="topic-tabs">
      <view
        class="topic-tab"
        :class="{ active: activeTab === 'recommend' }"
        @tap="switchTab('recommend')"
      >
        推荐
      </view>
      <view
        class="topic-tab"
        :class="{ active: activeTab === 'latest' }"
        @tap="switchTab('latest')"
      >
        最新
      </view>
    </scroll-view>

    <!-- 发布按钮 -->
    <view class="publish-btn" @tap="goPublish">
      <text>✏️ 发布游记</text>
    </view>

    <!-- 游记瀑布流 -->
    <view class="feed-list">
      <view class="feed-card" v-for="(item, idx) in feeds" :key="idx" @tap="goDetail(item)">
        <image class="feed-cover" :src="item.images && item.images[0] || '/static/placeholder.png'" mode="aspectFill" lazy-load />
        <view class="feed-body">
          <text class="feed-title">{{ item.title }}</text>
          <view class="feed-footer">
            <image class="avatar" :src="item.avatar || '/static/placeholder.png'" mode="aspectFill" />
            <text class="feed-author">{{ item.nickName }}</text>
            <view class="feed-stats">
              <text>❤ {{ item.likes }}</text>
              <text>💬 {{ item.comments }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get } from '../../utils/request';

const activeTab = ref('recommend');
const feeds = ref([]);
const loading = ref(false);

const fallbackFeeds = [
  { id: 1, title: '清晨走进乌东梯田，雾气像一层轻纱', images: ['https://via.placeholder.com/750x420/E8F1FB/1F5FA8?text=梯田晨雾'], avatar: '', nickName: '山里来客', likes: 128, comments: 18 },
  { id: 2, title: '在苗家长桌宴里尝到最热闹的一餐', images: ['https://via.placeholder.com/750x420/FFF1EA/E85D2F?text=长桌宴'], avatar: '', nickName: '阿央', likes: 86, comments: 12 },
  { id: 3, title: '第一次体验蜡染，蓝白纹样太好看了', images: ['https://via.placeholder.com/750x420/F7F8FA/1F5FA8?text=蜡染体验'], avatar: '', nickName: '小满', likes: 64, comments: 9 },
];

function switchTab(tab) {
  activeTab.value = tab;
  loadFeeds();
}

function goPublish() {
  wx.navigateTo({ url: '/pages_community/publish' });
}

function goDetail(item) {
  wx.navigateTo({ url: `/pages_community/article/detail?id=${item.id}` });
}

async function loadFeeds() {
  loading.value = true;
  try {
    const res = await get('/page', {
      type: 'article',
      page: 1,
      pageSize: 20,
    });
    feeds.value = res?.list?.length
      ? res.list.map(item => ({
          id: item.id,
          title: item.title,
          images: item.image ? [item.image] : [],
          avatar: '',
          nickName: item.meta || '乌东游客',
          likes: item.likes || 0,
          comments: item.comments || 0,
        }))
      : fallbackFeeds;
  } catch (e) {
    feeds.value = activeTab.value === 'latest' ? [...fallbackFeeds].reverse() : fallbackFeeds;
  } finally {
    loading.value = false;
  }
}

onMounted(loadFeeds);
</script>

<style lang="scss" scoped>
.community-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.topic-tabs {
  display: flex;
  padding: 20rpx 24rpx;
  background: #fff;
}

.topic-tab {
  padding: 10rpx 32rpx;
  margin-right: 16rpx;
  border-radius: var(--radius-full);
  font-size: 26rpx;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.topic-tab.active {
  background: var(--color-primary);
  color: #fff;
}

.publish-btn {
  margin: 24rpx;
  background: var(--color-primary);
  color: #fff;
  text-align: center;
  padding: 20rpx;
  border-radius: var(--radius-lg);
  font-size: 28rpx;
}

.feed-list {
  padding: 0 16rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.feed-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.feed-cover {
  width: 100%;
  height: 400rpx;
}

.feed-body {
  padding: 20rpx;
}

.feed-title {
  font-size: 30rpx;
  font-weight: 500;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feed-footer {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
}

.feed-author {
  font-size: 22rpx;
  color: var(--color-text-secondary);
  flex: 1;
}

.feed-stats {
  display: flex;
  gap: 16rpx;
  font-size: 20rpx;
  color: var(--color-text-tertiary);
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
