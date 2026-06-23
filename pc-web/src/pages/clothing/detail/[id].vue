<template>
  <div class="detail-page">
    <div class="container detail-wrap">
      <NuxtLink to="/clothing/list" class="back-link">← 返回非遗商品</NuxtLink>
      <section class="detail-hero">
        <img :src="goods.image" :alt="goods.title" class="detail-image" />
        <div class="detail-panel">
          <span class="eyebrow">非遗手作</span>
          <h1>{{ goods.title }}</h1>
          <p class="subtitle">{{ goods.subtitle }}</p>
          <div class="tag-row">
            <span v-for="tag in goods.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="price-row">
            <strong>¥{{ goods.price }}</strong>
            <span>已售 {{ goods.sales }} 件</span>
          </div>
          <div class="action-row">
            <NuxtLink to="/cart" class="btn btn-primary">加入购物车</NuxtLink>
            <button class="btn btn-outline" type="button">收藏</button>
          </div>
        </div>
      </section>

      <section class="content-grid">
        <article class="content-card">
          <h2>商品详情</h2>
          <p>{{ goods.detail }}</p>
          <ul>
            <li v-for="item in goods.features" :key="item">{{ item }}</li>
          </ul>
        </article>
        <aside class="content-card">
          <h2>服务保障</h2>
          <p>支持本地商家发货、破损补寄、非遗工坊溯源展示。</p>
        </aside>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const clientApi = useClientApi();
const goodsMap = [
  { id: 1, title: '苗族银饰手镯', subtitle: '手工锻造，传承百年工艺', price: 368, sales: 128, image: 'https://via.placeholder.com/720x560/F7F8FA/1F5FA8?text=银饰手镯', tags: ['银饰', '手工锻造', '伴手礼'], detail: '由乌东银匠采用传统錾刻工艺制作，纹样取自苗族山水、蝴蝶与谷穗图腾。', features: ['足银材质，手工打磨', '附赠工坊溯源卡', '适合日常佩戴和节庆搭配'] },
  { id: 2, title: '蜡染布艺挂画', subtitle: '天然植物染料，纯手工制作', price: 198, sales: 86, image: 'https://via.placeholder.com/720x560/F7F8FA/1F5FA8?text=蜡染挂画', tags: ['蜡染', '家居装饰', '植物染'], detail: '采用传统蜡刀绘制纹样，经多次浸染和脱蜡完成，适合客厅、书房与民宿空间。', features: ['天然植物染料', '每幅纹理略有不同', '支持装裱搭配'] },
  { id: 3, title: '苗族刺绣香包', subtitle: '精美刺绣，天然香料填充', price: 68, sales: 256, image: 'https://via.placeholder.com/720x560/F7F8FA/1F5FA8?text=刺绣香包', tags: ['刺绣', '香包', '节庆礼物'], detail: '小巧香包由当地绣娘手工缝制，内置草本香料，适合随身佩戴。', features: ['手工刺绣', '草本香料', '多色可选'] },
];

const goods = ref(goodsMap.find((item) => item.id === Number(route.params.id)) || goodsMap[0]);

onMounted(async () => {
  try {
    const data = await clientApi.detail('clothing', String(route.params.id));
    goods.value = {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle || data.description || '',
      price: data.price || 0,
      sales: data.sales || 0,
      image: data.image || goods.value.image,
      tags: ['非遗手作', data.typeName, data.meta].filter(Boolean),
      detail: data.raw?.detailContent || data.description || goods.value.detail,
      features: [data.raw?.craftIntro, data.raw?.inheritorName ? `传承人：${data.raw.inheritorName}` : '', '本地工坊发货'].filter(Boolean),
    };
  } catch (err) {
    //
  }
});

useHead(() => ({
  title: `${goods.value.title} - 乌东文旅`,
}));
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: var(--color-bg-secondary); padding: 32px 0 56px; }
.back-link { display: inline-block; margin-bottom: 18px; color: var(--color-primary); font-weight: 600; }
.detail-hero { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 28px; align-items: stretch; }
.detail-image { width: 100%; min-height: 420px; object-fit: cover; border-radius: var(--radius-lg); box-shadow: var(--shadow-light); background: #fff; }
.detail-panel, .content-card { background: #fff; border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-light); }
.eyebrow { color: var(--color-secondary-gold); font-weight: 700; }
h1 { font-size: 34px; margin: 10px 0; }
.subtitle { color: var(--color-text-secondary); font-size: 16px; }
.tag-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 22px 0; }
.price-row { display: flex; align-items: baseline; gap: 16px; margin: 20px 0; color: var(--color-text-secondary); }
.price-row strong { color: var(--color-secondary-orange); font-size: 36px; }
.action-row { display: flex; gap: 12px; }
.content-grid { display: grid; grid-template-columns: 1.4fr 0.6fr; gap: 24px; margin-top: 24px; }
.content-card h2 { font-size: 20px; margin-bottom: 12px; }
.content-card p, .content-card li { color: var(--color-text-secondary); line-height: 1.9; }
.content-card ul { padding-left: 18px; margin-top: 10px; }
@media (max-width: 900px) { .detail-hero, .content-grid { grid-template-columns: 1fr; } .detail-image { min-height: 280px; } }
</style>
