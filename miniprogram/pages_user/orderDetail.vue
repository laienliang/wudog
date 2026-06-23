<template>
  <view class="order-detail-page">
    <view class="status-card">
      <text class="status">待使用</text>
      <text class="tip">请在预约日期前往商家核销</text>
    </view>
    <view class="info-card">
      <text class="title">乌东苗寨深度一日游</text>
      <text class="row">预约日期：2026-06-28</text>
      <text class="row">联系人：乌东游客 138****8888</text>
      <text class="row">订单金额：￥298</text>
    </view>
    <view class="code-card">
      <text class="code">WD202606230001</text>
      <text class="tip">核销码</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  padding: 20rpx;
  background: var(--color-bg-secondary);
}

.status-card,
.info-card,
.code-card {
  margin-bottom: 16rpx;
  padding: 28rpx;
  border-radius: var(--radius-lg);
  background: #fff;
}

.status {
  display: block;
  color: var(--color-primary);
  font-size: 36rpx;
  font-weight: 600;
}

.tip,
.row {
  display: block;
  margin-top: 12rpx;
  color: var(--color-text-secondary);
  font-size: 26rpx;
}

.title {
  display: block;
  margin-bottom: 16rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.code-card {
  text-align: center;
}

.code {
  display: block;
  color: var(--color-primary);
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}
</style>
