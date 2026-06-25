<template>
  <view class="profile-page">
    <view class="hero">
      <text class="kicker">个人资料</text>
      <text class="title">把你在乌东的旅行习惯留在这里</text>
    </view>

    <view class="form-card">
      <view class="avatar-row" @tap="chooseAvatar">
        <image class="avatar" :src="form.avatarUrl || '/static/placeholder.png'" mode="aspectFill" />
        <view class="avatar-copy">
          <text class="row-title">更换头像</text>
          <text class="row-desc">建议使用清晰头像，方便订单和评论识别</text>
        </view>
        <ui-icon name="camera" :size="20" color="var(--color-primary)" />
      </view>

      <view class="form-item">
        <text class="label">昵称</text>
        <input class="input" v-model="form.nickName" placeholder="请输入昵称" />
      </view>
      <view class="form-item">
        <text class="label">简介</text>
        <input class="input" v-model="form.description" placeholder="介绍一下自己" />
      </view>
    </view>

    <view class="save-btn" @tap="save">
      <ui-icon name="check" :size="18" color="#ffffff" />
      <text>保存资料</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import UiIcon from '../components/ui-icon.vue'
import { getCurrentUser, setCurrentUser } from '../utils/local'

const form = ref({ ...getCurrentUser() })

function chooseAvatar() {
  uni.chooseImage({
    count: 1,
    success(res) {
      form.value.avatarUrl = res.tempFilePaths[0]
    },
  })
}

function save() {
  const next = setCurrentUser(form.value)
  uni.setStorageSync('userInfo', next)
  uni.setStorageSync('token', uni.getStorageSync('token') || 'local-token')
  uni.showToast({ title: '已保存', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  padding: 24rpx;
  background:
    linear-gradient(180deg, rgba(31, 95, 168, 0.08), transparent 220rpx),
    var(--color-bg-secondary);
}

.hero {
  margin-bottom: 20rpx;
  padding: 24rpx 10rpx 8rpx;
}

.kicker {
  display: block;
  color: var(--color-cinnabar);
  font-size: 22rpx;
  font-weight: 700;
}

.title {
  display: block;
  margin-top: 8rpx;
  font-size: 38rpx;
  font-weight: 800;
  line-height: 1.22;
}

.form-card {
  padding: 28rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: var(--shadow-card);
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.avatar-copy {
  flex: 1;
  min-width: 0;
}

.row-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
}

.row-desc {
  display: block;
  margin-top: 8rpx;
  color: var(--color-text-secondary);
  font-size: 24rpx;
  line-height: 1.5;
}

.form-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.label {
  display: block;
  margin-bottom: 12rpx;
  color: var(--color-text-secondary);
  font-size: 24rpx;
}

.input {
  font-size: 28rpx;
}

.save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  height: 88rpx;
  margin-top: 30rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
  font-size: 28rpx;
  font-weight: 700;
}
</style>
