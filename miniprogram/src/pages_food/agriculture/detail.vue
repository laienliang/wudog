<template>
  <view class="detail-page">
    <image class="cover" :src="goods.image" mode="aspectFill" />
    <view class="info-section card">
      <text class="price">{{ goods.price }}</text>
      <text class="title">{{ goods.title }}</text>
      <text class="desc">{{ goods.description }}</text>
      <view class="meta-row">
        <text class="meta">产地：{{ goods.origin }}</text>
        <text class="meta">规格：{{ goods.spec }}</text>
      </view>
    </view>
    <view class="section card">
      <text class="section-title">产地故事</text>
      <text class="section-content">{{ goods.story }}</text>
    </view>
    <view class="bottom-bar">
      <view class="btn ghost" @tap="addCart">
        <ui-icon name="cart" :size="18" color="var(--color-primary)" />
        <text>加入购物车</text>
      </view>
      <view class="btn primary" @tap="buyNow">
        <ui-icon name="wallet" :size="18" color="#fff" />
        <text>立即购买</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import UiIcon from '../../components/ui-icon.vue'
import { get, post } from '../../utils/request'
import { getCurrentUser, appendOrder } from '../../utils/local'

const goods = ref({
  id: 1,
  title: '梯田红米',
  price: 39,
  image: '/static/placeholder.png',
  description: '高山梯田自然生长，米香浓郁。',
  origin: '乌东梯田',
  spec: '2kg/袋',
  story: '红米来自乌东高山梯田，采用传统稻作方式种植，保留稻谷自然风味，适合作为伴手礼和日常主食。',
})

async function loadDetail(id) {
  const data = await get('/detail', { type: 'agriculture', id })
  if (!data) return
  goods.value = {
    id: data.id,
    title: data.title,
    price: data.price,
    image: data.image || goods.value.image,
    description: data.description || data.subtitle || goods.value.description,
    origin: data.raw?.origin || data.subtitle || goods.value.origin,
    spec: data.raw?.specification || data.raw?.spec || goods.value.spec,
    story: data.raw?.story || data.description || goods.value.story,
  }
}

async function addCart() {
  const res = await post('/cart/add', {
    userId: getCurrentUser().id,
    goodsId: goods.value.id,
    moduleType: 2,
    quantity: 1,
    skuName: goods.value.spec,
  })
  if (res?.item) {
    uni.showToast({ title: '已加入购物车', icon: 'success' })
    return
  }
  uni.showToast({ title: '加入购物车失败', icon: 'none' })
}

async function buyNow() {
  const response = await post('/order/create', {
    userId: getCurrentUser().id,
    moduleType: 2,
    title: goods.value.title,
    totalAmount: Number(goods.value.price || 0),
    payAmount: Number(goods.value.price || 0),
    status: 0,
    items: [
      {
        goodsId: goods.value.id,
        goodsTitle: goods.value.title,
        quantity: 1,
        price: Number(goods.value.price || 0),
      },
    ],
    remark: `农特好物：${goods.value.spec}`,
  })
  if (response?.order) {
    appendOrder({
      id: response.order.id,
      orderNo: response.order.orderNo,
      title: goods.value.title,
      moduleType: 2,
      moduleName: '农特好物',
      status: 0,
      statusText: '待支付',
      amount: Number(goods.value.price || 0),
      items: response.order.items || [],
    })
    uni.showToast({ title: '订单已创建', icon: 'success' })
    setTimeout(() => uni.navigateTo({ url: `/pages_user/orderDetail?id=${response.order.id}` }), 500)
    return
  }
  uni.showToast({ title: '下单失败', icon: 'none' })
}

onLoad(async options => {
  await loadDetail(Number(options?.id || 1))
})
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  padding-bottom: 140rpx;
  background: var(--color-bg-secondary);
}

.cover {
  width: 100%;
  height: 520rpx;
}

.info-section,
.section {
  margin: 16rpx 20rpx 0;
}

.price {
  color: var(--color-cinnabar);
  font-size: 44rpx;
  font-weight: 800;
}

.title {
  display: block;
  margin-top: 12rpx;
  font-size: 34rpx;
  font-weight: 800;
}

.desc,
.section-content,
.meta {
  display: block;
  margin-top: 12rpx;
  color: var(--color-text-secondary);
  font-size: 26rpx;
  line-height: 1.7;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
}

.section-title {
  display: block;
  margin-bottom: 14rpx;
  font-size: 30rpx;
  font-weight: 800;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 12rpx;
  padding: 16rpx 20rpx calc(16rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -8rpx 26rpx rgba(18, 36, 58, 0.08);
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
}

.btn.ghost {
  border: 1rpx solid rgba(31, 95, 168, 0.16);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.btn.primary {
  color: #fff;
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
}
</style>
