<template>
  <view class="album-page">
    <view class="page-head">
      <text class="kicker">我的相册</text>
      <text class="title">把风景和笑脸都收进相册里</text>
    </view>

    <view class="grid">
      <image class="photo" v-for="photo in photos" :key="photo" :src="photo" mode="aspectFill" @tap="preview(photo)" />
    </view>
    <view class="add-btn" @tap="choosePhoto">
      <ui-icon name="camera" :size="18" color="#fff" />
      <text>上传照片</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import UiIcon from '../components/ui-icon.vue'
import { getAlbumPhotos, saveAlbumPhotos } from '../utils/local'

const photos = ref(
  getAlbumPhotos().length
    ? getAlbumPhotos()
    : [
        '/static/placeholder.png',
        '/static/placeholder.png',
        '/static/placeholder.png',
      ]
)

function preview(photo) {
  uni.previewImage({ urls: photos.value, current: photo })
}

function choosePhoto() {
  uni.chooseImage({
    count: 9,
    success(res) {
      photos.value = [...res.tempFilePaths, ...photos.value]
      saveAlbumPhotos(photos.value)
    },
  })
}
</script>

<style lang="scss" scoped>
.album-page {
  min-height: 100vh;
  padding: 24rpx 20rpx;
  background: var(--color-bg-secondary);
}

.page-head {
  padding: 8rpx 6rpx 18rpx;
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
  font-size: 36rpx;
  font-weight: 800;
  line-height: 1.25;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.photo {
  width: 100%;
  height: 230rpx;
  border-radius: 18rpx;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 88rpx;
  margin: 32rpx 12rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
  font-size: 28rpx;
  font-weight: 700;
}
</style>
