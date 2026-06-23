<template>
  <view class="index-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @tap="goSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索乌东文旅</text>
      </view>
    </view>

    <!-- 苗族蜡染纹样分割线 -->
    <view class="miao-divider"></view>

    <!-- Banner 轮播 -->
    <swiper class="banner-swiper" indicator-dots autoplay circular>
      <swiper-item v-for="(banner, idx) in banners" :key="idx">
        <image class="banner-img" :src="banner.image" mode="aspectFill" @tap="onBannerTap(banner)" />
      </swiper-item>
    </swiper>

    <!-- 金刚区入口 -->
    <view class="nav-grid">
      <view class="nav-item" v-for="(item, idx) in navItems" :key="idx" @tap="onNavTap(item.path)">
        <image class="nav-icon" :src="item.icon" />
        <text class="nav-text">{{ item.name }}</text>
      </view>
    </view>

    <!-- 热门推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">热门推荐</text>
        <text class="section-more" @tap="goMore('clothing')">查看更多 ›</text>
      </view>

      <scroll-view scroll-x class="hot-scroll">
        <view class="hot-card" v-for="(item, idx) in hotGoods" :key="idx" @tap="goDetail(item)">
          <image class="hot-img" :src="item.mainImage" mode="aspectFill" />
          <text class="hot-title">{{ item.title }}</text>
          <text class="hot-price">¥{{ item.price }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 精选游记 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">精选游记</text>
        <text class="section-more" @tap="goCommunity">去社区 ›</text>
      </view>

      <view class="article-list">
        <view class="article-card" v-for="(art, idx) in articles" :key="idx" @tap="goArticle(art)">
          <image class="article-thumb" :src="art.images && art.images[0] || '/static/placeholder.png'" mode="aspectFill" />
          <view class="article-info">
            <text class="article-title">{{ art.title }}</text>
            <text class="article-meta">{{ art.nickName }} · {{ art.likes }}赞</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部安全区 -->
    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get } from '../../utils/request';

const banners = ref([
  { image: 'https://via.placeholder.com/750x320/1F5FA8/FFFFFF?text=乌东苗寨', link: '' },
  { image: 'https://via.placeholder.com/750x320/E85D2F/FFFFFF?text=长桌宴', link: '' },
  { image: 'https://via.placeholder.com/750x320/6B8E3D/FFFFFF?text=梯田风光', link: '' },
]);

const navItems = [
  { name: '衣', icon: '/static/tab/home-active.png', path: '/pages_clothing/list' },
  { name: '食', icon: '/static/tab/category-active.png', path: '/pages_food/restaurant/list' },
  { name: '住', icon: '/static/tab/community-active.png', path: '/pages_lodging/list' },
  { name: '行', icon: '/static/tab/mine-active.png', path: '/pages_travel/scenic/list' },
  { name: '社区', icon: '/static/tab/home-active.png', path: '/pages/community' },
  { name: '购物车', icon: '/static/tab/category-active.png', path: '/pages_cart/index' },
];

const hotGoods = ref([]);
const articles = ref([]);

function onBannerTap(banner) {
  if (banner.link) {
    wx.navigateTo({ url: banner.link });
  }
}

function onNavTap(path) {
  if (path.startsWith('/pages/')) {
    wx.switchTab({ url: path });
  } else {
    wx.navigateTo({ url: path });
  }
}

function goSearch() {
  wx.navigateTo({ url: '/pages/search/index' });
}

function goMore(module) {
  const paths = {
    clothing: '/pages_clothing/list',
  };
  wx.navigateTo({ url: paths[module] || '/' });
}

function goCommunity() {
  wx.switchTab({ url: '/pages/community/community' });
}

function goDetail(item) {
  wx.navigateTo({ url: `/pages_clothing/detail?id=${item.id}` });
}

function goArticle(art) {
  wx.navigateTo({ url: `/pages_community/article/detail?id=${art.id}` });
}

onMounted(async () => {
  try {
    const goods = await get('/clothing/goods/page', { page: 1, pageSize: 5, status: 1 });
    if (goods?.list) hotGoods.value = goods.list;
  } catch (e) {
    // 静默失败，首页不影响使用
  }
  try {
    const arts = await get('/community/article/page', { page: 1, pageSize: 3, status: 1 });
    if (arts?.list) articles.value = arts.list;
  } catch (e) {
    //
  }
});
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.search-bar {
  padding: 24rpx 32rpx;
  background: var(--color-primary);
}

.search-input {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40rpx;
  padding: 16rpx 24rpx;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.search-placeholder {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
}

.banner-swiper {
  height: 320rpx;
}

.banner-img {
  width: 100%;
  height: 100%;
}

.nav-grid {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  padding: 24rpx 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16.66%;
  padding: 16rpx 0;
}

.nav-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 8rpx;
}

.nav-text {
  font-size: 24rpx;
  color: var(--color-text-secondary);
}

.section {
  background: #fff;
  margin-top: 16rpx;
  padding: 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--color-text-primary);
}

.section-more {
  font-size: 24rpx;
  color: var(--color-primary);
}

.hot-scroll {
  white-space: nowrap;
}

.hot-card {
  display: inline-block;
  width: 240rpx;
  margin-right: 20rpx;
  vertical-align: top;
}

.hot-img {
  width: 240rpx;
  height: 240rpx;
  border-radius: var(--radius-lg);
  margin-bottom: 12rpx;
}

.hot-title {
  font-size: 26rpx;
  color: var(--color-text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8rpx;
}

.hot-price {
  @extend .price;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.article-card {
  display: flex;
  gap: 20rpx;
}

.article-thumb {
  width: 200rpx;
  height: 160rpx;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-title {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--color-text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  font-size: 22rpx;
  color: var(--color-text-tertiary);
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
