<template>
  <view class="index-page">
    <view class="hero">
      <view class="hero-pattern"></view>
      <view class="hero-top">
        <view>
          <text class="hero-kicker">乌东文旅</text>
          <text class="hero-title">把苗岭的衣食住行装进口袋</text>
        </view>
        <view class="weather-pill">
          <text>晴游</text>
        </view>
      </view>

      <view class="search-bar" @tap="goSearch">
        <ui-icon name="search" :size="20" color="var(--color-cinnabar)" />
        <text class="search-placeholder">搜索景点、美食、民宿、非遗好物</text>
      </view>

      <swiper class="banner-swiper" indicator-dots autoplay circular>
        <swiper-item v-for="banner in banners" :key="banner.id || banner.image">
          <view class="banner-card" @tap="onBannerTap(banner)">
            <image class="banner-img" :src="imageOf(banner.image)" mode="aspectFill" />
            <view class="banner-mask"></view>
            <view class="banner-copy">
              <text class="banner-label">今日推荐</text>
              <text class="banner-title">{{ banner.title || '乌东苗寨慢游季' }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view class="miao-divider"></view>

    <view class="primary-menu">
      <view class="menu-heading">
        <text class="menu-kicker">衣食住行</text>
        <text class="menu-title">四路进乌东</text>
      </view>
      <view class="nav-grid">
        <view class="nav-item" v-for="item in navItems" :key="item.name" :class="item.tone" @tap="onNavTap(item.path)">
          <view class="nav-mark">
            <ui-icon :name="item.icon" :size="31" color="#fff" :stroke-width="2" />
          </view>
          <text class="nav-letter">{{ item.name }}</text>
          <view class="nav-copy">
            <text class="nav-title">{{ item.title }}</text>
            <text class="nav-subtitle">{{ item.subtitle }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <view>
          <text class="section-kicker">Market</text>
          <text class="section-title">非遗好物</text>
        </view>
        <text class="section-more" @tap="goMore('clothing')">全部 ›</text>
      </view>

      <scroll-view scroll-x class="hot-scroll" enable-flex>
        <view class="hot-card" v-for="item in hotGoods" :key="item.id" @tap="goDetail(item)">
          <image class="hot-img" :src="imageOf(item.mainImage)" mode="aspectFill" />
          <view class="hot-body">
            <text class="hot-type">{{ item.typeName || '非遗商品' }}</text>
            <text class="hot-title">{{ item.title }}</text>
            <view class="hot-meta">
              <text class="hot-price">¥{{ item.price || '--' }}</text>
              <text class="hot-sales">{{ item.sales || 0 }} 人带走</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="channel-grid">
      <view class="channel-card food" @tap="onNavTap('/pages_food/restaurant/list')">
        <view class="channel-icon">
          <ui-icon name="food" :size="32" color="#fff" :stroke-width="2" />
        </view>
        <view class="channel-copy">
          <text class="channel-name">食</text>
          <text class="channel-title">长桌宴和山野味</text>
          <text class="channel-desc">{{ channelSummary.food }}</text>
        </view>
      </view>
      <view class="channel-card stay" @tap="onNavTap('/pages_lodging/list')">
        <view class="channel-icon">
          <ui-icon name="lodging" :size="32" color="#fff" :stroke-width="2" />
        </view>
        <view class="channel-copy">
          <text class="channel-name">住</text>
          <text class="channel-title">住进吊脚楼的清晨</text>
          <text class="channel-desc">{{ channelSummary.lodging }}</text>
        </view>
      </view>
      <view class="channel-card travel" @tap="onNavTap('/pages_travel/scenic/list')">
        <view class="channel-icon">
          <ui-icon name="travel" :size="34" color="#fff" :stroke-width="2" />
        </view>
        <view class="channel-copy">
          <text class="channel-name">行</text>
          <text class="channel-title">梯田、古寨和路线</text>
          <text class="channel-desc">{{ channelSummary.travel }}</text>
        </view>
      </view>
    </view>

    <view class="section article-section">
      <view class="section-header">
        <view>
          <text class="section-kicker">Stories</text>
          <text class="section-title">精选游记</text>
        </view>
        <text class="section-more" @tap="goCommunity">社区 ›</text>
      </view>

      <view class="article-list">
        <view class="article-card" v-for="art in articles" :key="art.id" @tap="goArticle(art)">
          <image class="article-thumb" :src="imageOf(art.images && art.images[0])" mode="aspectFill" />
          <view class="article-info">
            <text class="article-title">{{ art.title }}</text>
            <text class="article-meta">{{ art.nickName }} · {{ art.likes }} 赞</text>
          </view>
        </view>
      </view>
    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { get } from '../../utils/request'
import UiIcon from '../../components/ui-icon.vue'

const placeholder = '/static/placeholder.png'

const banners = ref([
  { id: 'local-1', title: '乌东苗寨慢游季', image: placeholder, link: '' },
  { id: 'local-2', title: '长桌宴正在开席', image: placeholder, link: '' },
])

const navItems = [
  { name: '衣', title: '非遗好物', subtitle: '银饰 蜡染 刺绣', icon: 'clothing', tone: 'tone-cloth', path: '/pages_clothing/list' },
  { name: '食', title: '苗家味道', subtitle: '餐厅 农产 长桌宴', icon: 'food', tone: 'tone-food', path: '/pages_food/restaurant/list' },
  { name: '住', title: '山居民宿', subtitle: '吊脚楼 观景房', icon: 'lodging', tone: 'tone-stay', path: '/pages_lodging/list' },
  { name: '行', title: '景点路线', subtitle: '梯田 古寨 攻略', icon: 'travel', tone: 'tone-travel', path: '/pages_travel/scenic/list' },
]

const hotGoods = ref([])
const hotFood = ref([])
const hotLodging = ref([])
const hotTravel = ref([])
const articles = ref([])

const channelSummary = computed(() => ({
  food: hotFood.value[0]?.title || '苗家酸汤、稻花鱼和节庆长桌宴',
  lodging: hotLodging.value[0]?.title || '住在可看见梯田晨雾的木楼里',
  travel: hotTravel.value[0]?.title || '从梯田到古寨，一路收集风景',
}))

function imageOf(src) {
  return src || placeholder
}

function onBannerTap(banner) {
  if (banner.link) {
    uni.navigateTo({ url: banner.link })
  }
}

function onNavTap(path) {
  if (path.startsWith('/pages/') && !path.includes('_')) {
    uni.switchTab({ url: path })
  } else {
    uni.navigateTo({ url: path })
  }
}

function goSearch() {
  uni.navigateTo({ url: '/pages/search/index' })
}

function goMore(module) {
  const paths = { clothing: '/pages_clothing/list' }
  uni.navigateTo({ url: paths[module] || '/pages/index/index' })
}

function goCommunity() {
  uni.switchTab({ url: '/pages/community/community' })
}

function goDetail(item) {
  uni.navigateTo({ url: item.miniPath || `/pages_clothing/detail?id=${item.id}` })
}

function goArticle(art) {
  uni.navigateTo({ url: art.miniPath || `/pages_community/article/detail?id=${art.id}` })
}

function normalizeCard(item) {
  return {
    id: item.id,
    type: item.type,
    typeName: item.typeName,
    title: item.title,
    subtitle: item.subtitle,
    price: item.price,
    mainImage: item.image,
    sales: item.sales || 0,
    miniPath: item.miniPath,
    meta: item.meta,
  }
}

onMounted(async () => {
  try {
    const home = await get('/home')
    if (home?.banners?.length) {
      banners.value = home.banners.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        link: item.link || '',
      }))
    }
    hotGoods.value = (home?.hot?.clothing || []).map(normalizeCard)
    hotFood.value = (home?.hot?.food || []).map(normalizeCard)
    hotLodging.value = (home?.hot?.lodging || []).map(normalizeCard)
    hotTravel.value = (home?.hot?.travel || []).map(normalizeCard)
    articles.value = (home?.articles || []).map(item => ({
      id: item.id,
      title: item.title,
      images: item.images || (item.image ? [item.image] : []),
      nickName: item.meta || '乌东游客',
      likes: item.likes || 0,
      miniPath: item.miniPath,
    }))
  } catch (e) {
    hotGoods.value = [
      { id: 1, title: '苗族银饰手镯', price: 368, mainImage: placeholder, sales: 128 },
      { id: 2, title: '植物蜡染挂画', price: 198, mainImage: placeholder, sales: 86 },
    ]
    articles.value = [
      { id: 1, title: '清晨走进乌东梯田，雾气像一层轻纱', images: [placeholder], nickName: '山里来客', likes: 128 },
    ]
  }
})
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 92% 4%, rgba(216, 75, 42, 0.14), transparent 220rpx),
    linear-gradient(180deg, #153b5f 0, #153b5f 430rpx, var(--color-bg-secondary) 431rpx);
}

.hero {
  position: relative;
  padding: 34rpx 28rpx 30rpx;
  color: #fff;
  overflow: hidden;
}

.hero-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.16;
  background-image:
    linear-gradient(45deg, transparent 44%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.85) 48%, transparent 49%),
    linear-gradient(-45deg, transparent 44%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.55) 48%, transparent 49%);
  background-size: 56rpx 56rpx;
}

.hero-top {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28rpx;
}

.hero-kicker,
.section-kicker {
  display: block;
  font-size: 20rpx;
  letter-spacing: 0;
  opacity: 0.75;
}

.hero-title {
  display: block;
  width: 650rpx;
  max-width: calc(100vw - 170rpx);
  margin-top: 10rpx;
  font-size: 46rpx;
  line-height: 1.16;
  font-weight: 700;
}

.weather-pill {
  padding: 10rpx 18rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.42);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.12);
  font-size: 22rpx;
}

.search-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  height: 84rpx;
  padding: 0 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.34);
  border-radius: var(--radius-full);
  background: rgba(255, 250, 241, 0.96);
  box-shadow: 0 18rpx 38rpx rgba(0, 0, 0, 0.16);
}

.search-placeholder {
  color: var(--color-text-secondary);
  font-size: 26rpx;
}

.banner-swiper {
  position: relative;
  z-index: 1;
  height: 330rpx;
  margin-top: 28rpx;
}

.banner-card {
  position: relative;
  height: 100%;
  border-radius: 28rpx;
  overflow: hidden;
  background: #d9e3ed;
  box-shadow: 0 24rpx 54rpx rgba(0, 0, 0, 0.20);
}

.banner-img,
.banner-mask {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.banner-mask {
  background: linear-gradient(90deg, rgba(15, 37, 59, 0.72), rgba(15, 37, 59, 0.14));
}

.banner-copy {
  position: absolute;
  left: 28rpx;
  bottom: 28rpx;
  right: 28rpx;
}

.banner-label {
  display: inline-block;
  padding: 8rpx 16rpx;
  border-radius: var(--radius-full);
  background: rgba(216, 75, 42, 0.92);
  font-size: 20rpx;
}

.banner-title {
  display: block;
  margin-top: 14rpx;
  font-size: 34rpx;
  font-weight: 700;
}

.primary-menu {
  margin: 24rpx;
  padding: 22rpx;
  border: 1rpx solid rgba(18, 36, 58, 0.08);
  border-radius: 30rpx;
  background:
    linear-gradient(135deg, rgba(255, 250, 241, 0.96), rgba(247, 240, 228, 0.9)),
    repeating-linear-gradient(135deg, rgba(31, 95, 168, 0.08) 0 8rpx, transparent 8rpx 24rpx);
  box-shadow: var(--shadow-card);
}

.menu-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.menu-kicker,
.menu-title {
  display: block;
}

.menu-kicker {
  color: var(--color-cinnabar);
  font-size: 21rpx;
  font-weight: 800;
}

.menu-title {
  color: var(--color-ink);
  font-size: 31rpx;
  font-weight: 800;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 148rpx;
  padding: 22rpx 18rpx;
  border-radius: 24rpx;
  background: #fff;
  box-shadow: 0 14rpx 30rpx rgba(18, 36, 58, 0.07);
  overflow: hidden;
}

.nav-item::before {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image:
    linear-gradient(45deg, currentColor 10%, transparent 11%, transparent 89%, currentColor 90%),
    linear-gradient(-45deg, currentColor 10%, transparent 11%, transparent 89%, currentColor 90%);
  background-size: 34rpx 34rpx;
  content: '';
}

.nav-item::after {
  position: absolute;
  right: -30rpx;
  top: -34rpx;
  width: 118rpx;
  height: 118rpx;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.1;
  content: '';
}

.nav-mark {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 76rpx;
  width: 76rpx;
  height: 76rpx;
  margin-right: 16rpx;
  border-radius: 22rpx;
  color: #fff;
  box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.2);
}

.nav-mark::after {
  position: absolute;
  inset: 8rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.26);
  border-radius: 17rpx;
  content: '';
}

.nav-mark :deep(svg) {
  position: relative;
  z-index: 1;
}

.nav-letter {
  position: absolute;
  right: 18rpx;
  bottom: 8rpx;
  color: currentColor;
  font-size: 68rpx;
  font-weight: 800;
  line-height: 1;
  opacity: 0.1;
}

.tone-cloth { color: #1f5fa8; }
.tone-food { color: #d84b2a; }
.tone-stay { color: #5f7d50; }
.tone-travel { color: #c79239; }
.tone-cloth .nav-mark { background: linear-gradient(135deg, #1f5fa8, #153b5f); }
.tone-food .nav-mark { background: linear-gradient(135deg, #d84b2a, #a83522); }
.tone-stay .nav-mark { background: linear-gradient(135deg, #5f7d50, #38543b); }
.tone-travel .nav-mark { background: linear-gradient(135deg, #c79239, #8e6422); }

.nav-copy {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
}

.nav-title,
.nav-subtitle {
  display: block;
}

.nav-title {
  color: var(--color-ink);
  font-size: 28rpx;
  font-weight: 700;
}

.nav-subtitle {
  margin-top: 6rpx;
  color: var(--color-text-tertiary);
  font-size: 21rpx;
}

.section {
  margin: 8rpx 24rpx 24rpx;
  padding: 24rpx;
  border-radius: 26rpx;
  background: var(--color-paper);
  box-shadow: var(--shadow-card);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24rpx;
}

.section-kicker {
  color: var(--color-cinnabar);
}

.section-title {
  display: block;
  margin-top: 4rpx;
  color: var(--color-ink);
  font-size: 34rpx;
  font-weight: 800;
}

.section-more {
  color: var(--color-indigo);
  font-size: 24rpx;
}

.hot-scroll {
  white-space: nowrap;
}

.hot-card {
  display: inline-block;
  width: 280rpx;
  margin-right: 18rpx;
  overflow: hidden;
  border-radius: 22rpx;
  background: #fff;
  vertical-align: top;
}

.hot-img {
  width: 280rpx;
  height: 250rpx;
  background: var(--color-indigo-soft);
}

.hot-body {
  padding: 16rpx;
}

.hot-type {
  color: var(--color-cinnabar);
  font-size: 20rpx;
}

.hot-title {
  display: block;
  height: 68rpx;
  margin-top: 6rpx;
  color: var(--color-ink);
  font-size: 26rpx;
  font-weight: 700;
  line-height: 34rpx;
  white-space: normal;
  overflow: hidden;
}

.hot-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10rpx;
}

.hot-price {
  color: var(--color-cinnabar);
  font-size: 30rpx;
  font-weight: 800;
}

.hot-sales {
  color: var(--color-text-tertiary);
  font-size: 20rpx;
}

.channel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
  padding: 0 24rpx 24rpx;
}

.channel-card {
  position: relative;
  display: flex;
  gap: 18rpx;
  min-height: 190rpx;
  padding: 24rpx;
  border-radius: 26rpx;
  color: #fff;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.channel-card::after {
  position: absolute;
  right: -34rpx;
  bottom: -42rpx;
  width: 178rpx;
  height: 178rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  content: '';
}

.channel-icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 68rpx;
  width: 68rpx;
  height: 68rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.28);
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.12);
}

.channel-copy {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
}

.channel-card.travel {
  grid-column: span 2;
}

.channel-card.food { background: linear-gradient(135deg, #d84b2a, #a83522); }
.channel-card.stay { background: linear-gradient(135deg, #5f7d50, #38543b); }
.channel-card.travel { background: linear-gradient(135deg, #1f5fa8, #153b5f); }

.channel-name,
.channel-title,
.channel-desc {
  display: block;
}

.channel-name {
  font-size: 24rpx;
  font-weight: 800;
  opacity: 0.78;
}

.channel-title {
  margin-top: 8rpx;
  font-size: 28rpx;
  font-weight: 700;
}

.channel-desc {
  margin-top: 8rpx;
  color: rgba(255, 255, 255, 0.72);
  font-size: 22rpx;
  line-height: 1.45;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.article-card {
  display: flex;
  gap: 18rpx;
  padding: 14rpx;
  border-radius: 22rpx;
  background: #fff;
}

.article-thumb {
  width: 190rpx;
  height: 150rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.article-title {
  color: var(--color-ink);
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  color: var(--color-text-tertiary);
  font-size: 22rpx;
}
</style>
