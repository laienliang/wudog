<template>
  <div class="lodging-page">
    <div class="container page-inner">
      <div class="page-header">
        <h1>特色民宿</h1>
        <p class="page-desc">苗寨吊脚楼、观景木屋、传统客栈</p>
      </div>

      <div class="miao-divider"></div>

      <!-- 筛选 -->
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">价格：</span>
          <button :class="['filter-btn', { active: activePrice === 'all' }]" @click="activePrice = 'all'">不限</button>
          <button :class="['filter-btn', { active: activePrice === '200' }]" @click="activePrice = '200'">200以下</button>
          <button :class="['filter-btn', { active: activePrice === '500' }]" @click="activePrice = '500'">200-500</button>
          <button :class="['filter-btn', { active: activePrice === '800' }]" @click="activePrice = '800'">500以上</button>
        </div>
        <div class="filter-group">
          <span class="filter-label">设施：</span>
          <button :class="['filter-btn', { active: facilities.includes('wifi') }]" @click="toggleFacility('wifi')">WiFi</button>
          <button :class="['filter-btn', { active: facilities.includes('ac') }]" @click="toggleFacility('ac')">空调</button>
          <button :class="['filter-btn', { active: facilities.includes('bathroom') }]" @click="toggleFacility('bathroom')">独立卫浴</button>
        </div>
      </div>

      <!-- 民宿网格 -->
      <div class="hostel-grid">
        <div class="hostel-card" v-for="(item, idx) in hostels" :key="idx">
          <NuxtLink :to="`/lodging/detail/${item.id}`" class="hostel-card-link">
            <img :src="item.mainImage" :alt="item.name" class="hostel-img" />
            <div class="hostel-body">
              <h3 class="hostel-name">{{ item.name }}</h3>
              <div class="hostel-tags">
                <span class="tag tag-primary" v-for="(t, i) in (item.styleTags || []).slice(0, 2)" :key="i">{{ t }}</span>
              </div>
              <div class="hostel-meta">
                <span class="rating">⭐ {{ item.rating }}</span>
                <span class="reviews">({{ item.reviewCount }}条评价)</span>
              </div>
              <div class="hostel-price-row">
                <span class="price">¥{{ item.price }}</span>
                <span class="price-unit">起/晚</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activePrice = ref('all');
const facilities = ref<string[]>([]);
const clientApi = useClientApi();

function toggleFacility(f: string) {
  const idx = facilities.value.indexOf(f);
  if (idx > -1) facilities.value.splice(idx, 1);
  else facilities.value.push(f);
}

const fallbackHostels = [
  { id: 1, name: '梯田观景民宿', mainImage: 'https://via.placeholder.com/600x400/F7F8FA/6B8E3D?text=梯田观景', styleTags: ['田园风', '吊脚楼'], rating: 4.9, reviewCount: 128, price: 388 },
  { id: 2, name: '苗寨小院', mainImage: 'https://via.placeholder.com/600x400/F7F8FA/6B8E3D?text=苗寨小院', styleTags: ['民族风', '庭院'], rating: 4.7, reviewCount: 86, price: 268 },
  { id: 3, name: '银匠木屋', mainImage: 'https://via.placeholder.com/600x400/F7F8FA/6B8E3D?text=银匠木屋', styleTags: ['文化', '观景'], rating: 4.8, reviewCount: 64, price: 458 },
  { id: 4, name: '古寨客栈', mainImage: 'https://via.placeholder.com/600x400/F7F8FA/6B8E3D?text=古寨客栈', styleTags: ['古建', '经济'], rating: 4.3, reviewCount: 210, price: 168 },
];

const hostels = ref(fallbackHostels);

onMounted(async () => {
  try {
    const res = await clientApi.page('lodging', { page: 1, pageSize: 20 });
    hostels.value = res?.list?.length
      ? res.list.map(item => ({
          id: item.id,
          name: item.title,
          mainImage: item.image || fallbackHostels[0].mainImage,
          styleTags: [item.meta || '苗寨民宿', item.address || '乌东村'],
          rating: item.rating || 5,
          reviewCount: item.comments || 0,
          price: item.price || 0,
        }))
      : fallbackHostels;
  } catch (err) {
    hostels.value = fallbackHostels;
  }
});

useHead({
  title: '特色民宿 - 乌东文旅',
  meta: [{ name: 'description', content: '苗寨吊脚楼、观景木屋、传统客栈在线预订' }],
});
</script>

<style lang="scss" scoped>
.lodging-page {
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

.filter-bar {
  background: #fff;
  padding: 20px 0;
  margin-bottom: 24px;
  border-radius: var(--radius-lg);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.filter-btn {
  padding: 6px 18px;
  border: 1px solid var(--color-border-primary);
  background: #fff;
  border-radius: var(--radius-md);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.hostel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.hostel-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

.hostel-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

.hostel-card-link {
  display: block;
}

.hostel-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.hostel-body {
  padding: 16px;
}

.hostel-name {
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 8px;
}

.hostel-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.hostel-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

.hostel-price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-unit {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

@media (max-width: 1024px) {
  .hostel-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hostel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
