<template>
  <div class="publish-page">
    <div class="container">
      <NuxtLink to="/community/feed" class="back-link">← 返回游记社区</NuxtLink>
      <section class="publish-card">
        <div class="publish-head">
          <span class="eyebrow">发布游记</span>
          <h1>记录你的乌东之旅</h1>
          <p>分享风景、美食、民宿和非遗体验，让更多人看见苗寨生活。</p>
        </div>
        <div class="form-grid">
          <input v-model="title" type="text" placeholder="游记标题" />
          <input v-model="cover" type="text" placeholder="封面图片地址" />
          <textarea v-model="content" placeholder="写下你的旅行故事"></textarea>
          <button class="btn btn-primary" type="button" @click="publish">发布</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const title = ref('');
const cover = ref('');
const content = ref('');

function publish() {
  if (!title.value.trim() || !content.value.trim()) {
    alert('请填写标题和正文');
    return;
  }
  alert('游记已保存为草稿，后续可接入发布接口');
}

useHead({ title: '发布游记 - 乌东文旅' });
</script>

<style lang="scss" scoped>
.publish-page { min-height: 100vh; background: linear-gradient(180deg, #fff, var(--color-bg-secondary)); padding: 32px 0 56px; }
.back-link { display: inline-block; margin-bottom: 18px; color: var(--color-primary); font-weight: 600; }
.publish-card { background: #fff; border-radius: var(--radius-lg); padding: 36px; box-shadow: var(--shadow-light); }
.eyebrow { color: var(--color-primary); font-weight: 700; }
h1 { font-size: 32px; margin: 10px 0; }
.publish-head p { color: var(--color-text-secondary); }
.form-grid { display: grid; gap: 16px; margin-top: 28px; }
input, textarea { width: 100%; border: 1px solid var(--color-border-primary); border-radius: var(--radius-md); padding: 13px 16px; font-size: 14px; outline: none; }
textarea { min-height: 220px; resize: vertical; }
input:focus, textarea:focus { border-color: var(--color-primary); }
.btn { justify-self: start; }
</style>
