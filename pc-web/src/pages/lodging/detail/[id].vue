<template>
  <div class="detail-page">
    <div class="container detail-wrap">
      <NuxtLink to="/lodging/list" class="back-link">← 返回特色民宿</NuxtLink>
      <section class="lodging-hero">
        <img :src="hostel.image" :alt="hostel.name" />
        <div class="booking-card">
          <span class="eyebrow">特色民宿</span>
          <h1>{{ hostel.name }}</h1>
          <p>{{ hostel.description }}</p>
          <div class="tag-row">
            <span v-for="tag in hostel.tags" :key="tag" class="tag tag-primary">{{ tag }}</span>
          </div>
          <div class="price-row"><strong>¥{{ hostel.price }}</strong><span>起/晚</span></div>
          <button class="btn btn-primary" type="button">立即预订</button>
        </div>
      </section>
      <section class="content-card">
        <h2>房源亮点</h2>
        <div class="feature-grid">
          <span v-for="feature in hostel.features" :key="feature">{{ feature }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const hostels = [
  { id: 1, name: '梯田观景民宿', image: 'https://via.placeholder.com/900x560/F7F8FA/6B8E3D?text=梯田观景', price: 388, tags: ['田园风', '吊脚楼'], description: '推窗可见梯田与山雾，适合周末慢旅行。', features: ['独立卫浴', '观景露台', '早餐', 'WiFi'] },
  { id: 2, name: '苗寨小院', image: 'https://via.placeholder.com/900x560/F7F8FA/6B8E3D?text=苗寨小院', price: 268, tags: ['民族风', '庭院'], description: '安静小院，临近古寨步道和手作工坊。', features: ['庭院', '空调', '茶室', '接送咨询'] },
];
const hostel = computed(() => hostels.find((item) => item.id === Number(route.params.id)) || hostels[0]);
useHead(() => ({ title: `${hostel.value.name} - 乌东文旅` }));
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: var(--color-bg-secondary); padding: 32px 0 56px; }
.back-link { display: inline-block; margin-bottom: 18px; color: var(--color-primary); font-weight: 600; }
.lodging-hero { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 28px; }
.lodging-hero img { width: 100%; height: 460px; object-fit: cover; border-radius: var(--radius-lg); box-shadow: var(--shadow-light); }
.booking-card, .content-card { background: #fff; border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-light); }
.eyebrow { color: var(--color-secondary-green); font-weight: 700; }
h1 { font-size: 34px; margin: 10px 0; }
.booking-card p { color: var(--color-text-secondary); line-height: 1.9; }
.tag-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 18px 0; }
.price-row { display: flex; align-items: baseline; gap: 8px; margin: 18px 0; }
.price-row strong { color: var(--color-secondary-orange); font-size: 34px; }
.content-card { margin-top: 24px; }
.feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 14px; }
.feature-grid span { padding: 14px; border-radius: var(--radius-md); background: var(--color-bg-secondary); text-align: center; }
@media (max-width: 900px) { .lodging-hero, .feature-grid { grid-template-columns: 1fr; } .lodging-hero img { height: 280px; } }
</style>
