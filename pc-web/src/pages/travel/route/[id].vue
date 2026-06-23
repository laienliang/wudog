<template>
  <div class="detail-page">
    <div class="container detail-wrap">
      <NuxtLink to="/travel" class="back-link">← 返回景区线路</NuxtLink>
      <section class="route-hero">
        <img :src="routePlan.image" :alt="routePlan.title" />
        <div class="route-panel">
          <span class="eyebrow">路线套餐</span>
          <h1>{{ routePlan.title }}</h1>
          <p>{{ routePlan.description }}</p>
          <div class="meta-row">
            <span>📅 {{ routePlan.days }}天{{ routePlan.nights ? routePlan.nights + '晚' : '' }}</span>
            <span>👥 {{ routePlan.people }}</span>
            <span>⭐ {{ routePlan.rating }}</span>
          </div>
          <div class="include-row">
            <span v-for="item in routePlan.includes" :key="item">{{ item }}</span>
          </div>
          <div class="price-row"><strong>¥{{ routePlan.price }}</strong><span>起/人</span></div>
          <button class="btn btn-primary" type="button">立即预订</button>
        </div>
      </section>

      <section class="content-card">
        <h2>行程安排</h2>
        <div class="timeline">
          <div v-for="day in routePlan.timeline" :key="day.title" class="timeline-item">
            <strong>{{ day.title }}</strong>
            <p>{{ day.content }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentRoute = useRoute();
const routes = [
  {
    id: 1,
    title: '乌东苗寨深度一日游',
    image: 'https://via.placeholder.com/900x560/F7F8FA/D4A14B?text=一日游',
    days: 1,
    people: '2人成团',
    rating: 4.8,
    price: 298,
    includes: ['三餐', '导游', '门票', '银饰体验'],
    description: '一天走进乌东苗寨核心体验，从梯田晨景到银饰工坊，再到苗家长桌宴。',
    timeline: [
      { title: '上午：梯田与古寨', content: '游览乌东梯田、风雨桥和吊脚楼建筑群。' },
      { title: '下午：非遗体验', content: '参观银饰锻造工坊，体验蜡染纹样制作。' },
      { title: '傍晚：长桌宴', content: '品尝苗家酸汤鱼、糯米饭和节庆小食。' },
    ],
  },
  {
    id: 2,
    title: '苗寨+梯田徒步两日游',
    image: 'https://via.placeholder.com/900x560/F7F8FA/D4A14B?text=两日游',
    days: 2,
    nights: 1,
    people: '4人成团',
    rating: 4.9,
    price: 498,
    includes: ['住宿', '三餐', '徒步', '长桌宴'],
    description: '两天慢行乌东山水，住进吊脚楼民宿，完整体验苗寨清晨与夜晚。',
    timeline: [
      { title: '第一天：抵达与夜游', content: '入住民宿，参加长桌宴和篝火体验。' },
      { title: '第二天：梯田徒步', content: '沿梯田步道徒步，走访银匠和蜡染工坊。' },
    ],
  },
];
const routePlan = computed(() => routes.find((item) => item.id === Number(currentRoute.params.id)) || routes[0]);
useHead(() => ({ title: `${routePlan.value.title} - 乌东文旅` }));
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: var(--color-bg-secondary); padding: 32px 0 56px; }
.back-link { display: inline-block; margin-bottom: 18px; color: var(--color-primary); font-weight: 600; }
.route-hero { display: grid; grid-template-columns: 1.12fr 0.88fr; gap: 28px; }
.route-hero img { width: 100%; height: 460px; object-fit: cover; border-radius: var(--radius-lg); box-shadow: var(--shadow-light); }
.route-panel, .content-card { background: #fff; border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-light); }
.eyebrow { color: var(--color-secondary-gold); font-weight: 700; }
h1 { font-size: 34px; margin: 10px 0; }
.route-panel p { color: var(--color-text-secondary); line-height: 1.9; }
.meta-row, .include-row { display: flex; gap: 10px; flex-wrap: wrap; margin: 18px 0; color: var(--color-text-secondary); }
.include-row span { padding: 5px 10px; border-radius: var(--radius-full); background: var(--color-bg-secondary); font-size: 13px; }
.price-row { display: flex; align-items: baseline; gap: 8px; margin: 18px 0; }
.price-row strong { color: var(--color-secondary-orange); font-size: 34px; }
.content-card { margin-top: 24px; }
.timeline { display: grid; gap: 14px; margin-top: 14px; }
.timeline-item { padding: 18px; border-left: 3px solid var(--color-primary); border-radius: var(--radius-md); background: var(--color-bg-secondary); }
.timeline-item p { margin-top: 6px; color: var(--color-text-secondary); }
@media (max-width: 900px) { .route-hero { grid-template-columns: 1fr; } .route-hero img { height: 280px; } }
</style>
