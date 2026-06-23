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
            <span>{{ article.likes }} 赞 · {{ article.comments }} 评论</span>
          </div>
          <p v-for="paragraph in article.content" :key="paragraph">{{ paragraph }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const article = {
  title: '乌东苗寨的清晨，云雾中的吊脚楼',
  cover: 'https://via.placeholder.com/1000x560/F7F8FA/1F5FA8?text=苗寨清晨',
  author: '旅行者小王',
  authorAvatar: 'https://via.placeholder.com/48x48/E8F1FB/1F5FA8?text=W',
  likes: 128,
  comments: 36,
  content: [
    '清晨六点的乌东村还藏在云雾里，吊脚楼的木檐从雾气中慢慢显出来，像一幅正在展开的山水长卷。',
    '沿着石板路往梯田方向走，能听见远处鸡鸣和溪水声。当地阿姨已经开始准备糯米饭，空气里有木柴和米香。',
    '最喜欢的是银饰工坊，老师傅一边敲打银片，一边讲纹样里的蝴蝶、谷穗和山路。那一刻，非遗不再只是展柜里的作品，而是还在生活里发光的手艺。',
  ],
};

useHead({
  title: `${article.title} - 乌东文旅`,
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
@media (max-width: 640px) { .article-cover { height: 260px; } .article-body { padding: 24px; } h1 { font-size: 28px; } }
</style>
