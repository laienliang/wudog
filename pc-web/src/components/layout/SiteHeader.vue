<template>
  <header class="site-header">
    <div class="container header-inner">
      <!-- Logo -->
      <NuxtLink to="/" class="logo">
        <span class="logo-mark">
          <img :src="logoSrc" alt="乌东文旅" class="logo-img" />
        </span>
        <span class="logo-copy">
          <span class="logo-text">乌东文旅</span>
          <span class="logo-subtitle">苗寨生活服务</span>
        </span>
      </NuxtLink>

      <!-- 主导航 -->
      <nav class="main-nav">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="active"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- 搜索框 -->
      <div class="search-box">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜索商品/餐厅/民宿/线路"
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>

      <!-- 用户区 -->
      <div class="user-area">
        <template v-if="isLoggedIn">
          <NuxtLink to="/user/profile" class="user-avatar">
            <img :src="userAvatar" alt="头像" />
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/user/login" class="btn btn-outline btn-sm">登录</NuxtLink>
          <NuxtLink to="/user/login" class="btn btn-primary btn-sm">注册</NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const keyword = ref('');
const isLoggedIn = ref(false);
const userAvatar = ref('');
const logoSrc = '/logo-wudong.png';

const navItems = [
  { label: '衣', path: '/clothing/list' },
  { label: '食', path: '/food/restaurant' },
  { label: '住', path: '/lodging/list' },
  { label: '行', path: '/travel' },
  { label: '社区', path: '/community/feed' },
];

function handleSearch() {
  if (!keyword.value.trim()) return;
  navigateTo(`/search?q=${encodeURIComponent(keyword.value)}`);
}
</script>

<style lang="scss" scoped>
.site-header {
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.96), rgba(252, 248, 238, 0.94)),
    radial-gradient(circle at 12% 0%, rgba(212, 161, 75, 0.18), transparent 34%);
  border-bottom: 1px solid rgba(31, 95, 168, 0.1);
  box-shadow: 0 12px 34px rgba(31, 95, 168, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(14px);
}

.header-inner {
  display: flex;
  align-items: center;
  height: var(--header-height);
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  min-width: 178px;
  padding: 6px 12px 6px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(31, 95, 168, 0.1);
  box-shadow: 0 10px 26px rgba(31, 95, 168, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.logo:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(31, 95, 168, 0.13);
}

.logo-mark {
  position: relative;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(145deg, #fff, #f3f8ff);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.9), 0 8px 18px rgba(31, 95, 168, 0.18);
  overflow: hidden;
}

.logo-mark::after {
  content: '';
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  border: 1px solid rgba(212, 161, 75, 0.42);
  pointer-events: none;
}

.logo-img {
  width: 42px;
  height: 42px;
  object-fit: cover;
  transform: scale(1.35);
}

.logo-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  padding-left: 10px;
  border-left: 1px solid rgba(212, 161, 75, 0.45);
}

.logo-text {
  font-size: 21px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0;
  color: var(--color-primary);
}

.logo-subtitle {
  font-size: 11px;
  line-height: 1;
  color: var(--color-secondary-gold);
  white-space: nowrap;
}

.main-nav {
  display: flex;
  gap: 8px;
  flex: 1;
}

.nav-link {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--color-primary);
  background: rgba(31, 95, 168, 0.08);
}

.nav-link.active {
  color: var(--color-primary);
  background: linear-gradient(135deg, rgba(31, 95, 168, 0.12), rgba(212, 161, 75, 0.16));
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 320px;
}

.search-input {
  flex: 1;
  height: 36px;
  padding: 0 16px;
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-full);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: linear-gradient(135deg, var(--color-primary), #0d7dc4);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
}

.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.user-avatar {
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.btn-sm {
  padding: 6px 16px;
  font-size: 13px;
  height: auto;
}

@media (max-width: 960px) {
  .header-inner {
    gap: 16px;
  }

  .logo {
    min-width: auto;
  }

  .logo-subtitle,
  .search-box {
    display: none;
  }
}

@media (max-width: 640px) {
  .header-inner {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: var(--header-height);
    padding: 8px 12px;
    flex-wrap: wrap;
    gap: 8px 12px;
  }

  .logo {
    padding-right: 14px;
  }

  .main-nav {
    order: 3;
    width: calc(100vw - 24px);
    min-width: 0;
    flex: 0 0 calc(100vw - 24px);
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 4px;
  }

  .nav-link {
    padding: 7px 0;
    text-align: center;
    font-size: 14px;
  }

  .user-area {
    display: none;
  }
}
</style>
