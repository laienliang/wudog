<template>
  <view class="publish-page">
    <view class="editor card">
      <text class="title">发布游记</text>
      <input class="title-input" v-model="form.title" placeholder="给游记起个标题" />
      <textarea class="content-input" v-model="form.content" placeholder="分享你在乌东的见闻..." maxlength="1000" />
      <view class="image-uploader" @tap="chooseImage">
        <ui-icon name="camera" :size="18" color="var(--color-primary)" />
        <text>{{ form.images.length ? `已选择 ${form.images.length} 张图片` : '添加图片' }}</text>
      </view>
    </view>
    <view class="submit-btn" @tap="submit">
      <ui-icon name="publish" :size="18" color="#fff" />
      <text>发布</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import UiIcon from '../components/ui-icon.vue'
import { post } from '../utils/request'
import { appendCommunityPost, getCurrentUser } from '../utils/local'

const form = ref({ title: '', content: '', images: [] })

function chooseImage() {
  uni.chooseImage({
    count: 9,
    success(res) {
      form.value.images = res.tempFilePaths
    },
  })
}

function submit() {
  if (!form.value.title.trim() || !form.value.content.trim()) {
    uni.showToast({ title: '请填写标题和内容', icon: 'none' })
    return
  }
  post('/publish', {
    userId: getCurrentUser().id,
    title: form.value.title.trim(),
    content: form.value.content.trim(),
    images: form.value.images,
  })
    .then(res => {
      if (res?.article) {
        appendCommunityPost({
          id: res.article.id,
          title: res.article.title,
          description: res.article.content.slice(0, 120),
          images: res.article.images || [],
          nickName: getCurrentUser().nickName,
          likes: 0,
          comments: 0,
          typeName: '社区游记',
        })
      }
      uni.showToast({ title: '发布成功', icon: 'success' })
      setTimeout(() => uni.navigateBack({ delta: 1 }), 500)
    })
    .catch(() => {
      appendCommunityPost({
        title: form.value.title.trim(),
        description: form.value.content.trim().slice(0, 120),
        images: form.value.images,
        nickName: getCurrentUser().nickName,
        likes: 0,
        comments: 0,
        typeName: '社区游记',
      })
      uni.showToast({ title: '发布成功', icon: 'success' })
      setTimeout(() => uni.navigateBack({ delta: 1 }), 500)
    })
}
</script>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  padding: 24rpx;
  background: var(--color-bg-secondary);
}

.editor {
  padding: 28rpx;
}

.title {
  display: block;
  margin-bottom: 18rpx;
  font-size: 34rpx;
  font-weight: 800;
}

.title-input,
.content-input,
.image-uploader {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 20rpx;
  padding: 22rpx;
  border-radius: 22rpx;
  background: #fff;
  font-size: 28rpx;
}

.title-input,
.content-input {
  border: 1rpx solid var(--color-border-primary);
  background: var(--color-bg-secondary);
}

.content-input {
  min-height: 360rpx;
}

.image-uploader {
  display: flex;
  align-items: center;
  gap: 10rpx;
  color: var(--color-primary);
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  height: 88rpx;
  margin-top: 28rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
  font-size: 28rpx;
  font-weight: 700;
}
</style>
