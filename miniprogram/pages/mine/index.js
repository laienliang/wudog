import { request } from '../../utils/request';

Page({
  data: {
    userId: null,
    username: '',
    tab: 'notes',
    statusFilter: '',
    notes: [],
    favorites: [],
    loading: true,
    stats: { noteCount: 0, publishedCount: 0 },
  },

  onLoad() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    const userId = wx.getStorageSync('userId');
    const username = wx.getStorageSync('username') || '用户';
    if (!userId) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    this.setData({ userId, username });
  },

  onShow() {
    if (this.data.userId) this.fetchData();
  },

  onPullDownRefresh() {
    this.fetchData().then(() => wx.stopPullDownRefresh());
  },

  async fetchData() {
    this.setData({ loading: true });
    try {
      const { userId, tab, statusFilter } = this.data;
      if (tab === 'notes') {
        const params = { page: 1, pageSize: 200, userId };
        if (statusFilter) params.status = statusFilter;
        const res = await request('/api/travel-note/list', 'GET', params);
        const notes = (res.data.list || []).map(n => {
          let statusLabel = n.status;
          if (n.status === 'draft') statusLabel = '草稿';
          else if (n.status === 'reviewing') statusLabel = '审核中';
          else if (n.status === 'published') statusLabel = '已发布';
          else if (n.status === 'rejected') statusLabel = '已驳回';
          return { ...n, statusLabel };
        });
        this.setData({
          notes,
          stats: {
            noteCount: notes.length,
            publishedCount: notes.filter(n => n.status === 'published').length,
          },
        });
      } else if (tab === 'favorites') {
        const res = await request('/api/favorite/list', 'GET', { page: 1, pageSize: 200 });
        this.setData({ favorites: res.data.list || [] });
      }
    } catch { /* */ } finally {
      this.setData({ loading: false });
    }
  },

  onTab(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ tab: key, statusFilter: '', notes: [], favorites: [] });
    this.fetchData();
  },

  onStatusFilter(e) {
    const { status } = e.currentTarget.dataset;
    this.setData({ statusFilter: status || '' });
    this.fetchData();
  },

  goEdit() {
    wx.navigateTo({ url: '/pages/publish/publish' });
  },

  goEditNote(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/publish/publish?id=${id}` });
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/community-detail/community-detail?id=${id}` });
  },

  async handleDelete(e) {
    const { id } = e.currentTarget.dataset;
    const res = await new Promise(r => wx.showModal({ title: '确认删除', content: '确定要删除这篇游记吗？', success: r }));
    if (!res.confirm) return;
    try {
      await request(`/api/travel-note/delete/${id}`, 'DELETE');
      const notes = this.data.notes.filter(n => n.id !== id);
      this.setData({ notes, stats: { ...this.data.stats, noteCount: notes.length } });
      wx.showToast({ title: '已删除', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: e.data?.message || '删除失败', icon: 'none' });
    }
  },

  async handleSubmit(e) {
    const { id } = e.currentTarget.dataset;
    try {
      await request(`/api/travel-note/submit-review/${id}`, 'POST');
      wx.showToast({ title: '已提交审核', icon: 'success' });
      this.fetchData();
    } catch (e) {
      wx.showToast({ title: e.data?.message || '提交失败', icon: 'none' });
    }
  },

  async handleUnfavorite(e) {
    const { id } = e.currentTarget.dataset;
    try {
      await request('/api/favorite/toggle', 'POST', { note_id: id });
      const favorites = this.data.favorites.filter(f => (f.note && f.note.id) !== id && f.noteId !== id);
      this.setData({ favorites });
      wx.showToast({ title: '已取消', icon: 'none' });
    } catch { /* */ }
  },

  goOrders(e) {
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({ url: path });
  },
});
