const { getCartList, updateCartItem, deleteCartItem } = require('../../utils/api');
const app = getApp();

Page({
  data: {
    cartItems: [],
    loading: false,
    totalPrice: 0,
  },

  onShow() {
    if (app.globalData.token) this.loadCart();
  },

  async loadCart() {
    this.setData({ loading: true });
    try {
      const res = await getCartList();
      const items = (res.data || []).map(item => {
        const sku = item.product?.skus?.find(s => s.id === item.sku_id) || item.product?.skus?.[0];
        return {
          ...item,
          checked: true,
          imageUrl: item.product?.images?.[0]?.image_url || '/images/placeholder.png',
          productName: item.product?.name || '商品',
          specName: sku?.spec_name || '',
          price: sku?.price || 0,
          stock: sku?.stock || 0,
        };
      });
      this.setData({ cartItems: items });
      this.calcTotal();
    } catch {}
    finally { this.setData({ loading: false }); }
  },

  calcTotal() {
    const total = this.data.cartItems
      .filter(item => item.checked)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.setData({ totalPrice: total.toFixed(2) });
  },

  onCheck(e) {
    const index = e.currentTarget.dataset.index;
    const items = this.data.cartItems;
    items[index].checked = !items[index].checked;
    this.setData({ cartItems: items });
    this.calcTotal();
  },

  async onQuantityChange(e) {
    const { index, type } = e.currentTarget.dataset;
    const item = this.data.cartItems[index];
    let quantity = item.quantity + (type === 'add' ? 1 : -1);
    if (quantity < 1) quantity = 1;
    if (type === 'add' && item.stock && quantity > item.stock) {
      quantity = item.stock;
    }
    try {
      await updateCartItem(item.id, { quantity });
      const items = this.data.cartItems;
      items[index].quantity = quantity;
      this.setData({ cartItems: items });
      this.calcTotal();
    } catch {}
  },

  async onDelete(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.cartItems[index];
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该商品吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteCartItem(item.id);
            const items = this.data.cartItems;
            items.splice(index, 1);
            this.setData({ cartItems: items });
            this.calcTotal();
          } catch {}
        }
      },
    });
  },

  onBuyItem(e) {
    if (!app.checkLogin()) return;
    const index = e.currentTarget.dataset.index;
    const item = this.data.cartItems[index];
    if (item.price <= 0) {
      wx.showToast({ title: '该规格已售罄', icon: 'none' }); return;
    }
    wx.navigateTo({
      url: `/pages/order-confirm/order-confirm?productId=${item.product_id}&skuId=${item.sku_id}&productName=${encodeURIComponent(item.productName)}&specName=${encodeURIComponent(item.specName)}&price=${item.price}&quantity=${item.quantity}&cartId=${item.id}&stock=${item.stock}`,
    });
  },
});
