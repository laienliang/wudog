var BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { activeTab: 'latest', list: [], loading: true },

  onLoad() { this.loadData(); },
  onPullDownRefresh() { this.loadData().then(() => wx.stopPullDownRefresh()); },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
    this.loadData();
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      var res = await new Promise(r => wx.request({ url: BASE + '/travelogues?page=1&pageSize=50', success: r }));
      var list = (res.data && res.data.data && res.data.data.list) || [];
      list = list.map(function(item) { item._avatar = (item.user_name || '匿').charAt(0); return item; });
      if (this.data.activeTab === 'hot') list.sort(function(a, b) { return (b.likeCount || 0) - (a.likeCount || 0); });
      this.setData({ list: list });
    } catch (e) { console.error(e); }
    this.setData({ loading: false });
  },

  goToDetail(e) { wx.navigateTo({ url: '/pages/community/detail?id=' + e.currentTarget.dataset.id }); },
});
