<template>
  <view class="detail-page">
    <swiper class="detail-swiper" indicator-dots autoplay circular>
      <swiper-item v-for="(img, idx) in images" :key="idx">
        <image class="detail-img" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="info-section card">
      <text class="price">{{ product.price }}</text>
      <text class="product-title">{{ product.title }}</text>
      <text class="product-subtitle">{{ product.subtitle }}</text>
      <view class="product-tags">
        <text class="tag tag-primary" v-for="(tag, idx) in product.tags" :key="idx">{{ tag }}</text>
      </view>
    </view>

    <view class="miao-divider"></view>

    <view class="section card">
      <text class="section-title">工艺介绍</text>
      <text class="section-content">{{ product.craftIntro }}</text>
    </view>

    <view class="section card" v-if="product.inheritorName">
      <text class="section-title">传承人</text>
      <view class="inheritor-card">
        <image class="inheritor-avatar" src="/static/placeholder.png" mode="aspectFill" />
        <text class="inheritor-name">{{ product.inheritorName }}</text>
      </view>
    </view>

    <view class="section card">
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

    <view class="bottom-bar">
      <view class="bar-actions">
        <view class="bar-action" @tap="toggleCollect">
          <ui-icon :name="isCollected ? 'heart-fill' : 'heart'" :size="24" :color="isCollected ? '#d84b2a' : 'var(--color-text-secondary)'" />
          <text class="bar-label">{{ isCollected ? '已收藏' : '收藏' }}</text>
        </view>
        <view class="bar-action" @tap="goCart">
          <ui-icon name="cart" :size="24" color="var(--color-text-secondary)" />
          <text class="bar-label">购物车</text>
        </view>
      </view>
      <view class="bar-buttons">
        <view class="btn btn-cart" @tap="addToCart">
          <ui-icon name="cart" :size="18" color="#fff" />
          <text>加入购物车</text>
        </view>
        <view class="btn btn-buy" @tap="buyNow">
          <ui-icon name="wallet" :size="18" color="#fff" />
          <text>立即购买</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import UiIcon from '../components/ui-icon.vue'
import { get, post } from '../utils/request'
import { getCurrentUser, appendOrder, upsertCollectItem, removeCollectItem } from '../utils/local'

const fallbackImages = [
  '/static/placeholder.png',
  '/static/placeholder.png',
  '/static/placeholder.png',
]

const product = ref({
  id: 1,
  title: '苗族银饰手镯',
  subtitle: '手工锻造，传承百年工艺',
  price: '368',
  craftIntro: '采用传统苗族银饰锻造技艺，经高温冶炼、手工锻打、錾刻、编织等多道工序精心制作而成，每一件都是独一无二的艺术品。',
  inheritorName: '吴银花',
  tags: ['非遗', '手工', '银饰'],
})
const specs = ref([
  { id: 1, name: '小号（内径52mm）' },
  { id: 2, name: '中号（内径56mm）' },
  { id: 3, name: '大号（内径60mm）' },
])
const activeSpec = ref(2)
const isCollected = ref(false)
const images = ref([...fallbackImages])

function currentSpec() {
  return specs.value.find(item => item.id === activeSpec.value) || specs.value[0]
}

async function loadDetail(id) {
  const data = await get('/detail', { type: 'clothing', id })
  if (!data) return
  product.value = {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle || data.description || '',
    price: data.price,
    craftIntro: data.raw?.craftIntro || data.description || product.value.craftIntro,
    inheritorName: data.raw?.inheritorName || product.value.inheritorName,
    tags: ['非遗', data.typeName].filter(Boolean),
  }
  images.value = data.images?.length ? data.images : data.image ? [data.image] : fallbackImages
}

async function loadCollectStatus(id) {
  const userId = getCurrentUser().id
  const res = await get('/collect/status', { userId, goodsId: id })
  isCollected.value = Boolean(res?.collected)
}

async function toggleCollect() {
  const userId = getCurrentUser().id
  const res = await post('/collect/toggle', { userId, goodsId: product.value.id })
  if (res?.collected !== undefined) {
    isCollected.value = Boolean(res.collected)
    if (isCollected.value) {
      upsertCollectItem({
        id: product.value.id,
        title: product.value.title,
        type: 'goods',
        typeName: product.value.tags?.[0] || '好物',
        image: images.value[0],
      })
    } else {
      removeCollectItem(product.value.id)
    }
    uni.showToast({ title: isCollected.value ? '已收藏' : '已取消收藏', icon: 'none' })
  }
}

async function addToCart() {
  const userId = getCurrentUser().id
  const res = await post('/cart/add', {
    userId,
    goodsId: product.value.id,
    moduleType: 1,
    skuId: currentSpec().id,
    skuName: currentSpec().name,
    quantity: 1,
  })
  if (res?.item) {
    uni.showToast({ title: '已加入购物车', icon: 'success' })
    return
  }
  uni.showToast({ title: '加入购物车失败', icon: 'none' })
}

async function buyNow() {
  const userId = getCurrentUser().id
  const response = await post('/order/create', {
    userId,
    moduleType: 1,
    title: product.value.title,
    totalAmount: Number(product.value.price || 0),
    payAmount: Number(product.value.price || 0),
    status: 0,
    items: [
      {
        goodsId: product.value.id,
        goodsTitle: product.value.title,
        skuId: currentSpec().id,
        skuName: currentSpec().name,
        quantity: 1,
        price: Number(product.value.price || 0),
      },
    ],
    remark: `规格：${currentSpec().name}`,
  })
  if (response?.order) {
    appendOrder({
      id: response.order.id,
      orderNo: response.order.orderNo,
      title: product.value.title,
      moduleType: 1,
      moduleName: '非遗商品',
      status: 0,
      statusText: '待支付',
      amount: Number(product.value.price || 0),
      items: response.order.items || [],
    })
    uni.showToast({ title: '已生成订单', icon: 'success' })
    setTimeout(() => uni.navigateTo({ url: `/pages_user/orderDetail?id=${response.order.id}` }), 500)
    return
  }
  uni.showToast({ title: '下单失败', icon: 'none' })
}

function goCart() {
  uni.navigateTo({ url: '/pages_cart/index' })
}

onLoad(async options => {
  const id = Number(options?.id || 1)
  await loadDetail(id)
  await loadCollectStatus(id)
})
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding-bottom: 160rpx;
}

.detail-swiper {
  height: 720rpx;
}

.detail-img {
  width: 100%;
  height: 100%;
}

.info-section,
.section {
  margin: 16rpx 20rpx 0;
}

.price {
  color: var(--color-cinnabar);
  font-size: 56rpx;
  font-weight: 800;
}

.product-title {
  display: block;
  margin-top: 12rpx;
  font-size: 34rpx;
  font-weight: 800;
}

.product-subtitle {
  display: block;
  margin-top: 10rpx;
  color: var(--color-text-secondary);
  font-size: 26rpx;
  line-height: 1.6;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 16rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 800;
  margin-bottom: 14rpx;
}

.section-content {
  color: var(--color-text-secondary);
  font-size: 26rpx;
  line-height: 1.8;
}

.inheritor-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.inheritor-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.inheritor-name {
  font-size: 28rpx;
  font-weight: 700;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.spec-item {
  padding: 14rpx 26rpx;
  border: 1rpx solid var(--color-border-primary);
  border-radius: 18rpx;
  font-size: 24rpx;
}

.spec-item.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 16rpx 20rpx calc(16rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -8rpx 26rpx rgba(18, 36, 58, 0.08);
  backdrop-filter: blur(20px);
}

.bar-actions {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.bar-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  min-width: 72rpx;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 84rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: #fff;
}

.btn-cart {
  background: linear-gradient(135deg, #c79239, #d84b2a);
}

.btn-buy {
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
}
</style>
