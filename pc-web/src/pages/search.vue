<template>
  <div class="search-page">
    <div class="container page-inner">
      <section class="search-hero">
        <div>
          <span class="search-kicker">综合检索</span>
          <h1>搜索“{{ keyword || '乌东文旅' }}”</h1>
          <p>从非遗商品、美食餐厅、特色民宿、旅游线路和社区游记中查找相关内容。</p>
        </div>
        <div class="search-card">
          <input
            v-model="searchText"
            type="text"
            placeholder="搜索商品/餐厅/民宿/线路"
            @keyup.enter="submitSearch"
          />
          <button type="button" @click="submitSearch">搜索</button>
        </div>
      </section>

      <div class="miao-divider"></div>

      <div class="search-summary">
        <span>共找到 {{ filteredResults.length }} 条相关结果</span>
        <div class="search-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="['search-tab', { active: activeType === tab.value }]"
            type="button"
            @click="activeType = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div v-if="visibleResults.length" class="result-grid">
        <NuxtLink
          v-for="item in visibleResults"
          :key="`${item.type}-${item.id}`"
          :to="item.path"
          class="result-card"
        >
          <img :src="item.image" :alt="item.title" class="result-cover" />
          <div class="result-body">
            <span class="result-type">{{ item.typeLabel }}</span>
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <div class="result-meta">
              <span>{{ item.meta }}</span>
              <strong v-if="item.price">¥{{ item.price }}</strong>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="empty-state">
        <h2>暂未找到相关内容</h2>
        <p>换一个关键词试试，比如“银饰”“长桌宴”“民宿”。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type SearchResult = {
  id: number;
  type: 'goods' | 'food' | 'lodging' | 'travel' | 'community';
  typeLabel: string;
  title: string;
  description: string;
  meta: string;
  price?: number;
  image: string;
  path: string;
  keywords: string[];
};

const route = useRoute();
const searchText = ref(String(route.query.q || ''));
const activeType = ref('all');

const tabs = [
  { label: '全部', value: 'all' },
  { label: '商品', value: 'goods' },
  { label: '餐厅', value: 'food' },
  { label: '民宿', value: 'lodging' },
  { label: '线路', value: 'travel' },
  { label: '社区', value: 'community' },
];

const results: SearchResult[] = [
  {
    id: 1,
    type: 'goods',
    typeLabel: '非遗商品',
    title: '苗族剪纸装饰画',
    description: '以苗寨山水和银饰纹样为灵感的手工剪纸装饰画，适合客厅、书房和民宿软装。',
    meta: '已售 96',
    price: 158,
    image: 'https://via.placeholder.com/600x420/F7F8FA/1F5FA8?text=剪纸装饰画',
    path: '/clothing/list',
    keywords: ['剪纸', '装饰画', '非遗', '手工', '苗族'],
  },
  {
    id: 2,
    type: 'goods',
    typeLabel: '非遗商品',
    title: '蜡染布艺挂画',
    description: '天然植物染料制作，纹样来自苗族传统图案。',
    meta: '已售 86',
    price: 198,
    image: 'https://via.placeholder.com/600x420/F7F8FA/1F5FA8?text=蜡染挂画',
    path: '/clothing/list',
    keywords: ['蜡染', '挂画', '装饰画', '布艺'],
  },
  {
    id: 3,
    type: 'food',
    typeLabel: '美食餐厅',
    title: '苗家大院',
    description: '正宗苗家长桌宴，适合家庭聚餐和团队体验。',
    meta: '评分 4.8 · 500m',
    image: 'https://via.placeholder.com/600x420/FFF1EA/E85D2F?text=苗家大院',
    path: '/food/restaurant',
    keywords: ['餐厅', '长桌宴', '苗家菜', '美食'],
  },
  {
    id: 4,
    type: 'lodging',
    typeLabel: '特色民宿',
    title: '山景吊脚楼民宿',
    description: '临近梯田观景台，保留传统吊脚楼木构空间。',
    meta: '可住 2-4 人',
    price: 368,
    image: 'https://via.placeholder.com/600x420/E8F1FB/1F5FA8?text=吊脚楼民宿',
    path: '/lodging/list',
    keywords: ['民宿', '吊脚楼', '住宿', '山景'],
  },
  {
    id: 5,
    type: 'travel',
    typeLabel: '旅游线路',
    title: '乌东苗寨一日游',
    description: '银饰工坊、蜡染体验、梯田徒步和长桌宴组合线路。',
    meta: '约 6 小时',
    price: 128,
    image: 'https://via.placeholder.com/600x420/F6FFED/6B8E3D?text=苗寨线路',
    path: '/travel',
    keywords: ['旅游', '线路', '一日游', '梯田', '体验'],
  },
  {
    id: 6,
    type: 'community',
    typeLabel: '社区游记',
    title: '在乌东村遇见一幅会呼吸的山水画',
    description: '游客分享苗寨清晨、梯田步道和非遗工坊体验。',
    meta: '128 赞 · 24 评',
    image: 'https://via.placeholder.com/600x420/FFF7E6/D4A14B?text=乌东游记',
    path: '/community/feed',
    keywords: ['游记', '社区', '山水', '苗寨'],
  },
];

const keyword = computed(() => String(route.query.q || '').trim());

const filteredResults = computed(() => {
  const value = keyword.value.toLowerCase();

  if (!value) return results;

  return results.filter((item) => {
    const text = [item.title, item.description, item.typeLabel, ...item.keywords].join(' ').toLowerCase();
    return text.includes(value) || value.split(/\s+/).some((word) => text.includes(word));
  });
});

const visibleResults = computed(() => {
  if (activeType.value === 'all') return filteredResults.value;
  return filteredResults.value.filter((item) => item.type === activeType.value);
});

watch(
  () => route.query.q,
  (value) => {
    searchText.value = String(value || '');
    activeType.value = 'all';
  },
);

function submitSearch() {
  const value = searchText.value.trim();
  navigateTo(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
}

useHead(() => ({
  title: `${keyword.value || '搜索'} - 乌东文旅`,
  meta: [{ name: 'description', content: '乌东文旅综合搜索，查找非遗商品、美食餐厅、特色民宿、旅游线路和社区游记。' }],
}));
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 0%, rgba(212, 161, 75, 0.14), transparent 28%),
    linear-gradient(180deg, #fff 0%, var(--color-bg-secondary) 280px);
  padding: 32px 0 56px;
}

.search-hero {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  align-items: end;
  gap: 32px;
  padding: 24px 0 28px;
}

.search-kicker {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: rgba(31, 95, 168, 0.08);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 14px;
}

.search-hero h1 {
  font-size: 36px;
  line-height: 1.2;
  margin-bottom: 12px;
  color: var(--color-text-primary);
}

.search-hero p {
  color: var(--color-text-secondary);
  font-size: 15px;
}

.search-card {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(31, 95, 168, 0.1);
  border-radius: var(--radius-xl);
  box-shadow: 0 14px 32px rgba(31, 95, 168, 0.1);
}

.search-card input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 8px;
  font-size: 14px;
}

.search-card button {
  border: none;
  border-radius: var(--radius-md);
  padding: 10px 18px;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary), #0d7dc4);
  cursor: pointer;
}

.search-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 24px 0;
  color: var(--color-text-secondary);
}

.search-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.search-tab {
  border: 1px solid var(--color-border-primary);
  background: #fff;
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  padding: 7px 16px;
  cursor: pointer;
}

.search-tab.active {
  color: var(--color-primary);
  border-color: rgba(31, 95, 168, 0.22);
  background: linear-gradient(135deg, rgba(31, 95, 168, 0.1), rgba(212, 161, 75, 0.13));
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.result-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.result-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-medium);
}

.result-cover {
  width: 100%;
  height: 190px;
  object-fit: cover;
}

.result-body {
  padding: 18px;
}

.result-type {
  color: var(--color-secondary-gold);
  font-size: 12px;
  font-weight: 700;
}

.result-body h2 {
  font-size: 18px;
  margin: 8px 0;
}

.result-body p {
  color: var(--color-text-secondary);
  font-size: 14px;
  min-height: 44px;
}

.result-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  color: var(--color-text-tertiary);
  font-size: 13px;
}

.result-meta strong {
  color: var(--color-secondary-orange);
  font-size: 18px;
}

.empty-state {
  padding: 72px 24px;
  text-align: center;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
}

.empty-state h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--color-text-secondary);
}

@media (max-width: 960px) {
  .search-hero,
  .result-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .search-hero h1 {
    font-size: 28px;
  }

  .search-summary {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
