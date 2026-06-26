<template>
  <div class="clothing-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>非遗商品</h1>
        <p class="page-desc">苗族银饰、蜡染、刺绣等传统手工艺品</p>
      </div>

      <div class="miao-divider"></div>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">分类：</span>
          <button
            v-for="cat in categories"
            :key="cat.id"
            :class="['filter-btn', { active: activeCategory === cat.id }]"
            @click="activeCategory = cat.id"
          >
            {{ cat.name }}
          </button>
        </div>
        <div class="filter-group">
          <span class="filter-label">排序：</span>
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            :class="['filter-btn', { active: activeSort === opt.value }]"
            @click="activeSort = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 商品网格 -->
      <div class="goods-grid">
        <div class="goods-card-item" v-for="(item, idx) in goodsList" :key="idx">
          <NuxtLink :to="`/clothing/detail/${item.id}`" class="goods-card-link">
            <img :src="item.mainImage" :alt="item.title" class="goods-img" />
            <div class="goods-body">
              <h3 class="goods-title">{{ item.title }}</h3>
              <p class="goods-subtitle">{{ item.subtitle }}</p>
              <div class="goods-footer">
                <span class="price">¥{{ item.price }}</span>
                <span class="goods-sales">已售 {{ item.sales }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const clientApi = useClientApi();

const categories = ref([
  { id: 0, name: '全部' },
  { id: 1, name: '银饰' },
  { id: 2, name: '蜡染' },
  { id: 3, name: '刺绣' },
  { id: 4, name: '服饰' },
]);

const sortOptions = [
  { label: '综合', value: 'default' },
  { label: '销量', value: 'sales' },
  { label: '价格 ↑', value: 'price_asc' },
  { label: '价格 ↓', value: 'price_desc' },
];

const activeCategory = ref(0);
const activeSort = ref('default');
const currentPage = ref(1);
const pageSize = 12;
const total = ref(48);

// Mock 数据
const fallbackGoods = [
  { id: 1, title: '苗族银饰手镯', subtitle: '手工锻造，传承百年工艺', price: 368, mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=银饰手镯', sales: 128 },
  { id: 2, title: '蜡染布艺挂画', subtitle: '天然植物染料，纯手工制作', price: 198, mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=蜡染挂画', sales: 86 },
  { id: 3, title: '苗族刺绣香包', subtitle: '精美刺绣，天然香料填充', price: 68, mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=刺绣香包', sales: 256 },
  { id: 4, title: '苗服日常款', subtitle: '传统纹样，现代剪裁', price: 588, mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=苗服', sales: 42 },
  { id: 5, title: '银头饰套装', subtitle: '新娘必备，精工细作', price: 1280, mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=头饰', sales: 18 },
  { id: 6, title: '蜡染围巾', subtitle: '便携实用，送礼佳品', price: 128, mainImage: 'https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=围巾', sales: 312 },
];

const goodsList = ref(fallbackGoods);

async function loadGoods() {
  try {
    const [categoryRes, goodsRes] = await Promise.all([
      clientApi.categories(),
      clientApi.page('clothing', {
        page: currentPage.value,
        pageSize,
        categoryId: activeCategory.value || undefined,
      }),
    ]);
    categories.value = [{ id: 0, name: '全部' }, ...(categoryRes?.clothing || [])];
    total.value = goodsRes?.pagination?.total || 0;
    goodsList.value = goodsRes?.list?.length
      ? goodsRes.list.map(item => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle || item.description,
          price: item.price || 0,
          mainImage: item.image,
          sales: item.sales || 0,
        }))
      : fallbackGoods;
  } catch (err) {
    goodsList.value = fallbackGoods;
  }
}

watch([activeCategory, currentPage], loadGoods);
onMounted(loadGoods);

useHead({
  title: '非遗商品 - 乌东文旅',
  meta: [{ name: 'description', content: '苗族银饰、蜡染、刺绣等传统手工艺品在线选购' }],
});
</script>

<style lang="scss" scoped>
.clothing-page {
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
  padding: 20px 24px;
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
  border-radius: var(--radius-full);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.goods-card-item {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

.goods-card-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

.goods-card-link {
  display: block;
}

.goods-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.goods-card-item:hover .goods-img {
  transform: scale(1.05);
}

.goods-body {
  padding: 16px;
}

.goods-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
}

.goods-subtitle {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-bottom: 12px;
}

.goods-footer {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.goods-sales {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 20px 0;
}

@media (max-width: 1024px) {
  .goods-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .goods-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
