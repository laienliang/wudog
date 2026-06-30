const BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { restaurant: {}, slots: [], dishes: [], id: null },
  onLoad(options) {
    if (options.id) { this.setData({ id: options.id }); this.loadData(options.id); }
  },
  async loadData(id) {
    try {
      const [rRes, sRes, dRes] = await Promise.all([
        new Promise(r => wx.request({ url: BASE + '/restaurants/' + id, success: r })),
        new Promise(r => wx.request({ url: BASE + '/restaurants/' + id + '/slots', success: r })),
        new Promise(r => wx.request({ url: BASE + '/restaurants/' + id + '/dishes', success: r })),
      ]);
      this.setData({
        restaurant: rRes.data?.data || rRes.data || {},
        slots: sRes.data?.data || sRes.data || [],
        dishes: dRes.data?.data || dRes.data || [],
      });
    } catch (e) { wx.showToast({ title: '加载失败', icon: 'none' }); }
  },
  goToBooking() {
    wx.navigateTo({ url: '/pages/food/booking?id=' + this.data.id });
  },
});
