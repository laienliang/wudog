var BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { userName: '用户', travelogues: [], userId: 1 },

  onLoad(options) {
    var uid = options.id || 1;
    this.setData({ userId: uid });
    this.loadData(uid);
  },

  async loadData(uid) {
    try {
      var res = await new Promise(r => wx.request({ url: BASE + '/travelogues?page=1&pageSize=50', success: r }));
      var list = (res.data && res.data.data && res.data.data.list) || [];
      var mine = list.filter(function(t) { return String(t.userId) === String(uid); });
      var name = mine[0] ? mine[0].user_name : '用户';
      this.setData({ travelogues: mine, userName: name, userAvatar: name.charAt(0) });
    } catch (e) { console.error(e); }
  },

  goToDetail(e) { wx.navigateTo({ url: '/pages/community/detail?id=' + e.currentTarget.dataset.id }); },
});
