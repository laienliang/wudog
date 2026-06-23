<template>
  <view class="address-page">
    <view class="address-card" v-for="item in addresses" :key="item.id">
      <text class="name">{{ item.name }} {{ item.phone }}</text>
      <text class="detail">{{ item.detail }}</text>
    </view>
    <view class="form-card">
      <input class="input" v-model="form.name" placeholder="收货人" />
      <input class="input" v-model="form.phone" placeholder="手机号" type="number" />
      <input class="input" v-model="form.detail" placeholder="详细地址" />
      <view class="save-btn" @tap="addAddress">新增地址</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const addresses = ref([
  { id: 1, name: '乌东游客', phone: '138****8888', detail: '贵州省黔东南州乌东村游客中心' },
]);
const form = ref({ name: '', phone: '', detail: '' });

function addAddress() {
  if (!form.value.name || !form.value.phone || !form.value.detail) {
    wx.showToast({ title: '请填写完整地址', icon: 'none' });
    return;
  }
  addresses.value.push({ ...form.value, id: Date.now() });
  form.value = { name: '', phone: '', detail: '' };
  wx.showToast({ title: '已新增', icon: 'success' });
}
</script>

<style lang="scss" scoped>
.address-page {
  min-height: 100vh;
  padding: 16rpx;
  background: var(--color-bg-secondary);
}

.address-card,
.form-card {
  margin-bottom: 16rpx;
  padding: 24rpx;
  border-radius: var(--radius-lg);
  background: #fff;
}

.name {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
}

.detail {
  display: block;
  margin-top: 12rpx;
  color: var(--color-text-secondary);
  font-size: 24rpx;
}

.input {
  margin-bottom: 18rpx;
  padding: 18rpx;
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  font-size: 26rpx;
}

.save-btn {
  padding: 20rpx 0;
  text-align: center;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
}
</style>
