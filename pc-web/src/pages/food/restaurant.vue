<template>
  <div class="food-restaurant-page">
    <div class="container page-inner">
      <div class="page-header">
        <h1>美食餐厅</h1>
        <p class="page-desc">苗家长桌宴、农家特色菜、农产品特产</p>
      </div>

      <div class="miao-divider"></div>

      <!-- 餐厅网格 -->
      <div class="restaurant-grid">
        <div class="restaurant-card" v-for="(item, idx) in restaurants" :key="idx">
          <NuxtLink :to="`/food/restaurant/${item.id}`" class="restaurant-card-link">
            <img :src="item.cover" :alt="item.name" class="restaurant-cover" />
            <div class="restaurant-body">
              <h3 class="restaurant-name">{{ item.name }}</h3>
              <div class="restaurant-tags">
                <span class="tag" v-for="(t, i) in item.tags" :key="i">{{ t }}</span>
              </div>
              <div class="restaurant-meta">
                <span class="rating">⭐ {{ item.rating }}</span>
                <span class="distance">📍 {{ item.distance }}</span>
              </div>
              <p class="restaurant-desc">{{ item.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const restaurants = ref([
  { id: 1, name: '苗家大院', cover: 'https://via.placeholder.com/600x400/FFF1EA/E85D2F?text=苗家大院', tags: ['长桌宴', '苗家菜'], rating: 4.8, distance: '500m', description: '正宗苗家菜，特色长桌宴，体验最地道的乌东风味。' },
  { id: 2, name: '梯田人家', cover: 'https://via.placeholder.com/600x400/E8F1FB/1F5FA8?text=梯田人家', tags: ['农家菜', '观景'], rating: 4.5, distance: '800m', description: '坐拥梯田美景，食材全部来自本地农家。' },
  { id: 3, name: '银匠厨房', cover: 'https://via.placeholder.com/600x400/FFF7E6/D4A14B?text=银匠厨房', tags: ['银饰体验', '美食'], rating: 4.9, distance: '300m', description: '边看银饰锻造边品尝苗家美食，独特体验。' },
  { id: 4, name: '蜡染小馆', cover: 'https://via.placeholder.com/600x400/F6FFED/6B8E3D?text=蜡染小馆', tags: ['蜡染体验', '素食'], rating: 4.6, distance: '600m', description: '结合蜡染艺术的素食餐厅，清新雅致。' },
]);

useHead({
  title: '美食餐厅 - 乌东文旅',
  meta: [{ name: 'description', content: '苗家长桌宴、农家特色菜、农产品特产' }],
});
</script>

<style lang="scss" scoped>
.food-restaurant-page {
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

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.restaurant-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

.restaurant-card:hover {
  box-shadow: var(--shadow-medium);
}

.restaurant-card-link {
  display: block;
}

.restaurant-cover {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.restaurant-body {
  padding: 20px;
}

.restaurant-name {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 12px;
}

.restaurant-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.restaurant-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

.restaurant-desc {
  font-size: 14px;
  color: var(--color-text-tertiary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .restaurant-grid {
    grid-template-columns: 1fr;
  }
}
</style>
