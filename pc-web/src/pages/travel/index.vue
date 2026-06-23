<template>
  <div class="travel-page">
    <div class="container page-inner">
      <div class="page-header">
        <h1>景区线路</h1>
        <p class="page-desc">景区门票、旅游路线套餐、交通攻略</p>
      </div>

      <div class="miao-divider"></div>

      <!-- Tab 切换：景区/路线/攻略 -->
      <div class="travel-tabs">
        <button :class="['travel-tab', { active: activeTab === 'scenic' }]" @click="activeTab = 'scenic'">景区</button>
        <button :class="['travel-tab', { active: activeTab === 'route' }]" @click="activeTab = 'route'">路线套餐</button>
        <button :class="['travel-tab', { active: activeTab === 'guide' }]" @click="activeTab = 'guide'">交通攻略</button>
      </div>

      <!-- 景区列表 -->
      <div class="scenic-grid" v-if="activeTab === 'scenic'">
        <div class="scenic-card" v-for="(item, idx) in scenicList" :key="idx">
          <NuxtLink to="/travel" class="scenic-card-link">
            <img :src="item.mainImage" :alt="item.name" class="scenic-img" />
            <div class="scenic-body">
              <h3 class="scenic-name">{{ item.name }}</h3>
              <p class="scenic-address">📍 {{ item.address }}</p>
              <div class="scenic-meta">
                <span class="rating">⭐ {{ item.rating }}</span>
                <span class="hours">🕐 {{ item.openHours }}</span>
              </div>
              <p class="scenic-desc">{{ item.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- 路线列表 -->
      <div class="route-grid" v-if="activeTab === 'route'">
        <div class="route-card" v-for="(item, idx) in routeList" :key="idx">
          <NuxtLink :to="`/travel/route/${item.id}`" class="route-card-link">
            <img :src="item.mainImage" :alt="item.title" class="route-img" />
            <div class="route-body">
              <h3 class="route-title">{{ item.title }}</h3>
              <div class="route-days">📅 {{ item.days }}天{{ item.nights ? item.nights + '晚' : '' }}</div>
              <div class="route-includes">
                <span class="include-tag" v-for="(inc, i) in (item.includes || []).slice(0, 4)" :key="i">{{ inc }}</span>
              </div>
              <div class="route-price-row">
                <span class="price">¥{{ item.price }}</span>
                <span class="price-unit">起/人</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- 攻略列表 -->
      <div class="guide-list" v-if="activeTab === 'guide'">
        <div class="guide-card" v-for="(item, idx) in guideList" :key="idx">
          <NuxtLink :to="`/travel/guide/${item.id}`" class="guide-card-link">
            <div class="guide-body">
              <h3 class="guide-title">{{ item.title }}</h3>
              <div class="guide-meta">
                <span>🚀 {{ item.departure }} → {{ item.destination }}</span>
                <span>⏱ {{ item.duration }}</span>
                <span>💰 {{ item.cost }}</span>
              </div>
              <p class="guide-desc">{{ item.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const activeTab = ref('scenic');
const clientApi = useClientApi();

const fallbackScenicList = [
  { id: 1, name: '乌东梯田景区', mainImage: 'https://via.placeholder.com/600x400/F7F8FA/D4A14B?text=梯田', address: '贵州省黔东南州', rating: 4.8, openHours: '06:00-18:00', description: '千年梯田，四季风光各异，春季灌水如镜，秋季金黄如画。' },
  { id: 2, name: '苗寨古村落', mainImage: 'https://via.placeholder.com/600x400/F7F8FA/D4A14B?text=古村落', address: '乌东村内', rating: 4.6, openHours: '全天开放', description: '保存完好的苗族古建筑群，吊脚楼、风雨桥、鼓楼一应俱全。' },
];

const fallbackRouteList = [
  { id: 1, title: '乌东苗寨深度一日游', mainImage: 'https://via.placeholder.com/600x400/F7F8FA/D4A14B?text=一日游', days: 1, includes: ['三餐', '导游', '门票', '银饰体验'], price: 298 },
  { id: 2, title: '苗寨+梯田徒步两日游', mainImage: 'https://via.placeholder.com/600x400/F7F8FA/D4A14B?text=两日游', days: 2, nights: 1, includes: ['住宿', '三餐', '徒步', '长桌宴'], price: 498 },
];

const fallbackGuideList = [
  { id: 1, title: '贵阳→乌东苗寨交通攻略', departure: '贵阳', destination: '乌东', duration: '约3小时', cost: '大巴¥80', description: '贵阳客车站乘坐大巴至凯里，转乘班车直达乌东村。' },
  { id: 2, title: '凯里→乌东苗寨交通攻略', departure: '凯里', destination: '乌东', duration: '约1.5小时', cost: '大巴¥35', description: '凯里客车站出发，沿途风景优美，可欣赏梯田风光。' },
];

const scenicList = ref(fallbackScenicList);
const routeList = ref(fallbackRouteList);
const guideList = ref(fallbackGuideList);

onMounted(async () => {
  try {
    const [scenicRes, routeRes, guideRes] = await Promise.all([
      clientApi.page('scenic', { page: 1, pageSize: 20 }),
      clientApi.page('route', { page: 1, pageSize: 20 }),
      clientApi.page('guide', { page: 1, pageSize: 20 }),
    ]);
    scenicList.value = scenicRes?.list?.length
      ? scenicRes.list.map(item => ({
          id: item.id,
          name: item.title,
          mainImage: item.image || fallbackScenicList[0].mainImage,
          address: item.address || item.meta,
          rating: item.rating || 5,
          openHours: item.meta || '全天开放',
          description: item.description || item.subtitle,
        }))
      : fallbackScenicList;
    routeList.value = routeRes?.list?.length
      ? routeRes.list.map(item => ({
          id: item.id,
          title: item.title,
          mainImage: item.image || fallbackRouteList[0].mainImage,
          days: Number((item.meta || '').match(/\d+/)?.[0] || 1),
          includes: [item.subtitle, item.description].filter(Boolean),
          price: item.price || 0,
        }))
      : fallbackRouteList;
    guideList.value = guideRes?.list?.length
      ? guideRes.list.map(item => ({
          id: item.id,
          title: item.title,
          departure: item.meta?.split('出发')?.[0] || '乌东',
          destination: '乌东',
          duration: item.meta || '',
          cost: '',
          description: item.description || item.subtitle,
        }))
      : fallbackGuideList;
  } catch (err) {
    scenicList.value = fallbackScenicList;
    routeList.value = fallbackRouteList;
    guideList.value = fallbackGuideList;
  }
});

useHead({
  title: '景区线路 - 乌东文旅',
  meta: [{ name: 'description', content: '景区门票、旅游路线套餐、交通攻略' }],
});
</script>

<style lang="scss" scoped>
.travel-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding: 32px 0;
}

.page-header {
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

.travel-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: #fff;
  padding: 8px;
  border-radius: var(--radius-lg);
  width: fit-content;
}

.travel-tab {
  padding: 10px 28px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.travel-tab.active {
  background: var(--color-primary);
  color: #fff;
}

.scenic-grid,
.route-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.scenic-card,
.route-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

.scenic-card:hover,
.route-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

.scenic-card-link,
.route-card-link {
  display: block;
}

.scenic-img,
.route-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.scenic-body,
.route-body {
  padding: 20px;
}

.scenic-name,
.route-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}

.scenic-address {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.scenic-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.scenic-desc {
  font-size: 14px;
  color: var(--color-text-tertiary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.route-days {
  font-size: 14px;
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: 12px;
}

.route-includes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.include-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.route-price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-unit {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

/* 攻略 */
.guide-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-card-link {
  display: block;
  background: #fff;
  padding: 24px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

.guide-card-link:hover {
  box-shadow: var(--shadow-medium);
}

.guide-title {
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 12px;
}

.guide-meta {
  display: flex;
  gap: 24px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.guide-desc {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

@media (max-width: 768px) {
  .scenic-grid,
  .route-grid {
    grid-template-columns: 1fr;
  }
}
</style>
