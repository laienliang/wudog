var BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { title: '', content: '', location: '', topics: [], selectedTopic: null, topicId: null, submitting: false },

  onLoad() { this.loadTopics(); },

  async loadTopics() {
    try {
      var res = await new Promise(r => wx.request({ url: BASE + '/topics', success: r }));
      var t = (res.data && res.data.data) ? res.data.data : res.data;
      if (!Array.isArray(t)) t = [];
      this.setData({ topics: t });
    } catch (e) { console.error(e); }
  },

  onTitleInput(e) { this.setData({ title: e.detail.value }); },
  onContentInput(e) { this.setData({ content: e.detail.value }); },
  onLocationInput(e) { this.setData({ location: e.detail.value }); },
  onTopicChange(e) {
    var idx = e.detail.value;
    var t = this.data.topics[idx];
    if (t) this.setData({ selectedTopic: t.name, topicId: t.id });
  },

  async submitPublish() {
    if (!this.data.title.trim()) { wx.showToast({ title: '请输入标题', icon: 'none' }); return; }
    if (!this.data.content.trim()) { wx.showToast({ title: '请输入内容', icon: 'none' }); return; }
    this.setData({ submitting: true });
    try {
      await new Promise((resolve, reject) => {
        wx.request({
          url: BASE + '/travelogues', method: 'POST',
          data: { userId: 1, title: this.data.title, content: this.data.content, location: this.data.location, topicId: this.data.topicId, status: 1, coverImage: 'http://localhost:3000/images/scenic/scenic-1.jpg' },
          success: resolve, fail: reject,
        });
      });
      wx.showToast({ title: '发布成功！', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (e) { wx.showToast({ title: '发布失败', icon: 'none' }); }
    this.setData({ submitting: false });
  },
});
