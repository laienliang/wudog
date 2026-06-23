<template>
  <div class="default-layout">
    <SiteHeader />
    <main class="main-content">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import SiteHeader from '~/components/layout/SiteHeader.vue';
import SiteFooter from '~/components/layout/SiteFooter.vue';
</script>

<style lang="scss" scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 24px 0;
}
</style>
