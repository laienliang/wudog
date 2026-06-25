<template>
  <view class="login-page">
    <view class="brand-band">
      <view class="brand-mark">
        <ui-icon name="login" :size="42" color="#ffffff" />
      </view>
      <text class="title">登录乌东文旅</text>
      <text class="subtitle">收藏好物、预订行程、发布游记，都可以从这里继续。</text>
    </view>

    <view class="form-card">
      <view class="input-row">
        <ui-icon name="phone" :size="20" color="var(--color-text-tertiary)" />
        <input class="input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" />
      </view>
      <view class="login-btn" @tap="login">
        <ui-icon name="check" :size="18" color="#ffffff" />
        <text>一键登录</text>
      </view>
      <view class="guest-btn" @tap="guestLogin">
        <ui-icon name="user" :size="18" color="var(--color-primary)" />
        <text>游客体验</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import UiIcon from '../components/ui-icon.vue'
import { setCurrentUser } from '../utils/local'

const phone = ref('')

function finishLogin(user) {
  const nextUser = setCurrentUser(user)
  uni.setStorageSync('token', `local-${Date.now()}`)
  uni.setStorageSync('userInfo', nextUser)
  uni.showToast({ title: '登录成功', icon: 'success' })
  setTimeout(() => uni.navigateBack({ delta: 1 }), 500)
}

function login() {
  if (!/^1\d{10}$/.test(phone.value)) {
    uni.showToast({ title: '请输入正确手机号', icon: 'none' })
    return
  }
  finishLogin({
    id: 10001,
    nickName: `用户${phone.value.slice(-4)}`,
    avatarUrl: '',
    description: '点击编辑个人资料',
  })
}

function guestLogin() {
  finishLogin({
    id: 10001,
    nickName: '乌东游客',
    avatarUrl: '',
    description: '先逛逛乌东文旅',
  })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  padding: 52rpx 28rpx 32rpx;
  background:
    linear-gradient(180deg, rgba(21, 59, 95, 0.12), transparent 280rpx),
    var(--color-bg-secondary);
}

.brand-band {
  padding: 28rpx 20rpx 36rpx;
  border-radius: 30rpx;
  background: linear-gradient(140deg, #153b5f, #1f5fa8);
  color: #fff;
  box-shadow: var(--shadow-card);
}

.brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  margin-bottom: 20rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.14);
}

.title {
  display: block;
  font-size: 42rpx;
  font-weight: 800;
}

.subtitle {
  display: block;
  margin-top: 14rpx;
  color: rgba(255, 255, 255, 0.82);
  font-size: 26rpx;
  line-height: 1.6;
}

.form-card {
  margin-top: 24rpx;
  padding: 30rpx 26rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: var(--shadow-card);
}

.input-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
  height: 88rpx;
  padding: 0 18rpx;
  border-radius: 22rpx;
  background: var(--color-bg-secondary);
}

.input {
  flex: 1;
  height: 88rpx;
  font-size: 28rpx;
}

.login-btn,
.guest-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  height: 88rpx;
  margin-top: 20rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  font-weight: 700;
}

.login-btn {
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
}

.guest-btn {
  border: 1rpx solid rgba(31, 95, 168, 0.16);
  background: var(--color-primary-light);
  color: var(--color-primary);
}
</style>
