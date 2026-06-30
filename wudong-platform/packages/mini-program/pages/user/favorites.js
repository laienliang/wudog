const BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { products: [] },
  onShow() { this.loadFavorites(); },
  async loadFavorites() {
    const favIds = wx.getStorageSync('wudong_favorites') || [];
    if (favIds.length === 0) { this.setData({ products: [] }); return; }
    const uniqueIds = [...new Set(favIds)];
    const results = [];
    for (const id of uniqueIds) {
      try {
        const res = await new Promise(r => wx.request({ url: BASE + '/products/' + id, success: r }));
        const data = res.data?.data || res.data;
        if (data && data.id) results.push(data);
      } catch (e) { /* ignore */ }
    }
    this.setData({ products: results });
  },
  goToDetail(e) { wx.navigateTo({ url: '/pages/clothing/detail?id=' + e.currentTarget.dataset.id }); },
});
