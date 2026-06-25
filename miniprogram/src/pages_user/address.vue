<template>
  <view class="address-page">
    <view class="page-head">
      <text class="kicker">收货地址</text>
      <text class="title">订单配送和入住信息都从这里来</text>
    </view>

    <view class="address-card card" v-for="item in addresses" :key="item.id">
      <text class="name">{{ item.name }} {{ item.phone }}</text>
      <text class="detail">{{ item.detail }}</text>
    </view>

    <view class="form-card card">
      <input class="input" v-model="form.name" placeholder="收货人" />
      <input class="input" v-model="form.phone" placeholder="手机号" type="number" />
      <input class="input" v-model="form.detail" placeholder="详细地址" />
      <view class="save-btn" @tap="addAddress">新增地址</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getAddresses, saveAddresses } from '../utils/local'

const addresses = ref(getAddresses())
const form = ref({ name: '', phone: '', detail: '' })

function addAddress() {
  if (!form.value.name || !form.value.phone || !form.value.detail) {
    uni.showToast({ title: '请填写完整地址', icon: 'none' })
    return
  }
  const next = [{ ...form.value, id: Date.now() }, ...addresses.value]
  addresses.value = next
  saveAddresses(next)
  form.value = { name: '', phone: '', detail: '' }
  uni.showToast({ title: '已新增', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.address-page {
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
}

.address-card,
.form-card {
  margin-bottom: 16rpx;
}

.name {
  display: block;
  font-size: 28rpx;
  font-weight: 800;
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
  border-radius: 18rpx;
  background: var(--color-bg-secondary);
  font-size: 26rpx;
}

.save-btn {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  border-radius: 999rpx;
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #fff;
  font-size: 28rpx;
  font-weight: 700;
}
</style>
