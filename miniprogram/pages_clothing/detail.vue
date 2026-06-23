<!-- 衣-商品详情页 -->
<template>
  <view class="detail-page">
    <!-- 图片轮播 -->
    <swiper class="detail-swiper" indicator-dots autoplay circular>
      <swiper-item v-for="(img, idx) in images" :key="idx">
        <image class="detail-img" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 基本信息 -->
    <view class="info-section">
      <text class="price">{{ product.price }}</text>
      <text class="product-title">{{ product.title }}</text>
      <text class="product-subtitle">{{ product.subtitle }}</text>
      <view class="product-tags">
        <text class="tag tag-primary" v-for="(tag, idx) in product.tags" :key="idx">{{ tag }}</text>
      </view>
    </view>

    <!-- 苗族蜡染分割线 -->
    <view class="miao-divider"></view>

    <!-- 工艺介绍 -->
    <view class="section">
      <text class="section-title">工艺介绍</text>
      <text class="section-content">{{ product.craftIntro }}</text>
    </view>

    <!-- 传承人 -->
    <view class="section" v-if="product.inheritorName">
      <text class="section-title">传承人</text>
      <view class="inheritor-card">
        <image class="inheritor-avatar" src="/static/placeholder.png" mode="aspectFill" />
        <text class="inheritor-name">{{ product.inheritorName }}</text>
      </view>
    </view>

    <!-- 规格选择 -->
    <view class="section">
      <text class="section-title">规格</text>
      <view class="spec-options">
        <view
          class="spec-item"
          :class="{ active: activeSpec === s.id }"
          v-for="s in specs"
          :key="s.id"
          @tap="activeSpec = s.id"
        >
          {{ s.name }}
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-actions">
        <view class="bar-action" @tap="toggleCollect">
          <text class="bar-icon">{{ isCollected ? '❤️' : '🤍' }}</text>
          <text class="bar-label">收藏</text>
        </view>
        <view class="bar-action" @tap="goCart">
          <text class="bar-icon">🛒</text>
          <text class="bar-label">购物车</text>
        </view>
      </view>
      <view class="bar-buttons">
        <view class="btn btn-cart" @tap="addToCart">加入购物车</view>
        <view class="btn btn-buy" @tap="buyNow">立即购买</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get } from '../utils/request';

const product = ref({
  id: 1,
  title: '苗族银饰手镯',
  subtitle: '手工锻造，传承百年工艺',
  price: '368',
  mainImage: 'https://via.placeholder.com/750x750/F7F8FA/1F5FA8?text=银饰手镯',
  images: [
    'https://via.placeholder.com/750x750/F7F8FA/1F5FA8?text=银饰手镯',
    'https://via.placeholder.com/750x750/E8F1FB/1F5FA8?text=细节图1',
    'https://via.placeholder.com/750x750/E8F1FB/1F5FA8?text=细节图2',
  ],
  tags: ['非遗', '手工', '银饰'],
  craftIntro: '采用传统苗族银饰锻造技艺，经高温冶炼、手工锻打、錾刻、编织等多道工序精心制作而成，每一件都是独一无二的艺术品。',
  inheritorName: '吴银花',
});

const specs = ref([
  { id: 1, name: '小号（内径52mm）' },
  { id: 2, name: '中号（内径56mm）' },
  { id: 3, name: '大号（内径60mm）' },
]);

const activeSpec = ref(1);
const isCollected = ref(false);
const images = ref(product.value.images);

onMounted(async () => {
  const pages = getCurrentPages();
  const current = pages[pages.length - 1];
  const id = current?.options?.id || 1;
  try {
    const data = await get('/detail', { type: 'clothing', id });
    product.value = {
      ...product.value,
      id: data.id,
      title: data.title,
      subtitle: data.subtitle || data.description,
      price: data.price,
      mainImage: data.image,
      images: data.images?.length ? data.images : [data.image],
      tags: ['非遗', data.typeName].filter(Boolean),
      craftIntro: data.raw?.craftIntro || data.description || product.value.craftIntro,
      inheritorName: data.raw?.inheritorName || product.value.inheritorName,
    };
    images.value = product.value.images;
  } catch (e) {
    images.value = product.value.images;
  }
});

function toggleCollect() {
  isCollected.value = !isCollected.value;
}

function goCart() {
  wx.switchTab({ url: '/pages/category/category' });
}

function addToCart() {
  wx.showToast({ title: '已加入购物车', icon: 'success' });
}

function buyNow() {
  wx.showToast({ title: '正在跳转订单页...', icon: 'none' });
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 120rpx;
}

.detail-swiper {
  height: 750rpx;
}

.detail-img {
  width: 100%;
  height: 100%;
}

.info-section {
  padding: 24rpx 32rpx;
}

.price {
  font-size: 56rpx;
  font-weight: 700;
  color: var(--color-secondary-orange);
  font-family: 'DIN Alternate', sans-serif;
}

.product-title {
  font-size: 34rpx;
  font-weight: 500;
  margin-top: 12rpx;
  display: block;
}

.product-subtitle {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  margin-top: 8rpx;
  display: block;
}

.product-tags {
  margin-top: 16rpx;
  display: flex;
  gap: 12rpx;
}

.section {
  padding: 24rpx 32rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 500;
  margin-bottom: 16rpx;
  display: block;
}

.section-content {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.inheritor-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.inheritor-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.inheritor-name {
  font-size: 28rpx;
  font-weight: 500;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.spec-item {
  padding: 16rpx 32rpx;
  border: 1rpx solid var(--color-border-primary);
  border-radius: var(--radius-md);
  font-size: 26rpx;
}

.spec-item.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: #fff;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.06);
  padding: 12rpx 24rpx;
  padding-bottom: calc(12rpx + env(safe-area-inset-bottom));
  z-index: 100;
}

.bar-actions {
  display: flex;
  margin-right: 24rpx;
}

.bar-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16rpx;
}

.bar-icon {
  font-size: 40rpx;
}

.bar-label {
  font-size: 20rpx;
  color: var(--color-text-secondary);
}

.bar-buttons {
  flex: 1;
  display: flex;
  gap: 12rpx;
}

.btn {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: var(--radius-md);
  font-size: 26rpx;
  color: #fff;
}

.btn-cart {
  background: var(--color-secondary-orange);
}

.btn-buy {
  background: var(--color-primary);
}
</style>
