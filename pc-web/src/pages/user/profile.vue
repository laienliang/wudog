<template>
  <div class="profile-page">
    <div class="container">
      <section class="profile-hero">
        <img src="https://via.placeholder.com/96x96/E8F1FB/1F5FA8?text=U" alt="用户头像" />
        <div>
          <span class="eyebrow">个人中心</span>
          <h1>乌东游客</h1>
          <p>管理订单、收藏、游记和出行计划。</p>
        </div>
      </section>
      <section class="profile-grid">
        <NuxtLink v-for="item in entries" :key="item.title" :to="item.path" class="profile-card">
          <strong>{{ item.title }}</strong>
          <span>{{ item.desc }}</span>
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const entries = [
  { title: '我的购物车', desc: '查看待结算商品', path: '/cart' },
  { title: '我的收藏', desc: '商品、民宿和线路', path: '/clothing/list' },
  { title: '我的游记', desc: '查看已发布内容', path: '/community/feed' },
  { title: '出行计划', desc: '查看旅游路线', path: '/travel' },
];
useHead({ title: '个人中心 - 乌东文旅' });
</script>

<style lang="scss" scoped>
.profile-page { min-height: 100vh; background: var(--color-bg-secondary); padding: 32px 0 56px; }
.profile-hero { display: flex; align-items: center; gap: 18px; background: #fff; border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-light); }
.profile-hero img { width: 80px; height: 80px; border-radius: 50%; }
.eyebrow { color: var(--color-primary); font-weight: 700; }
h1 { font-size: 30px; margin: 6px 0; }
p { color: var(--color-text-secondary); }
.profile-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 24px; }
.profile-card { display: flex; flex-direction: column; gap: 8px; background: #fff; border-radius: var(--radius-lg); padding: 22px; box-shadow: var(--shadow-light); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.profile-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-medium); }
.profile-card span { color: var(--color-text-secondary); font-size: 13px; }
@media (max-width: 900px) { .profile-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .profile-grid { grid-template-columns: 1fr; } }
</style>
