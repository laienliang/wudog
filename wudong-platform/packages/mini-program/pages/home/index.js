const { productApi } = require('../../utils/api');

Page({
  data: { products: [] },

  onShow() {
    this.loadProducts();
  },

  async loadProducts() {
    try {
      const res = await productApi.list({ page: 1, pageSize: 4 });
      this.setData({ products: res.list || [] });
    } catch (e) { console.error(e); }
  },

  goToPage(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url });
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/clothing/detail?id=' + id });
  },
});
