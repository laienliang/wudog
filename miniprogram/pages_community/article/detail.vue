<template>
  <view class="article-detail-page">
    <image class="cover" :src="article.cover" mode="aspectFill" />
    <view class="article-body">
      <text class="title">{{ article.title }}</text>
      <view class="author-row">
        <image class="avatar" :src="article.avatar" mode="aspectFill" />
        <text class="author">{{ article.nickName }}</text>
        <text class="stat">❤ {{ article.likes }}</text>
      </view>
      <text class="content">{{ article.content }}</text>
    </view>
    <view class="bottom-actions">
      <view class="action" @tap="toggleLike">{{ liked ? '已点赞' : '点赞' }}</view>
      <view class="action primary" @tap="comment">评论</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const liked = ref(false);
const article = ref({
  title: '清晨走进乌东梯田，雾气像一层轻纱',
  cover: 'https://via.placeholder.com/750x520/E8F1FB/1F5FA8?text=梯田晨雾',
  avatar: '/static/placeholder.png',
  nickName: '山里来客',
  likes: 128,
  content: '天还没完全亮时，我们沿着石板路往观景台走。梯田被薄雾盖住，远处的苗寨木楼慢慢显出轮廓，空气里有稻草和柴火的味道。',
});

function toggleLike() {
  liked.value = !liked.value;
  article.value.likes += liked.value ? 1 : -1;
}

function comment() {
  wx.showToast({ title: '评论功能开发中', icon: 'none' });
}
</script>

<style lang="scss" scoped>
.article-detail-page {
  min-height: 100vh;
  padding-bottom: 110rpx;
  background: #fff;
}

.cover {
  width: 100%;
  height: 520rpx;
}

.article-body {
  padding: 30rpx;
}

.title {
  display: block;
  font-size: 38rpx;
  font-weight: 600;
  line-height: 1.4;
}

.author-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin: 24rpx 0;
}

.avatar {
  width: 54rpx;
  height: 54rpx;
  border-radius: 50%;
}

.author {
  flex: 1;
  color: var(--color-text-secondary);
  font-size: 24rpx;
}

.stat {
  color: var(--color-text-tertiary);
  font-size: 24rpx;
}

.content {
  color: var(--color-text-primary);
  font-size: 28rpx;
  line-height: 1.9;
}

.bottom-actions {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  gap: 16rpx;
  padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.action {
  flex: 1;
  padding: 18rpx 0;
  text-align: center;
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
}

.action.primary {
  background: var(--color-primary);
  color: #fff;
}
</style>
