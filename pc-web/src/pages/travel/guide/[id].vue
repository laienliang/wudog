<template>
  <div class="guide-page">
    <div class="container">
      <NuxtLink to="/travel" class="back-link">← 返回景区线路</NuxtLink>
      <article class="guide-article">
        <span class="eyebrow">交通攻略</span>
        <h1>{{ guide.title }}</h1>
        <div class="guide-meta">
          <span>🚀 {{ guide.departure }} → {{ guide.destination }}</span>
          <span>⏱ {{ guide.duration }}</span>
          <span>💰 {{ guide.cost }}</span>
        </div>
        <p class="lead">{{ guide.description }}</p>
        <div class="step-list">
          <div v-for="step in guide.steps" :key="step.title" class="step-item">
            <strong>{{ step.title }}</strong>
            <p>{{ step.content }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const guides = [
  {
    id: 1,
    title: '贵阳→乌东苗寨交通攻略',
    departure: '贵阳',
    destination: '乌东',
    duration: '约3小时',
    cost: '大巴¥80',
    description: '适合从贵阳出发的游客，推荐客车和包车两种方式。',
    steps: [
      { title: '第一段：贵阳到凯里', content: '从贵阳客车站乘坐前往凯里的大巴，约2小时。' },
      { title: '第二段：凯里到乌东', content: '在凯里客车站转乘乡镇班车，约1小时抵达乌东村口。' },
      { title: '到达提示', content: '建议提前联系民宿或商家确认接驳位置。' },
    ],
  },
  {
    id: 2,
    title: '凯里→乌东苗寨交通攻略',
    departure: '凯里',
    destination: '乌东',
    duration: '约1.5小时',
    cost: '大巴¥35',
    description: '凯里出发更适合周边短途游，沿途可欣赏山地与梯田风光。',
    steps: [
      { title: '客车路线', content: '凯里客车站乘坐乌东方向班车，到村口下车。' },
      { title: '自驾路线', content: '导航至乌东村游客服务点，村内道路较窄，注意会车。' },
    ],
  },
];
const guide = computed(() => guides.find((item) => item.id === Number(route.params.id)) || guides[0]);
useHead(() => ({ title: `${guide.value.title} - 乌东文旅` }));
</script>

<style lang="scss" scoped>
.guide-page { min-height: 100vh; background: linear-gradient(180deg, #fff, var(--color-bg-secondary)); padding: 32px 0 56px; }
.back-link { display: inline-block; margin-bottom: 18px; color: var(--color-primary); font-weight: 600; }
.guide-article { max-width: 860px; margin: 0 auto; background: #fff; border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-light); }
.eyebrow { color: var(--color-secondary-gold); font-weight: 700; }
h1 { font-size: 34px; margin: 12px 0; }
.guide-meta { display: flex; gap: 16px; flex-wrap: wrap; color: var(--color-text-secondary); margin-bottom: 18px; }
.lead { font-size: 16px; color: var(--color-text-secondary); line-height: 1.9; }
.step-list { display: grid; gap: 16px; margin-top: 28px; }
.step-item { padding: 18px; background: var(--color-bg-secondary); border-radius: var(--radius-md); }
.step-item p { color: var(--color-text-secondary); margin-top: 6px; line-height: 1.8; }
@media (max-width: 640px) { .guide-article { padding: 24px; } h1 { font-size: 28px; } }
</style>
