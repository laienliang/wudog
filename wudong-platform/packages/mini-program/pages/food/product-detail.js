const BASE = 'http://127.0.0.1:7001/api/v1';
const { cartStorage } = require('../../utils/api');

Page({
  data: { product: {}, reviews: [] },
  onLoad(options) {
    if (options.id) { this.setData({ productId: options.id }); this.loadData(options.id); }
  },
  async loadData(id) {
    try {
      const pRes = await new Promise(r => wx.request({ url: BASE + '/food-products/' + id, success: r }));
      const pData = pRes.data?.data || pRes.data || {};
      this.setData({ product: pData, reviews: [] });
    } catch (e) { wx.showToast({ title: '加载失败', icon: 'none' }); }
  },
  addToCart() {
    const p = this.data.product;
    if (!p.id) return;
    cartStorage.add({ productId: p.id, productType: 'food', name: p.name, price: p.price, image: p.mainImage, quantity: 1, unit: p.unit });
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },
});
