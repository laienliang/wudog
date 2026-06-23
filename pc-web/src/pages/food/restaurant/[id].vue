<template>
  <div class="detail-page">
    <div class="container detail-wrap">
      <NuxtLink to="/food/restaurant" class="back-link">← 返回美食餐厅</NuxtLink>
      <section class="restaurant-hero">
        <img :src="restaurant.cover" :alt="restaurant.name" />
        <div class="hero-copy">
          <span class="eyebrow">苗家风味</span>
          <h1>{{ restaurant.name }}</h1>
          <p>{{ restaurant.description }}</p>
          <div class="meta-row">
            <span>⭐ {{ restaurant.rating }}</span>
            <span>📍 {{ restaurant.distance }}</span>
            <span>人均 ¥{{ restaurant.avg }}</span>
          </div>
          <div class="tag-row">
            <span v-for="tag in restaurant.tags" :key="tag" class="tag tag-orange">{{ tag }}</span>
          </div>
          <button class="btn btn-primary" type="button">预订餐位</button>
        </div>
      </section>
      <section class="menu-card">
        <h2>招牌推荐</h2>
        <div class="menu-grid">
          <div v-for="dish in restaurant.menu" :key="dish.name" class="menu-item">
            <strong>{{ dish.name }}</strong>
            <span>¥{{ dish.price }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const restaurants = [
  { id: 1, name: '苗家大院', cover: 'https://via.placeholder.com/900x560/FFF1EA/E85D2F?text=苗家大院', tags: ['长桌宴', '苗家菜'], rating: 4.8, distance: '500m', avg: 88, description: '正宗苗家菜，特色长桌宴，适合家庭聚餐和团队体验。', menu: [{ name: '酸汤鱼', price: 128 }, { name: '苗家腊肉', price: 68 }, { name: '糯米饭', price: 28 }] },
  { id: 2, name: '梯田人家', cover: 'https://via.placeholder.com/900x560/E8F1FB/1F5FA8?text=梯田人家', tags: ['农家菜', '观景'], rating: 4.5, distance: '800m', avg: 76, description: '坐拥梯田美景，食材全部来自本地农家。', menu: [{ name: '梯田稻花鱼', price: 118 }, { name: '时令野菜', price: 36 }] },
];
const restaurant = computed(() => restaurants.find((item) => item.id === Number(route.params.id)) || restaurants[0]);
useHead(() => ({ title: `${restaurant.value.name} - 乌东文旅` }));
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: var(--color-bg-secondary); padding: 32px 0 56px; }
.back-link { display: inline-block; margin-bottom: 18px; color: var(--color-primary); font-weight: 600; }
.restaurant-hero { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 28px; }
.restaurant-hero img { width: 100%; height: 460px; object-fit: cover; border-radius: var(--radius-lg); box-shadow: var(--shadow-light); }
.hero-copy, .menu-card { background: #fff; border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-light); }
.eyebrow { color: var(--color-secondary-orange); font-weight: 700; }
h1 { font-size: 34px; margin: 10px 0; }
.hero-copy p { color: var(--color-text-secondary); line-height: 1.9; }
.meta-row, .tag-row { display: flex; gap: 10px; flex-wrap: wrap; margin: 18px 0; color: var(--color-text-secondary); }
.menu-card { margin-top: 24px; }
.menu-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 14px; }
.menu-item { display: flex; justify-content: space-between; padding: 16px; border-radius: var(--radius-md); background: var(--color-bg-secondary); }
.menu-item span { color: var(--color-secondary-orange); font-weight: 700; }
@media (max-width: 900px) { .restaurant-hero, .menu-grid { grid-template-columns: 1fr; } .restaurant-hero img { height: 280px; } }
</style>
