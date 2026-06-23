<template>
  <view class="album-page">
    <view class="grid">
      <image class="photo" v-for="photo in photos" :key="photo" :src="photo" mode="aspectFill" @tap="preview(photo)" />
    </view>
    <view class="add-btn" @tap="choosePhoto">上传照片</view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const photos = ref([
  'https://via.placeholder.com/240x240/E8F1FB/1F5FA8?text=梯田',
  'https://via.placeholder.com/240x240/FFF1EA/E85D2F?text=长桌宴',
  'https://via.placeholder.com/240x240/F7F8FA/D4A14B?text=苗寨',
]);

function preview(photo) {
  wx.previewImage({ urls: photos.value, current: photo });
}

function choosePhoto() {
  wx.chooseImage({
    count: 9,
    success(res) {
      photos.value = [...res.tempFilePaths, ...photos.value];
    },
  });
}
</script>

<style lang="scss" scoped>
.album-page {
  min-height: 100vh;
  padding: 16rpx;
  background: var(--color-bg-secondary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.photo {
  width: 100%;
  height: 230rpx;
  border-radius: var(--radius-md);
}

.add-btn {
  margin: 32rpx 12rpx;
  padding: 22rpx 0;
  text-align: center;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
}
</style>
