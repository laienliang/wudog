<template>
  <div class="community-feed-page">
    <div class="container page-inner">
      <div class="page-header">
        <h1>游记社区</h1>
        <p class="page-desc">分享你的乌东之旅</p>
        <NuxtLink to="/community/publish" class="btn btn-primary">发布游记</NuxtLink>
      </div>

      <div class="miao-divider"></div>

      <!-- Tab -->
      <div class="feed-tabs">
        <button :class="['feed-tab', { active: activeTab === 'recommend' }]" @click="activeTab = 'recommend'">推荐</button>
        <button :class="['feed-tab', { active: activeTab === 'latest' }]" @click="activeTab = 'latest'">最新</button>
        <button :class="['feed-tab', { active: activeTab === 'hot' }]" @click="activeTab = 'hot'">最热</button>
      </div>

      <!-- 瀑布流 -->
      <div class="masonry-grid">
        <div class="masonry-item" v-for="(art, idx) in articles" :key="idx">
          <NuxtLink to="/community/article/1" class="masonry-link">
            <img :src="art.cover" :alt="art.title" class="masonry-img" />
            <div class="masonry-body">
              <h3 class="masonry-title">{{ art.title }}</h3>
              <div class="masonry-footer">
                <img :src="art.authorAvatar" alt="" class="author-avatar" />
                <span class="author-name">{{ art.author }}</span>
                <span class="masonry-stats">❤ {{ art.likes }} · 💬 {{ art.comments }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const activeTab = ref('recommend');
const clientApi = useClientApi();

const fallbackArticles = [
  { title: '乌东苗寨的清晨，云雾中的吊脚楼', cover: 'https://via.placeholder.com/600x800/F7F8FA/1F5FA8?text=苗寨清晨', author: '旅行者小王', authorAvatar: 'https://via.placeholder.com/40x40/E8F1FB/1F5FA8?text=W', likes: 128, comments: 36 },
  { title: '第一次来乌东，就被长桌宴震撼了', cover: 'https://via.placeholder.com/600x400/F7F8FA/E85D2F?text=长桌宴', author: '美食达人', authorAvatar: 'https://via.placeholder.com/40x40/FFF1EA/E85D2F?text=M', likes: 256, comments: 82 },
  { title: '乌东梯田，秋天的金色画卷', cover: 'https://via.placeholder.com/600x600/F7F8FA/6B8E3D?text=梯田', author: '摄影师老李', authorAvatar: 'https://via.placeholder.com/40x40/F6FFED/6B8E3D?text=L', likes: 342, comments: 48 },
  { title: '亲手打了一只银镯子——乌东银饰体验', cover: 'https://via.placeholder.com/600x500/F7F8FA/D4A14B?text=银饰', author: '手工艺爱好者', authorAvatar: 'https://via.placeholder.com/40x40/FFF7E6/D4A14B?text=H', likes: 189, comments: 55 },
  { title: '苗年节的篝火晚会，太燃了', cover: 'https://via.placeholder.com/600x700/F7F8FA/E85D2F?text=苗年', author: '文化探索者', authorAvatar: 'https://via.placeholder.com/40x40/E8F1FB/1F5FA8?text=C', likes: 420, comments: 96 },
  { title: '苗寨民宿推荐｜吊脚楼里的星空之夜', cover: 'https://via.placeholder.com/600x450/F7F8FA/6B8E3D?text=民宿', author: '民宿控', authorAvatar: 'https://via.placeholder.com/40x40/F6FFED/6B8E3D?text=R', likes: 156, comments: 42 },
];

const articles = ref(fallbackArticles);

onMounted(async () => {
  try {
    const res = await clientApi.page('article', { page: 1, pageSize: 20 });
    articles.value = res?.list?.length
      ? res.list.map((item, idx) => ({
          id: item.id,
          title: item.title,
          cover: item.image || fallbackArticles[idx % fallbackArticles.length].cover,
          author: item.meta || '乌东游客',
          authorAvatar: fallbackArticles[idx % fallbackArticles.length].authorAvatar,
          likes: item.likes || 0,
          comments: item.comments || 0,
        }))
      : fallbackArticles;
  } catch (err) {
    articles.value = fallbackArticles;
  }
});

useHead({
  title: '游记社区 - 乌东文旅',
  meta: [{ name: 'description', content: '分享你的乌东之旅，记录苗寨的美好时光' }],
});
</script>

<style lang="scss" scoped>
.community-feed-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding: 32px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
}

.page-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-top: 8px;
}

.feed-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: #fff;
  padding: 8px;
  border-radius: var(--radius-lg);
  width: fit-content;
}

.feed-tab {
  padding: 10px 28px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.feed-tab.active {
  background: var(--color-primary);
  color: #fff;
}

.masonry-grid {
  column-count: 3;
  column-gap: 20px;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 20px;
}

.masonry-link {
  display: block;
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

.masonry-link:hover {
  box-shadow: var(--shadow-medium);
}

.masonry-img {
  width: 100%;
  display: block;
}

.masonry-body {
  padding: 16px;
}

.masonry-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.masonry-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.author-name {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.masonry-stats {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-left: auto;
}

@media (max-width: 1024px) {
  .masonry-grid {
    column-count: 2;
  }
}

@media (max-width: 768px) {
  .masonry-grid {
    column-count: 1;
  }
}
</style>
