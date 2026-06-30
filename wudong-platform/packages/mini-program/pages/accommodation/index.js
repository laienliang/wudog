const BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { homestays: [], loading: true },

  onLoad() { this.loadData(); },
  onPullDownRefresh() { this.loadData().then(() => wx.stopPullDownRefresh()); },

  async loadData() {
    this.setData({ loading: true });
    try {
      const res = await new Promise(r => wx.request({ url: BASE + '/homestays?page=1&pageSize=50', success: r }));
      var list = (res.data && res.data.data && res.data.data.list) || [];
      for (var i = 0; i < list.length; i++) {
        list[i].displayFacilities = (list[i].facilities || []).slice(0, 3);
      }
      this.setData({ homestays: list });
    } catch (e) { console.error(e); wx.showToast({ title: '加载失败', icon: 'none' }); }
    this.setData({ loading: false });
  },

  goToDetail(e) {
    wx.navigateTo({ url: '/pages/accommodation/detail?id=' + e.currentTarget.dataset.id });
  },
});
