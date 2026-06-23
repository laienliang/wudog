<template>
  <div class="cart-page">
    <div class="container page-inner">
      <div class="page-header">
        <h1>购物车</h1>
      </div>

      <div class="miao-divider"></div>

      <!-- 购物车列表 -->
      <div class="cart-list" v-if="cartItems.length">
        <div class="cart-item" v-for="(item, idx) in cartItems" :key="idx">
          <input type="checkbox" :checked="item.checked" @change="item.checked = ($event.target as HTMLInputElement).checked" class="cart-checkbox" />
          <img :src="item.image" :alt="item.title" class="cart-img" />
          <div class="cart-info">
            <h3 class="cart-title">{{ item.title }}</h3>
            <p class="cart-spec">{{ item.spec }}</p>
            <p class="cart-desc">{{ item.description }}</p>
          </div>
          <div class="cart-quantity">
            <button class="qty-btn" @click="item.quantity = Math.max(1, item.quantity - 1)">-</button>
            <span class="qty-value">{{ item.quantity }}</span>
            <button class="qty-btn" @click="item.quantity++">+</button>
          </div>
          <span class="cart-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          <button class="cart-remove" @click="removeItem(idx)">×</button>
        </div>
      </div>

      <!-- 空购物车 -->
      <div class="empty-state" v-else>
        <div class="empty-icon">🛒</div>
        <p class="empty-text">购物车还是空的</p>
        <NuxtLink to="/clothing/list" class="btn btn-primary">去逛逛</NuxtLink>
      </div>

      <!-- 结算栏 -->
      <div class="checkout-bar" v-if="cartItems.length">
        <div class="checkout-info">
          <label class="check-all">
            <input type="checkbox" :checked="allChecked" @change="toggleAll" />
            <span>全选</span>
          </label>
          <span class="total-text">共计 {{ selectedCount }} 件</span>
        </div>
        <div class="checkout-total">
          <span class="total-label">合计：</span>
          <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
          <button class="checkout-btn" @click="handleCheckout">去结算</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface CartItem {
  id: number;
  title: string;
  spec: string;
  description: string;
  price: number;
  quantity: number;
  checked: boolean;
  image: string;
}

const cartItems = ref<CartItem[]>([
  { id: 1, title: '苗族银饰手镯', spec: '中号（内径56mm）', description: '手工锻造，传承百年工艺', price: 368, quantity: 1, checked: true, image: 'https://via.placeholder.com/120x120/F7F8FA/1F5FA8?text=手镯' },
  { id: 2, title: '蜡染布艺挂画', spec: '60×80cm', description: '天然植物染料，纯手工制作', price: 198, quantity: 2, checked: true, image: 'https://via.placeholder.com/120x120/F7F8FA/1F5FA8?text=蜡染' },
  { id: 3, title: '苗绣香包', spec: '红色', description: '精美刺绣，天然香料', price: 68, quantity: 1, checked: false, image: 'https://via.placeholder.com/120x120/F7F8FA/1F5FA8?text=香包' },
]);

const allChecked = computed(() => cartItems.value.length > 0 && cartItems.value.every((i) => i.checked));
const selectedCount = computed(() => cartItems.value.filter((i) => i.checked).reduce((s, i) => s + i.quantity, 0));
const totalPrice = computed(() => cartItems.value.filter((i) => i.checked).reduce((s, i) => s + i.price * i.quantity, 0));

function toggleAll() {
  const checked = !allChecked.value;
  cartItems.value.forEach((i) => (i.checked = checked));
}

function removeItem(idx: number) {
  cartItems.value.splice(idx, 1);
}

function handleCheckout() {
  if (selectedCount.value === 0) {
    alert('请选择商品');
    return;
  }
  alert(`结算 ${selectedCount.value} 件商品，合计 ¥${totalPrice.value.toFixed(2)}`);
}

useHead({
  title: '购物车 - 乌东文旅',
  meta: [{ name: 'description', content: '查看和管理您的购物车商品' }],
});
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding: 32px 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
}

.cart-list {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-border-secondary);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-checkbox {
  width: 18px;
  height: 18px;
  margin-right: 16px;
  flex-shrink: 0;
}

.cart-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-right: 16px;
  flex-shrink: 0;
}

.cart-info {
  flex: 1;
  min-width: 0;
}

.cart-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
}

.cart-spec {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-bottom: 4px;
}

.cart-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.cart-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 24px;
  flex-shrink: 0;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border-primary);
  background: #fff;
  border-radius: var(--radius-sm);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-value {
  min-width: 32px;
  text-align: center;
  font-size: 15px;
}

.cart-price {
  font-weight: 700;
  color: var(--color-secondary-orange);
  font-size: 16px;
  margin-right: 16px;
  flex-shrink: 0;
}

.cart-remove {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 20px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  flex-shrink: 0;
}

.cart-remove:hover {
  color: var(--color-error);
}

.checkout-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.checkout-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.check-all {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
}

.total-text {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.checkout-total {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.total-label {
  font-size: 14px;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-secondary-orange);
  font-family: 'DIN Alternate', sans-serif;
}

.checkout-btn {
  padding: 12px 36px;
  border: none;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: 15px;
  cursor: pointer;
  margin-left: 24px;
}

.checkout-btn:hover {
  background: var(--color-primary-dark);
}
</style>
