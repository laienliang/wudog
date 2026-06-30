const { cartStorage, orderApi } = require('../../utils/api');

Page({
  data: {
    cart: [],
    total: '0.00',
  },

  onShow() {
    this.loadCart();
  },

  loadCart() {
    const cart = cartStorage.get();
    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2);
    this.setData({ cart, total });
  },

  onMinus(e) {
    const skuId = parseInt(e.currentTarget.dataset.skuid);
    const cart = cartStorage.get();
    const item = cart.find(i => i.skuId === skuId);
    if (item && item.quantity > 1) {
      cartStorage.updateQuantity(skuId, item.quantity - 1);
      this.loadCart();
    }
  },

  onPlus(e) {
    const skuId = parseInt(e.currentTarget.dataset.skuid);
    const cart = cartStorage.get();
    const item = cart.find(i => i.skuId === skuId);
    if (item) {
      cartStorage.updateQuantity(skuId, item.quantity + 1);
      this.loadCart();
    }
  },

  onDelete(e) {
    const skuId = parseInt(e.currentTarget.dataset.skuid);
    wx.showModal({
      title: '确认移除',
      content: '确定将该商品移出购物车？',
      success: (res) => {
        if (res.confirm) {
          cartStorage.remove(skuId);
          this.loadCart();
        }
      },
    });
  },

  onGoShopping() {
    wx.switchTab({ url: '/pages/clothing/list' });
  },

  onCheckout() {
    const cart = cartStorage.get();
    if (cart.length === 0) {
      wx.showToast({ title: '购物车为空', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交中...' });
    const items = cart.map(item => ({
      productType: 'clothing',
      productId: item.productId,
      productName: item.name,
      productImage: item.image || '',
      skuId: item.skuId,
      unitPrice: item.price,
      quantity: item.quantity,
    }));

    orderApi.create({ orderType: 'clothing', merchantId: 1, items })
      .then(() => {
        cartStorage.clear();
        this.loadCart();
        wx.hideLoading();
        wx.showToast({ title: '下单成功', icon: 'success' });
      })
      .catch(() => {
        wx.hideLoading();
        wx.showToast({ title: '下单失败', icon: 'none' });
      });
  },
});
