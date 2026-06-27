import { request } from '../../utils/request';

Page({
  data: {
    product: null,
    loading: true,
    quantity: 1,
    reviews: [],
  },

  onLoad(options) {
    this.fetchDetail(options.id);
  },

  async fetchDetail(id) {
    this.setData({ loading: true });
    try {
      const res = await request(`/api/farm-product/detail/${id}`);
      this.setData({ product: res.data, loading: false });
      this.fetchReviews(id);
    } catch { this.setData({ product: null, loading: false }); }
  },

  async fetchReviews(id) {
    try {
      const res = await request('/api/restaurant-review/list', 'GET', { target_type: 'farm_product', target_id: id, pageSize: 10 });
      this.setData({ reviews: res.data.list || [] });
    } catch { /* */ }
  },

  onQtyMinus() {
    if (this.data.quantity > 1) this.setData({ quantity: this.data.quantity - 1 });
  },

  onQtyPlus() {
    this.setData({ quantity: this.data.quantity + 1 });
  },

  async addToCart() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    try {
      await request('/public/cart/add', 'POST', {
        product_id: this.data.product.id,
        quantity: this.data.quantity,
        source_module: 'module2',
      });
      wx.showToast({ title: '已加入购物车', icon: 'success' });
    } catch { wx.showToast({ title: '操作失败', icon: 'none' }); }
  },

  async buyNow() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    try {
      await request('/public/cart/add', 'POST', {
        product_id: this.data.product.id,
        quantity: this.data.quantity,
        source_module: 'module2',
      });
      wx.navigateTo({ url: '/pages/cart/cart' });
    } catch { wx.showToast({ title: '操作失败', icon: 'none' }); }
  },
});
