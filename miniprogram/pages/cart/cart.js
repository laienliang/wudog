import { request, getImageUrl } from '../../utils/request';

Page({
  data: {
    items: [],
    loading: true,
    totalPrice: 0,
  },

  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    this.fetchCart();
  },

  async fetchCart() {
    this.setData({ loading: true });
    try {
      const res = await request('/public/cart/list', 'GET', {});
      const items = (res.data || []).map(item => ({
        ...item,
        product_image: getImageUrl(item.product_image),
        subtotal: ((Number(item.price) || 0) * item.quantity).toFixed(2),
      }));
      this.setData({ items, loading: false });
      this.calcTotal();
    } catch { this.setData({ loading: false }); }
  },

  async updateQty(e) {
    const { id, qty } = e.currentTarget.dataset;
    if (qty < 1) { wx.showToast({ title: '数量不能少于1', icon: 'none' }); return; }
    try {
      await request(`/public/cart/update/${id}`, 'PUT', { quantity: qty });
      this.fetchCart();
    } catch { /* */ }
  },

  async removeItem(e) {
    const { id } = e.currentTarget.dataset;
    try {
      await request(`/public/cart/delete/${id}`, 'DELETE');
      this.fetchCart();
    } catch { /* */ }
  },

  calcTotal() {
    let total = 0;
    this.data.items.forEach(i => {
      total += (Number(i.price) || 0) * i.quantity;
    });
    this.setData({ totalPrice: total.toFixed(2) });
  },

  goCheckout() {
    if (this.data.items.length === 0) return;
    wx.showToast({ title: '请在网页端下单', icon: 'none' });
  },
});
