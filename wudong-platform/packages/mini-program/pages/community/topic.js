var BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { topic: {}, travelogues: [], loading: true },

  onLoad(options) { if (options.id) this.loadData(options.id); },

  async loadData(id) {
    try {
      var [tRes, tlogRes] = await Promise.all([
        new Promise(r => wx.request({ url: BASE + '/topics', success: r })),
        new Promise(r => wx.request({ url: BASE + '/travelogues?page=1&pageSize=50', success: r })),
      ]);
      var topics = (tRes.data && tRes.data.data) ? tRes.data.data : tRes.data;
      if (!Array.isArray(topics)) topics = [];
      var topic = topics.find(function(t) { return String(t.id) === String(id); });
      var all = (tlogRes.data && tlogRes.data.data && tlogRes.data.data.list) || [];
      var filtered = all.filter(function(t) { return String(t.topicId) === String(id); });
      this.setData({ topic: topic || {}, travelogues: filtered });
    } catch (e) { console.error(e); }
    this.setData({ loading: false });
  },

  goToDetail(e) { wx.navigateTo({ url: '/pages/community/detail?id=' + e.currentTarget.dataset.id }); },
});
