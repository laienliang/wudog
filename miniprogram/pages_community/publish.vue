<template>
  <view class="publish-page">
    <input class="title-input" v-model="form.title" placeholder="给游记起个标题" />
    <textarea class="content-input" v-model="form.content" placeholder="分享你在乌东的见闻..." maxlength="1000" />
    <view class="image-uploader" @tap="chooseImage">
      <text>{{ form.images.length ? `已选择 ${form.images.length} 张图片` : '添加图片' }}</text>
    </view>
    <view class="submit-btn" @tap="submit">发布</view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({ title: '', content: '', images: [] });

function chooseImage() {
  wx.chooseImage({
    count: 9,
    success(res) {
      form.value.images = res.tempFilePaths;
    },
  });
}

function submit() {
  if (!form.value.title.trim() || !form.value.content.trim()) {
    wx.showToast({ title: '请填写标题和内容', icon: 'none' });
    return;
  }
  wx.showToast({ title: '发布成功', icon: 'success' });
  setTimeout(() => wx.navigateBack(), 600);
}
</script>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  padding: 24rpx;
  background: var(--color-bg-secondary);
}

.title-input,
.content-input,
.image-uploader {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 20rpx;
  padding: 22rpx;
  border-radius: var(--radius-lg);
  background: #fff;
  font-size: 28rpx;
}

.content-input {
  min-height: 360rpx;
}

.image-uploader {
  color: var(--color-primary);
}

.submit-btn {
  margin-top: 32rpx;
  padding: 22rpx 0;
  text-align: center;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
}
</style>
