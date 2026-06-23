<template>
  <view class="profile-page">
    <view class="form-card">
      <view class="avatar-row" @tap="chooseAvatar">
        <image class="avatar" :src="form.avatarUrl || '/static/placeholder.png'" mode="aspectFill" />
        <text>更换头像</text>
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
    <view class="save-btn" @tap="save">保存资料</view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const form = ref(wx.getStorageSync('userInfo') || { nickName: '乌东游客', description: '热爱山野与苗寨风物' });

function chooseAvatar() {
  wx.chooseImage({
    count: 1,
    success(res) {
      form.value.avatarUrl = res.tempFilePaths[0];
    },
  });
}

function save() {
  wx.setStorageSync('userInfo', form.value);
  wx.setStorageSync('token', wx.getStorageSync('token') || 'local-token');
  wx.showToast({ title: '已保存', icon: 'success' });
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  padding: 24rpx;
  background: var(--color-bg-secondary);
}

.form-card {
  padding: 28rpx;
  border-radius: var(--radius-lg);
  background: #fff;
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid var(--color-border-secondary);
}

.avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
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
  margin-top: 32rpx;
  padding: 22rpx 0;
  text-align: center;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
}
</style>
