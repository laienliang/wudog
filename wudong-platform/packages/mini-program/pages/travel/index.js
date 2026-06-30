var BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { activeTab: 'scenic', scenicSpots: [], routes: [], loadingScenic: true, loadingRoute: true },

  onLoad() { this.loadScenic(); this.loadRoutes(); },
  onPullDownRefresh() { this.loadScenic(); this.loadRoutes(); wx.stopPullDownRefresh(); },

  switchTab(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    if (tab === 'scenic' && this.data.scenicSpots.length === 0) this.loadScenic();
    if (tab === 'route' && this.data.routes.length === 0) this.loadRoutes();
  },

  async loadScenic() {
    this.setData({ loadingScenic: true });
    try {
      var res = await new Promise(r => wx.request({ url: BASE + '/scenic-spots?page=1&pageSize=50', success: r }));
      var list = (res.data && res.data.data && res.data.data.list) || [];
      this.setData({ scenicSpots: list });
    } catch (e) { console.error(e); }
    this.setData({ loadingScenic: false });
  },

  async loadRoutes() {
    this.setData({ loadingRoute: true });
    try {
      var res = await new Promise(r => wx.request({ url: BASE + '/routes?page=1&pageSize=50', success: r }));
      var list = (res.data && res.data.data && res.data.data.list) || [];
      this.setData({ routes: list });
    } catch (e) { console.error(e); }
    this.setData({ loadingRoute: false });
  },

  goToDetail(e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({ url: '/pages/travel/detail?id=' + id + '&type=' + type });
  },
});
