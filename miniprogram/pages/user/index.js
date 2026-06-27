import { request } from '../../utils/request';

Page({
  data: {
    user: null,
    notes: [],
    followed: false,
    loading: true,
  },

  onLoad(options) {
    const userId = Number(options.id);
    this.setData({ userId });
    this.fetchData();
  },

  async fetchData() {
    this.setData({ loading: true });
    try {
      const { userId } = this.data;
      const [followerRes, notesRes] = await Promise.all([
        request('/api/follow/list', 'GET', { userId, type: 'follower', page: 1, pageSize: 1 }),
        request('/api/travel-note/list', 'GET', { page: 1, pageSize: 50, status: 'published' }),
      ]);
      const userNotes = (notesRes.data.list || []).filter(n => n.user_id === userId);
      this.setData({
        user: {
          id: userId,
          nickname: `用户${userId}`,
          followerCount: followerRes.data.total,
          noteCount: userNotes.length,
        },
        notes: userNotes,
      });
    } catch { /* */ } finally {
      this.setData({ loading: false });
    }
  },

  async onFollow() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    try {
      await request('/api/follow/toggle', 'POST', { followed_id: this.data.userId });
      const u = this.data.user;
      this.setData({
        followed: !this.data.followed,
        user: { ...u, followerCount: u.followerCount + (this.data.followed ? -1 : 1) },
      });
    } catch { /* */ }
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/community-detail/community-detail?id=${id}` });
  },

  goFollows(e) {
    const { type } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/follows/follows?userId=${this.data.userId}&tab=${type}` });
  },
});
