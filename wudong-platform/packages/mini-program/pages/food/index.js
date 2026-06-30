const BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { restaurants: [], products: [] },
  onShow() { this.loadData(); },
  async loadData() {
    try {
      const [rRes, pRes] = await Promise.all([
        new Promise(r => wx.request({ url: BASE + '/restaurants', success: r })),
        new Promise(r => wx.request({ url: BASE + '/food-products', success: r })),
      ]);
      this.setData({
        restaurants: (rRes.data?.data?.list || []),
        products: (pRes.data?.data?.list || []),
      });
    } catch (e) { console.error(e); }
  },
  goToDetail(e) { wx.navigateTo({ url: '/pages/food/detail?id=' + e.currentTarget.dataset.id }); },
  goToProduct(e) { wx.navigateTo({ url: '/pages/food/product-detail?id=' + e.currentTarget.dataset.id }); },
});
