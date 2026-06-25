<template>
  <view class="mine-page">
    <view class="profile-section" v-if="isLoggedIn">
      <image class="profile-avatar" :src="userInfo.avatarUrl || '/static/placeholder.png'" mode="aspectFill" />
      <view class="profile-info">
        <text class="profile-name">{{ userInfo.nickName || '乌东游客' }}</text>
        <text class="profile-bio">{{ userInfo.description || '点击编辑个人资料' }}</text>
      </view>
      <view class="profile-edit" @tap="goProfile">
        <ui-icon name="arrow-right" :size="18" color="rgba(255,255,255,0.9)" />
      </view>
    </view>

    <view class="profile-section" v-else @tap="goLogin">
      <image class="profile-avatar" src="/static/placeholder.png" mode="aspectFill" />
      <view class="profile-info">
        <text class="profile-name">登录 / 注册</text>
        <text class="profile-bio">收藏、预订、评论都会同步到这里</text>
      </view>
      <ui-icon name="login" :size="22" color="#ffffff" />
    </view>

    <view class="order-nav card">
      <view class="order-item" v-for="item in orderNav" :key="item.label" @tap="onOrderNavTap(item)">
        <ui-icon :name="item.icon" :size="26" color="var(--color-primary)" />
        <text class="order-label">{{ item.label }}</text>
        <view class="order-badge" v-if="item.badge > 0">
          <text class="badge-num">{{ item.badge }}</text>
        </view>
      </view>
    </view>

    <view class="menu-group card">
      <view class="menu-item" v-for="item in menus" :key="item.name" @tap="onMenuTap(item.path)">
        <view class="menu-left">
          <ui-icon :name="item.icon" :size="20" color="var(--color-primary)" />
          <text class="menu-text">{{ item.name }}</text>
        </view>
        <ui-icon name="arrow-right" :size="18" color="var(--color-text-tertiary)" />
      </view>
    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import UiIcon from '../../components/ui-icon.vue'
import { getCurrentUser, getOrders } from '../../utils/local'

const isLoggedIn = ref(false)
const userInfo = ref({})

const orderNav = ref([
  { label: '全部订单', icon: 'order', badge: 0, path: '/pages_user/orders' },
  { label: '待支付', icon: 'wallet', badge: 0, path: '/pages_user/orders?status=0' },
  { label: '待使用', icon: 'ticket', badge: 0, path: '/pages_user/orders?status=2' },
  { label: '已完成', icon: 'check', badge: 0, path: '/pages_user/orders?status=4' },
])

const menus = ref([
  { name: '我的收藏', path: '/pages_user/collect', icon: 'heart' },
  { name: '我的相册', path: '/pages_user/album', icon: 'album' },
  { name: '收货地址', path: '/pages_user/address', icon: 'address' },
  { name: '发布游记', path: '/pages_community/publish', icon: 'publish' },
  { name: '订单管理', path: '/pages_user/orders', icon: 'order' },
])

function onOrderNavTap(item) {
  if (item.path) {
    uni.navigateTo({ url: item.path })
  }
}

function onMenuTap(path) {
  if (path) {
    uni.navigateTo({ url: path })
  }
}

function goLogin() {
  uni.navigateTo({ url: '/pages_user/login' })
}

function goProfile() {
  uni.navigateTo({ url: '/pages_user/profile' })
}

function refreshUser() {
  const stored = uni.getStorageSync('userInfo') || getCurrentUser()
  userInfo.value = stored
  isLoggedIn.value = Boolean(uni.getStorageSync('token') || stored?.nickName)

  const orders = getOrders()
  orderNav.value = orderNav.value.map(item => {
    if (item.label === '待支付') {
      return { ...item, badge: orders.filter(order => Number(order.status) === 0).length }
    }
    if (item.label === '待使用') {
      return { ...item, badge: orders.filter(order => Number(order.status) === 2).length }
    }
    return item
  })
}

onShow(refreshUser)
</script>

<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(21, 59, 95, 0.16), transparent 280rpx),
    var(--color-bg-secondary);
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 22rpx;
  padding: 48rpx 32rpx;
  background: linear-gradient(135deg, #153b5f, #1f5fa8);
  color: #fff;
}

.profile-avatar {
  width: 116rpx;
  height: 116rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  display: block;
  font-size: 36rpx;
  font-weight: 800;
}

.profile-bio {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.5;
}

.order-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10rpx;
  margin: 18rpx 20rpx 0;
}

.order-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx 8rpx;
}

.order-label {
  font-size: 24rpx;
  color: var(--color-text-secondary);
}

.order-badge {
  position: absolute;
  top: 12rpx;
  right: 18%;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  border-radius: 999rpx;
  background: var(--color-cinnabar);
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-num {
  color: #fff;
  font-size: 20rpx;
}

.menu-group {
  margin: 20rpx 20rpx 0;
  padding: 8rpx 0;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 24rpx;
}

.menu-item + .menu-item {
  border-top: 1rpx solid var(--color-line);
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.menu-text {
  font-size: 28rpx;
  color: var(--color-text-primary);
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
