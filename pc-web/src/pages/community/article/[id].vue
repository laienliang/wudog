<template>
  <div class="article-page">
    <div class="container">
      <NuxtLink to="/community/feed" class="back-link">← 返回游记社区</NuxtLink>
      <article class="article-card">
        <img :src="article.cover" :alt="article.title" class="article-cover" />
        <div class="article-body">
          <span class="eyebrow">精选游记</span>
          <h1>{{ article.title }}</h1>
          <div class="author-row">
            <img :src="article.authorAvatar" alt="" />
            <span>{{ article.author }}</span>
            <span>{{ article.likes }} 赞 · {{ comments.length }} 评论</span>
          </div>
          <p v-for="paragraph in article.content" :key="paragraph">{{ paragraph }}</p>
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <h3>评论 ({{ comments.length }})</h3>
          <div v-if="comments.length === 0" class="no-comments">暂无评论，来说两句吧～</div>
          <div v-else class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <img :src="comment.userAvatar || '/default-avatar.png'" :alt="comment.userName" class="comment-avatar" />
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.userName || '游客' }}</span>
                  <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const clientApi = useClientApi();

const article = ref({
  title: '乌东苗寨的清晨，云雾中的吊脚楼',
  cover: 'https://via.placeholder.com/1000x560/F7F8FA/1F5FA8?text=苗寨清晨',
  author: '旅行者小王',
  authorAvatar: '/default-avatar.png',
  likes: 128,
  content: [
    '清晨六点的乌东村还藏在云雾里，吊脚楼的木檐从雾气中慢慢显出来，像一幅正在展开的山水长卷。',
    '沿着石板路往梯田方向走，能听见远处鸡鸣和溪水声。当地阿姨已经开始准备糯米饭，空气里有木柴和米香。',
    '最喜欢的是银饰工坊，老师傅一边敲打银片，一边讲纹样里的蝴蝶、谷穗和山路。那一刻，非遗不再只是展柜里的作品，而是还在生活里发光的手艺。',
  ],
});

const comments = ref([]);

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString('zh-CN');
};

onMounted(async () => {
  const articleId = String(route.params.id);

  // 加载文章详情
  try {
    const data = await clientApi.detail('article', articleId);
    article.value = {
      title: data.title,
      cover: data.image || article.value.cover,
      author: data.meta || '乌东游客',
      authorAvatar: data.userAvatar || '/default-avatar.png',
      likes: data.likes || 0,
      content: (data.raw?.content || data.description || '').split(/\n+/).filter(Boolean),
    };
  } catch (err) {
    console.error('加载文章失败:', err);
  }

  // 加载评论列表
  try {
    const result = await clientApi.page('comment', {
      articleId: Number(articleId),
      parentId: 0, // 只获取一级评论
    });

    // 获取用户信息
    if (result.list && result.list.length > 0) {
      const userIds = [...new Set(result.list.map(c => c.userId))];
      const userMap = new Map();

      // 批量获取用户信息
      for (const userId of userIds) {
        try {
          const user = await clientApi.detail('user', String(userId));
          userMap.set(userId, {
            userName: user.name || user.nickName || '游客',
            userAvatar: user.avatar || '/default-avatar.png',
          });
        } catch {
          userMap.set(userId, {
            userName: '游客',
            userAvatar: '/default-avatar.png',
          });
        }
      }

      // 合并评论和用户信息
      comments.value = result.list.map(comment => ({
        ...comment,
        ...(userMap.get(comment.userId) || {}),
      }));
    }
  } catch (err) {
    console.error('加载评论失败:', err);
  }
});

useHead({
  title: `${article.value.title} - 乌东文旅`,
});
</script>

<style lang="scss" scoped>
.article-page { min-height: 100vh; background: var(--color-bg-secondary); padding: 32px 0 56px; }
.back-link { display: inline-block; margin-bottom: 18px; color: var(--color-primary); font-weight: 600; }
.article-card { max-width: 920px; margin: 0 auto; background: #fff; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-light); }
.article-cover { width: 100%; height: 460px; object-fit: cover; }
.article-body { padding: 36px; }
.eyebrow { color: var(--color-secondary-gold); font-weight: 700; }
h1 { font-size: 34px; margin: 12px 0; }
.author-row { display: flex; align-items: center; gap: 10px; color: var(--color-text-secondary); margin-bottom: 24px; }
.author-row img { width: 36px; height: 36px; border-radius: 50%; }
p { color: var(--color-text-secondary); font-size: 16px; line-height: 2; margin-bottom: 16px; }

/* 评论区样式 */
.comments-section {
  padding: 36px;
  border-top: 1px solid #eee;
}

.comments-section h3 {
  font-size: 20px;
  margin-bottom: 24px;
  color: var(--color-text-primary);
}

.no-comments {
  text-align: center;
  color: var(--color-text-tertiary);
  padding: 40px 0;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: var(--color-text-primary);
}

.comment-time {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.comment-text {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 640px) {
  .article-cover { height: 260px; }
  .article-body { padding: 24px; }
  h1 { font-size: 28px; }
  .comments-section { padding: 24px; }
  .comment-avatar { width: 36px; height: 36px; }
}
</style>
