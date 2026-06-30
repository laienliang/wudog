var BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { travelogue: {}, comments: [], liked: false, favorited: false, commentText: '', replyTo: null },

  onLoad(options) { if (options.id) this.loadData(options.id); },

  async loadData(id) {
    try {
      var res = await new Promise(r => wx.request({ url: BASE + '/travelogues/' + id, success: r }));
      var d = (res.data && res.data.data) ? res.data.data : res.data;
      var comments = (d.comments || []).map(function(c) {
        c._date = c.createdAt ? String(c.createdAt).slice(0, 10) : '';
        c._avatar = (c.user_name || '匿').charAt(0);
        return c;
      });
      d._date = d.createdAt ? String(d.createdAt).slice(0, 10) : '';
      d._avatar = (d.user_name || '匿').charAt(0);
      this.setData({ travelogue: d, comments: comments });
    } catch (e) { console.error(e); wx.showToast({ title: '加载失败', icon: 'none' }); }
  },

  onCommentInput(e) { this.setData({ commentText: e.detail.value }); },

  toggleLike() {
    var liked = !this.data.liked;
    this.setData({ liked: liked });
    wx.request({ url: BASE + '/likes', method: 'POST', data: { userId: 1, targetType: 'travelogue', targetId: this.data.travelogue.id } });
  },

  toggleFavorite() {
    var f = !this.data.favorited;
    this.setData({ favorited: f });
    wx.request({ url: BASE + '/favorites', method: 'POST', data: { userId: 1, targetType: 'travelogue', targetId: this.data.travelogue.id } });
    wx.showToast({ title: f ? '已收藏' : '已取消收藏', icon: 'none' });
  },

  replyTo(e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    this.setData({ replyTo: { id: id, name: name }, commentText: '回复 @' + name + ': ' });
  },

  cancelReply() { this.setData({ replyTo: null, commentText: '' }); },

  async submitComment() {
    var text = this.data.commentText;
    if (!text.trim()) { wx.showToast({ title: '请输入评论', icon: 'none' }); return; }
    var id = this.data.travelogue.id;
    var data = { targetType: 'travelogue', targetId: id, content: text.trim(), userId: 1 };
    if (this.data.replyTo) { data.parentId = this.data.replyTo.id; }
    try {
      await new Promise((resolve, reject) => {
        wx.request({ url: BASE + '/comments', method: 'POST', data: data, success: resolve, fail: reject });
      });
      wx.showToast({ title: '评论已发表', icon: 'success' });
      this.setData({ commentText: '', replyTo: null });
      this.loadData(id);
    } catch (e) { wx.showToast({ title: '发表失败', icon: 'none' }); }
  },

  onShareAppMessage() {
    var t = this.data.travelogue;
    return { title: t.title || '乌东苗寨游记', imageUrl: t.coverImage || '' };
  },

  showReportDialog() {
    var that = this;
    wx.showActionSheet({
      itemList: ['内容不当', '广告垃圾', '侵权抄袭', '其他原因'],
      success: function(res) {
        var reasons = ['内容不当', '广告垃圾', '侵权抄袭', '其他原因'];
        wx.request({
          url: BASE + '/reports', method: 'POST',
          data: { userId: 1, targetType: 'travelogue', targetId: that.data.travelogue.id, reason: reasons[res.tapIndex] },
        });
        wx.showToast({ title: '举报已提交', icon: 'success' });
      },
    });
  },

  goToUser(e) {
    var uid = e.currentTarget.dataset.uid || 1;
    wx.navigateTo({ url: '/pages/user/profile?id=' + uid });
  },
});
