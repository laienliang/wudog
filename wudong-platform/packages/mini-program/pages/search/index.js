var BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { keyword: '', results: [], total: 0, loading: false, searched: false },

  onSearchInput(e) { this.setData({ keyword: e.detail.value }); },

  async onSearch() {
    var kw = this.data.keyword.trim();
    if (!kw) { wx.showToast({ title: '请输入搜索关键词', icon: 'none' }); return; }
    this.setData({ loading: true, searched: true });
    try {
      var res = await new Promise(r => wx.request({ url: BASE + '/travelogues?page=1&pageSize=50&keyword=' + encodeURIComponent(kw), success: r }));
      var list = (res.data && res.data.data && res.data.data.list) || [];
      list = list.map(function(item) { item._avatar = (item.user_name || '匿').charAt(0); return item; });
      this.setData({ results: list, total: list.length });
    } catch (e) { console.error(e); }
    this.setData({ loading: false });
  },

  goToDetail(e) { wx.navigateTo({ url: '/pages/community/detail?id=' + e.currentTarget.dataset.id }); },
});
