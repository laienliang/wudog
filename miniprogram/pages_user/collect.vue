<template>
  <view class="collect-page">
    <view class="collect-card" v-for="item in collects" :key="item.id" @tap="openItem(item)">
      <image class="cover" :src="item.image" mode="aspectFill" />
      <view class="info">
        <text class="title">{{ item.title }}</text>
        <text class="type">{{ item.typeName }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const collects = ref([
  { id: 1, title: '乌东梯田景区', type: 'scenic', typeName: '景点', image: 'https://via.placeholder.com/180x140/E8F1FB/1F5FA8?text=梯田' },
  { id: 2, title: '苗族银饰手镯', type: 'goods', typeName: '好物', image: 'https://via.placeholder.com/180x140/F7F8FA/1F5FA8?text=银饰' },
]);

function openItem(item) {
  const paths = {
    scenic: `/pages_travel/scenic/detail?id=${item.id}`,
    goods: `/pages_clothing/detail?id=${item.id}`,
  };
  wx.navigateTo({ url: paths[item.type] });
}
</script>

<style lang="scss" scoped>
.collect-page {
  min-height: 100vh;
  padding: 16rpx;
  background: var(--color-bg-secondary);
}

.collect-card {
  display: flex;
  gap: 20rpx;
  margin-bottom: 16rpx;
  padding: 20rpx;
  border-radius: var(--radius-lg);
  background: #fff;
}

.cover {
  width: 180rpx;
  height: 140rpx;
  border-radius: var(--radius-md);
}

.info {
  flex: 1;
}

.title {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
}

.type {
  display: inline-block;
  margin-top: 18rpx;
  padding: 4rpx 14rpx;
  border-radius: var(--radius-sm);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 22rpx;
}
</style>
