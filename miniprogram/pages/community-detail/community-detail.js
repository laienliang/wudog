import { request } from '../../utils/request';

Page({
  data: {
    detail: null,
    loading: true,
    commentText: '',
    currentImage: 0,
    showReport: false,
    reportReason: '',
  },

  onLoad(options) {
    this.fetchDetail(options.id);
    wx.showShareMenu();
  },

  async fetchDetail(id) {
    this.setData({ loading: true });
    try {
      const res = await request(`/api/travel-note/detail/${id}`);
      this.setData({ detail: res.data, loading: false });
    } catch {
      this.setData({ detail: null, loading: false });
    }
  },

  onSwiperChange(e) {
    this.setData({ currentImage: e.detail.current });
  },

  async onLike() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    try {
      const res = await request('/api/like/toggle', 'POST', { target_type: 'note', target_id: this.data.detail.id });
      const d = this.data.detail;
      this.setData({
        detail: {
          ...d,
          liked: res.data.liked,
          like_count: d.like_count + (res.data.liked ? 1 : -1),
        },
      });
    } catch { /* */ }
  },

  async onFavorite() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    try {
      const res = await request('/api/favorite/toggle', 'POST', { note_id: this.data.detail.id });
      const d = this.data.detail;
      this.setData({
        detail: {
          ...d,
          favorited: res.data.favorited,
          favorite_count: d.favorite_count + (res.data.favorited ? 1 : -1),
        },
      });
    } catch { /* */ }
  },

  async onFollow() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    try {
      await request('/api/follow/toggle', 'POST', { followed_id: this.data.detail.user_id });
      const d = this.data.detail;
      this.setData({ detail: { ...d, followed: !d.followed } });
    } catch { /* */ }
  },

  toggleReport() {
    this.setData({ showReport: !this.data.showReport, reportReason: '' });
  },

  onReportInput(e) {
    this.setData({ reportReason: e.detail.value });
  },

  async onSubmitReport() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    const reason = this.data.reportReason.trim();
    if (!reason) { wx.showToast({ title: '请填写举报原因', icon: 'none' }); return; }
    try {
      await request('/api/report/create', 'POST', {
        target_type: 'note',
        target_id: this.data.detail.id,
        reason,
      });
      wx.showToast({ title: '举报已提交', icon: 'success' });
      this.setData({ showReport: false, reportReason: '' });
    } catch (e) {
      wx.showToast({ title: '举报失败，请重试', icon: 'none' });
    }
  },

  onCommentInput(e) {
    this.setData({ commentText: e.detail.value });
  },

  async onSubmitComment() {
    const { commentText, detail } = this.data;
    if (!commentText.trim()) return wx.showToast({ title: '请输入评论', icon: 'none' });
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    try {
      await request('/api/comment/create', 'POST', { note_id: detail.id, content: commentText });
      wx.showToast({ title: '评论成功' });
      this.setData({ commentText: '' });
      this.fetchDetail(detail.id);
    } catch { /* */ }
  },

  goUser() {
    wx.navigateTo({ url: `/pages/user/index?id=${this.data.detail.user_id}` });
  },

  goTopic() {
    wx.navigateTo({ url: `/pages/topic/topic?id=${this.data.detail.topic_id}` });
  },
});
