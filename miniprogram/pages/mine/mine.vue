<!-- 我的页 -->
<template>
  <view class="mine-page">
    <view class="miao-divider"></view>

    <!-- 用户信息 -->
    <view class="profile-section" v-if="isLoggedIn">
      <image class="profile-avatar" :src="userInfo.avatarUrl || '/static/placeholder.png'" mode="aspectFill" />
      <view class="profile-info">
        <text class="profile-name">{{ userInfo.nickName || '乌东游客' }}</text>
        <text class="profile-bio">{{ userInfo.description || '点击编辑个人资料' }}</text>
      </view>
      <view class="profile-edit" @tap="goProfile">
        <text>编辑 ›</text>
      </view>
    </view>

    <view class="profile-section" v-else @tap="goLogin">
      <image class="profile-avatar" src="/static/placeholder.png" mode="aspectFill" />
      <text class="profile-login">登录/注册</text>
    </view>

    <!-- 订单快捷入口 -->
    <view class="order-nav">
      <view class="order-item" v-for="(item, idx) in orderNav" :key="idx" @tap="onOrderNavTap(item)">
        <text class="order-icon">{{ item.icon }}</text>
        <text class="order-label">{{ item.label }}</text>
        <view class="order-badge" v-if="item.badge > 0">
          <text class="badge-num">{{ item.badge }}</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-group">
      <view class="menu-item" v-for="(item, idx) in menus" :key="idx" @tap="onMenuTap(item.path)">
        <text class="menu-text">{{ item.name }}</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const isLoggedIn = ref(false);
const userInfo = ref({});

const orderNav = ref([
  { label: '全部订单', icon: '📋', badge: 0, path: '/pages_user/orders' },
  { label: '待付款', icon: '💰', badge: 0, path: '/pages_user/orders?status=0' },
  { label: '待使用', icon: '🎫', badge: 0, path: '/pages_user/orders?status=1' },
  { label: '已评价', icon: '⭐', badge: 0, path: '/pages_user/orders?status=4' },
]);

const menus = ref([
  { name: '我的收藏', path: '/pages_user/collect' },
  { name: '我的相册', path: '/pages_user/album' },
  { name: '收货地址', path: '/pages_user/address' },
  { name: '消息通知', path: '' },
  { name: '商家入驻', path: '' },
]);

function onOrderNavTap(item) {
  if (item.path) wx.navigateTo({ url: item.path });
}

function onMenuTap(path) {
  if (path) wx.navigateTo({ url: path });
}

function goLogin() {
  wx.navigateTo({ url: '/pages_user/login' });
}

function goProfile() {
  wx.navigateTo({ url: '/pages_user/profile' });
}
</script>

<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.profile-section {
  display: flex;
  align-items: center;
  padding: 48rpx 32rpx;
  background: var(--color-primary);
}

.profile-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  display: block;
}

.profile-bio {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}

.profile-edit {
  color: rgba(255, 255, 255, 0.9);
  font-size: 26rpx;
}

.profile-login {
  font-size: 32rpx;
  color: #fff;
}

.order-nav {
  display: flex;
  background: #fff;
  padding: 32rpx 0;
}

.order-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.order-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.order-label {
  font-size: 24rpx;
  color: var(--color-text-secondary);
}

.order-badge {
  position: absolute;
  top: 0;
  right: 20%;
  background: var(--color-error);
  border-radius: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-num {
  color: #fff;
  font-size: 20rpx;
}

.menu-group {
  margin-top: 24rpx;
  background: #fff;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 32rpx;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-text {
  font-size: 28rpx;
  color: var(--color-text-primary);
}

.menu-arrow {
  font-size: 32rpx;
  color: var(--color-text-tertiary);
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
