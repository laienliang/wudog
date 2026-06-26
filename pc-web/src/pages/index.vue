<template>
  <div class="home-page">
    <!-- Banner 轮播 -->
    <section class="hero-banner">
      <Swiper
        v-model="bannerActive"
        :modules="swiperModules"
        :slides-per-view="1"
        :autoplay="{ delay: 4000 }"
        :loop="true"
        :pagination="{ clickable: true }"
      >
        <SwiperSlide v-for="(banner, idx) in banners" :key="idx">
          <div class="banner-item" :style="{ backgroundImage: `url(${banner.image})` }">
            <div class="banner-overlay">
              <h1 class="banner-title">{{ banner.title }}</h1>
              <p class="banner-desc">{{ banner.description }}</p>
              <NuxtLink :to="banner.link" class="btn btn-primary btn-lg">
                {{ banner.cta }}
              </NuxtLink>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>

    <!-- 苗族蜡染纹样分割线 -->
    <div class="miao-divider"></div>

    <!-- 业务模块入口 -->
    <section class="module-entrances">
      <div class="container">
        <div class="module-grid">
          <NuxtLink v-for="(mod, idx) in modules" :key="idx" :to="mod.path" class="module-card">
            <div class="module-icon" :style="{ backgroundColor: mod.color }">
              <span class="module-emoji">{{ mod.emoji }}</span>
            </div>
            <h3 class="module-name">{{ mod.name }}</h3>
            <p class="module-desc">{{ mod.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 热门推荐 -->
    <section class="hot-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">热门推荐</h2>
          <NuxtLink to="/clothing/list" class="section-more">查看全部 ›</NuxtLink>
        </div>

        <!-- Tab 切换 -->
        <div class="hot-tabs">
          <button
            v-for="tab in hotTabs"
            :key="tab.key"
            :class="['hot-tab', { active: activeTab === tab.key }]"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="hot-grid">
          <div v-for="(item, idx) in displayedItems" :key="idx" class="goods-card">
            <NuxtLink :to="item.link" class="goods-card-link">
              <img :src="item.image" :alt="item.title" class="goods-card-img" />
              <div class="goods-card-body">
                <h3 class="goods-card-title">{{ item.title }}</h3>
                <p class="goods-card-subtitle">{{ item.subtitle }}</p>
                <div class="goods-card-footer">
                  <span class="price">{{ item.price }}</span>
                  <span class="goods-card-meta">
                    <span class="rating">
                      <span v-for="s in 5" :key="s" :class="['star', { filled: s <= item.rating }]">★</span>
                    </span>
                    <span>{{ item.sales || item.likes || 0 }}</span>
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 精选游记 -->
    <section class="article-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">精选游记-乌东之行</h2>
          <NuxtLink to="/community/feed" class="section-more">更多游记 ›</NuxtLink>
        </div>

        <div class="article-grid">
          <div v-for="(art, idx) in articles" :key="idx" class="article-card">
            <NuxtLink to="/community/article/1" class="article-card-link">
              <img :src="art.cover" alt="" class="article-card-img" />
              <div class="article-card-body">
                <h3 class="article-card-title">{{ art.title }}</h3>
                <div class="article-card-meta">
                  <img :src="art.authorAvatar" alt="" class="author-avatar" />
                  <span class="author-name">{{ art.author }}</span>
                  <span class="article-stats">{{ art.likes }}赞 · {{ art.comments }}评</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section class="about-section">
      <div class="container about-inner">
        <div class="about-text">
          <h2>关于乌东文旅</h2>
          <p>乌东村是贵州黔东南苗族侗族自治州最具特色的苗寨之一，拥有千年历史的吊脚楼建筑群、精美的银饰锻造技艺、独特的蜡染刺绣工艺。</p>
          <p>本平台致力于为游客提供一站式"衣、食、住、行、社区"线上服务，让您足不出户即可感受苗寨风情。</p>
        </div>
        <div class="about-stats">
          <div class="stat-item">
            <span class="stat-num">50+</span>
            <span class="stat-label">入驻商家</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">200+</span>
            <span class="stat-label">非遗商品</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">1000+</span>
            <span class="stat-label">月活用户</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">500+</span>
            <span class="stat-label">游记分享</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useClientApi } from '~/composables/useClientApi';

useHead({
  title: '乌东文旅 - 苗寨衣食住行综合服务平台',
  meta: [
    { name: 'description', content: '体验贵州苗族文化，品味苗寨风情' },
  ],
});

definePageMeta({
  layout: 'default',
});

const swiperModules = [Autoplay, Pagination, Navigation];

const bannerActive = ref(0);

const clientApi = useClientApi();

const fallbackBanners = [
  {
    image: 'https://via.placeholder.com/1920x600/1F5FA8/FFFFFF?text=乌东苗寨',
    title: '走进乌东苗寨',
    description: '千年古寨，苗族文化的活化石',
    link: '/lodging/list',
    cta: '探索苗寨',
  },
  {
    image: 'https://via.placeholder.com/1920x600/E85D2F/FFFFFF?text=苗家长桌宴',
    title: '苗家长桌宴',
    description: '品味最地道的苗家美食',
    link: '/food/restaurant',
    cta: '预订餐位',
  },
  {
    image: 'https://via.placeholder.com/1920x600/6B8E3D/FFFFFF?text=梯田风光',
    title: '梯田风光',
    description: '漫步金色梯田，感受自然之美',
    link: '/travel',
    cta: '查看线路',
  },
];

const banners = ref(fallbackBanners);

const modules = [
  { name: '衣', emoji: '🏮', description: '苗族银饰、蜡染、刺绣等非遗手工艺品', path: '/clothing/list', color: '#1F5FA8' },
  { name: '食', emoji: '🍲', description: '苗家长桌宴、特色农家菜、农产品特产', path: '/food/restaurant', color: '#E85D2F' },
  { name: '住', emoji: '🏡', description: '苗寨吊脚楼民宿、特色客栈', path: '/lodging/list', color: '#6B8E3D' },
  { name: '行', emoji: '🎫', description: '景区门票、旅游路线套餐、交通攻略', path: '/travel', color: '#D4A14B' },
];

const hotTabs = [
  { label: '衣', key: 'clothing' },
  { label: '食', key: 'food' },
  { label: '住', key: 'lodging' },
  { label: '行', key: 'travel' },
];

const activeTab = ref('clothing');

// 模拟数据
const fallbackHotItems = {
  clothing: [
    { title: '苗族银饰手镯', subtitle: '手工锻造，传承百年工艺', price: '368', image: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=银饰手镯', link: '/clothing/detail/1', rating: 5, sales: 128 },
    { title: '蜡染布艺挂画', subtitle: '天然植物染料，纯手工制作', price: '198', image: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=蜡染挂画', link: '/clothing/detail/2', rating: 4, sales: 86 },
    { title: '苗族刺绣香包', subtitle: '精美刺绣，天然香料填充', price: '68', image: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=刺绣香包', link: '/clothing/detail/3', rating: 5, sales: 256 },
    { title: '苗服日常款', subtitle: '传统纹样，现代剪裁', price: '588', image: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=苗服', link: '/clothing/detail/4', rating: 5, sales: 42 },
  ],
  food: [
    { title: '苗家长桌宴', subtitle: '正宗苗家味道，人均88元起', price: '88', image: 'https://via.placeholder.com/400x400/F7F8FA/E85D2F?text=长桌宴', link: '/food/restaurant/1', rating: 5, likes: 320 },
    { title: '乌东腊肉', subtitle: '烟熏工艺，地道农家味', price: '68', image: 'https://via.placeholder.com/400x400/F7F8FA/E85D2F?text=腊肉', link: '/food/agriculture/1', rating: 4, likes: 180 },
    { title: '高山云雾茶', subtitle: '海拔1500米茶园直供', price: '128', image: 'https://via.placeholder.com/400x400/F7F8FA/E85D2F?text=茶叶', link: '/food/agriculture/2', rating: 5, likes: 95 },
    { title: '手工米酒', subtitle: '传统酿造，甘甜醇香', price: '48', image: 'https://via.placeholder.com/400x400/F7F8FA/E85D2F?text=米酒', link: '/food/agriculture/3', rating: 4, likes: 210 },
  ],
  lodging: [
    { title: '吊脚楼观景房', subtitle: '直面梯田，晨雾缭绕', price: '388', image: 'https://via.placeholder.com/400x400/F7F8FA/6B8E3D?text=吊脚楼', link: '/lodging/detail/1', rating: 5, likes: 156 },
    { title: '苗寨大床房', subtitle: '木质结构，温馨舒适', price: '268', image: 'https://via.placeholder.com/400x400/F7F8FA/6B8E3D?text=大床房', link: '/lodging/detail/2', rating: 4, likes: 89 },
    { title: '庭院套房', subtitle: '独立院落，带露台', price: '588', image: 'https://via.placeholder.com/400x400/F7F8FA/6B8E3D?text=套房', link: '/lodging/detail/3', rating: 5, likes: 67 },
    { title: '家庭木屋', subtitle: '两室两厅，适合家庭出游', price: '788', image: 'https://via.placeholder.com/400x400/F7F8FA/6B8E3D?text=家庭房', link: '/lodging/detail/4', rating: 5, likes: 43 },
  ],
  travel: [
    { title: '乌东苗寨一日游', subtitle: '含三餐+导游+门票', price: '298', image: 'https://via.placeholder.com/400x400/F7F8FA/D4A14B?text=一日游', link: '/travel/route/1', rating: 5, likes: 420 },
    { title: '梯田徒步两日游', subtitle: '深度体验苗寨生活', price: '498', image: 'https://via.placeholder.com/400x400/F7F8FA/D4A14B?text=两日游', link: '/travel/route/2', rating: 4, likes: 180 },
    { title: '苗年节庆套餐', subtitle: '体验最地道的苗年', price: '588', image: 'https://via.placeholder.com/400x400/F7F8FA/D4A14B?text=苗年', link: '/travel/route/3', rating: 5, likes: 310 },
    { title: '银饰锻造体验', subtitle: '亲手制作银饰纪念品', price: '168', image: 'https://via.placeholder.com/400x400/F7F8FA/D4A14B?text=银饰体验', link: '/travel/route/4', rating: 5, likes: 95 },
  ],
};

const hotItems = ref(fallbackHotItems);

const displayedItems = computed(() => hotItems.value[activeTab.value] || []);

const fallbackArticles = [
  { title: '乌东苗寨的清晨，云雾中的吊脚楼', cover: 'https://via.placeholder.com/600x400/F7F8FA/1F5FA8?text=苗寨清晨', author: '旅行者小王', authorAvatar: 'https://via.placeholder.com/40x40/E8F1FB/1F5FA8?text=W', likes: 128, comments: 36 },
  { title: '第一次来乌东，就被长桌宴震撼了', cover: 'https://via.placeholder.com/600x400/F7F8FA/E85D2F?text=长桌宴', author: '美食达人', authorAvatar: 'https://via.placeholder.com/40x40/FFF1EA/E85D2F?text=M', likes: 256, comments: 82 },
  { title: '乌东梯田，秋天的金色画卷', cover: 'https://via.placeholder.com/600x400/F7F8FA/6B8E3D?text=梯田', author: '摄影师老李', authorAvatar: 'https://via.placeholder.com/40x40/F6FFED/6B8E3D?text=L', likes: 342, comments: 48 },
  { title: '亲手打了一只银镯子——乌东银饰体验', cover: 'https://via.placeholder.com/600x400/F7F8FA/D4A14B?text=银饰', author: '手工艺爱好者', authorAvatar: 'https://via.placeholder.com/40x40/FFF7E6/D4A14B?text=H', likes: 189, comments: 55 },
];

const articles = ref(fallbackArticles);

onMounted(async () => {
  try {
    const data = await clientApi.home();
    banners.value = (data?.banners?.length ? data.banners : fallbackBanners).map((item, idx) => ({
      image: item.image || fallbackBanners[idx % fallbackBanners.length].image,
      title: item.title,
      description: fallbackBanners[idx % fallbackBanners.length].description,
      link: item.link || fallbackBanners[idx % fallbackBanners.length].link,
      cta: fallbackBanners[idx % fallbackBanners.length].cta,
    }));
    if (data?.hot) {
      hotItems.value = {
        clothing: data.hot.clothing?.length ? data.hot.clothing.map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          price: item.price?.toString() || '',
          image: item.image || fallbackHotItems.clothing[0].image,
          link: item.path,
          rating: item.rating || 5,
          sales: item.sales || 0,
        })) : fallbackHotItems.clothing,
        food: data.hot.food?.length ? data.hot.food.map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          price: item.price?.toString() || '',
          image: item.image || fallbackHotItems.food[0].image,
          link: item.path,
          rating: item.rating || 5,
          likes: item.likes || 0,
        })) : fallbackHotItems.food,
        lodging: data.hot.lodging?.length ? data.hot.lodging.map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          price: item.price?.toString() || '',
          image: item.image || fallbackHotItems.lodging[0].image,
          link: item.path,
          rating: item.rating || 5,
          likes: item.likes || 0,
        })) : fallbackHotItems.lodging,
        travel: data.hot.travel?.length ? data.hot.travel.map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          price: item.price?.toString() || '',
          image: item.image || fallbackHotItems.travel[0].image,
          link: item.path,
          rating: item.rating || 5,
          likes: item.likes || 0,
        })) : fallbackHotItems.travel,
      };
    }
    articles.value = data?.articles?.length
      ? data.articles.map((item, idx) => ({
          title: item.title,
          cover: item.image || fallbackArticles[idx % fallbackArticles.length].cover,
          author: item.meta || '乌东文旅',
          authorAvatar: fallbackArticles[idx % fallbackArticles.length].authorAvatar,
          likes: item.likes || 0,
          comments: item.comments || 0,
        }))
      : fallbackArticles;
  } catch (err) {
    //
  }
});
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
}

/* Banner */
.hero-banner {
  position: relative;
  height: 520px;
  overflow: hidden;
}

.banner-item {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-overlay {
  text-align: center;
  color: #fff;
  padding: 24px;
}

.banner-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.banner-desc {
  font-size: 18px;
  margin-bottom: 32px;
  opacity: 0.9;
}

.btn-lg {
  padding: 14px 40px;
  font-size: 16px;
  height: auto;
}

/* 模块入口 */
.module-entrances {
  padding: 48px 0;
  background: var(--color-bg-primary);
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.module-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px;
  border-radius: var(--radius-xl);
  background: var(--color-bg-secondary);
  transition: all 0.3s ease;
  text-align: center;
  cursor: pointer;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

.module-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.module-emoji {
  font-size: 40px;
}

.module-name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.module-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* 热门推荐 */
.hot-section {
  padding: 48px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
}

.section-more {
  font-size: 14px;
  color: var(--color-primary);
}

.hot-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.hot-tab {
  padding: 8px 20px;
  border: none;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.hot-tab.active {
  background: var(--color-primary);
  color: #fff;
}

.hot-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.goods-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

.goods-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.goods-card-link {
  display: block;
}

.goods-card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.goods-card-body {
  padding: 16px;
}

.goods-card-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-card-subtitle {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

.goods-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.goods-card-meta {
  font-size: 12px;
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  color: #E5E5E5;
  font-size: 12px;
}

.star.filled {
  color: var(--color-secondary-gold);
}

/* 游记 */
.article-section {
  padding: 48px 0;
  background: var(--color-bg-primary);
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.article-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

.article-card:hover {
  box-shadow: var(--shadow-medium);
}

.article-card-link {
  display: block;
}

.article-card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.article-card-body {
  padding: 16px;
}

.article-card-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.author-name {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.article-stats {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-left: auto;
}

/* 关于我们 */
.about-section {
  padding: 64px 0;
  background: var(--color-bg-primary);
}

.about-inner {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 48px;
  align-items: center;
}

.about-text h2 {
  font-size: 28px;
  margin-bottom: 20px;
}

.about-text p {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: 12px;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 24px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.stat-num {
  display: block;
  font-size: 36px;
  font-weight: 700;
  color: var(--color-primary);
  font-family: 'DIN Alternate', sans-serif;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-top: 8px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .module-grid,
  .hot-grid,
  .article-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-inner {
    grid-template-columns: 1fr;
  }

  .hero-banner {
    height: 360px;
  }

  .banner-title {
    font-size: 28px;
  }
}

@media (max-width: 640px) {
  .module-grid,
  .hot-grid,
  .article-grid {
    grid-template-columns: 1fr;
  }
}
</style>
