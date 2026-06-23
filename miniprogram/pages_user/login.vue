<template>
  <view class="login-page">
    <view class="hero">
      <image class="logo" src="/static/placeholder.png" mode="aspectFill" />
      <text class="title">登录乌东文旅</text>
      <text class="subtitle">收藏好物、预订行程、发布游记</text>
    </view>

    <view class="form-card">
      <input class="input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" />
      <view class="login-btn" @tap="login">一键登录</view>
      <view class="guest-btn" @tap="guestLogin">游客体验</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const phone = ref('');

function writeLogin(user) {
  wx.setStorageSync('token', `local-${Date.now()}`);
  wx.setStorageSync('userInfo', user);
  wx.showToast({ title: '登录成功', icon: 'success' });
  setTimeout(() => wx.navigateBack(), 600);
}

function login() {
  if (!/^1\d{10}$/.test(phone.value)) {
    wx.showToast({ title: '请输入正确手机号', icon: 'none' });
    return;
  }
  writeLogin({ nickName: `用户${phone.value.slice(-4)}`, avatarUrl: '', description: '点击编辑个人资料' });
}

function guestLogin() {
  writeLogin({ nickName: '乌东游客', avatarUrl: '', description: '先逛逛乌东文旅' });
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  padding: 56rpx 32rpx;
  background: var(--color-bg-secondary);
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48rpx;
}

.logo {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  margin-bottom: 24rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 600;
}

.subtitle {
  margin-top: 12rpx;
  color: var(--color-text-secondary);
  font-size: 26rpx;
}

.form-card {
  padding: 32rpx;
  border-radius: var(--radius-lg);
  background: #fff;
}

.input {
  height: 86rpx;
  padding: 0 24rpx;
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  font-size: 28rpx;
}

.login-btn,
.guest-btn {
  margin-top: 24rpx;
  padding: 22rpx 0;
  text-align: center;
  border-radius: var(--radius-full);
  font-size: 28rpx;
}

.login-btn {
  background: var(--color-primary);
  color: #fff;
}

.guest-btn {
  background: var(--color-primary-light);
  color: var(--color-primary);
}
</style>
