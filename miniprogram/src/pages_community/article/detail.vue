<template>
  <view class="article-detail-page">
    <image class="cover" :src="article.cover" mode="aspectFill" />

    <view class="article-body card">
      <text class="title">{{ article.title }}</text>
      <view class="author-row">
        <image class="avatar" :src="article.avatar" mode="aspectFill" />
        <view class="author-copy">
          <text class="author">{{ article.nickName }}</text>
          <text class="sub">{{ article.createTime || '乌东社区' }}</text>
        </view>
      </view>
      <text class="content">{{ article.content }}</text>
    </view>

    <view class="comment-card card">
      <view class="comment-head">
        <text class="section-title">评论</text>
        <text class="comment-count">{{ comments.length }}</text>
      </view>
      <view class="comment-list" v-if="comments.length">
        <view class="comment-item" v-for="item in comments" :key="item.id">
          <text class="comment-name">{{ item.nickName }}</text>
          <text class="comment-content">{{ item.content }}</text>
          <text class="comment-time">{{ item.createTime }}</text>
        </view>
      </view>
      <view class="empty-state" v-else>
        <text class="empty-text">还没有评论，先留下第一句吧</text>
      </view>
    </view>

    <view class="comment-editor card">
      <textarea class="comment-input" v-model="commentText" placeholder="写下你的想法" maxlength="500" />
      <view class="bottom-actions">
        <view class="action" @tap="toggleLike">
          <ui-icon :name="liked ? 'heart-fill' : 'heart'" :size="20" :color="liked ? '#d84b2a' : 'var(--color-text-secondary)'" />
          <text>{{ liked ? '已点赞' : '点赞' }}</text>
        </view>
        <view class="action" @tap="shareArticle">
          <ui-icon name="share" :size="20" color="var(--color-text-secondary)" />
          <text>分享</text>
        </view>
        <view class="action primary" @tap="submitComment">
          <ui-icon name="comment" :size="20" color="#fff" />
          <text>发布评论</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import UiIcon from '../../components/ui-icon.vue'
import { get } from '../../utils/request'
import { appendArticleComment, getArticleComments, getArticleLikes, setArticleLikes, getCurrentUser } from '../../utils/local'

const article = ref({
  title: '清晨走进乌东梯田，雾气像一层轻纱',
  cover: '/static/placeholder.png',
  avatar: '/static/placeholder.png',
  nickName: '山里来客',
  createTime: '',
  content: '天还没完全亮时，我们沿着石板路往观景台走。梯田被薄雾盖住，远处的苗寨木楼慢慢显出轮廓，空气里有稻草和柴火的味道。',
  likes: 128,
})

const articleId = ref(0)
const likedMap = ref(getArticleLikes())
const commentMap = ref(getArticleComments())
const commentText = ref('')
const comments = computed(() => commentMap.value[String(articleId.value)] || [])
const liked = computed(() => Boolean(likedMap.value[String(articleId.value)]))

async function loadDetail(id) {
  const data = await get('/detail', { type: 'article', id })
  if (!data) return
  article.value = {
    id: data.id,
    title: data.title,
    cover: data.image || data.images?.[0] || article.value.cover,
    avatar: data.raw?.avatar || article.value.avatar,
    nickName: data.meta || data.raw?.nickName || '乌东游客',
    createTime: data.createTime,
    content: data.content || data.description || article.value.content,
    likes: Number(data.likes || article.value.likes || 0),
  }
  if (Array.isArray(data.comments) && data.comments.length) {
    commentMap.value[String(id)] = data.comments.map(item => ({
      id: item.id,
      nickName: item.nickName || '乌东游客',
      content: item.content,
      createTime: item.createTime || '',
    }))
  }
}

function toggleLike() {
  const key = String(articleId.value)
  const map = { ...likedMap.value }
  const next = !map[key]
  map[key] = next
  likedMap.value = map
  setArticleLikes(map)
  article.value.likes += next ? 1 : -1
}

function submitComment() {
  const text = commentText.value.trim()
  if (!text) {
    uni.showToast({ title: '请输入评论内容', icon: 'none' })
    return
  }
  const list = appendArticleComment(articleId.value, {
    content: text,
    nickName: getCurrentUser().nickName,
  })
  commentMap.value = {
    ...commentMap.value,
    [String(articleId.value)]: [list, ...(commentMap.value[String(articleId.value)] || [])],
  }
  commentText.value = ''
  uni.showToast({ title: '评论已发布', icon: 'success' })
}

function shareArticle() {
  uni.showToast({ title: '已复制文章分享信息', icon: 'none' })
}

onLoad(async options => {
  articleId.value = Number(options?.id || 1)
  await loadDetail(articleId.value)
})
</script>

<style lang="scss" scoped>
.article-detail-page {
  min-height: 100vh;
  padding-bottom: 28rpx;
  background: var(--color-bg-secondary);
}

.cover {
  width: 100%;
  height: 520rpx;
}

.article-body,
.comment-card,
.comment-editor {
  margin: 16rpx 20rpx 0;
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  line-height: 1.35;
}

.author-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin: 22rpx 0;
}

.avatar {
  width: 58rpx;
  height: 58rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.author-copy {
  flex: 1;
  min-width: 0;
}

.author {
  display: block;
  font-size: 24rpx;
  font-weight: 700;
}

.sub {
  display: block;
  margin-top: 4rpx;
  color: var(--color-text-tertiary);
  font-size: 22rpx;
}

.content {
  color: var(--color-text-primary);
  font-size: 28rpx;
  line-height: 1.9;
}

.comment-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 30rpx;
  font-weight: 800;
}

.comment-count {
  color: var(--color-text-tertiary);
  font-size: 24rpx;
}

.comment-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.comment-item:last-child {
  border-bottom: 0;
}

.comment-name {
  display: block;
  font-size: 24rpx;
  font-weight: 700;
}

.comment-content,
.comment-time {
  display: block;
  margin-top: 10rpx;
  color: var(--color-text-secondary);
  font-size: 24rpx;
  line-height: 1.7;
}

.empty-state {
  padding: 40rpx 0 10rpx;
  text-align: center;
}

.empty-text {
  color: var(--color-text-tertiary);
  font-size: 26rpx;
}

.comment-input {
  width: 100%;
  min-height: 160rpx;
  padding: 18rpx 20rpx;
  border: 1rpx solid var(--color-border-primary);
  border-radius: 22rpx;
  background: var(--color-bg-secondary);
  font-size: 26rpx;
}

.bottom-actions {
  display: flex;
  gap: 12rpx;
  margin-top: 16rpx;
}

.action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 84rpx;
  border-radius: 999rpx;
  background: #fff;
  border: 1rpx solid rgba(18, 36, 58, 0.08);
  color: var(--color-text-secondary);
  font-size: 24rpx;
  font-weight: 700;
}

.action.primary {
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
}
</style>
